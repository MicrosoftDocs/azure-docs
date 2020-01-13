---
title: Apache Ambari Tez View loads slowly in Azure HDInsight
description: Apache Ambari Tez View may load slowly or may not load at all in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/30/2019
---

# Scenario: Apache Ambari Tez View loads slowly in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

Apache Ambari Tez View may load slowly or may not load at all. When loading Ambari Tez View, you may see processes on Headnodes becoming unresponsive.

## Cause

Accessing Yarn ATS APIs may sometimes have poor performance on clusters created before Oct 2017 when the cluster has large number of Hive jobs run on it.

## Resolution

This is an issue that has been fixed in Oct 2017. Recreating your cluster will make it not run into this problem again.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
