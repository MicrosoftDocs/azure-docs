---
title: Manage updates for multiple Azure virtual machines | Microsoft Docs
description: This topic describes how to manage updates for Azure virtual machines.
services: automation
documentationcenter: ''
author: eslesar
manager: carmonm
editor: ''

ms.assetid: 
ms.service: automation
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/31/2017
ms.author: magoedte;eslesar
---
# Manage updates for multiple machines

Update management allows you to manage updates and patches for your Windows and Linux machines.
From your [Azure Automation](automation-offering-get-started.md) account, you can quickly onboard machines, assess the status of available updates, schedule installation of required updates, and review deployment results to verify updates were applied successfully to all virtual machines for which Update management is enabled.

## Prerequisites

To use Update management, you need:

* An Azure Automation account. For instructions on creating an Azure Automation Run As account, see
[Getting Started with Azure Automation](automation-offering-get-started.md).

* A virtual machine or computer with one of the supported operating systems installed.

## Supported operating systems

Update management is supported on the following operating systems.

### Windows

* Windows Server 2008 and higher, and update deployments against Windows Server 2008 R2 SP1 and higher.  Server Core and Nano Server installation options are not supported.

    > [!NOTE]
    > Support for deploying updates to Windows Server 2008 R2 SP1 requires .NET Framework 4.5 and WMF 5.0 or later.
    > 
* Windows client operating systems are not supported.

Windows agents must either be configured to communicate with a Windows Server Update Services (WSUS) server or have access to Microsoft Update.

> [!NOTE]
> The Windows agent cannot be managed concurrently by System Center Configuration Manager.
>

### Linux

* CentOS 6 (x86/x64), and 7 (x64)  
* Red Hat Enterprise 6 (x86/x64), and 7 (x64)  
* SUSE Linux Enterprise Server 11 (x86/x64) and 12 (x64)  
* Ubuntu 12.04 LTS and newer x86/x64   

> [!NOTE]  
> To avoid updates being applied outside of a maintenance window on Ubuntu, reconfigure  Unattended-Upgrade package to disable automatic updates. For information on how to configure this, see [Automatic Updates topic in the Ubuntu Server Guide](https://help.ubuntu.com/lts/serverguide/automatic-updates.html).

Linux agents must have access to an update repository.

> [!NOTE]
> An OMS Agent for Linux configured to report to multiple OMS workspaces is not supported with this solution.  
>

## Enable update management for Azure virtual machines

1. In the Azure portal, open the Automation account.
2. On the left-hand side of the screen, select **Update management**.
3. At the top of the screen, click **Add Azure VM**.
    ![Onboard VMs](./media/manage-update-multi/update-onboard-vm.png)
4. Select a virtual machine to onboard. The **Enable Update Management** screen appears.
5. Click **Enable**.

   ![Enable update management](./media/manage-update-multi/update-enable.png)

Update management is enabled for your virtual machine.

## Enable update management for non-Azure virtual machines and computers

For instructions on how to enable update management for non-Azure Windows virtual machines and computers, see [Connect Windows computers to the Log Analytics service in Azure](../log-analytics/log-analytics-windows-agents.md).

For instructions on how to enable update management for non-Azure Linux virtual machines and computers, see [Connect your Linux Computers to Operations Management Suite (OMS)](../log-analytics/log-analytics-agent-linux.md).

## View update assessment

After **Update management** is enabled, the **Update management** screen appears. You can see a list of missing updates on the **Missing updates** tab.

## Data collection

Agents installed on virtual machines and computers collect data about updates and send it to Azure update management.

### Supported agents

The following table describes the connected sources that are supported by this solution.

| Connected Source | Supported | Description |
| --- | --- | --- |
| Windows agents |Yes |Update management collects information about system updates from Windows agents and initiates installation of required updates. |
| Linux agents |Yes |Update management collects information about system updates from Linux agents and initiates installation of required updates on supported distros. |
| Operations Manager management group |Yes |Update management collects information about system updates from agents in a connected management group. |
| Azure storage account |No |Azure storage does not include information about system updates. |

### Collection frequency

For each managed Windows computer, a scan is performed twice per day. Every 15 minutes the Windows API is called to query for the last update time to determine if status has changed, and if so a compliance scan is initiated.  For each managed Linux computer, a scan is performed every 3 hours.

It can take anywhere from 30 minutes up to 6 hours for the dashboard to display updated data from managed computers.

## Schedule an update deployment

To install updates, schedule a deployment that follows your release schedule and service window.
You can choose which update types to include in the deployment. For example you can include critical or security updates and exclude update rollups.

Schedule a new Update Deployment for one or more virtual machines by clicking **Schedule update deployment** at the top of the **Update management** screen. 
In the **New update deployment** screen, specify the following:

* **Name** - Provide a unique name to identify the update deployment.
* **OS Type** - Select Windows or Linux.
* **Computers to update** - Select the virtual machines you want to update.

  ![Select virtual machines to update](./media/manage-update-multi/update-select-computers.png)

* **Update classification** - Select the types of software the update deployment will include in the deployment. The classification types are:
  * Critical updates
  * Security updates
  * Update rollups
  * Feature packs
  * Service packs
  * Definition updates
  * Tools
  * Updates
* **Schedule settings** - You can either accept the default date and time, which is 30 minutes after current time, or specify a different time.
   You can also specify whether the deployment occurs once or set up a recurring schedule. Click the Recurring option under Recurrence to set up a recurring schedule.

   ![Update Schedule Settings screen](./media/manage-update-multi/update-set-schedule.png)

* **Maintenance window (minutes)** - Specify the period of time you want the update deployment to occur within.  This helps ensure changes are performed within your defined service windows.

After you have completed configuring the schedule, click **Create** button and you return to the status dashboard.
Notice that the **Scheduled** table shows the deployment schedule you just created.

> [!WARNING]
> For updates that require a reboot, the virtual machine will be restarted automatically.

## View results of an update deployment

After the scheduled deployment is started, you can see the status for that deployment on the **Update deployments** tab on the **Update management** screen.
If it is currently running, it's status shows as **In progress**. After it completes, if successful, it changes to **Succeeded**.
If there is a failure with one or more updates in the deployment, the status is **Partially failed**.

![Update Deployment status ](./media/manage-update-multi/update-view-results.png)

Click the completed update deployment to see the dashboard for that update deployment.

In **Update results** tile is a summary of the total number of updates and deployment results on the virtual machine.
In the table to the right is a detailed breakdown of each update and the installation results, which could be one of the following values:

* Not attempted - the update was not installed because there was insufficient time available based on the maintenance window duration defined.
* Succeeded - the update succeeded
* Failed - the update failed

Click **All logs** to see all log entries that the deployment created.

Click the **Output** tile to see job stream of the runbook responsible for managing the update deployment on the target virtual machine.

Click **Errors** to see detailed information about any errors from the deployment.

For detailed information about the logs, output, and error information, see [Update Management](../operations-management-suite/oms-solution-update-management.md).

## Next steps

* To learn more about Update management, see [Update Management](../operations-management-suite/oms-solution-update-management.md).
