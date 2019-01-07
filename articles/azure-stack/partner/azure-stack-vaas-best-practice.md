---
title: Azure Stack Validation Best Practices. | Microsoft Docs
description: This article has best practices for Validation as a Service.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/26/2018
ms.author: mabrigg
ms.reviewer: John.Haskin

---

# Best practices for Validation as a Service

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

This article covers best practices for managing resources in Validation as a Service (VaaS). For an overview of VaaS resources, see [Validation as a Service key concepts](azure-stack-vaas-key-concepts.md).

## Solution management

### Naming convention for VaaS solutions

Use a consistent naming convention for all solutions registered in VaaS. For example, the solution name can be constructed from the hardware properties below as follows:

|Product Name | Unique Hardware Element 1 | Unique Hardware Element 2 | Solution Name
|---|---|---|---|
My Solution XYZ |  All Flash | My Switch X01 | MySolutionXYZ_AllFlash_MySwitchX01

### When to create a new VaaS solution

Use the same VaaS solution when running workflows against the same hardware SKU. A new VaaS solution should be created only when there is a change to the hardware SKU.

## Workflow management

### Naming convention for VaaS workflows

Use a consistent naming convention for all VaaS workflow runs. For example, the construct a workflow name from the build properties below as follows:

|Build Number (Major) | Date | Solution Size | Workflow Name
|---|---|---| ---|
1808 | 081518 | 4NODE | 1808_081518_4NODE

## Next steps

- Learn about [Validation as a Service key concepts](azure-stack-vaas-key-concepts.md)
