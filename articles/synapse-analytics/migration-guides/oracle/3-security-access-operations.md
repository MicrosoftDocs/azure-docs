---
title: "Security, access, and operations for Oracle migrations"
description: Learn about authentication, users, roles, permissions, monitoring, and auditing, and workload management in Azure Synapse Analytics and Oracle.
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.custom:
ms.devlang:
ms.topic: conceptual
author: ajagadish-24
ms.author: ajagadish
ms.reviewer: wiassaf
ms.date: 08/11/2022
---

# Security, access, and operations for Oracle migrations

This article is part three of a seven-part series that provides guidance on how to migrate from Oracle to Azure Synapse Analytics. The focus of this article is best practices for security access operations.

## Security considerations

The Oracle environment offers several methods for access and authentication that you might need to migrate to Azure Synapse with minimal risk and user impact. The article assumes you want to migrate the existing connection methods and the user, role, and permission structures as-is. If that's not the case, then use the Azure portal to create and manage a new security regime.

For more information about Azure Synapse security options, see [Azure Synapse Analytics security](../../guidance/security-white-paper-introduction.md).

### Connection and authentication

Authentication is the process of verifying the identity of a user, device, or other entity in a computer system, generally as a prerequisite to granting access to resources in a system.

>[!TIP]
>Authentication in both Oracle and Azure Synapse can be "in database" or via external methods.

#### Oracle authorization options

The Oracle system offers these authentication methods for database users:

- **Database authentication**: with database authentication, the Oracle database administers the user account and authenticates the user. For the Oracle database to perform authentication, it generates a password for new users and stores passwords in encrypted format. Users can change their password at any time. Oracle recommends password management through account locking, password aging and expiration, password history, and password complexity verification. Database authentication is common in older Oracle installations.

- **External authentication**: with external authentication, the Oracle database maintains the user account, and an external service performs password administration and user authentication. The external service can be an operating system or a network service like Oracle Net. The database relies on the underlying operating system or network authentication service to restrict access to database accounts. This type of sign doesn't use a database password. There are two external authentication options:

  - **Operating system authentication**: by default, Oracle requires a secure connection for logins that the operating system authenticates to prevent a remote user from impersonating an operating system user over a network connection. This requirement precludes the use of Oracle Net and a shared-server configuration.

  - **Network authentication**: several network authentication mechanisms are available, such as smart cards, fingerprints, Kerberos, and the operating system. Many network authentication services, such as Kerberos, support single sign-on so users have fewer passwords to remember.

- **Global authentication and authorization**: with global authentication and authorization, you can centralize management of user-related information, including authorizations, in an LDAP-based directory service. Users are identified in the database as global users, which means they're authenticated by TLS/SSL and user management occurs outside the database. The centralized directory service performs user management. This approach provides strong authentication using TLS/SSL, Kerberos, or Windows-native authentication, and enables centralized management of users and privileges across the enterprise. Administration is easier because it's not necessary to create a schema for every user in every database in the enterprise. Single sign-on is also supported, so that users only need to sign in once to access multiple databases and services.

- **Proxy authentication and authorization**: you can designate a middle-tier server to proxy clients in a secure fashion. Oracle provides various options for proxy authentication, such as:
  
  - The middle-tier server can authenticate itself with the database server. A client, which in this case is an application user or another application, authenticates itself with the middle-tier server. Client identities can be maintained all the way through to the database. 
  
  - The client, which in this case is database user, isn't authenticated by the middle-tier server. The client's identity and database password are passed through the middle-tier server to the database server for authentication. 
  
  - The client, which in this case is a global user, is authenticated by the middle-tier server, and passes either a distinguished name (DN) or certificate through the middle tier for retrieving the client's username.

#### Azure Synapse authorization options

Azure Synapse supports two basic options for connection and authorization:

