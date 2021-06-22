---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 06/02/2021
---
# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.

If you would like to subscribe on release notes, watch releases on [this GitHub repository](https://github.com/hdinsight/release-notes/releases).


## Release date: 06/02/2021

This release applies for both HDInsight 3.6 and HDInsight 4.0. HDInsight release is made available to all regions over several days. The release date here indicates the first region release date. If you don't see below changes, wait for the release being live in your region in several days.

The OS versions for this release are:
- HDInsight 3.6: Ubuntu 16.04.7 LTS
- HDInsight 4.0: Ubuntu 18.04.5 LTS

## New features
### OS version upgrade
As referenced in [Ubuntu's release cycle](https://ubuntu.com/about/release-cycle), the Ubuntu 16.04 kernel will reach End of Life (EOL) in April 2021. We started rolling out the new HDInsight 4.0 cluster image running on Ubuntu 18.04 with this release. Newly created HDInsight 4.0 clusters will run on Ubuntu 18.04 by default once available. Existing clusters on Ubuntu 16.04 will run as is with full support.

HDInsight 3.6 will continue to run on Ubuntu 16.04. It will change to Basic support (from Standard support) beginning 1 July 2021. For more information about dates and support options, see [Azure HDInsight versions](./hdinsight-component-versioning.md#supported-hdinsight-versions). Ubuntu 18.04 will not be supported for HDInsight 3.6. If you'd like to use Ubuntu 18.04, you'll need to migrate your clusters to HDInsight 4.0. 

You need to drop and recreate your clusters if you'd like to move existing HDInsight 4.0 clusters to Ubuntu 18.04. Plan to create or recreate your clusters after Ubuntu 18.04 support becomes available.

After creating the new cluster, you can SSH to your cluster and run `sudo lsb_release -a` to verify that it runs on Ubuntu 18.04. We recommend that you test your applications in your test subscriptions first before moving to production. [Learn more about the HDInsight Ubuntu 18.04 update](./hdinsight-ubuntu-1804-qa.md).

### Scaling optimizations on HBase accelerated writes clusters
HDInsight made some improvements and optimizations on scaling for HBase accelerated write enabled clusters. [Learn more about HBase accelerated write](./hbase/apache-hbase-accelerated-writes.md).

## Deprecation
No deprecation in this release.

## Behavior changes
### Disable Stardard_A5 VM size as Head Node for HDInsight 4.0
HDInsight cluster Head Node is responsible for initializing and managing the cluster. Standard_A5 VM size has reliability issues as Head Node for HDInsight 4.0. Starting from this release, customers will not be able to create new clusters with Standard_A5 VM size as Head Node. You can use other two-core VMs like E2_v3 or E2s_v3. Existing clusters will run as is. A four-core VM is highly recommended for Head Node to ensure the high availability and reliability of your production HDInsight clusters.

### Network interface resource not visible for clusters running on Azure virtual machine scale sets
HDInsight is gradually migrating to Azure virtual machine scale sets. Network interfaces for virtual machines are no longer visible to customers for clusters that use Azure virtual machine scale sets.

## Upcoming changes
The following changes will happen in upcoming releases.

### HDInsight Interactive Query only supports schedule-based Autoscale

As customer scenarios grow more mature and diverse, we have identified some limitations with Interactive Query (LLAP) load-based Autoscale. These limitations are caused by the nature of LLAP query dynamics, future load prediction accuracy issues, and issues in the LLAP scheduler's task redistribution. Due to these limitations, users may see their queries run slower on LLAP clusters when Autoscale is enabled. The affect on performance can outweigh the cost benefits of Autoscale.

Starting from July  2021, the Interactive Query workload in HDInsight only supports schedule-based Autoscale. You can no longer enable Autoscale on new Interactive Query clusters. Existing running clusters can continue to run with the known limitations described above. 

Microsoft recommends that you move to a schedule-based Autoscale for LLAP.  You can analyze your cluster's current usage pattern through the Grafana Hive dashboard. For more information, see [Automatically scale Azure HDInsight clusters](hdinsight-autoscale-clusters.md). 

### Basic support for HDInsight 3.6 starting July 1, 2021
Starting July 1, 2021, Microsoft will offer [Basic support](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) for certain HDInsight 3.6 cluster types. The Basic support plan will be available until 3 April 2022. You'll automatically be enrolled in Basic support starting July 1, 2021. No action is required by you to opt in. See [our documentation](hdinsight-36-component-versioning.md) for which cluster types are included under Basic support. 

We don't recommend building any new solutions on HDInsight 3.6, freeze changes on existing 3.6 environments. We recommend that you [migrate your clusters to HDInsight 4.0](hdinsight-version-release.md#how-to-upgrade-to-hdinsight-40). Learn more about [what's new in HDInsight 4.0](hdinsight-version-release.md#whats-new-in-hdinsight-40).

### VM host naming will be changed on July 1, 2021
HDInsight now uses Azure virtual machines to provision the cluster. The service is gradually migrating to [Azure virtual machine scale sets](../virtual-machine-scale-sets/overview.md). This migration will change the cluster host name FQDN name format, and the numbers in the host name will not be guarantee in sequence. If you want to get the FQDN names for each node, refer to [Find the Host names of Cluster Nodes](./find-host-name.md).

### Move to Azure virtual machine scale sets
HDInsight now uses Azure virtual machines to provision the cluster. The service will gradually migrate to [Azure virtual machine scale sets](../virtual-machine-scale-sets/overview.md). The entire process may take months. After your regions and subscriptions are migrated, newly created HDInsight clusters will run on virtual machine scale sets without customer actions. No breaking change is expected.

## Bug fixes
HDInsight continues to make cluster reliability and performance improvements. 

## Component version change
You can find the current component versions for HDInsight 4.0 and HDInsight 3.6 in [this doc](./hdinsight-component-versioning.md).
