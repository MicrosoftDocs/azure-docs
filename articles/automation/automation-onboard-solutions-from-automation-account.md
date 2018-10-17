---
title: Learn how to onboard Update Management, Change Tracking, and Inventory solutions in Azure Automation
description: Learn how to onboard an Azure Virtual machine with Update Management, Change Tracking, and Inventory solutions that are part of Azure Automation
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 10/16/2018
ms.topic: conceptual
manager: carmonm
ms.custom: mvc
---
# Onboard Update Management, Change Tracking, and Inventory solutions

Azure Automation provides solutions to manage operating system security updates, track changes, and inventory what is installed on your computers. There are multiple ways to onboard machines, you can onboard the solution [from a virtual machine](automation-onboard-solutions-from-vm.md), [from browsing multiple machines](automation-onboard-solutions-from-browse.md), from your Automation account, or by [runbook](automation-onboard-solutions.md). This article covers onboarding these solutions from your Automation account.

## Log in to Azure

Log in to Azure at https://portal.azure.com

## Enable solutions

Navigate to your Automation account and select either **Inventory** or **Change tracking** under **CONFIGURATION MANAGEMENT**.

Choose the Log analytics workspace and Automation account and click **Enable** to enable the solution. The solution takes up to 15 minutes to enable.

![Onboard Inventory solution](media/automation-onboard-solutions-from-automation-account/onboardsolutions.png)

The Change Tracking and Inventory solution provides the ability to [track changes](automation-vm-change-tracking.md) and [inventory](automation-vm-inventory.md) on your virtual machines. In this step, you enable the solution on a virtual machine.

When the change tracking and inventory solution onboarding notification completes, click on **Update Management** under **CONFIGURATION MANAGEMENT**.

The Update Management solution allows you to manage updates and patches for your Azure Windows VMs. You can assess the status of available updates, schedule installation of required updates, and review deployment results to verify updates were applied successfully to the VM. This action enabled the solution for your VM.

Select **Update management** under **UPDATE MANAGEMENT**. The Log analytics workspace selected is the same workspace used in the preceding step. Click **Enable** to onboard the Update management solution. The solution takes up to 15 minutes to enable.

![Onboard update solution](media/automation-onboard-solutions-from-automation-account/onboardsolutions2.png)

## Scope Configuration

Each solution uses a Scope Configuration within the workspace to target the computers that get the solution. The Scope Configuration is a group of one or more saved searches that is used to limit the scope of the solution to specific computers. To access the Scope Configurations, in your Automation account under **RELATED RESOURCES**, select **Workspace**. Then in the workspace under **WORKSPACE DATA SOURCES**, select **Scope Configurations**.

If the selected workspace does not have the Update Management or Change Tracking solutions yet, The following scope configurations are created:

* **MicrosoftDefaultScopeConfig-ChangeTracking**

* **MicrosoftDefaultScopeConfig-Updates**

If the selected workspace already has the solution. The solution is not re-deployed, and the scope configuration is not added to it.

## Saved searches

When a computer is added to the Update Management or the Change Tracking and Inventory solutions, they are added to one of two saved searches in your workspace. These saved searches are queries that contain the computers that are targeted for these solutions.

Navigate to your Automation account and select **Saved searches** under **General**. The two saved searches used by these solutions can be seen in the following table:

|Name     |Category  |Alias  |
|---------|---------|---------|
|MicrosoftDefaultComputerGroup     |  ChangeTracking       | ChangeTracking__MicrosoftDefaultComputerGroup        |
|MicrosoftDefaultComputerGroup     | Updates        | Updates__MicrosoftDefaultComputerGroup         |

Select either saved search to view the query used to populate the group. The following image shows the query and its results:

![Saved searches](media/automation-onboard-solutions-from-automation-account/savedsearch.png)

## Onboard Azure VMs

From your Automation account select **Inventory** or **Change tracking** under **CONFIGURATION MANAGEMENT**, or **Update management** under **UPDATE MANAGEMENT**.

Click **+ Add Azure VMs**, select one or more VMs from the list. Virtual machines that can't be enabled are greyed out and unable to be selected. On the **Enable Update Management** page, click **Enable**. This adds the selected VMs to the computer group saved search for the solution.

