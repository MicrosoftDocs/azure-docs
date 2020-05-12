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
 * Names nodes are both in standby mode
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
  * Job failures can fail temporarily due to zookeeper connection issues
  
## Further reading

[ZooKeeper Strengths and Limitations](https://zookeeper.apache.org/doc/r3.3.5/zookeeperAdmin.html#sc_strengthsAndLimitations).

## Common causes

* High CPU usage on the zookeeper servers
  * In the Ambari UI, if you see near 100% sustained CPU usage on the zookeeper servers, then the sessions open during that time can expire and timeout
* Zookeeper is busy consolidating snapshots that it doesn't respond to clients / requests on time
* Zookeeper servers have a sustained CPU load of 5 or above (as seen in Ambari UI)

## Check for zookeeper status
  * Find the zookeeper servers from the /etc/hosts file or from Ambari UI
  * Run the following command
    * echo stat | nc {zk_host_ip} 2181 (or 2182)  
  * Port 2181 is the apache zookeeper instance
  * Port 2182 is used by the HDI zookeeper (to provide HA for services that are not natively HA)

## CPU load peaks up every hour
  * Login to the zookeeper server and check the /etc/crontab
  * Are there any hourly jobs running at this time?
  * If so, randomize the start time across different zookeeper servers
  
## Purging old snapshots
  * HDI Zookeepers are configured to auto purge old snapshots
  * By default, last 30 snapshots are retained
  * This controlled by the configuration key autopurge.snapRetainCount
    * /etc/zookeeper/conf/zoo.cfg for hadoop zookeeper
    * /etc/hdinsight-zookeeper/conf/zoo.cfg for HDI zookeeper
  * Set this to a value >=3 and restart the zookeeper servers
    * Hadoop zookeeper can be restarted through Ambari
    * HDI zookeeper has to be stopped manually and restarted manually
      * sudo lsof -i :2182 will give you the process id to kill
      * sudo python /opt/startup_scripts/startup_hdinsight_zookeeper.py
  * Manually purging snapshots
    * DO NOT delete the snapshot files directly as this could result in data loss
      * zookeeper
        * sudo java -cp /usr/hdp/current/zookeeper-server/zookeeper.jar:/usr/hdp/current/zookeeper-server/lib/* org.apache.zookeeper.server.PurgeTxnLog /hadoop/zookeeper/ /hadoop/zookeeper/ 3
      * hdinsight-zookeeper
        * sudo java -cp /usr/hdp/current/zookeeper-server/zookeeper.jar:/usr/hdp/current/zookeeper-server/lib/* org.apache.zookeeper.server.PurgeTxnLog /hadoop/hdinsight-zookeeper/ /hadoop/hdinsight-zookeeper/ 3
        
## CancelledKeyException in the zookeeper server log
  * This exception usually means that the client is no longer active and the server is unable to send a message
  * This is indication of a symptom that the zookeeper client is terminating sessions prematurely
  * Look for the other symptoms outlined in this document

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

- Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

- Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

- If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
