---
title: "What is an Azure SQL Managed Instance pool?" 
titleSuffix: Azure SQL Managed Instance
description: Learn about Azure SQL Managed Instance pools (preview), a feature that provides a convenient and cost-efficient way to migrate smaller SQL Server databases to the cloud at scale, and manage multiple managed instances.  
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: bonova
ms.author: bonova
ms.reviewer: sstein, carlrab
ms.date: 09/05/2019
---
# What is an Azure SQL Managed Instance pool (preview)?
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Instance pools in Azure SQL Managed Instance provide a convenient and cost-efficient way to migrate smaller SQL Server instances to the cloud at scale.

Instance pools allow you to pre-provision compute resources according to your total migration requirements. You can then deploy several individual managed instances up to your pre-provisioned compute level. For example, if you pre-provision 8 vCores you can deploy two 2-vCore and one 4-vCore instance, and then migrate databases into these instances. Prior to instance pools being available, smaller and less compute-intensive workloads would often have to be consolidated into a larger managed instance when migrating to the cloud. The need to migrate groups of databases to a large instance typically required careful capacity planning and resource governance, additional security considerations, and some extra data consolidation work at the instance level.

Additionally, instance pools support native VNet integration so you can deploy multiple instance pools and multiple single instances in the same subnet.

## Key capabilities

Instance pools provide the following benefits:

1. Ability to host 2-vCore instances. *\*Only for instances in the instance pools*.
2. Predictable and fast instance deployment time (up to 5 minutes).
3. Minimal IP address allocation.

The following diagram illustrates an instance pool with multiple managed instances deployed within a virtual network subnet.

![instance pool with multiple instances](./media/instance-pools-overview/instance-pools1.png)

Instance pools enable deployment of multiple instances on the same virtual machine, where the virtual machine's compute size is based on the total number of vCores allocated for the pool. This architecture allows *partitioning* of the virtual machine into multiple instances, which can be any supported size, including 2 vCores (2-vCore instances are only available for instances in pools).

