---
title: Failover groups - Azure SQL Database | Microsoft Docs
description: Use auto-failover groups with active geo-replication and enable automatic failover in the event of an outage.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: carlrab
manager: craigg
ms.date: 12/04/2018
---
# Use auto-failover groups to enable automatic failover to database groups

Auto-failover groups is a SQL Database feature that allows you to manage replication and failover of a group of databases on a logical server or all databases in managed instance. It uses the same underlying technology as [active geo-replication](sql-database-active-geo-replication.md). You can initiate failover manually or you can delegate it to the SQL Database service based on a user-defined policy using a user-defined policy. The latter option allows you to automatically recover multiple related databases in a secondary region after a catastrophic failure or other unplanned event that results in full or partial loss of the SQL Database service’s availability in the primary region. Additionally, you can use the readable secondary databases to offload read-only query workloads. Because auto-failover groups involve multiple databases, these databases must be configured on the primary server. Both primary and secondary servers for the databases in the failover group must be in the same subscription. Auto-failover groups support replication of all databases in the group to only one secondary server in a different region.

> [!NOTE]
> If multiple secondaries are required, use [active geo-replication](sql-database-active-geo-replication.md).
> [!IMPORTANT]
> Support for auto-failover for Managed Instances is in public preview. With Managed Instances, all user databases are part of the failover group. You cannot add a subset of the user databases in a Managed Instance when creating a failover group.

When you are using auto-failover groups with automatic failover policy, any outage that impacts one or several of the databases in the group results in automatic failover. In addition, auto-failover groups provide read-write and read-only listener end-points that remain unchanged during failovers. Whether you use manual or automatic failover activation, failover switches all secondary databases in the group to primary. After the database failover is completed, the DNS record is automatically updated to redirect the endpoints to the new region. For the specific RPO and RTO data, see [Overview of Business Continuity](sql-database-business-continuity.md).

You can manage replication and failover of an individual database or a set of databases on a server or in an elastic pool using active geo-replication. You can do that using:

