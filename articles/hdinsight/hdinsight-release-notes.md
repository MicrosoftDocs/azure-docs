---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, R Server, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 03/23/2021
---
# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.

If you would like to subscribe on release notes, watch releases on [this GitHub repository](https://github.com/hdinsight/release-notes/releases).

## Release date: 03/24/2021

This release applies for both HDInsight 3.6 and HDInsight 4.0. HDInsight release is made available to all regions over several days. The release date here indicates the first region release date. If you don't see below changes, wait for the release being live in your region in several days.

## New features
### Spark 3.0 preview
HDInsight added [Spark 3.0.0](https://spark.apache.org/docs/3.0.0/) support to HDInsight 4.0 as a Preview feature. 

### Kafka 2.4 preview
HDInsight added [Kafka 2.4.1](http://kafka.apache.org/24/documentation.html) support to HDInsight 4.0 as a Preview feature.

### Eav4-series support
HDInsight added Eav4-series support in this release. Learn more about [Dav4-series here](../virtual-machines/eav4-easv4-series.md). The series has been made available in the following regions: 

* Australia East
* Brazil South
* Central US
* East Asia
* East US
* Japan East
* Southeast Asia
* UK South
* West Europe
* West US 2

### Moving to Azure virtual machine scale sets
HDInsight now uses Azure virtual machines to provision the cluster. The service is gradually migrating to [Azure virtual machine scale sets](../virtual-machine-scale-sets/overview.md). The entire process may take months. After your regions and subscriptions are migrated, newly created HDInsight clusters will run on virtual machine scale sets without customer actions. No breaking change is expected.

## Deprecation
No deprecation in this release.

## Behavior changes
### Default cluster version is changed to 4.0
The default version of HDInsight cluster is changed from 3.6 to 4.0. For more information about available versions, see [available versions](./hdinsight-component-versioning.md). Learn more about what is new in [HDInsight 4.0](./hdinsight-version-release.md).

### Default cluster VM sizes are changed to Ev3-series 
Default cluster VM sizes are changed from D-series to Ev3-series. This change applies to head nodes and worker nodes. To avoid this change impacting your tested workflows, specify the VM sizes that you want to use in the ARM template.

### Network interface resource not visible for clusters running on Azure virtual machine scale sets
HDInsight is gradually migrating to Azure virtual machine scale sets. Network interfaces for virtual machines are no longer visible to customers for clusters that use Azure virtual machine scale sets.

## Upcoming changes
The following changes will happen in upcoming releases.

### OS version upgrade
HDInsight clusters are currently running on Ubuntu 16.04 LTS. As referenced in [Ubuntu’s release cycle](https://ubuntu.com/about/release-cycle), the Ubuntu 16.04 kernel will reach End of Life (EOL) in April 2021. We’ll start rolling out the new HDInsight 4.0 cluster image running on Ubuntu 18.04 in May 2021. Newly created HDInsight 4.0 clusters will run on Ubuntu 18.04 by default once available. Existing clusters on Ubuntu 16.04 will run as is with full support.

HDInsight 3.6 will continue to run on Ubuntu 16.04. It will reach the end of standard support by 30 June 2021, and will change to Basic support starting on 1 July 2021. For more information about dates and support options, see [Azure HDInsight versions](https://docs.microsoft.com/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions). Ubuntu 18.04 will not be supported for HDInsight 3.6. If you’d like to use Ubuntu 18.04, you’ll need to migrate your clusters to HDInsight 4.0. 

You need to drop and recreate your clusters if you’d like to move existing clusters to Ubuntu 18.04. Please plan to create or recreate your cluster after Ubuntu 18.04 support becomes available. We’ll send another notification after the new image becomes available in all regions.

It’s highly recommended that you test your script actions and custom applications deployed on edge nodes on an Ubuntu 18.04 virtual machine (VM) in advance. You can [create a simple Ubuntu Linux VM on 18.04-LTS](https://azure.microsoft.com/resources/templates/101-vm-simple-linux/), then create and use a [secure shell (SSH) key pair](https://docs.microsoft.com/azure/virtual-machines/linux/mac-create-ssh-keys#ssh-into-your-vm) on your VM to run and test your script actions and custom applications deployed on edge nodes.

### Disable Stardard_A5 VM size as Head Node for HDInsgiht 4.0
HDInsight cluster Head Node is responsible for initializing and managing the cluster. Standard_A5 VM size has reliability issues as Head Node for HDInsight 4.0. Starting from the next release in May 2021, customers will not be able to create new clusters with Standard_A5 VM size as Head Node. You can use other 2-core VMs like E2_v3 or E2s_v3. Existing clusters will run as is. A 4-core VM is highly recommended for Head Node to ensure the high availability and reliability of your production HDInsight clusters.

### Basic support for HDInsight 3.6 starting July 1, 2021
Starting July 1, 2021, Microsoft will offer [Basic support](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) for certain HDInsight 3.6 cluster types. The Basic support plan will be available until 3 April 2022. You'll automatically be enrolled in Basic support starting July 1, 2021. No action is required by you to opt in. See [our documentation](hdinsight-36-component-versioning.md) for which cluster types are included under Basic support. 

We don't recommend building any new solutions on HDInsight 3.6, freeze changes on existing 3.6 environments. We recommend that you [migrate your clusters to HDInsight 4.0](hdinsight-version-release.md#how-to-upgrade-to-hdinsight-40). Learn more about [what's new in HDInsight 4.0](hdinsight-version-release.md#whats-new-in-hdinsight-40).

## Bug fixes
HDInsight continues to make cluster reliability and performance improvements. 

## Component version change
Added support for Spark 3.0.0 and Kafka 2.4.1 as Preview. 
You can find the current component versions for HDInsight 4.0 and HDInsight 3.6 in [this doc](./hdinsight-component-versioning.md).

## Recommanded features
### Service tags
Service tags simplify restricting network access to the Azure services for Azure virtual machines and Azure virtual networks. Service tags in your network security group (NSG) rules allow or deny traffic to a specific Azure service. The rule can be set globally or per Azure region. Azure provides the maintenance of IP addresses underlying each tag. HDInsight service tags for network security groups (NSGs) are groups of IP addresses for health and management services. These groups help minimize complexity for security rule creation. HDInsight customers can enable service tag through Azure portal, PowerShell, and REST API. For more information, see [Network security group (NSG) service tags for Azure HDInsight](./hdinsight-service-tags.md).
