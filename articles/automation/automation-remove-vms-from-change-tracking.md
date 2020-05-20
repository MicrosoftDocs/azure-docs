---
title: Remove VMs from Azure Automation Change Tracking and Inventory
description: This article tells how to remove VMs from Change Tracking and Inventory.
services: automation
ms.topic: conceptual
ms.date: 05/10/2018
ms.custom: mvc
---
# Remove VMs from Change Tracking and Inventory

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

When you're finished deploying changes to VMs in your environment, you can remove them from the [Change Tracking and Inventory](change-tracking.md) feature.

1. From your Automation account, select **Change tracking** or **Inventory** under **Configuration Management**.

2. Use the following command to identify the UUID of a VM that you want to remove from management.

    ```azurecli
    az vm show -g MyResourceGroup -n MyVm -d
    ```

3. In your Log Analytics workspace under **General**, access the saved searches.

4. For the saved search `MicrosoftDefaultComputerGroup`, click the ellipsis to the right and select **Edit**. 

5. Remove the UUID for the VM.

6. Repeat the steps for any other VMs to remove.

7. Save the saved search when you're finished editing it. 

## Next steps

* [Change Tracking and Inventory overview](change-tracking.md)
* [Manage Change Tracking and Inventory](change-tracking-file-contents.md)
* [Unlink workspace from Automation account for Change Tracking and Inventory](automation-unlink-workspace-change-tracking.md)
* [Enable Change Tracking and Inventory from an Automation account](automation-enable-changes-from-auto-acct.md)
* [Enable Change Tracking and Inventory from the Azure portal](automation-enable-changes-from-browse.md)
* [Enable Change Tracking and Inventory from a runbook](automation-enable-changes-from-runbook.md)
* [Enable Change Tracking and Inventory from an Azure VM](automation-enable-changes-from-vm.md)
* [Troubleshoot changes on an Azure VM](automation-tutorial-troubleshoot-changes.md)
* [Troubleshoot Change Tracking and Inventory issues](troubleshoot/change-tracking.md)