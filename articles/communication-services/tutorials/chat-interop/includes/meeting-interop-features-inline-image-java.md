---
title: Tutorial - Enable Inline Image Support
author: <TODO>
ms.author: <TODO>
ms.date: <TODO>
ms.topic: include
ms.service: azure-communication-services
---

In this tutorial, you learn how to enable inline image support using the Azure Communication Services Chat SDK for Java.

## Sample Code
Find the finalized code of this tutorial on [GitHub](<TODO>).

## Prerequisites 

* You've gone through the quickstart - [Join your chat app to a Teams meeting](../../../quickstarts/chat/meeting-interop.md). 
* Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md). You need to **record your connection string** for this tutorial.
* You've set up a Teams meeting using your business account and have the meeting URL ready.
* You're using the Chat SDK for Java (@azure/communication-chat<TODO>) X.X.X or latest. See [here](<TODO>).

## Goal

1. Be able to render preview images in the message thread
2. Be able to render full scale image upon click on preview images

## Handle inline images for new messages


In the [quickstart](../../../quickstarts/chat/meeting-interop.md), we've created an event handler for `chatMessageReceived` event, which would be trigger when we receive a new message from the Teams user. We have also appended incoming message content to `messageContainer` directly upon receiving the `chatMessageReceived` event from the `chatClient` like this:

```js
<TODO>
```
From incoming event of type `ChatMessageReceivedEvent`, there's a property named `attachments`, which contains information about inline image, and it's all we need to render inline images in our UI:

```js
<TODO>
```

Now let's go back to the previous code to add some extra logic like the following code snippets: 

```js
<TODO>
```

Noticing in this example, we've created two helper functions - `fetchPreviewImages` and `setImgHandler` - where the first one fetches preview image directly from the `previewURL` provided in each `ChatAttachment` object with an auth header. Similarly, we set up a `onclick` event for each image in the function `setImgHandler`, and in the event handler, we fetch a full scale image from property `url` from the `ChatAttachment` object with an auth header.


Another thing we need to do is to expose token on to the global level since we need to construct an auth header with it. So we need to modify the following code: 

```js
<TODO>
```

To show full scale image in an overlay, we need to add a new component as well:

```html

<TODO>

```

with some CSS:

<TODO>
  
```

Now we have an overlay set up, it's time to work on the logic to render full scale images. Recall that we've created an `onClick` event handler to call a function `fetchFullScaleImage`:

```js
<TODO>

```

One last thing we want to add is the ability to dismiss the overlay when clicking on the image:

```js
<TODO>
```

Now we've concluded all the changes we need to render inline images for messages coming from real time notifications.


## Run the code 

Webpack users can use the `webpack-dev-server` to build and run your app. Run the following command to bundle your application host on a local webserver:

```console
<TODO>
```

## Demo
Open your browser and navigate to `<TODO>`. Enter the meeting URL and the thread ID. Send some inline images from Teams client like this:

:::image type="content" source="<TODO>" alt-text="A screenshot of Teams client shown a sent message reads: Here are some ideas, let me know what you think! The message also contains two inline images of room interior mockups.":::

Then you should see the new message being rendered along with preview images:

:::image type="content" source="<TODO>" alt-text="A screenshot of sample app shown an incoming message with inline images being presented.":::

Upon clicking the preview image by the ACS user, an overlay would be shown with the full scale image sent by the Teams user:

 :::image type="content" source="<TODO>" alt-text="A screenshot of sample app shown an overlay of a full scale image being presented.":::
