---
title: SaaS fulfillment Subscription APIs v2 in Microsoft commercial marketplace
description: Learn how to use the Subscription APIs, which are part of the  the SaaS Fulfillment APIs version 2, to manage a SaaS offer on Microsoft AppSource, Azure Marketplace, and Azure portal.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 08/10/2022
author: arifgani
ms.author: argani
---

# SaaS fulfillment Subscription APIs v2 in Microsoft commercial marketplace

This article describes version 2 of the SaaS fulfillment subscription APIs.

## Resolve a purchased subscription

The resolve endpoint enables the publisher to exchange the purchase identification token from the commercial marketplace (referred to as *token* in [Purchased but not yet activated](pc-saas-fulfillment-life-cycle.md#purchased-but-not-yet-activated-pendingfulfillmentstart)) to a persistent purchased SaaS subscription ID and its details.

When a customer is redirected to the partner's landing page URL, the customer identification token is passed as the *token* parameter in this URL call. The partner is expected to use this token and make a request to resolve it. The Resolve API response contains the SaaS subscription ID and other details to uniquely identify the purchase. The *token* provided with the landing page URL call is usually valid for 24 hours. If the *token* that you receive has already expired, we recommend that you provide the following guidance to the end user:

"We couldn't identify this purchase. Please reopen this SaaS subscription in the Azure portal or in Microsoft 365 Admin Center and select "Configure Account" or "Manage Account" again."

Calling the Resolve API will return subscription details and status for SaaS subscriptions in all supported statuses.

### Post `https://marketplaceapi.microsoft.com/api/saas/subscriptions/resolve?api-version=<ApiVersion>`

*Query parameters:*

|  Parameter         | Value            |
|  ---------------   |  ---------------  |
|  `ApiVersion`        |  Use 2018-08-31.   |

*Request headers:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `content-type`      | `application/json` |
|  `x-ms-requestid`    |  A unique string value for tracking the request from the client, preferably a GUID. If this value isn't provided, one will be generated and provided in the response headers. |
|  `x-ms-correlationid` |  A unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers.  |
|  `authorization`     |  A unique access token that identifies the publisher making this API call. The format is `"Bearer <accessaccess_token>"` when the token value is retrieved by the publisher as explained in [Get a token based on the Azure AD app](./pc-saas-registration.md#get-the-token-with-an-http-post). |
|  `x-ms-marketplace-token`  | The purchase identification *token* parameter to resolve.  The token is passed in the landing page URL call when the customer is redirected to the SaaS partner's website (for example: `https://contoso.com/signup?token=<token><authorization_token>`). <br> <br>  Note that the *token* value being encoded is part of the landing page URL, so it needs to be decoded before it's used as a parameter in this API call.  <br> <br> Here's an example of an encoded string in the URL: `contoso.com/signup?token=ab%2Bcd%2Fef`, where *token* is `ab%2Bcd%2Fef`.  The same token decoded will be: `Ab+cd/ef` |

*Response codes:*

Code: 200
Returns unique SaaS subscription identifiers based on the `x-ms-marketplace-token` provided.

Response body example:

```json
{
  "id": "<guid>", // purchased SaaS subscription ID
  "subscriptionName": "Contoso Cloud Solution", // SaaS subscription name
  "offerId": "offer1", // purchased offer ID
  "planId": "silver", // purchased offer's plan ID
  "quantity": 20, // number of purchased seats, might be empty if the plan is not per seat
  "subscription": { // full SaaS subscription details, see Get Subscription APIs response body for full description
    "id": "<guid>",
    "publisherId": "contoso",
    "offerId": "offer1",
    "name": "Contoso Cloud Solution",
    "saasSubscriptionStatus": " PendingFulfillmentStart ",
    "beneficiary": {
      "emailId": "test@test.com",
      "objectId": "<guid>",
      "tenantId": "<guid>",
      "puid": "<ID of the user>"
    },
    "purchaser": {
      "emailId": "test@test.com",
      "objectId": "<guid>",
      "tenantId": "<guid>",
      "puid": "<ID of the user>"
    },
    "planId": "silver",
    "term": {
      "termUnit": "P1M",
      "startDate": "2022-03-07T00:00:00Z",
      "endDate": "2022-04-06T00:00:00Z"
    },
      "autoRenew": true/false,
    "isTest": true/false,
    "isFreeTrial": false,
    "allowedCustomerOperations": <CSP purchases>["Read"] <All Others> ["Delete", "Update", "Read"],
      "sandboxType": "None",
      "lastModified": "0001-01-01T00:00:00",
      "quantity": 5,
    "sessionMode": "None"
  }
}

```

Code: 400
Bad request. `x-ms-marketplace-token` is missing, malformed, invalid, or expired.

Code: 403
Forbidden. The authorization token is invalid, expired, or was not provided.  The request is attempting to access a SaaS subscription for an offer that was published with a different Azure AD app ID from the one used to create the authorization token.

This error is often a symptom of not performing the [SaaS registration](pc-saas-registration.md) correctly.

Code: 500
Internal server error.  Retry the API call.  If the error persists, contact [Microsoft support](https://go.microsoft.com/fwlink/?linkid=2165533).

## Activate a subscription

After the SaaS account is configured for an end user, the publisher must call the Activate Subscription API on the Microsoft side.  The customer won't be billed unless this API call is successful.

### Post `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/activate?api-version=<ApiVersion>`

*Query parameters:*

|  Parameter         | Value             |
|  --------   |  ---------------  |
| `ApiVersion`  |  Use 2018-08-31.   |
| `subscriptionId` | The unique identifier of the purchased SaaS subscription.  This ID is obtained after resolving the commercial marketplace authorization token by using the [Resolve API](#resolve-a-purchased-subscription). |

*Request headers:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
| `content-type`       |  `application/json`  |
| `x-ms-requestid`     |  A unique string value for tracking the request from the client, preferably a GUID.  If this value isn't provided, one will be generated and provided in the response headers. |
| `x-ms-correlationid` |  A unique string value for operation on the client.  This string correlates all events from the client operation with events on the server side.  If this value isn't provided, one will be generated and provided in the response headers. |
| `authorization`      |  A unique access token that identifies the publisher making this API call. The format is `"Bearer <access_token>"` when the token value is retrieved by the publisher as explained in [Get a token based on the Azure AD app](./pc-saas-registration.md#get-the-token-with-an-http-post). |

*Request payload example:*

```json
{  // needed for validation of the activation request
  "planId": "gold", // purchased plan, cannot be empty
  "quantity": "3" // purchased number of seats, can be empty if plan is not per seat
}
```

*Response codes:*

Code: 200
The subscription was marked as Subscribed on the Microsoft side.

There is no response body for this call.

Code: 400
Bad request: validation failed.

* `planId` doesn't exist in request payload.
* `planId` in request payload doesn't match the one that was purchased.
* `quantity` in request payload doesn't match the one that was purchased
* The SaaS subscription is in a *Subscribed* or *Suspended* state.

Code: 403 
Forbidden. The authorization token is invalid, expired, or was not provided. The request is attempting to access a SaaS subscription for an offer that was published with a different Azure AD app ID from the one used to create the authorization token.

This error is often a symptom of not performing the [SaaS registration](pc-saas-registration.md) correctly.

Code: 404 
Not found. The SaaS subscription is in an *Unsubscribed* state.

Code: 500
Internal server error.  Retry the API call.  If the error persists, contact [Microsoft support](https://go.microsoft.com/fwlink/?linkid=2165533).

## Get list of all subscriptions

This API retrieves a list of all purchased SaaS subscriptions for all offers that the publisher publishes in the commercial marketplace.  SaaS subscriptions in all possible statuses will be returned. Unsubscribed SaaS subscriptions are also returned because this information is not deleted on the Microsoft side.

The API returns paginated results of 100 per page.

### Get `https://marketplaceapi.microsoft.com/api/saas/subscriptions?api-version=<ApiVersion>`

*Query parameters:*

|  Parameter         | Value             |
|  --------   |  ---------------  |
| `ApiVersion`  |  Use 2018-08-31.  |
| `continuationToken`  | Optional parameter. To retrieve the first page of results, leave empty.  Use the value returned in `@nextLink` parameter to retrieve the next page. |

*Request headers:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
| `content-type`       |  `application/json`  |
| `x-ms-requestid`     |  A unique string value for tracking the request from the client, preferably a GUID. If this value isn't provided, one will be generated and provided in the response headers. |
| `x-ms-correlationid` |  A unique string value for operation on the client.  This parameter correlates all events from client operation with events on the server side.  If this value isn't provided, one will be generated and provided in the response headers. |
| `authorization`      |  A unique access token that identifies the publisher that's making this API call.  The format is `"Bearer <access_token>"` when the token value is retrieved by the publisher as explained in [Get a token based on the Azure AD app](./pc-saas-registration.md#get-the-token-with-an-http-post). |

*Response codes:*

Code: 200
Returns the list of all existing subscriptions for all offers made by this publisher, based on the publisher's authorization token.

*Response body example:*

```json
{
  "subscriptions": [
    {
      "id": "<guid>", // purchased SaaS subscription ID
      "name": "Contoso Cloud Solution", // SaaS subscription name
      "publisherId": "contoso", // publisher ID
      "offerId": "offer1", // purchased offer ID
      "planId": "silver", // purchased plan ID
      "quantity": 10, // purchased amount of seats, will be empty if plan is not per seat
      "beneficiary": { // email address, user ID and tenant ID for which SaaS subscription was purchased.
        "emailId": " test@contoso.com",
        "objectId": "<guid>",
        "tenantId": "<guid>",
        "puid": "<ID of the user>"
      },
      "purchaser": { // email address, user ID and tenant ID that purchased the SaaS subscription. These could be different from beneficiary information for reseller (CSP) purchase
        "emailId": " test@contoso.com",
        "objectId": "<guid>",
        "tenantId": "<guid>",
        "puid": "<ID of the user>"
      },
      "term": { // The period for which the subscription was purchased.
        "startDate": "2022-03-04T00:00:00Z", //format: YYYY-MM-DD. This is the date when the subscription was activated by the ISV and the billing started. This field is relevant only for Active and Suspended subscriptions.
        "endDate": "2022-04-03T00:00:00Z", // This is the last day the subscription is valid. Unless stated otherwise, the automatic renew will happen the next day. This field is relevant only for Active and Suspended subscriptions.
        "termUnit": "P1M" // where P1M is monthly and P1Y is yearly. Also reflected in the startDate and endDate values
      },
      "autoRenew": true,
      "allowedCustomerOperations": ["Read", "Update", "Delete"], // Indicates operations allowed on the SaaS subscription for beneficiary. For CSP-initiated purchases, this will always be "Read" because the customer cannot update or delete subscription in this flow.  Purchaser can perform all operations on the subscription.
      "sessionMode": "None", // not relevant
      "isFreeTrial": true, // true - the customer subscription is currently in free trial, false - the customer subscription is not currently in free trial. (Optional field -– if not returned, the value is false.)
      "isTest": false, // not relevant
      "sandboxType": "None", // not relevant
      "saasSubscriptionStatus": "Subscribed" // Indicates the status of the operation. Can be one of the following: PendingFulfillmentStart, Subscribed, Suspended or Unsubscribed.
    },
    // next SaaS subscription details, might be a different offer
    {
      "id": "<guid1>",
      "name": "Contoso Cloud Solution1",
      "publisherId": "contoso",
      "offerId": "offer2",
      "planId": "gold",
      "quantity": "",
      "beneficiary": {
        "emailId": " test@contoso.com",
        "objectId": "<guid>",
        "tenantId": "<guid>",
        "puid": "<ID of the user>"
      },
      "purchaser": {
        "emailId": "purchase@csp.com ",
        "objectId": "<guid>",
        "tenantId": "<guid>",
        "puid": "<ID of the user>"
      },
      "term": {
        "startDate": "2019-05-31",
        "endDate": "2020-04-30",
        "termUnit": "P1Y"
      },
      "autoRenew": false,
      "allowedCustomerOperations": ["Read"],
      "sessionMode": "None",
      "isFreeTrial": false,
      "isTest": false,
      "sandboxType": "None",
      "saasSubscriptionStatus": "Suspended"
    }
  ],
  "@nextLink": "https:// https://marketplaceapi.microsoft.com/api/saas/subscriptions/?continuationToken=%5b%7b%22token%22%3a%22%2bRID%3a%7eYeUDAIahsn22AAAAAAAAAA%3d%3d%23RT%3a1%23TRC%3a2%23ISV%3a1%23FPC%3aAgEAAAAQALEAwP8zQP9%2fFwD%2b%2f2FC%2fwc%3d%22%2c%22range%22%3a%7b%22min%22%3a%22%22%2c%22max%22%3a%2205C1C9CD673398%22%7d%7d%5d&api-version=2018-08-31" // url that contains continuation token to retrieve next page of the SaaS subscriptions list, if empty or absent, this is the last page. ISV can use this url as is to retrieve the next page or extract the value of continuation token from this url.
}
```

If no purchased SaaS subscriptions are found for this publisher, empty response body is returned.

Code: 403 
Forbidden. The authorization token is unavailable, invalid, or expired.

This error is often a symptom of not performing the [SaaS registration](pc-saas-registration.md) correctly. 

Code: 500
Internal server error. Retry the API call.  If the error persists, contact [Microsoft support](https://go.microsoft.com/fwlink/?linkid=2165533).

## Get subscription

This API retrieves a specified purchased SaaS subscription for a SaaS offer that the publisher publishes in the commercial marketplace. Use this call to get all available information for a specific SaaS subscription by its ID rather than by calling the API that's used for getting a list of all subscriptions.

### Get `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>?api-version=<ApiVersion>`

*Query parameters:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
| `ApiVersion`        |   Use 2018-08-31. |
| `subscriptionId`     |  The unique identifier of the purchased SaaS subscription.  This ID is obtained after resolving the commercial marketplace authorization token by using the Resolve API. |

*Request headers:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `content-type`      |  `application/json`  |
|  `x-ms-requestid`    |  A unique string value for tracking the request from the client, preferably a GUID. If this value isn't provided, one will be generated and provided in the response headers. |
|  `x-ms-correlationid` |  A unique string value for operation on the client.  This parameter correlates all events from client operation with events on the server side.  If this value isn't provided, one will be generated and provided in the response headers. |
|  `authorization`     | A unique access token that identifies the publisher that's making this API call. The format is `"Bearer <access_token>"` when the token value is retrieved by the publisher as explained in [Get a token based on the Azure AD app](./pc-saas-registration.md#get-the-token-with-an-http-post).  |

*Response codes:*

Code: 200
Returns details for a SaaS subscription based on the `subscriptionId` provided.

*Response body example:*

```json
{
  "id": "<guid>", // purchased SaaS subscription ID
  "name": "Contoso Cloud Solution", // SaaS subscription name
  "publisherId": "contoso", // publisher ID
  "offerId": "offer1", // purchased offer ID
  "planId": "silver", // purchased plan ID
  "quantity": 10, // purchased amount of seats, will be empty if plan is not per seat
  "beneficiary": { // email address, user ID and tenant ID for which SaaS subscription is purchased.
    "emailId": "test@contoso.com",
    "objectId": "<guid>",
    "tenantId": "<guid>",
    "puid": "<ID of the user>"
  },
  "purchaser": { // email address ,user ID and tenant ID that purchased the SaaS subscription.  These could be different from beneficiary information for reseller (CSP) scenario
    "emailId": "test@test.com",
    "objectId": "<guid>",
    "tenantId": "<guid>",
    "puid": "<ID of the user>"
  },
  "allowedCustomerOperations": ["Read", "Update", "Delete"], // Indicates operations allowed on the SaaS subscription for beneficiary.  For CSP-initiated purchases, this will always be "Read" because the customer cannot update or delete subscription in this flow.  Purchaser can perform all operations on the subscription.
  "sessionMode": "None", // not relevant
  "isFreeTrial": false, // true - the customer subscription is currently in free trial, false - the customer subscription is not currently in free trial. Optional field – if not returned the value is false.
  "autoRenew": true,
  "isTest": false, // not relevant
  "sandboxType": "None", // not relevant
  "created": "2022-03-01T22:59:45.5468572Z",
     "lastModified": "0001-01-01T00:00:00",
  "saasSubscriptionStatus": " Subscribed ", // Indicates the status of the operation: PendingFulfillmentStart, Subscribed, Suspended or Unsubscribed.
  "term": { // the period for which the subscription was purchased
    "startDate": "2022-03-04T00:00:00Z", //format: YYYY-MM-DD. This is the date when the subscription was activated by the ISV and the billing started. This field is relevant only for Active and Suspended subscriptions.
    "endDate": "2022-04-03T00:00:00Z", // This is the last day the subscription is valid. Unless stated otherwise, the automatic renew will happen the next day. This field is relevant only for Active and Suspended subscriptions.
    "termUnit": "P1M" //where P1M is monthly and P1Y is yearly. Also reflected in the startDate and endDate values.
  }
}
```

Code: 403
Forbidden. The authorization token is invalid, expired, or was not provided. The request is attempting to access a SaaS subscription for an offer that's published with a different Azure AD app ID from the one used to create the authorization token.

This error is often a symptom of not performing the [SaaS registration](pc-saas-registration.md) correctly. 

Code: 404
Not found.  SaaS subscription with the specified `subscriptionId` cannot be found.

Code: 500
Internal server error.  Retry the API call.  If the error persists, contact [Microsoft support](https://go.microsoft.com/fwlink/?linkid=2165533).

## List available plans

This API retrieves all plans for a SaaS offer identified by the `subscriptionId` of a specific purchase of this offer.  Use this call to get a list of all private and public plans that the beneficiary of a SaaS subscription can update for the subscription.  The plans returned will be available in the same geography as the already purchased plan.

This call returns a list of plans available for that customer in addition to the one already purchased.  The list can be presented to an end user on the publisher site.  An end user can change the subscription plan to any one of the plans in the returned list.  Changing the plan to one not in the list will fail.

### Get `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/listAvailablePlans?api-version=<ApiVersion>`

*Query parameters:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `ApiVersion`        |  Use 2018-08-31.  |
|  `subscriptionId`    |  The unique identifier of the purchased SaaS subscription.  This ID is obtained after resolving the commercial marketplace authorization token by using the Resolve API. |

*Request headers:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|   `content-type`     |  `application/json` |
|   `x-ms-requestid`   |  A unique string value for tracking the request from the client, preferably a GUID.  If this value isn't provided, one will be generated and provided in the response headers. |
|  `x-ms-correlationid`  |  A unique string value for operation on the client.  This parameter correlates all events from client operation with events on the server side.  If this value isn't provided, one will be generated and provided in the response headers. |
|  `authorization`     |  A unique access token that identifies the publisher that's making this API call.  The format is `"Bearer <access_token>"` when the token value is retrieved by the publisher as explained in [Get a token based on the Azure AD app](./pc-saas-registration.md#get-the-token-with-an-http-post).  |

*Response codes:*

Code: 200
Returns a list of all available plans for an existing SaaS subscription including the one already purchased.

Response body example:

```json
{
  "plans": [
    {
      "planId": "Platinum001",
      "displayName": "Private platinum plan for Contoso", // display name of the plan as it appears in the marketplace
      "isPrivate": true, //true or false
      "description": "plan description",
          "minQuantity": 5,
          "maxQuantity": 100,
          "hasFreeTrials": false,
          "isPricePerSeat": true,
          "isStopSell": false,
          "market": "US",
    },
    {
      "planId": "gold",
      "displayName": "Gold plan for Contoso",
      "isPrivate": false, //true or false
      "description": "gold plan details.",
          "minQuantity": 1,
          "maxQuantity": 5,
          "hasFreeTrials": false,
          "isPricePerSeat": true,
          "isStopSell": false,
          "market": "US",
    }
  ]
}
```

Code: 404 Not Found.
`subscriptionId` is not found.

Code: 403
Forbidden. The authorization token is invalid, expired, or was not provided.  The request may be attempting to access a SaaS subscription for an offer that's unsubscribed or published with a different Azure AD app ID from the one used to create the authorization token.

This error is often a symptom of not performing the [SaaS registration](pc-saas-registration.md) correctly. 

Code: 500
Internal server error.  Retry the API call.  If the error persists, contact [Microsoft support](https://go.microsoft.com/fwlink/?linkid=2165533).

## Change the plan on the subscription

Use this API to update the existing plan purchased for a SaaS subscription to a new plan (public or private).  The publisher must call this API when a plan is changed on the publisher side for a SaaS subscription purchased in the commercial marketplace.

This API can be called only for *Active* subscriptions.  Any plan can be changed to any other existing plan (public or private) but not to itself.  For private plans, the customer's tenant must be defined as part of plan's audience in Partner Center.

### Patch `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>?api-version=<ApiVersion>`

*Query parameters:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `ApiVersion`        |  Use 2018-08-31.  |
| `subscriptionId`     | The unique identifier of the purchased SaaS subscription.  This ID is obtained after resolving the commercial marketplace authorization token by using the Resolve API. |

*Request headers:*
 
|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `content-type`      | `application/json`  |
|  `x-ms-requestid`    | A unique string value for tracking the request from the client, preferably a GUID. If this value isn't provided, one will be generated and provided in the response headers.  |
|  `x-ms-correlationid`  | A unique string value for operation on the client.  This parameter correlates all events from client operation with events on the server side.  If this value isn't provided, one will be generated and provided in the response headers.  |
|  `authorization`     |  A unique access token that identifies the publisher that's making this API call.  The format is `"Bearer <access_token>"` when the token value is retrieved by the publisher as explained in [Get a token based on the Azure AD app](./pc-saas-registration.md#get-the-token-with-an-http-post). |

*Request payload example:*

```json
{
  "planId": "gold" // the ID of the new plan to be purchased
}
```

*Response codes:*

Code: 202
The request to change plan has been accepted and handled asynchronously.  The partner is expected to poll the **Operation-Location URL** to determine a success or failure of the change plan request.  Polling should be done every several seconds until the final status of *Failed*, *Succeed*, or *Conflict* is received for the operation.  Final operation status should be returned quickly, but can take several minutes in some cases.

The partner will also get webhook notification when the action is ready to be completed successfully on the commercial marketplace side.  Only then should the publisher make the plan change on the publisher side.

*Response headers:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `Operation-Location`        |  URL to get the operation's status.  For example, `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/operations/<operationId>?api-version=2018-08-31`. |

Code: 400
Bad request: validation failures.

* The new plan doesn't exist or isn't available for this specific SaaS subscription.
* The new plan is the same as the current plan.
* The SaaS subscription status isn't *Subscribed*.
* The update operation for a SaaS subscription isn't included in `allowedCustomerOperations`.

Code: 403
Forbidden. The authorization token is invalid, expired, or wasn't provided.  The request is attempting to access a SaaS subscription for an offer that's published with a different Azure AD app ID from the one used to create the authorization token.

This error is often a symptom of not performing the [SaaS registration](pc-saas-registration.md) correctly.

Code: 404
Not found.  The SaaS subscription with `subscriptionId` is not found.

Code: 500
Internal server error.  Retry the API call.  If the error persists, contact [Microsoft support](https://go.microsoft.com/fwlink/?linkid=2165533).

>[!NOTE]
>Either the plan or quantity of seats can be changed at one time, not both.

>[!Note]
>This API can be called only after getting explicit approval for the change from the end user.

## Change the quantity of seats on the SaaS subscription

Use this API to update (increase or decrease) the quantity of seats purchased for a SaaS subscription.  The publisher must call this API when the number of seats is changed from the publisher side for a SaaS subscription created in the commercial marketplace.

The quantity of seats cannot be more than the quantity allowed in the current plan.  In this case, the publisher should change the plan before changing the quantity of seats.

### Patch `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>?api-version=<ApiVersion>`

*Query parameters:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `ApiVersion`        |  Use 2018-08-31.  |
|  `subscriptionId`     | A unique identifier of the purchased SaaS subscription.  This ID is obtained after resolving the commercial marketplace authorization token by using the Resolve API.  |

*Request headers:*
 
|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `content-type`      | `application/json`  |
|  `x-ms-requestid`    | A unique string value for tracking the request from the client, preferably a GUID.  If this value isn't provided, one will be generated and provided in the response headers.  |
|  `x-ms-correlationid`  | A unique string value for operation on the client.  This parameter correlates all events from client operation with events on the server side.  If this value isn't provided, one will be generated and provided in the response headers.  |
|  `authorization`     | A unique access token that identifies the publisher that's making this API call.  The format is `"Bearer <access_token>"` when the token value is retrieved by the publisher as explained in [Get a token based on the Azure AD app](./pc-saas-registration.md#get-the-token-with-an-http-post).  |

*Request payload example:*

```json
{
  "quantity": 5 // the new amount of seats to be purchased
}
```

*Response codes:*

Code: 202
The request to change quantity has been accepted and handled asynchronously. The partner is expected to poll the **Operation-Location URL** to determine a success or failure of the change quantity request.  Polling should be done every several seconds until the final status of *Failed*, *Succeed*, or *Conflict* is received for the operation.  The final operation status should be returned quickly but can take several minutes in some cases.

The partner will also get webhook notification when the action is ready to be completed successfully on the commercial marketplace side.  Only then should the publisher make the quantity change on the publisher side.

*Response headers:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `Operation-Location`        |  Link to a resource to get the operation's status.  For example, `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/operations/<operationId>?api-version=2018-08-31`.  |

Code: 400
Bad request: validation failures.

* The new quantity is greater or lower than the current plan limit.
* The new quantity is missing.
* The new quantity is the same as the current quantity.
* The SaaS Subscription status is not Subscribed.
* The update operation for a SaaS subscription is not included in `allowedCustomerOperations`.

Code: 403
Forbidden.  The authorization token is invalid, expired, or was not provided.  The request is attempting to access a subscription that doesn't belong to the current publisher.

This error is often a symptom of not performing the [SaaS registration](pc-saas-registration.md) correctly. 

Code: 404
Not found.  The SaaS subscription with `subscriptionId` is not found.

Code: 500
Internal server error.  Retry the API call.  If the error persists, contact [Microsoft support](https://go.microsoft.com/fwlink/?linkid=2165533).

>[!Note]
>Only a plan or quantity can be changed at one time, not both.

>[!Note]
>This API can be called only after getting explicit approval from the end user for the change.

## Cancel a subscription

Use this API to unsubscribe a specified SaaS subscription.  The publisher doesn't have to use this API and we recommend that customers are directed to the commercial marketplace to cancel SaaS subscriptions.

If the publisher decides to implement the cancellation of a SaaS subscription purchased in the commercial marketplace on the publisher's side, they must call this API.  After the completion of this call, the subscription's status will become *Unsubscribed* on the Microsoft side.

The customer won't be billed if a subscription is canceled within 72 hours from purchase.

The customer will be billed if a subscription is canceled after the preceding grace period.  The customer will lose access to the SaaS subscription on the Microsoft side immediately after cancellation.

### Delete `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>?api-version=<ApiVersion>`

*Query parameters:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `ApiVersion`        |  Use 2018-08-31.  |
|  `subscriptionId`     | The unique identifier of the purchased SaaS subscription.  This ID is obtained after resolving the commercial marketplace authorization token by using the Resolve API.  |

*Request headers:*
 
|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `content-type`      | `application/json`  |
|  `x-ms-requestid`    | A unique string value for tracking the request from the client, preferably a GUID.  If this value isn't provided, one will be generated and provided in the response headers. |
|  `x-ms-correlationid`  | A unique string value for operation on the client.  This parameter correlates all events from client operation with events on the server side.  If this value isn't provided, one will be generated and provided in the response headers.  |
|  `authorization`     |  A unique access token that identifies the publisher making this API call.  The format is `"Bearer <access_token>"` when the token value is retrieved by the publisher as explained in [Get a token based on the Azure AD app](./pc-saas-registration.md#get-the-token-with-an-http-post). |

*Response codes:*

Code: 202
The request to unsubscribe has been accepted and handled asynchronously.  The partner is expected to poll the **Operation-Location URL** to determine a success or failure of this request.  Polling should be done every several seconds until the final status of *Failed*, *Succeed*, or *Conflict* is received for the operation.  The final operation status should be returned quickly but can take several minutes in some cases.

The partner will also get webhook notification when the action is completed successfully on the commercial marketplace side.  Only then should the publisher cancel the subscription on the publisher side.

*Response headers:*

|  Parameter         | Value             |
|  ---------------   |  ---------------  |
|  `Operation-Location`        |  Link to a resource to get the operation's status.  For example, `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/operations/<operationId>?api-version=2018-08-31`. |

Code: 400
Bad request.  Delete is not in `allowedCustomerOperations` list for this SaaS subscription.

Code: 403
Forbidden.  The authorization token is invalid, expired, or is not available. The request is attempting to access a SaaS subscription for an offer that's published with a different Azure AD app ID from the one used to create the authorization token.

This error is often a symptom of not performing the [SaaS registration](pc-saas-registration.md) correctly.

Code: 404
Not found.  The SaaS subscription with `subscriptionId` is not found.

Code: 500
Internal server error. Retry the API call.  If the error persists, contact [Microsoft support](https://go.microsoft.com/fwlink/?linkid=2165533).

## Next steps

See the [commercial marketplace metering service APIs](../marketplace-metering-service-apis.md) for more options for SaaS offers in the commercial marketplace.

Review and use the [clients for different programming languages and samples](https://github.com/microsoft/commercial-marketplace-samples).
