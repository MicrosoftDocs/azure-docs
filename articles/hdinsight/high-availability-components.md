---
title: High availability components in Azure HDInsight
description: Overview of the various high availability components used by HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/09/2019
---
# High availability services supported by Azure HDInsight

 In order to provide you with optimal levels of availability for your analytics components, HDInsight has developed a unique architecture for ensuring high availability (HA) of critical services. Some components of this architecture were developed by HDInsight to provide automatic failover. Other components are standard Apache components which are deployed to support specific services. This article explains the architecture of the HA service model in HDInsight, how HDInsight supports failover for HA services, and best practices to recover from other service interruptions.

HDInsight provides customized infrastructure to ensure that four primary services are high availability:

- Apache Ambari server
- Application Timeline Server for Apache YARN
- Job History Server
- Apache Livy

To achieve this level of dependability, HDInsight has developed a unique reliability infrastructure to support these services and provide automatic failover capabilities. This infrastrucuture consists of a number of services and software components, some of which are designed by HDInsight. The following components are unique to the HDInsight platform:

- Slave failover controller
- Master failover controller
- Slave high availability service
- Master high availability service

There are also other high availability services which are supported by open source Apache reliability services. These components are also present on HDInsight clusters, but are not supported by HDInsight:

- HDFS NameNode
- YARN Resource Manager
- HBase Master

## HDInsight High Availability Services

Microsoft provides support for the four Apache services in the table below in HDInsight clusters. To distinguish them from HA services provided by Apache, they are called HDInsight HA services.

| Service | Cluster nodes | Cluster types | Purpose |
|---|---|---|---|
| Apache Ambari server| Active headnode | All | Monitors and manages the cluster.|
| Application Timeline Server for Apache YARN | Active headnode | All except Kafka | Maintains debugging info about YARN jobs running on the cluster.|
| Job History Server | Active headnode | All except Kafka | Maintains debugging data for MapReduce jobs.|
| Apache Livy | Active headnode | Spark | Enables easy interaction with a Spark cluster over a REST interface |

HDInsight Enterprise Security Package (ESP) clusters currently only provide the Ambari server high availability.

### Architecture

Each HDInsight cluster has two headnodes in active/standby modes, respectively. The HDInsight HA services run on headnodes only. These services should always be running on the active headnode, and stopped and put in maintenance mode on the standby headnode.

To maintain the correct states of HA services and provide a fast failover, HDInsight utilizes Apache ZooKeeper, which is a coordination service for distributed applications, to conduct active headnode election. HDInsight also provisions master failover controller, slave failover controller, master-ha-service, and slave-ha-service, which are Java processes running in background to coordinate the failover procedure for HDInsight HA services.

### Apache ZooKeeper

Apache ZooKeeper is a high-performance coordination service for distributed applications. In production, ZooKeeper usually runs in replicated mode where a replicated group of ZooKeeper servers form a quorum. Each HDInsight cluster has three ZooKeeper nodes which allow three ZooKeeper servers to form a quorum. HDInsight has two ZooKeeper quorums running in parallel with each other. One quorum decides the active headnode in a cluster on which HDInsight HA services should run. Another quorum is used to coordinate HA services provided by Apache, as detailed in later sections.

### Slave failover controller

The slave failover controller runs on every node in an HDInsight cluster. It is responsible for starting the Ambari agent and slave-ha-service on each node. It periodically queries the first ZooKeeper quorum about the active headnode. When the active and standby headnodes change, the slave failover controller performs the following:

1. Updates the host configuration file.
1. Restarts Ambari agent.

The slave-ha-service is responsible for stopping the HDInsight HA services (except Ambari server) on the standby headnode.

### Master failover controller

A master failover controller runs on both headnodes. Both master failover controllers communicate with the first ZooKeeper quorum to nominate the headnode that they're running on as the active headnode.

For example, if the master failover controller on headnode 0 wins the election, the following changes take place:

1. Headnode 0 becomes active.
1. The master failover controller starts Ambari server and the *master-ha-service* on headnode 0.
1. The other master failover controller stops Ambari server and the *master-ha-service* on headnode 1.

