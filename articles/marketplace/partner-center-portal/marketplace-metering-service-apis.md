---
title: Marketplace metering service APIs | Azure Marketplace
description: Usage event for SaaS offers in the Azure Marketplace. 
author: MaggiePucciEvans 
manager: evansma
ms.author: evansma 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 07/11/2019
---

# Marketplace metering service APIs

The usage event API allows you to emit usage events for a specific purchased entity. The usage event request references the metering services dimension defined by the publisher when publishing the offer.

## Usage event

**POST**: `https://marketplaceapi.microsoft.com/api/usageEvent?api-version=<ApiVersion>`

*Query parameters:*

|            |          |
| ---------- | ---------------------- |
| `ApiVersion` | The version of the operation to use for this request. Latest API version is 2018-08-31. |

*Request headers:*

| Content-type       | `application/json`    |
| ------------------ | ---------------------------- |
| `x-ms-requestid`     | Unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers. |
| `x-ms-correlationid` | Unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers. |
| `authorization`   | [Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/partner-center-portal/pc-saas-registration#get-a-token-based-on-the-azure-ad-app) Note: When making the HTTP request, prefix `Bearer` to the token obtained from the referenced link. |

*Request:*

```json
{
  "resourceId": "Identifier of the resource against which usage is emitted",
  "quantity": 5.0,
  "dimension": "Dimension identifier",
  "effectiveStartTime": "Time in UTC when the usage event occurred",
  "planId": "Plan associated with the purchased offer"
}
```

### Responses

Code: 200<br>
OK 

```json
{
  "usageEventId": "Unique identifier associated with the usage event",
  "status": "Accepted",
  "messageTime": "Time this message was created in UTC",
  "resourceId": "Identifier of the resource against which usage is emitted",
  "quantity": 5.0,
  "dimension": "Dimension identifier",
  "effectiveStartTime": "Time in UTC when the usage event occurred",
  "planId": "Plan associated with the purchased offer"
}
```

Code: 400 <br>
Bad request, missing or invalid data provided or expired

```json
{
  "message": "One or more errors have occurred.",
  "target": "usageEventRequest",
  "details": [
    {
      "message": "The resourceId is required.",
      "target": "ResourceId",
      "code": "BadArgument"
    }
  ],
  "code": "BadArgument"
}
```

Code: 403<br>
Bad request, missing or invalid data provided or expired

```json
{
  "code": "Forbidden",
  "message": "User is not allowed authorized to call this"
}
```

Code: 409<br>
Conflict, when we receive the usage call for the usage resource ID, and effective usage, which already exists. The response will contain `additionalInfo` field that contains info about the accepted message.

```json
{
  "code": "Conflict",
  "additionalInfo": {
    "usageEventId": "Unique identifier associated with the usage event",
    "status": "Accepted|NotProcessed|Expired",
    "messageTime": "Time this message was created in UTC",
    "resourceId": "Identifier of the resource against which usage is emitted",
    "quantity": 5.0,
    "dimension": "Dimension identifier",
    "effectiveStartTime": "Time in UTC when the usage event occurred",
    "planId": "Plan associated with the purchased offer"
  }
}
```

## Batch usage event

The batch usage event API allows you to emit usage events for more than one purchased entity at once. The batch usage event request references the metering services dimension defined by the publisher when publishing the offer.

>[!Note]
>You can register multiple SaaS offers in the Microsoft's commercial marketplace. Each registered SaaS offer has a unique Azure AD application that is registered for authentication and authorization purposes. The events emitted in batch should belong to offers with the same Azure AD application at the time of registering the offer.

**POST:** `https://marketplaceapi.microsoft.com/api/batchUsageEvent?api-version=<ApiVersion>`

*Query parameters:*

|            |     |
| ---------- | -------------------- |
| `ApiVersion` | The version of the operation to use for this request. Latest API version is 2018-08-31. |

*Request headers:*

| Content-type       | `application/json`       |
| ------------------ | ------ |
| `x-ms-requestid`     | Unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated, and provided in the response headers. |
| `x-ms-correlationid` | Unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated, and provided in the response headers. |
| `authorization`      | [Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/partner-center-portal/pc-saas-registration#get-a-token-based-on-the-azure-ad-app) Note: When making the HTTP request, prefix `Bearer` to the token obtained from the referenced link.  |

*Request:*
```json
{
  "request": [
    {
      "resourceId": "Identifier of the resource against which usage is emitted",
      "quantity": 5.0,
      "dimension": "Dimension identifier",
      "effectiveStartTime": "Time in UTC when the usage event occurred",
      "planId": "Plan associated with the purchased offer"
    },
    {
      "resourceId": "Identifier of the resource against which usage is emitted",
      "quantity": 5.0,
      "dimension": "Dimension identifier",
      "effectiveStartTime": "Time in UTC when the usage event occurred",
      "planId": "Plan associated with the purchased offer"
    }
  ]
}
```
### Responses

Code: 200<br>
OK

```json
{
  "count": 2,
  "result": [
    {
      "usageEventId": "Unique identifier associated with the usage event",
      "status": "Accepted|Expired|Duplicate|Error|ResourceNotFound|ResourceNotAuthorized|InvalidDimension|BadArgument",
      "messageTime": "Time this message was created in UTC",
      "resourceId": "Identifier of the resource against which usage is emitted",
      "quantity": 5.0,
      "dimension": "Dimension identifier",
      "effectiveStartTime": "Time in UTC when the usage event occurred",
      "planId": "Plan associated with the purchased offer",
      "error": "Error object (optional)"
    },
    {
      "usageEventId": "Unique identifier associated with the usage event",
      "status": "Accepted|Expired|Duplicate|Error|ResourceNotFound|ResourceNotAuthorized|InvalidDimension|BadArgument",
      "messageTime": "Time this message was created in UTC",
      "resourceId": "Identifier of the resource against which usage is emitted",
      "quantity": 5.0,
      "dimension": "Dimension identifier",
      "effectiveStartTime": "Time in UTC when the usage event occurred",
      "planId": "Plan associated with the purchased offer",
      "error": "Error object (optional)"
    }
  ]
}
```

Description of status code referenced in `BatchUsageEvent` API response:

| Status code  | Description |
| ---------- | -------------------- |
| `Accepted` | Accepted code. |
| `Expired` | Expired usage. |
| `Duplicate` | Duplicate usage provided. |
| `Error` | Error code. |
| `ResourceNotFound` | The usage resource provided is invalid. |
| `ResourceNotAuthorized` | You are not authorized to provide usage for this resource. |
| `InvalidDimension` | The dimension for which the usage is passed is invalid for this offer/plan. |
| `InvalidQuantity` | The quantity passed is < 0. |
| `BadArgument` | The input is missing or malformed. |

Code: 400<br>
Bad request, missing or invalid data provided or Expired

```json
{
  "message": "One or more errors have occurred.",
  "target": "usageEventRequest",
  "details": [
    {
      "message": "Invalid data format.",
      "target": "usageEventRequest",
      "code": "BadArgument"
    }
  ],
  "code": "BadArgument"
}
```
Code: 403<br>
User is unauthorized to make this call

```json
{
  "code": "Forbidden",
  "message": "User is not allowed to call this"
}
```

## Next steps

For more information, see [SaaS metered billing](./saas-metered-billing.md).
