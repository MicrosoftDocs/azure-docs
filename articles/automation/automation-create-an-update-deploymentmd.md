---
title: Create an Update Deployment
description: This quickstart describes how to create an update deployment
services: automation
ms.service: automation
ms.subservice: update-management
author: bobbytreed
ms.author: robreed
ms.date: 09/26/2019
ms.topic: quickstart
manager: carmonm
---
# Quickstart: Install updates using Update Management

After updates are assessed for all the Linux and Windows computers in your workspace, you can install required updates by creating an *update deployment*. An update deployment is a scheduled installation of required updates for one or more computers. To create an Update Deployment, you must have write access to the Automation Account and write access to the any Azure VMs that are targeted in the deployment. You specify the date and time for the deployment and a computer or group of computers to include in the scope of a deployment. To learn more about computer groups, see [Computer groups in Azure Monitor logs](../azure-monitor/platform/computer-groups.md).

In this Quickstart, you will learn how to:

> [!div class="checklist"]
> - View missing updates
> - Create an Update Deployment
> - View Update Deployments

## Prerequisites

## Create an Update Deployment

To create a new update deployment, select **Schedule update deployment**. The **New Update Deployment** page opens. Enter values for the properties described in the following table and then click **Create**:

| Property | Description |
| --- | --- |
| Name |Unique name to identify the update deployment. |
|Operating System| Linux or Windows|
| Groups to update |For Azure machines, define a query based on a combination of subscription, resource groups, locations, and tags to build a dynamic group of Azure VMs to include in your deployment. </br></br>For Non-Azure machines, select an existing saved search to select a group of Non-Azure machines to include in the deployment. </br></br>To learn more, see [Dynamic Groups](automation-update-management.md#using-dynamic-groups)|
| Machines to update |Select a Saved search, Imported group, or pick Machine from the drop-down and select individual machines. If you choose **Machines**, the readiness of the machine is shown in the **UPDATE AGENT READINESS** column.</br> To learn about the different methods of creating computer groups in Azure Monitor logs, see [Computer groups in Azure Monitor logs](../azure-monitor/platform/computer-groups.md) |
|Update classifications|Select all the update classifications that you need|
|Include/exclude updates|This opens the **Include/Exclude** page. Updates to be included or excluded are on separate tabs. For more information on how inclusion is handled, see [inclusion behavior](automation-update-management.md#inclusion-behavior) |
|Schedule settings|Select the time to start, and select either Once or recurring for the recurrence|
| Pre-scripts + Post-scripts|Select the scripts to run before and after your deployment|
| Maintenance window |Number of minutes set for updates. The value can't be less than 30 minutes and no more than 6 hours |
| Reboot control| Determines how reboots should be handled. Available options are:</br>Reboot if required (Default)</br>Always reboot</br>Never reboot</br>Only reboot - will not install updates|

Update Deployments can also be created programmatically. To learn how to create an Update Deployment with the REST API, see [Software Update Configurations - Create](/rest/api/automation/softwareupdateconfigurations/create). There is also a sample runbook that can be used to create a weekly Update Deployment. To learn more about this runbook, see [Create a weekly update deployment for one or more VMs in a resource group](https://gallery.technet.microsoft.com/scriptcenter/Create-a-weekly-update-2ad359a1).

> [!NOTE]
> The Registry keys listed under [Registry keys used to manage restart](/windows/deployment/update/waas-restart#registry-keys-used-to-manage-restart) can cause a reboot event if **Reboot Control** is set to **Never Reboot**.

### Maintenance Windows

Maintenance windows control the amount of time allowed for updates to install. Consider the following details when specifying a maintenance window.

* Maintenance windows control how many updates are attempted to be installed.
* Update Management does not stop installing new updates if the end of a maintenance window is approaching.
* Update Management does not terminate in-progress updates if when the maintenance window is exceeded.
* If the maintenance window is exceeded on Windows, it is often because of a service pack update taking a long time to install.

> [!NOTE]
> “By the way” info not critical to a taskTo avoid updates being applied outside of a maintenance window on Ubuntu, reconfigure the Unattended-Upgrade package to disable automatic updates. For information about how to configure the package, see [Automatic Updates topic in the Ubuntu Server Guide](https://help.ubuntu.com/lts/serverguide/automatic-updates.html).

### <a name="multi-tenant"></a>Cross-tenant Update Deployments

If you have machines in another Azure tenant reporting to Update Management that you need to patch, you'll need to use the following workaround to get them scheduled. You can use the [New-AzureRmAutomationSchedule](/powershell/module/azurerm.automation/new-azurermautomationschedule) cmdlet with the switch `-ForUpdate` to create a schedule, and use the [New-AzureRmAutomationSoftwareUpdateConfiguration](/powershell/module/azurerm.automation/new-azurermautomationsoftwareupdateconfiguration
) cmdlet and pass the machines in the other tenant to the `-NonAzureComputer` parameter. The following example shows an example on how to do this:

```azurepowershell-interactive
$nonAzurecomputers = @("server-01", "server-02")

$startTime = ([DateTime]::Now).AddMinutes(10)

$sched = New-AzureRmAutomationSchedule -ResourceGroupName mygroup -AutomationAccountName myaccount -Name myupdateconfig -Description test-OneTime -OneTime -StartTime $startTime -ForUpdate

New-AzureRmAutomationSoftwareUpdateConfiguration  -ResourceGroupName $rg -AutomationAccountName <automationAccountName> -Schedule $sched -Windows -NonAzureComputer $nonAzurecomputers -Duration (New-TimeSpan -Hours 2) -IncludedUpdateClassification Security,UpdateRollup -ExcludedKbNumber KB01,KB02 -IncludedKbNumber KB100
```

## Clean up resources

## Next Steps

> [!div class="nextstepaction"]
> [Manage updates and patches for your Azure Windows VMs](automation-tutorial-update-management.md)
