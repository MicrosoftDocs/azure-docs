---
title: Transform data with Databricks Notebook 
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to process or transform data by running a Databricks notebook in Azure Data Factory and Synapse Analytics pipelines.
ms.service: data-factory
ms.subservice: tutorials
ms.custom: synapse
author: nabhishek
ms.author: abnarain
ms.topic: conceptual
ms.date: 08/10/2023
---

# Transform data by running a Databricks notebook
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The Azure Databricks Notebook Activity in a [pipeline](concepts-pipelines-activities.md) runs a Databricks notebook in your Azure Databricks workspace. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities. Azure Databricks is a managed platform for running Apache Spark.

You can create a Databricks notebook with an ARM template using JSON, or directly through the Azure Data Factory Studio user interface.  For a step-by-step walkthrough of how to create a Databricks notebook activity using the user interface, reference the tutorial [Run a Databricks notebook with the Databricks Notebook Activity in Azure Data Factory](transform-data-using-databricks-notebook.md).

## Add a Notebook activity for Azure Databricks to a pipeline with UI

To use a Notebook activity for Azure Databricks in a pipeline, complete the following steps:

1. Search for _Notebook_ in the pipeline Activities pane, and drag a Notebook activity to the pipeline canvas.
1. Select the new Notebook activity on the canvas if it is not already selected.
1. Select the  **Azure Databricks** tab to select or create a new Azure Databricks linked service that will execute the Notebook activity.

   :::image type="content" source="media/transform-data-databricks-notebook/notebook-activity.png" alt-text="Shows the UI for a Notebook activity.":::

1. Select the **Settings** tab and specify the notebook path to be executed on Azure Databricks, optional base parameters to be passed to the notebook, and any additional libraries to be installed on the cluster to execute the job.

   :::image type="content" source="media/transform-data-databricks-notebook/notebook-settings.png" alt-text="Shows the UI for the Settings tab for a Notebook activity.":::

## Databricks Notebook activity definition

Here is the sample JSON definition of a Databricks Notebook Activity:

```json
{
    "activity": {
        "name": "MyActivity",
        "description": "MyActivity description",
        "type": "DatabricksNotebook",
        "linkedServiceName": {
            "referenceName": "MyDatabricksLinkedservice",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "notebookPath": "/Users/user@example.com/ScalaExampleNotebook",
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

## Databricks Notebook activity properties

The following table describes the JSON properties used in the JSON
definition:

|Property|Description|Required|
|---|---|---|
|name|Name of the activity in the pipeline.|Yes|
|description|Text describing what the activity does.|No|
|type|For Databricks Notebook Activity, the activity type is DatabricksNotebook.|Yes|
|linkedServiceName|Name of the Databricks Linked Service on which the Databricks notebook runs. To learn about this linked service, see [Compute linked services](compute-linked-services.md) article.|Yes|
|notebookPath|The absolute path of the notebook to be run in the Databricks Workspace. This path must begin with a slash.|Yes|
|baseParameters|An array of Key-Value pairs. Base parameters can be used for each activity run. If the notebook takes a parameter that is not specified, the default value from the notebook will be used. Find more on parameters in [Databricks Notebooks](https://docs.databricks.com/api/latest/jobs.html#jobsparampair).|No|
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

## Passing parameters between notebooks and pipelines

You can pass parameters to notebooks using *baseParameters* property in databricks activity.

In certain cases, you might require to pass back certain values from notebook back to the service, which can be used for control flow (conditional checks) in the service or be consumed by downstream activities (size limit is 2 MB).

1. In your notebook, you may call [dbutils.notebook.exit("returnValue")](/azure/databricks/notebooks/notebook-workflows#notebook-workflows-exit) and corresponding "returnValue" will be returned to the service.

2. You can consume the output in the service by using expression such as `@{activity('databricks notebook activity name').output.runOutput}`. 

   > [!IMPORTANT]
   > If you are passing JSON object you can retrieve values by appending property names. Example: `@{activity('databricks notebook activity name').output.runOutput.PropertyName}`

## How to upload a library in Databricks

### You can use the Workspace UI:

1. [Use the Databricks workspace UI](/azure/databricks/libraries/#create-a-library)

2. To obtain the dbfs path of the library added using UI, you can use [Databricks CLI](/azure/databricks/dev-tools/cli/#install-the-cli).

   Typically the Jar libraries are stored under dbfs:/FileStore/jars while using the UI. You can list all through the CLI: *databricks fs ls dbfs:/FileStore/job-jars*

### Or you can use the Databricks CLI:

1. Follow [Copy the library using Databricks CLI](/azure/databricks/dev-tools/cli/#copy-a-file-to-dbfs)

2. Use Databricks CLI [(installation steps)](/azure/databricks/dev-tools/cli/#install-the-cli)

   As an example, to copy a JAR to dbfs:
   `dbfs cp SparkPi-assembly-0.1.jar dbfs:/docs/sparkpi.jar`
