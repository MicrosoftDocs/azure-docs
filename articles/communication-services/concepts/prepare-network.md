---
title: Prepare your organization's network for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about how to prepeare your network for Azure Communication Services
author:  nmurav
services: azure-communication-services

ms.author: nmurav
ms.date: 3/1/2021
ms.topic: overview
ms.service: azure-communication-services

---


# Prepare your organization's network for Azure Communication Services

## Network requirements
Ensuring your network can support the Azure Communication Services Real-time scenarios is the key for high-quality conversations,

Do all your locations have internet access? At a minimum, in addition to regular web traffic, make sure you've opened the following, for all locations, for media in Azure Communication Services:


 |  |  |
 |---------|---------|
 |Ports     |UDP ports <strong>3478</strong> through <strong>3481</strong>        |
 |[IP addresses](https://www.microsoft.com/en-us/download/confirmation.aspx?id=56519) | Range listed on the [link](https://www.microsoft.com/en-us/download/confirmation.aspx?id=56519)         |

If you use TCP (Transmission Control Protocol) for Real-Time Protocol, the packets lost due to network conditions will be retransmitted. The retransmission might cause issues with audio and video streams. 
User Datagram Protocol (UDP) does not retransmit lost packets. Audio/video codecs compensate for the lost packets.
Let take an example where Alice's application sends three packets (TCP1, TCP2, and TCP3) to Bob's application. If the TCP2 packet lost, the protocol will try to retransmit the TCP2 packet. Alice already started transmitting the next set of packets. Retransmission will slow down the conversation and can cause audio/video distortions.

If the Alice app uses UDP, sends three packets (UDP1, UDP2, UDP3) and UDP2 lost, the UDP protocol will not retransmit. The audio/video codec will compensate for the absence of UDP2 in Bob's application. Alice application can continue sending the next set of packets without slowing down the conversation. 

In addiotn, one more component will be brought to the call flow, the TURN service. The Turn Sevice will translate the TCP to UDP. Please refer to this page to [learn about call flows in Azure Communication Services](https://docs.microsoft.com/en-us/azure/communication-services/concepts/call-flows#case-4-group-calls-with-pstn)


## Bandwith requirements

Azure Communication Services is designed to give the best audio, video, and content sharing experience regardless of your network conditions. That said, when bandwidth is insufficient, Azure Communication Services prioritizes audio quality over video quality.

Where bandwidth isn't limited, Azure Communication Services optimizes media quality, including up to 1080p video resolution, up to 30fps for video and 15fps for content, and high-fidelity audio.

This table describes how Azure Communication Services  uses bandwidth. Azure Communiation Services is always conservative on bandwidth utilization and can deliver HD video quality in under 1.2Mbps. The actual bandwidth consumption in each audio/video call or meeting will vary based on several factors, such as video layout, video resolution, and video frames per second. When more bandwidth is available, quality and usage will increase to deliver the best experience.

|Bandwidth(up/down) |Scenarios |
|---|---|
|30 kbps |Peer-to-peer audio calling |
|130 kbps |Peer-to-peer audio calling and screen sharing |
|500 kbps |Peer-to-peer quality video calling 360p at 30fps |
|1.2 Mbps |Peer-to-peer HD quality video calling with resolution of HD 720p at 30fps |
|1.5 Mbps |Peer-to-peer HD quality video calling with resolution of HD 1080p at 30fps |
|500kbps/1Mbps |Group Video calling |
|1Mbps/2Mbps |HD Group video calling (540p videos on 1080p screen) |

