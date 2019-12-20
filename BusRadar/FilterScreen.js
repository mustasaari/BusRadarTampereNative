import React from 'react';
import {Text, View, FlatList, Alert, Image, SectionList, TextInput,Button} from 'react-native';
import {AsyncStorage} from 'react-native';

export default class FilterScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('userLatitude').then( (x) => this.setState({userLat: x}));
        AsyncStorage.getItem('userLongitude').then( (x) => this.setState({userLon: x}));
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={ {flex: 1, padding: 50} } >
                <Text>Filter Screen</Text>
                <Text>Lat : {this.state.userLat}</Text>
                <Text>Lon : {this.state.userLon}</Text>
            </View>
        );
    }
}