---
title: SaaS Fulfillment API V2 | Azure Marketplace 
description: Explains how to create a SaaS offer on the AppSource and Azure Marketplace using the associated fulfillment V2 APIs.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 03/28/2019
ms.author: pabutler
---

# SaaS Fulfillment APIs Version 2 

This article details the API that enables independent software vendors (ISVs) to sell their SaaS applications in the AppSource and Azure Marketplace. This API is a requirement for transactable SaaS offers on the AppSource and Azure Marketplace.

> [!IMPORTANT] 
> SaaS offer functionality has been migrated to the [Microsoft Partner Center](https://partner.microsoft.com/dashboard/directory).  All new publishers must 
> use Partner Center for creating new SaaS offers and managing existing offers.  Current publishers with SaaS offers are being batchwise migrated from the 
> Cloud Partner Portal to the Partner Center.  The Cloud Partner Portal will display status messages to indicate when specific existing offers have been migrated.
> For more information, see [Create a new SaaS offer](../../partner-center-portal/create-new-saas-offer.md).

## Managing the SaaS subscription lifecycle

Microsoft SaaS Service manages the entire lifecycle of a SaaS subscription purchase and uses the fulfillment API as a mechanism to drive the actual fulfillment, changes to plans, and deletion of the subscription with the ISV. The customer is billed based on the state of the SaaS subscription that Microsoft maintains. The following diagram depicts the states and the operations that drive the changes between states.

![SaaS subscription lifecycle states](./media/saas-subscription-lifecycle-api-v2.png)


### States of a SaaS subscription

The following table lists the provisioning states for a SaaS subscription, including a description and sequence diagram for each (if applicable). 

#### Provisioning

When a customer initiates a purchase, the ISV receives this information in an Auth Code on a customer interactive web page using a URL parameter. For example: `https://contoso.com/signup?token=..`, where the landing page URL provider in partner center is `https://contoso.com/signup`. The Auth code can be validated and exchanged for the details of what needs to be provisioned by calling the Resolve API.  When the SaaS service finishes provisioning, it sends an activate call to signal that the fulfillment is complete and the customer can be billed.  The following diagram shows the sequence of API calls for a provisioning scenario.  

![API calls for provisioning a SaaS service.](./media/saas-post-provisioning-api-v2-calls.png)

#### Provisioned

This state is the steady state of a provisioned service.

#### Provisioning for update
(from marketplace) 

This state represents an update to an existing service is pending. Such an update can be initiated by the customer either on the marketplace, or on the SaaS service (only for direct to customer transactions.) The following diagram shows the actions when an update is initiated from the marketplace.

![API calls when update is initiated from marketplace.](./media/saas-update-api-v2-calls-from-marketplace-a.png)

#### Provisioning for update  
(from SaaS service) 

The following diagram shows the actions when an update is initiated by SaaS service. (The webhook call is replaced by an update to the subscription initiated by the SaaS Service. 

![API calls when update is initiated by SaaS service.](./media/saas-update-api-v2-calls-from-saas-service-a.png) 

#### Suspended

This state indicates that a customer’s payment hasn't  been received. By policy, we will provide the customer a grace period before unfulfilling the subscription. When a subscription is in this state: 

- As an ISV, you may choose to degrade or block the user’s access to the service. 
- The subscription must be kept in a recoverable state that can restore full functionality without any loss of data or settings. 
- You can expect to get a reinstate request for this subscription via the fulfillment API, or a de-provisioning request at the end of the grace period. 

#### Unsubscribed 

Subscriptions reach this state in response to an explicit customer request or as a response to non-payment of dues. The expectation from the ISV is that the customer’s data is retained for recovery on request for a minimum of X days and then deleted. 


## API reference

This section documents the SaaS *Subscription API* and *Operations API*.  The value of the `api-version` parameter for version 2 APIs is `2018-08-31`.  


### Parameter and entity definitions

The following table lists the definitions for common parameters and entities used by Fulfillment APIs.

|     Entity/Parameter     |     Definition                         |
|     ----------------     |     ----------                         |
| `subscriptionId`         | GUID identifier for a SaaS resource  |
| `name`                   | Friendly name provided for this resource by the customer |
| `publisherId`            | Unique string identifier for each publisher, for example "contoso" |
| `offerId`                | Unique string identifier for each offer, for example "offer1"  |
| `planId`                 | Unique string identifier for each plan/sku, for example "silver" |
| `operationId`            | GUID identifier for a particular operation  |
|  `action`                | The action being performed on a resource, either `subscribe`, `unsubscribe`, `suspend`,  `reinstate`, or `changePlan`, `changeQuantity`, `transfer`  |
|   |   |

Globally unique identifiers ([GUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier)) are 128-bit (32 hexadecimal) numbers that are typically automatically generated. 

#### Resolve a subscription 

The resolve endpoint enables the publisher to resolve a marketplace token to a persistent Resource ID. The Resource ID is the unique identifier for SAAS subscription.  When a user is redirected to an ISV’s website, the URL contains a token in the query parameters. The ISV is expected to use this token, and make a request to resolve it. The response contains the unique SAAS subscription ID, name, offer ID, and plan for the resource. This token is valid for an hour only. 

**Post:<br>`https://marketplaceapi.microsoft.com/api/saas/subscriptions/resolve?api-version=<ApiVersion>`**

*Query parameters:*

|                    |                   |
|  ---------------   |  ---------------  |
|  ApiVersion        |  Version of the operation to use for this request  |

*Request headers:*
 
|                    |                   |
|  ---------------   |  ---------------  |
|  Content-Type      | `application/json` |
|  x-ms-requestid    |  Unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers. |
|  x-ms-correlationid |  Unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value is not provided, one will be generated and provided in the response headers.  |
|  authorization     |  [Get JSON web token (JWT) bearer token](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-registration#get-a-token-based-on-the-azure-ad-app) |
|  x-ms-marketplace-token  |  Token query parameter in the URL when the user is redirected to the SaaS ISV’s website from Azure (For eg: `https://contoso.com/signup?token=..`). *Note:* The URL decodes the token value from the browser before using it.  |

*Response codes:*

Code: 200<br>
Resolves the opaque token to a SaaS subscription.<br>

```json
Response body:
{
    "subscriptionId": "<guid>",  
    "subscriptionName": "Contoso Cloud Solution",
    "offerId": "offer1",
    "planId": "silver",
    "quantity": "20" 
}
```

Code: 404<br>
Not Found

Code: 400<br>
Bad request. x-ms-marketplace-token is missing, malformed or expired.

Code: 403<br>
Unauthorized. The auth token wasn't provided, is invalid, or the request is attempting to access an acquisition that doesn’t belong to the current publisher.

Code: 500<br>
Internal Server Error

```json
{
    "error": {
      "code": "UnexpectedError",
      "message": "An unexpected error has occurred."
    }
}
```

### Subscription API

The subscription API supports the following HTTPS operations: **Get**, **Post**, **Patch**, and **Delete**.


#### List subscriptions

Lists all the SaaS subscriptions for a publisher.

**Get:<br>`https://marketplaceapi.microsoft.com/api/saas/subscriptions?api-version=<ApiVersion>`**

*Query parameters:*

|             |                   |
|  --------   |  ---------------  |
| ApiVersion  |  The version of the operation to use for this request.  |

*Request headers:*

|                    |                   |
|  ---------------   |  ---------------  |
| Content-Type       |  `application/json`  |
| x-ms-requestid     |  Unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers. |
| x-ms-correlationid |  Unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers.  |
| authorization      |  [Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-registration#get-a-token-based-on-the-azure-ad-app)  |

*Response codes:*

Code: 200 <br/>
Based on the auth token, get the publisher and corresponding subscriptions for all the publisher's offers.<br> 
Response payload:<br>

```json
{
  [
      {
          "id": "<guid>",
          "name": "Contoso Cloud Solution",
          "publisherId": "contoso",
          "offerId": "offer1",
          "planId": "silver",
          "quantity": "10",
          "beneficiary": { // Tenant for which SaaS subscription is purchased.
              "tenantId": "<guid>"
          },
          "purchaser": { // Tenant that purchased the SaaS subscription. These could be different for reseller scenario
              "tenantId": "<guid>"
          },
          "allowedCustomerOperations": [
              "Read" // Possible Values: Read, Update, Delete.
          ], // Indicates operations allowed on the SaaS subscription. For CSP initiated purchases, this will always be Read.
          "sessionMode": "None", // Possible Values: None, DryRun (Dry Run indicates all transactions run as Test-Mode in the commerce stack)
          "saasSubscriptionStatus": "Subscribed" // Indicates the status of the operation. [Provisioning, Subscribed, Suspended, Unsubscribed]
      }
  ],
  "continuationToken": ""
}
```

The continuation token will only be present if there are additional "pages" of plans to retrieve. 

Code: 403 <br>
Unauthorized. The auth token wasn't provided, is invalid, or the request is attempting to access an acquisition that doesn’t belong to the current publisher. 

Code: 500
Internal Server Error

```json
{
    "error": {
      "code": "UnexpectedError",
      "message": "An unexpected error has occurred."
    }
}
```

#### Get subscription

Gets the specified SaaS subscription. Use this call to get license information and plan information.

**Get:<br> `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId?api-version=<ApiVersion>`**

*Query parameters:*

|                    |                   |
|  ---------------   |  ---------------  |
| subscriptionId     |   Unique identifier of SaaS subscription that's obtained after resolving the token via Resolve API   |
|  ApiVersion        |   Version of the operation to use for this request   |

*Request headers:*

|                    |                   |
|  ---------------   |  ---------------  |
|  Content-Type      |  `application/json`  |
|  x-ms-requestid    |  Unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers. |
|  x-ms-correlationid |  Unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers.  |
|  authorization     |  [Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-registration#get-a-token-based-on-the-azure-ad-app)  |

*Response codes:*

Code: 200<br>
Gets SaaS subscription from identifier<br> 
Response payload:<br>

```json
Response Body:
{ 
        "id":"",
        "name":"Contoso Cloud Solution",
        "publisherId": "contoso",
        "offerId": "offer1",
        "planId": "silver",
        "quantity": "10",
          "beneficiary": { // Tenant for which SaaS subscription is purchased.
              "tenantId": "<guid>"
          },
          "purchaser": { // Tenant that purchased the SaaS subscription. These could be different for reseller scenario
              "tenantId": "<guid>"
          },
        "allowedCustomerOperations": ["Read"], // Indicates operations allowed on the SaaS subscription. For CSP initiated purchases, this will always be Read.
        "sessionMode": "None", // Dry Run indicates all transactions run as Test-Mode in the commerce stack
        "status": "Subscribed", // Indicates the status of the operation.
}
```

Code: 404<br>
Not Found<br> 

Code: 403<br>
Unauthorized. The auth token wasn't provided, is invalid, or the request is attempting to access an acquisition that doesn’t belong to the current publisher.

Code: 500<br>
Internal Server Error<br>

```json
{
    "error": {
      "code": "UnexpectedError",
      "message": "An unexpected error has occurred."
    }  
```

#### List available plans

Use this call to find out if there are any private/public offers for the current publisher.

**Get:<br> `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/listAvailablePlans?api-version=<ApiVersion>`**

*Query parameters:*

|                    |                   |
|  ---------------   |  ---------------  |
|  ApiVersion        |   Version of the operation to use for this request  |

*Request headers:*

|                    |                   |
|  ---------------   |  ---------------  |
|   Content-Type     |  `application/json` |
|   x-ms-requestid   |   Unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers. |
|  x-ms-correlationid  | Unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value is not provided, one will be generated and provided in the response headers. |
|  authorization     |  [Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-registration#get-a-token-based-on-the-azure-ad-app) |

*Response codes:*

Code: 200<br>
Get a list of available plans for a customer.<br>

Response Body:

```json
{
    "plans": [{
        "planId": "Platinum001",
        "displayName": "Private platinum plan for Contoso",
        "isPrivate": true
    }]
}
```

Code: 404<br>
Not Found<br> 

Code: 403<br>
Unauthorized. The auth token wasn't provided, is invalid, or the request is attempting to access an acquisition that doesn’t belong to the current publisher. <br> 

Code: 500<br>
Internal Server Error<br>

```json
{ 
    "error": { 
      "code": "UnexpectedError", 
      "message": "An unexpected error has occurred." 
    } 
```

#### Activate a subscription

**Post:<br> `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/activate?api-version=<ApiVersion>`**

*Query parameters:*

|                    |                   |
|  ---------------   |  ---------------  |
|  ApiVersion        |  Version of the operation to use for this request  |
| subscriptionId     | Unique identifier of the SaaS subscription that's obtained after resolving the token using the Resolve API  |

*Request headers:*
 
|                    |                   |
|  ---------------   |  ---------------  |
|  Content-Type      | `application/json`  |
|  x-ms-requestid    | Unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers.  |
|  x-ms-correlationid  | Unique string value for operation on the client. This string correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers.  |
|  authorization     |  [Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-registration#get-a-token-based-on-the-azure-ad-app) |

*Request:*

```json
{
    "planId": "gold",
    "quantity": ""
}
```

*Response codes:*

Code: 200<br>
Activates the subscription.<br>

Code: 404<br>
Not Found

Code: 400<br>
Bad request- Validation failures

Code: 403<br>
Unauthorized. The auth token wasn't provided, is invalid, or the request is attempting to access an acquisition that doesn’t belong to the current publisher.

Code: 500<br>
Internal Server Error

```json
{
    "error": {
      "code": "UnexpectedError",
      "message": "An unexpected error has occurred."
    }
}
```

#### Change the plan on the subscription

Update the plan on the subscription.

**Patch:<br> `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>?api-version=<ApiVersion>`**

*Query parameters:*

|                    |                   |
|  ---------------   |  ---------------  |
|  ApiVersion        |  The version of the operation to use for this request.  |
| subscriptionId     | Unique identifier of the SaaS subscription that's obtained after resolving the token using the Resolve API.  |

*Request headers:*

|                    |                   |
|  ---------------   |  ---------------  |
|  Content-Type      | `application/json` |
|  x-ms-requestid    |   A unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers.  |
|  x-ms-correlationid  |  A unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers.    |
| authorization      |  [Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-registration#get-a-token-based-on-the-azure-ad-app)  |

*Request payload:*

```json
Request Body:
{
    "planId": "gold"
}
```

*Request headers:*

|                    |                   |
|  ---------------   |  ---------------  |
| Operation-Location | Link to a resource to get the operation's status.   |

*Response codes:*

Code: 202<br>
The request to change plan has been accepted. The ISV is expected to poll the Operation-Location to determine a success/failure. <br>

Code: 404<br>
Not Found

Code: 400<br>
Bad request- Validation failures.

>[!Note]
>Only a plan or quantity can be patched at one time, not both. Edits on a subscription with **Update** isn't  in `allowedCustomerOperations`.

Code: 403<br>
Unauthorized. The auth token wasn't provided, is invalid, or the request is attempting to access an acquisition that doesn’t belong to the current publisher.

Code: 500<br>
Internal Server Error

```json
{
    "error": {
      "code": "UnexpectedError",
      "message": "An unexpected error has occurred."
    }
}
```

#### Change the quantity on the subscription

Update the quantity on the subscription.

**Patch:<br> `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>?api-version=<ApiVersion>`**

*Query parameters:*

|                    |                   |
|  ---------------   |  ---------------  |
|  ApiVersion        |  The version of the operation to use for this request.  |
| subscriptionId     | Unique identifier of the SaaS subscription that's obtained after resolving the token using the Resolve API.  |

*Request headers:*

|                    |                   |
|  ---------------   |  ---------------  |
|  Content-Type      | `application/json` |
|  x-ms-requestid    |   A unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers.  |
|  x-ms-correlationid  |  A unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers.    |
| authorization      |  [Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-registration#get-a-token-based-on-the-azure-ad-app)  |

*Request payload:*

```json
Request Body:
{
    "quantity": 5
}
```

*Request headers:*

|                    |                   |
|  ---------------   |  ---------------  |
| Operation-Location | Link to a resource to get the operation's status.   |

*Response codes:*

Code: 202<br>
Accepted. The request to change quantity has been accepted. The ISV is expected to poll the Operation-Location to determine a success/failure. <br>

Code: 404<br>
Not Found

Code: 400<br>
Bad request- Validation failures.

>[!Note]
>Only a plan or quantity can be patched at one time, not both. Edits on a subscription with **Update** isn't  in `allowedCustomerOperations`.

Code: 403<br>
Unauthorized. The auth token wasn't provided, is invalid, or the request is attempting to access an acquisition that doesn’t belong to the current publisher.

Code: 500<br>
Internal Server Error

```json
{
    "error": {
      "code": "UnexpectedError",
      "message": "An unexpected error has occurred."
    }
}
```

#### Delete a subscription

Unsubscribe and delete the specified subscription.

**Delete:<br> `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId> ?api-version=<ApiVersion>`**

*Query parameters:*

|                    |                   |
|  ---------------   |  ---------------  |
|  ApiVersion        |  The version of the operation to use for this request.  |
| subscriptionId     | Unique identifier of the SaaS subscription that's obtained after resolving the token using the Resolve API.  |

*Request headers:*
 
|                    |                   |
|  ---------------   |  ---------------  |
|   Content-Type     |  `application/json` |
|  x-ms-requestid    |   A unique string value for tracking the request from the client, preferably a GUID. If this value isn't provided, one will be generated and provided in the response headers.   |
|  x-ms-correlationid  |  A unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers.   |
|  authorization     |  [Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-registration#get-a-token-based-on-the-azure-ad-app)  |

*Response codes:*

Code: 202<br>
ISV initiated call to indicate unsubscribe on a SaaS subscription.<br>

Code: 404<br>
Not Found

Code: 400<br>
Delete on a subscription with **Delete** not in `allowedCustomerOperations`.

Code: 403<br>
Unauthorized. The auth token wasn't provided, is invalid, or the request is attempting to access an acquisition that doesn’t belong to the current publisher.

Code: 500<br>
Internal Server Error

```json
{
    "error": {
      "code": "UnexpectedError",
      "message": "An unexpected error has occurred."
    }
}
```


### Operations API

The operations API supports the following Patch and Get operations.

#### List outstanding operations 

Lists the outstanding operations for the current publisher. 

**Get:<br> `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/operations?api-version=<ApiVersion>`**

*Query parameters:*

|             |        |
|  ---------------   |  ---------------  |
|    ApiVersion                |   The version of the operation to use for this request.                |
| subscriptionId     | Unique identifier of the SaaS subscription that's obtained after resolving the token using the Resolve API.  |

*Request headers:*
 
|                    |                   |
|  ---------------   |  ---------------  |
|   Content-Type     |  `application/json` |
|  x-ms-requestid    |  A unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers.  |
|  x-ms-correlationid |  A unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers.  |
|  authorization     |  [Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-registration#get-a-token-based-on-the-azure-ad-app)  |

*Response codes:*

Code: 200<br> 
Gets the list of pending operations on a subscription.<br>
Response payload:

```json
[{
    "id": "<guid>",  
    "activityId": "<guid>",
    "subscriptionId": "<guid>",
    "offerId": "offer1",
    "publisherId": "contoso",  
    "planId": "silver",
    "quantity": "20",
    "action": "Convert",
    "timeStamp": "2018-12-01T00:00:00",  
    "status": "NotStarted"  
}]
```

Code: 404<br>
Not Found

Code: 400<br>
Bad request- Validation failures

Code: 403<br>
Unauthorized. The auth token wasn't provided, is invalid, or the request is attempting to access an acquisition that doesn’t belong to the current publisher.

Code: 500<br>
Internal Server Error

```json
{
    "error": {
      "code": "UnexpectedError",
      "message": "An unexpected error has occurred."
    }
}

```

#### Get operation status

Enables the publisher to track the status of the specified triggered async operation (Subscribe / Unsubscribe / Change plan/ Change Quantity).

**Get:<br> `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/operations/<operationId>?api-version=<ApiVersion>`**

*Query parameters:*

|                    |                   |
|  ---------------   |  ---------------  |
|  ApiVersion        |  The version of the operation to use for this request.  |

*Request headers:*

|                    |                   |
|  ---------------   |  ---------------  |
|  Content-Type      |  `application/json`   |
|  x-ms-requestid    |   A unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers.  |
|  x-ms-correlationid |  A unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers.  |
|  authorization     |[Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-registration#get-a-token-based-on-the-azure-ad-app)  |

*Response codes:*
Code: 200<br> 
Gets the specified pending SaaS operation<br>
Response payload:

```json
Response body:
{
    "id  ": "<guid>",
    "activityId": "<guid>",
    "subscriptionId":"<guid>",
    "offerId": "offer1",
    "publisherId": "contoso",  
    "planId": "silver",
    "quantity": "20",
    "action": "Convert",
    "timeStamp": "2018-12-01T00:00:00",
    "status": "NotStarted"
}

```

Code: 404<br>
Not Found

Code: 400<br>
Bad request- Validation failures

Code: 403<br>
Unauthorized. The auth token wasn't provided, is invalid, or the request is attempting to access an acquisition that doesn’t belong to the current publisher.
 
Code: 500<br> 
Internal Server Error

```json
{
    "error": {
      "code": "UnexpectedError",
      "message": "An unexpected error has occurred."
    }
}

```
#### Update the status of an operation

Update the status of an operation to indicate success/failure with the provided values.

**Patch:<br> `https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/operations/<operationId>?api-version=<ApiVersion>`**

*Query parameters:*

|                    |                   |
|  ---------------   |  ---------------  |
|   ApiVersion       |  The version of the operation to use for this request.  |
| subscriptionId     | Unique identifier of the SaaS subscription that's obtained after resolving the token using the Resolve API.  |
|  operationId       | The operation that's being completed. |

*Request headers:*

|                    |                   |
|  ---------------   |  ---------------  |
|   Content-Type     | `application/json`   |
|   x-ms-requestid   |   A unique string value for tracking the request from the client, preferably a GUID. If this value is not provided, one will be generated and provided in the response headers. |
|  x-ms-correlationid |  A unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers. |
|  authorization     |  [Get JSON web token (JWT) bearer token.](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/saas-app/cpp-saas-registration#get-a-token-based-on-the-azure-ad-app)  |

*Request payload:*

```json
{
    "planId": "offer1",
    "quantity": "44",
    "status": "Success"    // Allowed Values: Success/Failure. Indicates the status of the operation.
}

```

*Response codes:*

Code: 200<br> 
Call to inform of completion of an operation on the ISV side. For example, this response could signal the change of seats/plans.

Code: 404<br>
Not Found

Code: 400<br>
Bad request- Validation failures

Code: 403<br>
Unauthorized. The auth token wasn't provided, is invalid, or the request is attempting to access an acquisition that doesn’t belong to the current publisher.

Code: 409<br>
Conflict. For example, a newer transaction is already fulfilled

Code: 500<br> 
Internal Server Error

```json
{
    "error": {
      "code": "UnexpectedError",
      "message": "An unexpected error has occurred."
    }
}

```

## Webhook on the SaaS service

The publisher must implement a webhook in this SaaS service to proactively notify users of changes in its service. The API is expected to be unauthenticated and will be called by the Microsoft SaaS service. The SaaS service is expected to call the operations API to validate and authorize before taking an action on the webhook notification.

```json
{
    "operationId": "<guid>",
    "activityId": "<guid>",
    "subscriptionId":"<guid>",
    "offerId": "offer1",
    "publisherId": "contoso",
    "planId": "silver",
    "quantity": "20"  ,
    "action": "Subscribe",
    "timeStamp": "2018-12-01T00:00:00"
}
```

Where action can be one of these: 
- `Subscribe`  (When the resource has been activated)
- `Unsubscribe` (When the resource has been deleted)
- `ChangePlan` (When the change plan operation has completed)
- `ChangeQuantity` (When the change quantity operation has completed)
- `Suspend` (When the resource has been suspended)
- `Reinstate` (When resource has been reinstated after suspension)


## Mock API

You can use our mock APIs to help you get started with development, particularly prototyping, and testing projects. 

Host Endpoint: `https://marketplaceapi.microsoft.com/api` <br/>
API Version: `2018-09-15` <br/>
No authentication required <br/>
Sample Uri: `https://marketplaceapi.microsoft.com/api/saas/subscriptions?api-version=2018-09-15` <br/>

The API endpoint paths are the same across both Mock and Real APIs, but the API versions are different. The version is 2018-09-15 for Mock and 2018-08-31 for the production version. 

Any of the API calls in this article can be made to the mock host endpoint. You can expect to get mock data back as a response. In general, you can expect to get mock data back as a response. Calls to the update subscription methods on the mock API always return 500. 

## Next steps

Developers can also programmatically retrieve and manipulation of workloads, offers, and publisher profiles using the [Cloud Partner Portal REST APIs](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-api-overview).
