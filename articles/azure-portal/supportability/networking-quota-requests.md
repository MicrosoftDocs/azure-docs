---
title: Increase networking quotas
description: Learn how to request a networking quota increase in the Azure portal.
ms.date: 12/02/2021
ms.topic: how-to
---

# Increase networking quotas

This article shows how to request increases for VM-family vCPU quotas in the [Azure portal](https://portal.azure.com).

To view your current networking usage and quota in the Azure portal, open your subscription, then select **Usage + quotas**. You can also use the following options to view your network usage and limits.

- [Usage CLI](/cli/azure/network#az_network_list_usages)
- [PowerShell](/powershell/module/azurerm.network/get-azurermnetworkusage)
- [The network usage API](/rest/api/virtualnetwork/virtualnetworks/listusage)

You can request an increase in the Azure portal by using **Help + support** or in **Usage + quotas** for your subscription.

> [!Note]
> To change the default size of **Public IP Prefixes**, select **Min Public IP InterNetwork Prefix Length** from the dropdown list.

## Request networking quota increase by using Help + support

Follow the instructions below to create a networking quota increase request by using **Help + support** in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com), and [open a new support request](how-to-create-azure-support-request.md).

1. For **Issue type**, choose **Service and subscription limits (quotas)**.

1. Select the subscription that needs an increased quota.

1. Under **Quota type**, select **Networking**. Then select **Next**.

   :::image type="content" source="media/networking-quota-request/new-networking-quota-request.png" alt-text="Screenshot of a new networking quota increase request in the Azure portal.":::

1. In the **Problem details** section, select **Enter details**. Follow the prompts to select a deployment model, location, the resources to include in your request, and the new limit you would like on the subscription for those resources. When you're finished, select **Save and continue** to continue creating your support request.

    :::image type="content" source="media/networking-quota-request/quota-details-network.png" alt-text="Screenshot of the Quota details screen for a networking quota increase request in the Azure portal.":::

1. Complete the rest of the **Additional information** screen, and then select **Next**.

1. On the **Review + create** screen, review the details that you'll send to support, and then select **Create**.

## Request networking quota increase from Usage + quotas

Follow these instructions to create a networking quota increase request from **Usage + quotas** in the Azure portal.

1. From https://portal.azure.com, search for and select **Subscriptions**.

1. Select the subscription that needs an increased quota.

1. Select **Usage + quotas**.

1. In the upper right corner, select **Request increase**.

1. Follow the steps above (starting at step 4) to complete your request.

## Next steps

- Review details on [networking limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).
- Learn about [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).