---
title: 'About User Groups and IP Address Pools for Point-to-Site Connections'
titleSuffix: Azure VPN Gateway
description: Learn about using user groups to assign IP addresses from specific address pools based on identity or authentication credentials for VPN Gateway point-to-site connections.
author: cherylmc
ms.author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.date: 08/27/2025
---

# About user groups and IP address pools for P2S connections (preview)

You can configure P2S User VPNs to assign users IP addresses from specific address pools based on their identity or authentication credentials by creating User Groups. This article describes the different configurations and parameters the VPN gateway uses to determine user groups and assign IP addresses. For configuration steps, see [Configure user groups and IP address pools for P2S connection in Azure VPN Gateway](point-to-site-user-groups-create.md).

> [!IMPORTANT]
> User groups and IP address pools for P2S connections is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article covers the following concepts:

* Server configuration concepts
  * User groups
  * Group members
  * Default policy group
  * Group priority
  * Available group settings
* Gateway concepts
* Configuration requirements and limitations
* Use Cases

[!INCLUDE [User groups configuration all](../../includes/virtual-wan-user-groups.md)]

For configuration information, see [RADIUS - configure Network Policy Server for vendor-specific attributes](point-to-site-user-groups-radius.md).

## Gateway concepts

When a VPN gateway is assigned a VPN server configuration that uses user/policy groups, you can create multiple P2S VPN connection configurations on the gateway.

Each connection configuration can contain one or more VPN server configuration user groups. Each connection configuration is then mapped to one or more IP address pools. Users who connect to this gateway are assigned an IP address based on their identity, credentials, default group, and priority.

In this example, the VPN server configuration has the following groups configured:

|Default|Priority|Group name|Authentication type|Member value|
|---|---|---|---|---|
|Yes|0| Engineering|Microsoft Entra ID|ObjectId1|
|No|1|Finance|Microsoft Entra ID|ObjectId2|
|No|2|PM|Microsoft Entra ID|ObjectId3|

This VPN server configuration can be assigned to a P2S VPN gateway with:

|Configuration|Groups|Address pools|
|---|---|---|
|Config0|Engineering, PM|x.x.x.x/yy|
|Config1|Finance|a.a.a.a/bb|

The following result is:

* Users who are connecting to this P2S VPN gateway will be assigned an address from **x.x.x.x/yy** if they're part of the Engineering or PM Microsoft Entra groups.
* Users who are part of the Finance Microsoft Entra group are assigned IP addresses from a.a.a.a/bb.
* Because Engineering is the default group, users who aren't part of any configured group are assumed to be part of Engineering and assigned an IP address from **x.x.x.x/yy**.

## Configuration considerations

This section lists configuration requirements and limitations for user groups and IP address pools.

* Maximum Groups: A single P2S VPN gateway can reference up to 90 groups.

* Maximum Members: The total number of policy/group members across all groups assigned to a gateway is 390.

* Multiple Assignments: If a group is assigned to multiple connection configurations on the same gateway, it and its members are counted multiple times. Example: A policy group with 10 members assigned to three VPN connection configurations counts as three groups with 30 members, not one group with 10 members.

* Concurrent Users: The total number of concurrent users is determined by the gateway’s scale unit and the number of IP addresses allocated to each user group. It isn't determined by the number of policy/group members associated with the gateway.

* Once a group has been created as part of a VPN server configuration, the name and default setting of a group can't be modified.

* Group names should be distinct.

* Groups that have lower numerical priority are processed before groups with higher numerical priority. If a connecting user is a member of multiple groups, the gateway considers them to be a member of the group with lower numerical priority for purposes of assigning IP addresses.

* Groups that are being used by existing point-to-site VPN gateways can't be deleted.

* You can reorder the priorities of your groups by clicking on the up-down arrow buttons corresponding to that group.

* Address pools can't overlap with address pools used in other connection configurations (same or different gateways) in the same virtual WAN.

* Address pools also can't overlap with virtual network address spaces, virtual hub address spaces, or on-premises addresses.

## Use cases

Contoso corporation is composed of multiple functional departments, such as Finance, Human Resources, and Engineering. Contoso uses an Azure point-to-site VPN gateway to allow remote workers (users) to connect to the virtual network and access resources.

However, Contoso has internal security policies where users from the Finance department can only access certain databases and virtual machines, and users from Human Resources have access to other sensitive applications.

* Contoso can configure different user groups for each of their functional departments. This ensures users from each department are assigned IP addresses from a department-level predefined address pool.

* Contoso's network administrator can then configure Firewall rules, network security groups (NSG), or access control lists (ACLs) to allow or deny certain users access to resources based on their IP addresses.

## Next step

> [!div class="nextstepaction"]
> [Create user groups for point-to-site connections](point-to-site-user-groups-create.md)
