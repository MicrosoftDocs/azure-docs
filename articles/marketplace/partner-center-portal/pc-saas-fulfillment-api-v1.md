---
title: SaaS Fulfillment APIs v1 | Azure Marketplace 
description: Explains how to create and manage a SaaS offer on the Azure Marketplace using the associated Fulfillment v1 APIs.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: reference
ms.date: 05/23/2019
ms.author: evansma

ROBOTS: NOINDEX
---

# SaaS Fulfillment APIs version 1 (deprecated)

This article explains how to create a SaaS offer with APIs. The APIs, composed of REST methods and endpoints, are necessary for allowing subscriptions to your SaaS offer if you have Sell
through Azure selected.  

> [!WARNING]
> This initial version of the SaaS Fulfillment API is deprecated; instead, use [SaaS Fulfillment API V2](./pc-saas-fulfillment-api-v2.md).  This intial version of the API is currently being maintained only to serve existing publishers. 

The following APIs are provided to help you integrate your SaaS service with Azure:

-   Resolve
-   Subscribe
-   Convert
-   Unsubscribe


## API methods and endpoints

The following sections describe the API methods and endpoints available for enabling subscriptions for a SaaS offer.


### Marketplace API endpoint and API version

The endpoint for Azure Marketplace API is `https://marketplaceapi.microsoft.com`.

The current API version is `api-version=2017-04-15`.


### Resolve subscription

POST action on resolve endpoint allows users to resolve a marketplace token to a persistent Resource ID.  The Resource ID is the unique identifier for SAAS subscription. 

When a user is redirected to an ISV’s website, the URL contains a token in the query parameters. The ISV is expected to use this token, and make a request to resolve it. The response contains the unique SAAS subscription ID, name, offer ID, and plan for the resource. This token is valid for an hour only.

*Request*

**POST**

**https://marketplaceapi.microsoft.com/api/saas/subscriptions/resolve?api-version=2017-04-15**

|  **Parameter Name** |     **Description**                                      |
|  ------------------ |     ---------------------------------------------------- |
|  api-version        |  The version of the operation to use for this request.   |
|  |  |


*Headers*

| **Header key**     | **Required** | **Description**                                                                                                                                                                                                                  |
|--------------------|--------------|-----------------------------------------------------------|
| x-ms-requestid     | No           | A unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers.  |
| x-ms-correlationid | No           | A unique string value for operation on the client. This field correlates all events from client operation with events on the server side. If this value is not provided, one will be generated and provided in the response headers. |
| Content-type       | Yes          | `application/json`                                        |
| authorization      | Yes          | The JSON web token (JWT) bearer token.                    |
| x-ms-marketplace-token| Yes| The token query parameter in the URL when the user is redirected to SaaS ISV’s website from Azure. **Note:** This token is only valid for 1 hour. Additionally, URL decode the token value from the browser before using it.|
|  |  |  |
  

*Response Body*

``` json
{
    "id": "",
    "subscriptionName": "",
    "offerId": "",
    "planId": "",
}
```

| **Parameter name** | **Data type** | **Description**                       |
|--------------------|---------------|---------------------------------------|
| id                 | String        | ID of the SaaS subscription.          |
| subscriptionName| String| Name of the SaaS subscription set by user in Azure while subscribing to the SaaS service.|
| OfferId            | String        | Offer ID that the user subscribed to. |
| planId             | String        | Plan ID that the user subscribed to.  |
|  |  |  |


*Response Codes*

| **HTTP Status Code** | **Error Code**     | **Description**                                                                         |
|----------------------|--------------------| --------------------------------------------------------------------------------------- |
| 200                  | `OK`                 | Token resolved successfully.                                                            |
| 400                  | `BadRequest`         | Either required headers are missing or an invalid api-version specified. Failed to resolve the token because either the token is malformed or expired (the token is only valid for 1 hour once generated). |
| 403                  | `Forbidden`          | The caller is not authorized to perform this operation.                                 |
| 429                  | `RequestThrottleId`  | Service is busy processing requests, retry later.                                |
| 503                  | `ServiceUnavailable` | Service is down temporarily, retry later.                                        |
|  |  |  |


*Response Headers*

