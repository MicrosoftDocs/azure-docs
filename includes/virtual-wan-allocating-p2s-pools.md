---
 title: include file
 description: include file
 services: virtual-wan
 author: wellee
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 01/12/2021
 ms.author: wellee
 ms.custom: include file
---

This section describes guidelines and requirements for allocating client address spaces where the chosen Virtual WAN Hub’s Point-to-site VPN Gateway scale unit is greater than or equal to 40.

### Background

Each instance of a Point-to-site VPN gateway can support up to 10,000 concurrent point-to-site user connections. As a result, for scale units greater than 40, Virtual WAN needs to deploy extra capacity, which requires a certain number of address pools allocated for different scale units.

For instance, if a scale unit of 100 is chosen, the deployment can support 50,000 concurrent connections and 5 distinct address pools must be specified.

**Available Scale Units**

| Scale Unit | Maximum Supported Clients | Required Address Pools |
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

### Specifying Address Pools

Below are some guidelines for choosing address pools.

1. One address pool allows for a maximum of 10,000 concurrent connections. As such, each address pool should contain at least 10,000 unique RFC1918 IP addresses.
1. Address pool ranges cannot be shared. For example, a pool with 5,000 addresses cannot use addresses from another pool that has 8,000 addresses.
1. Address pools must be distinct. There can be no overlap between address pools.

### Example 

The following example describes a situation where 60 scale units support up to 30,000 connections but the allocated address pools results in fewer than 30,000 concurrent connections.

The total number of concurrent connections supported in this setup is 20,032. The first address pool  supports 10,000 addresses, the second pool 32 connections, and the third pool also supports 10,000 addresses.

| Address Pool Number | Address Pool | Supported Connections |
|--- |--- |--- |
| 1 | 10.12.0.0/15 | 10000 |
| 2 | 10.13.0.0/27 | 32 |
| 3 | 10.14.0.0/15 | 10000|

**Recommendation: Ensure Address Pool #2 has at least 10,000 distinct IP addresses.**