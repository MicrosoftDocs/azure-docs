---
title: Create an Azure Data Factory using REST API
description: Create an Azure Data Factory pipeline to copy data from one location in Azure Blob storage to another location.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.devlang: rest-api
ms.topic: quickstart
ms.date: 07/20/2023
ms.author: jianleishen
ms.custom: devx-track-azurepowershell, mode-api
---

# Quickstart: Create an Azure Data Factory and pipeline by using the REST API

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Current version](quickstart-create-data-factory-rest-api.md)

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Azure Data Factory is a cloud-based data integration service that allows you to create data-driven workflows in the cloud for orchestrating and automating data movement and data transformation. Using Azure Data Factory, you can create and schedule data-driven workflows (called pipelines) that can ingest data from disparate data stores, process/transform the data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning, and publish output data to data stores such as Azure Synapse Analytics for business intelligence (BI) applications to consume.

This quickstart describes how to use REST API to create an Azure Data Factory. The pipeline in this data factory copies data from one location to another location in an Azure blob storage.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

* **Azure subscription**. If you don't have a subscription, you can create a [free trial](https://azure.microsoft.com/pricing/free-trial/) account.
* **Azure Storage account**. You use the blob storage as **source** and **sink** data store. If you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-account-create.md) article for steps to create one.
* Create a **blob container** in Blob Storage, create an input **folder** in the container, and upload some files to the folder. You can use tools such as [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to connect to Azure Blob storage, create a blob container, upload input file, and verify the output file.
* Install **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell). This quickstart uses PowerShell to invoke REST API calls.
* **Create an application in Azure Active Directory** following [this instruction](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal). Make note of the following values that you use in later steps: **application ID**, **clientSecrets**, and **tenant ID**. Assign application to "**Contributor**" role at either subscription or resource group level.
>[!NOTE]
>	For Sovereign clouds, you must use the appropriate cloud-specific endpoints for ActiveDirectoryAuthority and ResourceManagerUrl (BaseUri). 
>	 You can use PowerShell to easily get the endpoint Urls for various clouds by executing “Get-AzEnvironment | Format-List”, which will return a list of endpoints for each cloud environment.  
>	 
## Set global variables

1. Launch **PowerShell**. Keep Azure PowerShell open until the end of this quickstart. If you close and reopen, you need to run the commands again.

    Run the following command, and enter the user name and password that you use to sign in to the Azure portal:

    ```powershell
    Connect-AzAccount
    ```
    Run the following command to view all the subscriptions for this account:

    ```powershell
    Get-AzSubscription
    ```
    Run the following command to select the subscription that you want to work with. Replace **SubscriptionId** with the ID of your Azure subscription:

    ```powershell
    Select-AzSubscription -SubscriptionId "<SubscriptionId>"
    ```
2. Run the following commands after replacing the places-holders with your own values, to set global variables to be used in later steps.

    ```powershell
    $tenantID = "<your tenant ID>"
    $appId = "<your application ID>"
    $clientSecrets = "<your clientSecrets for the application>"
    $subscriptionId = "<your subscription ID to create the factory>"
    $resourceGroupName = "<your resource group to create the factory>"
    $factoryName = "<specify the name of data factory to create. It must be globally unique.>"
    $apiVersion = "2018-06-01"
    ```

## Authenticate with Azure AD

Run the following commands to authenticate with Azure Active Directory (AAD):

```powershell
$credentials = Get-Credential -UserName $appId
Connect-AzAccount -ServicePrincipal  -Credential $credentials -Tenant $tenantID
```
You will be prompt to input the password, use the value in clientSecrets variable.

If you need to get the access token 

```powershell

GetToken

```

## Create a data factory

Run the following commands to create a data factory:

```powershell
$body = @"
{
    "location": "East US",
    "properties": {},
    "identity": {
        "type": "SystemAssigned"
    }
}
"@

$response =   Invoke-AzRestMethod -SubscriptionId ${subscriptionId}  -ResourceGroupName ${resourceGroupName} -ResourceProviderName  Microsoft.DataFactory -ResourceType "factories" -Name  ${factoryName} -ApiVersion ${apiVersion} -Method PUT -Payload ${body}
$response.Content  

```

