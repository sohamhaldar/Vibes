import { View, Text,Pressable,TouchableOpacity } from 'react-native'
import React,{useState} from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTrackPlayerRepeatMode } from '../service/useTrackRepeatMode';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import Modal from "react-native-modal";
import colors from 'tailwindcss/colors';

const RepeatModeToggle = () => {

    const{repeatMode,changeRepeatMode}=useTrackPlayerRepeatMode();
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleRepeat = (repeatMode) => {
        changeRepeatMode(repeatMode);
        setModalVisible(false);
    };
    const iconMap={
        0:'repeat-off',
        1:'repeat-once',
        2:'repeat'
    }
    return (
        <View>
        <TouchableOpacity onPress={()=>setModalVisible(true)}>
            <MaterialCommunityIcons name={iconMap[repeatMode]} size={40} color="#f1f5f9"/>
        </TouchableOpacity>
        <Modal isVisible={isModalVisible} className="justify-end flex-1" onBackButtonPress={()=>setModalVisible(false)} onBackdropPress={()=>setModalVisible(false)}>
            <View className=" h-60 w-full justify-center items-center">
            <Pressable className="w-full items-center" onPress={()=>toggleRepeat(RepeatMode.Queue)}>
                <View className="flex-row justify-center m-2 mx-4 items-center bg-stone-400 rounded-md p-2 w-full">
                <MaterialCommunityIcons name="repeat" size={40} color={colors.slate[100]} />
                <Text className="text-slate-300 text-3xl m-2 mr-4">Play in Queue</Text>
                </View>
            </Pressable>
            <Pressable className="w-full items-center" onPress={()=>toggleRepeat(RepeatMode.Track)}>
                <View className="flex-row justify-center m-2 items-center bg-stone-400 rounded-md p-2 w-full">
                <MaterialCommunityIcons name="repeat-once" size={40} color={colors.slate[100]} />
                <Text className="text-slate-300 text-3xl m-2 mr-4">Repeat the Track</Text>
                </View>
            </Pressable>
            <Pressable className=" w-full items-center" onPress={()=>toggleRepeat(RepeatMode.Off)}>
                <View className="flex-row justify-center m-2 items-center bg-stone-400 rounded-md p-2 w-full">
                    <MaterialCommunityIcons name="repeat-off" size={40} color={colors.slate[100]} />
                    <Text className="text-slate-300 text-3xl m-2">Play Once</Text>
                </View>
            </Pressable>
        </View>
      </Modal>
    </View>
    )
}

export default RepeatModeToggle