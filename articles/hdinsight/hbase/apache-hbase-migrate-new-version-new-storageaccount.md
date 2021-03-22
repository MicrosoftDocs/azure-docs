---
title: Migrate an HBase cluster to a new version - Azure HDInsight 
description: How to migrate Apache HBase clusters to a newer version in Azure HDInsight and to a new storage account.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 01/02/2020
---
# NOTE

This document is applicable if you require to use a different storage account for your destination cluster. If you don't need to use a different storage account, please refer to this document instead: [Migrate an Apache HBase cluster to a new version with same storage account](../apache-hbase-migrate-new-version.md)

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

1. [Set up a new destination HDInsight cluster](../hdinsight-hadoop-provision-linux-clusters.md) using a new storage account

1. Sign in to [Apache Ambari](https://ambari.apache.org/) on the destination cluster (`https://NEWCLUSTERNAME.azurehdinsight.net`) and stop the HBase services. For more information on connecting to and using Ambari, see [Manage HDInsight clusters by using the Ambari Web UI](../hdinsight-hadoop-manage-ambari.md).

1. Clean the zookeeper data, file system and WAL on the destination cluster by issuing the following commands in any of the zookeeper nodes or worker nodes:

   ```bash
   hbase zkcli
   rmr /hbase-unsecure
   quit
   ```

   ```bash   
   hdfs dfs -rm -r /hbase
   hdfs dfs -rm -r hdfs://mycluster/hbasewal**
   ```
1. Cleanup the WAL on the destination cluster by issuing the following commands in any of the zookeeper nodes or worker nodes:

   CASE 1: If destination cluster is with Enhanced Writes feature:
   ```bash   
   hdfs dfs -rm -r hdfs://mycluster/hbasewal**
   ```
   CASE 2: If destination cluster is HDI 4.0 and not with Enhanced Writes feature:   
   ```bash   
   hdfs dfs -rm -r /hbase-wals
   ``` 
   
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

1. Copy the hbase folder from the source cluster's storage account to the destination cluster's storage account use AzCopy.

CASE 1 - MIGRATING FROM ANOTHER HDINSIGHT CLUSTER:

Sample AzCopy command:
azcopy copy 'https://&lt;source-account&gt;.blob.core.windows.net/&lt;source-storage-container&gt;/hbase' 'https://&lt;destination-account&gt;.blob.core.windows.net/&lt;destination-storage-container&gt;' --recursive

CASE 2 - MIGRATING FROM ONPREMISE OR OTHER CLOUDS:

If your source cluster is in on-premise or in other clouds, you could still a similar azcopy command after stopping HBase services on source cluster.

azcopy copy '&lt;local-folder-path&gt;' 'https://&lt;destination-account&gt;.&lt;blob or dfs&gt;.core.windows.net/&lt;destination-storage-container&gt;' --recursive=true

<local-folder-path> is the rootdirectory of your hbase source cluster. This can be found from property "hbase.rootdir" in the hbase-site.xml file. If this field is not configured in your source cluster, the default would be /hbase.

Please refer to this document for more information on how to use azcopy: https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-migrate-on-premises-data

1. <TODO Backup and Restore> If your source HBase cluster does not have Enhanced Writes feature, skip this step. 

   Backup the WAL dir under HDFS by running below commands from an ssh session on any of the zookeeper nodes or worker nodes of the source cluster.
   
   ```bash
   hdfs dfs -mkdir /hbase-wal-backup**
   hdfs dfs -cp hdfs://mycluster/hbasewal /hbase-wal-backup**
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
