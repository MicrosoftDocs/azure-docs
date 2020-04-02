---
title: Start/Stop VMs during off-hours solution
description: This VM management solution starts and stops your Azure virtual machines on a schedule and proactively monitors from Azure Monitor logs.
services: automation
ms.subservice: process-automation
ms.date: 04/01/2020
ms.topic: conceptual
---
# Start/Stop VMs during off-hours solution in Azure Automation

The Start/Stop VMs during off-hours solution start and stops your Azure virtual machines on user-defined schedules, provides insights through Azure Monitor logs, and sends optional emails by using [action groups](../azure-monitor/platform/action-groups.md). It supports both Azure Resource Manager and classic VMs for most scenarios. 

To use this solution with Classic VMs, you need a Classic RunAs account, which is not created by default. For instructions on creating a Classic RunAs account, see [Classic Run-As Accounts](automation-create-standalone-account.md#classic-run-as-accounts).

> [!NOTE]
> The Start/Stop VMs during off-hours solution has been updated to support the newest versions of the Azure modules that are available.

This solution provides a decentralized low-cost automation option for users who want to optimize their VM costs. With this solution, you can:

- [Schedule VMs to start and stop](automation-solution-vm-management-config.md#schedule).
- Schedule VMs to start and stop in ascending order by [using Azure Tags](automation-solution-vm-management-config.md#tags) (not supported for classic VMs).
- Autostop VMs based on [low CPU usage](automation-solution-vm-management-config.md#cpuutil).

The following are limitations with the current solution:

- This solution manages VMs in any region, but can only be used in the same subscription as your Azure Automation account.
- This solution is available in Azure and Azure Government to any region that supports a Log Analytics workspace, an Azure Automation account, and Alerts. Azure Government regions currently do not support email functionality.

> [!NOTE]
> If you are using the solution for classic VMs, then all your VMs will be processed sequentially per cloud service. Virtual machines are still processed in parallel across different cloud services. If you have more than 20 VMs per cloud service, we recommend creating multiple schedules with the parent runbook **ScheduledStartStop_Parent** and specify 20 VMs per schedule. In the schedule properties, specify as a comma-separated list, VM names in the **VMList** parameter. Otherwise, if the Automation job for this solution runs more than three hours it is temporarily unloaded or stopped per the [fair share](automation-runbook-execution.md#fair-share) limit.
>
> Azure Cloud Solution Provider (Azure CSP) subscriptions support only the Azure Resource Manager model, non-Azure Resource Manager services are not available in the program. When the Start/Stop solution runs you may receive errors as it has cmdlets to manage classic resources. To learn more about CSP, see [Available services in CSP subscriptions](https://docs.microsoft.com/azure/cloud-solution-provider/overview/azure-csp-available-services). If you use a CSP subscription, you should modify the [**External_EnableClassicVMs**](#variables) variable to **False** after deployment.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## Prerequisites

The runbooks for this solution work with an [Azure Run As account](automation-create-runas-account.md). The Run As account is the preferred authentication method, because it uses certificate authentication instead of a password that might expire or change frequently.

We recommend you use a separate Automation Account for the Start/Stop VM solution. This is because Azure module versions are frequently upgraded, and their parameters may change. The Start/Stop VM solution is not upgraded on the same cadence so it may not work with newer versions of the cmdlets that it uses. We also recommend you test module updates in a test Automation Account prior to importing them in your production Automation Account(s).

### Permissions

There are certain permissions that a user must have to deploy the Start/Stop VMs during off hours solution. These permissions are different if using a pre-created Automation Account and Log Analytics workspace or creating new ones during deployment. If you are a Contributor on the subscription and a Global Administrator in your Azure Active Directory tenant, you do not need to configure the following permissions. If you do not have those rights or need to configure a custom role, see the permissions required below.

#### Pre-existing Automation Account and Log Analytics workspace

To deploy the Start/Stop VMs during off hours solution to an existing Automation Account and Log Analytics workspace, the user deploying the solution requires the following permissions on the **Resource Group**. To learn more about roles, see [Custom roles for Azure resources](../role-based-access-control/custom-roles.md).

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

#### New Automation Account and a new Log Analytics workspace

To deploy the Start/Stop VMs during off hours solution to a new Automation Account and Log Analytics workspace, the user deploying the solution needs the permissions defined in the preceding section as well as the following permissions:

- Co-administrator on subscription - It is only needed to create the Classic Run As Account if you are going to manage Classic VMs. [Classic RunAs Accounts](automation-create-standalone-account.md#classic-run-as-accounts) are no longer created by default.
- A member of the [Azure Active Directory](../active-directory/users-groups-roles/directory-assign-admin-roles.md) **Application Developer** role. For more information on configuring Run As Accounts, see [Permissions to configure Run As accounts](manage-runas-account.md#permissions).
- Contributor on the subscription or the following permissions.

| Permission |Scope|
| --- | --- |
| Microsoft.Authorization/Operations/read | Subscription|
| Microsoft.Authorization/permissions/read |Subscription|
| Microsoft.Authorization/roleAssignments/read | Subscription |
| Microsoft.Authorization/roleAssignments/write | Subscription |
| Microsoft.Authorization/roleAssignments/delete | Subscription |
| Microsoft.Automation/automationAccounts/connections/read | Resource Group |
| Microsoft.Automation/automationAccounts/certificates/read | Resource Group |
| Microsoft.Automation/automationAccounts/write | Resource Group |
| Microsoft.OperationalInsights/workspaces/write | Resource Group |

## Solution components

This solution includes preconfigured runbooks, schedules, and integration with Azure Monitor logs so you can tailor the startup and shutdown of your virtual machines to suit your business needs.

### Runbooks

The following table lists the runbooks deployed to your Automation account by this solution. Do not make changes to the runbook code. Instead, write your own runbook for new functionality.

> [!IMPORTANT]
> Do not directly run any runbook with *child* appended to its name.

All parent runbooks include the _WhatIf_ parameter. When set to **True**, _WhatIf_ supports detailing the exact behavior the runbook takes when run without the _WhatIf_ parameter and validates the correct VMs are being targeted. A runbook only performs its defined actions when the _WhatIf_ parameter is set to **False**.

|Runbook | Parameters | Description|
| --- | --- | ---|
|AutoStop_CreateAlert_Child | VMObject <br> AlertAction <br> WebHookURI | Called from the parent runbook. This runbook creates alerts on a per-resource basis for the AutoStop scenario.|
|AutoStop_CreateAlert_Parent | VMList<br> WhatIf: True or False  | Creates or updates Azure alert rules on VMs in the targeted subscription or resource groups. <br> VMList: Comma-separated list of VMs. For example, _vm1, vm2, vm3_.<br> *WhatIf* validates the runbook logic without executing.|
|AutoStop_Disable | none | Disables AutoStop alerts and default schedule.|
|AutoStop_VM_Child | WebHookData | Called from the parent runbook. Alert rules call this runbook to stop the Classic VM.|
|AutoStop_VM_Child_ARM | WebHookData |Called from the parent runbook. Alert rules call this runbook to stop the VM.  |
|ScheduledStartStop_Base_Classic | CloudServiceName<br> Action: Start or Stop<br> VMList  | This runbook used to perform action start or stop in Classic VM group by Cloud Services.<br> VMList: Comma-separated list of VMs. For example, _vm1, vm2, vm3_. |
|ScheduledStartStop_Child | VMName <br> Action: Start or Stop <br> ResourceGroupName | Called from the parent runbook. Executes a start or stop action for the scheduled stop.|
|ScheduledStartStop_Child_Classic | VMName<br> Action: Start or Stop<br> ResourceGroupName | Called from the parent runbook. Executes a start or stop action for the scheduled stop for Classic VMs. |
|ScheduledStartStop_Parent | Action: Start or Stop <br>VMList <br> WhatIf: True or False | This setting affects all VMs in the subscription. Edit the **External_Start_ResourceGroupNames** and **External_Stop_ResourceGroupNames** to only execute on these targeted resource groups. You can also exclude specific VMs by updating the **External_ExcludeVMNames** variable.<br> VMList: Comma-separated list of VMs. For example, _vm1, vm2, vm3_.<br> _WhatIf_ validates the runbook logic without executing.|
|SequencedStartStop_Parent | Action: Start or Stop <br> WhatIf: True or False<br>VMList| Create tags named **sequencestart** and **sequencestop** on each VM for which you want to sequence start/stop activity. These tag names are case-sensitive. The value of the tag should be a positive integer (1, 2, 3) that corresponds to the order in which you want to start or stop. <br> VMList: Comma-separated list of VMs. For example, _vm1, vm2, vm3_. <br> _WhatIf_ validates the runbook logic without executing. <br> **Note**: VMs must be within resource groups defined as External_Start_ResourceGroupNames, External_Stop_ResourceGroupNames, and External_ExcludeVMNames in Azure Automation variables. They must have the appropriate tags for actions to take effect.|

### Variables

The following table lists the variables created in your Automation account. Only modify variables prefixed with **External**. Modifying variables prefixed with **Internal** causes undesirable effects.

|Variable | Description|
|---------|------------|
|External_AutoStop_Condition | The conditional operator required for configuring the condition before triggering an alert. Acceptable values are **GreaterThan**, **GreaterThanOrEqual**, **LessThan**, and **LessThanOrEqual**.|
|External_AutoStop_Description | The alert to stop the VM if the CPU percentage exceeds the threshold.|
|External_AutoStop_Frequency | The evaluation frequency for rule. This parameter accepts input in timespan format. Possible values are from 5 mins to 6 hours. |
|External_AutoStop_MetricName | The name of the performance metric for which the Azure Alert rule is to be configured.|
|External_AutoStop_Severity | Severity of the metric alert, which can range from 0 to 4. |
|External_AutoStop_Threshold | The threshold for the Azure Alert rule specified in the variable _External_AutoStop_MetricName_. Percentage values can range from 1 to 100.|
|External_AutoStop_TimeAggregationOperator | The time aggregation operator, which is applied to the selected window size to evaluate the condition. Acceptable values are **Average**, **Minimum**, **Maximum**, **Total**, and **Last**.|
|External_AutoStop_TimeWindow | The window size during which Azure analyzes selected metrics for triggering an alert. This parameter accepts input in timespan format. Possible values are from 5 minutes to 6 hours.|
|External_EnableClassicVMs| Specifies whether Classic VMs are targeted by the solution. The default value is True. This should be set to False for CSP subscriptions. Classic VMs require a [Classic Run-As Account](automation-create-standalone-account.md#classic-run-as-accounts).|
|External_ExcludeVMNames | Enter VM names to be excluded, separating names by using a comma with no spaces. This is limited to 140 VMs. If you add more than 140 VMs to this comma-separated list, VMs that are set to be excluded may be inadvertently started or stopped.|
|External_Start_ResourceGroupNames | Specifies one or more resource groups, separating values by using a comma, targeted for start actions.|
|External_Stop_ResourceGroupNames | Specifies one or more resource groups, separating values by using a comma, targeted for stop actions.|
|External_WaitTimeForVMRetrySeconds |The wait time in seconds for the actions to be performed on the VMs for the Sequenced start/stop runbook.<br> Default value is 2100 seconds and supports configuring to a maximum value of 10800 or three hours.|
|Internal_AutomationAccountName | Specifies the name of the Automation account.|
|Internal_AutoSnooze_ARM_WebhookURI | Specifies Webhook URI called for the AutoStop scenario for VMs.|
|Internal_AutoSnooze_WebhookUri | Specifies Webhook URI called for the AutoStop scenario for Classic VMs.|
|Internal_AzureSubscriptionId | Specifies the Azure Subscription ID.|
|Internal_ResourceGroupName | Specifies the Automation account resource group name.|

>[!NOTE]
>For the variable **External_WaitTimeForVMRetryInSeconds**, the default value has been updated from 600 to 2100. This variable allows the **Sequenced start/stop scenario** runbook to wait for the child operations for specified number of seconds before proceeding with the next action.
>

Across all scenarios, the **External_Start_ResourceGroupNames**,  **External_Stop_ResourceGroupNames**, and **External_ExcludeVMNames** variables are necessary for targeting VMs, with the exception of providing a comma-separated list of VMs for the **AutoStop_CreateAlert_Parent**, **SequencedStartStop_Parent**, and **ScheduledStartStop_Parent** runbooks. That is, your VMs must reside in target resource groups for start and stop actions to occur. The logic works similar to Azure policy, in that you can target the subscription or resource group and have actions inherited by newly created VMs. This approach avoids having to maintain a separate schedule for every VM and manage starts and stops in scale.

### Schedules

The following table lists each of the default schedules created in your Automation account. You can modify them or create your own custom schedules. By default, all of the schedules are disabled except for **Scheduled_StartVM** and **Scheduled_StopVM**.

You should not enable all schedules, because this might create overlapping schedule actions. It's best to determine which optimizations you want to perform and modify accordingly. See the example scenarios in the overview section for further explanation.

|Schedule name | Frequency | Description|
|--- | --- | ---|
|Schedule_AutoStop_CreateAlert_Parent | Every 8 hours | Runs the AutoStop_CreateAlert_Parent runbook every 8 hours, which in turn stops the VM-based values in External_Start_ResourceGroupNames, External_Stop_ResourceGroupNames, and External_ExcludeVMNames in Azure Automation variables. Alternatively, you can specify a comma-separated list of VMs by using the VMList parameter.|
|Scheduled_StopVM | User defined, daily | Runs the Scheduled_Parent runbook with a parameter of _Stop_ every day at the specified time. Automatically stops all VMs that meet the rules defined by asset variables. Enable the related schedule, **Scheduled-StartVM**.|
|Scheduled_StartVM | User defined, daily | Runs the Scheduled_Parent runbook with a parameter of _Start_ every day at the specified time. Automatically starts all VMs that meet the rules defined by the appropriate variables. Enable the related schedule, **Scheduled-StopVM**.|
|Sequenced-StopVM | 1:00 AM (UTC), every Friday | Runs the Sequenced_Parent runbook with a parameter of _Stop_ every Friday at the specified time. Sequentially (ascending) stops all VMs with a tag of **SequenceStop** defined by the appropriate variables. For more information on tag values and asset variables, see the Runbooks section. Enable the related schedule, **Sequenced-StartVM**.|
|Sequenced-StartVM | 1:00 PM (UTC), every Monday | Runs the Sequenced_Parent runbook with a parameter of _Start_ every Monday at the specified time. Sequentially (descending) starts all VMs with a tag of **SequenceStart** defined by the appropriate variables. For more information on tag values and asset variables, see the Runbooks section. Enable the related schedule, **Sequenced-StopVM**.|

## Enable the solution

To begin using the solution, perform the steps in the [Enable Start/Stop VMs solution](automation-solution-vm-management-enable.md).

## Viewing the solution

You can access the solution after you have enabled it from one of the following ways:

* From your Automation account, select **Start/Stop VM** under **Related Resources**. On the **Start/Stop VM** page, select **Manage the solution** from the right-hand side of the page, under the section **Manage Start/Stop VM Solutions**.

* Navigate to the Log Analytics workspace linked to your Automation account, and after selecting the workspace, select **Solutions** from the left-hand pane. On the **Solutions** page, select the **Start-Stop-VM[workspace]** solution from the list.  

Selecting the solution displays the **Start-Stop-VM[workspace]** solution page. Here you can review important details such as the **StartStopVM** tile. As in your Log Analytics workspace, this tile displays a count and a graphical representation of the runbook jobs for the solution that have started and have finished successfully.

![Automation Update Management solution page](media/automation-solution-vm-management/azure-portal-vmupdate-solution-01.png)

From here, you can perform further analysis of the job records by clicking the donut tile. The solution dashboard shows job history and pre-defined log search queries. Switch to the log analytics advanced portal to search based on your search queries.

## Update the solution

If you have deployed a previous version of this solution, you must first delete it from your account before deploying an updated release. Follow the steps to [remove the solution](#remove-the-solution) and then follow the steps to [deploy the solution](automation-solution-vm-management-enable.md).

## Remove the solution

If you decide you no longer need to use the solution, you can delete it from the Automation account. Deleting the solution only removes the runbooks. It does not delete the schedules or variables that were created when the solution was added. Those assets you need to delete manually if you are not using them with other runbooks.

To delete the solution, perform the following steps:

1. From your Automation account, under **Related resources**, select **Linked workspace**.

2. Select **Go to workspace**.

3. Under **General**, select **Solutions**. 

4. On the **Solutions** page, select the solution **Start-Stop-VM[Workspace]**. On the **VMManagementSolution[Workspace]** page, from the menu, select **Delete**.<br><br> ![Delete VM Mgmt Solution](media/automation-solution-vm-management/vm-management-solution-delete.png)

5. In the **Delete Solution** window, confirm that  you want to delete the solution.

6. While the information is verified and the solution is deleted, you can track its progress under **Notifications** from the menu. You are returned to the **Solutions** page after the process to remove the solution starts.

The Automation account and Log Analytics workspace are not deleted as part of this process. If you do not want to retain the Log Analytics workspace, you need to manually delete it. This can be accomplished from the Azure portal:

1. In Azure portal, search for and select **Log Analytics workspaces**.

2. On the **Log Analytics workspaces** page, select the workspace.

3. Select **Delete** from the menu on the workspace settings page.

If you do not want to retain the Azure Automation account components, you can manually delete each. For the list of runbooks, variables, and schedules created by the solution, see the [Solution components](#solution-components).

## Next steps

[Enable](automation-solution-vm-management-enable.md) the Start/Stop during off-hours solution for your Azure VMs.
