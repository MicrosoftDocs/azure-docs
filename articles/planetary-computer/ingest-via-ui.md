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

This quickstart explains how to ingest data into your collection using the Microsoft Planetary Computer Pro web interface. This approach is ideal if you're less comfortable using APIs, and want to use a web interface to manage your geospatial data and navigate Planetary Computer Pro.

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

Once you create a collection, you're ready to ingest data into your collection. The first step, however, is to configure your ingestion source. You can do this either by using the ***Settings** page or the **Create ingestion** panel in the **Ingestion** tab of your collection. Either of these methods work, the important thing is that you must set up your ingestion source before you can ingest data. For more information on ingestion sources, see [Ingestion sources](./ingestion-sources.md).

### Configure your ingestion source in the **Settings** page

Whether you want to use managed identity or a shared access signature, you can  configure you ingestion source by following the steps outlined in [Configure an ingestion source in Microsoft Planetary Computer Pro using managed identity](./setup-ingestion-credentials-managed-identity.md) or [Configure an ingestion source in Microsoft Planetary Computer Pro using a shared access signature](./setup-ingestion-credentials-sas.md). 

To configure your ingestion source and create a new ingestion from within your collection, follow along with the rest of this quickstart.

## Create ingestion

To configure your ingestion source and create a new ingestion using the **Create ingestion** panel, refer to these steps:

1. Navigate to the **Overview** tab of the collection in which you want to ingest data. 

**NOTE:** If you have not already ingested data into your collection, a graphic showing the 3 steps to get started appears. '1. Configure ingestion source, 2. Create ingestion, 3. Start run.'

2. Select the **Get started** button, and you're taken to the **Ingestion** tab of the collection, where the **Create ingestion** panel opens. 

**NOTE:** If you already ingested data into this collection, and want to create another ingestion, you can navigate to the **Ingestion** tab of the collection and select **Create ingestion** to open the **Create ingestion** panel.

3. The **Create ingestion** panel, like the **Create ingestion source** panel in **Settings**, allows you to select either managed identity or a shared access signature. Select the appropriate option for your ingestion source, input the container URL where the data is stored, and either input your SAS token or select your managed identity. 

**NOTE:** If you already configured your ingestion source for this data, you can skip this step and select 'Already created.'

4. Now that the ingestion source fields are filled out, enter the rest of the information needed to create your ingestion, including adding a Display Name and Ingestion URL (URL of the STAC catalog json organizing your STAC items). Here, you can also check the boxes to 'Keep Original STAC items' or 'Skip items already in STAC catalog.' You may or may not want to check those boxes depending on your use cases or whether you already ingested data into this collection.

5. Once you have filled out all the fields, select **Create** to create your ingestion.

6. You have now defined and authenticated your ingestion path, which can be seen in your list of ingestions in your collection, but you still need to start an ingestion run in order to pull your data in. Select the **Start new run** button from the **Run actions** column to open the **Create run** panel. 

7. Select **Create** to start the run. This brings you back to the **Ingestion** tab, where you can select the **View runs** button to see the status of your ingestion. 

8. When the ingestion run is complete, the **STAC items** tab in your collection displays your list of STAC items that have been ingested, with columns for the item ID and acquisition date. 


## Next steps

<!-- TODO: Update this link to point to the next article in the sequence once finalized. -->

Once you have ingested data, it's time to configure the STAC Collection so you can visualize your data in the Explorer. 

> [!div class="nextstepaction"]
> [Quickstart: Configure a collection with the Microsoft Planetary Computer Pro web interface](./configure-collection-ui.md)
