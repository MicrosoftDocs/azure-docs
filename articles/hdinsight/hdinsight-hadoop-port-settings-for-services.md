<properties
pageTitle="Ports used by HDInsight | Azure"
description="A list of ports used by Hadoop services running on HDInsight."
services="hdinsight"
documentationCenter=""
authors="Blackmist"
manager="paulettm"
editor="cgronlun"/>

<tags
ms.service="hdinsight"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="big-data"
ms.date="06/14/2016"
ms.author="larryfr"/>

# Ports and URIs used by HDInsight

This document provides a list of the ports used by Hadoop services running on Linux-based HDInsight clusters. It also provides information on ports used to connect to the cluster using SSH.

## Public ports vs. non-public ports

Linux-based HDInsight clusters only exposes three ports publicly on the internet; 22, 23, and 443. These are used to securely access the cluster using SSH and services exposed over the secure HTTPS protocol.

Internally, HDInsight is implemented by several Azure Virtual Machines (the nodes within the cluster,) running on an Azure Virtual Network. From within the virtual network, you can access ports not exposed over the internet. For example, if you connect to one of the head nodes using SSH, from the head node you can then directly access services running on the cluster nodes.

> [AZURE.IMPORTANT] When you create an HDInsight cluster, if you do not specify an Azure Virtual Network as a configuration option, one is created; however, you cannot join other machines (such as other Azure Virtual Machines or your client development machine,) to this automatically created virtual network. 

To join additional machines to the virtual network, you must create the virtual network first, and then specify it when creating your HDInsight cluster. For more information, see [Extend HDInsight capabilities by using an Azure Virtual Network](hdinsight-extend-hadoop-virtual-network.md)

## Public ports

All the nodes in an HDInsight cluster are located in an Azure Virtual Network, and cannot be directly accessed from the internet. A public gateway provides internet access to the following ports, which are common across all HDInsight cluster types.

| Service | Port | Protocol | Description |
| ---- | ---------- | -------- | ----------- | ----------- |
| sshd | 22 | SSH | Connects clients to sshd on head node 0. See [Use SSH with Linux-based HDInsight](hdinsight-hadoop-linux-use-ssh-windows.md) |
| sshd | 22 | SSH | Connects clients to sshd on the edge node (HDInsight Premium only). See [Get started using R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md) |
| sshd | 23 | SSH | Connects clients to sshd on head node 1. See [Use SSH with Linux-based HDInsight](hdinsight-hadoop-linux-use-ssh-windows.md) |
| Ambari | 443 | HTTPS | Ambari web UI. See [Manage HDInsight using the Ambari Web UI](hdinsight-hadoop-manage-ambari.md) |
| Ambari | 443 | HTTPS | Ambari REST API. See [Manage HDInsight using the Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md) |
| WebHCat | 443 | HTTPS | HCatalog REST API. See [Use Hive with Curl](hdinsight-hadoop-use-Pig-curl.md), [Use Pig with Curl](hdinsight-hadoop-use-Pig-curl.md), [Use MapReduce with Curl](hdinsight-hadoop-use-mapreduce-curl.md) |
| HiveServer2 | 443 | ODBC | Connects to Hive using ODBC. See [Connect Excel to HDInsight with the Microsoft ODBC driver](hdinsight-connect-excel-hive-odbc-driver.md). |
| HiveServer2 | 443 | JDBC | Connects to Hive using JDBC. See [Connect to Hive on HDInsight using the Hive JDBC driver](hdinsight-connect-hive-jdbc-driver.md) |

The following are available for specific cluster types:

| Service | Port | Protocol |Cluster type | Description |
| ------------ | ---- |  ----------- | --- | ----------- |
| Stargate | 443 | HTTPS | HBase | HBase REST API. See [Get started using HBase](hdinsight-hbase-tutorial-get-started-linux.md) |
| Livy | 443 | HTTPS |  Spark | Spark REST API. See [Submit Spark jobs remotely using Livy](hdinsight-apache-spark-livy-rest-interface.md) |
| Storm | 443 | HTTPS | Storm | Storm web UI. See [Deploy and manage Storm topologies on HDInsight](hdinsight-storm-deploy-monitor-topology-linux.md)

### Authentication

All services publicly exposed on the internet must be authenticated:

