---
title: Audio issues - The user's speaker has a problem
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot one-way audio issue when the user's speaker has a problem.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The user's speaker has a problem
When the user's speaker has a problem, they may not be able to hear the audio, resulting in one-way audio issue in the call.

## How to detect
### SDK
There's no way for a web application to detect speaker issues.
However, the application can use the [MediaStats Feature](../../../../concepts/voice-video-calling/media-quality-sdk.md) 
to understand whether the incoming audio is actually silent or not.

To check the audio level at the receiving end, look at `audioOutputLevel` value, which also ranges from 0 to 65536.
This value indicates the volume level of the decoded audio samples.
If the `audioOutputLevel` value isn't always low but the user can't hear audio, this indicates there's a problem in the their speaker or output volume settings.

## How to mitigate or resolve
Speaker issues are considered external problems from the perspective of the ACS Calling SDK.

It's recommended that the application implement a remote volume indicator function with the [getVolume API](https://learn.microsoft.com/en-us/javascript/api/azure-communication-services/@azure/communication-calling/remoteaudiostream?view=azure-communication-services-js) provided by SDK.
If the incoming audio isn't silent, the user can know that the issue occurs in their speaker or output volume settings and can troubleshoot accordingly.
