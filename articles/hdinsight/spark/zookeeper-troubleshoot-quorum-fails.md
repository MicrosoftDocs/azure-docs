---
title: Apache ZooKeeper server fails to form a quorum in Azure HDInsight
description: Apache ZooKeeper server fails to form a quorum in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 05/20/2020
---
# Apache ZooKeeper server fails to form a quorum in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues related to Zookeepers in Azure HDInsight clusters.

## Symptoms

* Both the resource managers go to standby mode
* Namenodes are both in standby mode
* Spark, Hive, and Yarn jobs or Hive queries fail because of Zookeeper connection failures
* LLAP daemons fail to start on secure Spark or secure interactive Hive clusters

## Sample log

You may see an error message similar to the following in yarn logs (/var/log/hadoop-yarn/yarn/yarn-yarn*.log on the headnodes):

```output
2020-05-05 03:17:18.3916720|Lost contact with Zookeeper. Transitioning to standby in 10000 ms if connection is not reestablished.
Message
2020-05-05 03:17:07.7924490|Received RMFatalEvent of type STATE_STORE_FENCED, caused by org.apache.zookeeper.KeeperException$NoAuthException: KeeperErrorCode = NoAuth
...
2020-05-05 03:17:08.3890350|State store operation failed 
2020-05-05 03:17:08.3890350|Transitioning to standby state
```

## Related issues

* High availability services like Yarn, NameNode, and Livy can go down for many reasons.
* Confirm from the logs that it is related to Zookeeper connections
* Make sure that the issue happens repeatedly (do not use these solutions for one off cases)
* Jobs can fail temporarily due to Zookeeper connection issues

## Common causes for Zookeeper failure

* High CPU usage on the zookeeper servers
  * In the Ambari UI, if you see near 100% sustained CPU usage on the zookeeper servers, then the zookeeper sessions open during that time can expire and time out
* Zookeeper clients are reporting frequent timeouts
  * In the logs for Resource Manager, Namenode and others, you will see frequent client connection timeouts
  * This could result in quorum loss, frequent failovers, and other issues

## Check for zookeeper status

* Find the zookeeper servers from the /etc/hosts file or from Ambari UI
* Run the following command
  * `echo stat | nc <ZOOKEEPER_HOST_IP> 2181` (or 2182)  
  * Port 2181 is the apache zookeeper instance
  * Port 2182 is used by the HDInsight zookeeper (to provide HA for services that are not natively HA)
  * If the command shows no output, then it means that the zookeeper servers are not running
  * If the servers are running, the result will include statics of client connections and other statistics

```output
Zookeeper version: 3.4.6-8--1, built on 12/05/2019 12:55 GMT
Clients:
 /10.2.0.57:50988[1](queued=0,recved=715,sent=715)
 /10.2.0.57:46632[1](queued=0,recved=138340,sent=138347)
 /10.2.0.34:14688[1](queued=0,recved=264653,sent=353420)
 /10.2.0.52:49680[1](queued=0,recved=134812,sent=134814)
 /10.2.0.57:50614[1](queued=0,recved=19812,sent=19812)
 /10.2.0.56:35034[1](queued=0,recved=2586,sent=2586)
 /10.2.0.52:63982[1](queued=0,recved=72215,sent=72217)
 /10.2.0.57:53024[1](queued=0,recved=19805,sent=19805)
 /10.2.0.57:45126[1](queued=0,recved=19621,sent=19621)
 /10.2.0.56:41270[1](queued=0,recved=1348743,sent=1348788)
 /10.2.0.53:59097[1](queued=0,recved=72215,sent=72217)
 /10.2.0.56:41088[1](queued=0,recved=788,sent=802)
 /10.2.0.34:10246[1](queued=0,recved=19575,sent=19575)
 /10.2.0.56:40944[1](queued=0,recved=717,sent=717)
 /10.2.0.57:45466[1](queued=0,recved=19861,sent=19861)
 /10.2.0.57:59634[0](queued=0,recved=1,sent=0)
 /10.2.0.34:14704[1](queued=0,recved=264622,sent=353355)
 /10.2.0.57:42244[1](queued=0,recved=49245,sent=49248)

Latency min/avg/max: 0/3/14865
Received: 238606078
Sent: 239139381
Connections: 18
Outstanding: 0
Zxid: 0x1004f99be
Mode: follower
Node count: 133212
```

## CPU load peaks up every hour

* Log in to the zookeeper server and check the /etc/crontab
* If there are any hourly jobs running at this time, randomize the start time across different zookeeper servers.
  
## Purging old snapshots

* Zookeepers are configured to auto purge old snapshots
* By default, the last 30 snapshots are retained
* The number of snapshots that are retained, is controlled by the configuration key `autopurge.snapRetainCount`. This property can be found in the following files:
  * `/etc/zookeeper/conf/zoo.cfg` for Hadoop zookeeper
  * `/etc/hdinsight-zookeeper/conf/zoo.cfg` for HDInsight zookeeper
* Set `autopurge.snapRetainCount` to a value of 3 and restart the zookeeper servers
  * Hadoop zookeeper config can be updated and the service can be restarted through Ambari
  * Stop and restart HDInsight zookeeper manually
    * `sudo lsof -i :2182` will give you the process ID to kill
    * `sudo python /opt/startup_scripts/startup_hdinsight_zookeeper.py`
* Do not purge snapshots manually - deleting snapshots manually could result in data loss

## CancelledKeyException in the zookeeper server log doesn't require snapshot cleanup

* This exception will be seen on the zookeeper servers (/var/log/zookeeper/zookeeper-zookeeper-* or /var/log/hdinsight-zookeeper/zookeeper* files)
* This exception usually means that the client is no longer active and the server is unable to send a message
* This exception also indicates that the zookeeper client is ending sessions prematurely
* Look for the other symptoms outlined in this document

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

- Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).
- Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.
- If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
