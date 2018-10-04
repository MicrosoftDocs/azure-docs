---
title: "Example: Embed Video Indexer widgets into your applications"
titlesuffix: Azure Cognitive Services
description: Learn how to embed Video Indexer widgets into your application.
services: cognitive services
author: juliako
manager: cgronlun

ms.service: cognitive-services
ms.component: video-indexer
ms.topic: sample
ms.date: 09/15/2018
ms.author: juliako
---

# Example: Embed Video Indexer widgets into your applications

This article shows how you can embed Video Indexer widgets into your applications. Video Indexer supports embedding two types of widgets into your application: **Cognitive Insights** and **Player**. 
## Widget types

### Cognitive Insights widget

A **Cognitive Insights** widget includes all visual insights that were extracted from your video indexing process. The insights widget supports the following optional URL params:

|Name|Definition|Description|
|---|---|---|
|widgets|Strings separated by comma|Allows you to control the insights you want to render. <br/>Example: `https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?widgets=people,search` will render only people and brands UI insights<br/>Available options: people, keywords, annotations, brands, sentiments, transcript, search.<br/>not supported via URL at version=2<br/><br/>**Note:** The **widgets** URL param is not supported if **version=2** is used. |
|version|Versions of the **Cognitive Insights** widget|To get the latest insights widget updates, add `?version=2` query param to the embed url. For example, `https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?version=2` <br/> To get the older version, just remove the `version=2` from the URL.

### Player widget

A **Player** widget enables you to stream the video using adaptive bit rate. The player widget supports the following optional URL params:

|Name|Definition|Description|
|---|---|---|
|t|Seconds from start|Makes the player start playing from the given time point.<br/>Example: t=60|
|captions|Language code|Fetches the caption in the given language during the widget loading to be available in the captions menu.<br/>Example: captions=en-US|
|showCaptions|A boolean value|Makes the player load with the captions already enabled.<br/>Example: showCaptions=true|
|type||Activates an audio player skin (video part is removed).<br/>Example: type=audio|
|autoplay|A boolean value|Indicates if the player should start playing the video when loaded (default is true).<br/>Example: autoplay=false|
|language|Language code|Controls the player language (default is en-US)<br/>Example: language=de-DE|

## Embedding public content

