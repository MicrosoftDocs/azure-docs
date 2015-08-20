<properties 
	pageTitle="Data Factory - Create Predictive Pipelines using Data Factory and Machine Learning | Microsoft Azure" 
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
	ms.date="08/19/2015" 
	ms.author="spelluru"/>

# Use Azure Machine Learning Bach Execution activity to create predictive pipelines 
## Overview

Azure Data Factory enables you to easily create pipelines that leverage a published [Azure Machine Learning][azure-machine-learning] web service for predictive analytics. Using Azure Data Factory, you can make use of big data pipelines (e.g. Pig and Hive) to process the data that you have ingested from various data sources, and use the Azure Machine Learning web services to make predictions on the data in batch. 

This enables you to use Azure Data Factory to orchestrate  data movement and processing, and then perform batch execution using Azure Machine Learning. To achieve this, you will need to do the following:

1. Use the **AzureMLBatchExecution** activity.
2. **Request URI** for the Batch Execution API. You can find the Request URI by clicking on the **BATCH EXECUTION** link in the web services page (shown below).
3. **API key** for the published Azure Machine Learning web service. You can find this information by clicking on the web service that you have published. 

	![Machine Learning Dashboard](./media/data-factory-azure-ml-batch-execution-activity/AzureMLDashboard.png)

	![Batch URI](./media/data-factory-azure-ml-batch-execution-activity/batch-uri.png)


## Scenario 1

In this scenario, you have data in Azure Blob storage, and you want to use Azure Data Factory and Machine Learning to make predictions using the data in blob storage. To do this, you can specify the Azure storage used by using the **webServiceInput** and **webServiceOutputs** properties of the **AzureMLBatchExecution** activity.

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

## Scenario 2

You have data in other data sources (e.g. Azure SQL Database), and you want to use the Reader and Writer module to read and write data. 

In this case, you have a deployed Azure Machine Learning web service that is using the Reader module to read data from one of the Azure Machine Learning supported data sources. After the batch execution is performed, the results are written using a Writer module.  No web service inputs and outputs are defined in the experiments.

In this case, we recommend that you setup the relevant Web service parameters for the Reader and Writer modules. This will allow it to be configured when using the 
AzureMLBatchExecution activity. You specify Web service parameters in the globalParameters section as follows. 


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
 

## Frequently asked questions

**Q:** I am using the AzureMLBatchScoring activity. Should I switch to using the AzureMLBatchExecution Activity?

**A:** Yes. If you are using the AzureMLBatchScoring activity to integrate with Azure Machine Learning, we recommend that you use the latest AzureMLBatchExecution activity. We are deprecating the AzureMLBatchScoring activity, and it will be removed in a future release.

The AzureMLBatchExecution activity is introduced in the August 2015 release of Azure SDK and Azure PowerShell.

The AzureMLBatchExecution activity does not require an input (if input dependencies are not needed). It also allows you to be explicit about whether you want to use the Web service input and Web service output or not use them. If you do choose to use Web service input/output, it enables you to specify the relevant Azure Blob datasets to be used.In addition, it allows you to clearly specify the values for the web service parameters that are provided by the web service.

If you want to continue using the AzureMLBatchScoring activity, please refer to [Azure ML Batch Scoring Activity](data-factory-create-predictive-pipelines.md) article for details.


**Q:** I have multiple files that are generated by my big data pipelines. Can I use the AzureMLBatchExecution Activity to work on all the files?

**A:** Show the section on “Using a Reader module to read data from multiple files in Azure Blob”.





## Example

A **predictive pipeline** has these parts:

-	Input and output tables
-	Azure Storage/Azure SQL and Azure ML linked services
-	A pipeline with Azure ML Batch Execution Activity

This example uses Azure Storage to hold both the input and output data. You can also use Azure SQL Database instead of using Azure Storage. 

We recommend that you go through the [Build your first pipeline with Data Factory][adf-build-1st-pipeline] tutorial prior to going through this example and use the Data Factory Editor to create Data Factory artifacts (linked services, tables, pipeline) in this example.   
 

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