| **Header Key**     | **Required** | **Description**                                                                                        |
|--------------------|--------------|--------------------------------------------------------------------------------------------------------|
| x-ms-requestid     | Yes          | Request ID received from the client.                                                                   |
| x-ms-correlationid | Yes          | Correlation ID if passed by the client, otherwise this value is the server correlation ID.                   |
| x-ms-activityid    | Yes          | A unique string value for tracking the request from the service. This ID is used for any reconciliations. |
| Retry-After        | No           | This value is set only for a 429 response.                                                                   |
|  |  |  |


### Subscribe

The subscribe endpoint allows users to start a subscription to a SaaS
service for a given plan and enable billing in the commerce system.

**PUT**

**https://marketplaceapi.microsoft.com/api/saas/subscriptions/*{subscriptionId}*?api-version=2017-04-15**

| **Parameter Name**  | **Description**                                       |
|---------------------|-------------------------------------------------------|
| subscriptionId      | Unique ID of SaaS subscription that is obtained after resolving the token via Resolve API.                              |
| api-version         | The version of the operation to use for this request. |
|  |  |

*Headers*

|  **Header key**        | **Required** |  **Description**                                                  |
| ------------------     | ------------ | --------------------------------------------------------------------------------------- |
| x-ms-requestid         |   No         | A unique string value for tracking the request from the client, preferably a GUID. If this is not provided, one will be generated and provided in the response headers. |
| x-ms-correlationid     |   No         | A unique string value for operation on the client. This value is for correlating all events from client operation with events on the server side. If this is not provided, one will be generated and provided in the response headers. |
| If-Match/If-None-Match |   No         |   Strong validator ETag value.                                                          |
| content-type           |   Yes        |    `application/json`                                                                   |
|  authorization         |   Yes        |    The JSON web token (JWT) bearer token.                                               |
| x-ms-marketplace-session-mode| No | Flag to enable dry run mode while subscribing to a SaaS offer. If set, the subscription will not be charged. This is useful for ISV testing scenarios. Please set it to **‘dryrun’**|
|  |  |  |

*Body*

``` json
{
    "lanId": "",
}
```

| **Element name** | **Data type** | **Description**                      |
|------------------|---------------|--------------------------------------|
| planId           | (Required) String        | Plan ID of the SaaS service user is subscribing to.  |
|  |  |  |

*Response Codes*

| **HTTP Status Code** | **Error Code**     | **Description**                                                           |
|----------------------|--------------------|---------------------------------------------------------------------------|
| 202                  | `Accepted`           | SaaS subscription activation received for a given plan.                   |
| 400                  | `BadRequest`         | Either required headers are missing or the body of the JSON is malformed. |
| 403                  | `Forbidden`          | The caller is not authorized to perform this operation.                   |
| 404                  | `NotFound`           | Subscription not found with the given ID                                  |
| 409                  | `Conflict`           | Another operation is in progress on the subscription.                     |
| 429                  | `RequestThrottleId`  | Service is busy processing requests,  retry later.                  |
| 503                  | `ServiceUnavailable` | Service is down temporarily, retry later.                          |
|  |  |  |

For a 202 response, follow up on the request operation’s status at the ‘Operation-location’ header. The authentication is the same as other Marketplace APIs.

*Response Headers*

| **Header Key**     | **Required** | **Description**                                                                                        |
|--------------------|--------------|--------------------------------------------------------------------------------------------------------|
| x-ms-requestid     | Yes          | Request ID received from the client.                                                                   |
| x-ms-correlationid | Yes          | Correlation ID if passed by the client, otherwise this value is the server correlation ID.                   |
| x-ms-activityid    | Yes          | A unique string value for tracking the request from the service. This value is used for any reconciliations. |
| Retry-After        | Yes          | Interval with which client can check the status.                                                       |
| Operation-Location | Yes          | Link to a resource to get the operation status.                                                        |
|  |  |  |

### Change plan endpoint

The change endpoint allows the user to convert their currently subscribed plan to a new plan.

**PATCH**

**https://marketplaceapi.microsoft.com/api/saas/subscriptions/*{subscriptionId}*?api-version=2017-04-15**

| **Parameter Name**  | **Description**                                       |
|---------------------|-------------------------------------------------------|
| subscriptionId      | ID of SaaS subscription.                              |
| api-version         | The version of the operation to use for this request. |
|  |  |

