---
title: HDP upgrade & no data in Apache Phoenix views in Azure HDInsight
description: HDP upgrade causes no data in Apache Phoenix views in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 06/23/2023
---

# Scenario: HDP upgrade causes no data in Apache Phoenix views in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

An Apache Phoenix view contains no date after upgrade from HDP 2.4 to HDP 2.5.

## Cause

The index table for views (all indexes for view are stored in a single physical Apache HBase table) is truncated during upgrade

## Resolution

Drop and recreate all view indexes after upgrade.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
