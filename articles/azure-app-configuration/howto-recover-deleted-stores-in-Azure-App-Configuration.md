---
title: Azure App Configuration Recovery Management with soft delete and purge protection
description: Recover/Purge Azure App Configuration soft-deleted Stores
author: muksvso
ms.author: mubatra
ms.service: azure-app-configuration
ms.custom: devx-track-dotnet
ms.topic: conceptual
ms.date: 03/01/2022
---

# Azure App Configuration recovery management with soft delete and purge protection

This article covers two recovery features of Azure App Configuration stores, soft delete and purge protection. This document provides an overview of these features, and shows you how to manage them through the Azure portal.

For more information about App Configuration, see

- [Azure App Configuration overview](./overview.md)

## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)

* An Azure App Configuration store  - if you don't have a store, you can follow the steps provided below to create one.

* The user will need to have write/create permission on the App Configuration store.

## Create a new App Configuration store

### [Azure portal](#tab/portal)

To create a new App Configuration store in the  Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com). In the upper-left corner of the home page, select **Create a resource**. In the **Search the Marketplace** box, enter *App Configuration* and select <kbd>Enter</kbd>.
![Search for App Configuration](../../includes/media/azure-app-configuration-create/azure-portal-search.png)
1. Select **App Configuration** from the search results, and then select **Create**.

    ![Select Create](../../includes/media/azure-app-configuration-create/azure-portal-app-configuration-create.png)
1. On the **Create App Configuration** pane, enter the following settings:

    | Setting | Suggested value | Description |
    |---|---|---|
    | **Subscription** | Your subscription | Select the Azure subscription for your store |
    | **Resource group** | Your resource group | Select the Azure resource group for your store |
    | **Resource name** | Globally unique name | Enter a unique resource name to use for the App Configuration store. This name cannot be the same name as the previous configuration store. |
    | **Location** | Your desired Location | Select the region you want to create your configuration store in. |
    | **Pricing tier** | *Standard* | Select the standard pricing tier. For more information, see the [App Configuration pricing page](https://azure.microsoft.com/pricing/details/app-configuration). |
    | **Days to retain deleted stores** | Retention period for soft-deleted stores | Select the number of days for which you would want the soft deleted stores and their content to be retained. |
    | **Enable Purge Protection** | Purge Protection status | Check to enable purge protection on the store so no one can purge it before the retention period expires. |

1. Select **Review + create** to validate your settings.
1. Select **Create**. The deployment might take a few minutes.

---

## What are soft-delete and purge protection

[Soft delete](./concept-soft-delete.md) and Purge protection are two recovery features in Azure App Configuration service.

**Soft delete** is designed to prevent accidental deletion of your App Configuration store and its contents. Soft delete is similar to a recycle bin. When you delete an App Configuration store, it will remain recoverable for a user configurable retention period between 1-7 days. Stores in the soft deleted state can also be **purged** that is, permanently deleted. This allows you to recreate App Configuration store with the same name. **Soft deleted is automatically enabled on the App Configuration store created in standard tier, one can select the value for days to retain. For free tier stores, soft delete cannot be enabled and the only way to get soft delete protection is to upgrade to standard tier**

**Purge protection** when enabled is designed to prevent the permanent deletion of your App Configuration store in retention period. It's same as a recycle bin with a time based policy. You can recover items at any point during the configurable retention period. **With purge protection enabled you'll not be able to permanently delete or purge an App Configuration store until the retention period expires.** Once the retention period elapses the store will be purged automatically.

> [!NOTE]
> Purge Protection is designed so that no administrator role or permission can  override, disable, or circumvent purge protection. **Once purge protection is enabled, it cannot be disabled or overridden by anyone including Microsoft.** This means you will be able to recover a deleted App Configuration store or wait for the retention period to expire.

For more information about soft-delete, see [Azure App Configuration Soft Delete Overview](./concept-soft-delete.md)

## How can you recover or purge an App Configuration store in soft-deleted status?

### [Azure portal](#tab/portal)

#### Viewing Soft delete status for an App Configuration store

1. Log in to the Azure portal.
1. Select your App Configuration store of standard tier.
1. Refer screenshot below on where to check for the Soft delete status of an existing store. Same is available in the Overview of app configuration store.
    :::image type="content" source="./media/HowtosoftdeleteAppConfig_1.png" alt-text="In Overview, Soft-delete is highlighted.":::
1. Click on the Enabled value of Soft delete. You'll see the properties of the store. Please check "Recovery Options" information.
1. Retention period is shown as "Days to retain deleted stores". Default value for this property is 7. Range for the same is 1-7 days. You cannot change this value once set.
1. Purge Protection check box shows whether the purge protection is enabled for this particular store or not. Once enabled, purge protection cannot be disabled.
:::image type="content" source="./media/HowtosoftdeleteAppConfig_2.png" alt-text="In Properties, Soft-delete, Days to retain are highlighted.":::

#### List, recover, or purge a soft-deleted App Configuration store

1. Log in to the Azure portal.
1. Click on the search bar at the top of the page.
1. Under "Recent Services" click "App Configuration" or search for "App Configuration". Don't click on an individual App Configuration store.
1. At the top of the screen, click the option to "Manage deleted stores".
    :::image type="content" source="./media/HowtosoftdeleteAppConfig_4.png" alt-text="On App Configuration stores, the Manage deleted stores option is highlighted.":::
1. A context pane will open on the right side of your screen.
1. Select your subscription.
1. If you've deleted one or more App Configuration stores with enabled soft-delete option these will appear in the context pane on the right.
1. If there are too many deleted stores, you can click "Load More" at the bottom of the context pane to get the results.
1. Once you find the store that you wish to recover or purge, select the checkbox next to it.
1. Select the recover option at the bottom of the context pane if you would like to recover the store. Note that the store will be recovered entirely with all of its contents including the Customer Managed Keys (CMK) if you were using any. To start using these retained CMKs, you'll have to recreate the Managed identity for your service and grant the required permissions. Learn more about the usage of [CMKs in App Configuration stores](./concept-customer-managed-keys.md)
1. Select the purge option if you would like to permanently delete the store. You won't be able to purge a store with purge protection enabled.
    :::image type="content" source="./media/HowtosoftdeleteAppConfig_5.png" alt-text="On Manage deleted stores, one store is highlighted and selected, and the Recover button is highlighted.":::

---

## Next steps
> [!div class="nextstepaction"]
> [Back up App Configuration stores automatically](./howto-backup-config-store.md)
