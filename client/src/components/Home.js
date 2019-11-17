import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Jumbotron, Button } from "reactstrap";
import Table from "./Table";

document.addEventListener(
  "play",
  function(e) {
    var allAudios = document.getElementsByTagName("audio");
    for (var i = 0; i < allAudios.length; i++) {
      if (allAudios[i] !== e.target) {
        allAudios[i].pause();
      }
    }
  },
  true
);

const Home = ({ currentUser, topTracks }) => {
  const Styles = styled.div`
    padding: 1rem;
    table {
      border-spacing: 0;
      border: 1px solid black;
      tr {
        :last-child {
          td {
            border-bottom: 0;
          }
        }
      }
      th,
      td {
        margin: 0;
        padding: 0.5rem;
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        :last-child {
          border-right: 0;
        }
      }
    }
  `;
  const columns = [
    {
      Header: "Name",
      accessor: "name"
    },
    {
      Header: "Artist",
      accessor: "artists[0].name"
    },

    {
      Header: "Album",
      accessor: "album.name"
    },
    {
      Header: "Popularity",
      accessor: "popularity"
    },
    {
      Header: "Play",
      Cell: ({ row }) => {
        return row ? (
          <div className="audio">
            <audio controls name="media">
              <source type="audio/mpeg" src={row.original.preview_url} />
            </audio>
            <Button style={{ backgroundColor: "green" }}>
              <a
                target="_other"
                style={{ color: "#fff", textDecoration: "none" }}
                href={row.original.external_urls.spotify}
              >
                Listen on Spotify
              </a>
            </Button>{" "}
          </div>
        ) : null;
      }
    },
    {
      Header: "Genius",
      Cell: ({ row }) => {
        return row ? (
          <Link to={`/genius/${row.original.id}`}>View Lyrics</Link>
        ) : null;
      }
    }
  ];

  return (
    <Jumbotron style={{ backgroundColor: "#fff" }}>
      <h1>
        Hey, {currentUser ? currentUser.display_name.split(" ")[0] : null}!{" "}
      </h1>
      <p className="lead">How about some music?</p>
      <p>
        Here are your top 50 streamed songs on Spotify. You can click the
        columns to sort your tracks, directly preview your tracks, or view them
        on Spotify. Lyrics are also available!
      </p>
      {topTracks ? (
        <Styles>
          <Table data={topTracks.items} columns={columns} />
        </Styles>
      ) : null}
    </Jumbotron>
  );
};

export default Home;
