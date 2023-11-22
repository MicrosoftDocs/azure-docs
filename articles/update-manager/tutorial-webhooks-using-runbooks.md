---
title: Create pre and post events using a webhook with Automation runbooks.
description: In this tutorial, you learn how to create the pre and post events using webhook with Automation runbooks.
ms.service: azure-update-manager
ms.date: 11/12/2023
ms.topic: tutorial 
author: SnehaSudhirG
ms.author: sudhirsneha
#Customer intent: As an IT admin, I want  create pre and post events using a webhook with Automation runbooks.
---

# Tutorial: Create pre and post events using a webhook with Automation

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs :heavy_check_mark: Azure Arc-enabled servers.
 
Pre and post events, also known as pre/post-scripts, allow you to execute user-defined actions before and after the schedule patch installation. One of the most common scenarios is to start and stop a VM. With pre-events, you can run a prepatching script to start the VM before initiating the schedule patching process. Once the schedule patching is complete, and the server is rebooted, a post-patching script can be executed to safely shut down the VM

This tutorial explains how to create pre and post events to start and stop a VM in a schedule patch workflow using a webhook.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create and publish Automation runbook
> - Add webhooks
> - Create an event subscription


## Create and publish Automation runbook

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your **Azure Automation** account.
1. [Create](../automation/manage-runbooks.md#create-a-runbook) and [Publish](../automation/manage-runbooks.md#publish-a-runbook) an Automation runbook. 
1. To customize, you can use either your existing script or use the following sample scripts.

### Sample scripts

#### [Start VMs](#tab/script-on)

```
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

```
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
---

## Add webhooks

[Add webhooks](../automation/automation-webhooks.md#create-a-webhook) to the above published runbooks and copy the webhooks URLs. 

> [!NOTE]
> Ensure to copy the URL after you create a webhook as you cannot retrieve the URL again.
 
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
           - In the **Endpoint details** section, select the **Webhook** endpoint and select **Configure and Endpoint**.
           - Provide the appropriate details such as pre-event webhook **URL** to trigger the event.
        1. Select **Post Maintenance Event** for a post-event.
            - In the **Endpoint details** section, the **Webhook** endpoint and select **Configure and Endpoint**.
            - Provide the appropriate details such as post-event webhook **URL** to trigger the event.
1. Select **Create**.

## Next steps
Learn about [managing multiple machines](manage-multiple-machines.md).
 
