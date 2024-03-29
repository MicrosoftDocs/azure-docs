---
title: Video issues - The application disposes the video renderer while subscribing the video
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to handle the error when the application disposes the video renderer while subscribing the video.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/04/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---
# The application disposes the video renderer while subscribing the video
The `createView` promise API doesn't resolve immediately, as there are multiple underlying asynchronous operations involved in the video subscription process.

If the application disposes of the render object while the video subscription is in progress, the `createView` API throws an error.

This is an expected error from SDK's perspective as the application decides to dispose of the renderer object.
## How to detect
### SDK
You get an error while invoking the `createView` API.

The error code/subcode is

| error            | Details                                               |
|------------------|-------------------------------------------------------|
| code             | 405(Method Not Allowed)                               |
| subcode          | 43209                                                 |
| message          | Failed to start stream, disposing stream              |
| resultCategories | Expected                                              |

## How to mitigate or resolve
The application should verify whether it intends to dispose the renderer or if it is due to an unexpected renderer disposal.
The unexpected renderer disposal can be triggered when certain UI resources release at the application layer.
If the application indeed has the potential to dispose of the renderer during video subscription, it should gracefully handle this error thrown by the SDK.
Therefore, we can ensure that the end user is informed that the video subscription has been cancelled.
