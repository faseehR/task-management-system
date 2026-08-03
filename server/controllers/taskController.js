const mongoose = require('mongoose');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];

// Returns a UTC midnight Date for the given input, independent of the
// server's local timezone. Comparing dates via `date.setHours(0,0,0,0)`
// uses the SERVER's local timezone offset, which previously caused a bug:
// a due date submitted as "today" could get shifted a calendar day backward
// (or forward) purely based on what timezone the Node process happens to be
// running in, incorrectly failing the "cannot be in the past" check. Using
// Date.UTC-based comparisons everywhere removes that dependency entirely.
const startOfDayUTC = (d) => {
  const date = new Date(d);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateTaskFields = ({ title, priority, status, dueDate }, { requireTitle = true, requireDueDate = true } = {}) => {
  if (requireTitle && (!title || !title.trim())) return 'Title is required';
  if (priority !== undefined && !PRIORITIES.includes(priority)) return 'Invalid priority value';
  if (status !== undefined && !STATUSES.includes(status)) return 'Invalid status value';
  if (requireDueDate) {
    if (!dueDate) return 'Due date is required';
    if (startOfDayUTC(dueDate) < startOfDayUTC(new Date())) return 'Due date cannot be in the past';
  } else if (dueDate) {
    if (startOfDayUTC(dueDate) < startOfDayUTC(new Date())) return 'Due date cannot be in the past';
  }
  return null;
};

// POST /api/tasks
const createTask = asyncHandler(async (req, res, next) => {
  const { title, description, priority, status, dueDate } = req.body;

  const validationError = validateTaskFields({ title, priority, status, dueDate });
  if (validationError) return next(new ApiError(400, validationError));

  const task = await Task.create({
    title: title.trim(),
    description: description || '',
    priority: priority || 'Medium',
    status: status || 'Pending',
    dueDate,
    userId: req.userId,
  });

  res.status(201).json({ success: true, message: 'Task created successfully', data: task });
});

// GET /api/tasks?search=&status=&priority=&sort=&page=&limit=&due=today|later
const getTasks = asyncHandler(async (req, res, next) => {
  const { search, status, priority, sort, due } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

  const filter = { userId: new mongoose.Types.ObjectId(req.userId), isDeleted: false };

  if (search && search.trim()) {
    filter.title = { $regex: search.trim(), $options: 'i' };
  }

  if (status && status !== 'All') {
    if (!STATUSES.includes(status)) return next(new ApiError(400, 'Invalid status filter'));
    filter.status = status;
  }

  if (priority && priority !== 'All') {
    if (!PRIORITIES.includes(priority)) return next(new ApiError(400, 'Invalid priority filter'));
    filter.priority = priority;
  }

  // Optional grouping by due date: "today" or "later" (anything after today)
  if (due === 'today' || due === 'later') {
    const todayStart = startOfDayUTC(new Date());
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

    if (due === 'today') {
      filter.dueDate = { $gte: todayStart, $lt: tomorrowStart };
    } else {
      filter.dueDate = { $gte: tomorrowStart };
    }
  } else if (due !== undefined) {
    return next(new ApiError(400, 'Invalid due filter. Use "today" or "later".'));
  }

  // Determine sort field/direction. Prefix with "-" for descending, e.g. -dueDate
  let sortField = sort || 'dueDate';
  let sortDir = 1;
  if (sortField.startsWith('-')) {
    sortDir = -1;
    sortField = sortField.slice(1);
  }
  const allowedSortFields = ['dueDate', 'createdAt', 'priority'];
  if (!allowedSortFields.includes(sortField)) {
    return next(new ApiError(400, 'Invalid sort field'));
  }

  const skip = (page - 1) * limit;
  const total = await Task.countDocuments(filter);
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  let tasks;
  if (sortField === 'priority') {
    // Sort by logical priority order (Low < Medium < High) rather than alphabetically
    tasks = await Task.aggregate([
      { $match: filter },
      {
        $addFields: {
          priorityWeight: {
            $switch: {
              branches: [
                { case: { $eq: ['$priority', 'Low'] }, then: 1 },
                { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                { case: { $eq: ['$priority', 'High'] }, then: 3 },
              ],
              default: 0,
            },
          },
        },
      },
      { $sort: { priorityWeight: sortDir } },
      { $skip: skip },
      { $limit: limit },
    ]);
  } else {
    tasks = await Task.find(filter)
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limit);
  }

  res.status(200).json({
    success: true,
    data: tasks,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      limit,
    },
  });
});

// GET /api/tasks/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);
  const baseFilter = { userId, isDeleted: false };

  const todayStart = startOfDayUTC(new Date());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

  const [total, pending, inProgress, completed, dueToday, dueTodayUrgent] = await Promise.all([
    Task.countDocuments(baseFilter),
    Task.countDocuments({ ...baseFilter, status: 'Pending' }),
    Task.countDocuments({ ...baseFilter, status: 'In Progress' }),
    Task.countDocuments({ ...baseFilter, status: 'Completed' }),
    Task.countDocuments({ ...baseFilter, dueDate: { $gte: todayStart, $lt: tomorrowStart } }),
    // Excludes Completed tasks — this is what drives the sidebar's urgency indicator,
    // since a completed task due today is no longer "urgent".
    Task.countDocuments({
      ...baseFilter,
      dueDate: { $gte: todayStart, $lt: tomorrowStart },
      status: { $in: ['Pending', 'In Progress'] },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: { total, pending, inProgress, completed, dueToday, dueTodayUrgent },
  });
});

// GET /api/tasks/:id
const getTaskById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return next(new ApiError(400, 'Invalid task ID'));

  const task = await Task.findOne({ _id: id, userId: req.userId, isDeleted: false });
  if (!task) return next(new ApiError(404, 'Task not found'));

  res.status(200).json({ success: true, data: task });
});

// PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return next(new ApiError(400, 'Invalid task ID'));

  const task = await Task.findOne({ _id: id, userId: req.userId, isDeleted: false });
  if (!task) return next(new ApiError(404, 'Task not found'));

  const wasCompleted = task.status === 'Completed';

  if (wasCompleted) {
    // Completed tasks cannot be edited except to change status back
    const { status } = req.body;
    if (status === undefined) {
      return next(new ApiError(400, 'Completed tasks can only have their status changed'));
    }
    if (!STATUSES.includes(status)) return next(new ApiError(400, 'Invalid status value'));
    task.status = status;
  } else {
    const { title, description, priority, status, dueDate } = req.body;
    const validationError = validateTaskFields(
      { title, priority, status, dueDate },
      { requireTitle: title !== undefined, requireDueDate: dueDate !== undefined }
    );
    if (validationError) return next(new ApiError(400, validationError));

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
  }

  await task.save();

  res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
});

// DELETE /api/tasks/:id  (soft delete)
const deleteTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return next(new ApiError(400, 'Invalid task ID'));

  const task = await Task.findOne({ _id: id, userId: req.userId, isDeleted: false });
  if (!task) return next(new ApiError(404, 'Task not found'));

  task.isDeleted = true;
  task.deletedAt = new Date();
  await task.save();

  res.status(200).json({ success: true, message: 'Task deleted successfully' });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats,
};
