---
title: Create an Azure data factory using Resource Manager template | Microsoft Docs
description: In this tutorial, you create a sample Azure Data Factory pipeline using an Azure Resource Manager template.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 11/28/2017
ms.author: spelluru

---
# Tutorial: Create an Azure data factory using Azure Resource Manager template
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-build-your-first-pipeline-using-arm.md)
> * [Version 2 - Preview](quickstart-create-data-factory-resource-manager-template.md) 

This quickstart describes how to use an Azure Resource Manager template to create an Azure data factory. The pipeline you create in this data factory **copies** data from one folder to another folder in an Azure blob storage. For a tutorial on how to **transform** data using Azure Data Factory, see [Tutorial: Transform data using Spark](transform-data-using-spark.md). 

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [build your first data factory with Data Factory version 1](v1/data-factory-build-your-first-pipeline-using-arm.md).
>
> This article does not provide a detailed introduction of the Data Factory service. For an introduction to the Azure Data Factory service, see [Introduction to Azure Data Factory](introduction.md).

In this article, you use an Azure Resource Manager template to create your first Azure data factory. To do the tutorial using other tools/SDKs, select one of the options from the drop-down list.

[!INCLUDE [data-factory-quickstart-prerequisites](../../includes/data-factory-quickstart-prerequisites.md)] 
[!INCLUDE [data-factory-quickstart-prerequisites-2](../../includes/data-factory-quickstart-prerequisites-2.md)]

## Authoring Azure Resource Manager templates
To learn about Azure Resource Manager templates in general, see [Authoring Azure Resource Manager Templates](../azure-resource-manager/resource-group-authoring-templates.md). 


