---
title: Run SSIS package with Stored Procedure Activity - Azure 
description: This article describes how to run a SQL Server Integration Services (SSIS) package in an Azure Data Factory pipeline by using the Stored Procedure Activity.
author: chugugrace
ms.service: data-factory
ms.subservice: integration-services
ms.devlang: powershell
ms.topic: conceptual
ms.date: 07/20/2023
ms.author: chugu 
ms.custom: devx-track-azurepowershell
---
# Run an SSIS package with the Stored Procedure activity

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how to run an SSIS package in an Azure Data Factory pipeline pr Synapse Pipelines by using a Stored Procedure activity. 

## Prerequisites

### Azure SQL Database 
The walk through in this article uses Azure SQL Database to host the SSIS catalog. You can also use Azure SQL Managed Instance.

### Data Factory
You will need an instance of Azure Data Factory to implement this walk through. If you do not have one already provisioned, you can follow the steps in [Quickstart: Create a data factory by using the Azure portal and Azure Data Factory Studio](quickstart-create-data-factory-portal.md).

### Azure-SSIS integration runtime
Finally, you will also require an Azure-SSIS integration runtime if you don't have one by following the step-by-step instruction in the [Tutorial: Deploy SSIS packages](./tutorial-deploy-ssis-packages-azure.md).

## Create a pipeline with stored procedure activity

In this step, you use the Data Factory UI to create a pipeline.  If you have not navigated to the Azure Data Factory Studio already, open your data factory in the Azure Portal and click the **Open Azure Data Factory Studio** button to open it.

:::image type="content" source="./media/doc-common-process/data-factory-home-page.png" alt-text="Screenshot of the Azure Data Factory home page.":::

Next, you will add a stored procedure activity to a new pipeline and configure it to run the SSIS package by using the sp_executesql stored procedure. 

1. In the home page, click **Orchestrate**: 

   :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/orchestrate-button.png" alt-text="Screenshot that shows the Orchestrate button on the Azure Data Factory home page.":::

2. In the **Activities** toolbox, search for **Stored procedure**, and drag-drop a **Stored procedure** activity to the pipeline designer surface. 

    :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/drag-drop-sproc-activity.png" alt-text="Drag-and-drop stored procedure activity":::

3. Select the **Stored procedure** activity you just added to the designer surface, and then the **Settings** tab, and click **+ New** beside the **Linked service**. You create a connection to the database in Azure SQL Database that hosts the SSIS Catalog (SSIDB database). 
   
    :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/new-linked-service-button.png" alt-text="New linked service button":::

4. In the **New Linked Service** window, do the following steps: 

    1. Select **Azure SQL Database** for **Type**.
    2. Select the **Default** AutoResolveIntegrationRuntime to connect to the Azure SQL Database that hosts the `SSISDB` database.
    3. Select the Azure SQL Database that hosts the SSISDB database for the **Server name** field.
    4. Select **SSISDB** for **Database name**.
    5. For **User name**, enter the name of user who has access to the database.
    6. For **Password**, enter the password of the user. 
    7. Test the connection to the database by clicking **Test connection** button.
    8. Save the linked service by clicking the **Save** button. 

        :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/azure-sql-database-linked-service-settings.png" alt-text="Screenshot that shows the process for adding a new linked service.":::

5. Back in the properties window on the **Settings** tab, complete the following steps: 

    1. Select **Edit**. 
    2. For the **Stored procedure name** field, Enter `sp_executesql`. 
    3. Click **+ New** in the **Stored procedure parameters** section. 
    4. For **name** of the parameter, enter **stmt**. 
    5. For **type** of the parameter, enter **String**. 
    6. For **value** of the parameter, enter the following SQL query:

        In the SQL query, specify the right values for the **folder_name**, **project_name**, and **package_name** parameters. 

        ```sql
        DECLARE @return_value INT, @exe_id BIGINT, @err_msg NVARCHAR(150)    EXEC @return_value=[SSISDB].[catalog].[create_execution] @folder_name=N'<FOLDER name in SSIS Catalog>', @project_name=N'<PROJECT name in SSIS Catalog>', @package_name=N'<PACKAGE name>.dtsx', @use32bitruntime=0, @runinscaleout=1, @useanyworker=1, @execution_id=@exe_id OUTPUT    EXEC [SSISDB].[catalog].[set_execution_parameter_value] @exe_id, @object_type=50, @parameter_name=N'SYNCHRONIZED', @parameter_value=1    EXEC [SSISDB].[catalog].[start_execution] @execution_id=@exe_id, @retry_count=0    IF(SELECT [status] FROM [SSISDB].[catalog].[executions] WHERE execution_id=@exe_id)<>7 BEGIN SET @err_msg=N'Your package execution did not succeed for execution ID: ' + CAST(@exe_id AS NVARCHAR(20)) RAISERROR(@err_msg,15,1) END
        ```

        :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/stored-procedure-settings.png" alt-text="Azure SQL Database linked service":::

