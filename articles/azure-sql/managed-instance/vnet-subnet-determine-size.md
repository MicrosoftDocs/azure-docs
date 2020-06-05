---
title: Determine required subnet size & range 
titleSuffix: Azure SQL Managed Instance 
description: This topic describes how to calculate the size of the subnet where the Azure SQL Managed Instances will be deployed.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
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

The number of SQL Managed Instances that can be deployed in the subnet of VNet depends on the size of the subnet (subnet range).

When you create a SQL Managed Instance, Azure allocates a number of virtual machines depending on the tier you selected during provisioning. Because these virtual machines are associated with your subnet, they require IP addresses. To ensure high availability during regular operations and service maintenance, Azure may allocate additional virtual machines. As a result, the number of required IP addresses in a subnet is larger than the number of SQL Managed Instances in that subnet.

By design, a SQL Managed Instance needs a minimum of 16 IP addresses in a subnet and may use up to 256 IP addresses. As a result, you can use a subnet masks between /28 and /24 when defining your subnet IP ranges. A network mask bit of /28 (14 hosts per network) is a good size for a single general purpose or business-critical deployment. A mask bit of /27 (30 hosts per network) is ideal for a multiple SQL Managed Instance deployments within the same VNet. Mask bit settings of /26 (62 hosts) and /24 (254 hosts) allows further scaling out of the VNet to support additional SQL Managed Instances.

> [!IMPORTANT]
> A subnet size with 16 IP addresses is the bare minimum with limited potential where a scaling operation like vCore size change is not supported. Choosing subnet with the prefix /27 or longest prefix is highly recommended.

## Determine subnet size

If you plan to deploy multiple SQL Managed Instances inside the subnet and need to optimize on subnet size, use these parameters to form a calculation:

- Azure uses five IP addresses in the subnet for its own needs
- Each General Purpose instance needs two addresses
- Each Business Critical instance needs four addresses

**Example**: You plan to have three General Purpose and two Business Critical SQL Managed Instances. That means you need 5 + 3 * 2 + 2 * 4 = 19 IP addresses. As IP ranges are defined in power of 2, you need the IP range of 32 (2^5) IP addresses. Therefore, you need to reserve the subnet with subnet mask of /27.

> [!IMPORTANT]
> Calculation displayed above will become obsolete with further improvements.

## Next steps

- For an overview, see [What is a SQL Managed Instance](sql-managed-instance-paas-overview.md).
- Learn more about [Connectivity architecture for SQL Managed Instance](connectivity-architecture-overview.md).
- See how to [create VNet where you will deploy SQL Managed Instances](virtual-network-subnet-create-arm-template.md)
- For DNS issues, see [Configuring a Custom DNS](custom-dns-configure.md)