*Headers*

| **Header key**          | **Required** | **Description**                                                                                                                                                                                                                  |
|-------------------------|--------------|---------------------------------------------------------------------------------------------------------------------|
| x-ms-requestid          | No           | A unique string value for tracking the request from the client. Recommend a GUID. If this is not provided, one will be generated and provided in the response headers.   |
| x-ms-correlationid      | No           | A unique string value for operation on the client. This value is for correlating all events from client operation with events on the server side. If this is not provided, one will be generated and provided in the response headers. |
| If-Match /If-None-Match | No           | Strong validator ETag value.                              |
| content-type            | Yes          | `application/json`                                        |
| authorization           | Yes          | The JSON web token (JWT) bearer token.                    |
|  |  |  |

*Body*

```json
{
    "planId": ""
}
```

|  **Element name** |  **Data type**  | **Description**                              |
|  ---------------- | -------------   | --------------------------------------       |
|  planId           |  (Required) String         | Plan ID of the SaaS service user is subscribing to.          |
|  |  |  |

*Response Codes*

| **HTTP Status Code** | **Error Code**     | **Description**                                                           |
|----------------------|--------------------|---------------------------------------------------------------------------|
| 202                  | `Accepted`           | SaaS subscription activation received for a given plan.                   |
| 400                  | `BadRequest`         | Either required headers are missing or the body of the JSON is malformed. |
| 403                  | `Forbidden`          | The caller is not authorized to perform this operation.                   |
| 404                  | `NotFound`           | Subscription not found with the given ID                                  |
| 409                  | `Conflict`           | Another operation is in progress on the subscription.                     |
| 429                  | `RequestThrottleId`  | Service is busy processing requests,  retry later.                  |
| 503                  | `ServiceUnavailable` | Service is down temporarily, retry later.                          |
|  |  |  |

*Response Headers*

| **Header Key**     | **Required** | **Description**                                                                                        |
|--------------------|--------------|--------------------------------------------------------------------------------------------------------|
| x-ms-requestid     | Yes          | Request ID received from the client.                                                                   |
| x-ms-correlationid | Yes          | Correlation ID if passed by the client, otherwise this value is the server correlation ID.                   |
| x-ms-activityid    | Yes          | A unique string value for tracking the request from the service. This value is used for any reconciliations. |
| Retry-After        | Yes          | Interval with which client can check the status.                                                       |
| Operation-Location | Yes          | Link to a resource to get the operation status.                                                        |
|  |  |  |

### Delete subscription

The Delete action on the subscribe endpoint allows a user to delete a subscription with a given ID.

*Request*

**DELETE**

**https://marketplaceapi.microsoft.com/api/saas/subscriptions/*{subscriptionId}*?api-version=2017-04-15**

| **Parameter Name**  | **Description**                                       |
|---------------------|-------------------------------------------------------|
| subscriptionId      | ID of SaaS subscription.                              |
| api-version         | The version of the operation to use for this request. |
|  |  |

*Headers*

| **Header key**     | **Required** | **Description**                                                                                                                                                                                                                  |
|--------------------|--------------| ----------------------------------------------------------|
| x-ms-requestid     | No           | A unique string value for tracking the request from the client. Recommend a GUID. If this value is not provided, one will be generated and provided in the response headers.                                                           |
| x-ms-correlationid | No           | A unique string value for operation on the client. This value is for correlating all events from client operation with events on the server side. If this is not provided, one will be generated and provided in the response headers. |
| authorization      | Yes          | The JSON web token (JWT) bearer token.                    |
|  |  |  |

*Response Codes*

| **HTTP Status Code** | **Error Code**     | **Description**                                                           |
|----------------------|--------------------|---------------------------------------------------------------------------|
| 202                  | `Accepted`           | SaaS subscription activation received for a given plan.                   |
| 400                  | `BadRequest`         | Either required headers are missing or the body of the JSON is malformed. |
| 403                  | `Forbidden`          | The caller is not authorized to perform this operation.                   |
| 404                  | `NotFound`           | Subscription not found with the given ID                                  |
| 429                  | `RequestThrottleId`  | Service is busy processing requests, please retry later.                  |
| 503                  | `ServiceUnavailable` | Service is down temporarily. Please retry later.                          |
|  |  |  |

