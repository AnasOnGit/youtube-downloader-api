const express = require("express");
const fs = require('fs');
const ytdl = require('ytdl-core');
const app = express();

// first video example
// app.get("/",(req,res)=>{
// 	ytdl('https://www.youtube.com/watch?v=lLiw3egVAZU&t=2s')
//   	.pipe(fs.createWriteStream('video.mp4'))
// 	res.send("Hello")
// })
 
// functions

const convertUrl = (url) => {
	if(url.includes("youtu.be")){
		let newUrlArray = url.split("https://youtu.be/")
		return `https://www.youtube.com/watch?v=${newUrlArray[1]}`
	}else{
		return url
	}
}

// videos
app.get("/video", async(req,res)=>{
	const videoId = convertUrl(req.query.videoId)
	let info = await ytdl.getInfo(videoId)
	res.json(info)
})

// audio
app.get("/audio", async(req,res)=>{
	const videoId = convertUrl(req.query.videoId)
	let info = await ytdl.getInfo(videoId)
	let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
	res.json(audioFormats)
})

app.listen(4000,console.log("working..."))