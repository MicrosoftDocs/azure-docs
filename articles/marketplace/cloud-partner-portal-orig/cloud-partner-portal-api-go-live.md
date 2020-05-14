---
title: Go Live | Azure Marketplace
description: The Go Live API initiates the offer live listing process.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 04/08/2020
ms.author: dsindona
---

# Go Live

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with Partner Center and will continue to work after your offers are migrated to Partner Center. The integration introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-api-overview) to ensure your code continues to work after the migration to Partner Center.

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
