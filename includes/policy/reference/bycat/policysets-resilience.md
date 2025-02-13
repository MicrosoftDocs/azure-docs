---
ms.service: azure-policy
ms.topic: include
ms.date: 02/10/2025
ms.author: davidsmatlak
author: davidsmatlak
ms.custom: generated
---

|Name |Description |Policies |Version |
|---|---|---|---|
|[\[Preview\]: Resources should be Zone Resilient](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Resilience/Resources_ZoneResilient.json) |Some resource types can be deployed Zone Redundant (e.g. SQL Databases); some can be deploy Zone Aligned (e.g. Virtual Machines); and some can be deployed either Zone Aligned or Zone Redundant (e.g. Virtual Machine Scale Sets). Being zone aligned does not guarantee resilience, but it is the foundation on which a resilient solution can be built (e.g. three Virtual Machine Scale Sets zone aligned to three different zones in the same region with a load balancer). See [https://aka.ms/AZResilience](https://aka.ms/AZResilience) for more info. |34 |1.10.0-preview |
