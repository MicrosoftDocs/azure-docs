---
title: "Pricing example: Copy data from AWS S3 to Azure Blob storage hourly"
description: This article shows how to estimate pricing for Azure Data Factory to copy data from AWS S3 to Azure Blob storage every hour for 30 days.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/24/2022
---

# Pricing example: Copy data from AWS S3 to Azure Blob storage hourly

In this scenario, you want to copy data from AWS S3 to Azure Blob storage on an hourly schedule.

## Configuration

To accomplish the scenario, you need to create a pipeline with the following items:

1. A copy activity with an input dataset for the data to be copied from AWS S3.

2. An output dataset for the data on Azure Storage.

3. A schedule trigger to execute the pipeline every hour.

   :::image type="content" source="media/pricing-concepts/scenario1.png" alt-text="Diagram shows a pipeline with a schedule trigger. In the pipeline, copy activity flows to an input dataset, which flows to an A W S S3 linked service and copy activity also flows to an output dataset, which flows to an Azure Storage linked service.":::

## Costs estimation

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 2 Activity runs per execution (1 for trigger run, 1 for activity runs) |
| Copy Data Assumption: execution time per run = 10 min | 10 \* 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |

## Pricing calculator example

**Total scenario pricing for 30 days: $122.00**

:::image type="content" source="media/pricing-concepts/scenario-1-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for an hourly pipeline run.":::

## Next Steps

- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)