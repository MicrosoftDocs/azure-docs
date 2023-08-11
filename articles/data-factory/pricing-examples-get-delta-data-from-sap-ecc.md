---
title: "Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows"
description: This article shows how to price getting delta data from SAP ECC via SAP CDC in mapping data flows.
author: dearandyxu
ms.author: yexu
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/10/2023
---

# Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this scenario, you want to get delta changes from one table in SAP ECC via SAP CDC connector, do a few necessary transforms in flight, and then write data to Azure Data Lake Gen2 storage in ADF mapping dataflow daily. We will calculate prices for execution on a schedule once per hour for 8 hours over 30 days.

The prices used in this example below are hypothetical and aren't intended to imply exact actual pricing.  Read/write and monitoring costs aren't shown since they're typically negligible and won't impact overall costs significantly.  Activity runs are also rounded to the nearest 1000 in pricing calculator estimates.

Refer to the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) for more specific scenarios and to estimate your future costs to use the service.

## Configuration

To accomplish the scenario, you need to create a pipeline with the following items: 

- One Mapping Data Flow activity with an input dataset for the data to be loaded from SAP ECC, the transformation logic, and an output dataset for the data on Azure Data Lake Gen2 storage. 
- A Self-Hosted Integration Runtime referenced to SAP CDC connector.
- A schedule trigger to execute the pipeline. When you want to run a pipeline, you can either [trigger it immediately or schedule it](concepts-pipeline-execution-triggers.md). In addition to the pipeline itself, each trigger instance counts as a single Activity run.

## Costs estimation

In order to load data from SAP ECC via SAP CDC connector in Mapping Data Flow, you need to install your Self-Hosted Integration Runtime on an on-premises machine, or VM to directly connect to your SAP ECC system. Given that, you'll be charged on both Self-Hosted Integration Runtime with $0.10/hour and Mapping Data Flow with its vCore-hour price unit.  

Assuming every time it requires 15 minutes to complete the job, the cost estimations are as below. 

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 2 Activity runs **per execution** (1 for trigger run, 1 for activity run) = 480, rounded up since the calculator only allows increments of 1000. |
| Data Flow: execution hours of general compute with 8 cores **per execution** = 15 mins  | 15 min / 60 min  |
| Self-Hosted Integration Runtime: data movement execution hours60 **per execution** = 15 mins  | 15 min / 60 min |

## Pricing calculator example

**Total scenario pricing for 30 days: $138.66**

:::image type="content" source="media/pricing-concepts/scenario-6-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for getting delta data from SAP ECC via SAP CDC in mapping data flows." lightbox="media/pricing-concepts/scenario-6-pricing-calculator.png":::

## Next steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)