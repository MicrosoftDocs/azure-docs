---
title: Conceptual documentation for  Azure Communication Services - Network Traversal
titleSuffix: An Azure Communication Services Concept Document
description: Learn more about Azure Communication Services Network Traversal SDKs and REST APIs.
author: rahulva
manager: shahen
services: azure-communication-services
ms.author: rahulva
ms.date: 09/20/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

#  Network Traversal Concepts	

Real-time Relays solve the problem of NAT (Network Address Translation) traversal for Peer-to-Peer (P2P) connections. Most devices on the internet today have an IP address used for internal LAN traffic (home or corporate network) or an externally visible address (router or NAT gateway). To connect two devices on the internet, the external address is required, but is typically not available to a device behind a NAT gateway. To address the connectivity issue, following protocols are used:

* STUN (Session Traversal Utilities for NAT) offers a protocol to allow devices to exchange external IPs on the internet. If the clients can see each other, there is typically no need for a relay through a TURN service since the connection can be made peer-to-peer. A STUN server's job is to respond to request for a device's external IP.
* TURN (Traversal Using Relays around NAT) is an extension of the STUN protocol that also relays the data between two endpoints through a mutually visible server.

## Azure Communication Services Network Traversal Overview 	

WebRTC(Web Real-Time Technologies) allow web browsers to stream audio, video, and data between devices without needing to have a gateway in the middle. Some of the common use cases here are voice, video, broadcasting, and screen sharing. To connect two endpoints on the internet, their external IP address is required. External IP is typically not available for devices sitting behind a corporate firewall. The protocols like STUN (Session Traversal Utilities for NAT) and TURN (Traversal Using Relays around NAT)  are used to help the endpoints communicate.

Azure Communication Service provides high bandwidth, low latency connections between peers for real-time communications scenarios. The Azure Communication Services  Network Traversal Service hosts TURN servers for use with the NAT scenarios. Azure Real-Time Relay Service exposes the existing STUN/TURN infrastructure as a Platform as a Service(PaaS) Azure offering. The service will provide low-level STUN and TURN services.  Users are then billed proportional to the amount of data relayed. 

## Next Steps:

* For an introduction to authentication, see [Authenticate to Azure Communication Services](./authentication.md).
* For an introduction to acquire relay candidates, see [Create and manage access tokens](../quickstarts/relay-token.md).