The following section provides the complete Resource Manager template for defining Data Factory entities so that you can quickly run through the tutorial and test the template. To understand how each Data Factory entity is defined, see [Data Factory entities in the template](#data-factory-entities-in-the-template) section.

## Data Factory JSON template
The top-level Resource Manager template for defining a data factory is: 

```json
{
    "contentVersion": "1.0.0.0",
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "parameters": { ...
    },
    "variables": { ...
    },
    "resources": [
        {
            "name": "<yourdatafactoryname>",
            "apiVersion": "2017-09-01-preview",
            "type": "Microsoft.DataFactory/datafactories",
            "location": "<region. for example: East US>",
            "resources": [
                { ... },
                { ... },
                { ... },
                { ... }
            ]
        }
    ]
}
```
Create a JSON file named **ADFTutorialARM.json** in **C:\ADFTutorial** folder with the following content:

```json
{
  "contentVersion": "1.0.0.0",
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "parameters": {
    "dataFactoryName": {
      "type": "string",
      "metadata": {
        "description": "Name of the data factory. Must be globally unique."
      }
    },
    "dataFactoryLocation": {
      "type": "string",
      "allowedValues": [
        "East US",
        "East US 2"
      ],
      "defaultValue": "East US",      
      "metadata": {
        "description": "Location of the data factory. Currently, only East US and East US 2 are supported. "
      }
    },
    "storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Name of the Azure storage account that contains the input/output data."
      }
    },
    "storageAccountKey": {
      "type": "securestring",
      "metadata": {
        "description": "Key for the Azure storage account."
      }
    },
    "blobContainer": {
      "type": "string",
      "metadata": {
        "description": "Name of the blob container in the Azure Storage account."
      }
    },
    "inputBlobFolder": {
      "type": "string",
      "metadata": {
        "description": "The folder in the blob container that has the input file."
      }
    },
    "inputBlobName": {
      "type": "string",
      "metadata": {
        "description": "Name of the input file/blob."
      }
    },
    "outputBlobFolder": {
      "type": "string",
      "metadata": {
        "description": "The folder in the blob container that will hold the transformed data."
      }
    },
    "outputBlobName": {
      "type": "string",
      "metadata": {
        "description": "Name of the output file/blob."
      }
    }
  },
  "variables": {
    "azureStorageLinkedServiceName": "ArmtemplateStorageLinkedService",
    "inputDatasetName": "ArmtemplateTestDatasetIn",
    "outputDatasetName": "ArmtemplateTestDatasetOut",
    "pipelineName": "ArmtemplateSampleCopyPipeline",
    "triggerName": "ArmTemplateTestTrigger"
  },
  "resources": [
      {
      "name": "[parameters('dataFactoryName')]",
      "apiVersion": "2017-09-01-preview",
      "type": "Microsoft.DataFactory/factories",
      "location": "[parameters('dataFactoryLocation')]",
      "properties": {
        "loggingStorageAccountName": "[parameters('storageAccountName')]",
        "loggingStorageAccountKey": "[parameters('storageAccountKey')]"
      },
      "resources": [
        {
          "type": "linkedservices",
          "name": "[variables('azureStorageLinkedServiceName')]",
          "dependsOn": [
            "[parameters('dataFactoryName')]"
          ],
          "apiVersion": "2017-09-01-preview",
          "properties": {
            "type": "AzureStorage",
            "description": "Azure Storage linked service",
            "typeProperties": {
              "connectionString": {
                "value": "[concat('DefaultEndpointsProtocol=https;AccountName=',parameters('storageAccountName'),';AccountKey=',parameters('storageAccountKey'))]",
                "type": "SecureString"
              }
            }
          }
        },
        {
          "type": "datasets",
          "name": "[variables('inputDatasetName')]",
          "dependsOn": [
            "[parameters('dataFactoryName')]",
            "[variables('azureStorageLinkedServiceName')]"
          ],
          "apiVersion": "2017-09-01-preview",
          "properties": {
            "type": "AzureBlob",
            "typeProperties": {
              "format": {
                "type": "TextFormat",
                "columnDelimiter": ",",
                "nullValue": "\\N",
                "treatEmptyAsNull": false,
                "firstRowAsHeader": false
              },
              "folderPath": "[concat(parameters('blobContainer'), '/', parameters('inputBlobFolder'), '/')]",
              "fileName": "[parameters('inputBlobName')]"
            },
            "linkedServiceName": {
              "referenceName": "[variables('azureStorageLinkedServiceName')]",
              "type": "LinkedServiceReference"
            }
          }
        },
        {
          "type": "datasets",
          "name": "[variables('outputDatasetName')]",
          "dependsOn": [
            "[parameters('dataFactoryName')]",
            "[variables('azureStorageLinkedServiceName')]"
          ],
          "apiVersion": "2017-09-01-preview",
          "properties": {
            "type": "AzureBlob",
            "typeProperties": {
              "format": {
                "type": "TextFormat",
                "columnDelimiter": ",",
                "nullValue": "\\N",
                "treatEmptyAsNull": false,
                "firstRowAsHeader": false
              },
              "folderPath": "[concat(parameters('blobContainer'), '/', parameters('outputBlobFolder'), '/')]",
              "fileName": "[parameters('outputBlobName')]"
            },
            "linkedServiceName": {
              "referenceName": "[variables('azureStorageLinkedServiceName')]",
              "type": "LinkedServiceReference"
            }
          }
        },
        {
          "type": "pipelines",
          "name": "[variables('pipelineName')]",
          "dependsOn": [
            "[parameters('dataFactoryName')]",
            "[variables('azureStorageLinkedServiceName')]",
            "[variables('inputDatasetName')]",
            "[variables('outputDatasetName')]"
          ],
          "apiVersion": "2017-09-01-preview",
          "properties": {
            "activities": [
              {
                "type": "Copy",
                "typeProperties": {
                  "source": {
                    "type": "BlobSource"
                  },
                  "sink": {
                    "type": "BlobSink"
                  }
                },
                "name": "MyCopyActivity",
                "inputs": [
                  {
                    "referenceName": "[variables('inputDatasetName')]",
                    "type": "DatasetReference"
                  }
                ],
                "outputs": [
                  {
                    "referenceName": "[variables('outputDatasetName')]",
                    "type": "DatasetReference"
                  }
                ]
              }
            ]
          }
        },
        {
          "type": "triggers",
          "name": "[variables('triggerName')]",
          "dependsOn": [
            "[parameters('dataFactoryName')]",
            "[variables('azureStorageLinkedServiceName')]",
            "[variables('inputDatasetName')]",
            "[variables('outputDatasetName')]",
            "[variables('pipelineName')]"
          ],
          "apiVersion": "2017-09-01-preview",
          "properties": {
            "type": "ScheduleTrigger",
            "typeProperties": {
              "recurrence": {
                "frequency": "Hour",
                "interval": 1,
                "startTime": "2017-11-28T00:00:00",
                "endTime": "2017-11-29T00:00:00",
                "timeZone": "UTC"				
              }
            },
            "pipelines": [{
              "pipelineReference": {
                "type": "PipelineReference",
                "referenceName": "ArmtemplateSampleCopyPipeline"
              },
              "parameters": {}
            }]
          }
        }        
      ]
    }
  ]
}
```

> [!NOTE]
> You can find another example of Resource Manager template for creating an Azure data factory on [Tutorial: Create a pipeline with Copy Activity using an Azure Resource Manager template](data-factory-copy-activity-tutorial-using-azure-resource-manager-template.md).  
> 
> 

## Parameters JSON
Create a JSON file named **ADFTutorialARM-Parameters.json** that contains parameters for the Azure Resource Manager template.  

> [!IMPORTANT]
> Specify the name and key of your Azure Storage account for the **storageAccountName** and **storageAccountKey** parameters in this parameter file. 
> 
> 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "dataFactoryName": {
      "value": "<datafactoryname>"
    },    
    "dataFactoryLocation": {
      "value": "East US"
    },
    "storageAccountName": {
      "value": "<yourstroageaccountname>"
    },
    "storageAccountKey": {
      "value": "<yourstorageaccountkey>"
    },
    "blobContainer": {
      "value": "adftutorial"
    },
    "inputBlobFolder": {
      "value": "input"
    },
    "inputBlobName": {
      "value": "emp.txt"
    },
    "outputBlobFolder": {
      "value": "output"
    },
    "outputBlobName": {
      "value": "emp.txt"
    }
  }
}
```

> [!IMPORTANT]
> You may have separate parameter JSON files for development, testing, and production environments that you can use with the same Data Factory JSON template. By using a Power Shell script, you can automate deploying Data Factory entities in these environments. 
> 
> 

## Create data factory
1. Start **Azure PowerShell** and run the following command: 
   * Run the following command and enter the user name and password that you use to sign in to the Azure portal.
	```PowerShell
	Login-AzureRmAccount
	```  
   * Run the following command to view all the subscriptions for this account.
	```PowerShell
	Get-AzureRmSubscription
	``` 
   * Run the following command to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure portal.
	```
	Get-AzureRmSubscription -SubscriptionName <SUBSCRIPTION NAME> | Set-AzureRmContext
	```   
2. Run the following command to deploy Data Factory entities using the Resource Manager template you created in Step 1. 

	```PowerShell
    New-AzureRmResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile C:\ADFTutorial\ADFTutorialARM.json -TemplateParameterFile C:\ADFTutorial\ADFTutorialARM-Parameters.json
	```

## Monitor pipeline
1. After logging in to the [Azure portal](https://portal.azure.com/), Click **Browse** and select **Data factories**.
2. In the **Data Factories** page, click the data factory (**TutorialFactoryARM**) you created.    

### Defining Data Factory entities
The following Data Factory entities are defined in the JSON template: 

1. [Azure Storage linked service](#azure-storage-linked-service)
3. [Azure blob input dataset](#azure-blob-input-dataset)
4. [Azure Blob output dataset](#azure-blob-output-dataset)
5. [Data pipeline with a copy activity](#data-pipeline)

#### Azure Storage linked service
The AzureStorageLinkedService links your Azure storage account to the data factory. You created a container and uploaded data to this storage account as part of prerequisites. You specify the name and key of your Azure storage account in this section. See [Azure Storage linked service](connector-azure-blob-storage.md#linked-service-properties) for details about JSON properties used to define an Azure Storage linked service. 

```json
{
    "type": "linkedservices",
    "name": "[variables('azureStorageLinkedServiceName')]",
    "dependsOn": [
        "[parameters('dataFactoryName')]"
    ],
    "apiVersion": "2017-09-01-preview",
    "properties": {
        "type": "AzureStorage",
        "description": "Azure Storage linked service",
        "typeProperties": {
            "connectionString": {
                "value": "[concat('DefaultEndpointsProtocol=https;AccountName=',parameters('storageAccountName'),';AccountKey=',parameters('storageAccountKey'))]",
                "type": "SecureString"
            }
        }
    }
}
```

The connectionString uses the storageAccountName and storageAccountKey parameters. The values for these parameters passed by using a configuration file. The definition also uses variables: azureStroageLinkedService and dataFactoryName defined in the template. 

#### Azure blob input dataset
The Azure storage linked service specifies the connection string that Data Factory service uses at run time to connect to your Azure storage account. In Azure blob dataset definition, you specify names of blob container, folder, and file that contains the input data. See [Azure Blob dataset properties](connector-azure-blob-storage.md#dataset-properties) for details about JSON properties used to define an Azure Blob dataset. 

```json
{
    "type": "datasets",
    "name": "[variables('inputDatasetName')]",
    "dependsOn": [
    "[parameters('dataFactoryName')]",
    "[variables('azureStorageLinkedServiceName')]"
    ],
    "apiVersion": "2017-09-01-preview",
    "properties": {
    "type": "AzureBlob",
    "typeProperties": {
        "format": {
        "type": "TextFormat",
        "columnDelimiter": ",",
        "nullValue": "\\N",
        "treatEmptyAsNull": false,
        "firstRowAsHeader": false
        },
        "folderPath": "[concat(parameters('blobContainer'), '/', parameters('inputBlobFolder'), '/')]",
        "fileName": "[parameters('inputBlobName')]"
    },
    "linkedServiceName": {
        "referenceName": "[variables('azureStorageLinkedServiceName')]",
        "type": "LinkedServiceReference"
    }
    }
},

