---
title: How to manage upgrade settings - Azure Data Manager for Energy
description: Learn how to configure upgrade settings to control how milestone upgrades are applied to your Azure Data Manager for Energy instance.
author: japicket
ms.author: japicket
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 01/27/2026
ms.custom:
  - template-how-to
---

# Manage upgrade settings in Azure Data Manager for Energy

This article describes how to view and manage upgrade settings for your Azure Data Manager for Energy instance. Upgrade settings allow you to control how milestone upgrades are applied to your instance.

## What are milestone upgrades?

Milestone upgrades are major version upgrades to Azure Data Manager for Energy, such as moving from M25 to M26. These upgrades might include significant changes to functionality and features.

## Upgrade policy options

Azure Data Manager for Energy provides two upgrade policy options:

| Policy | Description |
|--------|-------------|
| **Automatic** | Instance is upgraded automatically when a new milestone release is available. This option is the default setting for all instances. |
| **Deferred** | Upgrades are deferred for up to 30 days before instance is upgraded. |

If you have multiple Azure Data Manager for Energy instances, you can set different upgrade policies for each one. For example, you might set one instance to **Automatic** so it upgrades immediately when a new milestone is released, allowing you to test and validate the changes. Meanwhile, you can set your production instance to **Deferred** to delay the upgrade until you complete your testing. At any point during the 30-day window, you can mark your deferred instance as ready for upgrade. If you don't take action, the instance is automatically upgraded at the end of the 30-day window.

## View upgrade settings

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Data Manager for Energy instance.

1. In the left menu under **Advanced**, select **Upgrade Settings**.

1. On the **Upgrade Settings** page, you can view:
   - **Upgrade policy**: Whether your instance is set to **Automatic** or **Deferred** upgrades.
   - **Automatic upgrade after**: If your upgrade policy is set to **Deferred** and a milestone upgrade is available, this field shows the date when your instance is automatically upgraded.

> [!NOTE]
> The current milestone version is displayed in the **Essentials** section on the **Overview** page for your Azure Data Manager for Energy instance.

## Configure upgrade settings during instance creation

You can configure upgrade settings when you create a new Azure Data Manager for Energy instance.

1. When creating a new instance, navigate to the **Advanced Settings** tab.

1. In the **Upgrade Settings** section, select either **Automatic** or **Deferred** for the **Upgrade Policy**.

1. Complete the remaining tabs and select **Create** to create your instance with the configured upgrade settings.

## Change the upgrade policy for an existing instance

You can change the upgrade policy for an existing Azure Data Manager for Energy instance at any time.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Data Manager for Energy instance.

1. In the left menu under **Advanced**, select **Upgrade Settings**.

1. Select either **Automatic** or **Deferred** to change your upgrade policy.

1. Select **Save** to apply your changes.

## Mark your instance as ready for upgrade

If your upgrade policy is set to **Deferred** and a milestone upgrade is available, you can mark your instance as ready for upgrade at any time during the 30-day window.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Data Manager for Energy instance.

1. In the left menu under **Advanced**, select **Upgrade Settings**.

1. Select the **Mark Ready for Upgrade** button.

    > [!NOTE]
    > The **Mark Ready for Upgrade** button is only available when:
    > - Your upgrade policy is set to **Deferred**.
    > - The **Automatic upgrade after** date is set by the Azure Data Manager for Energy team.

1. Confirm that you want to mark your instance as ready for upgrade.

> [!IMPORTANT]
> Once you mark your instance as ready for upgrade, this action can't be undone. Your instance will be upgraded during the next upgrade cycle.

## Understanding the 30-day upgrade window

When a new milestone release is available and your upgrade policy is set to **Deferred**, the following apply:

1. After all instances with the **Automatic** upgrade policy are upgraded, the Azure Data Manager for Energy team sets the **Automatic upgrade after** date, which is approximately 30 days from that point.

1. The **Automatic upgrade after** date is displayed on the **Upgrade Settings** page in the Azure portal for instances with a **Deferred** upgrade policy.

1. During this 30-day window, you can:
   - Test the new milestone release in a nonproduction environment.
   - Mark your instance as ready for upgrade when you're satisfied with your testing.
   - Take no action and let your instance be automatically upgraded at the end of the window.

1. After your instance is upgraded, the **Automatic upgrade after** date is cleared until the next milestone release.

## Frequently asked questions

### What happens if I find an issue with Azure Data Manager for Energy during the 30-day window?

If you discover an issue during the 30-day window, contact Azure support. Depending on the severity of the issue, the Azure Data Manager for Energy team might deploy a hotfix. If a hotfix is required, the 30-day timer is paused when the issue is identified and resumes once the hotfix is deployed.

## Next steps

Learn more about each milestone release and Azure Data Manager for Energy:

> [!div class="nextstepaction"]
> [Release notes](release-notes.md)
