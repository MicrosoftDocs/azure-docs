---
title: Migrate an HBase cluster to a new version - Azure HDInsight 
description: How to migrate Apache HBase clusters to a newer version in Azure HDInsight.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 01/02/2020
---
# NOTE

This document is applicable if you do not require to use a different storage account for your destination cluster. If you need to use a different storage account, please refer to this document instead: [Migrate an Apache HBase cluster to a new version and new storage account](../apache-hbase-migrate-new-version-new-storageaccount.md)

# Migrate an Apache HBase cluster to a new version

This article discusses the steps required to update your Apache HBase cluster on Azure HDInsight to a newer version.

The downtime while upgrading should be minimal, on the order of minutes. This downtime is caused by the steps to flush all in-memory data, then the time to configure and restart the services on the new cluster. Your results will vary, depending on the number of nodes, amount of data, and other variables.

## Review Apache HBase compatibility

Before upgrading Apache HBase, ensure the HBase versions on the source and destination clusters are compatible. For more information, see [Apache Hadoop components and versions available with HDInsight](../hdinsight-component-versioning.md).

> [!NOTE]  
> We highly recommend that you review the version compatibility matrix in the [HBase book](https://hbase.apache.org/book.html#upgrading). Any breaking incompatibilities should be described in the HBase version release notes.

Here is an example version compatibility matrix. Y indicates compatibility and N indicates a potential incompatibility:

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

## Upgrade with same Apache HBase major version

To upgrade your Apache HBase cluster on Azure HDInsight, complete the following steps:

1. Make sure that your application is compatible with the new version, as shown in the HBase compatibility matrix and release notes. Test your application in a cluster running the target version of HDInsight and HBase.

1. [Set up a new destination HDInsight cluster](../hdinsight-hadoop-provision-linux-clusters.md) using the same storage account, but with a different container name:

   ![Use the same Storage account, but create a different Container](./media/apache-hbase-migrate-new-version/same-storage-different-container.png)

1. Flush your source HBase cluster, which is the cluster you're upgrading. HBase writes incoming data to an in-memory store, called a _memstore_. After the memstore reaches a certain size, HBase flushes it to disk for long-term storage in the cluster's storage account. When deleting the source cluster, the memstores are recycled, potentially losing data. To manually flush the memstore for each table to disk, run the following script. The latest version of this script is on Azure's [GitHub](https://raw.githubusercontent.com/Azure/hbase-utils/master/scripts/flush_all_tables.sh).

    ```bash
    #!/bin/bash
    
    #-------------------------------------------------------------------------------#
    # SCRIPT TO FLUSH ALL HBASE TABLES.
    #-------------------------------------------------------------------------------#
    
    LIST_OF_TABLES=/tmp/tables.txt
    HBASE_SCRIPT=/tmp/hbase_script.txt
    TARGET_HOST=$1
    
    usage ()
    {
    	if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]
    	then
    		cat << ...
    
    Usage: 
    
    $0 [hostname]
    
    Providing hostname is optional and not required when the script is executed within HDInsight cluster with access to 'hbase shell'.
    
    However hostname should be provided when executing the script as a script-action from HDInsight portal.
    
    For Example:
    
    	1.	Executing script inside HDInsight cluster (where 'hbase shell' is 
    		accessible):
    
    		$0 
    
    		[No need to provide hostname]
    
    	2.	Executing script from HDinsight Azure portal:
    
    		Provide Script URL.
    
    		Provide hostname as a parameter (i.e. hn0, hn1, hn2.. or wn2 etc.).
    ...
    		exit
    	fi
    }
    
    validate_machine ()
    {
    	THIS_HOST=`hostname`
    
    	if [[ ! -z "$TARGET_HOST" ]] && [[ $THIS_HOST  != $TARGET_HOST* ]]
    	then
    		echo "[INFO] This machine '$THIS_HOST' is not the right machine ($TARGET_HOST) to execute the script."
    		exit 0
    	fi
    }
    
    get_tables_list ()
    {
    hbase shell << ... > $LIST_OF_TABLES 2> /dev/null
    	list
    	exit
    ...
    }
    
    add_table_for_flush ()
    {
    	TABLE_NAME=$1
    	echo "[INFO] Adding table '$TABLE_NAME' to flush list..."
    	cat << ... >> $HBASE_SCRIPT
    		flush '$TABLE_NAME'
    ...
    }
    
    clean_up ()
    {
    	rm -f $LIST_OF_TABLES
    	rm -f $HBASE_SCRIPT
    }
    
    ########
    # MAIN #
    ########
    
    usage $1
    
    validate_machine
    
    clean_up
    
    get_tables_list
    
    START=false
    
    while read LINE 
    do 
    	if [[ $LINE == TABLE ]] 
    	then
    		START=true
    		continue
    	elif [[ $LINE == *row*in*seconds ]]
    	then
    		break
    	elif [[ $START == true ]]
    	then
    		add_table_for_flush $LINE
    	fi
    
    done < $LIST_OF_TABLES
    
    cat $HBASE_SCRIPT
    
    hbase shell $HBASE_SCRIPT << ... 2> /dev/null
    exit
    ...
    
    ```

1. Stop ingestion to the source HBase cluster.

1. To ensure that any recent data in the memstore is flushed, run the previous script again.

1. Sign in to [Apache Ambari](https://ambari.apache.org/) on the source cluster (`https://OLDCLUSTERNAME.azurehdinsight.net`) and stop the HBase services. When you prompted to confirm that you'd like to stop the services, check the box to turn on maintenance mode for HBase. For more information on connecting to and using Ambari, see [Manage HDInsight clusters by using the Ambari Web UI](../hdinsight-hadoop-manage-ambari.md).

	![In Ambari, click Services > HBase > Stop under Service Actions](./media/apache-hbase-migrate-new-version/stop-hbase-services1.png)

	![Check the Turn On Maintenance Mode for HBase checkbox, then confirm](./media/apache-hbase-migrate-new-version/turn-on-maintenance-mode.png)

1. If you aren't using HBase clusters with the Enhanced Writes feature, skip this step. It's needed only for HBase clusters with Enhanced Writes feature.

   Backup the WAL dir under HDFS by running below commands from an ssh session on any of the zookeeper nodes or worker nodes of the original cluster.
   
   ```bash
   hdfs dfs -mkdir /hbase-wal-backup**
   hdfs dfs -cp hdfs://mycluster/hbasewal /hbase-wal-backup**
   ```
	
1. Sign in to Ambari on the new HDInsight cluster. Change the `fs.defaultFS` HDFS setting to point to the container name used by the original cluster. This setting is under **HDFS > Configs > Advanced > Advanced core-site**.

   ![In Ambari, click Services > HDFS > Configs > Advanced](./media/apache-hbase-migrate-new-version/hdfs-advanced-settings.png)

   ![In Ambari, change the container name](./media/apache-hbase-migrate-new-version/change-container-name.png)

1. If you aren't using HBase clusters with the Enhanced Writes feature, skip this step. It's needed only for HBase clusters with Enhanced Writes feature.

   Change the `hbase.rootdir` path to point to the container of the original cluster.

   ![In Ambari, change the container name for HBase rootdir](./media/apache-hbase-migrate-new-version/change-container-name-for-hbase-rootdir.png)
	
1. If you aren't using HBase clusters with the Enhanced Writes feature, skip this step. It's needed only for HBase clusters with Enhanced Writes feature, and only in cases where your original cluster was an HBase cluster with Enhanced Writes feature .

   Clean the zookeeper and WAL FS data for this new cluster. Issue the following commands in any of the zookeeper nodes or worker nodes:

   ```bash
   hbase zkcli
   rmr /hbase-unsecure
   quit

   hdfs dfs -rm -r hdfs://mycluster/hbasewal**
   ```

1. If you aren't using HBase clusters with the Enhanced Writes feature, skip this step. It's needed only for HBase clusters with Enhanced Writes feature.
   
   Restore the WAL dir to the new cluster's HDFS from an ssh session on  any of the zookeeper nodes or worker nodes of the new cluster.
   
   ```bash
   hdfs dfs -cp /hbase-wal-backup/hbasewal hdfs://mycluster/**
   ```
   
1. If you're upgrading HDInsight 3.6 to 4.0, follow the steps below, otherwise skip to step 13:

    1. Restart all required services in Ambari by selecting	**Services** > **Restart All Required**.
    1. Stop the HBase service.
    1. SSH to the Zookeeper node, and execute the [zkCli](https://github.com/go-zkcli/zkcli) command `rmr /hbase-unsecure` to remove the HBase root znode from Zookeeper.
    1. Restart HBase.

1. If you're upgrading to any other HDInsight version besides 4.0, follow these steps:
    1. Save your changes.
    1. Restart all required services as indicated by Ambari.

1. Point your application to the new cluster.

1. If your source HBase cluster does not have Enhanced Writes feature, skip this step. 

   Backup the WAL dir under HDFS by running below commands from an ssh session on any of the zookeeper nodes or worker nodes of the source cluster.
   
   ```bash
   hdfs dfs -mkdir /hbase-wal-backup**
   hdfs dfs -cp hdfs://mycluster/hbasewal /hbase-wal-backup**
   ```
	
1. Sign in to [Apache Ambari](https://ambari.apache.org/) on the destination cluster (`https://NEWCLUSTERNAME.azurehdinsight.net`) and stop the HBase services. For more information on connecting to and using Ambari, see [Manage HDInsight clusters by using the Ambari Web UI](../hdinsight-hadoop-manage-ambari.md).

	![In Ambari, click Services > HBase > Stop under Service Actions](./media/apache-hbase-migrate-new-version/stop-hbase-services1.png)
	
1. On the Ambari on the destination HDInsight cluster, change the `fs.defaultFS` HDFS setting to point to the container name used by the source cluster. This setting is under **HDFS > Configs > Advanced > Advanced core-site**.

   ![In Ambari, click Services > HDFS > Configs > Advanced](./media/apache-hbase-migrate-new-version/hdfs-advanced-settings.png)

   ![In Ambari, change the container name](./media/apache-hbase-migrate-new-version/change-container-name.png)
	
1. Clean the zookeeper data on the destination cluster by issuing the following commands in any of the zookeeper nodes or worker nodes:

   ```bash
   hbase zkcli
   rmr /hbase-unsecure
   quit
   ```
     
1. If neither the source cluster nor the destination cluster is with the Enhanced Writes feature, skip this step. This is needed only if atleast one of the source or destination  clusters is with Enhanced Writes feature.

		Sample <source-container-fullpath> for storage type WASB is wasb://sourcecontainername@hbaseupgrade.blob.core.windows.net
		Sample <source-container-fullpath> for storage type ADLS Gen2 is abfs://sourcecontainername@hbaseupgrade.dfs.core.windows.net

CASE 1: If source and destination clusters are with Enhanced Writes feature:

Clean WAL FS data for this destination cluster and restore the WAL dir that we backed up from the source cluster in one of the earlier steps to the destination cluster's HDFS. This can be done by issuing the following commands in any of the zookeeper nodes or worker nodes on destination cluster:

   Switch to hbase user context:
   ```bash
   sudo -u hbase
   ```
   Then execute following commands:
   ```bash   
   hdfs dfs -rm -r hdfs://mycluster/hbasewal**
   hdfs dfs -cp <source-container-fullpath>/hbase-wal-backup/hbasewal hdfs://mycluster/**
   ```
   
CASE 2: If only the destination cluster is with Enhanced Writes feature:

Clean WAL FS data for this destination cluster and copy the WAL directory from source cluster into the destination cluster's HDFS. This can be done by issuing the following commands in any of the zookeeper nodes or worker nodes:

   Switch to hbase user context:
   ```bash
   sudo -u hbase
   ```
   Then execute the following commands depending on the source cluster version:
   
   If source cluster is HDI 3.6:
   ```bash   
   hdfs dfs -rm -r hdfs://mycluster/hbasewal**
   hdfs dfs -cp <source-container-fullpath>/hbase/MasterProcWALs hdfs://mycluster/hbasewal
   hdfs dfs -cp <source-container-fullpath>/hbase/WALs hdfs://mycluster/hbasewal
   ```
   If source cluster is HDI 4.0:
   ```bash   
   hdfs dfs -rm -r hdfs://mycluster/hbasewal**
   hdfs dfs -cp <source-container-fullpath>/hbase-wals/MasterProcWALs hdfs://mycluster/hbasewal
   hdfs dfs -cp <source-container-fullpath>/hbase-wals/WALs hdfs://mycluster/hbasewal
   ```
   
CASE 3: If only the source cluster is with Enhanced Writes feature:
	On the destination cluster, restore the WAL dir that we backed up from the source cluster in one of the earlier steps. This can be done by issuing the following commands in any of the zookeeper nodes or worker nodes:

   If destination cluster is HDI 3.6:
   ```bash   
   hdfs dfs -cp <source-container-fullpath>/hbase-wal-backup/hbasewal/MasterProcWALs <source-container-fullpath>/hbase
   hdfs dfs -cp <source-container-fullpath>/hbase-wal-backup/hbasewal/WALs <source-container-fullpath>/hbase
   ```
   If destination cluster is HDI 4.0:
   ```bash   
   hdfs dfs -cp <source-container-fullpath>/hbase-wal-backup/hbasewal/MasterProcWALs <source-container-fullpath>/hbase-wals
   hdfs dfs -cp <source-container-fullpath>/hbase-wal-backup/hbasewal/WALs <source-container-fullpath>/hbase-wals
   ```

1. In the destination cluster, using the hdfs user context, copy the folder /hdp/apps/<new-version-name> and its contents from <destination-container-fullpath> to the /hdp/apps under <source-container-fullpath>. This can be achieved by running the below command on the destination cluster:
   
   Then execute the following commands depending on the destination cluster version:
   
   ```bash   
   sudo -u hdfs hdfs dfs -cp /hdp/apps/<new-version-name> <source-container-fullpath>/hdp/apps   
   
   For example:
   sudo -u hdfs hdfs dfs -cp /hdp/apps/4.1.3.6 <source-container-fullpath>/hdp/apps
    ```	
   
1. On the destination cluster, save your changes and restart all required services as indicated by Ambari.

1. Point your application to the destination cluster.

    > [!NOTE]  
    > The static DNS for your application changes when upgrading. Rather than hard-coding this DNS, you can configure a CNAME in your domain name's DNS settings that points to the cluster's name. Another option is to use a configuration file for your application that you can update without redeploying.

1. Start the ingestion to see if everything is functioning as expected.

1. If the destination cluster is satisfactory, delete the source cluster.
    
## Next steps

To learn more about [Apache HBase](https://hbase.apache.org/) and upgrading HDInsight clusters, see the following articles:

* [Upgrade an HDInsight cluster to a newer version](../hdinsight-upgrade-cluster.md)
* [Monitor and manage Azure HDInsight using the Apache Ambari Web UI](../hdinsight-hadoop-manage-ambari.md)
* [Apache Hadoop components and versions](../hdinsight-component-versioning.md)
* [Optimize Apache HBase](../optimize-hbase-ambari.md)
