---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, R Server, Hive, and more.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.service: hdinsight
ms.topic: conceptual
ms.date: 04/15/2019
---
# Release notes for Azure HDInsight

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

> [!IMPORTANT]  
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight versioning article](hdinsight-component-versioning.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source Apache Hadoop and Apache Spark analytics on Azure.

## New features

For more information on important changes with HDInsight 4.0., see [What's new in HDI 4.0?](../hdinsight/hdinsight-version-release.md).

## Component versions

The official Apache versions of all HDInsight 4.0 components are given below. The components listed are releases of the most recent stable versions available.

- Apache Ambari 2.7.1
- Apache Hadoop 3.1.1
- Apache HBase 2.0.0
- Apache Hive 3.1.0
- Apache Kafka 1.1.1
- Apache Mahout 0.9.0+
- Apache Oozie 4.2.0
- Apache Phoenix 4.7.0
- Apache Pig 0.16.0
- Apache Ranger 0.7.0
- Apache Slider 0.92.0
- Apache Spark 2.3.1
- Apache Sqoop 1.4.7
- Apache TEZ 0.9.1
- Apache Zeppelin 0.8.0
- Apache ZooKeeper 3.4.6

Later versions of Apache components are sometimes bundled in the HDP distribution in addition to the versions listed above. In this case, these later versions are listed in the Technical Previews table and should not substitute for the Apache component versions of the above list in a production environment.

## Apache patch information

For more information on patches available in HDInsight 4.0, see the patch listing for each product in the table below.

| Product name | Patch information |
|---|---|
| Ambari | [Ambari patch information](https://docs.hortonworks.com/HDPDocuments/Ambari-2.7.1.0/bk_ambari-release-notes/content/ambari_relnotes-2.7.1.0-patch-information.html) |
| Hadoop | [Hadoop patch information](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.1/release-notes/content/patch_hadoop.html) |
| HBase | [HBase patch information](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.1/release-notes/content/patch_hbase.html) |
| Hive  | This release provides Hive 3.1.0 with no additional Apache patches.  |
| Kafka | This release provides Kafka 1.1.1 with no additional Apache patches. |
| Oozie | [Oozie patch information](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.1/release-notes/content/patch_oozie.html) |
| Phoenix | [Phoenix patch information](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.1/release-notes/content/patch_phoenix.html) |
| Pig | [Pig patch information](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.1/release-notes/content/patch_pig.html) |
| Ranger | [Ranger patch information](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.1/release-notes/content/patch_ranger.html) |
| Spark | [Spark patch information](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.1/release-notes/content/patch_spark.html) |
| Sqoop | This release provides Sqoop 1.4.7 with no additional Apache patches. |
| Tez | This release provides Tez 0.9.1 with no additional Apache patches. |
| Zeppelin | This release provides Zeppelin 0.8.0 with no additional Apache patches. |
| Zookeeper | [Zookeeper patch information](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.1/release-notes/content/patch_zookeeper.html) |

## Fixed Common Vulnerabilities and Exposures

For more information on security issues resolved in this release, see Hortonworks' [Fixed Common Vulnerabilities and Exposures for HDP 3.0.1](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.1/release-notes/content/cve.html).

## Known issues

### Replication is broken for Secure HBase with default installation

For HDInsight 4.0, do the following steps:

1. Enable inter-cluster communication.
1. Sign in to the active headnode.
1. Download a script to enable replication with the following command:

    ```
    sudo wget https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_enable_replication.sh
    ```
1. Type the command `sudo kinit <domainuser>`.
1. Type the following command to run the script:

    ```
    sudo bash hdi_enable_replication.sh -m <hn0> -s <srclusterdns> -d <dstclusterdns> -sp <srcclusterpasswd> -dp <dstclusterpasswd> -copydata
    ```
For HDInsight 3.6, do the following:

1. Sign in to active HMaster ZK.
1. Download a script to enable replication with the following command:
    ```
    sudo wget https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_enable_replication.sh
    ```
1. Type the command `sudo kinit -k -t /etc/security/keytabs/hbase.service.keytab hbase/<FQDN>@<DOMAIN>`.
1. Type the following command:

    ```bash
    sudo bash hdi_enable_replication.sh -s <srclusterdns> -d <dstclusterdns> -sp <srcclusterpasswd> -dp <dstclusterpasswd> -copydata
    ```

### Phoenix Sqlline stops working after migrating HBase cluster to HDInsight 4.0

Do the following steps:

1. Drop the following Phoenix tables:
    1. `SYSTEM.FUNCTION`
    1. `SYSTEM.SEQUENCE`
    1. `SYSTEM.STATS`
    1. `SYSTEM.MUTEX`
    1. `SYSTEM.CATALOG`
1. If you can't delete any of the tables, restart HBase to clear any connections to the tables.
1. Run `sqlline.py` again. Phoenix will re-create all of the tables that were deleted in step 1.
1. Regenerate Phoenix tables and views for your HBase data.

### Phoenix Sqlline stops working after replicating HBase Phoenix metadata from HDInsight 3.6 to 4.0

Do the following steps:

1. Before doing the replication, go to the destination 4.0 cluster and execute `sqlline.py`. This command will generate Phoenix tables like `SYSTEM.MUTEX` and `SYSTEM.LOG` that only exist in 4.0.
1. Drop the following tables:
    1. `SYSTEM.FUNCTION`
    1. `SYSTEM.SEQUENCE`
    1. `SYSTEM.STATS`
    1. `SYSTEM.CATALOG`
1. Start the HBase replication

## Deprecation

Apache Storm and ML services aren't available in HDInsight 4.0.
