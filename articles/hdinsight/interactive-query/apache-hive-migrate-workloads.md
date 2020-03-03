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

This document shows you how to migrate Apache Hive and LLAP workloads on HDInsight 3.6 to HDInsight 4.0. HDInsight 4.0 provides newer Hive and LLAP features such as materialized views and query result caching. When you migrate your workloads to HDInsight 4.0, you can use many newer features of Hive 3 that aren't available on HDInsight 3.6.

This article covers the following subjects:

* Migration of Hive metadata to HDInsight 4.0
* Safe migration of ACID and non-ACID tables
* Preservation of Hive security policies across HDInsight versions
* Query execution and debugging from HDInsight 3.6 to HDInsight 4.0

One advantage of Hive is the ability to export metadata to an external database (referred to as the Hive Metastore). The **Hive Metastore** is responsible for storing table statistics, including the table storage location, column names, and table index information. The metastore database schema differs between Hive versions. The recommended way to upgrade the Hive metastore safely is to create a copy and upgrade the copy instead of the current production environment.

## Copy metastore

HDInsight 3.6 and HDInsight 4.0 require different metastore schemas and can't share a single metastore.

### External metastore

Create a new copy of your external metastore. If you're using an external metastore, one of the safe and easy ways to make a copy of the metastore is to [restore the Database](../../sql-database/sql-database-recovery-using-backups.md#point-in-time-restore) with a different name using the SQL Database restore function.  See [Use external metadata stores in Azure HDInsight](../hdinsight-use-external-metadata-stores.md) to learn more about attaching an external metastore to an HDInsight cluster.

### Internal metastore

If you're using the internal metastore, you can use queries to export object definitions in the Hive metastore, and import them into a new database.

Once this script is complete, it is assumed that the old cluster will no longer be used for accessing any of the tables or databases referred to in the script.

> [!NOTE]
> In the case of ACID tables, a new copy of the data underneath the table will be created.

1. Connect to the HDInsight cluster by using a [Secure Shell (SSH) client](../hdinsight-hadoop-linux-use-ssh-unix.md).

