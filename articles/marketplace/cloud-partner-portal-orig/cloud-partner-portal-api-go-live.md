---
title: Go Live | Azure Marketplace
description: The Go Live API initiates the offer live listing process.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: reference
ms.date: 09/13/2018
ms.author: pabutler
---

Go Live
=======

This API starts the process for pushing an app to production. This operation is usually
long-running. This call uses the notification email list
from the [Publish](./cloud-partner-portal-api-publish-offer.md) API operation.

 `POST  https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/golive?api-version=2017-10-31` 

URI parameters
--------------

|  **Name**      |   **Description**                                                           | **Data type** |
|  --------      |   ---------------                                                           | ------------- |
| publisherId    | Publisher identifier for the offer to retrieve, for example `contoso`       |  String       |
| offerId        | Offer identifier of the offer to retrieve                                   |  String       |
| api-version    | Latest version of the API                                                   |  Date         |
|  |  |  |


Header
------

|  **Name**       |     **Value**       |
|  ---------      |     ----------      |
| Content-Type    | `application/json`  |
| Authorization   | `Bearer YOUR_TOKEN` |
|  |  |


Body example
------------

### Response

`Operation-Location: https://cloudpartner.azure.com/api/publishers/contoso/offers/contoso-virtualmachineoffer/operations/56615b67-2185-49fe-80d2-c4ddf77bb2e8`


### Response Header

|  **Name**             |      **Value**                                                            |
|  --------             |      ----------                                                           |
| Operation-Location    |  URL to query to determine the current status of the operation            |
|  |  |


### Response status codes

| **Code** |  **Description**                                                                        |
| -------- |  ----------------                                                                        |
|  202     | `Accepted` - The request was successfully accepted. The response contains a location to track the operation status. |
|  400     | `Bad/Malformed request` - Additional error information is found within the response body. |
|  404     |  `Not found` - The specified entity does not exist.                                       |
|  |  |
