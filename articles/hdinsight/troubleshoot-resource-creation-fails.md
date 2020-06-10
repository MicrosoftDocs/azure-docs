---
title: Troubleshoot resource creation failures in Azure HDInsight
description: Common capacity issue errors and mitigation techniques are provided in this article.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.custom: seoapr2020
ms.date: 04/22/2020
---

# Troubleshoot resource creation failures in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight.

## Error: The deployment would exceed the quota of '800'

Azure has a quota limit of 800 deployments per resource group. Different quotas are applied per resource group, subscription, account, or other scopes. For example, your subscription may be configured to limit the number of cores for a region. Trying to deploy a virtual machine with more cores than permitted results in error message stating the quota was exceeded.

To resolve this issue, delete the deployments that are no longer needed by using the Azure portal, CLI, or PowerShell.

For more information, see [Resolve errors for resource quotas](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quota-errors).

## Error: The maximum node exceeded the available cores in this region

Your subscription may be configured to limit the number of cores for a region. Trying to deploy a resource with more cores than permitted results in error message stating the quota was exceeded.

To request a quota increase, follow these steps:

1. Go to the [Azure portal](https://portal.azure.com), and select **Help + support**.

1. Select **New support request**.

1. On the **Basics** tab of the **New support request** page, provide the following information:

   * **Issue type:** Select **Service and subscription limits (quotas)**.
   * **Subscription:** Select the subscription you want to modify.
   * **Quota type:** Select **HDInsight**.

For more information, see [Create a support ticket to increase core](hdinsight-capacity-planning.md#quotas).

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