```

#### Azure blob output dataset
You specify the name of the folder in the Azure Blob Storage that holds the copied data from the input folder. See [Azure Blob dataset properties](connector-azure-blob-storage.md#dataset-properties) for details about JSON properties used to define an Azure SQL dataset. 

```json
{
    "type": "datasets",
    "name": "[variables('outputDatasetName')]",
    "dependsOn": [
    "[parameters('dataFactoryName')]",
    "[variables('azureStorageLinkedServiceName')]"
    ],
    "apiVersion": "2017-09-01-preview",
    "properties": {
    "type": "AzureBlob",
    "typeProperties": {
        "format": {
        "type": "TextFormat",
        "columnDelimiter": ",",
        "nullValue": "\\N",
        "treatEmptyAsNull": false,
        "firstRowAsHeader": false
        },
        "folderPath": "[concat(parameters('blobContainer'), '/', parameters('outputBlobFolder'), '/')]",
        "fileName": "[parameters('outputBlobName')]"
    },
    "linkedServiceName": {
        "referenceName": "[variables('azureStorageLinkedServiceName')]",
        "type": "LinkedServiceReference"
    }
    }
}
```

#### Data pipeline
You define a pipeline that copies data from the Azure blob dataset to the Azure SQL dataset. See [Pipeline JSON](concepts-pipelines-activities.md#pipeline-json) for descriptions of JSON elements used to define a pipeline in this example. 

```json
{
    "type": "pipelines",
    "name": "[variables('pipelineName')]",
    "dependsOn": [
    "[parameters('dataFactoryName')]",
    "[variables('azureStorageLinkedServiceName')]",
    "[variables('inputDatasetName')]",
    "[variables('outputDatasetName')]"
    ],
    "apiVersion": "2017-09-01-preview",
    "properties": {
    "activities": [
        {
        "type": "Copy",
        "typeProperties": {
            "source": {
            "type": "BlobSource"
            },
            "sink": {
            "type": "BlobSink"
            }
        },
        "name": "MyCopyActivity",
        "inputs": [
            {
            "referenceName": "[variables('inputDatasetName')]",
            "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
            "referenceName": "[variables('outputDatasetName')]",
            "type": "DatasetReference"
            }
        ]
        }
    ]
    }
}
```

#### Trigger
JSON definition: 

```json
{
    "type": "triggers",
    "name": "[variables('triggerName')]",
    "dependsOn": [
        "[parameters('dataFactoryName')]",
        "[variables('azureStorageLinkedServiceName')]",
        "[variables('inputDatasetName')]",
        "[variables('outputDatasetName')]",
        "[variables('pipelineName')]"
    ],
    "apiVersion": "2017-09-01-preview",
    "properties": {
        "type": "ScheduleTrigger",
        "typeProperties": {
            "recurrence": {
                "frequency": "Hour",
                "interval": 1,
                "startTime": "2017-11-28T00:00:00",
                "endTime": "2017-11-29T00:00:00",
                "timeZone": "UTC"				
            }
        },
        "pipelines": [{
            "pipelineReference": {
                "type": "PipelineReference",
                "referenceName": "ArmtemplateSampleCopyPipeline"
            },
            "parameters": {}
        }]
    }
}
```

## Reuse the template
In the tutorial, you created a template for defining Data Factory entities and a template for passing values for parameters. To use the same template to deploy Data Factory entities to different environments, you create a parameter file for each environment and use it when deploying to that environment.     

Example:  

```PowerShell
New-AzureRmResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile ADFTutorialARM.json -TemplateParameterFile ADFTutorialARM-Parameters-Dev.json

