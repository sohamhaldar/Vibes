import { View, Text, ScrollView,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import SideListItem from '../../../components/sideListItem';
import SideList from '../../../components/sideList';
import axios from 'axios';
import Vibes from '../../../assets/Vibes.png';

const Home = () => {
  const [PopHits,setPopHits]=useState([]);
  const [SweetheartPop,setSweetheartPop]=useState([]);
  const [PopCertified,setPopCertified]=useState([]);
  const [PopBiggestHits,setPopBiggestHits]=useState([]);
  const [TopHitsGlobal,setTopHitsGlobal]=useState([]);
  const [TopHitsIndia,setTopHitsIndia]=useState([]);
  const [isLoading,setLoading]=useState(true);
  const [error, setError] = useState(null);

  // const baseUrl='https://ytmusic-api-h2id.onrender.com';
  const baseUrl='http://localhost:8000';
  const TopHitsGlobalReq=axios.get(`https://yt.lemnoslife.com/noKey/playlistItems?part=snippet&playlistId=PL4fGSI1pDJn5kI81J1fYWK5eZRl1zJ5kM&maxResults=50`)
  const TopHitsIndiaReq=axios.get(`https://yt.lemnoslife.com/noKey/playlistItems?part=snippet&playlistId=PL4fGSI1pDJn40WjZ6utkIuj2rNg-7iGsq&maxResults=50`)
  const PopHitsReq=axios.get(`https://yt.lemnoslife.com/noKey/playlistItems?part=snippet&playlistId=RDCLAK5uy_nSq67AJ2d75MFNJ3j_4ClEtSgC-opBM84&maxResults=50`)
  const SweetheartPopReq=axios.get(`https://yt.lemnoslife.com/noKey/playlistItems?part=snippet&playlistId=RDCLAK5uy_l1oO11DBO4FD8U7bOrqUKK5Y_PkISUMQM&maxResults=50`)
  const PopCertifiedReq=axios.get(`https://yt.lemnoslife.com/noKey/playlistItems?part=snippet&playlistId=RDCLAK5uy_lBNUteBRencHzKelu5iDHwLF6mYqjL-JU&maxResults=50`)
  const PopBiggestHitsReq=axios.get(`https://yt.lemnoslife.com/noKey/playlistItems?part=snippet&playlistId=RDCLAK5uy_nmS3YoxSwVVQk9lEQJ0UX4ZCjXsW_psU8&maxResults=50`)
  

  // useEffect(()=>{
  //   setLoading(true);
    
  //   axios.all([PopHitsReq,PopBiggestHitsReq,PopCertifiedReq,SweetheartPopReq,TopHitsGlobalReq,TopHitsIndiaReq]).then(axios.spread((...responses)=>{
  //     // console.log('POPHITS: ',responses[0].data[0]);
  //     setPopHits(responses[0].data.items);
  //     setPopBiggestHits(responses[1].data.items);
  //     setPopCertified(responses[2].data.items);
  //     setSweetheartPop(responses[3].data.items);
  //     setTopHitsGlobal(responses[4].data.items);
  //     setTopHitsIndia(responses[5].data.items);

    
  //     setLoading(false);
  //   })).catch((e)=>console.log(e))
  // },[])
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .all([PopHitsReq, PopBiggestHitsReq, PopCertifiedReq, SweetheartPopReq, TopHitsGlobalReq, TopHitsIndiaReq])
      .then(
        axios.spread((...responses) => {
          try {
            
            setPopHits(responses[0].data.items || []);
            setPopBiggestHits(responses[1].data.items || []);
            setPopCertified(responses[2].data.items || []);
            setSweetheartPop(responses[3].data.items || []);
            setTopHitsGlobal(responses[4].data.items || []);
            setTopHitsIndia(responses[5].data.items || []);
          } catch (e) {
            setError('Failed to parse response data');
          }
          setLoading(false);
        })
      )
      .catch((e) => {
        setError(e.message || 'An error occurred while fetching data');
        setLoading(false);
      });
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
      <StatusBar/>
      <View className="w-full h-full">
        <View className="h-20 justify-between p-4 item flex items-center">
          <Image source={Vibes} className="h-12 w-10 m-2"/>
          {/* <Text className="text-3xl text-slate-50 font-bold">Home</Text> */}
          
        </View>
        <ScrollView className="" contentContainerStyle={{paddingBottom:160}}>
          <Text className="text-2xl text-slate-50 font-semibold mt-2 mr-2 ml-2">Top Charts Global</Text>
          <SideList songs={TopHitsGlobal} isLoading={isLoading} listType={1}/>
          <Text className="text-2xl text-slate-50 font-semibold mt-2 mr-2 ml-2">Top Charts India</Text>
          <SideList songs={TopHitsIndia} isLoading={isLoading} listType={1}/>
          <Text className="text-2xl text-slate-50 font-semibold mt-2 mr-2 ml-2">Pop Certified</Text>
          <SideList songs={PopCertified} isLoading={isLoading} listType={1}/>
          <Text className="text-2xl text-slate-50 font-semibold mt-2 mr-2 ml-2">Pop Hits</Text>
          <SideList songs={PopHits} isLoading={isLoading} listType={1}/>
          <Text className="text-2xl text-slate-50 font-semibold mt-2 mr-2 ml-2">Sweetheart Pop</Text>
          <SideList songs={SweetheartPop} isLoading={isLoading} listType={1}/>
          <Text className="text-2xl text-slate-50 font-semibold mt-2 mr-2 ml-2">Pop Biggest Hits</Text>
          <SideList songs={PopBiggestHits} isLoading={isLoading} listType={1}/>
        </ScrollView>
      </View>
    </SafeAreaView>
    
  )
}

export default Home;