Note the following points:

* The name of the Azure Data Factory must be globally unique. If you receive the following error, change the name and try again.

    ```
    Data factory name "ADFv2QuickStartDataFactory" is not available.
    ```
* For a list of Azure regions in which Data Factory is currently available, select the regions that interest you on the following page, and then expand **Analytics** to locate **Data Factory**: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.

Here is the sample response content:

```json

{  
    "name":"<dataFactoryName>",
    "identity":{  
        "type":"SystemAssigned",
        "principalId":"<service principal ID>",
        "tenantId":"<tenant ID>"
    },
    "id":"/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>",
    "type":"Microsoft.DataFactory/factories",
    "properties":{  
        "provisioningState":"Succeeded",
        "createTime":"2019-09-03T02:10:27.056273Z",
        "version":"2018-06-01"
    },
    "eTag":"\"0200c876-0000-0100-0000-5d6dcb930000\"",
    "location":"East US",
    "tags":{  

    }
}
```
## Create linked services

You create linked services in a data factory to link your data stores and compute services to the data factory. In this quickstart, you only need create one Azure Storage linked service as both copy source and sink store, named "AzureStorageLinkedService" in the sample.

Run the following commands to create a linked service named **AzureStorageLinkedService**:

Replace &lt;accountName&gt; and &lt;accountKey&gt; with name and key of your Azure storage account before executing the commands.

```powershell
$path = "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/linkedservices/AzureStorageLinkedService?api-version=${apiVersion}"

$body = @"
{  
    "name":"AzureStorageLinkedService",
    "properties":{  
        "annotations":[  

        ],
        "type":"AzureBlobStorage",
        "typeProperties":{  
            "connectionString":"DefaultEndpointsProtocol=https;AccountName=<accountName>;AccountKey=<accountKey>"
        }
    }
}
"@
$response =  Invoke-AzRestMethod  -Path ${path}  -Method PUT -Payload $body
$response.content
```

Here is the sample output:

```json
{  
    "id":"/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>/linkedservices/AzureStorageLinkedService",
    "name":"AzureStorageLinkedService",
    "type":"Microsoft.DataFactory/factories/linkedservices",
    "properties":{  
        "annotations":[  

        ],
        "type":"AzureBlobStorage",
        "typeProperties":{  
            "connectionString":"DefaultEndpointsProtocol=https;AccountName=<accountName>;"
        }
    },
    "etag":"07011a57-0000-0100-0000-5d6e14a20000"
}
```
## Create datasets

You define a dataset that represents the data to copy from a source to a sink. In this example, you create two datasets: InputDataset and OutputDataset. They refer to the Azure Storage linked service that you created in the previous section. The input dataset represents the source data in the input folder. In the input dataset definition, you specify the blob container (adftutorial), the folder (input), and the file (emp.txt) that contain the source data. The output dataset represents the data that's copied to the destination. In the output dataset definition, you specify the blob container (adftutorial), the folder (output), and the file to which the data is copied.

**Create InputDataset**

```powershell

$path = "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/datasets/InputDataset?api-version=${apiVersion}"

$body = @"
{  
    "name":"InputDataset",
    "properties":{  
        "linkedServiceName":{  
            "referenceName":"AzureStorageLinkedService",
            "type":"LinkedServiceReference"
        },
        "annotations":[  

        ],
        "type":"Binary",
        "typeProperties":{  
            "location":{  
                "type":"AzureBlobStorageLocation",
                "fileName":"emp.txt",
                "folderPath":"input",
                "container":"adftutorial"
            }
        }
    }
}
"@

$response =  Invoke-AzRestMethod  -Path ${path}  -Method PUT -Payload $body
$response  

```

Here is the sample output:

