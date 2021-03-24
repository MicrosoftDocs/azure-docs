---
title: Migrate an HBase cluster to a new version and Storage account - Azure HDInsight
description: Learn how to migrate Apache HBase cluster to a newer version in a different Storage account in Azure HDInsight.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 03/22/2021
---

# Migrate Apache HBase to a new version and Storage account

This article discusses how to update your Apache HBase cluster on Azure HDInsight to a newer version with a different Storage account.

This article applies only if you need to use different Azure Storage accounts for your source and destination clusters. To upgrade versions with the same Storage account for your destination cluster, see [Migrate Apache HBase to a new version](apache-hbase-migrate-new-version.md).

The downtime while upgrading should be only a few minutes. This downtime is caused by the steps to flush all in-memory data, then the time to configure and restart the services on the new cluster. Your results will vary, depending on the number of nodes, amount of data, and other variables.

## Review Apache HBase compatibility

Before upgrading Apache HBase, ensure the HBase versions on the source and destination clusters are compatible. Review the HBase version compatibility matrix and release notes in the [HBase Reference Guide](https://hbase.apache.org/book.html#upgrading) to make sure your application is compatible with the new version.

Here is an example compatibility matrix. Y indicates compatibility and N indicates a potential incompatibility:

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

## Upgrade the Apache HBase cluster

To upgrade your Apache HBase cluster on Azure HDInsight, complete the following steps:

1. [Set up a new destination HDInsight cluster](../hdinsight-hadoop-provision-linux-clusters.md) that uses a different storage account than the source cluster.

1. Sign in to [Apache Ambari](https://ambari.apache.org/) on the destination cluster with `https://<NEWCLUSTERNAME>.azurehdinsight.net`, and stop the HBase services.
   
   For more information on connecting to and using Ambari, see [Manage HDInsight clusters by using the Ambari Web UI](../hdinsight-hadoop-manage-ambari.md).
   
1. Clean the Zookeeper data, file system, and WAL on the destination cluster by running the following commands in any of the Zookeeper nodes or worker nodes:
   
   ```bash
   hbase zkcli
   rmr /hbase-unsecure
   quit
   ```
   
   ```bash   
   hdfs dfs -rm -r /hbase
   hdfs dfs -rm -r hdfs://mycluster/hbasewal**
   ```
   
1. Clean up the WAL on the destination cluster by running the following commands in any of the Zookeeper nodes or worker nodes.
   
   - If the destination cluster **has the Accelerated Writes feature**, run:
     
     ```bash   
     hdfs dfs -rm -r hdfs://mycluster/hbasewal**
     ```
     
   - If the destination cluster is HDI 4.0 and **doesn't have the Accelerated Writes feature**, run:
     
     ```bash   
     hdfs dfs -rm -r /hbase-wals
     ``` 
   
1. Flush the source HBase cluster you're upgrading.
   
   HBase writes incoming data to an in-memory store called a *memstore*. After the memstore reaches a certain size, HBase flushes it to disk for long-term storage in the cluster's storage account. Deleting the source cluster after upgrading also deletes any data in the memstores. To retain the data, manually flush each table's memstore to disk before upgrading, by running this [script to flush all HBase tables](https://raw.githubusercontent.com/Azure/hbase-utils/master/scripts/flush_all_tables.sh):
   
   :::code language="bash" source="~/hbase-utils/scripts/flush_all_tables.sh":::
   
1. Stop ingestion to the source HBase cluster.
   
1. To ensure any recent memstore data  is flushed, run the preceding script again.
   
1. Sign in to [Apache Ambari](https://ambari.apache.org/) on the source cluster with `https://<OLDCLUSTERNAME>.azurehdinsight.net`, and stop the HBase services.
   
   :::image type="content" source="./media/apache-hbase-migrate-new-version/stop-hbase-services.png" alt-text="In Ambari, select Services > HBase > Stop under Service Actions" border="false":::
   
1. At the confirmation prompt, select the box to turn on maintenance mode for HBase.
   
   :::image type="content" source="./media/apache-hbase-migrate-new-version/turn-on-maintenance-mode.png" alt-text="Select Turn On Maintenance Mode for HBase, then confirm." border="false":::
   
1. Copy the `hbase` folder from the source cluster's Storage account to the destination cluster's Storage account by using [AzCopy](/azure/storage/common/storage-ref-azcopy).
   
   - If you're **migrating from another Azure HDInsight cluster**, run an AzCopy command like:
     
     `azcopy copy 'https://<source-account>.blob.core.windows.net/<source-storage-container>/hbase' 'https://<destination-account>.blob.core.windows.net/<destination-storage-container>' --recursive`
     
   - If you're **migrating from on-premises or other clouds**, you can run a similar AzCopy command after stopping the HBase services on the source cluster:
     
     `azcopy copy <local-folder-path>' 'https://<destination-account>.<blob or dfs>.core.windows.net/<destination-storage-container>' --recursive=true`
     
     \<local-folder-path> is the root directory of your hbase source cluster. You can find this path in the `hbase.rootdir` property in the `hbase-site.xml` file. If this field isn't configured in your source cluster, the default is `/hbase`.
     
     For more information about using AzCopy, see [](/azure/storage/common/storage-use-azcopy-migrate-on-premises-data).
   
1. If your source HBase cluster doesn't have the [Accelerated Writes](apache-hbase-accelerated-writes.md) feature, skip this step. For source HBase clusters with Accelerated Writes, back up the WAL dir under HDFS by running the following commands from an SSH session on any of the Zookeeper nodes or worker nodes of the source cluster.
   
   ```bash
   hdfs dfs -mkdir /hbase-wal-backup**
   hdfs dfs -cp hdfs://mycluster/hbasewal /hbase-wal-backup**
   ```
   
1. On the destination cluster, save your changes and restart all required services as indicated by Ambari.
   
1. Point your application to the destination cluster.
   
   > [!NOTE]  
   > The static DNS name for your application changes when you upgrade. Rather than hard-coding this DNS name, you can configure a CNAME in your domain name's DNS settings that points to the cluster's name. Another option is to use a configuration file for your application that you can update without redeploying.
   
1. Start the ingestion to see if everything is functioning as expected.
   
1. If the destination cluster is satisfactory, delete the source cluster.

## Next steps

To learn more about [Apache HBase](https://hbase.apache.org/) and upgrading HDInsight clusters, see the following articles:

- [Upgrade an HDInsight cluster to a newer version](../hdinsight-upgrade-cluster.md)
- [Monitor and manage Azure HDInsight using the Apache Ambari Web UI](../hdinsight-hadoop-manage-ambari.md)
- [Azure HDInsight versions](../hdinsight-component-versioning.md)
- [Optimize Apache HBase](../optimize-hbase-ambari.md)
