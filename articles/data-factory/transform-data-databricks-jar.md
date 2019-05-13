---
title: Transform data with Databricks Jar - Azure | Microsoft Docs
description: Learn how to process or transform data by running a Databricks Jar.
services: data-factory
documentationcenter: ''
ms.assetid: 
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 03/15/2018
author: nabhishek
ms.author: abnarain
manager: craigg
---
# Transform data by running a Jar activity in Azure Databricks

The Azure Databricks Jar Activity in a [Data Factory pipeline](concepts-pipelines-activities.md) runs a Spark Jar in your Azure Databricks cluster. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities. Azure Databricks is a managed platform for running Apache Spark.

For an eleven-minute introduction and demonstration of this feature, watch the following video:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Execute-Jars-and-Python-scripts-on-Azure-Databricks-using-Data-Factory/player]

## Databricks Jar activity definition

Here is the sample JSON definition of a Databricks Jar Activity:

```json
{
    "name": "SparkJarActivity",
    "type": "DatabricksSparkJar",
    "linkedServiceName": {
        "referenceName": "AzureDatabricks",
        "type": "LinkedServiceReference"
    },
    "typeProperties": {
        "mainClassName": "org.apache.spark.examples.SparkPi",
        "parameters": [ "10" ],
        "libraries": [
            {
                "jar": "dbfs:/docs/sparkpi.jar"
            }
        ]
    }
}

```

## Databricks Jar activity properties

The following table describes the JSON properties used in the JSON
definition:

|Property|Description|Required|
|:--|---|:-:|
|name|Name of the activity in the pipeline.|Yes|
|description|Text describing what the activity does.|No|
|type|For Databricks Jar Activity, the activity type is DatabricksSparkJar.|Yes|
|linkedServiceName|Name of the Databricks Linked Service on which the Jar activity runs. To learn about this linked service, see [Compute linked services](compute-linked-services.md) article.|Yes|
|mainClassName|The full name of the class containing the main method to be executed. This class must be contained in a JAR provided as a library.|Yes|
|parameters|Parameters that will be passed to the main method.  This is an array of strings.|No|
|libraries|A list of libraries to be installed on the cluster that will execute the job. It can be an array of <string, object>|Yes (at least one containing the mainClassName method)|

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

For more details refer [Databricks documentation](https://docs.azuredatabricks.net/api/latest/libraries.html#managedlibrarieslibrary) for library types.

## How to upload a library in Databricks

#### [Using Databricks workspace UI](https://docs.azuredatabricks.net/user-guide/libraries.html#create-a-library)

To obtain the dbfs path of the library added using UI, you can use [Databricks CLI (installation)](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#install-the-cli). 

Typically the Jar libraries are stored under dbfs:/FileStore/jars while using the UI. You can list all through the CLI: *databricks fs ls dbfs:/FileStore/job-jars* 



#### [Copy library using Databricks CLI](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#copy-a-file-to-dbfs)
Use Databricks CLI [(installation steps)](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#install-the-cli). 

Example - copying JAR to dbfs: *dbfs cp SparkPi-assembly-0.1.jar dbfs:/docs/sparkpi.jar*
