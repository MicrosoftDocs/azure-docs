---
title: Differences from Azure Data Factory
description: Learn how the data integration capabilities of Azure Synapse Analytics differ from those of Azure Data Factory
services: synapse-analytics 
author: kromerm
ms.service: synapse-analytics
ms.subservice: pipeline 
ms.topic: conceptual
ms.date: 02/15/2022
ms.author: makromer
ms.reviewer: sngun
---

# Data integration in Azure Synapse Analytics versus Azure Data Factory

In Azure Synapse Analytics, the data integration capabilities such as Synapse pipelines and data flows are based upon those of Azure Data Factory. For more information, see [what is Azure Data Factory](../../data-factory/introduction.md).


## Available features in ADF & Azure Synapse Analytics

Check below table for features availability:

| Category                 | Feature    |  Azure Data Factory  | Azure Synapse Analytics |
| ------------------------ | ---------- | :------------------: | :---------------------: |
| **Integration Runtime**  | Support for Cross-region Integration Runtime (Data Flows) | ✓ | ✗ |
|                          | Integration Runtime Sharing | ✓<br><small>*Can be shared across different data factories* | ✗ |
| **Pipelines Activities** | Support for Power Query Activity | ✓ | ✗ |
|                          | Support for global parameters | ✓ | ✗ |
| **Template Gallery and Knowledge center** | Solution Templates | ✓<br><small>*Azure Data Factory Template Gallery* | ✓<br><small>*Synapse Workspace Knowledge center* |
| **GIT Repository Integration** | GIT Integration | ✓ | ✓ |
| **Monitoring**           | Monitoring of Spark Jobs for Data Flow | ✗ | ✓<br><small>*Leverage the Synapse Spark pools* |

## Next steps

Get started with data integration in your Synapse workspace by learning how to [ingest data into an Azure Data Lake Storage gen2 account](data-integration-data-lake.md).
