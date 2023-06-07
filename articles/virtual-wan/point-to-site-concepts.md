---
title: 'User VPN (point-to-site) Concepts'
titleSuffix: Azure Virtual WAN
description: Learn about Virtual WAN  User VPN P2S VPN concepts.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 12/05/2022
ms.author: cherylmc

---
# User VPN (point-to-site) concepts

The following article describes the concepts and customer-configurable options associated with Virtual WAN User VPN point-to-site (P2S) configurations and gateways. This article is split into multiple sections, including sections about P2S VPN server configuration concepts, and sections about P2S VPN gateway concepts.

## VPN server configuration concepts

VPN server configurations define the authentication, encryption and user group parameters used to authenticate users, and assign IP addresses and encrypt traffic. P2S gateways are associated with P2S VPN server configurations.

### Common concepts

| Concept | Description | Notes|
|--| --|--|
| Tunnel Type | Protocol(s) used between the P2S VPN gateway and connecting users.| Available parameters: IKEv2, OpenVPN or both. For IKEv2 server configurations, only RADIUS and certificate-based authentication is available. For Open VPN server configurations, RADIUS, certificate-based and Azure Active Directory based authentication are available. Additionally, multiple authentication methods on the same server configuration (for example, certificate and RADIUS on the same configuration) are only supported for OpenVPN. IKEv2 also has a protocol-level limit of 255 routes, while OpenVPN has a limit of 1000 routes. |
| Custom IPsec Parameters| Encryption parameters used by the P2S VPN gateway for gateways that use IKEv2.| For available parameters, see [Custom IPsec parameters for point-to-site VPN](point-to-site-ipsec.md). This parameter doesn't apply for gateways using OpenVPN authentication.|

### Azure Certificate Authentication concepts

The following concepts are related to server configurations that use certificate-based authentication.

| Concept | Description | Notes|
|--| --|--|
| Root certificate name | Name used by Azure to identify customer root certificates. | Can be configured to be any name. You may have multiple root certificates. |
| Public certificate data | Root certificate(s) from which client certificates are issued.| Input the string corresponding to the root certificate public data. For an example for how to get root certificate public data, see the step 8 in the following document about [generating certificates](certificates-point-to-site.md). |
| Revoked certificate | Name used by Azure to identify certificates to be revoked. | Can be configured to be any name.|
| Revoked certificate thumbprint| Thumbprint of the end user certificate(s) that shouldn't be able to connect to the gateway. | The input for this parameter is one or more certificate thumbprints. Every user certificate must be revoked individually. Revoking an intermediate certificate or a root certificate won't automatically revoke all children certificates. |

### RADIUS Authentication concepts

If a P2S VPN gateway is configured to use RADIUS-based authentication, the P2S VPN gateway acts as a Network Policy Server (NPS) Proxy to forward authentication requests to customer RADIUS sever(s). Gateways can use one or two RADIUS severs to process authentication requests. Authentication requests are automatically load-balanced across the RADIUS servers if multiple are provided.

| Concept | Description | Notes|
|--| --|--|
 Primary server secret|Server secret configured on customer's primary RADIUS server that is used for encryption by RADIUS protocol.| Any shared secret string.|
| Primary server IP address|Private IP address of RADIUS server| This IP must be a private IP reachable by the Virtual Hub. Make sure the connection hosting the RADIUS server is propagating to the defaultRouteTable of the hub with the gateway.|
| Secondary server secret| Server secret configured on the second RADIUS server that is used for encryption by RADIUS protocol.| Any provided shared secret string.|
| Secondary server IP address|The private IP address of the RADIUS server| This IP must be a private IP reachable by the virtual hub. Make sure the connection hosting the RADIUS server is propagating to the defaultRouteTable of the hub with the gateway.|
|RADIUS server root certificate | RADIUS server root certificate public data.| This field is optional. Input the string(s) corresponding to the RADIUS root certificate public data. You may input multiple root certificates. All client certificates presented for authentication must be issued from the specified root certificates. For an example for how to get certificate public data, see the step 8 in the following document about [generating certificates](certificates-point-to-site.md).|
|Revoked client certificates |Thumbprint(s) of revoked RADIUS client certificates. Clients presenting revoked certificates won't be able to connect. |This field is optional. Every user certificate must be revoked individually. Revoking an intermediate certificate or a root certificate won't automatically revoke all children certificates.|

