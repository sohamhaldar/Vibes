import { StyleSheet, Text, View,Image, TouchableOpacity,Pressable,ActivityIndicator} from 'react-native';
import React,{useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import TrackPlayer,{ useActiveTrack, useIsPlaying,useProgress,usePlaybackState,State } from 'react-native-track-player';
import {AntDesign,Entypo,FontAwesome6,MaterialCommunityIcons,FontAwesome,Feather} from '@expo/vector-icons';
import {Slider} from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import { formatSecondsToMinutes } from '../service/helper';
import colors from 'tailwindcss/colors';
import Modal from "react-native-modal";
import { useTrackPlayerRepeatMode } from '../service/useTrackRepeatMode';
import { RepeatMode } from 'react-native-track-player';
import { useQueue } from '../store/queue';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {useRouter} from 'expo-router';
import MovingText from '../components/MovingText';



const Player = () => {
    const [toggleMode,setToggleMode]=useState(true);
    const {duration,position}=useProgress(250);
    const currentTrack=useActiveTrack();
    const {playing}=useIsPlaying();
    const isSliding = useSharedValue(false)
	const progress = useSharedValue(0)
	const min = useSharedValue(0)
	const max = useSharedValue(1);
    const{repeatMode,changeRepeatMode}=useTrackPlayerRepeatMode();
    const [isModalVisible, setModalVisible] = useState(false);
    const playerState = usePlaybackState();
    const toggleRepeat = (repeatMode) => {
        changeRepeatMode(repeatMode);
        if(repeatMode==RepeatMode.Queue){
            setToggleMode(false);
        }else{
            setToggleMode(true);
        }
        setModalVisible(false);
    };
    useEffect(()=>{
        if(repeatMode==RepeatMode.Queue){
            setToggleMode(false);
        }else{
            setToggleMode(true);
        }
        setModalVisible(false);
    },[repeatMode])
    const iconMap={
        0:'repeat-off',
        1:'repeat-once',
        2:'repeat'
    }
    
	const trackElapsedTime = formatSecondsToMinutes(position);
    const trackDuration=formatSecondsToMinutes(duration);
	const trackRemainingTime = formatSecondsToMinutes(duration - position);
	if (!isSliding.value) {
		progress.value = duration > 0 ? position / duration : 0
	}
    const {addToFavouriteQueue,favouriteQueue,removeFromFavouriteQueue}=useQueue();
    const [isFavourite, setIsFavourite] = useState(false);
    useEffect(() => {
        const isFav = favouriteQueue.some((song) => song.videoId === currentTrack?.videoId);
        setIsFavourite(isFav);
    }, [favouriteQueue, currentTrack]);
    const handleToggleFavourite = async () => {
        if(isFavourite){
            removeFromFavouriteQueue(currentTrack.videoId)
        }else{
            await addToFavouriteQueue(currentTrack);
        }
        
        console.log('Toggled Favourite');
    }
    const router=useRouter();
    const viewQueue=async()=>{
        const index=await TrackPlayer.getActiveTrackIndex();
        router.navigate({pathname:'/QueueScreen',params:{index}});
    }
    // console.log(playerState);
  return (
    
    <SafeAreaView className="flex-1 bg-slate-700 justify-center items-center">
        <GestureRecognizer onSwipeDown={()=>router.back()} className="w-full h-full justify-center items-center">
        <Feather name="minus" size={80} color={colors.gray[400]} style={{
            lineHeight:50,
            top:2
        }} />
        <View className="h-80 w-full -top-4 m-4 p-4">
            {currentTrack?.artwork ? (
                <Image source={{ uri: currentTrack.artwork }}
                        className="h-full w-full rounded-md"
                        resizeMode="contain"
                    />
                ) : (
                    <View className="h-full w-full rounded-md bg-gray-400" />
            )}
        </View>
        <View className="-top-8 h-96 w-full p-4 justify-between items-center">
            {/* <Text className="text-3xl text-slate-50 font-bold" ellipsizeMode="tail" numberOfLines={2}>{currentTrack?.title}</Text> */}
            <MovingText
                text={currentTrack?.title}
                animationThreshold={20} 
                className="text-3xl text-slate-50 font-bold"
            />
            <Text className="text-2xl text-slate-400 font-medium">{currentTrack?.artist}</Text>
            <View className=" h-12 w-full mt-2">
                <Slider progress={progress}
				        minimumValue={min}
				        maximumValue={max}
                        onSlidingStart={() => (isSliding.value = true)}
                        onValueChange={async (value) => {
                            await TrackPlayer.seekTo(value * duration)
                        }}
                        theme={{
                            minimumTrackTintColor:colors.blue[600]
                        }}
                        style={{
                            width:'100%',
                        }}
                        containerStyle={{
                            borderRadius:200,
                            overflow: 'hidden',

                        }}
                        sliderHeight={10}
                        thumbWidth={20}

                        onSlidingComplete={async (value) => {
                            // if the user is not sliding, we should not update the position
                            if (!isSliding.value) return
        
                            isSliding.value = false
        
                            await TrackPlayer.seekTo(value * duration)
                        }}
                    />
                    <View className="flex-row w-full justify-between p-2">
                        <Text className="text-slate-50">{trackElapsedTime}</Text>
                        <Text className="text-slate-50">{trackDuration}</Text>
                    </View>
            </View>
            <View className=" flex-row justify-center items-center space-x-4 h-32">
                <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()} disabled={toggleMode}>
                    <AntDesign name='stepbackward' size={70} color={!toggleMode?'white':'gray'} className=""/>
                </TouchableOpacity>

                {playerState.state == State.Loading||playerState.state == State.Buffering?(<ActivityIndicator size={70} color={colors.slate[400]}/>):(<TouchableOpacity onPress={playing ? TrackPlayer.pause : TrackPlayer.play}>
                    <AntDesign name={playing?'pausecircle':'play'} size={90} color='#f1f5f9' className=""/>
                </TouchableOpacity>)}

                <TouchableOpacity onPress={() => TrackPlayer.skipToNext()} disabled={toggleMode}>
                    <AntDesign name='stepforward' size={70} color={!toggleMode?'white':'gray'} className=""/>
                </TouchableOpacity> 
            </View>
            <View className="w-full flex-row justify-between p-4">
            <TouchableOpacity onPress={()=>setModalVisible(true)}>
                {repeatMode !== undefined ? (
                    <MaterialCommunityIcons name={iconMap[repeatMode]} size={40} color="#f1f5f9" />
                    ) : (
                        <ActivityIndicator size={40} color="#f1f5f9" />
                )}
            </TouchableOpacity>
            
        <Modal isVisible={isModalVisible} className="justify-end flex-1" onBackButtonPress={()=>setModalVisible(false)} onBackdropPress={()=>setModalVisible(false)}>
            <View className=" h-60 w-full justify-center items-center">
            <Pressable className="w-full items-center" onPress={()=>toggleRepeat(RepeatMode.Queue)}>
                <View className="flex-row justify-center m-2 mx-4 items-center bg-stone-400 rounded-md p-2 w-full">
                <MaterialCommunityIcons name="repeat" size={40} color={colors.slate[100]} />
                <Text className="text-slate-300 text-3xl m-2 mr-4">Play in Queue</Text>
                </View>
            </Pressable>
            <Pressable className="w-full items-center" onPress={()=>toggleRepeat(RepeatMode.Track)}>
                <View className="flex-row justify-center m-2 items-center bg-stone-400 rounded-md p-2 w-full">
                <MaterialCommunityIcons name="repeat-once" size={40} color={colors.slate[100]} />
                <Text className="text-slate-300 text-3xl m-2 mr-4">Repeat the Track</Text>
                </View>
            </Pressable>
            <Pressable className=" w-full items-center" onPress={()=>toggleRepeat(RepeatMode.Off)}>
                <View className="flex-row justify-center m-2 items-center bg-stone-400 rounded-md p-2 w-full">
                    <MaterialCommunityIcons name="repeat-off" size={40} color={colors.slate[100]} />
                    <Text className="text-slate-300 text-3xl m-2">Play Once</Text>
                </View>
            </Pressable>
        </View>
        </Modal>
        <MaterialCommunityIcons name="playlist-play" size={40} color={colors.slate[100]} onPress={viewQueue}/>
        <AntDesign name="heart" size={40} color={isFavourite ? "red" : "gray"} onPress={handleToggleFavourite} />
            </View>
        </View>
        </GestureRecognizer>
    </SafeAreaView>
    
  )
}

export default Player

