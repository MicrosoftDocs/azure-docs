---
title: "Pricing example: Run SSIS packages on Azure-SSIS integration runtime"
description: This article shows how to estimate pricing for Azure Data Factory to run SSIS packages with the Azure-SSIS integration runtime.
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/10/2023
---

# Pricing example: Run SSIS packages on Azure-SSIS integration runtime

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this article you will see how to estimate costs to use Azure Data Factory to run SSIS packages with the Azure-SSIS integration runtime.

The prices used in this example below are hypothetical and are not intended to imply exact actual pricing.  Read/write and monitoring costs are not shown since they are typically negligible and will not impact overall costs significantly.  Activity runs are also rounded to the nearest 1000 in pricing calculator estimates.

Refer to the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) for more specific scenarios and to estimate your future costs to use the service.

## Pricing model for Azure-SSIS integration runtime

The Azure-SSIS integration runtime (IR) is a specialized cluster of Azure virtual machines (VMs) for SSIS package executions in Azure Data Factory (ADF). When you provision it, it will be dedicated to you, hence it will be charged just like any other dedicated Azure VMs as long as you keep it running, regardless whether you use it to execute SSIS packages or not. With respect to its running cost, you’ll see the hourly estimate on its setup pane in ADF portal, for example:  

:::image type="content" source="media/pricing-concepts/ssis-pricing-example.png" alt-text="Diagram showing an SSIS pricing example.":::

### Azure Hybrid Benefit (AHB)

Azure Hybrid Benefit (AHB) can reduce the cost of your Azure-SSIS integration runtime (IR).  Using the AHB, you can provide your own SQL license, which reduces the cost of the Azure-SSIS IR from $1.938/hour to $1.158/hour.  To learn more about AHB, visit the [Azure Hybrid Benefit (AHB)](https://azure.microsoft.com/pricing/hybrid-benefit/) article.


## Cost Estimation

In the above example, if you keep your Azure-SSIS IR running for 2 hours, using AHB to bring your own SQL license, you'll be charged: **2 (hours) x US$1.158/hour = US$2.316**.

To manage your Azure-SSIS IR running cost, you can scale down your VM size, scale in your cluster size, bring your own SQL Server license via Azure Hybrid Benefit (AHB) option that offers significant savings, see [Azure-SSIS IR pricing](https://azure.microsoft.com/pricing/details/data-factory/ssis/), and or start & stop your Azure-SSIS IR whenever convenient/on demand/just in time to process your SSIS workloads, see [Reconfigure Azure-SSIS IR](manage-azure-ssis-integration-runtime.md#to-reconfigure-an-azure-ssis-ir) and [Schedule Azure-SSIS IR](how-to-schedule-azure-ssis-integration-runtime.md).

## Next steps

- [Pricing example: Copy data from AWS S3 to Azure Blob storage hourly for 30 days](pricing-examples-s3-to-blob.md)
- [Pricing example: Copy data and transform with Azure Databricks hourly for 30 days](pricing-examples-copy-transform-azure-databricks.md)
- [Pricing example: Copy data and transform with dynamic parameters hourly for 30 days](pricing-examples-copy-transform-dynamic-parameters.md)
- [Pricing example: Using mapping data flow debug for a normal workday](pricing-examples-mapping-data-flow-debug-workday.md)
- [Pricing example: Transform data in blob store with mapping data flows](pricing-examples-transform-mapping-data-flows.md)
- [Pricing example: Data integration in Azure Data Factory Managed VNET](pricing-examples-data-integration-managed-vnet.md)
- [Pricing example: Get delta data from SAP ECC via SAP CDC in mapping data flows](pricing-examples-get-delta-data-from-sap-ecc.md)