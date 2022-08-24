---
title: Understanding Azure Data Factory pricing through examples 
description: This article explains and demonstrates the Azure Data Factory pricing model with detailed examples
author: jianleishen
ms.author: jianleishen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: pricing
ms.topic: conceptual
ms.date: 08/09/2022
---

# Understanding Data Factory pricing through examples

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article explains and demonstrates the Azure Data Factory pricing model with detailed examples.  You can also refer to the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) for more specific scenarios and to estimate your future costs to use the service.

> [!NOTE]
> The prices used in these examples below are hypothetical and are not intended to imply actual pricing.  Read/write and monitoring costs are not shown since they are typically negligible and will not impact overall costs significantly.  Activity runs are also rounded to the nearest 1000 in pricing calculator estimates.

## Copy data from AWS S3 to Azure Blob storage hourly

In this scenario, you want to copy data from AWS S3 to Azure Blob storage on an hourly schedule.

To accomplish the scenario, you need to create a pipeline with the following items:

1. A copy activity with an input dataset for the data to be copied from AWS S3.

2. An output dataset for the data on Azure Storage.

3. A schedule trigger to execute the pipeline every hour.

   :::image type="content" source="media/pricing-concepts/scenario1.png" alt-text="Diagram shows a pipeline with a schedule trigger. In the pipeline, copy activity flows to an input dataset, which flows to an A W S S3 linked service and copy activity also flows to an output dataset, which flows to an Azure Storage linked service.":::

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 2 Activity runs per execution (1 for trigger run, 1 for activity runs) |
| Copy Data Assumption: execution time per run = 10 min | 10 \* 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |

**Total scenario pricing for 30 days: $122.00**

:::image type="content" source="media/pricing-concepts/scenario-1-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for an hourly pipeline run.":::

## Copy data and transform with Azure Databricks hourly

In this scenario, you want to copy data from AWS S3 to Azure Blob storage and transform the data with Azure Databricks on an hourly schedule.

To accomplish the scenario, you need to create a pipeline with the following items:

1. One copy activity with an input dataset for the data to be copied from AWS S3, and an output dataset for the data on Azure storage.
2. One Azure Databricks activity for the data transformation.
3. One schedule trigger to execute the pipeline every hour.

:::image type="content" source="media/pricing-concepts/scenario2.png" alt-text="Diagram shows a pipeline with a schedule trigger. In the pipeline, copy activity flows to an input dataset, an output dataset, and a DataBricks activity, which runs on Azure Databricks. The input dataset flows to an A W S S3 linked service. The output dataset flows to an Azure Storage linked service.":::

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 3 Activity runs per execution (1 for trigger run, 2 for activity runs) |
| Copy Data Assumption: execution time per run = 10 min | 10 \* 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |
| Execute Databricks activity Assumption: execution time per run = 10 min | 10 min External Pipeline Activity Execution |

**Total scenario pricing for 30 days: $122.03**

:::image type="content" source="media/pricing-concepts/scenario-2-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for a copy data and transform with Azure Databricks scenario.":::

## Copy data and transform with dynamic parameters hourly

In this scenario, you want to copy data from AWS S3 to Azure Blob storage and transform with Azure Databricks (with dynamic parameters in the script) on an hourly schedule.

To accomplish the scenario, you need to create a pipeline with the following items:

1. One copy activity with an input dataset for the data to be copied from AWS S3, an output dataset for the data on Azure storage.
2. One Lookup activity for passing parameters dynamically to the transformation script.
3. One Azure Databricks activity for the data transformation.
4. One schedule trigger to execute the pipeline every hour.

:::image type="content" source="media/pricing-concepts/scenario3.png" alt-text="Diagram shows a pipeline with a schedule trigger. In the pipeline, copy activity flows to an input dataset, an output dataset, and lookup activity that flows to a DataBricks activity, which runs on Azure Databricks. The input dataset flows to an A W S S3 linked service. The output dataset flows to an Azure Storage linked service.":::

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 4 Activity runs per execution (1 for trigger run, 3 for activity runs) |
| Copy Data Assumption: execution time per run = 10 min | 10 \* 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |
| Execute Lookup activity Assumption: execution time per run = 1 min | 1 min Pipeline Activity execution |
| Execute Databricks activity Assumption: execution time per run = 10 min | 10 min External Pipeline Activity execution |

**Total scenario pricing for 30 days: $122.09**

:::image type="content" source="media/pricing-concepts/scenario-3-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for a copy data and transform with dynamic parameters scenario.":::

## Run SSIS packages on Azure-SSIS integration runtime

Azure-SSIS integration runtime (IR) is a specialized cluster of Azure virtual machines (VMs) for SSIS package executions in Azure Data Factory (ADF). When you provision it, it will be dedicated to you, hence it will be charged just like any other dedicated Azure VMs as long as you keep it running, regardless whether you use it to execute SSIS packages or not. With respect to its running cost, you’ll see the hourly estimate on its setup pane in ADF portal, for example:  

:::image type="content" source="media/pricing-concepts/ssis-pricing-example.png" alt-text="SSIS pricing example":::