```json
{  
    "id":"/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>/datasets/InputDataset",
    "name":"InputDataset",
    "type":"Microsoft.DataFactory/factories/datasets",
    "properties":{  
        "linkedServiceName":{  
            "referenceName":"AzureStorageLinkedService",
            "type":"LinkedServiceReference"
        },
        "annotations":[  

        ],
        "type":"Binary",
        "typeProperties":{  
            "location":"@{type=AzureBlobStorageLocation; fileName=emp.txt; folderPath=input; container=adftutorial}"
        }
    },
    "etag":"07011c57-0000-0100-0000-5d6e14b40000"
}
```
**Create OutputDataset**

```powershell
$path = "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/datasets/OutputDataset?api-version=${apiVersion}"

$body = @"
{  
    "name":"OutputDataset",
    "properties":{  
        "linkedServiceName":{  
            "referenceName":"AzureStorageLinkedService",
            "type":"LinkedServiceReference"
        },
        "annotations":[  

        ],
        "type":"Binary",
        "typeProperties":{  
            "location":{  
                "type":"AzureBlobStorageLocation",
                "folderPath":"output",
                "container":"adftutorial"
            }
        }
    }
}
"@

$response =  Invoke-AzRestMethod  -Path ${path}  -Method PUT -Payload $body
$response.content
```

Here is the sample output:

```json
{  
    "id":"/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>/datasets/OutputDataset",
    "name":"OutputDataset",
    "type":"Microsoft.DataFactory/factories/datasets",
    "properties":{  
        "linkedServiceName":{  
            "referenceName":"AzureStorageLinkedService",
            "type":"LinkedServiceReference"
        },
        "annotations":[  

        ],
        "type":"Binary",
        "typeProperties":{  
            "location":"@{type=AzureBlobStorageLocation; folderPath=output; container=adftutorial}"
        }
    },
    "etag":"07013257-0000-0100-0000-5d6e18920000"
}
```
## Create a pipeline

In this example, this pipeline contains one Copy activity. The Copy activity refers to the "InputDataset" and the "OutputDataset" created in the previous step as input and output.

```powershell
$path = "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/pipelines/Adfv2QuickStartPipeline?api-version=${apiVersion}"

$body = @"
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
"@
$response =  Invoke-AzRestMethod  -Path ${path}  -Method PUT -Payload $body
$response.content
```

Here is the sample output:

```json
{  
    "id":"/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>/pipelines/Adfv2QuickStartPipeline",
    "name":"Adfv2QuickStartPipeline",
    "type":"Microsoft.DataFactory/factories/pipelines",
    "properties":{  
        "activities":[  
            "@{name=CopyFromBlobToBlob; type=Copy; dependsOn=System.Object[]; policy=; userProperties=System.Object[]; typeProperties=; inputs=System.Object[]; outputs=System.Object[]}"
        ],
        "annotations":[  

        ]
    },
    "etag":"07012057-0000-0100-0000-5d6e14c00000"
}
```

## Create pipeline run

In this step, you trigger a pipeline run. The pipeline run ID returned in the response body is used in later monitoring API.

```powershell
$path = "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/pipelines/Adfv2QuickStartPipeline/createRun?api-version=${apiVersion}"

$response =  Invoke-AzRestMethod  -Path ${path}  -Method POST 
$response.content 
```

Here is the sample output:

```json
{  
    "runId":"04a2bb9a-71ea-4c31-b46e-75276b61bafc"
}
```

You can also get the runId by using following command 
```powershell

($response.content | ConvertFrom-Json).runId

```

## Parameterize your pipeline 

You can create pipeline with parameters. In the following example, we will create an input dataset and an output dataset that can take input and output filenames as parameters given to the pipeline. 


## Create parameterized input dataset 

Define a parameter called strInputFileName , and use it as file name for dataset. 

