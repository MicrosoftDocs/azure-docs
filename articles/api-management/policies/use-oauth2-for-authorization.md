---
title: Sample Azure API management policy - Use OAuth2 for authorization between gateway and backend
titleSuffix: Azure API Management
description: Azure API management policy sample - Demonstrates how to use OAuth2 for authorization between the gateway and a backend. It shows how to obtain an access token from Azure AD and forward it to the backend.
services: api-management
documentationcenter: ''
author: dlepow
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 03/14/2023
ms.author: danlep
---

# Use OAuth2 for authorization between the gateway and a backend
 
This article shows an Azure API management policy sample that demonstrates how to use OAuth2 for authorization between the gateway and a backend. It shows how to obtain an access token from Azure Active Directory and forward it to the backend. 

* For a more detailed example policy that not only acquires an access token, but also caches and renews it upon expiration, see [this blog](https://techcommunity.microsoft.com/t5/azure-paas-blog/api-management-policy-for-access-token-acquisition-caching-and/ba-p/2191623).
* API Management [authorizations](../authorizations-overview.md) (preview) can also be used to simplify the process of managing authorization tokens to OAuth 2.0 backend services. 

To set or edit a policy code, follow the steps described in [Set or edit a policy](../set-edit-policies.md). To see other examples, see [policy samples](../policy-reference.md).

The following script uses named values that appear in {{property_name}}. To learn about named values and how to use them in API Management policies, see [this](../api-management-howto-properties.md) topic.
 
## Policy

Paste the code into the **inbound** block.

[!code-xml[Main](../../../api-management-policy-samples/examples/Get OAuth2 access token from AAD and forward it to the backend.policy.xml)]
  
## Next steps

Learn more about APIM policies:

+ [Transformation policies](../api-management-transformation-policies.md)
+ [Policy samples](../policy-reference.md)
