---
title: Azure Automation Start/Stop VMs during off-hours overview
description: This article describes the Start/Stop VMs during off-hours feature, which starts or stops VMs on a schedule and proactively monitor them from Azure Monitor Logs.
services: automation
ms.subservice: process-automation
ms.date: 03/16/2023
ms.topic: conceptual 
ms.custom: engagement-fy23
---

# Start/Stop VMs during off-hours overview

> [!NOTE]
> Start/Stop VM during off-hours version 1 is unavailable in the marketplace now as it will retire by 30 September 2023. We recommend you start using [version 2](../azure-functions/start-stop-vms/overview.md) which is now generally available. The new version offers all existing capabilities and provides new features, such as multi-subscription support from a single Start/Stop instance. If you have the version 1 solution already deployed, you can still use the feature, and we will provide support until 30 September 2023. The details of the announcement will be shared soon. 

The Start/Stop VMs during off-hours feature start or stops enabled Azure VMs. It starts or stops machines on user-defined schedules, provides insights through Azure Monitor logs, and sends optional emails by using [action groups](../azure-monitor/alerts/action-groups.md). The feature can be enabled on both Azure Resource Manager and classic VMs for most scenarios.

This feature uses [Start-AzVm](/powershell/module/az.compute/start-azvm) cmdlet to start VMs. It uses [Stop-AzVM](/powershell/module/az.compute/stop-azvm) for stopping VMs.

> [!NOTE]
> Start/Stop VMs during off-hours has been updated to support the newest versions of the Azure modules that are available. The updated version of this feature, available in the Marketplace, doesn’t support AzureRM modules because we have migrated from AzureRM to Az modules. While the runbooks have been updated to use the new Azure Az module cmdlets, they use the AzureRM prefix alias.

The feature provides a decentralized low-cost automation option for users who want to optimize their VM costs. You can use the feature to:

