---
title: Quickstart - Enable Inline Image Support
author: jopeng
ms.author: jopeng
ms.date: 03/27/2023
ms.topic: include
ms.service: azure-communication-services
---

In this quickstart, you will learn how to enable inline image support using the Azure Communication Services Chat SDK for JavaScript.

## Sample Code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/join-chat-to-teams-meeting).

## Prerequisites 

* You've gone through previous quickstart - [Join your chat app to a Teams meeting](../meeting-interop.md). 
* You're able to obtain an Azure Communication Resource connection string
* You've set up a Teams meeting using your business account and have the meeting URL ready
* You're using the Chat SDK for JavaScript (@azure/communication-chat) 1.3.2-beta.1 or latest.

## Goal
1. Be able to render preview images in message thread
2. Be able to render full scale image upon click on preview images

## Handle inline images for new messages


In the [last quickstart](../meeting-interop.md), we've created an event handler for `chatMessageReceived` event, which would be trigger when we receive a new message from the Teams user. We have also appended incoming message content to `messageContainer` directly upon receiving the `chatMessageReceived` event from the `chatClient` like this:

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
From incoming event of type `ChatMessageReceivedEvent`, there's a property named `attachments`, which contains information about inline image, and it is all we need to render inline images in our UI:

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

Now let's go back to the previous code to add some extra logic like the following: 

```js
chatClient.on("chatMessageReceived", (e) => {
  console.log("Notification chatMessageReceived!");
  if (e.sender.communicationUserId != userId) {
    renderReceivedMessage(e);
  } else {
    renderSentMessage(e);
  }
});

async function renderReceivedMessage(e) {
  const messageContent = e.message;

  const card = document.createElement('div');
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

Now we've concluded all the changes we need to render inline images for messages coming from real time notifications.


## Handle inline images for past messages

The Chat SDK for JavaScript also provides an API to let you retrieve a list of messages in a chat thread. It's important to note that the ACS user would only be able to retrieve messages after they've been admitted to a call. They won't be able to access the chat thread after leaving the call. So the use case of this functionality is relatively limited.

## Run the code

Webpack users can use the `webpack-dev-server` to build and run your app. Run the following command to bundle your application host on a local webserver:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

Open your browser and navigate to http://localhost:8080/. You should see the following:

:::image type="content" source="../join-teams-meeting-chat-quickstart.png" alt-text="Screenshot of the completed JavaScript Application.":::

Insert the Teams meeting link and thread ID into the text boxes. Press *Join Teams Meeting* to join the Teams meeting. After the Communication Services user has been admitted into the meeting, you can chat from within your Communication Services application. Navigate to the box at the bottom of the page to start chatting. For simplicity, the application will only show the last two messages in the chat.

> [!NOTE] 
> Currently only sending, receiving, editing messages and sending typing notifications is supported for interoperability scenarios with Teams. Other features like read receipts and Communication Services users adding or removing other users from the Teams meeting are not supported.
