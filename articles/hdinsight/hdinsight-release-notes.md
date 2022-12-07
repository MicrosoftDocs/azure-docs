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

## Release date: 12/07/2022

This release applies to HDInsight 4.0. and 5.0 HDInsight release is made available to all regions over several days.

HDInsight uses safe deployment practices, which involve gradual region deployment. It may take up to 10 business days for a new release or a new version to be available in all regions.

**OS versions**

HDInsight 4.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4
HDInsight 5.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4

For workload specific versions see [here].(/azure/hdinsight/hdinsight-40-component-versioning) 

![Icon showing new features with text](media/hdinsight-release-notes/new-icon-for-new-feature.png) 

* **Log Analytics** - Customers can enable classic monitoring to get the latest OMS version 14.19. To remove old versions, simply disable and enable classic monitoring.
* **Ambari** user auto UI logout due to inactivity. 
* **Spark** - A new and optimized version of Spark 3.1 is included in this release.

![Icon showing new regions added with text](media/hdinsight-release-notes/new-icon-for-new-regions-added.png) 

* Qatar Central
* Germany North

![Icon showing end of support with text](media/hdinsight-release-notes/new-icon-for-end-of-changed.png)

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
* Apache OMI
* Apache Pheonix


![Icon showing end of support with text](media/hdinsight-release-notes/new-icon-for-end-of-support.png)

End of support for Azure HDInsight clusters on Ubuntu 16.04 LTS from 30 November 2022.
HDInsight had begun release of cluster images using Ubuntu 18.04 since 27 Jun 2021. recommend our customers who are running clusters using Ubuntu 16.04 is to rebuild their clusters with the latest HDInsight images by 30 November 2022.

For more information on how to check Ubuntu version of cluster, see [here](https://learnubuntu.com/check-ubuntu-version)

1. Execute the command “lsb_release -a” in the terminal.  

1. If the value for “Description” property in output is “Ubuntu 16.04 LTS”, then this update is applicable to the cluster.  

![Icon showing bug fixes with text](media/hdinsight-release-notes/new-icon-for-bugfix.png) 

* Support for AZ selection for Kafka and HBase (write access) clusters.

### Open source bug fixes

#### TEZ bug fixes

|Bug Fixes|Apache JIRA|
|---|---|

#### Hive bug fixes

|Bug Fixes|Apache JIRA|
|---|---|


