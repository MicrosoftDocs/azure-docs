---
title: Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0
description: Learn how to migrate Apache Hive workloads on HDInsight 3.6 to HDInsight 4.0.
services: hdinsight
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.topic: howto
ms.date: 04/15/2019
---
# Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0

This document shows you how to migrate Apache Hive and LLAP workloads on HDInsight 3.6 to HDInsight 4.0. HDInsight 4.0 provides newer Hive and LLAP features such as materialized views and query result caching. When you migrate your workloads to HDInsight 4.0, you can use many newer features of Hive 3 that aren't available on HDInsight 3.6.

This article covers the following subjects:

* Migration of Hive metadata to HDInsight 4.0
* Safe migration of ACID and non-ACID tables
* Preservation of Hive security policies across HDInsight versions
* Query execution and debugging from HDInsight 3.6 to HDInsight 4.0

## Migrate Apache Hive metadata to HDInsight 4.0

One advantage of Hive is the ability to export metadata to an external database (referred to as the Hive Metastore). The **Hive Metastore** is responsible for storing table statistics, including the table storage location, column names, and table index information. The metastore database schema differs between Hive versions. Do the following to upgrade a HDInsight 3.6 Hive Metastore so that it's compatible with HDInsight 4.0.

1. Create a new copy of your external metastore. HDInsight 3.6 and HDInsight 4.0 require different metastore schemas and can't share a single metastore.
1. Attach the new copy of the metastore to a) an existing HDInsight 4.0 cluster, or b) a cluster that you're creating for the first time. See [Use external metadata stores in Azure HDInsight](../hdinsight-use-external-metadata-stores.md) to learn more about attaching an external metastore to an HDInsight cluster. Once the Metastore is attached, it will automatically be converted into a 4.0-compatible metastore.

> [!Warning]
> The upgrade which converts the HDInsight 3.6 metadata schema to the HDInsight 4.0 schema, cannot be reversed.

## Migrate Hive tables to HDInsight 4.0

After completing the previous set of steps to migrate the Hive Metastore to HDInsight 4.0, the tables and databases recorded in the metastore will be visible from within the HDInsight 4.0 cluster by executing `show tables` or `show databases` from within the cluster. See [Query execution across HDInsight versions](#query-execution-across-hdinsight-versions) for information on query execution in HDInsight 4.0 clusters.

The actual data from the tables, however, isn't accessible until the cluster has access to the necessary storage accounts. To make sure your HDInsight 4.0 cluster can access the same data as your old HDInsight 3.6 cluster, complete the following steps:

1. Determine the Azure storage account of your table or database using describe formatted.
2. If your HDInsight 4.0 cluster is already running, attach the Azure storage account to the cluster via Ambari. If you haven't yet created the HDInsight 4.0 cluster, make sure the Azure storage account is specified as either the primary or a secondary cluster storage account. For more information about adding storage accounts to HDInsight clusters, see [Add additional storage accounts to HDInsight](../hdinsight-hadoop-add-storage.md).

> [!Note]
> Tables are treated differently in HDInsight 3.6 and HDInsight 4.0. For this reason, you cannot share the same tables for clusters of different versions. If you want to use HDInsight 3.6 at the same time as HDInsight 4.0, you must have separate copies of the data for each version.

Your Hive workload may include a mix of ACID and non-ACID tables. One key difference between Hive on HDInsight 3.6 (Hive 2) and Hive on HDInsight 4.0 (Hive 3) is ACID-compliance for tables. In HDInsight 3.6, enabling Hive ACID-compliance requires additional configuration, but in HDInsight 4.0 tables are ACID-compliant by default. The only action required before migration is to run a major compaction against the ACID table on the 3.6 cluster. From the Hive view or from Beeline, run the following query:

```bash
alter table myacidtable compact 'major';
```

This compaction is required because HDInsight 3.6 and HDInsight 4.0 ACID tables understand ACID deltas different. Compaction enforces a clean slate that guarantees table consistency. Once the compaction is complete, the previous steps for metastore and table migration will be enough to use any HDInsight 3.6 ACID tables in HDInsight 4.0.

## Secure Hive across HDInsight versions

Since HDInsight 3.6, HDInsight integrates with Azure Active Directory using HDInsight Enterprise Security Package (ESP). ESP uses Kerberos and Apache Ranger to manage the permissions of specific resources within the cluster. Ranger policies deployed against Hive in HDInsight 3.6 can be migrated to HDInsight 4.0 with the following steps:

1. Navigate to the Ranger Service Manager panel in your HDInsight 3.6 cluster.
2. Navigate to the policy named **HIVE** and export the policy to a json file.
3. Make sure that all users referred to in the exported policy json exist in the new cluster. If a user is referred to in the policy json but doesn't exist in the new cluster, either add the user to the new cluster or remove the reference from the policy.
4. Navigate to the **Ranger Service Manager** panel in your HDInsight 4.0 cluster.
5. Navigate to the policy named **HIVE** and import the ranger policy json from step 2.

## Query execution across HDInsight versions

There are two ways to execute and debug Hive/LLAP queries within an HDInsight 3.6 cluster. HiveCLI provides a command-line experience and the Tez view/Hive view provides a GUI-based workflow.

In HDInsight 4.0, HiveCLI has been replaced with Beeline. HiveCLI is a thrift client for Hiveserver 1, and Beeline is a JDBC client that provides access to Hiveserver 2. Beeline can also be used to connect to any other JDBC-compatible database endpoint. Beeline is available out-of-box on HDInsight 4.0 without any installation needed.

In HDInsight 3.6, the GUI client for interacting with Hive server is the Ambari Hive View. HDInsight 4.0 replaces the Hive View with Hortonworks Data Analytics Studio (DAS). DAS doesn't ship with HDInsight clusters out-of-box and is not an officially supported package. However, DAS can be installed on the cluster as follows:

1. Download the [DAS package installation script](https://hdiconfigactions.blob.core.windows.net/dasinstaller/install-das-mpack.sh) and run it on both cluster headnodes. Don't execute this script as a script action.
2. Download the [DAS service installation script](https://hdiconfigactions.blob.core.windows.net/dasinstaller/install-das-component.sh) and run it as a script action. Select **Headnodes** as the node type of choice from the script action interface.
3. Once the script action is complete, navigate to Ambari and select **Data Analytics Studio** from the list of services. All DAS services are stopped. In the top-right corner, select **Actions** and **Start**. You can now execute and debug queries with DAS.

Once DAS is installed, if you don't see the queries you’ve run in the queries viewer, do the following steps:

1. Set the configurations for Hive, Tez, and DAS as described in [this guide for troubleshooting DAS installation](https://docs.hortonworks.com/HDPDocuments/DAS/DAS-1.2.0/troubleshooting/content/das_queries_not_appearing.html).
2. Make sure that the following Azure storage directory configs are Page blobs, and that they're listed under `fs.azure.page.blob.dirs`:
    * `hive.hook.proto.base-directory`
    * `tez.history.logging.proto-base-dir`
3. Restart HDFS, Hive, Tez, and DAS on both headnodes.

## Next steps

* [HDInsight 4.0 Announcement](../hdinsight-version-release.md)
* [HDInsight 4.0 deep dive](https://azure.microsoft.com/blog/deep-dive-into-azure-hdinsight-4-0/)
* [Hive 3 ACID Tables](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.1.0/using-hiveql/content/hive_3_internals.html)