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
	ms.date="08/04/2015" 
	ms.author="spelluru"/>

# Create Predictive Pipelines using Azure Data Factory and Azure Machine Learning 
## Overview

> [AZURE.NOTE] See [Create predictive pipelines using Azure Machine Learning Batch Execution activity](data-factory-azure-ml-batch-execution-activity.md) article to learn about the new Machine Learning Batch Execution activity, which provides more flexibility than the Batch Scoring activity covered by this article.  

Azure Data Factory enables you to easily create pipelines that leverages a published [Azure Machine Learning][azure-machine-learning] web service for predictive analytics. This enables you to use Azure Data Factory to orchestrate  data movement and processing, and then perform batch scoring using Azure Machine Learning. To achieve this, you will need to do the following:

1. Use the **AzureMLBatchScoring** activity.
2. **Request URI** for the Batch Execution API. You can find the Request URI by clicking on the **BATCH EXECUTION** link in the web services page (shown below).
3. **API key** for the published Azure Machine Learning web service. You can find this information by clicking on the web service that you have published. 

	![Machine Learning Dashboard][machine-learning-dashboard]

A **predictive pipeline** has these parts:

-	Input and output tables
-	Azure Storage/Azure SQL and Azure ML linked services
-	A pipeline with Azure ML Batch Scoring Activity

> [AZURE.NOTE] You can use Web service parameters that are exposed by a published Azure Machine Learning Web service in Azure Data Factory (ADF) pipelines. For more information, see the Web Service Parameters section in this article.  

## Example
This example uses Azure Storage to hold both the input and output data. You can also use Azure SQL Database instead of using Azure Storage. 

We recommend that you go through the [Build your first pipeline with Data Factory][adf-build-1st-pipeline] tutorial prior to going through this example and use the Data Factory Editor to create Data Factory artifacts (linked services, tables, pipeline) in this example.   
 

1. Create a **linked service** for your **Azure Storage**. If the scoring input and output files will be in different storage accounts, you will need two linked services. Here is a JSON example:

		{
		  "name": "StorageLinkedService",
		  "properties": {
		    "type": "AzureStorage",
		    "typeProperties": {
		      "connectionString": "DefaultEndpointsProtocol=https;AccountName=[acctName];AccountKey=[acctKey]"
		    }
		  }
		}

