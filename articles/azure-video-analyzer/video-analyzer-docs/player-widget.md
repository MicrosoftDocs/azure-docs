---
title: Use the Video Analyzer player widget
description: This article explains how to add a Video Analyzer player widget to your application.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 11/12/2021
ms.custom: ignite-fall-2021
---

# Use the Azure Video Analyzer player widget

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

In this tutorial, you learn how to use a player widget within your application. This code is an easy-to-embed widget that allows your users to play video and browse through the portions of a segmented video file. To do this, you'll be generating a static HTML page with the widget embedded, and all the pieces to make it work.

In this tutorial, you will:

> [!div class="checklist"]
> * Create a page with the player
> * List videos
> * Pass a streaming endpoint and a token to the player
> * Add a Zone Drawer player
> * View videos clipped to specified start and end times

## Prerequisites

The following are required for this tutorial:

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
* [Visual Studio Code](https://code.visualstudio.com/) or another editor for the HTML file.
* Run topologies from either [Continuous video recording and playback](edge/use-continuous-video-recording.md) or [Quickstart: Detect motion in a (simulated) live video, record the video on edge devices](./detect-motion-record-video-clips-cloud.md)
* Create a [token](./access-policies.md#creating-a-token)
* Create an [access policy](./access-policies.md#creating-an-access-policy)


## Create a web page with a video player

Use the below sample code to create a web page.

```html
<html>
<head>
<title>Video Analyzer Player Widget Demo</title>
</head>
<script async type="module" src="https://unpkg.com/@azure/video-analyzer-widgets"></script>
<body>
Client API endpoint URL: <input type="text" id="clientApiEndpointUrl" /><br><br>
JWT Auth Token for Client API: <input type="text" id="token" /><br><br>
<button type="submit" onclick="getVideos()">Get Videos</button><br><br>
<textarea rows="20" cols="100" id="videoList"></textarea><br><br>
Video name: <input type="text" id="videoName" /><br><br>
<button type="submit" onclick="playVideo()">Play Video</button><br><br>
</body>
</body>
</html>
```
## List video resources

Next, generate a list of video resources. You make a REST call to the account endpoint you used earlier, and you authenticate with the token you generated.

There are many ways to send a GET request to a REST API, but for this you're going to use a JavaScript function. The following code uses [XMLHttpRequest](https://www.w3schools.com/xml/ajax_xmlhttprequest_create.asp), coupled with values you're storing in the `clientApiEndpointUrl` and `token` fields on the page to send a synchronous `GET` request. It then takes the resulting list of videos and stores them in the `videoList` text area you have set up on the page.

The following code snippet will help in requesting the video list.

```javascript
function getVideos()
{
    var xhttp = new XMLHttpRequest();
    var getUrl = document.getElementById("clientApiEndpointUrl").value + "/videos?api-version=2021-05-01-preview";
    xhttp.open("GET", getUrl, false);
    xhttp.setRequestHeader("Authorization", "Bearer " + document.getElementById("token").value);
    xhttp.send();
    document.getElementById("videoList").value = xhttp.responseText.toString();
}
```
   > [!NOTE]
   >The `clientApiEndPoint` and `token` are collected from [creating a token](./access-policies.md#creating-a-token)

## Add the Video Analyzer player component

Now that you have a client API endpoint URL, a token, and a video name, you can add the player to the page.

1. Include the player module itself by adding the package directly to your page. You can either include the NPM package direction in your application, or have it embed dynamically at runtime, as in the following:
   ```html
   <script async type="module" src="https://unpkg.com/@azure/video-analyzer-widgets"></script>
   ```
1. Add an `AVA-Player` element to the document:
   ```html
   <ava-player width="720px" id="avaPlayer"></ava-player>
   ```
1. Get a link to the Video Analyzer player widget that is in the page:
   ```javascript
   const avaPlayer = document.getElementById("videoPlayer");
   ```
1. To configure the player with the values that you have, you will need to set them up as an object, as shown here:
   ```javascript
   avaPlayer.configure( {
      token: document.getElementById("token").value,
      clientApiEndpointUrl: document.getElementById("clientApiEndpointUrl").value,
      videoName: document.getElementById("videoName").value
   } );
   ```
1. Load the video into the player to begin:
   ```javascript
   avaPlayer.load();
   ```
   
## Add the Zone Drawer component

The Zone Drawer component allows you to draw lines and polygons on top of the Video Analyzer player. 

1. Add an AVA-Zone-Drawer element to the document:
   ```html
   <ava-zone-drawer width="720px" id="zoneDrawer">
        <ava-player id="videoPlayer2"></ava-player>
   </ava-zone-drawer>
   ```
1. Get a link to the Video Analyzer player widget that will play inside the zone drawer:
   ```javascript
   const avaPlayer2 = document.getElementById("videoPlayer2");
   ```
1. Configure the player that will play inside the zone drawer:
   ```javascript
   avaPlayer2.configure( {
      token: document.getElementById("token").value,
      clientApiEndpointUrl: document.getElementById("clientApiEndpointUrl").value,
      videoName: document.getElementById("videoName").value
   } );
   ```
1. Load the video into the player inside the zone drawer:
   ```javascript
   avaPlayer2.load();
   ```
1. Get a link to the zone drawer that is in the page:
   ```javascript
   const zoneDrawer = document.getElementById("zoneDrawer");
   ```
1. Load the zone drawer into the player:
   ```javascript
   zoneDrawer.load();
   ```
1. Configure the zone drawer:
   ```javascript
   zoneDrawer.configure();
   ```
1. To create and save zones, you have to add event listeners here:
   ```javascript
   zoneDrawer.addEventListener('ZONE_DRAWER_ADDED_ZONE', (event) => {
            console.log(event);
            document.getElementById("zoneList").value = JSON.stringify(event.detail);
        });

        zoneDrawer.addEventListener('ZONE_DRAWER_SAVE', (event) => {
            console.log(event);
            document.getElementById("zoneList").value = JSON.stringify(event.detail);
        });
   ```

## Put it all together

Combining the preceding web elements, you get the following static HTML page. This page allows you to use an account endpoint and token to view a video.

```html
<html>
<head>
<title>Video Analyzer Player Widget Demo</title>
</head>
<script async type="module" src="https://unpkg.com/@azure/video-analyzer-widgets"></script>
<body>
<script>
    function getVideos()
    {
        var xhttp = new XMLHttpRequest();
        var getUrl = document.getElementById("clientApiEndpointUrl").value + "/videos?api-version=2021-05-01-preview";
        xhttp.open("GET", getUrl, false);
        xhttp.setRequestHeader("Authorization", "Bearer " + document.getElementById("token").value);
        xhttp.send();
        document.getElementById("videoList").value = xhttp.responseText.toString();
    }
    function playVideo() {
        const avaPlayer = document.getElementById("videoPlayer");
        avaPlayer.configure( {
            token: document.getElementById("token").value,
            clientApiEndpointUrl: document.getElementById("clientApiEndpointUrl").value,
            videoName: document.getElementById("videoName").value
        } );
        avaPlayer.load();
		
		const avaPlayer2 = document.getElementById("videoPlayer2");
        avaPlayer2.configure( {
            token: document.getElementById("token").value,
            clientApiEndpointUrl: document.getElementById("clientApiEndpointUrl").value,
            videoName: document.getElementById("videoName").value
        } );
        avaPlayer2.load();
    
        const zoneDrawer = document.getElementById("zoneDrawer");
        zoneDrawer.load();
        zoneDrawer.configure();

        zoneDrawer.addEventListener('ZONE_DRAWER_ADDED_ZONE', (event) => {
            console.log(event);
            document.getElementById("zoneList").value = JSON.stringify(event.detail);
        });

        zoneDrawer.addEventListener('ZONE_DRAWER_SAVE', (event) => {
            console.log(event);
            document.getElementById("zoneList").value = JSON.stringify(event.detail);
        });
    }
</script>
Client API endpoint URL: <input type="text" id="clientApiEndpointUrl" /><br><br>
JWT Auth Token for Client API: <input type="text" id="token" /><br><br>
<button type="submit" onclick="getVideos()">Get Videos</button><br><br>
<textarea rows="20" cols="100" id="videoList"></textarea><br><br>
<button type="submit" onclick="playVideo()">Play Video</button><br><br>
Video name: <input type="text" id="videoName" /><br><br>
<div id="container" style="width:720px" class="widget-container">
    <ava-player width="720px" id="videoPlayer"></ava-player>
</div>
<textarea rows="5" cols="100" id="zoneList"></textarea><br><br>
<ava-zone-drawer width="720px" id="zoneDrawer">
    <ava-player id="videoPlayer2"></ava-player>
</ava-zone-drawer>
</body>
</html>
```

## Host the page

You can test this page locally, but you might want to test a hosted version. In case you don't have a quick way to host a page, here are instructions on how to do so by using [static websites](../../storage/blobs/storage-blob-static-website.md) with Azure Storage. The following steps are a condensed version of [these more complete instructions](../../storage/blobs/storage-blob-static-website-how-to.md). The steps are updated for the files you're using in this tutorial.

1. Create a storage account.
1. Under **Data management**, select **Static website**.
1. Enable the static website on the storage account.
1. For **Index document name**, enter **index.html**.
1. For **Error document path**, enter **404.html**.
1. Select **Save**.
1. Note the **Primary endpoint** that shows up. This will be your website.
1. Above **Primary endpoint**, select **$web**.
1. By using the **Upload** button at the top, upload your static HTML page as **index.html**.`

### Play a video

Now that you have the page hosted, go there and go through the steps to play a video.

1. Enter the **Client API endpoint URL** and **Token** values.
1. Select **Get videos**.
1. From the video list, select a video name, and enter it into the **Video name** field.
1. Select **Play video**.

### Live Video Playback

If your livePipeline is in an `activated` state and the video is being recorded, then the player automatically loads the **LIVE** view. This video playback is near real-time and will have a short latency of about 2 seconds.

In the **LIVE** view, you will:
1. See the video playback in near real-time.
1. Not see the timeline.
1. Clicking on the **Box** icon will display the bounding boxes, if they exist.

> [!Tip]
> To switch to the view where you can view all the previously recorded clips, click on the **LIVE** button.
 
### Capture Lines and Zones

1. Navigate to the **Zone Drawer** player
1. Click on the first icon on the top-left corner to draw zones.
1. In order to draw zones and lines, you just need to click on the points where you want to have the end points. There is no dragging functionality to draw the zones and lines.
1. You will see the zones and lines created in the right section of the player.
1. To get the coordinates of the lines and zones, click on the **Save** button.
1. Doing so, will show the JSON response with the point coordinates, which you can use the appropriate topologies.

### Video Clips
Enables you to create video clips by selecting a start and end time.

The Video Analyzer video player widget supports playing video clips by specifying a start and end date time as shown below:

> [!Note] 
> The Video Analyzer video player widget uses UTC time standard, therefore the selected start and end time needs to be converted to this format.

Use the below code in your HTML file to open a video player that will load a video from the startTime and the endTime you will specify.

```javascript
    const avaPlayer = document.getElementById("videoPlayer");
    const startUTCDate = new Date(Date.UTC(selectedClip.start.getFullYear(), selectedClip.start.getMonth(), selectedClip.start.getDate(), selectedClip.start.getHours(), selectedClip.start.getMinutes(), selectedClip.start.getSeconds()));
    const endUTCDate = new Date(Date.UTC(selectedClip.end.getFullYear(), selectedClip.end.getMonth(), selectedClip.end.getDate(), selectedClip.end.getHours(), selectedClip.end.getMinutes(), selectedClip.end.getSeconds()));
    avaPlayer.load({ startTime: startUTCDate, endTime: endUTCDate });
``` 

## Additional details

The following sections contain some important additional details to be aware of.
### Refresh the access token

The player uses the access token that you generated earlier to get a playback authorization token. Tokens expire periodically and need to be refreshed. There are two ways to refresh the access token for the player after you've generated a new one:

* Actively calling the widget method `setAccessToken`.
    ```typescript
    avaPlayer.setAccessToken('<NEW-ACCESS-TOKEN>');
    ```
* Acting upon the `TOKEN_EXPIRED` event by listening to this event.
    ```typescript
    avaPlayer.addEventListener(PlayerEvents.TOKEN_EXPIRED, () => {
        avaPlayer.setAccessToken('<YOUR-NEW-TOKEN>');
    });
    ```

The `TOKEN_EXPIRED` event will occur 5 seconds before the token is going to expire. If you're setting an event listener, you should do so before calling the `load` function on the player widget.

### Configuration details

The preceding player has a simple configuration, but you can use a wider range of options for configuration values. The following are the supported fields:

| Name   | Type             | Description                         |
| ------ | ---------------- | ----------------------------------- |
| `token`  | string | Your JWT token for the widget |
| `videoName` | string | The name of the video resource  |
| `clientApiEndpointUrl` | string | The endpoint URL for the client API |

### Alternate ways to load the code into your application

The package used to get the code into your application is an [NPM package](https://www.npmjs.com/package/@azure/video-analyzer-widgets). In the preceding example, the latest version was loaded at runtime directly from the repository. But you can also download and install the package locally by using the following:

```bash
npm install @azure/video-analyzer/widgets
```

Or you can import it within your application code by using this for TypeScript:

```typescript
import { Player } from '@azure/video-analyzer-widgets';
import { ZoneDrawer } from '@azure/video-analyzer-widgets';
```

If you want to create a player widget dynamically, you can use this for JavaScript:
```javascript
<script async type="module" src="https://unpkg.com/@azure/video-analyzer-widgets@latest/dist/global.min.js"></script>
```


If you use this method to import, you will need to create the zone drawer and player objects programmatically after the import is complete.  In the preceding example, you added the module to the page using the `ava-player` HTML tag. To create a zone drawer object and a player object through code, you can do the following in JavaScript:


```javascript
const zoneDrawer = new window.ava.widgets.zoneDrawer();
document.firstElementChild.appendChild(zoneDrawer);
const playerWidget = new window.ava.widgets.player();
zoneDrawer.appendChild(playerWidget);
```

Or, in TypeScript:

```typescript
const avaPlayer = new Player();
const zoneDrawer = new ZoneDrawer();
```

Then you must add it to the HTML:

```javascript
document.firstElementChild.appendChild(zoneDrawer);
zoneDrawer.appendChild(playerWidget);
```

## Next steps

* Try out our [sample playback using widgets](https://github.com/Azure-Samples/video-analyzer-iot-edge-csharp/tree/main/src/video-player).
* Learn about how the different widget features can be implemented by visiting our [widgets repository](https://github.com/Azure/video-analyzer-widgets).
