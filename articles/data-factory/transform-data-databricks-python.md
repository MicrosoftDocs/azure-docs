---
title: Transform data with Databricks Python 
description: Learn how to process or transform data by running a Databricks Python activity in an Azure Data Factory pipeline.
ms.service: data-factory
ms.topic: conceptual
ms.date: 03/15/2018
author: nabhishek
ms.author: abnarain
ms.custom: devx-track-python
---
# Transform data by running a Python activity in Azure Databricks
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The Azure Databricks Python Activity in a [Data Factory pipeline](concepts-pipelines-activities.md) runs a Python file in your Azure Databricks cluster. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities. Azure Databricks is a managed platform for running Apache Spark.

For an eleven-minute introduction and demonstration of this feature, watch the following video:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Execute-Jars-and-Python-scripts-on-Azure-Databricks-using-Data-Factory/player]

## Databricks Python activity definition

Here is the sample JSON definition of a Databricks Python Activity:

```json
{
    "activity": {
        "name": "MyActivity",
        "description": "MyActivity description",
        "type": "DatabricksSparkPython",
        "linkedServiceName": {
            "referenceName": "MyDatabricksLinkedservice",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "pythonFile": "dbfs:/docs/pi.py",
            "parameters": [
                "10"
            ],
            "libraries": [
                {
                    "pypi": {
                        "package": "tensorflow"
                    }
                }
            ]
        }
    }
}
```

## Databricks Python activity properties

The following table describes the JSON properties used in the JSON
definition:

|Property|Description|Required|
|---|---|---|
|name|Name of the activity in the pipeline.|Yes|
|description|Text describing what the activity does.|No|
|type|For Databricks Python Activity, the activity type is  DatabricksSparkPython.|Yes|
|linkedServiceName|Name of the Databricks Linked Service on which the Python activity runs. To learn about this linked service, see [Compute linked services](compute-linked-services.md) article.|Yes|
|pythonFile|The URI of the Python file to be executed. Only DBFS paths are supported.|Yes|
|parameters|Command line parameters that will be passed to the Python file. This is an array of strings.|No|
|libraries|A list of libraries to be installed on the cluster that will execute the job. It can be an array of <string, object>|No|

## Supported libraries for databricks activities

In the above Databricks activity definition you specify these library types: *jar*, *egg*, *maven*, *pypi*, *cran*.

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

For more details refer [Databricks documentation](/azure/databricks/dev-tools/api/latest/libraries#managedlibrarieslibrary) for library types.

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
