import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React,{useState} from 'react';
import { data } from '../temp';
import {AntDesign} from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import music from '../assets/music.png';
import TrackPlayer from 'react-native-track-player';
import { Plane,Wave } from 'react-native-animated-spinkit'
import { baseUrl } from '../constants/base';
import MovingText from './MovingText';

const LongListItem = ({removePlaylists,item,onTrackSelect,onFavClick,onPlaylistClick,type,isFav,isSearch,onAddToQueue,addedToQueue,isCurrent}) => {
    const [visible, setVisible] = useState(false);
    const [IsFav, setIsFav] = useState(isFav);
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);
    let author = '';
    let artistId='';
    let isLoading=true;
    // console.log(item)
    if(item!='-1')isLoading=false
    let option1;
    let option2;
    let option3;
    if(type=='songs'){
        option1='Add To Playlists',
        option2=!IsFav?"Add To Favourites":"Remove From Favs",
        option3=!addedToQueue?'Add To Queue':'Remove from Que'
    }
    else if(type=='playlists'){
        option1='Remove Playlists',
        option2='Play Now',
        option3=!addedToQueue?'Add To Queue':'Remove from Queue'
    }
    
    if (item) {
        if (Array.isArray(item.artists)) {
            author = item.artists.map(i => i.name).join(', ');
            artistId = item.artists.map(i => i.id).join(', ');
        } else {
            author = item.artists?.name ||item?.artist|| '';
        }
    }
    const onclick=()=>{
        // console.log(item.playlistId);
        onTrackSelect(item.youtubeId||item.artistId||item.playlistId,item.title||item.name);
    }
    const addToFav=async()=>{
        console.log(isFav);
        onFavClick(item,IsFav);
        setIsFav(!isFav);
        hideMenu();
    }
    const option1Clicked=async()=>{
        if(type=='songs'){
            await onPlaylistClick(item)
            hideMenu();
        }else if(type=='playlists'){
            await removePlaylists(item);
            hideMenu();
        }
    }
    const option3Clicked=async()=>{
        const song={
            url:`${baseUrl}/play/${item.videoId||item.youtubeId}`,
            title:item.title,
            artist:author,
            duration:item.duration||item.duration.totalSeconds,
            artwork:item.artwork||item.thumbnailUrl||music,
            headers:{
                "range": "bytes=0-"
            },
            artistId:artistId,
            videoId:item.videoId||item.youtubeId
        }
        onAddToQueue(song,addedToQueue);
        hideMenu();
    }
  return (
    <TouchableOpacity onPress={onclick}>
        <View className={`w-full h-24 flex-row items-center justify-evenly m-1 ${isCurrent&&'bg-blue-500'}`}>
            <View className="w-[20%] h-[80%] m-1 mx-2 ml-3 rounded-md relative justify-center items-center">
                <Image source={item.thumbnailUrl ? { uri: item.thumbnailUrl } : item.artwork ? { uri: item.artwork } : music} className="w-full h-full rounded-md"/>
                <Wave size={48} color={colors.slate[300]} className={`absolute ${isCurrent?'block':'hidden'}`}/>
            </View>
            <View className="mt-1 pt-1 pb-1 h-20 w-60 ">
                {!isCurrent?(<Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        className="text-slate-50 flex-1 ml-1 truncate"
                    >
                        {item.title||item?.name}
                </Text>):
                (<MovingText animationThreshold={25} style={{
                                fontSize:15,
                                marginLeft:4,
                                color:colors.slate[50]
                            }} text={item.title||item.name} spacing={50}/>)}
                <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        className="text-gray-300/80 mb-2 ml-1 flex-1"
                    >
                        {author||item?.subscribers||`${item?.totalSongs} songs`}
                </Text>
            </View>
            {type!='artists'&&type!='albums'&&(<TouchableOpacity className="w-[10%]" onPress={showMenu}>
                <View className="justify-center items-center w-full mr-2">
                        <AntDesign name="ellipsis1" size={30} color={colors.slate[300]} style={
                            {
                                right:10
                            }
                        } />
                </View> 
            </TouchableOpacity>)}
            <Menu
                visible={visible}
                onRequestClose={hideMenu} className="w-[60%]"
                
            >
                {(type!='playlists'&&isSearch)||(type=='playlists'&&!isSearch)?(<MenuItem onPress={option1Clicked}>
                        <View className="flex-row justify-center items-center">
                            <AntDesign name={`${type=='playlists'?'minus':'plus'}`} size={30} color={colors.slate[600]} /> 
                            <Text className="m-2 mx-4 text-slate-600">{option1}</Text>
                        </View>
                </MenuItem>):''}
                <MenuItem onPress={addToFav}>
                        <View className="flex-row justify-center items-center">
                            <AntDesign name="heart" size={25} color={colors.slate[600]} /> 
                            <Text className="m-2 text-slate-600 text-sm flex-1" ellipsizeMode="tail" numberOfLines={2}>{option2}</Text>
                        </View>
                </MenuItem>
                <MenuItem onPress={option3Clicked}>
                        <View className="flex-row justify-center items-center">
                            <AntDesign name="menu-unfold" size={30} color={colors.slate[600]} /> 
                            <Text className="m-2 mx-4 text-slate-600">{option3}</Text>
                        </View>
                </MenuItem>
                <MenuDivider />
                <MenuItem onPress={hideMenu} className="mx-4 ">Close</MenuItem>
            </Menu> 
        </View>
    </TouchableOpacity>
  )
}

export default LongListItem

