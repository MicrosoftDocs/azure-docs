---
title: "Pricing example: Transform data in blob store with mapping data flows"
description: This article shows how to estimate pricing for Azure Data Factory to transform data in a blob store with mapping data flows.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/10/2023
---

# Pricing example: Transform data in blob store with mapping data flows

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this scenario, you want to transform data in Blob Store visually in ADF mapping data flows on an hourly schedule for 8 hours per day over 30 days.

The prices used in this example below are hypothetical and are not intended to imply exact actual pricing.  Read/write and monitoring costs are not shown since they are typically negligible and will not impact overall costs significantly.  Activity runs are also rounded to the nearest 1000 in pricing calculator estimates.

Refer to the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) for more specific scenarios and to estimate your future costs to use the service.

## Configuration

To accomplish the scenario, you need to create a pipeline with the following items:

- A Data Flow activity with the transformation logic.
- An input dataset for the data on Azure Storage.
- An output dataset for the data on Azure Storage.
- A schedule trigger to execute the pipeline every hour. When you want to run a pipeline, you can either [trigger it immediately or schedule it](concepts-pipeline-execution-triggers.md). In addition to the pipeline itself, each trigger instance counts as a single Activity run.

## Costs estimation

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 2 Activity runs **per execution** (1 for trigger run, 1 for activity runs) = 480 activity runs, rounded up since the calculator only allows increments of 1000. |
| Data Flow Assumptions: General purpose 16 vCore hours **per execution** = 10 min | 10 min \ 60 min |

## Pricing calculator example

**Total scenario pricing for 30 days: $175.88**

:::image type="content" source="media/pricing-concepts/scenario-4a-pricing-calculator.png" alt-text="Screenshot of the orchestration section of the pricing calculator configured to transform data in a blob store with mapping data flows." lightbox="media/pricing-concepts/scenario-4a-pricing-calculator.png":::

:::image type="content" source="media/pricing-concepts/scenario-4-pricing-calculator.png" alt-text="Screenshot of the data flow section of the pricing calculator configured to transform data in a blob store with mapping data flows." lightbox="media/pricing-concepts/scenario-4-pricing-calculator.png":::

## Next steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)
- [Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows](pricing-examples-get-delta-data-from-sap-ecc.md)
