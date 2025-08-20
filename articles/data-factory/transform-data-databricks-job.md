---
title: Transform data with Databricks Job
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to process or transform data by running a Databricks job in Azure Data Factory pipelines.
ms.custom: synapse
author: n0elleli
ms.author: noelleli
ms.reviewer: whhender
ms.topic: how-to
ms.date: 04/24/2025
ms.subservice: orchestration
---

# Transform data by running a Databricks job

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-xxx-md.md)]

The Azure Databricks Job Activity (Preview) in a [pipeline](concepts-pipelines-activities.md) runs Databricks jobs in your Azure Databricks workspace, including serverless jobs. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities. Azure Databricks is a managed platform for running Apache Spark.

You can create a Databricks job directly through the Azure Data Factory Studio user interface.

> [!IMPORTANT]
> The Azure Databricks Jobs activity is currently in preview. This information relates to a pre-release product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

## Add a Job activity for Azure Databricks to a pipeline with UI

To use a Job activity for Azure Databricks in a pipeline, complete the following steps:

1. Search for _Job_ in the pipeline Activities pane, and drag a Job activity to the pipeline canvas.
1. Select the new Job activity on the canvas if it isn't already selected.
1. Select the  **Azure Databricks** tab to select or create a new Azure Databricks linked service that executes the Job activity.

   :::image type="content" source="media/transform-data-databricks-job/job-activity.png" lightbox="media/transform-data-databricks-job/job-activity.png" alt-text="Screenshot of the UI for a Job activity, with the Azure Databricks tab highlighted.":::
   
1. Select the **Settings** tab and specify the job to be executed on Azure Databricks, optional base parameters to be passed to the job, and any other libraries to be installed on the cluster to execute the job.

    :::image type="content" source="media/transform-data-databricks-job/job-settings.png" lightbox="media/transform-data-databricks-job/job-settings.png" alt-text="Screenshot of the UI for a Job activity, with the Settings tab highlighted.":::

## Databricks Job activity definition

Here's the sample JSON definition of a Databricks Job Activity:

```json
{
    "activity": {
        "name": "MyActivity",
        "description": "MyActivity description",
        "type": "DatabricksJob",
        "linkedServiceName": {
            "referenceName": "MyDatabricksLinkedservice",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "jobID": "012345678910112",
            "jobParameters": {
                "testParameter": "testValue"
            },
        }
    }
}
```

## Databricks Job activity properties

The following table describes the JSON properties used in the JSON
definition:

|Property|Description|Required|
|---|---|---|
|name|Name of the activity in the pipeline.|Yes|
|description|Text describing what the activity does.|No|
|type|For Databricks Job Activity, the activity type is DatabricksJob.|Yes|
|linkedServiceName|Name of the Databricks Linked Service on which the Databricks job runs. To learn about this linked service, see [Compute linked services](compute-linked-services.md) article.|Yes|
|jobId|The ID of the job to be run in the Databricks Workspace.|Yes|
|jobParameters|An array of Key-Value pairs. Job parameters can be used for each activity run. If the job takes a parameter that isn't specified, the default value from the job will be used. Find more on parameters in [Databricks Jobs](https://docs.databricks.com/api/latest/jobs.html#jobsparampair).|No|


## Passing parameters between jobs and pipelines

You can pass parameters to jobs using *jobParameters* property in Databricks activity.

> [!NOTE]
> Job parameters are only supported in Self-hosted IR version 5.52.0.0 or greater.

