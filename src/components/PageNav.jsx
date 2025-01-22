import { NavLink } from 'react-router-dom';

export default function PageNav() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/">HomePage</NavLink>
          </li>
          <li>
            <NavLink to="/pricing">Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/product">Product</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
