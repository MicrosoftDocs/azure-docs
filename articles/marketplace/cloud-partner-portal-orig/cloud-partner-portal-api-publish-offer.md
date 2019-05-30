---
title: Publish an offer | Azure Marketplace
description: API to publish the specified offer.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: reference
ms.date: 09/13/2018
ms.author: pabutler
---


Publish an offer
================

Starts the publishing process for the specified offer. This call is a long running operation.

  `POST  https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/publish?api-version=2017-10-31`

URI parameters
--------------

|  **Name**      |    **Description**                               |  **Data type** |
|  ------------- |  ------------------------------------            |   -----------  |
|  publisherId   | Publisher identifier, for example `contoso`      |   String       |
|  offerId       | Offer identifier                                 |   String       |
|  api-version   | Latest version of the API                        |   Date         |
|  |  |


Header
------

|  **Name**        |    **Value**          |
|  --------        |    ---------          |
|  Content-Type    | `application/json`    |
|  Authorization   |  `Bearer YOUR_TOKEN`  |
|  |  |


Body example
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

   `Operation-Location: /api/operations/contoso$56615b67-2185-49fe-80d2-c4ddf77bb2e8$2$preview?api-version=2017-10-31`


### Response Header

|  **Name**             |    **Value**                                                                 |
|  -------------------- | ---------------------------------------------------------------------------- |
| Operation-Location    | URL that can be queried to determine the current status of the operation.    |
|  |  |


### Response status codes

| **Code** |  **Description**                                                                                                                           |
| ------   |  ----------------------------------------------------------------------------------------------------------------------------------------- |
| 202   | `Accepted` - The request was successfully accepted. The response contains a location that can be used to track the operation that is launched. |
| 400   | `Bad/Malformed request` - The error response body may provide more information.                                                               |
| 422   | `Un-processable entity` - Indicates that the entity to be published failed validation.                                                        |
| 404   | `Not found` - The entity specified by the client doesn't exist.                                                                              |
|  |  |
