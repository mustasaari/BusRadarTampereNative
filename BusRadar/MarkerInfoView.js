import React, {Component} from 'react';
import {StyleSheet, Image, Text, View} from 'react-native';

export default class MarkerInfoView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            teksti: "No data available",
        }
        console.log(this.props.status);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        console.log("info mount");
        this.getData();
    }

    async getData() {
        let data = await fetch(this.props.url).then(response => response.json());
        let data2 = await fetch(data.body[0].journeyPatternUrl).then(response => response.json());
        this.setState({headSign: data.body[0].headSign})
        this.setState({journeyName: data2.body[0].name});
    }

    render()
    {
        return (
            <View style={{backgroundColor : 'white', borderRadius: 20, height: '100%', width: '100%', padding: 10, borderColor: 'grey', borderWidth: 1, textAlign: 'center'}}>
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{this.props.line}  {this.state.headSign}</Text>
                <Text style={{textAlign: 'center'}}>{this.state.journeyName}</Text>
            </View>
        )
    }
}