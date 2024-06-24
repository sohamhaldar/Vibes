import { View, Text, Image, TouchableOpacity } from 'react-native';
import React,{useState} from 'react';
import * as Animatable from 'react-native-animatable';
import HandlePlay from '../service/demo';
import { useActiveQueue, useActiveQueueStore } from '../store/queue';
import {AntDesign} from '@expo/vector-icons';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import colors from 'tailwindcss/colors';

const SideListItem2 = ({ item,onTrackSelect,onFavClick,IsFav,InPlaylist,PlaylistControls}) => {
    const [visible, setVisible] = useState(false);
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);
    // const i={
    //     "videoId": "cF1Na4AIecM",
    //     "url": "https://ytmusic-api-h2id.onrender.com/play/cF1Na4AIecM",
    //     "title": "Please Please Please",
    //     "headers": {
    //         "range": "bytes=0-"
    //     },
    //     "artist": "Sabrina Carpenter",
    //     "artists": [
    //         {
    //             "name": "Sabrina Carpenter",
    //             "id": "UCz51ZodJbYUNfkdPHOjJKKw"
    //         }
    //     ],
    //     "album": "32M views",
    //     "artwork": "https://i.ytimg.com/vi/cF1Na4AIecM/hq720.jpg?sqp=-oaymwEXCNUGEOADIAQqCwjVARCqCBh4INgESFo&rs=AMzJL3nckBR-9eAaZg4yguf-2tOCFrs52A",
    //     "duration": 263
    // }
    
    let author = '';
    let isLoading=true;
    // console.log(item)
    if(item!='-1')isLoading=false
    
    if (item) {
        if (Array.isArray(item.artists)) {
            author = item.artists.map(i => i.name).join(', ');
        } else {
            author = item.artists?.name || '';
        }
    }
    const onclick=()=>{
        console.log(item);
        onTrackSelect(item.videoId);
    }
    const removeFromFav=async()=>{
        onFavClick(item,IsFav);
        hideMenu();
    }
    const playlistAddRemove=async()=>{
        hideMenu();
        await PlaylistControls(item);
    }
    
    return (
        <TouchableOpacity onPress={onclick}>
            <View className="h-24 justify-between items-center top-2 w-full rounded-lg overflow-hidden flex-row">
                <Image source={{
                    uri:item.artwork
                }} className="w-[20%] h-[80%] m-1 mx-2 ml-3 rounded-md" />
                <View className="w-[55%] h-[90%] m-1 ">
                    <Text ellipsizeMode="tail"
                    numberOfLines={1}
                    className="text-slate-50 flex-1 ml-1 truncate mt-2 text-lg">{item.title}</Text>
                    <Text ellipsizeMode="tail"
                    numberOfLines={1}
                    className="text-gray-400/80 mb-2 ml-1 flex-1">{item?.artist}</Text>
                </View>
                <TouchableOpacity className="w-[10%]" onPress={showMenu}>
                <View className="justify-center items-center w-full mr-2">
                    <AntDesign name="ellipsis1" size={30} color={colors.slate[300]} style={
                        {
                            right:10
                        }
                    } />
                </View>
                </TouchableOpacity>
                <Menu
                visible={visible}
                onRequestClose={hideMenu} className="w-[60%]"
                
            >
                <MenuItem onPress={playlistAddRemove}>
                        <View className="flex-row justify-center items-center">
                            <AntDesign name="plus" size={30} color={colors.slate[600]} /> 
                            <Text className="m-2 mx-4 text-slate-600">{!InPlaylist?'Add To Playlists':'Remove It'}</Text>
                        </View>
                </MenuItem>
                <MenuItem onPress={removeFromFav}>
                        <View className="flex-row justify-center items-center">
                            <AntDesign name="heart" size={25} color={colors.slate[600]} /> 
                            <Text className="m-2 text-slate-600 text-sm flex-1" ellipsizeMode="tail" numberOfLines={2}>{!IsFav?"Add To Favourites":"Remove From Favs"}</Text>
                        </View>
                </MenuItem>
                <MenuItem onPress={hideMenu}>
                        <View className="flex-row justify-center items-center">
                            <AntDesign name="menu-unfold" size={30} color={colors.slate[600]} /> 
                            <Text className="m-2 mx-4 text-slate-600">Add To Queue</Text>
                        </View>
                </MenuItem>
                <MenuDivider />
                <MenuItem onPress={hideMenu} className="mx-4 ">Close</MenuItem>
            </Menu>    
            </View>
        </TouchableOpacity>
    )
};

export default SideListItem2;
