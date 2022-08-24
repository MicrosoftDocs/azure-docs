---
title: "Pricing example: Using mapping data flow debug for a normal workday"
description: This article shows how to estimate pricing for Azure Data Factory to use mapping data flow debug for a normal workday.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/24/2022
---

# Pricing example: Using mapping data flow debug for a normal workday

This example shows mapping data flow debug costs for a typical workday for a data engineer.

## Full-time Azure Data Factory engineer

As a Data Engineer, Sam is responsible for designing, building, and testing mapping data flows every day. Sam logs into the ADF UI in the morning and enables the Debug mode for Data Flows. The default TTL for Debug sessions is 60 minutes. Sam works throughout the day for 8 hours, so the Debug session never expires. Therefore, Sam's charges for the day will be:

**8 (hours) x 8 (compute-optimized cores) x $0.193 = $12.35**

## Part-time Azure Data Factory engineer

At the same time, Chris, another Data Engineer, also logs into the ADF browser UI for data profiling and ETL design work. Chris does not work in ADF all day like Sam. Chris only needs to use the data flow debugger for 1 hour during the same period and same day as Sam above. These are the charges Chris incurs for debug usage:

**1 (hour) x 8 (general purpose cores) x $0.274 = $2.19**

## Next Steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](pricing-examples-ssis-on-azure-ssis-integration-runtime.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)