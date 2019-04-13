---
title: Migrating HDInsight 3.6 Hive Workloads to HDInsight 4.0
description: Learn how to migrate Apache Hive Workloads on HDInsight 3.6 to HDInsight 4.0.
services: hdinsight
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.topic: howto
ms.date: 04/11/2019
---
# Migrating HDInsight 3.6 Hive workloads to HDInsight 4.0

This document shows you how to migrate Apache Hive and LLAP workloads on HDInsight 3.6 to HDInsight 4.0. HDInsight 4.0 provides newer Hive and LLAP features such as materialized views and query result caching. Because Hive for HDInsight 4.0 runs on Hive 3, migrating your workloads to HDInsight 4.0 will allow you to use many newer features not available on Hive for HDInsight 3.6 which runs on Hive 2.

This article covers the following subjects:

* Migration of Hive metadata to HDInsight 4.0
* Safe migration of Hive tables and ACID tables
* Preservation of Hive security policies across HDInsight versions
* Query execution and debugging on HDInsight 3.6 and HDInsight 4.0

## Migrating Apache Hive metadata to HDInsight 4.0

One advantage of Hive is the ability to store metadata on an external database (referred to as the **Hive Metastore**). The **Hive Metastore** is responsible for storing table statistics, including the table storage location, column names, and table index information. You can use an existing Hive metastore created by an HDInsight 3.6 cluster with HDInsight 4.0, but it must be upgraded first. Hive 2 on HDInsight 3.6 and Hive 3 on HDInsight 4.0 require different metastore schemas and cannot share a single metastore.

> [!Warning]
> The upgrade which converts the HDInsight 3.6 metadata schema to the HDInsight 4.0 schema, cannot be reversed.

To upgrade a HDInsight 3.6 Hive Metastore so that it is compatible with HDInsight 4.0, do the following steps:

1. Create a new copy of your HDInsight 3.6 Hive metastore. This will provide you a backup copy of the metastore that is still compatible with HDInsight 3.6.
1. Attach the new copy of the metastore to a) an existing HDInsight 4.0 cluster, or b) a cluster that you are creating for the first time. See [Use external metadata stores in Azure HDInsight](../hdinsight-use-external-metadata-stores.md) to learn more about attaching an external metastore to an existing HDInsight cluster.
1. Once the metastore is attached, it will automatically be upgraded to use the latest schema.

## Migrating Hive tables to HDInsight 4.0

