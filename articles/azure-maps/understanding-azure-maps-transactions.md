---
title:  Understanding Microsoft Azure Maps Transactions
titleSuffix:  Microsoft Azure Maps
description: Learn about Microsoft Azure Maps Transactions
author: stevemunk
ms.author: v-munksteve
ms.date: 04/12/2022
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---

# Understanding Azure Maps Transactions

When you use any [Azure Maps API](/rest/api/maps/) with an Azure Maps Key (you must have an [Azure Maps Account](quick-demo-map-app.md#get-the-primary-key-for-your-account)), transactions are recorded. Transactions track API usage and can be billable or non-billable. For example, using the [Azure Maps Render Service](/rest/api/maps/render-v2) to show a map on a web page is a billable transaction, while using the [Get Map Attribution](/rest/api/maps/render-v2/get-map-attribution) API to request map copyright attribution information for a tileset isn't.  

## Azure Maps transaction tables

# [Azure Maps Gen2](#tab/Gen2)

Gen2 is Azure Maps newest pricing tier that provides access to all map features and gives volume-based discounts. Pricing is based on four tiers that operate under a waterfall model, meaning once you reach the transaction ceiling for the current pricing tier, all transactions thereafter will be priced at the next tier’s rate. You only pay for the services you use. For detailed pricing information, see [Azure Maps pricing](https://azure.microsoft.com/pricing/details/azure-maps/).

## Azure Maps Transaction information by service

| Service | Description |
|---------|-------------|
| [Data](/rest/api/maps/data-v2) | Each request made to the Data service results in a single transaction. |
| [Data V2](/rest/api/maps/data-v2) | Each request made to the Data V2 service results in a single transaction. |
| [Elevation](/rest/api/maps/elevation) | For [Elevation multiple point](/rest/api/maps/elevation/get-data-for-points) requests, each API call counts as two Elevation transactions.<br/><br/>For [Elevation bounding box](/rest/api/maps/elevation/get-data-for-bounding-box) requests, one API tile request is counted as 50 Elevation transactions. |
| [Geolocation](/rest/api/maps/geolocation) | Each request made to the Geolocation service results in a single transaction. |
| [Render](/rest/api/maps/render) | 15 tile requests results in one transaction for Base Maps as well as Imagery, Traffic and Weather Tiles.<br/><br/>Transactions aren't counted for any calls to get or set copyright information. |
| [Render V2](/rest/api/maps/render-v2) | 15 tile requests results in one transaction for Base Maps as well as Imagery, Traffic and Weather Tiles.<br/><br/>Transactions aren't counted for any calls to get or set copyright information. |
| [Route](/rest/api/maps/route) | For [Batch Route](/rest/api/maps/route/get-route-directions-batch) calls, each individual route calculation query in the batch counts as a Routing transaction.<br/><br/>For [Route Matrix](/rest/api/maps/route/get-route-matrix), one transaction is counted for every cell in the matrix. If you provide 5 origins and 10 destinations, that would result in 50 Routing transactions |
| [Search](/rest/api/maps/search) | For [Batch Search](/rest/api/maps/search/get-geocoding-batch) calls, each individual query in the batch counts as a Search transaction. |
| [Search V2](/rest/api/maps/search-v2) | For [Batch Search](/rest/api/maps/search-v2/get-geocoding-batch) calls, each individual query in the batch counts as a Search transaction. |
| [Spatial](/rest/api/maps/spatial) | Each request made to the Spatial service results in a single transaction. |
| [Timezone](/rest/api/maps/timezone) | Each request made to the Timezone service results in a single transaction. |
| [Traffic](/rest/api/maps/traffic) | Each request made to the Traffic service results in a single transaction. |
| [Weather](/rest/api/maps/weather) | Each request made to the Weather service results in a single transaction. |

<!-- In Bing Maps, any time a synchronous Truck Routing request is made, three transactions are counted. Does this apply also to Azure Maps?-->

### Azure Maps Creator

| Service                                          | Description                                                                     |
|--------------------------------------------------|---------------------------------------------------------------------------------|
| [Alias](/rest/api/maps/v2/alias)                 | Each request made to the Alias service results in a single transaction.         |
| [Conversion](/rest/api/maps/v2/conversion)       | Each request made to the Conversion service results in a single transaction.    |
| [Dataset](/rest/api/maps/v2/dataset)             | Each request made to the Dataset service results in a single transaction.       |
| [Feature State](/rest/api/maps/v2/feature-state) | Each request made to the Feature State service results in a single transaction. |
| [Tileset](/rest/api/maps/v2/tileset)             | Each request made to the Tileset service results in a single transaction.       |
| [WFS](/rest/api/maps/v2/wfs)                     | Each request made to the WFS service results in a single transaction.           |

<!--
| Service          | Unit of measure         | Price  |
|------------------|-------------------------|--------|
| Map provisioning | 1 storage unit per hour | $0.42  |
| Map render       | 1k transactions         | $0.20  |
| Feature state    | 1k transactions         | $0.03  |
| Web feature      | 1k transactions         | $21    |
-->

# [Azure Maps Gen1](#tab/Gen1)

Azure Maps Gen1

Gen1 pricing will remain in effect for existing Azure Maps customers but you're welcome to change pricing at any time. We strongly encourage you to evaluate the potential cost savings and product benefits you can achieve by moving to Gen2 pricing

| Service | Description |
|---------|-------------|
| [Data](/rest/api/maps/data-v2) | Each request made to the Data service results in a single transaction. |
| [Data V2](/rest/api/maps/data-v2) | Each request made to the Data V2 service results in a single transaction. |
| [Elevation](/rest/api/maps/elevation) | For [Elevation multiple point](/rest/api/maps/elevation/get-data-for-points) requests, each API call counts as two Elevation transactions.<br/><br/>For [Elevation bounding box](/rest/api/maps/elevation/get-data-for-bounding-box) requests, one API tile request is counted as 50 Elevation transactions. |
| [Geolocation](/rest/api/maps/geolocation) | Each request made to the Geolocation service results in a single transaction. |
| [Render](/rest/api/maps/render) | For Maps, Traffic and Weather Tile requests, one transaction is created using increments of 15 tiles. Maps Tile requests made by S1 accounts include Aerial Imagery and Hybrid Aerial Imagery Tile requests. |
| [Render V2](/rest/api/maps/render-v2) | For Maps, Traffic and Weather Tile requests, one transaction is created using increments of 15 tiles. Maps Tile requests made by S1 accounts include Aerial Imagery and Hybrid Aerial Imagery Tile requests. |
| [Route](/rest/api/maps/route) | For [Batch Route](/rest/api/maps/route/get-route-directions-batch) calls, each individual route calculation query in the batch counts as a Routing transaction.<br/><br/>For [Route Matrix](/rest/api/maps/route/get-route-matrix), one transaction is counted for every cell in the matrix. If you provide 5 origins and 10 destinations, that would result in 50 Routing transactions |
| [Search](/rest/api/maps/search) | For [Batch Search](/rest/api/maps/search/get-geocoding-batch) calls, each individual query in the batch counts as a Search transaction. |
| [Search V2](/rest/api/maps/search-v2) | For [Batch Search](/rest/api/maps/search-v2/get-geocoding-batch) calls, each individual query in the batch counts as a Search transaction. |
| [Spatial](/rest/api/maps/spatial) | For Spatial Operations Geofencing, one transaction is created using increments of five Geofencing API calls.<br/> |
| [Timezone](/rest/api/maps/timezone) | Each request made to the Timezone service results in a single transaction. |
| [Traffic](/rest/api/maps/traffic) | Each request made to the Traffic service results in a single transaction. |
| [Weather](/rest/api/maps/weather) | Each request made to the Weather service results in a single transaction. |

---

## Next steps

The following are links to Azure Maps pricing, a pricing calculator to help estimate costs and information on how to view Azure Maps API usage metrics that enable you to track costs in your Azure Maps resource in Azure.

> [!div class="nextstepaction"]
> [Azure Maps pricing](https://azure.microsoft.com/pricing/details/azure-maps/)

> [!div class="nextstepaction"]
> [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)

> [!div class="nextstepaction"]
> [View Azure Maps API usage metrics](how-to-view-api-usage.md)
