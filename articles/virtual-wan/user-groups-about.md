---
title: 'About user groups and IP address pools for point-to-site User VPN'
titleSuffix: Azure Virtual WAN
description: Learn about using user groups to assign IP addresses from specific address pools based on identity or authentication credentials.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 07/31/2023
ms.author: cherylmc

---
# About user groups and IP address pools for P2S User VPNs

You can configure P2S User VPNs to assign users IP addresses from specific address pools based on their identity or authentication credentials by creating **User Groups**. This article describes the different configurations and parameters the Virtual WAN P2S VPN gateway uses to determine user groups and assign IP addresses. For configuration steps, see [Configure user groups and IP address pools for P2S User VPNs](user-groups-create.md).

This article covers the following concepts:

* Server configuration concepts
  * User groups
  * Group members
  * Default policy group
  * Group priority
  * Available group settings
* Gateway concepts
* Configuration requirements and limitations
* Use cases

[!INCLUDE [User groups configuration all](../../includes/virtual-wan-user-groups.md)]

For configuration information, see [RADIUS - configure NPS for vendor-specific attributes](user-groups-radius.md).

## Gateway concepts

When a Virtual WAN P2S VPN gateway is assigned a VPN server configuration that uses user/policy groups, you can create multiple P2S VPN connection configurations on the gateway.

Each connection configuration can contain one or more VPN server configuration user groups. Each connection configuration is then mapped to one or more IP address pools. Users who connect to this gateway are assigned an IP address based on their identity, credentials, default group, and priority.

In this example, the VPN server configuration has the following groups configured:

|Default|Priority|Group name|Authentication type|Member value|
|---|---|---|---|---|
|Yes|0|Engineering|Microsoft Entra ID|groupObjectId1|
|No|1|Finance|Microsoft Entra ID|groupObjectId2|
|No|2|PM|Microsoft Entra ID|groupObjectId3|

This VPN server configuration can be assigned to a P2S VPN gateway in Virtual WAN with:

|Configuration|Groups|Address pools|
|---|---|---|
|Config0|Engineering, PM|x.x.x.x/yy|
|Config1|Finance|a.a.a.a/bb|

The following result is:

* Users who are connecting to this P2S VPN gateway will be assigned an address from x.x.x.x/yy if they're part of the Engineering or PM Microsoft Entra groups.
* Users who are part of Finance Microsoft Entra group are assigned IP addresses from a.a.a.a/bb.
* Because Engineering is the default group, users who aren't part of any configured group are assumed to be part of Engineering and assigned an IP address from x.x.x.x/yy.

## Configuration considerations

This section lists configuration requirements and limitations for user groups and IP address pools.

[!INCLUDE [User groups configuration considerations](../../includes/virtual-wan-user-groups-considerations.md)]

* Address pools can't overlap with address pools used in other connection configurations (same or different gateways) in the same virtual WAN.

* Address pools also can't overlap with virtual network address spaces, virtual hub address spaces, or on-premises addresses.

## Use cases

Contoso corporation is composed of multiple functional departments, such as Finance, Human Resources and Engineering. Contoso uses Azure Virtual WAN to allow remote workers (users) to connect to the virtual WAN and access resources hosted on-premises or in a virtual network connected to the virtual WAN hub.

However, Contoso has internal security policies where users from the Finance department can only access certain databases and virtual machines, and users from Human Resources have access to other sensitive applications.

* Contoso can configure different user groups for each of their functional departments. This ensures users from each department are assigned IP addresses from a department-level predefined address pool.

* Contoso's network administrator can then configure Firewall rules, network security groups (NSG) or access control lists (ACLs) to allow or deny certain users access to resources based on their IP addresses.

## Next steps

* To create User Groups, see [Create user groups for P2S User VPN](user-groups-create.md).
