---
title: Onboard Update Management, Change Tracking, and Inventory solutions from an Azure VM
description: Learn how to onboard an Azure virtual machine with Update Management, Change Tracking, and Inventory solutions that are part of Azure Automation.
services: automation
author: georgewallace
ms.author: gwallace
ms.date: 06/06/2018
ms.topic: conceptual
ms.service: automation
ms.custom: mvc
manager: carmonm
---

# Onboard Update Management, Change Tracking, and Inventory solutions from an Azure virtual machine

Azure Automation provides solutions to help you manage operating system security updates, track changes, and inventory what's installed on your computers. There are multiple ways to onboard machines. You can onboard the solution from a virtual machine, [from your Automation account](automation-onboard-solutions-from-automation-account.md), [from browsing multiple machines](automation-onboard-solutions-from-browse.md), or by using a [runbook](automation-onboard-solutions.md). This article covers onboarding these solutions from an Azure virtual machine.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Enable the solutions

Go to an existing virtual machine. Under **OPERATIONS**, select **Update management**, **Inventory**, or **Change tracking**.

To enable the solution for the VM only, ensure that **Enable for this VM** is selected. To onboard multiple machines to the solution, select **Enable for VMs in this subscription**, and then select **Click to select machines to enable**. To learn how to onboard multiple machines at once, see [Onboard Update Management, Change Tracking, and Inventory solutions](automation-onboard-solutions-from-automation-account.md).

Select the Azure Log Analytics workspace and Automation account, and then select **Enable** to enable the solution. The solution takes up to 15 minutes to enable.

![Onboard the Update Management solution](media/automation-onboard-solutions-from-vm/onboard-solution.png)

Go to the other solutions, and then select **Enable**. The Log Analytics and Automation account drop-down lists are disabled because these solutions use the same workspace and Automation account as the previously enabled solution.

> [!NOTE]
> **Change tracking** and **Inventory** use the same solution. When one of these solutions is enabled, the other is also enabled.

## Scope configuration

Each solution uses a scope configuration in the workspace to target the computers that get the solution. The scope configuration is a group of one or more saved searches that are used to limit the scope of the solution to specific computers. To access the scope configurations, in your Automation account, under **RELATED RESOURCES**, select **Workspace**. In the workspace, under **WORKSPACE DATA SOURCES**, select **Scope Configurations**.

If the selected workspace doesn't already have the Update Management or Change Tracking solutions, the following scope configurations are created:

* **MicrosoftDefaultScopeConfig-ChangeTracking**

* **MicrosoftDefaultScopeConfig-Updates**

If the selected workspace already has the solution, the solution isn't redeployed and the scope configuration isn't added.

Select the ellipses (**...**) on any of the configurations, and then select **Edit**. In the **Edit scope configuration** pane, select **Select Computer Groups**. The **Computer Groups** pane shows the saved searches that are used to create the scope configuration.

## Saved searches

When a computer is added to the Update Management, Change Tracking, or Inventory solutions, the computer is added to one of two saved searches in your workspace. The saved searches are queries that contain the computers that are targeted for these solutions.

Go to your workspace. Under **General**, select **Saved searches**. The two saved searches that are used by these solutions are shown in the following table:

|Name     |Category  |Alias  |
|---------|---------|---------|
|MicrosoftDefaultComputerGroup     |  ChangeTracking       | ChangeTracking__MicrosoftDefaultComputerGroup        |
|MicrosoftDefaultComputerGroup     | Updates        | Updates__MicrosoftDefaultComputerGroup         |

Select either of the saved searches to view the query that's used to populate the group. The following image shows the query and its results:

![Saved searches](media/automation-onboard-solutions-from-vm/logsearch.png)

## Next steps

Continue to the tutorials for the solutions to learn how to use them:

* [Tutorial - Manage updates for your VM](automation-tutorial-update-management.md)
* [Tutorial - Identify software on a VM](automation-tutorial-installed-software.md)
* [Tutorial - Troubleshoot changes on a VM](automation-tutorial-troubleshoot-changes.md)
