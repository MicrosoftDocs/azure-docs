---
title: "Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows"
description: This article shows how to price getting delta data from SAP ECC via SAP CDC in mapping data flows.
author: dearandyxu
ms.author: yexu
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 09/22/2022
---

# Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this scenario, you want to get delta changes from 1 table in SAP ECC via SAP CDC connector, do a few necessary transforms in flight, and then write data to Azure Data Lake Gen2 storage in ADF mapping dataflow daily. 

The prices used in this example below are hypothetical and are not intended to imply exact actual pricing.  Read/write and monitoring costs are not shown since they are typically negligible and will not impact overall costs significantly.  Activity runs are also rounded to the nearest 1000 in pricing calculator estimates.

Refer to the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) for more specific scenarios and to estimate your future costs to use the service.

## Configuration

To accomplish the scenario, you need to create a pipeline with the following items: 

- One Mapping Data Flow activity with an input dataset for the data to be loaded from SAP ECC, the transformation logic, and an output dataset for the data on Azure Data Lake Gen2 storage. 
- A Self-Hosted Integration Runtime referenced to SAP CDC connector.  

## Costs estimation

In order to load data from SAP ECC via SAP CDC connector in Mapping Data Flow, you need to install your Self-Hosted Integration Runtime on an on-premise machine or VM to directly connect to your SAP ECC system. Given that, you will be charged on both Self-Hosted Integration Runtime with $0.10/hour and Mapping Data Flow with its vCore-hour price unit.  

Assuming every time it requires 15 minutes to complete the job, the cost estimations are as below. 

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 2 Activity runs per execution (1 for trigger run, 1 for activity run) |
| Data Flow: execution time per run = 15 mins  | 15 min * 8 cores of General Compute  |
| Self-Hosted Integration Runtime: execution time per run = 15 mins  | 15 min * $0.10/hour (Data Movement Activity on Self-Hosted Integration Runtime Price) |

## Pricing calculator example

**Total scenario pricing for 30 days: $17.21**

:::image type="content" source="media/pricing-concepts/scenario-6-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for getting delta data from SAP ECC via SAP CDC in mapping data flows.":::

## Next Steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)