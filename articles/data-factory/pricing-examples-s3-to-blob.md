---
title: "Pricing example: Copy data from AWS S3 to Azure Blob storage hourly"
description: This article shows how to estimate pricing for Azure Data Factory to copy data from AWS S3 to Azure Blob storage every hour for 30 days.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/10/2023
---

# Pricing example: Copy data from AWS S3 to Azure Blob storage hourly

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this scenario, you want to copy data from AWS S3 to Azure Blob storage on an hourly schedule for 8 hours per day, for 30 days.

The prices used in this example below are hypothetical and aren't intended to imply exact actual pricing.  Read/write and monitoring costs aren't shown since they're typically negligible and won't impact overall costs significantly.  Activity runs are also rounded to the nearest 1000 in pricing calculator estimates.

Refer to the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) for more specific scenarios and to estimate your future costs to use the service.

## Configuration

To accomplish the scenario, you need to create a pipeline with the following items:

- I'll copy data from AWS S3 to Azure Blob storage, and this will move 10 GB of data from S3 to blob storage. I estimate it will run for 2-3 hours, and I plan to set DIU as Auto.
- A schedule trigger to execute the pipeline every hour for 8 hours every day. When you want to run a pipeline, you can either [trigger it immediately or schedule it](concepts-pipeline-execution-triggers.md). In addition to the pipeline itself, each trigger instance counts as a single Activity run.

   :::image type="content" source="media/pricing-concepts/scenario1.png" alt-text="Diagram shows a pipeline with a schedule trigger.":::

## Costs estimation

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 2 Activity runs **per execution** (1 for the trigger to run, 1 for activity to run) = 480 Activity runs, rounded up since the calculator only allows increments of 1000. |
| Copy Data Assumption: DIU hours **per execution** | 0.5 hours \* 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |
| Total execution hours: 8 executions per day for 30 days | 240 executions * 2 DIU/run = 480 DIUs |

## Pricing calculator example

**Total scenario pricing for 30 days: $122.00**

:::image type="content" source="media/pricing-concepts/scenario-1-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for an hourly pipeline run." lightbox="media/pricing-concepts/scenario-1-pricing-calculator.png":::

## Next steps

- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)
- [Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows](pricing-examples-get-delta-data-from-sap-ecc.md)