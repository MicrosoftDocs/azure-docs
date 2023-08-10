---
title: Embed Azure AI Video Indexer widgets in your apps
description: Learn how to embed Azure AI Video Indexer widgets in your apps.
ms.topic: how-to
ms.date: 01/10/2023
ms.author: juliako
ms.custom:
---

# Embed Azure AI Video Indexer widgets in your apps

This article shows how you can embed Azure AI Video Indexer widgets in your apps. Azure AI Video Indexer supports embedding three types of widgets into your apps: *Cognitive Insights*, *Player*, and *Editor*.

Starting with version 2, the widget base URL includes the region of the specified account. For example, an account in the West US region generates: `https://www.videoindexer.ai/embed/insights/.../?location=westus2`.

## Widget types

### Cognitive Insights widget

A Cognitive Insights widget includes all visual insights that were extracted from your video indexing process. The Cognitive Insights widget supports the following optional URL parameters:

|Name|Definition|Description|
|---|---|---|
|`widgets` | Strings separated by comma | Allows you to control the insights that you want to render.<br/>Example: `https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?widgets=people,keywords` renders only people and keywords UI insights.<br/>Available options: `people`, `keywords`, `audioEffects`, `labels`, `sentiments`, `emotions`, `topics`, `keyframes`, `transcript`, `ocr`, `speakers`, `scenes`, `spokenLanguage`, `observedPeople`, `namedEntities`.|
|`controls`|Strings separated by comma|Allows you to control the controls that you want to render.<br/>Example: `https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?controls=search,download` renders only search option and download button.<br/>Available options: `search`, `download`, `presets`, `language`.|
|`language`|A short language code (language name)|Controls insights language.<br/>Example: `https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?language=es-es` <br/>or `https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?language=spanish`|
|`locale` | A short language code | Controls the language of the UI. The default value is `en`. <br/>Example: `locale=de`.|
|`tab` | The default selected tab | Controls the **Insights** tab that's rendered by default. <br/>Example: `tab=timeline` renders the insights with the **Timeline** tab selected.|
|`search` | String | Allows you to control the initial search term.<br/>Example: `https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?search=azure` renders the insights filtered by the word "Azure". | 
|`sort` | Strings separated by comma | Allows you to control the sorting of an insight.<br/>Each sort consists of 3 values: widget name, property and order, connected with '_' `sort=name_property_order`<br/>Available options:<br/>widgets: `keywords`, `audioEffects`, `labels`, `sentiments`, `emotions`, `keyframes`, `scenes`, `namedEntities` and `spokenLanguage`.<br/>property: `startTime`, `endTime`, `seenDuration`, `name` and `ID`.<br/>order: asc and desc.<br/>Example: `https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?sort=labels_id_asc,keywords_name_desc` renders the labels sorted by ID in ascending order and keywords sorted by name in descending order.| 
|`location` ||The `location` parameter must be included in the embedded links, see [how to get the name of your region](regions.md). If your account is in preview, the `trial` should be used for the location value. `trial` is the default value for the `location` parameter.| 

### Player widget

You can use the Player widget to stream video by using adaptive bit rate. The Player widget supports the following optional URL parameters.

|Name|Definition|Description|
|---|---|---|
|`t` | Seconds from the start | Makes the player start playing from the specified time point.<br/> Example: `t=60`. |
|`captions` | A language code / A language code array | Fetches the caption in the specified language during the widget loading to be available on the **Captions** menu.<br/> Example: `captions=en-US`, `captions=en-US,es-ES` |
|`showCaptions` | A Boolean value | Makes the player load with the captions already enabled.<br/> Example: `showCaptions=true`. |
|`type`| | Activates an audio player skin (the video part is removed).<br/> Example: `type=audio`. |
|`autoplay` | A Boolean value | Indicates if the player should start playing the video when loaded. The default value is `true`.<br/> Example: `autoplay=false`. |
|`language`/`locale` | A language code | Controls the player language. The default value is `en-US`.<br/>Example: `language=de-DE`.|
|`location` ||The `location` parameter must be included in the embedded links, see [how to get the name of your region](regions.md). If your account is in preview, the `trial` should be used for the location value. `trial` is the default value for the `location` parameter.| 
|`boundingBoxes`|Array of bounding boxes options: people (faces) and observed people. <br/>Values should be separated by a comma (",").|Controls the option to set bounding boxes on/off when embedding the player.<br/>All mentioned option will be turned on.<br/><br/>Example: `boundingBoxes= observedPeople, people`<br/>Default value is `boundingBoxes= observedPeople` (only observed people bounding box are turned on).|