The master-ha-service only runs on the active headnode, it stops the HDInsight HA services (except Ambari server) on standby headnode and starts them on active headnode.

### The failover process

A health monitor, which is a daemon, runs along with each master failover controller to perform heartbeats with the headnodes. The headnode is regarded as an HA service in this scenario. The health monitor checks if the HA service is healthy and if it's ready to join in the leadership election. If yes, this HA service will compete in the election. If no, it will quit the election until it becomes ready again.

For active headnode failures, such as headnode crash, or rebooting, if the standby headnode achieves the leadership and becomes active, its master failover controller will start all HDInsight HA services on it. It will also stop these services on the other headnode.

For HDInsight HA service failures, such as service down, unhealthy, and so on, master failover controller should be able to automatically restart or stop the services according to the headnode status. Users shouldn't manually start HDInsight HA services on both head nodes. Instead, allow automatic or manual failover to recover the problem.

### Inadvertent manual intervention

It's expected that HDInsight HA services should only be running on the active headnode, and automatically restarted when necessary. Since individual HA services don't have their own health monitor, failover can't be triggered at the level of the individual service. Failover is ensured at the node level and not at the service level.

### Some known issues

- When manually starting an HA service on the standby headnode, it won't stop until next failover happens. When HA services are running on both headnodes, some potential problems include: Ambari UI is inaccessible, Ambari throws errors, YARN, Spark, and Oozie jobs may stuck.

- When an HA service on the active headnode stops, it won't restart until next failover happens or the master failover controller/master-ha-service restarts. When one or more HA services stop on the active headnode, especially when Ambari server stops, Ambari UI is inaccessible, other potential problems include YARN, Spark, and Oozie jobs failures.

## Apache High Availability Services

Apache provides high availability for HDFS NameNode, YARN Resource Manager, and HBase Master, which are also available in HDInsight clusters. Unlike HDInsight HA services, they are supported in ESP clusters. Apache HA services communicate with the second ZooKeeper quorum (described in the above section) to elect active/standby states and conduct automatic failover. Following sections detail how these services work.

### Hadoop Distributed File System (HDFS) NameNode

HDInsight clusters based on Apache Hadoop 2.0 or higher provide NameNode high availability. There are two NameNodes running on two headnodes, respectively, which are configured for automatic failover. The NameNodes use ZKFailoverController to communicate with Zookeeper to elect for active/standby status. ZKFailoverController runs on both headnodes, and works in the same way as the master failover controller above.

The second Zookeeper quorum is independent of the first quorum, so the active NameNode may not run on the active headnode. When the active NameNode is dead or unhealthy, the standby NameNode wins the election and becomes active.

### YARN Resource Manager

HDInsight clusters based on Apache Hadoop 2.4 or higher support YARN Resource Manager high availability. There are two resource managers, rm1 and rm2, running on headnode-0 and headnode-1, respectively. Like NameNode, Resource Manager is also configured for automatic failover. Another Resource Manager is automatically elected to be the active one when the active Resource Manager goes down or unresponsive.

Resource Manager uses its embedded ActiveStandbyElector as a failure detector and leader elector. Unlike HDFS NodeManager, Resource Manager doesn't need a separate ZKFC daemon. The active Resource Manager writes its states into Apache Zookeeper.
Resource Manager high availability is independent from NameNode and HDInsight HA services, the active Resource Manager may not run on active headnode or headnode that the active NameNode is running. For more information about YARN Resource Manager high availability, see [Resource Manager High Availability](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/ResourceManagerHA.html).

### HBase Master

HDInsight HBase clusters support HBase Master high availability. Unlike other HA services, which run on headnodes, HBase Masters run on the three Zookeeper nodes, where one of them is the active master and the other two are standby. Like NameNode, HBase Master coordinates with Apache Zookeeper for leader election and does automatic failover when current active master has problems. There is only one active HBase Master at any time.

## Next Steps

- [Availability and reliability of Apache Hadoop clusters in HDInsight](hdinsight-high-availability-linux.md)
- [Azure HDInsight virtual network architecture](hdinsight-virtual-network-architecture.md)
