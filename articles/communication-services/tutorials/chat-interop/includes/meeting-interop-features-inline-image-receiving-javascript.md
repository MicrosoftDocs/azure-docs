---
title: Tutorial - Enable Inline Image Support
author: jopeng
ms.author: jopeng
ms.date: 03/27/2023
ms.topic: include
ms.service: azure-communication-services
---

In this tutorial, you learn how to enable inline image support using the Azure Communication Services Chat SDK for JavaScript.

Inline images are images that are copied and pasted directly into the send box of the Teams client. For images that were uploaded via the "Upload from this device" menu or via drag-and-drop, such as images dragged directly to the send box in Teams, you need to refer to [this tutorial](./meeting-interop-features-file-attachment.md) to enable it as the part of the file sharing feature. (See the section "Handling Image Attachment.") To copy an image, the Teams user can either use their operating system's context menu to copy the image file and then paste it into the send box of their Teams client or use keyboard shortcuts.

There are 2 parts in this tutorial, you learn what you need to do:
1. [when receiving an inline image](#handle-received-inline-images-in-new-message-event)
2. [when sending out an inline image](#handle-sending-inline-images-in-new-message-request)


Please note that the ability to send an inline image is currently available in public preview and it's only available for JavaScript only. And for receiving inline images, it's currently general available and available for both JavaScript and C# in a Teams interoperability chat. 


## Sample Code
Find the finalized code of this tutorial on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/join-chat-to-teams-meeting).


## Handle received inline images in new message event

In this section, we learn how we can render inline images embedded in the message content of new message received event.

## Prerequisites 

* You've gone through the quickstart - [Join your chat app to a Teams meeting](../../../quickstarts/chat/meeting-interop.md). 
* Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md). You need to **record your connection string** for this tutorial.
* You've set up a Teams meeting using your business account and have the meeting URL ready.
* You're using the Chat SDK for JavaScript (@azure/communication-chat) 1.4.0 or latest. See [here](https://www.npmjs.com/package/@azure/communication-chat).



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
  attachmentType: ChatAttachmentType;
  /** The name of the attachment content. */
  name?: string;
  /** The URL where the attachment can be downloaded */
  url?: string;
  /** The URL where the preview of attachment can be downloaded */
  previewUrl?: string;
}

export type ChatAttachmentType = "image" | "unknown";
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
    e.attachmentType.toLowerCase() === 'image');
  
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


 ## Handle sending inline images in new message request

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

In addition to handle messages with inline images, Chat SDK for JavaScript also provides a solution to allow the Communication User to send image attachments or inline images to the Microsoft Teams user in an interoperability chat.
 

## Prerequisites 

* You've gone through the previous section for [handling-received-inline-images-in-new-message-event](#handle-received-inline-images-in-new-message-event)
* You're using the Chat SDK for JavaScript (@azure/communication-chat) 1.6.0-beta.1 or latest. See [here](https://www.npmjs.com/package/@azure/communication-chat).


Let's take a look of the new API from `ChatThreadClient`:

```js
var imageAttachment = await chatThreadClient.uploadImage(blob, file.name, {
  "onUploadProgress": reportProgressCallback
});
```

Noticing the API takes in an image blob, file name string, and a function call back that reports upload progress.

Therefore, to send an image to other chat participant, we need to:

1. Upload the image via `uploadImage` API from `ChatThreadClient`, save the returned object to somewhere
2. Compose the message content and set attachment to the returned object we have saved in previous step
3. Send the new message via `sendMessage` API from from `ChatThreadClient`
4. Done!


So let's begin to create a new file picker that accepts images like the following:

```html
<label for="myfile">Attach images:</label>
<input id="upload" type="file" id="myfile" name="myfile" accept="image/*" multiple>
<input style="display: none;" id="upload-result"></input>
```

Next we need to set up a event licenser that will be called when there's a state change:

```
document.getElementById("upload").addEventListener("change", uploadImages);
```

Here we need to create a new function that will be called when state changes:

```
var uploadedImageModels = [];

async function uploadImages(e) {
  const files = e.target.files;
  if (files.length === 0) {
    return;
  }
  for (let key in files) {
    if (files.hasOwnProperty(key)) {
        await uploadImage(files[key]);
    }
  }
}



async function uploadImage(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64 = e.target.result;
    const blob = new Blob([base64], { type: "image/png" });
    const uploadedImageModel = await chatThreadClient.uploadImage(blob, {
      "name": file.name,
      "onUploadProgress": (progress) => {
        console.log(`[${file.name}]uploading: ${progress.loadedBytes}/${progress.totalBytes}`);
      }
    });
    uploadedImageModels.push(uploadedImageModel);
  };
  reader.readAsDataURL(file);
}
```

Noticing in this example, we have created a `FileReader` which will first read each image as `base64` encoded images, then create a `Blob` before calling the ChatSDK API to upload them. Also notice how we have created a global `uploadedImageModels` to save the data models of uploaded images from the ChatSDK.

Lastly we need to modify the sendMessageButton event listener we have created previously to attach images we have just uploaded.

```js
sendMessageButton.addEventListener("click", async () => {
  let message = messagebox.value;

  let attachments = uploadedImageModels;
  let sendMessageRequest = {
    content: message,
    attachments: attachments, // NEW
  };


  let sendMessageOptions = {
    senderDisplayName: "Jack",
  };
  let sendChatMessageResult = await chatThreadClient.sendMessage(
    sendMessageRequest,
    sendMessageOptions
  );
  let messageId = sendChatMessageResult.id;

  uploadedImageModels = []; // NEW

  messagebox.value = "";

  document.getElementById("upload").value = "";
  console.log(`Message sent!, message id:${messageId}`);
});

```

the newly added lines are marked by `// NEW`. 

That's it, now let's run the code and see it in action. 

## Run the code 

Webpack users can use the `webpack-dev-server` to build and run your app. Run the following command to bundle your application host on a local webserver:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

## Demo

Open your browser and navigate to `http://localhost:8080/`. Noticing we have a new section in the send box to attach images:

:::image type="content" source="./media/meeting-interop-features-inline-3.png" alt-text="A screenshot of Teams client shown a sent message reads: Here are some ideas, let me know what you think! The message also contains two inline images of room interior mockups.":::

Then we cab select images we wanted to attach:

:::image type="content" source="./media/meeting-interop-features-inline-1.png" alt-text="A screenshot of sample app shown an incoming message with inline images being presented.":::

Upon clicking send button, the Teams user should now receive the image we just sent out:

:::image type="content" source="./media/meeting-interop-features-inline-2.png" alt-text="A screenshot of sample app shown an overlay of a full scale image being presented.":::

