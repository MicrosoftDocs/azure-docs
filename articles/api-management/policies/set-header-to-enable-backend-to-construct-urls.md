---
title: Azure API management policy sample - Add a Forwarded header  | Microsoft Docs
description: Azure API management policy sample - Demonstrates how to add a Forwarded header in the inbound request to allow the backend API to construct proper URLs.
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

# Add a Forwarded header

This article shows an Azure API management policy sample that demonstrates how to add a Forwarded header in the inbound request to allow the backend API to construct proper URLs. To set or edit a policy code, follow the steps described in [Set or edit a policy](../set-edit-policies.md). To see other examples, see [policy samples](../policy-samples.md).

## Code

Paste the code into the **inbound** block.

[!code-xml[Main](../../../api-management-policy-samples/examples/Forward gateway hostname to backend for generating correct urls in responses.policy.xml)]

## Next steps

Learn more about APIM policies:

+ [Transformation policies](../api-management-transformation-policies.md)
+ [Policy samples](../policy-samples.md)
