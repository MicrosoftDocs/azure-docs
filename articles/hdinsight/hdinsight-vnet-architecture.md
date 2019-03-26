---
title: Azure HDInsight VNET architecture
description: Learn how to create an HDInsight cluster in an Azure Virtual Network, and then connect it to your on-premises network. Learn how to configure name resolution between HDInsight and your on-premises network by using a custom DNS server.
author: hrasheed-msft
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 03/26/2013
ms.author: hrasheed
---
# Azure HDInsight VNET architecture

The goal of this article

![Diagram of HDInsight entities created in Azure custom VNET](./media/hdinsight-vnet-architecture/vnet-diagram.png)

## Node types
Each cluster type may contain different types of nodes that have a specific purpose in the cluster. The following table summarizes these node types.

| Type | Description | 
| --- | --- |
| Head node |  For the Hadoop, Interactive Hive, Kafka, Spark, HBase and R Server cluster types, the head nodes hosts the processes that manage execution of the distributed application. In addition, for the Hadoop, Interactive Hive, Kafka, Spark, and HBase cluster types the head node represents the node you can SSH into and execute applications that are then coordinated to run across the cluster resources. The number of head nodes is fixed at two for all cluster types. |
| Nimbus node | For the Storm cluster type, the Nimbus node provides functionality similar to the Head node. The Nimbus node assigns tasks to other nodes in a cluster through Zookeeper- it coordinates the running of Storm topologies. |
| ZooKeeper node | Represents the nodes hosting the ZooKeeper process and data, which is used to coordinate tasks between the nodes performing the processing, leader election of the head node, and for keeping track of on which head node a master service is active on. The number of ZooKeeper nodes is fixed at two for all cluster types having ZooKeeper nodes. |
| R Server Edge node | The R Server Edge node represents the node you can SSH into and execute applications that are then coordinated to run across the cluster resources. An edge node itself does not actively participate in data analysis within the cluster. In addition, this node hosts R Studio Server, enabling you to run R application using a browser. |
| Worker node | Represents the nodes that support data processing functionality. Worker nodes can be added or removed from the cluster to increase or decrease computing capability and to manage costs. |
| Region node | For the HBase cluster type, the region node (also referred to as a Data Node) runs the Region Server that is responsible for serving and managing a portion of the data managed by HBase. Region nodes can be added or removed from the cluster to increase or decrease computing capability and to manage costs.|
| Supervisor node | For the Storm cluster type, the supervisor node executes the instructions provided by the Nimbus node to performing the desired processing. |