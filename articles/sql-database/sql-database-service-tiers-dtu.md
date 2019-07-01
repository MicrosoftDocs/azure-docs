---
title: 'Azure SQL Database service tiers - DTU-based purchase model | Microsoft Docs'
description: Learn about service tiers in the  DTU-based purchase model for single and pooled databases to provide compute and storage sizes.  
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
manager: craigg
ms.date: 06/25/2019
---
# Service tiers in the DTU-based purchase model

Service tiers in the DTU-based purchase model are differentiated by a range of compute sizes with a fixed amount of included storage, fixed retention period for backups, and fixed price. All service tiers in the DTU-based purchase model provide flexibility of changing compute sizes with minimal [downtime](https://azure.microsoft.com/support/legal/sla/sql-database/v1_2/); however, there is a switch over period where connectivity is lost to the database for a short amount of time, which can be mitigated using retry logic. Single databases and elastic pools are billed hourly based on service tier and compute size.

> [!IMPORTANT]
> SQL Database managed instance does not support a DTU-based purchasing model. For more information, see [Azure SQL Database Managed Instance](sql-database-managed-instance.md).
> [!NOTE]
> For information about vCore-based service tiers, see [vCore-based service tiers](sql-database-service-tiers-vcore.md). For information about differentiating DTU-based service tiers and vCore-based service tiers, see [Azure SQL Database purchasing models](sql-database-purchase-models.md).

## Compare the DTU-based service tiers

Choosing a service tier depends primarily on business continuity, storage, and performance requirements.

||Basic|Standard|Premium|
| :-- | --: |--:| --:|
|Target workload|Development and production|Development and production|Development and production|
|Uptime SLA|99.99%|99.99%|99.99%|
|Backup retention|7 days|35 days|35 days|
|CPU|Low|Low, Medium, High|Medium, High|
|IO throughput (approximate) |2.5 IOPS per DTU| 2.5 IOPS per DTU | 48 IOPS per DTU|
|IO latency (approximate)|5 ms (read), 10 ms (write)|5 ms (read), 10 ms (write)|2 ms (read/write)|
|Columnstore indexing |N/A|S3 and above|Supported|
|In-memory OLTP|N/A|N/A|Supported|
|||||

> [!NOTE]
> You can get a free Azure SQL database at the Basic service tier in conjunction with an Azure free account to explore Azure. For information, see [Create a managed cloud database with your Azure free account](https://azure.microsoft.com/free/services/sql-database/).

## Single database DTU and storage limits

Compute sizes are expressed in terms of Database Transaction Units (DTUs) for single databases and elastic Database Transaction Units (eDTUs) for elastic pools. For more on DTUs and eDTUs, see [DTU-based purchasing model](sql-database-purchase-models.md#dtu-based-purchasing-model)?

||Basic|Standard|Premium|
| :-- | --: | --: | --: |
| Maximum storage size | 2 GB | 1 TB | 4 TB  |
| Maximum DTUs | 5 | 3000 | 4000 | 
|||||

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).

## Elastic pool eDTU, storage, and pooled database limits

| | **Basic** | **Standard** | **Premium** |
| :-- | --: | --: | --: |
| Maximum storage size per database  | 2 GB | 1 TB | 1 TB |
| Maximum storage size per pool | 156 GB | 4 TB | 4 TB |
| Maximum eDTUs per database | 5 | 3000 | 4000 |
| Maximum eDTUs per pool | 1600 | 3000 | 4000 |
| Maximum number of databases per pool | 500  | 500 | 100 |
|||||

> [!IMPORTANT]
> More than 1 TB of storage in the Premium tier is currently available in all regions except: China East, China North, Germany Central, Germany Northeast, West Central US, US DoD regions, and US Government Central. In these regions, the storage max in the Premium tier is limited to 1 TB.  For more information, see [P11-P15 current limitations](sql-database-single-database-scale.md#p11-and-p15-constraints-when-max-size-greater-than-1-tb).  
> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [manage file space in Azure SQL Database](sql-database-file-space-management.md).

## DTU Benchmark

Physical characteristics (CPU, memory, IO) associated to each DTU measure are calibrated using a benchmark that simulates real-world database workload.

### Correlating benchmark results to real world database performance

It is important to understand that all benchmarks are representative and indicative only. The transaction rates achieved with the benchmark application will not be the same as those that might be achieved with other applications. The benchmark comprises a collection of different transaction types run against a schema containing a range of tables and data types. While the benchmark exercises the same basic operations that are common to all OLTP workloads, it does not represent any specific class of database or application. The goal of the benchmark is to provide a reasonable guide to the relative performance of a database that might be expected when scaling up or down between compute sizes. In reality, databases are of different sizes and complexity, encounter different mixes of workloads, and will respond in different ways. For example, an IO-intensive application may hit IO thresholds sooner, or a CPU-intensive application may hit CPU limits sooner. There is no guarantee that any particular database will scale in the same way as the benchmark under increasing load.

The benchmark and its methodology are described in more detail below.

### Benchmark summary

The benchmark measures the performance of a mix of basic database operations that occur most frequently in online transaction processing (OLTP) workloads. Although the benchmark is designed with cloud computing in mind, the database schema, data population, and transactions have been designed to be broadly representative of the basic elements most commonly used in OLTP workloads.

### Schema

The schema is designed to have enough variety and complexity to support a broad range of operations. The benchmark runs against a database comprised of six tables. The tables fall into three categories: fixed-size, scaling, and growing. There are two fixed-size tables; three scaling tables; and one growing table. Fixed-size tables have a constant number of rows. Scaling tables have a cardinality that is proportional to database performance, but doesn’t change during the benchmark. The growing table is sized like a scaling table on initial load, but then the cardinality changes in the course of running the benchmark as rows are inserted and deleted.

The schema includes a mix of data types, including integer, numeric, character, and date/time. The schema includes primary and secondary keys, but not any foreign keys - that is, there are no referential integrity constraints between tables.

A data generation program generates the data for the initial database. Integer and numeric data is generated with various strategies. In some cases, values are distributed randomly over a range. In other cases, a set of values is randomly permuted to ensure that a specific distribution is maintained. Text fields are generated from a weighted list of words to produce realistic looking data.

The database is sized based on a “scale factor.” The scale factor (abbreviated as SF) determines the cardinality of the scaling and growing tables. As described below in the section Users and Pacing, the database size, number of users, and maximum performance all scale in proportion to each other.

### Transactions

The workload consists of nine transaction types, as shown in the table below. Each transaction is designed to highlight a particular set of system characteristics in the database engine and system hardware, with high contrast from the other transactions. This approach makes it easier to assess the impact of different components to overall performance. For example, the transaction “Read Heavy” produces a significant number of read operations from disk.

| Transaction Type | Description |
| --- | --- |
| Read Lite |SELECT; in-memory; read-only |
| Read Medium |SELECT; mostly in-memory; read-only |
| Read Heavy |SELECT; mostly not in-memory; read-only |
| Update Lite |UPDATE; in-memory; read-write |
| Update Heavy |UPDATE; mostly not in-memory; read-write |
| Insert Lite |INSERT; in-memory; read-write |
| Insert Heavy |INSERT; mostly not in-memory; read-write |
| Delete |DELETE; mix of in-memory and not in-memory; read-write |
| CPU Heavy |SELECT; in-memory; relatively heavy CPU load; read-only |

### Workload mix

Transactions are selected at random from a weighted distribution with the following overall mix. The overall mix has a read/write ratio of approximately 2:1.

| Transaction Type | % of Mix |
| --- | --- |
| Read Lite |35 |
| Read Medium |20 |
| Read Heavy |5 |
| Update Lite |20 |
| Update Heavy |3 |
| Insert Lite |3 |
| Insert Heavy |2 |
| Delete |2 |
| CPU Heavy |10 |

### Users and pacing

The benchmark workload is driven from a tool that submits transactions across a set of connections to simulate the behavior of a number of concurrent users. Although all of the connections and transactions are machine generated, for simplicity we refer to these connections as “users.” Although each user operates independently of all other users, all users perform the same cycle of steps shown below:

1. Establish a database connection.
2. Repeat until signaled to exit:
   - Select a transaction at random (from a weighted distribution).
   - Perform the selected transaction and measure the response time.
   - Wait for a pacing delay.
3. Close the database connection.
4. Exit.

The pacing delay (in step 2c) is selected at random, but with a distribution that has an average of 1.0 second. Thus each user can, on average, generate at most one transaction per second.

### Scaling rules

The number of users is determined by the database size (in scale-factor units). There is one user for every five scale-factor units. Because of the pacing delay, one user can generate at most one transaction per second, on average.

For example, a scale-factor of 500 (SF=500) database will have 100 users and can achieve a maximum rate of 100 TPS. To drive a higher TPS rate requires more users and a larger database.

### Measurement duration

A valid benchmark run requires a steady-state measurement duration of at least one hour.

### Metrics

The key metrics in the benchmark are throughput and response time.

- Throughput is the essential performance measure in the benchmark. Throughput is reported in transactions per unit-of-time, counting all transaction types.
- Response time is a measure of performance predictability. The response time constraint varies with class of service, with higher classes of service having a more stringent response time requirement, as shown below.

| Class of Service | Throughput Measure | Response Time Requirement |
| --- | --- | --- |
| Premium |Transactions per second |95th percentile at 0.5 seconds |
| Standard |Transactions per minute |90th percentile at 1.0 seconds |
| Basic |Transactions per hour |80th percentile at 2.0 seconds |

## Next steps

- For details on specific compute sizes and storage size choices available for single databases, see [SQL Database DTU-based resource limits for single databases](sql-database-dtu-resource-limits-single-databases.md#single-database-storage-sizes-and-compute-sizes).
- For details on specific compute sizes and storage size choices available for elastic pools, see [SQL Database DTU-based resource limits](sql-database-dtu-resource-limits-elastic-pools.md#elastic-pool-storage-sizes-and-compute-sizes).
