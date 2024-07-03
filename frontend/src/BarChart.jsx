import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ book }) => {
  const data = {
    labels: ['Available Copies', 'Purchased Copies'],
    datasets: [
      {
        label: 'Copies',
        data: [book.totalCopies - book.purchasedCopies, book.purchasedCopies],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: book.bookName,
      },
    },
  };

  return (
    <div className="w-2/4 mb-6">
      <Bar data={data} options={options} />
      <p>Publisher: {book.publisherName}</p>
      <p>Author: {book.authorName}</p>
    </div>
  );
};

export default BarChart;
