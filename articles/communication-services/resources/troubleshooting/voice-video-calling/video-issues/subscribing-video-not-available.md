---
title: Video issues - Subscribing to a video that is unavailable
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to handle the error when subscribing to a video that is unavailable.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/05/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---
# Subscribing to a video that is unavailable
The application tries to subscribe to a video when [isAvailable](/javascript/api/azure-communication-services/@azure/communication-calling/remotevideostream#@azure-communication-calling-remotevideostream-isavailable) is false.

Subscribing a video in this case results in failure.

This error is expected from SDK's perspective as applications shouldn't subscribe to a video that is currently not available.
## How to detect using the SDK
If you subscribe to a video that is unavailable, the [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest&preserve-view=true#@azure-communication-react-statefulcallclient-createview) API throws an error.


| error            | Details                                               |
|------------------|-------------------------------------------------------|
| code             | 412 (Precondition Failed)                             |
| subcode          | 43200                                                 |
| message          | Failed to create view, remote stream is not available |
| resultCategories | Expected                                              |

## How to mitigate or resolve
While the SDK throws an error in this scenario,
applications should refrain from subscribing to a video when the remote video isn't available, as it doesn't satisfy the precondition.

The recommended practice is to monitor the isAvailable change within the `isAvailable` event callback function and to subscribe to the video when `isAvailable` changes to `true`.
However, if there's asynchronous processing in the application layer, that might cause some delay before invoking [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest&preserve-view=true#@azure-communication-react-statefulcallclient-createview) API.
In such case, applications can check isAvailable again before invoking the createView API.
