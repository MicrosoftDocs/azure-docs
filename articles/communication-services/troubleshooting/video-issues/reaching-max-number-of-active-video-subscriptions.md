---
title: Video issues - The maximum number of active video subscriptions has been reached
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to handle the error when the maximum number of active video subscriptions has been reached
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/04/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---
# The maximum number of active video subscriptions has been reached
Azure Communication Service currently imposes a maximum limit on the number of active video subscriptions, which is 10 videos on desktop browsers and 6 videos on mobile browsers.

If the application attempts to subscribe to a number of videos exceeding the limit, the SDK will throw an error.

This is an expected error from SDK's perspective as the application has reached the limit.
## How to detect
### SDK
You will get an error while invoking the `createView` API.

The error code/subcode is

| error            |                                                       |
|------------------|-------------------------------------------------------|
| code             | 400(BAD\_REQUEST)                                     |
| subcode          | 43220                                                 |
| message          | Failed to create view, maximum number of 10 active RemoteVideoStream has been reached. (*maximum number of 6* for mobile browsers) |
| resultCategories | Expected                                              |

## How to monitor
### Azure log
...
### CDC
...
## How to mitigate or resolve
Applications should catch and handle this error thrown by the SDK gracefully, so end users won't feel confused about not being able to see all the videos.
