import React from "react";
import { Redirect } from "react-router-dom";
import { Container, Button } from "reactstrap";
import { config } from "../spotify";

const axios = require("axios");

const AUTH_BASE = "https://accounts.spotify.com/authorize";
const CLIENT_ID = config.CLIENT_ID;
const BASE_URL = "https://api.spotify.com/v1";
const REDIRECT_URI = "http://localhost:3000";
const SCOPES = "user-top-read user-read-private user-read-email";
const PARAMS = {
  client_id: CLIENT_ID,
  response_type: "token",
  redirect_uri: REDIRECT_URI,
  scope: SCOPES
};
const AUTH_HEADERS = token => {
  return { Authorization: `Bearer ${token}` };
};

const encodeParams = p =>
  Object.entries(p)
    .map(kv => kv.map(encodeURIComponent).join("="))
    .join("&");

// Get the hash of the url

const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

window.location.hash = "";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  componentDidMount() {
    let _token = hash.access_token;
    if (_token) {
      this.getCurrentUser(_token);
    }
  }

  async getCurrentUser(_token) {
    await axios
      .get(BASE_URL + "/me", {
        headers: AUTH_HEADERS(_token)
      })
      .then((res, err) => {
        if (res) {
          this.props.setCurrentUser(res.data, _token);
          this.setState({
            redirect: true
          });
        } else {
          console.log(err);
        }
      });
  }

  render() {
    const authURI = AUTH_BASE + "?" + encodeParams(PARAMS);
    const { redirect } = this.state;
    return redirect ? (
      <Redirect to="/" />
    ) : (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#333",
          height: "100vh",
          width: "100vw",
          margin: 0,
          maxWidth: "100vw"
        }}
      >
        <main role="main" className="inner cover">
          <h1 style={{ color: "#fff", marginBottom: 100 }}>Lyrical</h1>
          <p className="lead" style={{ color: "#fff", marginBottom: 100 }}>
            Listen to your top spotify songs, view lyrics, and see what words
            you are exposed to the most.
          </p>
          <p className="lead">
            <Button>
              <a
                style={{ color: "#fff", textDecoration: "none" }}
                href={authURI}
              >
                Login with Spotify
              </a>
            </Button>
          </p>
        </main>
      </Container>
    );
  }
}
