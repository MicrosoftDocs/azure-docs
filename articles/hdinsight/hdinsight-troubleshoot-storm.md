---
title: Answers to common questions on Storm on HDInsight | Microsoft Docs
description: Use the Storm FAQ for answers to common questions on Storm on Azure HDInsight platform.
keywords: Azure HDInsight, Storm, FAQ, troubleshooting guide, common problems
services: Azure HDInsight
documentationcenter: na
author: raviperi
manager: ''
editor: ''

ms.assetid: 74E51183-3EF4-4C67-AA60-6E12FAC999B5
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 6/8/2017
ms.author: raviperi
---

## How do I access Storm UI on HDInsight cluster?

### Issue:
There are two ways to access Storm UI from a browser:

#### Ambari UI
1) Navigate to Ambari Dashboard
2) Select Storm from List of services in the left
3) Select Storm UI option from Quick Links drop-down menu

#### Direct Link
Storm UI is accessible from URL:

https://\<ClusterDnsName\>/stormui

example: https://stormcluster.azurehdinsight.net/stormui

## How can I transfer Storm eventhub spout checkpoint information from one topology to another?

### Issue:
When developing topologies that read from event hubs using HDInsight's Storm eventhub spout jar, 
how can one deploy a topology with the same name on a new cluster,
but retain the checkpoint data committed to zookeeeper in the old cluster?

#### Where is checkpoint data stored
Checkpoint data for offsets is stored by EventHub spout into Zookeeper under two root paths:
- Non transactional spout checkpoints are stored under: /eventhubspout
- Transaction spout checkpoint data is stored under: /transactional

#### How to Restore
The scripts and libraries to export data out of zookeeper and import it back under a new name can be found at:
https://github.com/hdinsight/hdinsight-storm-examples/tree/master/tools/zkdatatool-1.0

The lib folder has Jar files that contain the implementation for the import/export operation.
The bash folder has an example script on how to export data from Zookeeper server on old cluster, and import it back into zookeeper server on new cluster.

The [stormmeta.sh](https://github.com/hdinsight/hdinsight-storm-examples/blob/master/tools/zkdatatool-1.0/bash/stormmeta.sh) script needs to be run from the Zookeeper nodes to import/export data.
The script needs to be updated to correct the HDP version string in it.
(HDInsight is working on making these scripts generic, so they can run from any node in the cluster without need for modifications by end user).

The export command will write the metadata to a HDFS Path (BLOB or ADLS store) at the specified location.

### Examples

##### Export Offset metadata:
1. SSH into the zookeeper cluster on old cluster from which checkpoint offset needs to be exported.
1. Run below command (after updating the hdp version string) to export zookeeper offset data into /stormmetadta/zkdata HDFS Path.

```apache   
   java -cp ./*:/etc/hadoop/conf/*:/usr/hdp/2.5.1.0-56/hadoop/*:/usr/hdp/2.5.1.0-56/hadoop/lib/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/lib/*:/etc/failover-controller/conf/*:/etc/hadoop/* com.microsoft.storm.zkdatatool.ZkdataImporter export /eventhubspout /stormmetadata/zkdata
```

##### Import Offset metadata
1. SSH into the zookeeper cluster on old cluster from which checkpoint offset needs to be exported.
1. Run below command (after updating the hdp version string) to import zookeeper offset data from HDFS path /stormmetadata/zkdata into Zookeeper server on target cluster).

```apache
   java -cp ./*:/etc/hadoop/conf/*:/usr/hdp/2.5.1.0-56/hadoop/*:/usr/hdp/2.5.1.0-56/hadoop/lib/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/lib/*:/etc/failover-controller/conf/*:/etc/hadoop/* com.microsoft.storm.zkdatatool.ZkdataImporter import /eventhubspout /home/sshadmin/zkdata
```
   
##### Delete Offset metadata so topologies can start processing data from (either beginning or timestamp of user choice)
1. SSH into the zookeeper cluster on old cluster from which checkpoint offset needs to be exported.
2. Run below command (after updating the hdp version string) to delete all zookeeper offset data for current cluster.

```apache
   java -cp ./*:/etc/hadoop/conf/*:/usr/hdp/2.5.1.0-56/hadoop/*:/usr/hdp/2.5.1.0-56/hadoop/lib/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/*:/usr/hdp/2.5.1.0-56/hadoop-hdfs/lib/*:/etc/failover-controller/conf/*:/etc/hadoop/* com.microsoft.storm.zkdatatool.ZkdataImporter delete /eventhubspout
```

## Where are the Storm Binaries on HDInsight cluster?

### Issue:
 Know location of binaries for Storm services on HDInsight cluster

### Resolution Steps:

Storm binaries for current HDP Stack can be found at:
 /usr/hdp/current/storm-client

This location is the same for Headnodes as well as worker nodes.
 
There may be multiple HDP version specific binaries located under /usr/hdp
(example: /usr/hdp/2.5.0.1233/storm)

But the /usr/hdp/current/storm-client is sym-linked to the latest version that is run on the cluster.

### Further Reading:
 [Connect to HDInsight Cluster using SSH](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix)
 [Storm](http://storm.apache.org/)
 
## What is the deployment topology of HDInsight Storm cluster?
 
### Issue:
 
Identify all components that are installed with HDInsight Storm.
 
Storm cluster comprises of 4 node categories
1. Gateway
1. Head nodes
1. Zookeeper nodes
1. Worker nodes
 
#### Gateway nodes
Is an gateway and reverse proxy service that enables public access to active Ambari management service, handles Ambari Leader election.
 
#### Zookeeper Nodes
HDInsight comes with a 3 node Zookeeper quorum.
The quorum size is fixed, and is not configurable.
 
Storm services in the cluster are configured to use the ZK quorum automatically.
 
#### Head Nodes
Storm head nodes run the following services:
1. Nimbus
1. Ambari server
1. Ambari Metrics Server
1. Ambari Metrics collector
 
#### Worker Nodes
 Storm worker nodes run the following services:
1. Supervisor
1. Worker JVMs for running topologies
1. Ambari Agent
 
## Where can I find Storm-EventHub-Spout binaries for development?
 
### Issue:
How can I find out more about using Storm eventhub spout jars for use with my topology.
 
#### MSDN articles on how-to
 
##### Java based topology
https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-storm-develop-java-event-hub-topology
 
##### C# based topology (using Mono on HDI 3.4+ Linux Storm clusters)
https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-storm-develop-csharp-event-hub-topology
 
##### Latest Storm EventHub spout binaries for HDI3.5+ Linux Storm clusters
Review https://github.com/hdinsight/mvn-repo/blob/master/README.md for how to use the latest Storm eventhub spout that works with HDI3.5+ Linux Storm clusters.
 
##### Source Code examples:
https://github.com/Azure-Samples/hdinsight-java-storm-eventhub
 
## Where are Storm Log4J configuration files on HDInsight clusters?
 
### Issue:
 
Identify Log4J configuration files for Storm services.
 
#### On HeadNodes:
Nimbus Log4J configuration is read from:
 /usr/hdp/<HDPVersion>/storm/log4j2/cluster.xml
 
#### Worker Nodes
Supervisor's Log4J configuration is read from:
 /usr/hdp/<HDPVersion>/storm/log4j2/cluster.xml
 
Worker Log4J configuration file is read from:
 /usr/hdp/<HDPVersion>/storm/log4j2/worker.xml
 
Example:
 /usr/hdp/2.6.0.2-76/storm/log4j2/cluster.xml
 /usr/hdp/2.6.0.2-76/storm/log4j2/worker.xml





