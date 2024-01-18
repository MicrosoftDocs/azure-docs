---
title: View protected items and perform actions
description: Learn how to view protected items and perform actions
ms.topic: tutorial
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
ms.date: 11/15/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# View protected items and perform actions (preview)

This tutorial describes how to view your datasources that are protected by one or more solutions and perform actions on them from Azure Business Continuity (ABC) center (preview).

## Prerequisites

Before you start this tutorial:

- [Review supported regions for ABC center](business-continuity-center-support-matrix.md).
- You need to have permission on the resources to view them in ABC center.

## View protected items

As a business continuity and disaster recovery (BCDR) admin, identify and configure protection for critical resources that don't have backup or replication configured. You can also view their protection details.
  
Azure Business Continuity center provides you with a centralized and at scale view for overseeing your protection landscape, offering a unified perspective across various solutions. 

Follow these steps to view your protected items:

1.	In Azure Business Continuity center, select **Protected items** under **Protection inventory**.

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/select-protected-items.png" alt-text="Screenshot shows the selection of protected items.":::

2.	In this view, you can see a list of all the protected items across the supported solution across the subscription, resource groups, location, type, and so on, along with their protection status.

3.	Azure Business Continuity allows you to change the default view using a scope picker. Select the **Change** option beside the **Currently showing: details** displayed at the top.

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/change-scope.png" alt-text="Screenshot shows the selection of change scope from scope picker." lightbox="./media/tutorial-view-protected-items-and-perform-actions/change-scope.png":::

4.	To change the scope for **Security posture** view from the scope picker, select the required options:
    - **Resource managed by:**
        - **Azure resource**: resources managed by Azure
        - **Non-Azure resources**: resources not managed by Azure
    - **Resource status**: 
        - **Active resources**: Resources that are currently active, which are not deleted.
        - **Deprovisioned resources** - Describes resources that no longer exist, yet their backup and recovery points are retained.
    - **Protected item details**:  
        - **Protection status** - protection status of protected item in primary and secondary regions
        - **Retention details**: Retention details for protected items

5.	To effectively look for specific items, you can utilize various filters, such as subscriptions, resource groups, location, resource type, and so on. 

6.	Summary cards display an aggregated count for each security level, considering the applied filters. These cards can be selected to refine the filtering of the Protected items table.

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/summary-cards.png" alt-text="Screenshot shows the selection of summary cards." lightbox="./media/tutorial-view-protected-items-and-perform-actions/summary-cards.png":::

7.	You can also **search** by specific item name to get information specific to it.

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/search-item-name.png" alt-text="Screenshot shows the selection for search item name." lightbox="./media/tutorial-view-protected-items-and-perform-actions/search-item-name.png":::

8.	Use **Select columns** from the menu available at the top of the views to add or remove columns. 

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/select-columns-from-menu.png" alt-text="Screenshot shows the select columns selection on the menu." lightbox="./media/tutorial-view-protected-items-and-perform-actions/select-columns-from-menu.png":::

9.	Azure Business Continuity center provides in-built help to learn more about the protected item view and guidance on protection. Select **Learn more about the importance of protection in both regions and status evaluation** to access it. 

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/learn-more-about-protected-item.png" alt-text="Screenshot shows learn more protected item view and guidance on protection selection." lightbox="./media/tutorial-view-protected-items-and-perform-actions/learn-more-about-protected-item.png":::

10.	The help provides guidance on the various security levels and the settings that are required to meet each level. 

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/learn-more-guidance.png" alt-text="Screenshot shows learn more guidance pane." lightbox="./media/tutorial-view-protected-items-and-perform-actions/learn-more-guidance.png":::

11.	The **Protected items details** table shows the protection status for each protected item in the primary and secondary regions.
    - **Resource name**: Lists the underlying resource that is protected.
    - **Protected item**: Shows the name of the protected resource.
    - **Configured solutions**: Shows the number of solutions protecting the resource.
    - **Protection status**: Protected items should be recoverable in both the primary and secondary regions. Protection status in the primary region refers to the region in which datasource is hosted, and Protection status in secondary region refers to the paired or target region in which datasource can be recovered in case the primary region isn't accessible.
    
        The protection status values can be Pending protection (protection is triggered and is in-progress), Protection disabled (protection has been disabled, for example, protection is in soft-deleted state like in the case of Azure Backup) or Protection paused (protection is stopped; however, the protection data will be retained as per solution provider), or Protected. When the datasource is protected by multiple solutions (that is, Configured solutions >= 2), the Protection Status for an item is computed in the following order:

       - When one or more solutions indicate that the protection status is disabled, then the protected item status is shown as **Protection disabled**.
       - When one or more solutions indicate that the protection status is paused, then the protected item status is shown as **Protection paused**.
       - When one or more solutions indicate that the protection status is pending, then the protected item status is shown as **Pending protection**.
       - When all the configured solutions indicate that the protection status is protected, then the protected item status is shown as **Protected**.
       - If there's no protection for a datasource in primary or secondary region, then the protected item status for that region is shown as **Not protected**.
       - For example, if a resource is protected by both Azure Backup (with status **Protection paused**) and Azure Site Recovery (with status **Protected**), then the protection status for the region displays **Protection paused**.

