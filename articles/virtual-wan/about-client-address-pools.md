---
title: 'About client address pools for P2S User VPN'
titleSuffix: Azure Virtual WAN
description: Learn about client address pools for User VPN P2S.
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 07/29/2021
ms.author: cherylmc

---
# About client address pools for point-to-site configurations

This article describes Virtual WAN guidelines and requirements for allocating client address spaces when the virtual hub's point-to-site **Gateway scale units** are 40 or greater.

Point-to-site VPN gateways in the Virtual WAN hub are deployed with multiple instances. Each instance of a point-to-site VPN gateway can support up to 10,000 concurrent point-to-site user connections. As a result, for scale units greater than 40, Virtual WAN needs to deploy extra capacity, which requires a minimum  number of address pools allocated for different scale units.

For instance, if a scale unit of 100 is chosen, 5 instances are deployed for the point-to-site VPN gateway in a virtual hub. This deployment can support 50,000 concurrent connections and **at least** 5 distinct address pools.

**Available scale units**

| Scale unit | Maximum supported clients | Minimum number of address pools |
|--- |--- |--- |
| 40 | 20000 | 2 |
| 60 | 30000 | 3 |
| 80 | 40000 | 4 |
| 100 | 50000 | 5 |
| 120 | 60000 | 6 |
| 140 | 70000 | 7 |
| 160 | 80000 | 8 |
| 180 | 90000 | 9 |
| 200 | 100000 | 10 |

## <a name="specify-address-pools"></a>Specifying address pools

Point-to-site VPN address pool assignments are done automatically by Virtual WAN. See the following basic guidelines for specifying address pools.

* One gateway instance allows for a maximum of 10,000 concurrent connections. As such, each address pool should contain at least 10,000 unique RFC1918 IP addresses.
* Multiple address pool ranges are automatically combined and assigned to a **single** gateway instance. This process is done in a round-robin manner for any gateway instances that have less than 10,000 IP addresses. For example, a pool with 5,000 addresses can be combined automatically by Virtual WAN with another pool that has 8,000 addresses and is assigned to a single gateway instance.
* A single address pool is only assigned to a single gateway instance by Virtual WAN.
* Address pools must be distinct. There can be no overlap between address pools.

> [!NOTE] 
> If an address pool is associated to a gateway instance that is undergoing maintenance, the address pool cannot be re-assigned to another instance.

### Example 

The following example describes a situation where 60 scale units support up to 30,000 connections but the allocated address pools results in fewer than 30,000 concurrent connections.

The total number of concurrent connections supported in this setup is 28,192. The first gateway instance  supports 10,000 addresses, the second instance 8,192 connections, and the third instance also supports 10,000 addresses.

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
