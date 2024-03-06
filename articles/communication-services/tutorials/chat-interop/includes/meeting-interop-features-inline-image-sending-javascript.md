---
title: Tutorial - Enable Inline Image Support
author: jpeng-ms
ms.author: jopeng
ms.date: 03/05/2024
ms.topic: include
ms.service: azure-communication-services
---

## Handle sending images


Now we've concluded all the changes we need to send images to Microsoft Teams user in the interoperability chat.


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
