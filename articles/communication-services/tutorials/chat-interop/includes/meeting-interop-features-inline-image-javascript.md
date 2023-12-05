---
title: Tutorial - Enable Inline Image Support
author: jopeng
ms.author: jopeng
ms.date: 03/27/2023
ms.topic: include
ms.service: azure-communication-services
---

In this tutorial, you learn how to enable inline image support using the Azure Communication Services Chat SDK for JavaScript.

## Sample Code
Find the finalized code of this tutorial on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/join-chat-to-teams-meeting).

## Prerequisites 

* You've gone through the quickstart - [Join your chat app to a Teams meeting](../../../quickstarts/chat/meeting-interop.md). 
* Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md). You need to **record your connection string** for this tutorial.
* You've set up a Teams meeting using your business account and have the meeting URL ready.
* You're using the Chat SDK for JavaScript (@azure/communication-chat) 1.3.2-beta.1 or latest. See [here](https://www.npmjs.com/package/@azure/communication-chat).

## Goal

1. Be able to render preview images in the message thread
2. Be able to render full scale image upon click on preview images

## Handle inline images for new messages


In the [quickstart](../../../quickstarts/chat/meeting-interop.md), we've created an event handler for `chatMessageReceived` event, which would be trigger when we receive a new message from the Teams user. We have also appended incoming message content to `messageContainer` directly upon receiving the `chatMessageReceived` event from the `chatClient` like this:

```js
chatClient.on("chatMessageReceived", (e) => {
   console.log("Notification chatMessageReceived!");

   // check whether the notification is intended for the current thread
   if (threadIdInput.value != e.threadId) {
      return;
   }

   if (e.sender.communicationUserId != userId) {
      renderReceivedMessage(e.message);
   }
   else {
      renderSentMessage(e.message);
   }
});
   
async function renderReceivedMessage(message) {
   messages += '<div class="container lighter">' + message + '</div>';
   messagesContainer.innerHTML = messages;
}
```
From incoming event of type `ChatMessageReceivedEvent`, there's a property named `attachments`, which contains information about inline image, and it's all we need to render inline images in our UI:

```js
export interface ChatMessageReceivedEvent extends BaseChatMessageEvent {
  /**
   * Content of the message.
   */
  message: string;

  /**
   * Metadata of the message.
   */
  metadata: Record<string, string>;

  /**
   * Chat message attachment.
   */
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  /** Id of the attachment */
  id: string;
  /** The type of attachment. */
  attachmentType: "teamsInlineImage"
  /** The type of content of the attachment, if available */
  contentType?: string;
  /** The name of the attachment content. */
  name?: string;
  /** The URL where the attachment can be downloaded */
  url: string;
  /** The URL where the preview of attachment can be downloaded */
  previewUrl?: string;
}
```

Now let's go back to the previous code to add some extra logic like the following code snippets: 

```js
chatClient.on("chatMessageReceived", (e) => {
  console.log("Notification chatMessageReceived!");
  // check whether the notification is intended for the current thread
  if (threadIdInput.value != e.threadId) {
     return;
  }
   
  if (e.sender.communicationUserId != userId) {
    renderReceivedMessage(e);
  } else {
    renderSentMessage(e.message);
  }
});

async function renderReceivedMessage(e) {
  const messageContent = e.message;

  const card = document.createElement('div');
  card.className = 'container lighter';
  card.innerHTML = messageContent;
  
  messagesContainer.appendChild(card);
  
  // filter out inline images from attchments
  const imageAttachments = e.attachments.filter((e) =>
    e.attachmentType.toLowerCase() === 'teamsinlineimage');
  
  // fetch and render preview images
  fetchPreviewImages(imageAttachments);
  
  // set up onclick event handler to fetch full scale image
  setImgHandler(card, imageAttachments);
}

function setImgHandler(element, imageAttachments) {
  // do nothing if there's no image attachments
  if (!imageAttachments.length > 0) {
    return;
  }
  const imgs = element.getElementsByTagName('img');
  for (const img of imgs) {
    img.addEventListener('click', (e) => {
      // fetch full scale image upon click
      fetchFullScaleImage(e, imageAttachments);
    });
  }
}

async function fetchPreviewImages(attachments) {
  if (!attachments.length > 0) {
    return;
  }
  // since each message could contain more than one inline image
  // we need to fetch them individually 
  const result = await Promise.all(
      attachments.map(async (attachment) => {
        // fetch preview image from its 'previewURL'
        const response = await fetch(attachment.previewUrl, {
          method: 'GET',
          headers: {
            // the token here should the same one from chat initialization
            'Authorization': 'Bearer ' + tokenString,
          },
        });
        // the response would be in image blob we can render it directly
        return {
          id: attachment.id,
          content: await response.blob(),
        };
      }),
  );
  result.forEach((imageResult) => {
    const urlCreator = window.URL || window.webkitURL;
    const url = urlCreator.createObjectURL(imageResult.content);
    // look up the image ID and replace its 'src' with object URL
    document.getElementById(imageResult.id).src = url;
  });
}
```

