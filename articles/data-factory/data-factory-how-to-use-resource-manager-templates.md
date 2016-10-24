<properties 
	pageTitle="Use Resource Manager templates in Data Factory | Microsoft Azure" 
	description="Learn how to create and use Azure Resource Manager templates to create Data Factory entities." 
	services="data-factory" 
	documentationCenter="" 
	authors="sharonlo101" 
	manager="jhubbard" 
	editor=""/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="10/24/2016" 
	ms.author="shlo"/>

# Use templates to create Azure Data Factory entities

## Overview
While leveraging Azure Data Factory for your data integration needs, you might find yourself reusing the same pattern across different environments or implementing the same task repetitively within the same solution. In order to make this easier and more manageable, templating comes in. Templates in Azure Data Factory are ideal for scenarios which involve reusability and repetition.
 
Consider the situation where an organization has 10 manufacturing plants across the globe. The logs from each of its plant goes into a separate on-premises SQL Server. The company wants to build a single data warehouse in the cloud for ad-hoc analytics. It also wants to have the same logic but different configurations for development, test, and production environments. 

In this case, a task needs to be repeated within the same environment, but with different values across the 10 data factories for each manufacturing plant. In effect, **repetition** is present. Templating allows the abstraction of this generic flow (i.e. pipelines having the same activities for each data factory), but uses separate parameter files for each manufacturing plant.

Furthermore, because the organization wants to deploy these 10 data factories multiple times across different environments, templates can leverage this **reusability** by utilizing separate parameter files for development, test, and production environments.

Thus with templates, you can repeatedly deploy your solution throughout its life cycle and have confidence your resources are deployed in a consistent state.

