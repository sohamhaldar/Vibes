import { View, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useActiveQueue, useQueue } from '../store/queue';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import SideListItem2 from '../components/sideListItem2';
import { useLocalSearchParams } from 'expo-router';

const QueueScreen = () => {
  const { activeQueue, removeFromActiveQueue, addToActiveQueue } = useActiveQueue();
  const currentTrack = useActiveTrack();
  const { favouriteQueue, addToFavouriteQueue, removeFromFavouriteQueue } = useQueue();
  const [loading, setLoading] = useState(true);
  const {index}=useLocalSearchParams();
  // console.log(index);
  const [activeTrackIndex, setActiveTrackIndex] = useState(index);
  const scrollRef = useRef(null);
  const getActiveIndex = async () => {
    const index = activeQueue.findIndex((track) => track.id === currentTrack?.id);
    setActiveTrackIndex(index);
  };

  useEffect(() => {
    const initialize = async () => {
      await getActiveIndex();
      // scrollToCurrentTrack();
      setLoading(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (currentTrack) {
      // console.log(activeQueue);
      const index1 = activeQueue.findIndex((item) => item.videoId === currentTrack.videoId);
      if (scrollRef) {
        scrollRef.current.scrollToIndex({ index: index1, animated: true });
      }
      setActiveTrackIndex(index1);
    }
  }, [currentTrack, activeQueue]);

  const onFavClick = async (item, isFav) => {
    if (isFav) {
      await removeFromFavouriteQueue(item.videoId);
    } else {
      await addToFavouriteQueue(item);
    }
  };

  const removeFromQueue = async (song, isAdded) => {
    if (isAdded) {
      await removeFromActiveQueue(song);
    } else {
      await addToActiveQueue(song);
    }
  };

  const handleTrackSelect = async (videoId) => {
    const queue = await TrackPlayer.getQueue();
    const index = queue.findIndex((i) => i.videoId == videoId);
    await TrackPlayer.skip(index);
  };
  const scrollToCurrentTrack = () => {
    if (currentTrack && scrollRef.current) {
      const index = activeQueue.findIndex((item) => item.videoId === currentTrack.videoId);
      if (index !== -1) {
        scrollRef.current.scrollToIndex({ index: index, animated: true }); 
      }
      setActiveTrackIndex(index);
    }
  };

  const renderQueueItem = ({ item }) => {
    const isFav = favouriteQueue.some((i) => i.videoId === item.youtubeId || i.videoId === item.videoId);

    return (
      <SideListItem2
        key={item.videoId}
        isCurrent={currentTrack?.videoId === item.videoId}
        item={item}
        onTrackSelect={handleTrackSelect}
        onFavClick={onFavClick}
        IsFav={isFav}
        InPlaylist={false}
        isAdded={true}
        QueueBtnClicked={removeFromQueue}
      />
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-700">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-700 pb-2">
      <FlatList
        ref={scrollRef}
        data={activeQueue}
        ListEmptyComponent={<View className="flex-1 justify-center items-center bg-slate-700">
                 <ActivityIndicator size="large" color="#ffffff" />
              </View>}
        
        renderItem={renderQueueItem}
        keyExtractor={(item) => item.videoId}
        initialScrollIndex={index<8&&activeQueue.length<8?0:index}
        getItemLayout={(data, index) => ({ length: 96, offset: 96 * index, index })}
      />
    </View>
  );
};

export default QueueScreen;
