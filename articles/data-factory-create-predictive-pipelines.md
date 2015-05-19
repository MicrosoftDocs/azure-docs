<properties 
	pageTitle="Data Factory - Create Predictive Pipelines using Data Factory and Machine Learning | Azure" 
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
	ms.date="05/05/2015" 
	ms.author="spelluru"/>

# Create Predictive Pipelines using Azure Data Factory and Azure Machine Learning 
## Overview
You can operationalize published [Azure Machine Learning][azure-machine-learning] models within Azure Data Factory pipelines.These pipelines are called predictive pipelines. To create a predictive pipeline, you will need:

-	The published workspace model’s API Key and the batch scoring URL (see the image below)
-	An Azure blob storage holding the input CSV file (or) an Azure SQL database that contains the input data to be scored. 
-	An Azure blob storage that will hold the scoring results CSV file (or) an Azure SQL database that will hold the output data. 

	![Machine Learning Dashboard][machine-learning-dashboard]

	The batch scoring URL for the AzureMLLinkedService is obtained as from indicated in the image above, minus ‘**help**’:  https://ussouthcentral.services.azureml.net/workspaces/da9e350b758e44b2812a6218d507e216/services/8c91ff373a81416f8f8e0d96a1162681/jobs/

A **predictive pipeline** has these parts:

-	Input and output tables
-	Azure Storage/Azure SQL and Azure ML linked services
-	A pipeline with Azure ML Batch Scoring Activity

> [AZURE.NOTE] You can use Web service parameters that are exposed by a published Azure Machine Learning Web service in Azure Data Factory (ADF) pipelines. For more information, see the Web Service Parameters section in this article.  

## Example
This example uses Azure Storage to hold both the input and output data. You can also use Azure SQL Database instead of using Azure Storage. 

We recommend that you go through the [Get started with Azure Data Factory][adf-getstarted] tutorial prior to going through this example and use the Data Factory Editor to create Data Factory artifacts (linked services, tables, pipeline) in this example.   
 

1. Create a linked service for your Azure Storage. If the scoring input and output files will be in different storage accounts, you will need two linked services. Here is a JSON example:

		{
		    "name": "StorageLinkedService",
		    "properties":
		    {
		        "type": "AzureStorageLinkedService",
		        "connectionString": "DefaultEndpointsProtocol=https;AccountName=[acctName];AccountKey=[acctKey]"
		    }
		}

