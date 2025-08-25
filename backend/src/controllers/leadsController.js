const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const { parseFilters } = require('../utils/parseFilters');

const createLead = async (req, res, next) => {
  try {
    const userId = req.userId;
    const payload = { ...req.body, userId };
    const lead = await Lead.create(payload);
    return res.status(201).json(lead.toJSON());
    
  } catch (err) {
    // duplicate key (unique email per lead)
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A lead with this email already exists' });
    }
    return next(err);
  }
};


const listLeads = async (req, res, next) => {
  try {
    const userId = req.userId;
    const filters = parseFilters(req.query, userId);

    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    let limit = Math.max(1, parseInt(req.query.limit || '20', 10));
    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;

    let sort = { created_at: -1 };
    if (req.query.sort) {
      const [field, dir] = req.query.sort.split(':');
      sort = {};
      sort[field] = dir === 'asc' ? 1 : -1;
    }

    const [total, docs] = await Promise.all([
      Lead.countDocuments(filters),
      Lead.find(filters).sort(sort).skip(skip).limit(limit).lean()
    ]);

    const totalPages = Math.ceil(total / limit);

    const data = docs.map(d => {
      const { _id, __v, userId: ue, ...rest } = d;
      return { id: _id.toString(), ...rest };
    });

    return res.json({ data, page, limit, total, totalPages });
  } catch (err) {
    return next(err);
  }
};

const getLead = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid lead id' });

    const lead = await Lead.findOne({ _id: id, userId }).lean();
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const { _id, __v, userId: ue, ...rest } = lead;
    return res.json({ id: _id.toString(), ...rest });
  } catch (err) {
    return next(err);
  }
};


const updateLead = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid lead id' });

    const lead = await Lead.findOne({ _id: id, userId });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    Object.keys(updates).forEach(k => (lead[k] = updates[k]));
    await lead.save();
    return res.json(lead.toJSON());
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A lead with this email already exists for this user' });
    }
    return next(err);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid lead id' });

    const result = await Lead.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Lead not found' });

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createLead,
  listLeads,
  getLead,
  updateLead,
  deleteLead,
};
