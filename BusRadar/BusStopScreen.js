import React from 'react';
import {Text, View, FlatList, Alert, Image, SectionList, TextInput,Button} from 'react-native';
import {AsyncStorage} from 'react-native';
import {NavigationEvents} from 'react-navigation';

export default class BusStopScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stopName: "",
            arrivals: [],
            sectionListData: [],
        }
        this.onScreenFocus = this.onScreenFocus.bind(this);
        this.getStopData = this.getStopData.bind(this);
        this.findNearestStop = this.findNearestStop.bind(this);
    }

    async componentDidMount() {
        AsyncStorage.getItem('userLatitude').then( (x) => this.setState({userLat: parseFloat(x).toFixed(5)}));
        AsyncStorage.getItem('userLongitude').then( (x) => this.setState({userLon: parseFloat(x).toFixed(5)}));
        //console.log("Bus stop screen did mount " +this.state.userLat);
    }

    onScreenFocus() {
        //console.log("Focus called ");
        this.findNearestStop();
        this.getStopData();
    }

    async findNearestStop() {
        await AsyncStorage.getItem('userLatitude').then( (x) => this.setState({userLat: parseFloat(x).toFixed(5)}));
        await AsyncStorage.getItem('userLongitude').then( (x) => this.setState({userLon: parseFloat(x).toFixed(5)}));
        //let lat2 = 61.69978;
        //let lon2 = 23.89121;
        let lat2 = this.state.userLat;
        let lon2 = this.state.userLon;

        let tolerance = 0.003;

        //console.log("lat2 : " +lat2);
        let lat3 = this.state.userLat - tolerance;
        let lat4 = parseFloat(this.state.userLat) + tolerance;
        lat3 = parseFloat(lat3).toFixed(5);
        lat4 = parseFloat(lat4).toFixed(5);
        //console.log("lat3 : " +lat3 +"lat 4 : " +lat4);
        let lon3 = this.state.userLon - tolerance;
        let lon4 = parseFloat(this.state.userLon) + tolerance;
        lon3 = parseFloat(lon3).toFixed(5);
        lon4 = parseFloat(lon4).toFixed(5);
        //console.log("lon3 : " +lon3 +"lon 4 : " +lon4);
        //console.log('http://data.itsfactory.fi/journeys/api/1/stop-points?location='+lat3+","+lon3 +":" +lat4 +"," +lon4);
        await fetch('http://data.itsfactory.fi/journeys/api/1/stop-points?location='+lat3+","+lon3 +":" +lat4 +"," +lon4).then(response => response.json()).then(data => this.setState({stopdata: data}));
        let data = this.state.stopdata;
        //console.log(lat2);
        //console.log("Found stops : " +data.body.length);
        let allData = [];
        if (data.body.length > 0) {
            this.setState({stopName: data.body[0].name, shortName: data.body[0].shortName});
            for (var i = 0; i < data.body.length; i++) {
                //console.log(this.state.stopdata.body[i].name +" " +this.state.stopdata.body[i].shortName);
                var stopData = await this.getStopData(data.body[i].shortName);
                //for (var j = 0; j < stopData.length; j++) { //Debug loop?
                    //console.log(stopData[j].whoArrives +"  "+stopData[j].whenArrives);
                //}
                allData.push( {name: data.body[i].shortName +" "+data.body[i].name, data: stopData} );
            }
        }
        else {
            //console.log("could not find bus stop");
            this.setState({stopName: "no stop found", shortName: "0000"});
        }
        //console.log(allData);
        this.setState({sectionListData: allData});
    }

    async getStopData(stopnumber) {
        let busstopnumber = stopnumber;
        //console.log("fetching bus stop : " +stopnumber);
        await fetch('http://data.itsfactory.fi/journeys/api/1/stop-monitoring?stops=' +busstopnumber).then(response => response.json()).then(data => this.setState({monitor: data}));
        //console.log("BODY : " +this.state.monitor.data);
        //console.log("6007 : length :" +this.state.monitor.body[6007].length);
        let arrivalInfo = [];
        if (busstopnumber in this.state.monitor.body) {
            //console.log(this.state.monitor.body[busstopnumber].length);
            //console.log("who arrives : " +this.state.monitor.body[busstopnumber][0].lineRef);
            //console.log("expected arrival : " +this.state.monitor.body[busstopnumber][0].call.expectedArrivalTime);
            
            for (let i = 0; i < this.state.monitor.body[busstopnumber].length; i++) {

                let dateNow = new Date();
                let dateBus = new Date(this.state.monitor.body[busstopnumber][i].call.expectedArrivalTime);
                let dateInMilliseconds = (dateBus - dateNow);
                var dateInMinutes = Math.round(((dateInMilliseconds % 86400000) % 3600000) / 60000);

                //arrivalInfo.push( {whoArrives: this.state.monitor.body[busstopnumber][i].lineRef, whenArrives: this.state.monitor.body[busstopnumber][i].call.expectedArrivalTime, key: i} );
                arrivalInfo.push(this.state.monitor.body[busstopnumber][i].lineRef +"  " +this.state.monitor.body[busstopnumber][i].call.expectedArrivalTime.slice(11,16)+"  " +dateInMinutes +"min");
            }
            //this.setState({whoArrives: this.state.monitor.body[busstopnumber][0].lineRef, whenArrives: this.state.monitor.body[busstopnumber][0].call.expectedArrivalTime});
            //this.setState( {arrivals: arrivalInfo} );
        }
        else {
            //console.log("no arrivals at " +busstopnumber +" found");
            //this.setState({whoArrives: "no arrival found", whenArrives: "arrival time not found"});
            arrivalInfo.push("no arrivals found");
        }
        return arrivalInfo;
    }

    render() {
        const { navigation } = this.props;    
        return (
            <View style={ {flex: 1, padding: 50, paddingTop: 80} } >
                <NavigationEvents onDidFocus={() => this.onScreenFocus()} />
                <Text style={{fontSize: 24, borderColor: 'black', backgroundColor: '#a1c6e0', borderWidth: 1, borderRadius: 5, padding: 2, paddingLeft: 5}}>Bus Stop Data</Text>
                {/*<Text>Bus Stop Screen</Text>
                <Text>Lat : {this.state.userLat}</Text>
                <Text>Lon : {this.state.userLon}</Text>
                <Text>{this.state.stopName}</Text>
                <Text>{this.state.shortName}</Text>
                <Text>Muistio Kallenkujan kordinaatit on: 61.52675, 23.60779</Text>*/}
                {this.state.arrivals.map(info => <Text key={info.key}>Who arrives : {info.whoArrives} WhenArrives: {info.whenArrives} </Text> )}
                <SectionList style={{paddingTop: 20}}
                    sections={this.state.sectionListData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Text style={{margin: 5, fontSize: 16}}>{item}</Text>}
                    renderSectionHeader={({ section: { name } }) => (<Text style={{fontSize: 20, borderRadius: 5, borderWidth: 1, margin: 1, padding: 5, backgroundColor: '#FCD12A'}}>{name}</Text>)}
                />
            </View>
        );
    }
}