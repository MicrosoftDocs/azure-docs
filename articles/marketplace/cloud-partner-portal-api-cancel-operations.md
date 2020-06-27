---
title: Cancel operation API - Microsoft commercial marketplace
description: The API to cancel an operation currently in progress on the offer
author: anbene
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 06/16/2020
ms.author: mingshen
---

# Cancel operation

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with Partner Center and will continue to work after your offers are migrated to Partner Center. The integration introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](./cloud-partner-portal-api-overview.md) to ensure your code continues to work after the migration to Partner Center.

This API cancels an operation currently in progress on the offer. Use the [Retrieve operations
API](./cloud-partner-portal-api-retrieve-operations.md) to get an
`operationId` to pass to this API. Cancellation is usually a synchronous
operation, however in some complex scenarios a new operation may be
required to cancel an existing one. In this case, the HTTP response body
contains the operation's location that should be used to query status.

  `POST https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/cancel?api-version=2017-10-31`

## URI parameters

--------------

|  **Name**    |      **Description**                                  |    **Data type**  |
| ------------ |     ----------------                                  |     -----------   |
| publisherId  |  Publisher identifier, for example, `contoso`         |   String          |
| offerId      |  Offer identifier                                     |   String          |
| api-version  |  Current version of API                               |    Date           |
|  |  |  |

## Header
------

|  **Name**              |  **Value**         |
|  ---------             |  ----------        |
|  Content-Type          |  application/json  |
|  Authorization         |  Bearer YOUR TOKEN |
|  |  |

## Body example
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

#### Migrated offers

`Location: /api/publishers/contoso/offers/contoso-offer/operations/56615b67-2185-49fe-80d2-c4ddf77bb2e8?api-version=2017-10-31`

#### Non-migrated offers

`Location: /api/operations/contoso$contoso-offer$2$preview?api-version=2017-10-31`

### Response Header

|  **Name**             |    **Value**                       |
|  ---------            |    ----------                      |
| Location    | The relative path to retrieve this operation's status. |
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
