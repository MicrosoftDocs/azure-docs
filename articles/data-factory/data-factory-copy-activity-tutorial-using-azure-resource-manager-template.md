<properties 
	pageTitle="Tutorial: Create a pipeline using Resource Manager Template | Microsoft Azure" 
	description="In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using Azure Resource Manager template." 
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
	ms.topic="get-started-article" 
	ms.date="10/05/2016" 
	ms.author="spelluru"/>

# Tutorial: Create a pipeline with Copy Activity using Azure Resource Manager template
> [AZURE.SELECTOR]
- [Overview and prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
- [Copy Wizard](data-factory-copy-data-wizard-tutorial.md)
- [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md)
- [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md)
- [PowerShell](data-factory-copy-activity-tutorial-using-powershell.md)
- [REST API](data-factory-copy-activity-tutorial-using-rest-api.md)
- [.NET API](data-factory-copy-activity-tutorial-using-dotnet-api.md)


This tutorial shows you how to create and monitor an Azure data factory using the Azure Resource Manager template. The pipeline in the data factory uses a Copy Activity to copy data from Azure Blob Storage to Azure SQL Database.

## Prerequisites
- See [Authoring Azure Resource Manager Templates](../resource-group-authoring-templates.md) to learn about Azure Resource Manager templates.
- Go through [Tutorial Overview](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) and complete the **prerequisite** steps.
- Follow instructions in [How to install and configure Azure PowerShell](../powershell-install-configure.md) article to install latest version of Azure PowerShell on your computer.

In this section, you create the following Data Factory entities: 

1. A **data factory** named **ADFTutorialDataFactory&lt;suffix specified in the parameter file&gt;**. A data factory can have one or more pipelines. A pipeline can have one or more activities in it. For example, a Copy Activity to copy data from a source to a sink/destination data store and a HDInsight Hive activity to run Hive script to transform input data. 
2. Two **linked services**: **StorageLinkedService&lt;suffix&gt;** and **SqlLinkedService&lt;suffix&gt;**. These linked services link your Azure Storage account and an Azure SQL server to your data factory. Azure Storage is the source data store and Azure SQL database is the sink for the copy activity. The Azure Storage linked service specifies the storage account that contains the input data for the copy activity. The Azure SQL linked service specifies the Azure SQL database that holds the output data for the copy activity. Identify what data store/compute services are used in your scenario and link those services to the data factory by creating linked services. 
3. Two (input/output) **datasets**: **storageDataset&lt;suffix&gt;** and **sqlDataset&lt;suffix&gt;**. These datasets refer to the Azure Storage and Azure SQL linked services. The Azure Storage linked service points to an Azure Storage account and the Azure Blob dataset specifies the container, folder, and file name in the storage that holds input data. The Azure SQL linked service refers to an Azure SQL server and the Azure SQL dataset specifies the name of the table that holds the output data.
4. One **pipeline** named **BlobtoSqlDbCopyPipeline&lt;suffix&gt;**. The pipeline has one activity of type Copy that takes the Azure blob dataset as an input and the Azure SQL dataset as an output.  

Create a JSON file named **ADFCopyTutorialARM.json** in **C:\ADFGetStarted** folder with the following content:

	{
	    "contentVersion": "1.0.0.0",
	    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	    "parameters": {
	      "storageAccountName": { "type": "string" },
	      "storageAccountKey": { "type": "securestring" },
	      "sqlServerName": { "type": "string" },
	      "sqlDatabaseName": { "type": "string" },
	      "sqlUserID": { "type": "string" },
	      "sqlPassword": { "type": "securestring" },
	      "suffix": { "type": "string" }
	    },
	    "variables": {
	      "apiVersion": "2015-10-01",
		  "dataFactoryName":  "[concat('ADFTutorialDataFactory', parameters('suffix'))]",
	      "storageLinkedServiceName": "[concat('StorageLinkedService', parameters('suffix'))]",
	      "sqlLinkedServiceName": "[concat('SqlLinkedService', parameters('suffix'))]",
	      "storageDataset": "[concat('storageDataset', parameters('suffix'))]",
	      "sqlDataset": "[concat('sqlDataset', parameters('suffix'))]",
	      "pipelineName": "[concat('BlobtoSqlDbCopyPipeline', parameters('suffix'))]"
	    },
	  "resources": [
	    {
	      "name": "[variables('dataFactoryName')]",
	      "apiVersion": "[variables('apiVersion')]",
	      "type": "Microsoft.DataFactory/datafactories",
	      "location": "westus",
	      "resources": [
	        {
				"dependsOn": [ "[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'))]" ],
				"type": "Microsoft.DataFactory/datafactories/linkedservices",
				"name": "[concat(variables('dataFactoryName'), '/', variables('storageLinkedServiceName'))]",
				"apiVersion": "[variables('apiVersion')]",
				"properties": {
					"type": "AzureStorage",
					"description": "Azure Blobs Storage Linked Service",
					"typeProperties": {
						"connectionString": "[concat('DefaultEndpointsProtocol=https;AccountName=',parameters('storageAccountName'),';AccountKey=',parameters('storageAccountKey'))]"
					}
				}
			},
	        {
				"dependsOn": [ "[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'))]" ],
				"type": "Microsoft.DataFactory/datafactories/linkedservices",
				"name": "[concat(variables('dataFactoryName'), '/', variables('sqlLinkedServiceName'))]",
				"apiVersion": "[variables('apiVersion')]",
				"properties": {
					"type": "AzureSqlDatabase",
					"description": "Azure SQL linked service for output table",
					"typeProperties": {
						"connectionString": "[concat('Data Source=tcp:', parameters('sqlServerName'), '.database.windows.net,1433;Initial Catalog=', parameters('sqlDatabaseName'), ';Integrated Security=False;User ID=', parameters('sqlUserId'), ';Password=', parameters('sqlPassword'), ';Connect Timeout=30;Encrypt=True')]"
					}
				}
	        },
	        {
	          "type": "Microsoft.DataFactory/datafactories/datasets",
	          "name": "[concat(variables('dataFactoryName'), '/', variables('StorageDataset'))]",
	          "dependsOn": [
				"[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'))]",
	            "[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'), '/linkedServices/', variables('storageLinkedServiceName'))]"
	          ],
	          "apiVersion": "[variables('apiVersion')]",
	          "properties": {
	            "structure": [
	              {
	                "name": "Column0",
	                "type": "String"
	              },
	              {
	                "name": "Column1",
	                "type": "String"
	              }
	            ],
	            "type": "AzureBlob",
	            "linkedServiceName": "[variables('storageLinkedServiceName')]",
	            "typeProperties": {
		      	  "folderPath": "adftutorial/",
	              "fileName": "emp.txt",
	              "format": {
	                "type": "TextFormat",
	                "columnDelimiter": ",",
	                "nullValue": ""
	              }
	            },
	            "availability": {
	              "frequency": "Day",
	              "interval": 1
	            },
	            "external": true,
	            "policy": { }
	          }
	        },
	        {
	          "type": "Microsoft.DataFactory/datafactories/datasets",
	          "name": "[concat(variables('dataFactoryName'), '/', variables('sqlDataset'))]",
	          "dependsOn": [            
				  "[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'))]",
				  "[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'), '/linkedServices/', variables('sqlLinkedServiceName'))]"
	          ],
	          "apiVersion": "[variables('apiVersion')]",
	          "properties": {
	            "structure": [
	              {
	                "name": "FirstName",
	                "type": "String"
	              },
	              {
	                "name": "LastName",
	                "type": "String"
	              }
	            ],
	            "type": "AzureSqlTable",
	            "linkedServiceName": "[variables('sqlLinkedServiceName')]",
	            "typeProperties": {
	              "tableName": "emp"
	            },
	            "availability": {
	              "frequency": "Day",
	              "interval": 1
	            },
	            "external": false,
	            "policy": { }
	          }
	        },
	        {
	          "type": "Microsoft.DataFactory/datafactories/datapipelines",
	          "name": "[concat(variables('dataFactoryName'), '/', variables('PipelineName'))]",
	          "dependsOn": [
				"[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'))]",            
	            "[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'), '/linkedServices/', variables('storageLinkedServiceName'))]",
	            "[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'), '/linkedServices/', variables('sqlLinkedServiceName'))]",
	            "[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'), '/datasets/', variables('storageDataset'))]",
	            "[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'), '/datasets/', variables('sqlDataset'))]"
	          ],
	          "apiVersion": "[variables('apiVersion')]",
	          "properties": {
	            "description": "Copies data from Azure Blob to Sql DB",
	            "activities": [
	              {
	                "name": "BlobtoSqlDbCopyActivity",
	                "description": "Copies data from Azure Blob to Sql DB",
	                "type": "Copy",
	                "inputs": [ { "name": "[variables('storageDataset')]" } ],
	                "outputs": [ { "name": "[variables('sqlDataset')]" } ],
	                "typeProperties": {
	                  "source": {
	                    "type": "BlobSource",
	                    "recursive": false
	                  },
	                  "sink": {
	                    "type": "SqlSink",
	                    "writeBatchSize": 0,
	                    "writeBatchTimeout": "00:00:00"
	                  },
	                  "translator": {
	                    "type": "TabularTranslator",
	                    "columnMappings": "Column0:FirstName,Column1:LastName"
	                  }
	                },
	                "policy": {
	                  "timeout": "02:00:00",
	                  "concurrency": 1,
	                  "executionPriorityOrder": "NewestFirst",
	                  "retry": 3
	                },
	                "scheduler": {
	                  "frequency": "Day",
	                  "interval": 1
	                }
	              }
	            ],
	            "start": "2016-10-01T00:00:00Z",
	            "end": "2016-10-02T00:00:00Z"
	          }
	        }
	      ]
	    }
	  ]
	}	 

Create a JSON file named **ADFCopyTutorialARM-Parameters.json** that contains parameters for the Azure Resource Manager template. Specify values for these parameters and save the JSON file.  

	{
		"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
	    "contentVersion": "1.0.0.0",
	  	"parameters": {
	    	"storageAccountName": { "value": "<azure storage account name>" },
		    "storageAccountKey": { "value": "<azure storage key>" },
	    	"sqlServerName": { "value": "<Azure SQL server name>" },
	    	"sqlDatabaseName": { "value": "<Azure SQL database name>" },
	    	"sqlUserID": { "value": "<Azure SQL user name>" },
	    	"sqlPassword": { "value": "<Azure SQL user password>" },
	    	"suffix": { "value": "<sufix. example: datetimestamp>" }
	  }
	}

## Create data factory

1. Start **Azure PowerShell** and run the following command: 
	- Run `Login-AzureRmAccount` and enter the user name and password that you use to sign in to the Azure portal.  
	- Run `Get-AzureRmSubscription` to view all the subscriptions for this account.
	- Run `Get-AzureRmSubscription -SubscriptionName <SUBSCRIPTION NAME> | Set-AzureRmContext` to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure portal.
1. Run the following command to deploy Data Factory entities using the Resource Manager template you created in Step 1. 

		New-AzureRmResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile C:\ADFGetStarted\ADFCopyTutorialARM.json -TemplateParameterFile C:\ADFGetStarted\ADFCopyTutorialARM-Parameters.json

## Monitor pipeline

1. Log in to the [Azure portal](https://portal.azure.com) using your Azure account.
2. Click **Data factories** on the left menu (or) click **More services** and click **Data factories** under **INTELLIGENCE + ANALYTICS** category.

	![Data factories menu](media/data-factory-copy-activity-tutorial-using-azure-resource-manager-template/data-factories-menu.png) 
3. In the **Data factories** page, search for **ADFTutorialDataFactory** to find your data factory.

	![Search for data factory](media/data-factory-copy-activity-tutorial-using-azure-resource-manager-template/search-for-data-factory.png)  
4. Click your Azure data factory to see the home page for your Azure data factory. 

	![Home page for data factory](media/data-factory-copy-activity-tutorial-using-azure-resource-manager-template/data-factory-home-page.png)  
5. Click **Diagram** tile to see the diagram view of your data factory.

	![Diagram view of data factory](media/data-factory-copy-activity-tutorial-using-azure-resource-manager-template/data-factory-diagram-view.png) 
6. In the diagram view, double-click the dataset **sqlDataset**. You see that status of the slice. When the copy operation is done, you the status set to **Ready**.
	
	![Output slice in ready state](media/data-factory-copy-activity-tutorial-using-azure-resource-manager-template/output-slice-ready.png)
7. When the slice is in **Ready** state, verify that the data is copied to the **emp** table in the Azure SQL database. 
 
See [Monitor datasets and pipeline](data-factory-monitor-manage-pipelines.md) for instructions on how to use the Azure portal blades to monitor the pipeline and datasets you have created in this tutorial.

You can also use Monitor and Manage App to monitor your data pipelines. See [Monitor and manage Azure Data Factory pipelines using Monitoring App](data-factory-monitor-manage-app.md) for details about using the application.

  

