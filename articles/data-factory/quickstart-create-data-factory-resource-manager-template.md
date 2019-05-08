---
title: Create an Azure data factory using Resource Manager template | Microsoft Docs
description: In this tutorial, you create a sample Azure Data Factory pipeline using an Azure Resource Manager template.
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: quickstart
ms.date: 02/20/2019
author: gauravmalhot
ms.author: gamal
manager: craigg
---
# Tutorial: Create an Azure data factory using Azure Resource Manager template

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-build-your-first-pipeline-using-arm.md)
> * [Current version](quickstart-create-data-factory-resource-manager-template.md)

This quickstart describes how to use an Azure Resource Manager template to create an Azure data factory. The pipeline you create in this data factory **copies** data from one folder to another folder in an Azure blob storage. For a tutorial on how to **transform** data using Azure Data Factory, see [Tutorial: Transform data using Spark](transform-data-using-spark.md).

> [!NOTE]
> This article does not provide a detailed introduction of the Data Factory service. For an introduction to the Azure Data Factory service, see [Introduction to Azure Data Factory](introduction.md).

[!INCLUDE [data-factory-quickstart-prerequisites](../../includes/data-factory-quickstart-prerequisites.md)]

### Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Install the latest Azure PowerShell modules by following instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-Az-ps).

## Resource Manager templates

To learn about Azure Resource Manager templates in general, see [Authoring Azure Resource Manager Templates](../azure-resource-manager/resource-group-authoring-templates.md).

The following section provides the complete Resource Manager template for defining Data Factory entities so that you can quickly run through the tutorial and test the template. To understand how each Data Factory entity is defined, see [Data Factory entities in the template](#data-factory-entities-in-the-template) section.

To learn about the JSON syntax and properties for Data Factory resources in a template, see [Microsoft.DataFactory resource types](/azure/templates/microsoft.datafactory/allversions).

## Data Factory JSON

Create a JSON file named **ADFTutorialARM.json** in **C:\ADFTutorial** folder with the following content:

```json
{
	"contentVersion": "1.0.0.0",
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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
				"East US 2",
				"West Europe"
			],
			"defaultValue": "East US",
			"metadata": {
				"description": "Location of the data factory. Currently, only East US, East US 2, and West Europe are supported. "
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
		},
		"triggerStartTime": {
			"type": "string",
			"metadata": {
				"description": "Start time for the trigger."
			}
		},
		"triggerEndTime": {
			"type": "string",
			"metadata": {
				"description": "End time for the trigger."
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
	"resources": [{
		"name": "[parameters('dataFactoryName')]",
		"apiVersion": "2018-06-01",
		"type": "Microsoft.DataFactory/factories",
		"location": "[parameters('dataFactoryLocation')]",
		"identity": {
			"type": "SystemAssigned"
		},
		"resources": [{
				"type": "linkedservices",
				"name": "[variables('azureStorageLinkedServiceName')]",
				"dependsOn": [
					"[parameters('dataFactoryName')]"
				],
				"apiVersion": "2018-06-01",
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
				"apiVersion": "2018-06-01",
				"properties": {
					"type": "AzureBlob",
					"typeProperties": {
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
				"apiVersion": "2018-06-01",
				"properties": {
					"type": "AzureBlob",
					"typeProperties": {
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
				"apiVersion": "2018-06-01",
				"properties": {
					"activities": [{
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
						"inputs": [{
							"referenceName": "[variables('inputDatasetName')]",
							"type": "DatasetReference"
						}],
						"outputs": [{
							"referenceName": "[variables('outputDatasetName')]",
							"type": "DatasetReference"
						}]
					}]
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
				"apiVersion": "2018-06-01",
				"properties": {
					"type": "ScheduleTrigger",
					"typeProperties": {
						"recurrence": {
							"frequency": "Hour",
							"interval": 1,
							"startTime": "[parameters('triggerStartTime')]",
							"endTime": "[parameters('triggerEndTime')]",
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
	}]
}
```

## Parameters JSON

Create a JSON file named **ADFTutorialARM-Parameters.json** that contains parameters for the Azure Resource Manager template.

> [!IMPORTANT]
> - Specify the name and key of your Azure Storage account for the **storageAccountName** and **storageAccountKey** parameters in this parameter file. You created the adftutorial container and uploaded the sample file (emp.txt) to the input folder in this Azure blob storage.
> - Specify a globally unique name for the data factory for the **dataFactoryName** parameter. For example: ARMTutorialFactoryJohnDoe11282017.
> - For the **triggerStartTime**, specify the current day in the format: `2017-11-28T00:00:00`.
> - For the **triggerEndTime**, specify the next day in the format: `2017-11-29T00:00:00`. You can also check the current UTC time and specify the next hour or two as the end time. For example, if the UTC time now is 1:32 AM, specify `2017-11-29:03:00:00` as the end time. In this case, the trigger runs the pipeline twice (at 2 AM and 3 AM).

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
      "value": "<yourstorageaccountname>"
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
    },
    "triggerStartTime": {
        "value": "2017-11-28T00:00:00. Set to today"
    },
    "triggerEndTime": {
        "value": "2017-11-29T00:00:00. Set to tomorrow"
    }
  }
}
```

> [!IMPORTANT]
> You may have separate parameter JSON files for development, testing, and production environments that you can use with the same Data Factory JSON template. By using a Power Shell script, you can automate deploying Data Factory entities in these environments.

## Deploy Data Factory entities

In PowerShell, run the following command to deploy Data Factory entities using the Resource Manager template you created earlier in this quickstart.

```powershell
New-AzResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile C:\ADFTutorial\ADFTutorialARM.json -TemplateParameterFile C:\ADFTutorial\ADFTutorialARM-Parameters.json
```

You see output similar to the following sample:

```console
DeploymentName          : MyARMDeployment
ResourceGroupName       : ADFTutorialResourceGroup
ProvisioningState       : Succeeded
Timestamp               : 11/29/2017 3:11:13 AM
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name                 Type            Value
                          ===============      ============    ==========
                          dataFactoryName      String          <data factory name>
                          dataFactoryLocation  String          East US
                          storageAccountName   String          <storage account name>
                          storageAccountKey    SecureString
                          blobContainer        String          adftutorial
                          inputBlobFolder      String          input
                          inputBlobName        String          emp.txt
                          outputBlobFolder     String          output
                          outputBlobName       String          emp.txt
                          triggerStartTime     String          11/29/2017 12:00:00 AM
                          triggerEndTime       String          11/29/2017 4:00:00 AM

