---
title: Hive workload migration to new account in Azure Storage
description: Hive workload migration to new account in Azure Storage
author: reachnijel
ms.author: nijelsf
ms.service: hdinsight
ms.topic: how-to
ms.date: 09/19/2023
---

# Hive workload migration to new account in Azure Storage

Learn how to use script actions to copy Hive tables across storage accounts in HDInsight. This may be useful when migrating to [`Azure Data Lake Storage Gen2`](../hdinsight-hadoop-use-data-lake-storage-gen2.md).

To manually copy an individual Hive table on HDInsight 4.0, see [Hive export/import](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+ImportExport).

## Prerequisites

* A new HDInsight cluster with following configurations:
  * Its default filesystem is in the target storage account. See [Use Azure storage with Azure HDInsight clusters](../hdinsight-hadoop-use-blob-storage.md).
  * Its cluster version must match the source cluster's.
  * It uses a new external Hive metastore DB. See [Use external metadata stores](../hdinsight-use-external-metadata-stores.md#select-a-custom-metastore-during-cluster-creation).
* A storage account that is accessible to both original and new clusters. See [Add additional storage accounts to HDInsight](../hdinsight-hadoop-add-storage.md) and [Storage types and features](../hdinsight-hadoop-compare-storage-options.md#storage-types-and-features) for allowed secondary storage types.

    Here are some options:
  * Add the target storage account to the original cluster.
  * Add the original storage account to the new cluster.
  * Add an intermediary storage account to both the original and new clusters.

## How it works

We'll run a script action to export Hive tables from the original cluster to a specified HDFS directory. See [Script action to a running cluster](../hdinsight-hadoop-customize-cluster-linux.md#script-action-to-a-running-cluster).

Then, we'll run another script action on the new cluster to import the Hive tables from the HDFS directory.

The script will re-create the tables to the new cluster's default filesystem. Native tables will also copy their data in storage. Non-native tables will copy only by definition. See [Hive Storage Handlers](https://cwiki.apache.org/confluence/display/Hive/StorageHandlers) for details on non-native tables.

The path of external tables not in the Hive warehouse directory will be preserved. Other tables will copy to the target cluster's default Hive path. See Hive properties `hive.metastore.warehouse.external.dir` and `hive.metastore.warehouse.dir`.

The scripts will not preserve custom file permissions in the target cluster.

> [!NOTE]
>
> This guide supports copying metadata objects related to Hive databases, tables and partitions. Other metadata objects must be re-created manually.
>
> * For `Views`, Hive supports `SHOW VIEWS` command as of Hive 2.2.0 on HDInsight 4.0. Use `SHOW CREATE TABLE` for view definition. For earlier versions of Hive, query the metastore SQL DB to show views.
> * For `Materialized Views`, use commands `SHOW MATERIALIZED VIEWS`, `DESCRIBE FORMATTED`, and `CREATE MATERIALIZED VIEW`. See [Materialized views](https://cwiki.apache.org/confluence/display/Hive/Materialized+views) for details.
> * For `Constraints`, supported as of Hive 2.1.0 on HDInsight 4.0, use `DESCRIBE EXTENDED` to list constraints for a table, and use `ALTER TABLE` to add constraints. See [Alter Table Constraints](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-AlterTableConstraints) for details.

## Copy Hive tables

1. Apply the "export" script action on the original cluster with the following fields.

    This will generate and execute intermediary Hive scripts. They will save to the specified `<hdfs-export-path>`.

    Optionally, use `--run-script=false` to customize them before manually executing.

    |Property | Value |
    |---|---|
    |Bash script URI|`https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/export-hive-data-v01.sh`|
    |Node type(s)|Head|
    |Parameters|`<hdfs-export-path>` `--run-script`|

    ```sh
    usage: generate Hive export and import scripts and export Hive data to specified HDFS path
           [--run-script={true,false}]
           hdfs-export-path

    positional arguments:

        hdfs-export-path      remote HDFS directory to write export data to

    optional arguments:
        --run-script={true,false}
                            whether to execute the generated Hive export script
                            (default: true)
    ```

2. After successful completion of export, apply the "import" script action on the new cluster with the following fields.

    |Property | Value |
    |---|---|
    |Bash script URI|`https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/import-hive-data-v01.sh`|
    |Node type(s)|Head|
    |Parameters|`<hdfs-export-path>`|

    ```sh
    usage: download Hive import script from specified HDFS path and execute it
           hdfs-export-path

    positional arguments:

      hdfs-export-path      remote HDFS directory to download Hive import script from

    ```

## Verification

Download and run the script as root user [`hive_contents.sh`](https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/hive_contents.sh) on the primary node of each cluster, and compare contents of output file `/tmp/hive_contents.out`. See [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

## Cleanup additional storage usage

After storage migration is complete and verified, you can delete the data in the specified HDFS export path.

Option is to use HDFS command `hdfs dfs -rm -R`.

## Option: reduce additional storage usage

The export script action likely doubles the storage usage due to Hive. However, it is possible to limit the additional storage usage by migrating manually, one database or table at a time.

1. Specify `--run-script=false` to skip execution of the generated Hive script. The Hive export and import scripts would still be saved to the export path.

2. Execute snippets of the Hive export and import scripts database-by-database or table-by-table, manually cleaning up the export path after each migrated database or table.

## Next steps

* [Azure Data Lake Storage Gen2](../hdinsight-hadoop-use-data-lake-storage-gen2.md)
* [Use external metadata stores](../hdinsight-use-external-metadata-stores.md#select-a-custom-metastore-during-cluster-creation)
* [Storage types and features](../hdinsight-hadoop-compare-storage-options.md#storage-types-and-features)
* [Script action to a running cluster](../hdinsight-hadoop-customize-cluster-linux.md#script-action-to-a-running-cluster)
