---
title: Transform data with Databricks Job
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to process or transform data by running a Databricks job in Azure Data Factory and Synapse Analytics pipelines.
ms.custom: synapse
author: n0elleli
ms.author: noelleli
ms.reviewer: whhender
ms.topic: how-to
ms.date: 04/24/2025
ms.subservice: orchestration
---

# Transform data by running a Databricks job

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The Azure Databricks Job Activity in a [pipeline](concepts-pipelines-activities.md) runs a Databricks job in your Azure Databricks workspace. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities. Azure Databricks is a managed platform for running Apache Spark.

You can create a Databricks job with an ARM template using JSON, or directly through the Azure Data Factory Studio user interface.

## Add a Job activity for Azure Databricks to a pipeline with UI

To use a Job activity for Azure Databricks in a pipeline, complete the following steps:

1. Search for _Job_ in the pipeline Activities pane, and drag a Job activity to the pipeline canvas.
1. Select the new Job activity on the canvas if it isn't already selected.
1. Select the  **Azure Databricks** tab to select or create a new Azure Databricks linked service that execute the Job activity.
1. Select the **Settings** tab and specify the job path to be executed on Azure Databricks, optional base parameters to be passed to the job, and any other libraries to be installed on the cluster to execute the job.

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
            "jobPath": "/Users/user@example.com/ScalaExampleJob",
            "baseParameters": {
                "inputpath": "input/folder1/",
                "outputpath": "output/"
            },
            "libraries": [
                {
                "jar": "dbfs:/docs/library.jar"
                }
            ]
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
|jobPath|The absolute path of the job to be run in the Databricks Workspace. This path must begin with a slash.|Yes|
|baseParameters|An array of Key-Value pairs. Base parameters can be used for each activity run. If the job takes a parameter that isn't specified, the default value from the job will be used. Find more on parameters in [Databricks Jobs](https://docs.databricks.com/api/latest/jobs.html#jobsparampair).|No|
|libraries|A list of libraries to be installed on the cluster that will execute the job. It can be an array of \<string, object>.|No|

## Supported libraries for Databricks activities

In the above Databricks activity definition, you specify these library types: *jar*, *egg*, *whl*, *maven*, *pypi*, *cran*.

```json
{
    "libraries": [
        {
            "jar": "dbfs:/mnt/libraries/library.jar"
        },
        {
            "egg": "dbfs:/mnt/libraries/library.egg"
        },
        {
            "whl": "dbfs:/mnt/libraries/mlflow-0.0.1.dev0-py2-none-any.whl"
        },
        {
            "whl": "dbfs:/mnt/libraries/wheel-libraries.wheelhouse.zip"
        },
        {
            "maven": {
                "coordinates": "org.jsoup:jsoup:1.7.2",
                "exclusions": [ "slf4j:slf4j" ]
            }
        },
        {
            "pypi": {
                "package": "simplejson",
                "repo": "http://my-pypi-mirror.com"
            }
        },
        {
            "cran": {
                "package": "ada",
                "repo": "https://cran.us.r-project.org"
            }
        }
    ]
}

```

For more information, see the [Databricks documentation](/azure/databricks/dev-tools/api/latest/libraries#managedlibrarieslibrary) for library types.

## Passing parameters between jobs and pipelines

You can pass parameters to jobs using *baseParameters* property in databricks activity.

In certain cases, you might require to pass back certain values from job back to the service, which can be used for control flow (conditional checks) in the service or be consumed by downstream activities (size limit is 2 MB).

1. In your job, you can call [dbutils.job.exit("returnValue")](/azure/databricks/jobs/job-workflows#python-1) and corresponding "returnValue" will be returned to the service.

1. You can consume the output in the service by using expression such as `@{activity('databricks job activity name').output.runOutput}`. 

   > [!IMPORTANT]
   > If you're passing JSON object, you can retrieve values by appending property names. Example: `@{activity('databricks job activity name').output.runOutput.PropertyName}`

## How to upload a library in Databricks

### You can use the Workspace UI:

1. [Use the Databricks workspace UI](/azure/databricks/libraries/cluster-libraries#install-a-library-on-a-cluster)

2. To obtain the dbfs path of the library added using UI, you can use [Databricks CLI](/azure/databricks/dev-tools/cli/fs-commands#list-the-contents-of-a-directory).

   Typically the Jar libraries are stored under dbfs:/FileStore/jars while using the UI. You can list all through the CLI: *databricks fs ls dbfs:/FileStore/job-jars*

### Or you can use the Databricks CLI:

1. Follow [Copy the library using Databricks CLI](/azure/databricks/dev-tools/cli/fs-commands#copy-a-directory-or-a-file)

2. Use Databricks CLI [(installation steps)](/azure/databricks/dev-tools/cli/commands#compute-commands)

   As an example, to copy a JAR to dbfs:
   `dbfs cp SparkPi-assembly-0.1.jar dbfs:/docs/sparkpi.jar`
