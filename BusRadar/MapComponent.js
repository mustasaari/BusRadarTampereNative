import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import {Dimensions} from "react-native";
import { Marker, Callout, CalloutSubview } from 'react-native-maps';
import MarkerInfoView from './MarkerInfoView';
import {AsyncStorage} from 'react-native';

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
        this.markerClicked = this.markerClicked.bind(this);
    }

    componentDidMount() {
        //fetch(url).then(response => response.json()).then(data => this.setState( {fetcheddata: data} ));
        this.getBusses();
        this.findCoordinates();
    }

    componentWillUnmount() {
        console.log("Unmount map does not work use focus")
    }

    findCoordinates = () => {
		var id = navigator.geolocation.watchPosition(
			position => {
                const location = JSON.stringify(position);
                //const location = position;
                console.log("gps function");
                console.log(typeof location);
                console.log(typeof position);
                this.setState({userlocation: position });
                console.log("---------------------" +location);
                AsyncStorage.setItem('userLatitude', JSON.stringify(position.coords.latitude));
                AsyncStorage.setItem('userLongitude', JSON.stringify(position.coords.longitude));
			},
			error => {
                console.log("error gpsi")
            },
            { enableHighAccuracy: true, distanceFilter: 0, timeout: 5000, maximumAge: 1000 }
        );
        //setTimeout(this.findCoordinates, 1000);
        this.setState({watchID : id});
	};

    async getBusses() {
        await fetch('http://data.itsfactory.fi/journeys/api/1/vehicle-activity').then(response => response.json()).then(data => this.setState({busdata: data}));
        let fetchdata = this.state.busdata;
        let newMarkers = [];
        console.log("fetch complete " +this.state.busdata.body.length);
        for (var i = 0; i < this.state.busdata.body.length; i++) {
            //console.log(this.state.busdata.body[i].monitoredVehicleJourney.journeyPatternRef +"   " +this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.latitude +"   " +this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.longitude);
            newMarkers.push( {latlng:{latitude: parseFloat(this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.latitude), 
                longitude: parseFloat(this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.longitude)}, 
                title: this.state.busdata.body[i].monitoredVehicleJourney.journeyPatternRef, 
                subtitle: 'jee', 
                description: 'kuvaus', 
                key: "i"+i, 
                lineRefURL: this.state.busdata.body[i].monitoredVehicleJourney.framedVehicleJourneyRef.datedVehicleJourneyRef, 
                bearing: {textAlign: 'center',color: '#6286a0', paddingTop: 8, position: 'absolute',height: 36, width: 36, transform: [{rotate: Math.round(this.state.busdata.body[i].monitoredVehicleJourney.bearing -90)+"deg"}] } });
            //console.log(Math.round(this.state.busdata.body[i].monitoredVehicleJourney.bearing));
        }
        //console.log("for loop finished " +fetchdata.body.length +" coords : " +this.state.userlocation.coords.longitude + " " +this.state.userlocation.coords.latitude);
        this.setState( {markers : newMarkers} );

        setTimeout(this.getBusses,20000);
    }

    async markerClicked(key, url, title) {
        console.log("marker clicked " +key +"  " +url);
        let data = await fetch(url).then(response => response.json());
        console.log(data.body[0].headSign);
        this.setState({selectedMarkerKey: key});
        this.setState({lineReference: title +" " +data.body[0].headSign})
        //this.refs[key].showCallout();
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
              {/*title={marker.key === this.state.selectedMarkerKey ? this.state.lineReference : marker.title}*/}
              {/*style={{position: 'absolute', flex: 1, height:36, width: 36, fontWeight: 'bold', textAlign: 'center', color: 'grey', transform: [{ rotate: "90deg" }]}}*/}
      
              {this.state.markers.map(marker => (<Marker coordinate={marker.latlng} key={marker.key} tracksViewChanges={false} onPress={ () => this.setState({selectedMarkerKey: marker.key})}>
                  <Text style={styles.bus}>{marker.title}</Text>
                  <Text style={marker.bearing}>      )</Text>
                        <Callout onPress={() => console.log("callout")} tooltip={true}>
                            <View style={{flex:1,height: 80, width:150, margin: 5}}>
                                {marker.key === this.state.selectedMarkerKey ? <MarkerInfoView status="true" url={marker.lineRefURL} line={marker.title}/> : <Text></Text> }
                            </View>
                        </Callout>
                  </Marker>))}
              {/*this.state.markers.map(marker => (<BusMarker coordinate={marker.latlng} title={marker.title} description="kek" key={marker.key}/>))*/}
              {typeof this.state.userlocation !== "undefined" ? <Marker tracksViewChanges={false} coordinate={{latitude: this.state.userlocation.coords.latitude, longitude: this.state.userlocation.coords.longitude}} title="You are here!"><Text style={styles.user}>X</Text></Marker> : console.log("no user location available")}
      
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
    user: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        width: 36,
        height: 36,
        backgroundColor: "#c60000",
        textAlign: 'center',
        padding: 8,
    }
  });