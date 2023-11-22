---
title: Create pre and post events using Azure Functions.
description: In this tutorial, you learn how to create the pre and post events using Azure Functions.
ms.service: azure-update-manager
ms.date: 11/21/2023
ms.topic: tutorial 
author: SnehaSudhirG
ms.author: sudhirsneha
#Customer intent: As an IT admin, I want  create pre and post events using Azure Functions.
---

# Tutorial: Create pre and post events using Azure Functions

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs :heavy_check_mark: Azure Arc-enabled servers.
 

This tutorial explains how to create pre and post events to start and stop a VM in a schedule patch workflow using Azure Functions.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Prerequisites
> - Create a function app
> - Create a function
> - Create an event subscription

[!INCLUDE [pre-post-prerequisites.md](includes/pre-post-prerequisites.md)]

## Create a function app

1. Follow the steps to [Create a function app](../azure-functions/functions-create-function-app-portal.md#create-a-function-app). 

1. After you create the function app, Go to resource, ensure that you load the dependencies by following these steps:

    > [!NOTE]
    > You have to load the dependencies only for the first time.

    1. On the **Function App**, select **App files**.
    1. Under the **host.json**, enable **ManagedDependecy** to **True** and select **requirments.psd1**.
    1. Under the **requirements.psd1**, paste the following code: 
    
        ```
        #This file enables modules to be automatically managed by the Functions service. 
        # See
        https://aka.ms/functionsmanageddependency for additional information. 
        # 
        @{ 
        #For latest supported version, go to '
        https://www.powershellgallery.com/packages/Az'.
        Uncomment the next line and replace the MAJOR_VERSION, e.g., 'Az'='5.*' 
        'Az'='5.*' 
        'Az.ResourceGraph'='0.13.0' 
        'Az.Resources'='6.*' 
        'ThreadJob' = '2.*'
        }
        ```
    1. Select **Save**.
       
1. Restart the function app from the **Overview** tab to load the dependencies that are mentioned in the **requirments.psd1** file.

## Create a function

1. After you create the function app, go to **Resource**, and in **Overview**, select **Create in Azure portal**.
1. In the **Create function** window, make the following selections:
    1. For the **Development environment property**, select *Develop in portal* 
    1. In **Select a template**, select *Event Grid*.
    1. In **Template details**, enter the name in **New Function** and then select **Create**.
       :::image type="content" source="./media/tutorial-using-functions/create-function.png" alt-text="Screenshot that shows the options to select while creating a function." lightbox="./media/tutorial-using-functions/create-function.png"::: 

1. In the **Event grid function**, select **Code+Test** from the left menu, paste the following code and select **Save**.

   #### [Start VMs](#tab/script-vm-on)    
   ``` 
      # Make sure that we are using eventGridEvent for parameter binding in Azure function.
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
      # Make sure that we are using eventGridEvent for parameter binding in Azure function.
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

1. Select **Integration** from the left menu and edit the **Event Trigger parameter name** under **Trigger**. Use the same parameter name given in the **Code+Test** window. In the example, the parameter is pre-Event. 

1. Select **Save**

## Create an Event subscription 

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configuration**.
1. On the **Maintenance Configuration** page, select the configuration. 
1. Under **Settings**, select **Events**. 
1. Select **+Event Subscription** to create a pre/post maintenance event.
1. On the **Create Event Subscription** page, enter the following details:
    1. In the **Event Subscription Details** section, provide an appropriate name. 
    1. Keep the schema as **Event Grid Schema**.
    1. In the **Event Types** section, **Filter to Event Types**. 
        1. Select **Pre Maintenance Event** for a pre-event.
           - In the **Endpoint details** section, select the **Azure Function** endpoint and select **Configure and Endpoint**.
           - Provide the appropriate details such as Resource groups, function app to trigger the event.
        1. Select **Post Maintenance Event** for a post-event.
            - In the **Endpoint details** section, the **Azure Function** endpoint and select **Configure and Endpoint**.
            - Provide the appropriate details such as **Resource group**, **Function app** to trigger the event.
1. Select **Create**.

You can also use Azure Storage accounts and Event hub to store, send, and receive events. Learn more on [how to create Event hub](../event-hubs/event-hubs-create.md) and [Storage queues](../event-hubs/event-hubs-create.md).

## Next steps
Learn about [managing multiple machines](manage-multiple-machines.md).
 
