import { View, Text } from 'react-native'
import React from 'react';
import TrackPlayer,{Event, RepeatMode, Capability} from 'react-native-track-player';

export const setUpPlayer=async()=>{
  let isSetup=false;
  try{
    await TrackPlayer.getActiveTrackIndex();
    isSetup=true;
  } catch (error) {
    console.log("Entered")
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities:[
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo
      ]
    })
    await TrackPlayer.setRepeatMode(RepeatMode.Queue)
    await TrackPlayer.setVolume(0.8);
    isSetup=true;
    
  }finally{
    return isSetup;
  }
}



const MusicService = async() => {
  try {
    await TrackPlayer.addEventListener(Event.RemotePause,()=>{
      TrackPlayer.pause();
    })
    await TrackPlayer.addEventListener(Event.RemotePlay,()=>{
      TrackPlayer.play();
    })
    await TrackPlayer.addEventListener(Event.RemoteNext,()=>{
      TrackPlayer.skipToNext();
    })
    TrackPlayer.addEventListener(Event.RemotePrevious,()=>{
      TrackPlayer.skipToPrevious();
    })
    TrackPlayer.addEventListener(Event.RemoteStop,()=>{
      TrackPlayer.stop();
    })
  } catch (error) {
    console.log(error);
  }
    
}

export default MusicService