```powershell

$path = "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/datasets/ParamInputDataset?api-version=${apiVersion}"

$body = @"
{
    "name": "ParamInputDataset",
    "properties": {
        "linkedServiceName": {
            "referenceName": "AzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "parameters": {
            "strInputFileName": {
                "type": "string"
            }
        },
        "annotations": [],
        "type": "Binary",
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "fileName": {
                    "value": "@dataset().strInputFileName",
                    "type": "Expression"
                },
                "folderPath": "input",
                "container": "adftutorial"
            }
        }
    },
    "type": "Microsoft.DataFactory/factories/datasets"
}
"@

$response =  Invoke-AzRestMethod  -Path ${path}  -Method PUT -Payload $body
$response.content

```

Here is the sample output: 

```json
{
    "id": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<factoryName>/datasets/ParamInputDataset",
    "name": "ParamInputDataset",
    "type": "Microsoft.DataFactory/factories/datasets",
    "properties": {
        "linkedServiceName": {
            "referenceName": "AzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "parameters": {
            "strInputFileName": {
                "type": "string"
            }
        },
        "annotations": [],
        "type": "Binary",
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "fileName": {
                    "value": "@dataset().strInputFileName",
                    "type": "Expression"
                },
                "folderPath": "input",
                "container": "adftutorial"
            }
        }
    },
    "etag": "00000000-0000-0000-0000-000000000000"
}

```


## Create parameterized output dataset 


Define a parameter called strOutputFileName , and use it as file name for dataset. 

```powershell


$path = "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/datasets/ParamOutputDataset?api-version=${apiVersion}"
$body = @"
{
    "name": "ParamOutputDataset",
    "properties": {
        "linkedServiceName": {
            "referenceName": "AzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "parameters": {
            "strOutPutFileName": {
                "type": "string"
            }
        },
        "annotations": [],
        "type": "Binary",
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "fileName": {
                    "value": "@dataset().strOutPutFileName",
                    "type": "Expression"
                },
                "folderPath": "output",
                "container": "adftutorial"
            }
        }
    },
    "type": "Microsoft.DataFactory/factories/datasets"
}

"@

$response =  Invoke-AzRestMethod  -Path ${path}  -Method PUT -Payload $body
$response.content

```

Here is the sample output: 

```json
{
    "id": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<factoryName>/datasets/ParamOutputDataset",
    "name": "ParamOutputDataset",
    "type": "Microsoft.DataFactory/factories/datasets",
    "properties": {
        "linkedServiceName": {
            "referenceName": "AzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "parameters": {
            "strOutPutFileName": {
                "type": "string"
            }
        },
        "annotations": [],
        "type": "Binary",
        "typeProperties": {
            "location": {
                "type": "AzureBlobStorageLocation",
                "fileName": {
                    "value": "@dataset().strOutPutFileName",
                    "type": "Expression"
                },
                "folderPath": "output",
                "container": "adftutorial"
            }
        }
    },
    "etag": "00000000-0000-0000-0000-000000000000"
}
```

## Create parameterized pipeline 

Define a pipeline with two pipeline level parameters: strParamInputFileName and strParamOutputFileName. Then link these two parameters to the strInputFileName and strOutputFileName parameters of the datasets. 

```powershell

$path = "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/pipelines/Adfv2QuickStartParamPipeline?api-version=${apiVersion}"

$body = @"
{
    "name": "Adfv2QuickStartParamPipeline",
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
                        "referenceName": "ParamInputDataset",
                        "type": "DatasetReference",
                        "parameters": {
                            "strInputFileName": {
                                "value": "@pipeline().parameters.strParamInputFileName",
                                "type": "Expression"
                            }
                        }
                    }
                ],
                "outputs": [
                    {
                        "referenceName": "ParamOutputDataset",
                        "type": "DatasetReference",
                        "parameters": {
                            "strOutPutFileName": {
                                "value": "@pipeline().parameters.strParamOutputFileName",
                                "type": "Expression"
                            }
                        }
                    }
                ]
            }
        ],   

        "parameters": {
            "strParamInputFileName": {
              "type": "String"
            },
            "strParamOutputFileName": {
              "type": "String"
            }
          }
    }
}
"@

$response =  Invoke-AzRestMethod  -Path ${path}  -Method PUT -Payload $body
$response.content


```

Here is the sample output: 

