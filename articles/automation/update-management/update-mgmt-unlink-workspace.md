---
title: Unlink workspace from Automation account for Update Management
description: This article tells how to unlink a Log Analytics workspace from the Automation account for Update Management
services: automation
ms.date: 4/11/2019
ms.topic: conceptual
ms.custom: mvc
---
# Unlink workspace from Automation account for Update Management

You can decide to stop integrating your Automation account with a Log Analytics workspace if you no longer want to use [Update Management](automation-update-management.md). This article tells you how to unlink the workspace from your account.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Remove Update Management for your VMs. See [Remove VMs from Update Management](update-mgmt-remove-vms.md).

3. If Update Management includes earlier versions of Azure SQL monitoring, setup of the feature might have created Automation assets that you should remove. For Update Management, you might want to remove the following items that are no longer needed:

   * Update schedules - Each has a name that matches the update deployment you created.
   * Hybrid worker groups created for Update Management - Each is named similarly to *machine1.contoso.com_9ceb8108-26c9-4051-b6b3-227600d715c8)*.

4. Open your Automation account and select **Linked workspace** under **Related Resources** on the left.

5. On the Unlink workspace page, select **Unlink workspace** and respond to prompts.

   ![Unlink workspace page](media/update-mgmt-unlink-workspace/automation-unlink-workspace-blade.png).

6. While Azure Automation tries to unlink the Log Analytics workspace, you can track the progress under **Notifications** from the menu.

Alternatively, you can unlink your Log Analytics workspace from your Automation account from within the workspace:

1. In the Azure portal, select **All services**. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics workspaces**.

2. From the workspace, select **Automation Account** under **Related Resources**.

3. On the Automation Account page, select **Unlink account**.

## Next steps

* To work with the feature, see [Manage updates and patches for your Azure VMs](update-mgmt-manage-updates-for-vms.md).
