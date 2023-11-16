---
author: cherylmc
ms.author: cherylmc
ms.date: 07/31/2023
ms.service: virtual-wan
ms.topic: include

#This article is used for both Virtual WAN and VPN Gateway. Any updates to the article must work for both of these services. Otherwise, update the VWAN or VPNGW article directly.
---

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

Each group is also assigned a numerical priority. Groups with lower priority are evaluated first. This means that if a user presents credentials that match the settings of multiple groups, they're considered part of the group with the lowest priority. For example, if user A presents a credential that corresponds to the IT Group (priority 3) and Finance Group (priority 4), user A is considered part of the IT Group for purposes of assigning IP addresses.

### Available group settings

The following section describes the different parameters that can be used to define which groups members are a part of. The available parameters vary based on selected authentication methods.
The following table summarizes the available setting types and acceptable values. For more detailed information on each type of Member Value, view the section corresponding to your authentication type.

|Authentication type|Member type |Member values|Example member value|
|---|---|---|---|
Microsoft Entra ID|AADGroupID|Microsoft Entra group Object ID	|0cf484f2-238e-440b-8c73-7bf232b248dc|
|RADIUS|AzureRADIUSGroupID|Vendor-specific Attribute Value (hexadecimal) (must begin with 6ad1bd)|6ad1bd23|
|Certificate|AzureCertificateID|Certificate Common Name domain name (CN=user@red.com)|red|

<a name='azure-active-directory-authentication-openvpn-only'></a>

#### Microsoft Entra authentication (OpenVPN only)

Gateways using Microsoft Entra authentication can use **Microsoft Entra group Object IDs** to determine which user group a user belongs to. If a user is part of multiple Microsoft Entra groups, they're considered to be part of the P2S VPN user group that has the lowest numerical priority.

However, if you plan to have users who are external (users who aren't part of the Microsoft Entra domain configured on the VPN gateway) connect to the point-to-site VPN gateway, make sure that the user type of the external user is "Member" and **not** "Guest". Also, make sure that the "Name" of the user is set to the user's email address. If the user type and name of the connecting user isn't set correctly as described above or you can't set an external member to be a "Member" of your Microsoft Entra domain, that connecting user will be assigned to the default group and assigned an IP from the default IP address pool.

You can also identify whether or not a user is external by looking at the user's "User Principal Name." External users have **#EXT** in their "User Principal Name."

:::image type="content" source="./media/virtual-wan-user-groups-about/groups.png" alt-text="Screenshot of a Microsoft Entra group." lightbox="./media/virtual-wan-user-groups-about/groups.png":::

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

> [!NOTE]
> The value of the VSA must be an octet hexadecimal string on the RADIUS server and the Azure. This octet string must begin with **6ad1bd**. The last two hexadecimal digits may be configured freely. For example, 6ad1bd98 is valid but 6ad12323 and 6a1bd2 would not be valid.
>

The new VSA is **MS-Azure-Policy-ID**.

The MS-Azure-Policy-ID VSA is used by the RADIUS server to send an identifier that is used by P2S VPN server to match an authenticated RADIUS user policy configured on Azure side. This policy is used to select the IP/ Routing configuration (assigned IP address) for the user.

The fields of MS-Azure-Policy-ID MUST be set as follows:

* **Vendor-Type:** An 8-bit unsigned integer that MUST be set to 0x41 (integer: 65).
* **Vendor-Length:** An 8-bit unsigned integer that MUST be set to the length of the octet string in the Attribute-Specific Value plus 2.
* **Attribute-Specific Value:** An octet string containing Policy ID configured on Azure point-to-site VPN server.
