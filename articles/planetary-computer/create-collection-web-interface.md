---
title: Creating collections via web interface in Microsoft Planetary Computer Pro
description: Learn how to create collections in the Microsoft Planetary Computer Pro web interface. 
author: beharris
ms.author: brentharris
ms.service: planetary-computer-pro
ms.topic: quickstart
ms.date: 12/01/2025
#customer intent: As a user of geospatial data, I want to create a STAC collection so that I can organize metadata for geospatial assets for later querying.
ms.custom:
---

# Quickstart: Create a collection with the Microsoft Planetary Computer Pro web interface

This quickstart explains how to create a collection in Microsoft Planetary Computer Pro through the web interface.

## Prerequisites

To complete this quickstart, you need:

- An Azure account with an active subscription. Use the link [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An active GeoCatalog instance. Use the link to [Create a GeoCatalog](./deploy-geocatalog-resource.md).

## Navigating the Microsoft Planetary Computer Pro web interface

The Microsoft Planetary Computer Pro web interface is a web-based platform that you use to manage your geospatial data. **Access the web interface by using the URI provided in your GeoCatalog resource in Azure portal:**

[ ![Screenshot of URI in geocatalog resource in Azure portal.](media/geocatalog-uri-example.jpeg) ](media/geocatalog-uri-example.jpeg#lightbox) 

When you enter the web interface, you land on the Planetary Computer Pro page. The page shows your recent collections (if any) and a button to create a new one.

[ ![Screenshot of Planetary Computer Pro landing page.](./media/landing-page.jpeg) ](./media/landing-page.jpeg#lightbox)

The **Collections** page provides you with a full list of your collections, including their names, descriptions, date created, and a collection thumbnail. You can also search for collections by name or description keywords, and create a new collection from this page. 

[ ![Screenshot of Planetary Computer Pro collections page.](./media/collections-page.jpeg) ](./media/collections-page.jpeg#lightbox)

The **Settings** page allows you to create and manage ingestion sources, which is a critical first step in data ingestion. You can learn more about ingestion in [Ingestion overview](./ingestion-overview.md).

[ ![Screenshot of Planetary Computer Pro settings page.](./media/settings-page.jpeg) ](./media/settings-page.jpeg#lightbox)

The **Explorer** page is where you can visualize your data on a map. Here, you can search for collections, filter by STAC metadata, and visualize assets. Learn how to use the Explorer in [Quickstart: Use the Microsoft Planetary Computer Pro Explorer](./use-explorer.md).

[ ![Screenshot of Planetary Computer Pro Explorer page.](./media/explorer-page.jpeg) ](./media/explorer-page.jpeg#lightbox)

## Create a collection

1. From the Planetary Computer Pro landing page or the Collections page, select the **Create Collection** button to open the **Create Collection** panel. In the panel, enter the details of your collection in JSON format adhering to the [STAC specification](https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md).

[ ![Screenshot of Create Collection panel.](./media/create-collection-panel.jpeg) ](./media/create-collection-panel.jpeg#lightbox)

2. In the **Create Collection** panel's JSON editor, the options are:
    * Write your own collection JSON
    * Use a template collection JSON 
    OR
    * Upload a collection JSON from your local machine 

The following table describes the standard STAC collection fields. Fields marked as **Required** must be included in your collection. You can also add custom fields as needed.

| Field           | Required             | Description                                                                 |
|-----------------|----------------------|-----------------------------------------------------------------------------|
| `type`          | **Required**         | The type of the STAC object, which should be set to `Collection`.           |
| `stac_version`  | **Required**         | The version of the STAC specification that your collection adheres to.      |
| `stac_extensions`|                      | A list of STAC extensions that your collection uses.                        |
| `id`            | **Required**         | A unique identifier for your collection.                                    |
| `title`         |                      | A one-line title for your collection.                                       |
| `description`   | **Required**         | A description of your collection.                                           |
| `keywords`      |                      | A list of keywords that describe your collection.                           |
| `license`       | **Required**         | The license for your STAC collection.                       |
| `providers`     |                      | A list of providers capturing or processing the data for your collection.   |
| `extent`        | **Required**         | The spatial and temporal extent of your collection.                         |
| `summaries`     | **Strongly recommended** | A map of property summaries, either a set or range of values.             |
| `links`         | **Required**         | A list of links for your collection.                                        |
| `assets`        |                      | A dictionary of asset objects for your collection, each with unique keys. |
| `item_assets`   | [**Required for Visualization**](./render-configuration.md#step-1-define-item_assets-in-your-collection-json)                     | A dictionary of assets that can be found in member items.                   |

> [!NOTE]
> The `item_assets` keys in the STAC collection should match the asset keys present in your STAC items. Mismatches can cause incorrect asset display.

3. Once the JSON is complete, select the **Create** button to create your collection. This selection takes you to the **Overview** tab of your collection, where you can view and edit your collection's metadata, manage your data ingestions, and [configure your collection for visualization in the Explorer](./collection-configuration-concept.md).

[ ![Screenshot of Collection overview page.](./media/collection-overview.jpeg) ](./media/collection-overview.jpeg#lightbox)

## Next steps
Now that you have a collection, you can ingest data into it. 

> [!div class="nextstepaction"]
> [Quickstart: Ingesting data in the Microsoft Planetary Computer Pro web interface](./ingest-via-web-interface.md)

## Related content

- [Quickstart: Create a STAC collection with Microsoft Planetary Computer Pro GeoCatalog using Python](./create-stac-collection.md)
- [Configure your collection for visualization in the Explorer](./collection-configuration-concept.md)