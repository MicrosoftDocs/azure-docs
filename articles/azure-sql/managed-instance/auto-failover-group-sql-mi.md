---
title: Auto-failover groups overview & best practices
description: Auto-failover groups let you manage geo-replication and automatic / coordinated failover of all user databases on a managed instance in Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: high-availability
ms.custom: sql-db-mi-split
ms.topic: conceptual
author: MladjoA
ms.author: mlandzic
ms.reviewer: kendralittle, mathoma
ms.date: 03/15/2022
---

# Auto-failover groups overview & best practices (Azure SQL Managed Instance)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

> [!div class="op_single_selector"]
> * [Azure SQL Database](../database/auto-failover-group-sql-db.md)
> * [Azure SQL Managed Instance](auto-failover-group-sql-mi.md)

The auto-failover groups feature allows you to manage the replication and failover of all user databases in a managed instance to another Azure region. This article focuses on using the Auto-failover group feature with Azure SQL Managed Instance and some best practices. 

To get started, review [Configure auto-failover group](auto-failover-group-configure-sql-mi.md). For an end-to-end experience, see the [Auto-failover group tutorial](failover-group-add-instance-tutorial.md).

> [!NOTE]
> This article covers auto-failover groups for Azure SQL Managed Instance. For Azure SQL Database, see [Auto-failover groups in SQL Database](../database/auto-failover-group-sql-db.md). 

## Overview

[!INCLUDE [auto-failover-groups-overview](../includes/auto-failover-group-overview.md)]


## <a name="terminology-and-capabilities"></a> Terminology and capabilities

<!--
There is some overlap of content in the following articles, be sure to make changes to all if necessary:
/azure-sql/database/auto-failover-group-sql-db.md
/azure-sql/database/auto-failover-group-configure-sql-db.md
/azure-sql/managed-instance/auto-failover-group-sql-mi.md
/azure-sql/managed-instance/auto-failover-group-configure-sql-mi.md
-->

- **Failover group (FOG)**

  A failover group allows for all user databases within a managed instance to fail over as a unit to another Azure region in case the primary managed instance becomes unavailable due to a primary region outage. Since failover groups for SQL Managed Instance contain all user databases within the instance, only one failover group can be configured on an instance. 

  > [!IMPORTANT]
  > The name of the failover group must be globally unique within the `.database.windows.net` domain.

- **Primary**

  The managed instance that hosts the primary databases in the failover group.

- **Secondary**

  The managed instance that hosts the secondary databases in the failover group. The secondary cannot be in the same Azure region as the primaryF.
 
- **DNS zone**

  A unique ID that is automatically generated when a new SQL Managed Instance is created. A multi-domain (SAN) certificate for this instance is provisioned to authenticate the client connections to any instance in the same DNS zone. The two managed instances in the same failover group must share the DNS zone.
  
- **Failover group read-write listener**

  A DNS CNAME record that points to the current primary. It is created automatically when the failover group is created and allows the read-write workload to transparently reconnect to the primary when the primary changes after failover. When the failover group is created on a SQL Managed Instance, the DNS CNAME record for the listener URL is formed as `<fog-name>.<zone_id>.database.windows.net`.

- **Failover group read-only listener**

  A DNS CNAME record that points to the current secondary. It is created automatically when the failover group is created and allows the read-only SQL workload to transparently connect to the secondary when the secondary changes after failover. When the failover group is created on a SQL Managed Instance, the DNS CNAME record for the listener URL is formed as `<fog-name>.secondary.<zone_id>.database.windows.net`.

[!INCLUDE [auto-failover-group-terminology](../includes/auto-failover-group-terminology.md)]  


## Failover group architecture

The auto-failover group must be configured on the primary instance and will connect it to the secondary instance in a different Azure region.  All user databases in the instance will be replicated to the secondary instance. System databases like _master_ and _msdb_ will not be replicated.

The following diagram illustrates a typical configuration of a geo-redundant cloud application using managed instance and auto-failover group:

:::image type="content" source="media/auto-failover-group-sql-mi/auto-failover-group-mi.png" alt-text="Auto-failover group diagram for SQL MI":::

If your application uses SQL Managed Instance as the data tier, follow the general guidelines and best practices outlined in this article when designing for business continuity.


