import React from 'react';
import { Constants, ImagePicker, Permissions } from 'expo';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ImageEditor,
  Alert,
  Image,
} from 'react-native';
import firebase from '../Config/firebase';
import { auth, db, storage } from '../Config/firebase';

class CreateAccount extends React.Component {
  static navigationOptions = {
    title: 'SignUp',
  };

  state = {
    name: '',
    email: '',
    password: '',
    avatar: '',
  };

  onSignup = () => {
    const { name, email, password} = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(success => {
        let uid = success.user.uid;
        let userObj = {
          name,
          email,
          password,
          uid,
        };
        this.setState({ name: '', email: '', password: '' });

        firebase
          .database()
          .ref('users/' + success.user.uid + '/info')
          .set(userObj)
          .then(() => {
            Alert.alert(
              'Successfully Signup!',
              'Please login to continue',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => this.props.navigation.navigate('Login'),
                },
              ],
              { cancelable: true }
            );
          })
          .catch(() => {
            console.log('Database undefined');
          });
      })
      .catch(error => {
        var errorMessage = error.message;
        Alert.alert(
          'Sorry',
          errorMessage,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: true }
        );
      });
  }
  render() {
    return (
      <View>
        <Text style={styles.title}>Email:</Text>
        <TextInput
          style={styles.nameInput}
          placeHolder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <Text style={styles.title}>Password:</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          secureTextEntry={true}
        />
        <Text style={styles.title}>Name:</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
      
      {/*  <Button
          title="Pick an image from camera roll"
          onPress={this.pickImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
          */}
        <Button
          title="Create Account"
          style={styles.buttonText}
          onPress={this.onSignup}
        />
      </View>
    );
  }
}

const offset = 16;
const styles = StyleSheet.create({
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  nameInput: {
    height: offset * 2,
    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1,
    fontSize: offset,
  },
  buttonText: {
    marginLeft: offset,
    fontSize: 42,
  },
});

export default CreateAccount;