### Editor widget

You can use the Editor widget to create new projects and manage a video's insights. The Editor widget supports the following optional URL parameters.

|Name|Definition|Description|
|---|---|---|
|`accessToken`<sup>*</sup> | String | Provides access to videos that are only in the account that's used to embed the widget.<br> The Editor widget requires the `accessToken` parameter. |
|`language` | A language code | Controls the player language. The default value is `en-US`.<br/>Example: `language=de-DE`. |
|`locale` | A short language code | Controls the insights language. The default value is `en`.<br/>Example: `language=de`. |
|`location` ||The `location` parameter must be included in the embedded links, see [how to get the name of your region](regions.md). If your account is in preview, the `trial` should be used for the location value. `trial` is the default value for the `location` parameter.| 

<sup>*</sup>The owner should provide `accessToken` with caution.

## Embed videos

This section discusses embedding videos by [using the website](#the-website-experience) or by [assembling the URL manually](#assemble-the-url-manually) into apps. 

The `location` parameter must be included in the embedded links, see [how to get the name of your region](regions.md). If your account is in preview, the `trial` should be used for the location value. `trial` is the default value for the `location` parameter. For example: `https://www.videoindexer.ai/accounts/00000000-0000-0000-0000-000000000000/videos/b2b2c74b8e/?location=trial`.

### The website experience

To embed a video, use the website as described below:

1. Sign in to the [Azure AI Video Indexer](https://www.videoindexer.ai/) website.
1. Select the video that you want to work with and press **Play**.
1. Select the type of widget that you want (**Cognitive Insights**, **Player**, or **Editor**).
1. Click **&lt;/&gt; Embed**.
5. Copy the embed code (appears in **Copy the embedded code** in the **Share & Embed** dialog).
6. Add the code to your app.

> [!NOTE]
> Sharing a link for the **Player** or **Insights** widget will include the access token and grant the read-only permissions to your account.

### Assemble the URL manually

#### Public videos

You can embed public videos assembling the URL as follows:

`https://www.videoindexer.ai/embed/[insights | player]/<accountId>/<videoId>`
  
  
#### Private videos

To embed a private video, you must pass an access token (use [Get Video Access Token](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Access-Token) in the `src` attribute of the iframe:

`https://www.videoindexer.ai/embed/[insights | player]/<accountId>/<videoId>/?accessToken=<accessToken>`
  
### Provide editing insights capabilities

To provide editing insights capabilities in your embedded widget, you must pass an access token that includes editing permissions. Use [Get Video Access Token](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Access-Token) with `&allowEdit=true`.

## Widgets interaction

The Cognitive Insights widget can interact with a video on your app. This section shows how to achieve this interaction.

![Cognitive Insights widget](./media/video-indexer-embed-widgets/video-indexer-widget03.png)

### Flow overview

When you edit the transcripts, the following flow occurs:

1. You edit the transcript in the timeline.
1. Azure AI Video Indexer gets these updates and saves them in the [from transcript edits](customize-language-model-with-website.md#customize-language-models-by-correcting-transcripts) in the language model.
1. The captions are updated:

    * If you are using Azure AI Video Indexer's player widget - it’s automatically updated.
    * If you are using an external player - you get a new captions file user the **Get video captions** call.

### Cross-origin communications

To get Azure AI Video Indexer widgets to communicate with other components:

- Uses the cross-origin communication HTML5 method `postMessage`.
- Validates the message across VideoIndexer.ai origin.

If you implement your own player code and integrate with Cognitive Insights widgets, it's your responsibility to validate the origin of the message that comes from VideoIndexer.ai.

### Embed widgets in your app or blog (recommended)

This section shows how to achieve interaction between two Azure AI Video Indexer widgets so that when a user selects the insight control on your app, the player jumps to the relevant moment.

1. Copy the Player widget embed code.
2. Copy the Cognitive Insights embed code.
3. Add the [Mediator file](https://breakdown.blob.core.windows.net/public/vb.widgets.mediator.js) to handle the communication between the two widgets:<br/> 
`<script src="https://breakdown.blob.core.windows.net/public/vb.widgets.mediator.js"></script>`

Now when a user selects the insight control on your app, the player jumps to the relevant moment.

For more information, see the [Azure AI Video Indexer - Embed both Widgets demo](https://codepen.io/videoindexer/pen/NzJeOb).

### Embed the Cognitive Insights widget and use Azure Media Player to play the content

This section shows how to achieve interaction between a Cognitive Insights widget and an Azure Media Player instance by using the [AMP plug-in](https://breakdown.blob.core.windows.net/public/amp-vb.plugin.js).

1. Add an Azure AI Video Indexer plug-in for the AMP player:<br/> `<script src="https://breakdown.blob.core.windows.net/public/amp-vb.plugin.js"></script>`
2. Instantiate Azure Media Player with the Azure AI Video Indexer plug-in.

    ```javascript
    // Init the source.
    function initSource() {
        var tracks = [{
        kind: 'captions',
        // To load vtt from VI, replace it with your vtt URL.
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

    // Init your AMP instance.
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
        // Activate the plug-in.
        this.videobreakdown({
        videoId: "c4c1ad4c9a",
        syncTranscript: true,
        syncLanguage: true,
        location: "trial" /* location option for paid accounts (default is trial) */
        });

        // Set the source dynamically.
        initSource.call(this);
    });
    ```

3. Copy the Cognitive Insights embed code.

You can now communicate with Azure Media Player.

For more information, see the [Azure Media Player + VI Insights demo](https://codepen.io/videoindexer/pen/rYONrO).

### Embed the Azure AI Video Indexer Cognitive Insights widget and use a different video player

If you use a video player other than Azure Media Player, you must manually manipulate the video player to achieve the communication.

1. Insert your video player.

    For example, a standard HTML5 player:

    ```html
    <video id="vid1" width="640" height="360" controls autoplay preload>
       <source src="//breakdown.blob.core.windows.net/public/Microsoft%20HoloLens-%20RoboRaid.mp4" type="video/mp4" /> 
       Your browser does not support the video tag.
    </video>
    ```

2. Embed the Cognitive Insights widget.
3. Implement communication for your player by listening to the "message" event. For example:

    ```javascript
    <script>
    
        (function(){
        // Reference your player instance.
        var playerInstance = document.getElementById('vid1');
        
        function jumpTo(evt) {
          var origin = evt.origin || evt.originalEvent.origin;
        
          // Validate that the event comes from the videoindexer domain.
          if ((origin === "https://www.videoindexer.ai") && evt.data.time !== undefined){
                
            // Call your player's "jumpTo" implementation.
            playerInstance.currentTime = evt.data.time;
               
            // Confirm the arrival to us.
            if ('postMessage' in window) {
              evt.source.postMessage({confirm: true, time: evt.data.time}, origin);
            }
          }
        }
        
        // Listen to the message event.
        window.addEventListener("message", jumpTo, false);
          
        }())    
        
    </script>
    ```

For more information, see the [Azure Media Player + VI Insights demo](https://codepen.io/videoindexer/pen/YEyPLd).

## Adding subtitles

If you embed Azure AI Video Indexer insights with your own [Azure Media Player](https://aka.ms/azuremediaplayer), you can use the `GetVttUrl` method to get closed captions (subtitles). You can also call a JavaScript method from the Azure AI Video Indexer AMP plug-in `getSubtitlesUrl` (as shown earlier).

## Customizing embeddable widgets

### Cognitive Insights widget

You can choose the types of insights that you want. To do this, specify them as a value to the following URL parameter that's added to the embed code that you get (from the [API](https://aka.ms/avam-dev-portal) or from the [Azure AI Video Indexer](https://www.videoindexer.ai/) website): `&widgets=<list of wanted widgets>`.

The possible values are: `people`, `keywords`, `labels`, `sentiments`, `emotions`, `topics`, `keyframes`, `transcript`, `ocr`, `speakers`, `scenes`, `namedEntities`, `logos`.

For example, if you want to embed a widget that contains only people and keywords insights, the iframe embed URL will look like this:

`https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?widgets=people,keywords`

The title of the iframe window can also be customized by providing `&title=<YourTitle>` to the iframe URL. (It customizes the HTML `<title>` value).
   
For example, if you want to give your iframe window the title "MyInsights", the URL will look like this:

`https://www.videoindexer.ai/embed/insights/<accountId>/<videoId>/?title=MyInsights`

Notice that this option is relevant only in cases when you need to open the insights in a new window.

### Player widget

If you embed Azure AI Video Indexer player, you can choose the size of the player by specifying the size of the iframe.

For example:

`<iframe width="640" height="360" src="https://www.videoindexer.ai/embed/player/<accountId>/<videoId>/" frameborder="0" allowfullscreen />`

By default, Azure AI Video Indexer player has autogenerated closed captions that are based on the transcript of the video. The transcript is extracted from the video with the source language that was selected when the video was uploaded.

If you want to embed with a different language, you can add `&captions=<Language Code>` to the embed player URL. If you want the captions to be displayed by default, you can pass &showCaptions=true.

The embed URL then will look like this:

`https://www.videoindexer.ai/embed/player/<accountId>/<videoId>/?captions=en-us`

#### Autoplay

By default, the player will start playing the video. you can choose not to by passing `&autoplay=false` to the preceding embed URL.

## Code samples

See the [code samples](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/Embedding%20widgets) repo that contains samples for Azure AI Video Indexer API and widgets:

| File/folder                       | Description                                |
|-----------------------------------|--------------------------------------------|
| `azure-media-player`              | Load an Azure AI Video Indexer video in a custom Azure Media Player.                        |
| `azure-media-player-vi-insights`  | Embed VI Insights with a custom Azure Media Player.                             |
| `control-vi-embedded-player`      | Embed VI Player and control it from outside.                                    |
| `custom-index-location`           | Embed VI Insights from a custom external location (can be customer a blob).     |
| `embed-both-insights`             | Basic usage of VI Insights both player and insights.                            |
| `embed-insights-with-AMP`         | Embed VI Insights widget with a custom Azure Media Player.                      |
| `customize-the-widgets`           | Embed VI widgets with customized options.                                     |
| `embed-both-widgets`              | Embed VI Player and Insights and communicate between them.                      |
| `url-generator`                   | Generates widgets custom embed URL based on user-specified options.             |
| `html5-player`                    | Embed VI Insights with a default HTML5 video player.                           |

## Supported browsers

For more information, see [supported browsers](video-indexer-get-started.md#supported-browsers).

## Embed and customize Azure AI Video Indexer widgets in your app using npmjs package

Using our [@azure/video-analyzer-for-media-widgets](https://www.npmjs.com/package/@azure/video-analyzer-for-media-widgets) package, you can add the insights widgets to your app and customize it according to your needs.

Instead of adding an iframe element to embed the insights widget, with this new package you can easily embed & communicate between our widgets. Customizing your widget is only supported in this package - all in one place.   

For more information, see our official [GitHub](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/Embedding%20widgets/widget-customization#readme).

## Next steps

For information about how to view and edit Azure AI Video Indexer insights, see [View and edit Azure AI Video Indexer insights](video-indexer-view-edit.md).

Also, check out [Azure AI Video Indexer CodePen](https://codepen.io/videoindexer/pen/eGxebZ).
