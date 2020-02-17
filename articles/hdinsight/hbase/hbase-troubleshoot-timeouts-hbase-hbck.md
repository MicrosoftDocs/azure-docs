---
title: Timeouts with 'hbase hbck' command in Azure HDInsight
description: Time out issue with 'hbase hbck' command when fixing region assignments
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 08/16/2019
---

# Scenario: Timeouts with 'hbase hbck' command in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Encounter timeouts with `hbase hbck` command when fixing region assignments.

## Cause

A potential cause for timeout issues when you use the `hbck` command might be that several regions are in the "in transition" state for a long time. You can see those regions as offline in the HBase Master UI. Because a high number of regions are attempting to transition, HBase Master might time out and be unable to bring those regions back online.

## Resolution

1. Sign in to the HDInsight HBase cluster using SSH.

1. Run `hbase zkcli` command to connect with Apache ZooKeeper shell.

1. Run `rmr /hbase/regions-in-transition` or `rmr /hbase-unsecure/regions-in-transition` command.

1. Exit from `hbase zkcli` shell by using `exit` command.

1. From the Apache Ambari UI, restart the Active HBase Master service.

1. Run the `hbase hbck -fixAssignments` command.

1. Monitor the HBase Master UI "region in transition" that section to make sure no region gets stuck.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

- Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

- Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

- If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
