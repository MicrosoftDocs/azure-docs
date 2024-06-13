---
title: Audio issues - There's a network issue in the call
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot one-way audio issue when there's a network issue in the call.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/09/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# There's a network issue in the call
When there's a network reconnection in the call on the audio sending end or receiving end, the participant can experience one-way audio issue temporarily.
It can cause an audio issue because shortly before and during the network is reconnecting, audio packets don't flow.

## How to detect using the SDK
Through [User Facing Diagnostics API](../../../../concepts/voice-video-calling/user-facing-diagnostics.md), your application can register a listener callback to detect the network condition changes.

For the network reconnection, you can check events with the values of `networkReconnect`.

## How to mitigate or resolve
From the perspective of the ACS Calling SDK, network issues are considered external problems.
To solve network issues, it's often necessary to understand the network topology and the nodes causing the problem.
These parts involve network infrastructure, which is outside the scope of the ACS Calling SDK.

The application should listen to the `networkReconnect` event and display a warning message when receiving them,
so that the user is aware of the issue and understands that the audio loss is due to network reconnection.

However, if the network reconnection occurs at the sender's side,
users on the receiving end are unable to know about it because currently the SDK doesn't support notifying receivers that the sender has network issues.

