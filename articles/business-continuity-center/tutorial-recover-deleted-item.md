---
title: Recover deleted item
description: Learn how to recover deleted item
ms.topic: article
ms.date: 11/15/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
---

# Recover deleted item (preview)

This tutorial describes the process to recover deleted items from the vault to ensure business continuity.

Azure Business Continuity center (preview) allows you to recover protected items, that is, restore backup or failover or test failover etc., for the replication of the datasources from various views such as Overview, protected items, and so on.

## Prerequisites

Before you start this tutorial:

- [Review the supported regions](business-continuity-center-support-matrix.md).
- [Review the supported actions](business-continuity-center-support-matrix.md).
- You need to have permission on the resources to view them in ABC center and recover them. 

## Initiate recovery for Azure VM

Follow these steps to initiate the recovery for Azure VMs:

1. Navigate to one of the views from Overview, Protected items, etc., and select **Recover** from the menu at the top of the view.

    :::image type="content" source="./media/tutorial-recover-deleted-item/select-recover-from-menu.png" alt-text="Screenshot shows the recover selection on the menu." lightbox="./media/tutorial-recover-deleted-item/select-recover-from-menu.png":::

2. On the Recover pane, choose **Resources managed by**, select the Datasource type for which you want to configure protection, and select the Solution (limited to Azure Backup and Azure Site Recovery in this preview) through which you want to recover the item.

    :::image type="content" source="./media/tutorial-recover-deleted-item/select-data-source-type.png" alt-text="Screenshot shows the selection of datasource type." lightbox="./media/tutorial-recover-deleted-item/select-data-source-type.png":::

3.	Based on the datasource type and the solution you select, the available recovery actions would change. For example, for Azure Virtual machine and Azure Backup, you can perform restore, file recovery, and restore to secondary region. For Azure Virtual machine and Azure Site Recovery, you can perform actions such as cleanup test failover, test failover, failover, commit, change recovery point,  and so on.

    :::image type="content" source="./media/tutorial-recover-deleted-item/select-from-available-recovery-actions.png" alt-text="Screenshot shows the selection of the available recovery actions." lightbox="./media/tutorial-recover-deleted-item/select-from-available-recovery-actions.png":::

4.	Click **Select** to select the item on which you want to perform the recovery action. 

    >[!Note]
    >Only the items on which the selected recovery action can be performed will be available to select.

    :::image type="content" source="./media/tutorial-recover-deleted-item/select-item-to-perform-recovery-action.png" alt-text="Screenshot shows the selection of item for recovery action."  lightbox="./media/tutorial-recover-deleted-item/select-item-to-perform-recovery-action.png":::

5.	Highlight the item from the list, and click **Select**.
6.	Select **Configure** to go to the solution-specific recover page.

## Next steps

[Monitor progress of recover action](tutorial-monitor-protection-summary.md).
