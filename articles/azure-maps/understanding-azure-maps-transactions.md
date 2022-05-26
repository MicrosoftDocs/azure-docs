---
title:  Understanding Microsoft Azure Maps Transactions
titleSuffix:  Microsoft Azure Maps
description: Learn about Microsoft Azure Maps Transactions
author: stevemunk
ms.author: v-munksteve
ms.date: 06/03/2022
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---

# Understanding Azure Maps Transactions

When you use Azure Maps Services, the API requests you make generate transactions. Your transaction usage is available for review in your [Azure Portal]( https://portal.azure.com) ‘Metrics’ report. For additional information see [View Azure Maps API usage metrics](how-to-view-api-usag). These transactions can be either billable or non-billable usage, depending on the service and the feature. It’s important to understand which usage generates a billable transaction and how it’s calculated so you can plan and budget for the costs associated with using Azure Maps. Billable transactions will show up in your Cost Analysis report within the Azure Portal.

Below is a summary of which Azure Maps services generate transactions, billable and non-billable, along with any notable aspects that are helpful to understand in how the number of transactions are calculated.

## Azure Maps Transaction information by service

| Azure Maps Service  | Billable       | Transaction                                                                    |
|---------------------|----------------|--------------------------------------------------------------------------------|
| Data <br/> Data v2| Yes, with the exception of MapDataStorageService.GetDataStatus and MapDataStorageService.GetUserData which are non-billable. | 1 request = 1 transaction |
| Elevation (DEM)     | Yes            | 1 request = 2 transactions <br/><br/>If requesting elevation for a single point then 1 request = 1 transaction |
| Geolocation         | Yes            | 1 request = 1 transaction |
| Render<br/>Render v2| Yes, with the exception of Terra maps (MapTile.GetTerraTile and layer=terra) which are non-billable. | 15 tiles = 1 transaction, except microsoft.dem is 1 tile = 50 transactions |
| Route               | Yes            | 1 request = 1 transaction <br/><br/>If using the Route Matrix, each cell in the Route Matrix request generates a billable Route transaction.  <br/><br/>If using Batch Directions, each origin/destination coordinate pair in the Batch request call generates a billable Route transaction.  |
| Search<br/>Search v2 | Yes            | 1 request = 1 transaction.  <br/><br/>If using Batch Search, each location in the Batch request generates a billable Search transaction.  |
| Spatial             | Yes, with the exception of Spatial.GetBoundingBox, Spatial.PostBoundingBox and Spatial.PostPointInPolygonBatch which are non-billable.  | 1 request = 1 transaction.  <br/><br/>If using Geofence, 5 requests = 1 transaction  |
| Timezone            | Yes            | 1 request = 1 transaction            |
| Traffic             | Yes            | 1 request = 1 transaction            |
| Weather             | Yes            | 1 request = 1 transaction            |

<!-- In Bing Maps, any time a synchronous Truck Routing request is made, three transactions are counted. Does this apply also to Azure Maps?-->

## Azure Maps Creator

| Service                                          | Billable                                                                        | Transaction Calculation |
|--------------------------------------------------|---------------------------------------------------------------------------------|-------------------------|
| [Alias](/rest/api/maps/v2/alias)                 | Each request made to the Alias service results in a single transaction.         |1 request = 1 transaction|
| [Conversion](/rest/api/maps/v2/conversion)       | Each request made to the Conversion service results in a single transaction.    | Not transaction-based   |
| [Dataset](/rest/api/maps/v2/dataset)             | Each request made to the Dataset service results in a single transaction.       | Not transaction-based   |
| [Feature State](/rest/api/maps/v2/feature-state) | Each request made to the Feature State service results in a single transaction. |1 request = 1 transaction|
| [Tileset](/rest/api/maps/v2/tileset)             | Each request made to the Tileset service results in a single transaction.       | Not transaction-based   |
| [WFS](/rest/api/maps/v2/wfs)                     | Each request made to the WFS service results in a single transaction.           |1 request = 1 transaction|

<!--
| Service          | Unit of measure         | Price  |
|------------------|-------------------------|--------|
| Map provisioning | 1 storage unit per hour | $0.42  |
| Map render       | 1k transactions         | $0.20  |
| Feature state    | 1k transactions         | $0.03  |
| Web feature      | 1k transactions         | $21    |
-->

## Next steps

> [!div class="nextstepaction"]
> [Azure Maps pricing](https://azure.microsoft.com/pricing/details/azure-maps/)

> [!div class="nextstepaction"]
> [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)

> [!div class="nextstepaction"]
> [Manage the pricing tier of your Azure Maps account](how-to-manage-pricing-tier.md)

> [!div class="nextstepaction"]
> [View Azure Maps API usage metrics](how-to-view-api-usage.md)
