---
title: Video issues - Overview of how to understand and mitigate quality issues
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview of video issues
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/05/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Overview of video issues

Establishing a video call involves many components and processes. Steps include the video stream acquisition from a camera device, browser encoding, browser decoding, video rendering, and so on.
If there's a problem in any of these stages, users may experience video-related issues.
For example, users may complain about being unable to see the video or the poor quality of the video.
Therefore, understanding how video content flow from the sender to the receiver is crucial for debugging and mitigating video issues.

## How a video call works from an end-to-end perspective

:::image type="content" source="./media/video-stream-flow.png" alt-text="Diagram of the end-to-end flow of video stream data":::

Here we use an Azure Communication Services group call as an example.

When the sender starts video in a call, the SDK internally retrieves the camera video stream via a browser API.
After the SDK completes the handshake at the signaling layer with the server, it begins sending the video stream to the server.
The browser performs video encoding and packetization at the RTP(Real-time Transport Protocol) layer for transmission.
The other participants in the call receive notifications from the server, indicating the availability of a video stream from the sender.
Your application can decide whether to subscribe to the video stream or not. 
If your application subscribes to the video stream from the server (for example, using [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest&preserve-view=true#@azure-communication-react-statefulcallclient-createview) API), the server forwards the sender's video packets to the receiver.
The receiver's browser decodes and renders the incoming video.

When you use ACS Web Calling SDK for video calls, the SDK and browser may adjust the video quality of the sender based on the available bandwidth.
The adjustment may include changes in resolution, frames per second, and target bitrate.
Additionally, CPU overload on the sender side can also influence the browser's decision on the target resolution for encoding.

## Common issues in video calls

We can see that the whole process involves factors such as the sender's camera device.
The network conditions at the sender and receiver end also play an important role.
Bandwidth and packets lost can impact the video quality perceived by the users.

Here we list several common video issues, along with potential causes for each issue:

### The user can't see video from the remote participant

* The sender's video isn't available when the user subscribes to it
* The remote video becomes unavailable while subscribing the video
* The application disposes the video renderer while subscribing the video
* The maximum number of active video subscriptions was reached
* The video sender's browser is in the background
* The video sender dropped the call unexpectedly
* The video sender experiences network issues
* The receiver experiences network issues
* The frames are received but not decoded

### The user only sees black video from the remote participant
* The video sender's browser is in the background

### The user experiences poor video quality
* The video sender has poor network
* The receiver has poor network
* Heavy load on the environment of the video sender or receiver
* The receiver subscribes multiple incoming video streams
