---
title: Apache Ambari usage in Azure HDInsight
description: Discussion of how Apache Ambari is used in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/10/2023
---

# Apache Ambari usage in Azure HDInsight

HDInsight uses Apache Ambari for cluster deployment and management. Ambari agents run on every node (headnode, worker node, zookeeper, and edgenode if exists). Ambari server runs only on headnode. Only one instance of Ambari server shall run at one time. This is controlled by HDInsight failover controller. When one of the headnodes is down for reboot or maintenance, the other headnode will become active and Ambari server on the second headnode will be started.

All cluster configuration should be done through the [Ambari UI](./hdinsight-hadoop-manage-ambari.md), any local change will be overwritten when the node is restarted.

## Failover controller services

The HDInsight failover controller is also responsible for updating the IP address of headnode host, which points to the current active head node. All Ambari agents are configured to report its state and heartbeat to headnode host. The failover controller is a set of services running on every node in the cluster, if they aren't running, the headnode failover may not work correctly and you'll end up with HTTP 502 when trying to access Ambari server.

To check which headnode is active, one way is to ssh to one of the nodes in the cluster, then run `ping headnodehost` and compare the IP with that of the two headnodes.

If failover controller services aren't running, headnode failover may not happen correctly, which may end up not running Ambari server. To check if failover controller services are running, execute:

```bash
ps -ef | grep failover
```

## Logs

On the active headnode, you can check the Ambari server logs at:

```
/var/log/ambari-server/ambari-server.log
/var/log/ambari-server/ambari-server-check-database.log
```

On any node in the cluster, you can check the Ambari agent logs at:

```bash
/var/log/ambari-agent/ambari-agent.log
```

## Service start sequences

This is the sequence of service start at boot time:

1. Hdinsight-agent starts failover controller services.
1. Failover controller services start Ambari agent on every node and Ambari server on active headnode.

## Ambari Database

HDInsight creates a database in SQL Database under the hood to serve as the database for Ambari server. The default [service tier is S0](/azure/azure-sql/database/elastic-pool-scale).

For any cluster with worker node count bigger than 16 when creating the cluster, S2 is the database service tier.

## Takeaway points

Never manually start/stop ambari-server or ambari-agent services, unless you're trying to restart the service to work around an issue. To force a failover, you can reboot the active headnode.

Never manually modify any configuration files on any cluster node, let Ambari UI do the job for you.

## Property values in ESP clusters

In HDInsight 4.0 Enterprise Security Package clusters, use pipes `|` rather than commas as variable delimiters. An example is shown below:

```
Property Key: hive.security.authorization.sqlstd.confwhitelist.append
Property Value: environment|env|dl_data_dt
```

## Next steps

* [Manage HDInsight clusters by using the Apache Ambari Web UI](hdinsight-hadoop-manage-ambari.md)
* [Manage HDInsight clusters by using the Apache Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md)

[!INCLUDE [troubleshooting next steps](includes/hdinsight-troubleshooting-next-steps.md)]
