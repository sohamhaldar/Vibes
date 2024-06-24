import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const FavouriteLayout = () => {
  return (
    <Stack>
        
        <Stack.Screen name="index" options={{
            headerShown:false
        }}/><Stack.Screen name="Artist" options={{
            headerShown:false
        }}/>
    </Stack>
  )
}

export default FavouriteLayout;