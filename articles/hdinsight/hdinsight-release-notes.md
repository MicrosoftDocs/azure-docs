---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 07/27/2021
---
# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.

If you would like to subscribe on release notes, watch releases on [this GitHub repository](https://github.com/hdinsight/release-notes/releases).

## Release date: 07/27/2021

This release applies for both HDInsight 3.6 and HDInsight 4.0. HDInsight release is made available to all regions over several days. The release date here indicates the first region release date. If you don't see below changes, wait for the release being live in your region in several days.

The OS versions for this release are:
- HDInsight 3.6: Ubuntu 16.04.7 LTS
- HDInsight 4.0: Ubuntu 18.04.5 LTS

## New features
### New Azure Monitor integration experience (Preview)
The new Azure monitor integration experience will be Preview in East US and West Europe with this release. Learn more details about the new Azure monitor experience [here](./log-analytics-migration.md#migrate-to-the-new-azure-monitor-integration).

## Deprecation
### Basic support for HDInsight 3.6 starting July 1, 2021
Starting July 1, 2021, Microsoft offers [Basic support](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) for certain HDInsight 3.6 cluster types. The Basic support plan will be available until 3 April 2022. You are automatically enrolled in Basic support starting July 1, 2021. No action is required by you to opt in. See [our documentation](hdinsight-36-component-versioning.md) for which cluster types are included under Basic support. 

We don't recommend building any new solutions on HDInsight 3.6, freeze changes on existing 3.6 environments. We recommend that you [migrate your clusters to HDInsight 4.0](hdinsight-version-release.md#how-to-upgrade-to-hdinsight-40). Learn more about [what's new in HDInsight 4.0](hdinsight-version-release.md#whats-new-in-hdinsight-40).

## Behavior changes
### HDInsight Interactive Query only supports schedule-based Autoscale
As customer scenarios grow more mature and diverse, we have identified some limitations with Interactive Query (LLAP) load-based Autoscale. These limitations are caused by the nature of LLAP query dynamics, future load prediction accuracy issues, and issues in the LLAP scheduler's task redistribution. Due to these limitations, users may see their queries run slower on LLAP clusters when Autoscale is enabled. The effect on performance can outweigh the cost benefits of Autoscale.

Starting from July 2021, the Interactive Query workload in HDInsight only supports schedule-based Autoscale. You can no longer enable load-based autoscale on new Interactive Query clusters. Existing running clusters can continue to run with the known limitations described above. 

Microsoft recommends that you move to a schedule-based Autoscale for LLAP.  You can analyze your cluster's current usage pattern through the Grafana Hive dashboard. For more information, see [Automatically scale Azure HDInsight clusters](hdinsight-autoscale-clusters.md). 

## Upcoming changes
The following changes will happen in upcoming releases.

### Built-in LLAP component in ESP Spark cluster will be removed
HDInsight 4.0 ESP Spark cluster has built-in LLAP components running on both head nodes. The LLAP components in ESP Spark cluster were originally added for HDInsight 3.6 ESP Spark, but has no real user case for HDInsight 4.0 ESP Spark. In the next release scheduled in Sep 2021, HDInsight will remove the built-in LLAP component from HDInsight 4.0 ESP Spark cluster. This change will help to offload head node workload and avoid confusion between ESP Spark and ESP Interactive Hive cluster type.

## New region
- West US 3
- Jio India West
- Australia Central

## Component version change
The following component version has been changed with this release:
- ORC version from 1.5.1 to 1.5.9

You can find the current component versions for HDInsight 4.0 and HDInsight 3.6 in [this doc](./hdinsight-component-versioning.md).

## Back ported JIRAs
Here are the back ported Apache JIRAs for this release:

| Impacted Feature    |   Apache JIRA                                                      |
|---------------------|--------------------------------------------------------------------|
| Date / Timestamp    | [HIVE-25104](https://issues.apache.org/jira/browse/HIVE-25104)     |
|                     | [HIVE-24074](https://issues.apache.org/jira/browse/HIVE-24074)     |
|                     | [HIVE-22840](https://issues.apache.org/jira/browse/HIVE-22840)     |
|                     | [HIVE-22589](https://issues.apache.org/jira/browse/HIVE-22589)     |
|                     | [HIVE-22405](https://issues.apache.org/jira/browse/HIVE-22405)     |
|                     | [HIVE-21729](https://issues.apache.org/jira/browse/HIVE-21729)     |
|                     | [HIVE-21291](https://issues.apache.org/jira/browse/HIVE-21291)     |
|                     | [HIVE-21290](https://issues.apache.org/jira/browse/HIVE-21290)     |
| UDF                 | [HIVE-25268](https://issues.apache.org/jira/browse/HIVE-25268)     |
|                     | [HIVE-25093](https://issues.apache.org/jira/browse/HIVE-25093)     |
|                     | [HIVE-22099](https://issues.apache.org/jira/browse/HIVE-22099)     |
|                     | [HIVE-24113](https://issues.apache.org/jira/browse/HIVE-24113)     |
|                     | [HIVE-22170](https://issues.apache.org/jira/browse/HIVE-22170)     |
|                     | [HIVE-22331](https://issues.apache.org/jira/browse/HIVE-22331)     |
| ORC                 | [HIVE-21991](https://issues.apache.org/jira/browse/HIVE-21991)     |
|                     | [HIVE-21815](https://issues.apache.org/jira/browse/HIVE-21815)     |
|                     | [HIVE-21862](https://issues.apache.org/jira/browse/HIVE-21862)     |
| Table Schema        | [HIVE-20437](https://issues.apache.org/jira/browse/HIVE-20437)     |
|                     | [HIVE-22941](https://issues.apache.org/jira/browse/HIVE-22941)     |
|                     | [HIVE-21784](https://issues.apache.org/jira/browse/HIVE-21784)     |
|                     | [HIVE-21714](https://issues.apache.org/jira/browse/HIVE-21714)     |
|                     | [HIVE-18702](https://issues.apache.org/jira/browse/HIVE-18702)     |
|                     | [HIVE-21799](https://issues.apache.org/jira/browse/HIVE-21799)     |
|                     | [HIVE-21296](https://issues.apache.org/jira/browse/HIVE-21296)     |
| Workload Management | [HIVE-24201](https://issues.apache.org/jira/browse/HIVE-24201)     |
| Compaction          | [HIVE-24882](https://issues.apache.org/jira/browse/HIVE-24882)     |
|                     | [HIVE-23058](https://issues.apache.org/jira/browse/HIVE-23058)     |
|                     | [HIVE-23046](https://issues.apache.org/jira/browse/HIVE-23046)     |
| Materialized view   | [HIVE-22566](https://issues.apache.org/jira/browse/HIVE-22566)     |