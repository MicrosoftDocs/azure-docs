---
title: Azure API management policy sample - Authorize request using external authorizer | Microsoft Docs
description: Azure API management policy sample - Demonstrates how authorize requests using external authorizer encapsulating a custom or legacy authentication/authorization logic.
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
ms.date: 06/06/2018
ms.author: apimpm
---

# Authorize requests using external authorizer

This article shows an Azure API management policy sample that demonstrates how to secure API access by using an external authorizer encapsulating custom authentication/authorization logic. To set or edit a policy code, follow the steps described in [Set or edit a policy](../set-edit-policies.md). To see other examples, see [policy samples](../policy-samples.md).

## Policy

Paste the code into the **inbound** block.

[!code-xml[Main](../../../api-management-policy-samples/examples/Authorize requests using external authorizer.policy.xml)]

## Next steps

Learn more about APIM policies:

+ [Access restrictions policies](../api-management-access-restriction-policies.md)
+ [Policy samples](../policy-samples.md)
