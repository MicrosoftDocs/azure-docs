---
title: Use Azure Virtual Networks with Azure HDInsight
description: This article describes how to use Use Azure Virtual Networks with Azure HDInsight.
services: hdinsight
ms.service: hdinsight
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.topic: conceptual
ms.date: 09/24/2018
---
# Use Azure Virtual Networks with Azure HDInsight

This article covers the following topics:

* An overview of what Azure Virtual Networks are 
* the scenarios where you may want to use them with Azure HDInsight
* basic background information about the VNET architecture in HDInsight

## What is an Azure Virtual Network?

An Azure virtual network enables many types of Azure resources, to securely communicate with each other, the internet, and on-premises networks. A single virtual network is limited to a single region. Virtual networks from different regions can be connected together using Virtual Network Peering.

## VNET Scenarios in Azure HDInsight?

You can use an Azure virtual network with HDInsight if you want do any of the following tasks:

* Connecting to HDInsight directly from an on-premises network.
* Connecting HDInsight to data stores in another Azure virtual network.
* Directly accessing Apache Hadoop services that are not available publicly over the internet. For example, Apache Kafka APIs or the Apache HBase Java API.

## HDInsight network architecture

When you deploy an HDInsight cluster into an Azure virtual network, it is important for you to understand the various components that are available at the network level and which may be related to your scenario.

### HDInsight Node types

Each cluster type may contain different types of nodes that have a specific purpose in the cluster. The following table summarizes these node types.

| Type | Description | 
| --- | --- |
| Head node |  For the Hadoop, Interactive Hive, Kafka, Spark, HBase and R Server cluster types, the head nodes hosts the processes that manage execution of the distributed application. In addition, for the Hadoop, Interactive Hive, Kafka, Spark, and HBase cluster types the head node represents the node you can SSH into and execute applications that are then coordinated to run across the cluster resources. The number of head nodes is fixed at two for all cluster types. |
| Nimbus node | For the Storm cluster type, the Nimbus node provides functionality similar to the Head node. The Nimbus node assigns tasks to other nodes in a cluster through Zookeeper- it coordinates the running of Storm topologies. |
| ZooKeeper node | Represents the nodes hosting the ZooKeeper process and data, which is used to coordinate tasks between the nodes performing the processing, leader election of the head node, and for keeping track of on which head node a master service is active on. The number of ZooKeeper nodes is fixed at two for all cluster types having ZooKeeper nodes. |
| R Server Edge node | The R Server Edge node represents the node you can SSH into and execute applications that are then coordinated to run across the cluster resources. An edge node itself does not actively participate in data analysis within the cluster. In addition, this node hosts R Studio Server, enabling you to run R application using a browser. |
| Worker node | Represents the nodes that support data processing functionality. Worker nodes can be added or removed from the cluster to increase or decrease computing capability and to manage costs. |
| Region node | For the HBase cluster type, the region node (also referred to as a Data Node) runs the Region Server that is responsible for serving and managing a portion of the data managed by HBase. Region nodes can be added or removed from the cluster to increase or decrease computing capability and to manage costs.|
| Supervisor node | For the Storm cluster type, the supervisor node executes the instructions provided by the Nimbus node to peforming the desired processing. |


### Nodes in an HDInsight cluster

Each cluster type has its own number of nodes, terminology for nodes, and default VM size. In the following table, the number of nodes for each node type is in parentheses. The scale-out capabilities (e.g., adding VM nodes to increase processing capabilities) for each cluster type are indicated in the node count as (1+) and in the diagram as Worker 1...Worker N. 

| Type | Nodes | Diagram |
| --- | --- | --- |
| Hadoop |Head nodes (2), Worker nodes (1+) |![HDInsight Hadoop cluster nodes](./media/hdinsight-architecture/hdinsight-hadoop-cluster-type-nodes.png) |
| Interactive Hive |Head nodes (2), ZooKeeper nodes (3), Worker nodes (1+) |![HDInsight Interactive Hive cluster nodes](./media/hdinsight-architecture/hdinsight-interactive-hive-cluster-type-setup.png) |
| Kafka |Head nodes (2), ZooKeeper nodes (3), Worker nodes (1+) |![HDInsight Microsoft R Server cluster nodes](./media/hdinsight-architecture/hdinsight-kafka-cluster-type-setup.png) |
| Spark |Head nodes (2), Worker nodes (1+) |![HDInsight Spark cluster nodes](./media/hdinsight-architecture/hdinsight-spark-cluster-type-setup.png) |
| Storm |Nimbus node (2), ZooKeeper nodes (3), Supervisor nodes (1+) |![HDInsight Storm cluster nodes](./media/hdinsight-architecture/hdinsight-storm-cluster-type-setup.png) |
| HBase |Head server (2), ZooKeeper node (3), Region server (1+) |![HDInsight HBase cluster nodes](./media/hdinsight-architecture/hdinsight-hbase-cluster-type-setup.png) |
| Microsoft R Server |Head nodes (2), ZooKeeper nodes (3), R Server Edge node (1), Worker nodes (1+) |![HDInsight Microsoft R Server cluster nodes](./media/hdinsight-architecture/hdinsight-rserver-cluster-type-setup.png) |