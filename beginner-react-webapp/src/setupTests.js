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
    const Anchor = React.forwardRef(({ to, children, className, end, ...rest }, ref) => (
      <a
        href={typeof to === 'string' ? to : '#'}
        ref={ref}
        className={typeof className === 'function' ? className({ isActive: false }) : className}
        {...rest}
      >
        {children}
      </a>
    ));

    return {
      __esModule: true,
      Link: Anchor,
      NavLink: Anchor,
      MemoryRouter: PassThrough,
      BrowserRouter: PassThrough,
      Routes: PassThrough,
      Route: ({ element }) => element,
      useNavigate: () => () => {},
      useLocation: () => ({ pathname: '/', search: '', hash: '', state: null, key: 'mock' }),
    };
  },
  { virtual: true }
);
