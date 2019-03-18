---
title: Azure API management policy sample - Implement X-CSRF pattern | Microsoft Docs
description: Azure API management policy sample - Demonstrates how to implement X-CSRF pattern used by many APIs. This example is specific to SAP Gateway.
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

# Implement X-CSRF pattern

This article shows an Azure API management policy sample that demonstrates how to implement X-CSRF pattern used by many APIs. This example is specific to SAP Gateway. To set or edit a policy code, follow the steps described in [Set or edit a policy](../set-edit-policies.md). To see other examples, see [policy samples](../policy-samples.md).

## Policy

Paste the code into the **inbound** block.

[!code-xml[Main](../../../api-management-policy-samples/examples/Get X-CSRF token from SAP gateway using send request.policy.xml)]

## Next steps

Learn more about APIM policies:

+ [Transformation policies](../api-management-transformation-policies.md)
+ [Policy samples](../policy-samples.md)

