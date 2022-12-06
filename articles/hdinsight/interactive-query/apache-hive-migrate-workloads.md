---
title: Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0
description: Learn how to migrate Apache Hive workloads on HDInsight 3.6 to HDInsight 4.0.
author: reachnijel
ms.author: nijelsf
ms.service: hdinsight
ms.topic: how-to
ms.date: 10/20/2022
---

# Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0

HDInsight 4.0 has several advantages over HDInsight 3.6. Here's an [overview of what's new in HDInsight 4.0](../hdinsight-version-release.md).

This article covers steps to migrate Hive workloads from HDInsight 3.6 to 4.0, including

* Hive metastore copy and schema upgrade
* Safe migration for ACID compatibility
* Preservation of Hive security policies

The new and old HDInsight clusters must have access to the same Storage Accounts.

Migration of Hive tables to a new Storage Account needs to be done as a separate step. See [Hive Migration across Storage Accounts](./hive-migration-across-storage-accounts.md).

## Steps to upgrade

### 1. Prepare the data

* HDInsight 3.6 by default doesn't support ACID tables. If ACID tables are present, however, run 'MAJOR' compaction on them. See the [Hive Language Manual](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-AlterTable/Partition/Compact) for details on compaction.

* If using [Azure Data Lake Storage Gen1](../overview-data-lake-storage-gen1.md), Hive table locations are likely dependent on the cluster's HDFS configurations. Run the following script action to make these locations portable to other clusters. See [Script action to a running cluster](../hdinsight-hadoop-customize-cluster-linux.md#script-action-to-a-running-cluster).

  |Property | Value |
  |---|---|
  |Bash script URI|`https://hdiconfigactions.blob.core.windows.net/linuxhivemigrationv01/hive-adl-expand-location-v01.sh`|
  |Node type(s)|Head|
  |Parameters||

### 2. Copy the SQL database

* If the cluster uses a default Hive metastore, follow this [guide](./hive-default-metastore-export-import.md) to export metadata to an external metastore. Then, create a copy of the external metastore for upgrade.

