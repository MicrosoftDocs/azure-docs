---
title: Create an Azure data factory using PowerShell | Microsoft Docs
description: Create an Azure data factory to copy data from one location in in an Azure Blob Storage to another location in the same Blob Storage.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang: powershell
ms.topic: hero-article
ms.date: 09/06/2017
ms.author: jingwang

---
# Create a data factory and pipeline using PowerShell
This quickstart describes how to use PowerShell to create an Azure data factory. The pipeline in this data factory copies data from one location to another location in an Azure blob storage.

## Prerequisite

* **Azure subscription**. If you don't have a subscription, you can create a [free trial](http://azure.microsoft.com/pricing/free-trial/) account.
* **Azure Storage account**. You use the blob storage as **source** and **sink** data store. If you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account) article for steps to create one.
* Create a **blob container** in Blob Storage, create an input **folder** in the container, and upload some files to the folder. 
* Install **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).

## Create data factory

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
2. Run the **New-AzureRmDataFactoryV2** cmdlet to create a data factory. Replace place-holders with your own values before executing the command.

    ```powershell
    $df = New-AzureRmDataFactoryV2 `
        -ResourceGroupName "<your resource group to create the factory>" `
        -Location "East US" `
        -Name "<specify the name of data factory to create. It must be globally unique.>" `
        -LoggingStorageAccountName "<your storage account name>" `
        -LoggingStorageAccountKey "<your storage account key>"
    ```

    Note the following points:

    * The name of the Azure data factory must be globally unique. If you receive the following error, change the name and try again.

        ```
        Data factory name "ADFv2QuickStartDataFactory" is not available.
        ```

    * To create Data Factory instances, you must be a contributor or administrator of the Azure subscription.
    * Currently, Data Factory V2 allows you to create data factory only in the East US region. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.

## Create linked service

You create linked services in a data factory to link your data stores and compute services to the data factory. In this quickstart, you only need create one Azure Storage linked service as both copy source and sink store, named "AzureStorageLinkedService" in the sample.

1. Create a JSON file named **AzureStorageLinkedService.json** in **C:\ADFv2QuickStartPSH** folder with the following content: (Create the folder ADFv2QuickStartPSH if it does not already exist.)

	> [!IMPORTANT]
	> Replace &lt;accountName&gt; and &lt;accountKey&gt; with name and key of your Azure storage account before saving the file.

    ```json
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
    ```

2. In **Azure PowerShell**, switch to the **ADFv2QuickStartPSH** folder.

3. Run the **New-AzureRmDataFactoryV2LinkedService** cmdlet to create the linked service: **AzureStorageLinkedService**. This cmdlet, and other Data Factory cmdlets you use in this quickstart requires you to pass values for the **ResourceGroupName** and **DataFactoryName** parameters. Alternatively, you can pass the **DataFactory** object returned by the New-AzureRmDataFactoryV2 cmdlet without typing ResourceGroupName and DataFactoryName each time you run a cmdlet.

    ```powershell
    New-AzureRmDataFactoryV2LinkedService -DataFactory $df -Name "AzureStorageLinkedService" -File ".\AzureStorageLinkedService.json"
    ```

    Here is the sample output:

    ```
    LinkedServiceName : AzureStorageLinkedService
    ResourceGroupName : <resourceGroupName>
    DataFactoryName   : <dataFactoryName>
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureStorageLinkedService
    ```

## Create dataset

You define a dataset that represents the data to copy from a source to a sink. In this example, this Blob dataset refers to the Azure Storage linked service you create in the previous step. The dataset takes a parameter whose value is set in an activity that consumes the dataset. The parameter is used to construct the "folderPath" pointing to where the data resides/stored.

1. Create a JSON file named **BlobDataset.json** in the **C:\ADFv2QuickStartPSH** folder, with the following content:

    ```json
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
    ```

2. To create the dataset: **BlobDataset**, run the **New-AzureRmDataFactoryV2Dataset** cmdlet.

    ```powershell
    New-AzureRmDataFactoryV2Dataset -DataFactory $df -Name "BlobDataset" -File ".\BlobDataset.json"
    ```

    Here is the sample output:

    ```
    DatasetName       : BlobDataset
    ResourceGroupName : <resourceGroupname>
    DataFactoryName   : <dataFactoryName>
    Structure         :
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureBlobDataset
    ```

## Create pipeline

In this example, this pipeline contains one activity and takes two parameters - input blob path and output blob path. The values for these parameters are set when the pipeline is triggered/run. The copy activity refers to the same blob dataset created in the previous step as input and output. When the dataset is used as an input dataset, input path is specified. And, when the dataset is used as an output dataset, the output path is specified. 

1. Create a JSON file named **Adfv2QuickStartPipeline.json** in the **C:\ADFv2QuickStartPSH** folder with the following content:

    ```json
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
    ```

2. To create the pipeline: **Adfv2QuickStartPipeline**, Run the **New-AzureRmDataFactoryV2Pipeline** cmdlet.

    ```powershell
    New-AzureRmDataFactoryV2Pipeline -DataFactory $df -Name "Adfv2QuickStartPipeline" -File ".\Adfv2QuickStartPipeline.json"
    ```

    Here is the sample output:

    ```
    PipelineName      : Adfv2QuickStartPipeline
    ResourceGroupName : <resourceGroupName>
    DataFactoryName   : <dataFactoryName>
    Activities        : {CopyFromBlobToBlob}
    Parameters        : {[inputPath, Microsoft.Azure.Management.DataFactory.Models.ParameterSpecification], [outputPath, Microsoft.Azure.Management.DataFactory.Models.ParameterSpecification]}
    ```

## Create pipeline run

In this step, you set values for the pipeline parameters:  **inputPath** and **outputPath** with actual values of source and sink blob paths. Then, you create a pipeline run by using these arguments. 

1. Create a JSON file named **PipelineParameters.json** in the **C:\ADFv2QuickStartPSH** folder with the following content:

	> [!IMPORTANT]
	> Replace value of "inputPath" and "outputPath" with your source and sink blob path to copy data from and to before saving the file.

    ```json
    {
        "inputPath": "<the path to existing blob(s) to copy data from, e.g. containername/foldername>",
        "outputPath": "<the blob path to copy data to, e.g. containername/foldername>"
    }
    ```

2. Run the **New-AzureRmDataFactoryV2PipelineRun** cmdlet to create a pipeline run and pass in the parameter values. It also captures the pipeline run ID for future monitoring.

    ```powershell
    $runId = New-AzureRmDataFactoryV2PipelineRun -DataFactory $df -PipelineName "Adfv2QuickStartPipeline" -ParameterFile .\PipelineParameters.json
    ```

## Monitor pipeline run

1. Run the following script to continuously check the pipeline run status until it finishes copying the data.

    ```powershell
    while ($True) {
        $run = Get-AzureRmDataFactoryV2PipelineRun -DataFactory $df -RunId $runId -ErrorAction Stop
        Write-Host  "Pipeline run status: " $run.Status -foregroundcolor "Yellow"

        if ($run.Status -eq "InProgress") {
            Start-Sleep -Seconds 15
        }
        else {
            $run
            break
        }
    }
    ```

    Here is the sample output of pipeline run:

    ```
    Key                  : b9793c37-856a-49cb-8bcf-fef0a02ddcbf
    Timestamp            : 9/7/2017 8:31:26 AM
    RunId                : b9793c37-856a-49cb-8bcf-fef0a02ddcbf
    DataFactoryName      : <dataFactoryname>
    PipelineName         : Adfv2QuickStartPipeline
    Parameters           : {inputPath: <inputBlobPath>, outputPath: <outputBlobPath>}
    ParametersCount      : 2
    ParameterNames       : {inputPath, outputPath}
    ParameterNamesCount  : 2
    ParameterValues      : {<inputBlobPath>, <outputBlobPath>}
    ParameterValuesCount : 2
    RunStart             : 9/7/2017 8:30:45 AM
    RunEnd               : 9/7/2017 8:31:26 AM
    DurationInMs         : 41291
    Status               : Succeeded
    Message              :
    ```

2. Run the following script to retrieve copy activity run details, for example, size of the data read/written.

    ```powershell
    $result = Get-AzureRmDataFactoryV2ActivityRun -DataFactory $df `
        -PipelineName "Adfv2QuickStartPipeline" `
        -PipelineRunId $runId `
        -RunStartedAfter (Get-Date).AddMinutes(-10) `
        -RunStartedBefore (Get-Date).AddMinutes(10) `
        -ErrorAction Stop

    $result

    if ($run.Status -eq "Succeeded") {`
        $result.Output -join "`r`n"`
    }`
    else {`
        $result.Error -join "`r`n"`
    }
    ```

    Here is the sample output of activity run result, and the drilldown statistics in the result -> "Output" section:

    ```
    ResourceGroupName : adf
    DataFactoryName   : <dataFactoryname>
    ActivityName      : CopyFromBlobToBlob
    Timestamp         : 9/7/2017 8:24:06 AM
    PipelineRunId     : 9b362a1d-37b5-449f-918c-53a8d819d83f
    PipelineName      : Adfv2QuickStartPipeline
    Input             : {source, sink}
    Output            : {dataRead, dataWritten, copyDuration, throughput...}
    LinkedServiceName :
    ActivityStart     : 9/7/2017 8:23:30 AM
    ActivityEnd       : 9/7/2017 8:24:06 AM
    Duration          : 36331
    Status            : Succeeded
    Error             : {errorCode, message, failureType, target}

    "dataRead": 331452208
    "dataWritten": 331452208
    "copyDuration": 23
    "throughput": 14073.209
    "errors": []
    ```

## Verify the output
Use tools such as [Azure Storage explorer](https://azure.microsoft.com/features/storage-explorer/) to check the blob(s) in the inputBlobPath are copied to outputBlobPath.

## Clean up resources
You can clean up the resources that you created in the Quickstart in two ways. You can delete the [Azure resource group](../azure-resource-manager/resource-group-overview.md), which includes all the resources in the resource group. If you want to keep the other resources intact, delete only the data factory you created in this tutorial.

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
[Tutorial: copy data from an on-premises SQL Server to an Azure blob storage](tutorial-copy-onprem-data-to-cloud-dot-net.md) | Shows you how to copy data from an on-premises SQL Server database to an Azure blob storage. 
[Tutorial: transform data using Spark](tutorial-transform-data-using-spark-dot-net.md) | Shows you how to transform data in the cloud by using a Spark cluster on Azure
