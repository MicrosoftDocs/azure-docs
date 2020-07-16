---
title: Retrieve offers API - Azure Marketplace
description: API to retrieve a summarized list of offers under a publisher namespace.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 04/08/2020
ms.author: dsindona
---


Retrieve offers
===============

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with Partner Center and will continue to work after your offers are migrated to Partner Center. The integration introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](./cloud-partner-portal-api-overview.md) to ensure your code continues to work after the migration to Partner Center.

Retrieves a summarized list of offers under a publisher namespace.

 `GET https://cloudpartner.azure.com/api/publishers/<publisherId>/offers?api-version=2017-10-31`

URI parameters
--------------

| **Name**         |  **Description**                         |  **Data type** |
| -------------    |  ------------------------------------    |  -----------   |
|  publisherId     | Publisher identifier, for example `contoso` |   String    |
|  api-version     | Latest version of API                    |    Date        |
|  |  |


Header
------

|  **Name**        |         **Value**       |
|  --------------- |       ----------------  |
|  Content-Type    | `application/json`      |
|  Authorization   | `Bearer YOUR_TOKEN`     |
|  |  |


Body example
------------

### Response

``` json
  200 OK 
  [ 
      {  
          "offerTypeId": "microsoft-azure-virtualmachines",
          "publisherId": "contoso",
          "status": "published",
          "id": "059afc24-07de-4126-b004-4e42a51816fe",
          "version": 1,
          "definition": {
              "displayText": "Contoso Virtual Machine"
          },
          "changedTime":"2017-05-23T23:33:47.8802283Z"
      }
  ]
```

### Response body properties

|  **Name**       |       **Description**                                                                                                  |
|  -------------  |      --------------------------------------------------------------------------------------------------------------    |
|  offerTypeId    | Identifies the type of offer                                                                                           |
|  publisherId    | Identifier that uniquely identifies the publisher                                                                      |
|  status         | Status of the offer. For the list of possible values, see [Offer status](#offer-status) below.                         |
|  id             | GUID that uniquely identifies the offer in the publisher namespace.                                                    |
|  version        | Current version of the offer. The version property cannot be modified by the client. It's incremented after each publishing. |
|  definition     | Contains a summarized view of the actual definition of the workload. To get a detailed definition, use the [Retrieve specific offer](./cloud-partner-portal-api-retrieve-specific-offer.md) API. |
|  changedTime    | UTC time when the offer was last modified                                                                              |
|  |  |


### Response status codes

| **Code**  |  **Description**                                                                                                   |
| -------   |  ----------------------------------------------------------------------------------------------------------------- |
|  200      | `OK` - The request was successfully processed and all the offers under the publisher were returned to the client.  |
|  400      | `Bad/Malformed request` - The error response body may contain more information.                                    |
|  403      | `Forbidden` - The client doesn't have access to the specified namespace.                                          |
|  404      | `Not found` - The specified entity doesn't exist.                                                                 |
|  |  |


### Offer Status

|  **Name**                    | **Description**                                  |
|  ------------------------    | -----------------------------------------------  |
|  NeverPublished              | Offer has never been published.                  |
|  NotStarted                  | Offer is new but is not started.                 |
|  WaitingForPublisherReview   | Offer is waiting for publisher approval.         |
|  Running                     | Offer submission is being processed.             |
|  Succeeded                   | Offer submission has completed processing.       |
|  Canceled                    | Offer submission was canceled.                   |
|  Failed                      | Offer submission failed.                         |
|  |  |
