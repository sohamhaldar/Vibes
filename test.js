import ytdl from "ytdl-native"

const youtubeURL = 'http://www.youtube.com/watch?v=04GiqLjRO3A';
const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });
console.log(urls)