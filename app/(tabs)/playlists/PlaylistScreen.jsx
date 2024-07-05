import { View, Text,Image,FlatList } from 'react-native'
import React,{useState,useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useActiveQueue, useQueue } from '../../../store/queue'
import {Entypo} from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import Spinner from 'react-native-loading-spinner-overlay';
import music from '../../../assets/music.png';
import SideListItem2 from '../../../components/sideListItem2';

const PlaylistScreen = () => {
    const {removeFromPlaylist,playlistQueue,favouriteQueue,addToFavouriteQueue,removeFromFavouriteQueue}=useQueue();
    const {activeQueue,setActiveQueue,activeQueueId,setActiveQueueId}=useActiveQueue();
    const [playlistItems,setPlaylistItems]=useState([]);
    // const playlistId="First"
    const {playlistId}=useLocalSearchParams();
    
    const [isLoading,setIsLoading]=useState(true);
    const handleTrackSelect=async(videoId)=>{
        // console.log('Fav queue',favouriteQueue);
        console.log('videoId:',videoId);
        const index=await playlistItems.findIndex((i)=>i.videoId==videoId);
        console.log('index:',index);
        await setActiveQueue(playlistItems,index);
        await setActiveQueueId(`playlist-${playlistId}`);

    }
    const playClicked=async()=>{
        await setActiveQueue(playlistItems);
        await setActiveQueueId(`playlist-${playlistId}`);
    }
    const onFavClick=async(item,isFav)=>{
        console.log(item);
        if(isFav){
        await removeFromFavouriteQueue(item.youtubeId)
        }else{
        await addToFavouriteQueue(item);
        }

    }
    const PlayListControls=async(item)=>{
        console.log(item);
        await removeFromPlaylist(playlistId,item)
    }
    useEffect(()=>{
        setIsLoading(true);
        console.log(playlistQueue[playlistId])
        setPlaylistItems(playlistQueue[playlistId]);
        setIsLoading(false)
    },[playlistQueue])
  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
        {!isLoading?(<View className="flex-1 bg-slate-900 w-full h-full justify-center items-center">
            <View className="w-full h-[30%]">
                <Image source={playlistItems[0]?.artwork ? { uri: playlistItems[0]?.artwork } : music} className="w-full h-full"/>
                <View className="absolute justify-end items-start w-full h-full bg-slate-500 opacity-40">   
                </View>
                <View className="absolute justify-between items-end w-full h-full flex-row">
                    <Text className="text-slate-100 text-3xl font-extrabold m-4 w-[70%] flex-1" numberOfLines={1} ellipsizeMode='tail'>{playlistId}</Text>
                    <TouchableOpacity onPress={playClicked}>
                        <Entypo name="controller-play" size={60} color={colors.gray[700]}style={{
                            margin:10
                        }} />
                    </TouchableOpacity>
                </View>
            </View>
            <View className="h-[70%] w-full">
                <Text className="text-slate-50 text-xl m-4">Songs</Text>
                {
                playlistItems.length==0&&(<View className="h-full w-full justify-center items-center -top-20">
                    <Text className="text-slate-300 text-xl">No Songs Available</Text>
                </View>)
                }

                <FlatList
                data={playlistItems}
                renderItem={({ item}) =>{
                    let isFav=false;
                    favouriteQueue.find((i)=>{
                        if(i.videoId==item.youtubeId||i.videoId==item.videoId){
                        isFav=true
                        }
                    })
                    return(<SideListItem2 item={item} onTrackSelect={handleTrackSelect} IsFav={isFav} onFavClick={onFavClick} InPlaylist={true} PlaylistControls={PlayListControls}/>)
                }}
                contentContainerStyle={{paddingBottom:140}}
            />
            </View>
            
        </View>):<Text>'Loading...'</Text>}
    </SafeAreaView>
  )
}

export default PlaylistScreen