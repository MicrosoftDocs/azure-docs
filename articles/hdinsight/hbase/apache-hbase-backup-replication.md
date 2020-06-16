---
title: Backup & replication for Apache HBase, Phoenix - Azure HDInsight
description: Set up Backup and replication for Apache HBase and Apache Phoenix in Azure HDInsight
author: ashishthaps
ms.author: ashishth
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 12/19/2019
---

# Set up backup and replication for Apache HBase and Apache Phoenix on HDInsight

Apache HBase supports several approaches for guarding against data loss:

* Copy the `hbase` folder
* Export then Import
* Copy tables
* Snapshots
* Replication

> [!NOTE]  
> Apache Phoenix stores its metadata in HBase tables, so that metadata is backed up when you back up the HBase system catalog tables.

The following sections describe the usage scenario for each of these approaches.

## Copy the hbase folder

With this approach, you copy all HBase data, without being able to select a subset of tables or column families. Subsequent approaches provide greater control.

HBase in HDInsight uses the default storage selected when creating the cluster, either Azure Storage blobs or Azure Data Lake Storage. In either case, HBase stores its data and metadata files under the following path:

    /hbase

* In an Azure Storage account the `hbase` folder resides at the root of the blob container:

    ```
    wasbs://<containername>@<accountname>.blob.core.windows.net/hbase
    ```

* In Azure Data Lake Storage, the `hbase` folder resides under the root path you specified when provisioning a cluster. This root path typically has a `clusters` folder, with a subfolder named after your HDInsight cluster:

    ```
    /clusters/<clusterName>/hbase
    ```

In either case, the `hbase` folder contains all the data that HBase has flushed to disk, but it may not contain the in-memory data. Before you can rely on this folder as an accurate representation of the HBase data, you must shut down the cluster.

After you delete the cluster, you can either leave the data in place, or copy the data to a new location:

* Create a new HDInsight instance pointing to the current storage location. The new instance is created with all the existing data.

* Copy the `hbase` folder to a different Azure Storage blob container or Data Lake Storage location, and then start a new cluster with that data. For Azure Storage, use [AzCopy](../../storage/common/storage-use-azcopy.md), and for Data Lake Storage use [AdlCopy](../../data-lake-store/data-lake-store-copy-data-azure-storage-blob.md).

## Export then Import

