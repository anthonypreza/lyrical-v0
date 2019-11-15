import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";

function AuthenticatedRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps =>
        authenticated ? (
          <Component {...routeProps} {...rest} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: routeProps.location } }}
          />
        )
      }
    />
  );
}

export default ({ authenticated, currentUser, setCurrentUser, topTracks }) => (
  <BrowserRouter>
    <AuthenticatedRoute
      exact
      path="/"
      component={Home}
      authenticated={authenticated}
      currentUser={currentUser}
      topTracks={topTracks}
    />
    <Route
      exact
      path="/login"
      render={routeProps => (
        <Login
          {...routeProps}
          authenticated={authenticated}
          setCurrentUser={setCurrentUser}
        />
      )}
    />
  </BrowserRouter>
);
