---
title: HDInsight 4.0 overview - Azure
description: Compare HDInsight 3.6 to HDInsight 4.0 features, limitations, and upgrade recommendations.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 11/30/2022
---

# Azure HDInsight 4.0 overview

Azure HDInsight is one of the most popular services among enterprise customers for Apache Hadoop and Apache Spark. HDInsight 4.0 is a cloud distribution of Apache Hadoop components. This article provides information about the most recent Azure HDInsight release and how to upgrade.

## What's new in HDInsight 4.0?

### Apache Hive 3.0 and low-latency analytical processing

Apache Hive low-latency analytical processing (LLAP) uses persistent query servers and in-memory caching. This process delivers quick SQL query results on data in remote cloud storage. Hive LLAP uses a set of persistent daemons that execute fragments of Hive queries. Query execution on LLAP is similar to Hive without LLAP, with worker tasks running inside LLAP daemons instead of containers.

Benefits of Hive LLAP include:

* Ability to do deep SQL analytics without sacrificing performance and adaptability. Such as complex joins, subqueries, windowing functions, sorting, user-defined functions, and complex aggregations.

* Interactive queries against data in the same storage where data is prepared, eliminating the need to move data from storage to another engine for analytical processing.

* Caching query results allows previously computed query results to be reused. This cache saves time and resources spent running the cluster tasks required for the query.

### Hive dynamic materialized views

Hive now supports dynamic materialized views, or pre-computation of relevant summaries. The views accelerate query processing in data warehouses. Materialized views can be stored natively in Hive, and can seamlessly use LLAP acceleration.

### Hive transactional tables

HDI 4.0 includes Apache Hive 3. Hive 3 requires atomicity, consistency, isolation, and durability compliance for transactional tables that live in the Hive warehouse. ACID-compliant tables and table data are accessed and managed by Hive. Data in create, retrieve, update, and delete (CRUD) tables must be in Optimized Row Column (ORC) file format. Insert-only tables support all file formats. 

> [!Note]
> ACID/transactional support only works for managed tables and not external tables. Hive external tables are designed so that external parties can read and write table data, without Hive perfoming any alteration of the underlying data. For ACID tables, Hive may alter the underlying data with compactions and transactions.

Some benefits of ACID tables are

* ACID v2 has performance improvements in both storage format and the execution engine.

* ACID is enabled by default to allow full support for data updates.

* Improved ACID capabilities allow you to update and delete at row level.

* No Performance overhead.

* No Bucketing required.

* Spark can read and write to Hive ACID tables via Hive Warehouse Connector.


### Apache Spark

Apache Spark gets updatable tables and ACID transactions with Hive Warehouse Connector. Hive Warehouse Connector allows you to register Hive transactional tables as external tables in Spark to access full transactional functionality. Previous versions only supported table partition manipulation. Hive Warehouse Connector also supports Streaming DataFrames.  This process streams reads and writes into transactional and streaming Hive tables from Spark.

Spark executors can connect directly to Hive LLAP daemons to retrieve and update data in a transactional manner, allowing Hive to keep control of the data.

Apache Spark on HDInsight 4.0 supports the following scenarios:

* Run machine learning model training over the same transactional table used for reporting.
* Run a Spark streaming job on the change feed from a Hive streaming table.
* Create ORC files directly from a Spark Structured Streaming job.

You no longer have to worry about accidentally trying to access Hive transactional tables directly from Spark. Resulting in inconsistent results, duplicate data, or data corruption. In HDInsight 4.0, Spark tables and Hive tables are kept in separate Metastores. Use Hive Data Warehouse Connector to explicitly register Hive transactional tables as Spark external tables.


### Apache Oozie

Apache Oozie 4.3.1 is included in HDI 4.0 with the following changes:

* Oozie no longer runs Hive actions. Hive CLI has been removed and replaced with BeeLine.

* You can exclude unwanted dependencies from share lib by including an exclude pattern in your **job.properties** file.

## How to upgrade to HDInsight 4.0

Thoroughly test your components before implementing the latest version in a production environment. HDInsight 4.0 is available for you to begin the upgrade process. HDInsight 3.6 is the default option to prevent accidental mishaps.

There's no supported upgrade path from previous versions of HDInsight to HDInsight 4.0. Because Metastore and blob data formats have changed, 4.0 isn't compatible with previous versions. It's important you keep your new HDInsight 4.0 environment separate from your current production environment. If you deploy HDInsight 4.0 to your current environment, your Metastore will be permanently upgraded.  

## Limitations

* HDInsight 4.0 doesn't support Apache Storm.
* HDInsight 4.0 doesn't support the ML Services cluster type.
* Shell interpreter in Apache Zeppelin isn't supported in Spark and Interactive Query clusters.
* Apache Pig runs on Tez by default. However, you can change it to MapReduce.
* Spark SQL Ranger integration for row and column security is deprecated.

## Next steps

* [HBase migration guide](./hbase/apache-hbase-migrate-new-version.md)
* [Hive migration guide](./interactive-query/apache-hive-migrate-workloads.md)
* [Kafka migration guide](./kafka/migrate-versions.md)
* [Azure HDInsight Documentation](index.yml)
* [Release Notes](hdinsight-release-notes.md)
