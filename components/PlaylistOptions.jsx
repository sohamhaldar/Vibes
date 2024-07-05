import { View, Text ,TouchableOpacity,ScrollView,TextInput} from 'react-native';
import React,{useState,useEffect} from 'react'
import Modal from "react-native-modal";
import LongListItem from './LongListItem';
import { useActiveQueue, useQueue } from '../store/queue';
import colors from 'tailwindcss/colors';
import {FontAwesome,MaterialCommunityIcons,Entypo,Ionicons} from '@expo/vector-icons'

const PlaylistOptions = ({track,isModalVisible, setModalVisible}) => {
    const {addPlaylist,addToPlaylist,playlistQueue}=useQueue();
    // const [isModalVisible, setModalVisible] = useState(false);
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const [playlistName,setPlaylistName]=useState('');
    const [playlists,setPlaylists]=useState([]);
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
  )
}

export default PlaylistOptions