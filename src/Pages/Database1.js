
import React, { useState, useEffect } from 'react';
import { parkingService } from '../Serivces/Data';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IconSearch, IconCalendar } from '@tabler/icons-react';

function AllRecords() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await parkingService.getParkingData(
        currentPage,
        itemsPerPage,
        searchTerm,
        startDate?.toISOString(),
        endDate?.toISOString()
      );
      setData(result.data);
      setTotalPages(result.total_pages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, searchTerm, startDate, endDate]);

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="main">
      <div className="filters">
        <div className="search-box">
          <IconSearch size={20} />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="date-range">
          <IconCalendar size={20} />
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            placeholderText="Select date range"
          />
          <button onClick={handleDateReset} className="reset-button">
            Clear Dates
          </button>
        </div>

        <div className="page-size">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Insertion ID</th>
              <th>License Plate</th>
              <th>Category</th>
              <th>Color</th>
              <th>Timestamp</th>
              <th>Gate</th>
              <th>Zone</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.insertion_id}>
                  <td>{item.insertion_id}</td>
                  <td>{item.license_plate}</td>
                  <td>{item.category}</td>
                  <td>{item.color}</td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                  <td>{item.gate}</td>
                  <td>{item.zone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AllRecords;