6. To validate the pipeline configuration, click **Validate** on the toolbar. To close the **Pipeline Validation Report**, click **>>**.

    :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/validate-pipeline.png" alt-text="Validate pipeline":::
7. Publish the pipeline to Data Factory by clicking **Publish All** button. 

    :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/publish-all-button.png" alt-text="Publish":::    

### Run and monitor the pipeline
In this section, you trigger a pipeline run and then monitor it. 

1. To trigger a pipeline run, click **Trigger** on the toolbar, and click **Trigger now**. 

    :::image type="content" source="media/how-to-invoke-ssis-package-stored-procedure-activity/trigger-now.png" alt-text="Trigger now":::

2. In the **Pipeline Run** window, select **Finish**. 
3. Switch to the **Monitor** tab on the left. You see the pipeline run and its status along with other information (such as Run Start time). To refresh the view, click **Refresh**.

    :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/pipeline-runs.png" alt-text="Screenshot that shows pipeline runs":::

3. Click **View Activity Runs** link in the **Actions** column. You see only one activity run as the pipeline has only one activity (stored procedure activity).

    :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/activity-runs.png" alt-text="Screenshot that shows activity runs":::

4. You can run the following **query** against the SSISDB database in SQL Database to verify that the package executed. 

    ```sql
    select * from catalog.executions
    ```

    :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/verify-package-executions.png" alt-text="Verify package executions":::


> [!NOTE]
> You can also create a scheduled trigger for your pipeline so that the pipeline runs on a schedule (hourly, daily, etc.). For an example, see [Create a data factory - Data Factory UI](quickstart-create-data-factory-portal.md#trigger-the-pipeline-on-a-schedule).

## Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

In this section, you use Azure PowerShell to create a Data Factory pipeline with a stored procedure activity that invokes an SSIS package. 

Install the latest Azure PowerShell modules by following instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell). 

### Create a data factory
You can either use the same data factory that has the Azure-SSIS IR or create a separate data factory. The following procedure provides steps to create a data factory. You create a pipeline with a stored procedure activity in this data factory. The stored procedure activity executes a stored procedure in the SSISDB database to run your SSIS package. 

1. Define a variable for the resource group name that you use in PowerShell commands later. Copy the following command text to PowerShell, specify a name for the [Azure resource group](../azure-resource-manager/management/overview.md) in double quotes, and then run the command. For example: `"adfrg"`.
   
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

5. To create the data factory, run the following **Set-AzDataFactoryV2** cmdlet, using the Location and ResourceGroupName property from the $ResGrp variable: 
    
    ```powershell       
    $DataFactory = Set-AzDataFactoryV2 -ResourceGroupName $ResGrp.ResourceGroupName -Location $ResGrp.Location -Name $dataFactoryName 
    ```

Note the following points:

* The name of the Azure data factory must be globally unique. If you receive the following error, change the name and try again.

    ```
    The specified Data Factory name 'ADFv2QuickStartDataFactory' is already in use. Data Factory names must be globally unique.
    ```
* To create Data Factory instances, the user account you use to log in to Azure must be a member of **contributor** or **owner** roles, or an **administrator** of the Azure subscription.
* For a list of Azure regions in which Data Factory is currently available, select the regions that interest you on the following page, and then expand **Analytics** to locate **Data Factory**: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.

### Create an Azure SQL Database linked service
Create a linked service to link your database that hosts the SSIS catalog to your data factory. Data Factory uses information in this linked service to connect to SSISDB database, and executes a stored procedure to run an SSIS package. 