After initial deployment, management operations on instances in a pool are much faster. This is because  the deployment or extension of a [virtual cluster](connectivity-architecture-overview.md#high-level-connectivity-architecture) (dedicated set of virtual machines) is not part of provisioning the managed instance.

Because all instances in a pool share the same virtual machine, the total IP allocation does not depend on the number of instances deployed, which is convenient for deployment in subnets with a narrow IP range.

Each pool has a fixed IP allocation of only nine IP addresses (not including the five IP addresses in the subnet that are reserved for its own needs). For details, see the [subnet size requirements for single instances](vnet-subnet-determine-size.md).

## Application scenarios

The following list provides the main use cases where instance pools should be considered:

- Migration of *a group of SQL Server instances* at the same time, where the majority is a smaller size (for example 2 or 4 vCores).
- Scenarios where *predictable and short instance creation or scaling* is important. For example, deployment of a new tenant in a multi-tenant SaaS application environment that requires instance-level capabilities.
- Scenarios where having a *fixed cost* or *spending limit* is important. For example, running shared dev-test or demo environments of a fixed (or infrequently changing) size, where you periodically deploy managed instances when needed.
- Scenarios where *minimal IP address allocation* in a VNet subnet is important. All instances in a pool are sharing a virtual machine, so the number of allocated IP addresses is lower than in the case of single instances.

## Architecture

Instance pools have a similar architecture to regular (*single*) managed instances. To support [deployments within Azure virtual networks](../../virtual-network/virtual-network-for-azure-services.md) and to provide isolation and security for customers, instance pools also rely on [virtual clusters](connectivity-architecture-overview.md#high-level-connectivity-architecture). Virtual clusters represent a dedicated set of isolated virtual machines deployed inside the customer's virtual network subnet.

The main difference between the two deployment models is that instance pools allow multiple SQL Server process deployments on the same virtual machine node, which are resource governed using [Windows job objects](https://docs.microsoft.com/windows/desktop/ProcThread/job-objects), while single instances are always alone on a virtual machine node.

The following diagram shows an instance pool and two individual instances deployed in the same subnet and illustrates the main architectural details for both deployment models:

![Instance pool and two individual instances](./media/instance-pools-overview/instance-pools2.png)

Every instance pool creates a separate virtual cluster underneath. Instances within a pool and single instances deployed in the same subnet do not share compute resources allocated to SQL Server processes and gateway components, which ensures performance predictability.

## Resource limitations

There are several resource limitations regarding instance pools and instances inside pools:

- Instance pools are available only on Gen5 hardware.
- Managed instances within a pool have dedicated CPU and RAM, so the aggregated number of vCores across all instances must be less than or equal to the number of vCores allocated to the pool.
- All [instance-level limits](resource-limits.md#service-tier-characteristics) apply to instances created within a pool.
- In addition to instance-level limits, there are also two limits imposed *at the instance pool level*:
  - Total storage size per pool (8 TB).
  - Total number of databases per pool (100).

Total storage allocation and number of databases across all instances must be lower than or equal to the limits exposed by instance pools.

- Instance pools support 8, 16, 24, 32, 40, 64, and 80 vCores.
- Managed instances inside pools support 2, 4, 8, 16, 24, 32, 40, 64, and 80 vCores.
- Managed instances inside pools support storage sizes between 32 GB and 8 TB, except:
  - 2 vCore instances support sizes between 32 GB and 640 GB
  - 4 vCore instances support sizes between 32 GB and 2 TB

The [service tier property](resource-limits.md#service-tier-characteristics) is associated with the instance pool resource, so all instances in a pool must be the same service tier as the service tier of the pool. At this time, only the General Purpose service tier is available (see the following section on limitations in the current preview).

### Public preview limitations

The public preview has the following limitations:

- Currently, only the General Purpose service tier is available.
- Instance pools cannot be scaled during the public preview, so careful capacity planning before deployment is important.
- Azure portal support for instance pool creation and configuration is not yet available. All operations on instance pools are supported through PowerShell only. Initial instance deployment in a pre-created pool is also supported through PowerShell only. Once deployed into a pool, managed instances can be updated using the Azure portal.
- Managed instances created outside of the pool cannot be moved into an existing pool, and instances created inside a pool cannot be moved outside as a single instance or to another pool.
- [Reserve capacity](../database/reserved-capacity-overview.md) instance pricing is not available.

## SQL features supported

Managed instances created in pools support the same [compatibility levels and features supported in single managed instances](sql-managed-instance-paas-overview.md#sql-features-supported).

Every managed instance deployed in a pool has a separate instance of SQL Agent.

Optional features or features that require you to choose specific values (such as instance-level collation, time zone, public endpoint for data traffic, failover groups) are configured at the instance level and can be different for each instance in a pool.

## Performance considerations

Although managed instances within pools do have dedicated vCore and RAM, they share local disk (for tempdb usage) and network resources. It's not likely, but it is possible to experience the *noisy neighbor* effect if multiple instances in the pool have high resource consumption at the same time. If you observe this behavior, consider deploying these instances to a bigger pool or as single instances.

## Security considerations

Because instances deployed in a pool share the same virtual machine, you may want to consider disabling features that introduce higher security risks, or to firmly control access permissions to these features. For example, CLR integration, native backup and restore, database email, etc.

## Instance pool support requests

Create and manage support requests for instance pools in the [Azure portal](https://portal.azure.com).

If you are experiencing issues related to instance pool deployment (creation or deletion), make sure that you specify **Instance Pools** in the **Problem subtype** field.

![Instance pools support request](./media/instance-pools-overview/support-request.png)

If you are experiencing issues related to a single managed instance or database within a pool, you should create a regular support ticket for Azure SQL Managed Instance.

To create larger SQL Managed Instance deployments (with or without instance pools), you may need to obtain a larger regional quota. For more information, see [Request quota increases for Azure SQL Database](../database/quota-increase-request.md). The deployment logic for instance pools compares total vCore consumption *at the pool level* against your quota to determine whether you are allowed to create new resources without further increasing your quota.

## Instance pool billing

Instance pools allow scaling compute and storage independently. Customers pay for compute associated with the pool resource measured in vCores, and storage associated with every instance measured in gigabytes (the first 32 GB are free of charge for every instance).

vCore price for a pool is charged regardless of how many instances are deployed in that pool.

For the compute price (measured in vCores), two pricing options are available:

  1. *License included*: Price of SQL Server licenses is included. This is for the customers who choose not to apply existing SQL Server licenses with Software Assurance.
  2. *Azure Hybrid Benefit*: A reduced price that includes Azure Hybrid Benefit for SQL Server. Customers can opt into this price by using their existing SQL Server licenses with Software Assurance. For eligibility and other details, see [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

Setting different pricing options is not possible for individual instances in a pool. All instances in the parent pool must be either at License Included price or Azure Hybrid Benefit price. The license model for the pool can be altered after the pool is created.

> [!IMPORTANT]
> If you specify a license model for the instance that is different than in the pool, the pool price is used and the instance level value is ignored.

If you create instance pools on [subscriptions eligible for dev-test benefit](https://azure.microsoft.com/pricing/dev-test/), you automatically receive discounted rates of up to 55 percent on Azure SQL Managed Instance.

For full details on instance pool pricing, refer to the *instance pools* section on the [SQL Managed Instance pricing page](https://azure.microsoft.com/pricing/details/sql-database/managed/).

## Next steps

- To get started with instance pools, see [SQL Managed Instance pools how-to guide](instance-pools-configure.md).
- To learn how to create your first managed instance, see [Quickstart guide](instance-create-quickstart.md).
- For a features and comparison list, see [Azure SQL common features](../database/features-comparison.md).
- For more information about VNet configuration, see [SQL Managed Instance VNet configuration](connectivity-architecture-overview.md).
- For a quickstart that creates a managed instance and restores a database from a backup file, see [Create a managed instance](instance-create-quickstart.md).
- For a tutorial about using Azure Database Migration Service for migration, see [SQL Managed Instance migration using Database Migration Service](../../dms/tutorial-sql-server-to-managed-instance.md).
- For advanced monitoring of SQL Managed Instance database performance with built-in troubleshooting intelligence, see [Monitor Azure SQL Managed Instance using Azure SQL Analytics](../../azure-monitor/insights/azure-sql.md).
- For pricing information, see [SQL Managed Instance pricing](https://azure.microsoft.com/pricing/details/sql-database/managed/).
