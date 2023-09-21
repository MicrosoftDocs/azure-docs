---
title: 'About client address pools for P2S User VPN'
titleSuffix: Azure Virtual WAN
description: Learn about client address pools for P2S User VPN.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: cherylmc

---
# About client address pools for Virtual WAN point-to-site configurations

This article describes Virtual WAN guidelines and requirements for allocating client address spaces. Point-to-site VPN gateways in a Virtual WAN hub are deployed with one or more highly available gateway instances. Each instance of a point-to-site VPN gateway can support up to 10,000 concurrent connections. As a result, for scale units greater than 40 (support for more than 10,000 concurrent connections), Virtual WAN deploys an extra gateway instance to service every 10,000 additional connecting users.

When a user connects to Virtual WAN, the connection is automatically load-balanced to all backend gateway instances. To ensure each gateway instance can service connections, each gateway instance must have at least one unique address pool. For example, if you choose a scale unit of 100, 5 gateway instances are deployed. This deployment can support 50,000 concurrent connections and you need to specify **at least** 5 distinct address pools.

## Address pools and multi-pool/user groups

> [!NOTE]
> There isn't a minimum scale unit required for the multi-pool/user group feature as long as sufficient address pools are allocated. The VPN profile needs to be re-downloaded in order to enable multipool. 

When a gateway is configured with the [multi-pool/user group feature](user-groups-about.md), multiple connection configurations are installed on the same point-to-site VPN gateway. Users from any group can connect to any gateway instance, meaning each connection configuration needs to have at least one address pool for every backend gateway instance. For example, if a scale unit of 100 is chosen (5 gateway instances) on a gateway with three separate connection configurations, each configuration needs at least 5 address pools (total of 15 pools).

| Connection configuration | Associated user groups | Minimum number of address pools |
| --- | --- | ---|
| Configuration 1| Finance, Human Resources | 5 |
| Configuration 2| Engineering, Product Management| 5|
| Configuration 3| Marketing | 5|

**Available scale units**

The following table summarizes the available scale unit choices for P2S User VPN gateways.

| Scale unit | Gateway instances| Maximum supported clients | Minimum number of address pools per connection configuration|
|--- |--- |--- | --- |
|1-20| 1| 500-10000 | 1|
| 40 | 2| 20000 | 2 |
| 60 | 3|30000 | 3 |
| 80 | 4| 40000 | 4 |
| 100 | 5 | 50000 | 5 |
| 120 | 6| 60000 | 6 |
| 140 | 7 | 70000 | 7 |
| 160 | 8 | 80000 | 8 |
| 180 | 9 | 90000 | 9 |
| 200 | 10 |100000 | 10 |

## <a name="specify-address-pools"></a>Specifying address pools

Virtual WAN automatically creates point-to-site VPN address pool assignments. See the following basic guidelines for specifying address pools.

* One gateway instance allows for a maximum of 10,000 concurrent connections. As such, each address pool should contain at least 10,000 unique IPv4 addresses. If less than 10,000 addresses are assigned to each instance, incoming connections will be rejected after all allocated IP addresses have been assigned.
* Multiple address pool ranges are automatically combined and assigned to a **single** gateway instance. This process is done in a round-robin manner for any gateway instances that have less than 10,000 IP addresses. For example, a pool with 5,000 addresses can be combined automatically by Virtual WAN with another pool that has 8,000 addresses and is assigned to a single gateway instance.
* A single address pool is only assigned to a single gateway instance by Virtual WAN.
* Address pools must be distinct. There can be no overlap between address pools.

> [!NOTE]
> If an address pool is associated to a gateway instance that is undergoing maintenance, the address pool can't be re-assigned to another instance.

### Example

The following example describes a situation where 60 scale units support up to 30,000 connections but the allocated address pools results in fewer than 30,000 concurrent connections.

The total number of concurrent connections supported in this setup is 28,192. The first gateway instance supports 10,000 addresses, the second instance 8,192 connections, and the third instance also supports 10,000 addresses.

| Address pool number | Address pool | Supported connections |
|--- |--- |--- |
| 1 | 10.12.0.0/15 | 10000 |
| 2 | 10.13.0.0/19 | 8192 |
| 3 | 10.14.0.0/15 | 10000|

#### Recommendations

* Ensure address pool #2 has at least 10,000 distinct IP addresses. (example: 10.13.0.0/15)
* Add one more address pool. (example: Address Pool #4 10.15.0.0/21 with 2048 addresses). Address pools 2 and 4 will be automatically combined and allow that gateway instance to support 10,000 concurrent connections.

## Configure or modify this setting

This setting is configured on the **Point to site** page when you create your virtual hub. You can later modify it.

To modify this setting:

[!INCLUDE [Modify client address pool](../../includes/virtual-wan-client-address-pool-include.md)]

## Next steps

For configuration steps, see [Configure P2S User VPN](virtual-wan-point-to-site-portal.md).
