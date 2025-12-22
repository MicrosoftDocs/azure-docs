---
title: Create Pre-Maintenance and Post-Maintenance Events Using a Webhook with Runbooks
description: In this tutorial, you learn how to create pre-maintenance and post-maintenance events by using a webhook with Azure Automation runbooks.
ms.service: azure-update-manager
ms.date: 08/21/2025
ms.topic: tutorial 
author: habibaum
ms.author: v-uhabiba
ms.custom: sfi-image-nochange
# Customer intent: As an IT administrator, I want to implement pre-maintenance and post-maintenance event webhooks with Automation runbooks, so that I can manage VM operations effectively during scheduled patching processes.
---

# Tutorial: Create pre-maintenance and post-maintenance events by using a webhook with Automation runbooks

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs :heavy_check_mark: Azure Arc-enabled servers.

You can use pre-maintenance and post-maintenance events to execute user-defined actions before and after scheduled patch installation. One of the most common scenarios is to start and stop a virtual machine (VM). With pre-maintenance events, you can run a script to start the VM before initiating the scheduled patching process. After the scheduled patching is complete and the server is rebooted, you can run a script to safely shut down the VM.

This tutorial explains how to create pre-maintenance and post-maintenance events to start and stop a VM in a scheduled patch workflow by using a webhook.

In this tutorial, you:

> [!div class="checklist"]
>
> - Create and publish an Azure Automation runbook.
> - Add webhooks.
> - Create an event subscription.

[!INCLUDE [pre-post-prerequisites.md](includes/pre-post-prerequisites.md)]

## Create and publish an Automation runbook

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your **Azure Automation** account.