In the above example, if you keep your Azure-SSIS IR running for 2 hours, you'll be charged: **2 (hours) x US$1.158/hour = US$2.316**.

To manage your Azure-SSIS IR running cost, you can scale down your VM size, scale in your cluster size, bring your own SQL Server license via Azure Hybrid Benefit (AHB) option that offers significant savings, see [Azure-SSIS IR pricing](https://azure.microsoft.com/pricing/details/data-factory/ssis/), and or start & stop your Azure-SSIS IR whenever convenient/on demand/just in time to process your SSIS workloads, see [Reconfigure Azure-SSIS IR](manage-azure-ssis-integration-runtime.md#to-reconfigure-an-azure-ssis-ir) and [Schedule Azure-SSIS IR](how-to-schedule-azure-ssis-integration-runtime.md).

## Using mapping data flow debug for a normal workday

As a Data Engineer, Sam is responsible for designing, building, and testing mapping data flows every day. Sam logs into the ADF UI in the morning and enables the Debug mode for Data Flows. The default TTL for Debug sessions is 60 minutes. Sam works throughout the day for 8 hours, so the Debug session never expires. Therefore, Sam's charges for the day will be:

**8 (hours) x 8 (compute-optimized cores) x $0.193 = $12.35**

At the same time, Chris, another Data Engineer, also logs into the ADF browser UI for data profiling and ETL design work. Chris does not work in ADF all day like Sam. Chris only needs to use the data flow debugger for 1 hour during the same period and same day as Sam above. These are the charges Chris incurs for debug usage:

**1 (hour) x 8 (general purpose cores) x $0.274 = $2.19**

## Transform data in blob store with mapping data flows

In this scenario, you want to transform data in Blob Store visually in ADF mapping data flows on an hourly schedule for 30 days.

To accomplish the scenario, you need to create a pipeline with the following items:

1. A Data Flow activity with the transformation logic.

2. An input dataset for the data on Azure Storage.

3. An output dataset for the data on Azure Storage.

4. A schedule trigger to execute the pipeline every hour.

| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 2 Activity runs per execution (1 for trigger run, 1 for activity runs) |
| Data Flow Assumptions: execution time per run = 10 min + 10 min TTL | 10 \* 16 cores of General Compute with TTL of 10 |

**Total scenario pricing for 30 days: $1051.28**

:::image type="content" source="media/pricing-concepts/scenario-4a-pricing-calculator.png" alt-text="Screenshot of the orchestration section of the pricing calculator configured to transform data in a blob store with mapping data flows.":::

:::image type="content" source="media/pricing-concepts/scenario-4-pricing-calculator.png" alt-text="Screenshot of the data flow section of the pricing calculator configured to transform data in a blob store with mapping data flows.":::

## Data integration in Azure Data Factory Managed VNET
In this scenario, you want to delete original files on Azure Blob Storage and copy data from Azure SQL Database to Azure Blob Storage on an hourly schedule for 30 days. You will do this execution twice on different pipelines for each run. The execution time of these two pipelines is overlapping.
:::image type="content" source="media/pricing-concepts/scenario-4.png" alt-text="Diagram showing overlapping pipeline activity.":::
To accomplish the scenario, you need to create two pipelines with the following items:
  - A pipeline activity – Delete Activity.
  - A copy activity with an input dataset for the data to be copied from Azure Blob storage.
  - An output dataset for the data on Azure SQL Database.
  - A schedule triggers to execute the pipeline.


| **Operations** | **Types and Units** |
| --- | --- |
| Run Pipeline | 6 Activity runs per execution (2 for trigger run, 4 for activity runs) |
| Execute Delete Activity: each execution time = 5 min. If the Delete Activity execution in first pipeline is from 10:00 AM UTC to 10:05 AM UTC and the Delete Activity execution in second pipeline is from 10:02 AM UTC to 10:07 AM UTC.|Total 7 min pipeline activity execution in Managed VNET. Pipeline activity supports up to 50 concurrency in Managed VNET. There is a 60 minutes Time To Live (TTL) for pipeline activity|
| Copy Data Assumption: each execution time = 10 min if the Copy execution in first pipeline is from 10:06 AM UTC to 10:15 AM UTC and the Copy Activity execution in second pipeline is from 10:08 AM UTC to 10:17 AM UTC. | 10 * 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |


**Total scenario pricing for 30 days: $129.02**

:::image type="content" source="media/pricing-concepts/scenario-5-pricing-calculator.png" alt-text="Screenshot of the pricing calculator configured for data integration with Managed VNET.":::

**FAQ**

Q: If I would like to run more than 50 pipeline activities, can these activities be executed simultaneously?

A: Max 50 concurrent pipeline activities will be allowed.  The 51st pipeline activity will be queued until a “free slot” is opened up. 
The same is true for external activity. A maximum of 800 concurrent external activities will be allowed.

## Next steps

Now that you understand the pricing for Azure Data Factory, you can get started!

- [Create a data factory by using the Azure Data Factory UI](quickstart-create-data-factory-portal.md)

- [Introduction to Azure Data Factory](introduction.md)

- [Visual authoring in Azure Data Factory](author-visually.md)
