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

This article looks at the security and operational aspects of migration from a legacy Oracle data warehouse and data marts to Azure Synapse. This article applies specifically to migrations from an existing Oracle environment and assumes there is requirement to migrate the existing users, roles and permissions as-is.

This section addresses the possible methods of authentication for existing legacy Oracle environments and how these can be migrated to Azure Synapse with least risk and impact to users.

It is assumed that there is a requirement to migrate the existing methods of connection and user/role/permission structure 'as-is'. If this is not the case, then Azure utilities (e.g. Azure Portal) can be used to create and manage a new security regime.

For more information on the Azure Synapse security options, see [Secure a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics](../../sql-data-warehouse/sql-data-warehouse-overview-manage-security.md#authorization).

### Connection and authentication

Authentication in both Oracle and Azure Synapse can be 'in database' or via external methods

#### Oracle authorization options

Authentication is the process of verifying the identity of a user, device, or other entity in a computer system, generally as a prerequisite to granting access to resources in a system. The Oracle system offers several authentication methods for database users:

##### Database authentication

With this approach administration of the user account including authentication of that user is performed entirely by Oracle database. To have Oracle database authenticate a user, a password for the user is specified when the user is created (or altered). Users can change their password at any time. Passwords are stored in an encrypted format and Oracle recommends the use of password management, including account locking, password aging and expiration, password history, and password complexity verification. This method is very common in older Oracle installations.

##### External authentication

With external authentication for a user, the user account is maintained by Oracle database, but password administration and user authentication is performed by an external service. This external service can be the operating system or a network service, such as Oracle Net. The database relies on the underlying operating system or network authentication service to restrict access to database accounts. A database password is not used for this type of login. There are 2 external authentication options:

###### Operating System Authentication

By default, Oracle allows operating-system-authenticated logins only over secure connections, which precludes using Oracle Net and a shared server configuration. This default restriction prevents a remote user from impersonating another operating system user over a network connection.

###### Network Authentication

With this approach, more choices of authentication mechanism are available, such as smart cards, fingerprints, Kerberos, or the operating system. Many network authentication services, such as Kerberos support single sign-on, enabling users to have fewer passwords to remember.

##### Global Authentication and Authorization 

Oracle Advanced Security enables centralized management of user-related information, including authorizations, in an LDAP-based directory service. Users can be identified in the database as global users, meaning that they are authenticated by SSL and that the management of these users is done outside of the database by the centralized directory service. This approach provides strong authentication using SSL, Kerberos, or Windows native authentication and enables centralized management of users and privileges across the enterprise. Is easy to administer in that it is not necessary to create a schema for every user in every database in the enterprise and also facilitates single sign-on so that users only need to sign on once to access multiple databases and services.

##### Proxy Authentication and Authorization 

It is possible to designate a middle-tier server to proxy clients in a secure fashion. Oracle provides various options for proxy authentication: The middle-tier server can authenticate itself with the database server and a client, in this case an application user or another application, authenticates itself with the middle-tier server. Client identities can be maintained all the way through to the database. The client, in this case a database user, is not authenticated by the middle-tier server. The client's identity and database password are passed through the middle-tier server to the database server for authentication. The client, in this case a global user, is authenticated by the middle-tier server, and passes either a Distinguished Name (DN) or Certificate through the middle tier for retrieving the client\'s user name.

#### Azure Synapse authorization options

Azure Synapse supports 2 basic options for connection and authorization -- SQL Authentication and Azure Active Directory (AAD) authentication.

- **SQL authentication** -- this is authentication via a database connection which includes a database identifier, user ID and password plus other optional parameters. This is functionally equivalent to Oracle database connections above.

- **Azure Active Directory (AAD) authentication** - With Azure Active Directory authentication, you can centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage Azure Synapse users and simplifies permission management. AAD can also support connections to LDAP and Kerberos services, so for example this method can be used to connect to existing LDAP directories if these are to remain in place after migration of the database.

### Users, roles and permissions

Planning is essential for a successful migration project -starting with high level approach decisions

Automation of migration processes is recommended if possible to reduce elapsed time and scope for error

Both Oracle and Azure Synapse implement database access control via a combination of users, roles and permissions, using standard SQL CREATE USER and CREATE ROLE/GROUP statements to define users and roles and GRANT and REVOKE statements to assign or remove permissions to those users and/or roles.

Therefore conceptually the 2 databases are very similar, and so it may be possible to automate the migration of existing user ids, groups and permissions to some degree by extracting the existing legacy user and group information from the Oracle system catalog tables and generating matching equivalent CREATE USER and CREATE ROLE statements to be run in the Azure Synapse to recreate the same user/role hierarchy.

Once this is in place, Oracle system catalog tables can again be used to generate equivalent GRANT statements to assign permissions (where an equivalent one exists).

:::image type="content" source="../media/3-security-access-operations/automating-migration-privileges.png" border="true" alt-text="Chart showing how to automate the migration of privileges from an existing system.":::

See following sections for more details.

#### Users and roles

Migration of a data warehouse requires more than just tables, views and SQL statements

The information about current users and groups in an Oracle system is held in system catalog views ALL_USERS or DBA_USERS. These views can be queried in the normal way via SQL\*Plus or SQL Developer.

See below for some basic examples:

\-- List of users select \* from dba_users order by username; \--List of roles select \* from dba_roles order by role; \--List of users and their associated roles select \* from user_role_privs order by username, granted_role;

SQL Developer also has built-in options to display this information in the 'Reports' section -- see example screen shot below:

:::image type="content" source="../media/3-security-access-operations/oracle-sql-developer-reports-1.png" border="true" alt-text="Screenshot showing a Reports view for user roles in Oracle SQL Developer.":::

The example SELECT statement can be modified to produce a result set which is a series of CREATE USER and CREATE GROUP statements by including the appropriate text as a literal within the SELECT statement.

Note that there is no way to retrieve existing passwords so a scheme for allocating new initial passwords on the Azure Synapse will need to be implemented.

#### Permissions

Migration of a data warehouse requires more than just tables, views and SQL statements

In an Oracle system, the access rights for users and roles are held in the system view DBA_ROLE_PRIVS. This view can be queried (assuming that the user has SELECT access to those tables) to obtain current lists of access rights defined within the system:

:::image type="content" source="../media/3-security-access-operations/oracle-sql-developer-reports-2.png" border="true" alt-text="Screenshot showing a Reports view for user access rights in Oracle SQL Developer.":::

Queries can be created to produce a script which is a series of CREATE and GRANT statements for Azure Synapse based on the existing Oracle privileges:

:::image type="content" source="../media/3-security-access-operations/oracle-sql-developer-reports-3.png" border="true" alt-text="Screenshot showing how to create a script of CREATE and GRANT statements in Oracle SQL Developer.":::

To summarize -- the views required to view user, role and privilege information are listed below:

&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; **View** **Description** &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;-- DBA_COL_PRIVS DBA view describes all column object grants in the database. ALL view describes all column object grants for which the current user or PUBLIC is the object owner, grantor, or grantee. USER view describes column object grants for which the current user is the object owner, grantor, or grantee.

ALL_COL_PRIVS 

USER_COL_PRIVS 

ALL_COL_PRIVS_MADE ALL view lists column object grants for which the current user is object owner or grantor. USER view describes column object grants for which the current user is the grantor.

USER_COL_PRIVS_MADE 

ALL_COL_PRIVS_RECD ALL view describes column object grants for which the current user or PUBLIC is the grantee. USER view describes column object grants for which the current user is the grantee.

USER_COL_PRIVS_RECD 

DBA_TAB_PRIVS DBA view lists all grants on all objects in the database. ALL view lists the grants on objects where the user or PUBLIC is the grantee. USER view lists grants on all objects where the current user is the grantee.

ALL_TAB_PRIVS 

USER_TAB_PRIVS 

ALL_TAB_PRIVS_MADE ALL view lists the all object grants made by the current user or made on the objects owned by the current user. USER view lists grants on all objects owned by the current user.

USER_TAB_PRIVS_MADE 

ALL_TAB_PRIVS_RECD ALL view lists object grants for which the user or PUBLIC is the grantee. USER view lists object grants for which the current user is the grantee.

USER_TAB_PRIVS_RECD 

DBA_ROLES This view lists all roles that exist in the database.

DBA_ROLE_PRIVS DBA view lists roles granted to users and roles. USER view lists roles granted to the current user.

USER_ROLE_PRIVS 

DBA_SYS_PRIVS DBA view lists system privileges granted to users and roles. USER view lists system privileges granted to the current user.

USER_SYS_PRIVS 

ROLE_ROLE_PRIVS This view describes roles granted to other roles. Information is provided only about roles to which the user has access.

ROLE_SYS_PRIVS This view contains information about system privileges granted to roles. Information is provided only about roles to which the user has access.

ROLE_TAB_PRIVS This view contains information about object privileges granted to roles. Information is provided only about roles to which the user has access.

SESSION_PRIVS This view lists the privileges that are currently enabled for the user.

SESSION_ROLES This view lists the roles that are currently enabled to the user. &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;

: Descriptions of Data Dictionary ViewsThis table lists and describes the data dictionary views that contain information about grants of privileges and roles.

There are generally equivalent in Azure Synapse permissions for basic database operations such as DML and DDL

Oracle supports various types of privilege:

**System privileges**. These privileges allow the grantee to perform standard administrator tasks in the database. These are generally restricted to only to trusted users and many of them are specific to Oracle operations.

**Object privileges**. Each type of object has privileges associated with it.

**Table privileges**. These privileges enable security at the DML (data manipulation language) or DDL (data definition language) level -- these can be mapped directly to their equivalent in Azure Synapse.

**View privileges**. You can apply DML object privileges to views, similar to tables -- these can be mapped directly to their equivalent in Azure Synapse.

**Procedure privileges**. Procedures, including standalone procedures and functions, can be granted the EXECUTE privilege -- these can be mapped directly to their equivalent in Azure Synapse.

**Type privileges**. You can grant system privileges to named types (object types, VARRAYs, and nested tables). These are typically specific to Oracle features that have no equivalent in Azure Synapse.

See the table below for a list of common Oracle privileges which have a direct equivalent in Azure Synapse. Migration of these privileges could be automated by generating equivalent scripts for Synapse from the Oracle catalog tables as described above.

&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; Admin Privilege Description Synapse Equivalent &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;- &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;- &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;-- \[Create\] Database Allows the user to create CREATE DATABASE databases. Permission to operate on existing databases is controlled by object privileges. 

\[Create\] External Allows the user to create CREATE TABLE Table external tables. Permission to operate on existing tables is controlled by object privileges. 

\[Create\] Function Allows the user to create CREATE FUNCTION user-defined functions (UDFs). Permission to operate on existing UDFs is controlled by object privileges. 

\[Create\] Role Allows the user to create CREATE ROLE groups. Permission to operate on existing groups is controlled by object privileges. 

\[Create\] Index For system use only. Users CREATE INDEX cannot create indexes. 

\[Create\] Allows the user to create CREATE VIEW Materialized View materialized views. 

\[Create\] Allows the user to create CREATE PROCEDURE Procedure stored procedures. Permission to operate on existing stored procedures is controlled by object privileges. 

\[Create\] Schema Allows the user to create CREATE SCHEMA schemas. Permission to operate on existing schemas is controlled by object privileges. 

\[Create\] Table Allows the user to create CREATE TABLE tables. Permission to operate on existing tables is controlled by object privileges. 

\[Create\] Allows the user to create CREATE TABLE Temporary Table temporary tables. Permission to operate on existing tables is controlled by object privileges. 

\[Create\] User Allows the user to create CREATE USER users. Permission to operate on existing users is controlled by object privileges. 

\[Create\] View Allows the user to create CREATE VIEW views. Permission to operate on existing views is controlled by object privileges. 

Object Privilege **Description** **Synapse Equivalent**

Alter Allows the user to modify ALTER object attributes. Applies to all objects. 

Delete Allows the user to delete table DELETE rows. Applies only to tables. 

Drop Allows the user to drop DROP objects. Applies to all object types. 

Execute Allows the user to run EXECUTE user-defined functions, user-defined aggregates, or stored procedures. 

Insert Allows the user to insert rows INSERT into a table. Applies only to tables. 

List Allows the user to display an LIST object name, either in a list or in another manner. Applies to all objects. 

Select Allows the user to select (or SELECT query) rows within a table. Applies to tables and views. 

Truncate Allows the user to delete all TRUNCATE rows from a table. Applies only to tables. 

Update Allows the user to modify table UPDATE rows. Applies to tables only. &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;

For more full details of Azure Synapse permissions, see [Database Engine Permissions](/sql/relational-databases/security/permissions-database-engine.md).

#### Migrating Users, Roles and Privileges

Migration of a data warehouse requires more than just tables, views and SQL statements

As described above, there is a common approach for creating and managing users, roles and privileges in Oracle and Azure Synapse via the CREATE USER, CREATE ROLE and GRANT SQL commands. While there are many Oracle-specific (typically system management) operations which also have grantable privileges, these don't need to be migrated to Synapse as they are either not applicable or the equivalent functionality is either automatic or managed outside the database.

However, at the core of an Oracle data warehouse there is a subset of the privileges that have a direct equivalent in the Azure Synapse environment, and migration of these can be automated. Therefore, if the intention is to maintain the existing environment in terms of users, roles and privileges into the new Azure Synapse environment the migration of these can be automated by the following process:

1. Migrate Oracle schema, table and view definitions to Synapse environment. At this point, only the table definitions are required, i.e. no data needs to be moved.

2. Extract the existing user IDs for migration from the Oracle system tables, generating a script of CREATE USER statements for Synapse and then run that script. Note that existing passwords cannot be extracted so some method of generating new initial passwords must be incorporated.

3. Extract the existing roles from the Oracle system tables and generate a script of the equivalent CREATE ROLE statements then run this in the Synapse environment.

4. Extract the user/role combinations from the Existing Oracle system tables and generate a script with the equivalent GRANT or roles to users in Synapse then run that script.

5. Finally extract the relevant privilege information from the Oracle system tables and generate a script to GRANT the appropriate privileges to the users and roles in Synapse.

## Operational considerations

Operational tasks are necessary to keep any data warehouse operating efficiently

This section discusses how typical Oracle operational tasks can be implemented in Azure Synapse with least risk and impact to users.

As with all data warehouse products, once in production there are ongoing management tasks which are necessary to keep the system running efficiently and to provide data for monitoring and auditing. Resource utilization and capacity planning for future growth also falls into this category, as does backup/restore of data.

Oracle administration tasks typically fall into two categories:

##### System administration

Managing the hardware, configuration settings, system status, access, disk space, usage, upgrades, and other tasks

##### Database administration

Managing the user databases and their content, loading data, backing up data, restoring data, controlling access to data and permissions

Oracle offers several methods or interfaces that you can use to perform the various system and database management tasks:

- Oracle Enterprise Manager is Oracle's on-premises management platform, providing a single pane of glass for managing all of a customer\'s Oracle deployments, whether in their data centers or in the Oracle Cloud. Through deep integration with Oracle's product stack, Enterprise Manager provides management and automation support for Oracle applications, databases, middleware, hardware and engineered systems.

- Oracle Instance Manager provides a GUI for high-level administration of Oracle instances -- enabling tasks such as startup, shutdown and log viewing.

- Oracle Database Configuration Assistant is a GUI which allows management and configuration of various database features and functionality.

- The SQL commands support administration tasks and queries within a SQL database session. You can run the SQL commands from the SQL\*Plus command interpreter, SQL Developer GUI or through SQL APIs such as ODBC, JDBC, and the OLE DB Provider. You must have a database user account to run the SQL commands with appropriate permissions for the queries and tasks that you perform.

While conceptually the management and operations tasks for different data warehouse are similar, the individual implementations may be very different. In general, modern cloud-based products such as Azure Synapse tend to incorporate a more automated and 'system managed' approach (as opposed to a more 'manual' approach in legacy data warehouses such as Oracle).

The following sections compare Oracle and Azure Synapse options for various operational tasks.

### Housekeeping tasks

Housekeeping tasks keep a production warehouse operating efficiently and optimize use of resources such as storage

In most legacy data warehouse environments there is a requirement to perform regular 'housekeeping' tasks such as reclaiming disk storage space that can be freed up by removing old versions of updated or deleted rows or reorganizing data, log file or index blocks for efficiency (e.g. ALTER TABLE.... SHRINK SPACE in Oracle).

Collecting statistics is also a potentially time-consuming task which is required after bulk data ingest to provide the query optimizer with up to date data on which to base generation of query execution plans.

In version 12c Release 2 Oracle introduced a new feature called the Optimizer Statistics Advisor -- this works through a list of rules provided by Oracle, which represent \"best practices\" for optimizer statistics. It checks each rule and where necessary generates findings, recommendations and actions involving calls to the DBMS_STATS package to take corrective measures. The list of rules can be displayed using the V\$STATS_ADVISOR_RULES view as shown in the example below:

:::image type="content" source="../media/3-security-access-operations/optimizer-statistics-advisor-rules.png" border="true" alt-text="Screenshot showing how to display a list of rules by using the the Optimizer Statistics Advisor.":::

Housekeeping tasks can be automated and monitored in Azure

An Oracle database contains many log tables in the Data Dictionary and external files that accumulate data, either automatically or after certain features are enabled. Because log data grows over time, older information must be purged to avoid using up permanent space. There are options to automate the maintenance of these logs available.

Azure Synapse has an option to collect statistics automatically so that no specific tasks to do this (e.g. as part of an ETL pipeline) are required. Defragmentation of indexes and data blocks can also be performed manually, on a scheduled basis or automatically as required.

Again, leveraging these Azure native built-in capabilities can reduce the effort required in a migration exercise.

### Monitoring and auditing

Oracle Enterprise Manager is the recommended method of monitoring and logging of Oracle systems

Oracle's Enterprise Manager includes facilities to monitor various aspects of one or more Oracle systems including activity, performance, queuing and resource utilization. This is an interactive GUI which allows users to drill down into low level detail for any chart.

An overview of the monitoring environment for an Oracle warehouse is shown in the diagram below:

:::image type="content" source="../media/3-security-access-operations/oracle-warehouse-overview.png" border="true" alt-text="Diagram showing an overview of the monitoring environment for an Oracle warehouse.":::

Azure Portal provides a GUI to manage monitoring and auditing tasks for all Azure data and processes

Similarly, Azure Synapse provides a rich monitoring experience within the Azure Portal to surface insights to your data warehouse workload. The Azure portal is the recommended tool when monitoring your data warehouse as it provides configurable retention periods, alerts, recommendations, and customizable charts and dashboards for metrics and logs.

The Azure Portal can also provide recommendations for performance enhancements as shown in the screenshot below:

:::image type="content" source="../media/3-security-access-operations/azure-portal-recommendations.png" border="true" alt-text="Screenshot of Azure Portal recommendations for performance enhancements.":::

The portal also enables integration with other Azure monitoring services such as Operations Management Suite (OMS) and Azure Monitor (logs) to provide a holistic monitoring experience for not only the data warehouse but also the entire Azure analytics platform for an integrated monitoring experience.

For more information on the Azure Synapse operations and management options see [Manage and monitor workload importance in dedicated SQL pool for Azure Synapse Analytics](../../sql-data-warehouse/sql-data-warehouse-how-to-manage-and-monitor-workload-importance.md).

### High Availability (HA) and Disaster Recovery (DR)

Oracle originally became available in 1979 and since then has evolved to incorporate many features required by large enterprise customers including a variety of options for high availability and disaster recovery. The latest announcements in this area is Maximum Availability Architecture (MAA) which incorporates a wide range of options including reference architectures for 4 levels of high availability and disaster recovery:

Bronze Tier -- A Single Instance HA Architecture Silver Tier - High Availability with Automatic Failover Gold Tier - Comprehensive High Availability and Disaster Recovery Platinum Tier - Zero Outage for Platinum Ready Applications

Azure Synapse creates snapshots automatically to ensure a fast recovery time

Azure Synapse uses database snapshots to provide high availability of the warehouse. A data warehouse snapshot creates a restore point which can be used to recover or copy a data warehouse to a previous state. Since Azure Synapse is a distributed system, a data warehouse snapshot consists of many files that are located in Azure storage. Snapshots capture incremental changes from the data stored in your data warehouse.

Azure Synapse automatically takes snapshots throughout the day creating restore points that are available for seven days. This retention period cannot be changed. Azure Synapse supports an eight-hour recovery point objective (RPO). A data warehouse can be restored in the primary region from any one of the snapshots taken in the past seven days.

User-defined snapshots can be used to define a recovery point before key updates

Microsoft Azure provides automatic backups to a separate geographical location to enable DR

User-defined restore points are also supported, allowing manual triggering of snapshots to create restore points of a data warehouse before and after large modifications. This capability ensures that restore points are logically consistent, which provides additional data protection in case of any workload interruptions or user errors for quick recovery time.

As well as the snapshots described above, Azure Synapse also performs as standard a geo-backup once per day to a [paired data center](/azure/availability-zones/cross-region-replication-azure). The RPO for a geo-restore is 24 hours. You can restore the geo-backup to a server in any other region where Azure Synapse is supported. A geo-backup ensures that a data warehouse can be restored in case the restore points in the primary region are not available.

### Workload management

In a production data warehouse there are typically mixed workloads which have different resource usage characteristics running concurrently

Oracle provides utilities such as Enterprise Manager and Database Resource Manager (DBRM) for managing workloads. This includes features such as load balancing across large clusters, parallel query execution, performance measurement and prioritization.

Many of these features can be automated so that the system becomes (to a degree) self-tuning.

Low-level and system-wide metrics are automatically logged within Azure

Resource utilization statistics for the Azure Synapse are automatically logged within the system. The metrics include usage statistics for CPU, memory, cache, I/O and temporary workspace for each query as well as connectivity information (e.g. failed connection attempts).

The basic workload management concepts within Synapse are:

1. Workload Classification -- To assign a request to a workload group and setting importance levels.

2. Workload Importance -- To influence the order in which a request gets access to resources. By default, queries are released from the queue on a first-in, first-out basis as resources become available - Workload importance allows higher priority queries to receive resources immediately regardless of queue

3. Workload Isolation -- To reserve resources for a workload group. Maximum and minimum usage can be assigned for varying resources. The amount of resources a group of requests can consume can be limited, and a timeout value can be set to automatically kill runaway queries

Azure Synapse provides a set of Dynamic Management Views (DMVs) for monitoring of all aspects of workload management. These views are useful when actively troubleshooting and identifying performance bottlenecks with your workload.

In Azure Synapse resource classes are pre-determined resource limits that govern compute resources and concurrency for query execution. Resource classes can help you manage your workload by setting limits on the number of queries that run concurrently and on the compute resources assigned to each query. There\'s a trade-off between memory and concurrency.

See [Workload management with resource classes in Azure Synapse Analytics](../../sql-data-warehouse/resource-classes-for-workload-management.md) for detailed information.

This information can also be used for capacity planning -- i.e. determining the resources required for additional users or application workload. This also applies to planning scale up/scale down of compute resources (see section below) for cost-effective support of 'peaky' workloads.

### Scaling compute resources

A major benefit of Azure is the ability to independently scale up and down compute resources on demand to handle peaky workloads cost-effectively

The architecture of Azure Synapse separates storage and compute, allowing each to scale independently. As a result, compute resources can be scaled to meet performance demands independent of data storage. You can also pause and resume compute resources. A natural consequence of this architecture is that billing for compute and storage is separate. If you don\'t need to use your data warehouse for a while, you can save compute costs by pausing compute.

Compute resources can be scaled out or scaled back by adjusting the data warehouse units setting for the data warehouse. Loading and query performance will increase linearly as more data warehouse units are added.

Adding more compute nodes adds more compute power and ability to leverage more parallel processing. As the number of compute nodes increases, the number of distributions per compute node decreases, providing more compute power and parallel processing for queries. Similarly, decreasing data warehouse units reduces the number of compute nodes, which reduces the compute resources for queries. 

## Next steps

To learn more about minimizing SQL issues, see the next article in this series: [Minimizing SQL issues for Oracle migrations](5-minimize-sql-issues.md).