---
title: Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0
description: Learn how to migrate Apache Hive workloads on HDInsight 3.6 to HDInsight 4.0.
author: msft-tacox
ms.author: tacox
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 11/13/2019
---

# Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0

This document shows how to migrate Apache Hive and LLAP workloads on HDInsight 3.6 to HDInsight 4.0. HDInsight 4.0 provides newer Hive and LLAP features such as materialized views and query result caching. When you migrate your workloads to HDInsight 4.0, you can use many newer features of Hive 3 that aren't available on HDInsight 3.6.

This article covers the following subjects:

* Migration of Hive metadata to HDInsight 4.0
* Safe migration of ACID and non-ACID tables
* Preservation of Hive security policies across HDInsight versions
* Query execution and debugging from HDInsight 3.6 to HDInsight 4.0

One advantage of Hive is the ability to export metadata to an external database (referred to as the Hive Metastore). The **Hive Metastore** is responsible for storing table statistics, including the table storage location, column names, and table index information. HDInsight 3.6 and HDInsight 4.0 require different metastore schemas and can't share a single metastore. The recommended way to upgrade the Hive metastore safely is to upgrade a copy instead of the original in the current production environment. This document requires the original and new clusters to have access to the same Storage Account. Therefore, it does not cover data migration to another region.

## Migrate from external metastore

### 1. Run major compaction on ACID tables in HDInsight 3.6

HDInsight 3.6 and HDInsight 4.0 ACID tables understand ACID deltas differently. The only action required before migration is to run 'MAJOR' compaction against each ACID table on the 3.6 cluster. See the [Hive Language Manual](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-AlterTable/Partition/Compact) for details on compaction.

### 2. Copy SQL database
Create a new copy of your external metastore. If you're using an external metastore, one of the safe and easy ways to make a copy of the metastore is to [restore the database](../../azure-sql/database/recovery-using-backups.md#point-in-time-restore) with a different name using the `RESTORE` function.  See [Use external metadata stores in Azure HDInsight](../hdinsight-use-external-metadata-stores.md) to learn more about attaching an external metastore to an HDInsight cluster.