### Azure Active Directory Authentication concepts

The following concepts are related to server configurations that use Azure Active Directory-based authentication. Azure Active Directory-based authentication is only available if the tunnel type is OpenVPN.

| Concept | Description | Available Parameters|
|--| --|--|
 Audience| Application ID of the Azure VPN Enterprise Application registered in your Azure AD tenant. | For more information on how to register the Azure VPN application in your tenant and finding the application ID, see [configuring a tenant for P2S user VPN OpenVPN protocol connections](openvpn-azure-ad-tenant.md)|
| Issuer|Full URL corresponding to Security Token Service (STS) associated to your Active Directory.| String in the following format: ```https://sts.windows.net/<your Directory ID>/```
| Azure Active Directory Tenant| Full URL corresponding to the Active Directory Tenant used for authentication on the gateway.| Varies based on which cloud the Active Directory Tenant is deployed in. See below for per-cloud details.|

#### Azure AD Tenant ID

The following table describes the format of the Azure Active Directory URL based on which cloud Azure Active Directory is deployed in.

| Cloud | Parameter Format|
|--|--|
| Azure Public Cloud | `https://login.microsoftonline.com/{AzureAD TenantID}` |
| Azure Government Cloud | `https://login.microsoftonline.us/{AzureAD TenantID}` |
| China 21Vianet Cloud | `https://login.chinacloudapi.cn/{AzureAD TenantID}` |

### User group (multi-pool) concepts

The following concepts related to user groups (multi-pools) in Virtual WAN. User groups allow you to assign different IP addresses to connecting users based on their credentials, allowing you to configure Access Control Lists (ACLs) and Firewall rules to secure workloads. For more information and examples, see [multi-pool concepts](user-groups-about.md).

The server configuration contains the definitions of groups and the groups are then used on gateways to map server configuration groups to IP addresses.

| Concept | Description | Notes|
|--| --|--|
|User group / policy group|A user Group or policy group is a logical representation of a group of users that should be assigned IP addresses from the same address pool.| For more information, see [about user groups.](user-groups-about.md)|
|Default group|When users try to connect to a gateway using the user group feature, users who don't match any group assigned to the gateway are automatically considered to be part of the default group and assigned an IP address associated to that group. |Each group in a server configuration can be specified as a default group or non-default group and this setting **cannot** be changed after the group has been created. Exactly one default group can be assigned to each P2S VPN gateway, even if the assigned server configuration has multiple default groups.|
|Group priority|When multiple groups are assigned to a gateway a connecting user may present credentials that match multiple groups. Virtual WAN processes groups assigned to a gateway in increasing order of priority.|Priorities are positive integers and groups with lower numerical priorities are processed first. Every group must have a distinct priority.|
|Group settings/members| User groups consist of members. Members don't correspond to individual users but rather define the criteria/match condition(s) used to determine which group a connecting user is a part of. Once a group is assigned to a gateway, a connecting user whose credentials match the criteria specified for one of the group's members, is considered to be part of that group and can be assigned an appropriate IP address. |For a full list of available criteria, see [available group settings](user-groups-about.md).|

## Gateway configuration concepts

The following sections describe concepts associated with the P2S VPN gateway. Every gateway is associated with one VPN server configuration and has many other configurable options.

### General gateway concepts

| Concept | Description |Notes |
|--| --|--|
 Gateway Scale Unit| A gateway scale unit defines how much aggregate throughput and concurrent users a P2S VPN gateway can support. |Gateway scale units can range from 1-200, supporting 500 to 100,000 users per gateway.|
