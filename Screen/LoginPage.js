import React from "react";
import { View, Text, Button } from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';

export default class Login extends React.Component {

  
  

  render() {
    return (
      <View style={{ borderColor: 'blue', flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button 
        title="Login"
        color="#841584"
        onPress={() => this.props.navigation.navigate("Login")}/>

        <Button 
        title="Facebook Login"
        color="#841584"
        onPress={() => this.props.navigation.navigate("Home")}
        style={{ marginTop:10 }}/>
      </View>
    );
  }
}