For a 202 response, follow up on the request operation’s status at the ‘Operation-location’ header. The authentication is the same as other Marketplace APIs.

*Response Headers*

| **Header Key**     | **Required** | **Description**                                                                                        |
|--------------------|--------------|--------------------------------------------------------------------------------------------------------|
| x-ms-requestid     | Yes          | Request ID received from the client.                                                                   |
| x-ms-correlationid | Yes          | Correlation ID if passed by the client, otherwise this is the server correlation ID.                   |
| x-ms-activityid    | Yes          | A unique string value for tracking the request from the service. This is used for any reconciliations. |
| Retry-After        | Yes          | Interval with which client can check the status.                                                       |
| Operation-Location | Yes          | Link to a resource to get the operation status.                                                        |
|   |  |  |

### Get Operation Status

This endpoint allows user to track the status of a triggered async operation (Subscribe/Unsubscribe/Change plan).

*Request*

**GET**

**https://marketplaceapi.microsoft.com/api/saas/operations/*{operationId}*?api-version=2017-04-15**

| **Parameter Name**  | **Description**                                       |
|---------------------|-------------------------------------------------------|
| operationId         | Unique ID for the operation triggered.                |
| api-version         | The version of the operation to use for this request. |
|  |  |

*Headers*

| **Header key**     | **Required** | **Description**                                                                                                                                                                                                                  |
|--------------------|--------------|--------------------------------------------------------------------------------------------------------------------------|
| x-ms-requestid     | No           | A unique string value for tracking the request from the client. Recommend a GUID. If this value is not provided, one will be generated and provided in the response headers.   |
| x-ms-correlationid | No           | A unique string value for operation on the client. This value is for correlating all events from client operation with events on the server side. If this value is not provided, one will be generated and provided in the response headers.  |
| authorization      | Yes          | The JSON web token (JWT) bearer token.                    |
|  |  |  | 

*Response Body*

```json
{
    "id": "",
    "status": "",
    "resourceLocation": "",
    "created": "",
    "lastModified": ""
}
```

| **Parameter name** | **Data type** | **Description**                                                                                                                                               |
|--------------------|---------------|-------------------------------------------------------------------------------------------|
| id                 | String        | ID of the operation.                                                                      |
| status             | Enum          | Operation status, one of the following: `In Progress`, `Succeeded`, or `Failed`.          |
| resourceLocation   | String        | Link to the subscription that was created or modified. This helps the client to get updated state post operation. This value is not set for `Unsubscribe` operations. |
| created            | DateTime      | Operation creation time in UTC.                                                           |
| lastModified       | DateTime      | Last update on the operation in UTC.                                                      |
|  |  |  |

*Response Codes*

| **HTTP Status Code** | **Error Code**     | **Description**                                                              |
|----------------------|--------------------|------------------------------------------------------------------------------|
| 200                  | `OK`                 | Resolved the get request successfully and the body contains the response.    |
| 400                  | `BadRequest`         | Either required headers are missing or an invalid api-version was specified. |
| 403                  | `Forbidden`          | The caller is not authorized to perform this operation.                      |
| 404                  | `NotFound`           | Subscription not found with the given ID.                                     |
| 429                  | `RequestThrottleId`  | Service is busy processing requests, retry later.                     |
| 503                  | `ServiceUnavailable` | Service is down temporarily, retry later.                             |
|  |  |  |

*Response Headers*

| **Header Key**     | **Required** | **Description**                                                                                        |
|--------------------|--------------|--------------------------------------------------------------------------------------------------------|
| x-ms-requestid     | Yes          | Request ID received from the client.                                                                   |
| x-ms-correlationid | Yes          | Correlation ID if passed by the client, otherwise this is the server correlation ID.                   |
| x-ms-activityid    | Yes          | A unique string value for tracking the request from the service. This is used for any reconciliations. |
| Retry-After        | Yes          | Interval with which client can check the status.                                                       |
|  |  |  |

### Get Subscription

The Get action on subscribe endpoint allows a user to retrieve a subscription with a given resource identifier.

*Request*

**GET**

**https://marketplaceapi.microsoft.com/api/saas/subscriptions/*{subscriptionId}*?api-version=2017-04-15**

