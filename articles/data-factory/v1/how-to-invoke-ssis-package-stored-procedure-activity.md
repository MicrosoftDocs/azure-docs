---
title: Invoke SSIS package using Azure Data Factory - Stored Procedure Activity 
description: This article describes how to invoke a SQL Server Integration Services (SSIS) package from an Azure Data Factory pipeline using the Stored Procedure Activity.
author: jianleishen
ms.service: data-factory
ms.subservice: v1
ms.devlang: powershell
ms.custom: devx-track-azurepowershell
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: jianleishen
---
# Invoke an SSIS package using stored procedure activity in Azure Data Factory
This article describes how to invoke an SSIS package from an Azure Data Factory pipeline by using a stored procedure activity. 

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [Invoke SSIS packages using stored procedure activity in](../how-to-invoke-ssis-package-stored-procedure-activity.md).

## Prerequisites

### Azure SQL Database 
The walkthrough in this article uses Azure SQL Database. You can also use an Azure SQL Managed Instance.

### Create an Azure-SSIS integration runtime
Create an Azure-SSIS integration runtime if you don't have one by following the step-by-step instruction in the [Tutorial: Deploy SSIS packages](../tutorial-deploy-ssis-packages-azure.md). You cannot use Data Factory version 1 to create an Azure-SSIS integration runtime. 

## Azure PowerShell
In this section you use Azure PowerShell to create a Data Factory pipeline with a stored procedure activity that invokes an SSIS package.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

Install the latest Azure PowerShell modules by following instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell).

### Create a data factory
The following procedure provides steps to create a data factory. You create a pipeline with a stored procedure activity in this data factory. The stored procedure activity executes a stored procedure in the SSISDB database to run your SSIS package.

1. Define a variable for the resource group name that you use in PowerShell commands later. Copy the following command text to PowerShell, specify a name for the [Azure resource group](../../azure-resource-manager/management/overview.md) in double quotes, and then run the command. For example: `"adfrg"`. 

    ```powershell
    $resourceGroupName = "ADFTutorialResourceGroup";
    ```

    If the resource group already exists, you may not want to overwrite it. Assign a different value to the `$ResourceGroupName` variable and run the command again

2. To create the Azure resource group, run the following command: 

    ```powershell
    $ResGrp = New-AzResourceGroup $resourceGroupName -location 'eastus'
    ``` 

    If the resource group already exists, you may not want to overwrite it. Assign a different value to the `$ResourceGroupName` variable and run the command again.

3. Define a variable for the data factory name. 

    > [!IMPORTANT]
    >  Update the data factory name to be globally unique. 

    ```powershell
    $DataFactoryName = "ADFTutorialFactory";
    ```

5. To create the data factory, run the following **New-AzDataFactory** cmdlet, using the Location and ResourceGroupName property from the $ResGrp variable: 
    
    ```powershell
    $df = New-AzDataFactory -ResourceGroupName $ResourceGroupName -Name $dataFactoryName -Location "East US"
    ```

Note the following points:

* The name of the Azure data factory must be globally unique. If you receive the following error, change the name and try again.

    ```
    The specified Data Factory name 'ADFTutorialFactory' is already in use. Data Factory names must be globally unique.
    ```
* To create Data Factory instances, the user account you use to log in to Azure must be a member of **contributor** or **owner** roles, or an **administrator** of the Azure subscription.

### Create an Azure SQL Database linked service
Create a linked service to link your database in Azure SQL Database that hosts the SSIS catalog to your data factory. Data Factory uses information in this linked service to connect to SSISDB database, and executes a stored procedure to run an SSIS package. 

1. Create a JSON file named **AzureSqlDatabaseLinkedService.json** in **C:\ADF\RunSSISPackage** folder with the following content: 

    > [!IMPORTANT]
    > Replace &lt;servername&gt;, &lt;username&gt;@&lt;servername&gt; and &lt;password&gt; with values of your Azure SQL Database before saving the file.

    ```json
    {
        "name": "AzureSqlDatabaseLinkedService",
        "properties": {
            "type": "AzureSqlDatabase",
            "typeProperties": {
                "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=SSISDB;User ID=<username>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
            }
        }
        }
    ```
