import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import 'leaflet/dist/leaflet.css';
import "leaflet/dist/images/marker-icon.png";
import { Map, Marker, TileLayer, Polyline } from "react-leaflet";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ReactDOMServer from 'react-dom/server';

import L from 'leaflet';


const useStyles = makeStyles({
    container: {
        display: 'flex',
        height: '100vh',
        backgroundColor: '#d3d3d3',
    }, 
    userPanel: {
        width: '15%',
        backgroundColor: '#18181a',
        padding: '1%',
        boxShadow: '-0.1px 0 3px 1px',
        zIndex: 99,
    },
    playerTitle: { 
        color: '#fff',
        marginBottom: '5%'
    },
    playerList: {
        color: '#d3d3d3',
        marginLeft: '5%'
    },
    playerYou: {
        color: '#757ce8',
        marginLeft: '5%'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
        color: '#fff'
    },
    confButton: {
        position: 'absolute',
        bottom: 25,
        right: 330,
        backgroundColor: '#ef4e4e',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        zIndex: 2,
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        '&:hover':{ 
            boxShadow: '0 7px 14px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22)',
            backgroundColor: '#ef4e4e',
        },
    },
    contButton: {
        backgroundColor: '#ef4e4e',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        zIndex: 2,
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        '&:hover':{ 
            boxShadow: '0 7px 14px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22)',
            backgroundColor: '#ef4e4e',
        },
        marginLeft: '2%',
        marginRight: '2%'
    },
    adminTab: {
        height: '6%',
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: '#18181a',
        zIndex: 10,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: '55px',
    },
    input: {
        marginLeft: '2%'
    },
    inputText: {
        color: '#fff',
    },
    inputTextPlaceholder: {
        color: '#b4b2b5',
    },
    inputTextPlaceholderFocus: {
        color: '#757ce8 !important',
    },
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: `#757ce8 !important`,
    },
        color: '#fff !important',
    },
    cssFocused: {},
    notchedOutline: {
        borderWidth: '1px',
        borderColor: '#b4b2b5 !important'
    },
  });

