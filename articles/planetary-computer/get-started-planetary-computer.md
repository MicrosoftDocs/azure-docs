---
title: Getting Started Guide for Microsoft Planetary Computer Pro
description: "Get started with Microsoft Planetary Computer Pro: Deploy GeoCatalog, manage geospatial data with STAC collections, ingest assets, and explore datasets via APIs."
author: prasadko
ms.author: prasadkomma
ms.service: planetary-computer-pro
ms.topic: get-started
ms.date: 01/09/2026
#customer intent: As a new customer, I want to learn how to use Microsoft Planetary Computer Pro to solve my geospatial data management challenges.
ms.custom:
---

# Get started with Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro is an Azure cloud service for storing, cataloging, and securely distributing geospatial data across an enterprise. This article helps you with the basics of deploying the service and creating your first [SpatioTemporal Asset Catalog (STAC) Collection](./stac-overview.md) to store and distribute your geospatial data. 

## Prerequisites

- An Azure account and subscription [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Table of Contents

| Get Started                     | Deeper Dive                                   |
|-------------------------------------|-----------------------------------------|
| [Deploy a GeoCatalog Resource in your Azure Subscription](#deploy-a-geocatalog-resource-in-your-azure-subscription) | [Quickstart: Deploy a GeoCatalog Resource](./deploy-geocatalog-resource.md)            |
| [Create a STAC Collection to organize your data](#create-a-stac-collection-to-organize-your-data) | [Create a STAC Collection to organize your data](./create-collection-web-interface.md)                |
| [Ingest Data into a STAC Collection](#ingest-data-into-a-stac-collection) | [Concept: Ingestion](./ingestion-overview.md)      |
| [Configure Your STAC Collection for Visualization](#configure-your-stac-collection-for-visualization) | [Concept: STAC Collection Configuration & Visualization](./configure-collection-web-interface.md)  |
| [Connect and build applications with your data](#connect-and-build-applications-with-your-data) | [Connect and build applications with your data](./build-applications-with-planetary-computer-pro.md) |

## Deploy a GeoCatalog resource in your Azure subscription

A Microsoft Planetary Computer Pro deployment is called a GeoCatalog and is available to deploy through the Azure portal. 

To deploy a GeoCatalog, go to the [Azure portal](https://portal.azure.com/) and search for "GeoCatalog"

[ ![Screenshot of searching for GeoCatalogs in the Azure portal.](media/search-for-geocatalogs.png) ](media/search-for-geocatalogs.png#lightbox)

For more information about the deployment process, see the [Deploy GeoCatalog Quickstart](./deploy-geocatalog-resource.md).

After you deploy the service, you can control access to the GeoCatalog resource through the **Access control (IAM)** tab in the left sidebar:

[ ![Screenshot of the Access control (IAM) tab in the Azure portal, showing options to manage role assignments.](media/role-based-access-control-identity-access-management-blade.png) ](media/role-based-access-control-identity-access-management-blade.png#lightbox)

For more information about the **GeoCatalog Administrator** and **GeoCatalog Reader** roles, see [Manage Access](./manage-access.md).

## Create a STAC Collection to organize your data

All data managed in Microsoft Planetary Computer Pro is organized into groupings that conform to the [STAC Collection standard](./stac-overview.md#stac-collections). 

To create a new STAC Collection, open the GeoCatalog web interface by selecting the GeoCatalog URI link on the Resource overview page in the Azure portal. After opening the web interface, select the **Create collection** button:

[ ![Screenshot of the Create collection button in the GeoCatalog web interface.](media/create-collection-button.png) ](media/create-collection-button.png#lightbox)

For more information about setting up your STAC collection, see the [Create Collection from the Web Interface](./create-collection-web-interface.md) and [Create Collection from the API](./create-stac-collection.md) quickstarts. 

## Ingest data into a STAC collection

[Ingestion](./ingestion-overview.md) is the process of copying your data from an external data store to your GeoCatalog resource and cataloging it. During ingestion, the process converts data that isn't in a cloud-optimized format into a cloud-optimized format. 

The recommended and most secure method for ingesting data is to store the data in Azure Blob Storage and provide read access to the Blob Storage container by using Managed Identity. 

>[!WARNING]
>All data ingested into Planetary Computer Pro requires [STAC Items](./stac-overview.md#introduction-to-stac-items). 

>[!TIP]
> To accelerate the creation of STAC Items, use the [detailed tutorial](./create-stac-item.md) and the open source tool called STAC Forge.

[ ![Diagram illustrating the secure data ingestion process into Microsoft Planetary Computer Pro using Azure Blob Storage and Managed Identity.](media/ingestion-secure.png) ](media/ingestion-secure.png#lightbox)

### Get your data ready for ingestion
> [!div class="checklist"]
> * [Set up Managed Identity Access to your Azure Blob Storage](./set-up-ingestion-credentials-managed-identity.md)
> * [Create STAC Items for your data](./create-stac-item.md)
> * Ingest your data a [single item at a time](./add-stac-item-to-collection.md) or through [bulk ingestion](./bulk-ingestion-api.md)


## Configure your STAC Collection for visualization

You can visualize ingested data in the built-in [Data Explorer](./use-explorer.md) or through your own applications. 

>[!NOTE]
> You must configure a STAC Collection to support visualization before it appears in the Data Explorer. 

Planetary Computer Pro's Tiler service [requires configuration](./collection-configuration-concept.md) to properly display your ingested data. You can find all of these configuration options under the **Configuration** tab in the STAC Collection view:

[ ![Screenshot of the Configure collection button in the GeoCatalog web interface.](media/configure-collection-button.png) ](media/configure-collection-button.png#lightbox)

### Get your STAC Collection ready for visualization
> [!div class="checklist"]
> * [Review Supported Data Types](./supported-data-types.md)
> * [Configure Mosaic Settings](./mosaic-configurations-for-collections.md)
> * [Set up Rendering](./render-configuration.md)
> * [Adjust Tile Settings](./tile-settings.md)


## Connect and build applications with your data

After you ingest data, you can use it in [applications inside and outside of Microsoft Planetary Computer Pro](./build-applications-with-planetary-computer-pro.md). 

If you [configure data for visualization](./configure-collection-web-interface.md), you can search and view it through the [Data Explorer tab](./use-explorer.md).  

[ ![Screenshot showing where the Data Explorer tab is.](media/explorer-link.png) ](media/explorer-link.png#lightbox)

You can also access data directly by using the [GeoCatalog APIs](/rest/api/planetarycomputer). For details on establishing permissions for your applications, review the [Application Authentication](./application-authentication.md) documentation. 

Planetary Computer Pro supports [connecting collections to ESRI's ArcGIS Pro Service](./create-connection-arc-gis-pro.md) to enable GIS-type work flows. 
You can also use [QGIS](./configure-qgis.md) to work with your GeoCatalog data in an open-source desktop GIS.

## Get help

1. Review the [rest of the documentation](/azure/planetary-computer) for relevant articles
1. [Check out Microsoft Q&A](/answers/tags/775/planetary-computer-pro) to ask a question or find answers from others
1. [File a Support Ticket](https://azure.microsoft.com/support/create-ticket)


## Next steps

To get started with an end-to-end workflow, try this interactive tutorial:

> [!div class="nextstepaction"]
> [Using the Planetary Computer Pro APIs to Ingest and Visualize Data](./api-tutorial.md)
