---
title: How to schedule Azure-SSIS Integration Runtime | Microsoft Docs
description: This article describes how to schedule the starting and stopping of Azure-SSIS Integration Runtime by using Azure Data Factory.
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang: powershell
ms.topic: conceptual
ms.date: 12/27/2018
author: swinarko
ms.author: sawinark
ms.reviewer: douglasl
manager: craigg
---
# How to start and stop Azure-SSIS Integration Runtime on a schedule
This article describes how to schedule the starting and stopping of Azure-SSIS Integration Runtime (IR) by using Azure Data Factory (ADF). Azure-SSIS IR is ADF compute resource dedicated for executing SQL Server Integration Services (SSIS) packages. Running Azure-SSIS IR has a cost associated with it. Therefore, you typically want to run your IR only when you need to execute SSIS packages in Azure and stop your IR when you do not need it anymore. You can use ADF User Interface (UI)/app or Azure PowerShell to [manually start or stop your IR](manage-azure-ssis-integration-runtime.md)).

Alternatively, you can create Web activities in ADF pipelines to start/stop your IR on schedule, e.g. starting it in the morning before executing your daily ETL workloads and stopping it in the afternoon after they are done.  You can also chain an Execute SSIS Package activity between two Web activities that start and stop your IR, so your IR will start/stop on demand, just in time before/after your package execution. For more info about Execute SSIS Package activity, see [Run an SSIS package using Execute SSIS Package activity in ADF pipeline](how-to-invoke-ssis-package-ssis-activity.md).

## Prerequisites
If you have not provisioned your Azure-SSIS IR already, provision it by following instructions in the [tutorial](tutorial-create-azure-ssis-runtime-portal.md). 

## Create and schedule ADF pipelines that start and or stop Azure-SSIS IR
This section shows you how to use Web activities in ADF pipelines to start/stop your Azure-SSIS IR on schedule or start & stop it on demand. We will guide you to create three pipelines: 

1. The first pipeline contains a Web activity that starts your Azure-SSIS IR. 
2. The second pipeline contains a Web activity that stops your Azure-SSIS IR.
3. The third pipeline contains an Execute SSIS Package activity chained between two Web activities that start/stop your Azure-SSIS IR. 

After you create and test those pipelines, you can create a schedule trigger and associate it with any pipeline. The schedule trigger defines a schedule for running the associated pipeline. 

For example, you can create two triggers, the first one is scheduled to run daily at 6 AM and associated with the first pipeline, while the second one is scheduled to run daily at 6 PM and associated with the second pipeline.  In this way, you have a period between 6 AM to 6 PM every day when your IR is running, ready to execute your daily ETL workloads.  

If you create a third trigger that is scheduled to run daily at midnight and associated with the third pipeline, that pipeline will run at midnight every day, starting your IR just before package execution, subsequently executing your package, and immediately stopping your IR just after package execution, so your IR will not be running idly.

### Create your ADF

1. Sign in to [Azure portal](https://portal.azure.com/).    
2. Click **New** on the left menu, click **Data + Analytics**, and click **Data Factory**. 
   
   ![New->DataFactory](./media/tutorial-create-azure-ssis-runtime-portal/new-data-factory-menu.png)
   
3. In the **New data factory** page, enter **MyAzureSsisDataFactory** for **Name**. 
      
   ![New data factory page](./media/tutorial-create-azure-ssis-runtime-portal/new-azure-data-factory.png)
 
   The name of your ADF must be globally unique. If you receive the following error, change the name of your ADF (e.g. yournameMyAzureSsisDataFactory) and try creating it again. See [Data Factory - Naming Rules](naming-rules.md) article to learn about naming rules for ADF artifacts.
  
   `Data factory name �MyAzureSsisDataFactory� is not available`
      
3. Select your Azure **Subscription** under which you want to create your ADF. 
4. For **Resource Group**, do one of the following steps:
     
   - Select **Use existing**, and select an existing resource group from the drop-down list. 
   - Select **Create new**, and enter the name of your new resource group.   
         
   To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md) article.  
