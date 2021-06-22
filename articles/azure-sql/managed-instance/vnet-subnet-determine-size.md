---
title: Determine required subnet size & range 
titleSuffix: Azure SQL Managed Instance 
description: This topic describes how to calculate the size of the subnet where Azure SQL Managed Instance will be deployed.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.custom: seo-lt-2019, sqldbrb=1
ms.devlang: 
ms.topic: how-to
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: mathoma, bonova, srbozovi, wiassaf
ms.date: 06/14/2021
---
# Determine required subnet size & range for Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Azure SQL Managed Instance must be deployed within an Azure [virtual network (VNet)](../../virtual-network/virtual-networks-overview.md).

The number of managed instances that can be deployed in the subnet of a VNet depends on the size of the subnet (subnet range).

When you create a managed instance, Azure allocates a number of virtual machines depending on the tier you selected during provisioning. Because these virtual machines are associated with your subnet, they require IP addresses. To ensure high availability during regular operations and service maintenance, Azure may allocate additional virtual machines. As a result, the number of required IP addresses in a subnet is larger than the number of managed instances in that subnet.

By design, a managed instance needs a minimum of 32 IP addresses in a subnet. As a result, you can use minimum subnet mask of /27 when defining your subnet IP ranges. Careful planning of subnet size for your managed instance deployments is recommended. Inputs that should be taken into consideration during planning are:

- Number of managed instances including following instance parameters:
  - service tier
  - hardware generation
  - number of vCores
  - [maintenance window](../database/maintenance-window.md)
- Plans to scale up/down or change service tier

> [!IMPORTANT]
> A subnet size with 16 IP addresses (subnet mask /28) will allow deploying managed instance inside it, but it should be used only for deploying single instance used for evaluation or in dev/test scenarios, in which scaling operations will not be performed.

## Determine subnet size

Size your subnet according to the future instance deployment and scaling needs. Following parameters can help you in forming a calculation:

- Azure uses five IP addresses in the subnet for its own needs
- Each virtual cluster allocates additional number of addresses 
- Each managed instance uses number of addresses that depends on pricing tier and hardware generation
- Each scaling request temporarily allocates additional number of addresses

> [!IMPORTANT]
> It is not possible to change the subnet address range if any resource exists in the subnet. It is also not possible to move managed instances from one subnet to another. Whenever possible, please consider using bigger subnets rather than smaller to prevent issues in the future.

GP = general purpose; 
BC = business critical; 
VC = virtual cluster

| **Hardware gen** | **Pricing tier** | **Azure usage** | **VC usage** | **Instance usage** | **Total*** |
| --- | --- | --- | --- | --- | --- |
| Gen4 | GP | 5 | 1 | 5 | 11 |
| Gen4 | BC | 5 | 1 | 5 | 11 |
| Gen5 | GP | 5 | 6 | 3 | 14 |
| Gen5 | BC | 5 | 6 | 5 | 16 |

  \* Column total displays number of addresses that would be taken when one instance is deployed in subnet. Each additional instance in subnet adds number of addresses represented with instance usage column. Addresses represented with Azure usage column are shared across multiple virtual clusters while addresses represented with VC usage column are shared across instances placed in that virtual cluster.

Additional input for consideration when determining subnet size (especially when multiple instances will be deployed inside the same subnet) is [maintenance window feature](../database/maintenance-window.md). Specifying maintenance window for managed instance during its creation or afterwards means that it must be placed in virtual cluster with corresponding maintenance window. If there is no such virtual cluster in the subnet, a new one must be created first to accommodate the instance.

Update operation typically requires virtual cluster resize (for more details check [management operations article](management-operations-overview.md)). When new create or update request comes, managed instance service communicates with compute platform with a request for new nodes that need to be added. Based on the compute response, deployment system either expands existing virtual cluster or creates a new one. Even if in most cases operation will be completed within same virtual cluster, there is no guarantee from the compute side that new one will not be spawned. This will increase number of IP addresses required for performing create or update operation and also reserve additional IP addresses in the subnet for newly created virtual cluster.

### Address requirements for update scenarios

During scaling operation instances temporarily require additional IP capacity that depends on pricing tier and hardware generation

| **Hardware gen** | **Pricing tier** | **Scenario** | **Additional addresses*** |
| --- | --- | --- | --- |
| Gen4 | GP or BC | Scaling vCores | 5 |
| Gen4 | GP or BC | Scaling storage | 5 |
| Gen4 | GP or BC | Switching from GP to BC or BC to GP | 5 |
| Gen4 | GP | Switching to Gen5* | 9 |
| Gen4 | BC | Switching to Gen5* | 11 |
| Gen5 | GP | Scaling vCores | 3 |
| Gen5 | GP | Scaling storage | 0 |
| Gen5 | GP | Switching to BC | 5 |
| Gen5 | BC | Scaling vCores | 5 |
| Gen5 | BC | Scaling storage | 5 |
| Gen5 | BC | Switching to GP | 3 |

  \* Gen4 hardware is being phased out and is no longer available for new deployments. Update hardware generation from Gen4 to Gen5 to take advantage of the capabilities specific to Gen5 hardware generation.
  
## Recommended subnet calculator

Taking into the account potential creation of new virtual cluster during subsequent create request or instance update, and maintenance window requirement of virtual cluster per window, recommended formula for calculating total number of IP addresses required is:

**Formula: 5 + a * 12 + b * 16 + c * 16**

- a = number of GP instances
- b = number of BC instances
- c = number of different maintenance window configurations

Explanation:
- 5 = number of IP addresses reserved by Azure
- 12 addresses per GP instance = 6 for virtual cluster, 3 for managed instance, 3 additional for scaling operation
- 16 addresses per BC instance = 6 for virtual cluster, 5 for managed instance, 5 additional for scaling operation
- 16 addresses as a backup = scenario where new virtual cluster is created

Example: 
- You plan to have three general purpose and two business critical managed instances deployed in the same subnet. All instances will have same maintenance window configured. That means you need 5 + 3 * 12 + 2 * 16 + 1 * 16 = 85 IP addresses. As IP ranges are defined in power of 2, your subnet requires minimum IP range of 128 (2^7) for this deployment. Therefore, you need to reserve the subnet with subnet mask of /25.

> [!NOTE]
> Even though it is possible to deploy managed instances in the subnet with number of IP addresses less than the subnet calculator output, always consider using bigger subnets rather than smaller to avoid issue with lack of IP addresses in the future, including unability to create new instances in the subnet or scale existing ones.

## Next steps

- For an overview, see [What is Azure SQL Managed Instance?](sql-managed-instance-paas-overview.md).
- Learn more about [connectivity architecture for SQL Managed Instance](connectivity-architecture-overview.md).
- See how to [create a VNet where you will deploy SQL Managed Instance](virtual-network-subnet-create-arm-template.md).
- For DNS issues, see [Configure a custom DNS](custom-dns-configure.md).
