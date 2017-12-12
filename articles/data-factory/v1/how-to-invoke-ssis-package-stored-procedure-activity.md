---
title: Invoke SSIS package using Data Factory Stored Procedure Activity | Microsoft Docs
description: This article describes how to invoke a SQL Server Integration Services (SSIS) package from an Azure Data Factory pipeline using the Stored Procedure Activity.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang: powershell
ms.topic: article
ms.date: 12/07/2017
ms.author: jingwang

---
# Invoke an SSIS package using stored procedure activity in Azure Data Factory
This article describes how to invoke an SSIS package from an Azure Data Factory pipeline by using a stored procedure activity. 

> [!NOTE]
> This article applies to version 1 of Data Factory, which is generally available. If you are using version 2 of the Data Factory service, which is in Public Preview, see [Invoke SSIS packages using stored procedure activity in version 2](../how-to-invoke-ssis-package-stored-procedure-activity.md).

## Prerequisites

### Azure SQL Database 
The walkthrough in this article uses an Azure SQL database. You can also use an Azure SQL Managed Instance (Private Preview).

### Create an Azure-SSIS integration runtime
Create an Azure-SSIS integration runtime if you don't have one by following the step-by-step instruction in the [Tutorial: Deploy SSIS packages](../tutorial-deploy-ssis-packages-azure.md). You must create a data factory of version 2 to create an Azure-SSIS integration runtime. 

### Azure PowerShell
Install the latest Azure PowerShell modules by following instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).

## Create a data factory
1. Define a variable for the resource group name that you use in PowerShell commands later. Copy the following command text to PowerShell, specify a name for the [Azure resource group](../../azure-resource-manager/resource-group-overview.md) in double quotes, and then run the command. For example: `"adfrg"`. 
   
     ```powershell
    $resourceGroupName = "ADFTutorialResourceGroup";
    ```

    If the resource group already exists, you may not want to overwrite it. Assign a different value to the `$ResourceGroupName` variable and run the command again
2. To create the Azure resource group, run the following command: 

    ```powershell
    $ResGrp = New-AzureRmResourceGroup $resourceGroupName -location 'eastus'
    ``` 
    If the resource group already exists, you may not want to overwrite it. Assign a different value to the `$ResourceGroupName` variable and run the command again. 
3. Define a variable for the data factory name. 

    > [!IMPORTANT]
    >  Update the data factory name to be globally unique. 

    ```powershell
    $DataFactoryName = "ADFTutorialFactory";
    ```

5. To create the data factory, run the following **New-AzureRmDataFactory** cmdlet, using the Location and ResourceGroupName property from the $ResGrp variable: 
    
    ```powershell       
    $df = New-AzureRmDataFactory -ResourceGroupName $ResourceGroupName -Name $dataFactoryName -Location "East US"
    $df 
    ```

Note the following points:

* The name of the Azure data factory must be globally unique. If you receive the following error, change the name and try again.

    ```
    The specified Data Factory name 'ADFTutorialFactory' is already in use. Data Factory names must be globally unique.
    ```
* To create Data Factory instances, the user account you use to log in to Azure must be a member of **contributor** or **owner** roles, or an **administrator** of the Azure subscription.
* Currently, Data Factory version 2 allows you to create data factories only in the East US, East US2, and West Europe regions. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.

### Create an Azure SQL Database linked service
Create a linked service to link your Azure SQL database to the data factory. 

1. Create a JSON file named **AzureSqlDatabaseLinkedService.json** in **C:\ADF\RunSSISPackage** folder with the following content: (Create the folder ADFv2TutorialBulkCopy if it does not already exist.)

	> [!IMPORTANT]
	> Replace &lt;servername&gt;, &lt;databasename&gt;, &lt;username&gt;@&lt;servername&gt; and &lt;password&gt; with values of your Azure SQL Database before saving the file.

    ```json
    {
        "name": "AzureSqlDatabaseLinkedService",
        "properties": {
            "type": "AzureSqlDatabase",
            "typeProperties": {
                "connectionString": "Server=tcp:<AZURE SQL SERVER NAME>.database.windows.net,1433;Database=SSISDB;User ID=<USERNAME>;Password=<PASSWORD>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
            }
        }
        }
    ```
2. In **Azure PowerShell**, switch to the **C:\ADF\RunSSISPackage** folder.
3. Run the **New-AzureRmDataFactoryLinkedService** cmdlet to create the linked service: **AzureSqlDatabaseLinkedService**. 

    ```powershell
    New-AzureRmDataFactoryLinkedService $df -File ".\AzureSqlDatabaseLinkedService.json"
    ```