Outputs                 :
DeploymentDebugLogLevel :
```

## Start the trigger

The template deploys the following Data Factory entities:

- Azure Storage linked service
- Azure Blob datasets (input and output)
- Pipeline with a copy activity
- Trigger to trigger the pipeline

The deployed trigger is in stopped state. One of the ways to start the trigger is to use the **Start-AzDataFactoryV2Trigger** PowerShell cmdlet. The following procedure provides detailed steps:

1. In the PowerShell window, create a variable to hold the name of the resource group. Copy the following command into the PowerShell window, and press ENTER. If you have specified a different resource group name for the New-AzResourceGroupDeployment command, update the value here.

    ```powershell
    $resourceGroupName = "ADFTutorialResourceGroup"
    ```
2. Create a variable to hold the name of the data factory. Specify the same name that you specified in the ADFTutorialARM-Parameters.json file.

    ```powershell
    $dataFactoryName = "<yourdatafactoryname>"
    ```
3. Set a variable for the name of the trigger. The name of the trigger is hardcoded in the Resource Manager template file (ADFTutorialARM.json).

    ```powershell
    $triggerName = "ArmTemplateTestTrigger"
    ```
4. Get the **status of the trigger** by running the following PowerShell command after specifying the name of your data factory and trigger:

    ```powershell
    Get-AzDataFactoryV2Trigger -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -Name $triggerName
    ```

    Here is the sample output:

    ```json
    TriggerName       : ArmTemplateTestTrigger
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : ARMFactory1128
    Properties        : Microsoft.Azure.Management.DataFactory.Models.ScheduleTrigger
    RuntimeState      : Stopped
    ```
    
    Notice that the runtime state of the trigger is **Stopped**.
5. **Start the trigger**. The trigger runs the pipeline defined in the template at the hour. That's, if you executed this command at 2:25 PM, the trigger runs the pipeline at 3 PM for the first time. Then, it runs the pipeline hourly until the end time you specified for the trigger.

    ```powershell
    Start-AzDataFactoryV2Trigger -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -TriggerName $triggerName
    ```
    
    Here is the sample output:
    
    ```console
    Confirm
    Are you sure you want to start trigger 'ArmTemplateTestTrigger' in data factory 'ARMFactory1128'?
    [Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): y
    True
    ```
6. Confirm that the trigger has been started by running the Get-AzDataFactoryV2Trigger command again.

    ```powershell
    Get-AzDataFactoryV2Trigger -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -TriggerName $triggerName
    ```
    
    Here is the sample output:
    
    ```console
    TriggerName       : ArmTemplateTestTrigger
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : ARMFactory1128
    Properties        : Microsoft.Azure.Management.DataFactory.Models.ScheduleTrigger
    RuntimeState      : Started
    ```

## Monitor the pipeline

1. After logging in to the [Azure portal](https://portal.azure.com/), Click **All services**, search with the keyword such as **data fa**, and select **Data factories**.

    ![Browse data factories menu](media/quickstart-create-data-factory-resource-manager-template/browse-data-factories-menu.png)

2. In the **Data Factories** page, click the data factory you created. If needed, filter the list with the name of your data factory.

    ![Select data factory](media/quickstart-create-data-factory-resource-manager-template/select-data-factory.png)

3. In the Data factory page, click **Monitor & Manage** tile.

    ![Monitor and manage tile](media/quickstart-create-data-factory-resource-manager-template/monitor-manage-tile.png)

4. The **Data Integration Application** should open in a separate tab in the web browser. If the monitor tab is not active, switch to the **monitor tab**. Notice that the pipeline run was triggered by a **scheduler trigger**.

    ![Monitor pipeline run](media/quickstart-create-data-factory-resource-manager-template/monitor-pipeline-run.png)

    > [!IMPORTANT]
    > You see pipeline runs only at the hour clock (for example: 4 AM, 5 AM, 6 AM, etc.). Click **Refresh** on the toolbar to refresh the list when the time reaches the next hour.

5. Click the link in the **Actions** columns.

    ![Pipeline actions link](media/quickstart-create-data-factory-resource-manager-template/pipeline-actions-link.png)

6. You see the activity runs associated with the pipeline run. In this quickstart, the pipeline has only one activity of type: Copy. Therefore, you see a run for that activity.

    ![Activity runs](media/quickstart-create-data-factory-resource-manager-template/activity-runs.png)
7. Click the link under **Output** column. You see the output from the copy operation in an **Output** window. Click the maximize button to see the full output. You can close the maximized output window or close it.

    ![Output window](media/quickstart-create-data-factory-resource-manager-template/output-window.png)
8. Stop the trigger once you see a successful/failure run. The trigger runs the pipeline once an hour. The pipeline copies the same file from the input folder to the output folder for each run. To stop the trigger, run the following command in the PowerShell window.
    
    ```powershell
    Stop-AzDataFactoryV2Trigger -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -Name $triggerName
    ```

[!INCLUDE [data-factory-quickstart-verify-output-cleanup.md](../../includes/data-factory-quickstart-verify-output-cleanup.md)]

## <a name="data-factory-entities-in-the-template"></a> JSON definitions for entities

The following Data Factory entities are defined in the JSON template:

- [Azure Storage linked service](#azure-storage-linked-service)
- [Azure blob input dataset](#azure-blob-input-dataset)
- [Azure Blob output dataset](#azure-blob-output-dataset)
- [Data pipeline with a copy activity](#data-pipeline)
- [Trigger](#trigger)

#### Azure Storage linked service

The AzureStorageLinkedService links your Azure storage account to the data factory. You created a container and uploaded data to this storage account as part of prerequisites. You specify the name and key of your Azure storage account in this section. See [Azure Storage linked service](connector-azure-blob-storage.md#linked-service-properties) for details about JSON properties used to define an Azure Storage linked service.

```json
{
    "type": "linkedservices",
    "name": "[variables('azureStorageLinkedServiceName')]",
    "dependsOn": [
        "[parameters('dataFactoryName')]"
    ],
    "apiVersion": "2018-06-01",
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

The connectionString uses the storageAccountName and storageAccountKey parameters. The values for these parameters passed by using a configuration file. The definition also uses variables: azureStorageLinkedService and dataFactoryName defined in the template.

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
    "apiVersion": "2018-06-01",
    "properties": {
        "type": "AzureBlob",
        "typeProperties": {
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

You specify the name of the folder in the Azure Blob Storage that holds the copied data from the input folder. See [Azure Blob dataset properties](connector-azure-blob-storage.md#dataset-properties) for details about JSON properties used to define an Azure Blob dataset.

```json
{
    "type": "datasets",
    "name": "[variables('outputDatasetName')]",
    "dependsOn": [
        "[parameters('dataFactoryName')]",
        "[variables('azureStorageLinkedServiceName')]"
    ],
    "apiVersion": "2018-06-01",
    "properties": {
        "type": "AzureBlob",
        "typeProperties": {
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

You define a pipeline that copies data from one Azure blob dataset to another Azure blob dataset. See [Pipeline JSON](concepts-pipelines-activities.md#pipeline-json) for descriptions of JSON elements used to define a pipeline in this example.

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
    "apiVersion": "2018-06-01",
    "properties": {
        "activities": [{
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
            "inputs": [{
                "referenceName": "[variables('inputDatasetName')]",
                "type": "DatasetReference"
            }],
            "outputs": [{
                "referenceName": "[variables('outputDatasetName')]",
                "type": "DatasetReference"
            }]
        }]
    }
}
```

#### Trigger

You define a trigger that runs the pipeline once an hour. The deployed trigger is in stopped state. Start the trigger by using the **Start-AzDataFactoryV2Trigger** cmdlet. For more information about triggers, see [Pipeline execution and triggers](concepts-pipeline-execution-triggers.md#triggers) article.

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
    "apiVersion": "2018-06-01",
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

```powershell
New-AzResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile ADFTutorialARM.json -TemplateParameterFile ADFTutorialARM-Parameters-Dev.json

New-AzResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile ADFTutorialARM.json -TemplateParameterFile ADFTutorialARM-Parameters-Test.json

New-AzResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile ADFTutorialARM.json -TemplateParameterFile ADFTutorialARM-Parameters-Production.json
```

Notice that the first command uses parameter file for the development environment, second one for the test environment, and the third one for the production environment.

You can also reuse the template to perform repeated tasks. For example, create many data factories with one or more pipelines that implement the same logic but each data factory uses different Azure storage accounts. In this scenario, you use the same template in the same environment (dev, test, or production) with different parameter files to create data factories.

## Next steps

The pipeline in this sample copies data from one location to another location in an Azure blob storage. Go through the [tutorials](tutorial-copy-data-dot-net.md) to learn about using Data Factory in more scenarios.
