---
title: Migrate an HBase cluster to a new version - Azure HDInsight 
description: How to migrate Apache HBase clusters to a newer version in Azure HDInsight.
author: ashishthaps
ms.author: ashishth
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 01/02/2020
---

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

1. Flush your source HBase cluster, which is the cluster you're upgrading. HBase writes incoming data to an in-memory store, called a _memstore_. After the memstore reaches a certain size, HBase flushes it to disk for long-term storage in the cluster's storage account. When deleting the old cluster, the memstores are recycled, potentially losing data. To manually flush the memstore for each table to disk, run the following script. The latest version of this script is on Azure's [GitHub](https://raw.githubusercontent.com/Azure/hbase-utils/master/scripts/flush_all_tables.sh).

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

1. Stop ingestion to the old HBase cluster.

1. To ensure that any recent data in the memstore is flushed, run the previous script again.

1. Sign in to [Apache Ambari](https://ambari.apache.org/) on the old cluster (`https://OLDCLUSTERNAME.azurehdidnsight.net`) and stop the HBase services. When you prompted to confirm that you'd like to stop the services, check the box to turn on maintenance mode for HBase. For more information on connecting to and using Ambari, see [Manage HDInsight clusters by using the Ambari Web UI](../hdinsight-hadoop-manage-ambari.md).

	![In Ambari, click Services > HBase > Stop under Service Actions](./media/apache-hbase-migrate-new-version/stop-hbase-services1.png)

	![Check the Turn On Maintenance Mode for HBase checkbox, then confirm](./media/apache-hbase-migrate-new-version/turn-on-maintenance-mode.png)

1. Sign in to Ambari on the new HDInsight cluster. Change the `fs.defaultFS` HDFS setting to point to the container name used by the original cluster. This setting is under **HDFS > Configs > Advanced > Advanced core-site**.

	![In Ambari, click Services > HDFS > Configs > Advanced](./media/apache-hbase-migrate-new-version/hdfs-advanced-settings.png)

	![In Ambari, change the container name](./media/apache-hbase-migrate-new-version/change-container-name.png)

1. If you aren't using HBase clusters with the Enhanced Writes feature, skip this step. It's needed only for HBase clusters with Enhanced Writes feature.

   Change the `hbase.rootdir` path to point to the container of the original cluster.

	![In Ambari, change the container name for HBase rootdir](./media/apache-hbase-migrate-new-version/change-container-name-for-hbase-rootdir.png)

1. If you're upgrading HDInsight 3.6 to 4.0, follow the steps below, otherwise skip to step 10:
    1. Restart all required services in Ambari by selecting	**Services** > **Restart All Required**.
    1. Stop the HBase service.
    1. SSH to the Zookeeper node, and execute the [zkCli](https://github.com/go-zkcli/zkcli) command `rmr /hbase-unsecure` to remove the HBase root znode from Zookeeper.
    1. Restart HBase.

1. If you're upgrading to any other HDInsight version besides 4.0, follow these steps:
    1. Save your changes.
    1. Restart all required services as indicated by Ambari.

1. Point your application to the new cluster.

    > [!NOTE]  
    > The static DNS for your application changes when upgrading. Rather than hard-coding this DNS, you can configure a CNAME in your domain name's DNS settings that points to the cluster's name. Another option is to use a configuration file for your application that you can update without redeploying.

1. Start the ingestion to see if everything is functioning as expected.

1. If the new cluster is satisfactory, delete the original cluster.

## Next steps

To learn more about [Apache HBase](https://hbase.apache.org/) and upgrading HDInsight clusters, see the following articles:

* [Upgrade an HDInsight cluster to a newer version](../hdinsight-upgrade-cluster.md)
* [Monitor and manage Azure HDInsight using the Apache Ambari Web UI](../hdinsight-hadoop-manage-ambari.md)
* [Apache Hadoop components and versions](../hdinsight-component-versioning.md)
* [Optimize Apache HBase](../optimize-hbase-ambari.md)