## Create an output dataset
1. Create an OuputDataset.json file with the following content: 
    
    ```json
    {
        "name": "sprocsampleout",
        "properties": {
            "type": "AzureSqlTable",
            "linkedServiceName": "AzureSqlLinkedService",
            "typeProperties": { },
            "availability": {
                "frequency": "Hour",
                "interval": 1
            }
        }
    }
    ```
2. Run the **New-AzureRmDataFactoryDataset** cmdlet to create a dataset. 

    ```powershell
    New-AzureRmDataFactoryDataset $df -File ".\OutputDataset.json"
    ```

## Create a pipeline with stored procedure activity 

1. Create a JSON file named **MyPipeline.json** in the **C:\ADF\RunSSISPackage** folder with the following content:

    > [!IMPORTANT]
	> Replace &lt;FOLDER NAME&gt;, &lt;PROJECT NAME&gt;, &lt;PACKAGE NAME&gt; with names of folder, project, and package in the SSIS catalog before saving the file. 

    ```json
    {
        "name": "MyPipeline",
        "properties": {
            "activities": [{
                "name": "SprocActivitySample",
                "type": "SqlServerStoredProcedure",
                "typeProperties": {
                    "storedProcedureName": "sp_executesql",
                    "storedProcedureParameters": {
                        "stmt": "DECLARE @return_value INT, @exe_id BIGINT, @err_msg NVARCHAR(150)    EXEC @return_value=[SSISDB].[catalog].[create_execution] @folder_name=N'SsisAdfTest', @project_name=N'MyProject', @package_name=N'Package.dtsx', @use32bitruntime=0, @runinscaleout=1, @useanyworker=1, @execution_id=@exe_id OUTPUT    EXEC [SSISDB].[catalog].[set_execution_parameter_value] @exe_id, @object_type=50, @parameter_name=N'SYNCHRONIZED', @parameter_value=1    EXEC [SSISDB].[catalog].[start_execution] @execution_id=@exe_id, @retry_count=0    IF(SELECT [status] FROM [SSISDB].[catalog].[executions] WHERE execution_id=@exe_id)<>7 BEGIN SET @err_msg=N'Your package execution did not succeed for execution ID: ' + CAST(@exe_id AS NVARCHAR(20)) RAISERROR(@err_msg,15,1) END"
                    }
                },
                "outputs": [{
                    "name": "sprocsampleout"
                }],
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                }
            }],
            "start": "2017-10-01T00:00:00Z",
            "end": "2017-10-01T05:00:00Z",
            "isPaused": false
        }
    }    
    ```

2. To create the pipeline: **RunSSISPackagePipeline**, Run the **Set-AzureRmDataFactoryPipeline** cmdlet.

    ```powershell
    $DFPipeLine = New-AzureRmDataFactoryPipeline -DataFactoryName $DataFactory.DataFactoryName -ResourceGroupName $ResGrp.ResourceGroupName -Name "RunSSISPackagePipeline" -DefinitionFile ".\RunSSISPackagePipeline.json"
    ```

## Create a pipeline run
Use the **Invoke-AzureRmDataFactoryPipeline** cmdlet to run the pipeline. The cmdlet returns the pipeline run ID for future monitoring.

```powershell
$RunId = New-AzureRmDataFactoryPipeline $df -File ".\MyPipeline.json"
```

## Monitor the pipeline run

2. Run **Get-AzureRmDataFactorySlice** to get details about all slices of the output dataset**, which is the output table of the pipeline.

	```PowerShell
    Get-AzureRmDataFactorySlice $df -DatasetName sprocsampleout -StartDateTime 2017-10-01T00:00:00Z
	```
    Notice that the StartDateTime you specify here is the same start time specified in the pipeline JSON. 
3. Run **Get-AzureRmDataFactoryRun** to get the details of activity runs for a specific slice.

	```PowerShell
	Get-AzureRmDataFactoryRun $df -DatasetName sprocsampleout -StartDateTime 2017-10-01T00:00:00Z
	```

    You can keep running this cmdlet until you see the slice in **Ready** state or **Failed** state. When the slice is in Ready state, check the **partitioneddata** folder in the **adfgetstarted** container in your blob storage for the output data.  Creation of an on-demand HDInsight cluster usually takes some time.

## Next steps
For details about the stored procedure activity, see the [Stored Procedure activity](data-factory-stored-proc-activity.md) article.

