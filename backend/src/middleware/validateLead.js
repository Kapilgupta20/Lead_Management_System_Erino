/**
 * Custom validation middleware (no Joi).
 * Exports two middlewares:
 * - validateCreateLead: validates POST /leads payload (email required)
 * - validateUpdateLead: validates PUT /leads/:id payload (at least 1 field)
 *
 * Validation rules:
 * - email: simple regex and required on create
 * - source: must be in SOURCE_ENUM
 * - status: must be in STATUS_ENUM
 * - score: integer 0..100
 * - lead_value: number
 * - last_activity_at: valid date string or null
 * - is_qualified: boolean
 */

const { SOURCE_ENUM, STATUS_ENUM } = require('../models/Lead');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function _isValidEmail(v) {
  return typeof v === 'string' && emailRegex.test(v);
}
function _isValidString(v) {
  return typeof v === 'string';
}
function _isValidNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}
function _isValidInteger(v) {
  return Number.isInteger(v);
}
function _isValidDate(v) {
  if (v === null) return true;
  const d = new Date(v);
  return !Number.isNaN(d.getTime());
}
function _isBoolean(v) {
  return typeof v === 'boolean';
}
function _toBooleanIfString(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    if (v.toLowerCase() === 'true') return true;
    if (v.toLowerCase() === 'false') return false;
  }
  return undefined;
}

const createAllowedFields = new Set([
  'first_name','last_name','email','phone','company','city','state',
  'source','status','score','lead_value','last_activity_at','is_qualified'
]);

const updateAllowedFields = createAllowedFields;

function validateCreateLead(req, res, next) {
  const body = req.body || {};
  const errors = [];

  // required: email
  if (!('email' in body) || body.email === undefined || body.email === null || String(body.email).trim() === '') {
    errors.push('email is required');
  } else if (!_isValidEmail(body.email)) {
    errors.push('email must be a valid email address');
  }

  // source
  if (body.source !== undefined && body.source !== null && !SOURCE_ENUM.includes(body.source)) {
    errors.push(`source must be one of ${SOURCE_ENUM.join(', ')}`);
  }

  // status
  if (body.status !== undefined && body.status !== null && !STATUS_ENUM.includes(body.status)) {
    errors.push(`status must be one of ${STATUS_ENUM.join(', ')}`);
  }

  // score
  if (body.score !== undefined && body.score !== null) {
    const n = Number(body.score);
    if (!Number.isInteger(n) || n < 0 || n > 100) {
      errors.push('score must be integer between 0 and 100');
    } else {
      body.score = n;
    }
  }

  // lead_value
  if (body.lead_value !== undefined && body.lead_value !== null) {
    const v = Number(body.lead_value);
    if (Number.isNaN(v)) errors.push('lead_value must be a number');
    else body.lead_value = v;
  }

  // last_activity_at
  if (body.last_activity_at !== undefined) {
    if (body.last_activity_at === null) {
      // allowed
    } else if (!_isValidDate(body.last_activity_at)) {
      errors.push('last_activity_at must be a valid date or null');
    } else {
      body.last_activity_at = new Date(body.last_activity_at);
    }
  }

  // is_qualified
  if (body.is_qualified !== undefined) {
    const b = _toBooleanIfString(body.is_qualified);
    if (b === undefined) errors.push('is_qualified must be boolean');
    else body.is_qualified = b;
  }

  // sanitize unknown fields (strip unknown)
  Object.keys(body).forEach(k => {
    if (!createAllowedFields.has(k)) delete body[k];
  });

  if (errors.length) return res.status(400).json({ error: 'Validation error', details: errors });

  // assign normalized values back
  req.body = body;
  return next();
}

function validateUpdateLead(req, res, next) {
  const body = req.body || {};
  const errors = [];

  // require at least one allowed field
  const keys = Object.keys(body).filter(k => updateAllowedFields.has(k));
  if (keys.length === 0) {
    return res.status(400).json({ error: 'Validation error', details: ['At least one updatable field is required'] });
  }

  // Validate each provided field
  if ('email' in body) {
    if (!_isValidEmail(body.email)) errors.push('email must be a valid email address');
  }

  if ('source' in body && !SOURCE_ENUM.includes(body.source)) {
    errors.push(`source must be one of ${SOURCE_ENUM.join(', ')}`);
  }

  if ('status' in body && !STATUS_ENUM.includes(body.status)) {
    errors.push(`status must be one of ${STATUS_ENUM.join(', ')}`);
  }

  if ('score' in body) {
    const n = Number(body.score);
    if (!Number.isInteger(n) || n < 0 || n > 100) errors.push('score must be integer between 0 and 100');
    else body.score = n;
  }

  if ('lead_value' in body) {
    const v = Number(body.lead_value);
    if (Number.isNaN(v)) errors.push('lead_value must be a number');
    else body.lead_value = v;
  }

  if ('last_activity_at' in body) {
    if (body.last_activity_at === null) {
      // ok
    } else if (!_isValidDate(body.last_activity_at)) {
      errors.push('last_activity_at must be a valid date or null');
    } else {
      body.last_activity_at = new Date(body.last_activity_at);
    }
  }

  if ('is_qualified' in body) {
    const b = _toBooleanIfString(body.is_qualified);
    if (b === undefined) errors.push('is_qualified must be boolean');
    else body.is_qualified = b;
  }

  // Remove unknown fields
  Object.keys(body).forEach(k => {
    if (!updateAllowedFields.has(k)) delete body[k];
  });

  if (errors.length) return res.status(400).json({ error: 'Validation error', details: errors });

  req.body = body;
  return next();
}

module.exports = { validateCreateLead, validateUpdateLead };
