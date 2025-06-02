---
title: Move Dev Box Pools and Dev Boxes to Another Region
description: Learn how to move Dev Box pools and individual dev boxes to a different region, align dev boxes with pool regions, and manage network connections in Microsoft Dev Box.
author: RoseHJM
contributors: null
ms.topic: how-to
ms.date: 05/20/2025
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/20/2025
---

# Move Dev Box pools and dev boxes to an alternate region

Move Dev Box pools and individual dev boxes to a different region to optimize performance, meet compliance requirements, and manage network connections more effectively. This article explains how you can move Dev Box pools or dev boxes to another region, align dev boxes with their pool's region, and track the move process.

You can move Dev Box pools and individual dev boxes to a different region. This action lets you align dev boxes with the pool's region or change the network connection. Changing the region of the Dev Box pool uses a different network connection. Dev boxes aren't available while the move is in progress.

## Prerequisites
- You need the **Project Admin** role to move a dev box to another region. Check that you have the right permissions before using this feature.

## Move a pool by using the Azure portal

You can use this option to move all existing or new dev boxes for a pool to a different region.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the project that contains the pool you want to move.
1. Go to the **Pools** tab.

From the Pools page, you can move the pool in the following ways:
- **Edit the pool settings**
- **Use the Move to region menu option**
- **Move multiple pools at once**

### Edit the pool settings

To move a single pool to a different region, you can edit the pool settings. Use this option to change the network connection, and select whether to apply the region move to existing dev boxes or only to new dev boxes.

1. Select the three ellipses (**...**) for the pool, then select the edit option.
  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-edit-pool.png" alt-text="Screenshot of editing the pool by selecting the three ellipses.":::

1. Update the network connection to change the region of the pool. You can move between Microsoft-hosted connections and Azure Network Connections (ANC).

1. Choose whether to apply the region move to existing dev boxes or only to new dev boxes.
  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-set-region.png" alt-text="Screenshot of editing the region of the pool using the network connection.":::

1. Select **Save** to apply the changes.

### Use the **Move to region** menu option
This option presents only the settings that affect the region change: the network connection, and whether to apply the region move to existing dev boxes or only to new dev boxes.

1. Select the three ellipses (**...**) for the pool, then select **Move to region**.
  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-menu-option.png" alt-text="Screenshot of selecting the 'Move to region' option from the pool ellipses.":::

1. Update the network connection and choose whether to apply the move to existing or new dev boxes.
  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-menu-set-region.png" alt-text="Screenshot of updating the network connection and choosing between existing or new dev boxes.":::
  
1. Select **Move**.

### Move multiple pools at once
To move multiple pools at once, you can choose the pools you want to move, and then move them together. 

1. Select one or more pools in the **Pools** tab, then select **Move to region** in the top bar.

   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-multiple-pools.png" alt-text="Screenshot of selecting one or more pools and selecting 'Move to region' in the top bar.":::

1. Update the network connection and choose between existing or new dev boxes.

    :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-menu-set-region.png" alt-text="Screenshot of updating the network connection and choosing between existing or new dev boxes.":::

1. Select **Move**

## Monitor the move process
As a Project Admin, you can track move progress in the Azure portal notifications.

Select the **Notifications** icon in the top right corner of the Azure portal.
  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-notification.png" alt-text="Screenshot of tracking move progress in the notifications section.":::

## Move dev boxes to align to the pool's region

If different dev boxes in the pool use different regions, you can move them to align with the pool's region.  

1. Select the pool to view dev boxes.

1. Select one or more dev boxes to move.
  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-existing-dev-box.png" alt-text="Screenshot of selecting one or more dev boxes to move.":::
  
1. Select the three ellipses, and then select the **Move** option.

   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-single-dev-box.png" alt-text="Screenshot of selecting the 'Move' option from the ellipses.":::

   Or, select the **Move** option in the top bar.
 
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-move-dev-boxes.png" alt-text="Screenshot of clicking the 'Move' option in the top bar.":::
  
1. The dev box moves to the region that the pool is configured with.

## Track the progress of the move in the developer portal

When you move a Dev Box, you see the following message:
  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-tile-status.png" alt-text="Screenshot of the message that appears when a Dev Box is moved.":::

## Related content

- [Manage a dev box pool in Microsoft Dev Box](how-to-manage-dev-box-pools.md)