12.	Under **Scope**, when you choose the retention details, the view loads the retention information for the protected items. The Protected items retention table shows the retention details for each protected item in the primary and secondary regions.
    - **Resource name**: Lists the underlying resource that is protected.
    - **Protected item**: Shows the name of the protected resource.
    - **Configured solutions**: Shows the number of solutions protecting the resource.
    - Retention in primary
    - Retention in secondary

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/protected-items-retention-table.png" alt-text="Screenshot shows the protected items in the retention table." lightbox="./media/tutorial-view-protected-items-and-perform-actions/protected-items-retention-table.png":::

## View Protected item details

To view additional details for a specific protected item, follow these steps:

1.	In the Azure Business Continuity center, select **Protected items** under **Protection inventory**. 

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/select-protected-items.png" alt-text="Screenshot showing the selection of protected items.":::

2.	You can select the item name or select the more icon **…** > **View details** action menu to navigate and view further details for an item. 

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/select-view-details.png" alt-text="Screenshot shows the view details selection." lightbox="./media/tutorial-view-protected-items-and-perform-actions/select-view-details.png":::

3.	On the item details view, you can see more information for item.

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/item-details-view.png" alt-text="Screenshot shows the item details view." lightbox="./media/tutorial-view-protected-items-and-perform-actions/item-details-view.png":::

4.	The view also allows you to change the default view using the **scope picker** from **Currently showing: Protection status details**, select **Change**.

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/select-protection-status-details.png" alt-text="Screenshot shows protection status details button selected in Change scope." lightbox="./media/tutorial-view-protected-items-and-perform-actions/select-protection-status-details.png":::

5.	To change the scope for **Security posture** view from the scope-picker, select the required options:
    - **Protection status** - protection status of the protected item in primary and secondary regions
    - **Retention details** - retention details for protected items
    - **Security posture details** - security details for protected items
    - **Alert details** - alerts fired details for protected items
    - **Health details** - health details for protected items 

## Perform actions

With the protected items view, you can choose to perform actions from:

1.	The menu available at the top of the view for actions like configure protection, recover, and so on. Using this option allows you to select multiple data sources.

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/configure-action-recover.png" alt-text="Screenshot shows the configure action and recover selection on the menu." lightbox="./media/tutorial-view-protected-items-and-perform-actions/configure-action-recover.png":::

2.	The menu on individual items in Protected items view. This option allows you to perform actions for the single resource.

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/protected-items-view.png" alt-text="Screenshot shows the protected items view." lightbox="./media/tutorial-view-protected-items-and-perform-actions/protected-items-view.png":::

3.	When **Solutions filter** is set to **ALL**, common actions across the solutions are available on the item like 
    - **Enhance protection** – Allows you to protect the items with the other solutions than the ones that are already used to protect the item. 
    - **Recover** – Allows you to perform the available recovery actions for the solutions with which the item is protected, that is, configured solutions.
    - **View details** – Allows you to view more information for the protected item. 

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/select-solution-filter.png" alt-text="Screenshot shows the select solution filter selection." lightbox="./media/tutorial-view-protected-items-and-perform-actions/select-solution-filter.png":::

4.	Choose a specific solution in the filter and notice solution specific actions command bar (appears over the protected items table and on the Protected item) by selecting the more icon **…** corresponding to the specific item.

    :::image type="content" source="./media/tutorial-view-protected-items-and-perform-actions/select-more-icon.png" alt-text="Screenshot shows the select more icon view." lightbox="./media/tutorial-view-protected-items-and-perform-actions/select-more-icon.png":::

## Next steps

For more information about Azure Business Continuity center and how it works, check out [Configure protection from ABC center](./tutorial-configure-protection-datasource.md).
