import React from 'react';
import {Text, View, FlatList, Alert, Image, SectionList, TextInput,Button, CheckBox, Switch} from 'react-native';
import {AsyncStorage} from 'react-native';

export default class FilterListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={ {flex: 1, flexDirection: 'row', borderWidth: 1, borderColor: 'black', backgroundColor: '#a1c6e0', margin: 1, marginRight:6, borderRadius: 5, padding: 5} } >
                <Switch onValueChange={() => this.props.clicked()} value={this.props.isEnabled}/>
                <Text>{this.props.title} {this.props.isEnabled}</Text>
            </View>
        );
    }
}