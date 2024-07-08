---
title: Migrate Bing Maps Data Source Management and Query API to Azure Maps API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Bing Maps Data Source Management and Query API to the appropriate Azure Maps API.
author: eriklindeman
ms.author: eriklind
ms.date: 05/15/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Migrate Bing Maps Data Source Management and Query API

The Bing Maps Spatial Data Services (SDS) has several capabilities similar to Azure Maps and other Azure services. Bing Maps SDS supports storing, managing, and querying your custom spatial data using the SDS [Data Source Management] and [Query] API, querying public points of interest data using the SDS [Public Data Sources] and [Query] API, batch geocoding location data using the SDS [Geocode Dataflow] API and getting geographical polygon boundaries using the SDS [Geodata] API.

This article covers alternatives to the SDS functionality for storing, managing, and querying your custom spatial data sources. If you need guidance on migrating from the other SDS capabilities to Azure Maps, refer to the following migration guides.

- [Migrating Bing Maps SDS Geocode Dataflow API]
- [Migrating Bing Maps SDS Geodata API]

## Prerequisites

- An [Azure Account]
- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Bing Maps SDS Data Source Management and Query API alternatives

Azure Maps in combination with other Azure services offer state of the art solutions for storing, managing, and performing spatial querying on your custom location data. All while handling security, compliance, and privacy requirements. Azure has several alternative solutions to the Bing Maps SDS Data Source Management and Query API available to you.

Azure Maps integrates with other Azure services to store, manage, and perform spatial querying on your custom spatial data sources. For example, Azure offers several database products that support geospatial data capabilities, such as the following database products:

- [Azure SQL Database]: A relational database that supports geography and geometry data types and [spatial methods], such as [STArea], [STDistance], [STIntersects], [STWithin], and many more.
- [Azure Cosmos DB]: A NoSQL database that supports GeoJSON data types and [spatial queries], such as [ST_AREA], [ST_DISTANCE], [ST_WITHIN], [ST_INTERSECTS], [ST_ISVALID], and [ST_ISVALIDDETAILED].
- [Azure Database for PostgreSQL]: An open-source relational database that supports [PostGIS], an extension that adds support for geographic objects and spatial functions, such as [ST_Area], [ST_Distance], [ST_Within], [ST_Intersects], [ST_IsValid], and [ST_IsValidReason].

To load and present your data on a map, you need to build a service layer (an API) that is used by the [Azure Maps Web SDK client] to get the data that needs to be displayed on the map. The following illustration is a simple architecture design showing what you need for this scenario:

:::image type="content" source="./media/migration-guides/process-diagram.png" alt-text="A screenshot showing elements of an Azure Maps application with a section showing the Azure SQL database, Azure Function and Azure Maps accpount titled Azure subscription and another section titled your website with an Azure Maps web control in it.":::

### More information

- [Create a data source for a map in Microsoft Azure Maps]
- [How to use the Azure Maps spatial IO module]
- [Read and write spatial data with Microsoft Azure Maps]

## Locator starter project

If you need a locator solution, such as a store locator, job searching by location or finding a house to buy or rent, we have a store locator starter project that uses Azure Maps and Azure Cosmos DB to get you started quickly. The [Azure Maps Store Locator] provides an impressive range of capabilities to enhance your location-based services:

- **Store Locator Backend**: Offers REST APIs and a ‘Store Locator Web Control’.
- **Robust Autocomplete Search**: Enables searching for store names, addresses, points of interest (POI), or zip codes.
- **High Location Capacity**: Supports over 10,000 locations.
- **Proximity Insights**: Displays nearby stores and their respective distances.
- **Location-based Search**: Allows searching based on the user's or device's location.
- **Travel Time Estimates**: Presents travel time for walking and driving options.
- **Detailed Store Information**: Offers store details via popups and directions.
- **Dynamic Filtering**: Allows the user to filter based on dynamic store features.
- **Detailed Store Page**: Explore what a specific store offers with an embedded map.
- **Security Measures**: Utilizes Microsoft Entra ID for secure location management system access, ensuring only authorized employees can update store details. For more information, see [Microsoft Entra authentication].
- **Rich Store Data**: Includes store details such as location, opening hours, store photos, and facilitates the addition of custom store features and services.
- **Accessibility Features**: Incorporates speech recognition and other accessibility options.
- **Seamless Deployment**: Easy deployment within your Azure subscription.

