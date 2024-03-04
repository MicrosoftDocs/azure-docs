---
title: Build your first data factory (Resource Manager template)
description: In this tutorial, you create a sample Azure Data Factory pipeline using an Azure Resource Manager template.
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: v1
ms.custom: devx-track-arm-template
ms.topic: tutorial
ms.date: 04/12/2023
---

# Tutorial: Build your first Azure data factory using Azure Resource Manager template
> [!div class="op_single_selector"]
> * [Overview and prerequisites](data-factory-build-your-first-pipeline.md)
> * [Visual Studio](data-factory-build-your-first-pipeline-using-vs.md)
> * [PowerShell](data-factory-build-your-first-pipeline-using-powershell.md)
> * [Resource Manager Template](data-factory-build-your-first-pipeline-using-arm.md)
> * [REST API](data-factory-build-your-first-pipeline-using-rest-api.md)
>

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [Quickstart: Create a data factory using Azure Data Factory](../quickstart-create-data-factory-dot-net.md).

In this article, you use an Azure Resource Manager template to create your first Azure data factory. To do the tutorial using other tools/SDKs, select one of the options from the drop-down list.

The pipeline in this tutorial has one activity: **HDInsight Hive activity**. This activity runs a hive script on an Azure HDInsight cluster that transforms input data to produce output data. The pipeline is scheduled to run once a month between the specified start and end times.

