---
title: Embed Azure Video Indexer widgets into your applications | Microsoft Docs
description: 
services: cognitive services
documentationcenter: ''
author: juliako
manager: erikre

ms.service: video-indexer
ms.topic: article
ms.date: 04/17/2017
ms.author: juliako;

---
# Embed Video Indexer widgets into your applications

Video Indexer supports embedding two types of widgets into your application: **Cognitive Insights** and **Player**. A **Cognitive Insights** widget includes all visual insights that were extracted from your video indexing process. A **Player** widget enables you to stream the video using adaptive bit rate.

## Embedding public content

1. Sign in to your [Video Indexer](https://vi.microsoft.com) account. 
2. Click the "embed" button that appears below the video.

	![Widget](./media/video-indexer-embed-widgets/video-indexer-widget01.png)

	After clicking the button, an embed modal will appear on the screen where you can choose what widget you want to embed in your application.
	Selecting a widget (**Player** or **Cognitive Insights**), generates the embedded code for you to paste in your application.
 
3. Choose the type of widget you want (**Cognitive Insights** or **Player**).
4. Copy the embed code, and add to your application. 

	![Widget](./media/video-indexer-embed-widgets/video-indexer-widget02.png)

## Embedding private (or Org) content

You can get embed codes from embed popups (as shown in the previous section) for **Public** videos only. 

If you want to embed a **Private** video, you have to pass an access token in the **iframe**'s **src** attribute:

     https://www.videobreakdown.com/embed/[insights | player]/<VideoId>/?accessToken=<accessToken>
    
Use the **GetInsightsWidgetUrl** API to get a URL for a Cognitive Insights widget. The URL includes the access token. Specify this URL as the **iframe**'s **src** value.

## Widgets interaction

The **Cognitive Insights** widget can interact with a video on your application. This section shows how to achieve this interaction.

![Widget](./media/video-indexer-embed-widgets/video-indexer-widget03.png)

### Cross-origin communications

To get Video Indexer widgets to communicate with other components, the Video Indexer service does the following:

- Uses the cross-origin communication HTML5 method **postMessage** and 
- Validates the message across videobreakdown.com origin. 

If you choose to implement your own player code and do the integration with **Cognitive Insights** widgets, it is your responsibility to validate the origin of the message that comes from videobreakdown.com.


### Embed both types of widgets in your application / blog (recommended) 

This section shows how to achieve interaction between two Video Indexer widgets so when a user clicks the insight control on your application, the player jumps to the relevant moment.

	<script src="https://breakdown.blob.core.windows.net/public/vb.widgets.mediator.js"></script> 

1. Copy the **Player** widget embed code.
2. Copy the **Cognitive Insights** embed code.
3. Add the https://breakdown.blob.core.windows.net/public/vb.widgets.mediator.js file to handle the communication between the two widgets.

	<script src="https://breakdown.blob.core.windows.net/public/vb.widgets.mediator.js"></script>

Now when a user clicks the insight control on your application, the player jumps to the relevant moment.

For more information, see [this demo](https://videobreakdown.portal.azure-api.net/demo-all-breakdown-widgets).

### Embed the Cognitive Insights widget and use Azure Media Player to play the content

This section shows how to achieve interaction between a **Cognitive Insights** widget and an Azure Media Player instance using the [AMP plugin](https://breakdown.blob.core.windows.net/public/amp-vb.plugin.js).
 
1. Add a Video Indexer plugin for the AMP player.

		<script src="https://breakdown.blob.core.windows.net/public/amp-vb.plugin.js"></script>


2. Instantiate Azure Media Player with the Video Indexer plugin.

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
		    this.videobreakdown({syncTranscript:true, syncLanguage:true});
		});
		
		// Optional subtitles
		var breakdownId = "15f91358fb"; 
		var language = "English";
		
		var tracks = [{
		    kind: 'captions',
		    src: myPlayer.getSubtitlesUrl(breakdownId , language),
		    srclang: 'en',
		    label: 'English'
		}];
		
		myPlayer.src([
		    {
		        "src": "//amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest",
		        "type": "application/vnd.ms-sstr+xml"
		    }
		], tracks);

3. Copy the **Cognitive Insights** embed code.

You should be able now to communicate with your Azure Media Player.

For more information, see [this demo](https://videobreakdown.portal.azure-api.net/demo-your-amp).

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


For more information, see [this demo](https://videobreakdown.portal.azure-api.net/demo-your-player).

## Adding subtitles

If you embed Video Indexer insights with your own AMP player, you can use the **GetVttUrl** method to get closed captions (subtitles). You can also use call a javascript method from the Video Indexer AMP plugin **getSubtitlesUrl** (as shown earlier). 

## Next steps

For information about how to view and edit Video Indexer insights, see [this](video-indexer-view-edit.md) topic.

## See also

[Video Indexer overview](video-indexer-overview.md)
