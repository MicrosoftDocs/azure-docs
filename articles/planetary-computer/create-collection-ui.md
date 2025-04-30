---
title: "Quickstart: Create a collection with the Microsoft Planetary Computer Pro web interface"
description: Learn how to create collections in the Microsoft Planetary Computer Pro web interface. 
author: beharris
ms.author: brentharris
ms.service: azure
ms.topic: quickstart
ms.date: 04/23/2025
#customer intent: As a user of geospatial data, I want to create a STAC collection so that I can organize metadata for geospatial assets for later querying.
---

# Quickstart: Create a collection with the Microsoft Planetary Computer Pro web interface

This quickstart explains how to create a collection in Microsoft Planetary Computer Pro via the web interface. This approach is ideal if you're less comfortable using our APIs, and want to use a web interface to manage your geospatial data and navigate Planetary Computer Pro.

## Prerequisites

To complete this quickstart, you need:

- An Azure account with an active subscription. Use the link [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active GeoCatalog instance. Use the link to [Create a GeoCatalog](./deploy-geocatalog-resource.md).
- An Azure blob storage container with:
  - A geospatial dataset in a supported format. See [Supported data types](./supported-data-types.md) for more information.
  - Associated STAC metadata for the dataset. See [Create STAC Item](./create-stac-item.md) for more information.
- A web browser to access the Planetary Computer Pro web interface.

## Navigating the Microsoft Planetary Computer Pro web interface

The Microsoft Planetary Computer Pro web interface is a web-based interface that allows you to manage your geospatial data and collections. You can access the web interface by navigating to the URL of your GeoCatalog instance in a web browser, or by using the link provided in your GeoCatalog resource in Azure portal. 

Upon entry to the web interface, you'll find yourself on the Planetary Computer Pro landing page, which provides you with a list of your most recently created collections (if you already have some), and a button to create a new collection. 

The **Collections** page provides you with a full list of your collections, including their names, descriptions, date created, and a collection thumbnail. You can also search for collections by name or description keywords, and create a new collection from this page. This quickstart provides guidance on how to create a collection.

The **Settings** page allows you to create and manage ingestion sources, which is a critical first step in data ingestion. You can learn more about ingestion in [Ingestion overview](./ingestion-overview.md).

The **Explorer** page is where you can visualize your data on a map. Here, you can search for collections, filter by STAC metadata, and visualize assets. Learn how to use the Explorer in [Quickstart: Use the Microsoft Planetary Computer Pro Explorer](./use-explorer.md).

## Create a collection

1. Whether you are on the Planetary Computer Pro landing page or the Collections page, you can select the **Create Collection** button. This takes you to the **Create Collection** panel, where you enter the details of your collection in JSON format adhering to the [STAC specification](https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md). 

2. In the **Create Collection** panel's JSON editor, you'll have an option to either:
    * Write your own collection JSON
    * Use a template collection JSON 
    OR
    * Upload a collection JSON from your local machine 

**NOTE:** Whichever method you use to create your STAC collection, your JSON file must include the following fields:
   - `type`: **Required.** The type of the STAC object, which should be set to `Collection`.
   - `stac_version`: **Required.** The version of the STAC specification that your collection adheres to.
   - `stac_extensions`: A list of STAC extensions that your collection uses.
   - `id`: **Required.** A unique identifier for your collection.
   - `title`: A one-line title for your collection.
   - `description`: **Required.** A description of your collection.
   - `keywords`: A list of keywords that describe your collection.
   - `license`: **Required.** The license under which your collection is published.
   - `providers`: A list of providers capturing or processing the data for your collection.
   - `extent`: **Required.** The spatial and temporal extent of your collection.
   - `summaries`: **Strongly recommended.** A map of property summaries, either a set or range of values.
   - `links`: **Required.** A list of links for your collection.
   - `assets`: A dictionary of asset objects for your collection, each with unique keys.
   - `item_assets`: A dictionary of assets that can be found in member items.

3. Once the JSON is complete, select the **Create** button to create your collection. This takes you to the **Collection Details** page, where you can view and edit your collection's metadata, manage your data ingestions, and configure your collection for visualization in the Explorer.

## Next steps

Once you have created your collection, you'll need to ingest data into it. Follow along with the [Quickstart: Ingesting data in the Microsoft Planetary Computer Pro web interface](./ingest-via-ui.md) to learn how to ingest data into your collection.
