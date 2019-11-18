---
title: What is Delta Lake 
description: Overview of Delta Lake and how it works as part of Azure Synapse Analytics
services: sql-data-warehouse 
author: euangMS 
ms.service: sql-data-warehouse 
ms.topic: overview 
ms.subservice: design 
ms.date: 10/16/2019 
ms.author: euang 
ms.reviewer: euang
---

# What is Delta Lake

Azure Synapse Analytics is compatible with Linux Foundation Delta Lake. Delta Lake is an open-source storage layer that brings ACID
transactions to Apache Spark™ and big data workloads

## Key Features


| Feature | Description |
| --- | --- |
| **ACID Transactions** | Data lakes typically have multiple data pipelines reading and writing data concurrently, and data engineers have to go through a tedious process to ensure data integrity, due to the lack of transactions. Delta Lake brings ACID transactions to your data lakes. It provides serializability, the strongest level of isolation level. Learn more at [Diving into Delta Lake: Unpacking the Transaction Log](https://databricks.com/blog/2019/08/21/diving-into-delta-lake-unpacking-the-transaction-log.html)|
| **Scalable Metadata Handling** | In big data, even the metadata itself can be "big data". Delta Lake treats metadata just like data, leveraging Spark's distributed processing power to handle all its metadata. As a result, Delta Lake can handle petabyte-scale tables with billions of partitions and files at ease. |
| **Time Travel (data versioning)** | Delta Lake provides snapshots of data enabling developers to access and revert to earlier versions of data for audits, rollbacks or to reproduce experiments. Learn more in [Introducing Delta Lake Time Travel for Large Scale Data Lakes](https://databricks.com/blog/2019/02/04/introducing-delta-time-travel-for-large-scale-data-lakes.html) |
| **Open Format** | All data in Delta Lake is stored in Apache Parquet format enabling Delta Lake to leverage the efficient compression and encoding schemes that are native to Parquet. |
| **Unified Batch and Streaming Source and Sink** | A table in Delta Lake is both a batch table, as well as a streaming source and sink. Streaming data ingest, batch historic backfill, and interactive queries all just work out of the box. |
| **Schema Enforcement** | Delta Lake provides the ability to specify your schema and enforce it. This helps ensure that the data types are correct and required columns are present, preventing bad data from causing data corruption. For more information, refer to [Diving Into Delta Lake: Schema Enforcement & Evolution](https://databricks.com/blog/2019/09/24/diving-into-delta-lake-schema-enforcement-evolution.html) |
| **Schema Evolution** | Big data is continuously changing. Delta Lake enables you to make changes to a table schema that can be applied automatically, without the need for cumbersome DDL. For more information, refer to [Diving Into Delta Lake: Schema Enforcement & Evolution](https://databricks.com/blog/2019/09/24/diving-into-delta-lake-schema-enforcement-evolution.html) |
| **Audit History** | Delta Lake transaction log records details about every change made to data providing a full audit trail of the changes. |
| **Updates and Deletes** | Delta Lake supports Scala / Java APIs to merge, update and delete datasets. This allows you to easily comply with GDPR and CCPA and also simplifies use cases like change data capture. For more information, refer to [Announcing the Delta Lake 0.3.0 Release] (https://databricks.com/blog/2019/08/02/announcing-delta-lake-0-3-0-release.html) and [Simple, Reliable Upserts and Deletes on Delta Lake Tables using Python APIs](https://databricks.com/blog/2019/10/03/simple-reliable-upserts-and-deletes-on-delta-lake-tables-using-python-apis.html) which includes code snippets for merge, update, and delete DML commands. |
| **100% Compatible with Apache Spark API** | Developers can use Delta Lake with their existing data pipelines with minimal change as it is fully compatible with Spark, the commonly used big data processing engine. |

For full documentation [see the Delta Lake Documentation Page](https://docs.delta.io/latest/delta-intro.html)

Copyright © 2019 Delta Lake, a Series of LF Projects, LLC. For web site terms of use, trademark policy and other project policies please see https://lfprojects.org