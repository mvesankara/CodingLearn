import React from 'react';

const Testimonial = ({ quote, author, role }) => (
  <figure className="testimonial">
    <blockquote className="testimonial__quote">“{quote}”</blockquote>
    <figcaption className="testimonial__author">
      <span className="testimonial__name">{author}</span>
      <span className="testimonial__role">{role}</span>
    </figcaption>
  </figure>
);

export default Testimonial;
