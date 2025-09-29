// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock(
  'react-router-dom',
  () => {
    const React = require('react');

    const PassThrough = ({ children }) => <div>{children}</div>;

    return {
      __esModule: true,
      Link: ({ to, children, ...rest }) => (
        <a href={typeof to === 'string' ? to : '#'} {...rest}>
          {children}
        </a>
      ),
      MemoryRouter: PassThrough,
      BrowserRouter: PassThrough,
      Routes: PassThrough,
      Route: ({ element }) => element,
      useNavigate: () => () => {},
    };
  },
  { virtual: true }
);
