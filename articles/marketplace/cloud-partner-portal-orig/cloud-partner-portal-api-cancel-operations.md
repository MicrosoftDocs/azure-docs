---
title: Cancel operation API | Microsoft Docs
description: Cancel operations .
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: v-miclar
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: reference
ms.date: 09/13/2018
ms.author: pbutlerm
---


Cancel operation 
=================

This API cancels an operation currently in progress on the offer. Use the [Retrieve operations
API](./cloud-partner-portal-api-retrieve-operations.md) to get an
`operationId` to pass to this API. Cancellation is usually a synchronous
operation, however in some complex scenarios a new operation may be
required to cancel an existing one. In this case, the HTTP response body
contains the operation's location that should be used to query status.

You can provide a comma-separated list of email addresses with the
request, and the API will notify these addresses about the progress of
the operation.

  `POST https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/cancel?api-version=2017-10-31`

URI parameters
--------------

|  **Name**    |      **Description**                                  |    **Data type**  |
| ------------ |     ----------------                                  |     -----------   |
| publisherId  |  Publisher identifier, for example, `contoso`         |   String          |
| offerId      |  Offer identifier                                     |   String          |
| api-version  |  Current version of API                               |    Date           |
|  |  |  |


Header
------

|  **Name**              |  **Value**         |
|  ---------             |  ----------        |
|  Content-Type          |  application/json  |
|  Authorization         |  Bearer YOUR TOKEN |
|  |  |


Body example
------------

### Request

``` json
{
   "metadata": {
     "notification-emails": "jondoe@contoso.com"
    }
}     
```

### Request body properties

|  **Name**                |  **Description**                                               |
|  --------                |  ---------------                                               |
|  notification-emails     | Comma separated list of email Ids to be notified of the progress of the  publishing operation. |
|  |  |


### Response

  `Operation-Location: https://cloudpartner.azure.com/api/publishers/contoso/offers/contoso-virtualmachineoffer/operations/56615b67-2185-49fe-80d2-c4ddf77bb2e8`


### Response Header

|  **Name**             |    **Value**                       |
|  ---------            |    ----------                      |
| Operation-Location    | URL, which can be queried to determine the current status of the operation. |
|  |  |


### Response status codes

| **Code**  |  **Description**                                                                       |
|  ------   |  ------------------------------------------------------------------------               |
|  200      | Ok. The request was successfully processed and the operation is canceled synchronously. |
|  202      | Accepted. The request was successfully processed and the operation is in the process of being canceled. Location of the cancellation operation is returned in the response header. |
|  400      | Bad/Malformed request. The error response body could provide more information.  |
|  403      | Access Forbidden. The client does not have access to the namespace specified in the request. |
|  404      | Not found. The specified entity does not exist. |
|  |  |
