---
title: Restore your dev box from a snapshot
description: Learn how to restore your dev box from a snapshot in Microsoft Dev Box to recover from critical issues. Restore your dev box quickly and efficiently.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: article
ms.date: 03/13/2025

#customer intent: As a developer, I want to restore my dev box from a snapshot so that I can perform testing, or quickly recover from critical issues.
---

# Restore your dev box from a snapshot

This article explains how to restore your dev box to a previous state using a snapshot. Snapshots are point-in-time copies of your dev box that allow you to revert to a previous state if needed. Microsoft Dev Box automatically takes snapshots of your dev box, ensuring that you have recent restore points available. 

Restore your dev box from a snapshot to overcome critical issues, recover lost data, or fix corruption, ensuring minimal downtime and maximum productivity.

You can also use snapshots during the testing phase of a project. If you're testing new code or configurations and something goes wrong, restoring from a snapshot allows you to return to a known good state without losing progress or spending time troubleshooting the issue.

Dev Box automatically takes snapshots, retains them for each dev box, and overwrites the oldest snapshot when necessary. You can restore your dev box to any of the available snapshots.

## Prerequisites

| **Product**       | **Requirements**  |
|-------------------|-------------------|
| **Microsoft Dev Box**   | - Access to a dev box in the developer portal |

## Restore your dev box from a snapshot

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. On the dev box that you want to restore, select the actions menu, and then select **Restore**.

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-actions-menu-restore.png" alt-text="Screenshot of the developer portal, showing the actions menu for a dev box with the Restore option highlighted.":::

1. Read the information about the effect of restoring your dev box. The restore process deletes data and apps added since the chosen snapshot. The restore process can take hours. Select **Yes, I want to restore this dev box** to confirm.
 
   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-confirm-restore.png" alt-text="Screenshot of the developer portal, showing the Restore dialog box with the Restore to list highlighted."::: 

1. Select the desired restore point from the list of available snapshots.

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-select-restore-point.png" alt-text="Screenshot of the developer portal, showing the Restore dialog box with Yes, I want to restore this dev box highlighted.":::

1. You can check the progress of the restore operation on the dev box tile in the developer portal. 

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-restore-progress.png" alt-text="Screenshot of the developer portal, showing a dev box tile with the message Restoring dev box.":::
 
1. When the restoration is complete, you receive an email notification that your dev box is restored and ready to use. 

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-restore-email.png" alt-text="Screenshot of an email notification informing you that your dev box is restored and ready to use.":::

## Related content

- [Manage a dev box by using the Microsoft Dev Box developer portal](how-to-create-dev-boxes-developer-portal.md)