---
title: Prepare your organization's network for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn aboUnderstand the network requirements for Azure Commumnication Service Voice and Video Calling
author: mikben
manager: jken
services: azure-communication-services

ms.author: nmurav
ms.date: 3/14/2021
ms.topic: overview
ms.service: azure-communication-services
---


# Prepare your organization's network for Azure Communication Services

## Network requirements
Ensuring your network can support the Azure Communication Services Real-time scenarios is the key for high-quality conversations,
Do all your locations have internet access? At a minimum, in addition to regular web traffic, make sure you've opened the following, for all locations, for media in Azure Communication Services:

 | |  |
 |---------|---------|
 |Ports     |UDP ports <strong>3478</strong> through <strong>3481</strong>, TCP ports <strong>443</strong> |
 |IP addresses | [Range of Azure Public Cloud IP Addresses](https://www.microsoft.com/en-us/download/confirmation.aspx?id=56519)     |




We highly recommend using the UDP protocol for real-time traffic. If you use TCP (Transmission Control Protocol) for Real-Time Protocol, the packets lost due to network conditions will be retransmitted. The retransmission might cause issues with audio and video streams. User Datagram Protocol (UDP) does not retransmit lost packets. Audio/video codecs compensate for the lost packets. Let take an example where Alice's application sends three packets (TCP1, TCP2, and TCP3) to Bob's application. If the TCP2 packet is lost, the protocol will try to retransmit the TCP2 packet. Alice already started transmitting the next set of packets. Retransmission will slow down the conversation and can cause audio/video distortions.
If the Alice app uses UDP, sends three packets (UDP1, UDP2, UDP3) and UDP2 lost, the UDP protocol will not retransmit. The audio/video codec will compensate for the absence of UDP2 in Bob's application. Alice application can continue sending the next set of packets without slowing down the conversation.
Also, one more component will be brought to the call flow, the TURN service. The Turn Service will translate the TCP to UDP. Learn more about [call flows in Azure Communication Services](https://docs.microsoft.com/en-us/azure/communication-services/concepts/call-flows)

