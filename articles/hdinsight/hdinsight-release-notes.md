---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, R Server, Hive, and more.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.service: hdinsight
ms.topic: conceptual
ms.date: 06/11/2020
---
# Release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.

## Release date: 06/11/2020

This release applies both for HDInsight 3.6 and 4.0. HDInsight release is made available to all regions over several days. The release date here indicates the first region release date. If you don't see below changes, wait for the release being live in your region in several days.

## New features
### Moving to Azure virtual machine scale sets
HDInsight uses Azure virtual machines to provision the cluster now. From this release, new-created HDInsight clusters start using Azure virtual machine scale set. The change is rolling out gradually. You should expect no breaking change. See more about [Azure virtual machine scale sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/overview).
 
### Reboot VMs in HDInsight cluster
In this release, we support rebooting VMs in HDInsight cluster to reboot unresponsive nodes. Currently you can only do it through API, PowerShell and CLI support is on the way. For more information about the API, see [this doc](https://github.com/Azure/azure-rest-api-specs/codeowners/master/specification/hdinsight/resource-manager/Microsoft.HDInsight/stable/2018-06-01-preview/virtualMachines.json).
 
## Deprecation
### Deprecation of Spark 2.1 and 2.2 in HDInsight 3.6 Spark cluster
Starting from July 1 2020, customers cannot create new Spark clusters with Spark 2.1 and 2.2 on HDInsight 3.6. Existing clusters will run as is without the support from Microsoft. Consider to move to Spark 2.3 on HDInsight 3.6 by June 30 2020 to avoid potential system/support interruption.
 
### Deprecation of Spark 2.3 in HDInsight 4.0 Spark cluster
Starting from July 1 2020, customers cannot create new Spark clusters with Spark 2.3 on HDInsight 4.0. Existing clusters will run as is without the support from Microsoft. Consider moving to Spark 2.4 on HDInsight 4.0 by June 30 2020 to avoid potential system/support interruption.
 
### Deprecation of Kafka 1.1 in HDInsight 4.0 Kafka cluster
Starting from July 1 2020, customers will not be able to create new Kafka clusters with Kafka 1.1 on HDInsight 4.0. Existing clusters will run as is without the support from Microsoft. Consider moving to Kafka 2.1 on HDInsight 4.0 by June 30 2020 to avoid potential system/support interruption.
 
## Behavior changes
### ESP Spark cluster head node size change 
The minimum allowed head node size for ESP Spark cluster is changed to Standard_D13_V2. 
VMs with low cores and memory as head node could cause ESP cluster issues because of relatively low CPU and memory capacity. Starting from release, use SKUs higher than Standard_D13_V2 and Standard_E16_V3 as head node for ESP Spark clusters.
 
### A minimum 4-core VM is required for Head Node 
A minimum 4-core VM is required for Head Node to ensure the high availability and reliability of HDInsight clusters. Starting from April 6 2020, customers can only choose 4-core or above VM as Head Node for the new HDInsight clusters. Existing clusters will continue to run as expected. 
 
### Cluster worker node provisioning change
When 80% of the worker nodes are ready, the cluster enters **operational** stage. At this stage, customers can do all the data plane operations like running scripts and jobs. But customers can't do any control plane operation like scaling up/down. Only deletion is supported.
 
After the **operational** stage, the cluster waits another 60 minutes for the remaining 20% worker nodes. At the end of this 60 minutes, the cluster moves to the **running** stage, even if all of worker nodes are still not available. Once a cluster enters the **running** stage, you can use it as normal. Both control plan operations like scaling up/down, and data plan operations like running scripts and jobs are accepted. If some of the requested worker nodes are not available, the cluster will be marked as partial success. You are charged for the nodes that were deployed successfully. 
 
### Create new service principal through HDInsight
Previously, with cluster creation, customers can create a new service principal to access the connected ADLS Gen 1 account in Azure portal. Starting June 15 2020, customers cannot create new service principal in HDInsight creation workflow, only existing service principal is supported. See [Create Service Principal and Certificates using Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).

### Time out for script actions with cluster creation
HDInsight supports running script actions with cluster creation. From this release, all script actions with cluster creation must finish within **60 minutes**, or they time out. Script actions submitted to running clusters are not impacted. Learn more details [here](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux#script-action-in-the-cluster-creation-process).
 
## Upcoming changes
No upcoming breaking changes that you need to pay attention to.
 
## Bug fixes
HDInsight continues to make cluster reliability and performance improvements. 
 
## Component version change
### HBase 2.0 to 2.1.6
HBase version is upgraded from version 2.0 to 2.1.6.
 
### Spark 2.4.0 to 2.4.4
Spark version is upgraded from version 2.4.0 to 2.4.4.
 
### Kafka 2.1.0 to 2.1.1
Kafka version is upgraded from version 2.1.0 to 2.1.1.
 
You can find the current component versions for HDInsight 4.0 ad HDInsight 3.6 in [this doc](https://docs.microsoft.com/azure/hdinsight/hdinsight-component-versioning#apache-hadoop-components-available-with-different-hdinsight-versions)

