---
title: Copy data in Blob Storage using Azure Data Factory
description: Create an Azure Data Factory using PowerShell to copy data from one location in Azure Blob storage to another location.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.devlang: powershell
ms.topic: quickstart
ms.date: 07/20/2023
ms.author: jianleishen
ms.custom: devx-track-azurepowershell, mode-api
---
# Quickstart: Create an Azure Data Factory using PowerShell

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Current version](quickstart-create-data-factory-powershell.md)

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This quickstart describes how to use PowerShell to create an Azure Data Factory. The pipeline you create in this data factory **copies** data from one folder to another folder in an Azure blob storage. For a tutorial on how to **transform** data using Azure Data Factory, see [Tutorial: Transform data using Spark](transform-data-using-spark.md).

> [!NOTE]
> This article does not provide a detailed introduction of the Data Factory service. For an introduction to the Azure Data Factory service, see [Introduction to Azure Data Factory](introduction.md).

[!INCLUDE [data-factory-quickstart-prerequisites](includes/data-factory-quickstart-prerequisites.md)]

### Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Install the latest Azure PowerShell modules by following instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell).

>[!WARNING]
>If you do not use latest versions of PowerShell and Data Factory module, you may run into deserialization errors while running the commands. 

#### Log in to PowerShell

1. Launch **PowerShell** on your machine. Keep PowerShell open until the end of this quickstart. If you close and reopen, you need to run these commands again.

2. Run the following command, and enter the same Azure user name and password that you use to sign in to the Azure portal:

    ```powershell
    Connect-AzAccount
    ```

3. Run the following command to view all the subscriptions for this account:

    ```powershell
    Get-AzSubscription
    ```

4. If you see multiple subscriptions associated with your account, run the following command to select the subscription that you want to work with. Replace **SubscriptionId** with the ID of your Azure subscription:

    ```powershell
    Select-AzSubscription -SubscriptionId "<SubscriptionId>"
    ```

## Create a data factory

1. Define a variable for the resource group name that you use in PowerShell commands later. Copy the following command text to PowerShell, specify a name for the [Azure resource group](../azure-resource-manager/management/overview.md) in double quotes, and then run the command. For example: `"ADFQuickStartRG"`.

    ```powershell
    $resourceGroupName = "ADFQuickStartRG";
    ```

    If the resource group already exists, you may not want to overwrite it. Assign a different value to the `$ResourceGroupName` variable and run the command again

2. To create the Azure resource group, run the following command:

    ```powershell
    $ResGrp = New-AzResourceGroup $resourceGroupName -location 'East US'
    ```

    If the resource group already exists, you may not want to overwrite it. Assign a different value to the `$ResourceGroupName` variable and run the command again.

3. Define a variable for the data factory name. 

    > [!IMPORTANT]
    >  Update the data factory name to be globally unique. For example, ADFTutorialFactorySP1127.

    ```powershell
    $dataFactoryName = "ADFQuickStartFactory";
    ```