- [Schedule VMs to start and stop](automation-solution-vm-management-config.md#schedule).
- Schedule VMs to start and stop in ascending order by [using Azure Tags](automation-solution-vm-management-config.md#tags). This activity is not supported for classic VMs.
- Autostop VMs based on [low CPU usage](automation-solution-vm-management-config.md#cpuutil).

The following are limitations with the current feature:

- It manages VMs in any region, but can only be used in the same subscription as your Azure Automation account.
- It is available in Azure and Azure Government for any region that supports a Log Analytics workspace, an Azure Automation account, and alerts. Azure Government regions currently don't support email functionality.

## Permissions

You must have certain permissions to enable VMs for the Start/Stop VMs during off-hours feature. The permissions are different depending on whether the feature uses a pre-created Automation account and Log Analytics workspace or creates a new account and workspace.

You don't need to configure permissions if you're a Contributor on the subscription and a Global Administrator in your Azure Active Directory (AD) tenant. If you don't have these rights or need to configure a custom role, make sure that you have the permissions described below.

### Permissions for pre-existing Automation account and Log Analytics workspace

To enable VMs for the Start/Stop VMs during off-hours feature using an existing Automation account and Log Analytics workspace, you need the following permissions on the Resource Group scope. To learn more about roles, see [Azure custom roles](../role-based-access-control/custom-roles.md).

| Permission | Scope|
| --- | --- |
| Microsoft.Automation/automationAccounts/read | Resource Group |
| Microsoft.Automation/automationAccounts/variables/write | Resource Group |
| Microsoft.Automation/automationAccounts/schedules/write | Resource Group |
| Microsoft.Automation/automationAccounts/runbooks/write | Resource Group |
| Microsoft.Automation/automationAccounts/connections/write | Resource Group |
| Microsoft.Automation/automationAccounts/certificates/write | Resource Group |
| Microsoft.Automation/automationAccounts/modules/write | Resource Group |
| Microsoft.Automation/automationAccounts/modules/read | Resource Group |
| Microsoft.automation/automationAccounts/jobSchedules/write | Resource Group |
| Microsoft.Automation/automationAccounts/jobs/write | Resource Group |
| Microsoft.Automation/automationAccounts/jobs/read | Resource Group |
| Microsoft.OperationsManagement/solutions/write | Resource Group |
| Microsoft.OperationalInsights/workspaces/* | Resource Group |
| Microsoft.Insights/diagnosticSettings/write | Resource Group |
| Microsoft.Insights/ActionGroups/Write | Resource Group |
| Microsoft.Insights/ActionGroups/read | Resource Group |
| Microsoft.Resources/subscriptions/resourceGroups/read | Resource Group |
| Microsoft.Resources/deployments/* | Resource Group |

## Components for version 1

The Start/Stop VMs during off-hours feature include preconfigured runbooks, schedules, and integration with Azure Monitor Logs. You can use these elements to tailor the startup and shutdown of your VMs to suit your business needs.

### Runbooks for version 1

The following table lists the runbooks that the feature deploys to your Automation account. Do NOT make changes to the runbook code. Instead, write your own runbook for new functionality.

> [!IMPORTANT]
> Don't directly run any runbook with **child** appended to its name.

All parent runbooks include the `WhatIf` parameter. When set to True, the parameter supports detailing the exact behavior the runbook takes when run without the parameter and validates that the correct VMs are targeted. A runbook only performs its defined actions when the `WhatIf` parameter is set to False.

|Runbook | Parameters | Description|
| --- | --- | ---|
|AutoStop_CreateAlert_Child | VMObject <br> AlertAction <br> WebHookURI | Called from the parent runbook. This runbook creates alerts on a per-resource basis for the Auto-Stop scenario.|
|AutoStop_CreateAlert_Parent | VMList<br> WhatIf: True or False  | Creates or updates Azure alert rules on VMs in the targeted subscription or resource groups. <br> `VMList` is a comma-separated list of VMs (with no whitespaces), for example, `vm1,vm2,vm3`.<br> `WhatIf` enables validation of runbook logic without executing.|
|AutoStop_Disable | None | Disables Auto-Stop alerts and default schedule.|
|AutoStop_VM_Child | WebHookData | Called from the parent runbook. Alert rules call this runbook to stop a classic VM.|
|AutoStop_VM_Child_ARM | WebHookData |Called from the parent runbook. Alert rules call this runbook to stop a VM.  |
|ScheduledStartStop_Base_Classic | CloudServiceName<br> Action: Start or Stop<br> VMList  | Performs action start or stop in classic VM group by Cloud Services. |
|ScheduledStartStop_Child | VMName <br> Action: Start or Stop <br> ResourceGroupName | Called from the parent runbook. Executes a start or stop action for the scheduled stop.|
|ScheduledStartStop_Child_Classic | VMName<br> Action: Start or Stop<br> ResourceGroupName | Called from the parent runbook. Executes a start or stop action for the scheduled stop for classic VMs. |
|ScheduledStartStop_Parent | Action: Start or Stop <br>VMList <br> WhatIf: True or False | Starts or stops all VMs in the subscription. Edit the variables `External_Start_ResourceGroupNames` and `External_Stop_ResourceGroupNames` to only execute on these targeted resource groups. You can also exclude specific VMs by updating the `External_ExcludeVMNames` variable.|
|SequencedStartStop_Parent | Action: Start or Stop <br> WhatIf: True or False<br>VMList| Creates tags named **sequencestart** and **sequencestop** on each VM for which you want to sequence start/stop activity. These tag names are case-sensitive. The value of the tag should be a list of positive integers, for example, `1,2,3`, that corresponds to the order in which you want to start or stop. <br>**Note**: VMs must be within resource groups defined in `External_Start_ResourceGroupNames`, `External_Stop_ResourceGroupNames`, and `External_ExcludeVMNames` variables. They must have the appropriate tags for actions to take effect.|


### Variables for version 1

The following table lists the variables created in your Automation account. Only modify variables prefixed with `External`. Modifying variables prefixed with `Internal` causes undesirable effects.

> [!NOTE]
> Limitations on VM name and resource group are largely a result of variable size. See [Variable assets in Azure Automation](./shared-resources/variables.md).

>[!NOTE]
>For the variable `External_WaitTimeForVMRetryInSeconds`, the default value has been updated from 600 to 2100.

Across all scenarios, the variables `External_Start_ResourceGroupNames`,  `External_Stop_ResourceGroupNames`, and `External_ExcludeVMNames` are necessary for targeting VMs, except for the comma-separated VM lists for the **AutoStop_CreateAlert_Parent**, **SequencedStartStop_Parent**, and **ScheduledStartStop_Parent** runbooks. That is, your VMs must belong to target resource groups for start and stop actions to occur. The logic works similar to Azure Policy, in that you can target the subscription or resource group and have actions inherited by newly created VMs. This approach avoids having to maintain a separate schedule for every VM and manage starts and stops in scale.

### Schedules for version 1

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## View the feature for version 1

Use one of the following mechanisms to access the enabled feature:

* From your Automation account, select **Start/Stop VM** under **Related Resources**. On the Start/Stop VM page, select **Manage the solution** under **Manage Start/Stop VM Solutions**.

* Navigate to the Log Analytics workspace linked to your Automation account. After after selecting the workspace, choose **Solutions** from the left pane. On the Solutions page, select **Start-Stop-VM[workspace]** from the list.  

Selecting the feature displays the **Start-Stop-VM[workspace]** page. Here you can review important details, such as the information in the **StartStopVM** tile. As in your Log Analytics workspace, this tile displays a count and a graphical representation of the runbook jobs for the feature that have started and have finished successfully.

![Automation Update Management page](media/automation-solution-vm-management/azure-portal-vmupdate-solution-01.png)

You can perform further analysis of the job records by clicking the donut tile. The dashboard shows job history and predefined log search queries. Switch to the log analytics advanced portal to search based on your search queries.

## Next steps

To enable the feature on VMs in your environment, see [Enable Start/Stop VMs during off-hours](automation-solution-vm-management-enable.md).
