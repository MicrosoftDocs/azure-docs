---
title: Azure API management policy sample - Use OAuth2 for authorization between the gateway and a backend | Microsoft Docs
description: Azure API management policy sample - Demonstrates how to use OAuth2 for authorization between the gateway and a backend. It shows how to obtain an access token from AAD and forward it to the backend.
services: api-management
documentationcenter: ''
author: vladvino
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/13/2017
ms.author: apimpm
---

# Use OAuth2 for authorization between the gateway and a backend

This article shows an Azure API management policy sample that demonstrates how to use OAuth2 for authorization between the gateway and a backend. It shows how to obtain an access token from AAD and forward it to the backend. 

To set or edit a policy code, follow the steps described in [Set or edit a policy](../set-edit-policies.md). To see other examples, see [policy samples](../policy-samples.md).

The following script uses properties that appear in {{property}}. To learn about properties and how to use them in API Management policies, see [this](../api-management-howto-properties.md) topic.
 
## Policy

Paste the code into the **inbound** block.

[!code-xml[Main](../../../api-management-policy-samples/examples/Get OAuth2 access token from AAD and forward it to the backend.policy.xml)]
  
## Next steps

Learn more about APIM policies:

+ [Transformation policies](../api-management-transformation-policies.md)
+ [Policy samples](../policy-samples.md)

