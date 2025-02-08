import React from "react";
import { useState, useEffect } from "react";
import "../Styles/Database.css";
import DateTime from "../Serivces/DateTime";
import { parkingService } from "../Serivces/Data";
import DatePicker from "react-datepicker";
// import 'react-datepicker/dist/react-datepicker.css';
import "../Styles/datepicker.css"; // Your custom CSS file

import {
  IconRefresh,
  IconDownload,
  IconFilter,
  IconCalendarWeek,
  IconSearch,
  IconChevronRight,
  IconChevronLeft,
  IconX,
} from "@tabler/icons-react";
import Pagination from "../Components/Pagination";

function Database() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showFiltersPopup, setShowFiltersPopup] = useState(false);
  const [licensePrefix, setLicensePrefix] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [colorFilter, setColorFilter] = useState([]);
  const [gateFilter, setGateFilter] = useState([]);

  const licenses = ["MH", "GJ", "AP", "TS", "NL", "TN", "KL", "KA"];
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [gates, setGates] = useState([]);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await parkingService.getParkingData(
        currentPage,
        itemsPerPage,
        searchTerm,
        startDate?.toISOString(),
        endDate?.toISOString(),
        licensePrefix,
        categoryFilter.join(","),
        colorFilter.join(","),
        gateFilter.join(",")
      );
      setData(result.data);
      setTotalPages(result.total_pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    startDate,
    endDate,
    licensePrefix,
    categoryFilter,
    colorFilter,
    gateFilter,
  ]);

  const handleResetFilters = () => {
    setLicensePrefix("");
    setCategoryFilter([]);
    setColorFilter([]);
    setGateFilter([]);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleCalendarClick = (e) => {
    e.preventDefault();
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (end) {
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [cats, cols, gts] = await Promise.all([
          parkingService.getCategories(),
          parkingService.getColors(),
          parkingService.getGates(),
        ]);
        setCategories(cats);
        setColors(cols);
        setGates(gts);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="main">
      <div className="heading">
        <div className="title">
          <h1>Search Database</h1>
        </div>
        <DateTime />
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <IconSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <button className="action-button refresh-button">
          <IconRefresh
            className="button-icon"
            onClick={handleRefresh}
            disabled={isLoading}
          />
        </button>

        <button className="action-button download-button">
          <IconDownload className="button-icon" />
        </button>

        <div className="calendar-wrapper">
          <button
            className="action-button calendar-button"
            onClick={(e) => {
              e.preventDefault();
              setIsCalendarOpen(!isCalendarOpen);
            }}
          >
            <IconCalendarWeek className="button-icon" />
            <span className="date-range-text">
              {startDate && endDate
                ? `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()} - ${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString()}`
                : ""}
            </span>
          </button>

          {isCalendarOpen && (
            <div className="calendar-popup modern-datepicker">
              <div className="datepicker-wrapper">
                <label className="datepicker-label">
                  Start Date &amp; Time
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  timeIntervals={15}
                  timeFormat="HH:mm"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  maxDate={new Date()}
                  placeholderText="Select start date & time"
                />
              </div>
              <div className="datepicker-wrapper">
                <label className="datepicker-label">End Date &amp; Time</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showTimeSelect
                  timeIntervals={15}
                  timeFormat="HH:mm"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  maxDate={new Date()}
                  placeholderText="Select end date & time"
                />
              </div>
              <button
                className="close-calendar"
                onClick={() => setIsCalendarOpen(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>

        <button
          className="action-button filters-button"
          onClick={() => setShowFiltersPopup(true)}
        >
          <IconFilter className="button-icon" />
          <span className="button-text">Filters</span>
        </button>
      </div>

      {/* Filters Popup */}
      {/* Filters Popup */}
      {showFiltersPopup && (
        <div className="filters-popup">
          <div className="filters-content">
            <div className="filters-header">
              <h3>Filters</h3>
              <button
                className="close-button"
                onClick={() => setShowFiltersPopup(false)}
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="filter-sections">
              {/* License Plate Filter */}
              <div className="filter-group">
                <label>License Plate</label>
                <div className="checkbox-group">
                  {licenses.map((license) => (
                    <label key={license} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={licensePrefix.includes(license)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLicensePrefix([...licensePrefix, license]);
                          } else {
                            setLicensePrefix(
                              licensePrefix.filter((l) => l !== license)
                            );
                          }
                        }}
                      />
                      <span>{license}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <label>Category</label>
                <div className="checkbox-group">
                  {categories.map((category) => (
                    <label key={category} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={categoryFilter.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCategoryFilter([...categoryFilter, category]);
                          } else {
                            setCategoryFilter(
                              categoryFilter.filter((c) => c !== category)
                            );
                          }
                        }}
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="filter-group">
                <label>Color</label>
                <div className="checkbox-group">
                  {colors.map((color) => (
                    <label key={color} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={colorFilter.includes(color)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setColorFilter([...colorFilter, color]);
                          } else {
                            setColorFilter(
                              colorFilter.filter((c) => c !== color)
                            );
                          }
                        }}
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gate Filter */}
              <div className="filter-group">
                <label>Gate</label>
                <div className="checkbox-group">
                  {gates.map((gate) => (
                    <label key={gate} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={gateFilter.includes(gate)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGateFilter([...gateFilter, gate]);
                          } else {
                            setGateFilter(gateFilter.filter((g) => g !== gate));
                          }
                        }}
                      />
                      <span>{gate}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-buttons">
              <button
                className="apply-button"
                onClick={() => setShowFiltersPopup(false)}
              >
                Apply Filters
              </button>
              <button
                className="clear-button"
                onClick={() => {
                  handleResetFilters();
                  setShowFiltersPopup(false);
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="options">
        <div className="page-size">
          Results Per Page
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        {/* <div className="pagination">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <IconChevronLeft/>
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <IconChevronRight/>
        </button>
      </div> */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <div className="table-container">
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Insertion Id</th>
              <th>License Plate</th>
              <th>Category</th>
              <th>Colour</th>
              <th>Entry Timestamp</th>
              <th>Entry Gate</th>
              <th>Exit Timestamp</th>
              <th>Exit Gate</th>
              <th>Zone</th>
              <th>Description</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="10">Loading...</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.insertion_id}>
                  <td>{item.insertion_id}</td>
                  <td>{item.license_plate}</td>
                  <td>{item.category}</td>
                  <td>{item.color}</td>
                  <td>
                    {item.entry_timestamp
                      ? new Date(item.entry_timestamp).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{item.entry_gate || "N/A"}</td>
                  <td>
                  {item.exit_timestamp ? 
                      new Date(item.exit_timestamp).toLocaleString() : 
                      'Not exited'
                    }
                  </td>
                  <td>{item.exit_gate || "N/A"}</td>
                  <td>{item.zone}</td>
                  <td>{item.description}</td>
                  <td>{item.duration}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Database;
