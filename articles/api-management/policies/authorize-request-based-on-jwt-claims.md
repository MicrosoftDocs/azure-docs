---
title: Sample API management policy - Authorize access based on JWT claims
titleSuffix: Azure API Management
description: Azure API management policy sample - Demonstrates how to authorize access to specific HTTP methods on an API based on JWT claims.
services: api-management
documentationcenter: ''
author: dlepow
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 10/13/2017
ms.author: danlep
---

# Authorize access based on JWT claims

This article shows an Azure API management policy sample that demonstrates how to authorize access to specific HTTP methods on an API based on JWT claims. To set or edit a policy code, follow the steps described in [Set or edit a policy](../set-edit-policies.md). To see other examples, see [policy samples](index.md).

## Policy

Paste the code into the **inbound** block.

[!code-xml[Main](../../../api-management-policy-samples/examples/Pre-authorize requests based on HTTP method with validate-jwt.policy.xml)]

## Next steps

Learn more about APIM policies:

+ [Transformation policies](../api-management-transformation-policies.md)
+ [Policy samples](../policy-reference.md)
