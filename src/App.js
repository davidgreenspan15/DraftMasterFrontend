import './App.css';
import { Box, Button, Paper, styled, useTheme } from '@material-ui/core';
import MaterialTable from 'material-table';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

function App() {
  const [allPlayers, setAllPLayers] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [updateUser, setUpdateUser] = useState('');
  const [updateReset, setUpdateReset] = useState('');
  const [updatefilter, setUpdatefilter] = useState(true);
  const [toggleGStat, setToggleGStat] = useState(true);
  const [toggleYStat, setToggleYStat] = useState(true);
  const [toggleBye, setToggleBye] = useState(true);
  const [toggleNotes, setToggleNotes] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [updateinjured, setUpdateinjured] = useState('');
  const playerDataTable = playerData;

  useEffect(() => {
    enqueueSnackbar('Update Complete', { variant: 'success' });
  }, [playerData]);

  const theme = useTheme();

  // Download players from API
  React.useEffect(() => {
    enqueueSnackbar(
      'Updating Players',
      { variant: 'info' },
      { preventDuplicate: true }
    );
    fetch('http://localhost:3000/players')
      .then(response => response.json())
      .then(data => setAllPLayers([...data]));
  }, [updateUser, updateReset]);

  // Convert data into organized player data for table
  const createData = (
    name,
    position,
    depth,
    doublep,
    team,
    injured,
    formations,
    id,
    rank,
    adp,
    tier,
    bye,
    notes,
    gfanpts,
    gyds_pass,
    gtds_pass,
    grec_rec,
    gyds_rec,
    gtds_rec,
    gatt_rush,
    gyds_rush,
    gtds_rush,
    yfanpts,
    yyds_pass,
    ytds_pass,
    yrec_rec,
    yyds_rec,
    ytds_rec,
    yatt_rush,
    yyds_rush,
    ytds_rush,
    roundPick
  ) => {
    return {
      name,
      position,
      depth,
      doublep,
      team,
      injured,
      formations,
      id,
      rank,
      adp,
      tier,
      bye,
      notes,
      gfanpts,
      gyds_pass,
      gtds_pass,
      grec_rec,
      gyds_rec,
      gtds_rec,
      gatt_rush,
      gyds_rush,
      gtds_rush,
      yfanpts,
      yyds_pass,
      ytds_pass,
      yrec_rec,
      yyds_rec,
      ytds_rec,
      yatt_rush,
      yyds_rush,
      ytds_rush,
      roundPick,
    };
  };
  // Create table with players
  const createTable = useMemo(() => {
    let data = [];
    if (allPlayers.length > 0) {
      allPlayers.forEach(player => {
        if (
          player.name !== '- ' &&
          player.name !== '' &&
          player.position !== '' &&
          player.position !== 'RG' &&
          player.position !== 'RT' &&
          player.position !== 'C' &&
          player.position !== 'LG' &&
          player.position !== 'LT'
        ) {
          let playerImjured = '';
          let playerADP = 0;
          let playerRank = 0;
          if (player.injured === false) {
            playerImjured = 'false';
          } else if (player.injured === true) {
            playerImjured = 'true';
          }
          if (player.adp === null) {
            playerADP = 10000;
          } else {
            playerADP = player.adp;
          }
          if (player.rank === null) {
            playerRank = 10000;
          } else {
            playerRank = player.rank;
          }
          let playerroundsplit = `${playerADP}`.split('.');
          let round = Math.ceil(parseInt(playerroundsplit[0]) / 12);
          let playeradpdec = `${playerADP / 12}`.split('.')[1];

          let pick = Math.ceil(parseInt(('.' + playeradpdec) * 12));
          if (pick === 0) {
            pick = 12;
          }
          let draftroundandpick = `Round ${round} Pick ${pick}`;

          data.push(
            createData(
              player.name,
              player.position,
              player.depth,
              player.doublep,
              player.team,
              playerImjured,
              player.formation,
              player.id,
              playerRank,
              playerADP,
              player.tier,
              player.bye,
              player.notes,
              player.gfanpts,
              player.gyds_pass,
              player.gtds_pass,
              player.grec_rec,
              player.gyds_rec,
              player.gtds_rec,
              player.gatt_rush,
              player.gyds_rush,
              player.gtds_rush,
              player.yfanpts,
              player.yyds_pass,
              player.ytds_pass,
              player.yrec_rec,
              player.yyds_rec,
              player.ytds_rec,
              player.yatt_rush,
              player.yyds_rush,
              player.ytds_rush,
              draftroundandpick
            )
          );
          setPlayerData([...data]);
        }
      });
    }
  }, [allPlayers]);

  // Make player taken
  const playersDataAll = [];
  const makeTaken = e => {
    enqueueSnackbar('Updating Availablibility', { variant: 'warning' });
    e.forEach(person => {
      fetch(`http://localhost:3000/players/${person.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ injured: 'toggle' }),
      })
        .then(response => response.json())
        .then(data => {
          setUpdateUser(data.name + data.injured);
        })
        .catch(error => {
          enqueueSnackbar(error, { variant: 'error' });
        });
    });
  };

  // Toggle filters
  const toggleFilter = () => {
    setUpdatefilter(!updatefilter);
  };
  const changeToggleGStat = () => {
    setToggleGStat(!toggleGStat);
  };
  const changeToggleYStat = () => {
    setToggleYStat(!toggleYStat);
  };
  const changeToggleBye = () => {
    setToggleBye(!toggleBye);
  };
  const changeToggleNotes = () => {
    setToggleNotes(!toggleNotes);
  };

  // Reset API database
  const resetPlayers = () => {
    enqueueSnackbar('Reseting Players', { variant: 'warning' });
    fetch('http://localhost:3000/resetplayers')
      .then(response => response.json())
      .then(data => setAllPLayers([...data]))
      .then(data => setUpdateReset(!updateReset));
  };

  const Section = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
  }));

  return (
    <div
      className="App"
      style={{
        paddingLeft: '65px',
        paddingRight: '65px',
        paddingTop: '4px',
        paddingBottom: '2px',
      }}
    >
      <Box>
        <Button
          onClick={toggleFilter}
          style={{ color: 'white', paddingTop: '5px' }}
        >
          Filter?
        </Button>
        <Button onClick={changeToggleGStat} style={{ color: 'white' }}>
          Game Stats?
        </Button>
        <Button onClick={changeToggleYStat} style={{ color: 'white' }}>
          Season Stats?
        </Button>
        <Button onClick={resetPlayers} style={{ color: 'white' }}>
          Reset players
        </Button>
        {/*<Button onClick={createTable}>Create Table</Button> */}
      </Box>

      {playerDataTable.length > 2 ? (
        <Section
          style={{
            paddingLeft: '65px',
            paddingRight: '65px',
            paddingTop: '10px',
            paddingBottom: '148px',
            borderRadius: '0px',
            boxShadow: '40px',
            overflowY: 'scroll',
            maxHeight: '649px',
            opacity: '.97399999999',
          }}
        >
          <MaterialTable
            title={'Fantasy Draft Board Assistant'}
            components={{ Container: Box }}
            columns={[
              {
                title: 'Rank',
                field: 'rank',
                defaultSort: 'asc',

                cellStyle: {
                  background: '#EEE',
                },
              },
              {
                title: 'Name',
                field: 'name',
              },
              {
                title: 'ADP',
                field: 'adp',

                cellStyle: {
                  background: '#EEE',
                },
              },
              {
                title: 'Position',
                field: 'position',
              },
              {
                title: 'Depth Slot #',
                field: 'depth',

                cellStyle: {
                  background: '#EEE',
                },
              },
              {
                title: 'Round and Pick',
                field: 'roundPick',
                hidden: false,
              },
              {
                title: 'Bye',
                field: 'bye',
                hidden: toggleBye,
              },
              {
                title: 'Fanpts PG',
                field: 'gfanpts',
                hidden: toggleGStat,
              },

              {
                title: 'Receptions PG',
                field: 'grec_rec',
                hidden: toggleGStat,

                cellStyle: {
                  background: '#EEE',
                },
              },
              {
                title: 'Recieving Yards PG',
                field: 'gyds_rec',
                hidden: toggleGStat,
              },
              {
                title: 'Recieving TDs PG',
                field: 'gtds_rec',
                hidden: toggleGStat,

                cellStyle: {
                  background: '#EEE',
                },
              },
              {
                title: 'Rushing Attempts PG',
                field: 'gatt_rush',
                hidden: toggleGStat,
              },
              {
                title: 'Rushing Yards PG',
                field: 'gyds_rush',
                hidden: toggleGStat,

                cellStyle: {
                  background: '#EEE',
                },
              },
              {
                title: 'Rushing TDs PG',
                field: 'gtds_rush',
                hidden: toggleGStat,
              },
              {
                title: 'Passing Yards PG',
                field: 'gyds_pass',
                hidden: toggleGStat,

                cellStyle: {
                  background: '#EEE',
                },
              },
              {
                title: 'Passing TDs PG',
                field: 'gtds_pass',
                hidden: toggleGStat,
              },
              {
                title: 'FanPTS',
                field: 'yfanpts',
                hidden: toggleYStat,
              },

              {
                title: 'Receptions',
                field: 'yrec_rec',
                hidden: toggleYStat,

                cellStyle: {
                  background: '#EEE',
                },
              },
              {
                title: 'Recieving Yards',
                field: 'yyds_rec',
                hidden: toggleYStat,
              },
              {
                title: 'Recieving TDs',
                field: 'ytds_rec',
                hidden: toggleYStat,

                cellStyle: {
                  background: '#EEE',
                },
              },
              {
                title: 'Rushing Attempts',
                field: 'yatt_rush',
                hidden: toggleYStat,
              },
              {
                title: 'Rushing Yards',
                field: 'yyds_rush',
                hidden: toggleYStat,

                cellStyle: {
                  background: '#EEE',
                },
              },
              {
                title: 'Rushing TDs',
                field: 'ytds_rush',
                hidden: toggleYStat,
              },
              {
                title: 'Passing Yards',
                field: 'yyds_pass',
                hidden: toggleYStat,

                cellStyle: {
                  background: '#EEE',
                },
              },
              {
                title: 'Passing TDs',
                field: 'ytds_pass',
                hidden: toggleYStat,
              },

              {
                title: 'Team',
                field: 'team',
              },
              {
                title: 'Available?',
                field: 'injured',
                cellStyle: {
                  textAlign: 'right',
                  background: '#EEE',
                },

                filtering: updatefilter,
                defaultFilter: 'true',
                headerStyle: {
                  textAlign: 'right',
                },
                render: rowData => {
                  if (rowData.injured === 'true') {
                    return '✅';
                  } else if (rowData.injured === 'false') {
                    return '❌';
                  }
                },
              },
            ]}
            detailPanel={rowData => {
              return (
                <div
                  style={{
                    paddingLeft: '65px',
                    paddingRight: '65px',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                  }}
                >
                  <p>{rowData.notes}</p>
                </div>
              );
            }}
            data={playerDataTable}
            options={{
              showTitle: false,
              search: true,
              emptyRowsWhenPaging: false,
              pageSize: 50,
              filtering: updatefilter,
              selection: true,
              sorting: true,
              rowStyle: rowData => {
                if (rowData.injured === 'true') {
                  return {
                    backgroundColor: '#fff',
                    opacity: 4.0,
                  };
                } else {
                  return {
                    backgroundColor: 'lightgray',
                    color: 'white',
                    opacity: 1.0,
                  };
                }
              },
            }}
            actions={[
              {
                tooltip: 'Toggle Active',
                icon: 'cached',
                cellStyle: {},

                onClick: (evt, data) => {
                  makeTaken(data);
                },
              },
            ]}
          />
        </Section>
      ) : (
        <div class="loader"></div>
      )}
    </div>
  );
}

export default App;
