---
title: Enable Azure Automation Change Tracking and Inventory from a runbook
description: This article tells how to enable Change Tracking and Inventory from a runbook.
services: automation
ms.subservice: change-inventory-management
ms.topic: conceptual
ms.date: 10/14/2020
---

# Enable Change Tracking and Inventory from a runbook

This article describes how you can use a runbook to enable [Change Tracking and Inventory](overview.md) for VMs in your environment. To enable Azure VMs at scale, you must enable an existing VM using Change Tracking and Inventory.

> [!NOTE]
> When enabling Change Tracking and Inventory, only certain regions are supported for linking a Log Analytics workspace and an Automation account. For a list of the supported mapping pairs, see [Region mapping for Automation account and Log Analytics workspace](../how-to/region-mappings.md).

This method uses two runbooks:

* **Enable-MultipleSolution** - The primary runbook that prompts for configuration information, queries the specified VM and performs other validation checks, and then invokes the **Enable-AutomationSolution** runbook to configure Change Tracking and Inventory for each VM within the specified resource group.
* **Enable-AutomationSolution** - Enables Change Tracking and Inventory for one or more VMs specified in the target resource group. It verifies prerequisites are met, verifies the Log Analytics VM extension is installed and installs if not found, and adds the VMs to the scope configuration in the specified Log Analytics workspace linked to the Automation account.

## Prerequisites

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Automation account](../automation-security-overview.md) to manage machines.
* [Log Analytics workspace](../../azure-monitor/logs/log-analytics-workspace-overview.md)
* A [virtual machine](../../virtual-machines/windows/quick-create-portal.md).
* Two Automation assets, which are used by the **Enable-AutomationSolution** runbook. This runbook, if it doesn't already exist in your Automation account, is automatically imported by the **Enable-MultipleSolution** runbook during its first run.
    * *LASolutionSubscriptionId*: Subscription ID of where the Log Analytics workspace is located.
    * *LASolutionWorkspaceId*: Workspace ID of the Log Analytics workspace linked to your Automation account.

    These variables are used to configure the workspace of the onboarded VM. If these are not specified, the script first searches for any VM onboarded to Change Tracking and Inventory in its subscription, followed by the subscription the Automation account is in, followed by all other subscriptions your user account has access to. If not properly configured, this may result in your machines getting onboarded to some random Log Analytics workspace.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Change Tracking and Inventory

1. In the Azure portal, navigate to **Automation Accounts**. On the **Automation Accounts** page, select your account from the list.

1. In your Automation account, select **Inventory** or **Change Tracking** under **Configuration Management**.

1. Select the Log Analytics workspace, then click **Enable**. While Inventory or Change Tracking is being enabled, a banner is shown.

    ![Enable Change Tracking and Inventory](media/enable-from-automation-account/enable-feature.png)

## Install and update modules

It's required to update to the latest Azure modules and import the [Az.OperationalInsights](/powershell/module/az.operationalinsights) module to successfully enable Update Management for your VMs with the runbook.

1. In your Automation account, select **Modules** under **Shared Resources**.

2. Select **Update Azure Modules** to update the Azure modules to the latest version.

3. Click **Yes** to update all existing Azure modules to the latest version.

    ![Update modules](media/enable-from-runbook/update-modules.png)

4. Return to **Modules** under **Shared Resources**.

5. Select **Browse gallery** to open the module gallery.

6. Search for `Az.OperationalInsights` and import this module into your Automation account.

    ![Import OperationalInsights module](media/enable-from-runbook/import-operational-insights-module.png)

## Select Azure VM to manage

With Change Tracking and Inventory enabled, you can add an Azure VM for management by the feature.

1. From your Automation account, select **Change tracking** or **Inventory** under **Configuration Management**.

2. Click **Add Azure VMs** to add your VM.

3. Choose your VM from the list and click **Enable**. This action enables Change Tracking and Inventory for the VM.

   ![Enable Change Tracking and Inventory for VM](media/enable-from-runbook/enable-azure-vm.png)

    > [!NOTE]
    > If you try to enable another feature before setup of Change Tracking and Inventory has completed, you receive this message: `Installation of another solution is in progress on this or a different virtual machine. When that installation completes the Enable button is enabled, and you can request installation of the solution on this virtual machine.`

## Import a runbook to enable Change Tracking and Inventory

1. In your Automation account, select **Runbooks** under **Process Automation**.

2. Select **Browse gallery**.

3. Search for **update and change tracking**.

4. Select the runbook and click **Import** on the **View Source** page.

5. Click **OK** to import the runbook into the Automation account.

   ![Import runbook for setup](media/enable-from-runbook/import-from-gallery.png)

6. On the **Runbook** page, select the **Enable-MultipleSolution** runbook and then click **Edit**. On the textual editor, select  **Publish**.

7. When prompted to confirm, click **Yes** to publish the runbook.

## Start the runbook

You must have enabled Change Tracking and Inventory for an Azure VM to start this runbook. It requires an existing VM and resource group with the feature enabled in order to configure one or more VMs in the target resource group.

1. Open the **Enable-MultipleSolution** runbook.

   ![Multiple solution runbook](media/enable-from-runbook/runbook-overview.png)

2. Click the start button and enter parameter values in the following fields:

   * **VMNAME** - The name of an existing VM to add to Change Tracking and Inventory. Leave this field blank to add all VMs in the resource group.
   * **VMRESOURCEGROUP** - The name of the resource group for the VMs to enable.
   * **SUBSCRIPTIONID** - The subscription ID of the new VM to enable. Leave this field blank to use the subscription of the workspace. When you use a different subscription ID, add the Run As account for your Automation account as a contributor for the subscription.
   * **ALREADYONBOARDEDVM** - The name of the VM that is already manually enabled for updates.
   * **ALREADYONBOARDEDVMRESOURCEGROUP** - The name of the resource group to which the VM belongs.
   * **SOLUTIONTYPE** - Enter **ChangeTracking**.

   ![Enable-MultipleSolution runbook parameters](media/enable-from-runbook/runbook-parameters.png)

3. Select **OK** to start the runbook job.

4. Monitor progress of the runbook job and any errors from the **Jobs** page.

## Next steps

* To schedule a runbook, see [Manage schedules in Azure Automation](../shared-resources/schedules.md).

* For details of working with the feature, see [Manage Change Tracking](manage-change-tracking.md) and [Manage Inventory](manage-inventory-vms.md).

* To troubleshoot general problems with the feature, see [Troubleshoot Change Tracking and Inventory issues](../troubleshoot/change-tracking.md).


