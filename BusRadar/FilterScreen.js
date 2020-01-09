import React from 'react';
import {Text, View, FlatList, Alert, Image, SectionList, TextInput,Button, CheckBox, Switch, ScrollView} from 'react-native';
import FilterListItem from './FilterListItem';
import {AsyncStorage} from 'react-native';
import {NavigationEvents} from 'react-navigation';

export default class FilterScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uniqueLines: [],
            enabledLines: [],
            content: "none"
        }
        this.checkboxClicked = this.checkboxClicked.bind(this);
        this.checkEnabledLines = this.checkEnabledLines.bind(this);
        this.onScreenFocus = this.onScreenFocus.bind(this);
        this.getItemsFromStorage = this.getItemsFromStorage.bind(this);
        this.gotdata = this.gotdata.bind(this);
    }

    async fetchInfoIfAsyncFails() {
        await fetch('http://data.itsfactory.fi/journeys/api/1/vehicle-activity').then(response => response.json()).then(data => this.setState({uniquedata: data}));
        let uniqueLinesArray = [];
        for (var k = 0; k < this.state.uniquedata.body.length; k++) {
            if (!uniqueLinesArray.includes(this.state.uniquedata.body[k].monitoredVehicleJourney.journeyPatternRef)) {
                uniqueLinesArray.push(this.state.uniquedata.body[k].monitoredVehicleJourney.journeyPatternRef);
            }
        }
        this.setState({uniqueLines: uniqueLinesArray});
    }

    async componentDidMount() {
        this.gotdata();
        this.checkEnabledLines();
    }

    onScreenFocus() {
        this.gotdata();
        this.checkEnabledLines();
    }

    async gotdata() {
        let testAsynci = await AsyncStorage.getItem('uniqueLines').then( x => JSON.parse(x));
        if (testAsynci == null ) {  //if is null or undefined make empty array
            testAsynci = [];
        }

        this.setState({uniqueLines: testAsynci});
    }

    async getItemsFromStorage() {
        //let arrayU = await AsyncStorage.getItem('uniqueLines').then( (x) => JSON.parse(x)).then( (y) => this.setState({uniqueLines: y}) );
        var arrayU = await AsyncStorage.getItem('uniqueLines').then(x => JSON.parse(x));
        this.setState({uniqueLines: arrayU});
        alert("UNIQUELINES : " +arrayU);
        this.checkEnabledLines(arrayU);
    }

    async checkEnabledLines(parray) {
        var keys = await AsyncStorage.getAllKeys();
        //console.log(keys);
        if (keys.includes("enabledLines")) {
            //let arrayI = await AsyncStorage.getItem('enabledLines').then((z) => JSON.parse(z)).then( (x) => this.setState({enabledLines: x}));
            var arrayE = await AsyncStorage.getItem('enabledLines').then((z) => JSON.parse(z));
            if (arrayE == null) { //if is null or undefined make empty array
                arrayE = [];
            }
            this.setState({enabledLines: arrayE});
        }
        else {
            //console.log("no keys");
            var myarraynew = [];
            AsyncStorage.setItem('enabledLines', JSON.stringify(myarraynew));
            this.setState({enabledLines : myarraynew });
        }
    }

    checkboxClicked(line) {
        //console.log("checkbox clicked : " +line);
        var myarray = this.state.enabledLines;
        if (this.state.enabledLines.includes(line)) {
            //console.log("remove");
            for(var i = 0; i < myarray.length; i++){ 
                if ( myarray[i] === line) {
                  myarray.splice(i, 1); 
                }
             }
             this.setState({enabledLines: myarray});
             AsyncStorage.setItem('enabledLines', JSON.stringify(myarray));
        }
        else {
            //console.log("add");
            var enabledArray = this.state.enabledLines;
            enabledArray.push(line);
            this.setState({enabledLines: enabledArray});
            AsyncStorage.setItem('enabledLines', JSON.stringify(enabledArray));
        }
        //console.log(this.state.enabledLines);
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={ {flex: 1, padding: 50, paddingTop: 80} } >
                <NavigationEvents onDidFocus={() => this.onScreenFocus()} />
                <Text style={{fontSize: 24, borderColor: 'black', backgroundColor: '#a1c6e0', borderWidth: 1, borderRadius: 5, padding: 2, paddingLeft: 5}}>Enabled Lines</Text>
                <Text></Text>
                {/*this.state.uniqueLines.map(data => <Text key={data.key}>{data.line}</Text>)*/}
                <ScrollView style={{borderRadius: 5}}>
                {this.state.uniqueLines !== null && this.state.enabledLines !== null ? this.state.uniqueLines.map(marker => <FilterListItem key={marker} title={marker} clicked={()=>this.checkboxClicked(marker)} isEnabled={this.state.enabledLines.includes(marker) ? true: false} />) : false}
                </ScrollView>
            </View>
        );
    }
}