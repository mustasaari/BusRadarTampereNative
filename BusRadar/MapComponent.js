import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView from 'react-native-maps';
import {Dimensions} from "react-native";
import { Marker, Callout, CalloutSubview } from 'react-native-maps';
import MarkerInfoView from './MarkerInfoView';
import {AsyncStorage} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import * as Permissions from 'expo-permissions';

export default class MapComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            markers: [],
            enabledLines: [],
            stateUniqueLines: [],
            showAllLines: false,
        }

        this.getBusses = this.getBusses.bind(this);
        this.markerClicked = this.markerClicked.bind(this);
        this.findEnabledLines = this.findEnabledLines.bind(this);
        this.GPSPermission = this.GPSPermission.bind(this);
        this.checkKeys = this.checkKeys.bind(this);
        this.savesLines = this.saveLines.bind(this);
    }

    async componentDidMount() {
        this.getBusses();
        this.GPSPermission();
    }

    async checkKeys() {
        let keys = await AsyncStorage.getAllKeys();
        if (!keys.includes("enabledLines")) {
            firstArray = ["000"];
            AsyncStorage.setItem('enabledLines', JSON.stringify(firstArray));
        }
    }

    componentWillUnmount() {
        //console.log("Unmount map does not work use focus ");
    }

    async saveLines() {
        await AsyncStorage.setItem('uniqueLines', JSON.stringify(this.state.stateUniqueLines));
    }

    async GPSPermission() {
        const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            this.findCoordinates();
          } else {
              //console.log("not working")
        }
    }

    async findEnabledLines() {
        var keys = await AsyncStorage.getAllKeys();
        //console.log("keys:" +keys);
        if (keys.includes("enabledLines")) {
            AsyncStorage.getItem('enabledLines').then( (x) => JSON.parse(x)).then( (y) => this.setState({enabledLines: y}));
        }
    }

    onScreenFocus() {
        //console.log("focused on map");
        this.findEnabledLines();
        repeatFecthBusses = setInterval( () => this.getBusses(), 10000 );
        this.setState({intervalBus: repeatFecthBusses});
        this.findCoordinates();
        this.getBusses();
    }

    willBlur() {
        AsyncStorage.setItem('uniqueLines', JSON.stringify(this.state.stateUniqueLines));
        navigator.geolocation.clearWatch(this.state.watchID);
        clearInterval(this.state.intervalBus);
    }

    saveTestData = () => {
        AsyncStorage.setItem('testitem', 'test async success from savetestdata');
    }

    findCoordinates = () => {
		var id = navigator.geolocation.watchPosition(
			position => {
                const location = JSON.stringify(position);
                this.setState({userlocation: position });
                AsyncStorage.setItem('userLatitude', JSON.stringify(position.coords.latitude));
                AsyncStorage.setItem('userLongitude', JSON.stringify(position.coords.longitude));
			},
			error => {
                //console.log("error gps")
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1}
        );
        //setTimeout(this.findCoordinates, 1000);
        this.setState({watchID : id});
    };

    async getBusses() {
        //alert("getbusses has started");
        await fetch('http://data.itsfactory.fi/journeys/api/1/vehicle-activity').then(response => response.json()).then(data => this.setState({busdata: data}));
        let fetchdata = this.state.busdata;
        let newMarkers = [];
        //let filteredLines = ["1", "3" ,"81"];
        let filteredLines = this.state.enabledLines;
        if (filteredLines == null) {
            //console.log("Try prevent null");
            filteredLines = [];
        }
        //console.log("fetch complete " +this.state.busdata.body.length +" state " +this.state.enabledLines);
        for (var i = 0; i < this.state.busdata.body.length; i++) {
            if (filteredLines.includes(this.state.busdata.body[i].monitoredVehicleJourney.journeyPatternRef) || this.state.showAllLines) {
            //console.log(this.state.busdata.body[i].monitoredVehicleJourney.journeyPatternRef +"   " +this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.latitude +"   " +this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.longitude);
            newMarkers.push( {latlng:{latitude: parseFloat(this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.latitude), 
                longitude: parseFloat(this.state.busdata.body[i].monitoredVehicleJourney.vehicleLocation.longitude)}, 
                title: this.state.busdata.body[i].monitoredVehicleJourney.journeyPatternRef, 
                subtitle: 'jee', 
                description: 'kuvaus', 
                key: "i"+i,
                anchor: [0.5,0.5],
                lineRefURL: this.state.busdata.body[i].monitoredVehicleJourney.framedVehicleJourneyRef.datedVehicleJourneyRef, 
                bearing: {textAlign: 'center',color: '#6286a0', paddingTop: 8, position: 'absolute',height: 36, width: 36, transform: [{rotate: Math.round(this.state.busdata.body[i].monitoredVehicleJourney.bearing -90)+"deg"}] } });
            //console.log(Math.round(this.state.busdata.body[i].monitoredVehicleJourney.bearing));
            }
        }
        //console.log("for loop finished " +fetchdata.body.length +" coords : " +this.state.userlocation.coords.longitude + " " +this.state.userlocation.coords.latitude);
        this.setState( {markers : newMarkers} );

        //setTimeout(this.getBusses,20000);
        let uniqueLines = [];
        for (var k = 0; k < this.state.busdata.body.length; k++) {
            //console.log(this.state.busdata.body[k].monitoredVehicleJourney.lineRef);
            if (!uniqueLines.includes(this.state.busdata.body[k].monitoredVehicleJourney.journeyPatternRef)) {
                uniqueLines.push(this.state.busdata.body[k].monitoredVehicleJourney.journeyPatternRef);
            }
        }
        //console.log("unique lines found : " +uniqueLines.length);

        uniqueLines.sort();

        this.setState({stateUniqueLines: uniqueLines});

        this.saveLines();

    }

    async markerClicked(key, url, title) {
        //console.log("marker clicked " +key +"  " +url);
        let data = await fetch(url).then(response => response.json());
        //console.log(data.body[0].headSign);
        this.setState({selectedMarkerKey: key});
        this.setState({lineReference: title +" " +data.body[0].headSign})
        //this.refs[key].showCallout();
    }

    showAllLinesButton = () => {
        if (this.state.showAllLines) {
            this.setState({showAllLines: false});
        }
        else {
            this.setState({showAllLines: true});
        }
    }

    render() {
        return (
            <View style={styles.container}>
            <NavigationEvents onDidFocus={() => this.onScreenFocus()} onWillBlur={() => this.willBlur()} />
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
      
              {this.state.markers.map(marker => (<Marker coordinate={marker.latlng} key={marker.key} tracksViewChanges={false} onPress={ () => this.setState({selectedMarkerKey: marker.key})}>
                  <Text style={styles.bus}>{marker.title}</Text>
                  <Text style={marker.bearing}>      )</Text>
                        <Callout onPress={() => console.log("callout")} tooltip={true}>
                            <View style={{flex:1,height: 80, width:150, margin: 5}}>
                                {marker.key === this.state.selectedMarkerKey ? <MarkerInfoView status="true" url={marker.lineRefURL} line={marker.title}/> : <Text></Text> }
                            </View>
                        </Callout>
                  </Marker>))}
              {typeof this.state.userlocation !== "undefined" ? <Marker tracksViewChanges={false} coordinate={{latitude: this.state.userlocation.coords.latitude, longitude: this.state.userlocation.coords.longitude}} title="You are here!"><Text style={styles.user}>X</Text></Marker> : console.log("no user location available")}
              </MapView>
                <View style={{ position: 'absolute',top: '5%', alignSelf: 'flex-end' }}>
                    <Button title={this.state.showAllLines ? "Show Filter" : "Show All"} onPress={this.showAllLinesButton} />
                </View>
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