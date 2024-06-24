import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {SplashScreen, Stack} from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import colors from 'tailwindcss/colors';
import TrackPlayer from 'react-native-track-player';
import MusicService,{setUpPlayer} from '../service/MusicService';
import { useEffect } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView,Swipeable } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync()
TrackPlayer.registerPlaybackService(()=>MusicService);
const RootNavigation = () => {
  useEffect(()=>{
    setUpPlayer();
    SplashScreen.hideAsync()
  },[])
  
  // TrackPlayer.registerPlaybackService(()=>MusicService)
  return(
    <Stack screenOptions={{
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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


