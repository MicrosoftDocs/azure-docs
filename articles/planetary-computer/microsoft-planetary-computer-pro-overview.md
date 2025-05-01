---
title: Microsoft Planetary Computer Pro Features and Capabilities
description: This article provides an overview of Microsoft Planetary Computer Pro Azure Service.
author: aloverro
ms.author: adamloverro
ms.service: azure
ms.topic: overview
ms.date: 04/30/2025

#customer intent: As a user of geospatial data and Azure cloud services, I want to undertand what Microsoft Planetary Computer Pro is so that I can determine it is the correct service for my use case.
---

# What is Microsoft Planetary Computer Pro?

Microsoft Planetary Computer's vision is to empower every organization to unlock the full potential of geospatial data. Microsoft Planetary Computer (MPC) Pro is a geospatial data management service built on top of Azure's hyperscale infrastructure and ecosystem. The MPC Pro GeoCatalog is a new Azure resource that provides foundational capabilities to ingest, manage, search, and distribute geospatial datasets. GeoCatalogs use the SpatioTemporal Asset Catalog (STAC) open specification and standard, enabling geospatial software interoperability. Learn more about STAC and how it relates to MPC Pro GeoCatalogs in the [STAC overview](./stac-overview.md).

## Why Use Planetary Computer Pro?

MPC Pro helps users and organizations to easily store, organize, and retrieve their geospatial data in the hyperscale cloud. The GeoCatalog technology is both easy to manage and quickly scalable, deploying in less than 10 minutes, and handling geospatial data workloads from gigabytes to tens of petabytes.

MPC Pro can speed users journey from raw data to insights for multiple user personas.

### Geospatial Data Scientists

Geospatial data scientists and research teams, operating as part of an academic institution or an enterprise research organization, use MPC Pro GeoCatalogs to focus less on data hosting, organization, and management, and spend more time on data interrogation and processing. 

### Geospatial Solution Developers

 The quality and volume of GeoSpatial data is increasing constantly, spurring the development of new technologies. GeoSpatial insight and solution developers are leading this trend, providing value-added data processing solutions, powered by Artificial Intelligence (AI) and Machine Learning (ML). Solution developers use MPC Pro to manage both their processing pipeline data, and host their customer-facing geospatial data products.

### Enterprise Data Managers

MPC Pro GeoCatalogs bring a standards-based organizational structure to the geospatial data required by the modern enterprise data system. The MPC Pro platform is compatible with enterprise and open-source geospatial data tooling, and delivers capabilities covered by the Azure Service Level Agreement (SLA), ensures high performance and availability.

## Scenarios
An MPC Pro GeoCatalog supports a wide range of capabilities to enhance the value and usability of your geospatial data.

| If you want to...                                      | then...                                                                                     |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------|
| Organize your geospatial datasets into collections          | Use the [Create a STAC Collection](./create-stac-collection.md) guide. |
| Visualize all your geospatial data in one place | Use the GeoCatalog data [Explorer](./use-explorer.md) |
| Control and manage access to your geospatial data                       | Follow the steps in [Manage access to MPC Pro](./manage-access.md).                        |
| Work with cloud-optimized 3D datasets | Follow our [Data Cube Quickstart](./datacube-quickstart.md)
| Optimize query performance for large collections       | Configure Explorer [Queryables](./queryables-for-explorer-custom-search-filter.md) |

## Key Features
- A **zone-redundant, managed storage** solution for raster, data cube, and vectorized (coming soon) data types
- Built-in, **cloud-optimization** for [Supported Data Types](./supported-data-types.md) performed upon ingestion
- A **managed STAC API** for all stored data 
- Built-in data [Explorer](./use-explorer.md) for visualizing all your geo
- **Automated STAC catalog ingestion** from public and private data sources using the [Bulk Ingestion API](./bulk-ingestion-api.md)
- A powerful mosaic and tiling API for pixel-wise data query and retrieval
- An Open Geospatial Consortium (OGC) Web Map Tile Service (WMTS) API endpoint for **map application integration**

## Product Lifecycle                   

The end-to-end GeoCatalog product lifecycle traverses the following stages:

1. **GeoCatalog Deployment**: [Deploy the GeoCatalog](./deploy-geocatalog-resource.md) resource in an Azure Subscription
1. **Manage Access**: [Assign Roles](./manage-access.md) to manage access to GeoCatalog capabilities
1. **Create Collections**: Organize geospatial data with[STAC Collections](./create-stac-collection.md) 
1. **Data Ingestion**: Use the [Single Item](./create-stac-item.md) or [Bulk Ingestion](./bulk-ingestion-api.md) APIs to add data to a GeoCatalog
1. **Visualize Data**: Use the [Explorer](./use-explorer.md) tool to visualize geospatial data assets
1. **Query Assets**: Use the STAC API to search for STAC Items and Assets
1. **Query Data**: Use the Tiling API to read pixel-level information
1. **Map Data**: Use the WMTS API to add data to a mapping application
1. **Modify / Remove Data**: Use the STAC API to modify or delete Collections or Items.
1. **GeoCatalog Deletion**: [Delete a GeoCatalog](./delete-geocatalog-resource.md) from an Azure Subscription
At a high level, a GeoCatalog contains four major components:

## Getting Started
Follow our [Getting Started](./get-started-planetary-computer.md) guide to begin using MPC Pro.

## Related Content
- [STAC overview](./stac-overview.md)
- [Deploy the GeoCatalog](./deploy-geocatalog-resource.md)
- [Manage access to MPC Pro](./manage-access.md)
- [Create a STAC Collection](./create-stac-collection.md)
- [Create a STAC Item](./create-stac-item.md)
- [Bulk Ingestion API](./bulk-ingestion-api.md)
- [Supported Data Types](./supported-data-types.md)
- [Use Explorer](./use-explorer.md)
- [Data Cube Quickstart](./datacube-quickstart.md)
- [Queryables for Explorer Custom Search Filter](./queryables-for-explorer-custom-search-filter.md)
- [Delete a GeoCatalog](./delete-geocatalog-resource.md)
