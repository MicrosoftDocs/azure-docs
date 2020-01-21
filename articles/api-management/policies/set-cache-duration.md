---
title: Sample API management policy - Set response cache duration
titleSuffix: Azure API Management
description: Azure API management policy sample - Demonstrates how to set response cache duration using maxAge value in Cache-Control header sent by the backend..
services: api-management
documentationcenter: ''
author: vladvino
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 10/13/2017
ms.author: apimpm
---

# Set response cache duration

This article shows an Azure API management policy sample that demonstrates how to set response cache duration using maxAge value in Cache-Control header sent by the backend. To set or edit a policy code, follow the steps described in [Set or edit a policy](../set-edit-policies.md). To see other examples, see [policy samples](../policy-samples.md).

## Policy

Paste the code into the **inbound** block.

[!code-xml[Main](../../../api-management-policy-samples/examples/Set cache duration using response cache control header.policy.xml)]

## Next steps

Learn more about APIM policies:

+ [Transformation policies](../api-management-transformation-policies.md)
+ [Policy samples](../policy-samples.md)

