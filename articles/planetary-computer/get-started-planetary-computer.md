---
title: Get started with Microsoft Planetary Computer Pro
description: "Learn how to get started with Microsoft Planetary Computer Pro by provisioning a GeoCatalog, organizing geospatial data using STAC collections, ingesting assets, and exploring datasets through APIs and visualization tools"
author: prasadkomma
ms.author: prasadkomma
ms.service: azure
ms.topic: get-started #Don't change
ms.date: 04/22/2025
#customer intent: As a new customer, I want to learn how to use Microsoft Planetary Computer Pro to solve my geospatial data management challenges.
---

# Get started with Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro (MPC Pro) is an Azure cloud service for storing, cataloging, and securely distributing geospatial data across an Enterprise. This Get Started guide assists you the basics of deploying the service and creating your first [SpatioTemporal Asset (STAC) Collection](./stac-overview.md). 

## Prerequisites

- An Azure account and subscription [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Table of Contents

| Get Started                     | Deeper Dive                                   |
|-------------------------------------|-----------------------------------------|
| [Deploy a GeoCatalog Resource in your Azure Subscription](#deploy-a-geocatalog-resource-in-your-azure-subscription) | [Quickstart: Deploy a GeoCatalog Resource](/deploy-geocatalog-resource.md)            |
| [Create a STAC Collection to organize your data](#create-a-stac-collection-to-organize-your-data) | Create a STAC Collection to organize your data                |
| [Ingest Data into a STAC Collection](#ingest-data-into-a-stac-collection) | [Concept: Ingestion](./ingestion-overview.md)      |
| [Configure Your STAC Collection for Visualization](#configure-your-stac-collection-for-visualization) | [Concept: STAC Collection Configuration & Visualization](./stac-collection-configuration.md)  |
| [Connect and Build Applications with your Data](#connect-and-build-applications-with-your-data) | Connect and Build Applications with Your Data |

## Deploy a GeoCatalog Resource in your Azure Subscription

A Microsoft Planetary Computer Pro deployment is called a GeoCatalog and is available to deploy through the Azure portal. 

To deploy a GeoCatalog, navigate to the [Azure portal](https://portal.azure.com/), and search for "GeoCatalog"

:::image type="content" source="media/search-for-geocatalogs.png" alt-text="Screenshot of searching for GeoCatalogs in the Azure portal.":::

Full details of the deployment process are available in the [Deployed GeoCatalog Quickstart](/deploy-geocatalog-resource.md)

Once the service is deployed, access to the GeoCatalog resource can be controlled through the **Access control (IAM)** tab in the left sidebar:

    :::image type="content" source="media/RBAC_IAM_blade.png" alt-text="Screenshot of the Access control (IAM) tab in the Azure portal, showing options to manage role assignments.":::

More details on the **GeoCatalog Administrator** and **GeoCatalog Reader** role is available in [Manage Access](./manage-access.md) documentation.

## Create a STAC Collection to organize your data

All data managed in Microsoft Planetary Computer Pro is organized into groupings conforming to the [STAC Collection standard](./stac-overview.md#stac-collections) 

<!-- TODO, Add Screenshot showing where to create collection and then link to Create Collection Quickstart

-->

## Ingest Data into a STAC Collection

[Ingestion](./ingestion-overview.md) is the process of copying your data from an external data store to your GeoCatalog resource and cataloging it. Data which isn't in a cloud-optimized data format is converted into cloud-optimized data format. 

The recommended and most secure method for ingesting data is to have the data stored in Azure Blob Storage and for you to provide read access to Blob Storage container using Managed Identity. 

>[!WARNING]
>All data ingested into MPC Pro requires [STAC Items](./>stac-overview.md#introduction-to-stac-items). 

>[!TIP]
> To accelerate the creation of STAC Items, we have a [detailed tutorial](./create-stac-item.md) and also have an open source tool called STAC Forge.

:::image type="content" source="media/ingestion-secure.png" alt-text="Diagram illustrating the secure data ingestion process into Microsoft Planetary Computer Pro using Azure Blob Storage and Managed Identity.":::

### Get your data ready for Ingestion
> [!div class="checklist"]
> * [Setup Managed Identity Access to your Azure Blob Storage](./setup-ingestion-credentials-managed-identity.md)
> * [Create STAC Items for your data](./create-stac-item.md)
> * Ingest Your Data a [single item at a time](./add-stac-item-to-collection.md) or through [bulk ingestion](./bulk-ingestion-api.md)


## Configure Your STAC Collection for Visualization

Ingested data can be visualized both in the built-in [Data Explorer](./use-explorer.md) or through your own applications. Note, the STAC Collection must be configured to support visualization. 

<!-- TODO, Links to new Content
-->

### Get your STAC Collection ready for Visualization
> [!div class="checklist"]
> * [Review Supported Data Types](./supported-data-types.md)
> * [Configure Mosaic Settings](./mosaic-configurations-for-collections.md)
> * [Setup Rendering](./render-configuration.md)
> * [Adjust Tile Settings](./tile-settings.md)


## Connect and Build Applications with your Data

Once data has been ingested, it's available for use in applications inside and outside of Microsoft Planetary Computer Pro. 

Data that is [configured for visualization](./stac-collection-configuration.md) can be searched and viewed through the [Data Explorer tab](./use-explorer.md).  

:::image type="content" source="media/explorer-link.png" alt-text="Screenshot showing where the Data Explorer tab is.":::

Data can also be accessed directly using the [API service](./). For details on establishing permissions for your applications, review the [Application Authentication](./application-authentication.md) documentation. 

<!-- TODO, Links to new Content

-->


## Get help

1. Review the [rest of the documentation](./) to see if answers your question
2. [Check out Microsoft Q&A](./link to content] to ask a question or find answers from others
3. [File a Support Ticket](https://azure.microsoft.com/en-us/support/create-ticket)
4. Contact the team at MPCProSupport@microsoft.com 

<!-- TODO, Links to new Content
 Link to Tutorial and deployment. 
-->

## Next steps

> [!div class="nextstepaction"]
> [Next sequential article title](link.md)