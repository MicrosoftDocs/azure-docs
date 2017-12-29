---
title: Invoke SSIS package using Azure Data Factory - Stored Procedure Activity | Microsoft Docs
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
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Invoke SSIS packages using stored procedure activity in version 1](v1/how-to-invoke-ssis-package-stored-procedure-activity.md).

## Prerequisites

### Azure SQL Database 
The walkthrough in this article uses an Azure SQL database that hosts the SSIS catalog. You can also use an Azure SQL Managed Instance (Private Preview).

## Create an Azure-SSIS integration runtime
Create an Azure-SSIS integration runtime if you don't have one by following the step-by-step instruction in the [Tutorial: Deploy SSIS packages](tutorial-deploy-ssis-packages-azure.md).

### Azure PowerShell
Install the latest Azure PowerShell modules by following instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps). 

## Create a data factory
You can either use the same data factory that has the Azure-SSIS IR or create a separate data factory. The following procedure provides steps to create a data factory. You create a pipeline with a stored procedure activity in this data factory. The stored procedure activity executes a stored procedure in the SSISDB database to run your SSIS package. 

1. Define a variable for the resource group name that you use in PowerShell commands later. Copy the following command text to PowerShell, specify a name for the [Azure resource group](../azure-resource-manager/resource-group-overview.md) in double quotes, and then run the command. For example: `"adfrg"`. 
   
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

5. To create the data factory, run the following **Set-AzureRmDataFactoryV2** cmdlet, using the Location and ResourceGroupName property from the $ResGrp variable: 
    
    ```powershell       
    $DataFactory = Set-AzureRmDataFactoryV2 -ResourceGroupName $ResGrp.ResourceGroupName -Location $ResGrp.Location -Name $dataFactoryName 
    ```

Note the following points:

* The name of the Azure data factory must be globally unique. If you receive the following error, change the name and try again.

    ```
    The specified Data Factory name 'ADFv2QuickStartDataFactory' is already in use. Data Factory names must be globally unique.
    ```
* To create Data Factory instances, the user account you use to log in to Azure must be a member of **contributor** or **owner** roles, or an **administrator** of the Azure subscription.
* Currently, Data Factory version 2 allows you to create data factories only in the East US, East US2, and West Europe regions. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.

### Create an Azure SQL Database linked service
Create a linked service to link your Azure SQL database that hosts the SSIS catalog to your data factory. Data Factory uses information in this linked service to connect to SSISDB database, and executes a stored procedure to run an SSIS package. 

1. Create a JSON file named **AzureSqlDatabaseLinkedService.json** in **C:\ADF\RunSSISPackage** folder with the following content: (Create the folder ADFv2TutorialBulkCopy if it does not already exist.)

	> [!IMPORTANT]
	> Replace &lt;servername&gt;, &lt;username&gt;, and &lt;password&gt; with values of your Azure SQL Database before saving the file.

    ```json
    {
        "name": "AzureSqlDbLinkedService",
        "properties": {
            "type": "AzureSqlDatabase",
            "typeProperties": {
                "connectionString": {
                    "type": "SecureString",
                    "value": "Server=tcp:<servername>.database.windows.net,1433;Database=SSISDB;User ID=<username>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
                }
            }
        }
    }
    ```

2. In **Azure PowerShell**, switch to the **C:\ADF\RunSSISPackage** folder.

3. Run the **Set-AzureRmDataFactoryV2LinkedService** cmdlet to create the linked service: **AzureSqlDatabaseLinkedService**. 

    ```powershell
    Set-AzureRmDataFactoryV2LinkedService -DataFactoryName $DataFactory.DataFactoryName -ResourceGroupName $ResGrp.ResourceGroupName -Name "AzureSqlDatabaseLinkedService" -File ".\AzureSqlDatabaseLinkedService.json"
    ```

## Create a pipeline with stored procedure activity 
In this step, you create a pipeline with a stored procedure activity. The activity invokes the sp_executesql stored procedure to run your SSIS package. 

1. Create a JSON file named **RunSSISPackagePipeline.json** in the **C:\ADF\RunSSISPackage** folder with the following content:

    > [!IMPORTANT]
	> Replace &lt;FOLDER NAME&gt;, &lt;PROJECT NAME&gt;, &lt;PACKAGE NAME&gt; with names of folder, project, and package in the SSIS catalog before saving the file. 

    ```json
    {
        "name": "RunSSISPackagePipeline",
        "properties": {
            "activities": [
                {
                    "name": "My SProc Activity",
                    "description":"Runs an SSIS package",
                    "type": "SqlServerStoredProcedure",
                    "linkedServiceName": {
                        "referenceName": "AzureSqlDbLinkedService",
                        "type": "LinkedServiceReference"
                    },
                    "typeProperties": {
                        "storedProcedureName": "sp_executesql",
                        "storedProcedureParameters": {
                            "stmt": {
                                "value": "DECLARE @return_value INT, @exe_id BIGINT, @err_msg NVARCHAR(150)    EXEC @return_value=[SSISDB].[catalog].[create_execution] @folder_name=N'<FOLDER NAME>', @project_name=N'<PROJECT NAME>', @package_name=N'<PACKAGE NAME>', @use32bitruntime=0, @runinscaleout=1, @useanyworker=1, @execution_id=@exe_id OUTPUT    EXEC [SSISDB].[catalog].[set_execution_parameter_value] @exe_id, @object_type=50, @parameter_name=N'SYNCHRONIZED', @parameter_value=1    EXEC [SSISDB].[catalog].[start_execution] @execution_id=@exe_id, @retry_count=0    IF(SELECT [status] FROM [SSISDB].[catalog].[executions] WHERE execution_id=@exe_id)<>7 BEGIN SET @err_msg=N'Your package execution did not succeed for execution ID: ' + CAST(@exe_id AS NVARCHAR(20)) RAISERROR(@err_msg,15,1) END"
                            }
                        }
                    }
                }
            ]
        }
    }
    ```

