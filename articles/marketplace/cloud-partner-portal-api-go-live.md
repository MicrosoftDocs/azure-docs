---
title: Go Live API - Azure Marketplace
description: The Go Live API initiates the offer live listing process.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
author: mingshen-ms
ms.author: mingshen
ms.date: 07/14/2020
---

# Go live API

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with and will continue working in Partner Center. The transition introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](./cloud-partner-portal-api-overview.md) to ensure your code continues working after transitioning to Partner Center. CPP APIs should only be used for existing products that were already integrated before transition to Partner Center; new products should use Partner Center submission APIs.

This API starts the process for pushing an app to production. This operation is usually
long-running. This call uses the notification email list
from the [Publish](./cloud-partner-portal-api-publish-offer.md) API operation.

 `POST  https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/golive?api-version=2017-10-31` 

## URI parameters
--------------

|  **Name**      |   **Description**                                                           | **Data type** |
|  --------      |   ---------------                                                           | ------------- |
| publisherId    | Publisher identifier for the offer to retrieve, for example `contoso`       |  String       |
| offerId        | Offer identifier of the offer to retrieve                                   |  String       |
| api-version    | Latest version of the API                                                   |  Date         |
|  |  |  |

## Header
------

|  **Name**       |     **Value**       |
|  ---------      |     ----------      |
| Content-Type    | `application/json`  |
| Authorization   | `Bearer YOUR_TOKEN` |
|  |  |

## Body example

### Response

#### Migrated offers

`Location: /api/publishers/contoso/offers/contoso-offer/operations/56615b67-2185-49fe-80d2-c4ddf77bb2e8?api-version=2017-10-31`

#### Non-migrated offers

`Location: /api/operations/contoso$contoso-offer$2$preview?api-version=2017-10-31`

### Response Header

|  **Name**             |      **Value**                                                            |
|  --------             |      ----------                                                           |
| Location    |  The relative path to retrieve this operation's status            |
|  |  |

### Response status codes

| **Code** |  **Description**                                                                        |
| -------- |  ----------------                                                                        |
|  202     | `Accepted` - The request was successfully accepted. The response contains a location to track the operation status. |
|  400     | `Bad/Malformed request` - Additional error information is found within the response body. |
|  404     |  `Not found` - The specified entity does not exist.                                       |
|  |  |
