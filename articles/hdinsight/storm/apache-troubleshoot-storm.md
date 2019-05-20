---
title: Troubleshoot Storm by using Azure HDInsight
description: Get answers to common questions about using Apache Storm with Azure HDInsight.
keywords: Azure HDInsight, Storm, FAQ, troubleshooting guide, common problems
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.topic: conceptual
ms.date: 12/06/2018
ms.custom: seodec18
---
# Troubleshoot Apache Storm by using Azure HDInsight

Learn about the top issues and their resolutions for working with [Apache Storm](https://storm.apache.org/) payloads in [Apache Ambari](https://ambari.apache.org/).

## How do I access the Storm UI on a cluster?
You have two options for accessing the Storm UI from a browser:

### Ambari UI
1. Go to the Ambari dashboard.
2. In the list of services, select **Storm**.
3. In the **Quick Links** menu, select **Storm UI**.

### Direct link
You can access the Storm UI at the following URL:

https://\<cluster DNS name\>/stormui

Example:

 https://stormcluster.azurehdinsight.net/stormui

## How do I transfer Storm event hub spout checkpoint information from one topology to another?

When you develop topologies that read from Azure Event Hubs by using the HDInsight Storm event hub spout .jar file, you must deploy a topology that has the same name on a new cluster. However,
you must retain the checkpoint data that was committed to [Apache ZooKeeper](https://zookeeper.apache.org/) on the old cluster.

### Where checkpoint data is stored
Checkpoint data for offsets is stored by the event hub spout in ZooKeeper in two root paths:
- Nontransactional spout checkpoints are stored in /eventhubspout.
- Transactional spout checkpoint data is stored in /transactional.

### How to restore
To get the scripts and libraries that you use to export data out of ZooKeeper and then import the data back to ZooKeeper with a new name, see [HDInsight Storm examples](https://github.com/hdinsight/hdinsight-storm-examples/tree/master/tools/zkdatatool-1.0).

The lib folder has .jar files that contain the implementation for the export/import operation. The bash folder has an example script that demonstrates how to export data from the ZooKeeper server on the old cluster, and then import it back to the ZooKeeper server on the new cluster.

Run the [stormmeta.sh](https://github.com/hdinsight/hdinsight-storm-examples/blob/master/tools/zkdatatool-1.0/bash/stormmeta.sh) script from the ZooKeeper nodes to export and then import data. Update the script to the correct Hortonworks Data Platform (HDP) version. (We are working on making these scripts generic in HDInsight. Generic scripts can run from any node on the cluster without modifications by the user.)

The export command writes the metadata to an Apache Hadoop Distributed File System (HDFS) path (in Azure Blob Storage or Azure Data Lake Storage) at a location that you set.

### Examples

#### Export offset metadata
1. Use SSH to go to the ZooKeeper cluster on the cluster from which the checkpoint offset needs to be exported.
2. Run the following command (after you update the HDP version string) to export ZooKeeper offset data to the /stormmetadta/zkdata HDFS path:

    ```apache   
    java -cp ./*:/etc/hadoop/conf/*:/usr/hdp/2.5.1.0-56/hadoop/*:/usr/hdp/2.5.1.0-56/hadoop/lib/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/lib/*:/etc/failover-controller/conf/*:/etc/hadoop/* com.microsoft.storm.zkdatatool.ZkdataImporter export /eventhubspout /stormmetadata/zkdata
    ```

#### Import offset metadata
1. Use SSH to go to the ZooKeeper cluster on the cluster from which the checkpoint offset needs to be imported.
2. Run the following command (after you update the HDP version string) to import ZooKeeper offset data from the HDFS path /stormmetadata/zkdata to the ZooKeeper server on the target cluster:

    ```apache
    java -cp ./*:/etc/hadoop/conf/*:/usr/hdp/2.5.1.0-56/hadoop/*:/usr/hdp/2.5.1.0-56/hadoop/lib/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/lib/*:/etc/failover-controller/conf/*:/etc/hadoop/* com.microsoft.storm.zkdatatool.ZkdataImporter import /eventhubspout /home/sshadmin/zkdata
    ```
   
#### Delete offset metadata so that topologies can start processing data from the beginning, or from a timestamp that the user chooses
1. Use SSH to go to the ZooKeeper cluster on the cluster from which the checkpoint offset needs to be deleted.
2. Run the following command (after you update the HDP version string) to delete all ZooKeeper offset data in the current cluster:

    ```apache
    java -cp ./*:/etc/hadoop/conf/*:/usr/hdp/2.5.1.0-56/hadoop/*:/usr/hdp/2.5.1.0-56/hadoop/lib/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/lib/*:/etc/failover-controller/conf/*:/etc/hadoop/* com.microsoft.storm.zkdatatool.ZkdataImporter delete /eventhubspout
    ```

## How do I locate Storm binaries on a cluster?
Storm binaries for the current HDP stack are in /usr/hdp/current/storm-client. The location is the same both for head nodes and for worker nodes.
 
There might be multiple binaries for specific HDP versions in /usr/hdp (for example, /usr/hdp/2.5.0.1233/storm). The /usr/hdp/current/storm-client folder is symlinked to the latest version that is running on the cluster.

For more information, see [Connect to an HDInsight cluster by using SSH](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix) and 
[Apache Storm](https://storm.apache.org/).
 
## How do I determine the deployment topology of a Storm cluster?
First, identify all components that are installed with HDInsight Storm. A Storm cluster consists of four node categories:

* Gateway nodes
* Head nodes
* ZooKeeper nodes
* Worker nodes
 
### Gateway nodes
A gateway node is a gateway and reverse proxy service that enables public access to an active Ambari management service. It also handles Ambari leader election.
 
### Head nodes
Storm head nodes run the following services:
* Nimbus
* Ambari server
* Ambari Metrics server
* Ambari Metrics Collector
 
### ZooKeeper nodes
HDInsight comes with a three-node ZooKeeper quorum. The quorum size is fixed, and cannot be reconfigured.
 
Storm services in the cluster are configured to automatically use the ZooKeeper quorum.
 
### Worker nodes
Storm worker nodes run the following services:
* Supervisor
* Worker Java virtual machines (JVMs), for running topologies
* Ambari agent
 
## How do I locate Storm event hub spout binaries for development?
 
For more information about using Storm event hub spout .jar files with your topology, see the following resources.
 
### Java-based topology
[Process events from Azure Event Hubs with Apache Storm on HDInsight (Java)](https://docs.microsoft.com/azure/hdinsight/hdinsight-storm-develop-java-event-hub-topology)
 
### C#-based topology (Mono on HDInsight 3.4+ Linux Storm clusters)
[Process events from Azure Event Hubs with Apache Storm on HDInsight (C#)](https://docs.microsoft.com/azure/hdinsight/hdinsight-storm-develop-csharp-event-hub-topology)
 
### Latest Apache Storm event hub spout binaries for HDInsight 3.5+ Linux Storm clusters
To learn how to use the latest Storm event hub spout that works with HDInsight 3.5+ Linux Storm clusters, see the mvn-repo [readme file](https://github.com/hdinsight/mvn-repo/blob/master/README.md).
 
### Source code examples
See [examples](https://github.com/Azure-Samples/hdinsight-java-storm-eventhub) of how to read and write from Azure Event Hub using an Apache Storm topology (written in Java) on an Azure HDInsight cluster.
 
## How do I locate Storm Log4J 2 configuration files on clusters?
 
To identify [Apache Log4j 2](https://logging.apache.org/log4j/2.x/) configuration files for Storm services.
 
### On head nodes
The Nimbus Log4J configuration is read from /usr/hdp/\<HDP version\>/storm/log4j2/cluster.xml.
 
### On worker nodes
The supervisor Log4J configuration is read from /usr/hdp/\<HDP version\>/storm/log4j2/cluster.xml.
 
The worker Log4J configuration file is read from /usr/hdp/\<HDP version\>/storm/log4j2/worker.xml.
 
Examples:
/usr/hdp/2.6.0.2-76/storm/log4j2/cluster.xml
/usr/hdp/2.6.0.2-76/storm/log4j2/worker.xml

### See Also
[Troubleshoot by Using Azure HDInsight](../../hdinsight/hdinsight-troubleshoot-guide.md)
