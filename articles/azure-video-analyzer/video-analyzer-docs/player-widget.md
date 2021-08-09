---
title: Using the Azure Video Analyzer player widget
description: This reference article explains how to add a Video Analyzer player widget to your application.
ms.service: azure-video-analyzer
ms.topic: reference
ms.date: 06/01/2021

---

# Using the Azure Video Analyzer player widget

In this tutorial, you will learn how to use Azure Video Analyzer Player widget within your application.  This code is an easy-to-embed widget that will allow your end users to play video and navigate through the portions of a segmented video file.  To do this, you'll be generating a static HTML page with the widget embedded, and all the pieces to make it work.

In this tutorial you will:

> [!div class="checklist"]
> * Create a token
> * List videos
> * Get the base URL for playing back a [video application resource](./terminology.md#video)
> * Create a page with the player
> * Pass streaming endpoint plus token to the player

## Suggested pre-reading

- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [TypeScript](https://www.typescriptlang.org)

## Prerequisites

Prerequisites for this tutorial:

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
* [Visual Studio Code](https://code.visualstudio.com/) or another editor for the HTML file.
* Either [Continuous video recording and playback](./use-continuous-video-recording.md) or [Detect motion and record video on edge devices](./detect-motion-record-video-clips-cloud.md)
* Create a [token](./access-policies.md#creating-a-token)
* Create an [access policy](./access-policies.md#creating-an-access-policy)


## List Video Analyzer video resources

Next we need to generate a list of video resources.  This is done through a REST call to the account endpoint we used above, authenticating with the token we generated.

There are many ways to send a GET request to a REST API, but for this we're going to use a JavaScript function.  The below code uses a [XMLHttpRequest](https://www.w3schools.com/xml/ajax_xmlhttprequest_create.asp) coupled with values we're storing in the `clientApiEndpointUrl` and `token` fields on the page to send a synchronous `GET` request.  It then takes the resulting list of videos and stores them in the `videoList` text area we have set up on the page.

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
   >The clientApiEndPoint and token are collected from [Create a token](#create-a-token).

## Add the Video Analyzer Player Component

Now that we have a client API endpoint URL, a token and a video name, we can add the player to the page.

1. Include the player module itself by adding the package directly to your page.  You can either include the NPM package direction in your application, or have it embed dynamically at run time as we have here:
   ```html
   <script async type="module" src="https://unpkg.com/@azure/video-analyzer-widgets"></script>
   ```
1. Add an AVA-Player element to the document:
   ```html
   <ava-player width="720px" id="avaPlayer"></ava-player>
   ```
1. Get a link to the Video Analyzer player widget that is in the page:
   ```javascript
   const avaPlayer = document.getElementById("avaPlayer");
   ```
1. To configure the player with the values that you have, you will need to set them up as an object as shown here:
   ```javascript
   avaPlayer.configure( {
      token: document.getElementById("token").value,
      clientApiEndpointUrl: document.getElementById("clientApiEndpointUrl").value,
      videoName: document.getElementById("videoName").value
   } );
   ```
1. Load the video into the player to begin
   ```javascript
   avaPlayer.load();
   ```
   
## Add the Zone Drawer Component

1. Add an AVA-Zone-Drawer element to the document:
   ```html
   <ava-zone-drawer width="720px" id="zoneDrawer"></ava-zone-drawer>
   ```
1. Get a link to the Video Analyzer zone drawer that is in the page:
   ```javascript
   const zoneDrawer = document.getElementById("zoneDrawer");
   ```
1. Load the zone drawer into the player:
   ```javascript
   zoneDrawer.load();
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

If we combine the web elements above, we get the following static HTML page that will allow us to use an account endpoint and token to view a video.

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
        const avaPlayer = document.getElementById("avaPlayer");
        avaPlayer.configure( {
            token: document.getElementById("token").value,
            clientApiEndpointUrl: document.getElementById("clientApiEndpointUrl").value,
            videoName: document.getElementById("videoName").value
        } );
        avaPlayer.load();
    
        const zoneDrawer = document.getElementById("zoneDrawer");
        zoneDrawer.load();

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
Token: <input type="text" id="token" /><br><br>
<button type="submit" onclick="getVideos()">Get Videos</button><br><br>
<textarea rows="20" cols="100" id="videoList"></textarea><br><br>
Video name: <input type="text" id="videoName" /><br><br>
<button type="submit" onclick="playVideo()">Play Video</button><br><br>
<textarea rows="5" cols="100" id="zoneList"></textarea><br><br>
<ava-zone-drawer width="720px" id="zoneDrawer">
    <ava-player id="avaPlayer"></ava-player>
</ava-zone-drawer>
</body>
</html>
```

## Host the page

You can test this page locally, but you may want to test a hosted version.  In case you do not have a quick way to host a page, here are instructions on how to do so using [static websites](../../storage/blobs/storage-blob-static-website.md) with Storage.  The following steps are a condensed version of [these more complete instructions](../../storage/blobs/storage-blob-static-website-how-to.md) updated for the files we are using in this tutorial.

1. Create a Storage account
1. Under `Data management` on the left, click on `Static website`
1. `Enable` the static website on the Storage account
1. For `Index document name`, put in `index.html`
1. For `Error document path`, put in `404.html`
1. Select `Save` at the top
1. Note the `Primary endpoint` that shows up - this will be your web site
1. Click on `$web` above `Primary endpoint`
1. Using the `Upload` button at the top, upload your static HTML page as `index.html`

## Play a video

Now that you have the page hosted, navigate there and you should be able to go through the steps.

1. Put in the `Client API endpoint URL` and `Token`
1. Press `Get videos`
1. From the video list, select a video name and fill it in to the `Video name` input field
1. Press `Play video`

## Additional details

### Refreshing the access token

The player uses the access token that we generated earlier to get a playback authorization token.  Tokens expire periodically, so need to be refreshed.  There are two ways of refreshing the access token for the player after you have generated a new one.

* Actively calling widget method `setAccessToken`
    ```typescript
    avaPlayer.setAccessToken('<NEW-ACCESS-TOKEN>');
    ```
* Acting upon `TOKEN_EXPIRED` event by listening to this event
    ```typescript
    avaPlayer.addEventListener(PlayerEvents.TOKEN_EXPIRED, () => {
        avaPlayer.setAccessToken('<YOUR-NEW-TOKEN>');
    });
    ```

The `TOKEN_EXPIRED` event will occur 5 seconds before the token is going to expire.  We recommend that if you are setting an event listener, you do so before calling the `load` function on the player widget.

### Configuration details

We did a simple configuration for the player above, but it supports a wider range of options for configuration values.  Below are the supported fields:

| Name   | Type             | Description                         |
| ------ | ---------------- | ----------------------------------- |
| token  | string | Your JWT token for the widget |
| videoName | string | The name of the video resource  |
| clientApiEndpointUrl | string | The endpoint URL for the client API |

### Alternate ways to load the code into your application

The package used to get the code into your application is an [NPM package](https://www.npmjs.com/package/@azure/video-analyzer-widgets).  While in the above example the latest version  was loaded at run time directly from the repository, you can also download and install the package locally using:

```bash
npm install @azure/video-analyzer/widgets
```

Or you can import it within your application code using this for TypeScript:

```typescript
import { Player } from '@video-analyzer/widgets';
```

Or this for JavaScript if you want to create a player widget dynamically:
```javascript
<script async type="module" src="https://unpkg.com/@azure/video-analyzer-widgets@latest/dist/global.min.js"></script>
```

If you use this method to import, you will need to programatically create the player object after the import is complete.  In the preceding example, you added the module to the page using the `ava-player` HTML tag.  To create a player object through code, you can do the following in either JavaScript:

```javascript
const avaPlayer = new ava.widgets.player();
```

Or in TypeScript:

```typescript
const avaPlayer = new Player();
```

Then you must add it to the HTML:

```javascript
document.firstElementChild.appendChild(avaPlayer);
```

## Next steps

* Learn more about the [widget API](https://github.com/Azure/video-analyzer/tree/main/widgets)
