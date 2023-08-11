---
title: "Pricing example: Using mapping data flow debug for a normal workday"
description: This article shows how to estimate pricing for Azure Data Factory to use mapping data flow debug for a normal workday.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/10/2023
---

# Pricing example: Using mapping data flow debug for a normal workday

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This example shows mapping data flow debug costs for a typical workday for a data engineer.

The prices used in this example below are hypothetical and are not intended to imply exact actual pricing.  Read/write and monitoring costs are not shown since they are typically negligible and will not impact overall costs significantly.  Activity runs are also rounded to the nearest 1000 in pricing calculator estimates.

Refer to the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) for more specific scenarios and to estimate your future costs to use the service.

## Azure Data Factory engineer

A data factory engineer is responsible for designing, building, and testing mapping data flows every day. The engineer logs into the ADF UI in the morning and enables the Debug mode for Data Flows. The default TTL for Debug sessions is 60 minutes. The engineer works throughout the day for 8 hours, so the Debug session never expires. Therefore, Sam's charges for the day will be:

**8 (hours) x 8 (compute-optimized cores) x $0.193 = $12.35**

## Next steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)
- [Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows](pricing-examples-get-delta-data-from-sap-ecc.md)