import React from 'react';

import {
  Alert,
  Button,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { auth, db, storage } from '../Config/firebase';
import firebase from '../Config/firebase';

import { HelperText, TextInput } from 'react-native-paper';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: 'jawwad@gmail.com',
      password: '123456',
    };
  }

  onLogin = () => {
    const {email, password }= this.state;
    auth.signInWithEmailAndPassword(email, password)
      .then((success) => {
        var uid = firebase.auth().currentUser.uid;
        Alert.alert('Successfully Login!')
          this.props.navigation.navigate("Home")
          })
        
      .catch((error) => {
        Alert.alert(error)
      })  
  }
  // onPressLogin = async () => {
  //   const user = {
  //     email: this.state.email,
  //     password: this.state.password,
  //   };
  //   firebaseSvc.login(user, this.loginSuccess, this.loginFailed);
  // };

  // loginSuccess = () => {
  //   console.log('login successful, navigate to chat.');
  //   this.props.navigation.navigate('Chat', {
  //     name: this.state.name,
  //     email: this.state.email,
  //   });
  // };
  
  // loginFailed = () => {
  //   alert('Login failure. Please tried again.');
  // };
  // methods to handle user input and update the state
  // onChangeTextEmail = email => this.setState({ email });
  // onChangeTextPassword = password => this.setState({ password });

  render() {
    return (
      <View style={styles.container}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 25,
            color: 'grey',
          }}>
          Login
        </Text>

        <TextInput
          label="Email"
          type="email"
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <HelperText
          type="error"
          visible={!this.state.email.includes('@')}
          style={styles.input}>
          Email address e.g abc@gmail.com
        </HelperText>

        <TextInput
          label="Password"
          secureTextEntry={true}
          style={styles.input}
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />

        <Button title="Login" onPress={this.onLogin} />
        <Button
          title="SignUp"
          onPress={() => this.props.navigation.navigate('Signup')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  input: {
    marginBottom: 10,
  },
});
