import React from "react";
import { Navbar, NavLink, NavbarBrand, Nav, NavItem, Button } from "reactstrap";

const Navigation = ({ logout }) => (
  <Navbar color="dark" dark expand="md">
    <NavbarBrand href="/">Lyrical</NavbarBrand>
    <Nav className="ml-auto" navbar>
      <NavItem>
        <NavLink href="/" style={{ color: "#fff", paddingRight: 30 }}>
          Home
        </NavLink>
      </NavItem>
      <NavItem>
        <Button
          color="info"
          onClick={e => {
            logout(e);
          }}
        >
          Logout
        </Button>
      </NavItem>

      {/* <NavItem>
            <NavLink href="https://github.com/reactstrap/reactstrap">
              GitHub
            </NavLink>
          </NavItem> */}
      {/* <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Options
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}
    </Nav>
  </Navbar>
);

export default Navigation;
