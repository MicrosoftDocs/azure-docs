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
	      "dataFactoryName": { "type": "string" },
	      "storageAccountName": { "type": "string" },
	      "storageAccountKey": { "type": "securestring" },
	      "sourceBlobContainer": { "type": "string" },
	      "sourceBlobName": { "type": "string" },
	      "sqlServerName": { "type": "string" },
	      "databaseName": { "type": "string" },
	      "sqlServerUserName": { "type": "string" },
	      "sqlServerPassword": { "type": "securestring" },
	      "targetSQLTable": { "type": "string" }
	    },
	    "variables": {
	      "apiVersion": "2015-10-01",
	      "azureSqlLinkedServiceName": "AzureSqlLinkedService",
	      "azureStorageLinkedServiceName": "AzureStorageLinkedService",
	      "blobInputDatasetName": "BlobInputDataset",
	      "sqlOutputDatasetName": "SQLOutputDataset",
	      "pipelineName": "Blob2SQLPipeline"
	    },
	    "resources": [
	      {
	        "name": "[parameters('dataFactoryName')]",
	        "apiVersion": "[variables('apiVersion')]",
	        "type": "Microsoft.DataFactory/datafactories",
	        "location": "westus",
	        "resources": [
	          {
	            "type": "linkedservices",
	            "name": "[variables('azureStorageLinkedServiceName')]",
	            "dependsOn": [ "[concat('Microsoft.DataFactory/dataFactories/',
											parameters('dataFactoryName'))]" ],
	            "apiVersion": "[variables('apiVersion')]",
	            "properties": {
	              "type": "AzureStorage",
	              "description": "Azure Storage linked service",
	              "typeProperties": {
	                "connectionString": "[concat('DefaultEndpointsProtocol=https;AccountName=',
											parameters('storageAccountName'),
											';AccountKey=',
											parameters('storageAccountKey'))]"
	              }
	            }
	          },
	          {
	            "type": "linkedservices",
	            "name": "[variables('azureSqlLinkedServiceName')]",
	            "dependsOn": [ "[concat('Microsoft.DataFactory/dataFactories/',
											parameters('dataFactoryName'))]" ],
	            "apiVersion": "[variables('apiVersion')]",
	            "properties": {
	              "type": "AzureSqlDatabase",
	              "description": "Azure SQL linked service",
	              "typeProperties": {
	                "connectionString": "[concat('Server=tcp:',
											parameters('sqlServerName'),
											'.database.windows.net,1433;Database=',
											parameters('databaseName'),
											';User ID=',
											parameters('sqlServerUserName'),
											';Password=',
											parameters('sqlServerPassword'),
											';Trusted_Connection=False;Encrypt=True;Connection Timeout=30')]"
	              }
	            }
	          },
	          {
	            "type": "datasets",
	            "name": "[variables('blobInputDatasetName')]",
	            "dependsOn": [
	              "[concat('Microsoft.DataFactory/dataFactories/',
							parameters('dataFactoryName'))]",
	              "[concat('Microsoft.DataFactory/dataFactories/',
							parameters('dataFactoryName'),
							'/linkedServices/',
							variables('azureStorageLinkedServiceName'))]"
	            ],
	            "apiVersion": "[variables('apiVersion')]",
	            "properties": {
	              "type": "AzureBlob",
	              "linkedServiceName": "[variables('azureStorageLinkedServiceName')]",
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
	              "typeProperties": {
	                "folderPath": "[concat(parameters('sourceBlobContainer'), '/')]",
	                "fileName":  "[parameters('sourceBlobName')]",
	                "format": {
	                  "type": "TextFormat",
	                  "columnDelimiter": ","
	                }
	              },
	              "availability": {
	                "frequency": "Day",
	                "interval": 1
	              },
	              "external": true
	            }
	          },
	          {
	            "type": "datasets",
	            "name": "[variables('sqlOutputDatasetName')]",
	            "dependsOn": [
	              "[concat('Microsoft.DataFactory/dataFactories/',
							parameters('dataFactoryName'))]",
	              "[concat('Microsoft.DataFactory/dataFactories/',
							parameters('dataFactoryName'),
							'/linkedServices/',
							variables('azureSqlLinkedServiceName'))]"
	            ],
	            "apiVersion": "[variables('apiVersion')]",
	            "properties": {
	              "type": "AzureSqlTable",
	              "linkedServiceName": "[variables('azureSqlLinkedServiceName')]",
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
	              "typeProperties": {
	                "tableName": "[parameters('targetSQLTable')]"
	              },
	              "availability": {
	                "frequency": "Day",
	                "interval": 1
	              }
	            }
	          },
	          {
	            "type": "datapipelines",
	            "name": "[variables('pipelineName')]",
	            "dependsOn": [
	              "[concat('Microsoft.DataFactory/dataFactories/',
							parameters('dataFactoryName'))]",
	              "[concat('Microsoft.DataFactory/dataFactories/',
							parameters('dataFactoryName'),
							'/linkedServices/',
							variables('azureStorageLinkedServiceName'))]",
	              "[concat('Microsoft.DataFactory/dataFactories/',
							parameters('dataFactoryName'),
							'/linkedServices/',
							variables('azureSqlLinkedServiceName'))]",
	              "[concat('Microsoft.DataFactory/dataFactories/',
							parameters('dataFactoryName'),
							'/datasets/',
							variables('sqlOutputDatasetName'))]",
	              "[concat('Microsoft.DataFactory/dataFactories/',
							parameters('dataFactoryName'),
							'/datasets/',
							variables('blobInputDatasetName'))]"
		          ],
	            "apiVersion": "[variables('apiVersion')]",
	            "properties": {
	              "activities": [
	                {
	                  "name": "CopyFromAzureBlobToAzureSQL",
	                  "description": "Copy data frm Azure blob to Azure SQL",
	                  "type": "Copy",
	                  "inputs": [ { "name": "[variables('blobInputDatasetName')]" } ],
	                  "outputs": [ { "name": "[variables('sqlOutputDatasetName')]" } ],
	                  "typeProperties": {
	                    "source": {
	                      "type": "BlobSource"
	                    },
	                    "sink": {
	                      "type": "SqlSink"
	                    },
	                    "translator": {
	                      "type": "TabularTranslator",
	                      "columnMappings": "Column0:FirstName,Column1:LastName"
	                    }
	                  },
	                  "Policy": {
	                    "concurrency": 1,
	                    "executionPriorityOrder": "NewestFirst",
	                    "style": "StartOfInterval",
	                    "retry": 0,
	                    "timeout": "01:00:00"
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
	  "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
	  "contentVersion": "1.0.0.0",
	  "parameters": {
	    "dataFactoryName": { "value": "<Name of the data factory>" },
	    "storageAccountName": { "value": "<Azure Storage account name>" },
	    "storageAccountKey": { "value": "<Azure Storage account key>" },
	    "sourceBlobContainer": { "value": "adftutorial" },
	    "sourceBlobName": { "value": "emp.txt" },
	    "sqlServerName": { "value": "<Azure SQL server name>" },
	    "databaseName": { "value": "<Azure SQL database name>" },
	    "sqlServerUserName": { "value": "<Azure SQL server - user name>" },
	    "sqlServerPassword" :  {"value":  "<Azure SQL server - user password>"},
	    "targetSQLTable": { "value": "emp" }
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


## Template details

### Parameters
You pass values for these parameters in the parameter file. You could create separate parameter file for each environment (for example: dev, test, and production).

	  "parameters": {
	    "dataFactoryName": { "type": "string" },
	    "storageAccountName": { "type": "string" },
	    "storageAccountKey": { "type": "securestring" },
	    "sourceBlobContainer": { "type": "string" },
	    "sourceBlobName": { "type": "string" },
	    "sqlServerName": { "type": "string" },
	    "databaseName": { "type": "string" },
	    "sqlServerUserName": { "type": "string" },
	    "sqlServerPassword": { "type": "securestring" },
	    "targetSQLTable": { "type": "string" }
	  },

### Variables
You use these variables in defining Data Factory entities (linked services, datasets, and pipeline).

	  "variables": {
	    "apiVersion": "2015-10-01",
	    "azureSqlLinkedServiceName": "AzureSqlLinkedService",
	    "azureStorageLinkedServiceName": "AzureStorageLinkedService",
	    "blobInputDatasetName": "BlobInputDataset",
	    "sqlOutputDatasetName": "SQLOutputDataset",
	    "pipelineName": "Blob2SQLPipeline"
	  },

### Resources in template
You have only resource in the template and that is the data factory. The data factory itself has embedded resources that define linked services, datasets, and pipeline.  

	  "resources": [
	    {
	      "name": "[parameters('dataFactoryName')]",
	      "apiVersion": "[variables('apiVersion')]",
	      "type": "Microsoft.DataFactory/datafactories",
	      "location": "westus",
	    }
	  ]

### Resources inside data factory
These are the resources defined inside the data factory resource.

#### Azure Storage linked service
You specify the name and key of Azure storage account in this section.

	        {
	          "type": "linkedservices",
	          "name": "[variables('azureStorageLinkedServiceName')]",
	          "dependsOn": [ "[concat('Microsoft.DataFactory/dataFactories/', parameters('dataFactoryName'))]" ],
	          "apiVersion": "[variables('apiVersion')]",
	          "properties": {
				"type": "AzureStorage",
				"description": "Azure Storage linked service",
				"typeProperties": {
		            "connectionString": "[concat('DefaultEndpointsProtocol=https;AccountName=',parameters('storageAccountName'),';AccountKey=',parameters('storageAccountKey'))]"
				}
	          }
	        },

#### Azure SQL linked service
You specify the Azure SQL server name, database name, user name, and user password in this section.

	        {
	          "type": "linkedservices",
	          "name": "[variables('azureSqlLinkedServiceName')]",
	          "dependsOn": [ "[concat('Microsoft.DataFactory/dataFactories/', parameters('dataFactoryName'))]" ],
	          "apiVersion": "[variables('apiVersion')]",
	          "properties": {
				"type": "AzureSqlDatabase",
				"description": "Azure SQL linked service",
				"typeProperties": {
		            "connectionString": "[concat('Server=tcp:',parameters('sqlServerName'),'.database.windows.net,1433;Database=', parameters('databaseName'), ';User ID=',parameters('sqlServerUserName'),';Password=',parameters('sqlServerPassword'),';Trusted_Connection=False;Encrypt=True;Connection Timeout=30')]"
				}
	          }
	        },

#### Azure blob dataset
You specify the name of the container and the folder that contains the input blobs.

	        {
	          "type": "datasets",
	          "name": "[variables('blobInputDatasetName')]",
	          "dependsOn": [
	            "[concat('Microsoft.DataFactory/dataFactories/', parameters('dataFactoryName'))]",
	            "[concat('Microsoft.DataFactory/dataFactories/', parameters('dataFactoryName'), '/linkedServices/', variables('azureStorageLinkedServiceName'))]"
	          ],
	          "apiVersion": "[variables('apiVersion')]",
	          "properties": {
				"type": "AzureBlob",
				"linkedServiceName": "[variables('azureStorageLinkedServiceName')]",
				"typeProperties": {
	              "folderPath": "[concat(parameters('sourceBlobContainer'), '/')]",
	              "fileName":  "[parameters('sourceBlobName')]",
	              "format": {
	                "type": "TextFormat",
	                "columnDelimiter": ","
	              }
            	},
	            "availability": {
	              "frequency": "Day",
	              "interval": 1
	            },
            	"external": true,
	          }
	        },

#### Azure SQL dataset
You specify the name of the table in the Azure SQL database that will hold the copied data from the Azure Blob storage.

	        {
	          "type": "datasets",
	          "name": "[variables('sqlOutputDatasetName')]",
	          "dependsOn": [
	            "[concat('Microsoft.DataFactory/dataFactories/', parameters('dataFactoryName'))]",
	            "[concat('Microsoft.DataFactory/dataFactories/', parameters('dataFactoryName'), '/linkedServices/', variables('azureSqlLinkedServiceName'))]"
	          ],
	          "apiVersion": "[variables('apiVersion')]",
	          "properties": {
				"type": "AzureSqlTable",
            	"linkedServiceName": "[variables('azureSqlLinkedServiceName')]",
            	"typeProperties": {
	              "tableName": "[parameters('targetSQLTable')]"
            	},
	            "availability": {
	              "frequency": "Day",
	              "interval": 1
	            }
	          }
	        },


#### Pipeline
You define a pipeline that copies data from the Azure blob dataset to the Azure SQL dataset.

	        {
	          "type": "datapipelines",
	          "name": "[variables('pipelineName')]",
	          "dependsOn": [
	            "[concat('Microsoft.DataFactory/dataFactories/', parameters('dataFactoryName'))]",
	            "[concat('Microsoft.DataFactory/dataFactories/', parameters('dataFactoryName'), '/linkedServices/', variables('azureStorageLinkedServiceName'))]",
	            "[concat('Microsoft.DataFactory/dataFactories/', parameters('dataFactoryName'), '/linkedServices/', variables('azureSqlLinkedServiceName'))]",
	            "[concat('Microsoft.DataFactory/dataFactories/', parameters('dataFactoryName'), '/datasets/', variables('sqlOutputDatasetName'))]",
	            "[concat('Microsoft.DataFactory/dataFactories/', parameters('dataFactoryName'), '/datasets/', variables('blobInputDatasetName'))]"
	          ],
	          "apiVersion": "[variables('apiVersion')]",
	          "properties": {
	            "activities": [
	              {
	                "name": "CopyFromAzureBlobToAzureSQL",
	                "description": "Copy data frm Azure blob to Azure SQL",

                	"type": "Copy",
	                "inputs": [ { "name": "[variables('blobInputDatasetName')]" } ],
	                "outputs": [ { "name": "[variables('sqlOutputDatasetName')]" } ],
                	"typeProperties": {
                  		"source": {
                    		"type": "BlobSource"
                  		},
                  		"sink": {
                    		"type": "SqlSink"
                  		}
                	},
	                "Policy": {
	                  "concurrency": 1,
	                  "executionPriorityOrder": "NewestFirst",
	                  "style": "StartOfInterval",
	                  "retry": 0,
	                  "timeout": "01:00:00"
	                }
	              }
	            ],
	            "start": "2016-10-09T00:00:00Z",
	            "end": "2016-10-12T00:00:00Z"
	          }
	        }
	      ]
