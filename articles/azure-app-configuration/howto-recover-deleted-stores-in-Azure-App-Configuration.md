---
title: Recover App Configuration stores
description: Recover/Purge Azure App Configuration soft deleted Stores
author: muksvso
ms.author: mubatra
ms.service: azure-app-configuration
ms.custom: devx-track-dotnet
ms.topic: how-to
ms.date: 03/01/2022
---

# Recover App Configuration stores

This article covers the soft delete feature of Azure App Configuration Stores. You will learn about how to setting retention policy, enable purge protection, recover and purge a soft-deleted store.

To learn more about the concept of soft delete feature, see this [document](./concept-soft-delete.md)

## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)

* An Azure App Configuration store  - if you don't have a store, you can follow the steps provided below to create one.

* Refer to the [soft delete concept document](./concept-soft-delete.md) for permissions requirements.

## Set retention policy and enable purge protection at store creation

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
    | **Resource name** | Globally unique name | Enter a unique resource name to use for the App Configuration store. This name can't be the same name as the previous configuration store. |
    | **Location** | Your desired Location | Select the region you want to create your configuration store in. |
    | **Pricing tier** | *Standard* | Select the standard pricing tier. For more information, see the [App Configuration pricing page](https://azure.microsoft.com/pricing/details/app-configuration). |
    | **Days to retain deleted stores** | Retention period for soft deleted stores | Select the number of days for which you would want the soft deleted stores and their content to be retained. |
    | **Enable Purge protection** | Purge protection status | Check to enable Purge protection on the store so no one can purge it before the retention period expires. |

 :::image type="content" source="./media/HowtosoftdeleteAppConfig_6.png" alt-text="In Overview, Soft-delete is highlighted.":::

1. Select **Review + create** to validate your settings.
1. Select **Create**. The deployment might take a few minutes.

## Enable Purge Protection in an already created store

1. Log in to the Azure portal.
1. Select your standard tier App Configuration store.
1. Refer to the screenshot below on where to check for the soft delete status of an existing store.
:::image type="content" source="./media/HowtosoftdeleteAppConfig_1.png" alt-text="In Overview, Soft-delete is highlighted.":::
1. Click on the `Enabled` value of Soft Delete. You will be redirected to the **properties** of your store. At the bottom of the page, you can review the information related to soft delete. The Retention period is shown as "Days to retain deleted stores". You can't change this value once it's set. The Purge protection check box shows whether purge protection is enabled for this particular store or not. Once enabled, purge protection can't be disabled.
:::image type="content" source="./media/HowtosoftdeleteAppConfig_2.png" alt-text="In Properties, Soft delete, Days to retain are highlighted.":::

## List, recover, or purge a soft deleted App Configuration store

1. Log in to the Azure portal.
1. Click on the search bar at the top of the page.
1. Search for "App Configuration" and click on **App Configuration** under **Services**. Don't click on an individual App Configuration store.
1. At the top of the screen, click the option to **Manage deleted stores**. A context pane will open on the right side of your screen.
    :::image type="content" source="./media/HowtosoftdeleteAppConfig_4.png" alt-text="On App Configuration stores, the Manage deleted stores option is highlighted.":::
1. Select your subscription from the drop box. If you've deleted one or more App Configuration Stores with the option of soft delete enabled, these stores will appear in the context pane on the right. If there are too many deleted stores, you can click "Load More" at the bottom of the context pane to get the results.
1. Once you find the store that you wish to recover or purge, select the checkbox next to it. You can select multiple stores
1. Select the **Recover** option at the bottom of the context pane if you would like to recover the store.
1. Select the **Purge** option if you would like to permanently delete the store. You won't be able to purge a store with purge protection enabled.
    :::image type="content" source="./media/HowtosoftdeleteAppConfig_5.png" alt-text="On Manage deleted stores panel, one store is selected, and the Recover button is highlighted.":::

## Recover an App Configuration store with custom managed key enabled

When recovering stores that use customer managed keys there are extra steps that need to be performed to access the recovered data. This is because the recovered store will no longer have a managed identity assigned that has access to the customer managed key. A new managed identity should be assigned to the store and the customer managed key settings should be reconfigured to use the newly assigned identity. When updating the managed key settings to use the newly assigned identity, ensure to continue using the same key from key vault. Refer to [doc](./concept-customer-managed-keys.md) on how to configure customer managed key encryption.

## Next steps
> [!div class="nextstepaction"]
> [Soft delete Concept](./concept-soft-delete.md)
