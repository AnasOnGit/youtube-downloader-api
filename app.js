const express = require("express");
const fs = require('fs');
const ytdl = require('ytdl-core');
const app = express();
var cors = require('cors')


app.use(cors())

// first video example
// app.get("/",(req,res)=>{
// 	ytdl('https://www.youtube.com/watch?v=lLiw3egVAZU&t=2s')
//   	.pipe(fs.createWriteStream('video.mp4'))
// 	res.send("Hello")
// })

// functions

const convertUrl = (url) => {
		
	let newUrlArray;

	if(url.includes("youtu.be")){

	 newUrlArray = url.split("https://youtu.be/")
	return `https://www.youtube.com/watch?v=${newUrlArray[1]}`

	}else
	 if(url.includes("https://www.youtube.com/shorts/")){

		 newUrlArray = url.split("https://www.youtube.com/shorts/")
		return `https://www.youtube.com/watch?v=${newUrlArray[1]}`
	}
	else if(url.includes("https://www.youtube.com/watch?v")){
		return url
	}
	else{
		return "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
	}
	// youtube shorts url
	// https://www.youtube.com/shorts/lZub2xQNYxo
}

// videos
app.get("/video", async(req,res)=>{
	console.log(req.query.videoId)
	const videoId = convertUrl(req.query.videoId,res)
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

// Download video with custom title and quality
app.get("/download", async(req,res)=>{

	const {itag,title,type} = req.query
	const videoId = convertUrl(req.query.videoId)

	if(type === "mp4"){
		res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
		res.header('Content-Type', 'video/mp4');
	}else if(type === "mp3"){
		res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
		res.header('Content-Type', 'audio/mp3');
	}

	ytdl(videoId, { filter: format => format.itag === parseInt(itag) }).pipe(res); 
	
})


app.listen(4000,console.log("working..."))