import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button } from 'react-native';
import {SplashScreen, Stack} from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import colors from 'tailwindcss/colors';
import TrackPlayer,{useActiveTrack} from 'react-native-track-player';
import MusicService,{setUpPlayer} from '../service/MusicService';
import { useEffect } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView,Swipeable } from 'react-native-gesture-handler';
import { useActiveQueue } from '../store/queue';
import { getActiveTrackIndex } from 'react-native-track-player/lib/src/trackPlayer';


SplashScreen.preventAutoHideAsync()
TrackPlayer.registerPlaybackService(()=>MusicService);
const RootNavigation = () => {
  useEffect(()=>{
    setUpPlayer();
    SplashScreen.hideAsync()
  },[])

  const {activeQueue,setActiveQueue}=useActiveQueue();
  
  
  return(
    <Stack screenOptions={{
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="QueueScreen" options={{ headerTitleAlign:'center',headerTintColor:colors.gray[200],headerStyle:{
        backgroundColor:colors.slate[900]},headerRight:() => {
          const queueClear=async()=>{
            const activeTrackIndex=await getActiveTrackIndex();
            await TrackPlayer.move(activeTrackIndex,0);
            await TrackPlayer.removeUpcomingTracks()
            const queue=await TrackPlayer.getQueue();
            setActiveQueue(queue);
          }
        return(
          <Button onPress={queueClear} title="Clear" className="rounded-lg text-sm" />
        )
        }, }} />
      
      <Stack.Screen name="Player" options={{
        presentation:'modal',
        animation:'slide_from_bottom',
        gestureEnabled:true,
        gestureDirection:'vertical',
        animationDuration:400,
        headerShown:false,
      }}/>
    </Stack>
  )
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<RootNavigation />

				<StatusBar style="auto" />
			</GestureHandlerRootView>
		</SafeAreaProvider>
  );
}


