import React from 'react';
import { X } from 'lucide-react';

const stringOps = [
  { label: 'Equals', value: 'eq' },
  { label: 'Contains', value: 'contains' },
];
const enumOps = [
  { label: 'Equals', value: 'eq' },
  { label: 'In', value: 'in' },
];
const numberOps = [
  { label: 'Equals', value: 'eq' },
  { label: 'Greater than', value: 'gt' },
  { label: 'Less than', value: 'lt' },
  { label: 'Between', value: 'between' },
];
const dateOps = [
  { label: 'On', value: 'on' },
  { label: 'Before', value: 'before' },
  { label: 'After', value: 'after' },
  { label: 'Between', value: 'between' },
];
const boolOps = [
  { label: 'Equals', value: 'eq' },
];

const statusOptions = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Lost', value: 'lost' },
  { label: 'Won', value: 'won' },
];
const sourceOptions = [
  { label: 'Website', value: 'website' },
  { label: 'Referral', value: 'referral' },
  { label: 'Ads', value: 'ads' },
  { label: 'Other', value: 'other' },
];


const FilterPanel = ({ filters, onFilterChange, onClose }) => {
  const handleFieldChange = (field, key, value) => {
    const newFilters = {
      ...filters,
      [field]: {
        ...filters[field],
        [key]: value
      }
    };
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button onClick={onClose} className="text-gray-500">
          <X size={20} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {["email", "company", "city"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
            <div className="flex gap-2 mt-1">
              <select
                value={filters[field]?.op || 'eq'}
                onChange={e => handleFieldChange(field, 'op', e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                {stringOps.map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={filters[field]?.value || ''}
                onChange={e => handleFieldChange(field, 'value', e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        ))}
        {[{ field: 'status', options: statusOptions }, { field: 'source', options: sourceOptions }].map(({ field, options }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
            <div className="flex gap-2 mt-1">
              <select
                value={filters[field]?.op || 'eq'}
                onChange={e => handleFieldChange(field, 'op', e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                {enumOps.map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
              {filters[field]?.op === 'in' ? (
                <select
                  multiple
                  value={filters[field]?.value || []}
                  onChange={e => {
                    const selected = Array.from(e.target.selectedOptions, o => o.value);
                    handleFieldChange(field, 'value', selected);
                  }}
                  className="block w-full border border-gray-300 rounded-md p-2"
                >
                  {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <select
                  value={filters[field]?.value || ''}
                  onChange={e => handleFieldChange(field, 'value', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">All</option>
                  {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        ))}
        {["score", "lead_value"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace('_', ' ')}</label>
            <div className="flex gap-2 mt-1">
              <select
                value={filters[field]?.op || 'eq'}
                onChange={e => handleFieldChange(field, 'op', e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                {numberOps.map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
              {filters[field]?.op === 'between' ? (
                <>
                  <input
                    type="number"
                    value={filters[field]?.value || ''}
                    onChange={e => handleFieldChange(field, 'value', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters[field]?.value2 || ''}
                    onChange={e => handleFieldChange(field, 'value2', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Max"
                  />
                </>
              ) : (
                <input
                  type="number"
                  value={filters[field]?.value || ''}
                  onChange={e => handleFieldChange(field, 'value', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              )}
            </div>
          </div>
        ))}
        {["created_at", "last_activity_at"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace('_', ' ')}</label>
            <div className="flex gap-2 mt-1">
              <select
                value={filters[field]?.op || 'on'}
                onChange={e => handleFieldChange(field, 'op', e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                {dateOps.map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
              {filters[field]?.op === 'between' ? (
                <>
                  <input
                    type="date"
                    value={filters[field]?.value || ''}
                    onChange={e => handleFieldChange(field, 'value', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="date"
                    value={filters[field]?.value2 || ''}
                    onChange={e => handleFieldChange(field, 'value2', e.target.value)}
                    className="block w-full border border-gray-300 rounded-md p-2"
                  />
                </>
              ) : (
                <input
                  type="date"
                  value={filters[field]?.value || ''}
                  onChange={e => handleFieldChange(field, 'value', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              )}
            </div>
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700">Is Qualified</label>
          <div className="flex gap-2 mt-1">
            <select
              value={filters.is_qualified?.op || 'eq'}
              onChange={e => handleFieldChange('is_qualified', 'op', e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              {boolOps.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            <select
              value={filters.is_qualified?.value || ''}
              onChange={e => handleFieldChange('is_qualified', 'value', e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">All</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;