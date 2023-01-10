---
title: SaaS fulfillment Operations APIs v2 in the Microsoft commercial marketplace
description: Learn how to use the Operations APIs, which are part of the SaaS Fulfillment APIs version 2, to manage a SaaS offer on Microsoft AppSource, Azure Marketplace, and Azure portal.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 08/24/2022
author: arifgani
ms.author: argani
---

# SaaS fulfillment operations APIs v2 in the Microsoft commercial marketplace

This article describes version 2 of the SaaS fulfillment operations APIs.

Operations are useful to respond to any requests that come through the webhook as part of ChangePlan, ChangeQuantity, and ReInstate actions. This provides an opportunity to accept or reject a request by patch that webhook operation with Success or Failure by using the below APIs.

This only applies to webhook events such as ChangePlan, ChangeQuantity, and ReInstate that need an ACK. No action is needed from the independent software vendor (ISV) on Renew, Suspend, and Unsubscribe events because they are notify-only events.

## List outstanding operations

Get list of the pending operations for the specified SaaS subscription. The publisher should acknowledge returned operations by calling the [Operation Patch API](#update-the-status-of-an-operation).

### Get `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/operations?api-version=<ApiVersion>`

*Query parameters:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|    `ApiVersion`    |  Use 2018-08-31.         |
|    `subscriptionId` | The unique identifier of the purchased SaaS subscription.  This ID is obtained after resolving the commercial marketplace authorization token by using the Resolve API.  |

*Request headers:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `content-type`     |  `application/json` |
|  `x-ms-requestid`    |  A unique string value for tracking the request from the client, preferably a GUID.  If this value isn't provided, one will be generated and provided in the response headers.  |
|  `x-ms-correlationid` |  A unique string value for operation on the client.  This parameter correlates all events from client operation with events on the server side.  If this value isn't provided, one will be generated and provided in the response headers.  |
|  `authorization`     |  The format is `"Bearer <access_token>"` when the token value is retrieved by the publisher as explained in [Get a token based on the Azure AD app](./pc-saas-registration.md#get-the-token-with-an-http-post).  |

*Response codes:*

Code: 200
Returns pending operations on the specified SaaS subscription.

*Response payload example:*

```json
{
  "operations": [
    {
      "id": "<guid>", //Operation ID, should be provided in the operations patch API call
      "activityId": "<guid>", //not relevant
      "subscriptionId": "<guid>", // subscriptionId of the SaaS subscription that is being reinstated
      "offerId": "offer1", // purchased offer ID
      "publisherId": "contoso",
      "planId": "silver", // purchased plan ID
      "quantity": 20, // purchased amount of seats, will be empty is not relevant
      "action": "Reinstate",
      "timeStamp": "2018-12-01T00:00:00", // UTC
      "status": "InProgress" // the only status that can be returned in this case
    }
  ]
}
```

Returns empty json if no operations are pending.

Code: 400
Bad request: validation failures.

Code: 403
Forbidden. The authorization token is invalid, expired, or was not provided. The request is attempting to access a SaaS subscription for an offer that's published with a different Azure AD app ID from the one used to create the authorization token.

This error is often a symptom of not performing the [SaaS registration](pc-saas-registration.md) correctly.

Code: 404
Not found.  The SaaS subscription with `subscriptionId` is not found.

Code: 500
Internal server error. Retry the API call.  If the error persists, contact [Microsoft support](https://go.microsoft.com/fwlink/?linkid=2165533).

## Get operation status

This API enables the publisher to track the status of the specified async operation:  **Unsubscribe**, **ChangePlan**, or **ChangeQuantity**.

The `operationId` for this API call can be retrieved from the value returned by **Operation-Location**, the get pending Operations API call, or the `<id>` parameter value received in a webhook call.

### Get `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/operations/<operationId>?api-version=<ApiVersion>`

*Query parameters:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `ApiVersion`        |  Use 2018-08-31.  |
|  `subscriptionId`    |  The unique identifier of the purchased SaaS subscription.  This ID is obtained after resolving the commercial marketplace authorization token by using the Resolve API. |
|  `operationId`       |  The unique identifier of the operation being retrieved. |

*Request headers:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `content-type`      |  `application/json`   |
|  `x-ms-requestid`    |  A unique string value for tracking the request from the client, preferably a GUID.  If this value isn't provided, one will be generated and provided in the response headers. |
|  `x-ms-correlationid` |  A unique string value for operation on the client.  This parameter correlates all events from client operation with events on the server side.  If this value isn't provided, one will be generated and provided in the response headers.  |
|  `authorization`     |  A unique access token that identifies the publisher making this API call.  The format is `"Bearer <access_token>"` when the token value is retrieved by the publisher as explained in [Get a token based on the Azure AD app](./pc-saas-registration.md#get-the-token-with-an-http-post).  |

*Response codes:*

Code: 200
Gets details for the specified SaaS operation. 

*Response payload example:*

```json
Response body:
{
  "id  ": "<guid>", //Operation ID, should be provided in the patch operation API call
  "activityId": "<guid>", //not relevant
  "subscriptionId": "<guid>", // subscriptionId of the SaaS subscription for which this operation is relevant
  "offerId": "offer1", // purchased offer ID
  "publisherId": "contoso",
  "planId": "silver", // purchased plan ID
  "quantity": 20, // purchased amount of seats
  "action": "ChangePlan", // Can be ChangePlan, ChangeQuantity or Reinstate
  "timeStamp": "2018-12-01T00:00:00", // UTC
  "status": "InProgress", // Possible values: NotStarted, InProgress, Failed, Succeeded, Conflict (new quantity / plan is the same as existing)
  "errorStatusCode": "",
  "errorMessage": ""
}
```

Code: 403
Forbidden. The authorization token is invalid, expired, or was not provided. The request is attempting to access a SaaS subscription for an offer that's published with a different Azure AD app ID from the one used to create the authorization token.

This error is often a symptom of not performing the [SaaS registration](pc-saas-registration.md) correctly.

Code: 404
Not found.  

* Subscription with `subscriptionId` is not found.
* Operation with `operationId` is not found.

Code: 500
Internal server error.  Retry the API call.  If the error persists, contact [Microsoft support](https://go.microsoft.com/fwlink/?linkid=2165533).

## Update the status of an operation

Use this API to update the status of a pending operation to indicate the operation's success or failure on the publisher side.

The `operationId` for this API call can be retrieved from the value returned by **Operation-Location**, the get pending Operations API call, or the `<id>` parameter value received in a webhook call.

### Patch `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/operations/<operationId>?api-version=<ApiVersion>`

*Query parameters:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|   `ApiVersion`       |  Use 2018-08-31.  |
|   `subscriptionId`   |  The unique identifier of the purchased SaaS subscription.  This ID is obtained after resolving the commercial marketplace authorization token by using the Resolve API.  |
|   `operationId`      |  The unique identifier of the operation that's being completed. |

*Request headers:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|   `content-type`   | `application/json`   |
|   `x-ms-requestid`   |  A unique string value for tracking the request from the client, preferably a GUID.  If this value isn't provided, one will be generated and provided in the response headers. |
|   `x-ms-correlationid` |  A unique string value for operation on the client.  This parameter correlates all events from client operation with events on the server side.  If this value isn't provided, one will be generated and provided in the response headers. |
|  `authorization`     |  A unique access token that identifies the publisher that's making this API call.  The format is `"Bearer <access_token>"` when the token value is retrieved by the publisher as explained in [Get a token based on the Azure AD app](./pc-saas-registration.md#get-the-token-with-an-http-post). |

*Request payload example:*

```json
{
  "status": "Success" // Allowed Values: Success/Failure. Indicates the status of the operation on ISV side.
}
```

*Response codes:*

Code: 200
A call to inform of completion of an operation on the partner side.  For example, this response could signal the completion of change of seats or plans on the publisher side.

Code: 403
- Forbidden.  The authorization token is not available, is invalid, or expired. The request may be attempting to access a subscription that doesn't belong to the current publisher.
- Forbidden.  The authorization token is invalid, expired, or was not provided. The request is attempting to access a SaaS subscription for an offer that's published with a different Azure AD app ID from the one used to create the authorization token.

This error is often a symptom of not performing the [SaaS registration](pc-saas-registration.md) correctly.

Code: 404
Not found.

* Subscription with `subscriptionId` is not found.
* Operation with `operationId` is not found.

Code: 409
Conflict.  For example, a newer update is already fulfilled.

Code: 500
Internal server error.  Retry the API call.  If the error persists, contact [Microsoft support](https://go.microsoft.com/fwlink/?linkid=2165533).

## Next steps

See the [commercial marketplace metering service APIs](../marketplace-metering-service-apis.md) for more options for SaaS offers in the commercial marketplace.

Review and use the [clients for different programming languages and samples](https://github.com/microsoft/commercial-marketplace-samples).
