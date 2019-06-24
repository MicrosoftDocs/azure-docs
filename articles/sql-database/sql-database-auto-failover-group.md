---
title: Failover groups - Azure SQL Database | Microsoft Docs
description: Auto-failover groups is a SQL Database feature that allows you to manage replication and automatic / coordinated failover of a group of databases on a SQL Database server or all databases in managed instance.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: mathoma, carlrab
manager: craigg
ms.date: 05/18/2019
---

# Use auto-failover groups to enable transparent and coordinated failover of multiple databases

Auto-failover groups is a SQL Database feature that allows you to manage replication and failover of a group of databases on a SQL Database server or all databases in a managed instance to another region. It uses the same underlying technology as [active geo-replication](sql-database-active-geo-replication.md). You can initiate failover manually or you can delegate it to the SQL Database service based on a user-defined policy. The latter option allows you to automatically recover multiple related databases in a secondary region after a catastrophic failure or other unplanned event that results in full or partial loss of the SQL Database service’s availability in the primary region. Additionally, you can use the readable secondary databases to offload read-only query workloads. Because auto-failover groups involve multiple databases, these databases must be configured on the primary server. Both primary and secondary servers for the databases in the failover group must be in the same subscription. Auto-failover groups support replication of all databases in the group to only one secondary server in a different region.

> [!NOTE]
> When working with single or pooled databases on a SQL Database server and you want multiple secondaries in the same or different regions, use [active geo-replication](sql-database-active-geo-replication.md).

When you are using auto-failover groups with automatic failover policy, any outage that impacts one or several of the databases in the group results in automatic failover. In addition, auto-failover groups provide read-write and read-only listener end-points that remain unchanged during failovers. Whether you use manual or automatic failover activation, failover switches all secondary databases in the group to primary. After the database failover is completed, the DNS record is automatically updated to redirect the endpoints to the new region. For the specific RPO and RTO data, see [Overview of Business Continuity](sql-database-business-continuity.md).

When you are using auto-failover groups with automatic failover policy, any outage that impacts databases in the SQL Database server or managed instance results in automatic failover. You can manage auto-failover group using:

