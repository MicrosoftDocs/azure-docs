---
title: Apache ZooKeeper server fails to form a quorum in Azure HDInsight
description: Apache ZooKeeper server fails to form a quorum in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 08/20/2019
---

# Apache ZooKeeper server fails to form a quorum in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues related to zookeepers in Azure HDInsight clusters.

## Symptoms

 * Both the resource managers go to standby mode
 * Namenodes are both in standby mode
 * Spark / hive / yarn jobs or hive queries fail because of zookeeper connection failures
 * LLAP daemons fail to start on secure spark or secure interactive hive clusters
 
## Sample log

You may see an error message similar to:

```
2020-05-05 03:17:18.3916720|Lost contact with Zookeeper. Transitioning to standby in 10000 ms if connection is not reestablished.
Message
2020-05-05 03:17:07.7924490|Received RMFatalEvent of type STATE_STORE_FENCED, caused by org.apache.zookeeper.KeeperException$NoAuthException: KeeperErrorCode = NoAuth
...
2020-05-05 03:17:08.3890350|State store operation failed 
2020-05-05 03:17:08.3890350|Transitioning to standby state
```

## Contra indicators

  * HA services like Yarn / NameNode / Livy can go down due to many reasons. 
    * Please confirm from the logs that it is related to zookeeper connections
    * Please make sure that the issue happens repeatedly (do not do these mitigations for one off cases)
  * Jobs can fail temporarily due to zookeeper connection issues
  
## Further reading

[ZooKeeper Strengths and Limitations](https://zookeeper.apache.org/doc/r3.4.6/zookeeperAdmin.html#sc_strengthsAndLimitations).

## Common causes

* High CPU usage on the zookeeper servers
  * In the Ambari UI, if you see near 100% sustained CPU usage on the zookeeper servers, then the zookeeper sessions open during that time can expire and timeout
* Zookeeper clients are reporting frequent timeouts
  * In the logs for resource manager, namenode and others, you will see frequent client connection timeouts
  * This could result in quorum loss, frequent failovers and other issues

## Check for zookeeper status
  * Find the zookeeper servers from the /etc/hosts file or from Ambari UI
  * Run the following command
    * echo stat | nc {zk_host_ip} 2181 (or 2182)  
    * Port 2181 is the apache zookeeper instance
    * Port 2182 is used by the HDI zookeeper (to provide HA for services that are not natively HA)
    * If the command shows no output, then it means that the zookeeper servers are not running
    * If the servers are running, the result will include statics of client connections and other statistics
````
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
````
## CPU load peaks up every hour
  * Login to the zookeeper server and check the /etc/crontab
  * Are there any hourly jobs running at this time?
  * If so, randomize the start time across different zookeeper servers
  
## Purging old snapshots
  * Zookeepers are configured to auto purge old snapshots
  * By default, last 30 snapshots are retained
  * This is controlled by the configuration key autopurge.snapRetainCount
    * /etc/zookeeper/conf/zoo.cfg for hadoop zookeeper
    * /etc/hdinsight-zookeeper/conf/zoo.cfg for HDI zookeeper
  * Set this to a value of 3 and restart the zookeeper servers
    * Hadoop zookeeper config can be updated and the service can be restarted through Ambari
    * HDI zookeeper has to be stopped manually and restarted manually
      * sudo lsof -i :2182 will give you the process id to kill
      * sudo python /opt/startup_scripts/startup_hdinsight_zookeeper.py
  * Manually purging snapshots is not required
    * **DO NOT delete the snapshot files directly as this could result in data loss**    
    
## CancelledKeyException in the zookeeper server log doesn't require snapshot cleanup
  * This exception usually means that the client is no longer active and the server is unable to send a message
  * This is indication of a symptom that the zookeeper client is terminating sessions prematurely
  * Look for the other symptoms outlined in this document

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

- Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

- Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

- If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
