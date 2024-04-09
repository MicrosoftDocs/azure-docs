---
title: Video issues - CreateView timeout
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot CreateView timeout error.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/05/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# CreateView timeout
When the calling SDK expects to receive video frames but there are no incoming video frames,
the SDK detects this issue and throws an createView timeout error.

This is an unexpected error from SDK's perspective as it indicates a discrepancy between signaling and media transport.
## How to detect using SDK
When there is a `create view timeout` issue, the [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest&preserve-view=true#@azure-communication-react-statefulcallclient-createview) API throws an error.

| Error            | Details                                               |
|------------------|-------------------------------------------------------|
| code             | 408(Request Timeout)                                  |
| subcode          | 43203                                                 |
| message          | Failed to render stream, timeout                      |
| resultCategories | Unexpected                                            |

## Reasons behind createView timeout failures and how to mitigate the issue
### The video sender's browser is in the background
Some mobile devices don't send any video frames when the browser is in the background or a user locks the screen.
The [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest&preserve-view=true#@azure-communication-react-statefulcallclient-createview) API detects no incoming video frames and considers this situation a subscription failure, therefore, it throws a createView timeout error.
No further detailed information is available because currently the SDK doesn't support notifying receivers that the sender's browser is in the background.

Your application can implement its own detection mechanism and notify the participants in a call when the sender's browser goes back to foreground.
The participants can subscribe the video again.
A feasible but less elegant approach for handling this createView timeout error is to continuously retry invoking the [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest&preserve-view=true#@azure-communication-react-statefulcallclient-createview) API until it succeeds.

### The video sender has dropped from the call unexpectedly
Sometimes, users don't end a call properly by hanging up but instead directly terminate the browser process.
The server is unaware that the user has dropped the call until a  timeout limited has been reached.
Currently the timeout value is 40 seconds, which means the participant remains on roster list until the server removes it (after 40 seconds).
If other participants try to subscribe to a video from the user who has droped from the call unexpectedly, they get an error as no incoming video frames are received.
No further detailed information is available because the server still keeps the participant in the roster list until a period of time passes without receiving a response before removing them.


### The video sender has network issues
If the video sender has network issues during the time other participants are subscribing to their video the video subscription may fail.
This is an unexpected erorr on the video receiver's side.
For example, if the sender experiences a temporary network disconnection, other participants are unable to receive video frames from the sender. 

A workaround approach for handling this createView timeout error is to continuously retry invoking [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest&preserve-view=true#@azure-communication-react-statefulcallclient-createview) API until it succeeds when this network event is happening.

### The vieo receiver has network issues
Similar to the sender's network issues, if a video receiver has network issues the video subscription may fail.
This could be due to high packet loss rate or temporary network connection errors.
The SDK can detect network disconnection and fires a [`networkReconnect`](../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web#network-values) UFD event.
However, in a WebRTC call, the default `STUN connectivity check` typically triggers a disconnection event after about 10-15 seconds of no response from the other party.
This means if there's a [`networkReconnect`](../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web#network-values) UFD, the receiver side might not have received packets for already 15 seconds.

If your application detects network dissues isconnection on the receiver's side, your application should subscribe to the video after [`networkReconnect`](../../../../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web#network-values) UFD is recovered.
You will likely have limited control over network issues . Thus, we advise monitoring the network information and presenting the information on the user interface. You should also consider monitoring your client [media quality and network status](../../../../concepts/voice-video-calling/media-quality-sdk.md?pivots=platform-web) and make necessary changes to your client as needed. For instance you might consider automatically turning off incoming video streams when you notice that the client is experience degraded network performance.

### When a user enables the camera while waiting in the lobby
In an ACS to Teams call, if other participants attempt to subscribe to a video while the video sender is still in the lobby, the [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest&preserve-view=true#@azure-communication-react-statefulcallclient-createview)  API fails
because of no incoming video frames are received while the sender is still in the lobby.
