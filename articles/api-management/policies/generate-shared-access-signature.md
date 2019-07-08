---
title: Azure API management policy sample - Generate Shared Access Signature  | Microsoft Docs
description: Azure API management policy sample - Demonstrates how to generate Shared Access Signature using expressions and forward the request to Azure storage with rewrite-uri policy..
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

# Generate Shared Access Signature

This article shows an Azure API management policy sample that demonstrates how to generate [Shared Access Signature](https://docs.microsoft.com/azure/storage/storage-dotnet-shared-access-signature-part-1) using expressions and forward the request to Azure storage with rewrite-uri policy. To set or edit a policy code, follow the steps described in [Set or edit a policy](../set-edit-policies.md). To see other examples, see [policy samples](../policy-samples.md).

## Policy

Paste the code into the **inbound** block.

[!code-xml[Main](../../../api-management-policy-samples/examples/Generate Shared Access Signature and forward request to Azure storage.policy.xml)]

## Next steps

Learn more about APIM policies:

+ [Transformation policies](../api-management-transformation-policies.md)
+ [Policy samples](../policy-samples.md)

