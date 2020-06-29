---
title: Enable Azure Automation Update Management from runbook
description: This article tells how to enable Update Management from a runbook.
services: automation
ms.topic: conceptual
ms.date: 05/10/2018
ms.custom: mvc
---
# Enable Update Management from a runbook

This article describes how you can use a runbook to enable the [Update Management](automation-update-management.md) feature for VMs in your environment. To enable Azure VMs at scale, you must enable an existing VM using Update Management. 

> [!NOTE]
> When enabling Update Management, only certain regions are supported for linking a Log Analytics workspace and an Automation account. For a list of the supported mapping pairs, see [Region mapping for Automation account and Log Analytics workspace](how-to/region-mappings.md).

## Prerequisites

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Automation account](automation-offering-get-started.md) to manage machines.
* A [virtual machine](../virtual-machines/windows/quick-create-portal.md).

## Enable Update Management

1. In your Automation account, select **Update Management** under **Update Management**.

2. Select the Log Analytics workspace, then click **Enable**. While Update Management is being enabled, a blue banner is shown. 

    ![Enable Update Management](media/automation-onboard-solutions/update-onboard.png)

## Select Azure VM to manage

With Update Management enabled, you can add an Azure VM to receive updates.

1. From your Automation account, select **Update management** under **Update management**.

2. Select **Add Azure VMs** to add your VM.

3. Choose the VM from the list and click **Enable** to set up the VM for updates. 

   ![Enable Update Management for VM](media/automation-onboard-solutions/enable-update.png)

    > [!NOTE]
    > If you try to enable another feature before setup of Update Management has completed, you receive this message: `Installation of another solution is in progress on this or a different virtual machine. When that installation completes the Enable button is enabled, and you can request installation of the solution on this virtual machine.`

## Install and update modules

It's required to update to the latest Azure modules and import the [Az.OperationalInsights](https://docs.microsoft.com/powershell/module/az.operationalinsights/?view=azps-3.7.0) module to successfully enable Update Management for your VMs.

1. In your Automation account, select **Modules** under **Shared Resources**. 
2. Select **Update Azure Modules** to update the Azure modules to the latest version. 
3. Click **Yes** to update all existing Azure modules to the latest version.

    ![Update modules](media/automation-onboard-solutions/update-modules.png)

4. Return to **Modules** under **Shared Resources**. 
5. Select **Browse gallery** to open the module gallery. 
6. Search for `Az.OperationalInsights` and import this module into your Automation account.

    ![Import OperationalInsights module](media/automation-onboard-solutions/import-operational-insights-module.png)

## Import a runbook to enable Update Management

1. In your Automation account, select **Runbooks** under **Process Automation**.
2. Select **Browse gallery**.
3. Search for `update and change tracking`.
4. Select the runbook and click **Import** on the View Source page. 
5. Click **OK** to import the runbook into the Automation account.

   ![Import runbook for setup](media/automation-onboard-solutions/import-from-gallery.png)

6. On the Runbook page, click **Edit**, then select **Publish**. 
7. On the Publish Runbook pane, click **Yes** to publish the runbook.

## Start the runbook

You must have enabled Update Management for an Azure VM to start this runbook. It requires an existing VM and resource group with the feature enabled for parameters.

1. Open the **Enable-MultipleSolution** runbook.

   ![Multiple solution runbook](media/automation-onboard-solutions/runbook-overview.png)

2. Click the start button and enter parameter values in the following fields:

   * **VMNAME** - The name of an existing VM to add to Update Management. Leave this field blank to add all VMs in the resource group.
   * **VMRESOURCEGROUP** - The name of the resource group for the VMs to enable.
   * **SUBSCRIPTIONID** - The subscription ID of the new VM to enable. Leave this field blank to use the subscription of the workspace. When you use a different subscription ID, add the Run As account for your Automation account as a contributor for the subscription.
   * **ALREADYONBOARDEDVM** - The name of the VM that is already manually enabled for updates.
   * **ALREADYONBOARDEDVMRESOURCEGROUP** - The name of the resource group to which the VM belongs.
   * **SOLUTIONTYPE** - Enter **Updates**.

   ![Enable-MultipleSolution runbook parameters](media/automation-onboard-solutions/runbook-parameters.png)

3. Select **OK** to start the runbook job.
4. Monitor progress and any errors on the runbook job page.

## Next steps

* To schedule a runbook, see [Manage schedules in Azure Automation](shared-resources/schedules.md).
* To use Update Management for VMs, see [Manage updates and patches for your Azure VMs](automation-tutorial-update-management.md).
* To troubleshoot general Update Management errors, see [Troubleshoot Update Management issues](troubleshoot/update-management.md).
* To troubleshoot problems with the Windows update agent, see [Troubleshoot Windows update agent issues](troubleshoot/update-agent-issues.md).
* To troubleshoot problems with the Linux update agent, see [Troubleshoot Linux update agent issues](troubleshoot/update-agent-issues-linux.md).