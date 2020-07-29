---
title: Unlink workspace from Automation account for Update Management
description: This article tells how to unlink a Log Analytics workspace from the Automation account for Update Management
services: automation
ms.date: 4/11/2019
ms.topic: conceptual
ms.custom: mvc
---
# Unlink workspace from Automation account for Update Management

You can decide not to integrate your Automation account with a Log Analytics workspace during [Update Management](automation-update-management.md) operations. This article tells you to unlink the workspace from your account.

1. Sign in to Azure at https://portal.azure.com.

2. Remove Update Management for your VMs. See [Remove VMs from Update Management](automation-remove-vms-from-update-management.md).

3. If Update Management includes earlier versions of Azure SQL monitoring, setup of the feature might have created Automation assets that you should remove. For Update Management, you might want to remove the following items that are no longer needed:

   * Update schedules - Each has a name that matches the update deployment you created.
   * Hybrid worker groups created for Update Management - Each is named similarly to machine1.contoso.com_9ceb8108-26c9-4051-b6b3-227600d715c8).

4. Open your Automation account and select **Linked workspace** under **Related Resources** on the left.

5. On the Unlink workspace page, click **Unlink workspace** and respond to prompts.

   ![Unlink workspace page](media/automation-unlink-workspace-update-management/automation-unlink-workspace-blade.png).

6. While Azure Automation tries to unlink the Log Analytics workspace, you can track the progress under **Notifications** from the menu.

Alternatively, you can unlink your Log Analytics workspace from your Automation account from within the workspace:

1. On your workspace, select **Automation Account** under **Related Resources**. 
2. On the Automation Account page, select **Unlink account**.

## Next steps

* To work with the feature, see [Manage updates and patches for your Azure VMs](automation-tutorial-update-management.md).
* To troubleshoot feature errors, see [Troubleshoot Update Management issues](troubleshoot/update-management.md).
* To troubleshoot Windows update agent errors, see [Troubleshoot Windows update agent issues](troubleshoot/update-agent-issues.md).
* To troubleshoot Linux update agent errors, see [Troubleshoot Linux update agent issues](troubleshoot/update-agent-issues-linux.md).
