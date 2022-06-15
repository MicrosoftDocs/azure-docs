---
title: "Migrate MySQL on-premises to Azure Database for MySQL: Assessment"
description: "Before jumping right into migrating a MySQL workload, there's a fair amount of due diligence that must be performed."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: rothja
ms.author: jroth
ms.reviewer: maghan
ms.custom:
ms.date: 06/21/2021
---

# Migrate MySQL on-premises to Azure Database for MySQL: Assessment

[!INCLUDE[applies-to-mysql-single-flexible-server](../../includes/applies-to-mysql-single-flexible-server.md)]

## Prerequisites

[Representative Use Case](02-representative-use-case.md)

## Overview

Before jumping right into migrating a MySQL workload, there's a fair amount of due diligence that must be performed. This includes analyzing the data, hosting environment, and application workloads to validate the Azure Landing zone is configured correctly and prepared to host the soon-to-be migrated workloads.

## Limitations

Azure Database for MySQL is a fully supported version of the MySQL community edition running as a platform as a service. However, there are [some limitations](../../concepts-limits.md) to become familiar with when doing an initial assessment.

The most important of which include:

  - Storage engine support for `InnoDB` and `Memory` only

  - Limited `Privilege` support (`DBA`, `SUPER`, `DEFINER`)

  - Disabled data manipulation statements (`SELECT ... INTO OUTFILE`, `LOAD DATA INFILE`)

  - Automatic significant database migration (5.6 to 5.7, 5.7 to 8.0)

  - When using MySQL Server User-Defined Functions (UDFs), the only viable hosting option is Azure Hosted VMs, as there's no capability to upload the `so` or `dll` component to Azure Database for MySQL.

Many of the other items are operational aspects that administrators should become familiar with as part of the operational data workload lifecycle management. This guide explores many of these operational aspects in the Post Migration Management section.

## MySQL versions

MySQL has a rich history starting in 1995. Since then, it has evolved into a widely used database management system. Azure Database for MySQL started with the support of MySQL version 5.6 and has continued to 5.7 and recently 8.0. For the latest on Azure Database for MySQL version support, reference [Supported Azure Database for MySQL server versions.](../../concepts-supported-versions.md) In the Post Migration Management section, we review how upgrades (such as 5.7.20 to 5.7.21) are applied to the MySQL instances in Azure.

