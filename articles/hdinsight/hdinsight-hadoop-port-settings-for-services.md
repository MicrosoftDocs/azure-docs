---
title: Ports used by Hadoop services on HDInsight - Azure 
description: This article provides a list of ports used by Apache Hadoop services running in Azure HDInsight
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,seoapr2020
ms.date: 09/15/2023
---

# Ports used by Apache Hadoop services on HDInsight

This document provides a list of the ports used by Apache Hadoop services running on HDInsight clusters. It also provides information on ports used to connect to the cluster using SSH.

## Public ports vs. non-public ports

Linux-based HDInsight clusters only expose three ports publicly on the internet: 22, 23, and 443. These ports secure cluster access using SSH and services exposed over the secure HTTPS protocol.

HDInsight is implemented by several Azure Virtual Machines (cluster nodes) running on an Azure Virtual Network. From within the virtual network, you can access ports not exposed over the internet. If you connect via SSH to the head node, you can directly access services running on the cluster nodes.

> [!IMPORTANT]
> If you do not specify an Azure Virtual Network as a configuration option for HDInsight, one is created automatically. However, you can't join other machines (such as other Azure Virtual Machines or your client development machine) to this virtual network.

To join additional machines to the virtual network, you must create the virtual network first, and then specify it when creating your HDInsight cluster. For more information, see [Plan a virtual network for HDInsight](hdinsight-plan-virtual-network-deployment.md).

## Public ports

All the nodes in an HDInsight cluster are located in an Azure Virtual Network. The nodes can't be directly accessed from the internet. A public gateway provides internet access to the following ports, which are common across all HDInsight cluster types.

| Service | Port | Protocol | Description |
| --- | --- | --- | --- |
| sshd |22 |SSH |Connects clients to sshd on the primary headnode. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md). |
| sshd |22 |SSH |Connects clients to sshd on the edge node. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md). |
| sshd |23 |SSH |Connects clients to sshd on the secondary headnode. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md). |
| Ambari |443 |HTTPS |Ambari web UI. See [Manage HDInsight using the Apache Ambari Web UI](hdinsight-hadoop-manage-ambari.md) |
| Ambari |443 |HTTPS |Ambari REST API. See [Manage HDInsight using the Apache Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md) |
| WebHCat |443 |HTTPS |`HCatalog` REST API. See  [Use MapReduce with Curl](hadoop/apache-hadoop-use-mapreduce-curl.md) |
| HiveServer2 |443 |ODBC |Connects to Hive using ODBC. See [Connect Excel to HDInsight with the Microsoft ODBC driver](hadoop/apache-hadoop-connect-excel-hive-odbc-driver.md). |
| HiveServer2 |443 |JDBC |Connects to ApacheHive using JDBC. See [Connect to Apache Hive on HDInsight using the Hive JDBC driver](hadoop/apache-hadoop-connect-hive-jdbc-driver.md) |

The following are available for specific cluster types:

| Service | Port | Protocol | Cluster type | Description |
| --- | --- | --- | --- | --- |
| `Stargate` |443 |HTTPS |HBase |HBase REST API. See [Get started using Apache HBase](hbase/apache-hbase-tutorial-get-started-linux.md) |
| Livy |443 |HTTPS |Spark |Spark REST API. See [Submit Apache Spark jobs remotely using Apache Livy](spark/apache-spark-livy-rest-interface.md) |
| Spark Thrift server |443 |HTTPS |Spark |Spark Thrift server used to submit Hive queries. See [Use Beeline with Apache Hive on HDInsight](hadoop/apache-hadoop-use-hive-beeline.md) |
| Kafka REST proxy |443 |HTTPS |Kafka |Kafka REST API. See [Interact with Apache Kafka clusters in Azure HDInsight using a REST proxy](kafka/rest-proxy.md) |

### Authentication

All services publicly exposed on the internet must be authenticated:

| Port | Credentials |
| --- | --- |
| 22 or 23 |The SSH user credentials specified during cluster creation |
| 443 |The login name (default: admin) and password that were set during cluster creation |

## Non-public ports

> [!NOTE]
> Some services are only available on specific cluster types. For example, HBase is only available on HBase cluster types.

> [!IMPORTANT]
> Some services only run on one headnode at a time. If you attempt to connect to the service on the primary headnode and receive an error, retry using the secondary headnode.

### Ambari

| Service | Nodes | Port | URL path | Protocol |
| --- | --- | --- | --- | --- |
| Ambari web UI | Head nodes | 8080 | / | HTTP |
| Ambari REST API | Head nodes | 8080 | /api/v1 | HTTP |

Examples:

* Ambari REST API: `curl -u admin "http://10.0.0.11:8080/api/v1/clusters"`

### HDFS ports

