---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, R Server, Hive, and more.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.service: hdinsight
ms.topic: conceptual
ms.date: 11/12/2020
---
# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.

If you would like to subscribe on release notes, watch releases on [this GitHub repository](https://github.com/hdinsight/release-notes/releases).

## Release date: 11/18/2020

This release applies for both HDInsight 3.6 and HDInsight 4.0. HDInsight release is made available to all regions over several days. The release date here indicates the first region release date. If you don't see below changes, wait for the release being live in your region in several days.

## New features
### Auto key rotation for customer managed key encryption at rest
Starting from this release, customers can use Azure KeyValut version-less encryption key URLs for customer managed key encryption at rest. HDInsight will automatically rotate the keys as they expire or replaced with new versions. Learn more details [here](./disk-encryption.md).

### Ability to select different Zookeeper virtual machine sizes for Spark, Hadoop, and ML Services
HDInsight previously didn't support customizing Zookeeper node size for Spark, Hadoop, and ML Services cluster types. It defaults to A2_v2/A2 virtual machine sizes, which are provided free of charge. From this release, you can select a Zookeeper virtual machine size that is most appropriate for your scenario. Zookeeper nodes with virtual machine size other than A2_v2/A2 will be charged. A2_v2 and A2 virtual machines are still provided free of charge.

### Moving to Azure virtual machine scale sets
HDInsight now uses Azure virtual machines to provision the cluster. Starting from this release, the service will gradually migrate to [Azure virtual machine scale sets](../virtual-machine-scale-sets/overview.md). The entire process may take months. After your regions and subscriptions are migrated, newly created HDInsight clusters will run on virtual machine scale sets without customer actions. No breaking change is expected.

## Deprecation
### Deprecation of HDInsight 3.6 ML Services cluster
HDInsight 3.6 ML Services cluster type will be end of support by December 31 2020. Customers won't create new 3.6 ML Services clusters after December 31 2020. Existing clusters will run as is without the support from Microsoft. Check the support expiration for HDInsight versions and cluster types [here](./hdinsight-component-versioning.md#available-versions).

### Disabled VM sizes
Starting from November 16 2020, HDInsight will block new customers creating clusters using standand_A8, standand_A9, standand_A10 and standand_A11 VM sizes. Existing customers who have used these VM sizes in the past three months won't be affected. Starting form January 9 2021, HDInsight will block all customers creating clusters using standand_A8, standand_A9, standand_A10 and standand_A11 VM sizes. Existing clusters will run as is. Consider moving to HDInsight 4.0 to avoid potential system/support interruption.

### Behavior changes
No behavior change for this release.

## Upcoming changes
The following changes will happen in upcoming releases.

### Default cluster version will be changed to 4.0
Starting February 2021, the default version of HDInsight cluster will be changed from 3.6 to 4.0. For more information about available versions, see [available versions](./hdinsight-component-versioning.md#available-versions). Learn more about what is new in [HDInsight 4.0](./hdinsight-version-release.md)

### HDInsight 3.6 end of support on June 30 2021
HDInsight 3.6 will be end of support. Starting form June 30 2021, customers can't create new HDInsight 3.6 clusters. Existing clusters will run as is without the support from Microsoft. Consider moving to HDInsight 4.0 to avoid potential system/support interruption.

## Bug fixes
HDInsight continues to make cluster reliability and performance improvements. 

## Component version change
No component version change for this release. You can find the current component versions for HDInsight 4.0 and HDInsight 3.6 in [this doc](./hdinsight-component-versioning.md).