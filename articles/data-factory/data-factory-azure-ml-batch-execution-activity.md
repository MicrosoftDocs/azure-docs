<properties 
	pageTitle="Create predictive pipelines using Azure Machine Learning Bach Execution activity | Microsoft Azure" 
	description="Describes how to create create predictive pipelines using Azuer Data Factory and Azure Machine Learning" 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/24/2015" 
	ms.author="spelluru"/>

# Create predictive pipelines using Azure Machine Learning Batch Execution activity   
## Overview

> [AZURE.NOTE] See [Introduction to Azure Data Factory](data-factory-introduction.md) and [Build your first pipeline](data-factory-build-your-first-pipeline.md) articles to quickly get started with the Azure Data Factory service.

Azure Data Factory enables you to easily create pipelines that leverage a published [Azure Machine Learning][azure-machine-learning] web service for predictive analytics. Using Azure Data Factory, you can make use of big data pipelines (e.g. Pig and Hive) to process the data that you have ingested from various data sources, and use the Azure Machine Learning web services to make predictions on the data in batch. 

You use Azure Data Factory to orchestrate  data movement and processing, and then perform batch execution using Azure Machine Learning. To achieve this, you will need to do the following:

1. Create an Azure Machne Learning linked service. You will require the following:
	1. **Request URI** for the Batch Execution API. You can find the Request URI by clicking on the **BATCH EXECUTION** link in the web services page (shown below).
	1. **API key** for the published Azure Machine Learning web service. You can find the API key by clicking on the web service that you have published. 
 2. Use the **AzureMLBatchExecution** activity.

	![Machine Learning Dashboard](./media/data-factory-azure-ml-batch-execution-activity/AzureMLDashboard.png)

	![Batch URI](./media/data-factory-azure-ml-batch-execution-activity/batch-uri.png)


## Scenario: Experiments using Web service inputs/outputs that refer to data in Azure Blob Storage
In this scenario, the Azure Machine Learning Web service makes predictions using data from a file in an Azure blob storage and stores the prediction results in the blob storage. The following JSON defines a Azure Data Factory pipeline with an AzureMLBatchExecution activity. The activity has the dataset **DecisionTreeInputBlob** as input and **DecisionTreeResultBlob** as the output. The **DecisionTreeInputBlob** is passed as an input to the Web service by using the **webServiceInput** JSON property and **DecisionTreeResultBlob** as an output to the Web service by using the **webServiceOutputs** JSON property. Only datasets that are inputs/outputs for the activity can be passed as Web service inputs and outputs.    


	{
	  "name": "PredictivePipeline",
	  "properties": {
	    "description": "use AzureML model",
	    "activities": [
	      {
	        "name": "MLActivity",
	        "type": "AzureMLBatchExecution",
	        "description": "prediction analysis on batch input",
	        "inputs": [
	          {
	            "name": "DecisionTreeInputBlob"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "DecisionTreeResultBlob"
	          }
	        ],
	        "linkedServiceName": "MyAzureMLLinkedService",
            "typeProperties":
            {
                "webServiceInput": "DecisionTreeInputBlob ",
                "webServiceOutputs": {
                    "output1": "DecisionTreeResultBlob "
                }                
            },
	        "policy": {
	          "concurrency": 3,
	          "executionPriorityOrder": "NewestFirst",
	          "retry": 1,
	          "timeout": "02:00:00"
	        }
	      }
	    ],
	    "start": "2015-02-13T00:00:00Z",
	    "end": "2015-02-14T00:00:00Z"
	  }
	}

> [AZURE.NOTE] Only inputs and outputs of the AzureMLBatchExecution activity can be passed as parameters to the Web service. For example, in the above JSON snippet, DecisionTreeInputBlob is an input to the AzureMLBatchExecution activity, which is passed as an input to the Web service via webServiceInput parameter.   

### Example

This example uses Azure Storage to hold both the input and output data. 

We recommend that you go through the [Build your first pipeline with Data Factory][adf-build-1st-pipeline] tutorial prior to going through this example and use the Data Factory Editor to create Data Factory artifacts (linked services, datasets, pipeline) in this example.   
 