> [!IMPORTANT]
> If you deploy auto-failover groups in a hub-and-spoke network topology cross-region, replication traffic should go directly between the two managed instance subnets rather than directed through the hub networks.

## Initial seeding 

When adding managed instances to a failover group, there is an initial seeding phase before data replication starts. The initial seeding phase is the longest and most expensive operation. Once initial seeding completes, data is synchronized, and then only subsequent data changes are replicated. The time it takes for the initial seeding to complete depends on the size of your data, number of replicated databases, the load on primary databases, and the speed of the link between the primary and secondary. Under normal circumstances, possible seeding speed is up to 360 GB an hour for SQL Managed Instance. Seeding is performed for all databases in parallel.

For SQL Managed Instance, consider the speed of the Express Route link between the two instances when estimating the time of the initial seeding phase. If the speed of the link between the two instances is slower than what is necessary, the time to seed is likely to be noticeably impacted. You can use the stated seeding speed, number of databases, total size of data, and the link speed to estimate how long the initial seeding phase will take before data replication starts. For example, for a single 100 GB database, the initial seed phase would take about 1.2 hours if the link is capable of pushing 84 GB per hour, and if there are no other databases being seeded. If the link can only transfer 10 GB per hour, then seeding a 100 GB database will take about 10 hours. If there are multiple databases to replicate, seeding will be executed in parallel, and, when combined with a slow link speed, the initial seeding phase may take considerably longer, especially if the parallel seeding of data from all databases exceeds the available link bandwidth. If the network bandwidth between two instances is limited and you are adding multiple managed instances to a failover group, consider adding multiple managed instances to the failover group sequentially, one by one. Given an appropriately sized gateway SKU between the two managed instances, and if corporate network bandwidth allows it, it's possible to achieve speeds as high as 360 GB an hour.  


## <a name="creating-the-secondary-instance"></a> Creating the geo-secondary instance

To ensure non-interrupted connectivity to the primary SQL Managed Instance after failover, both the primary and secondary instances must be in the same DNS zone. It will guarantee that the same multi-domain (SAN) certificate can be used to authenticate client connections to either of the two instances in the failover group. When your application is ready for production deployment, create a secondary SQL Managed Instance in a different region and make sure it shares the DNS zone with the primary SQL Managed Instance. You can do it by specifying an optional parameter during creation. If you are using PowerShell or the REST API, the name of the optional parameter is `DNSZonePartner`. The name of the corresponding optional field in the Azure portal is *Primary Managed Instance*.

> [!IMPORTANT]
> The first managed instance created in the subnet determines DNS zone for all subsequent instances in the same subnet. This means that two instances from the same subnet cannot belong to different DNS zones.

