---
title: "How to create and manage an Azure Arc site"
description: "Describes how to create, view, delete, or modify an Azure Arc site in the Azure portal using site manager."
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: how-to #Don't change
ms.date: 03/24/2024

#customer intent: As a site admin, I want to know how to create, delete, and modify sites so that I can manage my site.

---

# Create and manage sites

This article guides you through how to create, modify, and delete a site using Azure Arc site manager (preview).

## Prerequisites

* Azure portal access
* Internet connectivity
* Subscription
* Resource group or subscription with at least one resource for a site

## Open Azure Arc site manager

In the [Azure portal](https://portal.azure.com), search for and select **Azure Arc**. Select **Site manager (preview)** from the Azure Arc navigation menu.

:::image type="content" source="./media/how-to-crud-site/arc-portal-main.png" alt-text="Screenshot that shows selecting Site manager from the Azure Arc overview.":::

Alternatively, you can also search for Azure Arc site manager directly in the Azure portal using terms such as **site**, **Arc Site**, **site manager** and so on.

## Create a site

Create a site to manage geographically related resources.

1. From the main **Site manager** page in **Azure Arc**, select the blue **Create a site** button.

   :::image type="content" source="./media/how-to-crud-site/create-a-site-button.png" alt-text="Screenshot that shows creating a site from the site manager overview.":::

1. Provide the following information about your site:

   | Parameter | Description |
   |--|--|
   | **Site scope** | **Subscription** or **Resource group**. The scope can only be defined at the time of creating a site and can't be modified later. All the resources in the scope can be viewed and managed from site manager. |
   | **Site name** | Custom name for site. |
   | **Display name** | Custom display name for site. |
   | **Subscription** | Subscription for the site to be created under. |
   | **Address** | Physical address for a site. |

1. Once these details are provided, select **Review + create**.

   :::image type="content" source="./media/how-to-crud-site/create-a-site-page-california.png" alt-text="Screenshot that shows all the site details filled in to create a site and then select review + create.":::

1. On the summary page, review and confirm the site details then select **Create** to create your site.

   :::image type="content" source="./media/how-to-crud-site/final-create-screen-arc-site.png" alt-text="Screenshot that shows the validation and review page for a new site and then select create.":::

## View and modify a site

Once you create a site, you can access it and its managed resources through site manager.

1. From the main **Site manager** page in **Azure Arc**, select **Sites** to view all existing sites.

   :::image type="content" source="./media/how-to-crud-site/sites-button-from-site-manager.png" alt-text="Screenshot that shows selecting Sites to view all sites.":::

1. On the **Sites** page, you can view all existing sites. Select the name of the site that you want to delete.

   :::image type="content" source="./media/how-to-crud-site/california-site-select.png" alt-text="Screenshot that shows selecting a site to manage from the list of sites.":::

1. On a specific site's resource page, you can:

   * View resources
   * Modify resources (modifications affect the resources elsewhere as well)
   * View connectivity status (when supported by resources)
   * View update status (when supported by resources)
   * View alerts (when supported by resources)
   * Add new resources (currently only resources supporting creation from the site view)

Additionally, currently only some aspects of a site can be modified. These are as follows:
| Site Attribute  | Modification that can be done |
|---------|---------|
| Site name | Site name can be modified to a new unique name |
| Address | Address can be modified to a pre-existing or new address |

## Delete a site

If you no longer want to manage a site, you can delete it from the site manager.

Deleting a site doesn't affect the resources, resource group, or subscription in its scope. After a site is deleted, the resources of that site will still exist but can't be viewed or managed from site manager. You can create a new site for the resource group or the subscription after the original site is deleted.

1. From the main **Site manager** page in **Azure Arc**, select **Sites** to view all existing sites.

1. On the **Sites** page, you can view all existing sites. Select the name of the site that you want to delete.

1. On the site's resource page, select **Delete**.

   :::image type="content" source="./media/how-to-crud-site/california-site-main-page-delete.png" alt-text="Screenshot that shows selecting Delete on the details page of a site.":::
