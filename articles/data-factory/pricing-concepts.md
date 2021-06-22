---
title: Understanding Azure Data Factory pricing through examples 
description: This article explains and demonstrates the Azure Data Factory pricing model with detailed examples
author: shirleywangmsft
ms.author: shwang
ms.reviewer: jburchel
ms.service: data-factory
ms.topic: conceptual
ms.date: 09/14/2020
---

# Understanding Data Factory pricing through examples

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article explains and demonstrates the Azure Data Factory pricing model with detailed examples.

> [!NOTE]
> The prices used in these examples below are hypothetical and are not intended to imply actual pricing.

## Copy data from AWS S3 to Azure Blob storage hourly

In this scenario, you want to copy data from AWS S3 to Azure Blob storage on an hourly schedule.

To accomplish the scenario, you need to create a pipeline with the following items:

1. A copy activity with an input dataset for the data to be copied from AWS S3.

2. An output dataset for the data on Azure Storage.

3. A schedule trigger to execute the pipeline every hour.

   ![Diagram shows a pipeline with a schedule trigger. In the pipeline, copy activity flows to an input dataset, which flows to an A W S S3 linked service and copy activity also flows to an output dataset, which flows to an Azure Storage linked service.](media/pricing-concepts/scenario1.png)

| **Operations** | **Types and Units** |
| --- | --- |
| Create Linked Service | 2 Read/Write entity  |
| Create Datasets | 4 Read/Write entities (2 for dataset creation, 2 for linked service references) |
| Create Pipeline | 3 Read/Write entities (1 for pipeline creation, 2 for dataset references) |
| Get Pipeline | 1 Read/Write entity |
| Run Pipeline | 2 Activity runs (1 for trigger run, 1 for activity runs) |
| Copy Data Assumption: execution time = 10 min | 10 \* 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |
| Monitor Pipeline Assumption: Only 1 run occurred | 2 Monitoring run records retrieved (1 for pipeline run, 1 for activity run) |

**Total Scenario pricing: $0.16811**

- Data Factory Operations = **$0.0001**
  - Read/Write = 10\*00001 = $0.0001 [1 R/W = $0.50/50000 = 0.00001]
  - Monitoring  = 2\*000005 = $0.00001 [1 Monitoring = $0.25/50000 = 0.000005]
- Pipeline Orchestration &amp; Execution = **$0.168**
  - Activity Runs = 001\*2 = 0.002 [1 run = $1/1000 = 0.001]
  - Data Movement Activities = $0.166 (Prorated for 10 minutes of execution time. $0.25/hour on Azure Integration Runtime)

## Copy data and transform with Azure Databricks hourly

In this scenario, you want to copy data from AWS S3 to Azure Blob storage and transform the data with Azure Databricks on an hourly schedule.

To accomplish the scenario, you need to create a pipeline with the following items:

1. One copy activity with an input dataset for the data to be copied from AWS S3, and an output dataset for the data on Azure storage.
2. One Azure Databricks activity for the data transformation.
3. One schedule trigger to execute the pipeline every hour.

![Diagram shows a pipeline with a schedule trigger. In the pipeline, copy activity flows to an input dataset, an output dataset, and a DataBricks activity, which runs on Azure Databricks. The input dataset flows to an A W S S3 linked service. The output dataset flows to an Azure Storage linked service.](media/pricing-concepts/scenario2.png)

| **Operations** | **Types and Units** |
| --- | --- |
| Create Linked Service | 3 Read/Write entity  |
| Create Datasets | 4 Read/Write entities (2 for dataset creation, 2 for linked service references) |
| Create Pipeline | 3 Read/Write entities (1 for pipeline creation, 2 for dataset references) |
| Get Pipeline | 1 Read/Write entity |
| Run Pipeline | 3 Activity runs (1 for trigger run, 2 for activity runs) |
| Copy Data Assumption: execution time = 10 min | 10 \* 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |
| Monitor Pipeline Assumption: Only 1 run occurred | 3 Monitoring run records retrieved (1 for pipeline run, 2 for activity run) |
| Execute Databricks activity Assumption: execution time = 10 min | 10 min External Pipeline Activity Execution |

**Total Scenario pricing: $0.16916**

- Data Factory Operations = **$0.00012**
  - Read/Write = 11\*00001 = $0.00011 [1 R/W = $0.50/50000 = 0.00001]
  - Monitoring  = 3\*000005 = $0.00001 [1 Monitoring = $0.25/50000 = 0.000005]
