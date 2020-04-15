---
title: Onboard update, change tracking, and inventory solutions to Azure Automation
description: Learn how to onboard update and change tracking solutions to Azure Automation.
services: automation
ms.topic: tutorial
ms.date: 05/10/2018
ms.custom: mvc
---
# Onboard update, change tracking, and inventory solutions to Azure Automation

In this tutorial, you learn how to automatically onboard Update, Change Tracking, and Inventory solutions for VMs to Azure Automation:

> [!div class="checklist"]
> * Onboard an Azure VM
> * Enable solutions
> * Install and update modules
> * Import the onboarding runbook
> * Start the runbook

## Prerequisites

To complete this tutorial, the following are required:

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Automation account](automation-offering-get-started.md) to manage machines.
* A [virtual machine](../virtual-machines/windows/quick-create-portal.md) to onboard.

## Onboard an Azure VM

There are multiple ways to onboard machines, you can onboard the solution [from a virtual machine](automation-onboard-solutions-from-vm.md), [from browsing multiple machines](automation-onboard-solutions-from-browse.md) [from your Automation account](automation-onboard-solutions-from-automation-account.md),  or by runbook. This tutorial walks through enabling Update Management through a runbook. To onboard Azure Virtual Machines at scale, an existing VM must be onboarded with the Change tracking or Update management solution. In this step, you onboard a virtual machine with Update management, and Change tracking.

### Enable Change Tracking and Inventory

The Change Tracking and Inventory solutions allow you to [track changes](automation-vm-change-tracking.md) and [inventory](automation-vm-inventory.md) on your virtual machines. In this step, you enable the solutions on a virtual machine.

1. In the Azure portal, select **Automation Accounts**, and then select your automation account in the list.
1. Select **Inventory** under **Configuration Management**.
1. Select an existing Log Analytics workspace or create a new one. 
1. Click **Enable**.

    ![Onboard Update solution](media/automation-onboard-solutions/inventory-onboard.png)

### Enable Update Management

The Update Management solution allows you to manage updates and patches for your Azure Windows VMs. You can assess the status of available updates, schedule installation of required updates, and review deployment results to verify updates were applied successfully to the VM. In this step, you enable the solution for your VM.

1. In your Automation account, select **Update Management** in the **Update Management** section.
1. The Log analytics workspace selected is the workspace used in the preceding step. Click **Enable** to onboard the Update management solution. While the Update management solution is being installed, a blue banner is shown. 

    ![Onboard Update solution](media/automation-onboard-solutions/update-onboard.png)

### Select Azure VM to be managed

Now that the solutions are enabled, you can add an Azure VM to onboard to those solutions.

1. From your Automation account, select **Change tracking** under **Configuration Management**. 
2. On the Change tracking page, click **Add Azure VMs** to add your VM.

3. Select your VM from the list and click **Enable**. This action enables the Change Tracking and Inventory solutions for the VM.

   ![Enable update solution for vm](media/automation-onboard-solutions/enable-change-tracking.png)

4. When the VM onboarding notification completes, select **Update management** under **Update Management**.

5. Select **Add Azure VMs** to add your VM.

6. Select your VM from the list and select **Enable**. This action enables the Update Management solution for the VM.

   ![Enable update solution for vm](media/automation-onboard-solutions/enable-update.png)

> [!NOTE]
> If you don't wait for the other solution to complete, when Enabling the next solution, you receive the message: `Installation of another solution is in progress on this or a different virtual machine. When that installation completes the Enable button is enabled, and you can request installation of the solution on this virtual machine.`

## Install and update modules

It's required to update to the latest Azure modules and import the [Az.OperationalInsights](https://docs.microsoft.com/en-us/powershell/module/az.operationalinsights/?view=azps-3.7.0) module to successfully automate solution onboarding.

## Update Azure Modules

1. In your Automation account, select **Modules** under **Shared Resources**. 
2. Select **Update Azure Modules** to update the Azure modules to the latest version. 
3. Click **Yes** to update all existing Azure modules to the latest version.

![Update modules](media/automation-onboard-solutions/update-modules.png)

### Install AzureRM.OperationalInsights module

1. In the Automation account, select **Modules** under **Shared Resources**. 
2. Select **Browse gallery** to open up the module gallery. 
3. Search for Az.OperationalInsights and import this module into the Automation account.

![Import OperationalInsights module](media/automation-onboard-solutions/import-operational-insights-module.png)

## Import the onboarding runbook

1. In your Automation account, select **Runbooks** under **Process Automation**.
1. Select **Browse gallery**.
1. Search for `update and change tracking`.
3. Select the runbook and click **Import** on the View Source page. 
4. Click **OK** to import the runbook into the Automation account.

   ![Import onboarding runbook](media/automation-onboard-solutions/import-from-gallery.png)

6. On the Runbook page, click **Edit**, then select **Publish**. 
7. On the Publish Runbook pane, click **Yes** to publish the runbook.

## Start the runbook

You must have onboarded either change tracking or update solutions to an Azure VM to start this runbook. It requires an existing virtual machine and resource group with the solution onboarded for parameters.

1. Open the **Enable-MultipleSolution** runbook.

   ![Multiple solution runbooks](media/automation-onboard-solutions/runbook-overview.png)

1. Click the start button and enter the following values for parameters.

   * **VMNAME** - Leave blank. The name of an existing VM to onboard to update or change tracking solution. By leaving this value blank, all VMs in the resource group are onboarded.
   * **VMRESOURCEGROUP** - The name of the resource group for the VMs to be onboarded.
   * **SUBSCRIPTIONID** - Leave blank. The subscription ID of the new VM to be onboarded. If left blank, the subscription of the workspace is used. When a different subscription ID is given, the RunAs account for this automation account should be added as a contributor for this subscription also.
   * **ALREADYONBOARDEDVM** - The name of the VM that was manually onboarded to either the Updates or ChangeTracking solution.
   * **ALREADYONBOARDEDVMRESOURCEGROUP** - The name of the resource group to which the VM belongs.
   * **SOLUTIONTYPE** - Enter **Updates** or **ChangeTracking**.

   ![Enable-MultipleSolution runbook parameters](media/automation-onboard-solutions/runbook-parameters.png)

1. Select **OK** to start the runbook job.
1. Monitor progress and any errors on the runbook job page.

## Clean up resources

To remove a VM from Update Management:

1. In your Log Analytics workspace, remove the VM from the saved search for the scope configuration `MicrosoftDefaultScopeConfig-Updates`. Saved searches can be found under **General** in your workspace.
2. Remove the [Log Analytics agent for Windows](../azure-monitor/learn/quick-collect-windows-computer.md#clean-up-resources) or the [Log Analytics agent for Linux](../azure-monitor/learn/quick-collect-linux-computer.md#clean-up-resources).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Onboard an Azure virtual machine manually.
> * Install and update required Azure modules.
> * Import a runbook that onboards Azure VMs.
> * Start the runbook that onboards Azure VMs automatically.

Follow this link to learn more about scheduling runbooks.

> [!div class="nextstepaction"]
> [Scheduling runbooks](automation-schedules.md).
