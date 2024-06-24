import { View, Text, TextInput, Pressable, FlatList,TouchableOpacity, ScrollView} from 'react-native'
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

  const {setActiveQueue,setActiveQueueId}=useActiveQueue();
  const{addToFavouriteQueue,favouriteQueue,removeFromFavouriteQueue,playlistQueue,addToPlaylist}=useQueue();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);

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

  // const baseUrl='https://ytmusic-api-h2id.onrender.com';
  const songsPress=async()=>{
    setActive('songs');
    setLoading(true);
    if(search.length!=0){
    const data=await searchSong('song');
    setResult(data.data.music);
    setLoading(false);}
  }
  const artistsPress=async()=>{
    setActive('artists');
    setLoading(true);
    if(search.length!=0){
    const data=await searchSong('artist');
    setResult(data.data.music);
    setLoading(false);}
  }
  const playlistsPress=async()=>{
    setActive('playlists');
    setLoading(true);
    if(search.length!=0)
    {const data=await searchSong('playlist');
      setResult(data.data.music);
    setLoading(false);}
  }
  const albumsPress=async()=>{
    setActive('albums');
    setLoading(true);
    if(search.length!=0)
    {const data=await searchSong('album');
      setResult(data.data.music);
    setLoading(false);}
  }
  const searchSong=async(type)=>{
    setIsInitialized(true);
    setLoading(true);
    if(search.length!=0)
    {
      const result=await axios.post(`${baseUrl}/search`,{
      type:type,
      search:search
    });
    return result;
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
            <MaterialCommunityIcons name='magnify' size={30} /> 
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
              favouriteQueue.find((i)=>{
                if(i.videoId==item.youtubeId||i.videoId==item.videoId){
                  isFav=true
                }
              })
              return (
              <LongListItem item={item} onTrackSelect={handleTrackSelect} onFavClick={onFavClick} type={active} isSearch={true} isFav={isFav} onPlaylistClick={onPlaylistClick}/>
            )
          }}
            contentContainerStyle={{paddingBottom:140}}
            />
          </View>):isInitialized?(
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
            <View className="justify-center items-center w-full h-full -top-36 ">
              <Entypo name="note" size={150} color={colors.slate[600]} />
              <Text className="text-slate-600 text-2xl m-4">Search something..</Text>
            </View>
          )}
          
        </View>
        
      </View>
      <Modal animationOut={'fadeOut'} isVisible={isModalVisible} className="justify-center flex-1 h-full" onBackButtonPress={()=>setModalVisible(false)} onBackdropPress={()=>setModalVisible(false)}>
        <View className=" h-[60%] w-full justify-center items-center border-slate-50 bg-gray-700">
          <View className="h-20 justify-between p-4 item flex-row items-center w-full  border-slate-50">
            <Text className="text-xl text-slate-50 font-bold">Your Playlists</Text>
            <TouchableOpacity onPress={()=>setSearchModalVisible(true)}>
            <Ionicons name="add-circle" size={30} color={colors.sky[500]} />
            </TouchableOpacity>
          </View>
          <View className="h-[80%] w-full">
            <ScrollView>
            {
              playlists.map((item)=>{
                return <LongListItem key={item.title} item={item} onTrackSelect={onPlaylistSelect} isFav={false} onFavClick={'onPlaylistClick'} type='albums' isSearch={false}/>
                
              })
            }
            </ScrollView>
          </View>    
        </View>
        <Modal isVisible={isSearchModalVisible} className="justify-center items-center flex-1 h-full w-full" onBackButtonPress={()=>setSearchModalVisible(false)} onBackdropPress={()=>setSearchModalVisible(false)}>
          <View className=" h-40  justify-center items-center bg-sky-950 w-[80%] mr-8 rounded-xl">
              
              <TextInput onChangeText={setPlaylistName}  value={playlistName} placeholder="Enter Playlist Name" onSubmitEditing={'addPlaylists'} className="bg-slate-50 w-[80%] rounded-lg p-4 mt-4 mr-4"/>
              <TouchableOpacity className="m-4 left-20" onPress={addPlaylists}>
                  <View className="justify-end items-end bg-blue-600 p-2 px-4 rounded-lg">
                      <Text className="text-slate-300 ">Add</Text>
                  </View>
              </TouchableOpacity>
          </View>
        </Modal> 
      </Modal>
        
    </SafeAreaView>
    
  )
}

export default Search;