---
title: Filter and view subscriptions
description: This article explains how to filter and view subscriptions in the Azure portal.
author: preetione
ms.reviewer: presharm
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 05/01/2025
ms.author: presharm
---

# Filter and view subscriptions

When you view subscriptions on the Subscriptions page, you see a list of subscriptions that you have access to. Two filters affect how you view the list of subscriptions on the Subscriptions page:

- **Portal setting** subscription filter
- **Subscriptions** list filter

Subscriptions are shown for the directory that you're signed in to. If you have access to multiple directories, you can switch directories to view subscriptions for each directory.

## Portal setting subscription filter

The portal setting filter is the default subscriptions filter. You access it from the filter in the top-left area of the Subscriptions page and then you select a link labeled **portal setting** filter. You use the portal setting subscription filter to view every subscription that you have access to with the **Select all** option.

The filter that you set with the portal setting filter _persists_. In other words, the applied filter affects how subscriptions appear in other views until you update the filter.

### Apply the portal setting subscription filter

When you apply the portal setting subscription filter, you can choose either **Select all** or a subset of subscriptions. By default, **Select all** is applied.

1. In the Azure portal, navigate to **Subscriptions**.
2. In the top left area of the page, select the **Subscriptions** filter option.
3. Select the link labeled **portal setting**.  
    :::image type="content" source="./media/filter-view-subscriptions/global-subscriptions-filter-link.png" alt-text="Screenshot showing the portal setting filter link." lightbox="./media/filter-view-subscriptions/global-subscriptions-filter-link.png" :::
4. On the **Portal settings | Directory + subscriptions** page, under **Default subscription** filter, select the **Select all** option or select a subset of subscriptions.  
    :::image type="content" source="./media/filter-view-subscriptions/default-subscription-filter.png" alt-text="Screenshot showing the default subscription filter." lightbox="./media/filter-view-subscriptions/default-subscription-filter.png" :::
5. Navigate to **Subscriptions** to view the list of subscriptions, based on your filter selection.

## Subscriptions list filter

The second filter is the filter on the Subscriptions page. The filter that you set there's temporary. So, it doesn't persist when you navigate away from the Subscriptions page or when you leave or sign out of the Azure portal.

When you navigate to the Subscriptions page, the list of subscriptions shown is based on the portal setting subscription filter.

### Apply a subscriptions list a temporary filter

The **All** option is based on what is or what isn't already filtered by the portal setting subscription filter.

1. In the Azure portal, navigate to **Subscriptions**.
2. In the top left area of the page, select the **Subscriptions** filter option.
3. In the list of subscriptions to filter, either select **All subscriptions** or **Filtered using portal setting**.
4. Select **Apply**.

## View subscriptions

1. In the Azure portal, navigate to **Subscriptions**.
2. The list of subscriptions is shown.
3. If needed, update your portal setting filter or apply a subscriptions list filter.  
    :::image type="content" source="./media/filter-view-subscriptions/subscription-list.png" alt-text="Screenshot showing the Subscriptions list." lightbox="./media/filter-view-subscriptions/subscription-list.png" :::

## Next steps
- Review the [Billing and subscription documentation](index.yml).