4. For **Version**, select **V2** .
5. For **Location**, select one of the locations supported for ADF creation from the drop-down list.
6. Select **Pin to dashboard**.     
7. Click **Create**.
8. On Azure dashboard, you will see the following tile with status: **Deploying Data Factory**. 

   ![deploying data factory tile](media/tutorial-create-azure-ssis-runtime-portal/deploying-data-factory.png)
   
9. After the creation is complete, you can see your ADF page as shown below.
   
   ![Data factory home page](./media/tutorial-create-azure-ssis-runtime-portal/data-factory-home-page.png)
   
10. Click **Author & Monitor** to launch ADF UI/app in a separate tab.

### Create your pipelines

1. In **Let's get started** page, select **Create pipeline**. 

   ![Get started page](./media/how-to-schedule-azure-ssis-integration-runtime/get-started-page.png)
   
2. In **Activities** toolbox, expand **General** menu, and drag & drop a **Web** activity onto the pipeline designer surface. In **General** tab of the activity properties window, change the activity name to **startMyIR**. Switch to **Settings** tab, and do the following actions.

    1. For **URL**, enter the following URL for REST API that starts Azure-SSIS IR, replacing `{subscriptionId}`, `{resourceGroupName}`, `{factoryName}`, and `{integrationRuntimeName}` with the actual values for your IR: `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataFactory/factories/{factoryName}/integrationRuntimes/{integrationRuntimeName}/start?api-version=2018-06-01`
    
    Alternatively, you can also copy & paste the resource ID of your IR from its monitoring page on ADF UI/app to replace the following part of the above URL: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataFactory/factories/{factoryName}/integrationRuntimes/{integrationRuntimeName}`
    
   ![ADF SSIS IR Resource ID](./media/how-to-schedule-azure-ssis-integration-runtime/adf-ssis-ir-resource-id.png)
  
    2. For **Method**, select **POST**. 
    3. For **Body**, enter `{"message":"Start my IR"}`. 
    4. For **Authentication**, select **MSI**. 
    5. For **Resource**, enter `https://management.azure.com/`. 
    
   ![ADF Web Activity Schedule SSIS IR](./media/how-to-schedule-azure-ssis-integration-runtime/adf-web-activity-schedule-ssis-ir.png)
  
3. Clone the first pipeline to create a second one, changing the activity name to **stopMyIR** and replacing the following properties.

    1. For **URL**, enter the following URL for REST API that stops Azure-SSIS IR, replacing `{subscriptionId}`, `{resourceGroupName}`, `{factoryName}`, and `{integrationRuntimeName}` with the actual values for your IR: `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataFactory/factories/{factoryName}/integrationRuntimes/{integrationRuntimeName}/stop?api-version=2018-06-01`
  
    2. For **Body**, enter `{"message":"Stop my IR"}`. 

4. Create a third pipeline, drag & drop an **Execute SSIS Package** activity from **Activities** toolbox onto the pipeline designer surface, and configure it following the instructions in [Invoke an SSIS package using Execute SSIS Package activity in ADF](how-to-invoke-ssis-package-ssis-activity.md) article.  Alternatively, you can use a **Stored Procedure** activity instead and configure it following the instructions in [Invoke an SSIS package using Stored Procedure activity in ADF](how-to-invoke-ssis-package-stored-procedure-activity.md) article.  Next, chain the Execute SSIS Package/Stored Procedure activity between two Web activities that start/stop your IR, similar to those Web activities in the first/second pipelines.

   ![ADF Web Activity On Demand SSIS IR](./media/how-to-schedule-azure-ssis-integration-runtime/adf-web-activity-on-demand-ssis-ir.png)

5. Assign the managed identity for your ADF a **Contributor** role to itself, so Web activities in its pipelines can call REST API to start/stop Azure-SSIS IRs provisioned under it.  On your ADF page in Azure portal, click **Access control (IAM)** and then click **+ Add role assignment**, and on **Add role assignment** blade do the following actions.

    1. For **Role**, select **Contributor**. 
    2. For **Assign access to**, select **Azure AD user, group, or service principal**. 
    3. For **Select**, search for your ADF name and select it. 
    4. Click **Save**.
    
   ![ADF Web Activity On Demand SSIS IR](./media/how-to-schedule-azure-ssis-integration-runtime/adf-managed-identity-role-assignment.png)

