---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 08/01/2022
---

# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.
If you would like to subscribe on release notes, watch releases on [this GitHub repository](https://github.com/hdinsight/release-notes/releases).

## Release date: 08/10/2022

This release applies to HDInsight 4.0.  HDInsight release is made available to all regions over several days.

HDInsight uses safe deployment practices, which involve gradual region deployment. It may take up to 10 business days for a new release or a new version to be available in all regions.


![Icon_showing_new_features](media/hdinsight-release-notes/icon-for-new-feature.png) 
## New Feature

**1. Attach external disks in HDI Hadoop/Spark clusters**

HDInsight cluster comes with pre-defined disk space based on SKU. This space may not be sufficient in large job scenarios. 

This new feature allows you to add more disks in cluster, which will be used as node manager local directory. Add number of disks to worker nodes during HIVE and Spark cluster creation, while the  selected disks will be part of node manager’s local directories.

> [!NOTE]
> The added disks are only configured for node manager local directories.
> 

For more information, [see here](./hdinsight-hadoop-provision-linux-clusters.md#configuration--pricing)

**2. Selective logging analysis**

Selective logging analysis is now available on all regions for public preview. You can connect your cluster to a log analytics workspace. Once enabled, you can see the logs and metrics like HDInsight Security Logs, Yarn Resource Manager, System Metrics etc. You can monitor workloads and see how they're affecting cluster stability. Selective logging allows you to enable/disable all the tables or enable selective tables in log analytics workspace. You can adjust the source type for each table, since in new version of Geneva monitoring one table has multiple sources.

1. The Geneva monitoring system uses mdsd(MDS daemon) which is a monitoring agent and fluentd for collecting logs using unified logging layer.
1. Selective Logging uses script action to disable/enable tables and their log types. Since it doesn't open any new ports or change any existing security setting hence, there are no security changes.
1. Script Action runs in parallel on all specified nodes and changes the configuration files for disabling/enabling tables and their log types.

For more information, [see here](./selective-logging-analysis.md)


![Icon_showing_bug_fixes](media/hdinsight-release-notes/icon-for-bugfix.png) 
## Fixed

#### **Log analytics**

Log Analytics integrated with Azure HDInsight running OMS version 13 requires an upgrade to OMS version 14 to apply the latest security updates.
Customers using older version of cluster with OMS version 13 need to install OMS version 14 to meet the security requirements. (How to check current version & Install 14) 

**How to check your current OMS version**

1. Log in to the cluster using SSH.
1. Run the following command in your SSH Client.

```
sudo /opt/omi/bin/ominiserver/ --version
```
![Screenshot showing how to check OMS Upgrade](media/hdinsight-release-notes/check-oms-version.png)

**How to upgrade your OMS version from 13 to 14**

1. Log in to the [Azure portal](https://portal.azure.com/) 
1. From the resource group, select the HDInsight cluster resource 
1. Click **Script actions** 
1. From **Submit script action** panel, choose **Script type** as custom 
1. Paste the following link in the Bash script URL box
https://hdiconfigactions.blob.core.windows.net/log-analytics-patch/OMSUPGRADE14.1/omsagent-vulnerability-fix-1.14.12-0.sh 
1. Select **Node type(s)**
1. Click **Create** 

![Screenshot showing how to do OMS Upgrade](media/hdinsight-release-notes/oms-upgrade.png)

1. Verify the successful installation of the patch using the following steps:  

  1. Log in to the cluster using SSH.
  1. Run the following command in your SSH Client.

  ```
  sudo /opt/omi/bin/ominiserver/ --version
  ```

### Other bug fixes

1. Yarn log’s CLI failed to retrieve the logs if any TFile is corrupt or empty. 
2. Resolved invalid service principal details error while getting the OAuth token from Azure Active Directory.
3. Improved cluster creation reliability when 100+ worked nodes are configured.

### Open source bug fixes

#### TEZ bug fixes

|Bug Fixes|Apache JIRA|
|---|---|
|Tez Build Failure: FileSaver.js not found|[TEZ-4411](https://issues.apache.org/jira/browse/TEZ-4411)|
|Wrong FS Exception when warehouse and scratchdir are on different FS|[TEZ-4406](https://issues.apache.org/jira/browse/TEZ-4406)|
|TezUtils.createConfFromByteString on Configuration larger than 32 MB throws com.google.protobuf.CodedInputStream exception|[TEZ-4142](https://issues.apache.org/jira/browse/TEZ-4142)|
|TezUtils::createByteStringFromConf should use snappy instead of DeflaterOutputStream|[TEZ-4113](https://issues.apache.org/jira/browse/TEZ-4411)|
|Update protobuf dependency to 3.x|[TEZ-4363](https://issues.apache.org/jira/browse/TEZ-4363)|

#### Hive bug fixes

|Bug Fixes|Apache JIRA|
|---|---|
|Perf optimizations in ORC split-generation| [HIVE-21457](https://issues.apache.org/jira/browse/HIVE-21457)|
|Avoid reading table as ACID when table name is starting with "delta", but table isn't transactional and BI Split Strategy is used| [HIVE-22582](https://issues.apache.org/jira/browse/HIVE-22582)|
|Remove an FS#exists call from AcidUtils#getLogicalLength|[HIVE-23533](https://issues.apache.org/jira/browse/HIVE-23533)|
|Vectorized OrcAcidRowBatchReader.computeOffset and bucket optimization|[HIVE-17917](https://issues.apache.org/jira/browse/HIVE-17917)|

### Known issues

HDInsight is compatible with Apache HIVE 3.1.2. Due to a bug in this release, the Hive version is shown as 3.1.0 in hive interfaces. However, there's no impact on the functionality.