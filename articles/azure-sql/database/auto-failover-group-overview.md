---
title: Auto-failover groups
titleSuffix: Azure SQL Database & SQL Managed Instance
description: Auto-failover groups let you manage geo-replication and automatic / coordinated failover of a group of databases on a server, or all databases on a managed instance.
services: sql-database
ms.service: sql-db-mi
ms.subservice: high-availability
ms.custom: sqldbrb=2
ms.topic: conceptual
author: emlisa
ms.author: emlisa
ms.reviewer: kendralittle, mathoma
ms.date: 02/24/2022
---

# Auto-failover groups overview
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

> [!div class="op_single_selector"]
> * [Azure SQL DB & MI](auto-failover-group-overview.md)
> * [Azure SQL Database](auto-failover-group-sql-db.md)
> * [Azure SQL Managed Instance](../managed-instance/auto-failover-group-sql-mi.md)

This article provides a brief overview of the auto-failover group feature for disaster recovery for Azure SQL Database and Azure SQL Managed Instance. Auto-failover groups allow you to enable transparent and coordinated geo-failover of multiple database. 

For product specific documentation, see: 
- Azure SQL Database: [Auto-failover groups overview](auto-failover-group-sql-db.md), and [Configure auto-failover group](auto-failover-group-configure-sql-db.md)
- Azure SQL Managed Instance: [Auto-failover groups overview](../managed-instance/auto-failover-group-sql-mi.md), and [Configure auto-failover group](../managed-instance/auto-failover-group-configure-sql-mi.md)

## Overview

The auto-failover groups feature allows you to manage the replication and failover of a group of databases on a server or all databases in a managed instance to another region. It is a declarative abstraction on top of the existing [active geo-replication](active-geo-replication-overview.md) feature, designed to simplify deployment and management of geo-replicated databases at scale. You can initiate a geo-failover manually or you can delegate it to the Azure service based on a user-defined policy. The latter option allows you to automatically recover multiple related databases in a secondary region after a catastrophic failure or other unplanned event that results in full or partial loss of the SQL Database or SQL Managed Instance availability in the primary region. A failover group can include one or multiple databases, typically used by the same application. Additionally, you can use the readable secondary databases to offload read-only query workloads.

When you are using auto-failover groups with automatic failover policy, an outage that impacts one or several of the databases in the group will result in an automatic geo-failover. Typically, these are outages that cannot be automatically mitigated by the built-in high availability infrastructure. Examples of geo-failover triggers include an incident caused by a SQL Database tenant ring or control ring being down due to an OS kernel memory leak on compute nodes, or an incident caused by one or more tenant rings being down because a wrong network cable was accidentally cut during routine hardware decommissioning. For more information, see [SQL Database High Availability](high-availability-sla.md).

In addition, auto-failover groups provide read-write and read-only listener end-points that remain unchanged during geo-failovers. Whether you use manual or automatic failover activation, a geo-failover switches all secondary databases in the group to the primary role. After the geo-failover is completed, the DNS record is automatically updated to redirect the endpoints to the new region. For geo-failover RPO and RTO, see [Overview of Business Continuity](business-continuity-high-availability-disaster-recover-hadr-overview.md).

When you are using auto-failover groups with automatic failover policy, an outage that impacts databases on a server or managed instance results in an automatic geo-failover. 


When configuring a failover group, ensure that authentication and network access on the secondary is set up to function correctly after geo-failover, when the geo-secondary becomes the new primary. For details, see [SQL Database security after disaster recovery](active-geo-replication-security-configure.md).

To achieve full business continuity, adding regional database redundancy is only part of the solution. Recovering an application (service) end-to-end after a catastrophic failure requires recovery of all components that constitute the service and any dependent services. Examples of these components include the client software (for example, a browser with a custom JavaScript), web front ends, storage, and DNS. It is critical that all components are resilient to the same failures and become available within the recovery time objective (RTO) of your application. Therefore, you need to identify all dependent services and understand the guarantees and capabilities they provide. Then, you must take adequate steps to ensure that your service functions during the failover of the services on which it depends. For more information about designing solutions for disaster recovery, see [Designing Cloud Solutions for Disaster Recovery Using active geo-replication](designing-cloud-solutions-for-disaster-recovery.md).

## <a name="terminology-and-capabilities"></a> Terminology and capabilities

<!--
There is some overlap of content in the following articles, be sure to make changes in all if necessary:
/azure-sql/auto-failover-group-overview.md
/azure-sql/database/auto-failover-group-sql-db.md
/azure-sql/database/auto-failover-group-configure-sql-db.md
/azure-sql/managed-instance/auto-failover-group-sql-mi.md
/azure-sql/managed-instance/auto-failover-group-configure-sql-mi.md
-->

- **Failover group (FOG)**

  A failover group is a named group of databases managed by a single server or within a managed instance that can fail over as a unit to another region in case all or some primary databases become unavailable due to an outage in the primary region. When it's created for SQL Managed Instance, a failover group contains all user databases in the instance and therefore only one failover group can be configured on an instance.
  
  > [!IMPORTANT]
  > The name of the failover group must be globally unique within the `.database.windows.net` domain.

- **Servers**

  Some or all of the user databases on a [logical server](logical-servers.md) can be placed in a failover group. Also, a server supports multiple failover groups on a single server.

- **Primary**

  The server or managed instance that hosts the primary databases in the failover group.

- **Secondary**

  The server or managed instance that hosts the secondary databases in the failover group. The secondary cannot be in the same region as the primary.

- **Failover group read-write listener**

  A DNS CNAME record that points to the current primary. It is created automatically when the failover group is created and allows the read-write workload to transparently reconnect to the primary when the primary changes after failover. 

