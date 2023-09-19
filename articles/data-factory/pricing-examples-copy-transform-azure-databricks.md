---
title: "Pricing example: Copy data and transform with Azure Databricks hourly"
description: This article shows how to estimate pricing for Azure Data Factory to copy data and transform it with Azure Databricks every hour for 30 days.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/10/2023
---

# Pricing example: Copy data and transform with Azure Databricks hourly

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this scenario, you want to copy data from AWS S3 to Azure Blob storage and transform the data with Azure Databricks on an hourly schedule for 8 hours per day for 30 days.

The prices used in this example below are hypothetical and are not intended to imply exact actual pricing.  Read/write and monitoring costs are not shown since they are typically negligible and will not impact overall costs significantly.  Activity runs are also rounded to the nearest 1000 in pricing calculator estimates.

Refer to the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) for more specific scenarios and to estimate your future costs to use the service.

## Configuration

To accomplish the scenario, you need to create a pipeline with the following items:

- One copy activity with an input dataset for the data to be copied from AWS S3, and an output dataset for the data on Azure storage.
- One Azure Databricks activity for the data transformation.
- One schedule trigger to execute the pipeline every hour. When you want to run a pipeline, you can either [trigger it immediately or schedule it](concepts-pipeline-execution-triggers.md). In addition to the pipeline itself, each trigger instance counts as a single Activity run.

:::image type="content" source="media/pricing-concepts/scenario2.png" alt-text="Diagram shows a pipeline with a schedule trigger. In the pipeline, copy activity flows to an input dataset, an output dataset, and a DataBricks activity, which runs on Azure Databricks. The input dataset flows to an AWS S3 linked service. The output dataset flows to an Azure Storage linked service.":::

## Costs estimation

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 3 Activity runs **per execution** (1 for trigger run, 2 for activity runs) = 720 activity runs, rounded up since the calculator only allows increments of 1000. |
| Copy Data Assumption: DIU hours **per execution** = 10 min | 10 min \ 60 min \* 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |
| Execute Databricks activity Assumption: external execution hours **per execution** = 10 min | 10 min \ 60 min External Pipeline Activity Execution |

## Pricing calculator example

**Total scenario pricing for 30 days: $41.01**

:::image type="content" source="media/pricing-concepts/scenario-2-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for a copy data and transform with Azure Databricks scenario." lightbox="media/pricing-concepts/scenario-2-pricing-calculator.png":::

## Next steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)
- [Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows](pricing-examples-get-delta-data-from-sap-ecc.md)