---
title: HDInsight 4.0 overview (Preview) - Azure
description: Compare HDInsight 3.6 to HDInsight 4.0 features, limitations, and upgrade recommendations.
ms.service: hdinsight
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.topic: overview
ms.date: 10/04/2018
---

# HDInsight 4.0 overview (Preview)

Azure HDInsight is one of the most popular services among enterprise customers for open-source Hadoop and Spark analytics on Azure. HDInsight (HDI) 4.0 is a cloud distribution of the Hadoop components from the [Hortonworks Data Platform (HDP) 3.0](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.0/release-notes/content/relnotes.html). This article provides information about the most recent Azure HDInsight release and how to upgrade.

## What's new in HDI 4.0?

### Hive 3.0 and LLAP

Hive low-latency analytical processing (LLAP) uses persistent query servers and in-memory caching to deliver quick SQL query results on data in remote cloud storage. Hive LLAP leverages a set of persistent daemons that execute fragments of Hive queries. Query execution on LLAP is similar to Hive without LLAP, with worker tasks running inside LLAP daemons instead of containers.

Benefits of Hive LLAP include:

* Ability to perform deep SQL analytics, such as complex joins, subqueries, windowing functions, sorting, user-defined functions, and complex aggregations, without sacrificing performance and scalability.

* Interactive queries against data in the same storage where data is prepared, eliminating the need to move data from storage to another engine for analytical processing.

* Caching query results allows previously computed query results to be reused, which saves time and resources spent running the cluster tasks required for the query.

### Hive dynamic materialized views

Hive now supports dynamic materialized views, or pre-computation of relevant summaries, used to accelerate query processing in data warehouses. Materialized views can be stored natively in Hive, and can seamlessly use LLAP acceleration.

### Hive transactional tables

HDI 4.0 includes Apache Hive 3, which requires atomicity, consistency, isolation, and durability (ACID) compliance for transactional tables that reside in the Hive warehouse. ACID-compliant tables and table data are accessed and managed by Hive. Data in create, retrieve, update, and delete (CRUD) tables must be in Optimized Row Column (ORC) file format, but insert-only tables support all file formats.

* ACID v2 has performance improvements in both storage format and the execution engine. 

* ACID is enabled by default to allow full support for data updates.

* Improved ACID capabilities allow you to update and delete at row level.

* No Performance overhead.

* No Bucketing required.

* Spark can read and write to Hive ACID tables via Hive Warehouse Connector.

Learn more about [Apache Hive 3](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.0/hive-overview/content/hive_whats_new_in_this_release_hive.html).

### Apache Spark

Apache Spark gets updatable tables and ACID transactions with Hive Warehouse Connector. Hive Warehouse Connector allows you to register Hive transactional tables as external tables in Spark to access full transactional functionality. Previous versions only supported table partition manipulation. Hive Warehouse Connector also supports Streaming DataFrames for streaming reads and writes into transactional and streaming Hive tables from Spark.

Spark executors can connect directly to Hive LLAP daemons to retrieve and update data in a transactional manner, allowing Hive to keep control of the data.

Apache Spark on HDInsight 4.0 supports the following scenarios:

* Run machine learning model training over the same transactional table used for reporting.
* Use ACID transactions to safely add columns from Spark ML to a Hive table.
* Run a Spark streaming job on the change feed from a Hive streaming table.
* Create ORC files directly from a Spark Structured Streaming job.

You no longer have to worry about accidentally trying to access Hive transactional tables directly from Spark, resulting in inconsistent results, duplicate data, or data corruption. In HDI 4.0, Spark tables and Hive tables are kept in separate Metastores. Use Hive Data Warehouse Connector to explicitly register Hive transactional tables as Spark external tables.

Learn more about [Apache Spark](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.0/spark-overview/content/analyzing_data_with_apache_spark.html).


### Oozie

Apache Oozie 4.3.1 is included in HDI 4.0 with the following changes:

* Oozie no longer runs Hive actions. Hive CLI has been removed and replaced with BeeLine.

* You can exclude unwanted dependencies from share lib by including an exclude pattern in your **job.properties** file.

Learn more about [Apache Oozie](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.0/release-notes/content/patch_oozie.html).

## How to upgrade to HDI 4.0

As with any major release, it's important to thoroughly test your components before implementing the latest version in a production environment. HDI 4.0 is available for you to begin the upgrade process, but HDI 3.6 is the default option to prevent accidental mishaps.

There is no supported upgrade path from previous versions of HDI to HDI 4.0. Because Metastore and blob data formats have changed, HDI 4.0 is not compatible with previous versions. It is important that you keep your new HDI 4.0 environment separate from your current production environment. If you deploy HDI 4.0 to your current environment, your Metastore will be upgraded and cannot be reversed.  

## Limitations

* HDI 4.0 does not support MapReduce. Use Tez instead. Learn more about [Apache Tez](https://tez.apache.org/).

* Hive View is no longer available in HDI 4.0. 

* Shell interpreter in Apache Zeppelin is not supported in Spark and Interactive Query clusters.

* You can't *disable* LLAP on a Spark-LLAP cluster. You can only turn LLAP off.

* Azure Data Lake Storage Gen2 can't save Juypter notebooks in a Spark cluster.

## Next steps

* [Azure HDInsight Documentation](index.yml)
* [Release Notes](hdinsight-release-notes.md)
