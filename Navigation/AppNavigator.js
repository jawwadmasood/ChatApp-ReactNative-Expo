import React from 'react';
import {
  createDrawerNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import HomeScreen from '../Screen/Home';
import LoginPage from '../Screen/LoginPage';
import ChatScreen from '../Screen/Chat';

import Camera from '../components/Camera';
import Gallery from '../components/Gallery';
import Audio from '../components/Audio';
import Location from '../components/Location';
import Call from '../components/Call';
import LoginDb from '../Screen/Login';
import Signup from '../Screen/Signup';

const AuthNavigator = createStackNavigator({
  Login: {
    screen: LoginDb,
  },
   Signup: {
    screen: Signup,
  },
});

const TabNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },

  LoginPage: {
    screen: LoginPage,
  },

  Chat: {
    screen: ChatScreen,
  },

  Camera: {
    screen: Camera,
  },

  Signup: {
    screen: Signup,
  },

  Gallery: {
    screen: Gallery,
  },
});

const AppNavigator = createDrawerNavigator(
  {
    LoginPage: {
      screen: TabNavigator,
    },
  },
  {}
);

const MainNavigator = createSwitchNavigator({
  Auth: {
    screen: AuthNavigator,
  },
  App: {
    screen: AppNavigator,
  },
});

export default createAppContainer(MainNavigator);
