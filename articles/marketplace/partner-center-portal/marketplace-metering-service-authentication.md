---
title: Marketplace metering service authentication strategies | Azure Marketplace
description: Metering service authentication strategies supported in the Azure Marketplace. 
author: qianw211
ms.author: dsindona 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/20/2020
---

# Marketplace metering service authentication strategies

Marketplace metering service supports two authentication strategies, 

* [Azure AD security token](https://docs.microsoft.com/azure/active-directory/develop/access-tokens)
* [managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) 

We will explain when and how to use the different authentication strategies to securely submit custom meters using Marketplace metering service.

## Using the Azure AD security token

Applicable offer types are SaaS and Azure Applications with Managed Application plan type.  

Submit custom meters by using a predefined fixed application ID to authenticate.

For SaaS offers this is the only available option.

For Azure Applications with Managed Application plan, you should consider using this strategy in the following cases:

* You already have a mechanism to communicate with your backend services, and you want to extend this mechanism to emit custom meters from a central service.
* You have complex custom meters logic; in this case, it will make more sense to run this logic in a central location instead of running it on the managed application resources.

Once you have registered your application, you can programmatically request an Azure AD security token. The publisher is expected to use this token and make a request to resolve it.

See [Azure Active Directory access tokens](https://docs.microsoft.com/azure/active-directory/develop/access-tokens) for more information about these tokens.

### Get a token based on the Azure AD app

#### HTTP Method

**POST**

#### *Request URL*

**`https://login.microsoftonline.com/*{tenantId}*/oauth2/token`**

#### *URI parameter*

|  **Parameter name** |  **Required**  |  **Description**          |
|  ------------------ |--------------- | ------------------------  |
|  `tenantId`         |   True         | Tenant ID of the registered AAD application.   |
| | | |

#### *Request header*

|  **Header name**    |  **Required**  |  **Description**          |
|  ------------------ |--------------- | ------------------------  |
|  `Content-Type`     |   True         | Content type associated with the request. The default value is `application/x-www-form-urlencoded`.  |
| | | |

#### *Request body*

|  **Property name**  |  **Required**  |  **Description**          |
|  ------------------ |--------------- | ------------------------  |
|  `Grant_type`       |   True         | Grant type. The default value is `client_credentials`. |
|  `Client_id`        |   True         | Client/app identifier associated with the Azure AD app.|
|  `client_secret`    |   True         | The password associated with the Azure AD app.  |
|  `Resource`         |   True         | Target resource for which the token is requested. The default value is `20e940b3-4c77-4b0b-9a53-9e16a1b010a7`.  |
| | | |

#### *Response*

|  **Name**    |  **Type**  |  **Description**          |
|  ------------------ |--------------- | ----------------------  |
|  `200 OK`     |   `TokenResponse`    | Request succeeded.  |
| | | |

#### *TokenResponse*

Sample response token:

```json
  {
      "token_type": "Bearer",
      "expires_in": "3600",
      "ext_expires_in": "0",
      "expires_on": "15251…",
      "not_before": "15251…",
      "resource": "20e940b3-4c77-4b0b-9a53-9e16a1b010a7",
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImlCakwxUmNxemhpeTRmcHhJeGRacW9oTTJZayIsImtpZCI6ImlCakwxUmNxemhpeTRmcHhJeGRacW9oTTJZayJ9…"
  }
```

## Using the Azure managed identities token

Applicable offer type is Azure Applications with Managed Application plan type.

Using this approach will allow the deployed resources identity to authenticate to send custom meters usage events.  You can embed the code that emits usage within the boundaries of your deployment.

>[!Note]
>Publisher should ensure that the resources that emit usage are locked, so it will not be tampered.

Your managed application can contain different type of resources, from Virtual Machines to Azure Functions.  For more information on how to authenticate using managed identities for different services, see [how to use managed identities for Azure resources](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview#how-can-i-use-managed-identities-for-azure-resources).

For example, this is how to authenticate using a Windows VM,


## Next steps

For more information, see [SaaS metered billing](./saas-metered-billing.md).
