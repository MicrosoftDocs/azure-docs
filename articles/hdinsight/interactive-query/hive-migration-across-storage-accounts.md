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
    |Parameters|`<hdfs-export-path>` `[--overwrite]`|

    * `<hdfs-export-path>` is an empty HDFS directory to write export data to. For example: `wasb://containername@storageaccountname.blob.core.windows.net/hdi_hive_export`.
    * If `--overwrite` option is specified, then `<hdfs-export-path>` is allowed to be non-empty and will be overwritten.

2. After successful completion of export, apply the "import" script action on the new cluster with the following fields.

    |Property | Value |
    |---|---|
    |Bash script URI|`https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/import-hive-data-v01.sh`|
    |Node type(s)|Head|
    |Parameters|`<hdfs-export-path>`|

    * `<hdfs-export-path>` is the HDFS directory to import from.

## Verification

Download and run the script [`hive_contents.sh`](https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/hive_contents.sh) on the primary node of each cluster, and compare contents of output file `/tmp/hive_contents.out`. See [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).
