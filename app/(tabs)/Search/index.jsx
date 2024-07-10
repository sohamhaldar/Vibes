import { View, Text, TextInput, Pressable, FlatList,TouchableOpacity, ScrollView, Button} from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {FontAwesome,MaterialCommunityIcons,Entypo,Ionicons} from '@expo/vector-icons'
import LongListItem from '../../../components/LongListItem';
import { data } from '../../../temp';
import axios from 'axios';
import FloatingPlayer from '../../../components/FloatingPlayer';
import { useActiveQueue, useQueue } from '../../../store/queue';
import HandlePlay from '../../../service/demo';
import { baseUrl } from '../../../constants/base';
import { router } from 'expo-router';
import colors from 'tailwindcss/colors';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from "react-native-modal";
import PlaylistOptions from '../../../components/PlaylistOptions';
import { useActiveTrack } from 'react-native-track-player';

const Search = () => {
  const [active,setActive]=useState('songs');
  const [search,setSearch]=useState('');
  const [track,setTrack]=useState();
  const [playlists,setPlaylists]=useState([]);
  const [albums,setAlbums]=useState([]);
  const [artists,setArtists]=useState([]);
  const [result,setResult]=useState([]);
  const [isLoading,setLoading]=useState(true);
  const [isInitialized,setIsInitialized]=useState(false);
  const [playlistName,setPlaylistName]=useState('');

  const {setActiveQueue,setActiveQueueId,addToActiveQueue,activeQueue,removeFromActiveQueue}=useActiveQueue();
  const{addToFavouriteQueue,favouriteQueue,removeFromFavouriteQueue,playlistQueue,addToPlaylist}=useQueue();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [error,setError]=useState(null);

  const handleTrackSelect=async(videoId,name)=>{
    if(active=='songs'){
      const data=await HandlePlay(videoId);
      console.log('data recieved');
      setActiveQueue(data);
      setActiveQueueId('searchQueue');
    }else if(active=='artists'){
      console.log(result[0]);
      router.push({pathname:'Search/Artist',params:{artistId:videoId,artistName:name}})
    }
  }
  const currentTrack=useActiveTrack();

  const songsPress=async()=>{
    setActive('songs');
    setLoading(true);
    if(search.length!=0){
    try {
        const data=await searchSong('song');
        setResult(data.data.music);
        setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  }
  const artistsPress=async()=>{
    setActive('artists');
    setLoading(true);
    if(search.length!=0){
      try {
        const data=await searchSong('artist');
        setResult(data.data.music);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  }
  const playlistsPress=async()=>{
    setActive('playlists');
    setLoading(true);
    if(search.length!=0){
      try {
        const data=await searchSong('playlist');
        setResult(data.data.music);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  }
  const albumsPress=async()=>{
    setActive('albums');
    setLoading(true);
    if(search.length!=0){
      try {
        const data=await searchSong('album');
        setResult(data.data.music);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  }
  const searchSong=async(type)=>{
    setIsInitialized(true);
    setLoading(true);
    if(search.length!=0)
    {
      try {
        setError(null);
        const result=await axios.post(`${baseUrl}/search`,{
        type:type,
        search:search
      });
      return result;
      } catch (error) {
        let errorMsg;
        errorMsg=error.toJSON().message;
        error.toJSON().message?setError(errorMsg):setError('Some error occurred')
        // console.log(error.config);
      }
  }
  }
  const onSubmit=async()=>{
    if(active=='songs'){
      songsPress();
    }else if(active=='playlists'){
      playlistsPress();
    }
    else if(active=='albums'){
      albumsPress();
    }
    else if(active=='artists'){
      artistsPress();
    }
  }
  const onAddToQueue=async(song,isAdded)=>{
    if(isAdded){
      await removeFromActiveQueue(song)
    }else{
      await addToActiveQueue(song); 
    }    
  }

  const music=data.music;
  const onFavClick=async(item,isFav)=>{
    console.log(item);
    if(isFav){
      await removeFromFavouriteQueue(item.youtubeId)
    }else{
      await addToFavouriteQueue(item);
    }
  }
  // console.log(music);
  useEffect(() => {
    const updatedPlaylists = Object.entries(playlistQueue).map(([key, value]) => ({
      artwork: value[0]?.artwork||'',
      title: key,
      totalSongs: value.length,
      playlistId:key
    }));

    setPlaylists(updatedPlaylists);
  }, [playlistQueue]);

  const addPlaylists=async()=>{
    console.log(playlistName);
    await addToPlaylist(playlistName,track);
    // await addPlaylist(playlistName);
    console.log(playlistQueue);
    setPlaylistName('');
    setSearchModalVisible(false)
    setModalVisible(false);
  }
  const onPlaylistClick=(item)=>{
    // currentTrack.artist
    // currentTrack.artwork
    // currentTrack.duration
    // currentTrack.title
    // currentTrack.url
    // const song={
    //   videoId:item.youtubeId,
    //   url: `https://ytmusic-api-h2id.onrender.com/play/${item.youtubeId}`,
    //   title: item.author,
    // "headers": {
    //     "range": "bytes=0-"
    // },
    // "artist": "Sabrina Carpenter",
    // "artists": [
    //     {
    //         "name": "Sabrina Carpenter",
    //         "id": "UCz51ZodJbYUNfkdPHOjJKKw"
    //     }
    // ],
    // }

    let author;
    let artistId;
    if (Array.isArray(item.artists)) {
      author = item.artists.map(i => i.name).join(', ');
      artistId = item.artists.map(i => i.id).join(', ');
    } else {
      author = item.artists?.name || '';
    }
    song={
          url:`${baseUrl}/play/${item.youtubeId}`,
          title:item.title,
          artist:author,
          duration:item.duration?.totalSeconds,
          artwork:item.thumbnailUrl,
          headers:{
            "range": "bytes=0-"
            },
          artistId:artistId,
          videoId:item.youtubeId
          }
    setTrack(song);
    setModalVisible(true);
  }
  onPlaylistSelect=async(playlistId,title)=>{
    console.log(track);
    await addToPlaylist(title,track);
    setModalVisible(false);
  }
  

  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center w-full h-full">
      <View className="h-full w-full justify-between items-center">
        <View className="w-[90%] h-[7%] flex-row border-2 top-10">
          <TextInput onChangeText={setSearch}  value={search} placeholder="What's on your mind?" onSubmitEditing={onSubmit} className="bg-slate-50 w-[85%] p-3 px-4 h-full rounded-l-lg"/>
          <View className="bg-slate-500 w-[15%] h-full rounded-r-lg justify-center items-end px-4">
            <MaterialCommunityIcons name='magnify' size={30} onPress={onSubmit}/> 
          </View>
        </View>
        <View className="h-[87%]  w-full">
          <View className="h-16 justify-evenly w-full flex-row items-center">
              <Pressable onPress={songsPress}>
                <Text className={`p-2 ${active=='songs'?'bg-sky-500':'bg-slate-50'} rounded-md`}>Songs</Text>
              </Pressable>
              <Pressable onPress={artistsPress}>
                <Text className={`p-2 ${active=='artists'?'bg-sky-500':'bg-slate-50'} rounded-md`}>Artists</Text>
              </Pressable>
              <Pressable onPress={playlistsPress}>
                <Text className={`p-2 ${active=='playlists'?'bg-sky-500':'bg-slate-50'} rounded-md`}>Playlists</Text>
              </Pressable>
              <Pressable onPress={albumsPress}>
                <Text className={`p-2 ${active=='albums'?'bg-sky-500':'bg-slate-50'} rounded-md`}>Albums</Text>
              </Pressable>
          </View>
        
          {!isLoading?(<View className="h-full w-full">
            
            <FlatList
            
            data={result}
            renderItem={({ item}) => {
              let isFav=false;
              let isAdded=false;
              favouriteQueue.find((i)=>{
                if(i.videoId==item.youtubeId||i.videoId==item.videoId){
                  isFav=true
                }
              })
              activeQueue.find((i)=>{
                if(i.videoId==item.youtubeId||i.videoId==item.videoId){
                  isAdded=true
                }
              })
              let isCurrent=false;
              if(currentTrack){
                if(currentTrack.videoId === item.videoId||currentTrack.videoId === item.youtubeId){
                isCurrent=true;
              }
              }
              
              
              return (
              <LongListItem item={item} isCurrent={isCurrent} onAddToQueue={onAddToQueue} onTrackSelect={handleTrackSelect} onFavClick={onFavClick} type={active} isSearch={true} isFav={isFav} onPlaylistClick={onPlaylistClick} addedToQueue={isAdded}/>
            )
          }}
            contentContainerStyle={{paddingBottom:140}}
            />
          </View>):isInitialized?error==null?(
            <View className="justify-center items-center w-full h-full">
              <Spinner
                visible={true}
                textContent={'Loading...'}
                size={60}
                animation='fade'
                textStyle={{
                    color:colors.slate[50]
                }}
              />
            </View>
          ):(
            <View className="justify-center items-center w-full h-full">
                <View className="w-[70%] h-[22%] justify-center items-center -top-24 bg-slate-700 rounded-lg">
                  <View className="h-[70%] w-full justify-center items-center">
                    <Text className="text-red-400 text-center">{error}</Text>
                  </View>
                  <View style={{width: '100%', height: 1, backgroundColor: 'black'}} />
                  <TouchableOpacity className="h-[30%] w-full justify-center items-center" onPress={onSubmit}>
                  <View className="h-full w-full justify-center items-center ">
                    <Text className="text-slate-100">Try Again</Text>
                  </View>
                  </TouchableOpacity>
                </View>
            </View>

          ):(
            <View className="justify-center items-center w-full h-full -top-36 ">
              <Entypo name="note" size={150} color={colors.slate[600]} />
              <Text className="text-slate-600 text-2xl m-4">Search something...</Text>
            </View>
          )}
          
        </View>
        
      </View>
      
      <PlaylistOptions track={track} isModalVisible={isModalVisible} setModalVisible={setModalVisible}/> 
        
    </SafeAreaView>
    
  )
}

export default Search;