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

Microsoft Dev Box autodeletion (public preview) helps organizations manage resources and control costs by automatically deleting unused Dev Boxes. This article explains how to enable the feature, configure autodeletion settings, and cancel scheduled deletions in both the Azure portal and developer portal. Use these steps to optimize Dev Box usage in your Azure subscription.

## Prerequisites

- Microsoft Dev Box configured with a dev center and at least one project.

## Enable the preview feature

To enable the Dev Box autodeletion feature in your Azure subscription, follow these steps:

1. Go to the Azure subscription where you want to enable the Dev Box autodeletion feature.
1. In the navigation pane, select **Preview features**.
1. Type "auto delete" in the search box.
1. Select **Dev Box Auto Delete Preview**, and follow the prompts to register this feature to your subscription.

   After you register the feature, it will be enabled for your subscription.

   :::image type="content" source="media/how-to-auto-delete-dev-box/dev-box-auto-delete-enable-preview.png" alt-text="Screenshot of the Azure portal showing the Preview features pane with Dev Box Auto Delete Preview selected.":::
 
## Set up autodeletion in a project

To configure autodeletion for unused Dev Boxes in a project, follow these steps in the Azure portal:

1. Open an existing Dev Box project, or create a new one in your subscription.
1. Go to **Settings > Dev box settings**.
1. Go to the **Cost controls** section.
1. Select **Automatically delete unused dev boxes**.
1. Set the following options:
   - Inactivity threshold: Enter the number of inactive days before a Dev Box is scheduled for automatic deletion (for example, 7 days).
   - Grace period: Enter the number of days the developer or admin has to respond and keep the Dev Box (for example, 7 days).

   :::image type="content" source="media/how-to-auto-delete-dev-box/dev-box-auto-delete-settings.png" alt-text="Screenshot of the Dev box settings page in Azure portal showing the cost controls section with autodeletion options."::: 

## Cancel scheduled deletions in the Azure portal

To cancel a scheduled deletion in the Azure portal, follow these steps:

1. Go to the pool that has your Dev Box scheduled for deletion.
1. Select that pool to view its Dev Boxes. You need Project Admin access to finish this step.
1. Select the ellipses (**...**) next to the Dev Box scheduled for deletion.
1. Select **Cancel deletion**. The selected Dev Box isn't deleted.

:::image type="content" source="media/how-to-auto-delete-dev-box/dev-box-azure-portal-cancel-auto-delete.png" alt-text="Screenshot of the Azure portal showing the pool details and the cancel deletion option for a Dev Box.":::

## Cancel scheduled deletions in the developer portal

Developers get an email notification when their Dev Box is scheduled for deletion after reaching the inactivity threshold.

1. Go to the Dev Box developer portal to cancel the scheduled deletion if you still need the Dev Box.
1. In the developer portal, find the scheduled deletion notice.
1. Select **Keep this dev box** to cancel the automatic deletion.

:::image type="content" source="media/how-to-auto-delete-dev-box/dev-box-developer-portal-keep.png" alt-text="Screenshot of the Dev Box developer portal showing the scheduled deletion notice and the option to keep the dev box.":::

## Related content

- [Autostop your Dev Boxes on schedule](how-to-configure-stop-schedule.md)