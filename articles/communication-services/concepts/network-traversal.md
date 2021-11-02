---
title: Conceptual Documentation for  Azure Communication Services - Network Traversal
titleSuffix: An Azure Communication Services concept document
description: Learn more about Azure Communication Services Network Traversal SDKs and REST APIs.
author: rahulva
manager: shahen
services: azure-communication-services
ms.author: rahulva
ms.date: 09/20/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

#  Network Traversal SDK concepts	

Azure Communication Services Network Traversal SDK can be used to add real-time communication modalities like voice, video and data to your applications. This page summarizes key concepts and capabilities.	

## Network Traversal overview 	

WebRTC(Web Real-Time Technologies) allow web browsers to stream audio, video and data between devices without needing to have a gateway in the middle. Some of the common use cases here are voice, video , broadcasting and screen sharing. To connect two endpoints on the internet, their external ip address is required. This is typically not available for devices sitting behind a corporate firewall. The protocols like STUN (Session Traversal Utilities for NAT) and TURN (Traversal Using Relays around NAT)  are used to help the endpoints communicate.

Azure Communication Service provides high bandwidth, low latency connections between peers for real-time communications scenarios and data transfer scenarios using the Relays. The ACS  Network Traversal Service exposes the existing STUN/TURN infrastructure used by Skype and Teams as a Platform as a Service (PaaS) Azure offering. 


## Next Steps:

* For an introduction to authentication, see [Authenticate to Azure Communication Services](./authentication.md).
* For an introduction to acquire relay candidates, see [Create and manage access tokens](../quickstarts/relay-token.md).