### 3. Upgrade metastore schema
Once the metastore **copy** is complete, run a schema upgrade script in [Script Action](../hdinsight-hadoop-customize-cluster-linux.md) on the existing HDInsight 3.6 cluster to upgrade the new metastore to Hive 3 schema. (This step doesn't require the new metastore to be connected to a cluster.) This allows the database to be attached as HDInsight 4.0 metastore.

Use the values in the table further below. Replace `SQLSERVERNAME DATABASENAME USERNAME PASSWORD` with the appropriate values for the Hive metastore **copy**, separated by spaces. Don't include ".database.windows.net" when specifying the SQL server name.

|Property | Value |
|---|---|
|Script type|- Custom|
|Name|Hive upgrade|
|Bash script URI|`https://hdiconfigactions.blob.core.windows.net/hivemetastoreschemaupgrade/launch-schema-upgrade.sh`|
|Node type(s)|Head|
|Parameters|SQLSERVERNAME DATABASENAME USERNAME PASSWORD|

> [!Warning]  
> The upgrade which converts the HDInsight 3.6 metadata schema to the HDInsight 4.0 schema, cannot be reversed.

You can verify the upgrade by running the following sql query against the database:

```sql
select * from dbo.version
```

### 4. Deploy a new HDInsight 4.0 cluster

1. Specify the upgraded metastore as the new cluster's Hive metastore.

1. The actual data from the tables, however, isn't accessible until the cluster has access to the necessary storage accounts.
Make sure that the Hive tables' Storage Accounts in the HDInsight 3.6 cluster are specified as either the primary or secondary Storage Accounts of the new HDInsight 4.0 cluster.
For more information about adding storage accounts to HDInsight clusters, see [Add additional storage accounts to HDInsight](../hdinsight-hadoop-add-storage.md).

### 5. Complete migration with a post-upgrade tool in HDInsight 4.0

Managed tables must be ACID-compliant on HDInsight 4.0, by default. Once you've completed the metastore migration, run a post-upgrade tool to make previously non-ACID managed tables compatible with the HDInsight 4.0 cluster. This tool will apply the following conversion:

|3.6 |4.0 |
|---|---|
|External tables|External tables|
|Non-ACID managed tables|External tables with property 'external.table.purge'='true'|
|ACID managed tables|ACID managed tables|

Execute the Hive post-upgrade tool from the HDInsight 4.0 cluster using the SSH shell:

1. Connect to your cluster headnode using SSH. For instructions, see [Connect to HDInsight using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md)
1. Open a login shell as the Hive user by running `sudo su - hive`
1. Execute the following command from the shell.

    ```bash
    STACK_VERSION=$(hdp-select status hive-server2 | awk '{ print $3; }')
    /usr/hdp/$STACK_VERSION/hive/bin/hive --config /etc/hive/conf --service  strictmanagedmigration --hiveconf hive.strict.managed.tables=true -m automatic --modifyManagedTables
    ```

After the tool completes, your Hive warehouse will be ready for HDInsight 4.0.

## Migrate from internal metastore

If your HDInsight 3.6 cluster uses an internal Hive metastore, then follow the steps below to run a script, which generates Hive queries to export object definitions from the metastore.

The HDInsight 3.6 and 4.0 clusters must use the same Storage Account.

> [!NOTE]
>
> * In the case of ACID tables, a new copy of the data underneath the table will be created.
>
> * This script supports migration of Hive databases, tables, and partitions, only. Other metadata objects, like Views, UDFs, and Table Constraints, are expected to be copied manually.
>
> * Once this script is complete, it is assumed that the old cluster will no longer be used for accessing any of the tables or databases referred to in the script.
>
> * All managed tables will become transactional in HDInsight 4.0. Optionally, keep the table non-transactional by exporting the data to an external table with the property 'external.table.purge'='true'. For example,
>
>    ```SQL
>    create table tablename_backup like tablename;
>    insert overwrite table tablename_backup select * from tablename;
>    create external table tablename_tmp like tablename;
>    insert overwrite table tablename_tmp select * from tablename;
>    alter table tablename_tmp set tblproperties('external.table.purge'='true');
>    drop table tablename;
>    alter table tablename_tmp rename to tablename;
>    ```

1. Connect to the HDInsight 3.6 cluster by using a [Secure Shell (SSH) client](../hdinsight-hadoop-linux-use-ssh-unix.md).

1. From the open SSH session, download the following script file to generate a file named **alltables.hql**.

    ```bash
    wget https://hdiconfigactions.blob.core.windows.net/hivemetastoreschemaupgrade/exporthive_hdi_3_6.sh
    chmod 755 exporthive_hdi_3_6.sh
    ```

    * For a regular HDInsight cluster, without ESP, simply execute `exporthive_hdi_3_6.sh`.

    * For a cluster with ESP, kinit and modify the arguments to beeline:
    run the following, defining USER and DOMAIN for Azure AD user with full Hive permissions.

        ```bash
        USER="USER"  # replace USER
        DOMAIN="DOMAIN"  # replace DOMAIN
        DOMAIN_UPPER=$(printf "%s" "$DOMAIN" | awk '{ print toupper($0) }')
        kinit "$USER@$DOMAIN_UPPER"
        ```

        ```bash
        hn0=$(grep hn0- /etc/hosts | xargs | cut -d' ' -f4)
        BEE_CMD="beeline -u 'jdbc:hive2://$hn0:10001/default;principal=hive/_HOST@$DOMAIN_UPPER;auth-kerberos;transportMode=http' -n "$USER@$DOMAIN" --showHeader=false --silent=true --outputformat=tsv2 -e"
        ./exporthive_hdi_3_6.sh "$BEE_CMD"
        ```

1. Exit your SSH session. Then enter a scp command to download **alltables.hql** locally.

    ```bash
    scp sshuser@CLUSTERNAME-ssh.azurehdinsight.net:alltables.hql c:/hdi
    ```

1. Upload **alltables.hql** to the *new* HDInsight cluster.

    ```bash
    scp c:/hdi/alltables.hql sshuser@CLUSTERNAME-ssh.azurehdinsight.net:/home/sshuser/
    ```

1. Then use SSH to connect to the *new* HDInsight 4.0 cluster. Run the following code from an SSH session to this cluster:

    Without ESP:

    ```bash
    beeline -u "jdbc:hive2://localhost:10001/;transportMode=http" -f alltables.hql
    ```

    With ESP:

    ```bash
    USER="USER"  # replace USER
    DOMAIN="DOMAIN"  # replace DOMAIN
    DOMAIN_UPPER=$(printf "%s" "$DOMAIN" | awk '{ print toupper($0) }')
    kinit "$USER@$DOMAIN_UPPER"
    ```

    ```bash
    hn0=$(grep hn0- /etc/hosts | xargs | cut -d' ' -f4)
    beeline -u "jdbc:hive2://$hn0:10001/default;principal=hive/_HOST@$DOMAIN_UPPER;auth-kerberos;transportMode=http" -n "$USER@$DOMAIN" -f alltables.hql
    ```

The post-upgrade tool for external metastore migration does not apply here, since non-ACID managed tables from HDInsight 3.6 convert to ACID managed tables in HDInsight 4.0.

> [!Important]  
> Managed tables in HDInsight 4.0 (including tables migrated from 3.6) should not be accessed by other services or applications, including HDInsight 3.6 clusters.

## Secure Hive across HDInsight versions

Since HDInsight 3.6, HDInsight integrates with Azure Active Directory using HDInsight Enterprise Security Package (ESP). ESP uses Kerberos and Apache Ranger to manage the permissions of specific resources within the cluster. Ranger policies deployed against Hive in HDInsight 3.6 can be migrated to HDInsight 4.0 with the following steps:

1. Navigate to the Ranger Service Manager panel in your HDInsight 3.6 cluster.
2. Navigate to the policy named **HIVE** and export the policy to a json file.
3. Make sure that all users referred to in the exported policy json exist in the new cluster. If a user is referred to in the policy json but doesn't exist in the new cluster, either add the user to the new cluster or remove the reference from the policy.
4. Navigate to the **Ranger Service Manager** panel in your HDInsight 4.0 cluster.
5. Navigate to the policy named **HIVE** and import the ranger policy json from step 2.

## Check compatibility and modify codes as needed in test app

When migrating workloads such as existing programs and queries, please check the release notes and documentation for changes and apply changes as necessary. If your HDInsight 3.6 cluster is using a shared Spark and Hive metastore, [additional configuration using Hive Warehouse Connector](./apache-hive-warehouse-connector.md) is required.

## Deploy new app for production

To switch to the new cluster, e.g. you can install a new client application and use it as a new production environment, or you can upgrade your existing client application and switch to HDInsight 4.0.

## Switch HDInsight 4.0 to the production

If differences were created in the metastore while testing, you'll need to update the changes just before switching. In this case, you can export & import the metastore and then upgrade again.

## Remove the old production

Once you've confirmed that the release is complete and fully operational, you can remove version 3.6 and the previous metastore. Please make sure that everything is migrated before deleting the environment.

## Query execution across HDInsight versions

There are two ways to execute and debug Hive/LLAP queries within an HDInsight 3.6 cluster. HiveCLI provides a command-line experience and the Tez view/Hive view provides a GUI-based workflow.

In HDInsight 4.0, HiveCLI has been replaced with Beeline. HiveCLI is a thrift client for Hiveserver 1, and Beeline is a JDBC client that provides access to Hiveserver 2. Beeline can also be used to connect to any other JDBC-compatible database endpoint. Beeline is available out-of-box on HDInsight 4.0 without any installation needed.

In HDInsight 3.6, the GUI client for interacting with Hive server is the Ambari Hive View. HDInsight 4.0 does not ship with Ambari View. We have provided a way for our customers to use Data Analytics Studio (DAS), which is not a core HDInsight service. DAS doesn't ship with HDInsight clusters out-of-the-box and isn't an officially supported package. However, DAS can be installed on the cluster using a [script action](../hdinsight-hadoop-customize-cluster-linux.md) as follows:

|Property | Value |
|---|---|
|Script type|- Custom|
|Name|DAS|
|Bash script URI|`https://hdiconfigactions.blob.core.windows.net/dasinstaller/LaunchDASInstaller.sh`|
|Node type(s)|Head|

Wait 10 to 15 minutes, then launch Data Analytics Studio by using this URL: `https://CLUSTERNAME.azurehdinsight.net/das/`.

A refresh of the Ambari UI and/or a restart of all Ambari components may be required before accessing DAS.

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
