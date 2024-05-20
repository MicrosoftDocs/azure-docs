---
title: Video issues - The maximum number of active incoming video subscriptions is exceeded 
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to handle errors when the maximum number of active incoming video subscriptions was reached
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/05/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---
# The maximum number of active incoming video streams is reached the limit or been exceeded
Azure Communication Service currently imposes a maximum limit on the number of active incoming video subscriptions that are rendered at a time. The current limit is 10 videos on desktop browsers and 6 videos on mobile browsers. Review the [supported browser list](../../../../concepts/voice-video-calling/calling-sdk-features.md#javascript-calling-sdk-support-by-os-and-browser) to see what browsers currently work with Azure Communication Services WebJS SDK.

## How to detect using the SDK
If the number of active video subscriptions exceeds the limit, the [`createView`](/javascript/api/%40azure/communication-react/statefulcallclient?view=azure-node-latest&preserve-view=true#@azure-communication-react-statefulcallclient-createview) API throws an error.


| Error details    | Details                                               |
|------------------|-------------------------------------------------------|
| code             | 400(Bad Request)                                      |
| subcode          | 43220                                                 |
| message          | Failed to create view, maximum number of 10 active RemoteVideoStream has been reached. (*maximum number of 6* for mobile browsers) |
| resultCategories | Expected                                              |

## How to ensure that your client subscribes to the correct number of video streams
Your applications should catch and handle this error gracefully. To understand how many incoming videos  should be rendered, use the [Optimal Video Count (OVC)](../../../../how-tos/calling-sdk/manage-video.md?pivots=platform-web#remote-video-quality) API. Only display the correct number of incoming videos that can be rendered at a given time.
