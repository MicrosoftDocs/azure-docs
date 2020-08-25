---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, R Server, Hive, and more.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.service: hdinsight
ms.topic: conceptual
ms.date: 07/14/2020
---
# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.

## Release date: 07/13/2020

This release applies both for HDInsight 3.6 and 4.0. HDInsight release is made available to all regions over several days. The release date here indicates the first region release date. If you don't see below changes, wait for the release being live in your region in several days.

## New features
### Support for Customer Lockbox for Microsoft Azure
Azure HDInsight now supports Azure Customer Lockbox. It provides an interface for customers to review and approve, or reject customer data access requests. It is used when Microsoft engineer needs to access customer data during a support request. For more information, see [Customer Lockbox for Microsoft Azure](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-preview).

### Service endpoint policies for storage
Customers can now use Service Endpoint Policies (SEP) on the HDInsight cluster subnet. Learn more about [Azure service endpoint policy](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoint-policies-overview).

## Deprecation
### Deprecation of Spark 2.1 and 2.2 in HDInsight 3.6 Spark cluster
Starting from July 1 2020, customers cannot create new Spark clusters with Spark 2.1 and 2.2 on HDInsight 3.6. Existing clusters will run as is without the support from Microsoft. Consider to move to Spark 2.3 on HDInsight 3.6 by June 30 2020 to avoid potential system/support interruption.
 
### Deprecation of Spark 2.3 in HDInsight 4.0 Spark cluster
Starting from July 1 2020, customers cannot create new Spark clusters with Spark 2.3 on HDInsight 4.0. Existing clusters will run as is without the support from Microsoft. Consider moving to Spark 2.4 on HDInsight 4.0 by June 30 2020 to avoid potential system/support interruption.
 
### Deprecation of Kafka 1.1 in HDInsight 4.0 Kafka cluster
Starting from July 1 2020, customers will not be able to create new Kafka clusters with Kafka 1.1 on HDInsight 4.0. Existing clusters will run as is without the support from Microsoft. Consider moving to Kafka 2.1 on HDInsight 4.0 by June 30 2020 to avoid potential system/support interruption.

## Behavior changes
No behavior changes you need to pay attention to.

## Upcoming changes
The following changes will happen in upcoming releases. 

### Ability to select different Zookeeper SKU for Spark, Hadoop, and ML Services
HDInsight today doesn't support changing Zookeeper SKU for Spark, Hadoop, and ML Services cluster types. It uses A2_v2/A2 SKU for Zookeeper nodes and customers aren't charged for them. In the upcoming release, customers will be able to change Zookeeper SKU for Spark, Hadoop, and ML Services as needed. Zookeeper nodes with SKU other than A2_v2/A2 will be charged. The default SKU will still be A2_V2/A2 and free of charge.

## Bug fixes
HDInsight continues to make cluster reliability and performance improvements. 
### Fixed Hive Warehouse Connector issue
There was an issue for Hive Warehouse connector usability in previous release. The issue has been fixed. 

### Fixed Zeppelin notebook truncates leading zeros issue
Zeppelin was incorrectly truncating leading zeros in the table output for String format. We've fixed this issue in this release.

## Component version change
No component version change for this release. You can find the current component versions for HDInsight 4.0 and HDInsight 3.6 in [this doc](https://docs.microsoft.com/azure/hdinsight/hdinsight-component-versioning#apache-hadoop-components-available-with-different-hdinsight-versions).