> [!NOTE]
> The jump from 5.x to 8.0 was largely due to the Oracle acquisition of MySQL. To read more about MySQL history, navigate to the [MySQL wiki page](https://en.wikipedia.org/wiki/MySQL).

Knowing the source MySQL version is essential. The applications using the system may be using database objects and features that are specific to that version. Migrating a database to a lower version could cause compatibility issues and loss of functionality. It's also recommended the data and application instance are thoroughly tested before migrating to a newer version as the features introduced could break your application.

Examples that may influence the migration path and version:

  - 5.6: TIMESTAMP column for correct storage of milliseconds and full-text search

  - 5.7: Support for native JSON data type

  - 8.0: Support for NoSQL Document Store, atomic, and crash-safe DDL and JSON table functions

    > [!NOTE]
    > MySQL 5.6 loses general support in February of 2021. MySQL workloads needs to migrate to MySQL version of 5.7 or greater.

To check the MySQL server version:

```
SHOW VARIABLES LIKE "%version%";
```

### Database storage engines

Azure Database for MySQL only supports [InnoDB](https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html) and [Memory](https://dev.mysql.com/doc/refman/8.0/en/memory-storage-engine.html) database storage engines. Other storage engines, like [MyISAM,](https://dev.mysql.com/doc/refman/8.0/en/myisam-storage-engine.html) need to be migrated to a supported storage engine. The differences between MyISAM and InnoDB are the operational features and performance output. The higher-level tables and schema structure typically don't change between the engines, but the index and table column types may change for storage and performance reasons. Although InnoDB is known to have large data file sizes, these storage details are managed by the Azure Database for MySQL service.

#### Migrating from MyISAM to InnoDB

The MyISAM database and tables needs to be converted to InnoDB tables. After conversion, applications should be tested for compatibility and performance. In most cases, testing requires recreating the table and changing the target storage engine via DDL statements. It's unlikely this change needs to be performed during migration as it occurs during the schema creation in the Azure target. For more details, review the [converting tables developers documentation](https://dev.mysql.com/doc/refman/5.6/en/converting-tables-to-innodb.html) on the MySQL website.

To find useful table information, use this query:

```dotnetcli
    SELECT 
        tab.table_schema,
        tab.table_name,
        tab.engine as engine_type,
        tab.auto_increment,
        tab.table_rows,
        tab.create_time,
        tab.update_time,
        tco.constraint_type
    FROM information_schema.tables tab
    LEFT JOIN information_schema.table_constraints tco
        ON (tab.table_schema = tco.table_schema
            AND tab.table_name = tco.table_name
            )
    WHERE  
        tab.table_schema NOT IN ('mysql', 'information_schema', 'performance_
schema', 'sys')  
        AND tab.table_type = 'BASE TABLE';
```

> [!NOTE]
> Running query against INFORMATION\_SCHEMA across multiple databases might impact performance. Run during low usage periods.

To convert a table from MyISAM to InnoDB, run the following:

```
ALTER TABLE {table\_name} ENGINE=InnoDB;
```

> [!NOTE]
> This conversion approach causes the table to lock, and all applications can wait until the operation is complete. The table locking makes the database appear offline for a short period.

Instead, the table can be created with the same structure but with a different storage engine. Once created, copy the rows into the new table:

```
INSERT INTO {table\_name} SELECT * FROM {myisam\_table} ORDER BY {primary\_key\_columns}
```

> [!NOTE]
> For this approach to be successful, the original table would need to be deleted, then the new table renamed. This task causes a short downtime period.

### Database data and objects

Data is one component of database migration. The database supporting objects must be migrated and validated to ensure the applications continue to run reliably.

Here's a list of items you should inventory before and after the migration:

  - Tables (schema)

  - Primary keys, foreign keys

  - Indexes

  - Functions

  - Procedures

  - Triggers

  - Views

### User-Defined functions

MySQL allows for the usage of functions that call external code. Unfortunately, data workloads using User-Defined Functions (UDFs) with external code cannot be migrated to Azure Database for MySQL. This is because the required MySQL function's backing so or dll code cannot be uploaded to the Azure server.

Run the following query to find any UDFs that may be installed:

```
SELECT * FROM mysql.func;
```

## Source systems

The amount of migration preparation can vary depending on the source system and its location. In addition to the database objects, consider how to get the data from the source system to the target system. Migrating data can become challenging when firewalls and other networking components are between the source and target.

Additionally, moving data over the Internet can be slower than using dedicated circuits to Azure. Therefore, when moving many gigabytes, terabytes, and petabytes of data, consider setting up an [ExpressRoute](../../../expressroute/expressroute-introduction.md) connection between the source network and the Azure network.

If ExpressRoute is already present, it's likely that connection is being used by other applications. Performing a migration over an existing route can cause strain on the network throughput and potentially cause a significant performance hit for both the migration and other applications using the network.

Lastly, disk space must be evaluated. When exporting a large database, consider the size of the data. Ensure the system where the tool is running, and ultimately the export location has enough disk space to perform the export operation.

### Cloud providers

Migrating databases from cloud services providers such as Amazon Web Services (AWS) may require an extra networking configuration step in order to access the cloud-hosted MySQL instances. Migration tools, like Data Migration Services, require access from outside IP ranges and maybe otherwise blocked.

### On-premises

Like cloud providers, if the MySQL data workload is behind firewalls or other network security layers, a path needs to be created between the on-premises instance and Azure Database for MySQL.

## Tools

Many tools and methods can be used to assess the MySQL data workloads and environments. Each tool provides a different set of assessment and migration features and functionality. As part of this guide, we review the most commonly used tools for assessing MySQL data workloads.

### Azure migrate

Although [Azure Migrate](../../../migrate/migrate-services-overview.md) doesn't support migrating MySQL database workloads directly, it can be used when administrators are unsure of what users and applications are consuming the data, whether hosted in a virtual or hardware-based machine. [Dependency analysis](../../../migrate/concepts-dependency-visualization.md) can be accomplished by installing and running the monitoring agent on the machine hosting the MySQL workload. The agent gathers the information over a set period, such as a month. The dependency data can be analyzed to find unknown connections being made to the database. The connection data can help identify application owners that need to be notified of the pending migration.

In addition to the dependency analysis of applications and user connectivity data, Azure Migrate can also be used to analyze the [Hyper-V, VMware, or physical servers](../../../migrate/migrate-appliance-architecture.md) to provide utilization patterns of the database workloads to help suggest the proper target environment.

### Telgraf for Linux

Linux workloads can utilize the [Microsoft Monitoring Agent (MMA)](../../../azure-monitor/agents/agent-linux.md) to gather data on your virtual and physical machines. Additionally, consider using the [Telegraf agent](../../../azure-monitor/essentials/collect-custom-metrics-linux-telegraf.md) and its wide array of plugins to gather your performance metrics.

### Service tiers

Equipped with the assessment information (CPU, memory, storage, etc.), the migration user's next choice is to decide on which Azure Database for MySQL [pricing tier](../../concepts-pricing-tiers.md) to start using.

There are currently three tiers:

  - **Basic**: Workloads requiring light compute and I/O performance.

  - **General Purpose**: Most business workloads requiring balanced compute and memory with scalable I/O throughput.

  - **Memory Optimized**: High-performance database workloads requiring in-memory performance for faster transaction processing and higher concurrency.

The tier decision can be influenced by the RTO and RPO requirements of the data workload. When the data workload requires over 4 TB of storage, an extra step is required. Review and select [a region that supports](../../concepts-pricing-tiers.md#storage) up to 16 TB of storage.

> [!NOTE]
> Contact the MySQL team (AskAzureDBforMySQL@service.microsoft.com) for regions that don't support your storage requirements.

Typically, the decision-making focuses on the storage and IOPS, or Input/output Operations Per Second, needs. Thus, the target system always needs at least as much storage as in the source system. Additionally, since IOPS are allocated 3/GB, it's important to match up the IOPs needs to the final storage size.

| Factors | Tier |
|---------|------|
| **Basic** | Development machine, no need for high performance with less than 1 TB storage. |
| **General Purpose** | Needs for IOPS more than what basic tier can provide, but for storage less than 16 TB, and less than 4 GB of memory. |
| **Memory Optimized** | Data workloads that utilize high memory or high cache and buffer-related server configuration such as high concurrency innodb_buffer_pool_instances, large BLOB sizes, systems with many replication copies. |

### Costs

After evaluating the entire WWI MySQL data workloads, WWI determined they would need at least 4 vCores and 20 GB of memory and at least 100 GB of storage space with an IOP capacity of 450 IOPS. Because of the 450 IOPS requirement, they need to allocate at least 150 GB of storage because of [Azure Database for MySQL IOPs allocation method.](../../concepts-pricing-tiers.md#storage) Additionally, they require at least up to 100% of your provisioned server storage as backup storage and one read replica. They don't anticipate an outbound egress of more than 5 GB.

Using the [Azure Database for MySQL pricing calculator](https://azure.microsoft.com/pricing/details/mysql/), WWI was able to determine the costs for the Azure Database for MySQL instance. As of 9/2020, the total costs of ownership (TCO) are displayed in the following table for the WWI Conference Database.

| Resource | Description | Quantity | Cost |
|----------|-------------|----------|------|
| **Compute (General Purpose)** | 4 vCores, 20 GB                  | 1 @ $0.351/hr                                              | $3074.76 / yr |
| **Storage**                   | 5 GB                             | 12 x 150 @ $0.115                                          | $207 / yr     |
| **Backup**                    | Up to 100% of provisioned storage| No extra cost up to 100% of provisioned server storage     | $0.00 / yr    |
| **Read Replica**              | 1-second region replica          | compute + storage                                          | $3281.76 / yr |
| **Network**                   | < 5GB/month egress               | Free                                                       |               |
| **Total**                     |                                  |                                                            | $6563.52 / yr |

After reviewing the initial costs, WWI's CIO confirmed they are on Azure for a period much longer than 3 years. They decided to use 3-year [reserve instances](../../concept-reserved-pricing.md) to save an extra \~$4K/yr.

| Resource | Description | Quantity | Cost |
|----------|-------------|----------|------|
| **Compute (General Purpose)** | 4 vCores                          | 1 @ $0.1375/hr                                              | $1204.5 / yr |
| **Storage**                   | 5 GB                              | 12 x 150 @ $0.115                                           | $207 / yr    |
| **Backup**                    | Up to 100% of provisioned storage | No extra cost up to 100% of provisioned server storage      | $0.00 / yr   |
| **Network**                   | < 5GB/month egress                | Free                                                        |              |
| **Read Replica**              | 1-second region replica           | compute + storage                                           | $1411.5 / yr |
| **Total**                     |                                   |                                                             | $2823 / yr   |

As the table above shows, backups, network egress, and any read replicas must be considered in the total cost of ownership (TCO). As more databases are added, the storage and network traffic generated would be the only extra cost-based factor to consider.

> [!NOTE]
> The estimates above don't include any [ExpressRoute](../../../expressroute/expressroute-introduction.md), [Azure App Gateway](../../../application-gateway/overview.md), [Azure Load Balancer](../../../load-balancer/load-balancer-overview.md), or [App Service](../../../app-service/overview.md) costs for the application layers.
>
> The above pricing can change at any time and varies based on region.

### Application implications

When moving to Azure Database for MySQL, the conversion to secure sockets layer (SSL) based communication is likely to be one of the most significant changes for your applications. SSL is enabled by default in Azure Database for MySQL, and it's likely the on-premises application and data workload is not set up to connect to MySQL using SSL. When enabled, SSL usage adds some extra processing overhead and should be monitored.

> [!NOTE]
> Although SSL is enabled by default, you do have the option to disable it.

Follow the activities in [Configure SSL connectivity in your application to securely connect to Azure Database for MySQL](../../howto-configure-ssl.md) to reconfigure the application to support this strong authentication path.

Lastly, modify the server name in the application connection strings or switch the DNS to point to the new Azure Database for MySQL server.

## WWI scenario

WWI started the assessment by gathering information about their MySQL data estate, as shown in the following table.

| Name | Source | Db Engine | Size | IOPS | Version | Owner | Downtime |
|------|--------|-----------|------|------|---------|-------|----------|
| **WwwDB**        | AWS (PaaS)  | InnoDB | 1 GB  | 150 | 5.7 | Marketing Dept | 1 hr  |
| **BlogDB**       | AWS (PaaS)  | InnoDB | 1 GB  | 100 | 5.7 | Marketing Dept | 4 hrs |
| **ConferenceDB** | On-premises | InnoDB | 5 GB  | 50  | 5.5 | Sales Dept     | 4 hrs |
| **CustomerDB**   | On-premises | InnoDB | 10 GB | 75  | 5.5 | Sales Dept     | 2 hrs |
| **SalesDB**      | On-premises | InnoDB | 20 GB | 75  | 5.5 | Sales Dept     | 1 hr  |

Each database owner was contacted to determine the acceptable downtime period. The planning and migration method selected were based on the acceptable database downtime.

For the first phase, WWI focused solely on the ConferenceDB database. The team needed the migration experience to help the proceeding data workload migrations. The ConferenceDB database was selected because of the simple database structure and the large acceptable downtime. Once the database was migrated, the team focused on migrating the application into the secure Azure landing zone.

## Assessment checklist

  - Test the workload runs successfully on the target system.

  - Ensure the right networking components are in place for the migration.

  - Understand the data workload resource requirements.

  - Estimate the total costs.

  - Understand the downtime requirements.

  - Be prepared to make application changes.

## Next steps

> [!div class="nextstepaction"]
> [Planning](./04-planning.md)
