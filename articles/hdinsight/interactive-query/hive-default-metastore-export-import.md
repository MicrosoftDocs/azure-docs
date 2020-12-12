---
title: Migrate Default Hive Metastore to Custom Metastore
description: Migrate Default Hive Metastore to Custom Metastore
author: kevxmsft
ms.author: kevx
ms.reviewer: 
ms.service: hdinsight
ms.topic: how-to
ms.date: 11/4/2020
---

# Migrate Default Hive Metastore to Custom Metastore

This article shows how to export a [default metastore](../hdinsight-use-external-metadata-stores.md#default-metastore) for Hive to a custom SQL Database on HDInsight. This is useful for scaling up the SQL Database or for [migrating workloads from HDInsight 3.6 to HDInsight 4.0](./apache-hive-migrate-workloads.md).

Because the default metastore has limited compute capacity, we recommend low utilization from other jobs on the cluster while exporting metadata.

Source and target metastores must use the same HDInsight version and the same Storage Accounts. If upgrading HDInsight versions, complete the steps in this article first. Then, follow the official upgrade steps [here](./apache-hive-migrate-workloads.md).

Optionally, see a separate guide for [Hive Workload Migration across Storage Accounts](./hive-migration-across-storage-accounts.md).

## Export/Import with sqlpackage

An HDInsight cluster created only after 2020-10-15 supports SQL Export/Import for Hive default metastore by using `sqlpackage` for export.

1. Install [sqlpackage](https://docs.microsoft.com/sql/tools/sqlpackage-download?view=sql-server-ver15#get-sqlpackage-net-core-for-linux) to the cluster.

1. Export the default metastore to BACPAC file by executing the following command.

    ```bash
    wget "https://hdiconfigactions.blob.core.windows.net/hivemetastoreschemaupgrade/hive_metastore_tool.py"
    SQLPACKAGE_FILE='/home/sshuser/sqlpackage/sqlpackage'  # replace with sqlpackage location
    TARGET_FILE='hive.bacpac'
    sudo python hive_metastore_tool.py --sqlpackagefile $SQLPACKAGE_FILE --targetfile $TARGET_FILE
    ```

1. Save the BACPAC file. Below is an option.

    ```bash
    hdfs dfs -mkdir -p /bacpacs
    hdfs dfs -put $TARGET_FILE /bacpacs/
    ```

1. Import the BACPAC file to a new database with steps listed [here](../../azure-sql/database/database-import.md).

## Export/Import with Hive script

Clusters created before 2020-10-15 do not support export/import of the default metastore.

For such clusters, this article provides a script that exports Hive databases, tables, and partitions as an HQL script, containing DDL and data copy commands. We will run this HQL script on another cluster, with target SQL Database configured as Hive external metastore. Other metadata objects, like UDFs, must be re-created.

### Prerequisites

* Prepare a new Hadoop or Interactive Query HDInsight cluster, with an [external Hive metastore](../hdinsight-use-external-metadata-stores.md#custom-metastore) and the same Storage Accounts as the source cluster. The same default filesystem is not required.

* If using [Azure Data Lake Storage Gen1](../overview-data-lake-storage-gen1.md), we must alter table locations by replacing prefix like `adl://${HOME}` to `adl://${DFS_ADLS_HOME_HOSTNAME}${DFS_ADLS_HOME_MOUNTPOINT}`, where

    - `adl://${HOME}` = value of `fs.defaultFS` in `HDFS core-site`
    - `DFS_ADLS_HOME_HOSTNAME` = value of `dfs.adls.${HOME}.hostname` in `HDFS core-site`
    - `DFS_ADLS_HOME_MOUNTPOINT` = value of `dfs.adls.${HOME}.mountpoint` in `HDFS core-site`

    We can check the configuration values via [Ambari](../hdinsight-hadoop-manage-ambari.md#services).

    See the [Hive Language Manual](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL) for `show create table` and `alter table` commands.

### Migrate from default metastore

1) [Connect to the HDInsight Cluster headnode using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

1) Export metadata to a Hive script named `hdi_import.hql`.

    * For HDInsight 4.0, the script uses [Hive Export/Import](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+ImportExport), which requires a target path that is accessible to both new and old clusters. It is possible to use another storage account as export/import target: see [Add additional storage accounts to HDInsight](../hdinsight-hadoop-add-storage.md).

    * Execute the following commands from an empty directory.

        ```bash
        sudo su
        SCRIPT="exporthive.sh"
        wget "https://hdiconfigactions.blob.core.windows.net/hivemetastoreschemaupgrade/$SCRIPT"
        chmod 755 "$SCRIPT"
    
        # If HDInsight 3.6, ignore.
        # Otherwise, replace with proper path.
        EXPORT_ROOT_HDI_4_0='wasb://CONTAINER@ACCOUNT.blob.core.windows.net/hdi_hive_export'
    
        exec "./$SCRIPT" $EXPORT_ROOT_HDI_4_0
        ```

1) Copy the file `hdi_import.hql` to the new HDInsight cluster headnode. `scp` is an option:

    ```bash
    CLUSTER_NAME='hdi40clustername'
    scp hdi_import.hql "sshuser@$CLUSTER_NAME-ssh.azurehdinsight.net:~/"
    ```

1) Ready a new HDInsight cluster with the same version. Execute the Hive import script on this cluster. For further reading on `Beeline`, see [Connect to Apache Beeline on HDInsight](../hadoop/connect-install-beeline.md).

    * Without Enterprise Security Package:

        ```bash
        beeline -u "jdbc:hive2://localhost:10001/;transportMode=http" -f hdi_import.hql
        ```

    * With Enterprise Security Package:

        ```bash
        USER="USER"  # replace USER
        DOMAIN="DOMAIN"  # replace DOMAIN
        DOMAIN_UPPER=$(printf "%s" "$DOMAIN" | awk '{ print toupper($0) }')
        kinit "$USER@$DOMAIN_UPPER"
        hn0=$(grep hn0- /etc/hosts | xargs | tr ' ' '\n' | grep hn0- | head -n1 | cut -d'.' -f1)
        beeline -u "jdbc:hive2://$hn0:10001/default;principal=hive/_HOST@$DOMAIN_UPPER;auth-kerberos;transportMode=http" -n "$USER@$DOMAIN" -f hdi_import.hql
        ```

    > [!NOTE]
    > If a table is managed and transactional, import will "deep" copy the table to a new location. Otherwise, import will "shallow" copy by executing `CREATE TABLE` with the existing location.
    >
    > By default, only HDInsight 4.0 managed tables are transactional.

### Verify that all Hive tables are imported

The following metastore query gets all Hive tables and their data locations. Compare outputs between new and old clusters to verify that no tables are missing in the new cluster.

```bash
wget "https://hdiconfigactions.blob.core.windows.net/hivemetastoreschemaupgrade/hive_metastore_tool.py"
OUTPUT_FILE='hivetables.csv'
QUERY="SELECT DBS.NAME, TBLS.TBL_NAME, SDS.LOCATION FROM SDS, TBLS, DBS WHERE TBLS.SD_ID = SDS.SD_ID AND TBLS.DB_ID = DBS.DB_ID ORDER BY DBS.NAME, TBLS.TBL_NAME ASC;"
sudo python hive_metastore_tool.py --query "$QUERY" > $OUTPUT_FILE
```

Only tables with property `'transactional'='true'` will differ in `SDS.LOCATION` due to deep copying.

### Further Reading

1) [Migrate workloads from HDInsight 3.6 to 4.0](./apache-hive-migrate-workloads.md)
1) [Hive Workload Migration across Storage Accounts](./hive-migration-across-storage-accounts.md)
1) [Connect to Beeline on HDInsight](../hadoop/connect-install-beeline.md)
1) [Troubleshoot Permission Error Create Table](./interactive-query-troubleshoot-permission-error-create-table.md)
