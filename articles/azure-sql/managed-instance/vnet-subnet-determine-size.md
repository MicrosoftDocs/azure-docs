---
title: Determine required subnet size & range 
titleSuffix: Azure SQL Managed Instance 
description: This topic describes how to calculate the size of the subnet where Azure SQL Managed Instance will be deployed.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: seo-lt-2019, sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, bonova, carlrab
ms.date: 02/22/2019
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
- Plans to scale up/down or change service tier

> [!IMPORTANT]
> A subnet size with 16 IP addresses (subnet mask /28) will allow deploying managed instance inside it, but it should be used only for deploying single instance used for evaluation or in dev/test scenarios, in which scaling operations will not be performed.

## Determine subnet size

Size your subnet according to the future instance deployment and scaling needs. Following parameters can help you in forming a calculation:

- Azure uses five IP addresses in the subnet for its own needs
- Each virtual cluster allocates additional number of addresses 
- Each managed instance uses number of addresses that depends on pricing tier and hardware generation

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

Update operation typically requires virtual cluster resize. In some circumstances, update operation will require virtual cluster creation (for more details check [management operations article](sql-managed-instance-paas-overview.md#management-operations)). In case of virtual cluster creation, number of additional addresses required is equal to number of addresses represented by VC usage column summed with addresses required for instances placed in that virtual cluster (instance usage column).

**Example 1**: You plan to have one general purpose managed instance (Gen4 hardware) and one business critical managed instance (Gen5 hardware). That means you need a minimum of 5 + 1 + 1 * 5 + 6 + 1 * 5 = 22 IP addresses to be able to deploy. As IP ranges are defined in power of 2, your subnet requires minimum IP range of 32 (2^5) for this deployment.<br><br>
As mentioned above, in some circumstances, update operation will require virtual cluster creation. This means that, as an example, in case of an update to the Gen5 business critical managed instance that requires a virtual cluster creation, you will need to have additional 6 + 5 = 11 IP addresses available. Since you are already using 22 of the 32 addresses, there is no available addresses for this operation. Therefore, you need to reserve the subnet with subnet mask of /26 (64 addresses).

**Example 2**: You plan to have three general purpose (Gen5 hardware) and two business critical managed instances (Gen5 hardware) placed in same subnet. That means you need 5 + 6 + 3 * 3 + 2 * 5 = 30 IP addresses. Therefore, you need to reserve the subnet with subnet mask of /26. Selecting a subnet mask of /27 would cause the remaining number of addresses to be 2 (32 – 30), this would prevent update operations for all instances as additional addresses are required in subnet for performing instance scaling.

**Example 3**: You plan to have one general purpose managed instance (Gen5 hardware) and perform vCores update operation from time to time. That means you need 5 + 6 + 1 * 3 + 3 = 17 IP addresses. As IP ranges are defined in power of 2, you need the IP range of 32 (2^5) IP addresses. Therefore, you need to reserve the subnet with subnet mask of /27.

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

## Next steps

- For an overview, see [What is Azure SQL Managed Instance?](sql-managed-instance-paas-overview.md).
- Learn more about [connectivity architecture for SQL Managed Instance](connectivity-architecture-overview.md).
- See how to [create a VNet where you will deploy SQL Managed Instance](virtual-network-subnet-create-arm-template.md).
- For DNS issues, see [Configure a custom DNS](custom-dns-configure.md).
