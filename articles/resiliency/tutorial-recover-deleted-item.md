---
title: Recover deleted item
description: Learn how to recover deleted item
ms.topic: tutorial
ms.date: 11/19/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.service: resiliency
ms.custom:
  - ignite-2023
  - ignite-2024
---

# Tutorial: Recover deleted item

This tutorial describes the process to recover deleted items from the vault to ensure resiliency.

Resiliency in Azure allows you to recover protected items (restore backup, failover, test failover, and more), for the replication of the datasources from various views such as Overview, protected items, and so on.

[!INCLUDE [Resiliency rebranding announcement updates.](../../includes/resiliency-announcement.md)]

## Prerequisites

Before you start the recovery process, ensure that the following prerequisites are met:

- [Review the supported regions](resiliency-support-matrix.md).
- [Review the supported actions](resiliency-support-matrix.md).
- You need to have permission on the resources to view them in Resiliency and recover them.

## Initiate recovery for Azure VM

To initiate the recovery for an Azure Virtual Machine (VM), follow these steps:

1. On **Resiliency**, go to **Protection inventory** > **Protected items**, and then select **Recover**.

    :::image type="content" source="./media/tutorial-recover-deleted-item/select-recover-from-menu.png" alt-text="Screenshot shows the selection of Recover option." lightbox="./media/tutorial-recover-deleted-item/select-recover-from-menu.png":::

2. On the Recover blade, choose **Resources managed by**, select the Datasource type for which you want to configure protection, and select the Solution (limited to Azure Backup and Azure Site Recovery) through which you want to recover the item.

    :::image type="content" source="./media/tutorial-recover-deleted-item/select-data-source-type.png" alt-text="Screenshot shows the selection of datasource type." lightbox="./media/tutorial-recover-deleted-item/select-data-source-type.png":::

   Based on the datasource type and the solution you select, the available recovery actions would change. For example, for Azure Virtual machine and Azure Backup, you can perform restore, file recovery, and restore to secondary region. For Azure Virtual machine and Azure Site Recovery, you can perform actions such as cleanup test failover, test failover, failover, commit, change recovery point,  and so on.

    :::image type="content" source="./media/tutorial-recover-deleted-item/select-from-available-recovery-actions.png" alt-text="Screenshot shows the selection of the available recovery actions." lightbox="./media/tutorial-recover-deleted-item/select-from-available-recovery-actions.png":::

3.	Click **Select** to select the item on which you want to perform the recovery action. 

    >[!Note]
    >Only the items on which the selected recovery action can be performed will be available to select.

    :::image type="content" source="./media/tutorial-recover-deleted-item/select-item-to-perform-recovery-action.png" alt-text="Screenshot shows the selection of item for recovery action."  lightbox="./media/tutorial-recover-deleted-item/select-item-to-perform-recovery-action.png":::

4.	Highlight the item from the list, and click **Select**.
5.	Select **Configure** to go to the solution-specific recover page.

## Next steps

[Monitor progress of recover action](tutorial-monitor-protection-summary.md).
