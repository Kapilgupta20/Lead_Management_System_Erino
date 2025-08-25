import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
ModuleRegistry.registerModules([AllCommunityModule]);

import LeadForm from './LeadForm';
import FilterPanel from './FilterPanel';
import { getLeads, createLead, updateLead, deleteLead } from '../utils/leadapi';

const LeadDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });
  const [filters, setFilters] = useState({});

  const [columnDefs] = useState([
    { field: 'id', headerName: 'ID', filter: true, width: 80 },
    { field: 'first_name', headerName: 'First Name', filter: true },
    { field: 'last_name', headerName: 'Last Name', filter: true },
    { field: 'email', headerName: 'Email', filter: true },
    { field: 'phone', headerName: 'Phone', filter: true },
    { field: 'company', headerName: 'Company', filter: true },
    { field: 'city', headerName: 'City', filter: true },
    { field: 'state', headerName: 'State', filter: true },
    {
      field: 'source', headerName: 'Source', filter: true, valueFormatter: params => {
        const map = {
          website: 'Website',
          facebook_ads: 'Facebook Ads',
          google_ads: 'Google Ads',
          referral: 'Referral',
          events: 'Events',
          other: 'Other',
        };
        return map[params.value] || params.value;
      }
    },
    {
      field: 'status', headerName: 'Status', filter: true, valueFormatter: params => {
        const map = {
          new: 'New',
          contacted: 'Contacted',
          qualified: 'Qualified',
          lost: 'Lost',
          won: 'Won',
        };
        return map[params.value] || params.value;
      }
    },
    { field: 'score', headerName: 'Score', filter: true, width: 100 },
    { field: 'lead_value', headerName: 'Lead Value', filter: true, valueFormatter: params => params.value != null ? `$${params.value}` : '' },
    { field: 'last_activity_at', headerName: 'Last Activity', filter: true, valueFormatter: params => params.value ? new Date(params.value).toLocaleString() : '' },
    { field: 'is_qualified', headerName: 'Qualified?', filter: true, valueFormatter: params => params.value ? 'Yes' : 'No' },
    {
      headerName: 'Actions',
      cellRenderer: (params) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(params.data)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(params.data.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getLeads({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      setLeads(response.data);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleCreate = () => {
    setEditingLead(null);
    setShowForm(true);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(id);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingLead) {
        await updateLead(editingLead.id, formData);
      } else {
        await createLead(formData);
      }
      setShowForm(false);
      fetchLeads();
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
      } else {
        console.error("Error saving lead:", error.message);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border rounded-md shadow-sm"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
            >
              <Plus size={18} className="mr-2" />
              New Lead
            </button>
          </div>
        </div>

        {showFilters && (
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
          <AgGridReact
            rowData={leads}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={pagination.limit}
            suppressPaginationPanel={true}
            loading={loading}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
          <span className="text-sm text-gray-600 mb-2 sm:mb-0">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">{pagination.total}</span> leads
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-600 
                 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-600 
                 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>


        {showForm && (
          <LeadForm
            lead={editingLead}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default LeadDashboard;