2. To create the pipeline: **RunSSISPackagePipeline**, Run the **Set-AzureRmDataFactoryV2Pipeline** cmdlet.

    ```powershell
    $DFPipeLine = Set-AzureRmDataFactoryV2Pipeline -DataFactoryName $DataFactory.DataFactoryName -ResourceGroupName $ResGrp.ResourceGroupName -Name "RunSSISPackagePipeline" -DefinitionFile ".\RunSSISPackagePipeline.json"
    ```

    Here is the sample output:

    ```
    PipelineName      : Adfv2QuickStartPipeline
    ResourceGroupName : <resourceGroupName>
    DataFactoryName   : <dataFactoryName>
    Activities        : {CopyFromBlobToBlob}
    Parameters        : {[inputPath, Microsoft.Azure.Management.DataFactory.Models.ParameterSpecification], [outputPath, Microsoft.Azure.Management.DataFactory.Models.ParameterSpecification]}
    ```

## Create a pipeline run
Use the **Invoke-AzureRmDataFactoryV2Pipeline** cmdlet to run the pipeline. The cmdlet returns the pipeline run ID for future monitoring.

```powershell
$RunId = Invoke-AzureRmDataFactoryV2Pipeline -DataFactoryName $DataFactory.DataFactoryName -ResourceGroupName $ResGrp.ResourceGroupName -PipelineName $DFPipeLine.Name
```

## Monitor the pipeline run

Run the following PowerShell script to continuously check the pipeline run status until it finishes copying the data. Copy/paste the following script in the PowerShell window, and press ENTER. 

```powershell
while ($True) {
    $Run = Get-AzureRmDataFactoryV2PipelineRun -ResourceGroupName $ResGrp.ResourceGroupName -DataFactoryName $DataFactory.DataFactoryName -PipelineRunId $RunId

    if ($Run) {
        if ($run.Status -ne 'InProgress') {
            Write-Output ("Pipeline run finished. The status is: " +  $Run.Status)
            $Run
            break
        }
        Write-Output  "Pipeline is running...status: InProgress"
    }

    Start-Sleep -Seconds 10
}   
```

## Create a trigger
In the previous step, you invoked the pipeline on-demand. You can also create a schedule trigger to run the pipeline on a schedule (hourly, daily, etc.).

1. Create a JSON file named **MyTrigger.json** in **C:\ADF\RunSSISPackage** folder with the following content: 

    ```json
    {
        "properties": {
            "name": "MyTrigger",
            "type": "ScheduleTrigger",
            "typeProperties": {
                "recurrence": {
                    "frequency": "Hour",
                    "interval": 1,
                    "startTime": "2017-12-07T00:00:00-08:00",
                    "endTime": "2017-12-08T00:00:00-08:00"
                }
            },
            "pipelines": [{
                    "pipelineReference": {
                        "type": "PipelineReference",
                        "referenceName": "RunSSISPackagePipeline"
                    },
                    "parameters": {}
                }
            ]
        }
    }    
    ```
2. In **Azure PowerShell**, switch to the **C:\ADF\RunSSISPackage** folder.
3. Run the **Set-AzureRmDataFactoryV2Trigger** cmdlet to create the trigger. 

    ```powershell
    Set-AzureRmDataFactoryV2Trigger -ResourceGroupName $ResGrp.ResourceGroupName -DataFactoryName $DataFactory.DataFactoryName -Name "MyTrigger" -DefinitionFile ".\MyTrigger.json"
    ```
4. By default, the trigger is in stopped state. Start the trigger by running the **Start-AzureRmDataFactoryV2Trigger** cmdlet. 

    ```powershell
    Start-AzureRmDataFactoryV2Trigger -ResourceGroupName $ResGrp.ResourceGroupName -DataFactoryName $DataFactory.DataFactoryName -Name "MyTrigger" 
    ```
5. Confirm that the trigger is started by running the **Get-AzureRmDataFactoryV2Trigger** cmdlet. 

    ```powershell
    Get-AzureRmDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name "MyTrigger"     
    ```    
6. Run the following command after the next hour. For example, if the current time is 3:25 PM UTC, run the command at 4 PM UTC. 
    
    ```powershell
    Get-AzureRmDataFactoryV2TriggerRun -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -TriggerName "MyTrigger" -TriggerRunStartedAfter "2017-12-06" -TriggerRunStartedBefore "2017-12-09"
    ```

    You can run the following query against the SSISDB database in your Azure SQL server to verify that the package executed. 

    ```sql
    select * from catalog.executions
    ```

## Next steps
You can also monitor the pipeline using the Azure portal. For step-by-step instructions, see [Monitor the pipeline](quickstart-create-data-factory-resource-manager-template.md#monitor-the-pipeline).
