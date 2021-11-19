---
title: Memory optimized compute type
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about the memory optimized compute type setting in Azure Data Factory and Azure Synapse.
ms.author: jburchel
author: jonburchel
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.custom: synapse
ms.date: 11/12/2021
---

# Memory optimized compute type in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Data flow activities in Azure Data Factory and Azure Synapse support the **Compute type** setting to help optimize the cluster configuration for cost and performance of the workload.  General purpose clusters are the default selection and will be ideal for most data flow workloads. These tend to be the best balance of performance and cost.  However, memory optimized compute can significantly improve performance in some scenarios by maximizing the memory available per core for the cluster.

If your data flow has many joins and lookups, you may want to use a memory optimized cluster. They can store more data in memory and will minimize any out-of-memory errors you may get. Memory optimized have the highest price-point per core, but also tend to result in more successful pipelines. If you experience any out of memory errors when executing data flows, switch to a memory optimized Azure IR configuration.