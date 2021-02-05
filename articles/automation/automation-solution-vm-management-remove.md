---
title: Remove Azure Automation Start/Stop VMs during off-hours overview
description: This article describes how to remove the Start/Stop VMs during off-hours feature and unlink an Automation account from the Log Analytics workspace.
services: automation
ms.subservice: process-automation
ms.date: 02/04/2021
ms.topic: conceptual
---

# Remove Start/Stop VMs during off-hours from Automation account

After you enable the Start/Stop VMs during off-hours feature to manage the running state of your Azure VMs, you may decide to stop using it. This can be done using one of the following methods based on the supported deployment models:

* Delete the resource group containing the Automation account and linked Azure Monitor Log Analytics workspace, all dedicated for this feature.
* Unlink the Log Analytics workspace from the Automation account and delete the Automation account dedicated for this feature.
* Delete the feature from an Automation account and linked workspace supporting other configuration management and monitoring requirements.

Deleting the feature only removes the associated runbooks, it doesn't delete the schedules or variables that were created when the feature was added.

## Delete the dedicated resource group

1. Sign in to Azure at [https://portal.azure.com](https://portal.azure.com).

2. Navigate to your Automation account, and select **Linked workspace** under **Related resources**.

3. Select **Go to workspace**.

4. Click **Solutions** under **General**.

5. On the Solutions page, select **Start-Stop-VM[Workspace]**.

6. On the VMManagementSolution[Workspace] page, select **Delete** from the menu.

    ![Delete VM management feature](media/automation-solution-vm-management/vm-management-solution-delete.png)

7. To delete the resource group created to only support Start/Stop VMs during off-hours, follow the steps outlined in the [Azure Resource Manager resource group and resource deletion](../azure-resource-manager/management/delete-resource-group.md) article.

## Delete the Automation account

To delete your Automation account dedicated to Start/Stop VMs during off-hours, perform the following steps.

1. Sign in to Azure at [https://portal.azure.com](https://portal.azure.com).

2. Navigate to your Automation account, and select **Linked workspace** under **Related resources**.

3. Select **Go to workspace**.

4. Click **Solutions** under **General**.

5. On the Solutions page, select **Start-Stop-VM[Workspace]**.

6. On the VMManagementSolution[Workspace] page, select **Delete** from the menu.

7. While the information is verified and the feature is deleted, you can track the progress under **Notifications**, chosen from the menu. You're returned to the Solutions page after the removal process.

8. The Automation account and Log Analytics workspace aren't deleted as part of this process. If you don't want to keep the Log Analytics workspace, you must manually delete it from the Azure portal:

    1. Search for and select **Log Analytics workspaces**.

    2. On the Log Analytics workspace page, select the workspace.

    3. Select **Delete** from the menu.

9. Navigate back to your Automation account, and select **Delete**.

10. At the prompt to confirm deletion, select **Yes**.

While the information is verified and the account is deleted, you can track the progress under **Notifications**, chosen from the menu.

## Delete the feature

To delete Start/Stop VMs during off-hours from your Automation account, perform the following steps.

1. Navigate to your Automation account, and select **Linked workspace** under **Related resources**.

2. Select **Go to workspace**.

3. Click **Solutions** under **General**.

4. On the Solutions page, select **Start-Stop-VM[Workspace]**.

5. On the VMManagementSolution[Workspace] page, select **Delete** from the menu.

    ![Delete VM management feature](media/automation-solution-vm-management/vm-management-solution-delete.png)

6. In the Delete Solution window, confirm that you want to delete the feature.

7. While the information is verified and the feature is deleted, you can track the progress under **Notifications**, chosen from the menu. You're returned to the Solutions page after the removal process.

8. The Automation account and Log Analytics workspace aren't deleted as part of this process. If you don't want to keep the Log Analytics workspace, you must manually delete it from the Azure portal:

    1. Search for and select **Log Analytics workspaces**.

    2. On the Log Analytics workspace page, select the workspace.

    3. Select **Delete** from the menu.

    4. If you don't want to keep the Azure Automation account [feature components](#components), you can manually delete each.

## Next steps

To re-enable this feature, see [Enable Start/Stop during off-hours](automation-solution-vm-management-enable.md).