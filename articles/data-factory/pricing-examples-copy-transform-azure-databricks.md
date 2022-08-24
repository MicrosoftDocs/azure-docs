---
title: "Pricing example: Copy data and transform with Azure Databricks hourly"
description: This article shows how to estimate pricing for Azure Data Factory to copy data and transform it with Azure Databricks every hour for 30 days.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/24/2022
---

# Pricing example: Copy data and transform with Azure Databricks hourly

In this scenario, you want to copy data from AWS S3 to Azure Blob storage and transform the data with Azure Databricks on an hourly schedule.

## Configuration

To accomplish the scenario, you need to create a pipeline with the following items:

1. One copy activity with an input dataset for the data to be copied from AWS S3, and an output dataset for the data on Azure storage.
2. One Azure Databricks activity for the data transformation.
3. One schedule trigger to execute the pipeline every hour.

:::image type="content" source="media/pricing-concepts/scenario2.png" alt-text="Diagram shows a pipeline with a schedule trigger. In the pipeline, copy activity flows to an input dataset, an output dataset, and a DataBricks activity, which runs on Azure Databricks. The input dataset flows to an A W S S3 linked service. The output dataset flows to an Azure Storage linked service.":::

## Costs estimation

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 3 Activity runs per execution (1 for trigger run, 2 for activity runs) |
| Copy Data Assumption: execution time per run = 10 min | 10 \* 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |
| Execute Databricks activity Assumption: execution time per run = 10 min | 10 min External Pipeline Activity Execution |

## Pricing calculator example

**Total scenario pricing for 30 days: $122.03**

:::image type="content" source="media/pricing-concepts/scenario-2-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for a copy data and transform with Azure Databricks scenario.":::

## Next Steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)