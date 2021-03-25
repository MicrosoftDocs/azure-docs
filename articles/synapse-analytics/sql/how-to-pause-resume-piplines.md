---
title: Pause and resume dedicated SQL pools with Synapse Pipelines 
description: Learn to automate pause and resume a dedicated SQL pool with Synapse Pipelines in Azure Synapse Analytics. 
author: iamjenetzler
ms.author: jeetzler
ms.service: synapse-analytics
ms.topic: how-to 
ms.date: 02/05/2021
ms.custom: template-how-to 
---

# Pause and resume dedicated SQL pools with Synapse Pipelines

Pause and resume for dedicated SQL pools can be automated using Synapse Pipeline in Azure Synapse Analytics. Pause and resume are used to save costs for a dedicated SQL pool. This solution can easily be included in an existing data orchestration process. 

The following steps will guide you through setting up automated pause and resume.

1. Parameter setup in your pipeline
1. Identify the list of dedicated SQL pools in your Synapse workspace
1. Remove any irrelevant dedicated SQL pools from this list 
1. Loop over each dedicated SQL pool and:
    1. Check the state of the dedicated SQL pool
    1. Depending upon its state, initiate pause or resume

These steps are laid out in a simple pipeline in Synapse:

![Simple Synapse pipeline](./media/how-to-pause-resume-pipelines/simple-pipeline.png)


Depending upon the nature of your environment, the whole process described here may not apply, and you may just want to choose the appropriate steps. The process described here can be used to pause or resume all instances in a development, test, or PoC environment. For a production environment, you're more likely to schedule pause or resume on an instance by instance basis so will only need step 3.

The above steps above use the REST APIs for Synapse and Azure SQL:

- [Dedicated SQL pool operations](/rest/api/synapse/sqlpools)
 
- [Azure SQL Database REST API](/rest/api/sql)

Synapse Pipelines allow for the automation of pause and resume, but you can execute these commands on-demand via the tool or application of your choice.

## Prerequisites

- You'll need an [Azure Synapse workspace](../get-started-create-workspace.md)
- You wil need to assign security to the workspace

## Pipeline setup steps

1. Create a pipeline in Synapse Studio.
    1. Navigate to your workspace and open Synapse Studio. 
    1. Select the **Integrate** icon, then select the + sign to create a new pipeline. 
    1. Name your pipeline PauseResume.

    ![Create a pipeline in Synapse Studio](./media/how-to-pause-resume-pipelines/create-pipeline.png) 

2. The pipeline you will created will be parameter driven. Parameters allow you to create a generic pipeline that you can use across multiple subscriptions, resource groups, or dedicated SQL pools. Select the **Parameters** tab near the bottom of the pipeline screen. Create the following parameters:

    
    |Name  |Type  |Default value  |Description|
    |---------|---------|---------|-----------|
    |ResourceGroup    |string        |Synapse          |Name of the resource group for your dedicated SQL pools|
    |SubscriptionID   |string        |Your Subscription|Subscription ID for your resource group|
    |WorkspaceName    |string        |Synapse          |Name of your workspace|
    |SQLPoolName      |string        |SQLPool1         |Name of your dedicated SQL pool|
    |PauseorResume    |string        |Pause            |The desired state at the end of the pipeline run|

    ![Pipeline parameters inputin Synapse Studio.](./media/how-to-pause-resume-pipelines/pipeline-parameters.png)

