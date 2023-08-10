---
author: cherylmc
ms.author: cherylmc
ms.date: 08/10/2023
ms.service: vpn-gateway
ms.topic: include
---

The Connection Mode property only applies to route-based VPN gateways that use IKEv2 connections. Connection modes define the connection initiation direction and applies only to the initial IKE connection establishment. Rekeys and further messages can be initiated by any party. **InitiatorOnly** means the connection needs to be initiated by Azure. **ResponderOnly** means the connection needs to be initiated by the on-premises device. The **Default** behavior is to accept and dial whichever connects first.