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

## References
### Troubleshooting process
If a user can't hear sound during a call, one possibility is that the speaking participant or the receiving end has network issues.

Below is a flow diagram of the troubleshooting process for this issue.

:::image type="content" source="./media/network-issue-troubleshooting.svg" alt-text="Diagram of troubleshooting the network issue.":::

1. First, check if there's a `networkReconnect` UFD. The user may experience audio loss during the network reconnection.
2. The UFD can happen on either the sender's end or the receiver's end. In both cases, packets don't flow, so the user can't hear the audio.
3. If there's no `networkReconnect` UFD, consider other potential causes, such as permission issues or device problems.
4. If the permission is denied, refer to [The speaking participant doesn't grant the microphone permission](./microphone-permission.md) for more information.
5. The issue could also be due to device problems, refer to [The speaking participant's microphone has a problem](./microphone-issue.md).
