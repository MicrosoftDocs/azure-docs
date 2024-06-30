---
title: Video issues - The application disposes the video renderer while subscribing the video
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to handle the error when the application disposes the video renderer while subscribing the video.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/05/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---
# Your application disposes the video renderer while subscribing to a video
The [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest&preserve-view=true#@azure-communication-react-statefulcallclient-createview)  API doesn't resolve immediately, as there are multiple underlying asynchronous operations involved in the video subscription process and thus this API response is an asynchronous response.

If your application disposes of the render object while the video subscription is in progress, the [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest&preserve-view=true#@azure-communication-react-statefulcallclient-createview) API throws an error.

## How to detect using the SDK


| Error           | Details                                               |
|------------------|-------------------------------------------------------|
| code             | 405(Method Not Allowed)                               |
| subcode          | 43209                                                 |
| message          | Failed to start stream, disposing stream              |
| resultCategories | Expected                                              |

## How to mitigate or resolve
Your  application should verify whether it intends to dispose the renderer or if it's due to an unexpected renderer disposal.
The unexpected renderer disposal can be triggered when certain user interface resources are released in the application layer.
If your application indeed needs to dispose of the renderer video during video subscription, it should gracefully handle this error thrown by the SDK.
