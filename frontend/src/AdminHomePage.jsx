import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminHomePage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/statistics');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const createChartData = (labels, values, colors) => ({
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
    }],
  });

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'black',
          font: {
            size: 15
          }
        }
      }
    }
  };

  const splitTotalBooks = (booksData) => {
    if (!Array.isArray(booksData) || booksData.length === 0) {
      return { labels: ['No Data'], values: [0], colors: ['#ccc'] };
    }

    const labels = booksData.map(book => book._id); // Using _id as book name
    const values = booksData.map(book => book.totalCopies);
    const colors = booksData.map((_, index) => `hsl(${index * 30}, 70%, 50%)`);

    return { labels, values, colors };
  };

  const splitAvailableBooks = (booksData) => {
    if (!Array.isArray(booksData) || booksData.length === 0) {
      return { labels: ['No Data'], values: [0], colors: ['#ccc'] };
    }

    const labels = booksData.map(book => book._id); 
    const values = booksData.map(book => book.availableCopies);
    const colors = booksData.map((_, index) => `hsl(${index * 30}, 70%, 50%)`);

    return { labels, values, colors };
  };

  const { labels: totalLabels, values: totalValues, colors: totalColors } = splitTotalBooks(data.totalBooks);
  const totalBooksChartData = createChartData(totalLabels, totalValues, totalColors);

  const { labels: availableLabels, values: availableValues, colors: availableColors } = splitAvailableBooks(data.totalBooks);
  const availableBooksChartData = createChartData(availableLabels, availableValues, availableColors);

  const purchasedBooksChartData = createChartData(
    data.purchasedBooks.map(book => book.bookName),
    data.purchasedBooks.map(book => book.purchasedCopies),
    data.purchasedBooks.map((_, index) => `hsl(${index * 360 / data.purchasedBooks.length}, 70%, 50%)`)
  );

  const userLoginsChartData = createChartData(
    data.userLogins.map(user => user.name),
    data.userLogins.map(user => user.loginCount),
    data.userLogins.map((_, index) => `hsl(${index * 360 / data.userLogins.length}, 60%, 55%)`)
  );

  return (
    <div style={{
      backgroundImage:
        'url("https://cdn.wallpapersafari.com/78/14/dFQR2j.jpg")',
    }}>
      <AdminNavbar />
      <h1 className="text-5xl font-bold mb-4 text-center mt-5 mb-5" ></h1>
      <div className="grid grid-cols-2 gap-4 ml-24 mt-32">
        <div className="w-3/4">
          <h2 className="text-3xl font-bold text-center mb-3">Purchased Books</h2>
          <Pie data={purchasedBooksChartData} options={chartOptions} />
        </div>
        <div className="w-3/4">
          <h2 className="text-3xl font-bold text-center mb-3">Total Books</h2>
          <Pie data={totalBooksChartData} options={chartOptions} />
        </div>
        <div className="w-3/4 mt-28">
          <h2 className="text-3xl mb-3 text-center font-bold">Available Books</h2>
          <Pie data={availableBooksChartData} options={chartOptions} />
        </div>
        <div className="w-3/4 mt-28">
          <h2 className="text-3xl mb-3 text-center font-bold">User Logins</h2>
          <Pie data={userLoginsChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
