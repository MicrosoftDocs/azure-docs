---
title: Increase networking quotas
description: Learn how to request a networking quota increase in the Azure portal.
ms.date: 07/22/2022
ms.topic: how-to
---

# Increase networking quotas

This article shows how to request increases for networking quotas from [Azure Home](https://portal.azure.com) or from **My quotas**, a centralized location where you can view your quota usage and request quota increases.

For quick access to request an increase, select **Quotas** on the Azure Home page.

:::image type="content" source="media/networking-quota-request/quotas-icon.png" alt-text="Screenshot of the Quotas icon in the Azure portal.":::

If you don't see **Quotas** on Azure Home, type "quotas" in the search box, then select **Quotas**. The **Quotas** icon will then appear on your Home page the next time you visit.

You can also use the following options to view your network quota usage and limits:

- [Azure CLI](/cli/azure/network#az-network-list-usages)
- [Azure PowerShell](/powershell/module/azurerm.network/get-azurermnetworkusage)
- [REST API](/rest/api/virtualnetwork/virtualnetworks/listusage)
- **Usage + quotas** (in the left pane when viewing your subscription in the Azure portal) 

Based on your subscription, you can typically request increases for these quotas:

- Public IP Addresses
- Public IP Addresses - Standard
- Public IPv4 Prefix Length

## Request networking quota increases

Follow these steps to request a networking quota increase from Azure Home.

1. From [Azure Home](https://portal.azure.com), select **Quotas** and then select **Microsoft.Network**.

1. Find the quota you want to increase, then select the support icon.

   :::image type="content" source="media/networking-quota-request/quota-support-icon.png" alt-text="Screenshot showing the support icon for a networking quota.":::

1. In the **New support request** form, on the **Problem description** screen, some fields will be pre-filled for you. In the **Quota type** list, select **Networking**, then select **Next**.

   :::image type="content" source="media/networking-quota-request/new-networking-quota-request.png" alt-text="Screenshot of a networking quota support request in the Azure portal.":::

1. On the **Additional details** screen, under P**rovide details for the request**, select **Enter details**.

1. In the **Quota details** pane, enter the information for your request.

   > [!IMPORTANT]
   > To increase a static public IP address quota, select **Other** in the **Resources** list, then specify this information in the **Details** section.

   :::image type="content" source="media/networking-quota-request/quota-details-network.png" alt-text="Screenshot of the Quota details pane for a networking quota increase request.":::

1. Select **Save and continue**. The information you entered will appear in the **Request summary** under **Problem details**.

1. Continue to fill out the form, including your preferred contact method. When you're finished, select **Next**.
1. Review your quota increase request information, then select **Create**.

After your networking quota increase request has been submitted, a support engineer will contact you and assist you with the request.

For more information about support requests, see [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

## Next steps

- Review details on [networking limits](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).
- Learn about [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).