On the source HDInsight cluster, use the [Export utility](https://hbase.apache.org/book.html#export) (included with HBase) to export data from a source table to the default attached storage. You can then copy the exported folder to the destination storage location, and run the [Import utility](https://hbase.apache.org/book.html#import) on the destination HDInsight cluster.

To export table data, first SSH into the head node of your source HDInsight cluster and then run the following `hbase` command:

    hbase org.apache.hadoop.hbase.mapreduce.Export "<tableName>" "/<path>/<to>/<export>"

The export directory must not already exist. The table name is case-sensitive.

To import table data, SSH into the head node of your destination HDInsight cluster and then run the following `hbase` command:

    hbase org.apache.hadoop.hbase.mapreduce.Import "<tableName>" "/<path>/<to>/<export>"

The table must already exist.

Specify the full export path to the default storage or to any of the attached storage options. For example, in Azure Storage:

    wasbs://<containername>@<accountname>.blob.core.windows.net/<path>

In Azure Data Lake Storage Gen2, the syntax is:

    abfs://<containername>@<accountname>.dfs.core.windows.net/<path>

In Azure Data Lake Storage Gen1, the syntax is:

    adl://<accountName>.azuredatalakestore.net:443/<path>

This approach offers table-level granularity. You can also specify a date range for the rows to include, which allows you to perform the process incrementally. Each date is in milliseconds since the Unix epoch.

    hbase org.apache.hadoop.hbase.mapreduce.Export "<tableName>" "/<path>/<to>/<export>" <numberOfVersions> <startTimeInMS> <endTimeInMS>

Note that you have to specify the number of versions of each row to export. To include all versions in the date range, set `<numberOfVersions>` to a value greater than your maximum possible row versions, such as 100000.

## Copy tables

The [CopyTable utility](https://hbase.apache.org/book.html#copy.table) copies data from a source table, row by row, to an existing destination table with the same schema as the source. The destination table can be on the same cluster or a different HBase cluster. The table names are case-sensitive.

To use CopyTable within a cluster, SSH into the head node of your source HDInsight cluster and then run this `hbase` command:

    hbase org.apache.hadoop.hbase.mapreduce.CopyTable --new.name=<destTableName> <srcTableName>


To use CopyTable to copy to a table on a different cluster, add the `peer` switch with the destination cluster's address:

    hbase org.apache.hadoop.hbase.mapreduce.CopyTable --new.name=<destTableName> --peer.adr=<destinationAddress> <srcTableName>

The destination address is composed of the following three parts:

    <destinationAddress> = <ZooKeeperQuorum>:<Port>:<ZnodeParent>

* `<ZooKeeperQuorum>` is a comma-separated list of Apache ZooKeeper nodes, for example:

    zk0-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk4-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk3-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net

* `<Port>` on HDInsight defaults to 2181, and `<ZnodeParent>` is `/hbase-unsecure`, so the complete `<destinationAddress>` would be:

    zk0-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk4-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk3-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net:2181:/hbase-unsecure

See [Manually Collecting the Apache ZooKeeper Quorum List](#manually-collect-the-apache-zookeeper-quorum-list) in this article for details on how to retrieve these values for your HDInsight cluster.

The CopyTable utility also supports parameters to specify the time range of rows to copy, and to specify the subset of column families in a table to copy. To see the complete list of parameters supported by CopyTable, run CopyTable without any parameters:

    hbase org.apache.hadoop.hbase.mapreduce.CopyTable

CopyTable scans the entire source table content that will be copied over to the destination table. This may reduce your HBase cluster's performance while CopyTable executes.

> [!NOTE]  
> To automate the copying of data between tables, see the `hdi_copy_table.sh` script in the [Azure HBase Utils](https://github.com/Azure/hbase-utils/tree/master/replication) repository on GitHub.

### Manually collect the Apache ZooKeeper quorum List

When both HDInsight clusters are in the same virtual network, as described previously, internal host name resolution is automatic. To use CopyTable for HDInsight clusters in two separate virtual networks connected by a VPN Gateway, you'll need to provide the host IP addresses of the Zookeeper nodes in the quorum.

To acquire the quorum host names, run the following curl command:

    curl -u admin:<password> -X GET -H "X-Requested-By: ambari" "https://<clusterName>.azurehdinsight.net/api/v1/clusters/<clusterName>/configurations?type=hbase-site&tag=TOPOLOGY_RESOLVED" | grep "hbase.zookeeper.quorum"

The curl command retrieves a JSON document with HBase configuration information, and the grep command returns only the "hbase.zookeeper.quorum" entry, for example:

    "hbase.zookeeper.quorum" : "zk0-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk4-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net,zk3-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net"

The quorum host names value is the entire string to the right of the colon.

To retrieve the IP addresses for these hosts, use the following curl command for each host in the previous list:

    curl -u admin:<password> -X GET -H "X-Requested-By: ambari" "https://<clusterName>.azurehdinsight.net/api/v1/clusters/<clusterName>/hosts/<zookeeperHostFullName>" | grep "ip"

In this curl command, `<zookeeperHostFullName>` is the full DNS name of a ZooKeeper host, such as the example `zk0-hdizc2.54o2oqawzlwevlfxgay2500xtg.dx.internal.cloudapp.net`. The output of the command contains the IP address for the specified host, for example:

    100    "ip" : "10.0.0.9",

After you collect the IP addresses for all ZooKeeper nodes in your quorum, rebuild the destination address:

    <destinationAddress>  = <Host_1_IP>,<Host_2_IP>,<Host_3_IP>:<Port>:<ZnodeParent>

In our example:

    <destinationAddress> = 10.0.0.9,10.0.0.8,10.0.0.12:2181:/hbase-unsecure

## Snapshots

[Snapshots](https://hbase.apache.org/book.html#ops.snapshots) enable you to take a point-in-time backup of data in your HBase datastore. Snapshots have minimal overhead and complete within seconds, because a snapshot operation is effectively a metadata operation capturing the names of all files in storage at that instant. At the time of a snapshot, no actual data is copied. Snapshots rely on the immutable nature of the data stored in HDFS, where updates, deletes, and inserts are all represented as new data. You can restore (*clone*) a snapshot on the same cluster, or export a snapshot to another cluster.

To create a snapshot, SSH in to the head node of your HDInsight HBase cluster and start the `hbase` shell:

    hbase shell

Within the hbase shell, use the snapshot command with the names of the table and of this snapshot:

    snapshot '<tableName>', '<snapshotName>'

To restore a snapshot by name within the `hbase` shell, first disable the table, then restore the snapshot and re-enable the table:

    disable '<tableName>'
    restore_snapshot '<snapshotName>'
    enable '<tableName>'

To restore a snapshot to a new table, use clone_snapshot:

    clone_snapshot '<snapshotName>', '<newTableName>'

To export a snapshot to HDFS for use by another cluster, first create the snapshot as described previously and then use the ExportSnapshot utility. Run this utility from within the SSH session to the head node, not within the `hbase` shell:

     hbase org.apache.hadoop.hbase.snapshot.ExportSnapshot -snapshot <snapshotName> -copy-to <hdfsHBaseLocation>

The `<hdfsHBaseLocation>` can be any of the storage locations accessible to your source cluster, and should point to the hbase folder used by your destination cluster. For example, if you have a secondary Azure Storage account attached to your source cluster, and that account provides access to the container used by the default storage of the destination cluster, you could use this command:

    hbase org.apache.hadoop.hbase.snapshot.ExportSnapshot -snapshot 'Snapshot1' -copy-to 'wasbs://secondcluster@myaccount.blob.core.windows.net/hbase'

After the snapshot is exported, SSH into the head node of the destination cluster and restore the snapshot using the restore_snapshot command as previously described.

Snapshots provide a complete backup of a table at the time of the `snapshot` command. Snapshots don't provide the ability to perform incremental snapshots by windows of time, nor to specify subsets of columns families to include in the snapshot.

## Replication

[HBase replication](https://hbase.apache.org/book.html#_cluster_replication) automatically pushes transactions from a source cluster to a destination cluster, using an asynchronous mechanism with minimal overhead on the source cluster. In HDInsight, you can set up replication between clusters where:

* The source and destination clusters are in the same virtual network.
* The source and destinations clusters are in different virtual networks connected by a VPN gateway, but both clusters exist in the same geographic location.
* The source cluster and destinations clusters are in different virtual networks connected by a VPN gateway and each cluster exists in a different geographic location.

The general steps to set up replication are:

1. On the source cluster, create the tables and populate data.
2. On the destination cluster, create empty destination tables with the source table's schema.
3. Register the destination cluster as a peer to the source cluster.
4. Enable replication on the desired source tables.
5. Copy existing data from the source tables to the destination tables.
6. Replication automatically copies new data modifications to the source tables into the destination tables.

To enable replication on HDInsight, apply a Script Action to your running source HDInsight cluster. For a walkthrough of enabling replication in your cluster, or to experiment with replication on sample clusters created in virtual networks using Azure Resource Management templates, see [Configure Apache HBase replication](apache-hbase-replication.md). That article also includes instructions for enabling replication of Phoenix metadata.

## Next steps

* [Configure Apache HBase replication](apache-hbase-replication.md)
* [Working with the HBase Import and Export Utility](https://blogs.msdn.microsoft.com/data_otaku/2016/12/21/working-with-the-hbase-import-and-export-utility/)
