---
title: Tutorial - Enable file attachment support
author: jpeng-ms
ms.author: jopeng
ms.date: 05/26/2023
ms.topic: include
ms.service: azure-communication-services
---

This tutorial describes how to enable file attachment support by using the Azure Communication Services Chat SDK for JavaScript.

## Sample code
Find the finalized code of this tutorial on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/join-chat-to-teams-meeting).

## Prerequisites

* Review the quickstart [Join your Chat app to a Teams meeting](../../../quickstarts/chat/meeting-interop.md).
* Create an Azure Communication Services resource. For more information, see [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md). You need to *record your connection string* for this tutorial.
* Set up a Teams meeting by using your business account and have the meeting URL ready.
* Use the Chat SDK for JavaScript (@azure/communication-chat) 1.5.0 or the latest. For more information, see [Azure Communication Chat client library for JavaScript](https://www.npmjs.com/package/@azure/communication-chat).

## Goals

- Render file attachment in the message thread. Each file attachment card has an **Open** button.
- Render image attachments as inline images.

## Handle file attachments

The Chat SDK for JavaScript returns a `ChatAttachmentType` property of `file` for regular file attachments and `image` for message-inlined images.

```js
export interface ChatMessageReceivedEvent extends BaseChatMessageEvent {
  /**
   * Content of the message.
   */
  message: string;

  /**
   * Chat message attachment.
   */
  attachments?: ChatAttachment[];
  
  ...
}

export interface ChatAttachment {
  /** Id of the attachment */
  id: string;
  /** The type of attachment. */
  attachmentType: AttachmentType;
  /** The name of the attachment content. */
  name?: string;
  /** The URL that is used to provide the original size of the inline images */
  url?: string;
  /** The URL that provides the preview of the attachment */
  previewUrl?: string;
}

/** Type of supported attachments. */
export type ChatAttachmentType = "image" | "file" | "unknown";
```

For example, the following JSON shows what `ChatAttachment` might look like for an image attachment and a file attachment:

```json
"attachments": [
    {
        "id": "08a182fe-0b29-443e-8d7f-8896bc1908a2",
        "attachmentType": "file",
        "name": "business report.pdf",
        "previewUrl": "https://contoso.sharepoint.com/:u:/g/user/h8jTwB0Zl1AY"
    },
    {
        "id": "9d89acb2-c4e4-4cab-b94a-7c12a61afe30",
        "attachmentType": "image", 
        "name": "Screenshot.png",
        "url": "https://contoso.communication.azure.com/chat/threads/19:9d89acb29d89acb2@thread.v2/messages/123/images/9d89acb2-c4e4-4cab-b94a-7c12a61afe30/views/original?api-version=2023-11-15-preview",
        "previewUrl": "https://contoso.communication.azure.com/chat/threads/19:9d89acb29d89acb2@thread.v2/messages/123/images/9d89acb2-c4e4-4cab-b94a-7c12a61afe30/views/small?api-version=2023-11-15-preview"
      }
]
```

Now let's go back to the event handler you created in [Quickstart: Join your Chat app to a Teams meeting](../../../quickstarts/chat/meeting-interop.md) and add some extra logic to handle attachments with the `attachmentType` property of `file`:

```js
chatClient.on("chatMessageReceived", (e) => {
  console.log("Notification chatMessageReceived!");
  // Check whether the notification is intended for the current thread
  if (threadIdInput.value != e.threadId) {
     return;
  }
   
  if (e.sender.communicationUserId != userId) {
    renderReceivedMessage(e);
  } else {
    renderSentMessage(e.message);
  }
});

async function renderReceivedMessage(event) {
    messages += `<div class="container lighter"> ${event.message} </div>`;
    messagesContainer.innerHTML = messages;

    // Get the list of attachments and calls renderFileAttachments to construct a file attachment card
    var attachmentHtml = event.attachments
        .filter(attachment => attachment.attachmentType === "file")
        .map(attachment => renderFileAttachments(attachment))
        .join('');
    messagesContainer.innerHTML += attachmentHtml;
}

function renderFileAttachments(attachment) {
    var re = /(?:\.([^.]+))?$/;
    var fileExtension = re.exec(attachment.name)[1];  
    return '<div class="attachment-container">' +
        '<img class="attachment-icon" alt="attachment file icon" />' +
        '<div>' +
        '<p class="attachment-type">' + fileExtension + '</p>' +
        '<p>' + attachment.name + '</p>' +
        '<a href=' + attachment.previewUrl + ' target="_blank" rel="noreferrer">Open</a>' +
        '</div>' +
        '</div>';
}

```

Make sure you add some CSS for the attachment card:

```css
  /* Let's make the chat popup scrollable */
  .chat-popup {

     ...

     max-height: 650px;
     overflow-y: scroll;
}

 .attachment-container {
     overflow: hidden;
     background: #f3f2f1;
     padding: 20px;
     margin: 0;
     border-radius: 10px;
}
 .attachment-container img {
     width: 50px;
     height: 50px;
     float: left;
     margin: 0;
}
 .attachment-container p {
     font-weight: 700;
     margin: 0 5px 20px 0;
}
 .attachment-container {
     display: grid;
     grid-template-columns: 100px 1fr;
     margin-top: 5px;
}
 .attachment-icon {
     content: url("data:image/svg+xml;base64, ...");
}
 .attachment-container a {
     background-color: #dadada;
     color: black;
     font-size: 12px;
     padding: 10px;
     border: none;
     cursor: pointer;
     border-radius: 5px;
     text-align: center;
     margin-right: 10px;
     text-decoration: none;
     margin-top: 10px;
}
 .attachment-container a:hover {
     background-color: black;
     color: white;
}
 .attachment-type {
     position: absolute;
     color: black;
     border: 2px solid black;
     background-color: white;
     margin-top: 50px;
     font-family: sans-serif;
     font-weight: 400;
     padding: 2px;
     text-transform: uppercase;
     font-size: 8px;
}

```

That's all you need for handling file attachments. Next, let's run the code.

## Run the code

For Webpack, you can use the `webpack-dev-server` property to build and run your app. Run the following command to bundle your application host on a local web server:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

Or:

```console
npm start
```

## File attachment demo

1. Open your browser and go to `http://localhost:8080/`. Enter the meeting URL and the thread ID.

1. Send some file attachments from the Teams client.

    :::image type="content" source="./media/meeting-interop-features-file-attachment-1.png" alt-text="Screenshot that shows the Teams client with a sent message with three file attachments.":::

1. You should see the new message being rendered along with file attachments.

    :::image type="content" source="./media/meeting-interop-features-file-attachment-2.png" alt-text="Screenshot that shows a sample app with a received incoming message with three file attachments.":::

## Handle image attachments

Image attachments need to be treated differently than standard `file` attachments. Image attachments have the `attachmentType` property of `image`, which requires the communication token to retrieve either the preview or full-size images.

Before you continue, complete the tutorial that demonstrates [how to enable inline image support in your Chat app](../meeting-interop-features-inline-image.md). This tutorial describes how to fetch images that require a communication token in the request header. After you receive the image blob, you need to create an `ObjectUrl` property that points to this blob. Then you inject this URL into the `src` attribute of each inline image.

Now that you're familiar with how inline images work, you can render image attachments like a regular inline image.

First, inject an `image` tag into message content whenever there's an image attachment:

```js
async function renderReceivedMessage(event) {
    messages += '<div class="container lighter">' + event.message + '</div>';
    messagesContainer.innerHTML = messages;

    // Inject image tag for all image attachments
    var imageAttachmentHtml = event.attachments
        .filter(attachment => attachment.attachmentType === "image" && !messages.includes(attachment.id))
        .map(attachment => renderImageAttachments(attachment))
        .join('');
    messagesContainer.innerHTML += imageAttachmentHtml;

    // Get a list of attachments and calls renderFileAttachments to construct a file attachment card
    var attachmentHtml = event.attachments
        .filter(attachment => attachment.attachmentType === "file")
        .map(attachment => renderFileAttachments(attachment))
        .join('');
    messagesContainer.innerHTML += attachmentHtml;

    // Filter out inline images from attachments
    const imageAttachments = event.attachments.filter((attachment) =>
        attachment.attachmentType === "image" && messages.includes(attachment.id));

    // Fetch and render preview images
    fetchPreviewImages(imageAttachments);
}

function renderImageAttachments(attachment) {
    return `<img alt="image" src="" itemscope="png" id="${attachment.id}" style="max-width: 100px">`
}
```

Now, let's borrow `fetchPreviewImages()` from the [Tutorial: Enable inline image support](../meeting-interop-features-inline-image.md) and use it as is without any changes:

```js
function fetchPreviewImages(attachments) {
    if (!attachments.length > 0) {
        return;
    }
    Promise.all(
        attachments.map(async (attachment) => {
            const response = await fetch(attachment.previewUrl, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + tokenString,
                },
            });
            return {
                id: attachment.id,
                content: await response.blob(),
            };
        }),
    ).then((result) => {
        result.forEach((imageRef) => {
            const urlCreator = window.URL || window.webkitURL;
            const url = urlCreator.createObjectURL(imageRef.content);
            document.getElementById(imageRef.id).src = url;
        });
    }).catch((e) => {
        console.log('error fetching preview images');
    });
}
```

This function needs a `tokenString` property, so you need a global copy initialized in `init()`, as shown in the following code snippet:

```js
var tokenString = '';

async function init() {
    ...
    const {
        token,
        expiresOn
    } = tokenResponse;
    
    tokenString = token;
    ...
}
```

Now you have image attachment support. Continue to run the code and see it in action.

## Image attachment demo

1. Send some image attachments from the Teams client.

    :::image type="content" source="./media/meeting-interop-features-file-attachment-3.png" alt-text="Screenshot that shows the Teams client showing a send box with an image attachment uploaded.":::

1. After you send the image attachment, notice that it becomes an inline image on the Teams client side.

    :::image type="content" source="./media/meeting-interop-features-file-attachment-4.png" alt-text="Screenshot that shows the Teams client showing a message with the image attachment sent to the other participant.":::

1. Return to the sample app and make sure the same image is rendered.

    :::image type="content" source="./media/meeting-interop-features-file-attachment-5.png" alt-text="Screenshot that shows a sample app showing an incoming message with one inline image rendered.":::
