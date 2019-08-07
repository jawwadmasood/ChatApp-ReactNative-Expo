import React from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  Modal,
  View,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  Button,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';

import {
  Ionicons,
  AntDesign,
  FontAwesome,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Video } from 'expo-av';
import { Audio } from 'expo-av';

import moment from 'moment';

import { db, auth, storage } from '../Config/firebase';
import firebase from '../Config/firebase';

export default class ChatScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      name: '',
      clicked: '',
      msgArr: [],
    };
  }

  async componentDidMount() {
    let uid = await firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('users/' + uid + '/current')
      .on('value', data => {
        this.setState({ uid, opponentID: data.val() });
      });
    firebase
      .database()
      .ref(`chatRoom/${this.state.uid}/${this.state.opponentID}`)
      .on('child_added', data => {
        let msgArr = this.state.msgArr;
        msgArr.push(data.val());
        this.setState({ msgArr });
      });
  }

  async photo() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    });
    const response = await fetch(result.uri);
    const blob = await response.blob();
    let storageRef = firebase
      .storage()
      .ref()
      .child(`userimages/${blob.name}`);
    storageRef.put(blob).then(snapshot => {
      snapshot.ref.getDownloadURL().then(snapUrl => {
        let today = new Date();
        let created =
          today.getHours() +
          ':' +
          today.getMinutes() +
          ',' +
          today.getDate() +
          '-' +
          (today.getMonth() + 1) +
          '-' +
          today.getFullYear();
        if (result.type === 'image') {
          let msgObj = {
            snapUrl,
            created,
            sender: 'me',
            type: 'image',
          };
          firebase
            .database()
            .ref(`chatRoom/${this.state.uid}/${this.state.opponentID}`)
            .push(msgObj)
            .then(() => {
              msgObj.sender = 'opponent';
              firebase
                .database()
                .ref(`chatRoom/${this.state.opponentID}/${this.state.uid}`)
                .push(msgObj)
                .then(() => {
                  this.props.navigation.navigate('Messages');
                });
            });
        }
        if (result.type === 'video') {
          let msgObj = {
            snapUrl,
            created,
            sender: 'me',
            type: 'video',
          };
          firebase
            .database()
            .ref(`chatRoom/${this.state.uid}/${this.state.opponentID}`)
            .push(msgObj)
            .then(() => {
              msgObj.sender = 'opponent';
              firebase
                .database()
                .ref(`chatRoom/${this.state.opponentID}/${this.state.uid}`)
                .push(msgObj)
                .then(() => {
                  this.props.navigation.navigate('Messages');
                });
            });
        }
      });
    });
  }

  async audio() {
    Permissions.askAsync(Permissions.AUDIO_RECORDING);
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      console.log(recording);
    } catch (error) {
      // An error occurred!
    }
  }

  send() {
    let msg = this.state.name;
    let today = new Date();
    let created =
      today.getHours() +
      ':' +
      today.getMinutes() +
      ',' +
      today.getDate() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getFullYear();
    let msgObj = {
      msg,
      created,
      sender: 'me',
      type: 'message',
    };
    firebase
      .database()
      .ref(`chatRoom/${this.state.uid}/${this.state.opponentID}`)
      .push(msgObj)
      .then(() => {
        msgObj.sender = 'opponent';
        firebase
          .database()
          .ref(`chatRoom/${this.state.opponentID}/${this.state.uid}`)
          .push(msgObj)
          .then(() => {
            this.setState({ name: '' });
          });
      });
  }

  render() {
    const { name, opponentID, uid } = this.state;
    console.log('myUID===>>', uid);
    console.log('opponentID===>>', opponentID);
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
        <View style={{ height: 400 }}>
          <ScrollView>
            {!!this.state.msgArr &&
              this.state.msgArr.map(e => {
                if (e.sender === 'me') {
                  return (
                    <View style={styles.ownMsg}>
                      <Text>{e.msg}</Text>
                      <Text>{moment(e.created.timestamp).fromNow}</Text>
                    </View>
                  );
                } else {
                  return (
                    <View style={styles.friendMsg}>
                      <Text>{e.msg}</Text>
                    </View>
                  );
                }
              })}
          </ScrollView>
        </View>

        <View
          style={{
            width: '100%',
            height: 100,
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'row',
          }}>
          <TextInput
            style={styles.input}
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
            ref={ref => {
              this._nameInput = ref;
            }}
            placeholder="enter your message!"
            autoCapitalize="words"
            autoCorrect={true}
            keyboardType="default"
            returnKeyType="next"
            onSubmitEditing={this._next}
            blurOnSubmit={false}
          />
          <View>
            <TouchableOpacity onPress={this.send.bind(this)}>
              <Ionicons name="md-send" size={36} color="blue" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            borderWidth: 1,
            marginTop: -45,
            flexDirection: 'row',
          }}>

          <TouchableOpacity style={styles.compo} >
            <AntDesign
              name="camera"
              size={36}
              color="blue"
              onPress={() => this.props.navigation.navigate('Camera')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.photo()} style={styles.compo}>
            <Text  color="blue">
              <Entypo name="image" size={26} />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.audio()} style={styles.compo}>
            <Text>
              <FontAwesome name="microphone" size={26} />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('Location')} style={styles.compo}>
            <Text>
              {' '}
              <Entypo name="location-pin" size={26} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    margin: 20,
    marginBottom: 0,
    height: 34,
    width: '80%',
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
  ownMsg: {
    minWidth: '20%',
    maxWidth: '80%',
    height: 'auto',
    padding: 10,
    backgroundColor: '#e6e2da',
    color: 'black',
    marginTop: 10,
    alignSelf: 'flex-end',
    borderRadius: 10,
  },
  friendMsg: {
    minWidth: '20%',
    maxWidth: '80%',
    padding: 10,
    height: 'auto',
    backgroundColor: 'darkgray',
    color: 'white',
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 10,
  },
  compo: {
            marginLeft: 25,
  },
});
