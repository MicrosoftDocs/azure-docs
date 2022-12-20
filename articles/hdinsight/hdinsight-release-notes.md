---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 12/07/2022
---


# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.
If you would like to subscribe on release notes, watch releases on [this GitHub repository](https://github.com/hdinsight/release-notes/releases).

## Release date: December 12, 2022

This release applies to HDInsight 4.0. and 5.0 HDInsight release is made available to all regions over several days.

HDInsight uses safe deployment practices, which involve gradual region deployment. It may take up to 10 business days for a new release or a new version to be available in all regions.

**OS versions**

* HDInsight 4.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4
* HDInsight 5.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4

For workload specific versions, see [here.](/azure/hdinsight/hdinsight-40-component-versioning.md) 

![Icon showing new features with text.](media/hdinsight-release-notes/new-icon-for-new-feature.png) 

* **Log Analytics** - Customers can enable classic monitoring to get the latest OMS version 14.19. To remove old versions, disable and enable classic monitoring.
* **Ambari** user auto UI logout due to inactivity. For more information, see [here](/azure/hdinsight/ambari-web-ui-auto-logout.md)
* **Spark** - A new and optimized version of Spark 3.1 is included in this release which is twice as fast as before.

![Icon showing new regions added with text.](media/hdinsight-release-notes/new-icon-for-new-regions-added.png) 

* Qatar Central
* Germany North

![Icon showing what's changed with text.](media/hdinsight-release-notes/new-icon-for-changed.png)

* HDInsight has moved away from Azul Zulu Java JDK  8 to Adoptium Temurin JDK 8, which supports high-quality TCK certified runtimes, and associated technology for use across the Java ecosystem.

* HDInsight has migrated to reload4j. The log4j changes are applicable to

  * Apache Hadoop
  * Apache Zookeeper
  * Apache Oozie
  * Apache Ranger
  * Apache Sqoop
  * Apache Pig
  * Apache Ambari 
  * Apache Kafka
  * Apache Spark
  * Apache Zeppelin
  * Apache Livy
  * Apache Rubix
  * Apache Hive
  * Apache Tez
  * Apache HBase
  * OMI
  * Apache Pheonix

![Icon showing update with text.](media/hdinsight-release-notes/new-icon-for-updated.png)

HDInsight will implement TLS1.2 going forward, and earlier versions will be updated on the platform. If you're running any applications on top of HDInsight and they use TLS 1.0 and 1.1, upgrade to TLS 1.2 to avoid any disruption in services. 

For more information, see [How to enable Transport Layer Security (TLS)](https://learn.microsoft.com/mem/configmgr/core/plan-design/security/enable-tls-1-2-client)


![Icon showing end of support with text.](media/hdinsight-release-notes/new-icon-for-end-of-support.png)

End of support for Azure HDInsight clusters on Ubuntu 16.04 LTS from 30 November 2022. HDInsight had begun release of cluster images using Ubuntu 18.04 from June 27,  2021. We recommend our customers who are running clusters using Ubuntu 16.04 is to rebuild their clusters with the latest HDInsight images by 30 November 2022.

For more information on how to check Ubuntu version of cluster, see [here](https://learnubuntu.com/check-ubuntu-version)

1. Execute the command “lsb_release -a” in the terminal.  

1. If the value for “Description” property in output is “Ubuntu 16.04 LTS”, then this update is applicable to the cluster.  

![Icon showing bug fixes with text.](media/hdinsight-release-notes/new-icon-for-bugfix.png) 

* Support for Availability Zones selection for Kafka and HBase (write access) clusters.

## Open source bug fixes

**Hive bug fixes**

|Bug Fixes|Apache JIRA|
|---|---|
|[HIVE-26127](https://issues.apache.org/jira/browse/HIVE-26127)| INSERT OVERWRITE error - File Not Found|
|[HIVE-24957](https://issues.apache.org/jira/browse/HIVE-24957)| Wrong results when subquery has COALESCE in correlation predicate|
|[HIVE-24999](https://issues.apache.org/jira/browse/HIVE-24999)| HiveSubQueryRemoveRule generates invalid plan for IN subquery with multiple correlations| 
|[HIVE-24322](https://issues.apache.org/jira/browse/HIVE-24322)| If there's direct insert, the attempt ID has to be checked when reading the manifest files|
|[HIVE-23363](https://issues.apache.org/jira/browse/HIVE-23363)| Upgrade DataNucleus dependency to 5.2 |
|[HIVE-26412](https://issues.apache.org/jira/browse/HIVE-26412)| Create interface to fetch available slots and add the default|
|[HIVE-26173](https://issues.apache.org/jira/browse/HIVE-26173)| Upgrade derby to 10.14.2.0|
|[HIVE-25920](https://issues.apache.org/jira/browse/HIVE-25920)| Bump Xerce2 to 2.12.2.|
|[HIVE-26300](https://issues.apache.org/jira/browse/HIVE-26300)| Upgrade Jackson data bind version to 2.12.6.1+ to avoid CVE-2020-36518|
