import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

const HomeScreenLayout = () => {
  return (
      <Stack>
        <Stack.Screen name="index" options={{
            headerTitle:"Songs",
            headerShown:false
        }}/>
      </Stack>  
    )
}

export default HomeScreenLayout;