---
title: Troubleshoot HBase by using Azure HDInsight 
description: Get answers to common questions about working with HBase and Azure HDInsight.
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.custom: hdinsightactive, seodec18
ms.topic: troubleshooting
ms.date: 08/14/2019
---

# Troubleshoot Apache HBase by using Azure HDInsight

Learn about the top issues and their resolutions when working with Apache HBase payloads in Apache Ambari.

## How do I run hbck command reports with multiple unassigned regions?

A common error message that you might see when you run the `hbase hbck` command is "multiple regions being unassigned or holes in the chain of regions."

In the HBase Master UI, you can see the number of regions that are unbalanced across all region servers. Then, you can run `hbase hbck` command to see holes in the region chain.

Holes might be caused by the offline regions, so fix the assignments first. 

To bring the unassigned regions back to a normal state, complete the following steps:

1. Sign in to the HDInsight HBase cluster by using SSH.
2. To connect with the Apache ZooKeeper shell, run the `hbase zkcli` command.
3. Run the `rmr /hbase/regions-in-transition` command or the `rmr /hbase-unsecure/regions-in-transition` command.
4. To exit from the `hbase zkcli` shell, use the `exit` command.
5. Open the Apache Ambari UI, and then restart the Active HBase Master service.
6. Run the `hbase hbck` command again (without any options). Check the output of this command to ensure that all regions are being assigned.


## <a name="how-do-i-fix-timeout-issues-with-hbck-commands-for-region-assignments"></a>How do I fix timeout issues when using hbck commands for region assignments?

### Issue

A potential cause for timeout issues when you use the `hbck` command might be that several regions are in the "in transition" state for a long time. You can see those regions as offline in the HBase Master UI. Because a high number of regions are attempting to transition, HBase Master might timeout and be unable to bring those regions back online.

### Resolution steps

1. Sign in to the HDInsight HBase cluster by using SSH.
2. To connect with the Apache ZooKeeper shell, run the `hbase zkcli` command.
3. Run the `rmr /hbase/regions-in-transition` or the `rmr /hbase-unsecure/regions-in-transition` command.
4. To exit the `hbase zkcli` shell, use the `exit` command.
5. In the Ambari UI, restart the Active HBase Master service.
6. Run the `hbase hbck -fixAssignments` command again.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