After completing the previous steps to upgrade the Hive Metastore to HDInsight 4.0, the tables and databases recorded in the metastore will be visible by executing `show tables` or `show databases` from within the cluster. See [Query execution and debugging](#query-execution-and-debugging) for instructions on executing queries on the cluster.

Although you can see the tables and databases after migrating your metastore, the actual data will not be accessible until you give the HDInsight 4.0 cluster access to the storage account where the data resides. To give your HDInsight 4.0 cluster access to the storage account, complete the following steps:

1. Determine the Azure storage account of your table or database using the command `describe formatted`
2. If your HDInsight 4.0 cluster is already running, attach the Azure storage account to the cluster via Ambari. See [Add additional storage accounts to HDInsight](../../hdinsight/hdinsight-hadoop-add-storage.md) for more details. If you have not yet created the HDInsight 4.0 cluster, make sure the Azure storage account is specified as either the primary or a secondary cluster storage account during cluster creation.

> [!Note]
> Tables are treated differently in HDInsight 3.6 and HDInsight 4.0. For this reason, you cannot share the same tables for clusters of different versions. If you want to use HDInsight 3.6 at the same time as HDInsight 4.0, create separate copies of the data for each version.

Your Hive workload may include a mix of ACID and non-ACID tables. One key difference between Hive on HDInsight 3.6 (Hive 2) and Hive on HDInsight 4.0 (Hive 3) is that in HDInsight 3.6, enabling Hive ACID compliance requires additional configuration whereas Hive 3 (HDInsight 4.0) tables are ACID compliant by default. The only action required before migration is to run a major compaction against the ACID table on the 3.6 cluster. From the Hive view or from Beeline, run the following query:

```bash
alter table myacidtable compact 'major';
```

This compaction is required because HDInsight 3.6 and HDInsight 4.0 ACID tables understand ACID deltas different. Compaction enforces a clean slate that guarantees table consistency. Once the compaction is complete, the previous steps regarding metastore and table migration will be enough to use any HDInsight 3.6 ACID tables in HDInsight 4.0.

## Secure Hive across HDInsight versions

Since version 3.6, HDInsight integrates with Azure Active Directory using HDInsight Enterprise Security Package (ESP). ESP uses Kerberos and Apache Ranger to manage the permissions of specific resources within the cluster. Ranger policies deployed against Hive in HDInsight 3.6 can be migrated to HDInsight 4.0 with the following steps:

1. Navigate to the Ranger Service Manager panel in your HDInsight 3.6 cluster
2. Navigate to the policy named HIVE and export the policy to a json file
3. Make sure that all users referred to in the exported policy json exist in the new cluster. If a user is referred to in the policy json but does not exist in the new cluster, either add the user to the new cluster or remove the reference from the policy.
4. Navigate to the Ranger Service Manager panel in your HDInsight 4.0 cluster
5. Navigate to the policy named HIVE and import the ranger policy json from step 2

## Query execution and debugging

In HDInsight 3.6, there are two ways to execute and debug Hive/LLAP queries: HiveCLI, which provides a command-line experience and Ambari Hive view, which provides a GUI-based workflow.

In HDInsight 4.0, [Beeline](https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Clients#HiveServer2Clients-Beeline%E2%80%93CommandLineShell) replaces HiveCLI. Beeline is a JDBC client that provides access to HiveServer2. Beeline can also be used to connect to any other JDBC-compatible database endpoint. Beeline is available pre-installed on HDInsight 4.0 Interactive Query clusters.

Similarly, HDInsight 4.0 replaces the Hive View with [Hortonworks Data Analytics Studio (DAS)](https://docs.hortonworks.com/HDPDocuments/DAS/DAS-1.2.1/index.html). DAS is not pre-installed on HDInsight clusters and is not an officially supported package. However, you can install DAS on your cluster with the following steps:

1. Download the [DAS package installation script](https://hdiconfigactions.blob.core.windows.net/dasinstaller/install-das-mpack.sh) and run it on both cluster headnodes. Do not execute this script as a script action.
2. Download the [DAS service installation script](https://hdiconfigactions.blob.core.windows.net/dasinstaller/install-das-component.sh) and run it as a script action (select **Headnodes** as the node type of choice from the script action interface).
3. Once the script action is complete, navigate to Ambari and select **Data Analytics Studio** from the list of services. You will see that all DAS services are stopped. In the top-right corner select **Actions** and **Start**. You will now be able to execute and debug queries with DAS.

Once DAS is installed, if you do not see your queries in the queries viewer, do the following steps:

1. Make sure the necessary Hive, Tez and DAS configurations are set as described in [this guide](https://docs.hortonworks.com/HDPDocuments/DAS/DAS-1.2.0/troubleshooting/content/das_queries_not_appearing.html)
2. Make sure that the following Azure storage directory configs are Page blobs, and are listed under `fs.azure.page.blob.dirs`:
    * `hive.hook.proto.base-directory`
    * `tez.history.logging.proto-base-dir`
3. Restart HDFS, Hive, Tez, and DAS on both Head nodes.

## Next steps

* [HDInsight 4.0 Announcement](https://docs.microsoft.com/azure/hdinsight/hdinsight-version-release): 
* [HDInsight 4.0 deep dive](https://azure.microsoft.com/blog/deep-dive-into-azure-hdinsight-4-0/)
* [Hive 3 ACID Tables](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.1.0/using-hiveql/content/hive_3_internals.html)