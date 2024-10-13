---
title: Plan IP address space for Oracle Database@Azure
description: Learn about how to plan your IP address space for Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: concept-article
ms.date: 08/29/2024
ms.author: jacobjaygbay
---

# Plan for IP address space for Oracle Database@Azure

When you set up Oracle Database@Azure, you need to plan your IP address space to ensure that you have enough IP addresses for your virtual machine clusters and networking services.

This article provides tables you can use to find the minimum subnet CIDR size for your Oracle Database@Azure Exadata service instance.

Consider the following points when setting up networking:

-   For , the minimum CIDR size is /27.
-   IP address ranges allocated to an  and Exadata VM clusters must not overlap with other CIDRs in use, as this might cause routing issues. Take cross-region routing into consideration when configuring CIDRs for Oracle Database@Azure.
-   For Exadata X9M: IP addresses 100.106.0.0/16 and 100.107.0.0/16 are reserved for the interconnect, and can't be allocated to client or backup networks.

Other requirements specific to the Client Subnet and the Backup Subnet are provided in the sections for each subnet type that follow.

## Client subnet requirements 

The Client Subnet has the following IP address requirements:

-   Four IP addresses are needed for each virtual machine. virtual machine clusters have a minimum of two virtual machines. Therefore, a virtual machine cluster with two virtual machines requires eight IP addresses in the Client Subnet. Each other virtual machine added to a virtual machine cluster increases the number of IP addresses needed in the Client Subnet by 4 IPs.
-   Each virtual machine cluster requires three IP addresses for Single Client Access Names ([SCANs](https://docs.oracle.com/en/cloud/paas/exadata-cloud/csexa/connect-db-using-net-services.html)), regardless of how many virtual machines are present in the virtual machine cluster.
-   17 IP addresses are reserved for networking services in the Client Subnet, regardless of how many virtual machine clusters are present in the Client Subnet. The 17 addresses are the first 16 IP addresses, and the last IP address.

**Example**: IP addresses required for a Client Subnet that has one virtual machine cluster with two virtual machines.

``11 IPs *(virtual machine cluster with 2 virtual machines, plus 3 SCANs)* + 17 IPs *(Networking)* = 28 IPs.``

### Virtual machine cluster scenarios: CIDR size needed for the client subnet 

The following table shows scenarios of provisioned virtual machine clusters of varying sizes. The number of each scenario that can fit in a Client Subnet depends on the CIDR size used by the subnet. This table doesn't show all possible scenarios.

|Scenario|/27|/26|/25|/24|/23|/22|
|--------|---|---|---|---|---|---|
|One virtual machine cluster with two virtual machines *(11 IPs + 17 Networking = 28)*|1|4|10|21|45|91|
|One virtual machine cluster with three virtual machines *(15 IPs + 17 Networking = 32*|1|3|7|15|33|67|
|One virtual machine cluster with four virtual machines *(19 IPs + 17 Networking = 36)*| |2|5|12|26|53|
|Two virtual machine clusters with two virtual machines each *(22 IPs + 17 Networking = 39)*| |2|5|10|22|45|
|Two virtual machine clusters with three virtual machines each *(30 IPs + 17 Networking = 47)*| |1|3|7|16|33|
|Two virtual machine clusters with four virtual machines each *(38 IPs + 17 Networking = 55)*| |1|2|6|13|26|

### Virtual machine cluster scenarios: CIDR size needed for the client subnet 

The following table shows scenarios of provisioned virtual machine clusters of varying sizes. The number of each scenario that can fit in a Client Subnet depends on the CIDR size used by the subnet. This table doesn't show all possible scenarios.

|Scenario|/27|/26|/25|/24|/23|/22|
|--------|---|---|---|---|---|---|
|One virtual machine cluster with two virtual machines *(11 IPs + 17 Networking = 28)*|1|2|4|9|18|36|
|One virtual machine cluster with three virtual machines *(15 IPs + 17 Networking = 32)*|1|2|4|8|16|32|
|One virtual machine cluster with four virtual machines *(19 IPs + 17 Networking = 36)*| |1|3|7|14|28|
|Two virtual machine clusters with two virtual machines each *(22 IPs + 17 Networking = 39)*| |1|3|6|13|26|
|Two virtual machine clusters with three virtual machines each *(30 IPs + 17 Networking = 47)*| |1|2|5|10|21|
|Two virtual machine clusters with four virtual machines each *(38 IPs + 17 Networking = 55)*| |1|2|4|9|18|

## Backup subnet requirements 

The Backup Subnet has the following IP address requirements:

-   Three IP addresses for each virtual machine. virtual machine clusters have a minimum of two virtual machines. Therefore, a virtual machine cluster with two virtual machines requires six IP addresses in the backup subnet. Each other virtual machine added to a virtual machine cluster increases the number of IP addresses needed in the Backup Subnet by 3 IPs.
-   Networking services require three IP addresses for the Backup Subnet, regardless of how many virtual machine clusters are present in the Backup Subnet.

**Example**: IP addresses required for a Backup Subnet that has one virtual machine cluster with two virtual machines. 

``6 IPs *(virtual machine cluster with 2 virtual machines)* + 3 IPs *(Networking)* = 9 IPs.``

### Virtual machine cluster scenarios: CIDR size needed for the Backup Subnet

The following table shows scenarios of provisioned virtual machine clusters of differing sizes. The number of each scenario that can fit in a Backup Subnet depends on the CIDR size used by the subnet. This table doesn't display all possible scenarios.

|Scenario|/28|/27|/26|/25|/24|/23|
|--------|---|---|---|---|---|---|
|One virtual machine cluster with two virtual machines *(6 IPs + 3 Networking = 9)*|1|3|7|14|28|56|
|One virtual machine cluster with three virtual machines *(9 IPs + 3 Networking = 12)*|1|2|5|10|21|42|
|One virtual machine cluster with four virtual machines *(12 IPs + 3 Networking = 15)*|1|2|4|8|17|34|
|Two virtual machine clusters with two virtual machines each *(12 IPs + 3 Networking = 15)*|1|2|4|8|17|34|
|Two virtual machine clusters with three virtual machines each *(18 IPs + 3 Networking = 21)*| |1|3|6|12|24|
|Two virtual machine clusters with four virtual machines each *(24 IPs + 3 Networking = 27)*| |1|2|4|9|18|

## Usable IPs for client and Backup subnets by CIDR size 

The following table shows the number of IPs available for virtual machine clusters and SCANs for various CIDR sizes, after subtracting the IPs required by the Networking services.

>[!Tip] 
> Allocating a larger space for the subnet than the minimum required (for example, at least /25 instead of /27) can reduce the relative impact of those reserved addresses on the subnet's available space.

|Subnet CIDR|Reserved Networking IPs for Client Subnet|Usable IPs for Client Subnet (Virtual Machines and SCANs)|Reserved Networking IPs for Backup Subnet|Usable IPs for Backup Subnet (Virtual Machines and SCANs)|
|-----------|-----------------------------------------|-----------------------------------------------------------|-----------------------------------------|-----------------------------------------------------------|
|/28|17|0 (2^4 - 17)|3|13 (2^4 - 3)|
|/27|17|15 (2^5 - 17)|3|29 (2^5 - 3)|
|/26|17|47 (2^6 - 17)|3|61 (2^6 - 3)|
|/25|17|111 (2^7 - 17)|3|125 (2^7 - 3)|
|/24|17|239 (2^8 - 17)|3|253 (2^8 - 3)|
|/23|17|495 (2^9 - 17)|3|509 (2^9 - 3)|
|/22|17|1007 (2^10 - 17)|3|1021 (2^10 - 3)|

## Next steps
- [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
- [Oracle Database@Azure support information](oracle-database-support.md)
- [Network planning for Oracle Database@Azure](oracle-database-network-plan.md)
- [Groups and roles for Oracle Database@Azure](oracle-database-groups-roles.md)