1. Browse to the [Video Indexer](https://www.videoindexer.ai/) website and sign in.
2. Click on the video you want to work with.
3. Click the "embed" button that appears below the video.

	![Widget](./media/video-indexer-embed-widgets/video-indexer-widget01.png)

	After clicking the button, an embed modal will appear on the screen where you can choose what widget you want to embed in your application.
	Selecting a widget (**Player** or **Cognitive Insights**), generates the embedded code for you to paste in your application.
 
4. Choose the type of widget you want (**Cognitive Insights** or **Player**).
5. Copy the embed code, and add to your application. 

	![Widget](./media/video-indexer-embed-widgets/video-indexer-widget02.png)

## Embedding private content

You can get embed codes from embed popups (as shown in the previous section) for **Public** videos only. 

If you want to embed a **Private** video, you have to pass an access token in the **iframe**'s **src** attribute:

     https://www.videoindexer.ai/embed/[insights | player]/<accountId>/<videoId>/?accessToken=<accessToken>
    
Use the [**Get Insights Widget**](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-insights-widget?) API to get the Cognitive Insights widget content, or use [**Get Video Access Token**](https://api-portal.videoindexer.ai/docs/services/authorization/operations/Get-Video-Access-Token?) and add that as a query param to the URL, as shown above. Specify this URL as the **iframe**'s **src** value.

If you want to provide editing insights capabilities (like we have in our web application) in your embedded widget, you will have to pass an access token with editing permissions. Use [**Get Insights Widget**](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-insights-widget?)  or [**Get Video Access Token**](https://api-portal.videoindexer.ai/docs/services/authorization/operations/Get-Video-Access-Token?) with **&allowEdit=true**. 

## Widgets interaction

The **Cognitive Insights** widget can interact with a video on your application. This section shows how to achieve this interaction.

![Widget](./media/video-indexer-embed-widgets/video-indexer-widget03.png)

### Cross-origin communications

To get Video Indexer widgets to communicate with other components, the Video Indexer service does the following:

- Uses the cross-origin communication HTML5 method **postMessage** and 
- Validates the message across VideoIndexer.ai origin. 

If you choose to implement your own player code and do the integration with **Cognitive Insights** widgets, it is your responsibility to validate the origin of the message that comes from VideoIndexer.ai.

### Embed both types of widgets in your application / blog (recommended) 

This section shows how to achieve interaction between two Video Indexer widgets so when a user clicks the insight control on your application, the player jumps to the relevant moment.

	<script src="https://breakdown.blob.core.windows.net/public/vb.widgets.mediator.js"></script> 

1. Copy the **Player** widget embed code.
2. Copy the **Cognitive Insights** embed code.
3. Add the [**Mediator file**](https://breakdown.blob.core.windows.net/public/vb.widgets.mediator.js) to handle the communication between the two widgets:

	<script src="https://breakdown.blob.core.windows.net/public/vb.widgets.mediator.js"></script>

Now when a user clicks the insight control on your application, the player jumps to the relevant moment.

For more information, see [this demo](https://codepen.io/videoindexer/pen/NzJeOb).

### Embed the Cognitive Insights widget and use Azure Media Player to play the content

This section shows how to achieve interaction between a **Cognitive Insights** widget and an Azure Media Player instance using the [AMP plugin](https://breakdown.blob.core.windows.net/public/amp-vb.plugin.js).
 
1. Add a Video Indexer plugin for the AMP player.

		<script src="https://breakdown.blob.core.windows.net/public/amp-vb.plugin.js"></script>


2. Instantiate Azure Media Player with the Video Indexer plugin.

		// Init Source
		function initSource() {
		    var tracks = [{
			kind: 'captions',
			// Here is how to load vtt from VI, you can replace it with your vtt url.
			src: this.getSubtitlesUrl("c4c1ad4c9a", "English"),
			srclang: 'en',
			label: 'English'
		    }];

		    myPlayer.src([
			{
			    "src": "//amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest",
			    "type": "application/vnd.ms-sstr+xml"
			}
		    ], tracks);
		}

		// Init your AMP instance
		var myPlayer = amp('vid1', { /* Options */
		    "nativeControlsForTouch": false,
		    autoplay: true,
		    controls: true,
		    width: "640",
		    height: "400",
		    poster: "",
		    plugins: {
			videobreakedown: {}
		    }
		}, function () {
		    // Activate the plugin
		    this.videobreakdown({
			videoId: "c4c1ad4c9a",
			syncTranscript: true,
			syncLanguage: true
		    });

		    // Set the source dynamically
		    initSource.call(this);
		});

3. Copy the **Cognitive Insights** embed code.

You should be able now to communicate with your Azure Media Player.

For more information, see [this demo](https://codepen.io/videoindexer/pen/rYONrO).

### Embed Video Indexer Cognitive Insights widget and use your own player (could be any player)

If you use your own player, you have to take care of manipulating your player yourself in order to achieve the communication. 

1. Insert your video player.

	For example, a standard HTML5 player

		<video id="vid1" width="640" height="360" controls autoplay preload>
		   <source src="//breakdown.blob.core.windows.net/public/Microsoft%20HoloLens-%20RoboRaid.mp4" type="video/mp4" /> 
		   Your browser does not support the video tag.
		</video>    

2. Embed the Cognitive Insights widget.
3. Implement communication for your player by listening to the "message" event. For example:

		<script>
	
		    (function(){
		    // Reference your player instance
		    var playerInstance = document.getElementById('vid1');
		
		    function jumpTo(evt) {
		      var origin = evt.origin || evt.originalEvent.origin;
		
		      // Validate that event comes from the videobreakdown domain.
		      if ((origin === "https://www.videobreakdown.com") && evt.data.time !== undefined){
		        
		        // Here you need to call your player "jumpTo" implementation
		        playerInstance.currentTime = evt.data.time;
		       
		        // Confirm arrival to us
		        if ('postMessage' in window) {
		          evt.source.postMessage({confirm: true, time: evt.data.time}, origin);
		        }
		      }
		    }
		
		    // Listen to message event
		    window.addEventListener("message", jumpTo, false);
		  
			}())    
		
		</script>


For more information, see [this demo](https://codepen.io/videoindexer/pen/YEyPLd).

## Adding subtitles

If you embed Video Indexer insights with your own AMP player, you can use the **GetVttUrl** method to get closed captions (subtitles). You can also call a javascript method from the Video Indexer AMP plugin **getSubtitlesUrl** (as shown earlier). 

## Customizing embeddable widgets

### Cognitive insights widget
You can choose the types of insights you want by specifying them as a value to the following URL parameter added to the embed code you get (from API or from the web application):

**&widgets=** \<list of wanted widgets>

The possible values are: people, keywords, sentiments, transcript, search.

For example, if you want to embed a widget containing only people and search insights the iframe embed URL will look like this:
https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?widgets=people,search

The title of the iframe window can also be customized by providing **&title=**<YourTitle> to the iframe URL. (It will customize the html \<title> value ).
For example, if you want to give your iframe window the title "MyInsights", the URL will look like this:
https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?title=MyInsights. 
Notice that this option is relevant only in cases when you need to open the insights in a new window.

### Player widget
If you embed Video Indexer player, you can choose the size of the player by specifying the size of the iframe.

For example:

    <iframe width="640" height="360" src="https://www.videoindexer.ai/embed/player/<accountId>/<videoId>/" frameborder="0" allowfullscreen />

By default Video Indexer player will have auto generated closed captions based on the transcript of the video that was extracted from the video with the source language that was selected when the video was uploaded.

If you want to embed with a different language, you can add **&captions=< Language | ”all” | “false” >** to the embed player URL or put “all” as the value if you want to have all available languages captions.
If you want the captions to be displayed by default, you can pass **&showCaptions=true**

The embed URL then will look like this : https://www.videoindexer.ai/embed/player/<accountId>/<videoId>/?captions=italian. If you want to disable captions, you can pass “false” as value for captions parameter.

Auto play – by default the player will start playing the video. you can choose not to by passing &autoplay=false to the embed URL above.

## Next steps

For information about how to view and edit Video Indexer insights, see [this](video-indexer-view-edit.md) article.

Also, check out [Video indexer codepen](https://codepen.io/videoindexer/pen/eGxebZ).
