---
title: Migrate an HBase cluster to an HDInsight 5.1 and new storage account - Azure HDInsight
description: Learn how to migrate an Apache HBase cluster in Azure HDInsight to an HDInsight 5.1 with a different Azure Storage account.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 06/30/2023
---

# Migrate Apache HBase to an HDInsight 5.1 and new storage account

This article discusses how to update your Apache HBase cluster on Azure HDInsight to a newer version with a different Azure Storage account.

This article applies only if you need to use different Storage accounts for your source and destination clusters. To upgrade versions with the same Storage account for your source and destination clusters, see [Migrate Apache HBase to a new version](./apache-hbase-migrate-hdinsight-5-1.md).

The downtime while upgrading can be more than 20 minutes. This downtime caused by the steps to flush all in-memory data, and wait for all procedure to complete and the time to configure and restart the services on the new cluster. Your results vary, depending on the number of nodes, amount of data, and other variables.


## Review Apache HBase compatibility

Before upgrading Apache HBase, ensure the HBase versions on the source and destination clusters are compatible. Review the HBase version compatibility matrix and release notes in the [HBase Reference Guide](https://hbase.apache.org/book.html#upgrading) to make sure your application is compatible with the new version.

Here's an example compatibility matrix. **Y** indicates compatibility and **N** indicates a potential incompatibility:

| Compatibility type | Major version| Minor version | Patch |
| --- | --- | --- | --- |
| Client-Server wire compatibility | N | Y | Y |
| Server-Server compatibility | N | Y | Y |
| File format compatibility | N | Y | Y |
| Client API compatibility | N | Y | Y |
| Client binary compatibility | N | N | Y |
| **Server-side limited API compatibility** |  |  |  |
| Stable | N | Y | Y |
| Evolving | N | N | Y |
| Unstable | N | N | N |
| Dependency compatibility | N | Y | Y |
| Operational compatibility | N | N | Y |

The HBase version release notes should describe any breaking incompatibilities. Test your application in a cluster running the target version of HDInsight and HBase.

For more information about HDInsight versions and compatibility, see [Azure HDInsight versions](../hdinsight-component-versioning.md).

## Apache HBase cluster migration overview

To upgrade and migrate your Apache HBase cluster on Azure HDInsight to a new storage account, you complete the following basic steps. For detailed instructions, see the detailed steps and commands.

Prepare the source cluster:
1. Stop data ingestion.
1. Check cluster health
1. Stop replication if needed
1. Flush `memstore` data.
1. Stop HBase.
1. For clusters with accelerated writes, back up the Write Ahead Log (WAL) directory.

Prepare the destination cluster:
1. Create the destination cluster.
1. Stop HBase from Ambari.
1. Clean Zookeeper data.
1. Switch user to HBase.

Complete the migration:
1. Clean the destination file system, migrate the data, and remove `/hbase/hbase.id`.
1. Clean and migrate the WAL.
1. Start all services from the Ambari destination cluster.
1. Verify HBase.
1. Delete the source cluster.

## Detailed migration steps and commands

Use these detailed steps and commands to migrate your Apache HBase cluster with a new storage account.

### Prepare the source cluster

1. Stop ingestion to the source HBase cluster.

1. Check Hbase hbck to verify cluster health
   
   1. Verify HBCK Report page on HBase UI.  Healthy cluster does not show any inconsistencies

      :::image type="content" source="./media/apache-hbase-migrate-new-version/verify-hbck-report.png" alt-text="Screenshot showing how to verify HBCK report." lightbox="./media/apache-hbase-migrate-new-version/verify-hbck-report.png":::
      
   1. If any inconsistencies exist, please fix inconsistencies using [hbase hbck2](/azure/hdinsight/hbase/how-to-use-hbck2-tool/)

1. Note down number of regions in online at source cluster, so that the number can be referred at destination cluster after the migration. 

   :::image type="content" source="./media/apache-hbase-migrate-new-version/total-number-of-regions.png" alt-text="Screenshot showing count of number of regions." lightbox="./media/apache-hbase-migrate-new-version/total-number-of-regions.png":::
   
1. If replication enabled on the cluster, please stop it and reenable the replication on destination cluster after migration. Refer [HBase replication guide](/azure/hdinsight/hbase/apache-hbase-replication/)  

1. Flush the source HBase cluster you're upgrading.
   
   HBase writes incoming data to an in-memory store called a *`memstore`*. After the `memstore` reaches a certain size, HBase flushes it to disk for long-term storage in the cluster's storage account. Deleting the source cluster after an upgrade also deletes any data in the `memstore`s. To retain the data, manually flush each table's `memstore` to disk before upgrading.
   
   You can flush the `memstore` data by running the [flush_all_tables.sh](https://github.com/Azure/hbase-utils/blob/master/scripts/flush_all_tables.sh) script from the [hbase-utils GitHub repository](https://github.com/Azure/hbase-utils/).
   
   You can also flush the `memstore` data by running the following HBase shell command from inside the HDInsight cluster:
   
   ```bash
   hbase shell
   flush "<table-name>"
   ```
1. Wait for 15 mins and verify that all the procedures are completed, and masterProcWal files doesn't  have any pending procedures.

    1. Verify the Procedures page to confirm that there are no pending procedures.
    
        :::image type="content" source="./media/apache-hbase-migrate-new-version/verify-master-process.png" alt-text="Screenshot showing how to verify master process." lightbox="./media/apache-hbase-migrate-new-version/verify-master-process.png"::: 
1. STOP HBase

   1. Sign in to [Apache Ambari](https://ambari.apache.org/) on the source cluster with `https://<OLDCLUSTERNAME>.azurehdinsight.net`
   1. Turn on maintenance mode for HBase.
   1. Stop HBase Masters only first. First stop standby masters, in last stop Active HBase master.
   
       :::image type="content" source="./media/apache-hbase-migrate-new-version/stop-master-services.png" alt-text="Screenshot showing how to stop master services." lightbox="./media/apache-hbase-migrate-new-version/stop-master-services.png":::

   1. Stop the HBase service, it stops remaining servers.
   
      > [!NOTE]
      > HBase 2.4.11 does not support some of the old Procedures.
      >
      > For more information on connecting to and using Ambari, see [Manage HDInsight clusters by using the Ambari Web UI](../hdinsight-hadoop-manage-ambari.md).
      >
      > Stopping HBase in the previous steps mentioned how Hbase avoids creating new master proc WALs.

1. If your source HBase cluster doesn't have the [Accelerated Writes](apache-hbase-accelerated-writes.md) feature, skip this step. For source HBase clusters with Accelerated Writes, back up the WAL directory under HDFS by running the following commands from an SSH session on any source cluster Zookeeper node or worker node.
   
    ```bash
   hdfs dfs -mkdir /hbase-wal-backup
   hdfs dfs -cp hdfs://mycluster/hbasewal /hbase-wal-backup
   ```

### Prepare the destination cluster

1. In the Azure portal, [set up a new destination HDInsight cluster](../hdinsight-hadoop-provision-linux-clusters.md) that uses a different storage account than your source cluster.
   
1. Sign in to [Apache Ambari](https://ambari.apache.org/) on the new cluster at `https://<NEWCLUSTERNAME>.azurehdinsight.net`, and stop the HBase services.
   
1. Clean the Zookeeper data on the destination cluster by running the following commands in any Zookeeper node or worker node:
   
   ```bash
   hbase zkcli
   rmr /hbase-unsecure
   quit
   ```
   
1. Switch the user to HBase by running `sudo su hbase`.

### Clean and migrate the file system and WAL

Run the following commands, depending on your source HDInsight version and whether the source and destination clusters have Accelerated Writes. The destination cluster is always HDInsight version 4.0, since HDInsight 3.6 is in Basic support and isn't recommended for new clusters.

- [The source cluster is HDInsight 4.0 with Accelerated Writes, and the destination cluster has Accelerated Writes](#the-source-cluster-is-hdinsight-40-without-accelerated-writes-and-the-destination-cluster-has-accelerated-writes).
- [The source cluster is HDInsight 4.0 without Accelerated Writes, and the destination cluster has Accelerated Writes](#the-source-cluster-is-hdinsight-40-without-accelerated-writes-and-the-destination-cluster-doesnt-have-accelerated-writes).
- [The source cluster is HDInsight 4.0 without Accelerated Writes, and the destination cluster doesn't have Accelerated Writes]().

The `<container-endpoint-url>` for the storage account is `https://<storageaccount>.blob.core.windows.net/<container-name>`. Pass the SAS token for the storage account at the very end of the URL.

- The `<container-fullpath>` for storage type WASB is `wasbs://<container-name>@<storageaccount>.blob.core.windows.net`
- The `<container-fullpath>` for storage type Azure Data Lake Storage Gen2 is `abfs://<container-name>@<storageaccount>.dfs.core.windows.net`.

#### Copy commands

The HDFS copy command is `hdfs dfs <copy properties starting with -D> -cp`
 
Use `hadoop distcp` for better performance when copying files not in a page blob: `hadoop distcp <copy properties starting with -D>`
 
To pass the key of the storage account, use:
- `-Dfs.azure.account.key.<storageaccount>.blob.core.windows.net='<storage account key>'`
- `-Dfs.azure.account.keyprovider.<storageaccount>.blob.core.windows.net=org.apache.hadoop.fs.azure.SimpleKeyProvider`

You can also use [AzCopy](../../storage/common/storage-ref-azcopy.md) for better performance when copying HBase data files.
   
1. Run the AzCopy command:
   
   ```bash
   azcopy cp "<source-container-endpoint-url>/hbase" "<target-container-endpoint-url>" --recursive
   ```

1. If the destination storage account is Azure Blob storage, do this step after the copy. If the destination storage account is Data Lake Storage Gen2, skip this step.
   
   The Hadoop WASB driver uses special zero sized blobs corresponding to every directory. AzCopy skips these files when doing the copy. Some WASB operations use these blobs, so you must create them in the destination cluster. To create the blobs, run the following Hadoop command from any node in the destination cluster:
   
   ```bash
   sudo -u hbase hadoop fs -chmod -R 0755 /hbase
   ```

You can download AzCopy from [Get started with AzCopy](../../storage/common/storage-use-azcopy-v10.md). For more information about using AzCopy, see [azcopy copy](../../storage/common/storage-ref-azcopy-copy.md).


#### The source cluster is HDInsight 4.0 without Accelerated Writes, and the destination cluster has Accelerated Writes

1. To clean the file system and migrate data, run the following commands:
   
   ```bash
   hdfs dfs -rm -r /hbase 
   hadoop distcp <source-container-fullpath>/hbase /
   ```
   
1. Remove `hbase.id` by running `hdfs dfs -rm /hbase/hbase.id`
   
1. To clean and migrate the WAL, run the following commands:
   
   ```bash
   hdfs dfs -rm -r hdfs://<destination-cluster>/hbasewal
   hdfs dfs -Dfs.azure.page.blob.dir="/hbase-wals" -cp <source-container-fullpath>/hbase-wals hdfs://<destination-cluster>/hbasewal
   ```

#### The source cluster is HDInsight 4.0 without Accelerated Writes, and the destination cluster doesn't have Accelerated Writes

1. To clean the file system and migrate data, run the following commands:
   
   ```bash
   hdfs dfs -rm -r /hbase 
   hadoop distcp <source-container-fullpath>/hbase /
   ```
   
1. Remove `hbase.id` by running `hdfs dfs -rm /hbase/hbase.id`
   
1. To clean and migrate the WAL, run the following commands:
   
   ```bash
   hdfs dfs -rm -r /hbase-wals/*
   hdfs dfs -Dfs.azure.page.blob.dir="/hbase-wals" -cp <source-container-fullpath>/hbase-wals /
   ```

### Complete the migration

1. On the destination cluster, save your changes and restart all required services as indicated by Ambari.
   
1. Point your application to the destination cluster.
   
   > [!NOTE]  
   > The static DNS name for your application changes when you upgrade. Rather than hard-coding this DNS name, you can configure a CNAME in your domain name's DNS settings that points to the cluster's name. Another option is to use a configuration file for your application that you can update without redeploying.
   
1. Start the ingestion.
   
1. Verify HBase consistency and simple Data Definition Language (DDL) and Data Manipulation Language (DML) operations.
   
1. If the destination cluster is satisfactory, delete the source cluster.

## Troubleshooting

### Use case 1: 
If Hbase masters and region servers up and regions stuck in transition or only one region i.e `hbase:meta` region is assigned. Waiting for other regions to assign

**Solution:** 

1. ssh into any ZooKeeper node of original cluster and run `kinit -k -t /etc/security/keytabs/hbase.service.keytab hbase/<zk FQDN>` if this is ESP cluster
1. Run `echo "scan '`hbase:meta`'" | hbase shell > meta.out` to read the `hbase:meta` into a file
1. Run `grep "info:sn" meta.out | awk '{print $4}' | sort | uniq`  to get all RS instance names where the regions were present in old cluster. Output should be like `value=<wn FQDN>,16020,........`
1. Create a dummy WAL dir with that `wn` value

   If the cluster is accelerated write cluster 
   ```
   hdfs dfs -mkdir hdfs://mycluster/hbasewal/WALs/<wn FQDN>,16020,.........
   ```
   If the cluster is nonaccelarated Write cluster 
   ```
   hdfs dfs -mkdir /hbase-wals/WALs/<wn FQDN>,16020,.........
   ```
1. Restart Active `Hmaster`
## Next steps

To learn more about [Apache HBase](https://hbase.apache.org/) and upgrading HDInsight clusters, see the following articles:

- [Upgrade an HDInsight cluster to a newer version](../hdinsight-upgrade-cluster.md)
- [Monitor and manage Azure HDInsight using the Apache Ambari Web UI](../hdinsight-hadoop-manage-ambari.md)
- [Azure HDInsight versions](../hdinsight-component-versioning.md)
- [Optimize Apache HBase](../optimize-hbase-ambari.md)