1. Connect to HiveServer2 with your [Beeline client](../hadoop/apache-hadoop-use-hive-beeline.md) from your open SSH session by entering the following command:

    ```hiveql
    for d in `beeline -u "jdbc:hive2://localhost:10001/;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "show databases;"`; 
    do
        echo "Scanning Database: $d"
        echo "create database if not exists $d; use $d;" >> alltables.hql; 
        for t in `beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "show tables;"`;
        do
            echo "Copying Table: $t"
            ddl=`beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "show create table $t;"`;

            echo "$ddl;" >> alltables.hql;
            lowerddl=$(echo $ddl | awk '{print tolower($0)}')
            if [[ $lowerddl == *"'transactional'='true'"* ]]; then
                if [[ $lowerddl == *"partitioned by"* ]]; then
                    # partitioned
                    raw_cols=$(beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "show create table $t;" | tr '\n' ' ' | grep -io "CREATE TABLE .*" | cut -d"(" -f2- | cut -f1 -d")" | sed 's/`//g');
                    ptn_cols=$(beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "show create table $t;" | tr '\n' ' ' | grep -io "PARTITIONED BY .*" | cut -f1 -d")" | cut -d"(" -f2- | sed 's/`//g');
                    final_cols=$(echo "(" $raw_cols "," $ptn_cols ")")

                    beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "create external table ext_$t $final_cols TBLPROPERTIES ('transactional'='false');";
                    beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "insert into ext_$t select * from $t;";
                    staging_ddl=`beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "show create table ext_$t;"`;
                    dir=$(echo $staging_ddl | grep -io " LOCATION .*" | grep -m1 -o "'.*" | sed "s/'[^-]*//2g" | cut -c2-);

                    parsed_ptn_cols=$(echo $ptn_cols| sed 's/ [a-z]*,/,/g' | sed '$s/\w*$//g');
                    echo "create table flattened_$t $final_cols;" >> alltables.hql;
                    echo "load data inpath '$dir' into table flattened_$t;" >> alltables.hql;
                    echo "insert into $t partition($parsed_ptn_cols) select * from flattened_$t;" >> alltables.hql;
                    echo "drop table flattened_$t;" >> alltables.hql;
                    beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "drop table ext_$t";
                else
                    # not partitioned
                    beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "create external table ext_$t like $t TBLPROPERTIES ('transactional'='false');";
                    staging_ddl=`beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "show create table ext_$t;"`;
                    dir=$(echo $staging_ddl | grep -io " LOCATION .*" | grep -m1 -o "'.*" | sed "s/'[^-]*//2g" | cut -c2-);

                    beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "insert into ext_$t select * from $t;";
                    echo "load data inpath '$dir' into table $t;" >> alltables.hql;
                    beeline -u "jdbc:hive2://localhost:10001/$d;transportMode=http" --showHeader=false --silent=true --outputformat=tsv2 -e "drop table ext_$t";
                fi
            fi
            echo "$ddl" | grep -q "PARTITIONED\s*BY" && echo "MSCK REPAIR TABLE $t;" >> alltables.hql;
        done;
    done
    ```

    This command generates a file named **alltables.hql**.

1. Exit your SSH session. Then enter a scp command to download **alltables.hql** locally.

    ```bash
    scp sshuser@CLUSTERNAME-ssh.azurehdinsight.net:alltables.hql c:/hdi
    ```

1. Upload **alltables.hql** to the *new* HDInsight cluster.

    ```bash
    scp c:/hdi/alltables.hql sshuser@CLUSTERNAME-ssh.azurehdinsight.net:/home/sshuser/
    ```

1. Then use SSH to connect to the *new* HDInsight cluster. Run the following code from the SSH session:

    ```bash
    beeline -u "jdbc:hive2://localhost:10001/;transportMode=http" -i alltables.hql
    ```


## Upgrade metastore

Once the metastore **copy** is complete, run a schema upgrade script in [Script Action](../hdinsight-hadoop-customize-cluster-linux.md) on the existing HDInsight 3.6 cluster to upgrade the new metastore to Hive 3 schema. This allows the database to be attached as HDInsight 4.0 metastore.

Use the values in the table further below. Replace `SQLSERVERNAME DATABASENAME USERNAME PASSWORD` with the appropriate values for the **copied** Hive metastore, separated by spaces. Don't include ".database.windows.net" when specifying the SQL server name.

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

## Migrate Hive tables to HDInsight 4.0

After completing the previous set of steps to migrate the Hive Metastore to HDInsight 4.0, the tables and databases recorded in the metastore will be visible from within the HDInsight 4.0 cluster by executing `show tables` or `show databases` from within the cluster. See [Query execution across HDInsight versions](#query-execution-across-hdinsight-versions) for information on query execution in HDInsight 4.0 clusters.

The actual data from the tables, however, isn't accessible until the cluster has access to the necessary storage accounts. To make sure your HDInsight 4.0 cluster can access the same data as your old HDInsight 3.6 cluster, complete the following steps:

1. Determine the Azure storage account of your table or database.

1. If your HDInsight 4.0 cluster is already running, attach the Azure storage account to the cluster via Ambari. If you haven't yet created the HDInsight 4.0 cluster, make sure the Azure storage account is specified as either the primary or a secondary cluster storage account. For more information about adding storage accounts to HDInsight clusters, see [Add additional storage accounts to HDInsight](../hdinsight-hadoop-add-storage.md).

## Deploy new HDInsight 4.0 and connect to the new metastore

After the schema upgrade is complete, deploy a new HDInsight 4.0 cluster and connect the upgraded metastore. If you've already deployed 4.0, set it so that you can connect to the metastore from Ambari.

## Run schema migration script from HDInsight 4.0

Tables are treated differently in HDInsight 3.6 and HDInsight 4.0. For this reason, you can't share the same tables for clusters of different versions. If you want to use HDInsight 3.6 at the same time as HDInsight 4.0, you must have separate copies of the data for each version.

Your Hive workload may include a mix of ACID and non-ACID tables. One key difference between Hive on HDInsight 3.6 (Hive 2) and Hive on HDInsight 4.0 (Hive 3) is ACID-compliance for tables. In HDInsight 3.6, enabling Hive ACID-compliance requires additional configuration, but in HDInsight 4.0 tables are ACID-compliant by default. The only action required before migration is to run a major compaction against the ACID table on the 3.6 cluster. From the Hive view or from Beeline, run the following query:

```sql
alter table myacidtable compact 'major';
```

This compaction is required because HDInsight 3.6 and HDInsight 4.0 ACID tables understand ACID deltas differently. Compaction enforces a clean slate that guarantees consistency. Section 4 of the [Hive migration documentation](https://docs.hortonworks.com/HDPDocuments/Ambari-2.7.3.0/bk_ambari-upgrade-major/content/prepare_hive_for_upgrade.html) contains guidance for bulk compaction of HDInsight 3.6 ACID tables.

Once you've completed the metastore migration and compaction steps, you can migrate the actual warehouse. After you complete the Hive warehouse migration, the HDInsight 4.0 warehouse will have the following properties:

|3.6 |4.0 |
|---|---|
|External tables|External tables|
|Non-transactional managed tables|External tables|
|Transactional managed tables|Managed tables|

You may need to adjust the properties of your warehouse before executing the migration. For example, if you expect that some table will be accessed by a third party (such as an HDInsight 3.6 cluster), that table must be external once the migration is complete. In HDInsight 4.0, all managed tables are transactional. Therefore, managed tables in HDInsight 4.0 should only be accessed by HDInsight 4.0 clusters.

Once your table properties are set correctly, execute the Hive warehouse migration tool from one of the cluster headnodes using the SSH shell:

1. Connect to your cluster headnode using SSH. For instructions, see [Connect to HDInsight using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md)
1. Open a login shell as the Hive user by running `sudo su - hive`
1. Determine the data platform stack version by executing `ls /usr/hdp`. This will display a version string that you should use in the next command.
1. Execute the following command from the shell. Replace `STACK_VERSION` with the version string from the previous step:

```bash
/usr/hdp/STACK_VERSION/hive/bin/hive --config /etc/hive/conf --service  strictmanagedmigration --hiveconf hive.strict.managed.tables=true -m automatic --modifyManagedTables
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
