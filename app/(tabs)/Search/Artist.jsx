import { View, Text,Image,FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Entypo} from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import { i2 } from '../../../constants/type';
import SideListItem2 from '../../../components/sideListItem2';
import { useQueue } from '../../../store/queue';
import { baseUrl } from '../../../constants/base';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import Spinner from 'react-native-loading-spinner-overlay';


const Artist = () => {
    const [artistData,setArtistData]=useState([]);  
    const [data,setData]=useState([]);
    const [isArtistLoading,setIsArtistLoading]=useState(true);
    const [isLoading,setIsLoading]=useState(true);
    const{favouriteQueue,removeFromFavouriteQueue,addToFavouriteQueue}=useQueue();
    const {artistId,artistName}=useLocalSearchParams();
    const handleTrackSelect=(videoId)=>{

    }
    const onFavClick=async(item,isFav)=>{
        console.log(item);
        if(isFav){
          await removeFromFavouriteQueue(item.videoId)
        }else{
          await addToFavouriteQueue(item);
        }
    }
    const findArtistDetails=async()=>{
        setIsArtistLoading(true);
        
        console.log(artistId);
        const result=await axios.get(`https://yt.lemnoslife.com/noKey/channels?part=snippet%2CcontentDetails&id=${artistId}`);
        setArtistData(result.data);
        setIsArtistLoading(false);
        setIsLoading(true);
        const playlistId=result.data.items[0].contentDetails.relatedPlaylists.uploads;
        console.log(playlistId);
        const songs=await axios.get(`https://yt.lemnoslife.com/playlistItems?part=snippet&playlistId=${playlistId}`);
        setData(songs.data.items);
        setIsLoading(false);
    }
    useEffect(()=>{
        findArtistDetails();
    },[]);
  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
        {!isArtistLoading&&artistData.length!=0?(<View className="flex-1 bg-slate-900 w-full h-full justify-center items-center">
            <View className="w-full h-[30%]">
                <Image source={{
                    uri:artistData.items[0].snippet.thumbnails.high.url
                }} className="w-full h-full"/>
                <View className="absolute justify-end items-start w-full h-full bg-slate-500 opacity-40">   
                </View>
                <View className="absolute justify-between items-end w-full h-full flex-row">
                    <Text className="text-slate-100 text-3xl font-extrabold m-4 w-[70%] flex-1" numberOfLines={1} ellipsizeMode='tail'>{artistData.items[0].snippet.title}</Text>
                    <TouchableOpacity>
                        <Entypo name="controller-play" size={60} color={colors.gray[700]}style={{
                            margin:10
                        }} />
                    </TouchableOpacity>
                </View>
            </View>
            <View className="h-[70%] w-full">
                <Text className="text-slate-50 text-xl m-4">Songs</Text>

                {!isLoading&&data.length!=0?(<FlatList
                data={data}
                renderItem={({ item}) =>{
                    const formattedData={
                        artwork:item.snippet.thumbnails[item.snippet.thumbnails.length-1].url,
                        title:item.snippet.title,
                        videoId:item.snippet.resourceId.videoId,
                        artist:artistName||"",
                        url:`${baseUrl}/play/${item.snippet.resourceId.videoId}`,
                        headers:{
                            "range": "bytes=0-"
                        }
                    }
                    return(<SideListItem2 item={formattedData} onTrackSelect={handleTrackSelect} onFavClick={onFavClick} InPlaylist={false}/>)
                }}
                contentContainerStyle={{paddingBottom:140}}
            />):(<Spinner
                visible={true}
                textContent={'Loading...'}
                animation='fade'
                textStyle={{
                    color:colors.slate[50]
                }}
              />)
            }
                
            </View>
        </View>):(<Spinner
                visible={true}
                textContent={'Loading...'}
                size={60}
                animation='slide'
                textStyle={{
                    color:colors.slate[50]
                }}
              />)}    
    </SafeAreaView>
  )
}

export default Artist