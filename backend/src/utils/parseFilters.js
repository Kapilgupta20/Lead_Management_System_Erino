/**
 * Builds Mongo query from request query params (AND semantics).
 * Supported operators (query param naming shown):
 *  String fields: field_eq=, field_contains=
 *  Enums: field_eq=, field_in=a,b
 *  Numbers: field_eq=, field_gt=, field_lt=, field_between=low,high
 *  Dates: field_on=YYYY-MM-DD or ISO, field_before=, field_after=, field_between=iso1,iso2
 *  Boolean: is_qualified_eq=true|false
 *
 * Always requires ownerid(userId) to scope results (req.userId).
 */

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== '') return undefined;
  const v = String(val).toLowerCase();
  if (v === 'true') return true;
  if (v === 'false') return false;
  return undefined;
};

const parseFilters = (queryParams, userId) => {

  if (!userId) throw new Error('userId required');

  const q = { userId: userId };

  const get = (k) => (Object.prototype.hasOwnProperty.call(queryParams, k) ? queryParams[k] : undefined);

  // String fields
  ['email','company','city','first_name','last_name','phone','state'].forEach(field => {
    const eq = get(`${field}_eq`);
    const contains = get(`${field}_contains`);
    if (eq !== undefined) q[field] = eq;
    else if (contains !== undefined) q[field] = { $regex: contains, $options: 'i' };
  });

  // Enums
  ['source','status'].forEach(field => {
    const eq = get(`${field}_eq`);
    const incl = get(`${field}_in`);
    if (eq !== undefined) q[field] = eq;
    else if (incl !== undefined) {
      const arr = String(incl).split(',').map(s => s.trim()).filter(Boolean);
      if (arr.length) q[field] = { $in: arr };
    }
  });

  // Numbers
  ['score','lead_value'].forEach(field => {
    const eq = get(`${field}_eq`);
    const gt = get(`${field}_gt`);
    const lt = get(`${field}_lt`);
    const between = get(`${field}_between`);
    if (eq !== undefined) q[field] = Number(eq);
    else {
      const range = {};
      if (gt !== undefined && !Number.isNaN(Number(gt))) range.$gt = Number(gt);
      if (lt !== undefined && !Number.isNaN(Number(lt))) range.$lt = Number(lt);
      if (between !== undefined) {
        const parts = String(between).split(',').map(p => p.trim());
        const a = Number(parts[0]);
        const b = Number(parts[1]);
        if (!Number.isNaN(a) && !Number.isNaN(b)) {
          range.$gte = Math.min(a, b);
          range.$lte = Math.max(a, b);
        }
      }
      if (Object.keys(range).length) q[field] = range;
    }
  });

  // Dates
  ['created_at','last_activity_at'].forEach(field => {
    const on = get(`${field}_on`);
    const before = get(`${field}_before`);
    const after = get(`${field}_after`);
    const between = get(`${field}_between`);
    if (on !== undefined) {
      const start = new Date(on);
      const end = new Date(on);
      if (/^\d{4}-\d{2}-\d{2}$/.test(String(on))) {
        start.setUTCHours(0,0,0,0);
        end.setUTCHours(23,59,59,999);
      }
      q[field] = { $gte: start, $lte: end };
    } else {
      const range = {};
      if (after !== undefined) range.$gt = new Date(after);
      if (before !== undefined) range.$lt = new Date(before);
      if (between !== undefined) {
        const parts = String(between).split(',').map(p => p.trim());
        const a = new Date(parts[0]);
        const b = new Date(parts[1]);
        range.$gte = a < b ? a : b;
        range.$lte = a < b ? b : a;
      }
      if (Object.keys(range).length) q[field] = range;
    }
  });

  // Boolean
  const isQualified = get('is_qualified_eq');
  if (isQualified !== undefined) {
    const parsed = parseBoolean(isQualified);
    if (parsed !== undefined) q.is_qualified = parsed;
  }

  return q;
};

module.exports = { parseFilters };
