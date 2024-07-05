import React, { useEffect } from 'react';
import { Animated, Easing, View,Text } from 'react-native';
import { Marquee } from '@animatereactnative/marquee';

const MovingText = ({ text, animationThreshold, style,spacing }) => {
    if(text&&text.length<animationThreshold){
        return(
            <Text style={style}>{text}</Text> 
        )
    }
    return (
        <Marquee spacing={spacing||100} speed={1} className="w-full" style={{
            width:'90%'
        }}>
          <Text style={style}>{text}</Text>
        </Marquee>
      );
};

export default MovingText;