2. In **Azure PowerShell**, switch to the **C:\ADF\RunSSISPackage** folder.
3. Run the **New-AzDataFactoryLinkedService** cmdlet to create the linked service: **AzureSqlDatabaseLinkedService**. 

    ```powershell
    New-AzDataFactoryLinkedService $df -File ".\AzureSqlDatabaseLinkedService.json"
    ```

### Create an output dataset
This output dataset is a dummy dataset that drives the schedule of the pipeline. Notice that the frequency is set to Hour and interval is set to 1. Therefore, the pipeline runs once an hour within the pipeline start and end times. 

1. Create an OutputDataset.json file with the following content: 
    
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
2. Run the **New-AzDataFactoryDataset** cmdlet to create a dataset. 

    ```powershell
    New-AzDataFactoryDataset $df -File ".\OutputDataset.json"
    ```

### Create a pipeline with stored procedure activity 
In this step, you create a pipeline with a stored procedure activity. The activity invokes the sp_executesql stored procedure to run your SSIS package. 

1. Create a JSON file named **MyPipeline.json** in the **C:\ADF\RunSSISPackage** folder with the following content:

    > [!IMPORTANT]
    > Replace &lt;folder name&gt;, &lt;project name&gt;, &lt;package name&gt; with names of folder, project, and package in the SSIS catalog before saving the file.

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
                        "stmt": "DECLARE @return_value INT, @exe_id BIGINT, @err_msg NVARCHAR(150)    EXEC @return_value=[SSISDB].[catalog].[create_execution] @folder_name=N'<folder name>', @project_name=N'<project name>', @package_name=N'<package name>', @use32bitruntime=0, @runinscaleout=1, @useanyworker=1, @execution_id=@exe_id OUTPUT    EXEC [SSISDB].[catalog].[set_execution_parameter_value] @exe_id, @object_type=50, @parameter_name=N'SYNCHRONIZED', @parameter_value=1    EXEC [SSISDB].[catalog].[start_execution] @execution_id=@exe_id, @retry_count=0    IF(SELECT [status] FROM [SSISDB].[catalog].[executions] WHERE execution_id=@exe_id)<>7 BEGIN SET @err_msg=N'Your package execution did not succeed for execution ID: ' + CAST(@exe_id AS NVARCHAR(20)) RAISERROR(@err_msg,15,1) END"
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

2. To create the pipeline: **RunSSISPackagePipeline**, run the **New-AzDataFactoryPipeline** cmdlet.

    ```powershell
    $DFPipeLine = New-AzDataFactoryPipeline -DataFactoryName $DataFactory.DataFactoryName -ResourceGroupName $ResGrp.ResourceGroupName -Name "RunSSISPackagePipeline" -DefinitionFile ".\RunSSISPackagePipeline.json"
    ```

### Monitor the pipeline run

1. Run **Get-AzDataFactorySlice** to get details about all slices of the output dataset**, which is the output table of the pipeline.

    ```powershell
    Get-AzDataFactorySlice $df -DatasetName sprocsampleout -StartDateTime 2017-10-01T00:00:00Z
    ```
    Notice that the StartDateTime you specify here is the same start time specified in the pipeline JSON. 
1. Run **Get-AzDataFactoryRun** to get the details of activity runs for a specific slice.

    ```powershell
    Get-AzDataFactoryRun $df -DatasetName sprocsampleout -StartDateTime 2017-10-01T00:00:00Z
    ```

    You can keep running this cmdlet until you see the slice in **Ready** state or **Failed** state. 

    You can run the following query against the SSISDB database in your server to verify that the package executed. 

    ```sql
    select * from catalog.executions
    ```

## Next steps
For details about the stored procedure activity, see the [Stored Procedure activity](data-factory-stored-proc-activity.md) article.
