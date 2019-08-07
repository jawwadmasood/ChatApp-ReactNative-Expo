import React, { PureComponent } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Button,
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { Searchbar, List } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import pic from '../assets/av1.jpg';
import { auth, db, storage } from '../Config/firebase';
import firebase from '../Config/firebase';

export default class Home extends React.Component {
  state = {
    firstQuery: '',
    arr: [],
    show: false,
  };

  componentDidMount() {
    let uid = firebase.auth().currentUser.uid;
    console.log('uid my ---<>>>', uid);
    firebase
      .database()
      .ref('users')
      .on('child_added', data => {
        console.log('data......:::', data);
        console.log('data value......:::', data.val().info);
        setTimeout(() => {
          let arr = this.state.arr;
          if (data.val().info.uid !== uid) {
            arr.push(data.val().info);
          }
          this.setState({ arr, uid, show: true });
        }, 2000);
      });
  }

  clicked(userID) {
    firebase
      .database()
      .ref('users/' + this.state.uid + '/current')
      .set(userID)
      .then(() => {
        this.props.navigation.navigate('Chat');
      });
  }

  render() {
    const { firstQuery, arr } = this.state;
    // console.log('array====>>', arr);

    return (
      <View
        style={{
          flex: 0.5,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}>
        <View
          style={{ width: '100%', height: 25, backgroundColor: 'transparent' }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
            WHATSAPP CHAT
          </Text>
        </View>

        <View style={{ height: 50, backgroundColor: 'transparent' }}>
          <Searchbar
            style={{ marginTop: 10 }}
            placeholder="Search"
            onChangeText={query => {
              this.setState({ firstQuery: query });
            }}
            value={firstQuery}
          />
        </View>

        <View
          style={{
            height: 100,
            backgroundColor: 'transparent',
            marginTop: 10,
          }}>
          <View
            style={{
              width: '100%',
              height: 25,
              marginTop: 8,
              backgroundColor: 'transparent',
              borderBottomColor: 'grey',
              borderBottomWidth: 0.5,
            }}>
            <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>
              Active Users
            </Text>
          </View>

          <ScrollView>
            {!this.state.show ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={{ marginTop: 30 }}
              />
            ) : (
              this.state.arr.map(e => {
                return (
                  <TouchableOpacity
                    onPress={this.clicked.bind(this, e.uid)}
                    key={e.uid}>
                    <List.Item title={e.name} description="Last Message" />
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}
