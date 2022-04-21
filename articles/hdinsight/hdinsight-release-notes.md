---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 03/10/2022
---
# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.
If you would like to subscribe on release notes, watch releases on [this GitHub repository](https://github.com/hdinsight/release-notes/releases).

## Release date: 03/10/2022

This release applies for HDInsight 4.0. HDInsight release is made available to all regions over several days. The release date here indicates the first region release date. If you don't see below changes, wait for the release being live in your region over several days.

The OS versions for this release are: 
- 	HDInsight 4.0: Ubuntu 18.04.5 

## Spark 3.1 is now generally available

Spark 3.1 is now Generally Available on HDInsight 4.0 release.  This release includes 

* Adaptive Query Execution, 
* Convert Sort Merge Join to Broadcast Hash Join, 
* Spark Catalyst Optimizer,
* Dynamic Partition Pruning, 
* Customers will be able to create new Spark 3.1 clusters and not Spark 3.0 (preview) clusters.

For more details, see the [Apache Spark 3.1](https://techcommunity.microsoft.com/t5/analytics-on-azure-blog/spark-3-1-is-now-generally-available-on-hdinsight/ba-p/3253679) is now Generally Available on HDInsight - Microsoft Tech Community.

For a complete list of improvements, see the [Apache Spark 3.1 release notes.](https://spark.apache.org/releases/spark-release-3-1-2.html)

For more details on migration, see the [migration guide.](https://spark.apache.org/docs/latest/migration-guide.html)

## Kafka 2.4 is now generally available

Kafka 2.4.1 is now Generally Available.  For more information, please see [Kafka 2.4.1 Release Notes.](http://kafka.apache.org/24/documentation.html) 
Other features include MirrorMaker 2 availability, new metric category AtMinIsr topic partition, Improved broker start-up time by lazy on demand mmap of index files, More consumer metrics to observe user poll behavior.

## Map Datatype in HWC is now supported in HDInsight 4.0 

This release includes Map Datatype Support for HWC 1.0 (Spark 2.4) Via the spark-shell  application, and all other all spark clients that HWC supports. Following improvements are included like any other data types:

A user can 
*	Create a Hive table with any column(s) containing Map datatype, insert data into it and read the results from it.
*	Create an Apache Spark dataframe with Map Type and do batch/stream reads and writes.

### New regions

HDInsight has now expanded its geographical presence to two new regions: China East 3 and China North 3.

### OSS backport changes

OSS backports that are included in Hive including HWC 1.0 (Spark 2.4) which supports Map data type.

### Here are the OSS backported Apache JIRAs for this release:

| Impacted Feature    |   Apache JIRA                                                      |
|---------------------|--------------------------------------------------------------------|
| Metastore direct sql queries with IN/(NOT IN) should be split based on max parameters allowed by SQL DB   | [HIVE-25659](https://issues.apache.org/jira/browse/HIVE-25659)     |
| Upgrade log4j 2.16.0 to 2.17.0                    | [HIVE-25825](https://issues.apache.org/jira/browse/HIVE-25825)     |
| Update Flatbuffer version                    | [HIVE-22827](https://issues.apache.org/jira/browse/HIVE-22827)     |
| Support Map data-type natively in Arrow format                    | [HIVE-25553](https://issues.apache.org/jira/browse/HIVE-25553)     |
| LLAP external client - Handle nested values when the parent struct is null                    | [HIVE-25243](https://issues.apache.org/jira/browse/HIVE-25243)     |
| Upgrade arrow version to 0.11.0                    | [HIVE-23987](https://issues.apache.org/jira/browse/HIVE-23987)     |

## Deprecation notices
### Azure Virtual Machine Scale Sets on HDInsight  

HDInsight will no longer use Azure Virtual Machine Scale Sets to provision the clusters, no breaking change is expected. Existing HDInsight clusters on virtual machine scale sets will have no impact, any new clusters on latest images will no longer use Virtual Machine Scale Sets.  

### Scaling of Azure HDInsight HBase workloads will now be supported only using manual scale

Starting from March 01, 2022, HDInsight will only support manual scale for HBase, there's no impact on running clusters.  New HBase clusters won't be able to enable schedule based Autoscaling.  For more information on how to  manually scale your HBase cluster, refer our documentation on [Manually scaling Azure HDInsight clusters](./hdinsight-scaling-best-practices.md)

## HDInsight 3.6 end of support extension 

HDInsight 3.6 end of support is extended until September 30, 2022.

Starting from September 30, 2022, customers can't create new HDInsight 3.6 clusters. Existing clusters will run as is without the support from Microsoft. Consider moving to HDInsight 4.0 to avoid potential system/support interruption.

Customers who are on Azure HDInsight 3.6 clusters will continue to get [Basic support](./hdinsight-component-versioning.md#support-options-for-hdinsight-versions) until September 30, 2022. After September 30, 2022 customers won't be able to create new HDInsight 3.6 clusters.