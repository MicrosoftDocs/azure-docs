---
title: "Quickstart: Ingest data with the Microsoft Planetary Computer Pro web interface"
description: Learn how to ingest data into your collection using the Microsoft Planetary Computer Pro web interface. 
author: beharris
ms.author: brentharris
ms.service: azure
ms.topic: quickstart
ms.date: 04/25/2025
#customer intent: As a Planetary Computer Pro user, I want to ingest data into my collection using the web interface so that I can manage my geospatial assets.
---

# Quickstart: Ingest data using the Microsoft Planetary Computer Pro web interface

This quickstart explains how to ingest data into your collection using the Microsoft Planetary Computer Pro web interface. This approach is ideal if you are less comfortable using APIs, and want to use a web interface to manage your geospatial data and navigate Planetary Computer Pro.

## Prerequisites

Before using this quickstart, you need:

- An Azure account with an active subscription. Use the link [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active GeoCatalog instance. Use the link to [Create a GeoCatalog](./deploy-geocatalog-resource.md).
- An Azure blob storage container with:
  - A geospatial dataset in a supported format. See [Supported data types](./supported-data-types.md) for more information.
  - Associated STAC metadata for the dataset. See [Create STAC Item](./create-stac-item.md) for more information.
- A web browser to access the Planetary Computer Pro web interface.
- A collection created using the [Quickstart: Create a collection with the Microsoft Planetary Computer Pro UI](./create-collection-ui.md) or the [Quickstart: Create a STAC collection with Microsoft Planetary Computer Pro GeoCatalog](./create-stac-collection.md).

## Create an ingestion

Once you have created a collection and configured an ingestion source, you are ready to ingest data into your collection. The following steps will guide you through the process of creating an ingestion using the Microsoft Planetary Computer Pro web interface:

1. Navigate to the **Overview** tab of the collection in which you want to ingest data. 
2. If you have not already ingested data into your collection, you will see a graphic showing the 3 steps to get started. '1. Create an ingestion, 2. Start run, 3. View STAC items.' Click the **Get started** button to begin with step 1. 


## Next steps

<!-- TODO: Update this link to point to the next article in the sequence once finalized. -->

Once you have ingested data, it's time to configure the STAC Collection for visualizing your data. 

> [!div class="nextstepaction"]
> [Quickstart: Ingesting data in the Microsoft Planetary Computer Pro web interface](./ingest-via-ui.md)
