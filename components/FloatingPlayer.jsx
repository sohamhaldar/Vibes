import { Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import TrackPlayer, { useIsPlaying,useActiveTrack } from 'react-native-track-player';
import { MaterialIcons } from '@expo/vector-icons';
import { useLastActiveTrack } from '../service/useLastActiveTrack';
import { useRouter } from 'expo-router';

const FloatingPlayer = ({ style }) => {
    const router=useRouter();

    const { playing } = useIsPlaying();
    const currentTrack=useActiveTrack();
    const lastActiveTrack=useLastActiveTrack();
    const activeTrack=currentTrack??lastActiveTrack;
    if(!activeTrack) return null;
    const item = {
        "videoId": "cF1Na4AIecM",
        "url": "http://localhost:8000/cF1Na4AIecM",
        "title": "Please Please Please",
        "artist": "Sabrina Carpenter",
        "artists": [
            {
                "name": "Sabrina Carpenter",
                "id": "UCz51ZodJbYUNfkdPHOjJKKw"
            }
        ],
        "album": "29M views",
        "artwork": "https://i.ytimg.com/vi/cF1Na4AIecM/hq720.jpg?sqp=-oaymwEXCNUGEOADIAQqCwjVARCqCBh4INgESFo&rs=AMzJL3nckBR-9eAaZg4yguf-2tOCFrs52A",
        "duration": 263
    };
    const handlePress=()=>{
        router.navigate('/Player');
    }

    return (
        <TouchableOpacity onPress={handlePress} style={[{ height: 80, width: '100%' }, style]}>
            <View className="h-20 w-full flex-row items-center bg-slate-500">
                <Image source={{ uri:activeTrack?.artwork||item.artwork }} className="h-16 w-16 rounded-md ml-2" />
                <View className=" h-full  w-[60%] mx-2 pt-1 pb-1 ml-3">
                    <Text ellipsizeMode="tail" numberOfLines={1} className="text-slate-50 flex-1 mb-1 mx-1 text-lg">
                        {activeTrack?.title||item.title}
                    </Text>
                    <Text ellipsizeMode="tail" numberOfLines={1} className="text-gray-300/80 mb-0.5 ml-1 flex-1 text-md">
                        {activeTrack?.artist||item.artist}
                    </Text>
                </View>
                <TouchableOpacity onPress={playing ? TrackPlayer.pause : TrackPlayer.play}>
                    <MaterialIcons name={playing ? "pause" : "play-arrow"} size={55} color="#f1f5f9" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

export default FloatingPlayer;
