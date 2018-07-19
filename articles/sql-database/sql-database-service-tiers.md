---
title: 'Azure SQL Database purchasing models | Microsoft Docs'
description: Learn about purchasing model for Azure SQL Database.  
services: sql-database
author: CarlRabeler
ms.service: sql-database
ms.custom: DBs & servers
ms.topic: conceptual
ms.date: 07/16/2018
manager: craigg
ms.author: carlrab

---
# Azure SQL Database purchasing models and resources 

Logical servers in [Azure SQL Database](sql-database-technical-overview.md) offers two purchasing models for compute, storage, and IO resources: a DTU-based purchasing model and a vCore-based purchasing model. 

> [!NOTE]
> [Managed Instances](sql-database-managed-instance.md) in Azure SQL Database only offer the vCore-based purchasing model.

The following table and chart compare and contrast these two purchasing models.

> [!IMPORTANT]
> For vCore-based purchasing model, see [vCore-based purchasing model](sql-database-service-tiers-vcore.md)

|**Purchasing model**|**Description**|**Best for**|
|---|---|---|
|DTU-based model|This model is based on a bundled measure of compute, storage, and IO resources. Performance levels are expressed in terms of Database Transaction Units (DTUs) for single databases and elastic Database Transaction Units (eDTUs) for elastic pools. For more on DTUs and eDTUs, see [What are DTUs and eDTUs](sql-database-service-tiers.md#what-are-database-transaction-units-dtus)?|Best for customers who want simple, pre-configured resource options.| 
|vCore-based model|This model allows you to independently scale compute and storage resources. It also allows you to use Azure Hybrid Benefit for SQL Server to gain cost savings.|Best for customers who value flexibility, control, and transparency.|
||||  

![pricing model](./media/sql-database-service-tiers/pricing-model.png)

## vCore-based purchasing model 

A virtual core represents the logical CPU offered with an option to choose between generations of hardware. The vCore-based purchasing model gives your flexibility, control, transparency of individual resource consumption and a straightforward way to translate on-premises workload requirements to the cloud. This model allows you to scale compute, memory, and storage based upon their workload needs. In the vCore-based purchasing model, customers can choose between General Purpose and Business critical service tiers for both [single databases](sql-database-single-database-scale.md) and [elastic pools](sql-database-elastic-pool.md). 

The vCore-based purchasing model enables you to independently scale compute and storage resources, match on-premises performance, and optimize price. If your database or elastic pool consumes more than 300 DTU conversion to vCore may reduce your cost. You can convert using your API of choice or using the Azure portal, with no downtime. However, conversion is not required. If the DTU purchasing model meets your performance and business requirements, you should continue using it. If you decide to convert from the DTU-model to vCore-model, you should select the performance level using the following rule of thumb: each 100 DTU in Standard tier requires at least 1 vCore in General Purpose tier; each 125 DTU in Premium tier requires at least 1 vCore in Business Critical tier.

In the vCore-based purchasing model, customers pay for:
- Compute (service tier + number of vCores + generation of hardware)*
- Type and amount of data and log storage 
- Number of IOs**
- Backup storage (RA-GRS)** 

\* In the initial public preview, the Gen 4 Logical CPUs are based on Intel E5-2673 v3 (Haswell) 2.4-GHz processors.

\*\* During preview, 7 days of backups and IOs are free.

> [!IMPORTANT]
> Compute, IOs, data and log storage are charged per database or elastic pool. Backups storage is charged per each database. For details of Managed Instance charges, refer to [Azure SQL Database Managed Instance](sql-database-managed-instance.md).
> **Region limitations:** The vCore-based purchasing model is not yet available in the following regions: West Europe, France Central, UK South, UK West and Australia Southeast.

## DTU-based purchasing model

The Database Throughput Unit (DTU) represents a blended measure of CPU, memory, reads, and writes. The DTU-based purchasing model offers a set of preconfigured bundles of compute resources and included storage to drive different levels of application performance. Customers who prefer the simplicity of a preconfigured bundle and fixed payments each month, may find the DTU-based model more suitable for their needs. In the DTU-based purchasing model, customers can choose between **Basic**, **Standard**, and **Premium** service tiers for both [single databases](sql-database-single-database-scale.md) and [elastic pools](sql-database-elastic-pool.md). 

### What are Database Transaction Units (DTUs)?
For a single Azure SQL database at a specific performance level within a [service tier](sql-database-single-database-scale.md), Microsoft guarantees a certain level of resources for that database (independent of any other database in the Azure cloud), providing a predictable level of performance. The amount of resources is calculated as a number of Database Transaction Units or DTUs and is a bundled measure of compute, storage, and IO resources. The ratio amongst these resources was originally determined by an [OLTP benchmark workload](sql-database-benchmark-overview.md), designed to be typical of real-world OLTP workloads. When your workload exceeds the amount of any of these resources, your throughput is throttled - resulting in slower performance and timeouts. The resources used by your workload do not impact the resources available to other SQL databases in the Azure cloud, and the resources used by other workloads do not impact the resources available to your SQL database.

![bounding box](./media/sql-database-what-is-a-dtu/bounding-box.png)

DTUs are most useful for understanding the relative amount of resources between Azure SQL Databases at different performance levels and service tiers. For example, doubling the DTUs by increasing the performance level of a database equates to doubling the set of resources available to that database. For example, a Premium P11 database with 1750 DTUs provides 350x more DTU compute power than a Basic database with 5 DTUs.  

To gain deeper insight into the resource (DTU) consumption of your workload, use [Azure SQL Database Query Performance Insight](sql-database-query-performance.md) to:

- Identify the top queries by CPU/Duration/Execution count that can potentially be tuned for improved performance. For example, an IO intensive query might benefit from the use of [in-memory optimization techniques](sql-database-in-memory.md) to make better use of the available memory at a certain service tier and performance level.
- Drill down into the details of a query, view its text and history of resource utilization.
- Access performance tuning recommendations that show actions performed by [SQL Database Advisor](sql-database-advisor.md).

You can change [DTU service tiers](sql-database-service-tiers-dtu.md) at any time with minimal downtime to your application (generally averaging under four seconds). For many businesses and apps, being able to create databases and dial performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model. For this scenario, you use an elastic pool with a certain number of eDTUs that are shared among multiple databases in the pool.

![Intro to SQL Database: Single database DTUs by tier and level](./media/sql-database-what-is-a-dtu/single_db_dtus.png)

### What are elastic Database Transaction Units (eDTUs)?
Rather than provide a dedicated set of resources (DTUs) that may not always be needed for a SQL Database that is always available, you can place databases into an [elastic pool](sql-database-elastic-pool.md) on a SQL Database server that shares a pool of resources among those databases. The shared resources in an elastic pool are measured by elastic Database Transaction Units or eDTUs. Elastic pools provide a simple cost effective solution to manage the performance goals for multiple databases having widely varying and unpredictable usage patterns. An elastic pool guarantees resources cannot be consumed by one database in the pool, while ensuring each database in the pool always has a minimum amount of necessary resources available. 

![Intro to SQL Database: eDTUs by tier and level](./media/sql-database-what-is-a-dtu/sqldb_elastic_pools.png)

A pool is given a set number of eDTUs for a set price. Within the elastic pool, individual databases are given the flexibility to auto-scale within the configured boundaries. A database under heavier load will consume more eDTUs to meet demand. Databases under lighter loads will consume less eDTUs. Databases with no load will consume no eDTUs. By provisioning resources for the entire pool, rather than per database, management tasks are simplified, providing a predictable budget for the pool.

Additional eDTUs can be added to an existing pool with no database downtime and with no impact on the databases in the pool. Similarly, if extra eDTUs are no longer needed, they can be removed from an existing pool at any point in time. You can add or subtract databases to the pool or limit the amount of eDTUs a database can use under heavy load to reserve eDTUs for other databases. If a database is predictably under-utilizing resources, you can move it out of the pool and configure it as a single database with a predictable amount of required resources.

### How can I determine the number of DTUs needed by my workload?
If you are looking to migrate an existing on-premises or SQL Server virtual machine workload to Azure SQL Database, you can use the [DTU Calculator](http://dtucalculator.azurewebsites.net/) to approximate the number of DTUs needed. For an existing Azure SQL Database workload, you can use [SQL Database Query Performance Insight](sql-database-query-performance.md) to understand your database resource consumption (DTUs) to gain deeper insight for optimizing your workload. You can also use the [sys.dm_db_ resource_stats](https://msdn.microsoft.com/library/dn800981.aspx) DMV to view resource consumption for the last hour. Alternatively, the catalog view [sys.resource_stats](http://msdn.microsoft.com/library/dn269979.aspx) displays resource consumption for the last 14 days, but at a lower fidelity of five-minute averages.

### How do I know if I could benefit from an elastic pool of resources?
Pools are suited for a large number of databases with specific utilization patterns. For a given database, this pattern is characterized by a low utilization average with relatively infrequent utilization spikes. SQL Database automatically evaluates the historical resource usage of databases in an existing SQL Database server and recommends the appropriate pool configuration in the Azure portal. For more information, see [when should an elastic pool be used?](sql-database-elastic-pool.md)

### What happens when I hit my maximum DTUs?
Performance levels are calibrated and governed to provide the resources needed to run your database workload up to the maximum allowed for your selected service tier/performance level. If your workload is hitting one of the CPU/Data IO/Log IO limits, you will continue to receive the maximum level of resources allowable, but you will also likely experience increased query latencies. These limits do not result in any errors, but rather a slowdown in the workload, unless the slowdown becomes so severe that queries start timing out. If you reach the  maximum allowed concurrent user sessions/requests (worker threads), you will see explicit errors. See [Azure SQL Database resource limits]( sql-database-resource-limits.md#what-happens-when-database-resource-limits-are-reached) for information on resource limits not related to CPU, memory, data IO, or transaction log IO.

### Correlating benchmark results to real world database performance
It is important to understand that all benchmarks are representative and indicative only. The transaction rates achieved with the benchmark application will not be the same as those that might be achieved with other applications. The benchmark comprises a collection of different transaction types run against a schema containing a range of tables and data types. While the benchmark exercises the same basic operations that are common to all OLTP workloads, it does not represent any specific class of database or application. The goal of the benchmark is to provide a reasonable guide to the relative performance of a database that might be expected when scaling up or down between performance levels. In reality, databases are of different sizes and complexity, encounter different mixes of workloads, and will respond in different ways. For example, an IO-intensive application may hit IO thresholds sooner, or a CPU-intensive application may hit CPU limits sooner. There is no guarantee that any particular database will scale in the same way as the benchmark under increasing load.

The benchmark and its methodology are described in more detail below.

### Benchmark summary
ASDB measures the performance of a mix of basic database operations which occur most frequently in online transaction processing (OLTP) workloads. Although the benchmark is designed with cloud computing in mind, the database schema, data population, and transactions have been designed to be broadly representative of the basic elements most commonly used in OLTP workloads.

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
   * Select a transaction at random (from a weighted distribution).
   * Perform the selected transaction and measure the response time.
   * Wait for a pacing delay.
3. Close the database connection.
4. Exit.

The pacing delay (in step 2c) is selected at random, but with a distribution that has an average of 1.0 second. Thus each user can, on average, generate at most one transaction per second.

### Scaling rules
The number of users is determined by the database size (in scale-factor units). There is one user for every five scale-factor units. Because of the pacing delay, one user can generate at most one transaction per second, on average.

For example, a scale-factor of 500 (SF=500) database will have 100 users and can achieve a maximum rate of 100 TPS. To drive a higher TPS rate requires more users and a larger database.

The table below shows the number of users actually sustained for each service tier and performance level.

| Service Tier (Performance Level) | Users | Database Size |
| --- | --- | --- |
| Basic |5 |720 MB |
| Standard (S0) |10 |1 GB |
| Standard (S1) |20 |2.1 GB |
| Standard (S2) |50 |7.1 GB |
| Premium (P1) |100 |14 GB |
| Premium (P2) |200 |28 GB |
| Premium (P6) |800 |114 GB |

### Measurement duration
A valid benchmark run requires a steady-state measurement duration of at least one hour.

### Metrics
The key metrics in the benchmark are throughput and response time.

* Throughput is the essential performance measure in the benchmark. Throughput is reported in transactions per unit-of-time, counting all transaction types.
* Response time is a measure of performance predictability. The response time constraint varies with class of service, with higher classes of service having a more stringent response time requirement, as shown below.

| Class of Service | Throughput Measure | Response Time Requirement |
| --- | --- | --- |
| Premium |Transactions per second |95th percentile at 0.5 seconds |
| Standard |Transactions per minute |90th percentile at 1.0 seconds |
| Basic |Transactions per hour |80th percentile at 2.0 seconds |

## Next steps

- For vCore-based purchasing model, see [vCore-based purchasing model](sql-database-service-tiers-vcore.md)
- For the DTU-based purchasing model, see [DTU-based purchasing model](sql-database-service-tiers-dtu.md).