6. Validate your ADF and all pipeline settings by clicking **Validate all/Validate** on the factory/pipeline toolbar. Close **Factory/Pipeline Validation Output** by clicking **>>** button.  

   ![Validate pipeline](./media/how-to-schedule-azure-ssis-integration-runtime/validate-pipeline.png)

### Test run your pipelines

1. Select **Test Run** on the toolbar for the third pipeline and see **Output** window in the bottom pane. 

   ![Test Run](./media/how-to-schedule-azure-ssis-integration-runtime/test-run-output.png)
    
2. Launch SQL Server Management Studio (SSMS). In **Connect to Server** window, do the following actions. 

    1. For **Server name**, specify **&lt;your Azure SQL Database server name&gt;.database.windows.net**.
    2. Select **Options >>**.
    3. For **Connect to database**, select **SSISDB**.
    4. Select **Connect**. 
    5. Expand **Integration Services Catalogs** -> **SSISDB** -> Your folder -> **Projects** -> Your SSIS project -> **Packages**. 
    6. Right-click the specified SSIS package to run and select **Reports** -> **Standard Reports** -> **All Executions**. 
    7. Verify that it ran. 

   ![Verify SSIS package run](./media/how-to-schedule-azure-ssis-integration-runtime/verify-ssis-package-run.png)