1. Create a **linked service** for your **Azure Storage**. If the input and output files will be in different storage accounts, you will need two linked services. Here is a JSON example:

		{
		  "name": "StorageLinkedService",
		  "properties": {
		    "type": "AzureStorage",
		    "typeProperties": {
		      "connectionString": "DefaultEndpointsProtocol=https;AccountName=[acctName];AccountKey=[acctKey]"
		    }
		  }
		}

2. Create the **input** Azure Data Factory **dataset**. Note that unlike some other Data Factory datasets, these must both contain both **folderPath** and **fileName** values. You can use partitioning to cause each batch execution (each data slice) to process or produce unique input and output files. You will likely need to include some upstream activity to transform the input into the CSV file format and place it in the storage account for each slice. In that case, you would not include the **external** and **externalData** settings shown in the example below, and your DecisionTreeInputBlob would be the output dataset of a different Activity.

		{
		  "name": "DecisionTreeInputBlob",
		  "properties": {
		    "type": "AzureBlob",
		    "linkedServiceName": "StorageLinkedService",
		    "typeProperties": {
		      "folderPath": "azuremltesting/input",
		      "fileName": "in.csv",
		      "format": {
		        "type": "TextFormat",
		        "columnDelimiter": ","
		      }
		    },
		    "external": true,
		    "availability": {
		      "frequency": "Day",
		      "interval": 1
		    },
		    "policy": {
		      "externalData": {
		        "retryInterval": "00:01:00",
		        "retryTimeout": "00:10:00",
		        "maximumRetry": 3
		      }
		    }
		  }
		}
	
	Your input csv file must have the column header row. If you are using the **Copy Activity** to create/move the csv into the blob storage, you should set the sink property **blobWriterAddHeader** to **true**. For example:
	
	     sink: 
	     {
	         "type": "BlobSink",     
	         "blobWriterAddHeader": true 
	     }
	 
	If the csv file does not have the header row, you may see the following error: **Error in Activity: Error reading string. Unexpected token: StartObject. Path '', line 1, position 1**.
3. Create the **output** Azure Data Factory **dataset**. This example uses partitioning to create a unique output path for each slice execution. Without this, the activity would overwrite the file.

		{
		  "name": "DecisionTreeResultBlob",
		  "properties": {
		    "type": "AzureBlob",
		    "linkedServiceName": "StorageLinkedService",
		    "typeProperties": {
		      "folderPath": "azuremltesting/scored/{folderpart}/",
		      "fileName": "{filepart}result.csv",
		      "partitionedBy": [
		        {
		          "name": "folderpart",
		          "value": {
		            "type": "DateTime",
		            "date": "SliceStart",
		            "format": "yyyyMMdd"
		          }
		        },
		        {
		          "name": "filepart",
		          "value": {
		            "type": "DateTime",
		            "date": "SliceStart",
		            "format": "HHmmss"
		          }
		        }
		      ],
		      "format": {
		        "type": "TextFormat",
		        "columnDelimiter": ","
		      }
		    },
		    "availability": {
		      "frequency": "Day",
		      "interval": 15
		    }
		  }
		}

4. Create a **linked service** of type: **AzureMLLinkedService**, providing the API key and model batch execution URL.
		
		{
		  "name": "MyAzureMLLinkedService",
		  "properties": {
		    "type": "AzureML",
		    "typeProperties": {
		      "mlEndpoint": "https://[batch execution endpoint]/jobs",
		      "apiKey": "[apikey]"
		    }
		  }
		}
