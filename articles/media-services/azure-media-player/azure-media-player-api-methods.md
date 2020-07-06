---
title: Azure Media Player API Methods 
description: The Azure Media Player API allows you to interact with the video through JavaScript, whether the browser is playing the video through HTML5 video, Flash, Silverlight, or any other supported playback technologies. 
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: reference
ms.date: 04/20/2020
---


# API #

The Azure Media Player API allows you to interact with the video through JavaScript, whether the browser is playing the video through HTML5 video, Flash, Silverlight, or any other supported playback technologies.

## Referencing the player ##

To use the API functions, you need access to the player object. Luckily it is easy to get. You just need to make sure your video tag has an ID. The example embed code has an ID of `vid1`. If you have multiple videos on one page, make sure every video tag has a unique ID.

`var myPlayer = amp('vid1');`

> [!NOTE]
> If the player hasn't been initialized yet via the data-setup attribute or another method, this will also initialize the player.

## Wait until the player is ready ##

The time it takes Azure Media Player to set up the video and API will vary depending on the playback technology being used. HTML5 will often be much faster to load than Flash or Silverlight. For that reason, the player's 'ready' function should be used to trigger any code that requires the player's API.

```javacript
    amp("vid_1").ready(function(){
      var myPlayer = this;

      // EXAMPLE: Start playing the video.
      myPlayer.play();
    });
```

OR

```javacript
    var myPlayer = amp("vid_1", myOptions, function(){
        //this is the ready function and will only execute after the player is loaded
    });
```

## API methods ##

Now that you have access to a ready player, you can control the video, get values, or respond to video events. The Azure Media Player API function names attempt to follow the [HTML5 media API](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html). The main difference is that getter/setter functions are used for video properties.

```javacript
    // setting a property on a bare HTML5 video element
    myVideoElement.currentTime = 120;

    // setting a property with Azure Media Player
    myPlayer.currentTime(120);
```

## Registering for events ##
Events should be registered directly after initializing the player for the first time to ensure all events are appropriately reported to the application, and should be done outside of the ready event.

```javacript
    var myPlayer = amp("vid_1", myOptions, function(){
        //this is the ready function and will only execute after the player is loaded
    });
    myPlayer.addEventListener(amp.eventName.error, _ampEventHandler);
    //add other event listeners
```

## Next steps ##

<!---Some context for the following links goes here--->
- [Azure Media Player Quickstart](azure-media-player-quickstart.md)