---
title: 'About user groups and IP address pools for point-to-site User VPN'
titleSuffix: Azure Virtual WAN
description: Learn about using user groups to assign IP addresses from specific address pools based on identity or authentication credentials.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 10/21/2022
ms.author: cherylmc

---
# About user groups and IP address pools for P2S User VPNs - Preview

You can configure P2S User VPNs to assign users IP addresses from specific address pools based on their identity or authentication credentials by creating **User Groups**. This article describes the different configurations and parameters the Virtual WAN P2S VPN gateway uses to determine user groups and assign IP addresses.

## Use cases

Contoso corporation is composed of multiple functional departments, such as Finance, Human Resources and Engineering. Contoso uses Virtual WAN to allow remote workers (users) to connect to Azure Virtual WAN and access resources hosted on-premises or in a Virtual Network connected to the Virtual WAN hub.

However, Contoso has internal security policies where users from the Finance department can only access certain databases and Virtual Machines and users from Human Resources have access to other sensitive applications.

Contoso can configure different user groups for each of their functional departments. This will ensure users from each department are assigned IP addresses from a department-level pre-defined address pool.

Contoso's network administrator can then configure Firewall rules, network security groups (NSG) or access control lists (ACLs) to allow or deny certain users access to resources based on their IP addresses.

## Server configuration concepts

The following sections explain the common terms and values used for server configuration.

### User Groups (policy groups)

A **User Group** or policy group is a logical representation of a group of users that should be assigned IP addresses from the same address pool.

### Group members (policy members)

User groups consist of members. Members don't correspond to individual users but rather define the criteria used to determine which group a connecting user is a part of. A single group can have multiple members. If a connecting user matches the criteria specified for one of the group's members, the user is considered to be part of that group and can be assigned an appropriate IP address.
The types of member parameters that are available depend on the authentication methods specified in the VPN server configuration. For a full list of available criteria, see the [Available group settings](#available-group-settings) section of this article.

### Default user/policy group

For every P2S VPN server configuration, one group must be selected as default. Users who present credentials that don't match any group settings are considered to be part of the default group. Once a group is created, the default setting of that group can't be changed.

### Group priority

Each group is also assigned a numerical priority. Groups with lower priority are evaluated first. This means that if a user presents credentials that match the settings of multiple groups, they'll be considered part of the group with the lowest priority. For example, if user A presents a credential that corresponds to the IT Group (priority 3) and Finance Group (priority 4), user A will be considered part of the IT Group for purposes of assigning IP addresses.

### Available group settings

The following section describes the different parameters that can be used to define which groups members are a part of. The available parameters vary based on selected authentication methods.
The table below summarizes the available setting types and acceptable values. For more detailed information on each type of Member Value, view the section corresponding to your authentication type.

|Authentication type|Member type |Member values|Example member value|
|---|---|---|---|
Azure Active Directory|AADGroupID|Azure Active Directory Group Object ID	|0cf484f2-238e-440b-8c73-7bf232b248dc|
|RADIUS|AzureRADIUSGroupID|Vendor-specific Attribute Value (hexadecimal) (must begin with 6ad1bd)|6ad1bd23|
|Certificate|AzureCertificateID|Certificate Common Name domain name (CN=user@red.com)|red|

#### Azure Active Directory authentication (OpenVPN only)

Gateways using Azure Active Directory authentication can use **Azure Active Directory Group Object IDs** to determine which user group a user belongs to. If a user is part of multiple Azure Active Directory groups, they're considered to be part of the Virtual WAN user group that has the lowest numerical priority.

:::image type="content" source="./media/user-groups-about/groups.png" alt-text="Screenshot of an Azure Active Directory group." lightbox="./media/user-groups-about/groups.png":::

#### Azure Certificate (OpenVPN and IKEv2)

Gateways that use Certificate-based authentication use the **domain name** of user certificate Common Names (CN) to determine which group a connecting user is in. Common Names must be in one of the following formats:

* domain/username
* username@domain.com

Make sure that the **domain** is the input as a group member.

#### RADIUS server (OpenVPN and IKEv2)

Gateways that use RADIUS-based authentication use a new **Vendor-Specific Attribute (VSA)** to determine VPN user groups.
When RADIUS-based authentication is configured on the P2S gateway, the gateway serves as a Network Policy Server (NPS) proxy. This means that the P2S VPN gateway serves as a client to authenticate users with your RADIUS server using the RADIUS protocol.

After your RADIUS server has successfully verified the user's credentials, the RADIUS server can be configured to send a new Vendor-Specific Attribute (VSA) as part of Access-Accept packets. The P2S VPN gateway processes the VSA in the Access-Accept packets and assigns specific IP addresses to users based on the value of the VSAs.

Therefore, RADIUS servers should be configured to send a VSA with the same value for all users that are part of the same group.

>[!NOTE]
> The value of the VSA must be an octet hexadecimal string on the RADIUS server and the Azure. This octet string must begin with **6ad1bd**. The last two hexadecimal digits may be configured freely. For example, 6ad1bd98 is valid but 6ad12323 and 6a1bd2 would not be valid.
>

The new VSA is **MS-Azure-Policy-ID**.

The MS-Azure-Policy-ID VSA is used by the RADIUS server to send an identifier that is used by P2S VPN server to match an authenticated RADIUS user policy configured on Azure side. This policy is used to select the IP/ Routing configuration (assigned IP address) for the user.

The fields of MS-Azure-Policy-ID MUST be set as follows:

* **Vendor-Type:** An 8-bit unsigned integer that MUST be set to 0x41 (integer: 65).
* **Vendor-Length:** An 8-bit unsigned integer that MUST be set to the length of the octet string in the Attribute-Specific Value plus 2.
* **Attribute-Specific Value:** An octet string containing Policy ID configured on Azure Point to Site VPN server.

For configuration information, see [RADIUS - configure NPS for vendor-specific attributes](user-groups-radius.md).

## Gateway concepts

When a Virtual WAN P2S VPN gateway is assigned a VPN server configuration that uses user/policy groups, you can create multiple P2S VPN connection configurations on the gateway.

Each connection configuration can contain one or more VPN server configuration user groups. Each connection configuration is then mapped to one or more IP address pools. Users who connect to this gateway are assigned an IP address based on their identity, credentials, default group, and priority.

In this example, the VPN server configuration has the following groups configured:

|Default|Priority|Group name|Authentication type|Member value|
|---|---|---|---|---|
|Yes|0|Engineering|Azure Active Directory|groupObjectId1|
|No|1|Finance|Azure Active Directory|groupObjectId2|
|No|2|PM|Azure Active Directory|groupObjectId3|

This VPN server configuration can be assigned to a P2S VPN gateway in Virtual WAN with:

|Configuration|Groups|Address pools|
|---|---|---|
|Config0|Engineering, PM|x.x.x.x/yy|
|Config1|Finance|a.a.a.a/bb|

The following result is:

* Users who are connecting to this P2S VPN gateway will be assigned an address from x.x.x.x/yy if they're part of the Engineering or PM Azure Active Directory groups.
* Users who are part of Finance Azure Active Directory group are assigned IP addresses from a.a.a.a/bb.
* Because Engineering is the default group, users who aren't part of any configured group are assumed to be part of Engineering and assigned an IP address from x.x.x.x/yy.

## Configuration considerations

[!INCLUDE [User groups preview considerations](../../includes/virtual-wan-user-groups-considerations.md)]

## Next steps

* To create User Groups, see [Create User Groups for P2S User VPN](user-groups-create.md).
