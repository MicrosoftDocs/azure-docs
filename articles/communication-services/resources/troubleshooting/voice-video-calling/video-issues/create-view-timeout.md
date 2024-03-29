---
title: Video issues - CreateView timeout
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot CreateView timeout error.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# CreateView timeout
When SDK expects to receive video frames but there are no incoming video frames,
SDK detects this issue and throws an createView timeout error.

It is an unexpected error from SDK's perspective as it indicates a discrepancy between signaling and media transport.
## How to detect
### SDK
When there is a `create view timeout` issue, the `createView` API throws an error.

The error code/subcode is

| error            | Details                                               |
|------------------|-------------------------------------------------------|
| code             | 408(Request Timeout)                                  |
| subcode          | 43203                                                 |
| message          | Failed to render stream, timeout                      |
| resultCategories | Unexpected                                            |

## Reasons behind createView timeout failures and how to mitigate the issue
### The video sender's browser is in the background
Some mobile devices don't send any video frame when the browser is in the background or the user locks the screen.
The `createView` API detects no incoming video frames and considers this situation a subscription failure, therefore, it throws a createView timeout error.
No further detailed information is available because currently the SDK doesn't support notifying receivers that the sender's browser is in the background.
To support this function requires the application to transmit this information through some messaging mechanisms, such as Data Channel or websocket.
By doing so, the application can present more information to end users.

Applications can implement their own detection mechanism, and notify the participants in a call when the sender's browser goes back to foreground.
The participants can subscribe the video again.
A feasible but less elegant approach for handling this createView timeout error is to continuously retry invoking `createView` API until it succeeds.

### The video sender has dropped the call unexpectedly
Sometimes, users don't end a call properly but instead directly terminate the browser process.
The server is unaware that the user has dropped the call until some timeout mechanism is triggered.
Currently the timeout value is 40 seconds, which means the participant remains on roster list until the server removes it.
If other participants try to subscribe to a video from the user who drops the call unexpectedly, they get an error as no incoming video frames are received.
No further detailed information is available because the server still keeps the participant in the roster list until a period of time passes without receiving a response before removing them.
In fact, we're unable to distinguish whether the lack of response is due to a network issue or because of the process termination on the sender's side.

In the future, when the SDK supports `Remote UFD`, the applications can handle this error gracefully.

### The video sender has network issues
If the sender has network issues during the time other participants are subscribing to the video. The video subscription may fail.
This error is unexpected from SDK's perspective currently as on the receiver's side, as we're unable to know the reason why the sender doesn't send video.
For example, if the sender experiences a temporary network disconnection, other participants are unable to receive video frames from the sender.
No further detailed information is available because currently the SDK doesn't support notifying receivers that the sender has network issues.

In the future, when the SDK supports `Remote UFD`, the applications can handle this error gracefully.
A feasible but less elegant approach for handling this createView timeout error is to continuously retry invoking `createView` API until it succeeds, as the network issue.

### The receiver has network issues
Similar to the sender's network issues, if a receiver has network issues. The video subscription may fail.
It could be due to high packet loss rate or temporary network disconnection.
The SDK can detect network disconnection and fires a `networkReconnect UFD` event.
However, in a WebRTC call, the default `STUN connectivity check` typically triggers a disconnection event after about 10-15 seconds of no response from the other party.
This means if there's a `networkReconnect UFD`, the receiver side might not have received packets for already 15 seconds.

If the application detects network disconnection on the receiver's side, it should subscribe to the video after `networkReconnect UFD` is recovered.
We have limited control over network issues on the end users' side. Thus, we advise monitoring the network information and presenting the information on the user interface.
The end users can know the current situation and understand that video subscription failure is due to the network on their side.

### When a participant enables the camera while waiting in the lobby
In an ACS-Teams call, if other participants attempt to subscribe to a video while the sender is still in the lobby, the `createView` API fails
because there will be no incoming video frames while the sender is still in the lobby.

Applications can delay the video subscription until the remote participant leaves the lobby and enters the call.
