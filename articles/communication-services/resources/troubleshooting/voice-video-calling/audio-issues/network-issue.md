---
title: Audio issues - There is a network issue in the call
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot one-way audio issue when there is a network issue in the call.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# There is a network issue in the call
## How to detect
When there is a netowrk reconnection in the call on the audio sending end or receiving end, the participant can experience one-way audio issue temporarily.
This is because shortly before and during the network is reconnecting, audio packets don't flow.

### SDK
Through [User Facing Diagnostics Feature](../../../../concepts/voice-video-calling/user-facing-diagnostics.md), the application can register a listener callback to detect the network condition changes.

For the network reconnection, you can check events with the values of `networkReconnect`.

## How to mitigate or resolve
From the perspective of the ACS Calling SDK, network issues are considered external problems.
To solve network issues, it is usually necessary to understand the network topology and the nodes causing the problem.
These parts involve network infrastructure, which is outside the scope of the ACS Calling SDK.

The application should listen to the UFD events mentioned above and display a warning message when receiving them,
so that the user is aware of the issue and understands that the audio loss is due to netowrk reconnection.

However, if the network reconnection occurs at the sender's side,
the users on the receiving end will not be able to know about it because currently the SDK doesn't support notifying receivers that the sender has network issues.

In the future, the SDK will support Remote UFD, which can detect this case quickly and provides applications a way to handle this error gracefully.

