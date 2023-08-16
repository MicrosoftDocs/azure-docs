---
title: "Pricing example: Data integration in Azure Data Factory Managed VNET"
description: This article shows how to estimate pricing for Azure Data Factory to perform data integration using Managed VNET.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 06/12/2023
---

# Pricing example: Data integration in Azure Data Factory Managed VNET

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this scenario, you want to delete original files on Azure Blob Storage and copy data from Azure SQL Database to Azure Blob Storage on an hourly schedule for 8 hours per day.  We calculate the price for 30 days. You do this execution twice on different pipelines for each run. The execution time of these two pipelines is overlapping.

The prices used in this example are hypothetical and aren't intended to imply exact actual pricing.  Read/write and monitoring costs aren't shown since they're typically negligible and won't impact overall costs significantly.  Activity runs are also rounded to the nearest 1000 in pricing calculator estimates.

Refer to the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) for more specific scenarios and to estimate your future costs to use the service.

## Configuration

:::image type="content" source="media/pricing-concepts/scenario-4.png" alt-text="Diagram showing overlapping pipeline activity.":::
To accomplish the scenario, you need to create two pipelines with the following items:
  - A pipeline activity - Delete Activity.
  - A copy activity with an input dataset for the data to be copied from Azure Blob storage.
  - An output dataset for the data on Azure SQL Database.
  - A schedule trigger to execute the pipeline. When you want to run a pipeline, you can either [trigger it immediately or schedule it](concepts-pipeline-execution-triggers.md). In addition to the pipeline itself, each trigger instance counts as a single Activity run.

## Costs estimation

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 6 Activity runs **per execution** (2 for trigger runs, 4 for activity runs) = 1440, rounded up since the calculator only allows increments of 1000.|
| Execute Delete Activity: pipeline execution time **per execution** = 7 min. If the Delete Activity execution in the first pipeline is from 10:00 AM UTC to 10:05 AM UTC and the Delete Activity execution in second pipeline is from 10:02 AM UTC to 10:07 AM UTC. | Total (7 min + 60 min) / 60 min * 30 monthly executions = 33.5 pipeline activity execution hours in Managed VNET. Pipeline activity supports up to 50 concurrent executions per node in Managed VNET. There's a 60 minutes Time To Live (TTL) for pipeline activity. |
| Copy Data Assumption: DIU execution time **per execution** = 10 min if the Copy execution in first pipeline is from 10:06 AM UTC to 10:15 AM UTC and the Copy Activity execution in second pipeline is from 10:08 AM UTC to 10:17 AM UTC.| [(10 min + 2 min (queue time charges up to 2 minutes)) / 60 min * 4 Azure Managed VNET Integration Runtime (default DIU setting = 4)] * 2 = 1.6 daily data movement activity execution hours in Managed VNET. For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |

## Pricing calculator example

**Total scenario pricing for 30 days: $83.50**

:::image type="content" source="media/pricing-concepts/scenario-5-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for data integration with Managed VNET." lightbox="media/pricing-concepts/scenario-5-pricing-calculator.png":::

## Next steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows](pricing-examples-get-delta-data-from-sap-ecc.md)
