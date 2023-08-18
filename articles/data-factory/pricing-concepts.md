---
title: Understanding Azure Data Factory pricing through examples 
description: This article explains and demonstrates the Azure Data Factory pricing model with detailed examples
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/10/2023
---

# Understanding Azure Data Factory pricing through examples

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article explains and demonstrates the Azure Data Factory pricing model with detailed examples.  You can also refer to the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) for more specific scenarios and to estimate your future costs to use the service.  To understand how to estimate pricing for any scenario, not just the examples here, refer to the article [Plan and manage costs for Azure Data Factory](plan-manage-costs.md).

For more details about pricing in Azure Data Factory, see the [Data Pipeline Pricing and FAQ](https://azure.microsoft.com/pricing/details/data-factory/data-pipeline/).

## Pricing examples
The prices used in the following examples are hypothetical and don't intend to imply exact actual pricing.  Read/write and monitoring costs aren't shown since they're typically negligible and won't impact overall costs significantly.  Activity runs are also rounded to the nearest 1000 in pricing calculator estimates.

- [Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)
- [Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows](pricing-examples-get-delta-data-from-sap-ecc.md)


## Next steps
Now that you understand the pricing for Azure Data Factory, you can get started!

- [Create a data factory by using the Azure Data Factory UI](quickstart-create-data-factory-portal.md)
- [Introduction to Azure Data Factory](introduction.md)
- [Visual authoring in Azure Data Factory](author-visually.md)