- Pipeline Orchestration &amp; Execution = **$0.16904**
  - Activity Runs = 001\*3 = 0.003 [1 run = $1/1000 = 0.001]
  - Data Movement Activities = $0.166 (Prorated for 10 minutes of execution time. $0.25/hour on Azure Integration Runtime)
  - External Pipeline Activity = $0.000041 (Prorated for 10 minutes of execution time. $0.00025/hour on Azure Integration Runtime)

## Copy data and transform with dynamic parameters hourly

In this scenario, you want to copy data from AWS S3 to Azure Blob storage and transform with Azure Databricks (with dynamic parameters in the script) on an hourly schedule.

To accomplish the scenario, you need to create a pipeline with the following items:

1. One copy activity with an input dataset for the data to be copied from AWS S3, an output dataset for the data on Azure storage.
2. One Lookup activity for passing parameters dynamically to the transformation script.
3. One Azure Databricks activity for the data transformation.
4. One schedule trigger to execute the pipeline every hour.

![Diagram shows a pipeline with a schedule trigger. In the pipeline, copy activity flows to an input dataset, an output dataset, and lookup activity that flows to a DataBricks activity, which runs on Azure Databricks. The input dataset flows to an A W S S3 linked service. The output dataset flows to an Azure Storage linked service.](media/pricing-concepts/scenario3.png)

| **Operations** | **Types and Units** |
| --- | --- |
| Create Linked Service | 3 Read/Write entity  |
| Create Datasets | 4 Read/Write entities (2 for dataset creation, 2 for linked service references) |
| Create Pipeline | 3 Read/Write entities (1 for pipeline creation, 2 for dataset references) |
| Get Pipeline | 1 Read/Write entity |
| Run Pipeline | 4 Activity runs (1 for trigger run, 3 for activity runs) |
| Copy Data Assumption: execution time = 10 min | 10 \* 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |
| Monitor Pipeline Assumption: Only 1 run occurred | 4 Monitoring run records retrieved (1 for pipeline run, 3 for activity run) |
| Execute Lookup activity Assumption: execution time = 1 min | 1 min Pipeline Activity execution |
| Execute Databricks activity Assumption: execution time = 10 min | 10 min External Pipeline Activity execution |

**Total Scenario pricing: $0.17020**

- Data Factory Operations = **$0.00013**
  - Read/Write = 11\*00001 = $0.00011 [1 R/W = $0.50/50000 = 0.00001]
  - Monitoring  = 4\*000005 = $0.00002 [1 Monitoring = $0.25/50000 = 0.000005]
- Pipeline Orchestration &amp; Execution = **$0.17007**
  - Activity Runs = 001\*4 = 0.004 [1 run = $1/1000 = 0.001]
  - Data Movement Activities = $0.166 (Prorated for 10 minutes of execution time. $0.25/hour on Azure Integration Runtime)
  - Pipeline Activity = $0.00003 (Prorated for 1 minute of execution time. $0.002/hour on Azure Integration Runtime)
  - External Pipeline Activity = $0.000041 (Prorated for 10 minutes of execution time. $0.00025/hour on Azure Integration Runtime)

## Using mapping data flow debug for a normal workday

As a Data Engineer, Sam is responsible for designing, building, and testing mapping data flows every day. Sam logs into the ADF UI in the morning and enables the Debug mode for Data Flows. The default TTL for Debug sessions is 60 minutes. Sam works throughout the day for 8 hours, so the Debug session never expires. Therefore, Sam's charges for the day will be:

**8 (hours) x 8 (compute-optimized cores) x $0.193 = $12.35**

At the same time, Chris, another Data Engineer, also logs into the ADF browser UI for data profiling and ETL design work. Chris does not work in ADF all day like Sam. Chris only needs to use the data flow debugger for 1 hour during the same period and same day as Sam above. These are the charges Chris incurs for debug usage:

**1 (hour) x 8 (general purpose cores) x $0.274 = $2.19**

## Transform data in blob store with mapping data flows

In this scenario, you want to transform data in Blob Store visually in ADF mapping data flows on an hourly schedule.

To accomplish the scenario, you need to create a pipeline with the following items:

1. A Data Flow activity with the transformation logic.

2. An input dataset for the data on Azure Storage.

3. An output dataset for the data on Azure Storage.

4. A schedule trigger to execute the pipeline every hour.