1. Create a JSON file named **AzureSqlDatabaseLinkedService.json** in **C:\ADF\RunSSISPackage** folder with the following content: 

	> [!IMPORTANT]
	> Replace &lt;servername&gt;, &lt;username&gt;, and &lt;password&gt; with values of your Azure SQL Database before saving the file.

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

3. Run the **Set-AzDataFactoryV2LinkedService** cmdlet to create the linked service: **AzureSqlDatabaseLinkedService**. 

    ```powershell
    Set-AzDataFactoryV2LinkedService -DataFactoryName $DataFactory.DataFactoryName -ResourceGroupName $ResGrp.ResourceGroupName -Name "AzureSqlDatabaseLinkedService" -File ".\AzureSqlDatabaseLinkedService.json"
    ```

### Create a pipeline with stored procedure activity 
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
                        "referenceName": "AzureSqlDatabaseLinkedService",
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

2. To create the pipeline: **RunSSISPackagePipeline**, Run the **Set-AzDataFactoryV2Pipeline** cmdlet.

    ```powershell
    $DFPipeLine = Set-AzDataFactoryV2Pipeline -DataFactoryName $DataFactory.DataFactoryName -ResourceGroupName $ResGrp.ResourceGroupName -Name "RunSSISPackagePipeline" -DefinitionFile ".\RunSSISPackagePipeline.json"
    ```

    Here is the sample output:

    ```
    PipelineName      : Adfv2QuickStartPipeline
    ResourceGroupName : <resourceGroupName>
    DataFactoryName   : <dataFactoryName>
    Activities        : {CopyFromBlobToBlob}
    Parameters        : {[inputPath, Microsoft.Azure.Management.DataFactory.Models.ParameterSpecification], [outputPath, Microsoft.Azure.Management.DataFactory.Models.ParameterSpecification]}
    ```

### Create a pipeline run
Use the **Invoke-AzDataFactoryV2Pipeline** cmdlet to run the pipeline. The cmdlet returns the pipeline run ID for future monitoring.

```powershell
$RunId = Invoke-AzDataFactoryV2Pipeline -DataFactoryName $DataFactory.DataFactoryName -ResourceGroupName $ResGrp.ResourceGroupName -PipelineName $DFPipeLine.Name
```

### Monitor the pipeline run

Run the following PowerShell script to continuously check the pipeline run status until it finishes copying the data. Copy/paste the following script in the PowerShell window, and press ENTER. 

```powershell
while ($True) {
    $Run = Get-AzDataFactoryV2PipelineRun -ResourceGroupName $ResGrp.ResourceGroupName -DataFactoryName $DataFactory.DataFactoryName -PipelineRunId $RunId

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

### Create a trigger
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
3. Run the **Set-AzDataFactoryV2Trigger** cmdlet, which creates the trigger. 

    ```powershell
    Set-AzDataFactoryV2Trigger -ResourceGroupName $ResGrp.ResourceGroupName -DataFactoryName $DataFactory.DataFactoryName -Name "MyTrigger" -DefinitionFile ".\MyTrigger.json"
    ```
4. By default, the trigger is in stopped state. Start the trigger by running the **Start-AzDataFactoryV2Trigger** cmdlet. 

    ```powershell
    Start-AzDataFactoryV2Trigger -ResourceGroupName $ResGrp.ResourceGroupName -DataFactoryName $DataFactory.DataFactoryName -Name "MyTrigger" 
    ```
5. Confirm that the trigger is started by running the **Get-AzDataFactoryV2Trigger** cmdlet. 

    ```powershell
    Get-AzDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name "MyTrigger"     
    ```    
6. Run the following command after the next hour. For example, if the current time is 3:25 PM UTC, run the command at 4 PM UTC. 
    
    ```powershell
    Get-AzDataFactoryV2TriggerRun -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -TriggerName "MyTrigger" -TriggerRunStartedAfter "2017-12-06" -TriggerRunStartedBefore "2017-12-09"
    ```

    You can run the following query against the SSISDB database in SQL Database to verify that the package executed. 

    ```sql
    select * from catalog.executions
    ```


## Next steps
You can also monitor the pipeline using the Azure portal. For step-by-step instructions, see [Monitor the pipeline](quickstart-create-data-factory-resource-manager-template.md#monitor-the-pipeline).