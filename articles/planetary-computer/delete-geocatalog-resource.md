---
title: Delete a GeoCatalog resource - Microsoft Planetary Computer Pro
description: Learn how to delete a GeoCatalog resource using Azure portal or Azure Rest API, assign roles, and troubleshoot known issues.
author: meaghanlewis
ms.topic: how-to
ms.service: azure
ms.date: 04/14/2025
ms.author: adamloverro
# customer intent: As a GeoCatalog user I want to delete a GeoCatalog resource so that I can remove this resource from my Azure Subscription.
---

# Delete a GeoCatalog resource

This article shows you how to delete an existing GeoCatalog resource. This article documents the two methods used to delete a Microsoft Planetary Computer Pro GeoCatalog:

1. Using the Azure portal.
1. Using the Azure Rest API.
 
Before you proceed with deleting your GeoCatalog resource, download a backup of any data, assets, SpatioTemporal Asset Catalog (STAC) Items, or render configurations that you wish to preserve. After deletion is complete, it won't be possible to access any data within your GeoCatalog Configuration or Collections.

Before you continue with the deletion steps, make sure you're ready to delete the resource.

## Prerequisites

- A Deployed GeoCatalog resource.
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) (For using the REST API)

## Delete a GeoCatalog instance

### Delete a GeoCatalog with the Azure portal

1. Navigate to your GeoCatalog resource within the Azure portal. Remember to [reveal the GeoCatalog hidden resource type](https://aka.ms/geocatalogsprod).

    ![Screenshot of the Azure portal showing the GeoCatalog resource page with the "Delete" button highlighted.](media/geocatalog-resource.png)

1. From within the GeoCatalog Azure portal page, select **Delete**. You're presented with a **Delete resource** confirmation dialog box. 

   > [!NOTE]
   > **Selecting "Yes" will *immediately* begin deleting this resource.**
  
    ![Screenshot of the Azure portal showing the GeoCatalog resource page. The "Delete" button is highlighted, indicating where users can click to initiate the deletion process for the GeoCatalog resource.](media/delete-geocatalog-resource.png)

### Delete a GeoCatalog with the REST API

1. Sign in to your Azure portal
1. Open up a cloud shell. 
1. Select Bash mode.
1. Run the following command:

   > [!NOTE]
   > **Running this command will *immediately* begin deleting this resource.**

   ```bash
   az rest --method DELETE --uri "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$CATALOG_NAME?api-version=2024-01-31-preview"
   ```