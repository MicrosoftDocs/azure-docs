---
title:  Disaster recovery
titleSuffix: Azure Cognitive Search
description: Adjust partition and replica computer resources in Azure Cognitive Search, where each resource is priced in billable search units.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/15/2021
---

# Disaster recovery an Azure Cognitive Search service

## Disaster recovery

Currently, there is no built-in mechanism for disaster recovery. Adding partitions or replicas would be the wrong strategy for meeting disaster recovery objectives. The most common approach is to add redundancy at the service level by setting up a second search service in another region. As with availability during an index rebuild, the redirection or failover logic must come from your code.