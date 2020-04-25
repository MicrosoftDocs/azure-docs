---
title: Publish an offer | Azure Marketplace
description: API to publish the specified offer.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 04/08/2020
ms.author: dsindona
---


# Publish an offer

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with Partner Center and will continue to work after your offers are migrated to Partner Center. The integration introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-api-overview) to ensure your code continues to work after the migration to Partner Center.

Starts the publishing process for the specified offer. This call is a long running operation.

  `POST  https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/publish?api-version=2017-10-31`

## URI parameters
--------------

|  **Name**      |    **Description**                               |  **Data type** |
|  ------------- |  ------------------------------------            |   -----------  |
|  publisherId   | Publisher identifier, for example `contoso`      |   String       |
|  offerId       | Offer identifier                                 |   String       |
|  api-version   | Latest version of the API                        |   Date         |
|  |  |

## Header
------

|  **Name**        |    **Value**          |
|  --------        |    ---------          |
|  Content-Type    | `application/json`    |
|  Authorization   |  `Bearer YOUR_TOKEN`  |
|  |  |


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
|  |  |


### Response

#### Migrated offers

`Location: /api/publishers/contoso/offers/contoso-offer/operations/56615b67-2185-49fe-80d2-c4ddf77bb2e8?api-version=2017-10-31`

#### Non-migrated offers

`Location: /api/operations/contoso$contoso-offer$2$preview?api-version=2017-10-31`


### Response Header

|  **Name**             |    **Value**                                                                 |
|  -------------------- | ---------------------------------------------------------------------------- |
| Location    | The relative path to retrieve this operation's status     |
|  |  |


### Response status codes

| **Code** |  **Description**                                                                                                                           |
| ------   |  ----------------------------------------------------------------------------------------------------------------------------------------- |
| 202   | `Accepted` - The request was successfully accepted. The response contains a location that can be used to track the operation that is launched. |
| 400   | `Bad/Malformed request` - The error response body may provide more information.                                                               |
| 422   | `Un-processable entity` - Indicates that the entity to be published failed validation.                                                        |
| 404   | `Not found` - The entity specified by the client doesn't exist.                                                                              |
|  |  |
