---
title: Use Resource Manager templates in Data Factory 
description: Learn how to create and use Azure Resource Manager templates to create Data Factory entities.
services: data-factory
documentationcenter: ''
author: djpmsft
ms.author: daperlov
manager: jroth
ms.reviewer: maghan
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 01/10/2018
---

# Use templates to create Azure Data Factory entities
> [!NOTE]
> This article applies to version 1 of Data Factory. 

## Overview
While using Azure Data Factory for your data integration needs, you may find yourself reusing the same pattern across different environments or implementing the same task repetitively within the same solution. Templates help you implement and manage these scenarios in an easy manner. Templates in Azure Data Factory are ideal for scenarios that involve reusability and repetition.

Consider the situation where an organization has 10 manufacturing plants across the world. The logs from each plant are stored in a separate on-premises SQL Server database. The company wants to build a single data warehouse in the cloud for ad hoc analytics. It also wants to have the same logic but different configurations for development, test, and production environments.

In this case, a task needs to be repeated within the same environment, but with different values across the 10 data factories for each manufacturing plant. In effect, **repetition** is present. Templating allows the abstraction of this generic flow (that is, pipelines having the same activities in each data factory), but uses a separate parameter file for each manufacturing plant.

Furthermore, as the organization wants to deploy these 10 data factories multiple times across different environments, templates can use this **reusability** by utilizing separate parameter files for development, test, and production environments.

## Templating with Azure Resource Manager
[Azure Resource Manager templates](../../azure-resource-manager/templates/overview.md) are a great way to achieve templating in Azure Data Factory. Resource Manager templates define the infrastructure and configuration of your Azure solution through a JSON file. Because Azure Resource Manager templates work with all/most Azure services, it can be widely used to easily manage all resources of your Azure assets. See [Authoring Azure Resource Manager templates](../../azure-resource-manager/templates/template-syntax.md) to learn more about the Resource Manager Templates in general.

## Tutorials
See the following tutorials for step-by-step instructions to create Data Factory entities by using Resource Manager templates:

* [Tutorial: Create a pipeline to copy data by using Azure Resource Manager template](data-factory-copy-activity-tutorial-using-azure-resource-manager-template.md)
* [Tutorial: Create a pipeline to process data by using Azure Resource Manager template](data-factory-build-your-first-pipeline.md)

## Data Factory templates on GitHub
Check out the following Azure quick start templates on GitHub:

* [Create a Data factory to copy data from Azure Blob Storage to Azure SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/101-data-factory-blob-to-sql-copy)
* [Create a Data factory with Hive activity on Azure HDInsight cluster](https://github.com/Azure/azure-quickstart-templates/tree/master/101-data-factory-hive-transformation)
* [Create a Data factory to copy data from Salesforce to Azure Blobs](https://github.com/Azure/azure-quickstart-templates/tree/master/101-data-factory-salesforce-to-blob-copy)
* [Create a Data factory that chains activities: copies data from an FTP server to Azure Blobs, invokes a hive script on an on-demand HDInsight cluster to transform the data, and copies result into Azure SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/201-data-factory-ftp-hive-blob)

Feel free to share your Azure Data Factory templates at [Azure Quick start](https://azure.microsoft.com/documentation/templates/). Refer to the [contribution guide](https://github.com/Azure/azure-quickstart-templates/tree/master/1-CONTRIBUTION-GUIDE) while developing templates that can be shared via this repository.

The following sections provide details about defining Data Factory resources in a Resource Manager template.

## Defining Data Factory resources in templates
The top-level template for defining a data factory is:

```JSON
"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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
```

### Define data factory
You define a data factory in the Resource Manager template as shown in the following sample:

```JSON
"resources": [
{
    "name": "[variables('<mydataFactoryName>')]",
    "apiVersion": "2015-10-01",
    "type": "Microsoft.DataFactory/datafactories",
    "location": "East US"
}
```
The dataFactoryName is defined in “variables” as:

```JSON
"dataFactoryName": "[concat('<myDataFactoryName>', uniqueString(resourceGroup().id))]",
```

### Define linked services

```JSON
"type": "linkedservices",
"name": "[variables('<LinkedServiceName>')]",
"apiVersion": "2015-10-01",
"dependsOn": [ "[variables('<dataFactoryName>')]" ],
"properties": {
    ...
}
```

See [Storage Linked Service](data-factory-azure-blob-connector.md#azure-storage-linked-service) or [Compute Linked Services](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) for details about the JSON properties for the specific linked service you wish to deploy. The “dependsOn” parameter specifies name of the corresponding data factory. An example of defining a linked service for Azure Storage is shown in the following JSON definition:

### Define datasets

```JSON
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
```
Refer to [Supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats) for details about the JSON properties for the specific dataset type you wish to deploy. Note the “dependsOn” parameter specifies name of the corresponding data factory and storage linked service. An example of defining dataset type of Azure blob storage is shown in the following JSON definition:

```JSON
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
```

### Define pipelines

```JSON
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
```

Refer to [defining pipelines](data-factory-create-pipelines.md#pipeline-json) for details about the JSON properties for defining the specific pipeline and activities you wish to deploy. Note the “dependsOn” parameter specifies name of the data factory, and any corresponding linked services or datasets. An example of a pipeline that copies data from Azure Blob Storage to Azure SQL Database is shown in the following JSON snippet:

```JSON
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
}
```
## Parameterizing Data Factory template
For best practices on parameterizing, see [Best practices for creating Azure Resource Manager templates](../../azure-resource-manager/resource-manager-template-best-practices.md). In general, parameter usage should be minimized, especially if variables can be used instead. Only provide parameters in the following scenarios:

* Settings vary by environment (example: development, test, and production)
* Secrets (such as passwords)

If you need to pull secrets from [Azure Key Vault](../../key-vault/key-vault-overview.md) when deploying Azure Data Factory entities using templates, specify the **key vault** and **secret name** as shown in the following example:

```JSON
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
```

> [!NOTE]
> While exporting templates for existing data factories is currently not yet supported, it is in the works.
>
>
