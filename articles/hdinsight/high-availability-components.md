---
title: High availability components in Azure HDInsight
description: Overview of the various high availability components used by HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 09/6/2019
---

# High availability components in Azure HDInsight

The high availability (HA) components in an HDInsight cluster are distributed as:

![HDInsight high availability services diagram](./media/high-availability-components/hdinsight-ha-services.png)

HA components may differ with cluster types. HDInsight provides the following HA components:

* Apache Ambari server
* Application Timeline Server for Apache YARN
* Job History Server for Apache MapReduce
* Apache Livy for Spark2 Server

HDInsight uses HDInsight Zookeeper to determine the status of HA services and to perform failovers. HDInsight Zookeeper is another quorum of Zookeeper server running on Zookeeper nodes in parallel with Apache Zookeeper. HDInsight Zookeeper is used to decide the active headnode. The HDInsight HA services run on headnodes only. The service should always be running on the active headnode, and stopped and put in maintenance mode on the standby headnode.

## Startup

During deployment, the HDInsight agent starts HA service-related components in the order of: HDInsight Zookeeper, master failover controller, and slave failover controller.

## Slave failover controller

The slave failover controller runs on every node in the cluster. The controller is responsible for starting the Ambari agent and slave-ha-service, an HA service handler, on each node. It periodically queries HDInsight Zookeeper about the active headnode.  The controller updates the host configuration file, restarts Ambari agent, and the slave-ha-service when  the active/standby headnodes changes. The slave-ha-service is responsible for stopping HDInsight HA services on the standby headnode.

## Master failover controller

The master failover controller runs on both head nodes. Both master failover controllers communicate with HDInsight Zookeeper to elect the headnode they're running on as the active headnode.

For example, if a master failover controller one on headnode 0 wins the election, then headnode 0 becomes active. The master failover controller starts Ambari server and master-ha-service on headnode 0. The other master failover controller stops Ambari server and master-ha-service on headnode 1.

The master-ha-service only runs on active headnode, it stops HDInsight HA services on standby headnode and starts HA services on active headnode.

## The failover process

A health monitor, which is a daemon, runs along with each master failover controller to  perform heartbeats with the headnodes. The headnode is regarded as an HA service in this scenario. The health monitor checks if the HA service is healthy and if it's ready to join in the leadership election. If yes, this HA service will compete in the election. If no, it will quit the election until it becomes ready again.

For active headnode failures, such as headnode crash, or rebooting, if the standby headnode achieves the leadership and becomes active, its master failover controller will start all HDInsight HA services on it. It will also stop these services on the other headnode.

For HDInsight HA service failures, such as service down, unhealthy, and so on, master failover controller should be able to automatically restart or stop the services according to the headnode status. Users shouldn't manually start HDInsight HA services on both head nodes. Instead, allow automatic or manual failover to recover the problem.

## HDFS NameNode high availability

HDInsight clusters based on Hadoop 2.0 or higher provide NameNode high availability. There are two NameNodes running on two headnodes, respectively, which are configured for automatic failover. The NameNodes use ZKFailoverController to communicate with Apache Zookeeper to elect for active/standby status. ZKFailoverController runs on both headnodes, and works in the same way as the master failover controller above.

Apache Zookeeper is independent of HDInsight Zookeeper, so the active NameNode may not run on active headnode. When the active NameNode is dead or unhealthy, the standby NameNode will win the election and become active.

## YARN Resource Manager high availability

HDInsight clusters based on Apache Hadoop 2.4 or higher support YARN Resource Manager high availability. There are two resource managers, rm1 and rm2, running on headnode-0 and headnode-1, respectively. Like NameNode, Resource Manager is also configured for automatic failover. Another Resource Manager is automatically elected to be the active one when the active Resource Manager goes down or unresponsive.

Resource Manager uses its embedded ActiveStandbyElector as a failure detector and leader elector. Unlike HDFS NodeManager, Resource Manager doesn't need a separate ZKFC daemon. The active Resource Manager writes its states into Apache Zookeeper.

Resource Manager high availability is independent from NameNode and HDInsight HA services, the active Resource Manager may not run on active headnode or headnode that the active NameNode is running. For more information about YARN Resource Manager high availability, see [Resource Manager High Availability](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/ResourceManagerHA.html).

## Inadvertent manual intervention

It's expected that HDInsight HA services should only be running on the active headnode, and automatically restarted when necessary. Since individual HA services don't have its own health monitor, failover can't be triggered at single service level. Failover and availability of HDInsight HA services is at a node level and not at a service level.

## Some known issues

* When manually starting an HA service on the standby headnode, it won't stop until next failover happens.

* When an HA service on the active headnode stops, it won't restart until next failover happens or the master-ha-service restarts.