* If the cluster uses an external Hive metastore, create a copy of it. Options include [export/import](/azure/azure-sql/database/database-export) and [point-in-time restore](/azure/azure-sql/database/recovery-using-backups#point-in-time-restore).

### 3. Upgrade the metastore schema

This step uses the [`Hive Schema Tool`](https://cwiki.apache.org/confluence/display/Hive/Hive+Schema+Tool) from HDInsight 4.0 to upgrade the metastore schema.

> [!WARNING]
> This step isn't reversible. Run this only on a copy of the metastore.

1. Create a temporary HDInsight 4.0 cluster to access the 4.0 Hive `schematool`. You can use the [default Hive metastore](../hdinsight-use-external-metadata-stores.md#default-metastore) for this step.

1. From the HDInsight 4.0 cluster, execute `schematool` to upgrade the target HDInsight 3.6 metastore. Edit the following shell script to add your SQL server name, database name, username, and password. Open an [SSH Session](../hdinsight-hadoop-linux-use-ssh-unix.md) on the headnode and run it.

   ```sh
   SERVER='servername.database.windows.net'  # replace with your SQL Server
   DATABASE='database'  # replace with your 3.6 metastore SQL Database
   USERNAME='username'  # replace with your 3.6 metastore username
   PASSWORD='password'  # replace with your 3.6 metastore password
   STACK_VERSION=$(hdp-select status hive-server2 | awk '{ print $3; }')
   /usr/hdp/$STACK_VERSION/hive/bin/schematool -upgradeSchema -url "jdbc:sqlserver://$SERVER;databaseName=$DATABASE;trustServerCertificate=false;encrypt=true;hostNameInCertificate=*.database.windows.net;" -userName "$USERNAME" -passWord "$PASSWORD" -dbType "mssql" --verbose
   ```

   > [!NOTE]
   > This utility uses client `beeline` to execute SQL scripts in `/usr/hdp/$STACK_VERSION/hive/scripts/metastore/upgrade/mssql/upgrade-*.mssql.sql`.
   >
   > SQL Syntax in these scripts isn't necessarily compatible to other client tools. For example, [SSMS](/sql/ssms/download-sql-server-management-studio-ssms) and [Query Editor on Azure Portal](/azure/azure-sql/database/connect-query-portal) require keyword `GO` after each command.
   >
   > If any script fails due to resource capacity or transaction timeouts, scale up the SQL Database.

1. Verify the final version with query `select schema_version from dbo.version`.

   The output should match that of the following bash command from the HDInsight 4.0 cluster.

   ```bash
   grep . /usr/hdp/$(hdp-select --version)/hive/scripts/metastore/upgrade/mssql/upgrade.order.mssql | tail -n1 | rev | cut -d'-' -f1 | rev
   ```

1. Delete the temporary HDInsight 4.0 cluster.

### 4. Deploy a new HDInsight 4.0 cluster

Create a new HDInsight 4.0 cluster, [selecting the upgraded Hive metastore](../hdinsight-use-external-metadata-stores.md#select-a-custom-metastore-during-cluster-creation) and the same Storage Accounts.

* The new cluster doesn't require having the same default filesystem.

* If the metastore contains tables residing in multiple Storage Accounts, you need to add those Storage Accounts to the new cluster to access those tables. See [add extra Storage Accounts to HDInsight](../hdinsight-hadoop-add-storage.md).

* If Hive jobs fail due to storage inaccessibility, verify that the table location is in a Storage Account added to the cluster.

   Use the following Hive command to identify table location:

   ```sql
   SHOW CREATE TABLE ([db_name.]table_name|view_name);
   ```

### 5. Convert Tables for ACID Compliance

Managed tables must be ACID-compliant on HDInsight 4.0. Run `strictmanagedmigration` on HDInsight 4.0 to convert all non-ACID managed tables to external tables with property `'external.table.purge'='true'`. Execute from the headnode:

```bash
sudo su - hive
STACK_VERSION=$(hdp-select status hive-server2 | awk '{ print $3; }')
/usr/hdp/$STACK_VERSION/hive/bin/hive --config /etc/hive/conf --service strictmanagedmigration --hiveconf hive.strict.managed.tables=true -m automatic --modifyManagedTables
```
### 6. Class not found error with `MultiDelimitSerDe`

**Problem**

In certain situations when running a Hive query, you might receive `java.lang.ClassNotFoundException` stating  `org.apache.hadoop.hive.contrib.serde2.MultiDelimitSerDe` class isn't found. This error occurs when customer migrates from HDInsight 3.6 to HDInsight 4.0. The SerDe class `org.apache.hadoop.hive.contrib.serde2.MultiDelimitSerDe`, which is a part of `hive-contrib-1.2.1000.2.6.5.3033-1.jar` in HDInsight 3.6 is removed and we're using `org.apache.hadoop.hive.serde2.MultiDelimitSerDe` class, which is a part of `hive-exec jar` in HDI-4.0. `hive-exec jar` will load to HS2 by default when we start the service.

**STEPS TO TROUBLESHOOT**

1. Check if any JAR under a folder (likely that it supposed to be under Hive libraries folder, which is `/usr/hdp/current/hive/lib` in HDInsight) contains this class or not. 
1. Check for the class `org.apache.hadoop.hive.contrib.serde2.MultiDelimitSerDe` and `org.apache.hadoop.hive.serde2.MultiDelimitSerDe` as mentioned in the solution.

**Solution**

1. Although a JAR file is a binary file, you can still use `grep` command with `-Hrni` switches as below to search for a particular class name
     ```
     grep -Hrni "org.apache.hadoop.hive.contrib.serde2.MultiDelimitSerDe" /usr/hdp/current/hive/lib
     ```
1. If it couldn't find the class, it will return no output. If it finds the class in a JAR file, it will return the output

1. Below is the example took from HDInsight 4.x cluster

    ```
    sshuser@hn0-alters:~$ grep -Hrni "org.apache.hadoop.hive.serde2.MultiDelimitSerDe" /usr/hdp/4.1.9.7/hive/lib/
    Binary file /usr/hdp/4.1.9.7/hive/lib/hive-exec-3.1.0.4.1-SNAPSHOT.jar matches
    ```
1. From the above output, we can confirm that no jar contains the class `org.apache.hadoop.hive.contrib.serde2.MultiDelimitSerDe` and hive-exec jar contains `org.apache.hadoop.hive.serde2.MultiDelimitSerDe`.
1. Try to create the table with row format DerDe as `ROW FORMAT SERDE org.apache.hadoop.hive.serde2.MultiDelimitSerDe`
1. This command will fix the issue. If you've already created the table, you can rename it using the below commands
    ```
    Hive => ALTER TABLE TABLE_NAME SET SERDE 'org.apache.hadoop.hive.serde2.MultiDelimitSerDe'
    Backend DB => UPDATE SERDES SET SLIB='org.apache.hadoop.hive.serde2.MultiDelimitSerDe' where SLIB='org.apache.hadoop.hive.contrib.serde2.MultiDelimitSerDe';
    ```
The update command is to update the details manually in the backend DB and the alter command is used to alter the table with the new SerDe class from beeline or Hive.

## Secure Hive across HDInsight versions

HDInsight optionally integrates with Azure Active Directory using HDInsight Enterprise Security Package (ESP). ESP uses Kerberos and Apache Ranger to manage the permissions of specific resources within the cluster. Ranger policies deployed against Hive in HDInsight 3.6 can be migrated to HDInsight 4.0 with the following steps:

1. Navigate to the Ranger Service Manager panel in your HDInsight 3.6 cluster.
1. Navigate to the policy named **HIVE** and export the policy to a json file.
1. Make sure that all users referred to in the exported policy json exist in the new cluster. If a user is referred to in the policy json but doesn't exist in the new cluster, either add the user to the new cluster or remove the reference from the policy.
1. Navigate to the **Ranger Service Manager** panel in your HDInsight 4.0 cluster.
1. Navigate to the policy named **HIVE** and import the ranger policy json from step 2.

## Hive changes in HDInsight 4.0 that may require application changes

* See [Extra configuration using Hive Warehouse Connector](./apache-hive-warehouse-connector.md) for sharing the metastore between Spark and Hive for ACID tables.

* HDInsight 4.0 uses [Storage Based Authorization](https://cwiki.apache.org/confluence/display/Hive/Storage+Based+Authorization+in+the+Metastore+Server). If you modify file permissions or create folders as a different user than Hive, you'll likely hit Hive errors based on storage permissions. To fix, grant `rw-` access to the user. See [HDFS Permissions Guide](https://hadoop.apache.org/docs/r2.7.1/hadoop-project-dist/hadoop-hdfs/HdfsPermissionsGuide.html).

* `HiveCLI` is replaced with `Beeline`.

Refer to [HDInsight 4.0 Announcement](../hdinsight-version-release.md) for other changes.

## Troubleshooting guide

[HDInsight 3.6 to 4.0 troubleshooting guide for Hive workloads](./interactive-query-troubleshoot-migrate-36-to-40.md) provides answers to common issues faced when migrating Hive workloads from HDInsight 3.6 to HDInsight 4.0.

## Further reading

* [HDInsight 4.0 Announcement](../hdinsight-version-release.md)
* [HDInsight 4.0 deep dive](https://azure.microsoft.com/blog/deep-dive-into-azure-hdinsight-4-0/)
* [Hive 3 ACID Tables](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.1.0/using-hiveql/content/hive_3_internals.html)