2. Create the **input** Azure Data Factory **table**. Note that unlike some other Data Factory tables, these must both contain both **folderPath** and **fileName** values. You can use partitioning to cause each batch execution (each data slice) to process or produce unique input and output files. You will likely need to include some upstream activity to transform the input into the CSV file format and place it in the storage account for each slice. In that case, you would not include the **external** and **externalData** settings shown in the example below, and your ScoringInputBlob would be the output table of a different Activity.

		{
		  "name": "ScoringInputBlob",
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
	
	Your batch scoring csv file must have the column header row. If you are using the **Copy Activity** to create/move the csv into the blob storage, you should set the sink property **blobWriterAddHeader** to **true**. For example:
	
	     sink: 
	     {
	         "type": "BlobSink",     
	         "blobWriterAddHeader": true 
	     }
	 
	If the csv file does not have the header row, you may see the following error: **Error in Activity: Error reading string. Unexpected token: StartObject. Path '', line 1, position 1**.
3. Create the **output** Azure Data Factory **table**. This example uses partitioning to create a unique output path for each slice execution. Without this, the activity would overwrite the file.

		{
		  "name": "ScoringResultBlob",
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

4. Create a **linked service** of type: **AzureMLLinkedService**, providing the API key and model batch scoring URL.
		
		{
		  "name": "MyAzureMLLinkedService",
		  "properties": {
		    "type": "AzureML",
		    "typeProperties": {
		      "mlEndpoint": "https://[batch scoring endpoint]/jobs",
		      "apiKey": "[apikey]"
		    }
		  }
		}
5. Finally, author a pipeline containing an **AzureMLBatchScoringActivity**. It will get the location of the input file from your input tables, call the AzureML batch scoring API, and copy the batch scoring output to the blob given in your output table. Unlike some other Data Factory activities, AzureMLBatchScoringActivity can have only one input and one output table.

		{
		  "name": "PredictivePipeline",
		  "properties": {
		    "description": "use AzureML model",
		    "activities": [
		      {
		        "name": "MLActivity",
		        "type": "AzureMLBatchScoring",
		        "description": "prediction analysis on batch input",
		        "inputs": [
		          {
		            "name": "ScoringInputBlob"
		          }
		        ],
		        "outputs": [
		          {
		            "name": "ScoringResultBlob"
		          }
		        ],
		        "linkedServiceName": "MyAzureMLLinkedService",
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


## Web Service Parameters
You can use Web service parameters that are exposed by a published Azure Machine Learning Web service in Azure Data Factory (ADF) pipelines. You can create an experiment in Azure Machine Learning and publish it as a web service, and then use that web service in multiple ADF pipelines or activities, passing in different inputs via the Web Service Parameters.

### Passing values for Web service parameters
Add a **typeProperties** section to the **AzureMLBatchScoringActivty** section in the pipeline JSON to specify values for Web service parameters in that section as shown in the following example: 

	"typeProperties": {
		"webServiceParameters": {
			"Param 1": "Value 1",
			"Param 2": "Value 2"
		}
	}


You can also use [Data Factory Functions](https://msdn.microsoft.com/library/dn835056.aspx) in passing values for the Web service parameters as shown in the following example:

	"typeProperties": {
    	"webServiceParameters": {
    	   "Database query": "$$Text.Format('SELECT * FROM myTable WHERE timeColumn = \\'{0:yyyy-MM-dd HH:mm:ss}\\'', Time.AddHours(WindowStart, 0))"
    	}
  	}
 
> [AZURE.NOTE] The Web service parameters are case-sensitive, so ensure that the names you specify in the activity JSON match the ones exposed by the Web service. 

### Reader and Writer Modules

A common scenario for using Web service parameters is the use of Azure SQL Readers and Writers. The reader module is used to load data into an experiment from data management services outside Azure Machine Learning Studio and the writer module is to save data from your experiments into data management services outside Azure Machine Learning Studio.  
For details about Azure Blob/Azure SQL reader/writer, see [Reader](https://msdn.microsoft.com/library/azure/dn905997.aspx) and [Writer](https://msdn.microsoft.com/library/azure/dn905984.aspx) topics on MSDN Library. The example in the previous section used the Azure Blob reader and Azure Blob writer. This section discusses using Azure SQL reader and Azure SQL writer.  

#### Azure SQL as a data source
In Azure ML Studio, you can build an experiment and publish a Web service with an Azure SQL Reader for the input. The Azure SQL Reader has connection properties that can be exposed as Web service parameters, allowing values for the connection properties to be passed at runtime in the batch scoring request.

At runtime, the details from the input Data Factory table will be used by the Data Factory service to fill in the Web service parameters. Note that you must use default names (Database server name, Database name, Server user account name, Server user account password) for the Web service parameters for this integration with the Data Factory service to work.

If you have any additional Web service parameters, use the **webServiceParameters** section of the activity JSON. If you specify values for Azure SQL Reader parameters in this section, the values will override the values picked up from the input Azure SQL linked service. We do not recommend you specify values for Azure SQL Reader directly in the webServiceParameters section. Use the section to pass values for any additional parameters.       

To use an Azure SQL Reader via an Azure Data Factory pipeline, do the following: 

- Create an **Azure SQL linked service**. 
- Create a Data Factory **table** that uses **AzureSqlTable**.
- Set that Data Factory **table** as the **input** for the **AzureMLBatchScoringActivity** in the pipeline JSON. 



#### Azure SQL as a data sink
As with Azure SQL Reader, an Azure SQL Writer can also have its properties exposed as Web service parameters. An Azure SQL Writer uses settings from either the linked service associated with the input table or the output table. The following table describes when the input linked service is used vs. output linked service. 

| Output/Input | Input is Azure SQL | Input is Azure Blob |
| ------------ | ------------------ | ------------------- |
| Output is Azure SQL | <p>The Data Factory service uses the connection string information from the INPUT linked service to generate the web service parameters with names: "Database server name", "Database name", "Server user account name", "Server user account password". Note that you must use these default names for Web service parameters in Azure ML Studio.</p><p>If the Azure SQL Reader and Azure SQL Writer in your Azure ML model share the same Web service parameters mentioned above, you are fine. If they do not share same Web service paramers, for example, if the Azure SQL Writer uses parameters names: Database server name1, Database name1, Server user account name1, Server user account password1 (with '1' at the end), you must pass values for these OUTPUT web service parameters in the webServiceParameters section of activity JSON.</p><p>You can pass values for any other Web service parameters using the webServiceParameters section of activity JSON.</p> | <p>The Data Factory service uses the connection string information from the OUTPUT linked service to generate the web service parameters with names: "Database server name", "Database name", "Server user account name", "Server user account password". Note that you must use these default names for Web service parameters in Azure ML Studio.</p><p>You can pass values for any other Web service parameters using the webServiceParameters section of activity JSON . <p>Input blob will be used as input location.</p> |
|Output is Azure Blob | The Data Factory service uses the connection string information from the INPUT linked service to generate the web service parameters with names: "Database server name", "Database name", "Server user account name", "Server user account password". Note that you must use these default names for Web service parameters in Azure ML Studio. | <p>You must pass values for any Web service parameters using the WebServiceParameters section of activity JSON.</p><p>Blobs will be used as input and output locations.</p> |
    

> [AZURE.NOTE] Azure SQL Writer may encounter key violations if it is overwriting an identity column. You should ensure that you structure your output table to avoid this situation. 
> 
> You can use staging tables with a Stored Procedure Activity to merge rows, or to truncate the data before scoring. If you use this approach, set concurrency setting of the executionPolicy to 1.    

#### Azure Blob as a source

When using the Reader module in an Azure Machine Learning experiment, you can specify Azure Blob as an input. The files in the Azure blob storage can be the output files (e.g. 000000_0) that are produced by a Pig and Hive script running on HDInsight. The Reader module allows you to read files (with no extensions) by configuring the **Path to container, directory or blob** property of the reader module to point to the container/folder that contains the files as shown below. Note, the asterisk (i.e. \*) **specifies that all the files in the container/folder (i.e. data/aggregateddata/year=2014/month-6/\*)** will be read as part of the experiment.

![Azure Blob properties](./media/data-factory-create-predictive-pipelines/azure-blob-properties.png)

### Example of using Web service parameters
#### Pipeline with AzureMLBatchScoringActivity with Web Service Parameters

	{
	  "name": "MLWithSqlReaderSqlWriter",
	  "properties": {
	    "description": "Azure ML model with sql azure reader/writer",
	    "activities": [
	      {
	        "name": "MLSqlReaderSqlWriterActivity",
	        "type": "AzureMLBatchScoring",
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
	        "linkedServiceName": "MLSqlReaderSqlWriterScoringModel",
	        "policy": {
	          "concurrency": 1,
	          "executionPriorityOrder": "NewestFirst",
	          "retry": 1,
	          "timeout": "02:00:00"
	        },
	        "typeProperties": {
	          "webServiceParameters": {
	            "Database server name1": "output.database.windows.net",
	            "Database name1": "outputDatabase",
	            "Server user account name1": "outputUser",
	            "Server user account password1": "outputPassword",
	            "Comma separated list of columns to be saved": "CustID, Scored Labels, Scored Probabilities",
	            "Data table name": "BikeBuyerPredicted"
	          }
	        }
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
- The Data Factory service automatically generates values for Web service parameters with the names **Database server name**, **Database name**, **Server user account name**, and **Server user account password**, which match the names of the input reader. Therefore, you do not need to explicitly pass the values for these parameters via **webServiceParameters** in the activity JSON below.  
- The parameters for writer (the ones with '1' suffix) are not automatically filled in by the Data Factory service. Therefore, you need to specify values for these parameters in the **webServiceParameters** section of the activity JSON.  
- **Customer ID**, **scored labels**, and **scored probabilities** are saved as comma separated columns. 
- The **Data table name** in this example corresponds to a table in the output database.
- Both **start** and **end** datetimes must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The **end** time is optional. If you do not specify value for the **end** property, it is calculated as "**start + 48 hours**". To run the pipeline indefinitely, specify **9999-09-09** as the value for the **end** property. See [JSON Scripting Reference](https://msdn.microsoft.com/library/dn835050.aspx) for details about JSON properties.





[adf-build-1st-pipeline]: data-factory-build-your-first-pipeline.md

[azure-machine-learning]: http://azure.microsoft.com/services/machine-learning/
[machine-learning-dashboard]: ./media/data-factory-create-predictive-pipelines/AzureMLDashboard.png

 
