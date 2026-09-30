---
title: Update artifacts in Business Process Solutions
description: Learn how to update artifacts in Business Process Solutions, understand what gets upgraded, and resolve common issues after applying upgrades.
author: thanmayee75
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 05/27/2026
ms.author: tpounjula
---

# Update artifacts in Business Process Solutions

Business Process Solutions deploys foundational artifacts like lakehouses, environments, notebooks, and pipelines as part of the solution. The data processing logic in notebooks and pipelines is updated regularly. After updates are published, you can upgrade your artifacts to run the latest version.

> [!IMPORTANT]
> If you made any changes to the default notebooks and pipelines, those changes are overwritten during the upgrade. Custom datasets that you imported or new relationships that you added are not affected.

## View available updates

When updates are available for your artifacts, a button appears on the overview screen of your Business Process Solutions item.

:::image type="content" source="./media/update-artifacts/updates-available.png" alt-text="Screenshot that shows the updates available button on the overview screen." lightbox="./media/update-artifacts/updates-available.png":::

## Apply updates

To apply available updates to your artifacts, follow these steps:

1. Open your Business Process Solutions item from the workspace.
1. Select **Update available** on the overview screen.

   :::image type="content" source="./media/update-artifacts/updates-available.png" alt-text="Screenshot that shows the Update available button on the overview screen." lightbox="./media/update-artifacts/updates-available.png":::

1. A context pane opens with all the available updates. Select the checkbox and then select **Upgrade All Artifacts**.

   :::image type="content" source="./media/update-artifacts/update-artifacts-list.png" alt-text="Screenshot that shows the list of artifacts for which updates are available." lightbox="./media/update-artifacts/update-artifacts-list.png":::

1. Track the upgrade status from the notification panel.

   :::image type="content" source="./media/update-artifacts/update-artifacts-notification.png" alt-text="Screenshot that shows the upgrade progress notification." lightbox="./media/update-artifacts/update-artifacts-notification.png":::

## Verify updates

After the upgrade finishes successfully, the overview screen reflects the updated state of your artifacts.

:::image type="content" source="./media/update-artifacts/updated-overview.png" alt-text="Screenshot that shows the overview screen after a successful upgrade." lightbox="./media/update-artifacts/updated-overview.png":::

## Frequently asked questions

### How do I view the changes made in new upgrades in BPS?

When you apply updates, pipelines, notebooks, and environments are updated. To get a summary of the upgrades, check the [Release notes](release-notes.md) page. It contains a summary of changes made in each release.

### Are there breaking changes in the upgrades? If yes, how do I resolve them?

If there are any breaking changes, you can see step-by-step instructions on how to resolve them. If you need further assistance, create a support request in Fabric.

### Do I need to reconfigure datasets after applying upgrades?

Currently, Business Process Solutions upgrades only update pipelines, notebooks, and environments. Your source system, datasets, Power BI reports, and semantic models aren't affected by any update.

### How do I test upgrades in non-production?

If you have production and non-production workspaces, apply the upgrades to your non-production workspace first and observe that your workflows are running without issues. Once you validate the upgrades, apply them to your production workspace.

To review all changes, associate your workspace with git so you can compare the changes and then apply them to your main branch.

### Will upgrades affect the custom tables I have added to datasets?

Currently, Business Process Solutions upgrades only update pipelines, notebooks, and environments. Your custom tables aren't affected.

### Which items are upgraded as part of upgrades in BPS?

Business Process Solutions upgrades only update pipelines, notebooks, and environments. Upgrade capability will be extended to more resources in future releases.

## Related content

- [Release notes](release-notes.md)
- [Troubleshooting common issues](troubleshooting.md)