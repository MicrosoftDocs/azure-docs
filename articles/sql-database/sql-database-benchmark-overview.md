<properties
	pageTitle="Azure SQL Database benchmark overview"
	description="This topic describes the Azure SQL Database Benchmark used in measuring the performance of Azure SQL Database."
	services="sql-database"
	documentationCenter="na"
	authors="CarlRabeler"
	manager="jhubbard"
	editor="monicar" />


<tags
	ms.service="sql-database"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="data-management"
	ms.date="06/21/2016"
	ms.author="carlrab" />

# Azure SQL Database benchmark overview

## Overview
Microsoft Azure SQL Database offers three [service tiers](sql-database-service-tiers.md) with multiple performance levels. Each performance level provides an increasing set of resources, or ‘power’, designed to deliver increasingly higher throughput.

It is important to be able to quantify how the increasing power of each performance level translates into increased database performance. To do this Microsoft has developed the Azure SQL Database Benchmark (ASDB). The benchmark exercises a mix of basic operations found in all OLTP workloads. We measure the throughput achieved for databases running in each performance level.

The resources and power of each service tier and performance level are expressed in terms of [Database Transaction Units (DTUs)](sql-database-technical-overview.md#understand-dtus). DTUs provide a way to describe the relative capacity of a performance level based on a blended measure of CPU, memory, and read and write rates offered by each performance level. Doubling the DTU rating of a database equates to doubling the database power. The benchmark allows us to assess the impact on database performance of the increasing power offered by each performance level by exercising actual database operations, while scaling database size, number of users, and transaction rates in proportion to the resources provided to the database.

By expressing the throughput of the Basic service tier using transactions per-hour, the Standard service tier using transactions per-minute, and the Premium service tier using transactions per-second, it makes it easier to quickly relate the performance potential of each service tier to the requirements of an application.

## Correlating benchmark results to real world database performance
It is important to understand that ASDB, like all benchmarks, is representative and indicative only. The transaction rates achieved with the benchmark application will not be the same as those that might be achieved with other applications. The benchmark comprises a collection of different transaction types run against a schema containing a range of tables and data types. While the benchmark exercises the same basic operations that are common to all OLTP workloads, it does not represent any specific class of database or application. The goal of the benchmark is to provide a reasonable guide to the relative performance of a database that might be expected when scaling up or down between performance levels. In reality, databases are of different sizes and complexity, encounter different mixes of workloads, and will respond in different ways. For example, an IO-intensive application may hit IO thresholds sooner, or a CPU-intensive application may hit CPU limits sooner. There is no guarantee that any particular database will scale in the same way as the benchmark under increasing load.

The benchmark and its methodology are described in more detail below.

## Benchmark summary
ASDB measures the performance of a mix of basic database operations which occur most frequently in online transaction processing (OLTP) workloads. Although the benchmark is designed with cloud computing in mind, the database schema, data population, and transactions have been designed to be broadly representative of the basic elements most commonly used in OLTP workloads.

## Schema
The schema is designed to have enough variety and complexity to support a broad range of operations. The benchmark runs against a database comprised of six tables. The tables fall into three categories: fixed-size, scaling, and growing. There are two fixed-size tables; three scaling tables; and one growing table. Fixed-size tables have a constant number of rows. Scaling tables have a cardinality that is proportional to database performance, but doesn’t change during the benchmark. The growing table is sized like a scaling table on initial load, but then the cardinality changes in the course of running the benchmark as rows are inserted and deleted.

The schema includes a mix of data types, including integer, numeric, character, and date/time. The schema includes primary and secondary keys, but not any foreign keys – that is, there are no referential integrity constraints between tables.

A data generation program generates the data for the initial database. Integer and numeric data is generated with various strategies. In some cases, values are distributed randomly over a range. In other cases, a set of values is randomly permuted to ensure that a specific distribution is maintained. Text fields are generated from a weighted list of words to produce realistic looking data.

The database is sized based on a “scale factor.” The scale factor (abbreviated as SF) determines the cardinality of the scaling and growing tables. As described below in the section Users and Pacing, the database size, number of users, and maximum performance all scale in proportion to each other.

## Transactions
The workload consists of nine transaction types, as shown in the table below. Each transaction is designed to highlight a particular set of system characteristics in the database engine and system hardware, with high contrast from the other transactions. This approach makes it easier to assess the impact of different components to overall performance. For example, the transaction “Read Heavy” produces a significant number of read operations from disk.

| Transaction Type | Description |
|---|---|
| Read Lite | SELECT; in-memory; read-only |
| Read Medium | SELECT; mostly in-memory; read-only |
| Read Heavy | SELECT; mostly not in-memory; read-only |
| Update Lite | UPDATE; in-memory; read-write |
| Update Heavy | UPDATE; mostly not in-memory; read-write |
| Insert Lite | INSERT; in-memory; read-write |
| Insert Heavy | INSERT; mostly not in-memory; read-write |
| Delete | DELETE; mix of in-memory and not in-memory; read-write |
| CPU Heavy | SELECT; in-memory; relatively heavy CPU load; read-only |

## Workload mix
Transactions are selected at random from a weighted distribution with the following overall mix. The overall mix has a read/write ratio of approximately 2:1.

| Transaction Type | % of Mix |
|---|---|
| Read Lite | 35 |
| Read Medium | 20 |
| Read Heavy | 5 |
| Update Lite | 20 |
| Update Heavy | 3 |
| Insert Lite | 3 |
| Insert Heavy | 2 |
| Delete | 2 |
| CPU Heavy | 10 |

## Users and pacing
The benchmark workload is driven from a tool that submits transactions across a set of connections to simulate the behavior of a number of concurrent users. Although all of the connections and transactions are machine generated, for simplicity we refer to these connections as “users.” Although each user operates independently of all other users, all users perform the same cycle of steps shown below:

1. Establish a database connection.
2. Repeat until signaled to exit:
	- Select a transaction at random (from a weighted distribution).
	- Perform the selected transaction and measure the response time.
	- Wait for a pacing delay.
3. Close the database connection.
4. Exit.

The pacing delay (in step 2c) is selected at random, but with a distribution that has an average of 1.0 second. Thus each user can, on average, generate at most one transaction per second.

## Scaling rules
The number of users is determined by the database size (in scale-factor units). There is one user for every five scale-factor units. Because of the pacing delay, one user can generate at most one transaction per second, on average.

For example, a scale-factor of 500 (SF=500) database will have 100 users and can achieve a maximum rate of 100 TPS. To drive a higher TPS rate requires more users and a larger database.

The table below shows the number of users actually sustained for each service tier and performance level.

| Service Tier (Performance Level) | Users | Database Size |
|---|---|---|
| Basic | 5 | 720 MB |
| Standard (S0) | 10 | 1 GB |
| Standard (S1) | 20 | 2.1 GB |
| Standard (S2) | 50 | 7.1 GB |
| Premium (P1) | 100 | 14 GB |
| Premium (P2) | 200 | 28 GB |
| Premium (P6/P3) | 800 | 114 GB |

## Measurement duration
A valid benchmark run requires a steady-state measurement duration of at least one hour.

## Metrics
The key metrics in the benchmark are throughput and response time.

- Throughput is the essential performance measure in the benchmark. Throughput is reported in transactions per unit-of-time, counting all transaction types.
- Response time is a measure of performance predictability. The response time constraint varies with class of service, with higher classes of service having a more stringent response time requirement, as shown below.

| Class of Service  | Throughput Measure | Response Time Requirement |
|---|---|---|
| Premium | Transactions per second | 95th percentile at 0.5 seconds |
| Standard | Transactions per minute | 90th percentile at 1.0 seconds |
| Basic | Transactions per hour | 80th percentile at 2.0 seconds |

## Conclusion
The Azure SQL Database Benchmark measures the relative performance of Azure SQL Database running across the range of available service tiers and performance levels. The benchmark exercises a mix of basic database operations which occur most frequently in online transaction processing (OLTP) workloads. By measuring actual performance, the benchmark provides a more meaningful assessment of the impact on throughput of changing the performance level than is possible by just listing the resources provided by each level such as CPU speed, memory size, and IOPS. In the future, we will continue to evolve the benchmark to broaden its scope and expand the data provided.

## Resources
[Introduction to SQL Database](sql-database-technical-overview.md)

[Service tiers and performance levels](sql-database-service-tiers.md)

[Performance guidance for single databases](sql-database-performance-guidance.md)
