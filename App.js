// import * as React from 'react';
import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import AppNavigator from './Navigation/AppNavigator';
import Home from './Screen/Home';
import Chat from './Screen/Chat';
import LoginDb from './Screen/Login';
import Signup from './Screen/Signup';
import Gallery from './components/Gallery';
import Camera from './components/Camera';
import Login from './Screen/Login';


export default function App() {
  return (
<AppNavigator />
  );
}