| **Operations** | **Types and Units** |
| --- | --- |
| Create Linked Service | 2 Read/Write entity  |
| Create Datasets | 4 Read/Write entities (2 for dataset creation, 2 for linked service references) |
| Create Pipeline | 3 Read/Write entities (1 for pipeline creation, 2 for dataset references) |
| Get Pipeline | 1 Read/Write entity |
| Run Pipeline | 2 Activity runs (1 for trigger run, 1 for activity runs) |
| Data Flow Assumptions: execution time = 10 min + 10 min TTL | 10 \* 16 cores of General Compute with TTL of 10 |
| Monitor Pipeline Assumption: Only 1 run occurred | 2 Monitoring run records retrieved (1 for pipeline run, 1 for activity run) |

**Total Scenario pricing: $1.4631**

- Data Factory Operations = **$0.0001**
  - Read/Write = 10\*00001 = $0.0001 [1 R/W = $0.50/50000 = 0.00001]
  - Monitoring  = 2\*000005 = $0.00001 [1 Monitoring = $0.25/50000 = 0.000005]
- Pipeline Orchestration &amp; Execution = **$1.463**
  - Activity Runs = 001\*2 = 0.002 [1 run = $1/1000 = 0.001]
  - Data Flow Activities = $1.461 prorated for 20 minutes (10 mins execution time + 10 mins TTL). $0.274/hour on Azure Integration Runtime with 16 cores general compute

## Data integration in Azure Data Factory Managed VNET
In this scenario, you want to delete original files on Azure Blob Storage and copy data from Azure SQL Database to Azure Blob Storage. You will do this execution twice on different pipelines. The execution time of these two pipelines is overlapping.
![Scenario4](media/pricing-concepts/scenario-4.png)
To accomplish the scenario, you need to create two pipelines with the following items:
  - A pipeline activity – Delete Activity.
  - A copy activity with an input dataset for the data to be copied from Azure Blob storage.
  - An output dataset for the data on Azure SQL Database.
  - A schedule triggers to execute the pipeline.


| **Operations** | **Types and Units** |
| --- | --- |
| Create Linked Service | 4 Read/Write entity |
| Create Datasets | 8 Read/Write entities (4 for dataset creation, 4 for linked service references) |
| Create Pipeline | 6 Read/Write entities (2 for pipeline creation, 4 for dataset references) |
| Get Pipeline | 2 Read/Write entity |
| Run Pipeline | 6 Activity runs (2 for trigger run, 4 for activity runs) |
| Execute Delete Activity: each execution time = 5 min. The Delete Activity execution in first pipeline is from 10:00 AM UTC to 10:05 AM UTC. The Delete Activity execution in second pipeline is from 10:02 AM UTC to 10:07 AM UTC.|Total 7 min pipeline activity execution in Managed VNET. Pipeline activity supports up to 50 concurrency in Managed VNET. |
| Copy Data Assumption: each execution time = 10 min. The Copy execution in first pipeline is from 10:06 AM UTC to 10:15 AM UTC. The Delete Activity execution in second pipeline is from 10:08 AM UTC to 10:17 AM UTC. | 10 * 4 Azure Integration Runtime (default DIU setting = 4) For more information on data integration units and optimizing copy performance, see [this article](copy-activity-performance.md) |
| Monitor Pipeline Assumption: Only 2 runs occurred | 6 Monitoring run records retrieved (2 for pipeline run, 4 for activity run) |


**Total Scenario pricing: $0.45523**

- Data Factory Operations = $0.00023
  - Read/Write = 20*00001 = $0.0002 [1 R/W = $0.50/50000 = 0.00001]
  - Monitoring = 6*000005 = $0.00003 [1 Monitoring = $0.25/50000 = 0.000005]
- Pipeline Orchestration & Execution = $0.455
  - Activity Runs = 0.001*6 = 0.006 [1 run = $1/1000 = 0.001]
  - Data Movement Activities = $0.333 (Prorated for 10 minutes of execution time. $0.25/hour on Azure Integration Runtime)
  - Pipeline Activity = $0.116 (Prorated for 7 minutes of execution time. $1/hour on Azure Integration Runtime)

> [!NOTE]
> These prices are for example purposes only.

**FAQ**

Q: If I would like to run more than 50 pipeline activities, can these activities be executed simultaneously?

A: Max 50 concurrent pipeline activities will be allowed.  The 51th pipeline activity will be queued until a “free slot” is opened up. 
Same for external activity. Max 800 concurrent external activities will be allowed.

## Next steps

Now that you understand the pricing for Azure Data Factory, you can get started!

- [Create a data factory by using the Azure Data Factory UI](quickstart-create-data-factory-portal.md)

- [Introduction to Azure Data Factory](introduction.md)

- [Visual authoring in Azure Data Factory](author-visually.md)
