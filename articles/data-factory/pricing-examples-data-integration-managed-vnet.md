---
title: "Pricing example: Data integration in Azure Data Factory Managed VNET"
description: This article shows how to estimate pricing for Azure Data Factory to perform data integration using Managed VNET.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/24/2022
---

# Pricing example: Data integration in Azure Data Factory Managed VNET

In this scenario, you want to delete original files on Azure Blob Storage and copy data from Azure SQL Database to Azure Blob Storage on an hourly schedule for 30 days. You will do this execution twice on different pipelines for each run. The execution time of these two pipelines is overlapping.

## Configuration

:::image type="content" source="media/pricing-concepts/scenario-4.png" alt-text="Diagram showing overlapping pipeline activity.":::
To accomplish the scenario, you need to create two pipelines with the following items:
  - A pipeline activity – Delete Activity.
  - A copy activity with an input dataset for the data to be copied from Azure Blob storage.
  - An output dataset for the data on Azure SQL Database.
  - A schedule triggers to execute the pipeline.

## Costs estimation

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 6 Activity runs per execution (2 for trigger run, 4 for activity runs) |
| Execute Delete Activity: each execution time = 5 min. If the Delete Activity execution in first pipeline is from 10:00 AM UTC to 10:05 AM UTC and the Delete Activity execution in second pipeline is from 10:02 AM UTC to 10:07 AM UTC.|Total 7 min pipeline activity execution in Managed VNET. Pipeline activity supports up to 50 concurrency in Managed VNET. There is a 60 minutes Time To Live (TTL) for pipeline activity|
| Copy Data Assumption: each execution time = 10 min if the Copy execution in first pipeline is from 10:06 AM UTC to 10:15 AM UTC and the Copy Activity execution in second pipeline is from 10:08 AM UTC to 10:17 AM UTC. | 10 * 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |

## Pricing calculator example

**Total scenario pricing for 30 days: $129.02**

:::image type="content" source="media/pricing-concepts/scenario-5-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for data integration with Managed VNET.":::

## Next Steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)