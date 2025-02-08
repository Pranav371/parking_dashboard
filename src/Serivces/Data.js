// services/parkingService.js

const BASE_URL = "http://localhost:8000";

class ParkingService {
  // Fetch parking data with pagination and search
  async getParkingData(
    page,
    pageSize = 10,
    searchTerm = "",
    startDate,
    endDate,
    licensePrefix = "",
    categoryFilter = "",
    colorFilter = "",
    gateFilter = ""
  ) {
    try {
      const queryParams = new URLSearchParams({
        page: page,
        page_size: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
        ...(licensePrefix && { license_prefix: licensePrefix }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(colorFilter && { color: colorFilter }),
        ...(gateFilter && { gate: gateFilter }),
      });

      const response = await fetch(`${BASE_URL}/data?${queryParams}`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching parking data:", error);
      throw error;
    }
  }



  async getParkingDataDashboard(
    page,
    pageSize = 10,
    searchTerm = "",
  ) {
    try {
      const queryParams = new URLSearchParams({
        page: page,
        page_size: pageSize,
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`${BASE_URL}/dashboard/data?${queryParams}`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching parking data:", error);
      throw error;
    }
  }

  // Get specific parking record by ID
  async getParkingRecordById(id) {
    try {
      const response = await fetch(`${BASE_URL}/data/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching parking record:", error);
      throw error;
    }
  }

  // Get parking statistics
  async getParkingStats() {
    try {
      const response = await fetch(`${BASE_URL}/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching parking stats:", error);
      throw error;
    }
  }

  async getTodayCount() {
    try {
      const response = await fetch(`${BASE_URL}/stats/today`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching today count:", error);
      throw error;
    }
  }

  async getRecentEntries() {
    try {
      const response = await fetch(`${BASE_URL}/stats/recent-entries`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching recent entries:", error);
      throw error;
    }
  }

  async getRecentExits() {
    try {
      const response = await fetch(`${BASE_URL}/stats/recent-exits`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching recent exits:", error);
      throw error;
    }
  }

  async getCategories() {
    const response = await fetch(`${BASE_URL}/filters/categories`);
    const result = await response.json();
    return result.categories;
  }

  async getColors() {
    const response = await fetch(`${BASE_URL}/filters/colors`);
    const result = await response.json();
    return result.colors;
  }

  async getGates() {
    const response = await fetch(`${BASE_URL}/filters/gates`);
    const result = await response.json();
    return result.gates;
  }
}

export const parkingService = new ParkingService();
