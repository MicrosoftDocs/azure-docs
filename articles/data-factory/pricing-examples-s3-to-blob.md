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

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this scenario, you want to copy data from AWS S3 to Azure Blob storage on an hourly schedule for 8 hours per day, for 30 days.

The prices used in this example below are hypothetical and are not intended to imply exact actual pricing.  Read/write and monitoring costs are not shown since they are typically negligible and will not impact overall costs significantly.  Activity runs are also rounded to the nearest 1000 in pricing calculator estimates.

Refer to the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) for more specific scenarios and to estimate your future costs to use the service.

## Configuration

To accomplish the scenario, you need to create a pipeline with the following items:

1. I will copy data from AWS S3 to Azure Blob storage, and this will move 10GB of data from S3 to blob storage. I estimate it will run for 2-3 hours, and I plan to set DIU as Auto.

3. A schedule trigger to execute the pipeline every hour for 8 hours every day.

   :::image type="content" source="media/pricing-concepts/scenario1.png" alt-text="Diagram shows a pipeline with a schedule trigger. In the pipeline, copy activity flows to an input dataset, which flows to an A W S S3 linked service and copy activity also flows to an output dataset, which flows to an Azure Storage linked service.":::

## Costs estimation

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 2 Activity runs per execution (1 for the trigger to run, 1 for activity to run) |
| Copy Data Assumption: execution hours **per run** | .5 hours \* 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |
| Total execution hours: 8 runs per day for 30 days | 240 runs * 2 DIU/run = 480 DIUs |

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
- [Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows](pricing-examples-get-delta-data-from-sap-ecc.md)