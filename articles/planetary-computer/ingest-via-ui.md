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

## Configure your ingestion source

Once you have created a collection, you are ready to ingest data into your collection. The first step, however, is to configure your ingestion source. There are two ways to do this, either by using the ***Settings** page or the **Create ingestion** panel in the **Ingestion** tab of your collection. Either of these methods will work, the important thing is that you must have set up your ingestion source before you can ingest data. For more information on ingestion sources, see [Ingestion sources](./ingestion-sources.md).

### Configure your ingestion source in the **Settings** page

Depending on whether you want to use managed identity or a shared access signature, you can  configure you ingestion source by following the steps outlined in [Configure an ingestion source in Microsoft Planetary Computer Pro using managed identity](./setup-ingestion-credentials-managed-identity.md) or [Configure an ingestion source in Microsoft Planetary Computer Pro using a shared access signature](./setup-ingestion-credentials-sas.md). 

To configure your ingestion source and create a new ingestion from within your collection, follow along with the rest of this quickstart.

## Create ingestion

To configure your ingestion source and create a new ingestion using the **Create ingestion** panel, refer to these steps:

1. Navigate to the **Overview** tab of the collection in which you want to ingest data. 
**NOTE:** If you have not already ingested data into your collection, you will see a graphic showing the 3 steps to get started. '1. Configure ingestion source, 2. Create ingestion, 3. Start run.'
2. Select the **Get started** button, and you will be taken to the **Ingestion** tab of the collection, where the **Create ingestion** panel will automatically open. 
**NOTE:** If you have already ingested data into this collection, and want to create another ingestion, you can navigate to the **Ingestion** tab of the collection and select **Create ingestion** to open the **Create ingestion** panel.
3. The **Create ingestion** panel, like the **Create ingestion source** panel, allows you to select either managed identity or a shared access signature. Select the appropriate option for your ingestion source, input the container URL where the data is stored, and either input your SAS token or select your managed identity. 
**NOTE:** If you have already configured your ingestion source for this data, you can skip this step and simply select 'Already created.'
4. 


## Next steps

<!-- TODO: Update this link to point to the next article in the sequence once finalized. -->

Once you have ingested data, it's time to configure the STAC Collection for visualizing your data. 

> [!div class="nextstepaction"]
> [Quickstart: Ingesting data in the Microsoft Planetary Computer Pro web interface](./ingest-via-ui.md)
