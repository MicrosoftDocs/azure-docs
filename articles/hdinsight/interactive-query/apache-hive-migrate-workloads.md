---
title: Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0
description: Learn how to migrate Apache Hive workloads on HDInsight 3.6 to HDInsight 4.0.
author: kevxmsft
ms.author: kevx
ms.reviewer: 
ms.service: hdinsight
ms.topic: how-to
ms.date: 11/4/2020
---

# Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0

HDInsight 4.0 has several advantages over HDInsight 3.6. Here is an [overview of what's new in HDInsight 4.0](https://docs.microsoft.com/azure/hdinsight/hdinsight-version-release).

This article covers steps to migrate Hive workloads from HDInsight 3.6 to 4.0, including

* Hive metastore copy and schema upgrade
* Safe migration for ACID compatibility
* Preservation of Hive security policies

The new and old HDInsight clusters must have access to the same Storage Accounts. This article does not cover data migration to another Storage Account or region.

## Steps to upgrade

### 1. Run major compaction on ACID tables in HDInsight 3.6

HDInsight 3.6 by default does not support ACID tables. If ACID tables are present, however, run 'MAJOR' compaction on them. See the [Hive Language Manual](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-AlterTable/Partition/Compact) for details on compaction.

### 2. Copy the SQL database

* If the cluster uses a custom Hive metastore, create a copy of it. Options include [export/import](https://docs.microsoft.com/azure/azure-sql/database/database-export) and [point-in-time restore](https://docs.microsoft.com/azure/azure-sql/database/recovery-using-backups#point-in-time-restore).

* If the cluster uses a default Hive metastore, follow this [guide](https://docs.microsoft.com/azure/hdinsight/hdinsight-use-external-metadata-stores#default-metastore) to export metadata to a custom metastore. Then, create a copy of the custom metastore for upgrade.

### 3. Upgrade the metastore schema

This step uses the [`Hive Schema Tool`](https://cwiki.apache.org/confluence/display/Hive/Hive+Schema+Tool) from HDInsight 4.0 to upgrade the metastore schema.

> [!Warning]
> This step is not reversible. Run this only on a copy of the metastore.

1. Create a temporary HDInsight 4.0 cluster with a [default Hive metastore](https://docs.microsoft.com/azure/hdinsight/hdinsight-use-external-metadata-stores#default-metastore).

    We can specify the custom Hive metastore for HDInsight 4.0 only after we upgrade its schema. We have not yet upgraded the schema, so do not specify a custom metastore yet.

    After schema upgrade, we recommend not to configure the metastore on an existing cluster. Instead, create a new cluster for automatic validations and configurations.

1. From the HDInsight 4.0 cluster, execute `schematool` to upgrade the metastore:

    ```sh
    SERVER='servername.database.windows.net'  # replace with your SQL Server
    DATABASE='database'  # replace with your SQL Database
    USERNAME='username'  # replace with your username
    PASSWORD='password'  # replace with your password
    STACK_VERSION=$(hdp-select status hive-server2 | awk '{ print $3; }')
    /usr/hdp/$STACK_VERSION/hive/bin/schematool -upgradeSchema -url "jdbc:sqlserver://$SERVER;databaseName=$DATABASE;trustServerCertificate=false;encrypt=true;hostNameInCertificate=*.database.windows.net;" -userName "$USERNAME" -passWord "$PASSWORD" -dbType "mssql" --verbose
    ```

    > [!NOTE]
    > This utility uses client `beeline` to execute SQL scripts in `/usr/hdp/$STACK_VERSION/hive/scripts/metastore/upgrade/mssql/upgrade-*.mssql.sql`, following the order in file `upgrade.order.mssql`.
    >
    > SQL Syntax in these scripts is not necessarily compatible to other client tools. For example, [SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15) and [Query Editor on Azure Portal](https://docs.microsoft.com/azure/azure-sql/database/connect-query-portal) require keyword `GO` after each command.
    >
    > If any script fails due to resource capacity or transaction timeouts, scale the SQL Database up.

1. Verify the final version with query `select schema_version from dbo.version`.

1. Delete the temporary HDInsight 4.0 cluster.


### 4. Deploy a new HDInsight 4.0 cluster

Create a new HDInsight 4.0 cluster, [selecting the upgraded Hive metastore](https://docs.microsoft.com/azure/hdinsight/hdinsight-use-external-metadata-stores#select-a-custom-metastore-during-cluster-creation) and the same Storage Accounts.

* If using [Azure Data Lake Storage Gen1](https://docs.microsoft.com/azure/hdinsight/overview-data-lake-storage-gen1) the new cluster also requires the same mount point so that table locations with prefix `adl://home` translate correctly. To confirm, check HDFS config `dfs.adls.home.mountpoint` in `Custom core-site` via [Ambari](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-manage-ambari).

* Azure Data Lake Storage Gen2 and Azure Blob Storage do not require the same container.

* See article [Add additional Storage Accounts to HDInsight](../hdinsight-hadoop-add-storage.md) if the metastore uses multiple Storage Accounts.

* If Hive jobs fail due to storage inaccessibility, verify that the table location is in a configured Storage Account.

    Here are some options to identify table locations.

    ```sql
    -- Hive command
    SHOW CREATE TABLE ([db_name.]table_name|view_name);
    ```

    ```sql
    -- Metastore SQL query
    SELECT DBS.NAME, TBLS.TBL_NAME, SDS.LOCATION FROM SDS, TBLS, DBS WHERE TBLS.SD_ID = SDS.SD_ID AND TBLS.DB_ID = DBS.DB_ID ORDER BY DBS.NAME, TBLS.TBL_NAME ASC;
    ```

### 5. Convert Tables for ACID Compliance

Managed tables must be ACID-compliant on HDInsight 4.0. Run `strictmanagedmigration` on HDInsight 4.0 to convert all non-ACID managed tables to external tables with property `'external.table.purge'='true'`. Execute from the headnode:

```bash
sudo su - hive
STACK_VERSION=$(hdp-select status hive-server2 | awk '{ print $3; }')
/usr/hdp/$STACK_VERSION/hive/bin/hive --config /etc/hive/conf --service strictmanagedmigration --hiveconf hive.strict.managed.tables=true -m automatic --modifyManagedTables
```

## Secure Hive across HDInsight versions

HDInsight optionally integrates with Azure Active Directory using HDInsight Enterprise Security Package (ESP). ESP uses Kerberos and Apache Ranger to manage the permissions of specific resources within the cluster. Ranger policies deployed against Hive in HDInsight 3.6 can be migrated to HDInsight 4.0 with the following steps:

1. Navigate to the Ranger Service Manager panel in your HDInsight 3.6 cluster.
2. Navigate to the policy named **HIVE** and export the policy to a json file.
3. Make sure that all users referred to in the exported policy json exist in the new cluster. If a user is referred to in the policy json but doesn't exist in the new cluster, either add the user to the new cluster or remove the reference from the policy.
4. Navigate to the **Ranger Service Manager** panel in your HDInsight 4.0 cluster.
5. Navigate to the policy named **HIVE** and import the ranger policy json from step 2.

## Next steps

* See [Additional configuration using Hive Warehouse Connector](./apache-hive-warehouse-connector.md) for sharing the metastore between Spark and Hive for ACID tables.
* [HDInsight 4.0 Announcement](../hdinsight-version-release.md)
* [HDInsight 4.0 deep dive](https://azure.microsoft.com/blog/deep-dive-into-azure-hdinsight-4-0/)
* [Hive 3 ACID Tables](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.1.0/using-hiveql/content/hive_3_internals.html)
