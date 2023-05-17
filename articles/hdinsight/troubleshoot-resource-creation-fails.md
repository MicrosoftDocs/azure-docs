---
title: Troubleshoot resource creation failures in Azure HDInsight
description: Common capacity issue errors and mitigation techniques are provided in this article.
ms.service: hdinsight
ms.topic: troubleshooting
ms.custom: seoapr2020
ms.date: 02/27/2023
---

# Troubleshoot resource creation failures in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight.

## Error: The deployment would exceed the quota of '800'

Azure has a quota limit of 800 deployments per resource group. Different quotas are applied per resource group, subscription, account, or other scopes. For example, your subscription may be configured to limit the number of cores for a region. Trying to deploy a virtual machine with more cores than permitted results in error message stating the quota was exceeded.

To resolve this issue, delete the deployments that are no longer needed by using the Azure portal, CLI, or PowerShell.

For more information, see [Resolve errors for resource quotas](../azure-resource-manager/templates/error-resource-quota.md).

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

[!INCLUDE [troubleshooting next steps](includes/hdinsight-troubleshooting-next-steps.md)]