| **Parameter Name**  | **Description**                                       |
|---------------------|-------------------------------------------------------|
| subscriptionId      | ID of SaaS subscription.                              |
| api-version         | The version of the operation to use for this request. |
|  |  |

*Headers*

| **Header key**     | **Required** | **Description**                                                                                           |
|--------------------|--------------|-----------------------------------------------------------------------------------------------------------|
| x-ms-requestid     | No           | A unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers.                                                           |
| x-ms-correlationid | No           | A unique string value for operation on the client. This value is for correlating all events from client operation with events on the server side. If this value is not provided, one will be generated and provided in the response headers. |
| authorization      | Yes          | The JSON web token (JWT) bearer token.                                                                    |
|  |  |  |

*Response Body*

```json
{
    "id": "",
    "saasSubscriptionName": "",
    "offerId": "",
    "planId": "",
    "saasSubscriptionStatus": "",
    "created": "",
    "lastModified": ""
}
```

| **Parameter name**     | **Data type** | **Description**                               |
|------------------------|---------------|-----------------------------------------------|
| id                     | String        | ID of SaaS subscription resource in Azure.    |
| offerId                | String        | Offer ID that the user subscribed to.         |
| planId                 | String        | Plan ID that the user subscribed to.          |
| saasSubscriptionName   | String        | Name of the SaaS subscription.                |
| saasSubscriptionStatus | Enum          | Operation status.  One of the following:  <br/> - `Subscribed`: Subscription is active.  <br/> - `Pending`: User create the resource but it isn't activated by the ISV.   <br/> - `Unsubscribed`: User has unsubscribed.   <br/> - `Suspended`: User has suspended the subscription.   <br/> - `Deactivated`:  Azure subscription is suspended.  |
| created                | DateTime      | Subscription creation timestamp value in UTC. |
| lastModified           | DateTime      | Subscription modified timestamp value in UTC. |
|  |  |  |

*Response Codes*

| **HTTP Status Code** | **Error Code**     | **Description**                                                              |
|----------------------|--------------------|------------------------------------------------------------------------------|
| 200                  | `OK`                 | Resolved the get request successfully and the body contains the response.    |
| 400                  | `BadRequest`         | Either required headers are missing or an invalid api-version was specified. |
| 403                  | `Forbidden`          | The caller is not authorized to perform this operation.                      |
| 404                  | `NotFound`           | Subscription not found with the given ID                                     |
| 429                  | `RequestThrottleId`  | Service is busy processing requests,  retry later.                     |
| 503                  | `ServiceUnavailable` | Service is down temporarily, retry later.                             |
|  |  |  |

*Response Headers*

| **Header Key**     | **Required** | **Description**                                                                                        |
|--------------------|--------------|--------------------------------------------------------------------------------------------------------|
| x-ms-requestid     | Yes          | Request ID received from the client.                                                                   |
| x-ms-correlationid | Yes          | Correlation ID if passed by the client, otherwise this is the server correlation ID.                   |
| x-ms-activityid    | Yes          | A unique string value for tracking the request from the service. This is used for any reconciliations. |
| Retry-After        | No           | Interval with which client can check the status.                                                       |
| eTag               | Yes          | Link to a resource to get the operation status.                                                        |
|  |  |  |

### Get Subscriptions

The Get action on subscriptions endpoint allows a user to retrieve all subscriptions for all the offers from the ISV.

*Request*

**GET**

**https://marketplaceapi.microsoft.com/api/saas/subscriptions?api-version=2017-04-15**

| **Parameter Name**  | **Description**                                       |
|---------------------|-------------------------------------------------------|
| api-version         | The version of the operation to use for this request. |
|  |  |

*Headers*

| **Header key**     | **Required** | **Description**                                           |
|--------------------|--------------|-----------------------------------------------------------|
| x-ms-requestid     | No           | A unique string value for tracking the request from the client. Recommend a GUID. If this value is not provided, one will be generated and provided in the response headers.             |
| x-ms-correlationid | No           | A unique string value for operation on the client. This value is for correlating all events from client operation with events on the server side. If this value is not provided, one will be generated and provided in the response headers. |
| authorization      | Yes          | The JSON web token (JWT) bearer token.                    |
|  |  |  |