1. [Create](../automation/manage-runbooks.md#create-a-runbook) and [publish](../automation/manage-runbooks.md#publish-a-runbook) an Automation runbook.

1. If you used runbooks for [pre-maintenance and post-maintenance tasks](../automation/update-management/pre-post-scripts.md) in Azure Automation Update Management, it's critical that you use the following steps to avoid an unexpected impact to your machines and failed maintenance runs:

    1. For your runbooks, parse the webhook payload to ensure that it's triggering on `Microsoft.Maintenance.PreMaintenanceEvent` or `Microsoft.Maintenance.PostMaintenanceEvent` events only. By design, webhooks are triggered on other subscription events if any other event is added with the same endpoint.
       - See the [Azure Event Grid event schema](../event-grid/event-schema.md).
       - See the [Event Grid schema specific to maintenance configurations](../event-grid/event-schema-maintenance-configuration.md).
       - See the following code:

         ```powershell
         param 
         (  
           [Parameter(Mandatory=$false)]  
           [object] $WebhookData  
      
         )  
         $notificationPayload = ConvertFrom-Json -InputObject $WebhookData.RequestBody  
         $eventType = $notificationPayload[0].eventType  
      
         if ($eventType -ne "Microsoft.Maintenance.PreMaintenanceEvent" -and $eventType –ne "Microsoft.Maintenance.PostMaintenanceEvent" ) {  
          Write-Output "Webhook not triggered as part of pre or post patching for maintenance run"  
         return  
         } 
         ```

    1. The [SoftwareUpdateConfigurationRunContext](../automation/update-management/pre-post-scripts.md#softwareupdateconfigurationruncontext-properties) parameter contains information about lists of machines in the update deployment. It won't be passed to the scripts when you use them for pre-maintenance or post-maintenance events while using an Automation webhook. You can either query the list of machines from Azure Resource Graph or have the list of machines coded in the scripts.

       - Ensure that proper roles and permissions are granted to the managed identities that you're using in the script, to execute Resource Graph queries and to start or stop machines.
       - See the permissions related to [Resource Graph queries](../governance/resource-graph/overview.md#permissions-in-azure-resource-graph).
       - See the [Virtual Machine Contributor role](../role-based-access-control/built-in-roles/compute.md#virtual-machine-contributor).
       - See the [webhook payload](../automation/automation-webhooks.md#parameters-used-when-the-webhook-starts-a-runbook).
       - See the following code:

         ```powershell
         param   
         (   
             [Parameter(Mandatory=$false)]   
             [object] $WebhookData   
         )   
         
         Connect-AzAccount -Identity   
        
         # Install the Resource Graph module from PowerShell Gallery   
         # Install-Module -Name Az.ResourceGraph   
   
         $notificationPayload = ConvertFrom-Json -InputObject $WebhookData.RequestBody   
         $maintenanceRunId = $notificationPayload[0].data.CorrelationId   
         $resourceSubscriptionIds = $notificationPayload[0].data.ResourceSubscriptionIds   
        
         if ($resourceSubscriptionIds.Count -gt 0) {    

             Write-Output "Querying ARG to get machine details[MaintenanceRunId=$maintenanceRunId][ResourceSubscriptionIdsCount=$($resourceSubscriptionIds.Count)]"    
             $argQuery = @"maintenanceresources     
             | where type =~ 'microsoft.maintenance/applyupdates'    
             | where properties.correlationId =~ '$($maintenanceRunId)'  
             | where id has '/providers/microsoft.compute/virtualmachines/'    
             | project id, resourceId = tostring(properties.resourceId)    
             | order by id asc 
         "@  
          
         Write-Output "Arg Query Used: $argQuery"    
         $allMachines = [System.Collections.ArrayList]@()    
         $skipToken = $null     
         $res = Search-AzGraph -Query $argQuery -First 1000 -SkipToken $skipToken -Subscription $resourceSubscriptionIds    
         $skipToken = $res.SkipToken    
         $allMachines.AddRange($res.Data)    
         } while ($skipToken -ne $null -and $skipToken.Length -ne 0)  
  
         if ($allMachines.Count -eq 0) {    
         Write-Output "No Machines were found."    
         break    
         }
         }
         ```

To customize, you can either use your existing scripts with the preceding modifications or use the following scripts.

### Sample scripts

#### [Start VMs](#tab/script-on)

```powershell
param 
( 
    [Parameter(Mandatory=$false)] 
    [object] $WebhookData 
) 
Connect-AzAccount -Identity 

# Install the Resource Graph module from PowerShell Gallery 
# Install-Module -Name Az.ResourceGraph 

$notificationPayload = ConvertFrom-Json -InputObject $WebhookData.RequestBody 
$eventType = $notificationPayload[0].eventType 

if ($eventType -ne "Microsoft.Maintenance.PreMaintenanceEvent") { 
    Write-Output "Webhook not triggered as part of pre-patching for maintenance run" 
    return 
} 

$maintenanceRunId = $notificationPayload[0].data.CorrelationId 
$resourceSubscriptionIds = $notificationPayload[0].data.ResourceSubscriptionIds 

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

#### [Stop VMs](#tab/script-off)

```powershell
param 
( 
    [Parameter(Mandatory=$false)] 
    [object] $WebhookData 
) 
Connect-AzAccount -Identity 

# Install the Resource Graph module from PowerShell Gallery 
# Install-Module -Name Az.ResourceGraph 
$notificationPayload = ConvertFrom-Json -InputObject $WebhookData.RequestBody 
$eventType = $notificationPayload[0].eventType 

if ($eventType -ne "Microsoft.Maintenance.PostMaintenanceEvent") { 
    Write-Output "Webhook not triggered as part of post-patching for maintenance run" 
    return 
} 

$maintenanceRunId = $notificationPayload[0].data.CorrelationId 
$resourceSubscriptionIds = $notificationPayload[0].data.ResourceSubscriptionIds 

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

#### [Cancel a schedule](#tab/script-cancel)

```powershell
param 
( 
    [Parameter(Mandatory=$false)] 
    [object] $WebhookData 
)
Connect-AzAccount -Identity 

# Install the Resource Graph module from PowerShell Gallery 
# Install-Module -Name Az.ResourceGraph
$notificationPayload = ConvertFrom-Json -InputObject $WebhookData.RequestBody
$maintenanceRunId = $notificationPayload[0].data.CorrelationId

Invoke-AzRestMethod ` 
-Path "$maintenanceRunId`?api-version=2023-09-01-preview" ` 
-Payload  
'{ 
    "properties": { 
    "status": "Cancel" 
    } 
      }' ` 
-Method PUT 
```

---

## Add webhooks

[Add webhooks](../automation/automation-webhooks.md#create-a-webhook) to the preceding published runbooks and copy the webhook URLs.

> [!NOTE]
> Be sure to copy the URL after you create a webhook. You can't retrieve the URL again.

## Create an event subscription

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.

1. Under **Manage**, select **Machines** > **Maintenance Configuration**.

1. On the **Maintenance Configuration** pane, select the configuration.

1. Under **Settings**, select **Events**.

    :::image type="content" source="./media/tutorial-webhooks-using-runbooks/pre-post-select-events.png" alt-text="Screenshot that shows the menu option for events." lightbox="./media/tutorial-webhooks-using-runbooks/pre-post-select-events.png":::

1. Select **+Event Subscription** to create a pre-maintenance or post-maintenance event.

    :::image type="content" source="./media/tutorial-webhooks-using-runbooks/select-event-subscriptions.png" alt-text="Screenshot that shows event subscriptions with the option to create an event subscription." lightbox="./media/tutorial-webhooks-using-runbooks/select-event-subscriptions.png":::

1. On the **Create Event Subscription** pane, in the **Event Subscription Details** section, provide an appropriate name. Keep the schema as **Event Grid Schema**.

1. In the **Event Types** section, for **Filter to Event Types**, select **Pre Maintenance Event** or **Post Maintenance Event**.

1. In the **Endpoint Details** section, select the **Web Hook** endpoint, and then select **Configure an endpoint**.

1. Provide the appropriate details, such as the pre-maintenance or post-maintenance event's webhook URL to trigger the event.

    :::image type="content" source="./media/tutorial-webhooks-using-runbooks/create-event-subscription.png" alt-text="Screenshot that shows the options to create event subscriptions." lightbox="./media/tutorial-webhooks-using-runbooks/create-event-subscription.png":::

1. Select **Create**.

## Related content

- Get an [overview of pre-maintenance and post-maintenance events in Azure Update Manager](pre-post-scripts-overview.md).
- Learn more about [how to create pre-maintenance and post-maintenance events](pre-post-events-schedule-maintenance-configuration.md).
- Learn [how to manage pre-maintenance and post-maintenance events or to cancel a scheduled run](manage-pre-post-events.md).
- Learn [how to create pre-maintenance and post-maintenance events by using Azure Functions](tutorial-using-functions.md).
