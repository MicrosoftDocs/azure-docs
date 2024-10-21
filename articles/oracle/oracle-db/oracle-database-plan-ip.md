---
title: Plan IP address space for Oracle Database@Azure
description: Learn how to plan your IP address space for Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: concept-article
ms.date: 08/29/2024
ms.author: jacobjaygbay
---

# Plan IP address space for Oracle Database@Azure

When you set up Oracle Database@Azure, it's important to plan your IP address space to ensure that you have enough IP addresses for your virtual machine clusters and networking services.

This article provides tables you can use to find the minimum subnet Classless Inter-Domain Routing (CIDR) size for your instance of Oracle Exadata Database@Azure.

When you set up your network, consider the following points:

- For Oracle Exadata Database@Azure, the minimum CIDR size is `/27`.
- IP address ranges that are allocated to Oracle Exadata Database@Azure subnets and to Oracle Exadata Database@Azure virtual machine clusters must not overlap with other CIDRs that are in use. Overlap might cause routing issues. Account for cross-region routing when you configure CIDRs for Oracle Database@Azure.
- For Exadata X9M: IP addresses `100.106.0.0/16` and `100.107.0.0/16` are reserved for the interconnect and can't be allocated to client or backup networks.

Other requirements that are specific to client subnets and backup subnets are described in the next sections.

## Client subnet requirements

The client subnet has the following IP address requirements:

