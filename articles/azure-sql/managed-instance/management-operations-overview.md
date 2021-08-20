---
title: Management operations overview
titleSuffix: Azure SQL Managed Instance 
description: Learn about Azure SQL Managed Instance management operations duration and best practices.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.custom: 
ms.devlang: 
ms.topic: overview
author: urosmil
ms.author: urmilano
ms.reviewer: mathoma, MashaMSFT
ms.date: 06/08/2021
---

# Overview of Azure SQL Managed Instance management operations
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Azure SQL Managed Instance provides management operations that you can use to automatically deploy new managed instances, update instance properties, and delete instances when no longer needed.

## What are management operations?

All management operations can be categorized as follows:

- Instance deployment (new instance creation)
- Instance update (changing instance properties, such as vCores or reserved storage)
- Instance deletion

To support [deployments within Azure virtual networks](../../virtual-network/virtual-network-for-azure-services.md) and provide isolation and security for customers, SQL Managed Instance relies on [virtual clusters](connectivity-architecture-overview.md#high-level-connectivity-architecture). The virtual cluster represents a dedicated set of isolated virtual machines deployed inside the customer's virtual network subnet. Essentially, every managed instance deployed to an empty subnet results in a new virtual cluster buildout.

Subsequent management operations on managed instances may impact the underlying virtual cluster. Changes that impact the underlying virtual cluster may affect the duration of management operations, as deploying additional virtual machines comes with an overhead that you need to consider when you plan new deployments or updates to existing managed instances.


## Duration

The duration of operations on the virtual cluster can vary, but typically have the longest duration. 

The following are values that you can typically expect, based on existing service telemetry data:

- **Virtual cluster creation**:  Creation is a synchronous step in instance management operations. <br/> **90% of operations finish in 4 hours**.
- **Virtual cluster resizing (expansion or shrinking)**: Expansion is a synchronous step, while shrinking is performed asynchronously (without impact on the duration of instance management operations). <br/>**90% of cluster expansions finish in less than 2.5 hours**.
- **Virtual cluster deletion**: Deletion is an asynchronous step, but it can also be [initiated manually](virtual-cluster-delete.md) on an empty virtual cluster, in which case it executes synchronously. <br/>**90% of virtual cluster deletions finish in 1.5 hours**.

Additionally, management of instances may also include one of the operations on hosted databases, which result in longer durations:

- **Attaching database files from Azure Storage**:  A synchronous step, such as scaling compute (vCores), or storage up or down in the General Purpose service tier. <br/>**90% of these operations finish in 5 minutes**.
- **Always On availability group seeding**: A synchronous step, such as compute (vCores), or storage scaling in the Business Critical service tier as well as in changing the service tier from General Purpose to Business Critical (or vice versa). Duration of this operation is proportional to the total database size as well as current database activity (number of active transactions). Database activity when updating an instance can introduce significant variance to the total duration. <br/>**90% of these operations execute at 220 GB/hour or higher**.

The following tables summarize operations and typical overall durations, based on the category of the operation:

**Category: Deployment**

|Operation  |Long-running segment  |Estimated duration  |
|---------|---------|---------|
|First instance in an empty subnet|Virtual cluster creation|90% of operations finish in 4 hours.|
|First instance of another hardware generation in a non-empty subnet (for example, first Gen 5 instance in a subnet with Gen 4 instances)|Virtual cluster creation<sup>1</sup>|90% of operations finish in 4 hours.|
|Subsequent instance creation within the non-empty subnet (2nd, 3rd, etc. instance)|Virtual cluster resizing|90% of operations finish in 2.5 hours.|
| | | 

<sup>1</sup> Virtual cluster is built per hardware generation.

**Category: Update**

|Operation  |Long-running segment  |Estimated duration  |
|---------|---------|---------|
|Instance property change (admin password, Azure AD login, Azure Hybrid Benefit flag)|N/A|Up to 1 minute.|
|Instance storage scaling up/down (General Purpose service tier)|No long-running segment<sup>1</sup>|99% of operations finish in 5 minutes.|
|Instance storage scaling up/down (Business Critical service tier)|- Virtual cluster resizing<br>- Always On availability group seeding|90% of operations finish in 2.5 hours + time to seed all databases (220 GB/hour).|
|Instance compute (vCores) scaling up and down (General Purpose)|- Virtual cluster resizing<br>- Attaching database files|90% of operations finish in 2.5 hours.|
|Instance compute (vCores) scaling up and down (Business Critical)|- Virtual cluster resizing<br>- Always On availability group seeding|90% of operations finish in 2.5 hours + time to seed all databases (220 GB/hour).|
|Instance service tier change (General Purpose to Business Critical and vice versa)|- Virtual cluster resizing<br>- Always On availability group seeding|90% of operations finish in 2.5 hours + time to seed all databases (220 GB/hour).|
| | | 

<sup>1</sup> Scaling General Purpose managed instance storage will not cause a failover at the end of operation. In this case operation consists of updating meta data and propagating response for submitted request.

**Category: Delete**

|Operation  |Long-running segment  |Estimated duration  |
|---------|---------|---------|
|Instance deletion|Log tail backup for all databases|90% operations finish in up to 1 minute.<br>Note: if the last instance in the subnet is deleted, this operation will schedule virtual cluster deletion after 12 hours.<sup>1</sup>|
|Virtual cluster deletion (as user-initiated operation)|Virtual cluster deletion|90% of operations finish in up to 1.5 hours.|
| | | 

<sup>1</sup>12 hours is the current configuration but this is subject to change in the future. If you need to delete a virtual cluster earlier (to release the subnet, for example), see [Delete a subnet after deleting a managed instance](virtual-cluster-delete.md).

## Instance availability

SQL Managed Instance **is available during update operations**, except a short downtime caused by the failover that happens at the end of the update. It typically lasts up to 10 seconds even in case of interrupted long-running transactions, thanks to [accelerated database recovery](../accelerated-database-recovery.md).

> [!NOTE]
> Scaling General Purpose managed instance storage will not cause a failover at the end of update.

SQL Managed Instance is not available to client applications during deployment and deletion operations.

> [!IMPORTANT]
> It's not recommended to scale compute or storage of Azure SQL Managed Instance or to change the service tier at the same time as long-running transactions (data import, data processing jobs, index rebuild, etc.). The failover of the database at the end of the operation cancels all ongoing transactions. 

## Management operations steps

Management operations consist of multiple steps. With [Operations API introduced](management-operations-monitor.md) these steps are exposed for subset of operations (deployment and update). Deployment operation consists of three steps while update operation is performed in six steps. For details on operations duration, see the [management operations duration](#duration) section. Steps are listed by order of execution.

### Managed instance deployment steps

|Step name  |Step description  |
|----|---------|
|Request validation |Submitted parameters are validated. In case of misconfiguration operation will fail with an error. |
|Virtual cluster resizing / creation |Depending on the state of subnet, virtual cluster goes into creation or resizing. |
|New SQL instance startup |SQL process is started on deployed virtual cluster. |

### Managed instance update steps

|Step name  |Step description  |
|----|---------|
|Request validation | Submitted parameters are validated. In case of misconfiguration operation will fail with an error. |
|Virtual cluster resizing / creation |Depending on the state of subnet, virtual cluster goes into creation or resizing. |
|New SQL instance startup | SQL process is started on deployed virtual cluster. |
|Seeding database files / attaching database files |Depending on the type of the update operation, either database seeding or attaching database files is performed. |
|Preparing failover and failover |After data has been seeded or database files reattached, system is being prepared for the failover. When everything is set, failover is performed **with a short downtime**. |
|Old SQL instance cleanup |Removing old SQL process from the virtual cluster |

> [!NOTE]
> Once instance scaling is completed, underlying virtual cluster will go through process of releasing unused capacity and possible capacity defragmentation, which could impact instances from the same subnet that did not participate in scaling operation, causing their failover. 


## Management operations cross-impact

Management operations on a managed instance can affect other management operations of the instances placed inside the same virtual cluster:

- **Long-running restore operations** in a virtual cluster will put other instance creation or scaling operations in the same subnet on hold.<br/>**Example:** If there is a long-running restore operation and there is a create or scale request in the same subnet, this request will take longer to complete as it waits for the restore operation to complete before it continues.

- **A subsequent instance creation or scaling** operation is put on hold by a previously initiated instance creation or instance scale that initiated a resize of the virtual cluster.<br/>**Example:** If there are multiple create and/or scale requests in the same subnet under the same virtual cluster, and one of them initiates a virtual cluster resize, all requests that were submitted 5+ minutes after the initial operation request will last longer than expected, as these requests will have to wait for the resize to complete before resuming.

- **Create/scale operations submitted in a 5-minute window** will be batched and executed in parallel.<br/>**Example:** Only one virtual cluster resize will be performed for all operations submitted in a 5-minute window (measuring from the moment of executing the first operation request). If another request is submitted more than 5 minutes after the first one is submitted, it will wait for the virtual cluster resize to complete before execution starts.

> [!IMPORTANT]
> Management operations that are put on hold because of another operation that is in progress will automatically be resumed once conditions to proceed are met. No user action is necessary to resume the temporarily paused management operations.

## Monitoring management operations

To learn how to monitor management operation progress and status, see [Monitoring management operations](management-operations-monitor.md).

## Canceling management operations

To learn how to cancel management operation, see [Canceling management operations](management-operations-cancel.md).


## Next steps

- To learn how to create your first managed instance, see [Quickstart guide](instance-create-quickstart.md).
- For a features and comparison list, see [Common SQL features](../database/features-comparison.md).
- For more information about VNet configuration, see [SQL Managed Instance VNet configuration](connectivity-architecture-overview.md).
- For a quickstart that creates a managed instance and restores a database from a backup file, see [Create a managed instance](instance-create-quickstart.md).
- For a tutorial about using Azure Database Migration Service for migration, see [SQL Managed Instance migration using Database Migration Service](../../dms/tutorial-sql-server-to-managed-instance.md).
