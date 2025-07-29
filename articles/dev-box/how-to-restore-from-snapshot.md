---
title: Recover Your Dev Box with Snapshots
description: Learn how Dev Box uses manual and automatic snapshots to enable you to recover your dev box from critical issues. Restore your dev box quickly and efficiently.
#customer intent: As a developer, I want to restore my dev box from a snapshot so that I can perform testing, or quickly recover from critical issues.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: article
ms.date: 05/11/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/11/2025
  - build-2025
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

## How does Dev Box manage snapshots?

Microsoft Dev Box helps you recover from critical issues by using snapshots that allow you to revert to a previous state if needed. Snapshots are point-in-time copies of your dev box. If something goes wrong, you can restore your dev box to a known good state without losing progress or spending time troubleshooting the issue.

### Manual snapshots

Take manual snapshots of your dev box to create restore points before making significant changes to your dev box, such as installing new software or making configuration changes. You can use manual snapshots in addition to the automatic snapshots taken by Microsoft Dev Box.

### Automatic snapshots

Microsoft Dev Box automatically takes short snapshots every 12 hours and long snapshots every seven days. It retains snapshots for 28 days on a rotating basis, overwriting the oldest snapshot when necessary. 

The retention period includes 10 short snapshots and 4 long snapshots, totaling 14 snapshots over 28 days. Once the maximum number of snapshots is reached, the oldest one is deleted. Short snapshots and long snapshots operate independently.

## Take a manual snapshot of your dev box

You can take a manual snapshot of your dev box to create a restore point before making significant changes, such as installing new software or making configuration changes.

This feature is currently in preview. You can try it out by following these steps:

1. Sign in to the [developer portal](https://aka.ms/TryManualSnapshot).

1. On the dev box that you want to take a snapshot of, select the actions menu, and then select **Take snapshot**.

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-actions-menu-snapshot.png" alt-text="Screenshot of the developer portal, showing the actions menu for a dev box with the Take snapshot option highlighted.":::

1. Select **Take snapshot** to confirm.

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-confirm-snapshot.png" alt-text="Screenshot of the developer portal, showing the Take snapshot dialog box with Yes, I want to take a snapshot of this dev box highlighted.":::

1. The dev box tile displays the progress of the snapshot operation in the developer portal, showing the message **Taking snapshot**.

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-snapshot-progress.png" alt-text="Screenshot of the developer portal, showing a dev box tile with the message Taking snapshot.":::

1. When the snapshot process is complete, the dev box tile displays the message **Snapshot successful**.

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-snapshot-successful.png" alt-text="Screenshot of the developer portal, showing a dev box tile with the message Snapshot created.":::

## Restore your dev box from a snapshot

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. On the dev box that you want to restore, select the actions menu, and then select **Restore**.

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-actions-menu-restore.png" alt-text="Screenshot of the developer portal, showing the actions menu for a dev box with the Restore option highlighted.":::

1. Read the information about the effect of restoring your dev box. The restore process deletes data and apps added since the chosen snapshot. The restore process can take hours. Select **Yes, I want to restore this dev box** to confirm.

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-confirm-restore.png" alt-text="Screenshot of the developer portal, showing the Restore dialog box with the Restore to list highlighted."::: 

1. Select the desired restore point from the list of available snapshots. **Manual snapshots** are listed first, followed by **Automatic snapshots**. The most recent snapshot is at the top of the list. 

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-snapshot-list.png" alt-text="Screenshot of the developer portal, showing the list of manual and automatic snapshots available to restore.":::

1. Verify that the snapshot you want to restore from is selected, and then select **Restore**.

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-select-restore-point.png" alt-text="Screenshot of the developer portal, showing the Restore dialog box with Yes, I want to restore this dev box highlighted.":::

1. You can check the progress of the restore operation on the dev box tile in the developer portal. 

   :::image type="content" source="media/how-to-restore-from-snapshot/dev-box-restore-progress.png" alt-text="Screenshot of the developer portal, showing a dev box tile with the message Restoring dev box.":::

1. When the restoration is complete, you receive an email notification that your dev box is restored and ready to use. 

## Related content

- [Manage a dev box by using the Microsoft Dev Box developer portal](how-to-create-dev-boxes-developer-portal.md)