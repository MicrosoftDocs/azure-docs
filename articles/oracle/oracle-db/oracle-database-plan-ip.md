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

When you set up Oracle Database@Azure, it's important to plan your IP address space to ensure that you have enough IPs for your virtual machine clusters and networking services.

This article provides tables you can use to find the minimum subnet Classless Inter-Domain Routing (CIDR) size for your instance of Oracle Exadata Database@Azure.

When you set up your network, consider the following points:

- For Oracle Exadata Database@Azure, the minimum CIDR size is /27.
- IP ranges that are allocated to Oracle Exadata Database@Azure subnets and to Oracle Exadata Database@Azure virtual machine clusters can't overlap with other CIDRs that are in use. Overlap might cause routing issues. Account for cross-region routing when you configure CIDRs for Oracle Database@Azure.
- For Oracle Exadata Database Machine X9M, IP addresses 100.106.0.0/16 and 100.107.0.0/16 are reserved for the interconnect and can't be allocated to client networks or backup networks.

Other requirements that are specific to client subnets and backup subnets are described in the next sections.

## Client subnet requirements

The client subnet has the following IP address requirements:

- Each virtual machine requires 4 IP addresses. Virtual machine clusters must have a minimum of two virtual machines. Therefore, a virtual machine cluster with two virtual machines requires 8 IP addresses in the client subnet. Each virtual machine that's added to a virtual machine cluster increases the number of IP addresses required in the client subnet by 4 IP addresses.
- Each virtual machine cluster requires 3 IP addresses for [Single Client Access Names (SCANs)](https://docs.oracle.com/en/cloud/paas/exadata-cloud/csexa/connect-db-using-net-services.html), regardless of how many virtual machines are in the virtual machine cluster.
- In the client subnet, 17 IP addresses are reserved for networking services, regardless of how many virtual machine clusters are in the client subnet. The 17 IP addresses are the first 16 IP addresses and the last IP address.

**Example**: The number of IP addresses required for a client subnet that has one virtual machine cluster with two virtual machines is *11 IPs (one virtual machine cluster with two virtual machines, plus three SCANs) + 17 IPs (for networking services) = 28 IPs*.

### Scenarios: CIDR size required for a client subnet

The following table shows scenarios of provisioned virtual machine clusters of varying sizes. How many instances of each scenario that can fit in a client subnet depends on the CIDR size of the subnet. This table doesn't show all possible scenarios.

|Scenario|/27|/26|/25|/24|/23|/22|
|--------|---|---|---|---|---|---|
|One virtual machine cluster with two virtual machines *(11 IPs + 17 IPs for networking services = 28 IPs)*|1|4|10|21|45|91|
|One virtual machine cluster with three virtual machines *(15 IPs + 17 IPs for networking services = 32* IPs)|1|3|7|15|33|67|
|One virtual machine cluster with four virtual machines *(19 IPs + 17 IPs for networking services = 36 IPs)*| |2|5|12|26|53|
|Two virtual machine clusters with two virtual machines each *(22 IPs + 17 IPs for networking services = 39 IPs)*| |2|5|10|22|45|
|Two virtual machine clusters with three virtual machines each *(30 IPs + 17 IPs for networking services = 47 IPs)*| |1|3|7|16|33|
|Two virtual machine clusters with four virtual machines each *(38 IPs + 17 IPs for networking services = 55 IPs)*| |1|2|6|13|26|

|Scenario|/27|/26|/25|/24|/23|/22|
|--------|---|---|---|---|---|---|
|One virtual machine cluster with two virtual machines *(11 IPs + 17 IPs for networking services = 28 IPs)*|1|2|4|9|18|36|
|One virtual machine cluster with three virtual machines *(15 IPs + 17 IPs for networking services = 32 IPs)*|1|2|4|8|16|32|
|One virtual machine cluster with four virtual machines *(19 IPs + 17 IPs for networking services = 36 IPs)*| |1|3|7|14|28|
|Two virtual machine clusters with two virtual machines each *(22 IPs + 17 IPs for networking services = 39 IPs)*| |1|3|6|13|26|
|Two virtual machine clusters with three virtual machines each *(30 IPs + 17 IPs for networking services = 47 IPs)*| |1|2|5|10|21|
|Two virtual machine clusters with four virtual machines each *(38 IPs + 17 IPs for networking services = 55 IPs)*| |1|2|4|9|18|

## Backup subnet requirements

A backup subnet has the following IP address requirements:

- Each virtual machine requires 3 IP addresses. Virtual machine clusters have a minimum of two virtual machines. Therefore, a virtual machine cluster that has two virtual machines requires 6 IP addresses in the backup subnet. Each virtual machine that's added to a virtual machine cluster increases the number of IP addresses required in the backup subnet by 3 IPs.
- Networking services require 3 IP addresses for the backup subnet, regardless of how many virtual machine clusters are in the backup subnet.

**Example**: The number of IP addresses required for a backup subnet that has one virtual machine cluster with two virtual machines is *6 IPs (one virtual machine cluster with two virtual machines) + 3 IPs (for networking services) = 9 IPs*.

### Scenarios: CIDR size required for a backup subnet

The following table shows scenarios of provisioned virtual machine clusters of different sizes. How many instances of each scenario that can fit in a backup subnet depends on the CIDR size of the subnet. The table doesn't display all possible scenarios.

|Scenario|/28|/27|/26|/25|/24|/23|
|--------|---|---|---|---|---|---|
|One virtual machine cluster that has two virtual machines *(6 IPs + 3 for networking services = 9 IPs)*|1|3|7|14|28|56|
|One virtual machine cluster that has three virtual machines *(9 IPs + 3 for networking services = 12 IPs)*|1|2|5|10|21|42|
|One virtual machine cluster that has four virtual machines *(12 IPs + 3 for networking services = 15 IPs)*|1|2|4|8|17|34|
|Two virtual machine clusters with two virtual machines each *(12 IPs + 3 for networking services = 15 IPs)*|1|2|4|8|17|34|
|Two virtual machine clusters with three virtual machines each *(18 IPs + 3 for networking services = 21 IPs)*| |1|3|6|12|24|
|Two virtual machine clusters with four virtual machines each *(24 IPs + 3 for networking services = 27 IPs)*| |1|2|4|9|18|

## Usable IP addresses for client and backup subnets by CIDR size

The following table shows the number of IP addresses that are available for virtual machine clusters and SCANs for various CIDR sizes after you subtract the IP addresses that the networking services require.

> [!TIP]
> Allocating more than the required space for a subnet (for example, at least /25 instead of /27) can help reduce the relative effect that reserved IP addresses have on the subnet's available space.

|Subnet CIDR|Reserved networking IPs for a client subnet|Usable IPs for a client subnet (virtual machines and SCANs)|Reserved networking IPs for a backup subnet|Usable IPs for a backup subnet (virtual machines and SCANs)|
|-----------|-----------------------------------------|-----------------------------------------------------------|-----------------------------------------|-----------------------------------------------------------|
|/28|17|0 (2^4 - 17)|3|13 (2^4 - 3)|
|/27|17|15 (2^5 - 17)|3|29 (2^5 - 3)|
|/26|17|47 (2^6 - 17)|3|61 (2^6 - 3)|
|/25|17|111 (2^7 - 17)|3|125 (2^7 - 3)|
|/24|17|239 (2^8 - 17)|3|253 (2^8 - 3)|
|/23|17|495 (2^9 - 17)|3|509 (2^9 - 3)|
|/22|17|1,007 (2^10 - 17)|3|1,021 (2^10 - 3)|

## Related content

- [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
- [Oracle Database@Azure support information](oracle-database-support.md)
- [Network planning for Oracle Database@Azure](oracle-database-network-plan.md)
- [Groups and roles for Oracle Database@Azure](oracle-database-groups-roles.md)