New-AzureRmResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile ADFTutorialARM.json -TemplateParameterFile ADFTutorialARM-Parameters-Test.json

New-AzureRmResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile ADFTutorialARM.json -TemplateParameterFile ADFTutorialARM-Parameters-Production.json
```
Notice that the first command uses parameter file for the development environment, second one for the test environment, and the third one for the production environment.  

You can also reuse the template to perform repeated tasks. For example, you need to create many data factories with one or more pipelines that implement the same logic but each data factory uses different Azure storage and Azure SQL Database accounts. In this scenario, you use the same template in the same environment (dev, test, or production) with different parameter files to create data factories. 

## Resource Manager template for creating a gateway
Here is a sample Resource Manager template for creating a logical gateway in the back. Install a gateway on your on-premises computer or Azure IaaS VM and register the gateway with Data Factory service using a key. See [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) for details.

```json
{
    "contentVersion": "1.0.0.0",
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "parameters": {
    },
    "variables": {
        "dataFactoryName":  "GatewayUsingArmDF",
        "apiVersion": "2015-10-01",
        "singleQuote": "'"
    },
    "resources": [
        {
            "name": "[variables('dataFactoryName')]",
            "apiVersion": "[variables('apiVersion')]",
            "type": "Microsoft.DataFactory/datafactories",
            "location": "eastus",
            "resources": [
                {
                    "dependsOn": [ "[concat('Microsoft.DataFactory/dataFactories/', variables('dataFactoryName'))]" ],
                    "type": "gateways",
                    "apiVersion": "[variables('apiVersion')]",
                    "name": "GatewayUsingARM",
                    "properties": {
                        "description": "my gateway"
                    }
                }            
            ]
        }
    ]
}
```
This template creates a data factory named GatewayUsingArmDF with a gateway named: GatewayUsingARM. 

## See Also
| Topic | Description |
|:--- |:--- |
| [Pipelines](data-factory-create-pipelines.md) |This article helps you understand pipelines and activities in Azure Data Factory and how to use them to construct end-to-end data-driven workflows for your scenario or business. |
| [Datasets](data-factory-create-datasets.md) |This article helps you understand datasets in Azure Data Factory. |
| [Scheduling and execution](data-factory-scheduling-and-execution.md) |This article explains the scheduling and execution aspects of Azure Data Factory application model. |
| [Monitor and manage pipelines using Monitoring App](data-factory-monitor-manage-app.md) |This article describes how to monitor, manage, and debug pipelines using the Monitoring & Management App. |