5. Finally, author a pipeline containing an **AzureMLBatchExecution** Activity. It will get the location of the input file from your input datasets, call the Azure Machine Learning batch execution API, and copy the batch execution output to the blob given in your output dataset. 

	> [AZURE.NOTE] AzureMLBatchExecution activity can have zero or more inputs and one or more outputs.

		{
		  "name": "PredictivePipeline",
		  "properties": {
		    "description": "use AzureML model",
		    "activities": [
		      {
		        "name": "MLActivity",
		        "type": "AzureMLBatchExecution",
		        "description": "prediction analysis on batch input",
		        "inputs": [
		          {
		            "name": "DecisionTreeInputBlob"
		          }
		        ],
		        "outputs": [
		          {
		            "name": "DecisionTreeResultBlob"
		          }
		        ],
		        "linkedServiceName": "MyAzureMLLinkedService",
                "typeProperties":
                {
                    "webServiceInput": "DecisionTreeInputBlob ",
                    "webServiceOutputs": {
                        "output1": "DecisionTreeResultBlob "
                    }                
                },
		        "policy": {
		          "concurrency": 3,
		          "executionPriorityOrder": "NewestFirst",
		          "retry": 1,
		          "timeout": "02:00:00"
		        }
		      }
		    ],
		    "start": "2015-02-13T00:00:00Z",
		    "end": "2015-02-14T00:00:00Z"
		  }
		}

	Both **start** and **end** datetimes must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The **end** time is optional. If you do not specify value for the **end** property, it is calculated as "**start + 48 hours**". To run the pipeline indefinitely, specify **9999-09-09** as the value for the **end** property. See [JSON Scripting Reference](https://msdn.microsoft.com/library/dn835050.aspx) for details about JSON properties.

	> [AZURE.NOTE] Specifying input for the AzureMLBatchExecution activity is optional. 

## Scenario: Experiments using Reader/Writer Modules to refer to data in various storages

Another common scenario when creating Azure ML experiments is to use Reader and Writer modules. The reader module is used to load data into an experiment and the writer module is to save data from your experiments. For details about reader and writer modules, see [Reader](https://msdn.microsoft.com/library/azure/dn905997.aspx) and [Writer](https://msdn.microsoft.com/library/azure/dn905984.aspx) topics on MSDN Library.     

When using the reader and writer modules, it is good practice to use a Web service parameter for each property of these reader/writer modules. These web parameters enable you to configure the values during runtime. For example, you could create an experiment with a reader module that uses an Azure SQL Database: XXX.database.windows.net. After the web service has been deployed, you want to enable the consumers of the web service to specify another Azure SQL Server called YYY.database.windows.net. You can use a Web service parameter to allow this value to be configured.

> [AZURE.NOTE] Web service input and output are different from Web service parameters. In the first scenario, you have seen how an input and output can be specified for an Azure ML Web service. In this scenario, you will pass parameters for a Web service that correspond to properties of reader/writer modules. 

Let's look at a scenario for using Web service parameters. You have a deployed Azure Machine Learning web service that is using a reader module to read data from one of the Azure Machine Learning supported data sources (for example: Azure SQL Database). After the batch execution is performed, the results are written using a Writer module (Azure SQL Database).  No web service inputs and outputs are defined in the experiments. In this case, we recommend that you setup the relevant Web service parameters for the reader and writer modules. This will allow the reader/writer modules to be configured when using the AzureMLBatchExecution activity. You specify Web service parameters in the **globalParameters** section in the activity JSON as follows. 


	"typeProperties": {
		"globalParameters": {
			"Param 1": "Value 1",
			"Param 2": "Value 2"
		}
	}

You can also use [Data Factory Functions](https://msdn.microsoft.com/library/dn835056.aspx) in passing values for the Web service parameters as shown in the following example:

	"typeProperties": {
    	"globalParameters": {
    	   "Database query": "$$Text.Format('SELECT * FROM myTable WHERE timeColumn = \\'{0:yyyy-MM-dd HH:mm:ss}\\'', Time.AddHours(WindowStart, 0))"
    	}
  	}
 
> [AZURE.NOTE] The Web service parameters are case-sensitive, so ensure that the names you specify in the activity JSON match the ones exposed by the Web service. 

### Using a Reader module to read data from multiple files in Azure Blob
Big data pipelines (Pig, Hive, etc...) can produce one or more output files with no extensions. For example, when you specify an external Hive table, the data for the external Hive table can be stored in Azure blob storage with the following name 000000_0. You can use the reader module in an experiment to read multiple files, and use them for predictions. 

When using the reader module in an Azure Machine Learning experiment, you can specify Azure Blob as an input. The files in the Azure blob storage can be the output files (e.g. 000000_0) that are produced by a Pig and Hive script running on HDInsight. The reader module allows you to read files (with no extensions) by configuring the **Path to container, directory or blob** property of the reader module to point to the container/folder that contains the files as shown below. Note, the asterisk (i.e. \*) **specifies that all the files in the container/folder (i.e. data/aggregateddata/year=2014/month-6/\*)** will be read as part of the experiment.

![Azure Blob properties](./media/data-factory-create-predictive-pipelines/azure-blob-properties.png)


### Example 
#### Pipeline with AzureMLBatchExecution activity with Web Service Parameters

	{
	  "name": "MLWithSqlReaderSqlWriter",
	  "properties": {
	    "description": "Azure ML model with sql azure reader/writer",
	    "activities": [
	      {
	        "name": "MLSqlReaderSqlWriterActivity",
	        "type": "AzureMLBatchExecution",
	        "description": "test",
	        "inputs": [
	          {
	            "name": "MLSqlInput"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "MLSqlOutput"
	          }
	        ],
	        "linkedServiceName": "MLSqlReaderSqlWriterDecisionTreeModel",
            "typeProperties":
            {
                "webServiceInput": "MLSqlInput",
                "webServiceOutputs": {
                    "output1": "MLSqlOutput"
                }
	          	"globalParameters": {
	            	"Database server name": "<myserver>.database.windows.net",
		            "Database name": "<database>",
		            "Server user account name": "<user name>",
		            "Server user account password": "<password>"
	          	}              
            },
	        "policy": {
	          "concurrency": 1,
	          "executionPriorityOrder": "NewestFirst",
	          "retry": 1,
	          "timeout": "02:00:00"
	        },
	      }
	    ],
	    "start": "2015-02-13T00:00:00Z",
	    "end": "2015-02-14T00:00:00Z"
	  }
	}
 
In the above JSON example:

- The deployed Azure Machine Learning Web service uses a reader and a writer module to read/write data from/to an Azure SQL Database. This Web service exposes the following four parameters:  Database server name, Database name, Server user account name, and Server user account password.  
- Both **start** and **end** datetimes must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The **end** time is optional. If you do not specify value for the **end** property, it is calculated as "**start + 48 hours**". To run the pipeline indefinitely, specify **9999-09-09** as the value for the **end** property. See [JSON Scripting Reference](https://msdn.microsoft.com/library/dn835050.aspx) for details about JSON properties.
 

## Frequently asked questions

**Q:** I am using the AzureMLBatchScoring activity. Should I switch to using the AzureMLBatchExecution Activity?

**A:** Yes. If you are using the AzureMLBatchScoring activity to integrate with Azure Machine Learning, we recommend that you use the latest AzureMLBatchExecution activity. We are deprecating the AzureMLBatchScoring activity, and it will be removed in a future release.

The AzureMLBatchExecution activity is introduced in the August 2015 release of Azure SDK and Azure PowerShell.

The AzureMLBatchExecution activity does not require an input (if input dependencies are not needed). It also allows you to be explicit about whether you want to use the Web service input and Web service output or not use them. If you do choose to use Web service input/output, it enables you to specify the relevant Azure Blob datasets to be used.In addition, it allows you to clearly specify the values for the web service parameters that are provided by the web service.

If you want to continue using the AzureMLBatchScoring activity, please refer to [Azure ML Batch Scoring Activity](data-factory-create-predictive-pipelines.md) article for details.


**Q:** I have multiple files that are generated by my big data pipelines. Can I use the AzureMLBatchExecution Activity to work on all the files?

**A:** Yes. See the **Using a Reader module to read data from multiple files in Azure Blob** section for details. 


## See Also

- [Azure blog post: Getting started with Azure Data Factory and Azure Machine Learning](https://azure.microsoft.com/blog/getting-started-with-azure-data-factory-and-azure-machine-learning-4/)





[adf-build-1st-pipeline]: data-factory-build-your-first-pipeline.md

[azure-machine-learning]: http://azure.microsoft.com/services/machine-learning/


 
