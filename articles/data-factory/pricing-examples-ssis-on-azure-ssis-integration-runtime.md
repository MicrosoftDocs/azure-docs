---
title: "Pricing example: Run SSIS packages on Azure-SSIS integration runtime"
description: This article shows how to estimate pricing for Azure Data Factory to run SSIS packages with the Azure-SSIS integration runtime.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/24/2022
---

# Pricing example: Run SSIS packages on Azure-SSIS integration runtime

In this article you will see how to estimate costs to use Azure Data Factory to run SSIS packages with the Azure-SSIS integration runtime.

## Pricing model for Azure-SSIS inte4gration runtime

The Azure-SSIS integration runtime (IR) is a specialized cluster of Azure virtual machines (VMs) for SSIS package executions in Azure Data Factory (ADF). When you provision it, it will be dedicated to you, hence it will be charged just like any other dedicated Azure VMs as long as you keep it running, regardless whether you use it to execute SSIS packages or not. With respect to its running cost, you’ll see the hourly estimate on its setup pane in ADF portal, for example:  

:::image type="content" source="media/pricing-concepts/ssis-pricing-example.png" alt-text="SSIS pricing example":::

## Cost Estimation

In the above example, if you keep your Azure-SSIS IR running for 2 hours, you'll be charged: **2 (hours) x US$1.158/hour = US$2.316**.

To manage your Azure-SSIS IR running cost, you can scale down your VM size, scale in your cluster size, bring your own SQL Server license via Azure Hybrid Benefit (AHB) option that offers significant savings, see [Azure-SSIS IR pricing](https://azure.microsoft.com/pricing/details/data-factory/ssis/), and or start & stop your Azure-SSIS IR whenever convenient/on demand/just in time to process your SSIS workloads, see [Reconfigure Azure-SSIS IR](manage-azure-ssis-integration-runtime.md#to-reconfigure-an-azure-ssis-ir) and [Schedule Azure-SSIS IR](how-to-schedule-azure-ssis-integration-runtime.md).

## Next Steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)