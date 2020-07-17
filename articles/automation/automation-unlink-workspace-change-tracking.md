---
title: Unlink workspace from Automation account for Change Tracking and Inventory
description: This article tells how to unlink a Log Analytics workspace from the Automation account for Change Tracking and Inventory
services: automation
ms.date: 4/11/2019
ms.topic: conceptual
ms.custom: mvc
---
# Unlink workspace from Automation account

You can decide not to integrate your Automation account with a Log Analytics workspace when enabling [Change Tracking and Inventory](change-tracking.md) operations. This article tells you to unlink the workspace from your account.

1. Sign in to Azure at https://portal.azure.com.

2. Remove Update Management for your VMs. See [Remove VMs from Change Tracking and Inventory](automation-remove-vms-from-change-tracking.md).

3. If Change Tracking and Inventory includes earlier versions of Azure SQL monitoring, setup of the feature might have created Automation assets that you should remove. Locate these assets and remove them.

4. Open your Automation account and select **Linked workspace** under **Related Resources** on the left.

5. On the Unlink workspace page, click **Unlink workspace** and respond to prompts.

   ![Unlink workspace page](media/automation-unlink-workspace-change-tracking/automation-unlink-workspace-blade.png).

6. While Azure Automation tries to unlink the Log Analytics workspace, you can track the progress under **Notifications** from the menu.

Alternatively, you can unlink your Log Analytics workspace from your Automation account from within the workspace:

1. On your workspace, select **Automation Account** under **Related Resources**. 
2. On the Automation Account page, select **Unlink account**.

## Next steps

* To work with Change Tracking and Inventory, see [Manage Change Tracking and Inventory](change-tracking-file-contents.md).
* To troubleshoot general feature issues, see [Troubleshoot Change Tracking and Inventory issues](troubleshoot/change-tracking.md).
