---
title: Filter and view subscriptions
description: This article explains how to filter and view subscriptions in the Azure portal.
author: bandersmsft
ms.reviewer: sgautam
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 03/21/2024
ms.author: banders
---

# Filter and view subscriptions

When you view subscriptions on the Subscriptions page, you see a list of subscriptions that you have access to. Two filters affect how you view the list of subscriptions on the Subscriptions page:

- Global subscription filter
- Subscriptions list filter

## Global subscription filter

The global subscription filter is the default subscriptions filter. You access it from the filter in the top-left area of the Subscriptions page and then you select a link labeled **global subscriptions filter**. You use the global subscription filter to view every subscription that you have access to with the **Select all** option.

The filter that you set with the global subscription filter _persists_. In other words, the applied filter affects how subscriptions appear in other views until you update the filter.

>[!TIP]
> Use the global filter **Select all** option when you want to always view every subscription that you have permission to view.

### Apply a global subscription filter

When you apply the global subscription filter, you can choose either **Select all** or a subset of subscriptions. By default, **Select all** is applied.

1. In the Azure portal, navigate to **Subscriptions**.
2. In the top left area of the page, select the filter option.
3. Select the link labeled **global subscriptions filter**.  
    :::image type="content" source="./media/filter-view-subscriptions/global-subscriptions-filter-link.png" alt-text="Screenshot showing the global subscriptions filter link." lightbox="./media/filter-view-subscriptions/global-subscriptions-filter-link.png" :::
4. On the **Portal settings | Directory + subscriptions** page, under **Default subscription** filter, select the **Select all** option or select a subset of subscriptions.  
    :::image type="content" source="./media/filter-view-subscriptions/default-subscription-filter.png" alt-text="Screenshot showing the default subscription filter." lightbox="./media/filter-view-subscriptions/default-subscription-filter.png" :::
5. Navigate to **Subscriptions** to view the list of subscriptions, based on your filter selection.

## Subscriptions list filter

The second filter is the filter on the Subscriptions page. The filter that you set there's temporary. So, it doesn't persist when you navigate away from the Subscriptions page or when you leave or sign out of the Azure portal.

When you navigate to the Subscriptions page, the list of subscriptions shown is based on the global subscription filter.

### Apply a subscriptions list a temporary filter

The **All** option is based on what is or what isn't already filtered by the global subscription filter. So, if you select **All** but you don't see the results you expect, you can clear or select the **Show only subscriptions selected in the global subscriptions filter** option.

1. In the Azure portal, navigate to **Subscriptions**.
2. In the top left area of the page, select the filter option.
3. In the list of subscriptions to filter, either select a subset of subscriptions or select **All**.
4. If needed, clear the **Show only subscriptions selected in the global subscriptions filter** option to temporarily override the global filter. Or, enable it to temporarily apply the global filter.  
    :::image type="content" source="./media/filter-view-subscriptions/show-only-subscriptions-global.png" alt-text="Screenshot showing the Show only subscriptions selected in the global subscription filter option." lightbox="./media/filter-view-subscriptions/show-only-subscriptions-global.png" :::
5. Select **Apply**.

## View subscriptions

1. In the Azure portal, navigate to **Subscriptions**.
2. The list of subscriptions is shown.
3. If needed, update the global subscription filter or apply a subscriptions list filter.  
    :::image type="content" source="./media/filter-view-subscriptions/subscription-list.png" alt-text="Screenshot showing the Subscriptions list." lightbox="./media/filter-view-subscriptions/subscription-list.png" :::

## Next steps
- Review the [Billing and subscription documentation](index.yml).