---
title:  View quotas
description: Learn how to view quotas in the Azure portal.
ms.date: 05/02/2023
ms.topic: how-to
---

# View quotas

The **Quotas** page in the Azure portal is the centralized location where you can view your quotas. **My quotas** provides a comprehensive, customizable view of usage and other quota information so that you can assess quota usage. You can also request quota increases directly from **My quotas**.

To view the **Quotas** page, sign in to the [Azure portal](https://portal.azure.com) and enter "quotas" into the search box, then select **Quotas**.

> [!TIP]
> After you've accessed **Quotas**, the service will appear at the top of [Azure Home](https://portal.azure.com/#home) in the Azure portal. You can also [add **Quotas** to your **Favorites** list](../azure-portal/azure-portal-add-remove-sort-favorites.md) so that you can quickly go back to it.

## View quota details

To view detailed information about your quotas, select **My quotas** in the left pane on the **Quotas** page.

> [!NOTE]
> You can also select a specific Azure provider from the **Quotas** overview page to view quotas and usage for that provider. If you don't see a provider, check the [Azure subscription and service limits page](../azure-resource-manager/management/azure-subscription-service-limits.md) for more information.

On the **My quotas** page, you can choose which quotas and usage data to display. The filter options at the top of the page let you filter by location, provider, subscription, and usage. You can also use the search box to look for a specific quota. Depending on the provider you select, you may see some differences in filters and columns.

:::image type="content" source="media/view-quotas/my-quotas.png" alt-text="Screenshot of the My quotas screen in the Azure portal.":::

In the list of quotas, you can toggle the arrow shown next to **Quota** to expand and close categories. You can do the same next to each category to drill down and create a view of the information you need.

## Next steps

- Learn more in [Quota overview](quotas-overview.md).
- about [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).
- Learn how to request increases for [VM-family vCPU quotas](per-vm-quota-requests.md), [vCPU quotas by region](regional-quota-requests.md), [spot vCPU quotas](spot-quota.md), and [storage accounts](storage-account-quota-requests.md).
