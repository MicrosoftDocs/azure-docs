---
title: Move Dev Box Pool to Alternate Region
description: Learn how to move Dev Box pools and individual Dev Boxes to a different region, align Dev Boxes with pool regions, and manage network connections in Microsoft Dev Box.
author: RoseHJM
contributors:
ms.topic: how-to
ms.date: 05/20/2025
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
---

# Move a pool to an alternate region

Admins use this option to move all existing or new dev boxes for a pool to an alternate region.

1. Go to the required project.
1. Go to the **Pools** tab.

The following options let you move the pool:

1. Edit the pool by selecting the three ellipses (**...**).
  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-edit-pool.png" alt-text="Screenshot of editing the pool by clicking on three ellipses.":::
  

1. Edit the region of the pool by updating the network connection. Moving between Microsoft-hosted and ANC is supported.

1. Choose whether the region move applies to existing Dev Boxes or only to newly created Dev Boxes.

  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-set-region.png" alt-text="Screenshot of editing the region of the pool via the network connection.":::
  

1. Select **Save** to apply the changes.

Option 2

1. Select the three ellipses (**...**) for the pool, then select the **Move to region** option.

  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-menu-option.png" alt-text="Screenshot of selecting 'Move to region' option from the pool ellipses.":::
  

1. Update the network connection and select whether to apply the move to existing or new Dev Boxes.

  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-menu-set-region.png" alt-text="Screenshot of updating the network connection and selecting between existing or new Dev Boxes.":::
  

1. Select **Move**.

Option 3

1. Select one or more pools in the Pools tab, then select **Move to region** in the top bar.

  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-multiple-pools.png" alt-text="Screenshot of selecting one or more pools and clicking 'Move to region' in the top bar.":::
  

  - Update the network connection & select between existing v/s new Dev Boxes

  
    :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-menu-set-region.png" alt-text="Screenshot of updating the network connection and selecting between existing or new Dev Boxes.":::
  

  - Select **Move**

## Move one or more Dev boxes to align them to the pool's region

If different Dev Boxes in the pool use different regions, align all Dev Boxes to the region associated with the pool.

1. Select the pool to view Dev Boxes.

1. Select one or more Dev Boxes to move.

  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-existing-dev-box.png" alt-text="Screenshot of selecting one or more Dev Boxes to move.":::
  

1. Select the three ellipses, and then select the **Move** option.

  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-single-dev-box.png" alt-text="Screenshot of selecting the 'Move' option from the ellipses.":::
  

   Or, select the **Move** option in the top bar.

  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-move-dev-boxes.png" alt-text="Screenshot of clicking the 'Move' option in the top bar.":::
  

1. The Dev Box moves to the region that the pool is configured with.

## Developer experience

When a Dev Box is moved, you see the following message:

  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-tile-status.png" alt-text="Screenshot of the message that appears when a Dev Box is moved.":::
  

Notes:

- You need the project admin role to move a Dev Box to another region. Make sure you have the right permission before you use this feature.

- Changing the region of the Dev Box pool uses a different network connection. Dev Boxes aren't available while the move is in progress.

- Admins can track move progress in the notifications section.
  
   :::image type="content" source="media/how-to-move-dev-box-pool-region/region-moves-notification.png" alt-text="Screenshot of tracking move progress in the notifications section.":::

## Related content

- [Manage a dev box pool in Microsoft Dev Box](how-to-manage-dev-box-pools.md)