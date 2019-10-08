/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment } from 'react';
import Routes from './routes';

import {
  StyleSheet,
  Text,
} from 'react-native';

export default function App() {
  return (
    <Routes />
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#7159c1',
    justifyContent: 'center',
    alignItems: 'center'
  },

  text: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 20
  }
});

