import { View, Text,FlatList } from 'react-native'
import React from 'react';
import { data } from '../temp';
import SideListItem from './sideListItem';
import SideListItem2 from './sideListItem2';
import HandlePlay from '../service/demo';
import { useActiveQueue } from '../store/queue';

const SideList = ({songs,isLoading,listType}) => {
  const{setActiveQueue}=useActiveQueue();
  console.log(songs[0])
  const RenderMe=listType==1?SideListItem:SideListItem2;
  const handleTrackSelect=async(videoId)=>{
    const data=await HandlePlay(videoId);
    console.log('data recieved');
    setActiveQueue(data);

  }
  return (
    <View className="w-full h-56">
        <FlatList 
        data={isLoading&&songs.length==0?['-1','-1','-1','-1','-1']:songs}
        renderItem={({ item}) => (
          <RenderMe item={item} onTrackSelect={handleTrackSelect}/>
        )}
        horizontal
        className="" />
    </View>
  )
}


export default SideList;