![Enable Azure VMs](media/automation-onboard-solutions-from-automation-account/enable-azure-vms.png)

## Onboard a non-Azure machine

Machines not in Azure need to be added manually. From your Automation account select **Inventory** or **Change tracking** under **CONFIGURATION MANAGEMENT**, or **Update management** under **UPDATE MANAGEMENT**.

Click **Add non-Azure machine**. This opens up a new browser window with the [instructions on how to install and configure the Microsoft Monitoring Agent on the machine](../log-analytics/log-analytics-concept-hybrid.md) so the machine can begin reporting to the solution. If you are onboarding a machine that currently managed by System Center Operations Manager, a new agent is not required, the workspace information is entered into the existing agent.

## Onboard machines in the workspace

Manually installed machines or machines already reporting to your workspace need to be added to Azure Automation for the solution to be enabled. From your Automation account select **Inventory** or **Change tracking** under **CONFIGURATION MANAGEMENT**, or **Update management** under **UPDATE MANAGEMENT**.

Select **Manage machines**. This opens up the **Manage Machines** page. This page allows you to enable the solution on a select set of machines, all available machines, or enable the solution for all current machines and enable it on all future machines.

![Saved searches](media/automation-onboard-solutions-from-automation-account/managemachines.png)

### All available machines

To enable the solution for all available machines, select **Enable on all available machines**. This disables the control to add machines individually. This task adds all the names of the machines reporting to the workspace to the computer group saved search query. When selected, this disables the **Manage Machines** button.

### All available and future machines

To enable the solution for all available machines and all future machines, select **Enable on all available and future machines**. This option deletes the saved searches and Scope Configurations from the workspace. This opens the solution to all Azure and non-Azure machines that are reporting to the workspace. When selected, this disables the **Manage Machines** button.

### Selected machines

To enable the solution for one or more machines, select **Enable on selected machines** and click **add** next to each machine you want to add to the solution. This task adds the selected machine names to the computer group saved search query for the solution.

## Unlink workspace

The following solutions are dependent on a Log Analytics workspace:

* [Update Management](automation-update-management.md)
* [Change Tracking](automation-change-tracking.md)
* [Start/Stop VMs during off-hours](automation-solution-vm-management.md)

If you decide you no longer wish to integrate your Automation account with Log Analytics, you can unlink your account directly from the Azure portal.  Before you proceed, you first need to remove the solutions mentioned earlier, otherwise this process will be prevented from proceeding. Review the article for the particular solution you have imported to understand the steps required to remove it.

After you remove these solutions, you can perform the following steps to unlink your Automation account.

> [!NOTE]
> Some solutions including earlier versions of the Azure SQL monitoring solution may have created automation assets and may also need to be removed prior to unlinking the workspace.

1. From the Azure portal, open your Automation account, and on the Automation account page  select **Linked workspace** under the section **Related Resources** on the left.

2. On the Unlink workspace page, click **Unlink workspace**.

   ![Unlink workspace page](media/automation-onboard-solutions-from-automation-account/automation-unlink-workspace-blade.png).

   You will receive a prompt verifying you wish to proceed.

3. While Azure Automation attempts to unlink the account your Log Analytics workspace, you can track the progress under **Notifications** from the menu.

If you used the Update Management solution, optionally you may want to remove the following items that are no longer needed after you remove the solution.

* Update schedules - Each will have names that match the update deployments you created)

* Hybrid worker groups created for the solution -  Each will be named similarly to  machine1.contoso.com_9ceb8108-26c9-4051-b6b3-227600d715c8).

If you used the Start/Stop VMs during off-hours solution, optionally you may want to remove the following items that are no longer needed after you remove the solution.

* Start and stop VM runbook schedules
* Start and stop VM runbooks
* Variables

## Next steps

Continue to the tutorials on the solutions to learn how to use them.

* [Tutorial - Manage Updates for your VM](automation-tutorial-update-management.md)

* [Tutorial - Identify software on a VM](automation-tutorial-installed-software.md)

* [Tutorial - Troubleshoot changes on a VM](automation-tutorial-troubleshoot-changes.md)