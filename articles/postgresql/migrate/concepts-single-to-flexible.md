---
title: "Migration tool - Azure Database for PostgreSQL Single Server to Flexible Server - Concepts"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Concepts about migrating your Single server to Azure Database for PostgreSQL Flexible server.
author: shriram-muthukrishnan
ms.author: shriramm
ms.reviewer: maghan
ms.date: 03/31/2023
ms.service: postgresql
ms.topic: conceptual
---

# Migration tool - Azure Database for PostgreSQL Single Server to Flexible Server

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

Azure Database for PostgreSQL powered by the PostgreSQL community edition is available in two deployment modes:
- Flexible Server
- Single Server

Flexible Server is the next generation managed PostgreSQL service in Azure that provides maximum flexibility over your database, built-in cost-optimizations, and offers several improvements over Single Server. We recommend new customers to get started with flexible server and highly recommend existing single server customers to migrate to Flexible server to have the best experience of running PostgreSQL workloads on Azure.

In this article, we provide compelling reasons for single server customers to migrate to flexible server and a walk-through of tackling this migration in a simple, efficient and a hassle-free way.

## Why should you choose Flexible Server?

- **[Superior performance](../flexible-server/overview.md)** - Flexible server runs on Linux VM that is best suited to run PostgreSQL engine as compared to Windows environment, which is the case with Single Server.

- **[Cost Savings](../flexible-server/how-to-deploy-on-azure-free-account.md)** – Flexible server allows you to stop and start server on-demand to lower your TCO. Your compute tier billing is stopped immediately which allows you to have significant cost savings during development, testing and for time-bound predictable production workloads.

- **[Support for new PG versions](../flexible-server/concepts-supported-versions.md)** - Flexible server currently supports PG version 11 and onwards till version 14. Newer community versions of PostgreSQL will only be supported in flexible server.

- **Minimized Latency** – You can collocate your flexible server in the same availability zone as the application server that results in a minimal latency. This option isn't available in Single server.

- **[Connection Pooling](../flexible-server/concepts-pgbouncer.md)** - Flexible server has a built-in connection pooling mechanism using **pgBouncer** that can support thousands of active connections with low overhead.

- **[Server Parameters](../flexible-server/concepts-server-parameters.md)** - Flexible server offers a richer set of server parameters when compared to Single server for server configuration and tuning.

- **[Custom Maintenance Window](../flexible-server/concepts-maintenance.md)** - You can schedule the maintenance window of flexible server for a specific day and time of the week. Single server doesn't have this flexibility.

- **[High Availability](../flexible-server/concepts-high-availability.md)** - Flexible server supports HA within same availability zone and across availability zones by configuring a warm standby server that is in sync with the primary.

- **[Security](../flexible-server/concepts-security.md)** - Flexible server offers multiple layers of information protection and encryption to protect your data.

A feature-set comparison between Single server and Flexible server is available [here](../flexible-server/concepts-compare-single-server-flexible-server.md).

All the learnings acquired by running customer workloads on Azure database for PostgreSQL - Single Server is incorporated into Flexible server and we recommend using Flexible server for all your new PostgreSQL deployments on Azure.

## How to migrate from Single Server to Flexible Server?

Let us first look at the methods you can consider performing the migration from Single server to Flexible server.

**Offline Migration** – In an offline migration, all applications connecting to your single server are stopped and the database(s) is copied to flexible server.

**Online Migration** - In an online migration, applications connecting to your single server aren't stopped while database(s) are copied to flexible server. The initial copy of the databases is followed by replication to keep flexible server in sync with the single server. A cutover is performed when the flexible server is in complete sync with the single server resulting in minimal downtime.

The following table gives an overview of Offline vs Online migration.

