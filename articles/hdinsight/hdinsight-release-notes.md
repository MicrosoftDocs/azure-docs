---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 07/14/2022
---

# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.
If you would like to subscribe on release notes, watch releases on [this GitHub repository](https://github.com/hdinsight/release-notes/releases).

## Release date: 07/14/2022

This release applies to HDInsight 4.0.  HDInsight release is made available to all regions over several days.

HDInsight uses safe deployment practices which involve gradual region deployment. It may take up to ten business days for a new release or a new version to be available in all regions.

## Release highlights

...

![Icon_showing_new_features](media/hdinsight-release-notes/icon-for-new-feature.png) # New Feature

**Attach external disks in HDI Hadoop/Spark clusters.**

The new feature allows you to add more disks to the HDI cluster and add the disks as part of node manager directory.

- Add number of disks to worker nodes during HIVE and Spark cluster creation, while the selected disks will be part of node manager’s local directories.
- Add validation to the number of disks which to each VM.
- Newly added disks can be updated in node manager configurations.

![Icon_showing_bug_fixes](media/hdinsight-release-notes/icon-for-bugfix.png) # Fixed

#### **Log analytics**

Log Analytics integrated with Azure HDInsight running OMS version 13 requires an upgrade to OMS version 14 to apply the latest security updates ([CVE-2022-29149](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fmsrc.microsoft.com%2Fupdate-guide%2Fen-US%2Fvulnerability%2FCVE-2022-29149&data=05%7C01%7Cv-kabhi1%40microsoft.com%7C52d4591de93f4a9f03cf08da4f791a40%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637909678816969704%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&sdata=epa0AfjIHirPMZ57fkbeXyXqSRzbZG05Wlp7ySssXpA%3D&reserved=0)).

When this integration is enabled along with the OMS monitoring pipeline, the OMS agent is installed in HDInsight clusters for your machines.

Customers using OMS version 13 need to install OMS version 14 to meet the security requirements.

## Other bug fixes

#### TEZ bug fixes

| Bug Fixes|Apache JIRA|
|---|---|
|Fix protobuf dependency to 3.x|[TEZ-4363](https://issues.apache.org/jira/browse/TEZ-4363)|

## Hive bug fixes

|Bug Fixes|Apache JIRA|
|---|---|
|Upgrade DataNucleus dependency to 5.2|[HIVE-23363](https://issues.apache.org/jira/browse/HIVE-23363)|
|ITestDbTxnManager is broken after HIVE-24120 fix.|[HIVE-25516](https://issues.apache.org/jira/browse/HIVE-25516)|
| Upgrade DataNucleus dependency to 5.2.8| [HIVE-26082](https://issues.apache.org/jira/browse/HIVE-26082)|
|Perf optimizations in ORC split-generation| [HIVE-21457](https://issues.apache.org/jira/browse/HIVE-21457)|
|Avoid reading table as ACID when table name is starting with "delta", but table is not transactional and BI Split Strategy is used| [HIVE-22582](https://issues.apache.org/jira/browse/HIVE-22582)|
|Remove an FS#exists call from AcidUtils#getLogicalLength|[HIVE-23533](https://issues.apache.org/jira/browse/HIVE-23533)|
| VectorizedOrcAcidRowBatchReader.computeOffsetAndBucket optimization|[ HIVE-17917]()|
|||

