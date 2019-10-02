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

After updates are assessed for all the Linux and Windows computers in your workspace, you can install required updates by creating an **Update deployment**. An **Update Deployment** is a scheduled installation of required updates for one or more computers. To create an **Update Deployment**, you must have write access to the Automation Account and write access to the any Azure VMs that are targeted in the deployment. You specify the date and time for the deployment and a computer or group of computers to include in the scope of a deployment. To learn more about computer groups, see [Computer groups in Azure Monitor logs](../azure-monitor/platform/computer-groups.md).

In this Quickstart, you will learn how to:

> [!div class="checklist"]
> - View missing updates
> - Create an Update Deployment
> - View Update Deployments

## Prerequisites

## View missing updates

Select **Missing updates** to view the list of updates that are missing from your machines. Each update is listed and can be selected. Information about the number of machines that require the update, the operating system, and a link for more information is shown. The **Log search** pane shows more details about the updates.

In the image below, you can see that one of our machines is missing updates. In the next step, we will create an **Update Deployment** to install the updates.

![View missing updates](./media/automation-create-an-update-deployment/automation-create-deployment-missing-updates.png)

### Update classifications

The following tables list the update classifications in Update Management, with a definition for each classification.

#### Windows

|Classification  |Description  |
|---------|---------|
|Critical updates     | An update for a specific problem that addresses a critical, non-security-related bug.        |
|Security updates     | An update for a product-specific, security-related issue.        |
|Update rollups     | A cumulative set of hotfixes that are packaged together for easy deployment.        |
|Feature packs     | New product features that are distributed outside a product release.        |
|Service packs     | A cumulative set of hotfixes that are applied to an application.        |
|Definition updates     | An update to virus or other definition files.        |
|Tools     | A utility or feature that helps complete one or more tasks.        |
|Updates     | An update to an application or file that currently is installed.        |

#### <a name="linux-2"></a>Linux

|Classification  |Description  |
|---------|---------|
|Critical and security updates     | Updates for a specific problem or a product-specific, security-related issue.         |
|Other updates     | All other updates that aren't critical in nature or aren't security updates.        |

For Linux, Update Management can distinguish between critical and security updates in the cloud while displaying assessment data due to data enrichment in the cloud. For patching, Update Management relies on classification data available on the machine. Unlike other distributions, CentOS does not have this information available out of the box. If you have CentOS machines configured in a way to return security data for the following command, Update Management will be able to patch based on classifications.

```bash
sudo yum -q --security check-update
```

There's currently no method supported method to enable native classification-data availability on CentOS. At this time, only best-effort support is provided to customers who may have enabled this on their own.

## Create an Update Deployment

To create a new update deployment, select **Schedule update deployment**. The **New Update Deployment** page opens. For this deployment, we will select **Machines to Update** which opens the **Select machines** blade. Change the **Type** dropdown to *Machines* and select the machine to update. As our missing updates were all for Linux, we will select the Linux machine.

![Select Machines](./media/automation-create-an-update-deployment/automation-create-deployment-select-machines.png)

We will not be changing the [Maintenance Window](#maintenance-windows) or **Reboot Settings**, and we will not change the **Schedule Settings**, as it defaults to now.

Click **Create** to finalize the new **Update Deployment**.

Below is a list of all available **Update Deployment** properties and their descriptions for reference.

### New Update Deployment properties

| Property | Description |
| --- | --- |
| Name |Unique name to identify the **update deployment**. |
|Operating System| Linux or Windows|
| Groups to update |For Azure machines, define a query based on a combination of subscription, resource groups, locations, and tags to build a dynamic group of Azure VMs to include in your deployment. </br></br>For Non-Azure machines, select an existing saved search to select a group of Non-Azure machines to include in the deployment. </br></br>To learn more, see [Dynamic Groups](automation-update-management.md#using-dynamic-groups)|
| Machines to update |Select a Saved search, Imported group, or pick Machine from the drop-down and select individual machines. If you choose **Machines**, the readiness of the machine is shown in the **UPDATE AGENT READINESS** column.</br> To learn about the different methods of creating computer groups in Azure Monitor logs, see [Computer groups in Azure Monitor logs](../azure-monitor/platform/computer-groups.md) |
|Update classifications|Select all the update classifications that you need|
|Include/exclude updates|This opens the **Include/Exclude** page. Updates to be included or excluded are on separate tabs. For more information on how inclusion is handled, see [inclusion behavior](automation-update-management.md#inclusion-behavior) |
|Schedule settings|Select the time to start, and select either Once or recurring for the recurrence|
| Pre-scripts + Post-scripts|Select the scripts to run before and after your deployment|
| Maintenance window |Number of minutes set for updates. The value can't be less than 30 minutes and no more than 6 hours |
| Reboot control| Determines how reboots should be handled. Available options are:</br>Reboot if required (Default)</br>Always reboot</br>Never reboot</br>Only reboot - will not install updates|

**Update Deployments** can also be created programmatically. To learn how to create an **Update Deployment** with the REST API, see [Software Update Configurations - Create](/rest/api/automation/softwareupdateconfigurations/create). There is also a sample runbook that can be used to create a weekly **Update Deployment**. To learn more about this runbook, see [Create a weekly update deployment for one or more VMs in a resource group](https://gallery.technet.microsoft.com/scriptcenter/Create-a-weekly-update-2ad359a1).

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

## View update deployments

Now that we have created a new **Update Deployment**, select the **Deployment Schedules** tab to view the list of scheduled update deployments.

![Deployment Schedules](./media/automation-create-an-update-deployment/automation-create-deployment-deployment-schedules.png)

Next, select the **History** tab and click on the most recent run of your **Update Deployment** to open the **Update Deployment Run** pane for that update deployment. Job logs are stored for a max of 30 days.

![Overview of update deployment results](./media/automation-create-an-update-deployment/automation-create-deployment-deployment-schedules-run.png)

To view an update deployment from the REST API, see [Software Update Configuration Runs](/rest/api/automation/softwareupdateconfigurationruns).

## Clean up resources

## Next Steps

> [!div class="nextstepaction"]
> [Manage updates and patches for your Azure Windows VMs](automation-tutorial-update-management.md)
