import { View, Text,Pressable,TextInput,TouchableOpacity, ScrollView } from 'react-native';
import React,{useState,useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActiveQueue, useQueue } from '../../../store/queue';
import {Entypo,Ionicons,MaterialCommunityIcons} from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import TrackPlayer from 'react-native-track-player';
import LongListItem from '../../../components/LongListItem';
import Modal from "react-native-modal"; 
import unknown from '../../../assets/music.png'
import { router } from 'expo-router';

const Playlist = () => {
  const {playlistQueue,addPlaylist,removeFromPlaylist,removePlaylist}=useQueue();
  const {setActiveQueueId,setActiveQueue}=useActiveQueue();
  const[playlists,setPlaylists]=useState([]);
  const [playlistName,setPlaylistName]=useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    
    const updatedPlaylists = Object.entries(playlistQueue).map(([key, value]) => ({
      artwork: value[0]?.artwork||'',
      title: key,
      totalSongs: value.length,
      playlistId:key
    }));

    setPlaylists(updatedPlaylists);
  }, [playlistQueue]);

  const onTrackSelect=async(item)=>{
    console.log(item);
    router.push({pathname:'/playlists/PlaylistScreen',params:{playlistId:item}})
  }
  const onPlaylistClick=async(item)=>{
    console.log('plsying now');
    await setActiveQueueId(item.playlistId);
    await setActiveQueue(playlistQueue[item.playlistId]);
    
  }

  const addPlaylists=async()=>{
    console.log(playlistName);
    await addPlaylist(playlistName);
    console.log(playlistQueue);
    setPlaylistName('');
    setModalVisible(false)
  }
  // test(); 
  
  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <View className="h-20 justify-between p-4 item flex-row items-center w-full">
          <Text className="text-3xl text-slate-50 font-bold">Your Playlists</Text>
          <TouchableOpacity onPress={()=>setModalVisible(true)}>
          <Ionicons name="add-circle" size={40} color={colors.sky[500]} />
          </TouchableOpacity>
        </View>
        <View className="h-[90%] w-full">
          <ScrollView>
            {playlists.map((item)=>{
                return(
                  <LongListItem key={item.title} item={item} onTrackSelect={onTrackSelect} isFav={false} onFavClick={onPlaylistClick} type='playlists' isSearch={false}/>
                )
            })}
          </ScrollView>
        </View>
      </View>
      <Modal isVisible={isModalVisible} className="justify-center items-center flex-1 h-full w-full" onBackButtonPress={()=>setModalVisible(false)} onBackdropPress={()=>setModalVisible(false)}>
        <View className=" h-40  justify-center items-center bg-sky-950 w-[80%] mr-8 rounded-xl">
            
            <TextInput onChangeText={setPlaylistName}  value={playlistName} placeholder="Enter Playlist Name" onSubmitEditing={addPlaylists} className="bg-slate-50 w-[80%] rounded-lg p-4 mt-4 mr-4"/>
            <TouchableOpacity className="m-4 left-20" onPress={addPlaylists}>
                <View className="justify-end items-end bg-blue-600 p-2 px-4 rounded-lg">
                    <Text className="text-slate-300 ">Add</Text>
                </View>
            </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Playlist