---
title: Migrate Default Hive Metastore to External Metastore
description: Migrate Default Hive Metastore to External Metastore
author: kevxmsft
ms.author: kevx
ms.reviewer: 
ms.service: hdinsight
ms.topic: how-to
ms.date: 11/4/2020
---

# Migrate Default Hive Metastore to External Metastore

This article shows how to export a [default metastore](../hdinsight-use-external-metadata-stores.md#default-metastore) for Hive to a custom SQL Database on HDInsight. This is useful for scaling up the SQL Database or for [migrating workloads from HDInsight 3.6 to HDInsight 4.0](./apache-hive-migrate-workloads.md).

Because the default metastore has limited compute capacity, we recommend low utilization from other jobs on the cluster while exporting metadata.

Source and target metastores must use the same HDInsight version and the same Storage Accounts. If upgrading HDInsight versions from 3.6 to 4.0, complete the steps in this article first. Then, follow the official upgrade steps [here](./apache-hive-migrate-workloads.md).

Optionally, see a separate guide for [Hive Workload Migration across Storage Accounts](./hive-migration-across-storage-accounts.md).

## Prerequisites

If using [Azure Data Lake Storage Gen1](../overview-data-lake-storage-gen1.md), Hive table locations are likely dependent on the clusters' HDFS configurations. Run the following script action to make these locations portable to other clusters. See [Script action to a running cluster](../hdinsight-hadoop-customize-cluster-linux.md#script-action-to-a-running-cluster).

The action is similar to replacing symlinks with their full paths.

|Property | Value |
|---|---|
|Bash script URI|`https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/hive-alter-table-location-expand-adl-path-v01.sh`|
|Node type(s)|Head|
|Parameters||

## Migrate with Export/Import using sqlpackage

An HDInsight cluster created only after 2020-10-15 supports SQL Export/Import for Hive default metastore by using `sqlpackage` for export.

1. Install [sqlpackage](https://docs.microsoft.com/sql/tools/sqlpackage-download?view=sql-server-ver15#get-sqlpackage-net-core-for-linux) to the cluster.

2. Export the default metastore to BACPAC file by executing the following command.

    ```bash
    wget "https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/hive_metastore_tool.py"
    SQLPACKAGE_FILE='/home/sshuser/sqlpackage/sqlpackage'  # replace with sqlpackage location
    TARGET_FILE='hive.bacpac'
    sudo python hive_metastore_tool.py --sqlpackagefile $SQLPACKAGE_FILE --targetfile $TARGET_FILE
    ```

3. Save the BACPAC file. Below is an option.

    ```bash
    hdfs dfs -mkdir -p /bacpacs
    hdfs dfs -put $TARGET_FILE /bacpacs/
    ```

4. Import the BACPAC file to a new database with steps listed [here](../../azure-sql/database/database-import.md).

5. The new database is ready to be [configured as external metastore on a new HDInsight cluster](../hdinsight-use-external-metadata-stores.md#select-a-custom-metastore-during-cluster-creation.md).

## Migrate using Hive script

Clusters created before 2020-10-15 do not support export/import of the default metastore. For such clusters, this guide supports copying only Hive databases, tables, and partitions. Other metadata objects, like UDFs, must be re-created.

Follow the guide [Copy Hive tables across Storage Accounts](./hive-migration-across-storage-accounts.md), using a second cluster with an [external Hive metastore](../hdinsight-use-external-metadata-stores.md#select-a-custom-metastore-during-cluster-creation.md) but not necessarily a different storage account.

### Option to "shallow" copy
Storage consumption would double when tables are "deep" copied.
We can, instead, "shallow" copy the tables if they are non-transactional. All Hive tables in HDInsight 3.6 are non-transactional by default, but only external tables are non-transactional in HDInsight 4.0. Follow these steps to shallow copy all tables:

1. Execute script [hive-ddls.sh](https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/hive-ddls.sh) on the cluster's primary headnode to generate the DDL for every Hive table.
2. The DDL is written to a local Hive script named `/tmp/hdi_hive_ddls.hql`. Execute this on a cluster that uses an external Hive metastore.

### Verify that all Hive tables are imported

The following command uses a SQL query on the metastore to print all Hive tables and their data locations. Compare outputs between new and old clusters to verify that no tables are missing in the new metastore.

```bash
SCRIPT_FNAME='hive_metastore_tool.py'
SCRIPT="/tmp/$SCRIPT_FNAME"
wget -O "$SCRIPT" "https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/$SCRIPT_FNAME"
OUTPUT_FILE='/tmp/hivetables.csv'
QUERY="SELECT DBS.NAME, TBLS.TBL_NAME, SDS.LOCATION FROM SDS, TBLS, DBS WHERE TBLS.SD_ID = SDS.SD_ID AND TBLS.DB_ID = DBS.DB_ID ORDER BY DBS.NAME, TBLS.TBL_NAME ASC;"
sudo python "$SCRIPT" --query "$QUERY" > $OUTPUT_FILE
```

### Further Reading

1) [Migrate workloads from HDInsight 3.6 to 4.0](./apache-hive-migrate-workloads.md)
2) [Hive Workload Migration across Storage Accounts](./hive-migration-across-storage-accounts.md)
3) [Connect to Beeline on HDInsight](../hadoop/connect-install-beeline.md)
4) [Troubleshoot Permission Error Create Table](./interactive-query-troubleshoot-permission-error-create-table.md)
