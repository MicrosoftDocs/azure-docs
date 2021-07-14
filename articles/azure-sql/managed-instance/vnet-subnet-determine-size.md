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
# Determine required subnet size and range for Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Azure SQL Managed Instance must be deployed within an Azure [virtual network](../../virtual-network/virtual-networks-overview.md). The number of managed instances that can be deployed in the subnet of a virtual network depends on the size of the subnet (subnet range).

When you create a managed instance, Azure allocates a number of virtual machines that depends on the tier you selected during provisioning. Because these virtual machines are associated with your subnet, they require IP addresses. To ensure high availability during regular operations and service maintenance, Azure might allocate more virtual machines. The number of required IP addresses in a subnet then becomes larger than the number of managed instances in that subnet.

By design, a managed instance needs a minimum of 32 IP addresses in a subnet. As a result, you can use a minimum subnet mask of /27 when defining your subnet IP ranges. We recommend careful planning of subnet size for your managed instance deployments. Consider the following inputs during planning:

- Number of managed instances, including the following instance parameters:
  - Service tier
  - Hardware generation
  - Number of vCores
  - [Maintenance window](../database/maintenance-window.md)
- Plans to scale up/down or change the service tier

> [!IMPORTANT]
> A subnet size of 16 IP addresses (subnet mask /28) allows the deployment of a single managed instance inside it. It should be used only for evaluation or for dev/test scenarios where scaling operations won't be performed. 

## Determine subnet size

Size your subnet according to your future needs for instance deployment and scaling. The following parameters can help you in forming a calculation:

- Azure uses five IP addresses in the subnet for its own needs.
- Each virtual cluster allocates an additional number of addresses. 
- Each managed instance uses a number of addresses that depends on pricing tier and hardware generation.
- Each scaling request temporarily allocates an additional number of addresses.

> [!IMPORTANT]
> It's not possible to change the subnet address range if any resource exists in the subnet. It's also not possible to move managed instances from one subnet to another. Consider using bigger subnets rather than smaller ones to prevent issues in the future.

GP = general purpose; 
BC = business critical; 
VC = virtual cluster

| **Hardware generation** | **Pricing tier** | **Azure usage** | **VC usage** | **Instance usage** | **Total** |
| --- | --- | --- | --- | --- | --- |
| Gen4 | GP | 5 | 1 | 5 | 11 |
| Gen4 | BC | 5 | 1 | 5 | 11 |
| Gen5 | GP | 5 | 6 | 3 | 14 |
| Gen5 | BC | 5 | 6 | 5 | 16 |

In the preceding table:

- The **Total** column displays the total number of addresses that are used by a single deployed instance to the subnet. 
- When you add more instances to the subnet, the number of addresses used by the instance increases. The total number of addresses then also increases. For example, adding another Gen4 GP managed instance would increase the **Instance usage** value to 10 and would increase the **Total** value of used addresses to 16. 
- Addresses represented in the **Azure usage** column are shared across multiple virtual clusters.  
- Addresses represented in the **VC usage** column are shared across instances placed in that virtual cluster.

Also consider the [maintenance window feature](../database/maintenance-window.md) when you're determining the subnet size, especially when multiple instances will be deployed inside the same subnet. Specifying a maintenance window for a managed instance during its creation or afterward means that it must be placed in a virtual cluster with the corresponding maintenance window. If there is no such virtual cluster in the subnet, a new one must be created first to accommodate the instance.

An update operation typically requires [resizing the virtual cluster](management-operations-overview.md). When a new create or update request comes, the SQL Managed Instance service communicates with the compute platform with a request for new nodes that need to be added. Based on the compute response, the deployment system either expands the existing virtual cluster or creates a new one. Even if in most cases the operation will be completed within same virtual cluster, a new one might be created on the compute side. 


## Update scenarios

During a scaling operation, instances temporarily require additional IP capacity that depends on pricing tier and hardware generation:

| **Hardware generation** | **Pricing tier** | **Scenario** | **Additional addresses**  |
| --- | --- | --- | --- |
| Gen4<sup>1</sup> | GP or BC | Scaling vCores | 5 |
| Gen4<sup>1</sup> | GP or BC | Scaling storage | 5 |
| Gen4 | GP or BC | Switching from GP to BC or BC to GP | 5 |
| Gen4 | GP | Switching to Gen5 | 9 |
| Gen4 | BC | Switching to Gen5 | 11 |
| Gen5 | GP | Scaling vCores | 3 |
| Gen5 | GP | Scaling storage | 0 |
| Gen5 | GP | Switching to BC | 5 |
| Gen5 | BC | Scaling vCores | 5 |
| Gen5 | BC | Scaling storage | 5 |
| Gen5 | BC | Switching to GP | 3 |

<sup>1</sup> Gen4 hardware is being phased out and is no longer available for new deployments. Updating the hardware generation from Gen4 to Gen5 will take advantage of capabilities specific to Gen5.
  
## Calculate the number of IP addresses

We recommend the following formula for calculating the total number of IP addresses. This formula takes into account the potential creation of a new virtual cluster during a later create request or instance update. It also takes into account the maintenance window requirements of virtual clusters.

**Formula: 5 + (a * 12) + (b * 16) + (c * 16)**

- a = number of GP instances
- b = number of BC instances
- c = number of different maintenance window configurations

Explanation:
- 5 = number of IP addresses reserved by Azure
- 12 addresses per GP instance = 6 for virtual cluster, 3 for managed instance, 3 additional for scaling operation
- 16 addresses per BC instance = 6 for virtual cluster, 5 for managed instance, 5 additional for scaling operation
- 16 addresses as a backup = scenario where new virtual cluster is created

Example: 
- You plan to have three general-purpose and two business-critical managed instances deployed in the same subnet. All instances will have same maintenance window configured. That means you need 5 + (3 * 12) + (2 * 16) + (1 * 16) = 89 IP addresses. 

  Because IP ranges are defined in powers of 2, your subnet requires a minimum IP range of 128 (2^7) for this deployment. You need to reserve the subnet with a subnet mask of /25.

> [!NOTE]
> Though it's possible to deploy managed instances to a subnet with a number of IP addresses that's less than the output of the subnet formula, always consider using bigger subnets instead. Using a bigger subnet can help avoid future issues stemming from a lack of IP addresses, such as the inability to create additional instances within the subnet or scale existing instances. 

## Next steps

- For an overview, see [What is Azure SQL Managed Instance?](sql-managed-instance-paas-overview.md).
- Learn more about [connectivity architecture for SQL Managed Instance](connectivity-architecture-overview.md).
- See how to [create a virtual network where you'll deploy SQL Managed Instance](virtual-network-subnet-create-arm-template.md).
- For DNS issues, see [Configure a custom DNS](custom-dns-configure.md).
