---
title: Video issues - The remote video becomes unavailable while subscribing the video
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to handle the error when the remote video becomes unavailable while subscribing the video.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/04/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---
# The remote video becomes unavailable while subscribing the video
The remote video is initially available, but during the video subscription process, it becomes unavailable.

The SDK detects this change and throws an error.

This error is expected from SDK's perspective as the remote endpoint stops sending the video.
## How to detect
### SDK
If the video becomes unavailable before the `createView` API finishes, the `createView` API throws an error.

The error code/subcode is

| error            | Details                                               |
|------------------|-------------------------------------------------------|
| code             | 404(Not Found)                                        |
| subcode          | 43202                                                 |
| message          | Failed to start stream, stream became unavailable     |
| resultCategories | Expected                                              |

## How to mitigate or resolve
Applications should catch and handle this error thrown by the SDK gracefully, so end users know the failure is because the remote participant stops sending video.
