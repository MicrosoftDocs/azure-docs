---
title: Memory optimized compute type for Data Flows
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about the memory optimized compute type setting in Azure Data Factory and Azure Synapse.
ms.author: jburchel
author: jonburchel
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.custom: synapse
ms.date: 01/18/2023
---

# Memory optimized compute type for Data Flows in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Data flow activities in Azure Data Factory and Azure Synapse support the [Compute type setting](control-flow-execute-data-flow-activity.md#type-properties) to help optimize the cluster configuration for cost and performance of the workload.  The default selection for the setting is **General** and will be sufficient for most data flow workloads. General purpose clusters typically provide the best balance of performance and cost.  However, the **Memory optimized** setting can significantly improve performance in some scenarios by maximizing the memory available per core for the cluster.

## When to use the memory optimized compute type

If your data flow has many joins and lookups, you may want to use a memory optimized cluster. These more memory intensive operations will benefit particularly by additional memory, and any out-of-memory errors encountered with the default compute type will be minimized. **Memory optimized** clusters do incur the highest cost per core, but may avoid pipeline failures for memory intensive operations. If you experience any out of memory errors when executing data flows, switch to a memory optimized Azure IR configuration.

## Next steps

[Data Flow type properties](control-flow-execute-data-flow-activity.md#type-properties)
