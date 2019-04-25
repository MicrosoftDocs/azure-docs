---
title: Transform data with Databricks Notebook - Azure | Microsoft Docs
description: Learn how to process or transform data by running a Databricks notebook.
services: data-factory
documentationcenter: ''
ms.assetid: 
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 03/15/2018
author: sharonlo101
ms.author: shlo
manager: craigg
---
# Transform data by running a Databricks notebook

The Azure Databricks Notebook Activity in a [Data Factory pipeline](concepts-pipelines-activities.md) runs a Databricks notebook in your Azure Databricks workspace. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities. Azure Databricks is a managed platform for running Apache Spark.

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

In the above Databricks activity definition, you specify these library types: *jar*, *egg*, *maven*, *pypi*, *cran*.

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

For more details, see the [Databricks documentation](https://docs.azuredatabricks.net/api/latest/libraries.html#managedlibrarieslibrary) for library types.

## How to upload a library in Databricks

#### [Using Databricks workspace UI](https://docs.azuredatabricks.net/user-guide/libraries.html#create-a-library)

To obtain the dbfs path of the library added using UI, you can use the [Databricks CLI (installation)](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#install-the-cli). 

Typically, the Jar libraries are stored under dbfs:/FileStore/jars while using the UI. You can list all through the CLI: *databricks fs ls dbfs:/FileStore/jars*.



#### [Copy library using Databricks CLI](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#copy-a-file-to-dbfs)

Example: *databricks fs cp SparkPi-assembly-0.1.jar dbfs:/FileStore/jars*