## Templating with Azure Resource Manager
[Azure Resource Manager (ARM) templates](../azure-resource-manager/resource-group-overview.md#template-deployment) are a great way to achieve templating in Azure Data Factory. Resource manager templates define the infrastructure and configuration of your Azure solution through a JSON file. Because Azure Resource Manager templates work with all/most Azure services, it can be widely leveraged to easily manage all resources of your Azure assets. See [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md) to learn further about the generic ARM Templates. 

## Tutorials
See our tutorials for a walkthrough of using Resource Manager templates:

- [Tutorial: Create a pipeline with Copy Activity using Azure Resource Manager template](data-factory-copy-activity-tutorial-using-azure-resource-manager-template.md)
- [Tutorial: Build your first pipeline to process data using Hadoop cluster](data-factory-build-your-first-pipeline.md)

## Data Factory templates on Github
For more reference material, check out our Azure quick start templates:

- [Create a Data factory to copy data from Azure Blob Storage to Azure SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/101-data-factory-blob-to-sql-copy)
- [Create a Data factory with Hive activity on Azure HDInsight cluster](https://github.com/Azure/azure-quickstart-templates/tree/master/101-data-factory-hive-transformation)
- [Create a Data factory to copy data from Salesforce to Azure Blobs](https://github.com/Azure/azure-quickstart-templates/tree/master/101-data-factory-salesforce-to-blob-copy)

As you build out your templates, feel free to share your Azure Data Factory templates to [Azure Quick start](https://azure.microsoft.com/en-us/documentation/templates/) by starting with the [contribution guide](https://github.com/Azure/azure-quickstart-templates/tree/master/1-CONTRIBUTION-GUIDE). We’re excited to see what the community builds.

Read on to learn how to achieve templating for your Azure Data Factory solutions.

## Defining Data Factory Resources in templates
The top-level template for defining a data factory is:

	"$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"parameters": { ...
	},
	"variables": { ...
	},
	"resources": [
	{
		"name": "[parameters('dataFactoryName')]",
	    "apiVersion": "[variables('apiVersion')]",
	    "type": "Microsoft.DataFactory/datafactories",
	    "location": "westus",
	    "resources": [
	    { "type": "linkedservices",
			...
		},
	    {"type": "datasets",
			...
		},
		{"type": "dataPipelines",
			...
		}
	}

### Define data factory

You define a data factory in the Resource Manager template as shown in the following sample:

	"resources": [
	{
	    "name": "[variables('<mydataFactoryName>')]",
	    "apiVersion": "2015-10-01",
	    "type": "Microsoft.DataFactory/datafactories",
	    "location": "East US"
	}

The dataFactoryName is defined in “variables” as:

	"dataFactoryName": "[concat('<myDataFactoryName>', uniqueString(resourceGroup().id))]",

### Define linked services 
	
	"type": "linkedservices",
	"name": "[variables('<LinkedServiceName>')]",
	"apiVersion": "2015-10-01",
	"dependsOn": [ "[variables('<dataFactoryName>')]" ],
	"properties": {
		...
	}


See [Storage Linked Service](data-factory-azure-blob-connector.md#azure-storage-linked-service) or [Compute Linked Services](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) for details about the JSON properties for the specific linked service you wish to deploy. The “dependsOn” parameter specifies name of the corresponding data factory. An example of defining a linked service for Azure Storage is shown below.

### Define dataset

	"type": "datasets",
	"name": "[variables('<myDatasetName>')]",
	"dependsOn": [
		"[variables('<dataFactoryName>')]",
		"[variables('<myDatasetLinkedServiceName>')]"
	],
	"apiVersion": "2015-10-01",
	"properties": {
		...
	}

Refer to [Supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats) for details about the JSON properties for the specific dataset type you wish to deploy. Note the “dependsOn” parameter specifies name of the corresponding data factory and storage linked service. An example of defining dataset type of Azure blob storage is shown below.

	"type": "datasets",
    "name": "[variables('storageDataset')]",
    "dependsOn": [
    	"[variables('dataFactoryName')]",
        "[variables('storageLinkedServiceName')]"
	],
    "apiVersion": "2015-10-01",
    "properties": {
    "type": "AzureBlob",
    "linkedServiceName": "[variables('storageLinkedServiceName')]",
    "typeProperties": {
    	"folderPath": "[concat(parameters('sourceBlobContainer'), '/')]",
        "fileName": "[parameters('sourceBlobName')]",
        "format": {
    	    "type": "TextFormat"
		}
    },
    "availability": {
    	"frequency": "Hour",
        "interval": 1
	}

### Define pipelines

	"type": "dataPipelines",
    "name": "[variables('<mypipelineName>')]",
    "dependsOn": [
    	"[variables('<dataFactoryName>')]",
        "[variables('<inputDatasetLinkedServiceName>')]",
        "[variables('<outputDatasetLinkedServiceName>')]",
        "[variables('<inputDataset>')]",
        "[variables('<outputDataset>')]"
	],
    "apiVersion": "2015-10-01",
    "properties": {
		activities: {
			...
		}
	}

Refer to [defining pipelines](data-factory-create-pipelines.md#pipeline-json) for details about the JSON properties for defining the specific pipeline and activities you wish to deploy. Note the “dependsOn” parameter specifies name of the data factory, as well as any corresponding linked services or datasets. An example of a pipeline with a copy activity from Azure Blob Storage to Azure SQL Database is shown below.

	"type": "datapipelines",
    "name": "[variables('pipelineName')]",
    "dependsOn": [
    	"[variables('dataFactoryName')]",
        "[variables('azureStorageLinkedServiceName')]",
        "[variables('azureSqlLinkedServiceName')]",
        "[variables('blobInputDatasetName')]",
        "[variables('sqlOutputDatasetName')]"
	],
    "apiVersion": "2015-10-01",
    "properties": {
    	"activities": [
	    {
        	"name": "CopyFromAzureBlobToAzureSQL",
            "description": "Copy data frm Azure blob to Azure SQL",
            "type": "Copy",
            "inputs": [
            	{
            		"name": "[variables('blobInputDatasetName')]"
				}
            ],
            "outputs": [
            	{
		            "name": "[variables('sqlOutputDatasetName')]"
            	}
			],
            "typeProperties": {
            	"source": {
                	"type": "BlobSource"
				},
            	"sink": {
					"type": "SqlSink",
					"sqlWriterCleanupScript": "$$Text.Format('DELETE FROM {0}', 'emp')"
				},
				"translator": {
					"type": "TabularTranslator",
					"columnMappings": "Column0:FirstName,Column1:LastName"
				}
			},
			"Policy": {
            	"concurrency": 1,
                "executionPriorityOrder": "NewestFirst",
                "retry": 3,
                "timeout": "01:00:00"
            }
		}
		],
		"start": "2016-10-03T00:00:00Z",
		"end": "2016-10-04T00:00:00Z"

## Parameterizing Data Factory template
For best practices on parameterizing, see [here](../resource-manager-template-best-practices.md#parameters) for details. In general, parameter usage should be minimized, especially if variables can be used instead. Only provide parameters in the case of:

- Settings you wish to vary by environment
- Secrets (such as passwords)

In the case where you are pulling secrets from [Azure Key Vault](../key-vault/key-vault-get-started/) when deploying Azure Data Factory entities using templates, specify the **key vault** and **secret name** as shown in the following example.

	"parameters": {
		"storageAccountKey": { 
        	"reference": {
				"keyVault": {
					"id":"/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.KeyVault/vaults/<keyVaultName>",
		     	},
		    	"secretName": "<secretName>"
           	}, 
       	},
	   	...
	}

> [AZURE.NOTE] While exporting templates for existing data factories is currently not yet supported, it is in the works. 


