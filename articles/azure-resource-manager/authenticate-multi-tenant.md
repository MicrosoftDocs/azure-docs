---
title: Authenticate across tenants - Azure Resource Manager
description: Describes how Azure Resource Manager handles authentication requests across tenants.
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac
ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 12/20/2018
ms.author: tomfitz
---

# Authenticate requests across tenants

When creating a multi-tenant application, you may need to handle authentication requests for resources that are in different tenants. Azure Resource Manager provides a header value for storing auxiliary tokens to authenticate the requests to different tenants.

## Header values for authentication

The request has the following authentication header values:

| Header name | Description | Example value |
| ----------- | ----------- | ------------ |
| Authorization | Primary token | Bearer &lt;primary-token&gt; |
| x-ms-authorization-auxiliary | Auxiliary tokens | Bearer &lt;auxiliary-token1&gt;; EncryptedBearer &lt;auxiliary-token2&gt;; Bearer &lt;auxiliary-token3&gt; |

The auxiliary header can hold up to three auxiliary tokens. 

In the code of your multi-tenant app, get the authentication token for other tenants and store them in the auxiliary headers.

## Processing the request

When your app sends a request to Resource Manager, the request is run under the identity from the primary token. The primary token must be valid and unexpired. This token must be from a tenant that can manage the subscription.

When a request is made to a resource in a different tenant, Resource Manager checks the auxiliary tokens to determine if the request can be processed. All auxiliary tokens in the header must be valid and unexpired. If any token is expired, Resource Manager returns a 401 response code. The response includes the client ID and tenant ID from the token that isn't valid. If the auxiliary header contains a valid token for the tenant, the cross tenant request is processed.

## Next steps
* To learn about sending authentication requests with the Azure Resource Manager APIs, see [Use Resource Manager authentication API to access subscriptions](resource-manager-api-authentication.md).
* For more information about tokens, see [Azure Active Directory access tokens](/azure/active-directory/develop/access-tokens).
