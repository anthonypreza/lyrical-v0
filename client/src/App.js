import React from "react";
import Routes from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";

const axios = require("axios");

const BASE_URL = "https://api.spotify.com/v1";
const AUTH_HEADERS = token => {
  return { Authorization: `Bearer ${token}` };
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      currentUser: null,
      token: null,
      topTracks: null
    };
  }

  componentDidMount() {
    let { currentUser, token } = this.state;
    if (currentUser && token) {
      this.setState({
        authenticated: true,
        loading: false
      });
    } else {
      this.setState({
        authenticated: false,
        currentUser: null
      });
    }
  }

  setCurrentUser = (user, token) => {
    if (user && token) {
      this.setState(
        {
          currentUser: user,
          authenticated: true,
          token: token
        },
        () => {
          axios
            .get(BASE_URL + "/me/top/tracks", {
              params: { limit: 50 },
              headers: AUTH_HEADERS(token)
            })
            .then(res => {
              this.setState({
                topTracks: res.data
              });
            })
            .catch(err => console.error(err));
        }
      );
    } else {
      this.setState({
        currentUser: null,
        authenticated: false,
        token: null
      });
    }
  };

  logout = e => {
    e.preventDefault();
    console.log("Logging out...");
    localStorage.removeItem("token");
    this.setState({
      authenticated: false,
      currentUser: null,
      token: null
    });
  };

  render() {
    const { authenticated, currentUser, topTracks } = this.state;
    return (
      <div className="App">
        <Routes
          authenticated={authenticated}
          currentUser={currentUser}
          setCurrentUser={this.setCurrentUser}
          topTracks={topTracks}
          logout={this.logout}
        />
      </div>
    );
  }
}

export default App;
