---
title: Video issues - The remote video becomes unavailable while subscribing the video
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to handle the error when the remote video becomes unavailable while subscribing the video
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

This is an expected error from SDK's perspective as the remote endpoint stops sending the video.
## How to detect
### SDK
You will get an error while invoking the `createView` API.

The error code/subcode is

| error            |                                                       |
|------------------|-------------------------------------------------------|
| code             | 404(NOT\_FOUND)                                       |
| subcode          | 43202                                                 |
| message          | Failed to start stream, stream became unavailable     |
| resultCategories | Expected                                              |

## How to monitor
### Azure log
...
### CDC
...
## How to mitigate or resolve
Applications should catch and handle this error thrown by the SDK gracefully, so end users know the failure is because the remote participant stops sending video.
