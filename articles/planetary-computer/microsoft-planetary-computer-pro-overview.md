## Overview

Microsoft Planetary Computer's vision is to empower every organization to unlock the full potential of geospatial data. Microsoft Planetary Computer Pro (MPC Pro) provides customers with a geospatial data management service built on top of Azure's hyper-scale infrastructure and ecosystem. The MPC Pro GeoCatalog is a new Azure service that provides foundational capabilities to ingest, manage, search, and distribute geospatial datasets. GeoCatalog's are built using the SpatioTemporal Asset Catalog (STAC) technology, an open specification and standard that enables geospatial software interoperability. Learn more about STAC and how it relates to MPC Pro Geocatalogs [here](concepts/stac-overview.md).  

At a high level, a GeoCatalog contains four major components:

* **Data Ingest** - Users can add or update individual STAC items within a collection using GeoCatalog's STAC APIs.  Large geospatial datasets from pre-existing STAC catalogs can also be easily ingested using GeoCatalogs's bulk ingest feature.
* **Data Storage** - Geospatial data within GeoCatalog is automatically formatted and indexed using various open cloud-optimized and cloud-native formats including [STAC](https://stacspec.org/en/) and [Cloud Optimized GeoTIFFs (COGs)](https://www.cogeo.org/).
* **APIs** - Quickly and easily search across vast geospatial datasets to find the specific data you need using GeoCatalog's STAC APIs.
* **Explorer** - Dynamically explore and overlay your COG formatted geospatial data to more easily find the imagery you need.

As documented in this [tutorial](#tutorial-and-quickstarts), you can start using these features by following these five easy steps:

1. **Provision** - Create a new GeoCatalog resource  within your Azure subscription by following the step-by-step instructions provided in our [Deployment Tutorial](quickstarts/Deployment.md).
2. **Create Collection** - Once deployed, a GeoCatalog resource allows you to create Collections of STAC items to store and organize geospatial datasets on Azure. Collections are defined using the [SpatioTemporal Asset Catalog (STAC)](https://stacspec.org/en/) specification which provides a common metadata structure for describing and cataloging geospatial data, otherwise known as STAC "assets". Within a collection, you can specify the type and structure of data that will be stored in the collection. You can also add configuration settings to visualize data within the collection using GeoCatalog's Explorer UI (see Step 5).
3. **Ingest Geospatial Data** - After creating a collection, you can upload geospatial assets to your collection. These assets are described by [STAC items](https://github.com/radiantearth/stac-spec/blob/master/item-spec/item-spec.md), a metadata specification for describing geospatial assets including satellite, aerial, and drone imagery. If you do not have STAC items already defined for your geospatial assets, users can use generate STAC items from supported file types using [STACForge](tools/stacforge-functions/README.md). As part of the ingestion process, GeoCatalogs will also automatically convert select data types into cloud optimized formats. For example, a GeoCatalog will convert TIFF images into [Cloud Optimized GeoTIFFs (COGs)](https://www.cogeo.org/) in order to to store and visualize these data types more efficiently.
4. **Search & Distribute Data** - Once you have ingested your geospatial assets into a GeoCatalog collection, you can search for and access these data assets via GeoCatalog's APIs. These APIs also conform to the STAC specification making it possible for you to quickly and easily search petabyte-scale datasets. Once assets are identified, you can also view or download these assets using the GeoCatalog's APIs.
5. **Visualize Data** - Each GeoCatalog deployment includes a web application user interface (UI) to dynamically interact with your collections and data. Using this UI, users can perform all of the steps described above including creation and viewing of collections, uploading and ingestion of geospatial assets, and the ability to search for and view specific geospatial assets.

## GeoCatalog Deployment

Once your Azure subscription has been approved to join the MPC Pro Private Preview, you will be able to deploy GeoCatalog resources within your subscription.  

Please navigate to our [Deployment Tutorial](quickstarts/Deployment.md) for step-by-step instructions on how to deploy a new GeoCatalog into your subscription.

If you wish to remove a GeoCatalog after it has been deployed, please follow our [catalog deletion tutorial](quickstarts/catalog-deletion.md).

## Tutorial and Quickstarts

### End-to-End Tutorial

In our End-to-End tutorial, you will walk through the process of creating a new STAC collection, ingesting Sentinel-2 images into the collection, and querying those images via GeoCatalog's APIs and UI. This tutorial is provided in two forms:

#### Jupyter Notebook Tutorial
Our [Jupyter Notebook Tutorial](https://github.com/Azure/spatio-private-preview-docs/blob/main/Spatio_GeoCatalog_Tutorial.ipynb) is the fastest way to get started using a GeoCatalog. We suggest running this tutorial through Visual Studio Code's notebook integration in a Python virtual environment. However, this notebook should run wherever you can run Jupyter notebooks, provided the following requirements are met:

* Python 3.8 or later
* Azure CLI is installed, and you have run `az login` to log into your Azure account
* You've installed the necessary requirements with `pip install -r requirements.txt`

The tutorial notebook includes commands to run `az login` and `pip install -r requirements.txt`. You can skip these steps if you've already run them outside of the notebook.

#### Markdown Tutorial

As an alternative to the Jupyter notebook tutorial, we also have the same content arranged as two Quickstarts intended to be followed sequentially, in the form of Markdown files with Python code snippets:

* [Create a STAC Collection](./quickstarts/collection-api-python.md)
* [Add STAC Items to a Collection](quickstarts/items-api-python.md)

### Quickstarts
Please use the following Quickstart guides to help you get started using and understanding more specific GeoCatalog topics:

* [Setup an Ingestion Source Prior to Ingesting Data](quickstarts/ingestion-source.md)
* [Creating a STAC Item from Scratch](quickstarts/create-stac-items.md)
* [Add STAC Items in Bulk to a collection](quickstarts/bulk-ingestion-api.md)
* [Using GeoCatalog in Azure Batch](quickstarts/azure-batch.md)
* [Render Config and item_assets Guide](quickstarts/render-config.md)
* [Manage access to MPC Pro](quickstarts/rbac-quickstart.md)

## MPC Pro Concepts

### Ingesting data into MPC Pro

MPC Pro's ingestion capabilities allow users to bring their own data into a cloud enabled geodatabase effective at standardizing, storing, and managing geospatial assets at scale. For more information on ingestion refer to [Concept: Ingesting data into MPC Pro](concepts/ingestion-overview.md).

### Collection Configuration

#### Mosaic

GeoCatalog's Explorer allows you to specify one or more mosaic definitions for your collection. These mosaic definitions enable you to instruct GeoCatalog's Explorer on how to filter which items are displayed within the Explorer. For example, one basic render configuration would be to display the most recent image for any given area. More advanced render configurations allow you to render different views such as the least cloudy image for a given location captured in October 2023.

#### Render

Before STAC item assets can be viewed within the Explorer you must upload a render config for your STAC collection. These render configs are used by GeoCatalog to render images in different ways within the Explorer. This is because a STAC item may contain many different assets that can be combined to create entirely new images of a given area that highlight visible or non-visible phenomena. For instance, Sentinel-2 STAC items contain many different types of images that can be combined to form false color images such as color infrared. A properly formatted render config instructs GeoCatalog on how to properly create these images so they can be displayed in GeoCatalog's Explorer.  For more information see [Quickstart: Render Config and item_assets Guide](/quickstarts/render-config.md).

#### Tile Settings

You also have the ability to set other Tile Settings based on the unique features of your STAC collection. For example, you can set the min-zoom parameter that defines the zoom level at which the selected STAC item assets within your collection will appear on the map. High resolution imagery should have a high min zoom level to avoid experiencing latency when using the Explorer. Low resolution imagery can have lower min zoom levels without issue. For more information see [Quickstart: Tile Settings](/quickstarts/tile-settings.md).

#### Queryables

If your collection contains a large number of STAC items, running complex queries against your collection may take large amounts of time. To prevent this, GeoCatalog provides the ability to index additional fields within your STAC items to improve your query performance. If this is of interest, please contact us for assistance.
