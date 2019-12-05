import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import {Dimensions} from "react-native";
import { Marker } from 'react-native-maps';
import MapComponent from './MapComponent'

export default function App() {

  var markers = [
    { latlng: {latitude: 45.65, longitude: -78.90} ,title: 'Foo Place',subtitle: '1234 Foo Drive',description: 'kuvaus', key: "456"},
    { latlng: {latitude: 61.49, longitude: 23.78} ,title: 'Foo Place',subtitle: '1234 Foo Drive',description: 'kuvaus', key: "123"},
  ];

    //<Marker coordinate={{latitude: 10,longitude: 10}} title="lol" description="lol"/>

  return (
            <MapComponent/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
