import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ book }) => {
  const data = {
    labels: ['Available Copies', 'Purchased Copies'],
    datasets: [
      {
        data: [book.totalCopies - book.purchasedCopies, book.purchasedCopies],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="w-2/4 mb-6">
      <h3 className="text-lg font-bold mb-2">{book.bookName}</h3>
      <Pie data={data} />
      <p>Publisher: {book.publisherName}</p>
      <p>Author: {book.authorName}</p>
    </div>
  );
};

export default PieChart;
