---
title: Unable to add nodes to Azure HDInsight cluster
description: Troubleshoot why unable to add nodes to Apache Hadoop cluster in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/31/2019
---

# Scenario: Unable to add nodes to Azure HDInsight cluster

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Unable to add nodes to Azure HDInsight cluster.

## Cause

Reasons may vary.

## Resolution

Using the [Cluster size](../hdinsight-scaling-best-practices.md) feature, calculate the number of additional cores needed for the cluster. This is based on the total number of cores in the new worker nodes. Then try one or more of the following steps:

* Check to see if there are any cores available in the cluster's location.

* Take a look at the number of available cores in other locations. Consider recreating your cluster in a different location with enough available cores.

* If you'd like to increase the core quota for a specific location, please file a support ticket for an HDInsight core quota increase.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
