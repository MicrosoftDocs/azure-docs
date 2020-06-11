---
title: Sample API management policy - Filter on IP Address when using Application Gateway
titleSuffix: Azure API Management
description: Azure API management policy sample - Demonstrates how to filter on request IP address when using an Application Gateway.
services: api-management
documentationcenter: ''
author: jftl6y

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 01/13/2020
ms.author: joscot
ms.custom: fasttrack-new
---

# Filter on request IP Address when using an Application Gateway

This article shows an Azure API management policy sample that demonstrates how filter on the request IP address when the API Management instance is accessed through an Application Gateway or other intermediary. To set or edit a policy code, follow the steps described in [Set or edit a policy](../set-edit-policies.md). To see other examples, see [policy samples](../policy-samples.md).

## Policy

Paste the code into the **inbound** block.

[!code-xml[Main](../../../api-management-policy-samples/examples/Filter on IP Address when using Application Gateway.policy.xml)]

## Next steps

Learn more about APIM policies:

+ [Access restrictions policies](../api-management-access-restriction-policies.md)
+ [Policy samples](../policy-samples.md)
