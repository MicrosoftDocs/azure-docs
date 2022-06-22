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
ms.date: 06/30/2022
---

# Security, access, and operations for Oracle migrations

This article is part three of a seven-part series that provides guidance on how to migrate from Oracle to Azure Synapse Analytics. The focus of this article is best practices for security access operations.

## Security considerations

This article discusses connection methods for existing legacy Oracle environments and how they can be migrated to Azure Synapse with minimal risk and user impact.

This article assumes that there's a requirement to migrate the existing methods of connection and user/role/permission structure as-is. If not, use the Azure portal to create and manage a new security regime.

For more information on [Azure Synapse security](../../sql-data-warehouse/sql-data-warehouse-overview-manage-security.md#authorization) options, see [Security whitepaper](../../guidance/security-white-paper-introduction.md).

### Connection and authentication

#### Oracle authorization options

Authentication is the process of verifying the identity of a user, device, or other entity in a computer system, generally as a prerequisite to granting access to resources in a system. The Oracle system offers several authentication methods for database users:

> [!TIP]
> Authentication in both Oracle and Azure Synapse can be "in database" or via external methods.

##### Database authentication

With this approach, the Oracle database solely administers the user account, including authentication of that user. For the Oracle database to authenticate a user, a password for the user is specified when the user is created (or altered). Users can change their password at any time. Passwords are stored in an encrypted format. Oracle recommends the use of password management, including account locking, password aging and expiration, password history, and password complexity verification. This method is common in older Oracle installations.

##### External authentication

With external authentication, the user account is maintained by the Oracle database, but password administration and user authentication are performed by an external service. This external service can be the operating system or a network service, such as Oracle Net. The database relies on the underlying operating system or network authentication service to restrict access to database accounts. A database password isn't used for this type of login. There are two external authentication options:

- **Operating system authentication**: By default, Oracle allows operating-system-authenticated logins only over secure connections, which precludes using Oracle Net and a shared-server configuration. This default restriction prevents a remote user from impersonating another operating system user over a network connection.

- **Network authentication**: With this approach, more authentication mechanisms are available, such as smart cards, fingerprints, Kerberos, or the operating system. Many network authentication services, such as Kerberos, support single sign-on, so that users have fewer passwords to remember.

##### Global authentication and authorization 

Oracle Advanced Security enables centralized management of user-related information, including authorizations, in an LDAP-based directory service. Users can be identified in the database as global users, which means that they're authenticated by SSL and that the management of these users is done outside of the database by the centralized directory service. 

This approach provides strong authentication using SSL, Kerberos, or Windows-native authentication, and enables centralized management of users and privileges across the enterprise. Administration is easier since it's not necessary to create a schema for every user in every database in the enterprise. Single sign-on is also supported, so that users only need to sign on once to access multiple databases and services.

##### Proxy authentication and authorization 

You can designate a middle-tier server to proxy clients in a secure fashion. Oracle provides various options for proxy authentication: 

- The middle-tier server can authenticate itself with the database server. A client&mdash;in this case, an application user or another application&mdash;authenticates itself with the middle-tier server. Client identities can be maintained all the way through to the database. 

- The client&mdash;in this case, a database user&mdash;isn't authenticated by the middle-tier server. The client's identity and database password are passed through the middle-tier server to the database server for authentication. 

- The client&mdash;in this case, a global user&mdash;is authenticated by the middle-tier server, and passes either a distinguished name (DN) or certificate through the middle tier for retrieving the client's user name.

#### Azure Synapse authorization options

Azure Synapse supports two basic options for connection and authorization: SQL authentication and Azure Active Directory (Azure AD) authentication.

- **SQL authentication**: This method of authentication uses a database connection that includes a database identifier, user ID, and password, plus other optional parameters. This method is functionally equivalent to Oracle database connections above.

- **Azure AD authentication**: With Azure AD authentication, you can centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage Azure Synapse users and simplifies permission management. Azure AD can also support connections to LDAP and Kerberos services. For example, this method can be used to connect to existing LDAP directories if they're to remain in place after migration of the database.

### Users, roles, and permissions

Both Oracle and Azure Synapse implement database access control via a combination of users, roles, and permissions. You can use standard SQL CREATE USER and CREATE ROLE/GROUP statements to define users and roles. GRANT and REVOKE statements assign or remove permissions to those users and/or roles.

> [!TIP]
> Planning is essential for a successful migration project, starting with high-level approach decisions.

Conceptually, the two databases are similar, and it might be possible to automate the migration of existing user IDs, groups, and permissions to some degree. Extract the legacy user and group information from the Oracle system catalog tables, then generate matching equivalent CREATE USER and CREATE ROLE statements to be run in Azure Synapse to recreate the same user/role hierarchy.

> [!TIP] 
> If possible, automate migration processes to reduce elapsed time and scope for error.

After data extraction, use Oracle system catalog tables to generate equivalent GRANT statements to assign permissions (where an equivalent one exists).

:::image type="content" source="../media/3-security-access-operations/automating-migration-privileges.png" border="true" alt-text="Chart showing how to automate the migration of privileges from an existing system.":::

#### Users and roles

The information about current users and groups in an Oracle system is held in system catalog views ALL_USERS or DBA_USERS. These views can be queried in the normal way via SQL\*Plus or SQL Developer.

Basic examples include:

```sql
--List of users
select * from dba_users order by username;

--List of roles
select * from dba_roles order by role;

--List of users and their associated roles
select * from user_role_privs order by username, granted_role;
```

SQL Developer also has built-in options to display this information in the Reports section. For example:

:::image type="content" source="../media/3-security-access-operations/oracle-sql-developer-reports-1.png" border="true" alt-text="Screenshot showing a Reports view for user roles in Oracle SQL Developer.":::

Modify the example SELECT statement to produce a result set that is a series of CREATE USER and CREATE GROUP statements by including the appropriate text as a literal within the SELECT statement.

There's no way to retrieve existing passwords, so you need to implement a scheme for allocating new initial passwords on Azure Synapse.

> [!TIP]
> Migration of a data warehouse requires more than just tables, views, and SQL statements.

#### Permissions

In an Oracle system, the system view DBA_ROLE_PRIVS holds the access rights for users and roles. Query these tables (if the user has SELECT access to those tables) to obtain current lists of access rights defined within the system.

:::image type="content" source="../media/3-security-access-operations/oracle-sql-developer-reports-2.png" border="true" alt-text="Screenshot showing a Reports view for user access rights in Oracle SQL Developer.":::

You can create queries to produce a script that's a series of CREATE and GRANT statements for Azure Synapse, based on the existing Oracle privileges:

:::image type="content" source="../media/3-security-access-operations/oracle-sql-developer-reports-3.png" border="true" alt-text="Screenshot showing how to create a script of CREATE and GRANT statements in Oracle SQL Developer.":::

This table lists and describes the data dictionary views required to view user, role, and privilege information.

| **View** | **Description** |
|--|--|
DBA_COL_PRIVS<br> ALL_COL_PRIVS<br> USER_COL_PRIVS | DBA view describes all column object grants in the database. ALL view describes all column object grants for which the current user or PUBLIC is the object owner, grantor, or grantee. USER view describes column object grants for which the current user is the object owner, grantor, or grantee. |
| ALL_COL_PRIVS_MADE<br> USER_COL_PRIVS_MADE | ALL view lists column object grants for which the current user is object owner or grantor. USER view describes column object grants for which the current user is the grantor. |
| ALL_COL_PRIVS_RECD<br> USER_COL_PRIVS_RECD | ALL view describes column object grants for which the current user or PUBLIC is the grantee. USER view describes column object grants for which the current user is the grantee. |
| DBA_TAB_PRIVS<br> ALL_TAB_PRIVS<br> USER_TAB_PRIVS | DBA view lists all grants on all objects in the database. ALL view lists the grants on objects where the user or PUBLIC is the grantee. USER view lists grants on all objects where the current user is the grantee. |
| ALL_TAB_PRIVS_MADE<br> USER_TAB_PRIVS_MADE | ALL view lists the all object grants made by the current user or made on the objects owned by the current user. USER view lists grants on all objects owned by the current user. |
| ALL_TAB_PRIVS_RECD<br> USER_TAB_PRIVS_RECD | ALL view lists object grants for which the user or PUBLIC is the grantee. USER view lists object grants for which the current user is the grantee. |
| DBA_ROLES | This view lists all roles that exist in the database. |
| DBA_ROLE_PRIVS<br> USER_ROLE_PRIVS | DBA view lists roles granted to users and roles. USER view lists roles granted to the current user. |
| DBA_SYS_PRIVS<br> USER_SYS_PRIVS | DBA view lists system privileges granted to users and roles. USER view lists system privileges granted to the current user. |
| ROLE_ROLE_PRIVS | This view describes roles granted to other roles. Information is provided only about roles to which the user has access. |
| ROLE_SYS_PRIVS | This view contains information about system privileges granted to roles. Information is provided only about roles to which the user has access. |
| ROLE_TAB_PRIVS | This view contains information about object privileges granted to roles. Information is provided only about roles to which the user has access. |
| SESSION_PRIVS | This view lists the privileges that are currently enabled for the user. |
| SESSION_ROLES | This view lists the roles that are currently enabled for the user. |

> [!TIP] 
> There are equivalent Azure Synapse permissions for basic database operations such as DML and DDL.

Oracle supports various types of privilege:

**System privileges**: These privileges allow the grantee to perform standard administrator tasks in the database. These privileges are generally restricted to only trusted users, and many of them are specific to Oracle operations.

**Object privileges**: Each type of object has privileges associated with it.

**Table privileges**: These privileges enable security at the DML (data manipulation language) or DDL (data definition language) level. They can be mapped directly to their equivalent in Azure Synapse.

**View privileges**: You can apply DML object privileges to views, similar to tables. These privileges can be mapped directly to their equivalent in Azure Synapse.

**Procedure privileges**: Procedures, including standalone procedures and functions, can be granted to the EXECUTE privilege. They can be mapped directly to their equivalent in Azure Synapse.

**Type privileges**: You can grant system privileges to named types (object types, VARRAYs, and nested tables). These privileges are typically specific to Oracle features that have no equivalent in Azure Synapse.

These tables list common Oracle privileges that have a direct equivalent in Azure Synapse. Migration of these privileges could be automated by generating equivalent scripts for Synapse from the Oracle catalog tables as described above.

| **Admin privilege** | **Description** | **Synapse equivalent** |
|--|--|--|
| \[Create\] Database | Allows the user to create databases. Permission to operate on existing databases is controlled by object privileges. | CREATE DATABASE | 
| \[Create\] External Table | Allows the user to create external tables. Permission to operate on existing tables is controlled by object privileges. | CREATE TABLE |
| \[Create\] Function | Allows the user to create user-defined functions (UDFs). Permission to operate on existing UDFs is controlled by object privileges. | CREATE FUNCTION |
| \[Create\] Role | Allows the user to create groups. Permission to operate on existing groups is controlled by object privileges. | CREATE ROLE |
| \[Create\] Index | For system use only. Users can't create indexes. | CREATE INDEX |
| \[Create\] Materialized View | Allows the user to create materialized views. | CREATE VIEW |
| \[Create\] Procedure | Allows the user to create stored procedures. Permission to operate on existing stored procedures is controlled by object privileges. | CREATE PROCEDURE |
| \[Create\] Schema | Allows the user to create schemas. Permission to operate on existing schemas is controlled by object privileges. | CREATE SCHEMA |
| \[Create\] Table | Allows the user to create tables. Permission to operate on existing tables is controlled by object privileges. | CREATE TABLE |
| \[Create\] Temporary Table | Allows the user to create temporary tables. Permission to operate on existing tables is controlled by object privileges. | CREATE TABLE |
| \[Create\] User | Allows the user to create users. Permission to operate on existing users is controlled by object privileges. | CREATE USER |
| \[Create\] View | Allows the user to create views. Permission to operate on existing views is controlled by object privileges. | CREATE VIEW |

| **Object Privilege** | **Description** | **Synapse Equivalent** |
|--|--|--|
| Alter | Allows the user to modify object attributes. Applies to all objects. | ALTER |
| Delete | Allows the user to delete table rows. Applies only to tables. | DELETE |
| Drop | Allows the user to drop objects. Applies to all object types. | DROP |
| Execute | Allows the user to run user-defined functions, user-defined aggregates, or stored procedures. | EXECUTE |
| Insert | Allows the user to insert rows into a table. Applies only to tables. | INSERT |
| List | Allows the user to display an object name, either in a list or in another manner. Applies to all objects. | LIST |
| Select | Allows the user to select (or query) rows within a table. Applies to tables and views. | SELECT |
| Truncate | Allows the user to delete all rows from a table. Applies only to tables. | TRUNCATE |
| Update | Allows the user to modify table rows. Applies to tables only. | UPDATE |

For more full details of Azure Synapse permissions, see [Database engine permissions](/sql/relational-databases/security/permissions-database-engine.md).

#### Migrating users, roles, and privileges

You've seen that CREATE USER, CREATE ROLE, and GRANT SQL commands are commonly used to create and manage users, roles, and privileges in Oracle and Azure Synapse. While many Oracle-specific operations, typically involving system management, also have grantable privileges, these operations don't need to be migrated to Synapse since they're either not applicable or the equivalent functionality is automatic or managed outside the database.

However, at the core of an Oracle data warehouse, there's a subset of privileges that have a direct equivalent in the Azure Synapse environment. You can automate the migration of these privileges. If you intend to maintain the existing environment in terms of users, roles, and privileges into the new Azure Synapse environment, you can automate migration using the following process:

1. Migrate Oracle schema, table, and view definitions to Synapse environment. At this point, only the table definitions are required. For example, no data needs to be moved.

2. Extract the existing user IDs for migration from the Oracle system tables, generate a script of CREATE USER statements for Synapse, and then run that script. Passwords can't be extracted, so some method of generating new initial passwords must be incorporated.

3. Extract the existing roles from the Oracle system tables, generate a script of equivalent CREATE ROLE statements, and then run this script in the Synapse environment.

4. Extract the user/role combinations from the Oracle system tables, generate a script with the equivalent GRANT or roles to users in Synapse, and then run that script.

5. Finally, extract the relevant privilege information from the Oracle system tables, then generate a script to GRANT the appropriate privileges to the users and roles in Synapse.

## Operational considerations

This section discusses how typical Oracle operational tasks can be implemented in Azure Synapse with minimal risk and impact to users.

As with all data warehouse products, there are ongoing management tasks that are necessary to keep the system running efficiently in production and to provide data for monitoring and auditing. Resource utilization and capacity planning for future growth also fall into this category, as does backup/restore of data.

> [!TIP]
> Operational tasks are necessary to keep any data warehouse operating efficiently.

Oracle administration tasks typically fall into two categories:

- **System administration**: Managing the hardware, configuration settings, system status, access, disk space, usage, upgrades, and other tasks.

- **Database administration**: Managing the user databases and their content, loading data, backing up data, restoring data, and controlling access to data and permissions.

Oracle offers several ways or interfaces that you can use to perform the various system and database management tasks:

- Oracle Enterprise Manager is Oracle's on-premises management platform. It provides a single pane of glass for managing all of a customer's Oracle deployments, whether in their data centers or in the Oracle Cloud. Through deep integration with Oracle's product stack, Enterprise Manager provides management and automation support for Oracle applications, databases, middleware, hardware, and engineered systems.

- Oracle Instance Manager provides a GUI for high-level administration of Oracle instances. Instance Manager enables tasks such as startup, shutdown, and log viewing.

- Oracle Database Configuration Assistant is a GUI that allows management and configuration of various database features and functionality.

- The SQL commands support administration tasks and queries within a SQL database session. You can run SQL commands from the SQL\*Plus command interpreter, SQL Developer GUI, or through SQL APIs such as ODBC, JDBC, and the OLE DB Provider. You must have a database user account to run SQL commands, with appropriate permissions for the queries and tasks that you perform.

While the management and operations tasks for different data warehouse are similar in concept, the individual implementations may be different. Modern cloud-based products, such as Azure Synapse, tend to incorporate a more automated and "system managed" approach (as opposed to a more "manual" approach in legacy data warehouses such as Oracle).

The following sections compare Oracle and Azure Synapse options for various operational tasks.

### Housekeeping tasks

In most legacy data warehouse environments, regular "housekeeping" tasks are time-consuming. You can reclaim disk storage space by removing old versions of updated or deleted rows, or by reorganizing data, log files, or index blocks for efficiency (for example, ALTER TABLE.... SHRINK SPACE in Oracle).

> [!TIP]
> Housekeeping tasks keep a production warehouse operating efficiently and optimize use of resources such as storage.

Collecting statistics is also a potentially time-consuming task, required after a bulk data ingest to provide the query optimizer with up-to-date data on which to base query execution plans.

Oracle introduced a feature called the [Optimizer Statistics Advisor](https://docs.oracle.com/en/database/oracle/oracle-database/19/tgsql/optimizer-statistics-advisor.html), which works through a list of rules provided by Oracle that represent "best practices" for optimizer statistics. The advisor checks each rule and, where necessary, generates findings, recommendations, and actions that involve calls to the DBMS_STATS package to take corrective measures. The list of rules can be displayed using the V$STATS_ADVISOR_RULES view as shown:

:::image type="content" source="../media/3-security-access-operations/optimizer-statistics-advisor-rules.png" border="true" alt-text="Screenshot showing how to display a list of rules by using the Optimizer Statistics Advisor.":::

> [!TIP]
> Automate and monitor housekeeping tasks in Azure.

An Oracle database contains many log tables in the data dictionary that accumulate data, either automatically or after certain features are enabled. Because log data grows over time, purge older information to avoid using up permanent space. There are options to automate the maintenance of these logs available.

Azure Synapse can automatically create statistics so that they can be used as needed. You can defragment indexes and data blocks manually, on a scheduled basis, or automatically. Using native built-in Azure capabilities can reduce the effort required in a migration exercise.

### Monitoring and auditing

The Oracle Enterprise Manager includes facilities to monitor various aspects of one or more Oracle systems, including activity, performance, queuing, and resource utilization. Oracle Enterprise Manager has an interactive GUI that allows users to drill down into low-level detail for any chart.

> [!TIP]
> Oracle Enterprise Manager is the recommended method of monitoring and logging of Oracle systems.

An overview of the monitoring environment for an Oracle warehouse is shown in the diagram:

:::image type="content" source="../media/3-security-access-operations/oracle-warehouse-overview.png" border="true" alt-text="Diagram showing an overview of the monitoring environment for an Oracle warehouse.":::

Similarly, Azure Synapse provides a rich monitoring experience within the Azure portal to provide insights into your data warehouse workload. The Azure portal is the recommended tool when monitoring your data warehouse, since it provides configurable retention periods, alerts, recommendations, and customizable charts and dashboards for metrics and logs.

> [!TIP]
> The Azure portal provides a UI to manage monitoring and auditing tasks for all Azure data and processes.

The Azure portal can also provide recommendations for performance enhancements:

:::image type="content" source="../media/3-security-access-operations/azure-portal-recommendations.png" border="true" alt-text="Screenshot of Azure portal recommendations for performance enhancements.":::

The portal also enables integration with other Azure monitoring services, such as Operations Management Suite (OMS) and Azure Monitor (logs), to provide a holistic monitoring experience for not only the data warehouse but also the entire Azure analytics platform for an integrated monitoring experience.

For more information, see [Azure Synapse operations and management options](../../sql-data-warehouse/sql-data-warehouse-how-to-manage-and-monitor-workload-importance.md).

### High availability (HA) and disaster recovery (DR)

Oracle originally became available in 1979 and has evolved since then to incorporate many features required by enterprise customers, including options for high availability and disaster recovery. The latest announcement in this area is Maximum Availability Architecture (MAA), which includes reference architectures for four levels of high availability and disaster recovery:

    Bronze Tier: A single-instance HA architecture
    Silver Tier: High availability with automatic failover
    Gold Tier: Comprehensive high availability and disaster recovery
    Platinum Tier: Zero outage for platinum-ready applications

> [!TIP]
> Azure Synapse creates snapshots automatically to ensure fast recovery time.

Azure Synapse uses database snapshots to provide high availability of the warehouse. A data warehouse snapshot creates a restore point that can be used to recover or copy a data warehouse to a previous state. Since Azure Synapse is a distributed system, a data warehouse snapshot consists of many files that are in Azure Storage. Snapshots capture incremental changes from the data stored in your data warehouse.

> [!TIP]
> User-defined snapshots can be used to define a recovery point before key updates.

Azure Synapse automatically takes snapshots throughout the day, creating restore points that are available for seven days. You can't change this retention period. Azure Synapse supports an eight-hour recovery point objective (RPO). A data warehouse can be restored in the primary region from any one of the snapshots taken in the past seven days.

> [!TIP]
> Microsoft Azure provides automatic backups to a separate geographical location to enable DR.

User-defined restore points are also supported, which allows manual triggering of snapshots to create restore points of a data warehouse before and after large modifications. This capability ensures that restore points are logically consistent, which provides additional data protection in case of workload interruptions or user errors for a desired RPO less than eight hours.

In addition to snapshots, Azure Synapse performs a standard geo-backup once per day to a [paired data center](/azure/availability-zones/cross-region-replication-azure). The RPO for a geo-restore is 24 hours. You can restore the geo-backup to a server in any other region where Azure Synapse is supported. A geo-backup ensures that a data warehouse can be restored in case the restore points in the primary region aren't available.

### Workload management

Oracle provides utilities such as Enterprise Manager and Database Resource Manager (DBRM) for managing workloads. These utilities include features such as load balancing across large clusters, parallel query execution, performance measurement, and prioritization.

> [!TIP]
> A production data warehouse typically has mixed workloads with different resource usage characteristics running concurrently.

Many of these features can be automated so that the system becomes (to a degree) self-tuning.

> [!TIP]
> Low-level and system-wide metrics are automatically logged within Azure.

Resource utilization statistics for Azure Synapse are automatically logged within the system. The metrics include usage statistics for CPU, memory, cache, I/O, and temporary workspace for each query. Connectivity information (for example, failed connection attempts) is also logged.

The basic workload management concepts within Synapse are:

1. Workload classification: To assign a request to a workload group and setting importance levels.

2. Workload importance: To influence the order in which a request gets access to resources. By default, queries are released from the queue on a first-in, first-out basis as resources become available. Workload importance allows higher priority queries to receive resources immediately regardless of queue.

3. Workload isolation: To reserve resources for a workload group. Maximum and minimum usage can be assigned for varying resources. The amount of resources a group of requests can consume can be limited, and a timeout value can be set to automatically kill runaway queries.

Azure Synapse provides a set of Dynamic Management Views (DMVs) for monitoring of all aspects of workload management. These views are useful when actively troubleshooting and identifying performance bottlenecks with your workload.

In Azure Synapse, resource classes are pre-determined resource limits that govern compute resources and concurrency for query execution. Resource classes can help you manage your workload by setting limits on the number of queries that run concurrently and on the compute resources assigned to each query. There's a trade-off between memory and concurrency.

See [Workload management with resource classes in Azure Synapse Analytics](../../sql-data-warehouse/resource-classes-for-workload-management.md) for detailed information.

The collected information can be used for capacity planning, for example, determining the resources required for additional users or application workload. You can also use it to plan scale up or scale down of compute resources for cost-effective support of "peaky" workloads.

### Scale compute resources

The architecture of Azure Synapse separates storage and compute, allowing each to scale independently. As a result, [compute resources can be scaled](../../sql-data-warehouse/quickstart-scale-compute-portal.md) to meet performance demands independent of data storage. You can also pause and resume compute resources. A natural benefit of this architecture is that billing for compute and storage is separate. If a data warehouse isn't in use, you can save on compute costs by pausing compute.

> [!TIP]
> A major benefit of Azure is the ability to independently scale up and down compute resources on demand to handle peaky workloads cost-effectively.

Compute resources can be scaled up or scaled back by adjusting the data warehouse units setting for the data warehouse. Loading and query performance will increase linearly as you add more data warehouse units.

Adding more compute nodes adds more compute power and ability to use more parallel processing. As the number of compute nodes increases, the number of distributions per compute node decreases, providing more compute power and parallel processing for queries. Similarly, decreasing data warehouse units reduces the number of compute nodes, which reduces the compute resources for queries.

## Next steps

To learn more about minimizing SQL issues, see the next article in this series: [Minimizing SQL issues for Oracle migrations](5-minimize-sql-issues.md).