---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 06/03/2022
---

# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.
If you would like to subscribe on release notes, watch releases on [this GitHub repository](https://github.com/hdinsight/release-notes/releases).

## Release date: 06/03/2022

This release applies for HDInsight 4.0. HDInsight release is made available to all regions over several days. The release date here indicates the first region release date. If you don't see below changes, wait for the release being live in your region over several days.

## Release highlights

**The Hive Warehouse Connector (HWC) on Spark v3.1.2**

The Hive Warehouse Connector (HWC) allows you to take advantage of the unique features of Hive and Spark to build powerful big-data applications. HWC is currently supported for Spark v2.4 only.  This feature adds business value by allowing ACID transactions on Hive Tables using Spark. This feature is useful for customers who use both Hive and Spark in their data estate.
For more information, see [Apache Spark & Hive - Hive Warehouse Connector - Azure HDInsight | Microsoft Docs](./interactive-query/apache-hive-warehouse-connector.md)

## Ambari

* Scaling and provisioning improvement changes
* HDI hive is now compatible with OSS version 3.1.2

HDI Hive 3.1 version is upgraded to OSS Hive 3.1.2. This version has all fixes and features available in open source Hive 3.1.2 version.

> [!NOTE]
> **Spark**
> 
> * If you are using Azure User Interface to create Spark Cluster for HDInsight, you will see from the dropdown list an additional version Spark 3.1.(HDI 5.0) along with the older versions.  This version is a renamed version of Spark 3.1.(HDI 4.0). This is only an UI level change, which doesn’t impact anything for the existing users and users who are already using the ARM template.

![Screenshot_of spark 3.1 for HDI 5.0.](media/hdinsight-release-notes/spark-3-1-for-hdi-5-0.png)

> [!NOTE]
> **Interactive Query**
> 
> * If you are creating an Interactive Query Cluster, you will see from the dropdown list an additional version as Interactive Query 3.1 (HDI 5.0).
> * If you are going to use Spark 3.1 version along with Hive which require ACID support, you need to select this version Interactive Query 3.1 (HDI 5.0).

![Screenshot_of interactive query 3.1 for HDI 5.0.](media/hdinsight-release-notes/interactive-query-3-1-for-hdi-5-0.png)

## TEZ bug fixes

| Bug Fixes|Apache JIRA|
|---|---|
|TezUtils.createConfFromByteString on Configuration larger than 32 MB throws com.google.protobuf.CodedInputStream exception |[TEZ-4142](https://issues.apache.org/jira/browse/TEZ-4142)|
|TezUtils createByteStringFromConf should use snappy instead of DeflaterOutputStream|[TEZ-4113](https://issues.apache.org/jira/browse/TEZ-4113)|

## HBase bug fixes

| Bug Fixes|Apache JIRA|
|---|---|
|TableSnapshotInputFormat should use ReadType.STREAM for scanning HFiles |[HBASE-26273](https://issues.apache.org/jira/browse/HBASE-26273)|
|Add option to disable scanMetrics in TableSnapshotInputFormat |[HBASE-26330](https://issues.apache.org/jira/browse/HBASE-26330)|
|Fix for ArrayIndexOutOfBoundsException when balancer is executed |[HBASE-22739](https://issues.apache.org/jira/browse/HBASE-22739)|

## Hive bug fixes

|Bug Fixes|Apache JIRA|
|---|---|
| NPE when inserting data with 'distribute by' clause with dynpart sort optimization|[HIVE-18284](https://issues.apache.org/jira/browse/HIVE-18284)|
| MSCK REPAIR Command with Partition Filtering Fails While Dropping Partitions|[HIVE-23851](https://issues.apache.org/jira/browse/HIVE-23851)|
| Wrong exception thrown if capacity<=0|[HIVE-25446](https://issues.apache.org/jira/browse/HIVE-25446)|
| Support parallel load for HastTables - Interfaces|[HIVE-25583](https://issues.apache.org/jira/browse/HIVE-25583)|
| Include MultiDelimitSerDe in HiveServer2 By Default|[HIVE-20619](https://issues.apache.org/jira/browse/HIVE-20619)|
| Remove glassfish.jersey and mssql-jdbc classes from jdbc-standalone jar|[HIVE-22134](https://issues.apache.org/jira/browse/HIVE-22134)|
| Null pointer exception on running compaction against an MM table.|[HIVE-21280 ](https://issues.apache.org/jira/browse/HIVE-21280)|
| Hive query with large size via knox fails with Broken pipe Write failed|[HIVE-22231](https://issues.apache.org/jira/browse/HIVE-22231)|
| Adding ability for user to set bind user|[HIVE-21009](https://issues.apache.org/jira/browse/HIVE-21009)|
| Implement UDF to interpret date/timestamp using its internal representation and Gregorian-Julian hybrid calendar|[HIVE-22241](https://issues.apache.org/jira/browse/HIVE-22241)|
| Beeline option to show/not show execution report|[HIVE-22204](https://issues.apache.org/jira/browse/HIVE-22204)|
| Tez: SplitGenerator tries to look for plan files, which won't exist for Tez|[HIVE-22169 ](https://issues.apache.org/jira/browse/HIVE-22169)|
| Remove expensive logging from the LLAP cache hotpath|[HIVE-22168](https://issues.apache.org/jira/browse/HIVE-22168)|
| UDF: FunctionRegistry synchronizes on org.apache.hadoop.hive.ql.udf.UDFType class|[HIVE-22161](https://issues.apache.org/jira/browse/HIVE-22161)|
| Prevent the creation of query routing appender if property is set to false|[HIVE-22115](https://issues.apache.org/jira/browse/HIVE-22115)|
| Remove cross-query synchronization for the partition-eval|[HIVE-22106](https://issues.apache.org/jira/browse/HIVE-22106)|
| Skip setting up hive scratch dir during planning|[HIVE-21182](https://issues.apache.org/jira/browse/HIVE-21182)|
| Skip creating scratch dirs for tez if RPC is on|[HIVE-21171](https://issues.apache.org/jira/browse/HIVE-21171)|
| switch Hive UDFs to use Re2J regex engine|[HIVE-19661 ](https://issues.apache.org/jira/browse/HIVE-19661)|
| Migrated clustered tables using bucketing_version 1 on hive 3 uses bucketing_version 2 for inserts|[HIVE-22429](https://issues.apache.org/jira/browse/HIVE-22429)|
| Bucketing: Bucketing version 1 is incorrectly partitioning data|[HIVE-21167 ](https://issues.apache.org/jira/browse/HIVE-21167)|
| Adding ASF License header to the newly added file|[HIVE-22498](https://issues.apache.org/jira/browse/HIVE-22498)|
| Schema tool enhancements to support mergeCatalog|[HIVE-22498](https://issues.apache.org/jira/browse/HIVE-22498)|
| Hive with TEZ UNION ALL and UDTF results in data loss|[HIVE-21915](https://issues.apache.org/jira/browse/HIVE-21915)|
| Split text files even if header/footer exists|[HIVE-21924](https://issues.apache.org/jira/browse/HIVE-21924)|
| MultiDelimitSerDe returns wrong results in last column when the loaded file has more columns than the once are present in table schema|[HIVE-22360](https://issues.apache.org/jira/browse/HIVE-22360)|
| LLAP external client - Need to reduce LlapBaseInputFormat#getSplits() footprint|[HIVE-22221](https://issues.apache.org/jira/browse/HIVE-22221)|
| Column name with reserved keyword is unescaped when query including join on table with mask column is rewritten (Zoltan Matyus via Zoltan Haindrich)|[HIVE-22208](https://issues.apache.org/jira/browse/HIVE-22208)|
|Prevent LLAP shutdown on AMReporter related RuntimeException|[HIVE-22113](https://issues.apache.org/jira/browse/HIVE-22113)|
| LLAP status service driver may get stuck with wrong Yarn app ID|[HIVE-21866](https://issues.apache.org/jira/browse/HIVE-21866)|
| OperationManager.queryIdOperation doesn't  properly clean up multiple queryIds|[HIVE-22275](https://issues.apache.org/jira/browse/HIVE-22275)|
| Bringing a node manager down blocks restart of LLAP service|[HIVE-22219](https://issues.apache.org/jira/browse/HIVE-22219)|
| StackOverflowError when drop lots of partitions|[HIVE-15956](https://issues.apache.org/jira/browse/HIVE-15956)|
| Access check is failed when a temporary directory is removed|[HIVE-22273](https://issues.apache.org/jira/browse/HIVE-22273)|
| Fix wrong results/ArrayOutOfBound exception in left outer map joins on specific boundary conditions|[HIVE-22120](https://issues.apache.org/jira/browse/HIVE-22120)|
| Remove distribution management tag from pom.xml|[HIVE-19667](https://issues.apache.org/jira/browse/HIVE-19667)|
| Parsing time can be high if there's deeply nested subqueries|[HIVE-21980](https://issues.apache.org/jira/browse/HIVE-21980)|
| For ALTER TABLE t SET TBLPROPERTIES ('EXTERNAL'='TRUE'); `TBL_TYPE` attribute changes not reflecting for non-CAPS|[HIVE-20057 ](https://issues.apache.org/jira/browse/HIVE-20057)|
| JDBC: HiveConnection shades log4j interfaces|[HIVE-18874](https://issues.apache.org/jira/browse/HIVE-18874)|
| Update repo URLs in poms - branh 3.1 version|[HIVE-21786](https://issues.apache.org/jira/browse/HIVE-21786)|
| DBInstall tests broken on master and branch-3.1|[HIVE-21758](https://issues.apache.org/jira/browse/HIVE-21758)|
| Load data into a bucketed table is ignoring partitions specs and loads data into default partition|[HIVE-21564](https://issues.apache.org/jira/browse/HIVE-21564)|
| Queries with join condition having timestamp or timestamp with local time zone literal throw SemanticException|[HIVE-21613](https://issues.apache.org/jira/browse/HIVE-21613)|
| Analyze compute stats for column leave behind staging dir on HDFS|[HIVE-21342](https://issues.apache.org/jira/browse/HIVE-21342)|
| Incompatible change in Hive bucket computation|[HIVE-21376](https://issues.apache.org/jira/browse/HIVE-21376)|
| Provide a fallback authorizer when no other authorizer is in use|[HIVE-20420](https://issues.apache.org/jira/browse/HIVE-20420)|
| Some alterPartitions invocations throw 'NumberFormatException: null'|[HIVE-18767](https://issues.apache.org/jira/browse/HIVE-18767)|
| HiveServer2: Preauthenticated subject for http transport isn't retained for entire duration of http communication in some cases|[HIVE-20555](https://issues.apache.org/jira/browse/HIVE-20555)|