> [!NOTE]
> The data pipeline in this tutorial transforms input data to produce output data. For a tutorial on how to copy data using Azure Data Factory, see [Tutorial: Copy data from Blob Storage to SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).
>
> The pipeline in this tutorial has only one activity of type: HDInsightHive. A pipeline can have more than one activity. And, you can chain two activities (run one activity after another) by setting the output dataset of one activity as the input dataset of the other activity. For more information, see [scheduling and execution in Data Factory](data-factory-scheduling-and-execution.md#multiple-activities-in-a-pipeline).

## Prerequisites

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

* Read through [Tutorial Overview](data-factory-build-your-first-pipeline.md) article and complete the **prerequisite** steps.
* Follow instructions in [How to install and configure Azure PowerShell](/powershell/azure/) article to install latest version of Azure PowerShell on your computer.
* See [Authoring Azure Resource Manager Templates](../../azure-resource-manager/templates/syntax.md) to learn about Azure Resource Manager templates.

## In this tutorial

| Entity | Description |
| --- | --- |
| Azure Storage linked service |Links your Azure Storage account to the data factory. The Azure Storage account holds the input and output data for the pipeline in this sample. |
| HDInsight on-demand linked service |Links an on-demand HDInsight cluster to the data factory. The cluster is automatically created for you to process data and is deleted after the processing is done. |
| Azure Blob input dataset |Refers to the Azure Storage linked service. The linked service refers to an Azure Storage account and the Azure Blob dataset specifies the container, folder, and file name in the storage that holds the input data. |
| Azure Blob output dataset |Refers to the Azure Storage linked service. The linked service refers to an Azure Storage account and the Azure Blob dataset specifies the container, folder, and file name in the storage that holds the output data. |
| Data pipeline |The pipeline has one activity of type HDInsightHive, which consumes the input dataset and produces the output dataset. |

A data factory can have one or more pipelines. A pipeline can have one or more activities in it. There are two types of activities: [data movement activities](data-factory-data-movement-activities.md) and [data transformation activities](data-factory-data-transformation-activities.md). In this tutorial, you create a pipeline with one activity (Hive activity).

The following section provides the complete Resource Manager template for defining Data Factory entities so that you can quickly run through the tutorial and test the template. To understand how each Data Factory entity is defined, see [Data Factory entities in the template](#data-factory-entities-in-the-template) section. To learn about the JSON syntax and properties for Data Factory resources in a template, see [Microsoft.DataFactory resource types](/azure/templates/microsoft.datafactory/allversions).

## Data Factory JSON template
The top-level Resource Manager template for defining a data factory is:

```json
{
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
            "type": "Microsoft.DataFactory/factories",
            "location": "westus",
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
Create a JSON file named **ADFTutorialARM.json** in **C:\ADFGetStarted** folder with the following content:

```json
{
    "contentVersion": "1.0.0.0",
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "parameters": {
        "storageAccountName": { "type": "string", "metadata": { "description": "Name of the Azure storage account that contains the input/output data." } },
          "storageAccountKey": { "type": "securestring", "metadata": { "description": "Key for the Azure storage account." } },
          "blobContainer": { "type": "string", "metadata": { "description": "Name of the blob container in the Azure Storage account." } },
          "inputBlobFolder": { "type": "string", "metadata": { "description": "The folder in the blob container that has the input file." } },
          "inputBlobName": { "type": "string", "metadata": { "description": "Name of the input file/blob." } },
          "outputBlobFolder": { "type": "string", "metadata": { "description": "The folder in the blob container that will hold the transformed data." } },
          "hiveScriptFolder": { "type": "string", "metadata": { "description": "The folder in the blob container that contains the Hive query file." } },
          "hiveScriptFile": { "type": "string", "metadata": { "description": "Name of the hive query (HQL) file." } }
    },
    "variables": {
          "dataFactoryName": "[concat('HiveTransformDF', uniqueString(resourceGroup().id))]",
          "azureStorageLinkedServiceName": "AzureStorageLinkedService",
          "hdInsightOnDemandLinkedServiceName": "HDInsightOnDemandLinkedService",
          "blobInputDatasetName": "AzureBlobInput",
          "blobOutputDatasetName": "AzureBlobOutput",
          "pipelineName": "HiveTransformPipeline"
    },
    "resources": [
      {
        "name": "[variables('dataFactoryName')]",
        "apiVersion": "2015-10-01",
        "type": "Microsoft.DataFactory/factories",
        "location": "West US",
        "resources": [
          {
            "type": "linkedservices",
            "name": "[variables('azureStorageLinkedServiceName')]",
            "dependsOn": [
                  "[variables('dataFactoryName')]"
            ],
            "apiVersion": "2015-10-01",
            "properties": {
                  "type": "AzureStorage",
                  "description": "Azure Storage linked service",
                  "typeProperties": {
                    "connectionString": "[concat('DefaultEndpointsProtocol=https;AccountName=',parameters('storageAccountName'),';AccountKey=',parameters('storageAccountKey'))]"
                  }
            }
          },
          {
            "type": "linkedservices",
            "name": "[variables('hdInsightOnDemandLinkedServiceName')]",
            "dependsOn": [
                  "[variables('dataFactoryName')]",
                  "[variables('azureStorageLinkedServiceName')]"
            ],
            "apiVersion": "2015-10-01",
            "properties": {
                "type": "HDInsightOnDemand",
                "typeProperties": {
                    "version": "3.5",
                    "clusterSize": 1,
                    "timeToLive": "00:05:00",
                    "osType": "Linux",
                    "linkedServiceName": "[variables('azureStorageLinkedServiceName')]"
                }
            }
          },
          {
            "type": "datasets",
            "name": "[variables('blobInputDatasetName')]",
            "dependsOn": [
                  "[variables('dataFactoryName')]",
                  "[variables('azureStorageLinkedServiceName')]"
            ],
            "apiVersion": "2015-10-01",
            "properties": {
                  "type": "AzureBlob",
                  "linkedServiceName": "[variables('azureStorageLinkedServiceName')]",
                  "typeProperties": {
                    "fileName": "[parameters('inputBlobName')]",
                    "folderPath": "[concat(parameters('blobContainer'), '/', parameters('inputBlobFolder'))]",
                    "format": {
                          "type": "TextFormat",
                          "columnDelimiter": ","
                    }
                  },
                  "availability": {
                    "frequency": "Month",
                    "interval": 1
                  },
                  "external": true
            }
          },
          {
            "type": "datasets",
            "name": "[variables('blobOutputDatasetName')]",
            "dependsOn": [
                  "[variables('dataFactoryName')]",
                  "[variables('azureStorageLinkedServiceName')]"
            ],
            "apiVersion": "2015-10-01",
            "properties": {
                  "type": "AzureBlob",
                  "linkedServiceName": "[variables('azureStorageLinkedServiceName')]",
                  "typeProperties": {
                    "folderPath": "[concat(parameters('blobContainer'), '/', parameters('outputBlobFolder'))]",
                    "format": {
                          "type": "TextFormat",
                          "columnDelimiter": ","
                    }
                  },
                  "availability": {
                    "frequency": "Month",
                    "interval": 1
                  }
            }
          },
          {
            "type": "datapipelines",
            "name": "[variables('pipelineName')]",
            "dependsOn": [
                  "[variables('dataFactoryName')]",
                  "[variables('azureStorageLinkedServiceName')]",
                  "[variables('hdInsightOnDemandLinkedServiceName')]",
                  "[variables('blobInputDatasetName')]",
                  "[variables('blobOutputDatasetName')]"
            ],
            "apiVersion": "2015-10-01",
            "properties": {
                  "description": "Pipeline that transforms data using Hive script.",
                  "activities": [
                {
                      "type": "HDInsightHive",
                      "typeProperties": {
                        "scriptPath": "[concat(parameters('blobContainer'), '/', parameters('hiveScriptFolder'), '/', parameters('hiveScriptFile'))]",
                        "scriptLinkedService": "[variables('azureStorageLinkedServiceName')]",
                        "defines": {
                              "inputtable": "[concat('wasb://', parameters('blobContainer'), '@', parameters('storageAccountName'), '.blob.core.windows.net/', parameters('inputBlobFolder'))]",
                              "partitionedtable": "[concat('wasb://', parameters('blobContainer'), '@', parameters('storageAccountName'), '.blob.core.windows.net/', parameters('outputBlobFolder'))]"
                        }
                      },
                      "inputs": [
                        {
                              "name": "[variables('blobInputDatasetName')]"
                        }
                      ],
                      "outputs": [
                        {
                              "name": "[variables('blobOutputDatasetName')]"
                        }
                      ],
                      "policy": {
                        "concurrency": 1,
                        "retry": 3
                      },
                      "scheduler": {
                        "frequency": "Month",
                        "interval": 1
                      },
                      "name": "RunSampleHiveActivity",
                      "linkedServiceName": "[variables('hdInsightOnDemandLinkedServiceName')]"
                }
                  ],
                  "start": "2017-07-01T00:00:00Z",
                  "end": "2017-07-02T00:00:00Z",
                  "isPaused": false
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
        "storageAccountName": {
            "value": "<Name of your Azure Storage account>"
        },
        "storageAccountKey": {
            "value": "<Key of your Azure Storage account>"
        },
        "blobContainer": {
            "value": "adfgetstarted"
        },
        "inputBlobFolder": {
            "value": "inputdata"
        },
        "inputBlobName": {
            "value": "input.log"
        },
        "outputBlobFolder": {
            "value": "partitioneddata"
        },
        "hiveScriptFolder": {
              "value": "script"
        },
        "hiveScriptFile": {
              "value": "partitionweblogs.hql"
        }
    }
}
```

> [!IMPORTANT]
> You may have separate parameter JSON files for development, testing, and production environments that you can use with the same Data Factory JSON template. By using a Power Shell script, you can automate deploying Data Factory entities in these environments.

## Create data factory

1. Start **Azure PowerShell** and run the following command:

   * Run the following command and enter the user name and password that you use to sign in to the Azure portal.

     ```powershell
     Connect-AzAccount
     ```

   * Run the following command to view all the subscriptions for this account.

     ```powershell
     Get-AzSubscription
     ```

   * Run the following command to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure portal.

     ```powershell
     Get-AzSubscription -SubscriptionName <SUBSCRIPTION NAME> | Set-AzContext
     ```

2. Run the following command to deploy Data Factory entities using the Resource Manager template you created in Step 1.

   ```powershell
   New-AzResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile C:\ADFGetStarted\ADFTutorialARM.json -TemplateParameterFile C:\ADFGetStarted\ADFTutorialARM-Parameters.json
   ```

## Monitor pipeline

1. After logging in to the [Azure portal](https://portal.azure.com/), Click **Browse** and select **Data factories**.
     :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-arm/BrowseDataFactories.png" alt-text="Browse->Data factories":::
2. In the **Data Factories** blade, click the data factory (**TutorialFactoryARM**) you created.
3. In the **Data Factory** blade for your data factory, click **Diagram**.

     :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-arm/DiagramTile.png" alt-text="Diagram Tile":::
4. In the **Diagram View**, you see an overview of the pipelines, and datasets used in this tutorial.

   :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-arm/DiagramView.png" alt-text="Diagram View":::
5. In the Diagram View, double-click the dataset **AzureBlobOutput**. You see that the slice that is currently being processed.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-arm/AzureBlobOutput.png" alt-text="Screenshot that shows the AzureBlobOutput dataset.":::
6. When processing is done, you see the slice in **Ready** state. Creation of an on-demand HDInsight cluster usually takes sometime (approximately 20 minutes). Therefore, expect the pipeline to take **approximately 30 minutes** to process the slice.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-arm/SliceReady.png" alt-text="Dataset":::
7. When the slice is in **Ready** state, check the **partitioneddata** folder in the **adfgetstarted** container in your blob storage for the output data.

See [Monitor datasets and pipeline](data-factory-monitor-manage-pipelines.md) for instructions on how to use the Azure portal blades to monitor the pipeline and datasets you have created in this tutorial.

You can also use Monitor and Manage App to monitor your data pipelines. See [Monitor and manage Azure Data Factory pipelines using Monitoring App](data-factory-monitor-manage-app.md) for details about using the application.

> [!IMPORTANT]
> The input file gets deleted when the slice is processed successfully. Therefore, if you want to rerun the slice or do the tutorial again, upload the input file (input.log) to the inputdata folder of the adfgetstarted container.
>
>

## Data Factory entities in the template
### Define data factory
You define a data factory in the Resource Manager template as shown in the following sample:

```json
"resources": [
  {
    "name": "[variables('dataFactoryName')]",
    "apiVersion": "2015-10-01",
    "type": "Microsoft.DataFactory/factories",
    "location": "West US"
  }
]
```

The dataFactoryName is defined as:

```json
"dataFactoryName": "[concat('HiveTransformDF', uniqueString(resourceGroup().id))]",
```
It is a unique string based on the resource group ID.

### Defining Data Factory entities
The following Data Factory entities are defined in the JSON template:

* [Azure Storage linked service](#azure-storage-linked-service)
* [HDInsight on-demand linked service](#hdinsight-on-demand-linked-service)
* [Azure blob input dataset](#azure-blob-input-dataset)
* [Azure blob output dataset](#azure-blob-output-dataset)
* [Data pipeline with a copy activity](#data-pipeline)

#### Azure Storage linked service
You specify the name and key of your Azure storage account in this section. See [Azure Storage linked service](data-factory-azure-blob-connector.md#azure-storage-linked-service) for details about JSON properties used to define an Azure Storage linked service.

```json
{
  "type": "linkedservices",
  "name": "[variables('azureStorageLinkedServiceName')]",
  "dependsOn": [
      "[variables('dataFactoryName')]"
  ],
  "apiVersion": "2015-10-01",
  "properties": {
      "type": "AzureStorage",
      "description": "Azure Storage linked service",
      "typeProperties": {
        "connectionString": "[concat('DefaultEndpointsProtocol=https;AccountName=',parameters('storageAccountName'),';AccountKey=',parameters('storageAccountKey'))]"
      }
  }
}
```
The **connectionString** uses the storageAccountName and storageAccountKey parameters. The values for these parameters passed by using a configuration file. The definition also uses variables: azureStorageLinkedService and dataFactoryName defined in the template.

#### HDInsight on-demand linked service
See [Compute linked services](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) article for details about JSON properties used to define an HDInsight on-demand linked service.

```json
{
  "type": "linkedservices",
  "name": "[variables('hdInsightOnDemandLinkedServiceName')]",
  "dependsOn": [
      "[variables('dataFactoryName')]"
  ],
  "apiVersion": "2015-10-01",
  "properties": {
      "type": "HDInsightOnDemand",
      "typeProperties": {
            "version": "3.5",
            "clusterSize": 1,
            "timeToLive": "00:05:00",
            "osType": "Linux",
        "linkedServiceName": "[variables('azureStorageLinkedServiceName')]"
      }
  }
}
```

Note the following points:

* The Data Factory creates a **Linux-based** HDInsight cluster for you with the above JSON. See [On-demand HDInsight Linked Service](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) for details.
* You could use **your own HDInsight cluster** instead of using an on-demand HDInsight cluster. See [HDInsight Linked Service](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) for details.
* The HDInsight cluster creates a **default container** in the blob storage you specified in the JSON (**linkedServiceName**). HDInsight does not delete this container when the cluster is deleted. This behavior is by design. With on-demand HDInsight linked service, a HDInsight cluster is created every time a slice needs to be processed unless there is an existing live cluster (**timeToLive**) and is deleted when the processing is done.

    As more slices are processed, you see many containers in your Azure blob storage. If you do not need them for troubleshooting of the jobs, you may want to delete them to reduce the storage cost. The names of these containers follow a pattern: "adf**yourdatafactoryname**-**linkedservicename**-datetimestamp". Use tools such as [Microsoft Azure Storage Explorer](https://storageexplorer.com/) to delete containers in your Azure blob storage.

See [On-demand HDInsight Linked Service](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) for details.

#### Azure blob input dataset
You specify the names of blob container, folder, and file that contains the input data. See [Azure Blob dataset properties](data-factory-azure-blob-connector.md#dataset-properties) for details about JSON properties used to define an Azure Blob dataset.

```json
{
  "type": "datasets",
  "name": "[variables('blobInputDatasetName')]",
  "dependsOn": [
      "[variables('dataFactoryName')]",
      "[variables('azureStorageLinkedServiceName')]"
  ],
  "apiVersion": "2015-10-01",
  "properties": {
      "type": "AzureBlob",
      "linkedServiceName": "[variables('azureStorageLinkedServiceName')]",
      "typeProperties": {
        "fileName": "[parameters('inputBlobName')]",
        "folderPath": "[concat(parameters('blobContainer'), '/', parameters('inputBlobFolder'))]",
        "format": {
            "type": "TextFormat",
            "columnDelimiter": ","
        }
      },
      "availability": {
      "frequency": "Month",
        "interval": 1
      },
      "external": true
  }
}
```
This definition uses the following parameters defined in parameter template: blobContainer, inputBlobFolder, and inputBlobName.

#### Azure Blob output dataset
You specify the names of blob container and folder that holds the output data. See [Azure Blob dataset properties](data-factory-azure-blob-connector.md#dataset-properties) for details about JSON properties used to define an Azure Blob dataset.

```json
{
  "type": "datasets",
  "name": "[variables('blobOutputDatasetName')]",
  "dependsOn": [
      "[variables('dataFactoryName')]",
      "[variables('azureStorageLinkedServiceName')]"
  ],
  "apiVersion": "2015-10-01",
  "properties": {
      "type": "AzureBlob",
      "linkedServiceName": "[variables('azureStorageLinkedServiceName')]",
      "typeProperties": {
        "folderPath": "[concat(parameters('blobContainer'), '/', parameters('outputBlobFolder'))]",
        "format": {
            "type": "TextFormat",
            "columnDelimiter": ","
        }
      },
      "availability": {
        "frequency": "Month",
        "interval": 1
      }
  }
}
```

This definition uses the following parameters defined in the parameter template: blobContainer and outputBlobFolder.

#### Data pipeline
You define a pipeline that transform data by running Hive script on an on-demand Azure HDInsight cluster. See [Pipeline JSON](data-factory-create-pipelines.md#pipeline-json) for descriptions of JSON elements used to define a pipeline in this example.

```json
{
    "type": "datapipelines",
    "name": "[variables('pipelineName')]",
    "dependsOn": [
        "[variables('dataFactoryName')]",
        "[variables('azureStorageLinkedServiceName')]",
        "[variables('hdInsightOnDemandLinkedServiceName')]",
        "[variables('blobInputDatasetName')]",
        "[variables('blobOutputDatasetName')]"
    ],
    "apiVersion": "2015-10-01",
    "properties": {
        "description": "Pipeline that transforms data using Hive script.",
        "activities": [
            {
                "type": "HDInsightHive",
                "typeProperties": {
                    "scriptPath": "[concat(parameters('blobContainer'), '/', parameters('hiveScriptFolder'), '/', parameters('hiveScriptFile'))]",
                    "scriptLinkedService": "[variables('azureStorageLinkedServiceName')]",
                    "defines": {
                        "inputtable": "[concat('wasb://', parameters('blobContainer'), '@', parameters('storageAccountName'), '.blob.core.windows.net/', parameters('inputBlobFolder'))]",
                        "partitionedtable": "[concat('wasb://', parameters('blobContainer'), '@', parameters('storageAccountName'), '.blob.core.windows.net/', parameters('outputBlobFolder'))]"
                    }
                },
                "inputs": [
                    {
                        "name": "[variables('blobInputDatasetName')]"
                    }
                ],
                "outputs": [
                    {
                        "name": "[variables('blobOutputDatasetName')]"
                    }
                ],
                "policy": {
                    "concurrency": 1,
                    "retry": 3
                },
                "scheduler": {
                    "frequency": "Month",
                    "interval": 1
                },
                "name": "RunSampleHiveActivity",
                "linkedServiceName": "[variables('hdInsightOnDemandLinkedServiceName')]"
            }
        ],
        "start": "2017-07-01T00:00:00Z",
        "end": "2017-07-02T00:00:00Z",
        "isPaused": false
    }
}
```

## Reuse the template
In the tutorial, you created a template for defining Data Factory entities and a template for passing values for parameters. To use the same template to deploy Data Factory entities to different environments, you create a parameter file for each environment and use it when deploying to that environment.

Example:

```powershell
New-AzResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile ADFTutorialARM.json -TemplateParameterFile ADFTutorialARM-Parameters-Dev.json

New-AzResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile ADFTutorialARM.json -TemplateParameterFile ADFTutorialARM-Parameters-Test.json

New-AzResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile ADFTutorialARM.json -TemplateParameterFile ADFTutorialARM-Parameters-Production.json
```

Notice that the first command uses parameter file for the development environment, second one for the test environment, and the third one for the production environment.

You can also reuse the template to perform repeated tasks. For example, you need to create many data factories with one or more pipelines that implement the same logic but each data factory uses different Azure storage and Azure SQL Database accounts. In this scenario, you use the same template in the same environment (dev, test, or production) with different parameter files to create data factories.

## Resource Manager template for creating a gateway
Here is a sample Resource Manager template for creating a logical gateway in the back. Install a gateway on your on-premises computer or Azure IaaS VM and register the gateway with Data Factory service using a key. See [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) for details.

```json
{
    "contentVersion": "1.0.0.0",
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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
            "type": "Microsoft.DataFactory/factories",
            "location": "eastus",
            "resources": [
                {
                    "dependsOn": [ "[concat('Microsoft.DataFactory/factories/', variables('dataFactoryName'))]" ],
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
