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

The goal of this article is to clarify the entities that are present when you deploy an HDInsight cluster into an Azure Virtual Network (VNet).

## Resource types in Azure HDInsight clusters

Azure HDInsight clusters are a group of virtual machines, or nodes, that each play a different role in the operation of the system. The following table summarizes these node types and their roles in the cluster.

| Type | Description | 
| --- | --- |
| Head node |  For the Hadoop, Interactive Hive, Kafka, Spark, HBase and R Server cluster types, the head nodes hosts the processes that manage execution of the distributed application. In addition, for the Hadoop, Interactive Hive, Kafka, Spark, and HBase cluster types the head node represents the node you can SSH into and execute applications that are then coordinated to run across the cluster resources. The number of head nodes is fixed at two for all cluster types. |
| Nimbus node | For the Storm cluster type, the Nimbus node provides functionality similar to the Head node. The Nimbus node assigns tasks to other nodes in a cluster through Zookeeper- it coordinates the running of Storm topologies. |
| ZooKeeper node | Represents the nodes hosting the ZooKeeper process and data, which is used to coordinate tasks between the nodes performing the processing, leader election of the head node, and for keeping track of on which head node a master service is active on. The number of ZooKeeper nodes is fixed at two for all cluster types having ZooKeeper nodes. |
| R Server Edge node | The R Server Edge node represents the node you can SSH into and execute applications that are then coordinated to run across the cluster resources. An edge node itself does not actively participate in data analysis within the cluster. In addition, this node hosts R Studio Server, enabling you to run R application using a browser. |
| Worker node | Represents the nodes that support data processing functionality. Worker nodes can be added or removed from the cluster to increase or decrease computing capability and to manage costs. |
| Region node | For the HBase cluster type, the region node (also referred to as a Data Node) runs the Region Server that is responsible for serving and managing a portion of the data managed by HBase. Region nodes can be added or removed from the cluster to increase or decrease computing capability and to manage costs.|
| Supervisor node | For the Storm cluster type, the supervisor node executes the instructions provided by the Nimbus node to performing the desired processing. |

![Diagram of HDInsight entities created in Azure custom VNET](./media/hdinsight-vnet-architecture/vnet-diagram.png)

## Basic VNet resources

The default resources present when HDInsight is deployed into a VNet include the cluster node types mentioned in the previous section, but also include network devices that support communication between the VNet and outside networks.

The cluster node types are summarized in the following table.

| Resource type | Number present | Details |
| --- | --- | --- |
|Head node | 2 |    |
|Zookeeper node | 3 |
|Worker node | 2 | A minimum of 3 worker nodes in needed for Apache Kafka  |
|Gateway node | 2 | Gateway nodes are Azure virtual machines that are created on Azure but are not visible in your subscription. Please contact support if you need to reboot these nodes. |

The network resources present in the VNet are summarized in the following table.

| Networking resource | Number present | Details |
| --- | --- | --- |
|Load balancer | 3 | |
|Network Interfaces | 9 |    |
|Public IP Addresses | 2 |    |

The three load balancers have the following responsibilities:

1. One is assigned to the Gateway with the endpoint `CLUSTERNAME.azurehdinsight.net`
1. Another load balancer is assigned to the SSH endpoint of the cluster `CLUSTERNAME-ssh.azurehdinsight.net`
1. The third load balancer is only created when HDInsight is deployed into a custom VNet. It is assigned to the endpoint `CLUSTERNAME-int.azurehdinsight.net`

The public IP addresses are allocated as follows:

1. One public IP is assigned to the Load balancer for the fully qualified domain name (FQDN) to use when connecting to the cluster from the internet `CLUSTERNAME.azurehdinsight.net`
1. The second public IP address is used for the SSH only domain name `CLUSTERNAME-ssh.azurehdinsight.net`.