For more information about creating the secondary SQL Managed Instance in the same DNS zone as the primary instance, see [Create a secondary managed instance](../managed-instance/failover-group-add-instance-tutorial.md#create-a-secondary-managed-instance).

## <a name="using-geo-paired-regions"></a> Use paired regions

Deploy both managed instances to [paired regions](../../availability-zones/cross-region-replication-azure.md) for performance reasons. SQL Managed Instance failover groups in paired regions have better performance compared to unpaired regions.

## <a name="enabling-replication-traffic-between-two-instances"></a> Enable geo-replication traffic between two instances

Because each managed instance is isolated in its own VNet, two-directional traffic between these VNets must be allowed. See [Azure VPN gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md)



## <a name="managing-failover-to-secondary-instance"></a> Manage geo-failover to a geo-secondary instance

The failover group will manage geo-failover of all databases on the primary managed instance. When a group is created, each database in the instance will be automatically geo-replicated to the geo-secondary instance. You cannot use failover groups to initiate a partial failover of a subset of databases.

> [!IMPORTANT]
> If a database is dropped on the primary managed instance, it will also be dropped automatically on the geo-secondary managed instance.

## <a name="using-read-write-listener-for-oltp-workload"></a> Use the read-write listener (primary MI) 

For read-write workloads, use `<fog-name>.zone_id.database.windows.net` as the server name. Connections will be automatically directed to the primary. This name does not change after failover. The geo-failover involves updating the DNS record, so the client connections are redirected to the new primary only after the client DNS cache is refreshed. Because the secondary instance shares the DNS zone with the primary, the client application will be able to reconnect to it using the same server-side SAN certificate. The read-write listener and read-only listener cannot be reached via the [public endpoint for managed instance](public-endpoint-configure.md). 

## <a name="using-read-only-listener-to-connect-to-the-secondary-instance"></a> Use the read-only listener (secondary MI) 

If you have logically isolated read-only workloads that are tolerant to data latency, you can run them on the geo-secondary. To connect directly to the geo-secondary, use `<fog-name>.secondary.<zone_id>.database.windows.net` as the server name.

In the Business Critical tier, SQL Managed Instance supports the use of [read-only replicas](../database/read-scale-out.md) to offload read-only query workloads, using the `ApplicationIntent=ReadOnly` parameter in the connection string. When you have configured a geo-replicated secondary, you can use this capability to connect to either a read-only replica in the primary location or in the geo-replicated location: 

- To connect to a read-only replica in the primary location, use `ApplicationIntent=ReadOnly` and `<fog-name>.<zone_id>.database.windows.net`.   
- To connect to a read-only replica in the secondary location, use `ApplicationIntent=ReadOnly` and `<fog-name>.secondary.<zone_id>.database.windows.net`.

The read-write listener and read-only listener cannot be reached via [public endpoint for managed instance](public-endpoint-configure.md).


## Potential performance degradation after failover 

A typical Azure application uses multiple Azure services and consists of multiple components. The automatic geo-failover of the failover group is triggered based on the state the Azure SQL components alone. Other Azure services in the primary region may not be affected by the outage and their components may still be available in that region. Once the primary databases switch to the secondary region, the latency between the dependent components may increase. To avoid the impact of higher latency on the application's performance, ensure the redundancy of all the application's components in the secondary region and fail over application components together with the database. 

## Potential data loss after failover 

If an outage occurs in the primary region, recent transactions may not be able to replicate to the geo-secondary. Failover is deferred for the period you specify using `GracePeriodWithDataLossHours`. If you configured the automatic failover policy, be prepared for data loss. In general, during outages, Azure favors availability. Setting `GracePeriodWithDataLossHours` to a larger number, such as 24 hours, or disabling automatic geo-failover lets you reduce the likelihood of data loss at the expense of database availability.

## DNS update

The DNS update of the read-write listener will happen immediately after the failover is initiated. This operation will not result in data loss. However, the process of switching database roles can take up to 5 minutes under normal conditions. Until it is completed, some databases in the new primary instance will still be read-only. If a failover is initiated using PowerShell, the operation to switch the primary replica role is synchronous. If it is initiated using the Azure portal, the UI will indicate completion status. If it is initiated using the REST API, use standard Azure Resource Manager’s polling mechanism to monitor for completion.

> [!IMPORTANT]
> Use manual planned failover to move the primary back to the original location once the outage that caused the geo-failover is mitigated.
  

## Enable scenarios dependent on objects from the system databases

System databases are **not** replicated to the secondary instance in a failover group. To enable scenarios that depend on objects from the system databases, make sure to create the same objects on the secondary instance and keep them synchronized with the primary instance. 

For example, if you plan to use the same logins on the secondary instance, make sure to create them with the identical SID. 

```SQL
-- Code to create login on the secondary instance
CREATE LOGIN foo WITH PASSWORD = '<enterStrongPasswordHere>', SID = <login_sid>;
``` 

To learn more, see [Replication of logins and agent jobs](https://techcommunity.microsoft.com/t5/modernization-best-practices-and/azure-sql-managed-instance-sync-agent-jobs-and-logins-in/ba-p/2860495). 

## Synchronize instance properties and retention policies instances

Instances in a failover group remain separate Azure resources, and no changes made to the configuration of the primary instance will be automatically replicated to the secondary instance. Make sure to perform all relevant changes both on primary _and_ secondary instance. For example, if you change backup storage redundancy or long-term backup retention policy on primary instance, make sure to change it on secondary instance as well.


## <a name="using-failover-groups-and-virtual-network-rules"></a> Use failover groups and virtual network service endpoints

If you are using [Virtual Network service endpoints and rules](../database/vnet-service-endpoint-rule-overview.md) to restrict access to your SQL Managed Instance, be aware that each virtual network service endpoint applies to only one Azure region. The endpoint does not enable other regions to accept communication from the subnet. Therefore, only the client applications deployed in the same region can connect to the primary database. 

## <a name="preventing-the-loss-of-critical-data"></a> Prevent loss of critical data

<!--
There is some overlap in the following content, be sure to update all that's necessary: 
/azure-sql/database/auto-failover-group-sql-db.md
/azure-sql/managed-instance/auto-failover-group-sql-mi.md
-->

Due to the high latency of wide area networks, geo-replication uses an asynchronous replication mechanism. Asynchronous replication makes the possibility of data loss unavoidable if the primary fails. To protect critical transactions from data loss, an application developer can call the [sp_wait_for_database_copy_sync](/sql/relational-databases/system-stored-procedures/active-geo-replication-sp-wait-for-database-copy-sync) stored procedure immediately after committing the transaction. Calling `sp_wait_for_database_copy_sync` blocks the calling thread until the last committed transaction has been transmitted and hardened in the transaction log of the secondary database. However, it does not wait for the transmitted transactions to be replayed (redone) on the secondary. `sp_wait_for_database_copy_sync` is scoped to a specific geo-replication link. Any user with the connection rights to the primary database can call this procedure.

> [!NOTE]
> `sp_wait_for_database_copy_sync` prevents data loss after geo-failover for specific transactions, but does not guarantee full synchronization for read access. The delay caused by a `sp_wait_for_database_copy_sync` procedure call can be significant and depends on the size of the not yet transmitted transaction log on the primary at the time of the call.

## Failover group status
Auto-failover group reports its status describing the current state of the data replication:

- Seeding - [Initial seeding](auto-failover-group-sql-mi.md#initial-seeding) is taking place after creation of the failover group, until all user databases are initialized on the secondary instance. Failover process cannot be initiated while auto-failover group is in the Seeding status, since user databases are not copied to secondary instance yet.
- Synchronizing - the usual status of auto-failover group. It means that data changes on the primary instance are being replicated asynchronously to the secondary instance. This status doesn't guarantee that the data is fully synchronized at every moment. There may be data changes from primary still to be replicated to the secondary due to asynchronous nature of the replication process between instances in the auto-failover group. Both automatic and manual failovers can be initiated while the auto-failover group is in the Seeding status.
- Failover in progress - this status indicates that either automatically or manually initiated failover process is in progress. No changes to the failover group or additional failovers can be initiated while the auto-failover group is in this status.

## Permissions

<!--
There is some overlap of content in the following articles, be sure to make changes to all if necessary:
/azure-sql/database/auto-failover-group-sql-db.md
/azure-sql/database/auto-failover-group-configure-sql-db.md
/azure-sql/managed-instance/auto-failover-group-sql-mi.md
/azure-sql/managed-instance/auto-failover-group-configure-sql-mi.md
-->

Permissions for a failover group are managed via [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). 

Azure RBAC write access is necessary to create and manage failover groups. The [SQL Managed Instance Contributor](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) has all the necessary permissions to manage failover groups.

For specific permission scopes, review how to [configure auto-failover groups in Azure SQL Managed Instance](auto-failover-group-configure-sql-mi.md#permissions). 

## Limitations 

Be aware of the following limitations:

- Failover groups cannot be created between two instances in the same Azure region.
- Failover groups cannot be renamed. You will need to delete the group and re-create it with a different name.
- Database rename is not supported for databases in failover group. You will need to temporarily delete failover group to be able to rename a database, or remove the database from the failover group.
- System databases are not replicated to the secondary instance in a failover group. Therefore, scenarios that depend on objects from the system databases such as Server Logins and Agent jobs, require objects to be manually created on the secondary instances and also manually kept in sync after any changes made on primary instance. The only exception is Service master Key (SMK) for SQL Managed Instance, that is replicated automatically to secondary instance during creation of failover group. Any subsequent changes of SMK on the primary instance however will not be replicated to secondary instance. To learn more, see how to [Enable scenarios dependent on objects from the system databases](#enable-scenarios-dependent-on-objects-from-the-system-databases).
- Failover groups cannot be created between instances if any of them are in an instance pool.

## <a name="programmatically-managing-failover-groups"></a> Programmatically manage failover groups

Auto-failover groups can also be managed programmatically using Azure PowerShell, Azure CLI, and REST API. The following tables describe the set of commands available. Active geo-replication includes a set of Azure Resource Manager APIs for management, including the [Azure SQL Database REST API](/rest/api/sql/) and [Azure PowerShell cmdlets](/powershell/azure/). These APIs require the use of resource groups and support Azure role-based access control (Azure RBAC). For more information on how to implement access roles, see [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).


# [PowerShell](#tab/azure-powershell)

| Cmdlet | Description |
| --- | --- |
| [New-AzSqlDatabaseInstanceFailoverGroup](/powershell/module/az.sql/new-azsqldatabaseinstancefailovergroup) |This command creates a failover group and registers it on both primary and secondary instances|
| [Set-AzSqlDatabaseInstanceFailoverGroup](/powershell/module/az.sql/set-azsqldatabaseinstancefailovergroup) |Modifies configuration of a failover group|
| [Get-AzSqlDatabaseInstanceFailoverGroup](/powershell/module/az.sql/get-azsqldatabaseinstancefailovergroup) |Retrieves a failover group's configuration|
| [Switch-AzSqlDatabaseInstanceFailoverGroup](/powershell/module/az.sql/switch-azsqldatabaseinstancefailovergroup) |Triggers failover of a failover group to the secondary instance|
| [Remove-AzSqlDatabaseInstanceFailoverGroup](/powershell/module/az.sql/remove-azsqldatabaseinstancefailovergroup) | Removes a failover group|


# [Azure CLI](#tab/azure-cli)

| Command | Description |
| --- | --- |
| [az sql failover-group create](/cli/azure/sql/failover-group#az-sql-failover-group-create) |This command creates a failover group and registers it on both primary and secondary servers|
| [az sql failover-group delete](/cli/azure/sql/failover-group#az-sql-failover-group-delete) | Removes a failover group from the server |
| [az sql failover-group show](/cli/azure/sql/failover-group#az-sql-failover-group-show) | Retrieves a failover group configuration |
| [az sql failover-group update](/cli/azure/sql/failover-group#az-sql-failover-group-update) |Modifies a failover group's configuration  and/or adds one or more databases to a failover group|
| [az sql failover-group set-primary](/cli/azure/sql/failover-group#az-sql-failover-group-set-primary) | Triggers failover of a failover group to the secondary server |

# [REST API](#tab/rest-api)

| API | Description |
| --- | --- |
| [Create or Update Failover Group](/rest/api/sql/instancefailovergroups/createorupdate) | Creates or updates a failover group's configuration |
| [Delete Failover Group](/rest/api/sql/instancefailovergroups/delete) | Removes a failover group from the instance |
| [Failover (Planned)](/rest/api/sql/instancefailovergroups/failover) | Triggers failover from the current primary instance to this instance with full data synchronization. |
| [Force Failover Allow Data Loss](/rest/api/sql/instancefailovergroups/forcefailoverallowdataloss) | Triggers failover from the current primary instance to the secondary instance without synchronizing data. This operation may result in data loss. |
| [Get Failover Group](/rest/api/sql/instancefailovergroups/get) | retrieves a failover group's configuration. |
| [List Failover Groups - List By Location](/rest/api/sql/instancefailovergroups/listbylocation) | Lists the failover groups in a location. |

---

## Next steps

- For detailed tutorials, see
  - [Add a SQL Managed Instance to a failover group](../managed-instance/failover-group-add-instance-tutorial.md)
- For a sample script, see:
  - [Use PowerShell to create an auto-failover group on a SQL Managed Instance](scripts/add-to-failover-group-powershell.md)
- For a business continuity overview and scenarios, see [Business continuity overview](../database/business-continuity-high-availability-disaster-recover-hadr-overview.md)
- To learn about automated backups, see [SQL Database automated backups](../database/automated-backups-overview.md).
- To learn about using automated backups for recovery, see [Restore a database from the service-initiated backups](../database/recovery-using-backups.md).
