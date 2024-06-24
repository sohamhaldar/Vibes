import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import axios from 'axios';
import TrackPlayer, { Track } from 'react-native-track-player';
import { baseUrl } from '../constants/base';


const HandlePlay =async(videoId) => {
  
    console.log(videoId);
    
    // const baseUrl='https://ytmusic-api-56if.onrender.com';
    // const baseUrl='http://127.0.0.1:8000';
    const songs=await axios.post(`${baseUrl}/current`,{
      videoId,
      baseUrl
    });
    console.log(songs.data);
    const data=songs.data
    return data;
    // setActiveQueue(songs.data);
    
    // await TrackPlayer.load(songs.data[0]);
  //   const i:Track={
  //     url: 'http://127.0.0.1:8000/play/KNtJGQkC-WI',
  //     title: 'Fluidity',
  //     artist: 'tobylane',
  //     headers: {
  //       'range': 'bytes=0-'
  //     },
      
  //     // duration: 372,
  // }
    // await TrackPlayer.reset();
    // await TrackPlayer.add(songs.data);
    // await TrackPlayer.play();
    // await TrackPlayer.load(i);
}

export default HandlePlay;