2. Create the **input** Azure Data Factory **table**. Note that unlike some other Data Factory tables, these must both contain both **folderPath** and **fileName** values. You can use partitioning to cause each batch execution (each data slice) to process or produce unique input and output files. You will likely need to include some upstream activity to transform the input into the CSV file format and place it in the storage account for each slice. In that case, you would not include the **external** and **externalData** settings shown in the example below, and your DecisionTreeInputBlob would be the output table of a different Activity.

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
3. Create the **output** Azure Data Factory **table**. This example uses partitioning to create a unique output path for each slice execution. Without this, the activity would overwrite the file.

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
5. Finally, author a pipeline containing an **AzureMLBatchExecution** Activity. It will get the location of the input file from your input tables, call the AzureML batch execution API, and copy the batch execution output to the blob given in your output table. Unlike some other Data Factory activities, AzureMLBatchExecution activity can have only one input and one output table.

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



### Reader and Writer Modules

A common scenario for using Web service parameters is the use of Azure SQL Readers and Writers. The reader module is used to load data into an experiment from data management services outside Azure Machine Learning Studio and the writer module is to save data from your experiments into data management services outside Azure Machine Learning Studio.  
For details about Azure Blob/Azure SQL reader/writer, see [Reader](https://msdn.microsoft.com/library/azure/dn905997.aspx) and [Writer](https://msdn.microsoft.com/library/azure/dn905984.aspx) topics on MSDN Library. The example in the previous section used the Azure Blob reader and Azure Blob writer. This section discusses using Azure SQL reader and Azure SQL writer.  

#### Azure Blob as a source

When using the Reader module in an Azure Machine Learning experiment, you can specify Azure Blob as an input. The files in the Azure blob storage can be the output files (e.g. 000000_0) that are produced by a Pig and Hive script running on HDInsight. The Reader module allows you to read files (with no extensions) by configuring the **Path to container, directory or blob** property of the reader module to point to the container/folder that contains the files as shown below. Note, the asterisk (i.e. \*) **specifies that all the files in the container/folder (i.e. data/aggregateddata/year=2014/month-6/\*)** will be read as part of the experiment.

![Azure Blob properties](./media/data-factory-create-predictive-pipelines/azure-blob-properties.png)

### Example of using Web service parameters
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
	            	"Database server name1": "output.database.windows.net",
		            "Database name1": "outputDatabase",
		            "Server user account name1": "outputUser",
		            "Server user account password1": "outputPassword",
		            "Comma separated list of columns to be saved": "CustID, Scored Labels, Scored Probabilities",
		            "Data table name": "BikeBuyerPredicted"
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

- The Azure ML model uses both Azure SQL Reader and Azure SQL Writer
- When exposed via Web service, the default names are used for the parameters
	- For the **reader**: Database server name, Database name, Server user account name, and Server user account password.
	- For the **writer**: Database server name1, Database name1, Server user account name1, and Server user account password1.
	
		Note that the reader and writer do not share parameters in this case.  
- The Data Factory service automatically generates values for Web service parameters with the names **Database server name**, **Database name**, **Server user account name**, and **Server user account password**, which match the names of the input reader. Therefore, you do not need to explicitly pass the values for these parameters via **globalParameters** in the activity JSON below.  
- The parameters for writer (the ones with '1' suffix) are not automatically filled in by the Data Factory service. Therefore, you need to specify values for these parameters in the **globalParameters** section of the activity JSON.  
- **Customer ID**, **scored labels**, and **scored probabilities** are saved as comma separated columns. 
- The **Data table name** in this example corresponds to a table in the output database.
- Both **start** and **end** datetimes must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The **end** time is optional. If you do not specify value for the **end** property, it is calculated as "**start + 48 hours**". To run the pipeline indefinitely, specify **9999-09-09** as the value for the **end** property. See [JSON Scripting Reference](https://msdn.microsoft.com/library/dn835050.aspx) for details about JSON properties.


[adf-build-1st-pipeline]: data-factory-build-your-first-pipeline.md

[azure-machine-learning]: http://azure.microsoft.com/services/machine-learning/


 
