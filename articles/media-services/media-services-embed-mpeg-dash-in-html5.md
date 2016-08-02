<properties 
	pageTitle="Embedding a MPEG-DASH Adaptive Streaming Video in an HTML5 Application with DASH.js" 
	description="This topic demonstrates how to embed an MPEG-DASH Adaptive Streaming Video in an HTML5 Application with DASH.js." 
	authors="Juliako" 
	manager="erikre" 
	editor="" 
	services="media-services" 
	documentationCenter=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016" 
	ms.author="juliako"/>


#Embedding a MPEG-DASH Adaptive Streaming Video in an HTML5 Application with DASH.js

##Overview

MPEG-DASH is an ISO standard for the adaptive streaming of video content, which offers significant benefits for those who wish to deliver high-quality, adaptive video streaming output. With MPEG-DASH, the video stream will automatically drop to a lower definition when the network becomes congested. This reduces the likelihood of the viewer seeing a "paused" video while the player downloads the next few seconds to play (aka buffering). As network congestion reduces, the video player will in turn return to a higher quality stream. This ability to adapt the bandwidth required also results in a faster start time for video. That means that the first few seconds can be played in a fast-to-download lower quality segment and then step up to a higher quality once sufficient content has been buffered.

Dash.js is an open source MPEG-DASH video player written in JavaScript. Its goal is to provide a robust, cross-platform player that can be freely reused in applications that require video playback. It provides MPEG-DASH playback in any browser that supports the W3C Media Source Extensions (MSE), today that is Chrome, Microsoft Edge and IE11 (other browsers have indicated their intent to support MSE). For more information about DASH.js, js see the GitHub dash.js repository.


##Creating a browser-based streaming video player

To create a simple web page that displays a video player with the expected controls such a play, pause, rewind etc., you will need to:

1. Create an HTML page
1. Add the video tag
1. Add the dash.js player
1. Initialize the player
1. Add some CSS style
1. View the results in a browser that implements MSE

Initializing the player can be completed in just a handful of lines of JavaScript code. Using dash.js, it really is that simple to embed MPEG-DASH video in your browser based applications.

##Creating the HTML Page

The first step is to create a standard HTML page containing the <video> element, save this file as basicPlayer.html, as the following example illustrates:
	
	<!DOCTYPE html>
	<html>
	  <head><title>Adaptive Streaming in HTML5</title></head>
	  <body>
	    <h1>Adaptive Streaming with HTML5</h1>
	    <video id="videoplayer" controls></video>
	  </body>
	</html>

##Adding the DASH.js Player

To add the dash.js reference implementation to the application, you’ll need to grab the dash.all.js file from the 1.0 release of dash.js project. This should be saved in the JavaScript folder of your application. This file is a convenience file that pulls together all the necessary dash.js code into a single file. If you have a look around the dash.js repository, you will find the individual files, test code and much more, but if all you want to do is use dash.js, then the dash.all.js file is what you need.

To add the dash.js player to your applications, add a script tag to the head section of basicPlayer.html:

	<!-- DASH-AVC/265 reference implementation -->
	< script src="js/dash.all.js"></script>


Next, create a function to initialize the player when the page loads. Add the following script after the line in which you load dash.all.js:

	<script>
	// setup the video element and attach it to the Dash player
	function setupVideo() {
	  var url = "http://wams.edgesuite.net/media/MPTExpressionData02/BigBuckBunny_1080p24_IYUV_2ch.ism/manifest(format=mpd-time-csf)";
	  var context = new Dash.di.DashContext();
	  var player = new MediaPlayer(context);
	                  player.startup();
	                  player.attachView(document.querySelector("#videoplayer"));
	                  player.attachSource(url);
	}
	</script>

This function first creates a DashContext. This is used to configure the application for a specific runtime environment. From a technical point of view, it defines the classes that the dependency injection framework should use when constructing the application. In most cases, you will use Dash.di.DashContext.

Next, instantiate the primary class of the dash.js framework, MediaPlayer. This class contains the core methods needed such as play and pause, manages the relationship with the video element and also manages the interpretation of the Media Presentation Description (MPD) file which describes the video to be played.

The startup() function of the MediaPlayer class is called to ensure that the player is ready to play video. Amongst other things this function ensures that all the necessary classes (as defined by the context) have been loaded. Once the player is ready, you can attach the video element to it using the attachView() function. This enables the MediaPlayer to inject the video stream into the element and also control playback as necessary.

Pass the URL of the MPD file to the MediaPlayer so that it knows about the video it is expected to play.The setupVideo() function just created will need to be executed once the page has fully loaded. Do this by using the onload event of the body element. Change your <body> element to:

	<body onload="setupVideo()">

Finally, set the size of the video element using CSS. In an adaptive streaming environment, this is especially important because the size of the video being played may change as playback adapts to changing network conditions. In this simple demo simply force the video element to be 80% of the available browser window by adding the following CSS to the head section of the page:
	
	<style>
	video {
	  width: 80%;
	  height: 80%;
	}
	</style>

##Playing a Video

To play a video, point your browser at the basicPlayback.html file and click play on the video player displayed.


##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

##See Also

[Develop video player applications](media-services-develop-video-players.md)

[GitHub dash.js repository](https://github.com/Dash-Industry-Forum/dash.js) 
