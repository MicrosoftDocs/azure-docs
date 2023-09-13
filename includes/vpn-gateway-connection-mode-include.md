---
author: cherylmc
ms.author: cherylmc
ms.date: 08/10/2023
ms.service: vpn-gateway
ms.topic: include
---

The Connection Mode property only applies to route-based VPN gateways that use IKEv2 connections. Connection modes define the connection initiation direction and apply only to the initial IKE connection establishment. Any party can initiate rekeys and further messages. **InitiatorOnly** means the connection needs to be initiated by Azure. **ResponderOnly** means the connection needs to be initiated by the on-premises device. The **Default** behavior is to accept and dial whichever connects first.