---
title: Remove Azure Automation Update Management feature 
description: This article tells how to stop using Update Management and unlink an Automation account from the Log Analytics workspace. 
services: automation
ms.date: 07/28/2020
ms.topic: conceptual
ms.custom: mvc
---
# Remove Update Management from Automation account

After you enable management of updates on your virtual machines using Azure Automation Update Management, you may decide to stop using it and remove the configuration from the account and linked Log Analytics workspace.  This article tells you how to completely remove Update Management from the managed VMs, your Automation account, and Log Analytics workspace.

## Sign into the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Remove management of VMs

Before removing Update Management, you need to first stop managing your VMs. See [Remove VMs from Update Management](remove-vms.md) to unenroll them from the feature.

## Remove UpdateManagement solution

Before you can unlink the Automation account from the workspace, you need to follow these steps to completely remove Update Management. You'll remove the **Updates** solution from the workspace.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the Azure portal, select **All services**. In the list of resources, type **Log Analytics**. As you begin typing, the list filters suggestions based on your input. Select **Log Analytics**.

3. In your list of Log Analytics workspaces, select the workspace you chose when you enabled Update Management.

4. On the left, select **Solutions**.  

5. In the list of solutions, select **Updates(workspace name)**. On the **Overview** page for the solution, select **Delete**. When prompted to confirm, select **Yes**.

## Unlink workspace from Automation account

1. In the Azure portal, select **Automation Accounts**.

2. Open your Automation account and select **Linked workspace** under **Related Resources** on the left.

3. On the **Unlink workspace** page, select **Unlink workspace** and respond to prompts.

   ![Unlink workspace page](media/remove-feature/automation-unlink-workspace-blade.png)

While it attempts to unlink the Log Analytics workspace, you can track the progress under **Notifications** from the menu.

Alternatively, you can unlink your Log Analytics workspace from your Automation account from within the workspace:

1. In the Azure portal, select **Log Analytics**.

2. From the workspace, select **Automation Account** under **Related Resources**.

3. On the Automation Account page, select **Unlink account**.

While it attempts to unlink the Automation account, you can track the progress under **Notifications** from the menu.

## Cleanup Automation account

If Update Management was configured to support earlier versions of Azure SQL monitoring, setup of the feature might have created Automation assets that you should remove. For Update Management, you might want to remove the following items that are no longer needed:

   * Update schedules - Each has a name that matches the update deployment you created.
   * Hybrid worker groups created for Update Management - Each is named similarly to *machine1.contoso.com_9ceb8108-26c9-4051-b6b3-227600d715c8)*.

## Next steps

To re-enable this feature, see [Enable Update Management from an Automation account](enable-from-automation-account.md), [Enable Update Management by browsing the Azure portal](enable-from-portal.md), [Enable Update Management from a runbook](enable-from-runbook.md), or [Enable Update Management from an Azure VM](enable-from-vm.md).
