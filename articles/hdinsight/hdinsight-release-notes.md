---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, R Server, Hive, and more.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.service: hdinsight
ms.topic: conceptual
ms.date: 09/27/2020
---
# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.

## Release date: 09/28/2020

This release applies for both HDInsight 3.6 and HDInsight 4.0. HDInsight release is made available to all regions over several days. The release date here indicates the first region release date. If you don't see below changes, wait for the release being live in your region in several days.

## New features
### Autoscale for Interactive Query with HDInsight 4.0 is now generally available
Auto scale for Interactive Query cluster type is now General Available (GA) for HDInsight 4.0. All Interactive Query 4.0 clusters created after 27 August 2020 will have GA support for auto scale.

### HBase cluster supports Premium ADLS Gen2
HDInsight now supports Premium ADLS Gen2 as primary storage account for HDInsight HBase 3.6 and 4.0 clusters. Together with [Accelerated Writes](./hbase/apache-hbase-accelerated-writes.md), you can get better performance for your HBase clusters.

### Kafka partition distribution on Azure fault domains
A fault domain is a logical grouping of underlying hardware in an Azure data center. Each fault domain shares a common power source and network switch. Before HDInsight Kafka may store all partition replicas in the same fault domain. Starting from this release, HDInsight now supports automatically distribution of Kafka partitions based on Azure fault domains. 

### Encryption in transit
Customers can enable encryption in transit between cluster nodes using IPSec encryption with platform-managed keys. This option can be enabled at the cluster creation time. See more details about [how to enable encryption in transit](./domain-joined/encryption-in-transit.md).

### Encryption at host
When you enable encryption at host, data stored on the VM host is encrypted at rest and flows encrypted to the storage service. From this release, you can **Enable encryption at host on temp data disk** when creating the cluster. Encryption at host is only supported on [certain VM SKUs in limited regions](https://docs.microsoft.com/azure/virtual-machines/linux/disks-enable-host-based-encryption-portal). HDInsight supports the [following node configuration and SKUs](./hdinsight-supported-node-configuration.md). See more details about [how to enable encryption at host](https://docs.microsoft.com/azure/hdinsight/disk-encryption#encryption-at-host-using-platform-managed-keys).

### Moving to Azure virtual machine scale sets
HDInsight now uses Azure virtual machines to provision the cluster. Starting from this release, the service will gradually migrate to [Azure virtual machine scale sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/overview). The entire process may take months. After your regions and subscriptions are migrated, newly created HDInsight clusters will run on virtual machine scale sets without customer actions. No breaking change is expected.

## Deprecation
No deprecation for this release.

## Behavior changes
No behavior change for this release.

## Upcoming changes
The following changes will happen in upcoming releases.

### Ability to select different Zookeeper SKU for Spark, Hadoop, and ML Services
HDInsight today doesn't support changing Zookeeper SKU for Spark, Hadoop, and ML Services cluster types. It uses A2_v2/A2 SKU for Zookeeper nodes and customers aren't charged for them. In the upcoming release, customers can change Zookeeper SKU for Spark, Hadoop, and ML Services as needed. Zookeeper nodes with SKU other than A2_v2/A2 will be charged. The default SKU will still be A2_V2/A2 and free of charge.

## Bug fixes
HDInsight continues to make cluster reliability and performance improvements. 

## Component version change
No component version change for this release. You can find the current component versions for HDInsight 4.0 and HDInsight 3.6 in [this doc](https://docs.microsoft.com/azure/hdinsight/hdinsight-component-versioning#apache-hadoop-components-available-with-different-hdinsight-versions).