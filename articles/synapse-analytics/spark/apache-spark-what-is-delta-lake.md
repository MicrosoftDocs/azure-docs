---
title: What is Delta Lake? 
description: Overview of Delta Lake and how it works as part of Azure Synapse Analytics
services: synapse-analytics 
author: jovanpop-msft
ms.author: jovanpop
ms.service: synapse-analytics 
ms.topic: conceptual 
ms.subservice: spark
ms.date: 12/06/2022
ms.reviewer: euang
---

# What is Delta Lake?

Delta Lake is an open-source storage layer that brings ACID (atomicity, consistency, isolation, and durability) transactions to Apache Spark and big data workloads.

The current version of Delta Lake included with Azure Synapse has language support for Scala, PySpark, and .NET and is compatible with Linux Foundation Delta Lake. There are links at the bottom of the page to more detailed examples and documentation. You can learn more from the [Introduction to Delta Tables video](https://www.youtube.com/watch?v=B_wyRXlLKok).

## Key features

| Feature | Description |
| --- | --- |
| **ACID Transactions** | Data lakes are typically populated through multiple processes and pipelines, some of which are writing data concurrently with reads. Prior to Delta Lake and the addition of transactions, data engineers had to go through a manual error prone process to ensure data integrity. Delta Lake brings familiar ACID transactions to data lakes. It provides serializability, the strongest level of isolation level. Learn more at [Diving into Delta Lake: Unpacking the Transaction Log](https://databricks.com/blog/2019/08/21/diving-into-delta-lake-unpacking-the-transaction-log.html).|
| **Scalable Metadata Handling** | In big data, even the metadata itself can be "big data." Delta Lake treats metadata just like data, leveraging Spark's distributed processing power to handle all its metadata. As a result, Delta Lake can handle petabyte-scale tables with billions of partitions and files at ease. |
| **Time Travel (data versioning)** | The ability to "undo" a change or go back to a previous version is one of the key features of transactions. Delta Lake provides snapshots of data enabling you to revert to earlier versions of data for audits, rollbacks or to reproduce experiments. Learn more in [Introducing Delta Lake Time Travel for Large Scale Data Lakes](https://databricks.com/blog/2019/02/04/introducing-delta-time-travel-for-large-scale-data-lakes.html). |
| **Open Format** | Apache Parquet is the baseline format for Delta Lake, enabling you to leverage the efficient compression and encoding schemes that are native to the format. |
| **Unified Batch and Streaming Source and Sink** | A table in Delta Lake is both a batch table, as well as a streaming source and sink. Streaming data ingest, batch historic backfill, and interactive queries all just work out of the box. |
| **Schema Enforcement** | Schema enforcement helps ensure that the data types are correct and required columns are present, preventing bad data from causing data inconsistency. For more information, see [Diving Into Delta Lake: Schema Enforcement & Evolution](https://databricks.com/blog/2019/09/24/diving-into-delta-lake-schema-enforcement-evolution.html) |
| **Schema Evolution** | Delta Lake enables you to make changes to a table schema that can be applied automatically, without having to write migration DDL. For more information, see [Diving Into Delta Lake: Schema Enforcement & Evolution](https://databricks.com/blog/2019/09/24/diving-into-delta-lake-schema-enforcement-evolution.html) |
| **Audit History** | Delta Lake transaction log records details about every change made to data providing a full audit trail of the changes. |
| **Updates and Deletes** | Delta Lake supports Scala / Java / Python and SQL APIs for a variety of functionality. Support for merge, update, and delete operations helps you to meet compliance requirements. For more information, see [Announcing the Delta Lake 0.6.1 Release](https://github.com/delta-io/delta/releases/tag/v0.6.1),  [Announcing the Delta Lake 0.7 Release](https://github.com/delta-io/delta/releases/tag/v0.7.0) and [Simple, Reliable Upserts and Deletes on Delta Lake Tables using Python APIs](https://databricks.com/blog/2019/10/03/simple-reliable-upserts-and-deletes-on-delta-lake-tables-using-python-apis.html), which includes code snippets for merge, update, and delete DML commands. |
| **100 percent compatible with Apache Spark API** | Developers can use Delta Lake with their existing data pipelines with minimal change as it is fully compatible with existing Spark implementations. |

For full documentation, see the [Delta Lake Documentation Page](https://docs.delta.io/latest/delta-intro.html)

For more information, see [Delta Lake Project](https://github.com/delta-io/delta).

## Next steps

- [.NET for Apache Spark documentation](/previous-versions/dotnet/spark/what-is-apache-spark-dotnet)
- [Azure Synapse Analytics](../index.yml)
