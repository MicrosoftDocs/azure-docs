---
title: Learn how to onboard Update Management, Change Tracking, and Inventory solutions in Azure Automation
description: Learn how to onboard an Azure Virtual machine with Update Management, Change Tracking, and Inventory solutions that are part of Azure Automation
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 03/16/2018
ms.topic: article
manager: carmonm
ms.custom: mvc
---

# Onboard Update Management, Change Tracking, and Inventory solutions

Azure Automation provides solutions to manage operating system security updates, track changes, and inventory what is installed on your computers. There are multiple ways to onboard machines, you can onboard the solution [from a virtual machine](automation-onboard-solutions-from-vm.md), from your Automation account, or by [runbook](automation-onboard-solutions.md). This article covers onboarding these solutions from your Automation account.

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

The two Scope Configurations created by default **MicrosoftDefaultScopeConfig-ChangeTracking** and **MicrosoftDefaultScopeConfig-Updates**.

## Saved searches

When a computer is added to the Update Management or the Change Tracking and Inventory solutions, they are added to one of two saved searches in your workspace. These saved searches are queries that contain the computers that are targeted for these solutions.

Navigate to your Automation account and select **Saved searches** under **General**. The two saved searches used by these solutions can be seen in the following table:

|Name     |Category  |Alias  |
|---------|---------|---------|
|MicrosoftDefaultComputerGroup     |  ChangeTracking       | ChangeTracking__MicrosoftDefaultComputerGroup        |
|MicrosoftDefaultComputerGroup     | Updates        | Updates__MicrosoftDefaultComputerGroup         |

Select either saved search to view the query used to populate the group. The following image shows the query and its results:

![Saved searches](media/automation-onboard-solutions-from-automation-account/savedsearch.png)

## Onboard an Azure machine

From your Automation account select **Inventory** or **Change tracking** under **CONFIGURATION MANAGEMENT**, or **Update management** under **UPDATE MANAGEMENT**.

Click **+ Add Azure VM**, select a VM from the list. On the **Update Management** page, click **Enable**. This adds the current VM to the computer group saved search for the solution.

## Onboard a non-Azure machine

From your Automation account select **Inventory** or **Change tracking** under **CONFIGURATION MANAGEMENT**, or **Update management** under **UPDATE MANAGEMENT**.

Click **Add non-Azure machine**. This opens up a new browser window with the instructions on how to install and configure the Microsoft Monitoring Agent on the machine so the machine can begin reporting to the solution. If you are onboarding a machine that currently managed by System Center Operations Manager, a new agent is not required, the workspace information is entered into the existing agent.

## Onboard machines in the workspace

From your Automation account select **Inventory** or **Change tracking** under **CONFIGURATION MANAGEMENT**, or **Update management** under **UPDATE MANAGEMENT**.

Select **Manage machines**. This opens up the **Manage Machines** page. This page allows you to enable the solution on a select set of machines, all available machines, or enable the solution for all current machines and enable it on all future machines.

![Saved searches](media/automation-onboard-solutions-from-automation-account/managemachines.png)

### Selected machines

To enable the solution for one or more machines, select **Enable on selected machines** and click **add** next to each machine you want to add to the solution. This task adds the selected machine names to the computer group saved search query for the solution.

### All available machines

To enable the solution for all available machines, select **Enable on all available machines**. This disables the control to add machines individually. This task adds all the names of the machines reporting to the workspace to the computer group saved search query.

### All available and future machines

To enable the solution for all available machines and all future machines, select **Enable on all available and future machines**. This option deletes the saved searches and Scope Configurations from the workspace. This opens the solution to all Azure and non-Azure machines that are reporting to the workspace.

## Next steps

Continue to the tutorials on the solutions to learn how to use them.

* [Tutorial - Manage Updates for your VM](automation-tutorial-update-management.md)

* [Tutorial - Identify software on a VM](automation-tutorial-installed-software.md)

* [Tutorial - Troubleshoot changes on a VM](automation-tutorial-troubleshoot-changes.md)