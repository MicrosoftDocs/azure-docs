---
title: "Quickstart: Create an Azure Data Factory using Azure CLI"
description: Create an Azure Data Factory, including a linked service, datasets, and a pipeline, and then run the pipeline to perform a simple action.
author: linda33wj
ms.author: jingwang
ms.service: azure-cli
ms.topic: quickstart
ms.date: 03/24/2021
ms.custom:
    - template-quickstart
    - devx-track-azurecli
---

# Quickstart: Create an Azure Data Factory using Azure CLI

This quickstart describes how to use Azure CLI to create an Azure Data Factory. The pipeline you create in this data factory **copies** data from one folder to another folder in an Azure blob storage. For a tutorial on how to **transform** data using Azure Data Factory, see [Tutorial: Transform data using Spark](transform-data-using-spark.md).

For an introduction to the Azure Data Factory service, see [Introduction to Azure Data Factory](introduction.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [azure-cli-prepare-your-environment](../../includes/azure-cli-prepare-your-environment.md)]

## 

To create a resource group, use the [az group create](/cli/azure/group#az_group_create) command:

```azurecli
az group create --name ADFQuickStartRG --location eastus
```

[az storage account create](/cli/azure/storage/container#az_storage_container_create)

```azurecli
az storage account create --resource-group ADFQuickStartRG --name adfquickstartstorage --location eastus
```

Create a container
```azurecli
az storage container create --resource-group timADFQuickStartRG --name adftutorial --account-name adfquickstartstorage --auth-mode key
```

Create a file to upload:

```console
This is text.
```

```azurecli
az storage blob upload --account-name adfquickstartstorage --name input/emp.txt --container-name adftutorial --file emp.txt --auth-mode key
```


unique name for df

```azurecli
az datafactory factory create --resource-group ADFQuickStartRG --factory-name ADFQuickStartFactory
```

```azurecli
az datafactory factory show --resource-group ADFQuickStartRG --factory-name ADFQuickStartFactory
```


create a linked service


get the connection string:

```azurecli
az storage account show-connection-string --resource-group ADFQuickStartRG --name adfquickstartstorage --key primary
```

json file called AzureStorageLinkedService.json

```json
{
	"type":"AzureStorage",
		"typeProperties":{
		"connectionString":{
		"type": "SecureString",	
		"value":<the connection string in quotation marks>
		}
	}
}
```

```azurecli
az datafactory linked-service create --resource-group ADFQuickStartRG --factory-name ADFQuickStartFactory --linked-service-name AzureStorageLinkedService --properties @AzureStorageLinkedService.json
```


create data sets 

InputDataset.json

```json
{
	"type": 
		"AzureBlob",
		"linkedServiceName": {
			"type":"LinkedServiceReference",
			"referenceName":"AzureStorageLinkedService"
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

```azurecli
az datafactory dataset create --resource-group ADFQuickStartRG --dataset-name InputDataset --factory-name ADFQuickStartFactory --properties @InputDataset.json
```

OutputDataset.json:

```json
{
	"type": 
		"AzureBlob",
		"linkedServiceName": {
			"type":"LinkedServiceReference",
			"referenceName":"AzureStorageLinkedService"
			},
        "annotations": [],
        "type": "Binary",
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "fileName": "emp.txt",
                "folderPath": "output",
                "container": "adftutorial"
		}
	}
}
```


```azurecli
az datafactory dataset create --resource-group ADFQuickStartRG --dataset-name OutputDataset --factory-name ADFQuickStartFactory --properties @OutputDataset.json
```


Adfv2QuickStartPipeline.json

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

```azurecli
az datafactory pipeline create --resource-group ADFQuickStartRG --factory-name ADFQuickStartFactory --name Adfv2QuickStartPipeline --pipeline @Adfv2QuickStartPipeline.json
```

```azurecli
az datafactory pipeline create-run --resource-group ADFQuickStartRG --name Adfv2QuickStartPipeline --factory-name ADFQuickStartFactory
```


```azurecli
az datafactory pipeline-run show --factory-name ADFQuickStartFactory --resource-group ADFQuickStartRG --run-id <runId>
```

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

```azurecli
az group delete --name ADFQuickStartRG
```

In this quickstart, you created the following JSON files:

- AzureStorageLinkedService.json
- InputDataset.json
- OutputDataset.json
- Adfv2QuickStartPipeline.json

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-quickstart.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->