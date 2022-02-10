---
title:  View quotas
description: Learn how to view quotas and request increases in the Azure portal .
ms.date: 02/10/2022
ms.topic: how-to
---

# View quotas

The **Quotas** page in the Azure portal is the centralized location where you can view your quotas. **My quotas** provides a comprehensive, customizable view of usage and other quota information so that you can assess quota usage. You can also request quota increases directly from **My quotas**.

To view the **Quotas** page, sign in the to the [Azure portal](https://portal.azure.com) and enter "quotas" into the search box.

> [!TIP]
> After you've accessed **Quotas**, the service will appear at the top of the Home page in the Azure portal. You can also [add **Quotas** to your **Favorites** list](../azure-portal-add-remove-sort-favorites.md) so that you can quickly go back to it.

## View quota details

To view detailed information about your quotas, select **My quotas** in the left men on the **Quotas** page.

> [!NOTE]
> You can also select a specific Azure provider from the main **Quotas** page to view quotas and usage for that provider. If you don't see a provider, check the [Azure subscription and service limits page](../..//azure-resource-manager/management/azure-subscription-service-limits.md) for more information.

On the **My quotas** page, you can choose which quotas and usage data to display. The filter options at the top of the page let you filter by location, provider, subscription, and usage. You can also use the search box to look for a specific quota.

**insert image here**

Toggle the arrow next to Quotas to expand and close the categories based on your filter choice. You can do the same next to each category to drill down and create a view of the information you need.
The pencil icon indicates a quota that you can request an increase for. Clicking it opens the Quota details pane and you can enter an amount for the increase.
The support icon indicates that to request an increase for that quota, you must submit a support request. Clicking the icon opens a support form where you can enter the details of your request.

## Request quota increases

You can request quota increases directly from **My quotas**. The process for requesting an increase depends on the type of quota.

### Request an automatic increase from My quotas

Some quotas display a pencil icon. Select this icon to quickly request an increase for that quota.

After you select the pencil icon, enter the new limit for your request in the **Quota Details** pane, then select **Save and Continue**. After a few minutes, you'll see a status update confirming whether the increase was automatically approved. If you close **Quota details** before the update appears, you can check it later in the Azure Activity Log.

If your request wasn't automatically approved, you can select **Create a support request** so that your request can be evaluated by our support team.

### Create a support request

If the quota displays a support icon rather than a pencil, you'll need to create a support request in order to increase the quota. Selecting the support icon will take you to the **New support request** page, where you can enter details about your new request. A support engineer will then assist you with the quota increase request.

For more information about opening a support request, see [Create an Azure support request](how-to-create-azure-support-request.md).

## Next steps

- Learn about [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).
- Learn about other ways to request increases for [VM-family vCPU quotas](per-vm-quota-requests.md), [vCPU quotas by region](regional-quota-requests.md), and [spot vCPU quotas](spot-quota.md).
