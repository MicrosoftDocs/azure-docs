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
* Spark / Hive / Yarn jobs or Hive queries fail because of Zookeeper connection failures
* LLAP daemons fail to start on secure Spark or secure interactive Hive clusters

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

## Related issues

* High availability services like Yarn, NameNode, and Livy can go down for many reasons.
* Confirm from the logs that it is related to Zookeeper connections
* Make sure that the issue happens repeatedly (do not use these solutions for one off cases)
* Jobs can fail temporarily due to Zookeeper connection issues
  

## Common causes for Zookeeper failure

* High CPU usage on the zookeeper servers
  * In the Ambari UI, if you see near 100% sustained CPU usage on the zookeeper servers, then the zookeeper sessions open during that time can expire and timeout
* Zookeeper clients are reporting frequent timeouts
  * The transaction logs and the snapshots are being written to the same disk. This can cause I/O bottlenecks.

## Check for zookeeper status

* Find the zookeeper servers from the /etc/hosts file or from Ambari UI
* Run the following command `echo stat | nc {zk_host_ip} 2181 (or 2182)`
* Port 2181 is the apache zookeeper instance
* Port 2182 is used by the HDInsight zookeeper (to provide HA for services that are not natively HA)

## CPU load peaks up every hour

* Log in to the zookeeper server and check the /etc/crontab
* If there are any hourly jobs running at this time, randomize the start time across different zookeeper servers.
  
## Purging old snapshots

### Auto purging configuration

* HDInsight Zookeepers are configured to auto purge old snapshots
* By default, the last 30 snapshots are retained
* This controlled by the configuration key `autopurge.snapRetainCount`
  * `/etc/zookeeper/conf/zoo.cfg` for hadoop zookeeper
  * `/etc/hdinsight-zookeeper/conf/zoo.cfg` for HDInsight zookeeper
* Set this to a value =3 and restart the zookeeper servers
  * Hadoop zookeeper can be restarted through Ambari
  * HDInsight zookeeper has to be stopped manually and restarted manually
    * `sudo lsof -i :2182` will give you the process ID to kill
    * `sudo python /opt/startup_scripts/startup_hdinsight_zookeeper.py`

> [!Note]
> Don't delete the snapshot files directly as this could result in data loss.

### Manually purging snapshots

Use the following command to manually purge zookeeper snapshots.

```
sudo java -cp /usr/hdp/current/zookeeper-server/zookeeper.jar:/usr/hdp/current/zookeeper-server/lib/* org.apache.zookeeper.server.PurgeTxnLog /hadoop/zookeeper/ /hadoop/zookeeper/ 3
```

Use the following command to manually purge hdinsight-zookeeper snapshots.

```
sudo java -cp /usr/hdp/current/zookeeper-server/zookeeper.jar:/usr/hdp/current/zookeeper-server/lib/* org.apache.zookeeper.server.PurgeTxnLog /hadoop/hdinsight-zookeeper/ /hadoop/hdinsight-zookeeper/ 3
```

## CancelledKeyException in the Zookeeper server log

* This exception usually means that the client is no longer active and the server is unable to send a message
* This is indication of a symptom that the zookeeper client is terminating sessions prematurely
* Look for the other symptoms outlined in this document

## Further reading

[ZooKeeper Strengths and Limitations](https://zookeeper.apache.org/doc/r3.4.6/zookeeperAdmin.html#sc_strengthsAndLimitations).

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

- Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

- Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

- If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