- The [Azure portal](sql-database-implement-geo-distributed-database.md)
- [PowerShell: Failover Group](scripts/sql-database-setup-geodr-failover-database-failover-group-powershell.md)
- [REST API: Failover group](https://docs.microsoft.com/rest/api/sql/failovergroups).

After failover, ensure the authentication requirements for your server and database are configured on the new primary. For details, see [SQL Database security after disaster recovery](sql-database-geo-replication-security-config.md).

To achieve real business continuity, adding database redundancy between datacenters is only part of the solution. Recovering an application (service) end-to-end after a catastrophic failure requires recovery of all components that constitute the service and any dependent services. Examples of these components include the client software (for example, a browser with a custom JavaScript), web front ends, storage, and DNS. It is critical that all components are resilient to the same failures and become available within the recovery time objective (RTO) of your application. Therefore, you need to identify all dependent services and understand the guarantees and capabilities they provide. Then, you must take adequate steps to ensure that your service functions during the failover of the services on which it depends. For more information about designing solutions for disaster recovery, see [Designing Cloud Solutions for Disaster Recovery Using active geo-replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md).

## Auto-failover group terminology and capabilities

- **Failover group (FOG)**

  A failover group is a named group of databases managed by a single SQL Database server or within a single managed instance that can fail over as a unit to another region in case all or some primary databases become unavailable due to an outage in the primary region. When created for managed instances, a failover group contains all user databases in the instance and therefore only one failover group can be configured on an instance.
  
  > [!IMPORTANT]
  > The name of the failover group must be globally unique within the `.database.windows.net` domain.

- **SQL Database servers**

     With SQL Database servers, some or all of the user databases on a single SQL Database server can be placed in a failover group. Also, a SQL Database server supports multiple failover groups on a single SQL Database server.

- **Primary**

  The SQL Database server or managed instance that hosts the primary databases in the failover group.

- **Secondary**

  The SQL Database server or managed instance that hosts the secondary databases in the failover group. The secondary cannot be in the same region as the primary.

- **Adding single databases to failover group**

  You can put several single databases on the same SQL Database server into the same failover group. If you add a single database to the failover group, it automatically creates a secondary database using the same edition and compute size on secondary server.  You specified that server when the failover group was created. If you add a database that already has a secondary database in the secondary server, that geo-replication link is inherited by the group. When you add a database that already has a secondary database in a server that is not part of the failover group, a new secondary is created in the secondary server.
  
  > [!IMPORTANT]
  > In a managed instance, all user databases are replicated. You cannot pick a subset of user databases for replication in the failover group.

- **Adding databases in elastic pool to failover group**

  You can put all or several databases within an elastic pool into the same failover group. If the primary database is in an elastic pool, the secondary is automatically created in the elastic pool with the same name (secondary pool). You must ensure that the secondary server contains an elastic pool with the same exact name and enough free capacity to host the secondary databases that will be created by the failover group. If you add a database in the pool that already has a secondary database in the secondary pool, that geo-replication link is inherited by the group. When you add a database that already has a secondary database in a server that is not part of the failover group, a new secondary is created in the secondary pool.
  
- **DNS zone**

  A unique ID that is automatically generated when a new instance is created. A multi-domain (SAN) certificate for this instance is provisioned to authenticate the client connections to any instance in the same DNS zone. The two managed instances in the same failover group must share the DNS zone. 
  
  > [!NOTE]
  > A DNS zone ID is not required for failover groups created for SQL Database servers.

- **Failover group read-write listener**

  A DNS CNAME record formed that points to the current primary's URL. It allows the read-write SQL applications to transparently reconnect to the primary database when the primary changes after failover. When the failover group is created on a SQL Database server, the DNS CNAME record for the listener URL is formed as `<fog-name>.database.windows.net`. When the failover group is created on a managed instance, the DNS CNAME record for the listener URL is formed as `<fog-name>.zone_id.database.windows.net`.

- **Failover group read-only listener**

  A DNS CNAME record formed that points to the read-only listener that points to the secondary's URL. It allows the read-only SQL applications to transparently connect to the secondary using the specified load-balancing rules. When the failover group is created on a SQL Database server, the DNS CNAME record for the listener URL is formed as `<fog-name>.secondary.database.windows.net`. When the failover group is created on a managed instance, the DNS CNAME record for the listener URL is formed as `<fog-name>.zone_id.secondary.database.windows.net`.

- **Automatic failover policy**

  By default, a failover group is configured with an automatic failover policy. The SQL Database service triggers failover after the failure is detected and the grace period has expired. The system must verify that the outage cannot be mitigated by the built-in [high availability infrastructure of the SQL Database service](sql-database-high-availability.md) due to the scale of the impact. If you want to control the failover workflow from the application, you can turn off automatic failover.

- **Read-only failover policy**

  By default, the failover of the read-only listener is disabled. It ensures that the performance of the primary is not impacted when the secondary is offline. However, it also means the read-only sessions will not be able to connect until the secondary is recovered. If you cannot tolerate downtime for the read-only sessions and are OK to temporarily use the primary for both read-only and read-write traffic at the expense of the potential performance degradation of the primary, you can enable failover for the read-only listener. In that case, the read-only traffic will be automatically redirected to the primary if the secondary is not available.

- **Planned failover**

   Planned failover performs full synchronization between primary and secondary databases before the secondary switches to the primary role. This guarantees no data loss. Planned failover is used in the following scenarios:

  - Perform disaster recovery (DR) drills in production when the data loss is not acceptable
  - Relocate the databases to a different region
  - Return the databases to the primary region after the outage has been mitigated (failback).

- **Unplanned failover**

   Unplanned or forced failover immediately switches the secondary to the primary role without any synchronization with the primary. This operation will result in data loss. Unplanned failover is used as a recovery method during outages when the primary is not accessible. When the original primary is back online, it will automatically reconnect without synchronization and become a new secondary.

- **Manual failover**

  You can initiate failover manually at any time regardless of the automatic failover configuration. If automatic failover policy is not configured, manual failover is required to recover databases in the failover group to the secondary. You can initiate forced or friendly failover (with full data synchronization). The latter could be used to relocate the primary to the secondary region. When failover is completed, the DNS records are automatically updated to ensure connectivity to the new primary

- **Grace period with data loss**

  Because the primary and secondary databases are synchronized using asynchronous replication, the failover may result in data loss. You can customize the automatic failover policy to reflect your application’s tolerance to data loss. By configuring **GracePeriodWithDataLossHours**, you can control how long the system waits before initiating the failover that is likely to result data loss.

- **Multiple failover groups**

  You can configure multiple failover groups for the same pair of servers to control the scale of failovers. Each group fails over independently. If your multi-tenant application uses elastic pools, you can use this capability to mix primary and secondary databases in each pool. This way you can reduce the impact of an outage to only half of the tenants.

  > [!NOTE]
  > Managed Instance does not support multiple failover groups.
  
## Permissions
Permissions for a failover group are managed via [role-based access control (RBAC)](../role-based-access-control/overview.md). The [SQL Server Contributor](../role-based-access-control/built-in-roles.md#sql-server-contributor) role has all the necessary permissions to manage failover groups. 

### Create failover group
To create a failover group, you need RBAC write access to both the primary and secondary servers, and to all databases in the failover group. For a managed instance, you need RBAC write access to both the primary and secondary managed instance, but permissions on individual databases are not relevant since individual managed instance databases cannot be added to or removed from a failover group. 

### Update a failover group
To update a failover group, you need RBAC write access to the failover group, and all databases on the current primary server or managed instance.  

### Failover a failover group
To fail over a failover group, you need RBAC write access to the failover group on the new primary server or managed instance. 

## Best practices of using failover groups with single databases and elastic pools

The auto-failover group must be configured on the primary SQL Database server and will connect it to the secondary SQL Database server in a different Azure region.  The groups can include all or some databases in these servers. The following diagram illustrates a typical configuration of a geo-redundant cloud application using multiple databases and auto-failover group.

![auto failover](./media/sql-database-auto-failover-group/auto-failover-group.png)

When designing a service with business continuity in mind, follow these general guidelines:

- **Use one or several failover groups to manage failover of multiple databases**

  One or many failover groups can be created between two servers in different regions (primary and secondary servers). Each group can include one or several databases that are recovered as a unit in case all or some primary databases become unavailable due to an outage in the primary region. The failover group creates geo-secondary database with the same service objective as the primary. If you add an existing geo-replication relationship to the failover group, make sure the geo-secondary is configured with the same service tier and compute size as the primary.

- **Use read-write listener for OLTP workload**

  When performing OLTP operations, use `<fog-name>.database.windows.net` as the server URL and the connections are automatically directed to the primary. This URL does not change after the failover. Note the failover involves updating the DNS record so the client connections are redirected to the new primary only after the client DNS cache is refreshed.

- **Use read-only listener for read-only workload**

  If you have a logically isolated read-only workload that is tolerant to certain staleness of data, you can use the secondary database in the application. For read-only sessions, use `<fog-name>.secondary.database.windows.net` as the server URL and the connection is automatically directed to the secondary. It is also recommended that you indicate in connection string read intent by using **ApplicationIntent=ReadOnly**.

- **Be prepared for perf degradation**

  SQL failover decision is independent from the rest of the application or other services used. The application may be “mixed” with some components in one region and some in another. To avoid the degradation, ensure the redundant application deployment in the DR region and follow these [network security guidelines](#failover-groups-and-network-security).

  > [!NOTE]
  > The application in the DR region does not have to use a different connection string.  

- **Prepare for data loss**

  If an outage is detected, SQL waits for the period you specified by **GracePeriodWithDataLossHours**. The default value is 1 hour. If you cannot afford data loss, make sure to set **GracePeriodWithDataLossHours** to a sufficiently large number, such as 24 hours. Use manual group failover to fail back from the secondary to the primary.

  > [!IMPORTANT]
  > Elastic pools with 800 or fewer DTUs and more than 250 databases using geo-replication may encounter issues including longer planned failovers and degraded performance.  These issues are more likely to occur for write intensive workloads, when geo-replication endpoints are widely separated by geography, or when multiple secondary endpoints are used for each database.  Symptoms of these issues are indicated when the geo-replication lag increases over time.  This lag can be monitored using [sys.dm_geo_replication_link_status](/sql/relational-databases/system-dynamic-management-views/sys-dm-geo-replication-link-status-azure-sql-database).  If these issues occur, then mitigations include increasing the number of pool DTUs, or reducing the number of geo-replicated databases in the same pool.

## Best practices of using failover groups with managed instances

The auto-failover group must be configured on the primary instance and will connect it to the secondary instance in a different Azure region.  All databases in the instance will be replicated to the secondary instance. The following diagram illustrates a typical configuration of a geo-redundant cloud application using managed instance and auto-failover group.

![auto failover](./media/sql-database-auto-failover-group/auto-failover-group-mi.png)

> [!IMPORTANT]
> Auto-failover groups for Managed Instance is in public preview.

If your application uses managed instance as the data tier, follow these general guidelines when designing for business continuity:

- **Create the secondary instance in the same DNS zone as the primary instance**

  To ensure non-interrupted connectivity to the primary instance after failover both the primary and secondary instances must be in the same DNS zone. It will guarantee that the same multi-domain (SAN) certificate can be used to authenticate the client connections to either of the two instances in the failover group. When your application is ready for production deployment, create a secondary instance in a different region and make sure it shares the DNS zone with the primary instance. You can do it by specifying a `DNS Zone Partner` optional parameter using the Azure portal, PowerShell, or the REST API. 

  For more information about creating the secondary instance in the same DNS zone as the primary instance, see [Managing failover groups with managed instances (preview)](#powershell-managing-failover-groups-with-managed-instances-preview).

- **Enable replication traffic between two instances**

  Because each instance is isolated in its own VNet, two-directional traffic between these VNets must be allowed. See [Azure VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md)

- **Configure a failover group to manage failover of entire instance**

  The failover group will manage the failover of all the databases in the instance. When a group is created, each database in the instance will be automatically geo-replicated to the secondary instance. You cannot use failover groups to initiate a partial failover of a subset of the databases.

  > [!IMPORTANT]
  > If a database is removed from the primary instance, it will also be dropped automatically on the geo secondary instance.

- **Use read-write listener for OLTP workload**

  When performing OLTP operations, use `<fog-name>.zone_id.database.windows.net` as the server URL and the connections are automatically directed to the primary. This URL does not change after the failover. The failover involves updating the DNS record, so the client connections are redirected to the new primary only after the client DNS cache is refreshed. Because the secondary instance shares the DNS zone with the primary, the client application will be able to reconnect to it using the same SAN certificate.

- **Connect directly to geo-replicated secondary for read-only queries**

  If you have a logically isolated read-only workload that is tolerant to certain staleness of data, you can use the secondary database in the application. To connect directly to the geo-replicated secondary, use `server.secondary.zone_id.database.windows.net` as the server URL and the connection is made directly to the geo-replicated secondary.

  > [!NOTE]
  > In certain service tiers, Azure SQL Database supports the use of [read-only replicas](sql-database-read-scale-out.md) to load balance read-only query workloads using the capacity of one read-only replica and using the `ApplicationIntent=ReadOnly` parameter in the connection string. When you have configured a geo-replicated secondary, you can use this capability to connect to either a read-only replica in the primary location or in the geo-replicated location.
  > - To connect to a read-only replica in the primary location, use `<fog-name>.zone_id.database.windows.net`.
  > - To connect to a read-only replica in the secondary location, use `<fog-name>.secondary.zone_id.database.windows.net`.

- **Be prepared for perf degradation**

  SQL failover decision is independent from the rest of the application or other services used. The application may be “mixed” with some components in one region and some in another. To avoid the degradation, ensure the redundant application deployment in the DR region and follow these [network security guidelines](#failover-groups-and-network-security).

- **Prepare for data loss**

  If an outage is detected, SQL automatically triggers read-write failover if there is zero data loss to the best of our knowledge. Otherwise, it waits for the period you specified by `GracePeriodWithDataLossHours`. If you specified `GracePeriodWithDataLossHours`, be prepared for data loss. In general, during outages, Azure favors availability. If you cannot afford data loss, make sure to set GracePeriodWithDataLossHours to a sufficiently large number, such as 24 hours.

  The DNS update of the read-write listener will happen immediately after the failover is initiated. This operation will not result in data loss. However, the process of switching database roles can take up to 5 minutes under normal conditions. Until it is completed, some databases in the new primary instance will still be read-only. If failover is initiated using PowerShell, the entire operation is synchronous. If it is initiated using the Azure portal, the UI will indicate completion status. If it is initiated using the REST API, use standard Azure Resource Manager’s polling mechanism to monitor for completion.

  > [!IMPORTANT]
  > Use manual group failover to move primaries back to the original location. When the outage that caused the failover is mitigated, you can move your primary databases to the original location. To do that you should initiate the manual failover of the group.

## Failover groups and network security

For some applications the security rules require that the network access to the data tier is restricted to a specific component or components such as a VM, web service etc. This requirement presents some challenges for business continuity design and the use of the failover groups. Consider the following options when implementing such restricted access.

### Using failover groups and virtual network rules

If you are using [Virtual Network service endpoints and rules](sql-database-vnet-service-endpoint-rule-overview.md) to restrict access to your SQL database, be aware that Each Virtual Network service endpoint applies to only one Azure region. The endpoint does not enable other regions to accept communication from the subnet. Therefore, only the client applications deployed in the same region can connect to the primary database. Since the failover results in the SQL client sessions being rerouted to a server in a different (secondary) region, these sessions will fail if originated from a client outside of that region. For that reason, the automatic failover policy cannot be enabled if the participating servers are included in the Virtual Network rules. To support manual failover, follow these steps:

1. Provision the redundant copies of the front-end components of your application (web service, virtual machines etc.) in the secondary region
2. Configure the [virtual network rules](sql-database-vnet-service-endpoint-rule-overview.md) individually for primary and secondary server
3. Enable the [front-end failover using a Traffic manager configuration](sql-database-designing-cloud-solutions-for-disaster-recovery.md#scenario-1-using-two-azure-regions-for-business-continuity-with-minimal-downtime)
4. Initiate manual failover when the outage is detected. This option is optimized for the applications that require consistent latency between the front-end and the data tier and supports recovery when either front end, data tier or both are impacted by the outage.

> [!NOTE]
> If you are using the **read-only listener** to load-balance a read-only workload, make sure that this workload is executed in a VM or other resource in the secondary region so it can connect to the secondary database.

### Using failover groups and SQL database firewall rules

If your business continuity plan requires failover using groups with automatic failover, you can restrict access to your SQL database using the traditional firewall rules.  To support automatic failover, follow these steps:

1. [Create a public IP](../virtual-network/virtual-network-public-ip-address.md#create-a-public-ip-address)
2. [Create a public load balancer](../load-balancer/quickstart-create-basic-load-balancer-portal.md#create-a-basic-load-balancer) and assign the public IP to it.
3. [Create a virtual network and the virtual machines](../load-balancer/quickstart-create-basic-load-balancer-portal.md#create-back-end-servers) for your front-end components
4. [Create network security group](../virtual-network/security-overview.md) and configure inbound connections.
5. Ensure that the outbound connections are open to Azure SQL database by using ‘Sql’ [service tag](../virtual-network/security-overview.md#service-tags).
6. Create a [SQL database firewall rule](sql-database-firewall-configure.md) to allow inbound traffic from the public IP address you create in step 1.

For more information about on how to configure outbound access and what IP to use in the firewall rules, see [Load balancer outbound connections](../load-balancer/load-balancer-outbound-connections.md).

The above configuration will ensure that the automatic failover will not block connections from the front-end components and assumes that the application can tolerate the longer latency between the front end and the data tier.

> [!IMPORTANT]
> To guarantee business continuity for regional outages you must ensure geographic redundancy for both front-end components and the databases.

## Enabling geo-replication between managed instances and their VNets

When you set up a failover group between primary and secondary managed instances in two different regions, each instance is isolated using an independent VNet. To allow replication traffic between these VNets ensure these prerequisites are met:

1. The two managed instances need to be in different Azure regions.
2. Your secondary must be empty (no user databases).
3. The primary and secondary managed instances need to be in the same Resource Group.
4. The VNets that the managed instances are part of need to be connected through a [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md). Global VNet Peering is not supported.
5. The two managed instance VNets cannot have overlapping IP addresses.
6. You need to set up your Network Security Groups (NSG) such that ports 5022 and the range 11000~12000 are open inbound and outbound for connections from the other managed instanced subnet. This is to allow replication traffic between the instances

   > [!IMPORTANT]
   > Misconfigured NSG security rules leads to stuck database copy operations.

7. The secondary instance is configured with the correct DNS zone ID. DNS zone is a property of a managed instance and its ID is included in the host name address. The zone ID is generated as a random string when the first managed instance is created in each VNet and the same ID is assigned to all other instances in the same subnet. Once assigned, the DNS zone cannot be modified. Managed instances included in the same failover group must share the DNS zone. You accomplish this by passing the primary instance's zone ID as the value of DnsZonePartner parameter when creating the secondary instance. 

## Upgrading or downgrading a primary database

You can upgrade or downgrade a primary database to a different compute size (within the same service tier, not between General Purpose and Business Critical) without disconnecting any secondary databases. When upgrading, we recommend that you upgrade all of the secondary databases first, and then upgrade the primary. When downgrading, reverse the order: downgrade the primary first, and then downgrade all of the secondary databases. When you upgrade or downgrade the database to a different service tier, this recommendation is enforced.

This sequence is recommended specifically to avoid the problem where the secondary at a lower SKU gets overloaded and must be reseeded during an upgrade or downgrade process. You could also avoid the problem by making the primary read-only, at the expense of impacting all read-write workloads against the primary. 

> [!NOTE]
> If you created secondary database as part of the failover group configuration it is not recommended to downgrade the secondary database. This is to ensure your data tier has sufficient capacity to process your regular workload after failover is activated.

## Preventing the loss of critical data

Due to the high latency of wide area networks, continuous copy uses an asynchronous replication mechanism. Asynchronous replication makes some data loss unavoidable if a failure occurs. However, some applications may require no data loss. To protect these critical updates, an application developer can call the [sp_wait_for_database_copy_sync](/sql/relational-databases/system-stored-procedures/active-geo-replication-sp-wait-for-database-copy-sync) system procedure immediately after committing the transaction. Calling **sp_wait_for_database_copy_sync** blocks the calling thread until the last committed transaction has been transmitted to the secondary database. However, it does not wait for the transmitted transactions to be replayed and committed on the secondary. **sp_wait_for_database_copy_sync** is scoped to a specific continuous copy link. Any user with the connection rights to the primary database can call this procedure.

> [!NOTE]
> **sp_wait_for_database_copy_sync** prevents data loss after failover, but does not guarantee full synchronization for read access. The delay caused by a **sp_wait_for_database_copy_sync** procedure call can be significant and depends on the size of the transaction log at the time of the call.

## Failover groups and point-in-time restore

For information about using point-in-time restore with failover groups, see [Point in Time Recovery (PITR)](sql-database-recovery-using-backups.md#point-in-time-restore).

## Programmatically managing failover groups

As discussed previously, auto-failover groups and active geo-replication can also be managed programmatically using Azure PowerShell and the REST API. The following tables describe the set of commands available. Active geo-replication includes a set of Azure Resource Manager APIs for management, including the [Azure SQL Database REST API](https://docs.microsoft.com/rest/api/sql/) and [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview). These APIs require the use of resource groups and support role-based security (RBAC). For more information on how to implement access roles, see [Azure Role-Based Access Control](../role-based-access-control/overview.md).

### PowerShell: Manage SQL database failover with single databases and elastic pools

| Cmdlet | Description |
| --- | --- |
| [New-AzSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/az.sql/set-azsqldatabasefailovergroup) |This command creates a failover group and registers it on both primary and secondary servers|
| [Remove-AzSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/az.sql/remove-azsqldatabasefailovergroup) | Removes the failover group from the server and deletes all secondary databases included the group |
| [Get-AzSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/az.sql/get-azsqldatabasefailovergroup) | Retrieves the failover group configuration |
| [Set-AzSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/az.sql/set-azsqldatabasefailovergroup) |Modifies the configuration of the failover group |
| [Switch-AzSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/az.sql/switch-azsqldatabasefailovergroup) | Triggers failover of the failover group to the secondary server |
| [Add-AzSqlDatabaseToFailoverGroup](https://docs.microsoft.com/powershell/module/az.sql/add-azsqldatabasetofailovergroup)|Adds one or more databases to an Azure SQL Database failover group|
|  | |

> [!IMPORTANT]
> For a sample script, see [Configure and failover a failover group for a single database](scripts/sql-database-setup-geodr-failover-database-failover-group-powershell.md).
>

### PowerShell: Managing failover groups with Managed Instances (preview)

#### Install the newest pre-release version of PowerShell

1. Update the PowerShellGet module to 1.6.5 (or newest preview version). See [PowerShell preview site](https://www.powershellgallery.com/packages/AzureRM.Sql/4.11.6-preview).

   ```powershell
      install-module PowerShellGet -MinimumVersion 1.6.5 -force
   ```

2. In a new PowerShell window, execute the following commands:

   ```powershell
      import-module PowerShellGet
      get-module PowerShellGet #verify version is 1.6.5 (or newer)
      install-module azurerm.sql -RequiredVersion 4.5.0-preview -AllowPrerelease –Force
      import-module azurerm.sql
   ```

#### PowerShell commandlets to create an instance failover group

| API | Description |
| --- | --- |
| New-AzureRmSqlDatabaseInstanceFailoverGroup |This command creates a failover group and registers it on both primary and secondary servers|
| Set-AzureRmSqlDatabaseInstanceFailoverGroup |Modifies the configuration of the failover group|
| Get-AzureRmSqlDatabaseInstanceFailoverGroup |Retrieves the failover group configuration|
| Switch-AzureRmSqlDatabaseInstanceFailoverGroup |Triggers failover of the failover group to the secondary server|
| Remove-AzureRmSqlDatabaseInstanceFailoverGroup | Removes a failover group|

### REST API: Manage SQL database failover groups with single and pooled databases

| API | Description |
| --- | --- |
| [Create or Update Failover Group](https://docs.microsoft.com/rest/api/sql/failovergroups/createorupdate) | Creates or updates a failover group |
| [Delete Failover Group](https://docs.microsoft.com/rest/api/sql/failovergroups/delete) | Removes the failover group from the server |
| [Failover (Planned)](https://docs.microsoft.com/rest/api/sql/failovergroups/failover) | Fails over from the current primary server to this server. |
| [Force Failover Allow Data Loss](https://docs.microsoft.com/rest/api/sql/failovergroups/forcefailoverallowdataloss) |ails over from the current primary server to this server. This operation might result in data loss. |
| [Get Failover Group](https://docs.microsoft.com/rest/api/sql/failovergroups/get) | Gets a failover group. |
| [List Failover Groups By Server](https://docs.microsoft.com/rest/api/sql/failovergroups/listbyserver) | Lists the failover groups in a server. |
| [Update Failover Group](https://docs.microsoft.com/rest/api/sql/failovergroups/update) | Updates a failover group. |
|  | |

### REST API: Manage failover groups with Managed Instances (preview)

| API | Description |
| --- | --- |
| [Create or Update Failover Group](https://docs.microsoft.com/rest/api/sql/instancefailovergroups/createorupdate) | Creates or updates a failover group |
| [Delete Failover Group](https://docs.microsoft.com/rest/api/sql/instancefailovergroups/delete) | Removes the failover group from the server |
| [Failover (Planned)](https://docs.microsoft.com/rest/api/sql/instancefailovergroups/failover) | Fails over from the current primary server to this server. |
| [Force Failover Allow Data Loss](https://docs.microsoft.com/rest/api/sql/instancefailovergroups/forcefailoverallowdataloss) |ails over from the current primary server to this server. This operation might result in data loss. |
| [Get Failover Group](https://docs.microsoft.com/rest/api/sql/instancefailovergroups/get) | Gets a failover group. |
| [List Failover Groups - List By Location](https://docs.microsoft.com/rest/api/sql/instancefailovergroups/listbylocation) | Lists the failover groups in a location. |

## Next steps

- For sample scripts, see:
  - [Configure and failover a single database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-database-powershell.md)
  - [Configure and failover a pooled database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-pool-powershell.md)
  - [Configure and failover a failover group for a single database](scripts/sql-database-setup-geodr-failover-database-failover-group-powershell.md)
- For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md)
- To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md).
- To learn about using automated backups for recovery, see [Restore a database from the service-initiated backups](sql-database-recovery-using-backups.md).
- To learn about authentication requirements for a new primary server and database, see [SQL Database security after disaster recovery](sql-database-geo-replication-security-config.md).
