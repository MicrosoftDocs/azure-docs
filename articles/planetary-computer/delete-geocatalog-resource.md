---
title: Delete a GeoCatalog resource - Microsoft Planetary Computer
description: Learn how to delete a GeoCatalog resource using Azure Portal or Azure Rest API, assign roles, and troubleshoot known issues.
author: meaghanlewis
ms.topic: how-to
ms.service: planetary-computer
ms.date: 04/08/2025
ms.author: prasadko
---

# Delete a GeoCatalog resource

In this article, you'll delete a GeoCatalog resource. There are two ways to deploy a Microsoft Planetary Computer GeoCatalog:

1. Using the Azure Portal.
1. Using the Azure Rest API.

## Prerequisites

- An existing GeoCatalog resource.

## Delete a GeoCatalog instance

Before deleting your GeoCatalog resource, make sure you downloaded any data, assets, SpatioTemporal Asset Catalog (STAC) Items, or render configurations that you wish to preserve. After deletion is complete, it won't be possible to access any data within your GeoCatalog Configuration or Collections.

Before you continue with the deletion steps, make sure you're ready to delete the resource.

### Delete a Geocatalog with the Azure Portal

1. Navigate to your GeoCatalog resource within the Azure Portal. Remember to [reveal the GeoCatalog hidden resource type](https://aka.ms/geocatalogsprod).

![Screenshot of the Azure Portal showing the GeoCatalog resource page with the "Delete" button highlighted.](media/geocatalog-resource.png)

1. From within the GeoCatalog Azure portal page, select "Delete". You'll be presented with a "Delete resource" confirmation dialog box. 

   **Selecting "Yes" will *immediately* begin deleting this resource.**

![Screenshot of the Azure Portal showing the GeoCatalog resource page. The "Delete" button is highlighted, indicating where users can click to initiate the deletion process for the GeoCatalog resource.](media/delete-geocatalog-resource.png)

### Delete a GeoCatalog with the Rest API

1. Login to your Azure portal and open up the cloud shell. Select Bash mode.

1. Run the following command:

   **Running this command will *immediately* begin deleting this resource.**

   ```bash
   az rest --method DELETE --uri "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$CATALOG_NAME?api-version=2024-01-31-preview"
   ```