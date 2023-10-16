---
title: Migrate default Hive metastore to external metastore on Azure HDInsight
description: Migrate default Hive metastore to external metastore on Azure HDInsight
author: reachnijel
ms.author: nijelsf
ms.service: hdinsight
ms.topic: how-to
ms.date: 09/15/2023
---

# Migrate default Hive metastore DB to external metastore DB

This article shows how to migrate metadata from a [default metastore DB](../hdinsight-use-external-metadata-stores.md#default-metastore) for Hive to an external SQL Database on HDInsight. 

## Why migrate to external metastore DB

* Default metastore DB is limited to basic SKU and cannot handle production scale workloads.

* External metastore DB enables customer to horizontally scale Hive compute resources by adding new HDInsight clusters sharing the same metastore DB.

* For HDInsight 3.6 to 4.0 migration, it is mandatory to migrate metadata to external metastore DB before upgrading the Hive schema version. See [migrating workloads from HDInsight 3.6 to HDInsight 4.0](./apache-hive-migrate-workloads.md).

Because the default metastore DB has limited compute capacity, we recommend low utilization from other jobs on the cluster while migrating metadata.

Source and target DBs must use the same HDInsight version and the same Storage Accounts. If upgrading HDInsight versions from 3.6 to 4.0, complete the steps in this article first. Then, follow the official upgrade steps [here](./apache-hive-migrate-workloads.md).

## Prerequisites

If using [Azure Data Lake Storage Gen1](../overview-data-lake-storage-gen1.md), Hive table locations are likely dependent on the cluster's HDFS configurations for Azure Data Lake Storage Gen1. Run the following script action to make these locations portable to other clusters. See [Script action to a running cluster](../hdinsight-hadoop-customize-cluster-linux.md#script-action-to-a-running-cluster).

The action is similar to replacing symlinks with their full paths.

|Property | Value |
|---|---|
|Bash script URI|`https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/hive-adl-expand-location-v01.sh`|
|Node type(s)|Head|
|Parameters|""|

## Migrate with Export/Import using sqlpackage

An HDInsight cluster created only after 2020-10-15 supports SQL Export/Import for the Hive default metastore DB by using `sqlpackage`.

1. Install [sqlpackage](/sql/tools/sqlpackage-download#get-sqlpackage-net-core-for-linux) to the cluster.

2. Export the default metastore DB to BACPAC file by executing the following command.

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

4. Import the BACPAC file to a new database with steps listed [here](/azure/azure-sql/database/database-import).

5. The new database is ready to be [configured as external metastore DB on a new HDInsight cluster](../hdinsight-use-external-metadata-stores.md#select-a-custom-metastore-during-cluster-creation).

## Migrate using Hive script

Clusters created before 2020-10-15 do not support export/import of the default metastore DB.

For such clusters, follow the guide [Copy Hive tables across Storage Accounts](./hive-migration-across-storage-accounts.md), using a second cluster with an [external Hive metastore DB](../hdinsight-use-external-metadata-stores.md#select-a-custom-metastore-during-cluster-creation). The second cluster can use the same storage account but must use a new default filesystem.

### Option to "shallow" copy
Storage consumption would double when tables are "deep" copied using the above guide. You need to manually clean the data in the source storage container.
We can, instead, "shallow" copy the tables if they are non-transactional. All Hive tables in HDInsight 3.6 are non-transactional by default, but only external tables are non-transactional in HDInsight 4.0. Transactional tables must be deep copied. Follow these steps to shallow copy non-transactional tables:

1. Execute script [hive-ddls.sh](https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/hive-ddls.sh) on the source cluster's primary headnode to generate the DDL for every Hive table.
2. The DDL is written to a local Hive script named `/tmp/hdi_hive_ddls.hql`. Execute this on the target cluster that uses an external Hive metastore DB.

## Verify that all Hive tables are imported

The following command uses a SQL query on the metastore DB to print all Hive tables and their data locations. Compare outputs between new and old clusters to verify that no tables are missing in the new metastore DB.

```bash
SCRIPT_FNAME='hive_metastore_tool.py'
SCRIPT="/tmp/$SCRIPT_FNAME"
wget -O "$SCRIPT" "https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/$SCRIPT_FNAME"
OUTPUT_FILE='/tmp/hivetables.csv'
QUERY="SELECT DBS.NAME, TBLS.TBL_NAME, SDS.LOCATION FROM SDS, TBLS, DBS WHERE TBLS.SD_ID = SDS.SD_ID AND TBLS.DB_ID = DBS.DB_ID ORDER BY DBS.NAME, TBLS.TBL_NAME ASC;"
sudo python "$SCRIPT" --query "$QUERY" > $OUTPUT_FILE
```

## Further reading

* [Migrate workloads from HDInsight 3.6 to 4.0](./apache-hive-migrate-workloads.md)
* [Hive Workload Migration across Storage Accounts](./hive-migration-across-storage-accounts.md)
* [Connect to Beeline on HDInsight](../hadoop/connect-install-beeline.md)
* [Troubleshoot Permission Error Create Table](./interactive-query-troubleshoot-permission-error-create-table.md)
