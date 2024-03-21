---
title: "Quickstart: Create an Azure Data Factory using Azure CLI"
description: This quickstart creates an Azure Data Factory, including a linked service, datasets, and a pipeline. You can run the pipeline to do a file copy action.
author: jianleishen
ms.author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: quickstart
ms.date: 07/20/2023
ms.custom: template-quickstart, devx-track-azurecli, mode-api
---

# Quickstart: Create an Azure Data Factory using Azure CLI

This quickstart describes how to use Azure CLI to create an Azure Data Factory. The pipeline you create in this data factory copies data from one folder to another folder in an Azure Blob Storage. For information on how to transform data using Azure Data Factory, see [Transform data in Azure Data Factory](transform-data.md).

For an introduction to the Azure Data Factory service, see [Introduction to Azure Data Factory](introduction.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [azure-cli-prepare-your-environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

> [!NOTE]
> To create Data Factory instances, the user account that you use to sign in to Azure must be a member of the contributor or owner role, or an administrator of the Azure subscription. For more information, see [Azure roles](quickstart-create-data-factory-powershell.md#azure-roles).

## Prepare a container and test file

This quickstart uses an Azure Storage account, which includes a container with a file.

1. To create a resource group named `ADFQuickStartRG`, use the [az group create](/cli/azure/group#az-group-create) command:

   ```azurecli
   az group create --name ADFQuickStartRG --location eastus
   ```

1. Create a storage account by using the [az storage account create](/cli/azure/storage/container#az-storage-container-create) command:

   ```azurecli
   az storage account create --resource-group ADFQuickStartRG \
       --name adfquickstartstorage --location eastus
   ```

1. Create a container named `adftutorial` by using the [az storage container create](/cli/azure/storage/container#az-storage-container-create) command:

   ```azurecli
   az storage container create --resource-group ADFQuickStartRG --name adftutorial \
       --account-name adfquickstartstorage --auth-mode key
   ```

1. In the local directory, create a file named `emp.txt` to upload. If you're working in Azure Cloud Shell, you can find the current working directory by using the `echo $PWD` Bash command. You can use standard Bash commands, like `cat`, to create a file:

   ```console
   cat > emp.txt
   This is text.
   ```

   Use **Ctrl+D** to save your new file.

1. To upload the new file to your Azure storage container, use the [az storage blob upload](/cli/azure/storage/blob#az-storage-blob-upload) command:

   ```azurecli
   az storage blob upload --account-name adfquickstartstorage --name input/emp.txt \
       --container-name adftutorial --file emp.txt --auth-mode key
   ```

   This command uploads to a new folder named `input`.

## Create a data factory

To create an Azure data factory, run the [az datafactory create](/cli/azure/datafactory#az-datafactory-create) command:

```azurecli
az datafactory create --resource-group ADFQuickStartRG \
    --factory-name ADFTutorialFactory
```

> [!IMPORTANT]
> Replace `ADFTutorialFactory` with a globally unique data factory name, for example, ADFTutorialFactorySP1127.

You can see the data factory that you created by using the [az datafactory show](/cli/azure/datafactory#az-datafactory-factory-show) command:

```azurecli
az datafactory show --resource-group ADFQuickStartRG \
    --factory-name ADFTutorialFactory
```

## Create a linked service and datasets

Next, create a linked service and two datasets.

1. Get the connection string for your storage account by using the [az storage account show-connection-string](/cli/azure/datafactory#az-datafactory-factory-show) command:

   ```azurecli
   az storage account show-connection-string --resource-group ADFQuickStartRG \
       --name adfquickstartstorage --key primary
   ```

1. In your working directory, create a JSON file with this content, which includes your own connection string from the previous step. Name the file `AzureStorageLinkedService.json`:

    ```json
    {
        "type": "AzureBlobStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountName>;AccountKey=<accountKey>;EndpointSuffix=core.windows.net"
        }
    }
    ```

1. Create a linked service, named `AzureStorageLinkedService`, by using the [az datafactory linked-service create](/cli/azure/datafactory/linked-service#az-datafactory-linked-service-create) command:

   ```azurecli
   az datafactory linked-service create --resource-group ADFQuickStartRG \
       --factory-name ADFTutorialFactory --linked-service-name AzureStorageLinkedService \
       --properties @AzureStorageLinkedService.json
   ```

1. In your working directory, create a JSON file with this content, named `InputDataset.json`:

    ```json
    {
        "linkedServiceName": {
            "referenceName": "AzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "annotations": [],
        "type": "Binary",
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "fileName": "emp.txt",
                "folderPath": "input",
                "container": "adftutorial"
            }
        }
    }
    ```

1. Create an input dataset named `InputDataset` by using the [az datafactory dataset create](/cli/azure/datafactory/dataset#az-datafactory-dataset-create) command:

   ```azurecli
   az datafactory dataset create --resource-group ADFQuickStartRG \
       --dataset-name InputDataset --factory-name ADFTutorialFactory \
       --properties @InputDataset.json
   ```

1. In your working directory, create a JSON file with this content, named `OutputDataset.json`:

    ```json
    {
        "linkedServiceName": {
            "referenceName": "AzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "annotations": [],
        "type": "Binary",
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "folderPath": "output",
                "container": "adftutorial"
            }
        }
    }
    ```

1. Create an output dataset named `OutputDataset` by using the [az datafactory dataset create](/cli/azure/datafactory/dataset#az-datafactory-dataset-create) command:

   ```azurecli
   az datafactory dataset create --resource-group ADFQuickStartRG \
       --dataset-name OutputDataset --factory-name ADFTutorialFactory \
       --properties @OutputDataset.json
   ```

## Create and run the pipeline

Finally, create and run the pipeline.

1. In your working directory, create a JSON file with this content named `Adfv2QuickStartPipeline.json`:

    ```json
    {
        "name": "Adfv2QuickStartPipeline",
        "properties": {
            "activities": [
                {
                    "name": "CopyFromBlobToBlob",
                    "type": "Copy",
                    "dependsOn": [],
                    "policy": {
                        "timeout": "7.00:00:00",
                        "retry": 0,
                        "retryIntervalInSeconds": 30,
                        "secureOutput": false,
                        "secureInput": false
                    },
                    "userProperties": [],
                    "typeProperties": {
                        "source": {
                            "type": "BinarySource",
                            "storeSettings": {
                                "type": "AzureBlobStorageReadSettings",
                                "recursive": true
                            }
                        },
                        "sink": {
                            "type": "BinarySink",
                            "storeSettings": {
                                "type": "AzureBlobStorageWriteSettings"
                            }
                        },
                        "enableStaging": false
                    },
                    "inputs": [
                        {
                            "referenceName": "InputDataset",
                            "type": "DatasetReference"
                        }
                    ],
                    "outputs": [
                        {
                            "referenceName": "OutputDataset",
                            "type": "DatasetReference"
                        }
                    ]
                }
            ],
            "annotations": []
        }
    }
    ```

1. Create a pipeline named `Adfv2QuickStartPipeline` by using the [az datafactory pipeline create](/cli/azure/datafactory/pipeline#az-datafactory-pipeline-create) command:

   ```azurecli
   az datafactory pipeline create --resource-group ADFQuickStartRG \
       --factory-name ADFTutorialFactory --name Adfv2QuickStartPipeline \
       --pipeline @Adfv2QuickStartPipeline.json
   ```

1. Run the pipeline by using the [az datafactory pipeline create-run](/cli/azure/datafactory/pipeline#az-datafactory-pipeline-create-run) command:

   ```azurecli
   az datafactory pipeline create-run --resource-group ADFQuickStartRG \
       --name Adfv2QuickStartPipeline --factory-name ADFTutorialFactory
   ```

   This command returns a run ID. Copy it for use in the next command.

1. Verify that the pipeline run succeeded by using the [az datafactory pipeline-run show](/cli/azure/datafactory/pipeline-run#az-datafactory-pipeline-run-show) command:

   ```azurecli
   az datafactory pipeline-run show --resource-group ADFQuickStartRG \
       --factory-name ADFTutorialFactory --run-id 00000000-0000-0000-0000-000000000000
   ```

You can also verify that your pipeline ran as expected by using the [Azure portal](https://portal.azure.com/). For more information, see [Review deployed resources](quickstart-create-data-factory-powershell.md#review-deployed-resources).

## Clean up resources

All of the resources in this quickstart are part of the same resource group. To remove them all, use the [az group delete](/cli/azure/group#az-group-delete) command:

```azurecli
az group delete --name ADFQuickStartRG
```

If you're using this resource group for anything else, instead, delete individual resources. For instance, to remove the linked service, use the [az datafactory linked-service delete](/cli/azure/datafactory/linked-service#az-datafactory-linked-service-delete) command.

In this quickstart, you created the following JSON files:

- AzureStorageLinkedService.json
- InputDataset.json
- OutputDataset.json
- Adfv2QuickStartPipeline.json

Delete them by using standard Bash commands.

## Related content

- [Pipelines and activities in Azure Data Factory](concepts-pipelines-activities.md)
- [Linked services in Azure Data Factory](concepts-linked-services.md)
- [Datasets in Azure Data Factory](concepts-datasets-linked-services.md)
- [Transform data in Azure Data Factory](transform-data.md)