- **SQL authentication**: SQL authentication uses a database connection that includes a database identifier, user ID, and password, plus other optional parameters. This method of authentication is functionally equivalent to Oracle [database authentication](#oracle-authorization-options).

- **Microsoft Entra authentication**: with Microsoft Entra authentication, you can centrally manage the identities of database users and Microsoft services in one location. Centralized management provides a single place to manage Azure Synapse users and simplifies permission management. Microsoft Entra authentication supports connections to LDAP and Kerberos services. For example, you can use Microsoft Entra authentication to connect to existing LDAP directories if they're to remain in place after migration of the database.

### Users, roles, and permissions

Both Oracle and Azure Synapse implement database access control via a combination of users, roles, and permissions. You can use standard SQL statements `CREATE USER` and `CREATE ROLE/GROUP` to define users and roles. `GRANT` and `REVOKE` statements assign or remove permissions to users and/or roles.

>[!TIP]
>Planning is essential for a successful migration project. Start with high-level approach decisions.

Conceptually, Oracle and Azure Synapse databases are similar, and to some degree it's possible to automate the migration of existing user IDs, groups, and permissions. Extract the legacy user and group information from the Oracle system catalog tables, then generate matching equivalent `CREATE USER` and `CREATE ROLE` statements. Run those statements in Azure Synapse to recreate the same user/role hierarchy.

>[!TIP] 
>If possible, automate migration processes to reduce elapsed time and scope for error.

After data extraction, use Oracle system catalog tables to generate equivalent `GRANT` statements to assign permissions if an equivalent exists.

:::image type="content" source="../media/3-security-access-operations/automating-migration-privileges.png" border="true" alt-text="Chart showing how to automate the migration of privileges from an existing system.":::

#### Users and roles

The information about current users and groups in an Oracle system is held in system catalog views, such as `ALL_USERS` and `DBA_USERS`. You can query these views in the normal way via Oracle SQL\*Plus or Oracle SQL Developer. The following queries are basic examples:

```sql
--List of users
select * from dba_users order by username;

--List of roles
select * from dba_roles order by role;

--List of users and their associated roles
select * from user_role_privs order by username, granted_role;
```

Oracle SQL Developer has built-in options to display user and role information in the *Reports* pane, as shown in the following screenshot.

:::image type="content" source="../media/3-security-access-operations/oracle-sql-developer-reports-1.png" border="true" alt-text="Screenshot showing the Reports pane for user roles in Oracle SQL Developer." lightbox="../media/3-security-access-operations/oracle-sql-developer-reports-1-lrg.png":::

You can modify the example `SELECT` statement to produce a result set that is a series of `CREATE USER` and `CREATE GROUP` statements. To do so, include the appropriate text as a literal within the `SELECT` statement.

There's no way to retrieve existing Oracle passwords, so you need to implement a scheme for allocating new initial passwords on Azure Synapse.

>[!TIP]
>Migration of a data warehouse requires migrating more than just tables, views, and SQL statements.

#### Permissions

In an Oracle system, the system `DBA_ROLE_PRIVS` view holds the access rights for users and roles. If you have `SELECT` access, you can query that view to obtain the current access rights lists defined within the system. The following Oracle SQL Developer screenshot shows an example access rights list.

:::image type="content" source="../media/3-security-access-operations/oracle-sql-developer-reports-2.png" border="true" alt-text="Screenshot showing the Reports pane for user access rights in Oracle SQL Developer." lightbox="../media/3-security-access-operations/oracle-sql-developer-reports-2-lrg.png":::

You can also create queries to produce a script that's a series of `CREATE` and `GRANT` statements for Azure Synapse, based on the existing Oracle privileges. The following Oracle SQL Developer screenshot shows an example of that script.

:::image type="content" source="../media/3-security-access-operations/oracle-sql-developer-reports-3.png" border="true" alt-text="Screenshot showing how to create a script of CREATE and GRANT statements in Oracle SQL Developer." lightbox="../media/3-security-access-operations/oracle-sql-developer-reports-3-lrg.png":::

This table lists and describes the data dictionary views required to view user, role, and privileges information.

| View | Description |
|--|--|
DBA_COL_PRIVS<br>ALL_COL_PRIVS<br>USER_COL_PRIVS | The DBA view describes all column object grants in the database. The ALL view describes all column object grants for which the current user or PUBLIC is the object owner, grantor, or grantee. The USER view describes column object grants for which the current user is the object owner, grantor, or grantee. |
| ALL_COL_PRIVS_MADE<br>USER_COL_PRIVS_MADE | The ALL view lists column object grants for which the current user is the object owner or grantor. The USER view describes column object grants for which the current user is the grantor. |
| ALL_COL_PRIVS_RECD<br>USER_COL_PRIVS_RECD | The ALL view describes column object grants for which the current user or PUBLIC is the grantee. The USER view describes column object grants for which the current user is the grantee. |
| DBA_TAB_PRIVS<br>ALL_TAB_PRIVS<br>USER_TAB_PRIVS | The DBA view lists all grants on all objects in the database. The ALL view lists the grants on objects where the user or PUBLIC is the grantee. The USER view lists grants on all objects where the current user is the grantee. |
| ALL_TAB_PRIVS_MADE<br>USER_TAB_PRIVS_MADE | The ALL view lists object grants made by the current user or made on the objects owned by the current user. The USER view lists grants on all objects owned by the current user. |
| ALL_TAB_PRIVS_RECD<br>USER_TAB_PRIVS_RECD | The ALL view lists object grants for which the user or PUBLIC is the grantee. The USER view lists object grants for which the current user is the grantee. |
| DBA_ROLES | This view lists all roles that exist in the database. |
| DBA_ROLE_PRIVS<br>USER_ROLE_PRIVS | The DBA view lists roles granted to users and roles. The USER view lists roles granted to the current user. |
| DBA_SYS_PRIVS<br>USER_SYS_PRIVS | The DBA view lists system privileges granted to users and roles. The USER view lists system privileges granted to the current user. |
| ROLE_ROLE_PRIVS | This view describes roles granted to other roles. Information is provided only about roles to which the user has access. |
| ROLE_SYS_PRIVS | This view contains information about system privileges granted to roles. Information is provided only about roles to which the user has access. |
| ROLE_TAB_PRIVS | This view contains information about object privileges granted to roles. Information is provided only about roles to which the user has access. |
| SESSION_PRIVS | This view lists the privileges that are currently enabled for the user. |
| SESSION_ROLES | This view lists the roles that are currently enabled for the user. |

Oracle supports various types of privileges:

- **System privileges**: system privileges allow the grantee to perform standard administrator tasks in the database. Typically, these privileges are restricted to trusted users. Many system privileges are specific to Oracle operations.

- **Object privileges**: each type of object has privileges associated with it.

- **Table privileges**: table privileges enable security at the data manipulation language (DML) or data definition language (DDL) level. You can map table privileges directly to their equivalent in Azure Synapse.

- **View privileges**: you can apply DML object privileges to views, similar to tables. You can map view privileges directly to their equivalent in Azure Synapse.

- **Procedure privileges**: procedures privileges allow procedures, including standalone procedures and functions, to be granted the `EXECUTE` privilege. You can map procedure privileges directly to their equivalent in Azure Synapse.

- **Type privileges**: you can grant system privileges to named types, such as object types, `VARRAYs`, and nested tables. Typically, these privileges are specific to Oracle and have no equivalent in Azure Synapse.

>[!TIP] 
>Azure Synapse has equivalent permissions for basic database operations such as DML and DDL.

The following table lists common Oracle admin privileges that have a direct equivalent in Azure Synapse.

| Admin privilege | Description | Synapse equivalent |
|--|--|--|
| \[Create\] Database | The user can create databases. Permission to operate on existing databases is controlled by object privileges. | CREATE DATABASE | 
| \[Create\] External Table | The user can create external tables. Permission to operate on existing tables is controlled by object privileges. | CREATE TABLE |
| \[Create\] Function | The user can create user-defined functions (UDFs). Permission to operate on existing UDFs is controlled by object privileges. | CREATE FUNCTION |
| \[Create\] Role | The user can create groups. Permission to operate on existing groups is controlled by object privileges. | CREATE ROLE |
| \[Create\] Index | For system use only. Users can't create indexes. | CREATE INDEX |
| \[Create\] Materialized View | The user can create materialized views. | CREATE VIEW |
| \[Create\] Procedure | The user can create stored procedures. Permission to operate on existing stored procedures is controlled by object privileges. | CREATE PROCEDURE |
| \[Create\] Schema | The user can create schemas. Permission to operate on existing schemas is controlled by object privileges. | CREATE SCHEMA |
| \[Create\] Table | The user can create tables. Permission to operate on existing tables is controlled by object privileges. | CREATE TABLE |
| \[Create\] Temporary Table | The user can create temporary tables. Permission to operate on existing tables is controlled by object privileges. | CREATE TABLE |
| \[Create\] User | The user can create users. Permission to operate on existing users is controlled by object privileges. | CREATE USER |
| \[Create\] View | The user can create views. Permission to operate on existing views is controlled by object privileges. | CREATE VIEW |

You can automate the migration of these privileges by generating equivalent scripts for Azure Synapse from the Oracle catalog tables, as described earlier in this section.

The next table lists common Oracle object privileges that have a direct equivalent in Azure Synapse.

| Object Privilege | Description | Synapse Equivalent |
|--|--|--|
| Alter | The user can modify object attributes. Applies to all objects. | ALTER |
| Delete | The user can delete table rows. Applies only to tables. | DELETE |
| Drop | The user can drop objects. Applies to all object types. | DROP |
| Execute | The user can run user-defined functions, user-defined aggregates, or stored procedures. | EXECUTE |
| Insert | The user can insert rows into a table. Applies only to tables. | INSERT |
| List | The user can display an object name, either in a list or in another manner. Applies to all objects. | LIST |
| Select | The user can select (or query) rows within a table. Applies to tables and views. | SELECT |
| Truncate | The user can delete all rows from a table. Applies only to tables. | TRUNCATE |
| Update | The user can modify table rows. Applies to tables only. | UPDATE |

For more information about Azure Synapse permissions, see [Database engine permissions](/sql/relational-databases/security/permissions-database-engine).

#### Migrating users, roles, and privileges

So far, we've described a common approach for migrating users, roles, and privileges to Azure Synapse using `CREATE USER`, `CREATE ROLE`, and `GRANT` SQL commands. However, you don't need to migrate all Oracle operations with grantable privileges to the new environment. For example, system management operations aren't applicable to the new environment or the equivalent functionality is automatic or managed outside the database. For users, roles, and the subset of privileges that do have a direct equivalent in the Azure Synapse environment, the following steps describe the migration process:

1. Migrate Oracle schema, table, and view definitions to the Azure Synapse environment. This step migrates only the table definitions not the data.

1. Extract the existing user IDs that you want to migrate from the Oracle system tables, generate a script of `CREATE USER` statements for Azure Synapse, and then run that script in the Azure Synapse environment. Find a way to create new initial passwords, because passwords can't be extracted from the Oracle environment.

1. Extract the existing roles from the Oracle system tables, generate a script of equivalent `CREATE ROLE` statements for Azure Synapse, and then run that script in the Azure Synapse environment.

1. Extract the user/role combinations from the Oracle system tables, generate a script to `GRANT` roles to users in Azure Synapse, and then run that script in the Azure Synapse environment.

1. Extract the relevant privilege information from the Oracle system tables, then generate a script to `GRANT` the appropriate privileges to users and roles in Azure Synapse, and then run that script in the Azure Synapse environment.

## Operational considerations

This section discusses how typical Oracle operational tasks can be implemented in Azure Synapse with minimal risk and user impact.

As with all data warehouse products in production, ongoing management tasks are necessary to keep the system running efficiently and provide data for monitoring and auditing. Other operational considerations include resource utilization, capacity planning for future growth, and backup/restore of data.

>[!TIP]
>Operational tasks are necessary to keep any data warehouse operating efficiently.

Oracle administration tasks typically fall into two categories:

- **System administration**: system administration is management of the hardware, configuration settings, system status, access, disk space, usage, upgrades, and other tasks.

- **Database administration**: database administration is management of user databases and their content, data loading, data backup, data recovery, and access to data and permissions.

Oracle offers several methods and interfaces that you can use to perform system and database management tasks:

- Oracle Enterprise Manager is Oracle's on-premises management platform. It provides a single pane of glass for managing all of a customer's Oracle deployments, whether in their data centers or in the Oracle Cloud. Through deep integration with Oracle's product stack, Oracle Enterprise Manager provides management and automation support for Oracle applications, databases, middleware, hardware, and engineered systems.

- Oracle Instance Manager provides a UI for high-level administration of Oracle instances. Oracle Instance Manager enables tasks such as startup, shutdown, and log viewing.

- Oracle Database Configuration Assistant is a UI that allows management and configuration of various database features and functionality.

- SQL commands that support administration tasks and queries within a SQL database session. You can run SQL commands from the Oracle SQL\*Plus command interpreter, Oracle SQL Developer UI, or through SQL APIs such as ODBC, JDBC, and OLE DB Provider. You must have a database user account to run SQL commands, with appropriate permissions for the queries and tasks that you perform.

While the management and operations tasks for different data warehouses are similar in concept, the individual implementations can differ. Modern cloud-based products such as Azure Synapse tend to incorporate a more automated and "system managed" approach, compared to the more manual approach in legacy environments like Oracle.

The following sections compare Oracle and Azure Synapse options for various operational tasks.

### Housekeeping tasks

In most legacy data warehouse environments, regular housekeeping tasks are time-consuming. You can reclaim disk storage space by removing old versions of updated or deleted rows. Or, you can reclaim disk storage space by reorganizing data, log files, and index blocks for efficiency, for example by running `ALTER TABLE... SHRINK SPACE` in Oracle.

>[!TIP]
>Housekeeping tasks keep a production warehouse operating efficiently and optimize storage and other resources.

Collecting statistics is a potentially time-consuming task that's required after bulk data ingestion to provide the query optimizer with up-to-date data for its query execution plans.

Oracle has a built-in feature to help with analyzing the quality of statistics, the Optimizer Statistics Advisor. It works through a list of Oracle rules that represent best practices for optimizer statistics. The advisor checks each rule and, where necessary, generates findings, recommendations, and actions that involve calls to the `DBMS_STATS` package to take corrective measures. Users can see the list of rules in the `V$STATS_ADVISOR_RULES` view, as shown in the following screenshot.

:::image type="content" source="../media/3-security-access-operations/optimizer-statistics-advisor-rules.png" border="true" alt-text="Screenshot showing how to display a list of rules by using the Optimizer Statistics Advisor.":::

An Oracle database contains many log tables in the data dictionary, which accumulate data, either automatically or after certain features are enabled. Because log data grows over time, purge older information to avoid using up permanent space. Oracle provides options to automate log maintenance.

Azure Synapse can automatically create statistics so that they're available when needed. You can defragment indexes and data blocks manually, on a scheduled basis, or automatically. By using native built-in Azure capabilities, you reduce the migration effort.

>[!TIP]
>Automate and monitor housekeeping tasks in Azure.

### Monitoring and auditing

Oracle Enterprise Manager includes tools to monitor various aspects of one or more Oracle systems, such as activity, performance, queuing, and resource utilization. Oracle Enterprise Manager has an interactive UI that lets users drill down into the low-level detail of any chart.

>[!TIP]
>Oracle Enterprise Manager is the recommended method of monitoring and logging in Oracle systems.

The following diagram provides an overview of the monitoring environment in an Oracle data warehouse.

:::image type="content" source="../media/3-security-access-operations/oracle-warehouse-overview.png" border="true" alt-text="Diagram showing an overview of the monitoring environment for an Oracle warehouse.":::

Azure Synapse also provides a rich monitoring experience within the Azure portal to provide insights into your data warehouse workload. The Azure portal is the recommended tool for monitoring your data warehouse because it provides configurable retention periods, alerts, recommendations, and customizable charts and dashboards for metrics and logs.

>[!TIP]
>The Azure portal provides a UI to manage monitoring and auditing tasks for all Azure data and processes.

The Azure portal can also provide recommendations for performance enhancements, as shown in the following screenshot.

:::image type="content" source="../media/3-security-access-operations/azure-portal-recommendations.png" border="true" alt-text="Screenshot of Azure portal recommendations for performance enhancements." lightbox="../media/3-security-access-operations/azure-portal-recommendations-lrg.png":::

The portal supports integration with other Azure monitoring services, such as Operations Management Suite (OMS) and [Azure Monitor](../../../azure-monitor/overview.md), to provide an integrated monitoring experience of the data warehouse and the entire Azure analytics platform. For more information, see [Azure Synapse operations and management options](../../sql-data-warehouse/sql-data-warehouse-how-to-manage-and-monitor-workload-importance.md).

### High availability (HA) and disaster recovery (DR)

Since its initial release in 1979, the Oracle environment has evolved to encompass numerous features required by enterprise customers, including options for high availability (HA) and disaster recovery (DR). The latest announcement in this area is Maximum Availability Architecture (MAA), which includes reference architectures for four levels of HA and DR:

- **Bronze tier**: a single-instance HA architecture
- **Silver tier**: HA with automatic failover
- **Gold tier**: comprehensive HA and DR
- **Platinum tier**: zero outage for platinum-ready applications

Azure Synapse uses database snapshots to provide HA of the data warehouse. A data warehouse snapshot creates a restore point that you can use to restore a data warehouse to a previous state. Because Azure Synapse is a distributed system, a data warehouse snapshot consists of many files stored in Azure Storage. Snapshots capture incremental changes to the data stored in your data warehouse.

>[!TIP]
>Azure Synapse creates snapshots automatically to ensure fast recovery time.

Azure Synapse automatically takes snapshots throughout the day and creates restore points that are available for seven days. You can't change this retention period. Azure Synapse supports an eight-hour recovery point objective (RPO). You can restore a data warehouse in the primary region from any one of the snapshots taken in the past seven days.

>[!TIP]
>User-defined snapshots can be used to define a recovery point before key updates.

Azure Synapse supports user-defined restore points, which are created from manually triggered snapshots. By creating restore points before and after large data warehouse modifications, you ensure that the restore points are logically consistent. The user-defined restore points augment data protection and reduce recovery time if there are workload interruptions or user errors.

In addition to snapshots, Azure Synapse performs a standard geo-backup once per day to a [paired data center](../../../availability-zones/cross-region-replication-azure.md). The RPO for a geo-restore is 24 hours. You can restore the geo-backup to a server in any region where Azure Synapse is supported. A geo-backup ensures that a data warehouse can be restored if restore points in the primary region aren't available.

>[!TIP]
>Microsoft Azure provides automatic backups to a separate geographical location to enable DR.

### Workload management

Oracle provides utilities such as Enterprise Manager and Database Resource Manager (DBRM) for managing workloads. These utilities include features such as load balancing across large clusters, parallel query execution, performance measurement, and prioritization. Many of these features can be automated so that the system becomes to some extent self-tuning.

>[!TIP]
>A typical production data warehouse concurrently runs mixed workloads with different resource usage characteristics.

Azure Synapse automatically logs resource utilization statistics. Metrics include usage statistics for CPU, memory, cache, I/O, and temporary workspace for each query. Azure Synapse also logs connectivity information, such as failed connection attempts. 

>[!TIP]
>Low-level and system-wide metrics are automatically logged within Azure.

In Azure Synapse, resource classes are pre-determined resource limits that govern compute resources and concurrency for query execution. Resource classes help you manage your workload by setting limits on the number of queries that run concurrently and on the compute resources assigned to each query. There's a trade-off between memory and concurrency.

Azure Synapse supports these basic workload management concepts:

- **Workload classification**: you can assign a request to a workload group to set importance levels.

- **Workload importance**: you can influence the order in which a request gets access to resources. By default, queries are released from the queue on a first-in, first-out basis as resources become available. Workload importance allows higher priority queries to receive resources immediately regardless of the queue.

- **Workload isolation**: you can reserve resources for a workload group, assign maximum and minimum usage for varying resources, limit the resources a group of requests can consume can, and set a timeout value to automatically kill runaway queries.

Running mixed workloads can pose resource challenges on busy systems. A successful [workload management](../../sql-data-warehouse/sql-data-warehouse-workload-management.md) scheme effectively manages resources, ensures highly efficient resource utilization, and maximizes return on investment (ROI). The [workload classification](../../sql-data-warehouse/sql-data-warehouse-workload-classification.md), [workload importance](../../sql-data-warehouse/sql-data-warehouse-workload-importance.md), and [workload isolation](../../sql-data-warehouse/sql-data-warehouse-workload-isolation.md) gives more control over how workload utilizes system resources.

You can use the workload metrics that Azure Synapse collects for capacity planning, for example to determine the resources required for extra users or a larger application workload. You can also use workload metrics to plan scale up/down of compute resources for cost-effective support of peaky workloads.

The [workload management guide](../../sql-data-warehouse/analyze-your-workload.md) describes the techniques to analyze the workload, manage and monitor workload importance](../../sql-data-warehouse/sql-data-warehouse-how-to-manage-and-monitor-workload-importance.md), and the steps to [convert a resource class to a workload group](../../sql-data-warehouse/sql-data-warehouse-how-to-convert-resource-classes-workload-groups.md). Use the [Azure portal](../../sql-data-warehouse/sql-data-warehouse-monitor-workload-portal.md) and [T-SQL queries on DMVs](../../sql-data-warehouse/sql-data-warehouse-manage-monitor.md) to monitor the workload to ensure that the applicable resources are efficiently utilized. Azure Synapse provides a set of Dynamic Management Views (DMVs) for monitoring all aspects of workload management. These views are useful when actively troubleshooting and identifying performance bottlenecks in your workload.

For more information on workload management in Azure Synapse, see [Workload management with resource classes](../../sql-data-warehouse/resource-classes-for-workload-management.md).

### Scale compute resources

The Azure Synapse architecture separates storage and compute, allowing each to scale independently. As a result, [compute resources can be scaled](../../sql-data-warehouse/quickstart-scale-compute-portal.md) to meet performance demands independent of data storage. You can also pause and resume compute resources. Another benefit of this architecture is that billing for compute and storage is separate. If a data warehouse isn't in use, you can save on compute costs by pausing compute.

>[!TIP]
>A major benefit of Azure is the ability to independently scale up and down compute resources on demand to handle peaky workloads cost-effectively.

You can scale compute resources up or down by adjusting the data warehouse units (DWU) setting for a data warehouse. Load and query performance will increase linearly as you allocate more DWUs.

If you increase DWUs, the number of compute nodes increase, which adds more compute power and supports more parallel processing. As the number of compute nodes increase, the number of distributions per compute node decrease, providing more compute power and parallel processing for queries. Similarly, if you decrease DWUs, the number of compute nodes decrease, which reduces the compute resources for queries.

## Next steps

To learn more about visualization and reporting, see the next article in this series: [Visualization and reporting for Oracle migrations](4-visualization-reporting.md).
