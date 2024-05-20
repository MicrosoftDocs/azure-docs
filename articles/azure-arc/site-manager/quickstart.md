---
title: "Quickstart: Create an Arc site"
description: "Describes how to create an Arc site"
author: torreymicrosoft
ms.author: torreyt
ms.service: azure-arc
ms.subservice: azure-arc-site-manager
ms.topic: quickstart  #Don't change
ms.date: 04/18/2024

#customer intent: As a admin who manages my sites as resource groups in Azure, I want to represent them as Arc sites and so that I can benefit from logical representation and extended functionality in Arc for my resources under my resource groups.

---
  
# Quickstart: Create a site in Azure Arc site manager (preview)

In this quickstart, you will create an Azure Arc site for resources grouped within a single resource group. Once you create your first Arc site, you're ready to view your resources within Arc and take actions on the resources, such as viewing inventory, connectivity status, updates, and alerts.

## Prerequisites

* An Azure subscription. If you don't have a service subscription, create a [free trial account in Azure](https://azure.microsoft.com/free/).
* Azure portal access
* Internet connectivity
* At least one supported resource in your Azure subscription or a resource group. For more information, see [Supported resource types](./overview.md#supported-resource-types).

  >[!TIP]
  >We recommend that you give the resource group a name that represents the real site function. For the example in this article, the resource group is named **LA_10001** to reflect resources in Los Angeles.

## Create a site

Create a site to manage geographically related resources.

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure Arc**. Select **Site manager (preview)** from the Azure Arc navigation menu.

   :::image type="content" source="./media/quickstart/arc-portal-main.png" alt-text="Screenshot that shows selecting Site manager from the Azure Arc overview.":::

1. From the main **Site manager** page in **Azure Arc**, select the blue **Create a site** button.

   :::image type="content" source="./media/quickstart/create-a-site-button.png" alt-text="Screenshot that shows creating a site from the site manager overview.":::

1. Provide the following information about your site:

   | Parameter | Description |
   |--|--|
   | **Site name** | Custom name for site. |
   | **Display name** | Custom display name for site. |
   | **Site scope** | Either **Subscription** or **Resource group**. The scope can only be defined at the time of creating a site and can't be modified later. All the resources in the scope can be viewed and managed from site manager. |
   | **Subscription** | Subscription for the site to be created under. |
   | **Resource group** | The resource group for the site, if the scope was set to resource group. |
   | **Address** | Physical address for a site. |

1. Once these details are provided, select **Review + create**.

   :::image type="content" source="./media/quickstart/create-a-site-page-los-angeles.png" alt-text="Screenshot that shows all the site details filled in to create a site and then select review + create.":::

1. On the summary page, review and confirm the site details then select **Create** to create your site.

   :::image type="content" source="./media/quickstart/final-create-screen-arc-site.png" alt-text="Screenshot that shows the validation and review page for a new site and then select create.":::

## View your new site

Once you create a site, you can access it and its managed resources through site manager.

1. From the main **Site manager (preview)** page in **Azure Arc**, select **Sites** to view all existing sites.

   :::image type="content" source="./media/quickstart/sites-button-from-site-manager.png" alt-text="Screenshot that shows selecting Sites to view all sites.":::

1. On the **Sites** page, you can view all existing sites. Select the name of the site that you created.

   :::image type="content" source="./media/quickstart/los-angeles-site-select.png" alt-text="Screenshot that shows selecting a site to manage from the list of sites.":::

1. On a specific site's resource page, you can:

   * View resources
   * Modify resources (modifications affect the resources elsewhere as well)
   * View connectivity status
   * View update status
   * View alerts
   * Add new resources

## Delete your site

You can delete a site from within the site's resource details page.

:::image type="content" source="./media/quickstart/los-angeles-site-main-page-delete.png" alt-text="Screenshot that shows deleting a site from its resource page.":::

Deleting a site doesn't affect the resources or the resource group and subscription in its scope. After a site is deleted, the resources of that site can't be viewed or managed from site manager.

A new site can be created for the resource group or the subscription after the original site is deleted.
