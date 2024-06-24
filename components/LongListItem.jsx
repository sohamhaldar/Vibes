import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React,{useState} from 'react';
import { data } from '../temp';
import {AntDesign} from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import music from '../assets/music.png'

const LongListItem = ({item,onTrackSelect,onFavClick,onPlaylistClick,type,isFav,isSearch}) => {
    const [visible, setVisible] = useState(false);
    const [IsFav, setIsFav] = useState(isFav);
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);
    let author = '';
    let isLoading=true;
    // console.log(item)
    if(item!='-1')isLoading=false
    let option1;
    let option2;
    let option3;
    if(type=='songs'){
        option1='Add To Playlists',
        option2=!IsFav?"Add To Favourites":"Remove From Favs",
        option3='Add To Queue'
    }
    else if(type=='playlists'){
        option1='Remove Playlists',
        option2='Play Now',
        option3='Add To Queue'
    }
    
    if (item) {
        if (Array.isArray(item.artists)) {
            author = item.artists.map(i => i.name).join(', ');
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
        }

    }
  return (
    <TouchableOpacity onPress={onclick}>
        <View className="w-full h-24 flex-row items-center justify-evenly m-1">
            <Image source={item.thumbnailUrl ? { uri: item.thumbnailUrl } : item.artwork ? { uri: item.artwork } : music} className="h-20 w-20 rounded-md"/>
            <View className="mt-1 pt-1 pb-1 h-20 w-60 ">
                <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        className="text-slate-50 flex-1 ml-1 truncate"
                    >
                        {item.title||item?.name}
                </Text>
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
                            <AntDesign name="plus" size={30} color={colors.slate[600]} /> 
                            <Text className="m-2 mx-4 text-slate-600">{option1}</Text>
                        </View>
                </MenuItem>):''}
                <MenuItem onPress={addToFav}>
                        <View className="flex-row justify-center items-center">
                            <AntDesign name="heart" size={25} color={colors.slate[600]} /> 
                            <Text className="m-2 text-slate-600 text-sm flex-1" ellipsizeMode="tail" numberOfLines={2}>{option2}</Text>
                        </View>
                </MenuItem>
                <MenuItem onPress={hideMenu}>
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

