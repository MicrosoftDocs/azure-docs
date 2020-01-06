---
title: Issues with region servers in Azure HDInsight
description: Issues with region servers in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 08/16/2019
---

# Issues with region servers in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Scenario: Unassigned regions

### Issue

When running `hbase hbck` command, you see an error message similar to:

```
multiple regions being unassigned or holes in the chain of regions
```

From the Apache HBase Master UI, you can see the number of regions that are unbalanced across all region servers. Then, you can run `hbase hbck` command to see holes in the region chain.

### Cause

Holes may be the result of offline regions.

### Resolution

Fix the assignments. Follow the steps below to bring the unassigned regions back to normal state:

1. Sign in to the HDInsight HBase cluster using SSH.

1. Run `hbase zkcli` command to connect with ZooKeeper shell.

1. Run `rmr /hbase/regions-in-transition` or `rmr /hbase-unsecure/regions-in-transition` command.

1. Exit zookeeper shell by using `exit` command.

1. Open the Apache Ambari UI, and then restart the Active HBase Master service.

1. Run `hbase hbck` command again (without any further options). Check the output and ensure that all regions are being assigned.

---

## Scenario: Dead region servers

### Issue

Region servers fail to start.

### Cause

Multiple splitting WAL directories.

1. Get list of current WALs: `hadoop fs -ls -R /hbase/WALs/ > /tmp/wals.out`.

1. Inspect the `wals.out` file. If there are too many splitting directories (starting with *-splitting), the region server is probably failing because of these directories.

### Resolution

1. Stop HBase from Ambari portal.

1. Execute `hadoop fs -ls -R /hbase/WALs/ > /tmp/wals.out` to get fresh list of WALs.

1. Move the *-splitting directories to a temporary folder, `splitWAL`, and delete the *-splitting directories.

1. Execute `hbase zkcli` command to connect with zookeeper shell.

1. Execute `rmr /hbase-unsecure/splitWAL`.

1. Restart HBase service.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