| Service | Nodes | Port | Protocol | Description |
| --- | --- | --- | --- | --- |
| NameNode web UI |Head nodes |30070 |HTTPS |Web UI to view status |
| NameNode metadata service |head nodes |8020 |IPC |File system metadata |
| DataNode |All worker nodes |30075 |HTTPS |Web UI to view status, logs, and so on. |
| DataNode |All worker nodes |30010 |&nbsp; |Data transfer |
| DataNode |All worker nodes |30020 |IPC |Metadata operations |
| Secondary NameNode |Head nodes |50090 |HTTP |Checkpoint for NameNode metadata |

### YARN ports

| Service | Nodes | Port | Protocol | Description |
| --- | --- | --- | --- | --- |
| Resource Manager web UI |Head nodes |8088 |HTTP |Web UI for Resource Manager |
| Resource Manager web UI |Head nodes |8090 |HTTPS |Web UI for Resource Manager |
| Resource Manager admin interface |head nodes |8141 |IPC |For application submissions (Hive, Hive server, Pig, and so on.) |
| Resource Manager scheduler |head nodes |8030 |HTTP |Administrative interface |
| Resource Manager application interface |head nodes |8050 |HTTP |Address of the applications manager interface |
| NodeManager |All worker nodes |30050 |&nbsp; |The address of the container manager |
| NodeManager web UI |All worker nodes |30060 |HTTP |Resource Manager interface |
| Timeline address |Head nodes |10200 |RPC |The Timeline service RPC service. |
| Timeline web UI |Head nodes |8188 |HTTP |The Timeline service web UI |

### Hive ports

| Service | Nodes | Port | Protocol | Description |
| --- | --- | --- | --- | --- |
| HiveServer2 |Head nodes |10001 |Thrift |Service for connecting to Hive (Thrift/JDBC) |
| Hive Metastore |Head nodes |9083 |Thrift |Service for connecting to Hive metadata (Thrift/JDBC) |

### WebHCat ports

| Service | Nodes | Port | Protocol | Description |
| --- | --- | --- | --- | --- |
| WebHCat server |Head nodes |30111 |HTTP |Web API on top of `HCatalog` and other Hadoop services |

### MapReduce ports

| Service | Nodes | Port | Protocol | Description |
| --- | --- | --- | --- | --- |
| JobHistory |Head nodes |19888 |HTTP |MapReduce JobHistory web UI |
| JobHistory |Head nodes |10020 |&nbsp; |MapReduce JobHistory server |
| ShuffleHandler |&nbsp; |13562 |&nbsp; |Transfers intermediate Map outputs to requesting Reducers |

### Oozie

| Service | Nodes | Port | Protocol | Description |
| --- | --- | --- | --- | --- |
| Oozie server |Head nodes |11000 |HTTP |URL for Oozie service |
| Oozie server |Head nodes |11001 |HTTP |Port for Oozie admin |

### Ambari Metrics

| Service | Nodes | Port | Protocol | Description |
| --- | --- | --- | --- | --- |
| TimeLine (Application history) |Head nodes |6188 |HTTP |The TimeLine service web UI |
| TimeLine (Application history) |Head nodes |30200 |RPC |The TimeLine service web UI |

### HBase ports

| Service | Nodes | Port | Protocol | Description |
| --- | --- | --- | --- | --- |
| HMaster |Head nodes |16000 |&nbsp; |&nbsp; |
| HMaster info Web UI |Head nodes |16010 |HTTP |The port for the HBase Master web UI |
|Region server|All worker nodes |16020 ||&nbsp;|
|Region server info Web UI&nbsp;|&nbsp;All worker nodes |16030|HTTP|The port for the HBase Region server Web UI|
||| 2181 ||The port that clients use to connect to ZooKeeper |

### Kafka ports

| Service | Nodes | Port | Protocol | Description |
| --- | --- | --- | --- | --- |
| Broker |Worker nodes |9092 |Kafka Wire Protocol |Used for client communication |
| &nbsp; |Zookeeper nodes |2181 |&nbsp; |The port that clients use to connect to Zookeeper |
| REST proxy | Kafka management nodes |9400 |HTTPS |[Kafka REST specification](/rest/api/hdinsight-kafka-rest-proxy/) |

### Spark ports

| Service | Nodes | Port | Protocol | URL path | Description |
| --- | --- | --- | --- | --- | --- |
| Spark Thrift servers |Head nodes |10002 |Thrift | &nbsp; | Service for connecting to Spark SQL (Thrift/JDBC) |
| Livy server | Head nodes | 8998 | HTTP | &nbsp; | Service for running statements, jobs, and applications |
| Jupyter Notebook | Head nodes | 8001 | HTTP | &nbsp; | Jupyter Notebook website |

Examples:

* Livy: `curl -u admin -G "http://10.0.0.11:8998/"`. In this example, `10.0.0.11` is the IP address of the headnode that hosts the Livy service.
