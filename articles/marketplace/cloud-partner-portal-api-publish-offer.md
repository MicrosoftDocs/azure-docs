---
title: Publish an offer - Azure Marketplace
description: API to publish the specified offer.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
author: mingshen-ms
ms.author: mingshen
ms.date: 07/14/2020
---

# Publish an offer

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with and will continue working in Partner Center. The transition introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](./cloud-partner-portal-api-overview.md) to ensure your code continues working after transitioning to Partner Center. CPP APIs should only be used for existing products that were already integrated before transition to Partner Center; new products should use Partner Center submission APIs.

Starts the publishing process for the specified offer. This call is a long running operation.

  `POST  https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/publish?api-version=2017-10-31`

## URI parameters
--------------

|  **Name**      |    **Description**                               |  **Data type** |
|  ------------- |  ------------------------------------            |   -----------  |
|  publisherId   | Publisher identifier, for example `contoso`      |   String       |
|  offerId       | Offer identifier                                 |   String       |
|  api-version   | Latest version of the API                        |   Date         |

## Header
------

|  **Name**        |    **Value**          |
|  --------        |    ---------          |
|  Content-Type    | `application/json`    |
|  Authorization   |  `Bearer YOUR_TOKEN`  |


## Body example
------------

### Request

``` json
  { 
      'metadata': 
          { 
              'notification-emails': 'jdoe@contoso.com'
          } 
  }
```

### Request body properties

|  **Name**               |   **Description**                                                                                 |
|  ---------------------  | ------------------------------------------------------------------------------------------------- |
|  notification-emails    | Comma-separated list of email addresses to be notified of the progress of the publishing operation. |

### Response

#### Migrated offers

`Location: /api/publishers/contoso/offers/contoso-offer/operations/56615b67-2185-49fe-80d2-c4ddf77bb2e8?api-version=2017-10-31`

#### Non-migrated offers

`Location: /api/operations/contoso$contoso-offer$2$preview?api-version=2017-10-31`

### Response Header

|  **Name**             |    **Value**                                                                 |
|  -------------------- | ---------------------------------------------------------------------------- |
| Location    | The relative path to retrieve this operation's status     |

### Response status codes

| **Code** |  **Description**                                                                                                                           |
| ------   |  ----------------------------------------------------------------------------------------------------------------------------------------- |
| 202   | `Accepted` - The request was successfully accepted. The response contains a location that can be used to track the operation that is launched. |
| 400   | `Bad/Malformed request` - The error response body may provide more information.                                                               |
| 422   | `Un-processable entity` - Indicates that the entity to be published failed validation.                                                        |
| 404   | `Not found` - The entity specified by the client doesn't exist.                                                                              |
