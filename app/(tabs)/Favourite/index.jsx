import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActiveQueue, useQueue } from '../../../store/queue';
import SideListItem2 from '../../../components/sideListItem2';
import {Entypo} from '@expo/vector-icons'
import colors from 'tailwindcss/colors';

const Favourite = () => {
  const{favouriteQueue,removeFromFavouriteQueue}=useQueue();
  const {setActiveQueue,setActiveQueueId}=useActiveQueue();
  const handleTrackSelect=async(videoId)=>{
    console.log('Fav queue',favouriteQueue);
    console.log('videoId:',videoId);
    const index=await favouriteQueue.findIndex((i)=>i.videoId==videoId);
    console.log('index:',index);
    await setActiveQueue(favouriteQueue,index);
    await setActiveQueueId('favourites')
  }
  const onFavClick=async(item)=>{
    console.log(item);
    await removeFromFavouriteQueue(item.videoId,true);
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
      <View className="w-full h-full">
        <View className="h-20 justify-center p-4 item">
          <Text className="text-3xl text-slate-50 font-bold">Favourites</Text>
        </View>
        {favouriteQueue.length==0?(<View className="w-full h-[80%] justify-center items-center">
          <Entypo name="emoji-sad" size={110} color={colors.slate[600]} />
          <Text className="text-lg text-slate-600 mt-4">Really?? No Favourites</Text>
          <Text className="text-xl text-slate-600">You need to listen more</Text>
        </View>):''}
        
        <FlatList
            data={favouriteQueue}
            renderItem={({ item}) => (
              <SideListItem2 item={item} onTrackSelect={handleTrackSelect} onFavClick={onFavClick} IsFav={true} InPlaylist={false}/>
            )}
            contentContainerStyle={{paddingBottom:140}}
          />
        
      </View>
    </SafeAreaView>
  )
}

export default Favourite;