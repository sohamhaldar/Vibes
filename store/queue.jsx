import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TrackPlayer from 'react-native-track-player';
import { baseUrl } from '../constants/base';

// Active Queue Store
export const useActiveQueueStore = create(
    persist(
        (set) => ({
            activeQueueId: null,
            activeQueue: [],
            setActiveQueueId: (id) => set({ activeQueueId: id }),
            addToActiveQueue: async (track) => {
                set((state) => ({
                    activeQueue: [...state.activeQueue, track]
                }));
                await TrackPlayer.add(track);
            },
            removeFromActiveQueue: async (track) => {
                set((state) => ({
                    activeQueue: state.activeQueue.filter((song) => song.videoId !== track.videoId)
                }));
                const Queue = await TrackPlayer.getQueue();
                const Index = Queue.findIndex((song) => song.videoId === track.videoId);
                await TrackPlayer.remove(Index);
            },
            setActiveQueue: async (Queue, index) => {
                console.log('found the queue');
                if (index) {
                    console.log('entered custom');
                    const before = Queue.slice(0, index);
                    const selected = Queue.slice(index, index + 1);
                    let after;
                    if(Queue.length-1>index){
                        after = Queue.slice(index + 1);
                    }
                    
                    console.log('fav: ', selected);
                    let newQueue=[...selected,...before];
                    if(Queue.length-1>index){
                        newQueue = [...selected,...after, ...before];
                    }
                    set({ activeQueue: newQueue });
                    await TrackPlayer.reset();
                    await TrackPlayer.add(selected);
                    if(Queue.length-1>index){
                        await TrackPlayer.add(after);
                    }
                    
                    await TrackPlayer.add(before);

                    await TrackPlayer.play();
                } else {
                    console.log('normal Queue');
                    set({ activeQueue: Queue });
                    await TrackPlayer.reset();
                    await TrackPlayer.add(Queue);
                    await TrackPlayer.play();
                }
            },
            searchAsync: async (videoId) => {
                console.log(videoId);
                const baseUrl = 'http://127.0.0.1:8000';
                const songs = await axios.post(`${baseUrl}/current`, {
                    videoId,
                    baseUrl
                });
                console.log(songs.data);
                await TrackPlayer.reset();
                await TrackPlayer.add(songs.data);
                await TrackPlayer.play();
                set({ activeQueue: songs.data });
            }
        }),
        {
            name: 'active-queue-store', // unique name
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);

export const useActiveQueue = () => useActiveQueueStore((state) => ({
    activeQueueId: state.activeQueueId,
    setActiveQueueId: state.setActiveQueueId,
    activeQueue: state.activeQueue,
    setActiveQueue: state.setActiveQueue,
    addToActiveQueue: state.addToActiveQueue,
    removeFromActiveQueue: state.removeFromActiveQueue,
    searchAsync: state.searchAsync,
}));

// Queue Store
export const useQueueStore = create(
    persist(
        (set) => ({
            favouriteQueue: [],
            favouriteQueueId: 'favourites',
            playlistQueue: {},
            addToFavouriteQueue: async (track) => {
                let song;
                if (track.youtubeId) {
                    let author;
                    let artistId;
                    if (Array.isArray(track.artists)) {
                        author = track.artists.map(i => i.name).join(', ');
                        artistId = track.artists.map(i => i.id).join(', ');
                    } else {
                        author = track.artists?.name || '';
                    }
                    song = {
                        url: `${baseUrl}/play/${track.youtubeId}`,
                        title: track.title,
                        artist: author,
                        duration: track.duration.totalSeconds,
                        artwork: track.thumbnailUrl,
                        headers: {
                            "range": "bytes=0-"
                        },
                        artistId: artistId,
                        videoId: track.youtubeId
                    };
                } else {
                    song = track;
                }
                set((state) => ({
                    favouriteQueue: [...state.favouriteQueue, song]
                }));
                await TrackPlayer.add(song);
            },
            removeFromFavouriteQueue: async (videoId, isFavPlaying) => {
                let music;
                set((state) => ({
                    favouriteQueue: state.favouriteQueue.filter((song) => {
                        if (song.videoId !== videoId) {
                            music = song;
                            return song;
                        }
                    })
                }));
                if (isFavPlaying) {
                    const TrackId = await (await TrackPlayer.getQueue()).findIndex((i) => i.videoId == videoId);
                    TrackPlayer.remove(TrackId);
                }
            },
            addPlaylist: async (playlistName) => {
                set((state) => ({
                    playlistQueue: { ...state.playlistQueue, [playlistName]: [] }
                }));
            },
            addToPlaylist: async (playlistName, track) => {
                set((state) => {
                    const Queue = state.playlistQueue[playlistName] || [];
                    let song;
                    if (track.youtubeId) {
                        let author;
                        let artistId;
                        if (Array.isArray(track.artists)) {
                            author = track.artists.map(i => i.name).join(', ');
                            artistId = track.artists.map(i => i.id).join(', ');
                        } else {
                            author = track.artists?.name || '';
                        }
                        song = {
                            url: `${baseUrl}/${track.youtubeId}`,
                            title: track.title,
                            artist: author,
                            duration: track.duration.totalSeconds,
                            artwork: track.thumbnailUrl,
                            headers: {
                                "range": "bytes=0-"
                            },
                            artistId: artistId,
                            videoId: track.youtubeId
                        };
                    } else {
                        song = track;
                    }
                    return {
                        playlistQueue: { ...state.playlistQueue, [playlistName]: [...Queue, song] }
                    };
                });
            },
            removeFromPlaylist: async (playlistName, track) => {
                set((state) => {
                    const Queue = state.playlistQueue[playlistName];
                    if (!Queue) return;
                    return {
                        playlistQueue: {
                            ...state.playlistQueue,
                            [playlistName]: Queue.filter((song) => song.videoId !== track.videoId)
                        }
                    };
                });
            },
            removePlaylist: async (playlistName) => {
                set((state) => {
                    const playlists = { ...state.playlistQueue };
                    delete playlists[playlistName];
                    return { playlistQueue: playlists };
                });
            },
        }),
        {
            name: 'queue-store', // unique name
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);

export const useQueue = () => useQueueStore((state) => ({
    favouriteQueue: state.favouriteQueue,
    favouriteQueueId: state.favouriteQueueId,
    playlistQueue: state.playlistQueue,
    addToFavouriteQueue: state.addToFavouriteQueue,
    removeFromFavouriteQueue: state.removeFromFavouriteQueue,
    addPlaylist: state.addPlaylist,
    addToPlaylist: state.addToPlaylist,
    removeFromPlaylist: state.removeFromPlaylist,
    removePlaylist: state.removePlaylist,
}));
