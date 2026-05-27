---
title: Update artifacts in Business Process Solutions
description: Learn how to update artifacts in Business Process Solutions, understand what gets upgraded, and resolve common issues after applying upgrades.
author: tpounjula
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

#### 1. How do I view the changes made in new upgrades in BPS?

<!-- Explain where users can find changelogs, release notes, or diff views for upgrades. -->

#### 2. Are there breaking changes in the upgrades? If yes, how do I resolve them?

<!-- Describe scenarios where breaking changes may occur and provide resolution steps. -->

#### 3. Do I need to reconfigure datasets after applying upgrades?

<!-- Clarify whether dataset configurations are preserved, overwritten, or require manual action post-upgrade. -->

#### 4. How do I test upgrades in non-production?

<!-- Outline the recommended approach for testing upgrades in a non-production environment before applying to production. -->

#### 5. Will upgrades affect the custom tables I have added in datasets?

<!-- Address whether custom tables, columns, or relationships are preserved during upgrades. -->

#### 6. Which items are upgraded as a part of upgrades in BPS?

<!-- List the artifacts that are included in upgrades (notebooks, pipelines, environments, semantic models, etc.). -->

## Related content

- [Release notes](release-notes.md)
- [Troubleshooting common issues](troubleshooting.md)