```json

{
    "id": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<factoryName>/pipelines/Adfv2QuickStartParamPipeline",
    "name": "Adfv2QuickStartParamPipeline",
    "type": "Microsoft.DataFactory/factories/pipelines",
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
                        "referenceName": "ParamInputDataset",
                        "type": "DatasetReference",
                        "parameters": {
                            "strInputFileName": {
                                "value": "@pipeline().parameters.strParamInputFileName",
                                "type": "Expression"
                            }
                        }
                    }
                ],
                "outputs": [
                    {
                        "referenceName": "ParamOutputDataset",
                        "type": "DatasetReference",
                        "parameters": {
                            "strOutPutFileName": {
                                "value": "@pipeline().parameters.strParamOutputFileName",
                                "type": "Expression"
                            }
                        }
                    }
                ]
            }
        ],
        "parameters": {
            "strParamInputFileName": {
                "type": "String"
            },
            "strParamOutputFileName": {
                "type": "String"
            }
        }
    },
    "etag": "5e01918d-0000-0100-0000-60d569a90000"
}

```

## Create pipeline run with parameters 

You can now specify values of the parameter at the time of creating the pipeline run. 

```powershell

$path = "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/pipelines/Adfv2QuickStartParamPipeline/createRun?api-version=${apiVersion}"

$body = @"
{  
        "strParamInputFileName": "emp2.txt",
        "strParamOutputFileName": "aloha.txt"
}
"@

$response =  Invoke-AzRestMethod  -Path ${path}  -Method POST -Payload $body
$response.content
$runId  = ($response.content | ConvertFrom-Json).runId

```
Here is the sample output: 

```json
{"runId":"ffc9c2a8-d86a-46d5-9208-28b3551007d8"}
```


## Monitor pipeline

1. Run the following script to continuously check the pipeline run status until it finishes copying the data.

    ```powershell
        $path = "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/pipelineruns/${runId}?api-version=${apiVersion}"
        
        
        while ($True) {
        
            $response =  Invoke-AzRestMethod  -Path ${path}  -Method GET 
            $response = $response.content | ConvertFrom-Json
        
            Write-Host  "Pipeline run status: " $response.Status -foregroundcolor "Yellow"
        
            if ( ($response.Status -eq "InProgress") -or ($response.Status -eq "Queued") -or ($response.Status -eq "In Progress") ) {
                Start-Sleep -Seconds 10
            }
            else {
                $response | ConvertTo-Json
                break
            }
        }
    ```

    Here is the sample output:

    ```json
        {
          "id": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<factoryName>/pipelineruns/ffc9c2a8-d86a-46d5-9208-28b3551007d8",
          "runId": "ffc9c2a8-d86a-46d5-9208-28b3551007d8",
          "debugRunId": null,
          "runGroupId": "ffc9c2a8-d86a-46d5-9208-28b3551007d8",
          "pipelineName": "Adfv2QuickStartParamPipeline",
          "parameters": {
            "strParamInputFileName": "emp2.txt",
            "strParamOutputFileName": "aloha.txt"
          },
          "invokedBy": {
            "id": "9c0275ed99994c18932317a325276544",
            "name": "Manual",
            "invokedByType": "Manual"
          },
          "runStart": "2021-06-25T05:34:06.8424413Z",
          "runEnd": "2021-06-25T05:34:13.2936585Z",
          "durationInMs": 6451,
          "status": "Succeeded",
          "message": "",
          "lastUpdated": "2021-06-25T05:34:13.2936585Z",
          "annotations": [],
          "runDimension": {},
          "isLatest": true
        }
    ```

