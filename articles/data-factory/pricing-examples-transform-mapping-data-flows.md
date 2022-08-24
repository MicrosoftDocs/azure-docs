---
title: "Pricing example: Transform data in blob store with mapping data flows"
description: This article shows how to estimate pricing for Azure Data Factory to transform data in a blob store with mapping data flows.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/24/2022
---

# Pricing example: Transform data in blob store with mapping data flows

In this scenario, you want to transform data in Blob Store visually in ADF mapping data flows on an hourly schedule for 30 days.

## Configuration

To accomplish the scenario, you need to create a pipeline with the following items:

1. A Data Flow activity with the transformation logic.
1. An input dataset for the data on Azure Storage.
1. An output dataset for the data on Azure Storage.
1. A schedule trigger to execute the pipeline every hour.

## Costs estimation

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 2 Activity runs per execution (1 for trigger run, 1 for activity runs) |
| Data Flow Assumptions: execution time per run = 10 min + 10 min TTL | 10 \* 16 cores of General Compute with TTL of 10 |

## Pricing calculator example

**Total scenario pricing for 30 days: $1051.28**

:::image type="content" source="media/pricing-concepts/scenario-4a-pricing-calculator.png" alt-text="Screenshot of the orchestration section of the pricing calculator configured to transform data in a blob store with mapping data flows.":::

:::image type="content" source="media/pricing-concepts/scenario-4-pricing-calculator.png" alt-text="Screenshot of the data flow section of the pricing calculator configured to transform data in a blob store with mapping data flows.":::

## Next Steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)