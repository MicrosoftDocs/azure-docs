---
title: Delete your Azure Automation account
description: This article tells how to delete your Automation account across the different configuration scenarios.
services: automation
ms.service: automation
ms.subservice: process-automation
ms.date: 03/18/2021
ms.topic: conceptual
---

# How to delete your Azure Automation account

After you enable an Azure Automation account to help automate IT or business process, or enable its other features to support operations management of your Azure and non-Azure machines such as Update Management, you may decide to stop using the Automation account. If you have enabled features that depend on integration with an Azure Monitor Log Analytics workspace, there are more steps required to complete this action.

Removing your Automation account can be done using one of the following methods based on the supported deployment models:

* Delete the resource group containing the Automation account.
* Delete the resource group containing the Automation account and linked Azure Monitor Log Analytics workspace, if:

    * The account and workspace is dedicated to supporting Update Management, Change Tracking and Inventory, and/or Start/Stop VMs during off-hours.
    * The account is dedicated to process automation and integrated with a workspace to send runbook job status and job streams.

* Unlink the Log Analytics workspace from the Automation account and delete the Automation account.
* Delete the feature from your linked workspace, unlink the account from the workspace, and then delete the Automation account.

This article tells you how to completely remove your Automation account through the Azure portal, PowerShell, the Azure CLI, or the REST API.

## Delete the dedicated resource group

To delete your Automation account, and also the Log Analytics workspace if linked to the account, created in the same resource group dedicated to the account, follow the steps outlined in the [Azure Resource Manager resource group and resource deletion](../azure-resource-manager/management/delete-resource-group.md) article.

## Delete the Automation account

This section provides steps for deleting your Automation account based on the two deployment scenarios:

1. Your Automation account is not linked to a Log Analytics workspace.
1. Your Automation account supporting shared capabilities and is linked to a Log Analytics workspace. It could be linked to the workspace in support of forwarding job status and job streams and/or, supporting Update Management, Change Tracking and Inventory, and/or Start/Stop VMs during off-hours.

### Standalone Automation account

If your Automation account is not linked to a Log Analytics workspace, perform the following steps to delete it.

1. Sign in to Azure at [https://portal.azure.com](https://portal.azure.com).

2. In the Azure portal, navigate to **Automation Accounts**.

3. Open your Automation account and select **Delete** from the menu.

While the information is verified and the account is deleted, you can track the progress under **Notifications**, chosen from the menu.

### Standalone Automation account linked to workspace

If your Automation account is linked to a Log Analytics workspace to collect job streams and job logs, perform the following steps to delete the account.

There are two options for unlinking the Log Analytics workspace from your Automation account. You can perform this process from the Automation account or from the linked workspace.

To unlink from your Automation account, perform the following steps.

1. In the Azure portal, navigate to **Automation Accounts**.

2. Open your Automation account and select **Linked workspace** under **Related Resources** on the left.

3. On the **Unlink workspace** page, select **Unlink workspace**, and respond to prompts.

   ![Unlink workspace page](media/automation-solution-vm-management-remove/automation-unlink-workspace-blade.png)

    While it attempts to unlink the Log Analytics workspace, you can track the progress under **Notifications** from the menu.

To unlink from the workspace, perform the following steps.

1. In the Azure portal, navigate to **Log Analytics workspaces**.

2. From the workspace, select **Automation Account** under **Related Resources**.

3. On the Automation Account page, select **Unlink account**, and respond to prompts.

While it attempts to unlink the Automation account, you can track the progress under **Notifications** from the menu.

### Delete Automation account

1. In the Azure portal, navigate to **Automation Accounts**.

2. Open your Automation account and select **Delete** from the menu.

While the information is verified and the account is deleted, you can track the progress under **Notifications**, chosen from the menu.

### Shared capability Automation account

To delete your Automation account linked to a Log Analytics workspace in support of Update Management, Change Tracking and Inventory, and/or Start/Stop VMs during off-hours, perform the following steps.

1. Sign in to Azure at [https://portal.azure.com](https://portal.azure.com).

2. Navigate to your Automation account, and select **Linked workspace** under **Related resources**.

3. Select **Go to workspace**.

4. Click **Solutions** under **General**.

5. On the Solutions page, select one of the following based on the feature(s) deployed in the account:

   * For Start/Stop VMs during off-hours, select **Start-Stop-VM[workspace name]**.
   * For Update Management, select **Updates(workspace name)**.
   * For Change Tracking and Inventory, select **ChangeTracking(workspace name)**.

6. On the **VMManagementSolution[Workspace]** page, select **Delete** from the menu. If more than one of the above listed features are deployed to the Automation account and linked workspace, you need to select and delete each one before proceeding.

7. While the information is verified and the feature is deleted, you can track the progress under **Notifications**, chosen from the menu. You're returned to the Solutions page after the removal process.

### Unlink workspace from Automation account

There are two options for unlinking the Log Analytics workspace from your Automation account. You can perform this process from the Automation account or from the linked workspace.

To unlink from your Automation account, perform the following steps.

1. In the Azure portal, navigate to **Automation Accounts**.

2. Open your Automation account and select **Linked workspace** under **Related Resources** on the left.

3. On the **Unlink workspace** page, select **Unlink workspace**, and respond to prompts.

   ![Unlink workspace page](media/automation-solution-vm-management-remove/automation-unlink-workspace-blade.png)

    While it attempts to unlink the Log Analytics workspace, you can track the progress under **Notifications** from the menu.

To unlink from the workspace, perform the following steps.

1. In the Azure portal, navigate to **Log Analytics workspaces**.

2. From the workspace, select **Automation Account** under **Related Resources**.

3. On the Automation Account page, select **Unlink account**, and respond to prompts.

While it attempts to unlink the Automation account, you can track the progress under **Notifications** from the menu.

### Delete Automation account

1. In the Azure portal, navigate to **Automation Accounts**.

2. Open your Automation account and select **Delete** from the menu.

While the information is verified and the account is deleted, you can track the progress under **Notifications**, chosen from the menu.

## Next steps

To create an Automation account from the Azure portal, see [Create a standalone Azure Automation account](automation-create-standalone-account.md). If you prefer to create your account using a template, see [Create an Automation account using an Azure Resource Manager template](quickstart-create-automation-account-template.md).