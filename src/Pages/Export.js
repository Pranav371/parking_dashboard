import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconPlus, IconDownload } from '@tabler/icons-react';

const Export = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const [exportTab, setExportTab] = useState('Full Database');
  const [fileFormat, setFileFormat] = useState('.xlsx');
  const [fileName, setFileName] = useState('export');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtering states
  const [filterOptions, setFilterOptions] = useState({});

  const fetchRecordCount = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/data', {
        params: {
          ...convertFiltersToParams(filterOptions),
          page: 1,
          page_size: 10
        }
      });
  
      setRecordCount(response.data.total_records || 0);
    } catch (error) {
      console.error('Error fetching record count:', error);
      setError('Failed to fetch record count');
      setRecordCount(0);
    } finally {
      setIsLoading(false);
    }
  };
  // Convert filter options to API params
  // Update convertFiltersToParams function
const convertFiltersToParams = (filters) => {
  const params = {};
  
  if (filters.startDate) params.start_date = filters.startDate;
  if (filters.endDate) params.end_date = filters.endDate;
  if (filters.categories) params.categories = filters.categories.join(',');
  if (filters.colors) params.colors = filters.colors.join(',');
  if (filters.gates) params.gates = filters.gates.join(',');
  if (filters.licensePrefix) params.license_prefix = filters.licensePrefix;

  return params;
};

  // Trigger record count fetch when filters change
  useEffect(() => {
    fetchRecordCount();
  }, [filterOptions, exportTab]);

  // Export handler
  // Update the handleExport function
const handleExport = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await axios.get('http://localhost:8000/export', {
      params: {
        ...convertFiltersToParams(filterOptions),
        file_format: fileFormat.replace('.', '')
      },
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { 
      type: fileFormat === '.csv' 
        ? 'text/csv' 
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}${fileFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setIsModalOpen(false);
  } catch (error) {
    console.error('Export failed:', error);
    setError('Failed to export data. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  // Render export tabs
  const renderExportTabs = () => {
    const tabs = ['Full Database', 'Vehicle Filters', 'Date & Time'];
    return (
      <div className="flex border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 ${exportTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setExportTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  };

  // Render content based on selected tab
  const renderTabContent = () => {
    switch(exportTab) {
      case 'Full Database':
        return <div className="text-gray-600">Exporting entire database</div>;
      case 'Vehicle Filters':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">License Plate Prefix</label>
              <input 
                type="text" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={filterOptions.licensePrefix || ''}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, licensePrefix: e.target.value }))}
              />
            </div>
          </div>
        );
      case 'Date & Time':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input 
                type="date" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={filterOptions.startDate || ''}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input 
                type="date" 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={filterOptions.endDate || ''}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="heading">
      <div className="title flex justify-between items-center">
        <h1>Export</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded"
        >
          <IconPlus className="mr-2" />
          New Export
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[600px] p-6">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold">Export Options</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {renderExportTabs()}
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 flex items-center">
                <span>No. of Records: {recordCount}</span>
                {isLoading && (
                  <span className="ml-2 text-blue-500">Loading...</span>
                )}
              </div>
              {error && (
                <div className="text-sm text-red-500 mt-2">{error}</div>
              )}
            </div>
            
            {renderTabContent()}
            
            <div className="flex space-x-4 mt-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700">File Name</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">File Type</label>
                <select 
                  value={fileFormat} 
                  onChange={(e) => setFileFormat(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                  <option value=".xlsx">.xlsx</option>
                  <option value=".csv">.csv</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 border border-gray-300 rounded text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleExport} 
                disabled={isLoading || recordCount === 0}
                className={`px-4 py-2 rounded flex items-center ${
                  isLoading || recordCount === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Exporting...' : (
                  <>
                    <IconDownload className="mr-2" />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Export;