4. To create the data factory, run the following **Set-AzDataFactoryV2** cmdlet, using the Location and ResourceGroupName property from the $ResGrp variable:

    ```powershell
    $DataFactory = Set-AzDataFactoryV2 -ResourceGroupName $ResGrp.ResourceGroupName `
        -Location $ResGrp.Location -Name $dataFactoryName
    ```

Note the following points:

* The name of the Azure Data Factory must be globally unique. If you receive the following error, change the name and try again.

    ```
    The specified Data Factory name 'ADFv2QuickStartDataFactory' is already in use. Data Factory names must be globally unique.
    ```

* To create Data Factory instances, the user account you use to log in to Azure must be a member of **contributor** or **owner** roles, or an **administrator** of the Azure subscription.

* For a list of Azure regions in which Data Factory is currently available, select the regions that interest you on the following page, and then expand **Analytics** to locate **Data Factory**: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.


## Create a linked service

Create linked services in a data factory to link your data stores and compute services to the data factory. In this quickstart, you create an Azure Storage linked service that is used as both the source and sink stores. The linked service has the connection information that the Data Factory service uses at runtime to connect to it.

>[!TIP]
>In this quickstart, you use *Account key* as the authentication type for your data store, but you can choose other supported authentication methods: *SAS URI*,*Service Principal* and *Managed Identity* if needed. Refer to corresponding sections in [this article](./connector-azure-blob-storage.md#linked-service-properties) for details.
>To store secrets for data stores securely, it's also recommended to use an Azure Key Vault. Refer to [this article](./store-credentials-in-key-vault.md) for detailed illustrations.

1. Create a JSON file named **AzureStorageLinkedService.json** in **C:\ADFv2QuickStartPSH** folder with the following content: (Create the folder ADFv2QuickStartPSH if it does not already exist.).

    > [!IMPORTANT]
    > Replace &lt;accountName&gt; and &lt;accountKey&gt; with name and key of your Azure storage account before saving the file.

    ```json
    {
        "name": "AzureStorageLinkedService",
        "properties": {
            "annotations": [],
            "type": "AzureBlobStorage",
            "typeProperties": {
                "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountName>;AccountKey=<accountKey>;EndpointSuffix=core.windows.net"
            }
        }
    }
    ```

    If you are using Notepad, select **All files** for the **Save as type** filed in the **Save as** dialog box. Otherwise, it may add `.txt` extension to the file. For example, `AzureStorageLinkedService.json.txt`. If you create the file in File Explorer before opening it in Notepad, you may not see the `.txt` extension since the **Hide extensions for known files types** option is set by default. Remove the `.txt` extension before proceeding to the next step.

2. In **PowerShell**, switch to the **ADFv2QuickStartPSH** folder.

    ```powershell
    Set-Location 'C:\ADFv2QuickStartPSH'
    ```

3. Run the **Set-AzDataFactoryV2LinkedService** cmdlet to create the linked service: **AzureStorageLinkedService**.

    ```powershell
    Set-AzDataFactoryV2LinkedService -DataFactoryName $DataFactory.DataFactoryName `
        -ResourceGroupName $ResGrp.ResourceGroupName -Name "AzureStorageLinkedService" `
        -DefinitionFile ".\AzureStorageLinkedService.json"
    ```

    Here is the sample output:

    ```console
    LinkedServiceName : AzureStorageLinkedService
    ResourceGroupName : <resourceGroupName>
    DataFactoryName   : <dataFactoryName>
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureBlobStorageLinkedService
    ```

## Create datasets

In this procedure, you create two datasets: **InputDataset** and **OutputDataset**. These datasets are of type **Binary**. They refer to the Azure Storage linked service that you created in the previous section.
The input dataset represents the source data in the input folder. In the input dataset definition, you specify the blob container (**adftutorial**), the folder (**input**), and the file (**emp.txt**) that contain the source data.
The output dataset represents the data that's copied to the destination. In the output dataset definition, you specify the blob container (**adftutorial**), the folder (**output**), and the file to which the data is copied. 
1. Create a JSON file named **InputDataset.json** in the **C:\ADFv2QuickStartPSH** folder, with the following content:

    ```json
    {
        "name": "InputDataset",
        "properties": {
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
    }
    ```

2. To create the dataset: **InputDataset**, run the **Set-AzDataFactoryV2Dataset** cmdlet.

    ```powershell
    Set-AzDataFactoryV2Dataset -DataFactoryName $DataFactory.DataFactoryName `
        -ResourceGroupName $ResGrp.ResourceGroupName -Name "InputDataset" `
        -DefinitionFile ".\InputDataset.json"
    ```

    Here is the sample output:

    ```console
    DatasetName       : InputDataset
    ResourceGroupName : <resourceGroupname>
    DataFactoryName   : <dataFactoryName>
    Structure         :
    Properties        : Microsoft.Azure.Management.DataFactory.Models.BinaryDataset
    ```

3. Repeat the steps to create the output dataset. Create a JSON file named **OutputDataset.json** in the **C:\ADFv2QuickStartPSH** folder, with the following content:

    ```json
    {
        "name": "OutputDataset",
        "properties": {
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
    }
    ```

4. Run the **Set-AzDataFactoryV2Dataset** cmdlet to create the **OutDataset**.

    ```powershell
    Set-AzDataFactoryV2Dataset -DataFactoryName $DataFactory.DataFactoryName `
        -ResourceGroupName $ResGrp.ResourceGroupName -Name "OutputDataset" `
        -DefinitionFile ".\OutputDataset.json"
    ```

    Here is the sample output:

    ```console
    DatasetName       : OutputDataset
    ResourceGroupName : <resourceGroupname>
    DataFactoryName   : <dataFactoryName>
    Structure         :
    Properties        : Microsoft.Azure.Management.DataFactory.Models.BinaryDataset
    ```
## Create a pipeline

In this procedure, you create a pipeline with a copy activity that uses the input and output datasets. The copy activity copies data from the file you specified in the input dataset settings to the file you specified in the output dataset settings.  

1. Create a JSON file named **Adfv2QuickStartPipeline.json** in the **C:\ADFv2QuickStartPSH** folder with the following content:

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

2. To create the pipeline: **Adfv2QuickStartPipeline**, Run the **Set-AzDataFactoryV2Pipeline** cmdlet.

    ```powershell
    $DFPipeLine = Set-AzDataFactoryV2Pipeline `
        -DataFactoryName $DataFactory.DataFactoryName `
        -ResourceGroupName $ResGrp.ResourceGroupName `
        -Name "Adfv2QuickStartPipeline" `
        -DefinitionFile ".\Adfv2QuickStartPipeline.json"
    ```

## Create a pipeline run

In this step, you create a pipeline run.

Run the **Invoke-AzDataFactoryV2Pipeline** cmdlet to create a pipeline run. The cmdlet returns the pipeline run ID for future monitoring.

  ```powershell
$RunId = Invoke-AzDataFactoryV2Pipeline `
    -DataFactoryName $DataFactory.DataFactoryName `
    -ResourceGroupName $ResGrp.ResourceGroupName `
    -PipelineName $DFPipeLine.Name 
```

## Monitor the pipeline run

1. Run the following PowerShell script to continuously check the pipeline run status until it finishes copying the data. Copy/paste the following script in the PowerShell window, and press ENTER.

    ```powershell
    while ($True) {
        $Run = Get-AzDataFactoryV2PipelineRun `
            -ResourceGroupName $ResGrp.ResourceGroupName `
            -DataFactoryName $DataFactory.DataFactoryName `
            -PipelineRunId $RunId

        if ($Run) {
            if ( ($Run.Status -ne "InProgress") -and ($Run.Status -ne "Queued") ) {
                Write-Output ("Pipeline run finished. The status is: " +  $Run.Status)
                $Run
                break
            }
            Write-Output ("Pipeline is running...status: " + $Run.Status)
        }

        Start-Sleep -Seconds 10
    }
    ```

    Here is the sample output of pipeline run:

    ```console
    Pipeline is running...status: InProgress
    Pipeline run finished. The status is:  Succeeded
    
    ResourceGroupName : ADFQuickStartRG
    DataFactoryName   : ADFQuickStartFactory
    RunId             : 00000000-0000-0000-0000-0000000000000
    PipelineName      : Adfv2QuickStartPipeline
    LastUpdated       : 8/27/2019 7:23:07 AM
    Parameters        : {}
    RunStart          : 8/27/2019 7:22:56 AM
    RunEnd            : 8/27/2019 7:23:07 AM
    DurationInMs      : 11324
    Status            : Succeeded
    Message           : 
    ```
2. Run the following script to retrieve copy activity run details, for example, size of the data read/written.

    ```powershell
    Write-Output "Activity run details:"
    $Result = Get-AzDataFactoryV2ActivityRun -DataFactoryName $DataFactory.DataFactoryName -ResourceGroupName $ResGrp.ResourceGroupName -PipelineRunId $RunId -RunStartedAfter (Get-Date).AddMinutes(-30) -RunStartedBefore (Get-Date).AddMinutes(30)
    $Result

    Write-Output "Activity 'Output' section:"
    $Result.Output -join "`r`n"

    Write-Output "Activity 'Error' section:"
    $Result.Error -join "`r`n"
    ```
3. Confirm that you see the output similar to the following sample output of activity run result:

    ```console
    ResourceGroupName : ADFQuickStartRG
    DataFactoryName   : ADFQuickStartFactory
    ActivityRunId     : 00000000-0000-0000-0000-000000000000
    ActivityName      : CopyFromBlobToBlob
    PipelineRunId     : 00000000-0000-0000-0000-000000000000
    PipelineName      : Adfv2QuickStartPipeline
    Input             : {source, sink, enableStaging}
    Output            : {dataRead, dataWritten, filesRead, filesWritten...}
    LinkedServiceName :
    ActivityRunStart  : 8/27/2019 7:22:58 AM
    ActivityRunEnd    : 8/27/2019 7:23:05 AM
    DurationInMs      : 6828
    Status            : Succeeded
    Error             : {errorCode, message, failureType, target}
    
    Activity 'Output' section:
    "dataRead": 20
    "dataWritten": 20
    "filesRead": 1
    "filesWritten": 1
    "sourcePeakConnections": 1
    "sinkPeakConnections": 1
    "copyDuration": 4
    "throughput": 0.01
    "errors": []
    "effectiveIntegrationRuntime": "DefaultIntegrationRuntime (Central US)"
    "usedDataIntegrationUnits": 4
    "usedParallelCopies": 1
    "executionDetails": [
      {
        "source": {
          "type": "AzureBlobStorage"
        },
        "sink": {
          "type": "AzureBlobStorage"
        },
        "status": "Succeeded",
        "start": "2019-08-27T07:22:59.1045645Z",
        "duration": 4,
        "usedDataIntegrationUnits": 4,
        "usedParallelCopies": 1,
        "detailedDurations": {
          "queuingDuration": 3,
          "transferDuration": 1
        }
      }
    ]
    
    Activity 'Error' section:
    "errorCode": ""
    "message": ""
    "failureType": ""
    "target": "CopyFromBlobToBlob"
    ```

[!INCLUDE [data-factory-quickstart-verify-output-cleanup.md](includes/data-factory-quickstart-verify-output-cleanup.md)]

## Next steps

The pipeline in this sample copies data from one location to another location in an Azure blob storage. Go through the [tutorials](tutorial-copy-data-dot-net.md) to learn about using Data Factory in more scenarios.