| Mode | Pros | Cons |
| :--- | :--- | :--- |
| Offline | - Simple, easy and less complex to execute.<br />- Very fewer chances of failure.<br />- No restrictions in terms of database objects it can handle | Downtime to applications. |
| Online | - Very minimal downtime to application.<br />- Ideal for large databases and for customers having limited downtime requirements.<br />| - Replication used in online migration has multiple restrictions listed in this [doc](https://www.postgresql.org/docs/current/logical-replication-restrictions.html) (e.g Primary Keys needed in all tables)<br />- Tough and much complex to execute than offline migration. <br />- Greater chances of failure due to complexity of migration. <br />There is an impact on the source server's storage and compute if the migration runs for a long time. The impact needs to be monitored closely during migration. |

> [!IMPORTANT]  
> Offline migration is the recommended way to perform migrations from single server to flexible server. Customers should consider online migrations only if their downtime requirements are not met.

The following table lists the different tools available for performing the migration from single server to flexible server.

| Tool | Mode | Pros | Cons |
| :--- | :--- | :--- | :--- |
| Single to Flex Migration tool (**Recommended**) | Offline | - Managed migration service.<br />- No complex setup/pre-requisites required<br />- Simple to use portal-based migration experience<br />- Fast offline migration tool<br />- No limitations in terms of size of databases it can handle. | Downtime to applications. |
| pg_dump and pg_restore | Offline | - Tried and tested tool that has been in use for long time<br />- Suited for databases of size less than 10 GB<br />| - Need prior knowledge of setting up and using this tool<br />- Slow when compared to other tools<br />Significant downtime to your application. |
| Azure DMS | Online | - Minimal downtime to your application<br />- Free of cost | - Complex setup<br />- High chances of migration failures<br />- Can't handle database of sizes > 1 TB<br />- Can't handle write-intensive workload |

The next section of the document gives an overview of the Single to Flex Migration tool, its implementation, limitations, and the experience that makes it the recommended tool to perform migrations from single to flexible server.

> [!NOTE]  
> The Single to Flex Migration tool is available in all Azure regions and currently supports only **Offline** migrations. Support for online migrations will be introduced later in the tool.

## Single to Flexible Migration tool - Overview

The single to flex migration tool is a hosted solution where we spin up a purpose-built docker container in the target Flexible server VM and drive the incoming migrations. This docker container spins up on-demand when a migration is initiated from a single server and gets decommissioned once the migration is completed. The migration container uses a new binary called [pgcopydb](https://github.com/dimitri/pgcopydb) that provides a fast and efficient way of copying databases from one server to another. Though pgcopydb uses the traditional pg_dump and pg_restore for schema migration, it implements its own data migration mechanism that involves multi-process streaming parts from source to target. Also, pgcopydb bypasses pg_restore way of index building and drives that internally in a way that all indexes are built concurrently. So, the data migration process is quicker with pgcopydb. Following is the process diagram of the new version of the migration tool.

:::image type="content" source="./media/concepts-single-to-flexible/concepts-flow-diagram.png" alt-text="Diagram that shows the Migration from Single Server to Flexible Server." lightbox="./media/concepts-single-to-flexible/concepts-flow-diagram.png":::

The following table shows the time for performing offline migrations for databases of various sizes using the single to flex migration tool. The migration was performed using a flexible server with the SKU – **Standard_D4ds_v4(4 cores, 16GB Memory, 128GB disk and 500 iops)**

| Database size | Approximate time taken (HH:MM) |
| :--- | :--- |
| 1 GB | 00:01 |
| 5 GB | 00:03 |
| 10 GB | 00:08 |
| 50 GB | 00:35 |
| 100 GB | 01:00 |
| 500 GB | 04:00 |
| 1,000 GB | 07:00 |

> [!NOTE]  
> The above numbers give you an approximation of the time taken to complete the migration. To get a precise value for migrating your server, we strongly recommend taking a **PITR (point in time restore)** of your single server and running it against the single to flex migration tool.

> [!IMPORTANT]  
> In order to perform faster migrations, pick a higher SKU for your flexible server. You can always change the SKU to match the application needs post migration.

## Migration of users/roles, ownerships and privileges
Along with data migration, the tool automatically provides the following built-in capabilities:
- Migration of users/roles present on your source server to the target server.
- Migration of ownership of all the database objects on your source server to the target server.
- Migration of permissions of database objects on your source server such as GRANTS/REVOKES to the target server.

> [!NOTE]  
> This functionality is enabled only for flexible servers in **Central US**, **Canada Central**, **France Central**, **Japan East** and **Australia East** regions. It will be enabled for flexible servers in other Azure regions soon. In the meantime, you can follow the steps mentioned in this [doc](../single-server/how-to-upgrade-using-dump-and-restore.md#migrate-the-roles) to perform user/roles migration

## Limitations

- You can have only one active migration to your flexible server.
- The source and target server must be in the same Azure region. Cross region migrations is enabled only for servers in China regions.
- The tool takes care of the migration of data and schema. It doesn't migrate managed service features such as server parameters, connection security details and firewall rules.
- The migration tool shows the number of tables copied from source to target server. You need to manually validate the data in target server post migration.
- The tool only migrates user databases and not system databases like template_0, template_1, azure_sys and azure_maintenance.

> [!NOTE]  
> The following limitations are applicable only for flexible servers on which the migration of users/roles functionality is enabled.

- AAD users present on your source server will not be migrated to target server. To mitigate this limitation, manually create all AAD users on your target server using this [link](../flexible-server/how-to-manage-azure-ad-users.md) before triggering a migration. If AAD users are not created on target server, migration will fail with appropriate error message.
- If the target flexible server uses SCRAM-SHA-256 password encryption method, connection to flexible server using the users/roles on single server will fail since the passwords are encrypted using md5 algorithm. To mitigate this limitation, please choose the option **MD5** for **password_encryption** server parameter on your flexible server.
- Though the ownership of database objects such as tables, views, sequences, etc. are copied to the target server, the owner of the database in your target server will be the migration user of your target server. The limitation can be mitigated by executing the following command 

```sql
    ALTER DATABASE <dbname> OWNER TO <user>;
```
 Make sure the user executing the above command is a member of the user to which ownership is being assigned to. This limitation will be fixed in the upcoming releases of the migration tool to match the database owners on your source server.
## Experience

Get started with the Single to Flex migration tool by using any of the following methods:

- [Migrate using the Azure portal](../migrate/how-to-migrate-single-to-flexible-portal.md)
- [Migrate using the Azure CLI](../migrate/how-to-migrate-single-to-flexible-cli.md)

## Best practices

Here, we go through the phases of an overall database migration journey, with guidance on how to use Single to Flex migration tool in the process.

### Pre migration

#### Application compatibility

Single server supports PG version 9.6,10 and 11 while Flexible server supports PG version 11, 12, 13 and 14. Given the differences in supported versions, you might be moving across versions while migrating from single to flexible server. If that is the case, make sure your application works well with the version of flexible server you're trying to migrate to. If there are breaking changes, make sure to fix them on your application before migrating to flexible server. Use this [link](https://www.postgresql.org/docs/14/appendix-obsolete.html) to check for any breaking changes while migrating to the target version.

#### Database migration planning

The most important thing to consider for performing offline migration using the single to flex migration tool is the downtime incurred by the application.

##### How to calculate the downtime?

In most cases, the non-prod servers (dev, UAT, test, staging) are migrated using offline migrations. Since these servers have less data than the production servers, the migration completes fast. For migration of production server, you need to know the time it would take to complete the migration to plan for it in advance.

The time taken for an offline migration to complete is dependent on several factors that includes the number of databases, size of databases, number of tables inside each database, number of indexes, and the distribution of data across tables. It also depends on the SKU of the source and target server, and the IOPS available on the source and target server. Given the many factors that can affect the migration time, it's hard to estimate the total time for the offline migration to complete. The best approach would be to try it on a server restored from the primary server.

For calculating the total downtime to perform offline migration of production server, the following phases are considered.

- **Migration of PITR** - The best way to get a good estimate on the time taken to migrate your production database server would be to take a point-in time restore of your production server and run the offline migration on this newly restored server.

- **Migration of Buffer** - After completing the above step, you can plan for actual production migration during a time period when the application traffic is low. This migration can be planned on the same day or probably a week away. By this time, the size of the source server might have increased. Update your estimated migration time for your production server based on the amount of this increase. If the increase is significant, you can consider doing another test using the PITR server. But for most servers the size increase shouldn't be significant enough.

- **Validation** - Once the offline migration completes for the production server, you need to verify if the data in flexible server is an exact copy of the single server. Customers can use opensource/thirdparty tools or can do the validation manually. Prepare the validation steps that you would like to do in advance of the actual migration. Validation can include:
    * Row count match for all the tables involved in the migration.
    * Matching counts for all the database object (tables, sequences, extensions, procedures, indexes)
    * Comparing max or min IDs of key application related columns

> [!NOTE]  
> The size of databases is not the right metric for validation.The source server might have bloats/dead tuples which can bump up the size on the source server. Also, the storage containers used in single and flexible servers are completely different. It is completely normal to have size differences between source and target servers. If there is an issue in the first three steps of validation, it indicates a problem with the migration.

- **Migration of server settings** - The server parameters, firewall rules (if applicable), tags, alerts need to be manually copied from single server to flexible server.

- **Changing connection strings** - Post successful validation, application should change their connection strings to point to flexible server. This activity is coordinated with the application team to make changes to all the references of connection strings pointing to single server. Note that in the flexible server the user parameter in the connection string no longer needs to be in the **username@servername** format. You should just use the **user=username** format for this parameter in the connection string
For example
Psql -h **mysingleserver**.postgres.database.azure.com -u **user1@mysingleserver** -d db1
should now be of the format
Psql -h **myflexserver**.postgres.database.azure.com -u user1 -d db1

**Total planned downtime** = **Time to migrate PITR** + **time to migrate Buffer** + **time for Validation** + **time to migrate server settings** + **time to switch connection strings to the flexible server.**

While most frequently a migration runs without a hitch, it's good practice to plan for contingencies if there is additional time required for debugging or if a migration may need to be restarted.

#### Migration prerequisites

The following pre-requisites need to be taken care of before using the Single to Flex Migration tool for migration

##### Network connectivity between Single and Flexible Server

The following table summarizes the possible network configuration on single and flexible server.

| Server Type | Public Access | Private Access |
| :--- | :--- | :--- |
| Single Server | Public access turned **ON** with firewall rules or VNet rules (service endpoints). | Public access turned OFF with private end points configured. |
| Flexible Server | Public access with firewall rules | Server deployed inside a VNet and delegated subnet. |

> [!NOTE]  
> Currently private end points are not supported in Flexible server. It will be supported at a later point time.

The following table summarizes the list of networking scenarios supported by the Single to Flex migration tool.

| Single Server Config | Flexible Server Config | Supported by Migration tool |
| :--- | :--- | :--- |
| Public Access | Public Access | Yes |
| Public Access | Private Access | Yes |
| Private Access | Public Access | No |
| Private Access | Private Access | Yes |

**Steps needed to establish connectivity between your Single and Flexible Server**
- If your single server is public access (case #1 and case #2 in the above table), there's nothing needed from your end. The single to flex migration tool automatically establishes connection between single and flexible server and the migration will go through.
- If your single server is in private access, then the only supported scenario is when your Flexible server is inside a VNet. If your flexible server is deployed in the same VNet as the private end point of your Single server, connections between single server and flexible server should automatically work provided there is no network security group(NSGs) blocking the connectivity between subnets. If flexible server is deployed in another VNet, [peering should be established between the VNets](../../virtual-network/tutorial-connect-virtual-networks-portal.md) for the connection to work between Single and Flexible server.

##### Allow list required extensions

The migration tool automatically allow lists all extensions used by your single server databases on your flexible server except for the ones whose libraries need to be loaded at the server start. 

Use the following select command to list all the extensions used on your Single server databases.

```sql
    select * from pg_extension;
```

Check if the list contains any of the following extensions:
- PG_CRON
- PG_HINT_PLAN
- PG_PARTMAN_BGW
- PG_PREWARM
- PG_STAT_STATEMENTS
- PG_AUDIT
- PGLOGICAL
- WAL2JSON

If yes, then follow the below steps.

Go to the server parameters blade and search for **shared_preload_libraries** parameter. PG_CRON and PG_STAT_STATEMENTS extensions are selected by default. Select the list of above extensions used by your single server databases to this parameter and select Save.

:::image type="content" source="./media/concepts-single-to-flexible/shared-preload-libraries.png" alt-text="Diagram that shows allow listing of shared preload libraries on Flexible Server." lightbox="./media/concepts-single-to-flexible/shared-preload-libraries.png":::

For the changes to take effect, server restart would be required.

:::image type="content" source="./media/concepts-single-to-flexible/save-and-restart.png" alt-text="Diagram that shows save and restart option on Flexible Server." lightbox="./media/concepts-single-to-flexible/save-and-restart.png":::

Use the **Save and Restart** option and wait for the flexible server to restart.

> [!NOTE]  
> If TIMESCALEDB, POSTGIS_TOPOLOGY, POSTGIS_TIGER_GEOCODER, POSTGRES_FDW or PG_PARTMAN extensions are used in your single server, please raise a support request since the migration tool does not handle these extensions.

##### Create AAD users on target server
> [!NOTE]  
> This pre-requisite is applicable only for flexible servers on which the migration of users/roles functionality is enabled.

Execute the following query on your source server to get the list of AAD users.
```sql
SELECT r.rolname
	FROM
	  pg_roles r
	  JOIN pg_auth_members am ON r.oid = am.member
	  JOIN pg_roles m ON am.roleid = m.oid
	WHERE
	  m.rolname IN (
		'azure_ad_admin',
		'azure_ad_user',
		'azure_ad_mfa'
	  );
``` 
Create the AAD users on your target flexible server using this [link](../flexible-server/how-to-manage-azure-ad-users.md) before creating a migration.

### Migration

Once the pre-migration steps are complete, you're ready to carry out the migration of the production databases of your single server. At this point, you've finalized the day and time of production migration along with a planned downtime for your applications.

- Create a flexible server with a **General-Purpose** or **Memory Optimized** compute tier. Pick a minimum 4VCore or higher SKU to complete the migration quickly. Burstable SKUs are blocked for use as migration target servers.
- Don't include HA option while creating flexible server. You can always enable it with zero downtime once the migration from single server is complete. Don't create any read-replicas yet on the flexible server.
- Before initiating the migration, stop all the applications that connect to your production server.
- Checkpoint the source server by running **checkpoint** command and restart the source server.
This command ensures any remaining applications or connections are disconnected. Additionally, you can run **select * from pg_stat_activity;** after the restart to ensure no applications is connected to the source server.

Trigger the migration of your production databases using the single to flex migration tool. The migration requires close monitoring, and the monitoring user interface of the migration tool comes in handy. Check the migration status over the period of time to ensure there is progress and wait for the migration to complete.

#### Improve migration speed - Parallel migration of tables

In general, a powerful SKU is recommended for the target as the migration tool runs out of a container on the Flexible server. A powerful SKU enables a greater number of tables to be migrated in parallel. You can scale the SKU back to your preferred configuration after the migration. This section contains steps to improve the migration speed in case the data distribution among the tables is skewed and/or a more powerful SKU does not have a significant impact on the migration speed.

If the data distribution on the source is highly skewed, with most of the data present in one table, the allocated compute for migration is not fully utilized and it creates a bottleneck. So, we will split large tables into smaller chunks which are then migrated in parallel. This is applicable to tables that have more than 10000000 (10m) tuples. Splitting the table into smaller chunks is possible is possible if one of the following conditions are satisfied.  

1. The table must have a column with a simple (not composite) primary key or unique index of type int or big int.

> [!NOTE]  
> In case of approaches #2 or #3 below, the user must carefully evaluate the implications of adding a unique index column to the source schema. Only after confirmation that adding a unique index column will not affect the application should the user go ahead with the changes.

2. If the table does not have a simple primary key or unique index of type int or big int, but has a column that meets the data type criteria, the column can be converted into a unique index using the below command. Note that this command does not require a lock on the table.

```sql
    create unique index concurrently partkey_idx on <table name> (column name);
```

3. If the table has neither a simple int/big int primary key or unique index nor any column that meets the data type criteria, you can add such a column using [ALTER](https://www.postgresql.org/docs/current/sql-altertable.html) and drop it post-migration. Note that running the ALTER command requires a lock on the table.

```sql
    alter table <table name> add column <column name> bigserial unique;
```

If any of the above conditions are satisfied, the table will be migrated in multiple partitions in parallel, which should provide a marked increase in the migration speed.

##### How it works

- The migration tool looks up the maximum and minimum integer value of the Primary key/Unique index of that table that must be split up and migrated in parallel.
- If the difference between the minimum and maximum value is more than 10000000 (10m), then the table is split into multiple parts and each part is migrated separately, in parallel.

In summary, the Single to Flexible migration tool will migrate a table in parallel threads and reduce the migration time if:

1. The table has a column with a simple primary key or unique index of type int or big int.
2. The table has at least 10000000 (10m) rows so that the difference between the minimum and maximum value of the primary key is more than 10000000 (10m).
3. The SKU used has idle cores which can be leveraged for migrating the table in parallel.

### Post migration

- Once the migration is complete, verify the data on your flexible server and make sure it's an exact copy of the single server.
- Post verification, enable HA option as needed on your flexible server.
- Change the SKU of the flexible server to match the application needs. This change needs a database server restart.
- If you've changed any server parameters from their default values in single server, copy those server parameter values in flexible server.
- Copy other server settings like tags, alerts, firewall rules (if applicable) from single server to flexible server.
- Make changes to your application to point the connection strings to flexible server.
- Monitor the database performance closely to see if it requires performance tuning.

## Next steps

- [Migrate to Flexible Server by using the Azure portal](../migrate/how-to-migrate-single-to-flexible-portal.md)
- [Migrate to Flexible Server by using the Azure CLI](../migrate/how-to-migrate-single-to-flexible-cli.md)