function Game() {
    const dispatch = useDispatch();
    let history = useHistory();
    const classes = useStyles(); 
    const bull = <span className={classes.bullet}>•</span>;
    const checked = <span className={classes.bullet}>✓</span>;
    const [currentPos, setCurrentPos] = useState();
    const players = useSelector(state => state.players);
    const socket = useSelector(state => state.socket);
    const user = useSelector(state => state.user);
    const [mark, setMark] = useState(false);
    const [lat, setLat] = useState('');
    const [long, setLong] = useState('');
    const [markB, setMarkB] = useState(true);
    const [markers, setMarkers] = useState([]);
    const [correctMarker, setCorMarker] = useState(false);

    const handleClick = (e) =>{
        if(mark == false){
            setCurrentPos(e.latlng);
        }
    };

    const confirmMarkers = (players) => {
        let comp = true;
        for(var i = 0; i < players.length; i++) {
            comp = comp * players[i].marked;
        }
        if( comp == true ){
            if(lat.length && long.length && lat <= 90 && lat >= -90 && long <= 180 && long >= -180){
                for(var j = 0; j < players.length; j++) {
                    //console.log(players[j].name, players[j].currentPos, players[j].color.hex);  
                }
                socket.emit('adminConf', {lat: lat, long: long});
                setCorMarker(true);
                console.log('confirmando markers');
            } else {
                console.log('lat errada');
            }
        } else {
            console.log('faltam confirmações');
        }
    };
    
    useEffect(()=>{
        if(socket !== null ){
            socket.on('rUser', data => {
                dispatch({ type: 'PLAYER_LOGGED', data: data});
            });
            socket.on('serverMarked', data => {
                console.log('haha');
                setMark(!mark);
                if(data !== undefined) {
                    dispatch({type: 'PLAYER_MARKED', players: data})
                }
            });
            socket.on('serverConf', () => {
                let markerP = [];
                for(var i = 0; i < players.length; i++) {
                    markerP.push({
                        pos: players[i].currentPos,
                        color: players[i].color.hex
                    });  
                };
                setMarkers(markerP);
                setMarkB(false);
            });
        } else {
            history.push("/");
        }
    });

  return (
    <div className={classes.container}>
        <div style={{ width: '85%', height: '100%', zIndex: 1}}>
            <Map 
                center={[0, 0]} 
                zoom={3} 
                style={{ width: '100%', height: '100%', zIndex: 1}}
                onClick={(e) => handleClick(e)}
            >
                <TileLayer
                attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                { markB === false ? 
                    (markers.length &&
                        markers.map((player) => 
                        (player.pos.length != 0 &&
                            (
                            <Marker key={player.color} position={player.pos} icon={ 
                                L.divIcon({
                                    className: "my-custom-pin",
                                    iconAnchor: [0, 24],
                                    labelAnchor: [-6, 0],
                                    popupAnchor: [0, -36],
                                    html: ReactDOMServer.renderToString(
                                        <span style={{ 
                                            backgroundColor: (user.color != undefined ? player.color : '#fff'), 
                                            width: '1.5rem', 
                                            height: '1.5rem',
                                            display: 'block',
                                            left: '-1rem',
                                            top: '-.5rem',
                                            position: 'relative',
                                            borderRadius: '1.5rem 1.5rem 0',
                                            transform: 'rotate(45deg)',
                                            border: '1px solid #000',
                                        }}>
                                        </span>) 
                                })
                            } draggable={false}>
                            </Marker> 
                            )
                        )
                    )
                )
                : 
                    (currentPos && 
                        <Marker position={currentPos} icon={ 
                            L.divIcon({
                                className: "my-custom-pin",
                                iconAnchor: [0, 24],
                                labelAnchor: [-6, 0],
                                popupAnchor: [0, -36],
                                html: ReactDOMServer.renderToString(
                                    <span style={{ 
                                        backgroundColor: (user.color !== undefined ? user.color.hex : '#fff'), 
                                        width: '1.5rem', 
                                        height: '1.5rem',
                                        display: 'block',
                                        left: '-1rem',
                                        top: '-.5rem',
                                        position: 'relative',
                                        borderRadius: '1.5rem 1.5rem 0',
                                        transform: 'rotate(45deg)',
                                        border: '1px solid #000',
                                    }}>
                                    </span>) 
                            })
                        } draggable={false}>
                        </Marker>
                    )
                }
                {
                    correctMarker && 
                        (
                        <>
                        <Marker position={L.latLng(lat, long)} icon={ 
                            L.divIcon({
                                className: "my-custom-pin",
                                iconAnchor: [0, 24],
                                labelAnchor: [-6, 0],
                                popupAnchor: [0, -36],
                                html: ReactDOMServer.renderToString(
                                    <span style={{ 
                                        backgroundColor: '#fff', 
                                        width: '3rem', 
                                        height: '3rem',
                                        display: 'flex',
                                        left: '-1.5rem',
                                        top: '-2.4rem',
                                        position: 'relative',
                                        borderRadius: '3rem 3rem 0',
                                        transform: 'rotate(45deg)',
                                        border: '1px solid #000',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                       <span style={{ 
                                        backgroundColor: '#000', 
                                        width: '2rem', 
                                        height: '2rem',
                                        display: 'block',
                                        position: 'relative',
                                        borderRadius: '2rem 2rem 0',
                                        border: '1px solid #000',
                                      }}>
                                      </span>
                                    </span>
                                ) 
                            })
                        } draggable={false}>
                        </Marker>
                        <Polyline positions={[currentPos, L.latLng(lat, long)]}/>
                        </>
                        )
                }
            </Map>
            {markB &&
                <Button variant="contained" color="secondary" className={classes.confButton} onClick={() => { socket != null ? ( currentPos != null ? socket.emit('playerMarked', currentPos) : console.log('sem marker')) : console.log('Não tem socket')}}>
                    Confirmar
                </Button>
            }
            { user.admin &&
                <div className={classes.adminTab}>
                    <TextField 
                        InputLabelProps={{
                            classes:{
                            root: classes.inputTextPlaceholder,
                            focused: classes.inputTextPlaceholderFocus,
                            }
                        }} 
                        InputProps={{
                            classes: {
                            root: classes.cssOutlinedInput,
                            focused: classes.cssFocused,
                            notchedOutline: classes.notchedOutline,
                            }
                        }}
                    className={classes.input} label="Lat" onChange={(event) => {setLat(event.target.value)}} variant="outlined" size="small" value={lat} />
                    <TextField 
                        InputLabelProps={{
                            classes:{
                            root: classes.inputTextPlaceholder,
                            focused: classes.inputTextPlaceholderFocus,
                            }
                        }} 
                        InputProps={{
                            classes: {
                            root: classes.cssOutlinedInput,
                            focused: classes.cssFocused,
                            notchedOutline: classes.notchedOutline,
                            }
                        }}
                    className={classes.input} label="Long" onChange={(event) => {setLong(event.target.value)}} variant="outlined" size="small" value={long} />
                    <Button variant="contained" className={classes.contButton} color="primary" onClick={() => confirmMarkers(players)}>
                        Calcular
                    </Button>
                </div>
            }
        </div>
        <div className={classes.userPanel}>
            <Typography className={classes.playerTitle} variant="h4" component="h1">
                Jogadores
            </Typography>
            {players.map((name) => (
                <Typography className={name.name === user.name ? classes.playerYou : classes.playerList} variant="h6" component="h1" key={name.name}>
                    { name.marked === false ? bull : checked} {name.name} <span style={{color: name.color.hex}}>■</span>
                </Typography>
            ))}
        </div>
    </div>
  );
}

export default Game;