2. Create the input and output Azure Data Factory tables. Note that unlike some other Data Factory tables, these must both contain both **folderPath** and **fileName** values. You can use partitioning to cause each batch execution (each data slice) to process or produce unique input and output files. You will likely need to include some upstream activity to transform the input into the CSV file format and place it in the storage account for each slice. In that case, you would not include the “waitOnExternal” settings shown in the example below, and your ScoringInputBlob would be the output table of a different Activity.

		{  
			"name":"ScoringInputBlob",
			"properties":
			{  
					"location":
					{  
						"type":"AzureBlobLocation",
						"folderPath":"azuremltesting/input",
						"fileName":"in.csv",
						"format":
						{ 
							"type":"TextFormat",
							"columnDelimiter":","
						},
						"linkedServiceName":"StorageLinkedService"
					},
					"availability":
					{  
						"frequency":"Day",
						"interval":1,
						"waitOnExternal":
						{
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
3. This output example uses partitioning to create a unique output path for each slice execution. Without this, the activity would overwrite the file.

		{  
		   "name":"ScoringResultBlob",
		   "properties":
			{  
		        "location":
				{  
		            "type":"AzureBlobLocation",
		            "folderPath": "azuremltesting/scored/{folderpart}/",
		            "fileName": "{filepart}result.csv",
		            "partitionedBy": [ 
		                 { "name": "folderpart", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMdd" } },
		                 { "name": "filepart", "value": { "type": "DateTime", "date": "SliceStart", "format": "HHmmss" } } 
		             ], 
		            "format":{  
		              "type":"TextFormat",
		              "columnDelimiter":","
		            },
		            "linkedServiceName":"StorageLinkedService"
		        },
		        "availability":
				{  
		            "frequency":"Day",
		            "interval":15
		        }
		   }
		}


4. Create a linked service of type: **AzureMLLinkedService**, providing the API key and model batch scoring URL.
		
		{
		    "name": "MyAzureMLLinkedService",
		    "properties":
		    {
		        "type": "AzureMLLinkedService",
		        "mlEndpoint":"https://[batch scoring endpoint]/jobs",
		        "apiKey":"[apikey]"
		    }
		}

5. Finally, author a pipeline containing an **AzureMLBatchScoringActivity**. It will get the location of the input file from your input tables, call the AzureML batch scoring API, and copy the batch scoring output to the blob given in your output table. Unlike some other Data Factory activities, AzureMLBatchScoringActivity can have only one input and one output table.

		 {
		    "name": "PredictivePipeline",
		    "properties":
		    {
		        "description" : "use AzureML model",
		        "activities":
		        [
		         {  
		            "name":"MLActivity",
		            "type":"AzureMLBatchScoringActivity",
		            "description":"prediction analysis on batch input",
		            "inputs": [ { "name": "ScoringInputBlob" } ],
		            "outputs":[ { "name": "ScoringResultBlob" } ],
		            "linkedServiceName":"MyAzureMLLinkedService",
		            "policy":{  
		               "concurrency":3,
		               "executionPriorityOrder":"NewestFirst",
		               "retry":1,
		               "timeout":"02:00:00"
		            }
		         }
		        ]
		    }
		}


## Web Service Parameters
You can use Web service parameters that are exposed by a published Azure Machine Learning Web service in Azure Data Factory (ADF) pipelines. You can create an experiment in Azure Machine Learning and publish it as a web service, and then use that web service in multiple ADF pipelines or activities, passing in different inputs via the Web Service Parameters.

### Passing values for Web service parameters
Add a **transformation** section to the **AzureMLBatchScoringActivty** section in the pipeline JSON to specify values for Web service parameters in that section as shown in the following example: 

	transformation: {
		webServiceParameters: {
			"Param 1": "Value 1",
			"Param 2": "Value 2"
		}
	}


You can also use [Data Factory Functions](https://msdn.microsoft.com/library/dn835056.aspx) in passing values for the Web service parameters as shown in the following example:

	transformation: {
    	webServiceParameters: {
    	   "Database query": "$$Text.Format('SELECT * FROM myTable WHERE timeColumn = \\'{0:yyyy-MM-dd HH:mm:ss}\\'', Time.AddHours(SliceStart, 0))"
    	}
  	}
 
> [AZURE.NOTE] The Web service parameters are case-sensitive, so ensure that the names you specify in the activity JSON match the ones exposed by the Web service. 

### Azure SQL Readers and Writers
A common scenario for using Web service parameters is the use of Azure SQL Readers and Writers. The reader module is used to load data into an experiment from data management services outside Azure Machine Learning Studio and the writer module is to save data from your experiments into data management services outside Azure Machine Learning Studio.  
For details about Azure Blob/Azure SQL reader/writer, see [Reader](https://msdn.microsoft.com/library/azure/dn905997.aspx) and [Writer](https://msdn.microsoft.com/library/azure/dn905984.aspx) topics on MSDN Library. The example in the previous section used the Azure Blob reader and Azure Blob writer. This section discusses using Azure SQL reader and Azure SQL writer.  

#### Azure SQL Reader
In Azure ML Studio, you can build an experiment and publish a Web service with an Azure SQL Reader for the input. The Azure SQL Reader has connection properties that can be exposed as Web service parameters, allowing values for the connection properties to be passed at runtime in the batch scoring request.

At runtime, the details from the input Data Factory table will be used by the Data Factory service to fill in the Web service parameters. Note that you must use default names (Database server name, Database name, Server user account name, Server user account password) for the Web service parameters for this integration with the Data Factory service to work.

If you have any additional Web service parameters, use the **webServiceParameters** section of the activity JSON. If you specify values for Azure SQL Reader parameters in this section, the values will override the values picked up from the input Azure SQL linked service. We do not recommend you specify values for Azure SQL Reader directly in the webServiceParameters section. Use the section to pass values for any additional parameters.       

To use an Azure SQL Reader via an Azure Data Factory pipeline, do the following: 

- Create an **Azure SQL linked service**. 
- Create a Data Factory **table** that uses **AzureSqlTableLocation**.
- Set that Data Factory **table** as the **input** for the **AzureMLBatchScoringActivity** in the pipeline JSON. 



#### Azure SQL Writer
As with Azure SQL Reader, an Azure SQL Writer can also have its properties exposed as Web service parameters. An Azure SQL Writer uses settings from either the linked service associated with the input table or the output table. The following table describes when the input linked service is used vs. output linked service.   

<table>
<tr>
<td>Output/Input</td>
<td><b>Input is Azure SQL</b></td>
<td><b>Input is Azure Blob</b></td>
</tr>
<tr>
<td><b>Output is Azure SQL</b></td>
<td><p>The Data Factory service uses the connection string information from the INPUT linked service to generate the web service parameters with names: "Database server name", "Database name", "Server user account name", "Server user account password". Note that you must use these default names for Web service parameters in Azure ML Studio.</p>
<p>If the Azure SQL Reader and Azure SQL Writer in your Azure ML model share the same Web service parameters mentioned above, you are fine. If they do not share same Web service paramers, for example, if the Azure SQL Writer uses parameters names: Database server name1, Database name1, Server user account name1, Server user account password1 (with '1' at the end), you must pass values for these OUTPUT web service parameters in the webServiceParameters section of activity JSON.</p>
<p>
You can pass values for any other Web service parameters using the webServiceParameters section of activity JSON.  
</p>

</td>
<td>
<p>The Data Factory service uses the connection string information from the OUTPUT linked service to generate the web service parameters with names: "Database server name", "Database name", "Server user account name", "Server user account password". Note that you must use these default names for Web service parameters in Azure ML Studio.</p>
<p>You can pass values for any other Web service parameters using the webServiceParameters section of activity JSON . <p>Input blob will be used as input location.</p>
</td>
</tr>
<tr>
<td><b>Output is Azure Blob</b></td>
<td>The Data Factory service uses the connection string information from the INPUT linked service to generate the web service parameters with names: "Database server name", "Database name", "Server user account name", "Server user account password". Note that you must use these default names for Web service parameters in Azure ML Studio.
</td>
<td>
<p>You must pass values for any Web service parameters using the WebServiceParameters section of activity JSON.</p> 

<p>Blobs will be used as input and output locations.</p>

</td>
<tr>

</table>
    

> [AZURE.NOTE] Azure SQL Writer may encounter key violations if it is overwriting an identity column. You should ensure that you structure your output table to avoid this situation. 
> 
> You can use staging tables with a Stored Procedure Activity to merge rows, or to truncate the data before scoring. If you use this approach, set concurrency setting of the executionPolicy to 1.    

### Example of using Web service parameters
#### Pipeline with AzureMLBatchScoringActivity with Web Service Parameters

	{
		"name": "MLWithSqlReaderSqlWriter",
	  	"properties": {
		    "description": "Azure ML model with sql azure reader/writer",
		    "activities": [
		    	{
		    	    "name": "MLSqlReaderSqlWriterActivity",
		    	    "type": "AzureMLBatchScoringActivity",
		    	    "description": "test",
		        	"inputs": [ { "name": "MLSqlInput" } ],
		        	"outputs": [ { "name": "MLSqlOutput" } ],
		        	"linkedServiceName": "MLSqlReaderSqlWriterScoringModel",
		        	"policy": {
		          		"concurrency": 1,
			          	"executionPriorityOrder": "NewestFirst",
			          "retry": 1,
			          "timeout": "02:00:00"
			        },
			        transformation: {
			        	webServiceParameters: {
		            		"Database server name1": "output.database.windows.net",
				            "Database name1": "outputDatabase",
		            		"Server user account name1": "outputUser",
		            		"Server user account password1": "outputPassword",
			           		"Comma separated list of columns to be saved": "CustID, Scored Labels, Scored Probabilities",
		    		        "Data table name": "BikeBuyerPredicted" 
		          		}  
		        	}
		      	}
	    	]
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




## See Also

Article | Description
------ | ---------------
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, .NET class library, functions, etc… 

[adf-introduction]: data-factory-introduction.md
[adf-getstarted]: data-factory-get-started.md
[use-onpremises-datasources]: data-factory-use-onpremises-datasources.md
[use-pig-and-hive-with-data-factory]: data-factory-pig-hive-activities.md
[adf-tutorial]: data-factory-tutorial.md
[use-custom-activities]: data-factory-use-custom-activities.md
[troubleshoot]: data-factory-troubleshoot.md
[data-factory-introduction]: data-factory-introduction.md  
[developer-reference]: http://go.microsoft.com/fwlink/p/?LinkId=516908

[azure-machine-learning]: http://azure.microsoft.com/services/machine-learning/
[machine-learning-dashboard]: ./media/data-factory-create-predictive-pipelines/AzureMLDashboard.png

