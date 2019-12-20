import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import {Dimensions} from "react-native";
import { Marker } from 'react-native-maps';
import MapComponent from './MapComponent';
import FilterScreen from './FilterScreen';
import BusStopScreen from './BusStopScreen';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';

const TabNavigator = createBottomTabNavigator({
  Map: MapComponent,
  Filter: FilterScreen,
  Stops: BusStopScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        var txt = "empty"
        if (routeName === 'Map') {
          txt = "MapIcon";
        } else if (routeName === 'Filter') {
          txt = "FilterIcon"
        } else if (routeName === 'Stops') {
          txt = "StopsIcon"
        }
        return <Text>{txt}</Text>;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);

//export default function App() {

  /*var markers = [
    { latlng: {latitude: 45.65, longitude: -78.90} ,title: 'Foo Place',subtitle: '1234 Foo Drive',description: 'kuvaus', key: "456"},
    { latlng: {latitude: 61.49, longitude: 23.78} ,title: 'Foo Place',subtitle: '1234 Foo Drive',description: 'kuvaus', key: "123"},
  ];*/

    //<Marker coordinate={{latitude: 10,longitude: 10}} title="lol" description="lol"/>

  //return (
            //<MapComponent/>
  //);
//}

export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
