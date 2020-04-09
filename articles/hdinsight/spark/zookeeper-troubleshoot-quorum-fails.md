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

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Apache ZooKeeper server is unhealthy, symptoms could include: both Resource Managers/Name Nodes are in standby mode, simple HDFS operations do not work, `zkFailoverController` is stopped and cannot be started, Yarn/Spark/Livy jobs fail due to Zookeeper errors. LLAP Daemons may also fail to start on Secure Spark or Interactive Hive clusters. You may see an error message similar to:

```
19/06/19 08:27:08 ERROR ZooKeeperStateStore: Fatal Zookeeper error. Shutting down Livy server.
19/06/19 08:27:08 INFO LivyServer: Shutting down Livy server.
```

In the Zookeeper Server logs on any Zookeeper host at /var/log/zookeeper/zookeeper-zookeeper-server-\*.out, you may also see the following error:

```
2020-02-12 00:31:52,513 - ERROR [CommitProcessor:1:NIOServerCnxn@178] - Unexpected Exception:
java.nio.channels.CancelledKeyException
```

## Cause

When the volume of snapshot files is large or snapshot files are corrupted, ZooKeeper server will fail to form a quorum, which causes ZooKeeper related services unhealthy. ZooKeeper server will not remove old snapshot files from its data directory, instead, it is a periodic task to be performed by users to maintain the healthiness of ZooKeeper. For more information, see [ZooKeeper Strengths and Limitations](https://zookeeper.apache.org/doc/r3.3.5/zookeeperAdmin.html#sc_strengthsAndLimitations).

## Resolution

Check ZooKeeper data directory `/hadoop/zookeeper/version-2` and `/hadoop/hdinsight-zookeeper/version-2` to find out if the snapshots file size is large. Take the following steps if large snapshots exist:

1. Back up snapshots in `/hadoop/zookeeper/version-2` and `/hadoop/hdinsight-zookeeper/version-2`.

1. Clean up snapshots in `/hadoop/zookeeper/version-2` and `/hadoop/hdinsight-zookeeper/version-2`.

1. Restart all ZooKeeper servers from Apache Ambari UI.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

- Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

- Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

- If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
