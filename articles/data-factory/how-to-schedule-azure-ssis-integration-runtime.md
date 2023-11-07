---
title: Schedule an Azure-SSIS integration runtime 
description: This article describes how to schedule starting and stopping an Azure-SSIS integration runtime by using Azure Data Factory.
ms.service: data-factory
ms.subservice: integration-services
ms.devlang: powershell
ms.topic: conceptual
ms.date: 05/31/2023
author: chugugrace
ms.author: chugu
ms.custom: subject-rbac-steps, devx-track-azurepowershell
---
# Start and stop an Azure-SSIS integration runtime on a schedule

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how to schedule the starting and stopping of an Azure-SQL Server Integration Services (SSIS) integration runtime (IR) by using Azure Data Factory and Azure Synapse Analytics. An Azure-SSIS IR is a compute resource that's dedicated for running SSIS packages.

A cost is associated with running an Azure-SSIS IR. You typically want to run your IR only when you need to run SSIS packages in Azure and stop your IR when you don't need it anymore. You can use Data Factory, the Azure portal page for Azure Synapse Analytics pipelines, or Azure PowerShell to [manually start or stop your IR](manage-azure-ssis-integration-runtime.md).

Alternatively, you can create web activities in Data Factory or Azure Synapse Analytics pipelines to start and stop your IR on a schedule. For example, you can start it in the morning before running your daily ETL workloads and stop it in the afternoon after the workloads are done.

