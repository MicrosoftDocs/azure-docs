---
title: Failover groups and active geo-replication - Azure SQL Database | Microsoft Docs
description: Auto-failover groups with active geo-replication enables you to setup 4 replicas of your database in any of the Azure datacenters and autoomatically failover in the event of an outage.
services: sql-database
documentationcenter: na
author: anosov1960
manager: jhubbard
editor: monicar

ms.assetid: 2a29f657-82fb-4283-9a83-e14a144bfd93
ms.service: sql-database
ms.custom: business continuity
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: NA
ms.date: 09/26/2016
ms.author: sashan

---
# Overview: Failover groups and active geo-replication
Active geo-replication enables you to configure up to four readable secondary databases in the same or different data center locations (regions). Secondary databases are available for querying and for failover in the case of a data center outage or the inability to connect to the primary database. The failover must be initiated manually by the application of the user. After failover, the new primary has a different connection end-point. 

> [!NOTE]
> Active geo-replication is available for all databases in all service tiers in all regions.
>  

Azure SQL Database auto-failover groups (in-preview) is a SQL Database feature designed to automatically manage geo-replication relationship, connectivity, and failover at scale. With it, the customers gain the ability to automatically recover multiple related databases in the secondary region after catastrophic regional failures or other unplanned events that result in full or partial loss of the SQL Database service’s availability in the primary region. Additionally, they can use the readable secondary databases to offload read-only workloads.  Because auto-failover groups involve multiple databases they must be configured on the primary server. Both primary and secondary servers must be in the same subscription. Auto-failover groups support replication of all databases in the group to only one secondary server in a different region. Active geo-replication, without auto-failover groups, allows up to 4 secondaries in any region.

If you are using active geo-replication and for any reason your primary database fails, or simply needs to be taken offline, you can initiate failover to any of your secondary databases. When failover is activated to one of the secondary databases, all other secondaries are automatically linked to the new primary. If you are using auto-failover groups (in-preview) to manage database recovery and any outage that impacts one or several of the databases in the group results in automatic failover. You can configure the auto-failover policy that best meets your application needs, or you can opt out and use manual activation. In addition, auto-failover groups (in-preview) provide read-write and read-only listener end-points that remain unchanged during failovers. Whether you use manual or automatic failover activation, failover switches all secondary databases in the group to primary. After the database failover is completed, the DNS record is automatically updated to redirect the end-points to the new region.