- Four IP addresses are required for each virtual machine. Virtual machine clusters must have a minimum of two virtual machines. Therefore, a virtual machine cluster with two virtual machines requires eight IP addresses in the client subnet. Each virtual machine that's added to a virtual machine cluster increases the number of IP addresses required in the client subnet by four IP addresses.
- Each virtual machine cluster requires three IP addresses for [Single Client Access Names (SCANs)](https://docs.oracle.com/en/cloud/paas/exadata-cloud/csexa/connect-db-using-net-services.html), regardless of how many virtual machines are present in the virtual machine cluster.
- 17 IP addresses are reserved for networking services in the client subnet, regardless of how many virtual machine clusters are present in the client subnet. The 17 addresses are the first 16 IP addresses and the last IP address.

**Example**: IP addresses required for a client subnet that has one virtual machine cluster that has two virtual machines.

`11 IPs *(virtual machine cluster with two virtual machines, plus three SCANs)* + 17 IPs *(for networking services)* = 28 IPs.`

### Virtual machine cluster scenarios: CIDR size required for the client subnet

The following table shows scenarios of provisioned virtual machine clusters of varying sizes. The number of each scenario that can fit in a client subnet depends on the CIDR size used by the subnet. This table doesn't show all possible scenarios.

|Scenario|/27|/26|/25|/24|/23|/22|
|--------|---|---|---|---|---|---|
|One virtual machine cluster with two virtual machines *(11 IPs + 17 for networking services = 28)*|1|4|10|21|45|91|
|One virtual machine cluster with three virtual machines *(15 IPs + 17 for networking services = 32*)|1|3|7|15|33|67|
|One virtual machine cluster with four virtual machines *(19 IPs + 17 for networking services = 36)*| |2|5|12|26|53|
|Two virtual machine clusters with two virtual machines each *(22 IPs + 17 for networking services = 39)*| |2|5|10|22|45|
|Two virtual machine clusters with three virtual machines each *(30 IPs + 17 for networking services = 47)*| |1|3|7|16|33|
|Two virtual machine clusters with four virtual machines each *(38 IPs + 17 for networking services = 55)*| |1|2|6|13|26|

### Virtual machine cluster scenarios: CIDR size required for the client subnet

The following table shows scenarios of provisioned virtual machine clusters of varying sizes. The number of each scenario that can fit in a client subnet depends on the CIDR size used by the subnet. The table doesn't show all possible scenarios.

|Scenario|/27|/26|/25|/24|/23|/22|
|--------|---|---|---|---|---|---|
|One virtual machine cluster that has two virtual machines *(11 IPs + 17 for networking services = 28)*|1|2|4|9|18|36|
|One virtual machine cluster that has three virtual machines *(15 IPs + 17 for networking services = 32)*|1|2|4|8|16|32|
|One virtual machine cluster that has four virtual machines *(19 IPs + 17 for networking services = 36)*| |1|3|7|14|28|
|Two virtual machine clusters with two virtual machines each *(22 IPs + 17 for networking services = 39)*| |1|3|6|13|26|
|Two virtual machine clusters with three virtual machines each *(30 IPs + 17 for networking services = 47)*| |1|2|5|10|21|
|Two virtual machine clusters with four virtual machines each *(38 IPs + 17 for networking services = 55)*| |1|2|4|9|18|

## Backup subnet requirements

A backup subnet has the following IP address requirements:

- Three IP addresses for each virtual machine. Virtual machine clusters have a minimum of two virtual machines. Therefore, a virtual machine cluster that has two virtual machines requires six IP addresses in the backup subnet. Each other virtual machine added to a virtual machine cluster increases the number of IP addresses needed in the backup subnet by three IPs.
- Networking services require three IP addresses for the backup subnet, regardless of how many virtual machine clusters are present in the backup subnet.

**Example**: IP addresses required for a backup subnet that has one virtual machine cluster that has two virtual machines.

`6 IPs *(virtual machine cluster that has 2 virtual machines)* + 3 IPs *(networking)* = 9 IPs.`

### Virtual machine cluster scenarios: CIDR size needed for the backup subnet

The following table shows scenarios of provisioned virtual machine clusters of different sizes. The number of each scenario that can fit in a backup subnet depends on the CIDR size that the subnet uses. The table doesn't display all possible scenarios.

|Scenario|/28|/27|/26|/25|/24|/23|
|--------|---|---|---|---|---|---|
|One virtual machine cluster that has two virtual machines *(6 IPs + 3 for networking services = 9)*|1|3|7|14|28|56|
|One virtual machine cluster that has three virtual machines *(9 IPs + 3 for networking services = 12)*|1|2|5|10|21|42|
|One virtual machine cluster that has four virtual machines *(12 IPs + 3 for networking services = 15)*|1|2|4|8|17|34|
|Two virtual machine clusters with two virtual machines each *(12 IPs + 3 for networking services = 15)*|1|2|4|8|17|34|
|Two virtual machine clusters with three virtual machines each *(18 IPs + 3 for networking services = 21)*| |1|3|6|12|24|
|Two virtual machine clusters with four virtual machines each *(24 IPs + 3 for networking services = 27)*| |1|2|4|9|18|

## Usable IP addresses for client and backup subnets by CIDR size

The following table shows the number of IP addresses that are available for virtual machine clusters and SCANs for various CIDR sizes, after you subtract the IP addresses that the networking services require.

> [!TIP]
> Allocating more than the required space for the subnet (for example, at least `/25` instead of `/27`) can help reduce the relative effect that required reserved IP addresses have on the subnet's available space.

|Subnet CIDR|Reserved networking IPs for client subnets|Usable IPs for client subnets (virtual machines and SCANs)|Reserved networking IPs for backup subnets|Usable IPs for backup subnets (virtual machines and SCANs)|
|-----------|-----------------------------------------|-----------------------------------------------------------|-----------------------------------------|-----------------------------------------------------------|
|/28|17|0 (2^4 - 17)|3|13 (2^4 - 3)|
|/27|17|15 (2^5 - 17)|3|29 (2^5 - 3)|
|/26|17|47 (2^6 - 17)|3|61 (2^6 - 3)|
|/25|17|111 (2^7 - 17)|3|125 (2^7 - 3)|
|/24|17|239 (2^8 - 17)|3|253 (2^8 - 3)|
|/23|17|495 (2^9 - 17)|3|509 (2^9 - 3)|
|/22|17|1007 (2^10 - 17)|3|1021 (2^10 - 3)|

## Related content

- [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
- [Oracle Database@Azure support information](oracle-database-support.md)
- [Network planning for Oracle Database@Azure](oracle-database-network-plan.md)
- [Groups and roles for Oracle Database@Azure](oracle-database-groups-roles.md)
