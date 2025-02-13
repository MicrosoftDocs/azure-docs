---
title: Differences from Azure Data Factory
description: Learn how the data integration capabilities of Azure Synapse Analytics differ from those of Azure Data Factory
author: kromerm
ms.service: azure-synapse-analytics
ms.subservice: pipeline 
ms.topic: concept-article
ms.date: 12/11/2024
ms.author: makromer
ms.reviewer: whhender
---

# Data integration in Azure Synapse Analytics versus Azure Data Factory

In Azure Synapse Analytics, the data integration capabilities such as Synapse pipelines and data flows are based upon those of Azure Data Factory. For more information, see [what is Azure Data Factory](../../data-factory/introduction.md).

Check below table for features availability:

| Category                 | Feature    |  Azure Data Factory  | Azure Synapse Analytics |
| ------------------------ | ---------- | :------------------: | :---------------------: |
| **Integration Runtime**  | Support for Cross-region Integration Runtime (Data Flows) | ✓ | ✗ |
|                          | Integration Runtime Sharing | ✓ *Can be shared across different data factories* | ✗ |
| **Pipelines Activities** | Support for Power Query Activity | ✓ | ✗ |
|                          | Support for global parameters | ✓ | ✗ |
| **Template Gallery and Knowledge center** | Solution Templates | ✓ *Azure Data Factory Template Gallery* | ✓ *Synapse Workspace Knowledge center* |
| **GIT Repository Integration** | GIT Integration | ✓ | ✓ |
| **Monitoring**           | Monitoring of Spark Jobs for Data Flow | ✗ | ✓ *Use the Synapse Spark pools* |

Get started with data integration in your Synapse workspace by learning how to [ingest data into an Azure Data Lake Storage gen2 account](data-integration-data-lake.md).
