---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, R Server, Hive, and more.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.service: hdinsight
ms.topic: conceptual
ms.date: 08/08/2019
---
# Release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source Apache Hadoop and Apache Spark analytics on Azure.

## Release date: 11/07/2019

This release applies both for HDInsight 3.6 and 4.0.

> [!IMPORTANT]  
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight versioning article](hdinsight-component-versioning.md).


## New features

### HDInsight Identity Broker (HIB) (Preview)

HDInsight Identity Broker (HIB) enables users to sign in to Apache Ambari using multi-factor authentication (MFA) and get the required Kerberos tickets without needing password hashes in Azure Active Directory Domain Services (AAD-DS). Currently HIB is only available for clusters deployed through ARM template.

### Kafka Rest API Proxy (Preview)

Kafka Rest API Proxy provides one-click deployment of highly available REST proxy with Kafka cluster via secured AAD authorization and OAuth protocol. 

### Auto scale

Autoscale for Azure HDInsight is now generally available across all regions for Apache Spark and Hadoop cluster types. This feature makes it possible to manage big data analytics workloads in a more cost-efficient and productive way. Now you can optimize use of your HDInsight clusters and only pay for what you need.

Depending on your requirements, you can choose between load-based and schedule-based autoscaling. Load-based Autoscale can scale the cluster size up and down based on the current resource needs while schedule-based Autoscale can change the cluster size based on a predefined schedule. 

Autoscale support for HBase and LLAP workload is also public preview. For more information, see [Automatically scale Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-autoscale-clusters).

### HDInsight Accelerated Writes for Apache HBase 

Accelerated Writes uses Azure premium SSD managed disks to improve performance of the Apache HBase Write Ahead Log (WAL). For more information, see [Azure HDInsight Accelerated Writes for Apache HBase](https://docs.microsoft.com/azure/hdinsight/hbase/apache-hbase-accelerated-writes).

### Custom Ambari DB

HDInsight now offers a new capacity to enable customers to use their own SQL DB for Ambari. Now customers can choose the right SQL DB for Ambari and  easily upgrade it based on their own business growth requirement. The deployment is done with an Azure Resource Manager template. For more information, see [Set up HDInsight clusters with a custom Ambari DB](https://docs.microsoft.com/azure/hdinsight/hdinsight-custom-ambari-db).

### F-series virtual machines are now available with HDInsight

F-series virtual machines(VMs) are good choice to get started with HDInsight with light processing requirements. At a lower per-hour list price, the F-series is the best value in price-performance in the Azure portfolio based on the Azure Compute Unit (ACU) per vCPU. For more information, see [Selecting the right VM size for your Azure HDInsight cluster](https://docs.microsoft.com/azure/hdinsight/hdinsight-selecting-vm-size).

## Deprecation

### G-series virtual machine deprecation
From this release, G-series VMs are no longer offered in HDInsight.

### Dv1 virtual machine deprecation
From this release, the use of Dv1 VMs with HDInsight is deprecated. Any customer request for Dv1 will be served with Dv2 automatically. There is no price difference between Dv1 and Dv2 VMs.

## Behavior changes

### Cluster managed disk size change
HDInsight provides managed disk space with the cluster. From this release, the managed disk size of each node in the new created cluster is changed to 128 GB.

## Upcoming changes
The following changes will happen in the upcoming releases. 

### Moving to Azure virtual machine scale sets
HDInsight now uses Azure virtual machines to provision the cluster. Starting from December, HDInsight will use Azure virtual machine scale sets instead. See more about [Azure virtual machine scale sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/overview).

### HBase 2.0 to 2.1
In the upcoming HDInsight 4.0 release, HBase version will be upgraded from version 2.0 to 2.1.

### A-series virtual machine deprecation for ESP cluster
A-series VMs could cause ESP cluster issues due to relatively low CPU and memory capacity. In the upcoming release, A-series VMs will be deprecated for creating new ESP clusters.

## Bug fixes
HDInsight continues to make cluster reliability and performance improvements. 

## Component version change
There is no component version change for this release. You could find the current component versions for HDInsight 4.0 and HDInsight 3.6 [here](https://docs.microsoft.com/azure/hdinsight/hdinsight-component-versioning).
