import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import {Dimensions} from "react-native";
import { Marker } from 'react-native-maps';
import BusMarker from './BusMarker';

export default class MapComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            markers: [
                { latlng: {latitude: 45.65, longitude: -78.90} ,title: 'Foo Place',subtitle: '1234 Foo Drive',description: 'kuvaus', key: "456"},
                { latlng: {latitude: 61.49, longitude: 23.78} ,title: 'Foo Place',subtitle: '1234 Foo Drive',description: 'kuvaus', key: "123"},
              ]

        }

        this.getBusses = this.getBusses.bind(this);
    }

    componentDidMount() {
        //fetch(url).then(response => response.json()).then(data => this.setState( {fetcheddata: data} ));
        this.getBusses();
        this.findCoordinates();
    }

    findCoordinates = () => {
		navigator.geolocation.getCurrentPosition(
			position => {
                const location = JSON.stringify(position);
                //const location = position;
                console.log("gps function");
                console.log(typeof location);
                console.log(typeof position);
                this.setState({userlocation: position });
                console.log("---------------------" +location);
			},
			error => console.log("error gps")
		);
	};

    async getBusses() {
        await fetch('http://data.itsfactory.fi/journeys/api/1/vehicle-activity').then(response => response.json()).then(data => this.setState({busdata: data}));
        let fetchdata = this.state.busdata;
        let newMarkers = [];
        console.log("fetch complete " +this.state.busdata.body.length);
        for (var i = 0; i < this.state.busdata.body.length; i++) {
            //console.log(this.state.busdata.body[i].monitoredVehicleJourney.journeyPatternRef +"   " +this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.latitude +"   " +this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.longitude);
            newMarkers.push( {latlng:{latitude: parseFloat(this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.latitude), longitude: parseFloat(this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.longitude)}, title: this.state.busdata.body[i].monitoredVehicleJourney.journeyPatternRef, subtitle: 'jee', description: 'kuvaus', key: "i"+i} )
        }
        //console.log("for loop finished " +fetchdata.body.length +" coords : " +this.state.userlocation.coords.longitude + " " +this.state.userlocation.coords.latitude);
        this.setState( {markers : newMarkers} );

        this.findCoordinates();
        setTimeout(this.getBusses,20000);
    }


    render() {
        return (
            <View style={styles.container}>
            <Text>My mapapp</Text>
            <Text>My mapapp</Text>
            <Text>My mapapp</Text>
            <MapView
                initialRegion={{
                latitude: 61.49,
                longitude: 23.78,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }} style={{height: 800, width: 400}}>
              {/*}}} style={{flex: 1,height: 500, width: Math.floor(Dimensions.get('window').width)}}>*/}
      
              {this.state.markers.map(marker => (<Marker coordinate={marker.latlng} title={marker.title} description="" key={marker.key} tracksViewChanges={false}>
                  <Text style={styles.bus}>{marker.title}</Text>
                  </Marker>))}
              {/*this.state.markers.map(marker => (<BusMarker coordinate={marker.latlng} title={marker.title} description="kek" key={marker.key}/>))*/}
              {typeof this.state.userlocation !== "undefined" ? <Marker coordinate={{latitude: this.state.userlocation.coords.latitude, longitude: this.state.userlocation.coords.longitude}}/> : console.log("no user location available")}
      
              </MapView>
          </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'lightgreen',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bus: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#1d5e8c',
        borderRadius: 20,
        padding: 8,
        backgroundColor: "#a1c6e0",
        width: 36,
        height: 36,
        textAlign: 'center',
    },
  });