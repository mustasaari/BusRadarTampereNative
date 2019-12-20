import React, {Component} from 'react';
import {StyleSheet, Image, Text} from 'react-native';
import {Marker} from 'react-native-maps';

export default class BusMarker extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            tracksViewChanges: true,
        }
        console.log(this.props.coordinates)
    }

    stopRendering = () =>
    {
        this.setState({ tracksViewChanges: false });
    }

    render()
    {

        return (
            <Marker
                key={this.props.key}
                coordinate={this.props.coordinate}
                title={this.props.title}
                tracksViewChanges={false}
            >
            <Text style={{borderColor: '#ff0000', borderWidth: 1}}>{this.props.title}</Text>
            </Marker>
        )
    }

}


const styles = StyleSheet.create({
    mapMarker:
    {
        width: 36,
        height: 50,
    },
});