:::image type="content" source="./media/migration-guides/azure-maps-store-locator.gif" alt-text="A screenshot showing the Azure Maps store locator sample.":::

The Azure Maps store locator starter project gives you the following general architecture that you can customize and expand on to meet your specific business requirements.

:::image type="content" source="./media/migration-guides/process-diagram-store-locator.png" alt-text="A diagram showing the relationship between the different elements of the Azure Maps store locator sample application. It has two main sections, the first titled Azure subscription with a resource group that contains a web server with the website and store locator APIs app, an Azure Cosmos database and an Azure Maps account. The second section is titled your website and contains the store locator control and Azure Maps Web Control.":::

## Additional information

- [Azure-Samples/Azure-Maps-Locator: Azure Maps Locator Source Code] (github.com)
- [Azure Maps Store Locator Blog Post] (microsoft.com)
- [Tutorial: Use Azure Maps to create store locator]

### Support

- [Microsoft Q&A Forum]

[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Account]: https://azure.microsoft.com/
[Azure Cosmos DB]: /azure/cosmos-db/nosql/query/geospatial-intro
[Azure Database for PostgreSQL]: https://azure.microsoft.com/services/postgresql/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps Store Locator Blog Post]: https://techcommunity.microsoft.com/t5/azure-maps-blog/help-customers-find-your-business-with-the-azure-maps-store/ba-p/3955431
[Azure Maps Store Locator]: https://github.com/Azure-Samples/Azure-Maps-Locator
[Azure Maps Web SDK client]: how-to-use-map-control.md
[Azure SQL Database]: /sql/relational-databases/spatial/spatial-data-sql-server
[Azure-Samples/Azure-Maps-Locator: Azure Maps Locator Source Code]: https://github.com/Azure-Samples/Azure-Maps-Locator
[Create a data source for a map in Microsoft Azure Maps]: create-data-source-web-sdk.md
[Data Source Management]: /bingmaps/spatial-data-services/data-source-management-api
[Geocode Dataflow]: /bingmaps/spatial-data-services/geocode-dataflow-api
[Geodata]: /bingmaps/spatial-data-services/geodata-api
[How to use the Azure Maps spatial IO module]: how-to-use-spatial-io-module.md
[Microsoft Entra authentication]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft Q&A Forum]: /answers/tags/209/azure-maps
[Migrating Bing Maps SDS Geocode Dataflow API]: migrate-geocode-dataflow.md
[Migrating Bing Maps SDS Geodata API]: migrate-geodata.md
[PostGIS]: https://postgis.net/
[Public Data Sources]: /bingmaps/spatial-data-services/public-data-sources
[Query]: /bingmaps/spatial-data-services/query-api/
[Read and write spatial data with Microsoft Azure Maps]: spatial-io-read-write-spatial-data.md
[spatial methods]: /sql/t-sql/spatial-geography/ogc-methods-on-geography-instances
[spatial queries]: /azure/cosmos-db/nosql/query/geospatial
[ST_AREA]: /azure/cosmos-db/nosql/query/st-area
[ST_DISTANCE]: /azure/cosmos-db/nosql/query/st-distance
[ST_INTERSECTS]: /azure/cosmos-db/nosql/query/st-intersects
[ST_ISVALID]: /azure/cosmos-db/nosql/query/st-isvaliddetailed
[ST_ISVALIDDETAILED]: /azure/cosmos-db/nosql/query/st-isvaliddetailed
[ST_IsValidReason]: https://postgis.net/docs/ST_IsValidReason.html
[ST_WITHIN]: /azure/cosmos-db/nosql/query/st-within
[STArea]: /sql/t-sql/spatial-geography/starea-geography-data-type
[STDistance]: /sql/t-sql/spatial-geography/stdistance-geography-data-type
[STIntersects]: /sql/t-sql/spatial-geography/stintersects-geography-data-type
[STWithin]: /sql/t-sql/spatial-geography/stwithin-geography-data-type
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Tutorial: Use Azure Maps to create store locator]: tutorial-create-store-locator.md
