---
title: Metering service APIs - Microsoft commercial marketplace
description: The usage event API allows you to emit usage events for SaaS offers in Microsoft AppSource and Azure Marketplace.
author: dsindona 
ms.author: dsindona 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 05/26/2020
---

# Marketplace metered billing APIs

The metered billing APIs should be used when the publisher creates custom metering dimensions for an offer to be published in Partner Center. Integration with the metered billing APIs is required for any purchased offer that has one or more plans with custom dimensions to emit usage events.

For more information on creating custom metering dimensions for SaaS, see [SaaS metered billing](https://docs.microsoft.com/azure/marketplace/partner-center-portal/saas-metered-billing).

For more information on creating custom metering dimensions for an Azure Application offer with a Managed app plan, see the [technical configuration section of create a new Azure Apps offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-azure-apps-offer#technical-configuration-managed-application-plans-only).

## Enforcing TLS 1.2 Note

TLS version 1.2 version is enforced as the minimal version for HTTPS communications. Make sure you use this TLS version in your code. TLS version 1.0 and 1.1 are deprecated and connection attempts will be refused.

## Metered billing single usage event

The usage event API should be called by the publisher to emit usage events against an active resource (subscribed) for the plan purchased by the specific customer. The usage event is emitted separately for each custom dimension of the plan defined by the publisher when publishing the offer.

Only one usage event can be emitted for each hour of a calendar day. For example, at 8:15am today, you can emit one usage event. If this event is accepted, the next usage event will be accepted from 9:00 am today. If you send an additional event between 8:15 and 8:59:59 today, it will be rejected as a duplicate. You should accumulate all units consumed in an hour and then emit it in a single event.

Only one usage event can be emitted for each hour of a calendar day per resource. If more than one unit is consumed in an hour, then accumulate all the units consumed in the hour and then emit it in a single event. Usage events can only be emitted for the past 24 hours. If you emit a usage event at any time between 8:00 and 8:59:59 (and it is accepted) and send an additional event for the same day between 8:00 and 8:59:59, it will be rejected as a duplicate.

**POST**: `https://marketplaceapi.microsoft.com/api/usageEvent?api-version=<ApiVersion>`

*Query parameters:*

|            |          |
| ---------- | ---------------------- |
| `ApiVersion` | Use 2018-08-31. |
| | |

*Request headers:*

| Content-type       | `application/json`    |
| ------------------ | ---------------------------- |
| `x-ms-requestid`     | Unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers. |
| `x-ms-correlationid` | Unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers. |
| `authorization`   | A unique access token that identifies the ISV that is making this API call. The format is `"Bearer <access_token>"` when the token value is retrieved by the publisher as explained for <br> <ul> <li> SaaS in [Get the token with an HTTP POST](./pc-saas-registration.md#get-the-token-with-an-http-post). </li> <li> Managed application in [Authentication strategies](./marketplace-metering-service-authentication.md). </li> </ul> |
| | |

*Request body example:*

```json
{
  "resourceId": <guid>, // unique identifier of the resource against which usage is emitted. 
  "quantity": 5.0, // how many units were consumed for the date and hour specified in effectiveStartTime, must be greater than 0, can be integer or float value
  "dimension": "dim1", // custom dimension identifier
  "effectiveStartTime": "2018-12-01T08:30:14", // time in UTC when the usage event occurred, from now and until 24 hours back
  "planId": "plan1", // id of the plan purchased for the offer
}
```

>[!NOTE]
>`resourceId` has different meaning for SaaS app and for Managed app emitting custom meter. 

For Azure Application Managed Apps plans, the `resourceId` is the `resourceUsageId` found under the `billingDetails` of the Managed App metadata object. An example script for fetching it can be found in [using the Azure-managed identities token](./marketplace-metering-service-authentication.md#using-the-azure-managed-identities-token). 

For SaaS offers, the `resourceId` is the SaaS subscription ID. For more details on SaaS subscriptions, see [list subscriptions](./pc-saas-fulfillment-api-v2.md#get-list-of-all-subscriptions).

### Responses

Code: 200<br>
OK. The usage emission was accepted and recorded on Microsoft side for further processing and billing.

Response payload example: 

```json
{
  "usageEventId": <guid>, // unique identifier associated with the usage event in Microsoft records
  "status": "Accepted" // this is the only value in case of single usage event
  "messageTime": "2020-01-12T13:19:35.3458658Z", // time in UTC this event was accepted
  "resourceId": <guid>, // unique identifier of the resource against which usage is emitted. For SaaS it's the subscriptionId.
  "quantity": 5.0, // amount of emitted units as recorded by Microsoft
  "dimension": "dim1", // custom dimension identifier
  "effectiveStartTime": "2018-12-01T08:30:14", // time in UTC when the usage event occurred, as sent by the ISV
  "planId": "plan1", // id of the plan purchased for the offer
}
```

Code: 400 <br>
Bad request.

* Missing or invalid request data provided.
* `effectiveStartTime` is more than 24 hours in the past. Event has expired.
* SaaS subscription is not in Subscribed status.

Response payload example: 

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

Forbidden. The authorization token isn't provided, is invalid or expired.  Or the request is attempting to access a subscription for an offer that was published with a different Azure AD App ID from the one used to create the authorization token.

Code: 409<br>
Conflict. A usage event has already been successfully reported for the specified resource ID, effective usage date and hour.

Response payload example: 

```json
{
  "additionalInfo": {
    "acceptedMessage": {
      "usageEventId": "<guid>", //unique identifier associated with the usage event in Microsoft records
      "status": "Duplicate",
      "messageTime": "2020-01-12T13:19:35.3458658Z",
      "resourceId": "<guid>", //unique identifier of the resource against which usage is emitted.
      "quantity": 1.0,
      "dimension": "dim1",
      "effectiveStartTime": "2020-01-12T11:03:28.14Z",
      "planId": "plan1"
    }
  },
  "message": "This usage event already exist.",
  "code": "Conflict"
}
```

## Metered billing batch usage event

The batch usage event API allows you to emit usage events for more than one purchased resource at once. It also allows you to emit several usage events for the same resource as long as they are for different calendar hours. The maximal number of events in a single batch is 25.

**POST:** `https://marketplaceapi.microsoft.com/api/batchUsageEvent?api-version=<ApiVersion>`

*Query parameters:*

|            |     |
| ---------- | -------------------- |
| `ApiVersion` | Use 2018-08-31. |

*Request headers:*

| Content-type       | `application/json`       |
| ------------------ | ------ |
| `x-ms-requestid`     | Unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated, and provided in the response headers. |
| `x-ms-correlationid` | Unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated, and provided in the response headers. |
| `authorization`      | A unique access token that identifies the ISV that is making this API call. The format is `Bearer <access_token>` when the token value is retrieved by the publisher as explained for <br> <ul> <li> SaaS in [Get the token with an HTTP POST](./pc-saas-registration.md#get-the-token-with-an-http-post). </li> <li> Managed application in [Authentication strategies](./marketplace-metering-service-authentication.md). </li> </ul> |
| | |


*Request body example:*

```json
{
  "request": [ // list of usage events for the same or different resources of the publisher
    { // first event
      "resourceId": "<guid1>", // Unique identifier of the resource against which usage is emitted. 
      "quantity": 5.0, // how many units were consumed for the date and hour specified in effectiveStartTime, must be greater than 0, can be integer or float value
      "dimension": "dim1", //Custom dimension identifier
      "effectiveStartTime": "2018-12-01T08:30:14",//Time in UTC when the usage event occurred, from now and until 24 hours back
      "planId": "plan1", // id of the plan purchased for the offer
    },
    { // next event
      "resourceId": "<guid2>", 
      "quantity": 39.0, 
      "dimension": "email", 
      "effectiveStartTime": "2018-11-01T23:33:10
      "planId": "gold", // id of the plan purchased for the offer
    }
  ]
}
```

>[!NOTE]
>`resourceId` has different meaning for SaaS app and for Managed app emitting custom meter. 

For Azure Application Managed Apps plans, the `resourceId` is the `resourceUsageId` found under the `billingDetails` of the Managed App metadata object. An example script for fetching it can be found in [using the Azure-managed identities token](./marketplace-metering-service-authentication.md#using-the-azure-managed-identities-token). 

For SaaS offers, the `resourceId` is the SaaS subscription ID. For more details on SaaS subscriptions, see [list subscriptions](./pc-saas-fulfillment-api-v2.md#get-list-of-all-subscriptions).

### Responses

Code: 200<br>
OK. The batch usage emission was accepted and recorded on Microsoft side for further processing and billing. The response list is returned with status for each individual event in the batch. You should iterate through the response payload to understand the responses for each individual usage event sent as part of the batch event.

Response payload example: 

```json
{
  "count": 2, // number of records in the response
  "result": [
    { // first response
      "usageEventId": "<guid>", // unique identifier associated with the usage event in Microsoft records
      "status": "Accepted" // see list of possible statuses below,
      "messageTime": "2020-01-12T13:19:35.3458658Z", // Time in UTC this event was accepted by Microsoft,
      "resourceId": "<guid1>", // unique identifier of the resource against which usage is emitted.
      "quantity": 5.0, // amount of emitted units as recorded by Microsoft 
      "dimension": "dim1", // custom dimension identifier
      "effectiveStartTime": "2018-12-01T08:30:14",// time in UTC when the usage event occurred, as sent by the ISV
      "planId": "plan1", // id of the plan purchased for the offer
    },
    { // second response
      "status": "Duplicate",
      "messageTime": "0001-01-01T00:00:00",
      "error": {
        "additionalInfo": {
          "acceptedMessage": {
            "usageEventId": "<guid>",
            "status": "Duplicate",
            "messageTime": "2020-01-12T13:19:35.3458658Z",
            "resourceId": "<guid2>",
            "quantity": 1.0,
            "dimension": "email",
            "effectiveStartTime": "2020-01-12T11:03:28.14Z",
            "planId": "gold"
          }
        },
        "message": "This usage event already exist.",
        "code": "Conflict"
      },
      "resourceId": "<guid2>",
      "quantity": 1.0,
      "dimension": "email",
      "effectiveStartTime": "2020-01-12T11:03:28.14Z",
      "planId": "gold"
    }
  ]
}
```

Description of status code referenced in `BatchUsageEvent` API response:

| Status code  | Description |
| ---------- | -------------------- |
| `Accepted` | Accepted. |
| `Expired` | Expired usage. |
| `Duplicate` | Duplicate usage provided. |
| `Error` | Error code. |
| `ResourceNotFound` | The usage resource provided is invalid. |
| `ResourceNotAuthorized` | You are not authorized to provide usage for this resource. |
| `InvalidDimension` | The dimension for which the usage is passed is invalid for this offer/plan. |
| `InvalidQuantity` | The quantity passed is lower or equal to 0. |
| `BadArgument` | The input is missing or malformed. |

Code: 400<br>
Bad request. The batch contained more than 25 usage events.

Code: 403<br>
Forbidden. The authorization token isn't provided, is invalid or expired.  Or the request is attempting to access a subscription for an offer that was published with a different Azure AD App ID from the one used to create the authorization token.

## Development and testing best practices

To test the custom meter emission, implement the integration with metering API, create a plan for your published SaaS offer with custom dimensions defined in it with zero price per unit. And publish this offer as preview so only limited users would be able to access and test the integration.

You can also use private plan for an existing live offer to limit the access to this plan during testing to limited audience.

## Get support

Follow the instruction in [Support for the commercial marketplace program in Partner Center](./support.md) to understand publisher support options and open a support ticket with Microsoft.

## Next steps

For more information on metering service APIs , see [Marketplace metering service APIs FAQ](./marketplace-metering-service-apis-faq.md).
