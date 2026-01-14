---
title: Create Pre-Maintenance and Post-Maintenance Events Using Azure Functions
description: In this tutorial, you learn how to create pre-maintenance and post-maintenance events by using Azure Functions.
ms.service: azure-update-manager
ms.date: 08/21/2025
ms.topic: tutorial 
author: habibaum
ms.author: v-uhabiba
ms.custom: sfi-image-nochange
# Customer intent: "As a cloud administrator, I want to create pre-maintenance and post-maintenance event triggers by using serverless functions, so that I can automate the starting and stopping of virtual machines during scheduled maintenance tasks."
---

# Tutorial: Create pre-maintenance and post-maintenance events by using Azure Functions

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs :heavy_check_mark: Azure Arc-enabled servers.

This tutorial explains how to create pre-maintenance and post-maintenance events to start and stop a virtual machine (VM) in a scheduled patch workflow by using Azure Functions.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a function app.
> - Create a function.
> - Create an event subscription.

[!INCLUDE [pre-post-prerequisites.md](includes/pre-post-prerequisites.md)]

## Create a function app

1. Follow the steps to [create a function app](../azure-functions/functions-create-function-app-portal.md#create-a-function-app).

1. Go to the resource and load the dependencies by using the following steps.

    > [!NOTE]
    > You have to load the dependencies only the first time. If the PowerShell dependencies are failing to load, check the latest versions of `Az` and `Az.ResourceGraph`.

    1. For **Function App**, select **App files**.
    1. Under **host.json**, set **ManagedDependecy** to **True** and select **requirements.psd1**.
    1. Under **requirements.psd1**, paste the following code:

        ```
        @{
        'Az'='12.*' 
        'Az.ResourceGraph'='1.0.0' 
        'Az.Resources'='6.*' 
        'ThreadJob' = '2.*'
        }
        ```

    1. Select **Save**.

1. Restart the function app from the **Overview** tab to load the dependencies that are mentioned in the **requirements.psd1** file.

## Create a function

1. After you create the function app, go to the resource, go to **Overview**, and then select **Create in Azure portal**.

1. On the **Create function** pane, make the following selections:

    1. Under **Select development environment**, for **Development environment**, select **Develop in portal**.
    1. Under **Select a template**, select **event grid**.
    1. Under **Template details**, for **New Function**, select the name. Then select **Create**.

       :::image type="content" source="./media/tutorial-using-functions/create-function.png" alt-text="Screenshot that shows selections for creating a function." lightbox="./media/tutorial-using-functions/create-function.png":::

1. On the **Event grid function** pane, select **Code+Test** from the left menu. Paste the following code, and then select **Save**.

    #### [Start VMs](#tab/script-vm-on)

    ``` 
    # Make sure that you're using eventGridEvent for parameter binding in the Azure function.
    param($eventGridEvent, $TriggerMetadata)
                
    Connect-AzAccount -Identity
                
    # Install the Resource Graph module from PowerShell Gallery
    # Install-Module -Name Az.ResourceGraph
                
    $maintenanceRunId = $eventGridEvent.data.CorrelationId
    $resourceSubscriptionIds = $eventGridEvent.data.ResourceSubscriptionIds
                
    if ($resourceSubscriptionIds.Count -eq 0) {
        Write-Output "Resource subscriptions are not present."
        break
    }
                
    Write-Output "Querying ARG to get machine details [MaintenanceRunId=$maintenanceRunId][ResourceSubscriptionIdsCount=$($resourceSubscriptionIds.Count)]"
                
    $argQuery = @"
        maintenanceresources 
        | where type =~ 'microsoft.maintenance/applyupdates'
        | where properties.correlationId =~ '$($maintenanceRunId)'
        | where id has '/providers/microsoft.compute/virtualmachines/'
        | project id, resourceId = tostring(properties.resourceId)
        | order by id asc
    "@
                
    Write-Output "Arg Query Used: $argQuery"
                
    $allMachines = [System.Collections.ArrayList]@()
    $skipToken = $null
                
    do
    {
        $res = Search-AzGraph -Query $argQuery -First 1000 -SkipToken $skipToken -Subscription $resourceSubscriptionIds
        $skipToken = $res.SkipToken
        $allMachines.AddRange($res.Data)
    } while ($skipToken -ne $null -and $skipToken.Length -ne 0)
    if ($allMachines.Count -eq 0) {
        Write-Output "No Machines were found."
        break
    }
                
    $jobIDs= New-Object System.Collections.Generic.List[System.Object]
    $startableStates = "stopped" , "stopping", "deallocated", "deallocating"
                
    $allMachines | ForEach-Object {
        $vmId =  $_.resourceId
                
        $split = $vmId -split "/";
        $subscriptionId = $split[2]; 
        $rg = $split[4];
        $name = $split[8];
                    
        Write-Output ("Subscription Id: " + $subscriptionId)
    
        $mute = Set-AzContext -Subscription $subscriptionId
        $vm = Get-AzVM -ResourceGroupName $rg -Name $name -Status -DefaultProfile $mute
    
        $state = ($vm.Statuses[1].DisplayStatus -split " ")[1]
        if($state -in $startableStates) {
            Write-Output "Starting '$($name)' ..."
                
            $newJob = Start-ThreadJob -ScriptBlock { param($resource, $vmname, $sub) $context = Set-AzContext -Subscription $sub; Start-AzVM -ResourceGroupName $resource -Name $vmname -DefaultProfile $context} -ArgumentList $rg, $name, $subscriptionId
            $jobIDs.Add($newJob.Id)
        } else {
            Write-Output ($name + ": no action taken. State: " + $state) 
        }
    }
    
    $jobsList = $jobIDs.ToArray()
    if ($jobsList)
    {
        Write-Output "Waiting for machines to finish starting..."
        Wait-Job -Id $jobsList
    }
    
    foreach($id in $jobsList)
    {
        $job = Get-Job -Id $id
        if ($job.Error)
        {
            Write-Output $job.Error
        }
    }
    ```

    #### [Stop VMs](#tab/script-vm-off)

    ``` 
    # Make sure that you're using eventGridEvent for parameter binding in the Azure function.
    param($eventGridEvent, $TriggerMetadata)
                
    Connect-AzAccount -Identity
                
    # Install the Resource Graph module from PowerShell Gallery
     Install-Module -Name Az.ResourceGraph
                
    $maintenanceRunId = $eventGridEvent.data.CorrelationId
    $resourceSubscriptionIds = $eventGridEvent.data.ResourceSubscriptionIds
    
    if ($resourceSubscriptionIds.Count -eq 0) {
        Write-Output "Resource subscriptions are not present."
        break
    }
                
    Start-Sleep -Seconds 30
    Write-Output "Querying ARG to get machine details [MaintenanceRunId=$maintenanceRunId][ResourceSubscriptionIdsCount=$($resourceSubscriptionIds.Count)]"
                
    $argQuery = @"
        maintenanceresources 
        | where type =~ 'microsoft.maintenance/applyupdates'
        | where properties.correlationId =~ '$($maintenanceRunId)'
        | where id has '/providers/microsoft.compute/virtualmachines/'
        | project id, resourceId = tostring(properties.resourceId)
        | order by id asc
    "@
                
    Write-Output "Arg Query Used: $argQuery"
                
    $allMachines = [System.Collections.ArrayList]@()
    $skipToken = $null
                
    do
    {
        $res = Search-AzGraph -Query $argQuery -First 1000 -SkipToken $skipToken -Subscription $resourceSubscriptionIds
        $skipToken = $res.SkipToken
        $allMachines.AddRange($res.Data)
    } while ($skipToken -ne $null -and $skipToken.Length -ne 0)
                
    if ($allMachines.Count -eq 0) {
        Write-Output "No Machines were found."
        break
    }
                
        $jobIDs= New-Object System.Collections.Generic.List[System.Object]
        $stoppableStates = "starting", "running"
                
        $allMachines | ForEach-Object {
        $vmId =  $_.resourceId
                
        $split = $vmId -split "/";
        $subscriptionId = $split[2]; 
        $rg = $split[4];
        $name = $split[8];
                
        Write-Output ("Subscription Id: " + $subscriptionId)
                
        $mute = Set-AzContext -Subscription $subscriptionId
        $vm = Get-AzVM -ResourceGroupName $rg -Name $name -Status -DefaultProfile $mute
                
        $state = ($vm.Statuses[1].DisplayStatus -split " ")[1]
    if($state -in $stoppableStates) {
        Write-Output "Stopping '$($name)' ..."
                
        $newJob = Start-ThreadJob -ScriptBlock { param($resource, $vmname, $sub) $context = Set-AzContext -Subscription $sub; Stop-AzVM -ResourceGroupName $resource -Name $vmname -Force -DefaultProfile $context} -ArgumentList $rg, $name, $subscriptionId
        $jobIDs.Add($newJob.Id)
        } else {
        Write-Output ($name + ": no action taken. State: " + $state) 
        }
    }
        $jobsList = $jobIDs.ToArray()
        if ($jobsList)
        {
        Write-Output "Waiting for machines to finish stop operation..."
        Wait-Job -Id $jobsList
        }
            
        foreach($id in $jobsList)
        {
        $job = Get-Job -Id $id
        if ($job.Error)
        {
        Write-Output $job.Error
        }
    }
    ```  

    #### [Cancel schedule](#tab/script-vm-cancel)

    ```
    Invoke-AzRestMethod `
    -Path "<Correlation ID from EventGrid Payload>?api-version=2023-09-01-preview" `
    -Payload 
    '{
    "properties": {
    "status": "Cancel"
    }
    }' `
    -Method PUT
        
    ```

    ---

1. On the left menu, select **Integration**. For **Trigger**, enter the **Event Trigger parameter name** value. Use the same parameter name given in the **Code+Test** window. In the example, the parameter is `eventGridEvent`.

   :::image type="content" source="./media/tutorial-using-functions/parameter-event-grid.png" alt-text="Screenshot that shows the entry of a parameter name for an event trigger." lightbox="./media/tutorial-using-functions/parameter-event-grid.png":::

1. Select **Save**.

## Create an event subscription

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.

1. Under **Manage**, select **Machines** > **Maintenance Configuration**.

1. On the **Maintenance Configuration** pane, select the configuration.

1. Under **Settings**, select **Events**.

1. Select **+Event Subscription** to create a pre-maintenance or post-maintenance event.

1. On the **Create Event Subscription** pane, in the **Event Subscription Details** section, provide an appropriate name. Keep the schema as **Event Grid Schema**.

1. In the **Event Types** section, for **Filter to Event Types**, select **Pre Maintenance Event** or **Post Maintenance Event**.

1. In the **Endpoint Details** section, select the **Azure Function** endpoint, and then select **Configure an endpoint**.

1. Provide the appropriate details, such as the resource group and the function app to trigger the event.

1. Select **Create**.

You can also use Azure Storage accounts and an event hub to store, send, and receive events. For more information, see the quickstarts on [creating a queue in Azure Storage](/azure/storage/queues/storage-quickstart-queues-portal) and [creating an event hub](../event-hubs/event-hubs-create.md) by using the Azure portal.

## Related content

- Get an [overview of pre-maintenance and post-maintenance events in Azure Update Manager](pre-post-scripts-overview.md).
- Learn more about [how to create pre-maintenance and post-maintenance events](pre-post-events-schedule-maintenance-configuration.md).
- Learn [how to manage pre-maintenance and post-maintenance events or to cancel a scheduled run](manage-pre-post-events.md).
- Learn [how to create pre-maintenance and post-maintenance events by using a webhook with Automation runbooks](tutorial-webhooks-using-runbooks.md).
