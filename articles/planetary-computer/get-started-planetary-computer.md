---
title: Get started with Microsoft Planetary Computer Pro
description: "Learn how to get started with Microsoft Planetary Computer Pro by provisioning a GeoCatalog, organizing geospatial data using STAC collections, ingesting assets, and exploring datasets through APIs and visualization tools"
author: prasadkomma
ms.author: prasadkomma
ms.service: planetary-computer
ms.topic: get-started #Don't change
ms.date: [04/22/2025]

#customer intent: As a new customer, I want to learn how to use Microsoft Planetary Computer Pro to solve my geospatial data management challenges.

---

# Get started with Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro (MPC Pro) is an Azure cloud service for storing, cataloging and securely distributing geospatial data across an Enterprise. This Get Started guide will assist you the basics of deploying the service and creating your first [Spatio Temporal Asset (STAC) Collection](./stac-overview.md). 

## Prerequisites

- An Azure account and subscription [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Table of Contents

| Get Started                     | Deeper Dive                                   |
|-------------------------------------|-----------------------------------------|
| [Deploy a GeoCatalog Resource in your Azure Subscription](#deploy-a-geocatalog-resource-in-your-azure-subscription) | [Quickstart: Deploy a GeoCatalog Resource](/deploy-geocatalog-resource.md)            |
| [Create a STAC Collection to organize your data](#create-a-stac-collection-to-organize-your-data) | Create a STAC Collection to organize your data                |
| [Ingest Data into a STAC Collection](#ingest-data-into-a-stac-collection) | [Concept: Ingestion](./ingestion-overview.md)      |
| [Configure Your STAC Collection for Visualization](#configure-your-stac-collection-for-visualization) | [Concept: STAC Collection Configuration & Visualization](./stac-collection-configuration.md)  |
| [Connect or Build Applications with your Data](#connect-or-build-applications-with-your-data) | Connect or Build Applications with Your Data |

## Deploy a GeoCatalog Resource in your Azure Subscription

A Microsoft Planetary Computer Pro deployment is called a GeoCatalog and is available to deploy through the Azure Portal. 

To deploy a GeoCatalog, navigate to the [Azure Portal](https://portal.azure.com/), and search for "GeoCatalog"

:::image type="content" source="media/search-for-geocatalogs.png" alt-text="Screenshot of searching for GeoCatalogs in the Azure portal.":::

Full details of the deployment process are available in the [Deploy Geocatalog Quickstart](/deploy-geocatalog-resource.md)

## Create a STAC Collection to organize your data

All data managed in Microsoft Planetary Computer Pro is organized into groupings conforming to the [STAC Collection standard](./stac-overview.md#stac-collections) 

<!-- TODO, Add Screenshot showing where to create collection and then link to Create Collection Quickstart

-->

## Ingest Data into a STAC Collection

[Ingestion](./ingestion-overview.md) is the process of copying your data from an external data store to be managed and cataloged by Microsoft Planetary Computer Pro. 

The recommended and most secure method for ingesting data is to have the data stored in Azure Blob Storage and for you to provide read access to Blob Storage container using Managed Identity. 

>[!WARNING]
>All data ingested into MPC Pro requires [STAC Items](./>stac-overview.md#introduction-to-stac-items). 

>[!TIP]
> To accelerate the creation of STAC Items, we have a [detailed tutorial](./create-stac-item.md) and also have a open source tool called STAC Forge.

:::image type="content" source="media/ingestion-secure.png" alt-text="Diagram illustrating the secure data ingestion process into Microsoft Planetary Computer Pro using Azure Blob Storage and Managed Identity.":::

### Get your data ready for Ingestion
> [!div class="checklist"]
> * [Setup Managed Identity Access to your Azure Blob Storage](./setup-ingestion-credentials-managed-identity.md)
> * [Create STAC Items for your data](./create-stac-item.md)
> * Ingest Your Data a [single item at a time](./add-stac-item-to-collection.md) or through [bulk ingestion](./bulk-ingestion-api.md)


## Configure Your STAC Collection for Visualization

Ingested data can be visualized both in the built-in [Data Explorer](./use-explorer.md) or through your own applications. To do this, the STAC Collection must be configured to support visualization. 

<!-- TODO, Links to new Content
-->

### Get your STAC Collection ready for Visualization
> [!div class="checklist"]
> * [Review Supported Data Types](./supported-data-types.md)
> * [Configure Mosaic Settings](./mosaic-configurations-for-collections.md)
> * [Setup Rendering](./render-configuration.md)
> * [Adjust Tile Settings](./tile-settings.md)


## Connect or Build Applications with your Data

<!-- TODO, Links to new Content
-->


## Get help

1. Review the [rest of the documentation](./) to see if answers your question
2. [Check out Microsoft Q&A](./link to content] to ask a question or see if it has been answered
3. [File a Support Ticket](https://azure.microsoft.com/en-us/support/create-ticket)
4. Contact the team at MPCProSupport@microsoft.com 


## Next steps

> [!div class="nextstepaction"]
> [Next sequential article title](link.md)

-or-

* [Related article title](link.md)
* [Related article title](link.md)
* [Related article title](link.md)

<!-- Optional: Next step or Related content - H2

Consider adding one of these H2 sections (not both):

A "Next step" section that uses 1 link in a blue box 
to point to a next, consecutive article in a sequence.

-or- 

A "Related content" section that lists links to 
1 to 3 articles the user might find helpful.

-->

<!--

Remove all comments except the customer intent
before you sign off or merge to the main branch.

-->