- **Failover group read-only listener**

  A DNS CNAME record that points to the current secondary. It is created automatically when the failover group is created and allows the read-only SQL workload to transparently connect to the secondary when the secondary changes after failover. 

- **Automatic failover policy**

  By default, a failover group is configured with an automatic failover policy. The system triggers a geo-failover after the failure is detected and the grace period has expired. The system must verify that the outage cannot be mitigated by the built-in [high availability infrastructure](high-availability-sla.md), for example due to the scale of the impact. If you want to control the geo-failover workflow from the application or manually, you can turn off automatic failover policy.
  
  > [!NOTE]
  > Because verification of the scale of the outage and how quickly it can be mitigated involves human actions, the grace period cannot be set below one hour. This limitation applies to all databases in the failover group regardless of their data synchronization state.

- **Read-only failover policy**

  By default, the failover of the read-only listener is disabled. It ensures that the performance of the primary is not impacted when the secondary is offline. However, it also means the read-only sessions will not be able to connect until the secondary is recovered. If you cannot tolerate downtime for the read-only sessions and can use the primary for both read-only and read-write traffic at the expense of the potential performance degradation of the primary, you can enable failover for the read-only listener by configuring the `AllowReadOnlyFailoverToPrimary` property. In that case, the read-only traffic will be automatically redirected to the primary if the secondary is not available.

  > [!NOTE]
  > The `AllowReadOnlyFailoverToPrimary` property only has effect if automatic failover policy is enabled and an automatic geo-failover has been triggered. In that case, if the property is set to True, the new primary will serve both read-write and read-only sessions.

- **Planned failover**

  Planned failover performs full data synchronization between primary and secondary databases before the secondary switches to the primary role. This guarantees no data loss. Planned failover is used in the following scenarios:

  - Perform disaster recovery (DR) drills in production when data loss is not acceptable
  - Relocate the databases to a different region
  - Return the databases to the primary region after the outage has been mitigated (failback)

- **Unplanned failover**

  Unplanned or forced failover immediately switches the secondary to the primary role without waiting for recent changes to propagate from the primary. This operation may result in data loss. Unplanned failover is used as a recovery method during outages when the primary is not accessible. When the outage is mitigated, the old primary will automatically reconnect and become a new secondary. A planned failover may be executed to fail back, returning the replicas to their original primary and secondary roles.

- **Manual failover**

  You can initiate a geo-failover manually at any time regardless of the automatic failover configuration. During an outage that impacts the primary, if automatic failover policy is not configured, a manual failover is required to promote the secondary to the primary role. You can initiate a forced (unplanned) or friendly (planned) failover. A friendly failover is only possible when the old primary is accessible, and can be used to relocate the primary to the secondary region without data loss. When a failover is completed, the DNS records are automatically updated to ensure connectivity to the new primary.

- **Grace period with data loss**

  Because the secondary databases are synchronized using asynchronous replication, an automatic geo-failover may result in data loss. You can customize the automatic failover policy to reflect your application’s tolerance to data loss. By configuring `GracePeriodWithDataLossHours`, you can control how long the system waits before initiating a forced failover, which may result in data loss.

  
## Permissions

<!--
There is some overlap of content in the following articles, be sure to make changes in all if necessary:
/azure-sql/auto-failover-group-overview.md
/azure-sql/database/auto-failover-group-sql-db.md
/azure-sql/database/auto-failover-group-configure-sql-db.md
/azure-sql/managed-instance/auto-failover-group-sql-mi.md
/azure-sql/managed-instance/auto-failover-group-configure-sql-mi.md
-->

Permissions for a failover group are managed via [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). 

Azure RBAC write access is necessary to create and manage failover groups. The [SQL Server Contributor role](../../role-based-access-control/built-in-roles.md#sql-server-contributor) has all the necessary permissions to manage failover groups.

For specific permission scopes, review how to configure auto-failover groups in [Azure SQL Database](uto-failover-group-sql-db.md#permissions) and [Azure SQL Managed Instance](../managed-instance/auto-failover-group-sql-mi.md#permissions). 


## Failover groups and point-in-time restore

For information about using point-in-time restore with failover groups, see [Point in Time Recovery (PITR)](recovery-using-backups.md#point-in-time-restore).


## Next steps

- For detailed tutorials, see
  - [Add SQL Database to a failover group](failover-group-add-single-database-tutorial.md)
  - [Add an elastic pool to a failover group](failover-group-add-elastic-pool-tutorial.md)
  - [Add a SQL Managed Instance to a failover group](../managed-instance/failover-group-add-instance-tutorial.md)
- For sample scripts, see:
  - [Use PowerShell to configure active geo-replication for Azure SQL Database](scripts/setup-geodr-and-failover-database-powershell.md)
  - [Use PowerShell to configure active geo-replication for a pooled database in Azure SQL Database](scripts/setup-geodr-and-failover-elastic-pool-powershell.md)
  - [Use PowerShell to add an Azure SQL Database to a failover group](scripts/add-database-to-failover-group-powershell.md)
  - [Use PowerShell to create an auto-failover group on a SQL Managed Instance](../managed-instance/scripts/add-to-failover-group-powershell.md)
- For a business continuity overview and scenarios, see [Business continuity overview](business-continuity-high-availability-disaster-recover-hadr-overview.md)
- To learn about Azure SQL Database automated backups, see [SQL Database automated backups](automated-backups-overview.md).
- To learn about using automated backups for recovery, see [Restore a database from the service-initiated backups](recovery-using-backups.md).
- To learn about authentication requirements for a new primary server and database, see [SQL Database security after disaster recovery](active-geo-replication-security-configure.md).
