import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';

function parseArtistAndTitle(inputString) {
    // Split the input string at the first occurrence of " - "
    const [artist, titleWithDetails] = inputString.split(' - ', 2);
    
    // Remove any additional details in parentheses from the title
    // const title = titleWithDetails.replace(/\(.*\)/, '').trim();
    
    return {
        artist: artist?.trim(),
        title: titleWithDetails?.trim()
    };
}


const SideListItem = ({ item,onTrackSelect}) => {
    // const i={
    //     "kind": "youtube#playlistItem",
    //     "etag": "NotImplemented",
    //     "snippet": {
    //         "publishedAt": 1706089223,
    //         "title": "Benson Boone - Beautiful Things (Official Music Video)",
    //         "thumbnails": [
    //             {
    //                 "url": "https://i.ytimg.com/vi/Oa_RSwwpPaA/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLBKxQQSaTNkGi5lRX4A_jPJI0jnqw",
    //                 "width": 168,
    //                 "height": 94
    //             },
    //             {
    //                 "url": "https://i.ytimg.com/vi/Oa_RSwwpPaA/hqdefault.jpg?sqp=-oaymwEiCMQBEG5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLCtvOqHRW9Sas18wvJsY2AfcLKjGw",
    //                 "width": 196,
    //                 "height": 110
    //             },
    //             {
    //                 "url": "https://i.ytimg.com/vi/Oa_RSwwpPaA/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDWNWDm3vKbAb13JX3plBYWNYzB3A",
    //                 "width": 246,
    //                 "height": 138
    //             },
    //             {
    //                 "url": "https://i.ytimg.com/vi/Oa_RSwwpPaA/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDQybrUvgpHIbM5LikJKgPQQ_bZAw",
    //                 "width": 336,
    //                 "height": 188
    //             }
    //         ],
    //         "resourceId": {
    //             "kind": "youtube#video",
    //             "videoId": "Oa_RSwwpPaA"
    //         }
    //     }
    // }
    const onclick=()=>{
        console.log('clicked',item);
        console.log('id:',item.snippet.resourceId.videoId)
        onTrackSelect(item.snippet.resourceId.videoId);
    }
    let author = 'Unknown';
    let isLoading=true;
    // console.log(item)
    if(item!='-1')isLoading=false
    let result;
    if(item.snippet){
        result = parseArtistAndTitle(item.snippet.title);
    }
    
    
    
    return !isLoading ? (
        <TouchableOpacity onPress={onclick}>
            <View className="h-52 justify-between top-2 w-44 rounded-lg overflow-hidden m-2">
                <Image
                    source={{ uri: item.snippet.thumbnails[item.snippet.thumbnails.length-1].url }}
                    resizeMode="stretch"
                    className="h-36 w-full bg-white"
                />
                <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    className="text-slate-50 flex-1 ml-1 truncate"
                >
                    {result.title}
                </Text>
                <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    className="text-gray-400/80 mb-2 ml-1 flex-1"
                >
                    {result.artist||author}
                </Text>
            </View>
        </TouchableOpacity>
    ) : (
        <View className="h-52 justify-between top-2 w-44 rounded-lg overflow-hidden m-2">
            <View className="relative items-center justify-center">
                <View className="h-36 w-full bg-white"/>
                <Animatable.View
                    animation="fadeInLeft"
                    easing="linear"
                    iterationCount="infinite"
                    delay={200}
                    className="absolute bg-slate-200 h-32 w-[90%]"
                />
            </View>
            
            <Animatable.View
                animation="pulse"
                easing="linear"
                iterationCount="infinite"
                style={{ height: 16, width: '100%', backgroundColor: '#e5e7eb', marginTop: 8 }}
            />
            <Animatable.View
                animation="pulse"
                easing="linear"
                iterationCount="infinite"
                style={{ height: 16, width: '100%', backgroundColor: '#e5e7eb', marginTop: 8 }}
            />
        </View>
    );
};

export default SideListItem;