| Port | Credentials |
| ---- | ----------- |
| 22 or 23 | The SSH user credentials specified during cluster creation |
| 443 | The login name (default: admin,) and password that were set during cluster creation |

## Non-public ports

### HDFS ports

| Service | Node(s) | Port | Protocol | Description |
| ------- | ------- | ---- | -------- | ----------- | 
| NameNode web UI | Head nodes | 30070 | HTTPS | Web UI to view current status |
| NameNode metadata service | head nodes | 8020 | IPC | File system metadata 
| DataNode | All worker nodes | 30075 | HTTPS | Web UI to view status, logs, etc. |
| DataNode | All worker nodes | 30010 | &nbsp; | Data transfer |
| DataNode | All worker nodes | 30020 | IPC | Metadata operations |
| Secondary NameNode | Head nodes | 50090 | HTTP | Checkpoint for NameNode metadata |
### YARN ports

| Service | Node(s) | Port | Protocol | Description |
| ------- | ------- | ---- | -------- | ----------- |
| Resource Manager web UI | Head nodes | 8088 | HTTP | Web UI for Resource Manager |
| Resource Manager web UI | Head nodes | 8090 | HTTPS | Web UI for Resource Manager |
| Resource Manager admin interface | head nodes | 8141 | IPC | For application submissions (Hive, Hive server, Pig, etc.) |
| Resource Manager scheduler | head nodes | 8030 | HTTP | Administrative interface |
| Resource Manager application interface | head nodes | 8050 | HTTP |Address of the applications manager interface |
| NodeManager | All worker nodes | 30050 | &nbsp; | The address of the container manager |
| NodeManager web UI | All worker nodes | 30060 | HTTP | Resource manager interface |
| Timeline address | Head nodes | 10200 | RPC | The Timeline service RPC service. |
| Timeline web UI | Head nodes | 8181 | HTTP | The Timeline service web UI |

### Hive ports

| Service | Node(s) | Port | Protocol | Description |
| ------- | ------- | ---- | -------- | ----------- |
| HiveServer2 | Head nodes | 10001 | Thrift | Service for programmatically connecting to Hive (Thrift/JDBC) |
| HiveServer | Head nodes | 10000 | Thrift | Service for programmatically connecting to Hive (Thrift/JDBC) |
| Hive Metastore | Head nodes | 9083 | Thrift | Service for programmatically connecting to Hive metadata (Thrift/JDBC) |

### WebHCat ports

| Service | Node(s) | Port | Protocol | Description |
| ------- | ------- | ---- | -------- | ----------- |
| WebHCat server | Head nodes | 30111 | HTTP | Web API on top of HCatalog and other Hadoop services |

### MapReduce ports

| Service | Node(s) | Port | Protocol | Description |
| ------- | ------- | ---- | -------- | ----------- |
| JobHistory | Head nodes | 19888 | HTTP | MapReduce JobHistory web UI |
| JobHistory | Head nodes | 10020 | &nbsp; | MapReduce JobHistory server |
| ShuffleHandler | &nbsp; | 13562 | &nbsp; | Transfers intermediate Map outputs to requesting Reducers |

### Oozie

| Service | Node(s) | Port | Protocol | Description |
| ------- | ------- | ---- | -------- | ----------- |
| Oozie server | Head nodes | 11000 | HTTP | URL for Oozie service |
| Oozie server | Head nodes | 11001 | HTTP | Port for Oozie admin |

### Ambari Metrics

| Service | Node(s) | Port | Protocol | Description |
| ------- | ------- | ---- | -------- | ----------- |
| TimeLine (Application history) | Head nodes | 6188 | HTTP | The TimeLine service web UI |
| TimeLine (Application history) | Head nodes | 30200 | RPC | The TimeLine service web UI |

### HBase ports

| Service | Node(s) | Port | Protocol | Description |
| ------- | ------- | ---- | -------- | ----------- |
| HMaster | Head nodes | 16000 | &nbsp; | &nbsp; |
| HMaster info Web UI | Head nodes | 16010 | HTTP | The port for the HBase Master web UI |
| Region server | All worker nodes | 16020 | &nbsp; | &nbsp; |
| &nbsp; | &nbsp; | 2181 | &nbsp; | The port that clients use to connect to ZooKeeper |

