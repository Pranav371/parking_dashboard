import React, { useEffect, useState } from 'react'
import '../Styles/Dashboard.css';
import { parkingService } from '../Serivces/Data';
import Card  from '../Components/Cards';

import { IconCar,IconLogin2,IconLogout } from '@tabler/icons-react';


function DateTime(){
    const [currentDateTime,setcurrentDateTime] = useState(new Date());

    useEffect(()=>{
        const timer = setInterval(()=>{
            setcurrentDateTime(new Date());
        },1000);

        return () => clearInterval(timer);
    },[]);


  const formatDate = (date) => {
    const day = date.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Add suffix to day (st, nd, rd, th)
    const suffix = (day % 10 === 1 && day !== 11) ? "st" :
                   (day % 10 === 2 && day !== 12) ? "nd" :
                   (day % 10 === 3 && day !== 13) ? "rd" : "th";

    return `${day}${suffix} ${month} ${year}`;
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "Pm" : "Am";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <div className="date-time">
      <span>{formatDate(currentDateTime)}</span>
      <span> &nbsp;| &nbsp;</span>
      <span>{formatTime(currentDateTime)}</span>
    </div>
  );
}


function Dashboard() {

  const [parkingData, setParkingData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const fetchData = async (page, search = '') => {
      setIsLoading(true);
      try {
        const result = await parkingService.getParkingDataDashboard(page, 10, search);
        const sortedData = result.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setParkingData(sortedData);
        setTotalPages(result.total_pages);
      } catch (error) {
        console.error('Error in component:', error);
        // Handle error appropriately in the UI
      }
      setIsLoading(false);
    };
  
    useEffect(() => {
      fetchData(currentPage, searchTerm);
    }, [currentPage, searchTerm]);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
      setCurrentPage(1);
    };
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };


    const [todayCount, setTodayCount] = useState(0);
    const [enteredCount, setEnteredCount] = useState(0);
    const [exitedCount, setExitedCount] = useState(0);
  
    // Add this useEffect for statistics
    useEffect(() => {
      const fetchStatistics = async () => {
        try {
          const todayRes = await parkingService.getTodayCount();
          const entriesRes = await parkingService.getRecentEntries();
          const exitsRes = await parkingService.getRecentExits();
          
          setTodayCount(todayRes.count);
          setEnteredCount(entriesRes.count);
          setExitedCount(exitsRes.count);
        } catch (error) {
          console.error('Error fetching statistics:', error);
        }
      };
      
      fetchStatistics();
    }, []);


    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "Pm" : "Am";
      hours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${hours}:${formattedMinutes} ${ampm}`;
    };

  return (
    <div className='main'>
        <div className='heading'>
            <div className='title'>
                <h1>Dashboard</h1>
            </div>
            <DateTime/>
        </div>

        <div className='cards'>
          <Card title="Vehicles" count={todayCount} icon={<IconCar/>}/>
          <Card title="Entered" count={enteredCount} icon={<IconLogin2/>}/>
          <Card title="Exited" count={exitedCount} icon={<IconLogout/>}/>
        </div>
        <div className='data'>
        <div className="min-h-screen p-4 bg-gray-100">

      {/* Data Table */}
      <div className="vehicle-container">
      <div className="header">
        <h2>Vehicle Details</h2>
        <a href="#" className="view-all">View all vehicles</a>
      </div>
      
      <div className="table-container">
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Insertion Id</th>
              <th>License Plate</th>
              <th>Category</th>
              <th>Colour</th>
              <th>Timestamp</th>
              <th>Gate</th>
              <th>Zone</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
          {parkingData.map((row, index) => (
              <tr
                key={index}

              >
                <td>{row.insertion_id}</td>
                <td>{row.license_plate}</td>
                <td>{row.category}</td>
                <td>{row.color}</td>
                <td>{row.timestamp}</td>
                <td>{row.gate}</td>
                <td>{row.zone}</td>
                <td>{row.description}</td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
    </div>
        </div>
    </div>
  )
}

export default Dashboard