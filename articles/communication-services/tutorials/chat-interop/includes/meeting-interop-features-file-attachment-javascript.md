---
title: Quickstart - Enable Inline Image Support
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
* You're using the Chat SDK for JavaScript (@azure/communication-chat) 1.3.2-beta.2 or the latest. See [here](https://www.npmjs.com/package/@azure/communication-chat).

## Goal

1. Be able to render file attachment in the message thread. Each file attachment will have two buttons - "Open" and "Download" respectively.
2. Be able to render image attachment.

## Handle file attachments

The Chat SDK for JavaScript would return `AttachmentType` of `file` for regular files and `teamsImage` for image attachments:

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
  attachmentType: AttachmentType;
  /** The type of content of the attachment, if available */
  contentType?: string;
  /** The name of the attachment content. */
  name?: string;
  /** The URL where the attachment can be downloaded */
  url: string;
  /** The URL where the preview of attachment can be downloaded */
  previewUrl?: string;
}

/** Type of Supported Attachments. */
export type AttachmentType = "teamsInlineImage" | "teamsImage" | "file";
```

As an example, this is what `ChatAttachment` might look like for an image attachment and a file attachment:

```js
"attachments": [
    {
        "id": "08a182fe-0b29-443e-8d7f-8896bc1908a2",
        "attachmentType": "file",
        "contentType": "pdf",
        "name": "business report.pdf",
        "url": "https://contoso.sharepoint.com/user/_layouts/download.aspx?share=h8jTwB0Zl1AY",
        "previewUrl": "https://contoso.sharepoint.com/:u:/g/user/h8jTwB0Zl1AY"
    },
    {
        "id": "9d89acb2-c4e4-4cab-b94a-7c12a61afe30",
        "attachmentType": "teamsImage",
        "contentType": "png",
        "name": "Screenshot.png",
        "url": "https://contoso.communication.azure.com/chat/threads/19:9d89acb29d89acb2@thread.v2/messages/123/teamsInterop/images/9d89acb2-c4e4-4cab-b94a-7c12a61afe30/views/original?api-version=2023-07-01-preview",
        "previewUrl": "https://contoso.communication.azure.com/chat/threads/19:9d89acb29d89acb2@thread.v2/messages/123/teamsInterop/images/9d89acb2-c4e4-4cab-b94a-7c12a61afe30/views/small?api-version=2023-07-01-preview"
      }
]
```

Now let's go back to event handler we have created in previous [quickstart](../../../quickstarts/chat/meeting-interop.md) to add some extra logic to handle attachments with `attachmentType` of `file`: 

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
    e.attachmentType.toLowerCase() === 'file');
  
  // fetch and render preview images
  fetchPreviewImages(imageAttachments);
}

```

That's it all we need for handling file attachments. Next, let's take a look of how we can handle image attachments.

## Handle image attachments




## Run the code 

Webpack users can use the `webpack-dev-server` to build and run your app. Run the following command to bundle your application host on a local webserver:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

## Demo
Open your browser and navigate to `http://localhost:8080/`. Enter the meeting URL and the thread ID. Send some file attachments from Teams client like this:

:::image type="content" source="../../media/meeting-interop-features-inline-3.png" alt-text="A screenshot of Teams client shown a sent message reads: Here are some ideas, let me know what you think! The message also contains two inline images of room interior mockups":::

Then you should see the new message being rendered along with preview images:

:::image type="content" source="../../media/meeting-interop-features-inline-1.png" alt-text="A screenshot of sample app shown an incoming message with inline images being presented":::

Upon clicking the preview image by the ACS user, an overlay would be shown with the full scale image sent by the Teams user:

 :::image type="content" source="../../media/meeting-interop-features-inline-2.png" alt-text="A screenshot of sample app shown an overlay of a full scale image being presented":::