You can manage replication and failover of an individual database or a set of databases on a server or in an elastic pool using active geo-replication. You can do that using the [Azure portal](sql-database-geo-replication-portal.md), [PowerShell](sql-database-geo-replication-powershell.md), [Transact-SQL](sql-database-geo-replication-transact-sql.md), or the [REST API](https://msdn.microsoft.com/library/azure/mt163685.aspx). After failover, ensure the authentication requirements for your server and database are configured on the new primary. For details, see [SQL Database security after disaster recovery](sql-database-geo-replication-security-config.md). This applies both to active geo-replication and auto-failover groups (in-preview).

Active geo-replication leverages the [Always On](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server) technology of SQL Server to asynchronously replicate committed transactions on the primary database to a secondary database using read committed snapshot isolation (RCSI). Auto-failover groups provide the group semantics on top of active geo-replication but the same asynchronous replication mechanism is used. While at any given point, the secondary database might be slightly behind the primary database, the secondary data is guaranteed to never have partial transactions. Cross-region redundancy enables applications to quickly recover from a permanent loss of an entire datacenter or parts of a datacenter caused by natural disasters, catastrophic human errors, or malicious acts. The specific RPO data can be found at [Overview of Business Continuity](sql-database-business-continuity.md).

The following figure shows an example of active geo-replication configured with a primary in the North Central US region and secondary in the South Central US region.

![geo-replication relationship](./media/sql-database-active-geo-replication/geo-replication-relationship.png)

Because the secondary databases are readable, they can be used to offload read-only workloads such as reporting jobs. If you are using active geo-replication, it is possible to create the secondary database in the same region with the primary, but it does not increase the application's resilience to catastrophic failures. If you are using auto-failover groups (in-preview), your secondary database is always created in a different region.

In addition to disaster recovery active geo-replication can be used in the following scenarios:

* **Database migration**: You can use active geo-replication to migrate a database from one server to another online with minimum downtime.
* **Application upgrades**: You can create an extra secondary as a fail back copy during application upgrades.

To achieve real business continuity, adding database redundancy between datacenters is only part of the solution. Recovering an application (service) end-to-end after a catastrophic failure requires recovery of all components that constitute the service and any dependent services. Examples of these components include the client software (for example, a browser with a custom JavaScript), web front ends, storage, and DNS. It is critical that all components are resilient to the same failures and become available within the recovery time objective (RTO) of your application. Therefore, you need to identify all dependent services and understand the guarantees and capabilities they provide. Then, you must take adequate steps to ensure that your service functions during the failover of the services on which it depends. For more information about designing solutions for disaster recovery, see [Designing Cloud Solutions for Disaster Recovery Using active geo-replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md).

## Active geo-replication capabilities
The active geo-replication feature provides the following essential capabilities:

* **Automatic Asynchronous Replication**: You can only create a secondary database by adding to an existing database. The secondary can be created in any Azure SQL Database server. Once created, the secondary database is populated with the data copied from the primary database. This process is known as seeding. After secondary database has been created and seeded, updates to the primary database are asynchronously replicated to the secondary database automatically. Asynchronous replication means that transactions are committed on the primary database before they are replicated to the secondary database. 
* **Readable secondary databases**: An application can access a secondary database for read-only operations using the same or different security principals used for accessing the primary database. The secondary databases operate in snapshot isolation mode to ensure replication of the updates of the primary (log replay) is not delayed by queries executed on the secondary.

   > [!NOTE]
   > The log replay is delayed on the secondary database if there are schema updates that it is receiving from the Primary that require a schema lock on the secondary database. 
   > 

* **Multiple readable secondaries**: Two or more secondary databases increase redundancy and level of protection for the primary database and application. If multiple secondary databases exist, the application remains protected even if one of the secondary databases fails. If there is only one secondary database, and it fails, the application is exposed to higher risk until a new secondary database is created.

   > [!NOTE]
   > If you are using active geo-replication to build a globally distributed application and need to provide read-only access to data in more than 4 regions, you can create secondary of a secondary (a process known as chaining). This way you can achieve virtually unlimited scale of database replication. In addition, chaining reduces the overhead of replication from the primary database. The trade-off is the increased replication lag on the leaf-most secondary databases. . 
   >

* **Support of elastic pool databases**: Active geo-replication can be configured for any database in any elastic pool. The secondary database can be in another elastic pool. For regular databases, the secondary can be an elastic pool and vice versa as long as the service tiers are the same. 
* **Configurable performance level of the secondary database**: A secondary database can be created with lower performance level than the primary. Both primary and secondary databases are required to have the same service tier. This option is not recommended for applications with high database write activity because the increased replication lag increases the risk of substantial data loss after a failover. In addition, after failover the application’s performance is impacted until the new primary is upgraded to a higher performance level. The log IO percentage chart on Azure portal provides a good way to estimate the minimal performance level of the secondary that is required to sustain the replication load. For example, if your Primary database is P6 (1000 DTU) and its log IO percent is 50% the secondary needs to be at least P4 (500 DTU). You can also retrieve the log IO data using [sys.resource_stats](https://msdn.microsoft.com/library/dn269979.aspx) or [sys.dm_db_resource_stats](https://msdn.microsoft.com/library/dn800981.aspx) database views.  For more information on the SQL Database performance levels, see [SQL Database options and performance](sql-database-service-tiers.md). 
* **User-controlled failover and failback**: A secondary database can explicitly be switched to the primary role at any time by the application or the user. During a real outage the “unplanned” option should be used, which immediately promotes a secondary to be the primary. When the failed primary recovers and is available again, the system automatically marks the recovered primary as a secondary and bring it up-to-date with the new primary. Due to the asynchronous nature of replication, a small amount of data can be lost during unplanned failovers if a primary fails before it replicates the most recent changes to the secondary. When a primary with multiple secondaries fails over, the system automatically reconfigures the replication relationships and links the remaining secondaries to the newly promoted primary without requiring any user intervention. After the outage that caused the failover is mitigated, it may be desirable to return the application to the primary region. To do that, the failover command should be invoked with the “planned” option. 
* **Keeping credentials and firewall rules in sync**: We recommend using [database firewall rules](sql-database-firewall-configure.md) for geo-replicated databases so these rules can be replicated with the database to ensure all secondary databases have the same firewall rules as the primary. This approach eliminates the need for customers to manually configure and maintain firewall rules on servers hosting both the primary and secondary databases. Similarly, using [contained database users](sql-database-manage-logins.md) for data access ensures both primary and secondary databases always have the same user credentials so during a failover, there is no disruptions due to mismatches with logins and passwords. With the addition of [Azure Active Directory](../active-directory/active-directory-whatis.md), customers can manage user access to both primary and secondary databases and eliminating the need for managing credentials in databases altogether.

## Auto-failover group capabilities

Auto-failover groups feature provides a powerful abstraction of active geo-replication by supporting group level replication and automatic failover. In addition, it removes the necessity to change the SQL connection string after failover by providing the additional listener end-points. 

* **Failover group**: One or many failover groups can be created between two servers in different regions (primary and secondary servers). Each group can include one or several databases that are recovered as unit in case all or some primary databases become unavailable due to an outage in the primary region.  
* **Primary server**: A server that hosts the primary databases in the failover group.
* **Secondary server**: A server that hosts the secondary databases in the failover group. The secondary server cannot be in the same region as the primary server.
* **Adding databases to failover group**: You can put several databases within a server or within an elastic pool into the same failover group. If you add a standalone database to the group, it automatically creates a secondary database using the same edition and performance level. If the primary database is in an elastic pool, the secondary is automatically created in the elastic pool with the same name. If you add a database that already has a secondary database in the secondary server, that geo-replication is inherited by the group.

   > [!NOTE]
   > When adding a database that already has a secondary database in a server that is not part of the failover group, a new secondary is created in the secondary server. 
   >

* **Failover group read-write listener**: A DNS CNAME record that points to the current primary server URL. It allows the read-write SQL applications to transparently reconnect to the primary database when the primary changes after failover. 
* **Failover group read-only listener**: A DNS CNAME record that points to the secondary server’s URL. It allows the read-only SQL applications to transparently connect to the secondary database using the specified load-balancing rules. Optionally you can specify if you want the read-only traffic to be automatically re-directed to the primary server when the secondary server is not available.
* **Automatic failover policy**: By default, the failover group is configured with an automatic failover policy. The system triggers failover as soon as the failure is detected. If you want to control the failover workflow from the application, you can turn off automatic failover. 
* **Manual failover**: You can initiate failover manually at any time regardless of the automatic failover configuration. If automatic failover policy is not configured manual failover is required to recover databases in the failover group. You can initiate forced or friendly failover (with full data synchronization). The latter could be used to relocate the active server to the primary region. When failover is completed the DNS records are automatically updated to ensure connectivity to the correct server.
* **Grace period with data loss**: Because the primary and secondary databases are synchronized using asynchronous replication the failover may result in data loss. You can customize the automatic failover policy to reflect your application’s tolerance to data loss. By configuring **GracePeriodWithDataLossHours**, you can control how long the system waits before initiating the failover that is likely to result data loss. 

   > [!NOTE]
   > When system detects that the databases in the group are still online (for example, the outage only impacted the service control plane), it immediately activates the failover with full data synchronization (friendly failover) regardless of the value set by **GracePeriodWithDataLossHours**. This behavior ensures that there is no data loss during the recovery. The grace period takes effect only when a friendly failover is not possible. If the outage is mitigated before the grace period expires, the failover is not activated.
   >

* **Multiple failover groups**: You can configure multiple failover groups for the same pair of servers to control the scale of failovers. Each group fails over independently. If your multi-tenant application uses elastic pools, you can use this capability to mix primary and secondary databases in each pool. This way you can reduce the impact of an outage to only half of the tenants.

## Best practices of building highly available service

To build a highly available service that uses Azure SQL database the customers should follow these guidelines:
- **Failover group**: One or many failover groups can be created between two servers in different regions (primary and secondary servers). Each group can include one or several databases that are recovered as unit in case all or some primary databases become unavailable due to an outage in the primary region.
- **Use auto-failover groups**: It creates geo-secondary database with the same service objective as the primary. If you add an existing geo-replication relationship to the failover group make sure the geo-secondary is configured with the same service level objective as the primary.
- Use **ApplicationIntent=ReadOnly**: If you have the read-only portions of the workload that is tolerant to certain staleness of data, indicate in connection string read intent by using **ApplicationIntent=ReadOnly** and the connection is automatically directed to the secondary. 
- If an outage is detected, SQL automatically triggers read-write failover if there is zero data loss to the best of our knowledge. Otherwise, it waits for the period you specified by **GracePeriodWithDataLossHours**. 
- **Be prepared for perf degradation**: SQL failover decision is independent from the rest of the application or other services used. The application may be “mixed” with some components in one region and some in another. To avoid the degradation, ensure the redundant application deployment in the DR region and follow the guidelines in this article. Note the application in the DR region does not have to use a different connection string. 
- **Prepare for data loss**: If you specified **GracePeriodWithDataLossHours**, be prepared for data loss. In general, during outages, Azure favors availability. If you cannot afford data loss, make sure to set **GracePeriodWithDataLossHours** to a sufficiently large number, such as 24 hours. 


## Upgrading or downgrading a primary database
You can upgrade or downgrade a primary database to a different performance level (within the same service tier) without disconnecting any secondary databases. When upgrading, we recommend that you upgrade the secondary database first, and then upgrade the primary. When downgrading, reverse the order: downgrade the primary first, and then downgrade the secondary. When you upgrade or downgrade the database to a different service tier this recommendation is enforced. 

> [!NOTE]
> If you created secondary database as part of the failover group configuration it is not recommended to downgrade the secondary database. This is to ensure your data tier has sufficient capacity to process your regular workload after failover is activated. 
>

## Preventing the loss of critical data
Due to the high latency of wide area networks, continuous copy uses an asynchronous replication mechanism. Asynchronous replication makes some data loss unavoidable if a failure occurs. However, some applications may require no data loss. To protect these critical updates, an application developer can call the [sp_wait_for_database_copy_sync](https://msdn.microsoft.com/library/dn467644.aspx) system procedure immediately after committing the transaction. Calling **sp_wait_for_database_copy_sync** blocks the calling thread until the last committed transaction has been replicated to the secondary database. The procedure waits until all queued transactions have been acknowledged by the secondary database. **sp_wait_for_database_copy_sync** is scoped to a specific continuous copy link. Any user with the connection rights to the primary database can call this procedure.

> [!NOTE]
> The delay caused by a **sp_wait_for_database_copy_sync** procedure call can be significant. The delay depends on the size of the transaction log length at the moment and this call does not return until the entire log is replicated. Avoid calling this procedure unless it becomes necessary.
> 

## Programmatically managing active geo-replication
As discussed previously, auto-failover groups (in-preview) and active geo-replication can also be managed programmatically using Azure PowerShell and the REST API. The following tables describe the set of commands available.

**Azure Resource Manager API and role-based security**: Active geo-replication includes a set of Azure Resource Manager APIs for management, including the [Azure SQL Database REST API](https://docs.microsoft.com/rest/api/sql/) and [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview). These APIs require the use of resource groups and support role-based security (RBAC). For more information on how to implement access roles, see [Azure Role-Based Access Control](../active-directory/role-based-access-control-configure.md).

> [!NOTE]
> Many new features of active geo-replication are only supported using [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) based [Azure SQL REST API](https://msdn.microsoft.com/library/azure/mt163571.aspx) and [Azure SQL Database PowerShell cmdlets](https://msdn.microsoft.com/library/azure/mt574084.aspx). The [(classic) REST API](https://msdn.microsoft.com/library/azure/dn505719.aspx) and [Azure SQL Database (classic) cmdlets](https://msdn.microsoft.com/library/azure/dn546723.aspx) are supported for backward compatibility so using the Azure Resource Manager-based APIs are recommended. 
> 

### Transact-SQL
| Command | Description |
| --- | --- |
| [ALTER DATABASE (Azure SQL Database)](https://msdn.microsoft.com/library/mt574871.aspx) |Use ADD SECONDARY ON SERVER argument to create a secondary database for an existing database and starts data replication |
| [ALTER DATABASE (Azure SQL Database)](https://msdn.microsoft.com/library/mt574871.aspx) |Use FAILOVER or FORCE_FAILOVER_ALLOW_DATA_LOSS to switch a secondary database to be primary to initiate failover |
| [ALTER DATABASE (Azure SQL Database)](https://msdn.microsoft.com/library/mt574871.aspx) |Use REMOVE SECONDARY ON SERVER to terminate a data replication between a SQL Database and the specified secondary database. |
| [sys.geo_replication_links (Azure SQL Database)](https://msdn.microsoft.com/library/mt575501.aspx) |Returns information about all existing replication links for each database on the Azure SQL Database logical server. |
| [sys.dm_geo_replication_link_status (Azure SQL Database)](https://msdn.microsoft.com/library/mt575504.aspx) |Gets the last replication time, last replication lag, and other information about the replication link for a given SQL database. |
| [sys.dm_operation_status (Azure SQL Database)](https://msdn.microsoft.com/library/dn270022.aspx) |Shows the status for all database operations including the status of the replication links. |
| [sp_wait_for_database_copy_sync (Azure SQL Database)](https://msdn.microsoft.com/library/dn467644.aspx) |causes the application to wait until all committed transactions are replicated and acknowledged by the active secondary database. |
|  | |

### PowerShell
| Cmdlet | Description |
| --- | --- |
| [Get-AzureRmSqlDatabase](https://docs.microsoft.com/powershell/module/azurerm.sql/get-azurermsqldatabase) |Gets one or more databases. |
| [New-AzureRmSqlDatabaseSecondary](https://docs.microsoft.com/powershell/module/azurerm.sql/new-azurermsqldatabasesecondary) |Creates a secondary database for an existing database and starts data replication. |
| [Set-AzureRmSqlDatabaseSecondary](https://docs.microsoft.com/powershell/module/azurerm.sql/set-azurermsqldatabasesecondary) |Switches a secondary database to be primary to initiate failover. |
| [Remove-AzureRmSqlDatabaseSecondary](https://docs.microsoft.com/powershell/module/azurerm.sql/remove-azurermsqldatabasesecondary) |Terminates data replication between a SQL Database and the specified secondary database. |
| [Get-AzureRmSqlDatabaseReplicationLink](https://docs.microsoft.com/powershell/module/azurerm.sql/get-azurermsqldatabasereplicationlink) |Gets the geo-replication links between an Azure SQL Database and a resource group or SQL Server. |
| [New-AzureRmSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/azurerm.sql/set-azurermsqldatabasefailovergroup) |	This command creates a failover group and registers it on both primary and secondary servers|
| [Remove-AzureRmSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/azurerm.sql/remove-azurermsqldatabasefailovergroup) | Removes the failover group from the server and deletes all secondary databases included the group |
| [Get-AzureRmSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/azurerm.sql/get-azurermsqldatabasefailovergroup) | Retrieves the failover group configuration |
| [Set-AzureRmSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/azurerm.sql/set-azurermsqldatabasefailovergroup) |	Modifies the configuration of the failover group |
| [Switch-AzureRMSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/azurerm.sql/switch-azurermsqldatabasefailovergroup) | Triggers failover of the failover group to the secondary server |
|  | |

> [!IMPORTANT]
> For sample scripts, see [Configure and failover a single database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-database-powershell.md), [Configure and failover a pooled database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-pool-powershell.md), and  [Configure and failover a failover group for a single database (preview)](scripts/sql-database-setup-geodr-failover-database-failover-group-powershell.md.
>

### REST API
| API | Description |
| --- | --- |
| [Create or Update Database (createMode=Restore)](https://docs.microsoft.com/rest/api/sql/databases#Databases_CreateOrUpdate) |Creates, updates, or restores a primary or a secondary database. |
| [Get Create or Update Database Status](https://docs.microsoft.com/rest/api/sql/databases#Databases) |Returns the status during a create operation. |
| [Set Secondary Database as Primary (Planned Failover)](https://docs.microsoft.com/rest/api/sql/databases%20-%20replicationlinks#Databases_FailoverReplicationLink) |Sets which replica database is primary by failing over from the current primary replica database. |
| [Set Secondary Database as Primary (Unplanned Failover)](https://docs.microsoft.com/rest/api/sql/databases%20-%20replicationlinks#Databases_FailoverReplicationLinkAllowDataLoss) |Sets which replica database is primary by failing over from the current primary replica database. This operation might result in data loss. |
| [Get Replication Link](https://docs.microsoft.com/rest/api/sql/databases%20-%20replicationlinks#Databases_GetReplicationLink) |Gets a specific replication link for a given SQL database in a geo-replication partnership. It retrieves the information visible in the sys.geo_replication_links catalog view. |
| [List Replication Links](https://docs.microsoft.com/rest/api/sql/databasereplicationlinks#Databases_GetReplicationLink) | Gets all replication links for a given SQL database in a geo-replication partnership. It retrieves the information visible in the sys.geo_replication_links catalog view. |
| [Delete Replication Link](https://docs.microsoft.com/rest/api/sql/databases%20-%20replicationlinks#Databases_DeleteReplicationLink) | Deletes a database replication link. Cannot be done during failover. |
| [Create or Update Failover Group](https://docs.microsoft.com/rest/api/sql/failovergroups#FailoverGroups_CreateOrUpdate) | Creates or updates a failover group |
| [Delete Failover Group](https://docs.microsoft.com/rest/api/sql/failovergroups#FailoverGroups_Delete) | Removes the failover group from the server |
| [Failover (Planned)](https://docs.microsoft.com/rest/api/sql/failovergroups#FailoverGroups_Failover) | Fails over from the current primary server to this server. |
| [Force Failover Allow Data Loss](https://docs.microsoft.com/rest/api/sql/failovergroups#FailoverGroups_ForceFailoverAllowDataLoss) |ails over from the current primary server to this server. This operation might result in data loss. |
| [Get Failover Group](https://docs.microsoft.com/rest/api/sql/failovergroups#FailoverGroups_Get) | Gets a failover group. |
| [List Failover Groups By Server](https://docs.microsoft.com/rest/api/sql/failovergroups#FailoverGroups_ListByServer) | Lists the failover groups in a server. |
| [Update Failover Group](https://docs.microsoft.com/rest/api/sql/failovergroups#FailoverGroups_Update) | Updates a failover group. |
|  | |

## Next steps
* For sample scripts, see:
   - [Configure and failover a single database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-database-powershell.md)
   - [Configure and failover a pooled database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-pool-powershell.md)
   - [Configure and failover a failover group for a single database (preview)](scripts/sql-database-setup-geodr-failover-database-failover-group-powershell.md)
* For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md)
* To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md).
* To learn about using automated backups for recovery, see [Restore a database from the service-initiated backups](sql-database-recovery-using-backups.md).
* To learn about authentication requirements for a new primary server and database, see [SQL Database security after disaster recovery](sql-database-geo-replication-security-config.md).

