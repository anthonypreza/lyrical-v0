import React from "react";
import { Jumbotron, Container, Spinner } from "reactstrap";

const axios = require("axios");
const API_URL = "http://apreza.pythonanywhere.com/api/v0/";

class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: null,
      embedded: null,
      loading: true
    };
  }

  componentDidMount() {
    const { currentTrack } = this.props;
    axios
      .post(API_URL + "get_lyrics", {
        track_name: currentTrack.name,
        artists: currentTrack.artists
      })
      .then(res => {
        this.setState({
          embedded: res.data,
          loading: false
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const { currentTrack } = this.props;
    const { loading, lyrics, embedded } = this.state;
    return currentTrack && !loading ? (
      <Jumbotron style={{ backgroundColor: "#fff" }}>
        <h1>{currentTrack.name}</h1>
        <p className="lead">
          {currentTrack.artists[0].name}
          <br />
          {currentTrack.album.name}
        </p>
        {lyrics ? (
          lyrics.split("\n").map(function(item, idx) {
            return (
              <span key={idx}>
                {item}
                <br />
              </span>
            );
          })
        ) : (
          <div className="linkedLyrics">
            <p className="lead">
              <span
                className="embedded"
                dangerouslySetInnerHTML={{ __html: embedded }}
              ></span>
            </p>
            <p>
              Unfortunately, the free production server{" "}
              <a href="https://pythonanywhere.com">pythonanywhere.com</a> used
              for this project does not allow making requests to genius.com :({" "}
              <br /> Please consider{" "}
              <a
                href="https://paypal.me/anthonypreza?locale.x=en_US"
                target="_other"
              >
                donating to the developer
              </a>{" "}
              to buy him coffee and hosting :)
            </p>
          </div>
        )}
      </Jumbotron>
    ) : (
      <Container style={{ marginTop: 30 }}>
        <p className="lead">Calling Genius...</p>
        <Spinner />
      </Container>
    );
  }
}

export default InfoPage;
