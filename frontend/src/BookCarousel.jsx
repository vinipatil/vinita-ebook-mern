import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const BookCarousel = () => {
  const carouselItems = [
    { id: 1, image: 'https://static01.nyt.com/images/2017/07/18/well/mfrl_books/mfrl_books-superJumbo.gif' },
    { id: 2, image: 'https://www.toloveandtolearn.com/wp-content/uploads/629bf-1.jpg?w=800' },
    { id: 3, image: 'http://www.nichepursuits.com/wp-content/uploads/2024/02/1-14-1024x581.png' },
  ];

  return (
    <Carousel>
      {carouselItems.map((item) => (
        <Carousel.Item key={item.id}>
          <img
            className="d-block w-100"
            src={item.image}
            alt={`Slide ${item.id}`}
            style={{ maxHeight: '630px', objectFit: 'cover' }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default BookCarousel;