2. Run the following script to retrieve copy activity run details, for example, size of the data read/written.

    ```powershell
         $path = "/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/pipelineruns/${runId}/queryActivityruns?api-version=${apiVersion}"
        
        
        while ($True) {
        
            $response =  Invoke-AzRestMethod  -Path ${path}  -Method POST 
            $responseContent = $response.content | ConvertFrom-Json
            $responseContentValue = $responseContent.value
        
            Write-Host  "Activity run status: " $responseContentValue.Status -foregroundcolor "Yellow"
        
            if ( ($responseContentValue.Status -eq "InProgress") -or ($responseContentValue.Status -eq "Queued") -or ($responseContentValue.Status -eq "In Progress") ) {
                Start-Sleep -Seconds 10
            }
            else {
                $responseContentValue | ConvertTo-Json
                break
            }
        }
    ```
    Here is the sample output:

    ```json
        {
          "activityRunEnd": "2021-06-25T05:34:11.9536764Z",
          "activityName": "CopyFromBlobToBlob",
          "activityRunStart": "2021-06-25T05:34:07.5161151Z",
          "activityType": "Copy",
          "durationInMs": 4437,
          "retryAttempt": null,
          "error": {
            "errorCode": "",
            "message": "",
            "failureType": "",
            "target": "CopyFromBlobToBlob",
            "details": ""
          },
          "activityRunId": "40bab243-9bbf-4538-9336-b797a2f98e2b",
          "iterationHash": "",
          "input": {
            "source": {
              "type": "BinarySource",
              "storeSettings": "@{type=AzureBlobStorageReadSettings; recursive=True}"
            },
            "sink": {
              "type": "BinarySink",
              "storeSettings": "@{type=AzureBlobStorageWriteSettings}"
            },
            "enableStaging": false
          },
          "linkedServiceName": "",
          "output": {
            "dataRead": 134,
            "dataWritten": 134,
            "filesRead": 1,
            "filesWritten": 1,
            "sourcePeakConnections": 1,
            "sinkPeakConnections": 1,
            "copyDuration": 3,
            "throughput": 0.044,
            "errors": [],
            "effectiveIntegrationRuntime": "DefaultIntegrationRuntime (East US)",
            "usedDataIntegrationUnits": 4,
            "billingReference": {
              "activityType": "DataMovement",
              "billableDuration": ""
            },
            "usedParallelCopies": 1,
            "executionDetails": [
              "@{source=; sink=; status=Succeeded; start=06/25/2021 05:34:07; duration=3; usedDataIntegrationUnits=4; usedParallelCopies=1; profile=; detailedDurations=}"
            ],
            "dataConsistencyVerification": {
              "VerificationResult": "NotVerified"
            },
            "durationInQueue": {
              "integrationRuntimeQueue": 0
            }
          },
          "userProperties": {},
          "pipelineName": "Adfv2QuickStartParamPipeline",
          "pipelineRunId": "ffc9c2a8-d86a-46d5-9208-28b3551007d8",
          "status": "Succeeded",
          "recoveryStatus": "None",
          "integrationRuntimeNames": [
            "defaultintegrationruntime"
          ],
          "executionDetails": {
            "integrationRuntime": [
              "@{name=DefaultIntegrationRuntime; type=Managed; location=East US; nodes=}"
            ]
          },
          "id": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<factoryName>/pipelineruns/ffc9c2a8-d86a-46d5-9208-28b3551007d8/activityruns/40bab243-9bbf-4538-9336-b797a2f98e2b"
        }
    ```
## Verify the output

Use Azure Storage explorer to check the file is copied to "outputPath" from "inputPath" as you specified when creating a pipeline run.

## Clean up resources
You can clean up the resources that you created in the Quickstart in two ways. You can delete the [Azure resource group](../azure-resource-manager/management/overview.md), which includes all the resources in the resource group. If you want to keep the other resources intact, delete only the data factory you created in this tutorial.

Run the following command to delete the entire resource group:
```powershell
Remove-AzResourceGroup -ResourceGroupName $resourcegroupname
```

Run the following command to delete only the data factory:

```powershell
Remove-AzDataFactoryV2 -Name "<NameOfYourDataFactory>" -ResourceGroupName "<NameOfResourceGroup>"
```

## Next steps
The pipeline in this sample copies data from one location to another location in an Azure blob storage. Go through the [tutorials](tutorial-copy-data-dot-net.md) to learn about using Data Factory in more scenarios.
