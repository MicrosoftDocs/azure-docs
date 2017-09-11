---
title: Create an Azure data factory using REST API | Microsoft Docs
description: Create an Azure data factory to copy data from one location in in an Azure Blob Storage to another location in the same Blob Storage.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang: rest-api
ms.topic: hero-article
ms.date: 09/06/2017
ms.author: jingwang

---
# Create Data Factory and pipeline using REST API
This quickstart describes how to use REST API to create an Azure data factory. The pipeline in this data factory copies data from one location to another location in an Azure blob storage.

## Prerequisites

* **Azure subscription**. If you don't have a subscription, you can create a [free trial](http://azure.microsoft.com/pricing/free-trial/) account.
* **Azure Storage account**. You use the blob storage as **source** and **sink** data store. If you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account) article for steps to create one.
* Create a **blob container** in Blob Storage, create an input **folder** in the container, and upload some files to the folder. 
* Install **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps). This quickstart uses PowerShell to invoke REST API calls.
* **Create an application in Azure Active Directory** following [this instruction](../azure-resource-manager/resource-group-create-service-principal-portal.md#create-an-azure-active-directory-application). Make note of the following values that you use in later steps: **application ID**, **authentication key**, and **tenant ID**. Assign application to "**Contributor**" role.

## Set global variables

1. Launch **PowerShell**. Keep Azure PowerShell open until the end of this quickstart. If you close and reopen, you need to run the commands again.

    Run the following command, and enter the user name and password that you use to sign in to the Azure portal:
        
    ```powershell
    Login-AzureRmAccount
    ```        
    Run the following command to view all the subscriptions for this account:

    ```powershell
    Get-AzureRmSubscription
    ```
    Run the following command to select the subscription that you want to work with. Replace **SubscriptionId** with the ID of your Azure subscription:

    ```powershell
    Select-AzureRmSubscription -SubscriptionId "<SubscriptionId>"   	
    ```
2. Run the following commands after replacing the places-holders with your own values, to set global variables to be used in later steps.

    ```powershell
    $tenantID = "<your tenant ID>"
    $appId = "<your application ID>"
    $authKey = "<your authentication key for the application>"
    $subsId = "<your subscription ID to create the factory>"
    $resourceGroup = "<your resource group to create the factory>"
    $dataFactoryName = "<specify the name of data factory to create. It must be globally unique.>"
    $apiVersion = "2017-09-01-preview"
    ```

## Authenticate with AAD

Run the following commands to authenticate with Azure Active Directory (AAD):

```powershell
$AuthContext = [Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext]"https://login.microsoftonline.com/${tenantId}"
$cred = New-Object -TypeName Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential -ArgumentList ($appId, $authKey)
$result = $AuthContext.AcquireToken("https://management.core.windows.net/", $cred)
$authHeader = @{
'Content-Type'='application/json'
'Accept'='application/json'
'Authorization'=$result.CreateAuthorizationHeader()
} 
```

## Create data factory

Run the following commands to create a data factory:

> [!IMPORTANT]
> Replace the places-holders in $body with your own values before executing those commands.

```powershell
$request = "https://management.azure.com/subscriptions/${subsId}/resourceGroups/${resourceGroup}/providers/Microsoft.DataFactory/factories/${dataFactoryName}?api-version=${apiVersion}"
$body = @"
{
    "name": "<specify the name of data factory to create. It must be globally unique.>",
    "properties": {
        "loggingStorageAccountName": "<your storage account name>",
        "loggingStorageAccountKey": "<your storage account key>"
    },
    "location": "East US"
}
"@
$response = Invoke-RestMethod -Method PUT -Uri $request -Header $authHeader -Body $body
$response | ConvertTo-Json
```

Note the following points:

* The name of the Azure data factory must be globally unique. If you receive the following error, change the name and try again.

    ```
    Data factory name "ADFv2QuickStartDataFactory" is not available.
    ```

Here is the sample response:

```json
{
    "name":  "<dataFactoryName>",
    "tags":  { },
    "properties":  {
                       "provisioningState":  "Succeeded",
                       "loggingStorageAccountName":  "<storageAccount>",
                       "loggingStorageAccountKey":  "**********",
                       "createTime":  "2017-08-25T10:21:46.2985731Z",
                       "apiVersion":  "2017-09-01-preview"
                   },
    "id":  "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>",
    "type":  "Microsoft.DataFactory/factories",
    "location":  "East US"
}
```

## Create linked services

You create linked services in a data factory to link your data stores and compute services to the data factory. In this quickstart, you only need create one Azure Storage linked service as both copy source and sink store, named "AzureStorageLinkedService" in the sample.

Run the following commands to create a linked service named **AzureStorageLinkedService**:

> [!IMPORTANT]
> Replace &lt;accountName&gt; and &lt;accountKey&gt; with name and key of your Azure storage account before executing the commands.

```powershell
$request = "https://management.azure.com/subscriptions/${subsId}/resourceGroups/${resourceGroup}/providers/Microsoft.DataFactory/factories/${dataFactoryName}/linkedservices/AzureStorageLinkedService?api-version=${apiVersion}"
$body = @"
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": {
                "value": "DefaultEndpointsProtocol=https;AccountName=<accountName>;AccountKey=<accountKey>",
                "type": "SecureString"
            }
        }
    }
}
"@
$response = Invoke-RestMethod -Method PUT -Uri $request -Header $authHeader -Body $body
$response | ConvertTo-Json
```

Here is the sample output:

```json
{
    "id":  "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>/linkedservices/AzureStorageLinkedService",
    "name":  "AzureStorageLinkedService",
    "properties":  {
                       "type":  "AzureStorage",
                       "typeProperties":  {
                                              "connectionString":  "@{value=**********; type=SecureString}"
                                          }
                   },
    "etag":  "0000c552-0000-0000-0000-59b1459c0000"
}
```

## Create datasets

You define a dataset that represents the data to copy from a source to a sink. In this example, this Blob dataset refers to the Azure Storage linked service you create in the previous step. The dataset takes a parameter whose value is set in an activity that consumes the dataset. The parameter is used to construct the "folderPath" pointing to where the data resides/stored.

```powershell
$request = "https://management.azure.com/subscriptions/${subsId}/resourceGroups/${resourceGroup}/providers/Microsoft.DataFactory/factories/${dataFactoryName}/datasets/BlobDataset?api-version=${apiVersion}"
$body = @"
{
    "name": "BlobDataset",
    "properties": {
        "type": "AzureBlob",
        "typeProperties": {
            "folderPath": {
                "value": "@{dataset().path}",
                "type": "Expression"
            }
        },
        "linkedServiceName": {
            "referenceName": "AzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "parameters": {
            "path": {
                "type": "String"
            }
        }
    }
}
"@
$response = Invoke-RestMethod -Method PUT -Uri $request -Header $authHeader -Body $body
$response | ConvertTo-Json
```

Here is the sample output:

```json
{
    "id":  "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>/datasets/BlobDataset",
    "name":  "BlobDataset",
    "properties":  {
                       "type":  "AzureBlob",
                       "typeProperties":  {
                                              "folderPath":  "@{value=@{dataset().path}; type=Expression}"
                                          },
                       "linkedServiceName":  {
                                                 "referenceName":  "AzureStorageLinkedService",
                                                 "type":  "LinkedServiceReference"
                                             },
                       "parameters":  {
                                          "path":  "@{type=String}"
                                      }
                   },
    "etag":  "0000c752-0000-0000-0000-59b1459d0000"
}
```

## Create pipeline

In this example, this pipeline contains one activity and takes two parameters - input blob path and output blob path. The values for these parameters are set when the pipeline is triggered/run. The copy activity refers to the same blob dataset created in the previous step as input and output. When the dataset is used as an input dataset, input path is specified. And, when the dataset is used as an output dataset, the output path is specified. 

```powershell
$request = "https://management.azure.com/subscriptions/${subsId}/resourceGroups/${resourceGroup}/providers/Microsoft.DataFactory/factories/${dataFactoryName}/pipelines/Adfv2QuickStartPipeline?api-version=${apiVersion}"
$body = @"
{
    "name": "Adfv2QuickStartPipeline",
    "properties": {
        "activities": [
            {
                "name": "CopyFromBlobToBlob",
                "type": "Copy",
                "inputs": [
                    {
                        "referenceName": "BlobDataset",
                        "parameters": {
                            "path": "@pipeline().parameters.inputPath"
                        },
                    "type": "DatasetReference"
                    }
                ],
                "outputs": [
                    {
                        "referenceName": "BlobDataset",
                        "parameters": {
                            "path": "@pipeline().parameters.outputPath"
                        },
                        "type": "DatasetReference"
                    }
                ],
                "typeProperties": {
                    "source": {
                        "type": "BlobSource"
                    },
                    "sink": {
                        "type": "BlobSink"
                    }
                }
            }
        ],
        "parameters": {
            "inputPath": {
                "type": "String"
            },
            "outputPath": {
                "type": "String"
            }
        }
    }
}
"@
$response = Invoke-RestMethod -Method PUT -Uri $request -Header $authHeader -Body $body
$response | ConvertTo-Json
```

Here is the sample output:

```json
{
    "id":  "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>/pipelines/Adfv2QuickStartPipeline",
    "name":  "Adfv2QuickStartPipeline",
    "properties":  {
                       "activities":  [
                                          "@{name=CopyFromBlobToBlob; type=Copy; inputs=System.Object[]; outputs=System.Object[]; typeProperties=}"
                                      ],
                       "parameters":  {
                                          "inputPath":  "@{type=String}",
                                          "outputPath":  "@{type=String}"
                                      }
                   },
    "etag":  "0000c852-0000-0000-0000-59b1459e0000"
}
```

## Create pipeline run

In this step, you set values of **inputPath** and **outputPath** parameters specified in pipeline with the actual values of source and sink blob paths, and trigger a pipeline run. The pipeline run ID returned in the response body is used in later monitoring API.

> [!IMPORTANT]
> Replace value of "inputPath" and "outputPath" with your source and sink blob path to copy data from and to before saving the file.


```powershell
$request = "https://management.azure.com/subscriptions/${subsId}/resourceGroups/${resourceGroup}/providers/Microsoft.DataFactory/factories/${dataFactoryName}/pipelines/Adfv2QuickStartPipeline/createRun?api-version=${apiVersion}"
$body = @"
{
    "inputPath": "<the path to existing blob(s) to copy data from, e.g. containername/path>",
    "outputPath": "<the blob path to copy data to, e.g. containername/path>"
}
"@
$response = Invoke-RestMethod -Method POST -Uri $request -Header $authHeader -Body $body
$response | ConvertTo-Json
$runId = $response.runId
```

Here is the sample output:

```json
{
    "runId":  "2f26be35-c112-43fa-9eaa-8ba93ea57881"
}
```

## Monitor pipeline

1. Run the following script to continuously check the pipeline run status until it finishes copying the data.

    ```powershell
    $request = "https://management.azure.com/subscriptions/${subsId}/resourceGroups/${resourceGroup}/providers/Microsoft.DataFactory/factories/${dataFactoryName}/pipelineruns/${runId}?api-version=${apiVersion}"
    while ($True) {
        $response = Invoke-RestMethod -Method GET -Uri $request -Header $authHeader
        Write-Host  "Pipeline run status: " $response.Status -foregroundcolor "Yellow"

        if ($response.Status -eq "InProgress") {
            Start-Sleep -Seconds 15
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
        "key":  "2f26be35-c112-43fa-9eaa-8ba93ea57881",
        "timestamp":  "2017-09-07T13:12:39.5561795Z",
        "runId":  "2f26be35-c112-43fa-9eaa-8ba93ea57881",
        "dataFactoryName":  "<dataFactoryName>",
        "pipelineName":  "Adfv2QuickStartPipeline",
        "parameters":  [
                        "inputPath: <inputBlobPath>",
                        "outputPath: <outputBlobPath>"
                    ],
        "parametersCount":  2,
        "parameterNames":  [
                            "inputPath",
                            "outputPath"
                        ],
        "parameterNamesCount":  2,
        "parameterValues":  [
                                "<inputBlobPath>",
                                "<outputBlobPath>"
                            ],
        "parameterValuesCount":  2,
        "runStart":  "2017-09-07T13:12:00.3710792Z",
        "runEnd":  "2017-09-07T13:12:39.5561795Z",
        "durationInMs":  39185,
        "status":  "Succeeded",
        "message":  ""
    }
    ```

2. Run the following script to retrieve copy activity run details, for example, size of the data read/written.

    ```PowerShell
    $request = "https://management.azure.com/subscriptions/${subsId}/resourceGroups/${resourceGroup}/providers/Microsoft.DataFactory/factories/${dataFactoryName}/pipelineruns/${runId}/activityruns?api-version=${apiVersion}&startTime="+(Get-Date).ToString('yyyy-MM-dd')+"&endTime="+(Get-Date).AddDays(1).ToString('yyyy-MM-dd')+"&pipelineName=Adfv2QuickStartPipeline"
    $response = Invoke-RestMethod -Method GET -Uri $request -Header $authHeader
    $response | ConvertTo-Json
    ```

    Here is the sample output:

    ```json
    {
        "value":  [
                    {
                        "id":  "49cc182f-8c5a-4e6e-8c23-e268d6234ed3",
                        "timestamp":  "2017-09-07T13:12:38.4780542Z",
                        "pipelineRunId":  "2f26be35-c112-43fa-9eaa-8ba93ea57881",
                        "pipelineName":  "Adfv2QuickStartPipeline",
                        "status":  "Succeeded",
                        "failureType":  "",
                        "linkedServiceName":  "",
                        "activityName":  "CopyFromBlobToBlob",
                        "activityType":  "Copy",
                        "activityStart":  "2017-09-07T13:12:02.3299261Z",
                        "activityEnd":  "2017-09-07T13:12:38.4780542Z",
                        "duration":  36148,
                        "input":  "@{source=; sink=}",
                        "output":  "@{dataRead=331452208; dataWritten=331452208; copyDuration=22; throughput=14712.9; errors=System.Object[]}",
                        "error":  "@{errorCode=; message=; failureType=; target=CopyFromBlobToBlob}"
                    }
                ]
    }
    ```

## Verify the output

Use Azure Storage explorer to check the blob(s) is copied to "outputBlobPath" from "inputBlobPath" as you specified when creating a pipeline run.

## Clean up resources
You can clean up the resources that you created in the Quickstart in two ways. You can delete the [Azure resource group]((../azure-resource-manager/resource-group-overview.md), which includes all the resources in the resource group. If you want to keep the other resources intact, delete only the data factory you created in this tutorial.

Run the following command to delete the entire resource group: 
```powershell
Remove-AzureRmResourceGroup -ResourceGroupName $resourcegroupname
```

Run the following command to delete only the data factory: 

```powershell
Remove-AzureRmDataFactoryV2 -Name "<NameOfYourDataFactory>" -ResourceGroupName "<NameOfResourceGroup>"
```

## Next steps
The pipeline in this sample copies data from one location to another location in an Azure blob storage. Go through the following tutorials to learn about using Data Factory in slightly complex scenarios. 

Tutorial | Description
-------- | -----------
[Tutorial: copy data from Azure Blob Storage to Azure SQL Database](tutorial-copy-data-dot-net.md) | Shows you how to copy data from a blob storage to a SQL database. For a list of data stores supported as sources and sinks in a copy operation by data factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats). 
[Tutorial: copy data from an on-premises SQL Server to an Azure blob storage](tutorial-copy-onprem-data-to-cloud-powershell.md) | Shows you how to copy data from an on-premises SQL Server database to an Azure blob storage. 
[Tutorial: transform data using Spark](tutorial-transform-data-using-spark-powershell.md) | Shows you how to transform data in the cloud by using a Spark cluster on Azure

