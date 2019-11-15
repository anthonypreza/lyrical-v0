import React from "react";
import { Jumbotron, Container, Spinner } from "reactstrap";

const axios = require("axios");

class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: null,
      loading: true
    };
  }

  componentDidMount() {
    const { currentTrack } = this.props;
    axios
      .post("http://localhost:8000/api/v0/get_lyrics", {
        track_name: currentTrack.name,
        artists: currentTrack.artists
      })
      .then(res => {
        this.setState({
          lyrics: res.data,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { currentTrack } = this.props;
    const { loading, lyrics } = this.state;
    return currentTrack && lyrics && !loading ? (
      <Jumbotron style={{ backgroundColor: "#fff" }}>
        <h1>{currentTrack.name}</h1>
        <p className="lead">
          {currentTrack.artists[0].name}
          <br />
          {currentTrack.album.name}
        </p>
        {lyrics.split("\n").map(function(item, idx) {
          return (
            <span key={idx}>
              {item}
              <br />
            </span>
          );
        })}
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
