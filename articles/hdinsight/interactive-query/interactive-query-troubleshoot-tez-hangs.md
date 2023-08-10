---
title: Apache Tez application hangs in Azure HDInsight
description: Apache Tez application hangs in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 06/07/2023
---

# Scenario: Apache Tez application hangs in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

After submitting Apache Hive job, from Tez view the job status is "Running", but doesn't appear to make any progress

## Cause

Too many jobs submitted; long Yarn queue.

## Resolution

Scale up the cluster, or just wait till the Yarn queue is drained.

By default `yarn.scheduler.capacity.maximum-applications` controls the maximum number of applications that are running or pending, and it defaults to `10000`.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
