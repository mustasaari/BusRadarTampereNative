import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
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
          return <Image source={require("./assets/mapicon.png")} style={{width: 25, height: 25}} />
        } else if (routeName === 'Filter') {
          return <Image source={require("./assets/filticon.png")} style={{width: 25, height: 25}} />
        } else if (routeName === 'Stops') {
          return <Image source={require("./assets/stopicon.png")} style={{width: 25, height: 25}} />
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

export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
