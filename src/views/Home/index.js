import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useDispatch } from 'react-redux';

import { SketchPicker } from 'react-color';

import socketIOClient from 'socket.io-client';

export default function Home() {
  
    const [color, setColor] = useState({
      hex: '#fff'
    });

    const useStyles = makeStyles({
      container: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#18181a',
      },
      cardContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
      root: {
        minWidth: 275,
        backgroundColor: '#3a3a3c',
        overflow: 'visible !important'
      },
      bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
      },
      title: {
        color: '#fff'
      },
      pos: {
        marginBottom: 12,
      },
      input: {
        marginTop: '5%',
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
      cssOutlinedInputColor: {
        '&$cssFocused $notchedOutline': {
          borderColor: `#757ce8 !important`,
        },
        color: color.hex,
      },
      cssFocused: {},
      notchedOutline: {
        borderWidth: '1px',
        borderColor: '#b4b2b5 !important'
      },
      buttonText:{
        color: '#fff'
      },
      colorPicker: {
        position: 'absolute',
        top: 60,
        zIndex: 1,
      }
    });

    const dispatch = useDispatch();

    let history = useHistory();

    const login = (name, color, admin) => {
      if (name.length && color.hex.length){ 
        const socket = socketIOClient('https://ggelmi.online/', {path: '/geopartyserver/socket.io', transports:['polling']});
        var messageObject = {
          name: name,
          color: color,
          id: '',
          marked: false,
          currentPos: [],
          admin: false,
        };
        dispatch({ type: 'PLAYER_SOCKET', socket: socket});
        let users = []; 
        socket.on('previousUsers', data => {
                
          users = data;
          users.push(messageObject);
          socket.emit('userEnter', {name: name, color: color, id: socket.id, marked: false, currentPos: [], admin: admin});
          dispatch({ type: 'PLAYER_LOGIN', players: users, user: {name: name, color: color, id: socket.id, marked: false, currentPos: [], admin: admin}});
        })
        history.push("/game");
      }
    };

    const [admin, setAdmin] = useState(false)

    const [name, setName] = useState('');

    const [picker, setPicker] = useState(false);

    const classes = useStyles(); 

    return (
        <div className={classes.container}>
            <Card className={classes.root}>
            <CardContent className={classes.cardContent}>
            <Typography className={classes.title} variant="h4" component="h2">
                GeoParty
            </Typography>
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
              className={classes.input} label="Nome" onChange={(event) => {setName(event.target.value)}} variant="outlined" size="small" value={name} />
            <div id="colorInput" style={{ position: 'relative'}}>
            <div onClick={() => { setPicker(true)}}>
              <TextField
                InputLabelProps={{
                  classes:{
                    root: classes.inputTextPlaceholder,
                    focused: classes.inputTextPlaceholderFocus,
                  }
                }} 
                InputProps={{
                  classes: {
                    root: classes.cssOutlinedInputColor,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  }
                }} 
                className={classes.input} label="Cor" onChange={() => {}} variant="outlined" size="small" value={color.hex}><div style={{backgroundColor: color.hex, height: '100%', width: '100%' }}></div></TextField>
            </div>
            { picker ?
              <ClickAwayListener onClickAway={() => setPicker(false)}>
                <SketchPicker id='clickbox' color={ color } onChange={(color) => {setColor(color)}} className={classes.colorPicker} style={{ position: 'absolute'}} />
              </ClickAwayListener>
              :
              <></>
            }
            </div>
            <FormControlLabel
              style={{ color: 'white', width: '200px'}}
              control={<Checkbox style={{ color: '#757ce8'}} checked={admin} onChange={()=>setAdmin(!admin)} name="checkedA" />}
              label="Admin"
            />
            </CardContent>
            <CardActions>
            <Button classes={{
              text: classes.buttonText,
            }} onClick={() => login(name, color, admin)} size="small">Entrar</Button>
            </CardActions>
        </Card>
        </div>
    );
}

