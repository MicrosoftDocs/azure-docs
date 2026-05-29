---
title: Enable Dev Box Auto-Delete to Control Costs
description: Dev Box autodeletion helps you control costs by removing unused Dev Boxes. Learn how to enable, configure, and cancel autodeletion in Azure.
#customer intent: As a Dev Box admin, I want to enable auto-deletion for unused Dev Boxes so that I can control costs in my Azure subscription.
author: RoseHJM
contributors: null
ms.topic: how-to
ms.date: 07/11/2025
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:07/11/2025
  - ai-gen-description
---

# Configure Microsoft Dev Box autodeletion

Microsoft Dev Box Auto Delete (Preview) helps organizations manage resources and control costs by automatically deleting unused Dev Boxes. This article explains how to enable the feature, configure autodeletion settings, and cancel scheduled deletions in both the Azure portal and developer portal. Use these steps to optimize Dev Box usage in your Azure subscription.

## Prerequisites

- Microsoft Dev Box configured with a dev center and at least one project.

## Enable the preview feature

While the Dev Box Auto Delete feature is in Preview, you must manually enable it in your Azure subscription. Follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the Azure subscription where you want to enable Dev Box autodeletion.
1. In the left menu, select **Preview features**.
1. In the search box, type "Dev Box Auto".
1. Select **Dev Box Auto Delete Preview**, and then select **Register**.

   :::image type="content" source="media/how-to-auto-delete-dev-box/dev-box-auto-delete-enable-preview.png" alt-text="Screenshot of the Azure portal showing the Preview features pane with Dev Box Auto Delete Preview selected." lightbox="media/how-to-auto-delete-dev-box/dev-box-auto-delete-enable-preview.png":::

   After you register the feature, it will be available for use in your subscription.

## Set up autodeletion in a project

To configure autodeletion for unused dev boxes in a project, follow these steps in the Azure portal:

1. Open an existing Dev Box project, or create a new one in your subscription.
1. In the left menu, under **Settings**, select **Dev box settings**.
1. On the **Dev box settings** page, in the **Cost controls** section, select **Automatically delete unused dev boxes**.

   :::image type="content" source="media/how-to-auto-delete-dev-box/dev-box-auto-delete-enable.png" alt-text="Screenshot of the Azure portal showing the option to enable automatic deletion of unused dev boxes in project settings." lightbox="media/how-to-auto-delete-dev-box/dev-box-auto-delete-enable.png":::
 
1. When automatic deletion is enabled, you can configure the following options:
   - **Inactivity threshold**: Enter the number of inactive days before a Dev Box is scheduled for automatic deletion (for example, 30 days).
   - **Grace period**: Enter the number of days the developer or admin has to respond and keep the Dev Box (for example, 30 days).

   :::image type="content" source="media/how-to-auto-delete-dev-box/dev-box-auto-delete-settings.png" alt-text="Screenshot of the Dev box settings page in Azure portal showing the cost controls section with autodeletion options." lightbox="media/how-to-auto-delete-dev-box/dev-box-auto-delete-settings.png"::: 

1. Select **Apply**.

## Cancel scheduled deletions in the Azure portal

To cancel a scheduled deletion in the Azure portal, follow these steps:

1. Go to the pool that has your Dev Box scheduled for deletion.
1. Select that pool to view its Dev Boxes. You need Project Admin access to finish this step.
1. Select the ellipses (**...**) next to the Dev Box scheduled for deletion.
1. Select **Cancel deletion**. 

   :::image type="content" source="media/how-to-auto-delete-dev-box/dev-box-azure-portal-cancel-auto-delete.png" alt-text="Screenshot of the Azure portal showing the pool details and the cancel deletion option for a Dev Box." lightbox="media/how-to-auto-delete-dev-box/dev-box-azure-portal-cancel-auto-delete.png":::

The selected dev box isn't deleted.

## Cancel scheduled deletions in the developer portal

After reaching the inactivity threshold, you'll get an email notification warning you that your Dev Box is scheduled for deletion. 

:::image type="content" source="media/how-to-auto-delete-dev-box/dev-box-auto-delete-email.png" alt-text="Screenshot showing an email notification informing the user that their dev box will be deleted. The message states when dev box will be deleted." lightbox="media/how-to-auto-delete-dev-box/dev-box-auto-delete-email.png":::

If you want to cancel the scheduled deletion and keep your dev box, follow these steps:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).
1. In the developer portal, find the dev box scheduled for deletion.
1. Select **Keep this dev box** to cancel the automatic deletion.

   :::image type="content" source="media/how-to-auto-delete-dev-box/dev-box-developer-portal-keep.png" alt-text="Screenshot of the Dev Box developer portal showing the scheduled deletion notice and the option to keep the dev box.":::

The selected dev box isn't deleted.

If you don't see a dev box tile with a pending deletion notice, check with your admin that you still have access to the project containing the dev box.

> [!NOTE]
> If the Dev Box does not appear in the developer portal when you sign in:
> - Confirm you are signing in with the same directory and user account where the Dev Box was created.
> - Verify that you still have access to the project and Dev Box pool. If access is removed, your Dev Box will no longer show in the portal.
> - Check with your project admin to ensure the Dev Box has not already been deleted or moved.
>
> Dev Boxes only display when the user retains project access. If you received a deletion notice but cannot locate the Dev Box in the portal, contact your administrator to restore access or confirm the Dev Box status.


## Related content

- [Autostop your Dev Boxes on schedule](how-to-configure-stop-schedule.md)