Noticing in this example, we've created two helper functions - `fetchPreviewImages` and `setImgHandler` - where the first one fetches preview image directly from the `previewURL` provided in each `ChatAttachment` object with an auth header. Similarly, we set up a `onclick` event for each image in the function `setImgHandler`, and in the event handler, we fetch a full scale image from property `url` from the `ChatAttachment` object with an auth header.


Another thing we need to do is to expose token on to the global level since we need to construct an auth header with it. So we need to modify the following code: 

```js
// new variable for token string
var tokenString = '';

async function init() {

   ....
   
   let tokenResponse = await identityClient.getToken(identityResponse, [
      "voip",
      "chat"
	]);
	const { token, expiresOn } = tokenResponse;
   
   // save to token string
   tokenString = token;
   
   ...
}

```

To show full scale image in an overlay, we need to add a new component as well:

```html

<div class="overlay" id="overlay-container">
   <div class="content">
      <img id="full-scale-image" src="" alt="" />
   </div>
</div>

```

with some CSS:

```css

/* let's make chat popup scrollable */
.chat-popup {

   ...
   
   max-height: 650px;
   overflow-y: scroll;
}

 .overlay {
    position: fixed; 
    width: 100%; 
    height: 100%;
    background: rgba(0, 0, 0, .7);
    top: 0;
    left: 0;
    z-index: 100;
 }

.overlay .content {
   position: fixed; 
   width: 100%;
   height: 100%;
   text-align: center;
   overflow: hidden;
   z-index: 100;
   margin: auto;
   background-color: rgba(0, 0, 0, .7);
}

.overlay img {
   position: absolute;
   display: block;
   max-height: 90%;
   max-width: 90%;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
}

#overlay-container {
   display: none
}
```

Now we have an overlay set up, it's time to work on the logic to render full scale images. Recall that we've created an `onClick` event handler to call a function `fetchFullScaleImage`:

```js

const overlayContainer = document.getElementById('overlay-container');
const loadingImageOverlay = document.getElementById('full-scale-image');

function fetchFullScaleImage(e, imageAttachments) {
  // get the image ID from the clicked image element
  const link = imageAttachments.filter((attachment) =>
    attachment.id === e.target.id)[0].url;
  loadingImageOverlay.src = '';
  
  // fetch the image
  fetch(link, {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + tokenString},
  }).then(async (result) => {
   
    // now we set image blob to our overlay element
    const content = await result.blob();
    const urlCreator = window.URL || window.webkitURL;
    const url = urlCreator.createObjectURL(content);
    loadingImageOverlay.src = url;
  });
  // show overlay
  overlayContainer.style.display = 'block';
}

```

One last thing we want to add is the ability to dismiss the overlay when clicking on the image:

```js
loadingImageOverlay.addEventListener('click', () => {
  overlayContainer.style.display = 'none';
});

```

Now we've concluded all the changes we need to render inline images for messages coming from real time notifications.


## Run the code 

Webpack users can use the `webpack-dev-server` to build and run your app. Run the following command to bundle your application host on a local webserver:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

## Demo
Open your browser and navigate to `http://localhost:8080/`. Enter the meeting URL and the thread ID. Send some inline images from Teams client like this:

:::image type="content" source="./media/meeting-interop-features-inline-3.png" alt-text="A screenshot of Teams client shown a sent message reads: Here are some ideas, let me know what you think! The message also contains two inline images of room interior mockups.":::

Then you should see the new message being rendered along with preview images:

:::image type="content" source="./media/meeting-interop-features-inline-1.png" alt-text="A screenshot of sample app shown an incoming message with inline images being presented.":::

Upon clicking the preview image by the Azure Communication Services user, an overlay would be shown with the full scale image sent by the Teams user:

 :::image type="content" source="./media/meeting-interop-features-inline-2.png" alt-text="A screenshot of sample app shown an overlay of a full scale image being presented.":::

