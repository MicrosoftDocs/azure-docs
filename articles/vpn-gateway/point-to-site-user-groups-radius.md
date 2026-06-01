---
title: 'Configure Vender-specific Attributes for Point-to-Site - RADIUS'
titleSuffix: Azure VPN Gateway
description: Learn how to configure RADIUS/NPS for P2S user groups to assign IP addresses from specific address pools based on identity or authentication credentials.
author: cherylmc
ms.author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 08/27/2025
---

# RADIUS - Configure NPS for vendor-specific attributes for point-to-site

This article helps you configure Windows Server Network Policy Server (NPS) to authenticate users to respond to Access-Request messages with the Vendor Specific Attribute (VSA) that is used for user group support in VPN Gateway point-to-site. For more information RADIUS and user groups for point-to-site, see [About user groups and IP address pools for point-to-site](point-to-site-user-groups-about.md#radius-server-openvpn-and-ikev2).

The steps in the following sections help you set up a network policy on the NPS server. The NPS server replies with the specified VSA for all users who match this policy, and the value of this VSA can be used on your point-to-site VPN gateway.

You can create multiple network policies on your NPS server to send different Access-Accept messages to the point-to-site VPN gateway based on Active Directory group membership, or any other mechanism you'd like to support.

## Prerequisites

Verify that you have a working RADIUS server (NPS) already registered to Active Directory.

## Configure the NPS server

Use the following steps to help you configure a network policy on your NPS server. Steps might vary, depending on vendor and version. For more information about how to configure network policies, see [Network Policy Server](/windows-server/networking/technologies/nps/nps-np-configure).

[!INCLUDE [NPS steps](../../includes/vpn-gateway-vwan-user-groups-radius.md)]

## Related content

- [User groups and IP address pools for point-to-site](point-to-site-user-groups-about.md)
- [Configure user groups and IP address pools for point-to-site](point-to-site-user-groups-create.md)
