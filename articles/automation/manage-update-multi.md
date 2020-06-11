---
title: Manage updates for multiple VMs in Azure Automation
description: This article tells how to manage updates for multiple VMs.
services: automation
ms.subservice: update-management
ms.date: 03/26/2020
ms.topic: conceptual
---
# Manage updates for multiple VMs

You can use Azure Automation Update Management to manage updates and patches for your Windows and Linux VMs. From your [Azure Automation](automation-offering-get-started.md) account, you can:

- Enable VMs for update management.
- Assess the status of available updates.
- Schedule installation of required updates.
- Review deployment results to verify that updates were applied successfully to all VMs for which Update Management is enabled.

To learn about the system requirements for Update Management, see [Update Management client requirements](automation-update-management.md#client-requirements).

## Prerequisites

* A VM or computer with one of the supported operating systems installed.
* Access to an update repository for Linux VMs enabled for Update Management.

## Enable Update Management for Azure VMs

1. In the Azure portal, open your Automation account, and then select **Update management**.

2. Select **Add Azure VMs**.

    ![Add Azure VM tab](./media/manage-update-multi/update-onboard-vm.png)

3. Select a VM to enable and select **Enable** under **Enable Update Management**.

    ![Enable Update Management dialog box](./media/manage-update-multi/update-enable.png)

    When the operation is finished, Update Management is enabled on your VM.

## Enable Update Management for non-Azure VMs and computers

The Log Analytics agent for Windows and Linux needs to be installed on the VMs that are running on your corporate network or other cloud environment in order to enable them with Update Management. To learn the system requirements and supported methods to deploy the agent to machines hosted outside of Azure, see [Overview of the Log Analytics agent](../azure-monitor/platform/log-analytics-agent.md).

## View computers attached to your Automation account

After you enable Update Management for your machines, you can view machine information by selecting **Computers**. You can see information about machine name, compliance status, environment, OS type, critical and security updates installed, other updates installed, and update agent readiness for your computers.

  ![View computers tab](./media/manage-update-multi/update-computers-tab.png)

Computers that have recently been enabled for Update Management might not have been assessed yet. The compliance state for those computers is `Not assessed`. Here's a list of possible values for compliance state:

- `Compliant`: Computers that are not missing critical or security updates.
- `Non-compliant`: Computers that are missing at least one critical or security update.
- `Not assessed`: The update assessment data hasn't been received from the computer within the expected timeframe. For Linux computers, the expected timeframe is the last hour. For Windows computers, the expected timeframe is the last 12 hours.

To view the status of the agent, select the link in the **Update agent readiness** column. Selecting this option opens the Hybrid Worker pane, and shows the status of the Hybrid Worker. The following image shows an example of an agent that hasn't been connected to Update Management for an extended period of time:

![View computers tab](./media/manage-update-multi/update-agent-broken.png)

## View an update assessment

After Update Management is enabled, the Update Management pane opens. You can see a list of missing updates on the **Missing updates** tab.

## Collect data

Agents that are installed on VMs and computers collect data about updates. The agents send the data to Azure Update Management.

### Supported agents

The following table describes the connected sources that Update Management supports:

| Connected source | Supported | Description |
| --- | --- | --- |
| Windows agents |Yes |Update Management collects information about system updates from Windows agents and then initiates installation of required updates. |
| Linux agents |Yes |Update Management collects information about system updates from Linux agents and then initiates installation of required updates on supported distributions. |
| Operations Manager management group |Yes |Update Management collects information about system updates from agents in a connected management group. |
| Azure Storage account |No |Azure Storage doesn't include information about system updates. |

### Collection frequency

After a computer completes a scan for update compliance, the agent forwards the information in bulk to Azure Monitor logs. On a Windows computer, the compliance scan is run every 12 hours by default.

In addition to the scan schedule, the scan for update compliance is initiated within 15 minutes of the MMA being restarted, before update installation, and after update installation.

For a Linux computer, the compliance scan is performed every hour by default. If the MMA agent is restarted, a compliance scan is initiated within 15 minutes.

It can take between 30 minutes and 6 hours for the dashboard to display updated data from managed computers.

## Schedule an update deployment

To install updates, schedule a deployment that aligns with your release schedule and service window. You can choose which update types to include in the deployment. For example, you can include critical or security updates and exclude update rollups.

>[!NOTE]
>When you schedule an update deployment, it creates a [schedule](shared-resources/schedules.md) resource linked to the **Patch-MicrosoftOMSComputers** runbook that handles the update deployment on the target machines. If you delete the schedule resource from the Azure portal or using PowerShell after creating the deployment, it breaks the scheduled update deployment and presents an error when you attempt to reconfigure it from the portal. You can only delete the schedule resource by deleting the corresponding deployment schedule.
>

To schedule a new update deployment for one or more VMs, under **Update management**, select **Schedule update deployment**.

In the **New update deployment** pane, specify the following information:

- **Name**: Enter a unique name to identify the update deployment.
- **Operating system**: Select **Windows** or **Linux**.
- **Groups to update**: Define a query based on a combination of subscription, resource groups, locations, and tags to build a dynamic group of Azure VMs to include in your deployment. For non-Azure VMs, saved searches are used to create a dynamic group to include in your deployment. To learn more see, [Dynamic Groups](automation-update-management-groups.md).
- **Machines to update**: Select a Saved Search, Imported group, or select Machines, to choose the machines that you want to update.

   >[!NOTE]
   >Selecting the Saved Search option does not return machine identities, only their names. If you have several VMs with the same name across multiple resource groups, they are returned in the results. Using the **Groups to update** option is recommended to ensure you include unique VMs matching your criteria.

   If you choose **Machines**, the readiness of the machine is shown in the **Update agent readiness** column. You can see the health state of the machine before you schedule the update deployment. To learn about the different methods of creating computer groups in Azure Monitor logs, see [Computer groups in Azure Monitor logs](../azure-monitor/platform/computer-groups.md)

  ![New update deployment pane](./media/manage-update-multi/update-select-computers.png)

- **Update classification**: Select the types of software to include in the update deployment. For a description of the classification types, see [Update classifications](automation-view-update-assessments.md#work-with-update-classifications). The classification types are:
  - Critical updates
  - Security updates
  - Update rollups
  - Feature packs
  - Service packs
  - Definition updates
  - Tools
  - Updates

- **Updates to include/exclude** - This opens the Include/Exclude page. Updates to be included or excluded are on separate tabs. For additional information on how inclusion is handled, see [Schedule an Update Deployment](automation-tutorial-update-management.md#schedule-an-update-deployment).

> [!NOTE]
> It's important to know that exclusions override inclusions. For instance, if you define an exclusion rule of `*`, then no patches or packages are installed as they are all excluded. Excluded patches still show as missing from the machine. For Linux machines if a package is included but has a dependent package that was excluded, the package is not installed.

> [!NOTE]
> You can't specify updates that have been superseded for inclusion with the update deployment.

- **Schedule settings**: You can accept the default date and time, which is 30 minutes after the current time. You can also specify a different time.

   You can also specify whether the deployment occurs once or on a recurring schedule. To set up a recurring schedule, under **Recurrence**, select **Recurring**.

   ![Schedule Settings dialog box](./media/manage-update-multi/update-set-schedule.png)

- **Pre-scripts + Post-scripts**: Select the scripts to run before and after your deployment. To learn more, see [Manage Pre and Post scripts](pre-post-scripts.md).
- **Maintenance window (minutes)**: Specify the period of time that you want the update deployment to occur. This setting helps ensure that changes are performed within your defined service windows.

- **Reboot control** - This setting determines how reboots are handled for the update deployment.

   |Option|Description|
   |---|---|
   |Reboot if required| **(Default)** If required, a reboot is initiated if the maintenance window allows.|
   |Always reboot|A reboot is initiated regardless of whether one is required. |
   |Never reboot|Regardless of if a reboot is required, reboots are suppressed.|
   |Only reboot - will not install updates|This option ignores installing updates, and only initiates a reboot.|

When you're finished configuring the schedule, select the **Create** button to return to the status dashboard. The **Scheduled** table shows the deployment schedule that you created.

> [!NOTE]
> Update Management supports deploying first party updates and pre-downloading patches. This requires changes on the systems being patched, see [first party and pre download support](automation-configure-windows-update.md#pre-download-updates) to learn how to configure these settings on your systems.

## View results of an update deployment

After the scheduled deployment starts, you can see the status for that deployment on the **Update deployments** tab under **Update management**.

If the deployment is currently running, its status is **In progress**. After the deployment finishes successfully, the status changes to **Succeeded**.

If one or more updates fail in the deployment, the status is **Partially failed**.

![Status of update deployment](./media/manage-update-multi/update-view-results.png)

To see the dashboard for an update deployment, select the completed deployment.

The Update results pane shows the total number of updates and the deployment results for the VM. The table on the right gives a detailed breakdown of each update and the installation results. Installation results can be one of the following values:

- `Not attempted`: The update was not installed because insufficient time was available based on the defined maintenance window.
- `Succeeded`: The update succeeded.
- `Failed`: The update failed.

To see all log entries that the deployment created, select **All logs**.

To see the job stream of the runbook that manages the update deployment on the target VM, select the output tile.

To see detailed information about any errors from the deployment, select **Errors**.

## Next steps

* If you need to search update logs, see [Query Update Management logs](automation-update-management-query-logs.md).
