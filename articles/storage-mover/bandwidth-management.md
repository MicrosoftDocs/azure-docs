---
title: How to schedule bandwidth consumption of the Storage Mover agent
description: Learn how to set bandwidth schedules that limit the use of the WAN link for a Storage Mover agent
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 07/02/2022
---

# Manage network bandwidth of a Storage Mover agent

In this article, you learn how to set bandwidth management schedules for your Storage Mover agents.

When migrating your files and folders to Azure, you need to carefully consider the upload bandwidth you want to make available to each of your Storage Mover agents. Other workloads may also depend on having sufficient bandwidth available. To make your Storage Mover agents a good neighbor to other workloads in your network, you can schedule limits for each agent.

## Prerequisites

Before you can set a bandwidth schedule, you first need to [deploy a Storage Mover resource](storage-mover-create.md) in one of your resource groups, and then [register an agent](agent-register.md). Bandwidth limit schedules are set and stored per registered agent.

## Understanding the basic concept of bandwidth management

A schedule is an attribute of a registered server. In the portal, you can set and change this schedule on the registered agents page, found in your Storage Mover resource.

A bandwidth management schedule describes time windows throughout a week, during which you can set a limit on how much upload bandwidth a Storage Mover agent is allowed to use. 

:::image type="content" source="media/bandwidth-management/bandwidth-full-schedule-small.png" alt-text="Azure portal dialog showing a calendar, similar to Outlook, with scheduled bandwidth limitation windows." lightbox="media/bandwidth-management/bandwidth-full-schedule.png":::

This schedule looks a lot like a calendar in outlook, but there are a few important differences:

- The schedule is repeating itself. It has the seven weekdays and at the end of the week, the schedule repeats.
- An entry in the schedule is a designated limit the agent shall not exceed. Clear time stretches on a day designate no limitation, allowing the agent to use as much bandwidth as needed.
- You can't schedule a limit for a specific date, but for repeating weekdays. As an example, you can say: *"Limit the agent's bandwidth to no more than x during my cloud backup window on Sundays"*
- The schedule doesn't store a timezone. When you set a limit that starts for instance at 9am, then that means agent-local time. You can see what timezone is configured for the agent. Pay close attention, the agent's timezone may be different from the timezone of your site where the agent is deployed.

## Enabling or changing a bandwidth management schedule

Using the Azure portal, you can enable a bandwidth schedule on a registered agent resource. 
   1. With the portal showing your Storage Mover resource, select the "*Registered agents*" in the menu on the left.
   1. You now have two options to set or view a schedule. You can find the column "*Bandwidth management*" and click on the link for your selected agent. Or, you can select the checkbox in front of your agent. That enables and a command button above the list of agents, labeled "*Manage bandwidth limit*". 
      :::image type="content" source="media/bandwidth-management/bandwidth-registered-agents-command-small.png" alt-text="Azure portal, registered agents blade, showing to select and agent and then select the Bandwidth Management command." lightbox="media/bandwidth-management/bandwidth-registered-agents-command.png":::
   1. The bandwidth management window opens and displays the schedule currently in effect for the agent. When an empty schedule is shown, there are no bandwidth limitations defined for this agent.


## Setting a bandwidth limit

