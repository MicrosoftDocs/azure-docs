---
title: Audio issues - The user experiences delays during the call 
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when the user experiences delays during the call.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The user experiences delays during the call
High round trip time and high jitter buffer delay are the most common causes of audio delay.

There are several reasons that can cause high round trip time.
Besides the long distance or many hops between two endpoints, one common reason is network congestion, which occurs when the network is overloaded with traffic. If there's congestion, network packets wait in a queue for a long time.
Another possible reason is a high number of packets resend at the `TCP` layer if the client uses `TCP` or `TLS` relay. A high resend number can occur when packets are lost or delayed in transit.
In addition, the physical medium used to transmit data can also affect the round trip time. For example, Wi-Fi usually has higher network latency than Ethernet, which can lead to higher round trip times.

The jitter buffer is a mechanism used by the browser to compensate for packet jitter and reordering. Depending on network conditions, the length of the jitter buffer delay can vary. The jitter buffer delay refers to the amount of time that audio samples stay in the jitter buffer. A high jitter buffer delay can cause audio delays that are noticeable to the user.

## How to detect
### SDK
Through [User Facing Diagnostics Feature](../../../../concepts/voice-video-calling/user-facing-diagnostics.md), the application can register a listener callback to detect the network condition changes.

For the network quality of the audio sending end, you can check events with the values of `networkSendQuality`.

For the network quality of the receiving end, you can check events with the values of `networkReceiveQuality`.

In addition, the [MediaStats Feature](../../../../concepts/voice-video-calling/media-quality-sdk.md) also provides a way to monitor the network and audio quality.

For the quality of the audio sending end, you can check the metrics `rttInMs`.

For the quality of the receiving end, you can check the metrics `jitterInMs`, `jitterBufferDelayInMs`.

## How to mitigate or resolve
From the perspective of the ACS Calling SDK, network issues are considered external problems.
To solve network issues, it's often necessary to understand the network topology and the nodes causing the problem.
These parts involve network infrastructure, which is outside the scope of the ACS Calling SDK.

However, the browser can adaptively adjust the audio sending quality according to the network condition.
It's important for the application to handle events from the User Facing Diagnostics Feature or to monitor the metrics provided by the MediaStats feature.
In this way, users can be aware of any network quality issues and aren't surprised if they experience low-quality audio during a call.