### Schedule the pipeline 
Now that the pipeline works as you expected, you can create a trigger to run this pipeline at a specified cadence. For details about associating a schedule trigger with a pipeline, see [Trigger the pipeline on a schedule](quickstart-create-data-factory-portal.md#trigger-the-pipeline-on-a-schedule).

1. On the toolbar for the pipeline, select **Trigger**, and select **New/Edit**. 

   ![Trigger -> New/Edit](./media/how-to-schedule-azure-ssis-integration-runtime/trigger-new-menu.png)

2. In the **Add Triggers** window, select **+ New**.

   ![Add Triggers - New](./media/how-to-schedule-azure-ssis-integration-runtime/add-triggers-new.png)

3. In the **New Trigger**, do the following actions: 

    1. For **Name**, specify a name for the trigger. In the following example, **Run daily** is the name of the trigger. 
    2. For **Type**, select **Schedule**. 
    3. For **Start Date**, select a start date and time. 
    4. For **Recurrence**, specify the cadence for the trigger. In the following example, it's daily once. 
    5. For **End**, you can specify the date and time by selecting the **On Date** option. 
    6. Select **Activated**. The trigger is activated immediately after you publish the solution to Data Factory. 
    7. Select **Next**.

   ![Trigger -> New/Edit](./media/how-to-schedule-azure-ssis-integration-runtime/new-trigger-window.png)
	
4. In the **Trigger Run Parameters** page, review the warning, and select **Finish**. 
5. Publish the solution to Data Factory by selecting **Publish All** in the left pane. 

   ![Publish All](./media/how-to-schedule-azure-ssis-integration-runtime/publish-all.png)

### Monitor the pipeline and trigger in the Azure portal

1. To monitor trigger runs and pipeline runs, use the **Monitor** tab on the left. For detailed steps, see [Monitor the pipeline](quickstart-create-data-factory-portal.md#monitor-the-pipeline).

   ![Pipeline runs](./media/how-to-schedule-azure-ssis-integration-runtime/pipeline-runs.png)

2. To view the activity runs associated with a pipeline run, select the first link (**View Activity Runs**) in the **Actions** column. You see the three activity runs associated with each activity in the pipeline (first Web activity, Stored Procedure activity, and the second Web activity). To switch back to view the pipeline runs, select **Pipelines** link at the top.

   ![Activity runs](./media/how-to-schedule-azure-ssis-integration-runtime/activity-runs.png)

3. You can also view trigger runs by selecting **Trigger runs** from the drop-down list that's next to the **Pipeline Runs** at the top. 

   ![Trigger runs](./media/how-to-schedule-azure-ssis-integration-runtime/trigger-runs.png)

### Monitor the pipeline and trigger with PowerShell

Use scripts like the following examples to monitor the pipeline and the trigger.

1. Get the status of a pipeline run.

  ```powershell
  Get-AzureRmDataFactoryV2PipelineRun -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -PipelineRunId $myPipelineRun
  ```

2. Get info about the trigger.

  ```powershell
  Get-AzureRmDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name  "myTrigger"
  ```

3. Get the status of a trigger run.

  ```powershell
  Get-AzureRmDataFactoryV2TriggerRun -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -TriggerName "myTrigger" -TriggerRunStartedAfter "2018-07-15" -TriggerRunStartedBefore "2018-07-16"
  ```

## Create and test an Azure Automation runbook
In this section, you perform the following steps: 

1. Create an Azure Automation account.
2. Create a PowerShell runbook in the Azure Automation account. The PowerShell script associated with the runbook either starts or stops an Azure SSIS IR based on the command you specify for the OPERATION parameter. 
3. Test the runbook in both start and stop scenarios to confirm that it works. 

Here are the high-level steps described in this article:

1. **Create and test an Azure Automation runbook.** In this step, you create a PowerShell runbook with the script that starts or stops an Azure SSIS IR. Then, you test the runbook in both START and STOP scenarios and confirm that IR starts or stops. 
2. **Create two schedules for the runbook.** For the first schedule, you configure the runbook with START as the operation. For the second schedule, configure the runbook with STOP as the operation. For both the schedules, you specify the cadence at which the runbook is run. For example, you may want to schedule the first one to run at 8 AM every day and the second one to run at 11 PM everyday. When the first runbook runs, it starts the Azure SSIS IR. When the second runbook runs, it stops the Azure SSIS IR. 

### Create an Azure Automation account
If you don't have an Azure Automation account, create one by following the instructions in this step. For detailed steps, see [Create an Azure Automation account](../automation/automation-quickstart-create-account.md). As part of this step, you create an **Azure Run As** account (a service principal in your Azure Active Directory), and add it to the **Contributor** role of your Azure subscription. Ensure that it's same as the subscription that contains the data factory that has the Azure SSIS IR. Azure Automation uses this account to authenticate to Azure Resource Manager and operate on your resources. 

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
2. Log in to the [Azure portal](https://portal.azure.com/).    
3. Select **New** on the left menu, select **Monitoring + Management**, and select **Automation**. 

    ![New -> Monitoring + Management -> Automation](./media/how-to-schedule-azure-ssis-integration-runtime/new-automation.png)
2. In the **Add Automation Account** window, take the following steps: 

    1. Specify a **name** for the automation account. 
    2. Select the **subscription** that has the data factory with Azure SSIS IR. 
    3. For **Resource group**, select **Create new** to create a new resource group, or select **Use existing** to select an existing resource group. 
    4. Select a **location** for the automation account. 
    5. Confirm that **Create Run As account** is set to **Yes**. A service principal is created in your Azure Active Directory. It's added to the **Contributor** role of your Azure subscription
    6. Select **Pin to dashboard** so that you see it on the dashboard of the portal. 
    7. Select **Create**. 

        ![New -> Monitoring + Management -> Automation](./media/how-to-schedule-azure-ssis-integration-runtime/add-automation-account-window.png)
3. You see the **deployment status** on the dashboard and in the notifications. 
    
    ![Deploying automation](./media/how-to-schedule-azure-ssis-integration-runtime/deploying-automation.png) 
4. You see the home page for the automation account after it's created successfully. 

    ![Automation home page](./media/how-to-schedule-azure-ssis-integration-runtime/automation-home-page.png)

### Import Data Factory modules

1. Select **Modules** in the **SHARED RESOURCES** section on the left menu, and verify whether you have **AzureRM.Profile** and **AzureRM.DataFactoryV2** in the list of modules.

    ![Verify the required modules](media/how-to-schedule-azure-ssis-integration-runtime/automation-fix-image1.png)

2.  Go to the PowerShell Gallery for the [AzureRM.DataFactoryV2 module](https://www.powershellgallery.com/packages/AzureRM.DataFactoryV2/), select **Deploy to Azure Automation**, select your Automation account, and then select **OK**. Go back to view **Modules** in the **SHARED RESOURCES** section on the left menu, and wait until you see the **STATUS** of the **AzureRM.DataFactoryV2** module change to **Available**.

    ![Verify the Data Factory module](media/how-to-schedule-azure-ssis-integration-runtime/automation-fix-image2.png)

3.  Go to the PowerShell Gallery for the [AzureRM.Profile module](https://www.powershellgallery.com/packages/AzureRM.profile/), click on **Deploy to Azure Automation**, select your Automation account, and then select **OK**. Go back to view **Modules** in the **SHARED RESOURCES** section on the left menu, and wait until you see the **STATUS** of the **AzureRM.Profile** module change to **Available**.

    ![Verify the Profile module](media/how-to-schedule-azure-ssis-integration-runtime/automation-fix-image3.png)

### Create a PowerShell runbook
The following procedure provides steps for creating a PowerShell runbook. The script associated with the runbook either starts/stops an Azure SSIS IR based on the command you specify for the **OPERATION** parameter. This section does not provide all the details for creating a runbook. For more information, see [Create a runbook](../automation/automation-quickstart-create-runbook.md) article.

1. Switch to the **Runbooks** tab, and select **+ Add a runbook** from the toolbar. 

    ![Add a runbook button](./media/how-to-schedule-azure-ssis-integration-runtime/runbooks-window.png)
2. Select **Create a new runbook**, and perform the following steps: 

    1. For **Name**, type **StartStopAzureSsisRuntime**.
    2. For **Runbook type**, select **PowerShell**.
    3. Select **Create**.
    
        ![Add a runbook button](./media/how-to-schedule-azure-ssis-integration-runtime/add-runbook-window.png)
3. Copy/paste the following script to the runbook script window. Save and then publish the runbook by using the **Save** and **Publish** buttons on the toolbar. 

    ```powershell
    Param
    (
          [Parameter (Mandatory= $true)]
          [String] $ResourceGroupName,
    
          [Parameter (Mandatory= $true)]
          [String] $DataFactoryName,
    
          [Parameter (Mandatory= $true)]
          [String] $AzureSSISName,
    
          [Parameter (Mandatory= $true)]
          [String] $Operation
    )
    
    $connectionName = "AzureRunAsConnection"
    try
    {
        # Get the connection "AzureRunAsConnection "
        $servicePrincipalConnection=Get-AutomationConnection -Name $connectionName         
    
        "Logging in to Azure..."
        Connect-AzureRmAccount `
            -ServicePrincipal `
            -TenantId $servicePrincipalConnection.TenantId `
            -ApplicationId $servicePrincipalConnection.ApplicationId `
            -CertificateThumbprint $servicePrincipalConnection.CertificateThumbprint 
    }
    catch {
        if (!$servicePrincipalConnection)
        {
            $ErrorMessage = "Connection $connectionName not found."
            throw $ErrorMessage
        } else{
            Write-Error -Message $_.Exception
            throw $_.Exception
        }
    }
    
    if($Operation -eq "START" -or $operation -eq "start")
    {
        "##### Starting #####"
        Start-AzureRmDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name $AzureSSISName -Force
    }
    elseif($Operation -eq "STOP" -or $operation -eq "stop")
    {
        "##### Stopping #####"
        Stop-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName -Force
    }  
    "##### Completed #####"    
    ```

    ![Edit PowerShell runbook](./media/how-to-schedule-azure-ssis-integration-runtime/edit-powershell-runbook.png)
5. Test the runbook by selecting **Start** button on the toolbar. 

    ![Start runbook button](./media/how-to-schedule-azure-ssis-integration-runtime/start-runbook-button.png)
6. In the **Start Runbook** window, perform the following steps: 

    1. For **RESOURCE GROUP NAME**, enter the name of the resource group with the data factory that has the Azure SSIS IR. 
    2. For **DATA FACTORY NAME**, enter the name of the data factory that has the Azure SSIS IR. 
    3. For **AZURESSISNAME**, enter the name of the Azure SSIS IR. 
    4. For **OPERATION**, enter **START**. 
    5. Select **OK**.  

        ![Start runbook window](./media/how-to-schedule-azure-ssis-integration-runtime/start-runbook-window.png)
7. In the job window, select **Output** tile. In the output window of the job, wait until you see the message **##### Completed #####** after you see **##### Starting #####**. Starting an Azure SSIS IR takes approximately 20 minutes. Close the **Job** window, and get back to the **Runbook** window.

    ![Azure SSIS IR - started](./media/how-to-schedule-azure-ssis-integration-runtime/start-completed.png)
8.  Repeat the previous two steps, but by using **STOP** as the value for the **OPERATION**. Start the runbook again by selecting the **Start** button on the toolbar. Specify the resource group name, data factory name, and Azure SSIS IR name. For **OPERATION**, enter **STOP**. 

    In the output window of the job, wait until you see message **##### Completed #####** after you see **##### Stopping #####**. Stopping an Azure SSIS IR does not take as long as starting the Azure SSIS IR. Close the **Job** window, and get back to the **Runbook** window.

## Create schedules for the runbook to start/stop the Azure SSIS IR
In the previous section, you created an Azure Automation runbook that can either start or stop an Azure SSIS IR. In this section, you create two schedules for the runbook. When configuring the first schedule, you specify START for the OPERATION parameter. Similarly, when configuring the second schedule, you specify STOP for the OPERATION. For detailed steps for creating schedules, see [Create a schedule](../automation/automation-schedules.md#creating-a-schedule).

1. In the **Runbook** window, select **Schedules**, and select **+ Add a schedule** on the toolbar. 

    ![Azure SSIS IR - started](./media/how-to-schedule-azure-ssis-integration-runtime/add-schedules-button.png)
2. In the **Schedule Runbook** window, perform the following steps: 

    1. Select **Link a schedule to your runbook**. 
    2. Select **Create a new schedule**.
    3. In the **New Schedule** window, type **Start IR daily** for **Name**. 
    4. In the **Starts section**, for the time, specify a time a few minutes past the current time. 
    5. For **Recurrence**, select **Recurring**. 
    6. In the **Recur every** section, select **Day**. 
    7. Select **Create**. 

        ![Schedule for Azure SSIS IR start](./media/how-to-schedule-azure-ssis-integration-runtime/new-schedule-start.png)
3. Switch to the **Parameters and run settings** tab. Specify the resource group name, data factory name, and Azure SSIS IR name. For **OPERATION**, enter **START**. Select **OK**. Select **OK** again to see the schedule on the **Schedules** page of the runbook. 

    ![Schedule for staring the Azure SSIS IR](./media/how-to-schedule-azure-ssis-integration-runtime/start-schedule.png)
4. Repeat the previous two steps to create a schedule named **Stop IR daily**. This time, specify time at least 30 minutes after the time you specified for the **Start IR daily** schedule. For **OPERATION**, specify **STOP**. 
5. In the **Runbook** window, select **Jobs** on the left menu. You should see the jobs created by the schedules at the specified times and their statuses. You can see details about the job such as its output similar to what you have seen when you tested the runbook. 

    ![Schedule for staring the Azure SSIS IR](./media/how-to-schedule-azure-ssis-integration-runtime/schedule-jobs.png)
6. After you are done testing, disable the schedules by editing them and selecting **NO** for **Enabled**. Select **Schedules** in the left menu, select the **Start IR daily/Stop IR daily**, and select **No** for **Enabled**. 

## Next steps
See the following blog post:
-   [Modernize and extend your ETL/ELT workflows with SSIS activities in ADF pipelines](https://blogs.msdn.microsoft.com/ssis/2018/05/23/modernize-and-extend-your-etlelt-workflows-with-ssis-activities-in-adf-pipelines/)

See the following articles from SSIS documentation: 

- [Deploy, run, and monitor an SSIS package on Azure](/sql/integration-services/lift-shift/ssis-azure-deploy-run-monitor-tutorial)   
- [Connect to SSIS catalog on Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database)
- [Schedule package execution on Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages)
- [Connect to on-premises data sources with Windows authentication](/sql/integration-services/lift-shift/ssis-azure-connect-with-windows-auth)