- The [Azure portal](sql-database-implement-geo-distributed-database.md)
- [PowerShell: Failover Group](scripts/sql-database-setup-geodr-failover-database-failover-group-powershell.md)
- [REST API: Failover group](https://docs.microsoft.com/rest/api/sql/failovergroups).

After failover, ensure the authentication requirements for your server and database are configured on the new primary. For details, see [SQL Database security after disaster recovery](sql-database-geo-replication-security-config.md).

To achieve real business continuity, adding database redundancy between datacenters is only part of the solution. Recovering an application (service) end-to-end after a catastrophic failure requires recovery of all components that constitute the service and any dependent services. Examples of these components include the client software (for example, a browser with a custom JavaScript), web front ends, storage, and DNS. It is critical that all components are resilient to the same failures and become available within the recovery time objective (RTO) of your application. Therefore, you need to identify all dependent services and understand the guarantees and capabilities they provide. Then, you must take adequate steps to ensure that your service functions during the failover of the services on which it depends. For more information about designing solutions for disaster recovery, see [Designing Cloud Solutions for Disaster Recovery Using active geo-replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md).

## Auto-failover group capabilities

Auto-failover groups feature provides a powerful abstraction of active geo-replication by supporting group level replication and automatic failover. In addition, it removes the necessity to change the SQL connection string after failover by providing the additional listener end-points.

- **Failover group**

  One or many failover groups can be created between two servers in different regions (primary and secondary servers). Each group can include one or several databases that are recovered as a unit in case all or some primary databases become unavailable due to an outage in the primary region.  

- **Primary server**

  A server that hosts the primary databases in the failover group.

- **Secondary server**

  A server that hosts the secondary databases in the failover group. The secondary server cannot be in the same region as the primary server.

- **Adding databases to failover group**

  You can put several databases within a server or within an elastic pool into the same failover group. If you add a single database to the group, it automatically creates a secondary database using the same edition and compute size. If the primary database is in an elastic pool, the secondary is automatically created in the elastic pool with the same name. If you add a database that already has a secondary database in the secondary server, that geo-replication is inherited by the group.

  > [!NOTE]
  > When adding a database that already has a secondary database in a server that is not part of the failover group, a new secondary is created in the secondary server.
  > [!IMPORTANT]
  > In a Managed Instance, all user databases are replicated. You cannot pick a subset of user databases for replication in the failover group.

- **Failover group read-write listener**

  A DNS CNAME record formed as **&lt;failover-group-name&gt;.database.windows.net** that points to the current primary server URL. It allows the read-write SQL applications to transparently reconnect to the primary database when the primary changes after failover.

- **Failover group read-only listener**

  A DNS CNAME record formed as **&lt;failover-group-name&gt;.secondary.database.windows.net** that points to the secondary server’s URL. It allows the read-only SQL applications to transparently connect to the secondary database using the specified load-balancing rules.

  > [!IMPORTANT]
  > When a failover group is created on a Managed Instance, the DNS CNAME records for the listeners are **&lt;failover-group-name&gt;.&lt;zone_id&gt;.database.windows.net and &lt;failover-group-name&gt;.secondary.&lt;zone_id&gt;.database.windows.net. See [Best practices for failover groups with Managed Instances](#best-practices-of-using-failover-groups-for-business-continuity-with-managed-instances) for details of using zone_id with managed instance.

- **Automatic failover policy**

  By default, the failover group is configured with an automatic failover policy. The system triggers failover after the failure is detected and the grace period has expired. The system must verify that the outage cannot be mitigated by the built-in high availability infrastructure of the SQL Database service due to the scale of the impact. If you want to control the failover workflow from the application, you can turn off automatic failover.

- **Read-only failover policy**

  By default, the failover of the read-only listener is disabled. It ensures that the performance of the primary is not impacted when the secondary is offline. However, it also means the read-only sessions will not be able to connect until the secondary is recovered. If you cannot tolerate downtime for the readonly sessions and are OK to temporarily use the primary for both read-only and read-write traffic at the expense of the potential performance degradation of the primary, you can enable failover for the read-only listener. In that case the read-only traffic will be automatically redirected to the primary server if the secondary server is not available.  

- **Manual failover**

  You can initiate failover manually at any time regardless of the automatic failover configuration. If automatic failover policy is not configured, manual failover is required to recover databases in the failover group. You can initiate forced or friendly failover (with full data synchronization). The latter could be used to relocate the active server to the primary region. When failover is completed, the DNS records are automatically updated to ensure connectivity to the correct server.

- **Grace period with data loss**

  Because the primary and secondary databases are synchronized using asynchronous replication, the failover may result in data loss. You can customize the automatic failover policy to reflect your application’s tolerance to data loss. By configuring **GracePeriodWithDataLossHours**, you can control how long the system waits before initiating the failover that is likely to result data loss.

  > [!NOTE]
  > When system detects that the databases in the group are still online (for example, the outage only impacted the service control plane), it immediately activates the failover with full data synchronization (friendly failover) regardless of the value set by **GracePeriodWithDataLossHours**. This behavior ensures that there is no data loss during the recovery. The grace period takes effect only when a friendly failover is not possible. If the outage is mitigated before the grace period expires, the failover is not activated.

- **Multiple failover groups**

  You can configure multiple failover groups for the same pair of servers to control the scale of failovers. Each group fails over independently. If your multi-tenant application uses elastic pools, you can use this capability to mix primary and secondary databases in each pool. This way you can reduce the impact of an outage to only half of the tenants.

  > [!IMPORTANT]
  > Managed Instance does not support multiple failover groups.

## Best practices of using failover groups with single and pooled databases

The auto-failover group must be configured on the primary logical server and will connect it to the secondary logical server in a different Azure region.  The groups can include all or some databases in these servers. The following diagram illustrates a typical configuration of a geo-redundant cloud application using multiple databases and auto-failover group.

![auto failover](./media/sql-database-auto-failover-group/auto-failover-group.png)

When designing a service with business continuity in mind, follow these general guidelines:

- **Use one or several failover groups to manage failover of multiple databases**

  One or many failover groups can be created between two servers in different regions (primary and secondary servers). Each group can include one or several databases that are recovered as a unit in case all or some primary databases become unavailable due to an outage in the primary region. The failover group creates geo-secondary database with the same service objective as the primary. If you add an existing geo-replication relationship to the failover group, make sure the geo-secondary is configured with the same service tier and compute size as the primary.

- **Use read-write listener for OLTP workload**

  When performing OLTP operations, use **&lt;failover-group-name&gt;.database.windows.net** as the server URL and the connections are automatically directed to the primary. This URL does not change after the failover. Note the failover involves updating the DNS record so the client connections are redirected to the new primary only after the client DNS cache is refreshed.

- **Use read-only listener for read-only workload**

  If you have a logically isolated read-only workload that is tolerant to certain staleness of data, you can use the secondary database in the application. For read-only sessions, use **&lt;failover-group-name&gt;.secondary.database.windows.net** as the server URL and the connection is automatically directed to the secondary. It is also recommended that you indicate in connection string read intent by using **ApplicationIntent=ReadOnly**.

- **Be prepared for perf degradation**

  SQL failover decision is independent from the rest of the application or other services used. The application may be “mixed” with some components in one region and some in another. To avoid the degradation, ensure the redundant application deployment in the DR region and follow these [network security guidelines](#failover-groups-and-network-security).

  > [!NOTE]
  > The application in the DR region does not have to use a different connection string.  

- **Prepare for data loss**

  If an outage is detected, SQL waits for the period you specified by **GracePeriodWithDataLossHours**. The default value is 1 hour. If you cannot afford data loss, make sure to set **GracePeriodWithDataLossHours** to a sufficiently large number, such as 24 hours. Use manual group failover to fail back from the secondary to the primary.

> [!IMPORTANT]
> Elastic pools with 800 or fewer DTUs and more than 250 databases using geo-replication may encounter issues including longer planned failovers and degraded performance.  These issues are more likely to occur for write intensive workloads, when geo-replication endpoints are widely separated by geography, or when multiple secondary endpoints are used for each database.  Symptoms of these issues are indicated when the geo-replication lag increases over time.  This lag can be monitored using [sys.dm_geo_replication_link_status](/sql/relational-databases/system-dynamic-management-views/sys-dm-geo-replication-link-status-azure-sql-database).  If these issues occur, then mitigations include increasing the number of pool DTUs, or reducing the number of geo-replicated databases in the same pool.

## Best practices of using failover groups with Managed Instances

The auto-failover group must be configured on the primary instance and will connect it to the secondary instance in a different Azure region.  All databases in the instance will be replicated to the secondary instance. The following diagram illustrates a typical configuration of a geo-redundant cloud application using managed instance and auto-failover group.

![auto failover](./media/sql-database-auto-failover-group/auto-failover-group-mi.png)

> [!IMPORTANT]
> Auto-failover groups for Managed Instance is in public preview.

If your application uses Managed Instance as the data tier, follow these general guidelines when designing for business continuity:

- **Create the secondary instance in the same DNS zone as the primary instance**

  When a new instance is created, a unique id is automatically generated as the DNS Zone and included in the instance DNS name. A multi-domain (SAN) certificate for this instance is provisioned with the SAN field in the form of &lt;zone_id&gt;.database.windows.net. This certificate can be used to authenticate the client connections to an  instance in the same DNS zone. To ensure non-interrupted connectivity to the primary instance after failover both the primary and secondary instances must be in the same DNS zone. When your application is ready for production deployment, create a secondary instance in a different region and make sure it shares the DNS zone with the primary instance. This is done by specifying a `DNS Zone Partner` optional parameter using the Azure portal, PowerShell, or the REST API.

- **Enable replication traffic between two instances**

  Because each instance is isolated in its own VNET, two-directional traffic between these VNETs must be allowed. See [Azure VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md)

- **Configure a failover group to manage failover of entire instance**

  The failover group will manage the failover of all the databases in the instance. When a group is created, each database in the instance will be automatically geo-replicated to the secondary instance. You cannot use failover groups to initiate a partial failover of a subset of the databases.

  > [!IMPORTANT]
  > If a database is removed from the primary instance, it will also be dropped automatically on the geo secondary instance.

- **Use read-write listener for OLTP workload**

  When performing OLTP operations, use &lt;failover-group-name&gt;.&lt;zone_id&gt;.database.windows.net as the server URL and the connections are automatically directed to the primary. This URL does not change after the failover. The failover involves updating the DNS record, so the client connections are redirected to the new primary only after the client DNS cache is refreshed. Because the secondary instance shares the DNS zone with the primary, the client application will be able to re-connect to it using the same SAN certificate.

- **Connect directly to geo-replicated secondary for read-only queries**

  If you have a logically isolated read-only workload that is tolerant to certain staleness of data, you can use the secondary database in the application. To connect directly to the geo-replicated secondary, use &lt;server&gt;.secondary.&lt;zone_id&gt;.database.windows.net as the server URL and the connection is made directly to the geo-replicated secondary.

  > [!NOTE]
  > In certain service tiers, Azure SQL Database supports the use of [read-only replicas](sql-database-read-scale-out.md) to load balance read-only query workloads using the capacity of one read-only replica and using the `ApplicationIntent=ReadOnly` parameter in the connection string. When you have configured a geo-replicated secondary, you can use this capability to connect to either a read-only replica in the primary location or in the geo-replicated location.
  > - To connect to a read-only replica in the primary location, use &lt;failover-group-name&gt;.&lt;zone_id&gt;.database.windows.net.
  > - To connect to a read-only replica in the primary location, use &lt;failover-group-name&gt;.secondary.&lt;zone_id&gt;.database.windows.net.
- **Be prepared for perf degradation**

  SQL failover decision is independent from the rest of the application or other services used. The application may be “mixed” with some components in one region and some in another. To avoid the degradation, ensure the redundant application deployment in the DR region and follow the network security guidelines in this article <link>.

- **Prepare for data loss**

  If an outage is detected, SQL automatically triggers read-write failover if there is zero data loss to the best of our knowledge. Otherwise, it waits for the period you specified by GracePeriodWithDataLossHours. If you specified GracePeriodWithDataLossHours, be prepared for data loss. In general, during outages, Azure favors availability. If you cannot afford data loss, make sure to set GracePeriodWithDataLossHours to a sufficiently large number, such as 24 hours.

> [!IMPORTANT]
> Use manual group failover to move primaries back to the original location: When the outage that caused the failover is mitigated, you can move your primary databases to the original location. To do that you should initiate the manual failover of the group.
> [!IMPORTANT]
> The DNS update of the read-write listener will happen immediately after the failover is initiated. This operation will not result in data loss. However, the process of switching database roles can take up to 5 minutes under normal conditions. Until it is completed, some databases in the new primary instance will still be read-only. If failover is initiated using PowerShell then the entire operation is synchronous. If it is initiated using the Azure portal then the UI will indicate completion status. If it is initiated using the REST API, use standard ARM’s polling mechanism to monitor for completion.

## Failover groups and network security

For some applications the security rules require that the network access to the data tier is restricted to a specific component or components such as a VM, web service etc. This requirement presents some challenges for business continuity design and the use of the failover groups. You should consider the following options when implementing such restricted access.

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

## Enabling replication between managed instances and their VNETs

When you set up a failover groups between primary and secondary managed instances in two different regions, each instance is isolated using an independent VNET. To allow replication traffic between these VNETs follow these steps:

1. Connect them through either Express Route circuit (https://docs.microsoft.com/azure/expressroute/expressroute-circuit-peerings) or a VPN Gateway  (https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).
2. Setup each NSG such that ports 5022 and the range 11000-12000 are open for inbound connections from the other VNET.

## Upgrading or downgrading a primary database

You can upgrade or downgrade a primary database to a different compute size (within the same service tier, not between General Purpose and Business Critical) without disconnecting any secondary databases. When upgrading, we recommend that you upgrade the secondary database first, and then upgrade the primary. When downgrading, reverse the order: downgrade the primary first, and then downgrade the secondary. When you upgrade or downgrade the database to a different service tier, this recommendation is enforced.

> [!NOTE]
> If you created secondary database as part of the failover group configuration it is not recommended to downgrade the secondary database. This is to ensure your data tier has sufficient capacity to process your regular workload after failover is activated.

## Preventing the loss of critical data

Due to the high latency of wide area networks, continuous copy uses an asynchronous replication mechanism. Asynchronous replication makes some data loss unavoidable if a failure occurs. However, some applications may require no data loss. To protect these critical updates, an application developer can call the [sp_wait_for_database_copy_sync](/sql/relational-databases/system-stored-procedures/active-geo-replication-sp-wait-for-database-copy-sync) system procedure immediately after committing the transaction. Calling **sp_wait_for_database_copy_sync** blocks the calling thread until the last committed transaction has been transmitted to the secondary database. However, it does not wait for the transmitted transactions to be replayed and committed on the secondary. **sp_wait_for_database_copy_sync** is scoped to a specific continuous copy link. Any user with the connection rights to the primary database can call this procedure.

> [!NOTE]
> **sp_wait_for_database_copy_sync** prevents data loss after failover, but does not guarantee full synchronization for read access. The delay caused by a **sp_wait_for_database_copy_sync** procedure call can be significant and depends on the size of the transaction log at the time of the call.

## Programmatically managing failover groups and active geo-replication

As discussed previously, auto-failover groups and active geo-replication can also be managed programmatically using Azure PowerShell and the REST API. The following tables describe the set of commands available. Active geo-replication includes a set of Azure Resource Manager APIs for management, including the [Azure SQL Database REST API](https://docs.microsoft.com/rest/api/sql/) and [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview). These APIs require the use of resource groups and support role-based security (RBAC). For more information on how to implement access roles, see [Azure Role-Based Access Control](../role-based-access-control/overview.md).

### PowerShell: Manage SQL database failover with single and pooled databases

| Cmdlet | Description |
| --- | --- |
| [New-AzureRmSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/azurerm.sql/set-azurermsqldatabasefailovergroup) |This command creates a failover group and registers it on both primary and secondary servers|
| [Remove-AzureRmSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/azurerm.sql/remove-azurermsqldatabasefailovergroup) | Removes the failover group from the server and deletes all secondary databases included the group |
| [Get-AzureRmSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/azurerm.sql/get-azurermsqldatabasefailovergroup) | Retrieves the failover group configuration |
| [Set-AzureRmSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/azurerm.sql/set-azurermsqldatabasefailovergroup) |Modifies the configuration of the failover group |
| [Switch-AzureRMSqlDatabaseFailoverGroup](https://docs.microsoft.com/powershell/module/azurerm.sql/switch-azurermsqldatabasefailovergroup) | Triggers failover of the failover group to the secondary server |
| [Add-AzureRmSqlDatabaseToFailoverGroup](https://docs.microsoft.com/powershell/module/azurerm.sql/add-azurermsqldatabasetofailovergroup)|Adds one or more databases to an Azure SQL Database failover group|
|  | |

> [!IMPORTANT]
> For a sample script, see [Configure and failover a failover group for a single database](scripts/sql-database-setup-geodr-failover-database-failover-group-powershell.md).
>

### PowerShell: Managing failover groups with Managed Instances (preview)

#### Install the newest pre-release version of Powershell

1. Update the powershellget module to 1.6.5 (or newest preview version). See [PowerShell preview site](https://www.powershellgallery.com/packages/AzureRM.Sql/4.11.6-preview).

   ```Powershell
      install-module powershellget -MinimumVersion 1.6.5 -force
   ```

2. In a new powershell window, execute the following commands:

   ```Powershell
      import-module powershellget
      get-module powershellget #verify version is 1.6.5 (or newer)
      install-module azurerm.sql -RequiredVersion 4.5.0-preview -AllowPrerelease –Force
      import-module azurerm.sql
   ```

#### Prerequisites Before Setting Up

- The two Managed Instances need to be in different geographical regions.
- Your secondary must be empty (no user databases).
- The primary and secondary Managed Instances need to be in the same Resource Group.
- The VNets that the Managed Instances are part of need to be [connected through a VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways). VNet Peering is not supported.
- The two Managed Instance subnets cannot have overlapping IP addresses.
- You need to setup your Network Security Groups (NSG) such that ports 5022 and the range 11000~12000 are open to connections from the other vnet. This is to allow replication traffic between the instances.
- You need to configure a DNS zone & Dns zone partner. A DNS zone is a property of a Managed Instance. It represents the part of host name that follows Managed Instance name and precedes the .database.windows.net suffix. It is generated as random string during the creation of the first Managed Instance in each VNet. The DNS zone cannot be modified after the creation of managed instance, and all Managed Instances within the same VNet  share the same DNS zone value. For Manged Instance failover group setup, the primary Managed Instance and the secondary Managed Instance must share the same DBS zone value. You accomplish this by specifying the `DnsZonePartner` parameter when creating the secondary Managed Instance. The DNS zone partner property defines the Managed Instance to share an instance failover group with. By passing into the resource id of another managed instance as the input of DnsZonePartner, the Managed Instance currently being created inherits the same DNS zone value of the partner Managed Instance.

#### Powershell commandlets to create an instance failover group

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
| [Delete Failover Group](https://docs.microsoft.com/rest/api/instancefailovergroups/delete) | Removes the failover group from the server |
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
