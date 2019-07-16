---
title: Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0
description: Learn how to migrate Apache Hive workloads on HDInsight 3.6 to HDInsight 4.0.
ms.service: hdinsight
author: msft-tacox
ms.author: tacox
ms.reviewer: jasonh
ms.topic: conceptual
ms.date: 04/24/2019
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

1. Create a new copy of your external metastore. HDInsight 3.6 and HDInsight 4.0 require different metastore schemas and can't share a single metastore. See [Use external metadata stores in Azure HDInsight](../hdinsight-use-external-metadata-stores.md) to learn more about attaching an external metastore to an HDInsight cluster. 
2. Launch a script action against your HDI 3.6 cluster, with "Head nodes" as the node type for execution. Paste the following URI into the textbox marked "Bash Script URI": https://hdiconfigactions.blob.core.windows.net/hivemetastoreschemaupgrade/launch-schema-upgrade.sh.
In the textbox marked "Arguments", enter the servername, database, username and password for the **copied** Hive metastore, separated by spaces. Do not include ".database.windows.net" when specifying the servername.

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

This compaction is required because HDInsight 3.6 and HDInsight 4.0 ACID tables understand ACID deltas differently. Compaction enforces a clean slate that guarantees consistency. Section 4 of the [Hive migration documentation](https://docs.hortonworks.com/HDPDocuments/Ambari-2.7.3.0/bk_ambari-upgrade-major/content/prepare_hive_for_upgrade.html) contains guidance for bulk compaction of HDInsight 3.6 ACID tables.

Once you have completed the metastore migration and compaction steps, you can migrate the actual warehouse. After you complete the Hive warehouse migration, the HDInsight 4.0 warehouse will have the following properties:

* External tables in HDInsight 3.6 will be external tables in HDInsight 4.0
* Non-transactional managed tables in HDInsight 3.6 will be external tables in HDInsight 4.0
* Transactional managed tables in HDInsight 3.6 will be managed tables in HDInsight 4.0

You may need to adjust the properties of your warehouse before executing the migration. For example, if you expect that some table will be accessed by a third party (such as an HDInsight 3.6 cluster), that table must be external once the migration is complete. In HDInsight 4.0, all managed tables are transactional. Therefore, managed tables in HDInsight 4.0 should only be accessed by HDInsight 4.0 clusters.

Once your table properties are set correctly, execute the Hive warehouse migration tool from one of the cluster headnodes using the SSH shell:

1. Connect to your cluster headnode using SSH. For instructions, see [Connect to HDInsight using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md)
1. Open a login shell as the Hive user by running `sudo su - hive`
1. Determine the Hortonworks Data Platform stack version by executing `ls /usr/hdp`. This will display a version string that you should use in the next command.
1. Execute the following command from the shell. Replace `${{STACK_VERSION}}` with the version string from the previous step:

```bash
/usr/hdp/${{STACK_VERSION}}/hive/bin/hive --config /etc/hive/conf --service  strictmanagedmigration --hiveconf hive.strict.managed.tables=true  -m automatic  automatic  --modifyManagedTables --oldWarehouseRoot /apps/hive/warehouse
```

After the migration tool completes, your Hive warehouse will be ready for HDInsight 4.0. 

> [!Important]
> Managed tables in HDInsight 4.0 (including tables migrated from 3.6) should not be accessed by other services or applications, including HDInsight 3.6 clusters.

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

Launch a script action against your cluster, with "Head nodes" as the node type for execution. Paste the following URI into the textbox marked "Bash Script URI": https://hdiconfigactions.blob.core.windows.net/dasinstaller/LaunchDASInstaller.sh

Data Analytics Studio can be launched with URL : https://<clustername>.azurehdinsight.net/das/



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