|P2S server configuration|Defines the authentication parameters the P2S VPN gateway uses to authenticate incoming users.|Any P2S server configuration associated to the Virtual WAN gateway. Server configuration must be created successfully for a gateway to reference it.|
|Routing preference| Allows you to choose how traffic routes between Azure and the Internet.|You can choose to route traffic either via the Microsoft network or via the ISP network (public network). For more information on this setting, see [What is routing preference?](../virtual-network/ip-services/routing-preference-overview.md) This setting can't be modified after gateway creation.|
|Custom DNS Servers|IP addresses of the DNS server(s) connecting users should forward DNS requests to.|Any routable IP address.|
| Propagate default route|If the Virtual WAN hub is configured with a 0.0.0.0/0 default route (static route in default route table or 0.0.0.0/0 advertised from on-premises, this setting controls whether or not the 0.0.0.0/0 route is advertised to connecting users.| This field can be set to true or false.|

### RADIUS-specific concepts

|Concept| Description| Notes|
|--| --|--|
| Use Remote/On-premises RADIUS server setting | Controls whether or not Virtual WAN can forward RADIUS authentication packets to RADIUS servers hosted on-premises or in a Virtual Network connected to a different Virtual Hub. | This setting has two values, true or false. When Virtual WAN is configured to use RADIUS-based authentication, Virtual WAN P2S gateway serves as a RADIUS proxy that sends authentication requests to your RADIUS severs. This setting (if true) allows Virtual WAN gateway to communicate with RADIUS servers deployed on-premises or in a Virtual Network connected to a different hub. If false, the Virtual WAN will only be able to authenticate with RADIUS servers hosted in Virtual Networks connected to the hub with the gateway.|
| RADIUS Proxy IPs | RADIUS authentication packets sent by the P2S VPN gateway to your RADIUS server have source IPs specified by the RADIUS Proxy IP's field. These IPs need to be allow-listed as RADIUS clients on your RADIUS server. | This parameter isn't directly configurable. If 'Use Remote/On-premises RADIUS server' is set to true, the RADIUS Proxy IPs are automatically configured as IP addresses from client address pools specified on the gateway. If this setting is false, the IPs are IP addresses from within the hub address space. RADIUS proxy IPs can be found on Azure portal on the P2S VPN gateway page. |

### Connection configuration concepts

There can be one or more connection configurations on a P2S VPN gateway. Each connection configuration has a routing configuration (see below for caveats) and represents a group or segment of users that are assigned IP addresses from the same address pools.

|Concept| Description| Notes|
|--|--|--|
| Configuration Name | Name for a P2S VPN configuration | Any name can be provided. You can have more than one connection configuration on a gateway if you're leveraging the user groups/multi-pool feature. If you aren't using this feature, there can only be one configuration per gateway.|
| User Groups | User groups that correspond to a configuration | Any user group(s) referenced in the VPN Server configuration. This parameter is optional. For more information, see [about user groups](user-groups-about.md).|
| Address Pools|Address pools are private IP addresses that connecting users are assigned.|Address pools can be specified as any CIDR block that doesn't overlap with any Virtual Hub address spaces, IP addresses used in Virtual Networks connected to Virtual WAN or addresses advertised from on-premises. Depending on the scale unit specified on the gateway, you may need more than one CIDR block. For more information, see [about address pools](about-client-address-pools.md).|
|Routing configuration|Every connection to Virtual Hub has a routing configuration, which defines which route table the connection is associated to and which route tables the route table propagates to. |All branch connections to the same hub (ExpressRoute, VPN, NVA) must associate to the defaultRouteTable and propagate to the same set of route tables. Having different propagations for branches connections may result in unexpected routing behaviors, as Virtual WAN will choose the routing configuration for one branch and apply it to all branches and therefore routes learned from on-premises.|

## Next steps

Add links here to a couple of articles for next steps.
