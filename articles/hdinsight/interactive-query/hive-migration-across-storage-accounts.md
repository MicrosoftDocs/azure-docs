---
title: Copy Hive tables across Storage Accounts
description: Hive workload migration across Storage Accounts
author: kevxmsft
ms.author: kevx
ms.reviewer: 
ms.service: hdinsight
ms.topic: how-to
ms.date: 12/11/2020
---

# Copy Hive tables across Storage Accounts

Learn how to use script actions to copy Hive tables across storage accounts in HDInsight. This may be useful when migrating to [`Azure Data Lake Storage Gen2`](../hdinsight-hadoop-use-data-lake-storage-gen2.md).

To manually copy an individual Hive table on HDInsight 4.0, see [Hive export/import](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+ImportExport).

## Prerequisites

* A new HDInsight cluster with its default filesystem in the target storage account. See [Use Azure storage with Azure HDInsight clusters](../hdinsight-hadoop-use-blob-storage.md). The new cluster must match versions with the original.
* A storage account that is accessible to both original and new clusters. See [Add additional storage accounts to HDInsight](../hdinsight-hadoop-add-storage.md).

## How it works

We'll run a script action to export Hive tables from the original cluster to a specified HDFS directory. See [Script action to a running cluster](../hdinsight-hadoop-customize-cluster-linux.md#script-action-to-a-running-cluster).

Then, we'll run another script action on the new cluster to import the Hive tables from the HDFS directory. The script will re-create the tables with location determined by the new cluster's default filesystem.

## Copy Hive tables

1. Apply the "export" script action on the original cluster with the following fields.

    |Property | Value |
    |---|---|
    |Bash script URI|`https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/export-hive-data-v01.sh`|
    |Node type(s)|Head|
    |Parameters|`<hdfs-export-path>`|

    ```sh
    usage: generate Hive export and import scripts and export Hive data to specified HDFS path
           [--overwrite {true,false}] [--run-script {true,false}]
           hdfs-export-path

    positional arguments:

        hdfs-export-path      remote HDFS directory to write export data to

    optional arguments:
        --overwrite {true,false}
                            whether to allow export directory to be non-empty
                            overwrite its data (default: false)
        --run-script {true,false}
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

## Option: reduce additional storage usage

The export script action likely doubles the storage usage due to Hive. However, it is possible to limit the additional storage usage by migrating manually, one database or table at a time.

1. Specify `--run-script=false` to skip execution of the generated Hive script. The Hive export and import scripts would still be saved to the export path.

2. Execute snippets of the Hive export and import scripts database-by-database or table-by-table, manually cleaning up the export path after each migrated database or table.
