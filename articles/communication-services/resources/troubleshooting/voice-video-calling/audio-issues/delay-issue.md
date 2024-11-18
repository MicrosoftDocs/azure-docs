---
title: Audio issues - The user experiences delays during the call 
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when the user experiences delays during the call.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/10/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The user experiences delays during the call
High round trip time and high jitter buffer delay are the most common causes of audio delay.

There are several reasons that can cause high round trip time.
Besides the long distance or many hops between two endpoints, one common reason is network congestion, which occurs when the network is overloaded with traffic.
If there's congestion, network packets wait in a queue for a longer time.
Another possible reason is a high number of packets resend at the `TCP` layer if the client uses `TCP` or `TLS` relay.
A high resend number can occur when packets are lost or delayed in transit.
In addition, the physical medium used to transmit data can also affect the round trip time.
For example, Wi-Fi usually has higher network latency than Ethernet, which can lead to higher round trip times.

The jitter buffer is a mechanism used by the browser to compensate for packet jitter and reordering.
Depending on network conditions, the length of the jitter buffer delay can vary.
The jitter buffer delay refers to the amount of time that audio samples stay in the jitter buffer.
A high jitter buffer delay can cause audio delays that are noticeable to the user.

## How to detect using the SDK
You can use the [User Facing Diagnostics API](../../../../concepts/voice-video-calling/user-facing-diagnostics.md) to detect the network condition changes.
For the network quality of the audio sending end, check UFD events with the values of `networkSendQuality`.
For the network quality of the receiving end, check UFD events with the values of `networkReceiveQuality`.

In addition, you can use the  [Media Stats API](../../../../concepts/voice-video-calling/media-quality-sdk.md) to monitor and track real-time network performance from the Web client.
There are two metrics related to the audio delay: `rttInMs` and `jitterBufferDelayInMs`.

The [rttInMs](../../../../concepts/voice-video-calling/media-quality-sdk.md?pivots=platform-web#audio-send-metrics) has a direct impact on the audio delay, as the metric indicates the round trip time of packets. High latency can result in perceptible delays in audio.
We recommend a round-trip time of 200 ms or less.
If the round-trip time is larger than 500 ms, users may experience significant delays that can lead to frustration and hinder effective communication. In such cases, the conversation flow can be disrupted, making it difficult to have a smooth and natural interaction.

In [jitterBufferDelayInMs](../../../../concepts/voice-video-calling/media-quality-sdk.md?pivots=platform-web#audio-receive-metrics) shows how long the audio samples stay in the jitter buffer.
This value can be affected by various factors, such as late arrival of packets, out-of-order, packet loss, etc.
Normally, it's less than 200 ms. Users may notice audio delays in the call if this value is high.

## How to mitigate or resolve
From the perspective of the ACS Calling SDK, network issues are considered external problems.
To solve network issues, it's often necessary to understand the network topology and the nodes causing the problem.
These parts involve network infrastructure, which is outside the scope of the ACS Calling SDK.

However, the browser can adaptively adjust the audio sending quality according to the network condition.
It's important for the application to handle events from the [User Facing Diagnostics API](../../../../concepts/voice-video-calling/user-facing-diagnostics.md) or to monitor the metrics provided by the MediaStats feature.
In this way, users can be aware of any network quality issues and aren't surprised if they experience low-quality audio during a call.
