import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import {FontAwesome,MaterialCommunityIcons} from '@expo/vector-icons'
import colors from 'tailwindcss/colors';
import {BlurView} from 'expo-blur';
import { StyleSheet } from 'react-native'
import FloatingPlayer from '../../components/FloatingPlayer';

const TabIcon = ({ icon, color, name, focused }) => {
    return (
      <View className="flex items-center justify-center">
        <MaterialCommunityIcons name={icon} size={22} color={color}/>
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
          style={{ color: color }}
        >
          {name}
        </Text>
      </View>
    );
  };




const TabsNavigation = () => {
  return (
    <View className="flex-1 relative w-screen">
      <Tabs screenOptions={{
          headerShown:false,
          tabBarActiveTintColor:colors.blue[500],
          tabBarShowLabel:false,
          tabBarStyle: {
              position:'absolute',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 0,
        paddingTop: 8,
              height:60,
              backgroundColor:colors.slate[950],
              opacity:0.95
            },
          tabBarBackground:()=><BlurView intensity={40} style={{
              ...StyleSheet.absoluteFillObject,
              overflow: 'hidden',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              
              
          }}/>
      }}>
          <Tabs.Screen name="(Home)" options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon="home"
                  color={color}
                  name="Home"
                  focused={focused}
                />
              ),
            }}/>
          <Tabs.Screen name="Search" options={{
              title: "Search",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon="magnify"
                  color={color}
                  name="Search"
                  focused={focused}
                />
              ),
            }}/>          
          <Tabs.Screen name="Favourite" options={{
              title: "Favourite",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon="heart"
                  color={color}
                  name="Favourite"
                  focused={focused}
                />
              ),
            }}/>
          <Tabs.Screen name="playlists" options={{
              title: "playlists",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon="playlist-music"
                  color={color}
                  name="playlist"
                  focused={focused}
                />
              ),
            }}/>

      </Tabs>
      <FloatingPlayer className="absolute" style={{
        bottom:65,
        left:8,
        right:8,
        width:'100%'
      }}/>
    </View>
  )
}

export default TabsNavigation;