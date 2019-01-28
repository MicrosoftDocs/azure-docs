---
title: Azure API management policy sample - Send errors to Stackify for logging | Microsoft Docs
description: Azure API management policy sample - Demonstrates how to add an error logging policy to send errors to Stackify for logging..
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

# Send errors to Stackify for logging

This article shows an Azure API management policy sample that demonstrates how to add an error logging policy to send errors to Stackify for logging. To set or edit a policy code, follow the steps described in [Set or edit a policy](../set-edit-policies.md). To see other examples, see [policy samples](../policy-samples.md).

## Policy

Paste the code into the **on-error** block.

[!code-xml[Main](../../../api-management-policy-samples/examples/Log errors to Stackify.policy.xml)]

## Next steps

Learn more about APIM policies:

+ [Transformation policies](../api-management-transformation-policies.md)
+ [Policy samples](../policy-samples.md)