You can also chain an Execute SSIS Package activity between two web activities that start and stop your IR. Your IR will then start and stop on demand, before or after your package execution. For more information about the Execute SSIS Package activity, see [Run an SSIS package with the Execute SSIS Package activity in the Azure portal](how-to-invoke-ssis-package-ssis-activity.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

To implement this walkthrough, you need:

- An instance of Azure Data Factory. If you don't have one provisioned, follow the steps in [Quickstart: Create a data factory by using the Azure portal and Azure Data Factory Studio](quickstart-create-data-factory-portal.md).

- An Azure-SSIS IR. If you don't have one provisioned, follow the instructions in [Provision the Azure-SSIS integration runtime in Azure Data Factory](./tutorial-deploy-ssis-packages-azure.md).

## Create and schedule Data Factory pipelines that start and stop an Azure-SSIS IR

> [!NOTE]
> This section is not supported for Azure-SSIS in Azure Synapse Analytics with [data exfiltration protection](/azure/synapse-analytics/security/workspace-data-exfiltration-protection) enabled.

This section shows you how to use web activities in Data Factory pipelines to start and stop your Azure-SSIS IR on a schedule, or to start and stop it on demand. You'll create three pipelines:

- The first pipeline contains a web activity that starts your Azure-SSIS IR.
- The second pipeline contains a web activity that stops your Azure-SSIS IR.
- The third pipeline contains an Execute SSIS Package activity chained between two web activities that start and stop your Azure-SSIS IR.

After you create and test those pipelines, you can create a trigger that defines a schedule for running a pipeline. For example, you can create two triggers. The first one is scheduled to run daily at 6 AM and is associated with the first pipeline. The second one is scheduled to run daily at 6 PM and is associated with the second pipeline. In this way, you have a period from 6 AM to 6 PM every day when your IR is running, ready to run your daily ETL workloads.  

If you create a third trigger that's scheduled to run daily at midnight and is associated with the third pipeline, that pipeline will run at midnight every day. It will start your IR just before package execution, and then run your package. It will immediately stop your IR just after package execution, so your IR won't run idly.

### Create your pipelines

1. On the Azure Data Factory home page, select **Orchestrate**.

   :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/orchestrate-button.png" alt-text="Screenshot that shows the Orchestrate button on the Azure Data Factory home page.":::

2. In the **Activities** toolbox, expand the **General** menu and drag a web activity onto the pipeline designer surface. On the **General** tab of the activity properties window, change the activity name to **startMyIR**. Switch to the **Settings** tab, and then do the following actions.

   > [!NOTE]
   > For Azure-SSIS in Azure Synapse Analytics, use the corresponding Azure Synapse Analytics REST API to [get the integration runtime status](/rest/api/synapse/integration-runtimes/get), [start the integration runtime](/rest/api/synapse/integration-runtimes/start), and [stop the integration runtime](/rest/api/synapse/integration-runtimes/stop).

   1. For **URL**, enter the following URL for the REST API that starts the Azure-SSIS IR. Replace `{subscriptionId}`, `{resourceGroupName}`, `{factoryName}`, and `{integrationRuntimeName}` with the actual values for your IR.

      `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataFactory/factories/{factoryName}/integrationRuntimes/{integrationRuntimeName}/start?api-version=2018-06-01`

      Alternatively, you can copy and paste the resource ID of your IR from its monitoring page on the Data Factory UI or app to replace the following part of the preceding URL: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataFactory/factories/{factoryName}/integrationRuntimes/{integrationRuntimeName}`.

      :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/adf-ssis-ir-resource-id.png" alt-text="Screenshot that shows selections for finding the Azure Data Factory SSIS IR resource ID.":::
  
   2. For **Method**, select **POST**.
   3. For **Body**, enter `{"message":"Start my IR"}`.
   4. For **Authentication**, select **Managed Identity** to use the specified system-managed identity for your data factory. For more information, see [Managed identity for Azure Data Factory](./data-factory-service-identity.md).
   5. For **Resource**, enter `https://management.azure.com/`.

      :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/adf-web-activity-schedule-ssis-ir.png" alt-text="Screenshot that shows settings for an Azure Data Factory SSIS IR web activity schedule.":::
  
3. Clone the first pipeline to create a second one. Change the activity name to **stopMyIR**, and replace the following properties:

   1. For **URL**, enter the following URL for the REST API that stops the Azure-SSIS IR. Replace `{subscriptionId}`, `{resourceGroupName}`, `{factoryName}`, and `{integrationRuntimeName}` with the actual values for your IR.

      `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataFactory/factories/{factoryName}/integrationRuntimes/{integrationRuntimeName}/stop?api-version=2018-06-01`.
   1. For **Body**, enter `{"message":"Stop my IR"}`.

4. Create a third pipeline. Drag an **Execute SSIS Package** activity from the **Activities** toolbox onto the pipeline designer surface. Then, configure the activity by following the instructions in [Run an SSIS package with the Execute SSIS Package activity in the Azure portal](how-to-invoke-ssis-package-ssis-activity.md).

   Chain the Execute SSIS Package activity between two web activities that start and stop your IR, similar to those web activities in the first and second pipelines.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/adf-web-activity-on-demand-ssis-ir.png" alt-text="Screenshot that shows chaining a package between web activities on a pipeline designer.":::

   Instead of manually creating the third pipeline, you can also automatically create it from a template:

   1. Select the ellipsis (**...**) next to **Pipeline** to open a dropdown menu of pipeline actions. Then select the **Pipeline from template** action.
   1. Select the **SSIS** checkbox under **Category**.
   1. Select the **Schedule ADF pipeline to start and stop Azure-SSIS IR just in time before and after running SSIS package** template.
   1. On the **Azure-SSIS Integration Runtime** dropdown menu, select your IR.
   1. Select the **Use this template** button.

   After you create your pipeline automatically, only the SSIS package is left for you to assign to the Execute SSIS Package activity.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/adf-on-demand-ssis-ir-template.png" alt-text="Screenshot that shows selections for creating a pipeline from a template.":::

5. To make the third pipeline more robust, you can ensure that the web activities to start and stop your IR are retried if there are any transient errors (for example, due to network connectivity). You can also ensure that those web activities are completed only when your IR is actually started or stopped.

   To do so, you can replace each web activity with an Until activity. The Until activity contains two web activities: one to start and stop your IR, and another to check your IR status. Let's call the Until activities *Start SSIS IR* and *Stop SSIS IR*. The *Start SSIS IR* Until activity contains *Try Start SSIS IR* and *Get SSIS IR Status* web activities. The *Stop SSIS IR* Until activity contains *Try Stop SSIS IR* and *Get SSIS IR Status* web activities.

   On the **Settings** tab of the *Start SSIS IR* Until activity, for **Expression**, enter `@equals('Started', activity('Get SSIS IR Status').output.properties.state)`. On the **Settings** tab of the *Stop SSIS IR* Until activity, for **Expression**, enter  `@equals('Stopped', activity('Get SSIS IR Status').output.properties.state)`.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/adf-until-activity-on-demand-ssis-ir.png" alt-text="Screenshot that shows web activities to start and stop an SSIS IR.":::

   Within both Until activities, the *Try Start SSIS IR* and *Try Stop SSIS IR* web activities are similar to those web activities in the first and second pipelines. On the **Settings** tab for the *Get SSIS IR Status* web activities, do the following actions:

   1. For **URL**, enter the following URL for the REST API that gets the Azure-SSIS IR status. Replace `{subscriptionId}`, `{resourceGroupName}`, `{factoryName}`, and `{integrationRuntimeName}` with the actual values for your IR.
   
      `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataFactory/factories/{factoryName}/integrationRuntimes/{integrationRuntimeName}?api-version=2018-06-01`
   1. For **Method**, select **GET**.
   1. For **Authentication**, select **Managed Identity** to use the specified system-managed identity for your data factory. For more information, see [Managed identity for Azure Data Factory](./data-factory-service-identity.md).
   1. For **Resource**, enter `https://management.azure.com/`.

      :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/adf-until-activity-on-demand-ssis-ir-open.png" alt-text="Screenshot that shows settings for Get SSIS IR Status web activities.":::

6. Assign the managed identity for your data factory a **Contributor** role to itself, so web activities in its pipelines can call the REST API to start and stop Azure-SSIS IRs provisioned in it:  

   1. On your Data Factory page in the Azure portal, select **Access control (IAM)**.
   1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.
   1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

      | Setting | Value |
      | --- | --- |
      | Role | Contributor |
      | Assign access to | User, group, or service principal |
      | Members | Your Data Factory username |

      :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-page.png" alt-text="Screenshot that shows the page for adding a role assignment in the Azure portal.":::

7. Validate your data factory and all pipeline settings by selecting **Validate all** or **Validate** on the factory or pipeline toolbar. Close **Factory Validation Output** or **Pipeline Validation Output** by selecting the double arrow (**>>**) button.  

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/validate-pipeline.png" alt-text="Screenshot that shows the button for validating a pipeline.":::

### Test run your pipelines

1. Select **Test Run** on the toolbar for each pipeline. On the bottom pane, the **Output** tab lists pipeline runs.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/test-run-output.png" alt-text="Screenshot that shows the button for running a test and the list of pipeline runs.":::

2. To test the third pipeline, you can use SQL Server Management Studio if you store your SSIS package in the SSIS catalog (SSISDB). In the **Connect to Server** window, do the following actions:

    1. For **Server name**, enter **&lt;your server name&gt;.database.windows.net**.
    2. Select **Options >>**.
    3. For **Connect to database**, select **SSISDB**.
    4. Select **Connect**.
    5. Expand **Integration Services Catalogs** > **SSISDB** > your folder > **Projects** > your SSIS project > **Packages**.
    6. Right-click the specified SSIS package to run, and then select **Reports** > **Standard Reports** > **All Executions**.
    7. Verify that the package ran.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/verify-ssis-package-run.png" alt-text="Screenshot that shows verification of an SSIS package run.":::

### Schedule your pipelines

Now that your pipelines work as you expected, you can create triggers to run them at specified cadences. For details about associating triggers with pipelines, see [Configure schedules for pipelines](/azure/devops/pipelines/process/scheduled-triggers).

1. On the pipeline toolbar, select **Trigger**, and then select **New/Edit**.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/trigger-new-menu.png" alt-text="Screenshot that shows the menu option for creating or editing a trigger.":::

2. On the **Add Triggers** pane, select **+ New**.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/add-triggers-new.png" alt-text="Screenshot that shows the pane for adding a trigger.":::

3. On the **New Trigger** pane, do the following actions:

    1. For **Name**, enter a name for the trigger. In the following example, **trigger2** is the trigger name.
    2. For **Type**, select **Schedule**.
    3. For **Start date**, enter a start date and time in UTC.
    4. For **Recurrence**, enter a cadence for the trigger. In the following example, it's once every day.
    5. If you want the trigger to have an end date, select **Specify an end date**, and then select a date and time.
    6. Select **Start trigger on creation** to activate the trigger immediately after you publish all the Data Factory settings.
    7. Select **OK**.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/new-trigger-window.png" alt-text="Screenshot that shows the pane for creating a new trigger.":::

4. On the **Trigger Run Parameters** page, review any warnings, and then select **Finish**.
5. Publish all the Data Factory settings by selecting **Publish all** on the factory toolbar.

   :::image type="content" source="./media/how-to-invoke-ssis-package-stored-procedure-activity/publish-all-button.png" alt-text="Screenshot that shows the button for publishing all Data Factory settings.":::

### Monitor your pipelines and triggers in the Azure portal

- To monitor trigger runs and pipeline runs, use the **Monitor** tab on the left side of the Data Factory UI or app. For detailed steps, see [Visually monitor Azure Data Factory](monitor-visually.md).

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/pipeline-runs.png" alt-text="Screenshot that shows the pane for monitoring pipeline runs.":::

- To view the activity runs associated with a pipeline run, select the first link (**View Activity Runs**) in the **Actions** column. For the third pipeline, three activity runs appear: one for each chained activity in the pipeline (web activity to start your IR, Execute SSIS Package activity to run your package, and web activity to stop your IR). To view the pipeline runs again, select the **Pipelines** link at the top.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/activity-runs.png" alt-text="Screenshot that shows activity runs.":::

- To view the trigger runs, select **Trigger Runs** from the dropdown list under **Pipeline Runs** at the top.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/trigger-runs.png" alt-text="Screenshot that shows trigger runs.":::

### Monitor your pipelines and triggers by using PowerShell

Use scripts like the following examples to monitor your pipelines and triggers:

- Get the status of a pipeline run:

   ```powershell
   Get-AzDataFactoryV2PipelineRun -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -PipelineRunId $myPipelineRun
   ```

- Get info about a trigger:

   ```powershell
   Get-AzDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name  "myTrigger"
   ```

- Get the status of a trigger run:

   ```powershell
   Get-AzDataFactoryV2TriggerRun -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -TriggerName "myTrigger" -TriggerRunStartedAfter "2018-07-15" -TriggerRunStartedBefore "2018-07-16"
   ```

## Create and schedule an Azure Automation runbook that starts and stops an Azure-SSIS IR

In this section, you learn how to create Azure Automation runbook that runs a PowerShell script to start and stop your Azure-SSIS IR on a schedule. This information is useful when you want to run additional scripts before or after starting and stopping your IR for pre-processing and post-processing.

### Create your Azure Automation account

If you don't have an Azure Automation account, create one by following the instructions in this section. For detailed steps, see [Create an Azure Automation account](../automation/quickstarts/create-azure-automation-account-portal.md).

As part of this process, you create an **Azure Run As** account (a service principal in Microsoft Entra ID) and assign it a **Contributor** role in your Azure subscription. Ensure that it's the same subscription that contains your data factory with the Azure-SSIS IR. Azure Automation will use this account to authenticate to Azure Resource Manager and operate on your resources.

1. Open the Microsoft Edge or Google Chrome web browser. Currently, the Data Factory UI is supported only in these browsers.
2. Sign in to the [Azure portal](https://portal.azure.com/).
3. Select **New** on the left menu, select **Monitoring + Management**, and then select **Automation**.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/new-automation.png" alt-text="Screenshot that shows selections for opening Azure Automation in Azure Marketplace.":::

4. On the **Add Automation Account** pane, do the following actions:

    1. For **Name**, enter a name for your Azure Automation account.
    2. For **Subscription**, select the subscription that has your data factory with the Azure-SSIS IR.
    3. For **Resource group**, select **Create new** to create a new resource group, or select **Use existing** to use an existing one.
    4. For **Location**, select a location for your Azure Automation account.
    5. For **Create Azure Run As account**, select **Yes**. A service principal will be created in your Microsoft Entra instance and assigned a **Contributor** role in your Azure subscription.
    6. Select **Pin to dashboard** to display the account permanently on the Azure dashboard.
    7. Select **Create**.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/add-automation-account-window.png" alt-text="Screenshot that shows selections for adding an Azure Automation account.":::

5. Monitor the deployment status of your Azure Automation account on the Azure dashboard and in notifications.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/deploying-automation.png" alt-text="Screenshot of an indicator that shows Azure Automation deployment in progress.":::

6. Confirm that the home page of your Azure Automation account appears. It means you created the account successfully.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/automation-home-page.png" alt-text="Screenshot that shows the Azure Automation home page.":::

### Import Data Factory modules

On the left menu, in the **SHARED RESOURCES** section, select **Modules**. Verify that you have **Az.DataFactory** and **Az.Profile** in the list of modules. They're both required.

   :::image type="content" source="media/how-to-schedule-azure-ssis-integration-runtime/automation-fix-image1.png" alt-text="Screenshot that shows a list of modules in Azure Automation.":::

If you don't have **Az.DataFactory**:

1. Go to the [Az.DataFactory module](https://www.powershellgallery.com/packages/Az.DataFactory/) in the PowerShell Gallery.
1. Select **Deploy to Azure Automation**, select your Azure Automation account, and then select **OK**.
1. Go back to view **Modules** in the **SHARED RESOURCES** section on the left menu. Wait until **STATUS** for the **Az.DataFactory** module changes to **Available**.

    :::image type="content" source="media/how-to-schedule-azure-ssis-integration-runtime/automation-fix-image2.png" alt-text="Screenshot that shows verification that the Data Factory module appears in the module list.":::

If you don't have **Az.Profile**:

1. Go to the [Az.Profile module](https://www.powershellgallery.com/packages/Az.profile/) in the PowerShell Gallery.
1. Select **Deploy to Azure Automation**, select your Azure Automation account, and then select **OK**.
1. Go back to view **Modules** in the **SHARED RESOURCES** section on the left menu. Wait until **STATUS** for the **Az.Profile** module changes to **Available**.

    :::image type="content" source="media/how-to-schedule-azure-ssis-integration-runtime/automation-fix-image3.png" alt-text="Screenshot that shows verification that the profile module appears in the module list.":::

### Create your PowerShell runbook

This section provides steps for creating a PowerShell runbook. The script associated with your runbook either starts or stops the Azure-SSIS IR, based on the command that you specify for the **OPERATION** parameter.

The following steps don't provide the complete details for creating a runbook. For more information, see [Create a runbook](../automation/learn/powershell-runbook-managed-identity.md).

1. Switch to the **Runbooks** tab and select **+ Add a runbook** from the toolbar.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/runbooks-window.png" alt-text="Screenshot that shows the button for adding a runbook.":::

2. Select **Create a new runbook**, and then do the following actions:

    1. For **Name**, enter **StartStopAzureSsisRuntime**.
    2. For **Runbook type**, select **PowerShell**.
    3. Select **Create**.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/add-runbook-window.png" alt-text="Screenshot that shows details for creating a runbook.":::

3. Copy and paste the following PowerShell script into your runbook script window. Save and then publish your runbook by using the **Save** and **Publish** buttons on the toolbar.

    >[!NOTE]
    > This example uses a system-assigned managed identity. If you're using a Run As account (service principal) or a user-assigned managed identity, refer to [Azure Automation sample scripts](../automation/migrate-run-as-accounts-managed-identity.md?tabs=ua-managed-identity#sample-scripts) for the login part.
    >
    > Enable appropriate role-based access control (RBAC) permissions for the managed identity of this Automation account. For more information, see [Roles and permissions for Azure Data Factory](concepts-roles-permissions.md).

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
    
    $ErrorActionPreference = "Stop"
    
    try
    {
        "Logging in to Azure..."
        Connect-AzAccount -Identity
    }
    catch {
        Write-Error -Message $_.Exception
        throw $_.Exception
    }
    
    if($Operation -eq "START" -or $operation -eq "start")
    {
        "##### Starting #####"
        Start-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name $AzureSSISName -Force
    }
    elseif($Operation -eq "STOP" -or $operation -eq "stop")
    {
        "##### Stopping #####"
        Stop-AzDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName -Force
    }  
    "##### Completed #####"    
    ```

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/edit-powershell-runbook.png" alt-text="Screenshot of the interface for editing a PowerShell runbook.":::

4. Test your runbook by selecting the **Start** button on the toolbar.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/start-runbook-button.png" alt-text="Screenshot that shows the button for starting a runbook.":::

5. On the **Start Runbook** pane, do the following actions:

    1. For **RESOURCEGROUPNAME**, enter the name of resource group that has your data factory with the Azure-SSIS IR.
    2. For **DATAFACTORYNAME**, enter the name of your data factory with the Azure-SSIS IR.
    3. For **AZURESSISNAME**, enter the name of the Azure-SSIS IR.
    4. For **OPERATION**, enter **START**.
    5. Select **OK**.  

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/start-runbook-window.png" alt-text="Screenshot of the pane for parameters in starting a runbook.":::

6. On the **Job** pane, select the **Output** tile. On the **Output** pane, wait for the message **##### Completed #####** after you see **##### Starting #####**. Starting an Azure-SSIS IR takes about 20 minutes. Close the **Job** pane and get back to the **Runbook** page.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/start-completed.png" alt-text="Screenshot that shows the output pane.":::

7. Repeat the previous two steps by using **STOP** as the value for **OPERATION**. Start your runbook again by selecting the **Start** button on the toolbar. Enter your resource group, data factory, and Azure-SSIS IR names. For **OPERATION**, enter **STOP**. On the **Output** pane, wait for the message **##### Completed #####** after you see **##### Stopping #####**. Stopping an Azure-SSIS IR does not take as long as starting it. Close the **Job** pane and get back to the **Runbook** page.

8. You can also trigger your runbook via a webhook. To create a webhook, select the **Webhooks** menu item. Or you can create the webhook on a schedule by selecting the **Schedules** menu item, as specified in the next section.  

## Create schedules for your runbook to start and stop an Azure-SSIS IR

In the previous section, you created an Azure Automation runbook that can either start or stop an Azure-SSIS IR. In this section, you create two schedules for your runbook. When you're configuring the first schedule, you specify **START** for **OPERATION**. When you're configuring the second one, you specify **STOP** for **OPERATION**. For detailed steps to create schedules, see [Create a schedule](../automation/shared-resources/schedules.md#create-a-schedule).

1. On the **Runbook** page, select **Schedules**, and then select **+ Add a schedule** on the toolbar.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/add-schedules-button.png" alt-text="Screenshot that shows the button for adding a schedule.":::

2. On the **Schedule Runbook** pane, do the following actions:

    1. Select **Link a schedule to your runbook**.
    2. Select **Create a new schedule**.
    3. On the **New Schedule** pane, enter **Start IR daily** for **Name**.
    4. For **Starts**, enter a time that's a few minutes past the current time.
    5. For **Recurrence**, select **Recurring**.
    6. For **Recur every**, enter **1** and select **Day**.
    7. Select **Create**.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/new-schedule-start.png" alt-text="Screenshot that shows selections for scheduling the start of an Azure-SSIS IR.":::

3. Switch to the **Parameters and run settings** tab. Specify your resource group, data factory, and Azure-SSIS IR names. For **OPERATION**, enter **START**, and then select **OK**. Select **OK** again to see the schedule on the **Schedules** page of your runbook.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/start-schedule.png" alt-text="Screenshot that highlights the value for the operation parameter in scheduling the start of a runbook.":::

4. Repeat the previous two steps to create a schedule named **Stop IR daily**. Enter a time that's at least 30 minutes after the time that you specified for the **Start IR daily** schedule. For **OPERATION**, enter **STOP**, and then select **OK**. Select **OK** again to see the schedule on the **Schedules** page of your runbook.

5. On the **Runbook** page, select **Jobs** on the left menu. The page that opens lists the jobs created by your schedules at the specified times, along with their statuses. You can see the job details, such as its output, similar to what appeared after you tested your runbook.

   :::image type="content" source="./media/how-to-schedule-azure-ssis-integration-runtime/schedule-jobs.png" alt-text="Screenshot that shows the schedule for starting an Azure-SSIS IR.":::

6. When you finish testing, disable your schedules by editing them. Select **Schedules** on the left menu, select **Start IR daily/Stop IR daily**, and then select **No** for **Enabled**.

## Next steps

See the following blog post:

- [Modernize and extend your ETL/ELT workflows with SSIS activities in Azure Data Factory pipelines](https://techcommunity.microsoft.com/t5/SQL-Server-Integration-Services/Modernize-and-Extend-Your-ETL-ELT-Workflows-with-SSIS-Activities/ba-p/388370)

See the following articles from SSIS documentation:

- [Deploy, run, and monitor an SSIS package on Azure](/sql/integration-services/lift-shift/ssis-azure-deploy-run-monitor-tutorial)   
- [Connect to the SSIS catalog in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database)
- [Schedule package execution in Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages)
- [Connect to on-premises data sources with Windows authentication](/sql/integration-services/lift-shift/ssis-azure-connect-with-windows-auth)
