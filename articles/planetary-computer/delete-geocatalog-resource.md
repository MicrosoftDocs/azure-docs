---
title: Delete a GeoCatalog resource - Microsoft Planetary Computer Pro
description: Learn how to delete a GeoCatalog resource using Azure portal or Azure Rest API, assign roles, and troubleshoot known issues.
author: meaghanlewis
ms.topic: how-to
ms.service: planetary-computer
ms.date: 04/14/2025
ms.author: adamloverro
---

# Delete a GeoCatalog resource

This article shows you how to delete an existing GeoCatalog resource. There are two ways to delete a Microsoft Planetary Computer Pro GeoCatalog:

1. Using the Azure portal.
1. Using the Azure Rest API.

## Prerequisites

- An existing GeoCatalog resource.

## Delete a GeoCatalog instance

Before deleting your GeoCatalog resource, make sure you downloaded any data, assets, SpatioTemporal Asset Catalog (STAC) Items, or render configurations that you wish to preserve. After deletion is complete, it won't be possible to access any data within your GeoCatalog Configuration or Collections.

Before you continue with the deletion steps, make sure you're ready to delete the resource.

### Delete a GeoCatalog with the Azure portal

1. Navigate to your GeoCatalog resource within the Azure portal. Remember to [reveal the GeoCatalog hidden resource type](https://aka.ms/geocatalogsprod).

![Screenshot of the Azure portal showing the GeoCatalog resource page with the "Delete" button highlighted.](media/geocatalog-resource.png)

1. From within the GeoCatalog Azure portal page, select **Delete**. You're presented with a **Delete resource** confirmation dialog box. 

   **Selecting "Yes" will *immediately* begin deleting this resource.**

![Screenshot of the Azure portal showing the GeoCatalog resource page. The "Delete" button is highlighted, indicating where users can click to initiate the deletion process for the GeoCatalog resource.](media/delete-geocatalog-resource.png)

### Delete a GeoCatalog with the REST API

1. Sign in to your Azure portal and open up the cloud shell. Select Bash mode.

1. Run the following command:

   **Running this command will *immediately* begin deleting this resource.**

   ```bash
   az rest --method DELETE --uri "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$CATALOG_NAME?api-version=2024-01-31-preview"
   ```