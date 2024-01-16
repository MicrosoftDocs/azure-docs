---
title: Quickstart - Add AR filter to your app
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to add AR filter to your app using Azure Communication Services and DeepAR.
author: sloanster
services: azure-communication-services

ms.author: micahvivion
ms.date: 01/15/2024
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

In some usage scenarios, you may want to apply some video processing to the original camera video, such as background blur or background replacement.
This can provide a better user experience.
The Azure Communication Calling video effects package provide several video processing functions. However, this is not the only choice.
You can also integrate other video effects library with ACS raw media access API.
Let's try DeepAR to enrich your video with Argumented Reality!

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You need to **record your connection string** for this quickstart.
- A User Access Token to instantiate the call client. Learn how to [create and manage user access tokens](../../../identity/access-tokens.md). You can also use the Azure CLI and run the command with your connection string to create a user and an access token.
- DeepAR license key. [Getting started | DeepAR](https://docs.deepar.ai/deepar-sdk/platforms/web/getting-started).

## How video input and output work between ACS Web SDK and DeepAR
Both ACS Web SDK and DeepAR can read the camera device list and get the video stream directly from the device.
We want to provide consistency in the app, and DeepAR SDK provides a way for us to directly input a video stream acquired from ACS Web SDK.
Similarly, ACS Web SDK needs the processed video stream output from DeepAR SDK and sends this video stream to the remote endpoint.
DeepAR offers the option to use a canvas as an output. ACS Web SDK can consume the raw video stream captured from the canvas.

Here is the data flow:

:::image type="content" source="./media/deepar/videoflow.png" alt-text="The data flow between ACS SDK and DeepAR SDK":::


## Initialize DeepAR SDK

To enable DeepAR filters, you need to initialize DeepAR SDK, this can be done by invoking `deepar.initialize` API.
```javascript
const deepAR = await deepar.initialize({
    licenseKey: 'YOUR_LICENSE_KEY',
    canvas: canvas,
    additionalOptions: {
        cameraConfig: {
            disableDefaultCamera: true
        }
    }
});
```
Here we disable the default camera because we want ACS Web SDK to provide the source video stream.
The canvas is required as this provides a way for ACS Web SDK to consume the video output from DeepAR SDK.

## Connect the input and output



## Next steps
For more information, see the following articles:

- Learn about [Video effects](./get-started-video-effects.md?pivots=platform-web)
- Learn more about [Add video calling to your app](./get-started-with-video-calling.md?pivots=platform-web)
- DeepAR documentation. [Getting started | DeepAR](https://docs.deepar.ai/deepar-sdk/platforms/web/getting-started)
