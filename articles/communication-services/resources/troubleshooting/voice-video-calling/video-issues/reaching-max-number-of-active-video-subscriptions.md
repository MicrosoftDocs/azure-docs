---
title: Video issues - The maximum number of active incoming video subscriptions is exceeded 
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to handle errors when the maximum number of active incoming video subscriptions has reached the limit
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/05/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---
# The maximum number of active incoming video streamms is reached the limit or been exceeded
Azure Communication Service currently imposes a maximum limit on the number of active incoming video subscriptions that can be rendered at a time. The current line is 10 videos on desktop browsers and 6 videos on mobile browsers. Review the [supported browser list](https://learn.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/calling-sdk-features#javascript-calling-sdk-support-by-os-and-browser) to review the what browsers currently work with Azure Communication Services WebJS sdk.

## How to detect using the SDK
If the number of active video subscriptions exceeds the maximum limits, the [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest#@azure-communication-react-statefulcallclient-createview) API throws an error.


| Error details    | Details                                               |
|------------------|-------------------------------------------------------|
| code             | 400(Bad Request)                                      |
| subcode          | 43220                                                 |
| message          | Failed to create view, maximum number of 10 active RemoteVideoStream has been reached. (*maximum number of 6* for mobile browsers) |
| resultCategories | Expected                                              |

## How to ensure that your client subscribes to the correct number of video streams
Your applications should catch and handle this error thrown by the SDK gracefully. To best understand how many incoming videos that should be rendered you should ensure that your application use the [Optimal Video Count (OVC)](https://learn.microsoft.com/en-us/azure/communication-services/how-tos/calling-sdk/manage-video?pivots=platform-web#remote-video-quality) API and only display the correct number of incoming videos that can be rendered at at time.