1. Open the bandwidth scheduling window. ([see previous section](#enabling-or-changing-a-bandwidth-management-schedule))
1. You can create a custom schedule for this selected agent, or you can [reuse a schedule](#reusing-a-schedule-from-another-agent) that was previously created for another agent.
1. To create a custom schedule, select the "Add limit" command. A dialog opens, allowing you to define a time slice during which you want to set the maximum bandwidth on your WAN link, that the agent is allowed to use.
   :::image type="content" source="media/bandwidth-management/bandwidth-add-limit.png" alt-text="An Azure portal dialog showing the inputs to set a limit for a custom time period.":::
1. The dialog requires you to set a start and an end-time during which you want to apply an uplink limit for the agent. You can then pick on which days of the week you like to apply your new limit. Select all weekdays during which you like to apply the same limit. You then need to specify the limit in Mbps (Megabits per second). Overlapping times aren't allowed. Any limit you set, applies at the displayed time in the agent's timezone. You can find the agent's timezone displayed at the top of the bandwidth management window. You may need to offset your schedule or adjust the agent's timezone. Find more details in the paragraph: "[Reusing a schedule from another agent](#reusing-a-schedule-from-another-agent)".
1. To apply your changes to this agent, select the "*Save*" button at the bottom of the "*Bandwidth management*" window.

> [!NOTE]
> The bandwidth limit you set limits the *migration data stream* the agent will establish to your target storage in Azure. However, in addition to this data stream, there is control plane traffic from the agent to Azure. Control messages, progress telemetry, and copy logs generally require only a small amount of bandwidth. To ensure proper functionality of the agent throughout your migration, the control plane of the agent is not governed by the limit schedule you set. In an extreme case the agent may exceed the limits you defined by a small amount.

## Changing or deleting a bandwidth limit

Open the bandwidth management schedule for your selected agent. ([see previous section](#enabling-or-changing-a-bandwidth-management-schedule))

If you like to edit or delete a specific limit, select the limit and the "*Edit limit*" dialog opens. You can adjust the time slot or delete the limit. There are no bulk-editing options, so you must edit every limit on every weekday individually.

If your goal is to disable bandwidth management altogether for the agent, select the "Clear all limits" command.

Don't forget to apply your changes to this agent. Select the "*Save*" button at the bottom of the "*Bandwidth management*" window.


## Reusing a schedule from another agent
You can reuse the bandwidth limit schedule from another agent. 

1. Open the bandwidth management schedule for your selected agent. ([See the previous paragraph.](#enabling-or-changing-a-bandwidth-management-schedule))
1. Select the command "*Import limits from other agents*" and select the agent you like to copy the schedule from. If there are no agents in the list, then there's no other agent that has a schedule set.
   > [!WARNING]
   > Using this option will overwrite the currently configured schedule for this agent.
1. Optionally, you can now modify this copied schedule.
1. To apply your changes to this agent, select the "*Save*" button at the bottom of the "*Bandwidth management*" window.

> [!IMPORTANT]
> Schedules are stored free of a timezone. That enables them to be reused on other agents. A scheduled limit will be in effect during this time in whatever the agent's timezone is. You need to ensure that you offset your bandwidth management schedule if the agent's timezone is different to the one used in the location you've deployed the agent in. For example, if the agent's timezone is UTC but your agent is actually deployed in the Pacific timezone (PST), you need to offset your schedule by -7 hours or adjust your agent's timezone to the correct one for the location. Alternatively, you can adjust the agent's timezone to the correct one for the location. Doing this removes the need to offset your schedule and also enables your schedule to automatically adjust to Daylight Savings, should your timezone observe that.

## Use PowerShell to configure a bandwidth limit schedule
<!-- ########################################################
Add all cmdlets - better to have them in one place.
########################################################-->

### Prepare your Azure PowerShell environment 

[!INCLUDE [azure-powershell-requirements-no-header.md](~/includes/azure-powershell-requirements-no-header.md)]

If you haven't yet installed the `Az.StorageMover` module:

```powershell
## Ensure you are running the latest version of PowerShell 7
$PSVersionTable.PSVersion

## Your local execution policy must be set to at least remote signed or less restrictive
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

## If you don't have the general Az PowerShell module, install it first
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force

## Lastly, the Az.StorageMover module is not installed by default and must be manually requested.
Install-Module -Name Az.StorageMover -Scope CurrentUser -Repository PSGallery -Force

```
### Manage a bandwidth limit schedule


```powershell
      
## Set variables
$subscriptionID        = "Your subscription ID"
$resourceGroupName     = "Your resource group name"
$storageMoverName      = "Your storage mover resource name"
$registeredAgentName   = "Name of the agent, registered to your storage mover resource"

## Log into Azure with your Azure credentials
Connect-AzAccount -SubscriptionId $subscriptionID # -DeviceLogin #Leverage DeviceLogin if you need to authenticate your PowerShell session from another machine. # -TenantID #In some environments you may you need to specify the EntraID tenant to authenticate against.

#------------
# GET the schedule configured on an agent:
$schedule = (Get-AzStorageMoverAgent -ResourceGroupName $resourceGroupName -StorageMoverName $storageMoverName -AgentName registeredAgentName).UploadLimitScheduleWeeklyRecurrence[0]
# $schedule then contains a JSON structure with elements for each configured time windows and the upload limit in Mbps that applies during this window.

#------------
# SET a new bandwidth limitation window on Monday and Tuesday:
$timeblock = New-AzStorageMoverUploadLimitWeeklyRecurrenceObject `
    -Day ["Monday", "Tuesday"] ` #Mandatory. An array, limited to the English names of all 7 days, Monday through Sunday in any order.
    -LimitInMbps 900 ` # Mandatory. limit in "Mega bits per second"
    -StartTimeHour 5 ` # Mandatory. 24-hour clock: 5  = 5am
    -EndTimeHour 17 `  # Mandatory. 24-hour clock: 17 = 5pm
    -EndTimeMinute 30  # Optional. Time blocks are precise to 30 Minutes. -EndTimeMinute 0 is equivalent to omitting the parameter. The only other acceptable value is the half hour mark: 30. 

TODO:
I need to see how to add a single new time block to an empty or existing schedule.
I need to see the best method of editing a schedule.
I need to see how I can delete a schedule.

I would like to document the JSON schema through an annotated example schedule.

```


## Next steps

Advance to one of the next articles to learn how to deploy a Storage Mover agent or create a migration project.
> [!div class="nextstepaction"]
> [Create a migration project](project-manage.md)

> [!div class="nextstepaction"]
> [Create a migration job](job-definition-create.md)