3. Set up a **Web** activity, you'll use this activity to identify the list of dedicated SQL pools by calling the dedicated SQL pools - List By Server REST API request. The output is a JSON string that contains a list of the database instances in the SQL server named above. The JSON string is passed to the next activity.
    1. Under **Activities** > **General** drag a **Web** activity to the pipeline canvas as the first stage of your pipeline.  
    1. In the **General** tab, name this stage GET List. 
    1. Select the **Settings** tab then click in the **URL** entry space, then select **Add dynamic content**. Copy and paste the GET request that has been parameterized using the @concat string function  below into the dynamic content box. Select **Finish**. 
    1. Select the drop down for **Method** and select **Get**  Select **Advanced** to expand the content. Select **MSI** as the Authentication type. For Resource enter `https://management.azure.com/` 
    > [!IMPORTANT]
    > For all of the Web Activities / REST API Web calls, you need to ensure that Synapse Pipeline is authenticated against dedicated SQL pool. [Managed Identity](../../data-factory/control-flow-web-activity.md#managed-identity) is required to run these REST API calls. 
    
    
    ![Web activity list for dedicated SQL pools](./media/how-to-pause-resume-pipelines/web-activity-list-sql-pools.png)
    
    The following code is a simple Get request:
    
    ```HTTP
    GET https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Synapse/workspaces/{workspace-name}/sqlPools?api-version=2019-06-01-preview
    ```
    
    GET request that has been parameterized using the @concat string function:
    
    ```HTTP
    @concat('https://management.azure.com/subscriptions/',pipeline().parameters.SubscriptionID,'/resourceGroups/',pipeline().parameters.ResourceGroup,'/providers/Microsoft.Synapse/workspaces/',pipeline().parameters.WorkspaceName,'/sqlPools?api-version=2019-06-01-preview')
    ```


4. Remove dedicated SQL pools that you do not want to pause or resume with a Filter Activity that filters  the values passed from the Get list activity.  In this example, we're extracting the records from the array that don't have "prod" in the name. Other conditions can be applied as needed, such as filtering on the sku/name of the Synapse workspace to ensure only valid dedicated SQL pools are identified.
    1. Select and drag the **Filter** activity under **Iteration & conditionals** to the pipeline canvas.    
    ![Filter dedicated SQL pools](./media/how-to-pause-resume-pipelines/filter-sql-pools.png)    
    1. Connect the Get List Web activity to the Filter activity by selecting the green tab on the Web activity and dragging it to the Filter box.
    1. Enter `@activity('Get list').output.value` for **Items** where GET List is the name of the preceding Web activity
    1. Enter `@not(endswith(item().name,'prod'))` for **Condition**. The remaining records in the array are then passed to the next activity.

5. Next, create a ForEach activity to loop over each dedicated SQL pool. 
    1. Select and drag the **ForEach** activity under **Iteration & conditionals** to the pipeline canvas.
    1. On the **General** tab name the activity, we have used 'ForEachSQLPool'. 
    1. On the **Settings** tab, select **Sequential**. 
    1. Select the **Items** input and select **Add dynamic content**. Scroll to the **Activity outputs** and select the output from your filter activity. Select **finish**.
    ![Loop through dedicated SQL pools](./media/how-to-pause-resume-pipelines/loop-through-sql-pools.png)
    1. Select the **Activities** tab and select the edit pencil to open the ForEach loop canvas. 
    1. If you're pausing or resuming a single dedicated SQL pool, complete step 1 above and follow the next steps.       
    1. Checking the state of the dedicated SQL pool requires a Web Activity, similar to step 1. This activity calls the [Check dedicated SQL pool state REST API for Azure Synapse](../sql-data-warehouse/sql-data-warehouse-manage-compute-rest-api.md#check-database-state). Select and drag a **Web** activity under **General** to the pipeline canvas.    
        1. In the **General** tab, name this stage CheckState. 
        1. Select the **Settings** tab.     
        1. Click in the **URL** entry space, then select **Add dynamic content**. Copy and paste the GET request that has been parameterized using the @concat string function from below into the dynamic content box. Select **Finish**. 
        1. Select the drop down for **Method** and select **Get**  Select **Advanced** to expand the content. Select **MSI** as the Authentication type. For Resource enter `https://management.azure.com/` 
        
        ![Check state of the dedicated SQL pool](./media/how-to-pause-resume-pipelines/check-sql-pool-state.png)
        
        Checking the state again uses a simple Get request using the following call:
        
        ```HTTP
        GET https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Synapse/workspaces/{workspace-name}/sqlPools/{database-name}?api-version=2019-06-01-preview HTTP/1.1
        ```
        
        You can parameterize the GET request using the @concat string function:
        
        ```HTTP
        @concat('https://management.azure.com/subscriptions/',pipeline().parameters.SubscriptionID,'/resourceGroups/',pipeline().parameters.ResourceGroup,'/providers/Microsoft.Synapse/workspaces/',pipeline().parameters.WorkspaceName,'/sqlPools/',item().name,'?api-version=2019-06-01-preview')
        ```
        
        In this case, we are using item().name which is the name of the dedicated SQL pool from Step 1 that that was passed to this activity from the ForEach loop. If you are using a pipeline to control a single dedicated SQL pool, you can embed the name of your dedicated SQL pool here, or use a parameter from the pipeline. For example, you could use pipeline().parameters.SQLPoolName.
        
        The output is a JSON string that contains details of the dedicated SQL pool, including its status (in properties.status). the JSON string is passed to the next activity.
    
    7. Evaluate the desired state, Pause or Resume, and the current status, Online, or Paused, and then initiate Pause or Resume as needed.
        
        1. Select and drag a **Switch** activity, under **Iteration & conditionals**, to the pipeline canvas.    
        1. Connect the **Switch** activity to the CheckState activity by selecting the green tab on the Web activity and dragging it to the Switch box.  
        1. In the **General** tab, name this stage State-PauseOrResume. 
        
        ![Check condition dedicated SQL pool](./media/how-to-pause-resume-pipelines/check-condition.png)
        
        Based on the desired state and the current status, only the following two combinations will require a change in state: Paused-Resume or Online-Paused.
        
        ```HTTP
        @concat(pipeline().parameters.PauseOrResume,'-',activity('CheckState').output.properties.status)
        ```
        
        where pipeline().parameters.PauseOrResume indicates the desired state, and Check State is the name of the preceding Web activity with output.properties.status defining the current status.
        
        The check condition does a check of the desired state and the current status. If the desired state is Resume and the current status is Paused, a Resume Activity is invoked within the Resume-Pause Case. If the desired state is Pause and the current status is Online, a Pause Activity is invoked with the Pause-Online Case. Any other cases, such as a desired state of Pause and a current status of Paused, or a desired state of Resume and a current status of Online, would require no action and be handled by the Default case, which has no activities.
        
        Within the appropriate activity branch, add the final step.
    
        c. Dedicated SQL pool pause or resume
        
        The final step and only relevant step for some requirements, is to initiate the Pause or Resume of your dedicated SQL pool. Like steps 1 and 3a, this is a simple Web activity, calling the [Pause or Resume compute REST API for Azure Synapse](../sql-data-warehouse/sql-data-warehouse-manage-compute-rest-api.md#pause-compute)
        
        ![Resume dedicated SQL pool](./media/how-to-pause-resume-pipelines/true-condition-resume.png)
        
        
        The example here is to resume a dedicated SQL pool, invoking a POST request using the following call:
        
        ```HTTP
        POST https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Synapse/workspaces/{workspace-name}/sqlPools/{database-name}/resume?api-version=2019-06-01-preview HTTP/1.1
        ```
        
        You can parameterize the POST statement from above using the @concat string function:
        
        ```HTTP
        @concat('https://management.azure.com/subscriptions/',pipeline().parameters.SubscriptionID,'/resourceGroups/',pipeline().parameters.ResourceGroup,'/providers/Microsoft.Synapse/workspaces/',pipeline().parameters.WorkspaceName,'/sqlPools/',activity('CheckState').output.name,'/resume?api-version=2019-06-01-preview')
        ```
        
        In this case, we are using the activity 'Check State'.output.name with the names of the dedicated SQL pools from Step 3a that were passed to this activity through the Switch Condition. If you are using a single activity against a single database, you could embed the name of your dedicated SQL pool here, or use a parameter from the pipeline. For example, you could use the pipeline().parameters.DatabaseName.
        
        The POST request to pause a dedicated SQL pool is:
        
        ```HTTP
        POST https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Synapse/workspaces/{workspace-name}/sqlPools/{database-name}/pause?api-version=2019-06-01-preview HTTP/1.1    
        ```    
        
        The POST request can be parameterized using the @concat string function as shown:
    
        ```HTTP
        @concat('https://management.azure.com/subscriptions/',pipeline().parameters.SubscriptionID,'/resourceGroups/',pipeline().parameters.ResourceGroup,'/providers/Microsoft.Synapse/workspaces/',pipeline().parameters.WorkspaceName,'/sqlPools/',activity('CheckState').output.name,'/pause?api-version=2019-06-01-preview')
    ```

## Pipeline Run Output

When the full pipeline is run, you will see the output listed below. For the pipeline results below, the pipeline parameter named "ResourceGroup" was set to a single resource group that had one Synapse Workspace. the dedicated SQL pool was paused, so the job initiated a resume.

![Pipeline run output](./media/how-to-pause-resume-pipelines/pipeline-run-output.png)


## Next steps

Further details on Managed Identity for Azure Synapse, and how Managed Identity is added to your dedicated SQL pool can be found here:

[Azure Synapse workspace managed identity](../security/synapse-workspace-managed-identity.md)

[Grant permissions to workspace managed identity](../security/how-to-grant-workspace-managed-identity-permissions.md)

[SQL access control for Synapse pipeline runs](../security/how-to-set-up-access-control.md#step-73-sql-access-control-for-synapse-pipeline-runs)