*Response Body*

```json
{
    "id": "",
    "saasSubscriptionName": "",
    "offerId": "",
    "planId": "",
    "saasSubscriptionStatus": "",
    "created": "",
    "lastModified": ""
}
```

| **Parameter name**     | **Data type** | **Description**                               |
|------------------------|---------------|-----------------------------------------------|
| id                     | String        | ID of SaaS subscription resource in Azure    |
| offerId                | String        | Offer ID that the user subscribed to         |
| planId                 | String        | Plan ID that the user subscribed to          |
| saasSubscriptionName   | String        | Name of the SaaS subscription                |
| saasSubscriptionStatus | Enum          | Operation status.  One of the following:  <br/> - `Subscribed`: Subscription is active.  <br/> - `Pending`: User create the resource but it isn't activated by the ISV.   <br/> - `Unsubscribed`: User has unsubscribed.   <br/> - `Suspended`: User has suspended the subscription.   <br/> - `Deactivated`:  Azure subscription is suspended.  |
| created                | DateTime      | Subscription creation timestamp value in UTC |
| lastModified           | DateTime      | Subscription modified timestamp value in UTC |
|  |  |  |

*Response Codes*

| **HTTP Status Code** | **Error Code**     | **Description**                                                              |
|----------------------|--------------------|------------------------------------------------------------------------------|
| 200                  | `OK`                 | Resolved the get request successfully and the body contains the response.    |
| 400                  | `BadRequest`         | Either required headers are missing or an invalid api-version was specified. |
| 403                  | `Forbidden`          | The caller is not authorized to perform this operation.                      |
| 404                  | `NotFound`           | Subscription not found with the given ID                                     |
| 429                  | `RequestThrottleId`  | Service is busy processing requests, please retry later.                     |
| 503                  | `ServiceUnavailable` | Service is down temporarily. Please retry later.                             |
|  |  |  |

*Response Headers*

| **Header Key**     | **Required** | **Description**                                                                                        |
|--------------------|--------------|--------------------------------------------------------------------------------------------------------|
| x-ms-requestid     | Yes          | Request ID received from the client.                                                                   |
| x-ms-correlationid | Yes          | Correlation ID if passed by the client, otherwise this is the server correlation ID.                   |
| x-ms-activityid    | Yes          | A unique string value for tracking the request from the service. This is used for any reconciliations. |
| Retry-After        | No           | Interval with which client can check the status.                                                       |
|  |  |  |

### SaaS Webhook

A SaaS webhook is used for notifying changes proactively to the SaaS service. This POST API is expected to be unauthenticated and will be called by the Microsoft  service. The SaaS service is expected to call the operations API to validate and authorize before taking action on the webhook notification. 

*Body*

``` json
  {
    "id": "be750acb-00aa-4a02-86bc-476cbe66d7fa",
    "activityId": "be750acb-00aa-4a02-86bc-476cbe66d7fa",
    "subscriptionId":"cd9c6a3a-7576-49f2-b27e-1e5136e57f45",
    "action": "Subscribe", // Subscribe/Unsubscribe/ChangePlan
    "operationRequestSource":"Azure",
    "timeStamp":"2018-12-01T00:00:00"
  }
```

| **Parameter name**     | **Data type** | **Description**                               |
|------------------------|---------------|-----------------------------------------------|
| id  | String       | Unique ID for the operation triggered.                |
| activityId   | String        | A unique string value for tracking the request from the service. This is used for any reconciliations.               |
| subscriptionId                     | String        | ID of SaaS subscription resource in Azure.    |
| offerId                | String        | Offer ID that the user subscribed to. Provided only with the "Update" action.        |
| publisherId                | String        | Publisher ID of the SaaS offer         |
| planId                 | String        | Plan ID that the user subscribed to. Provided only with the "Update" action.          |
| action                 | String        | The action that is triggering this notification. Possible values - Activate, Delete, Suspend, Reinstate, Update          |
| timeStamp                 | String        | TImestamp value in UTC when this notification was triggered.          |
|  |  |  |


## Next steps

Developers can also programmatically retrieve and manipulation of workloads, offers, and publisher profiles using the [Cloud Partner Portal REST APIs](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-api-overview).
