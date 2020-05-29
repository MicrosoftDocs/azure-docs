---
title: Remove VMs from Azure Automation Change Tracking and Inventory
description: This article tells how to remove VMs from Change Tracking and Inventory.
services: automation
ms.topic: conceptual
ms.date: 05/10/2018
ms.custom: mvc
---
# Remove VMs from Change Tracking and Inventory

When you're finished deploying changes to VMs in your environment, you can remove them from the [Change Tracking and Inventory](change-tracking.md) feature.

## To remove your VMs

1. From your Automation account, select **Change tracking** or **Inventory** under **Configuration Management**.

2. Use the following command to identify the UUID of a VM that you want to remove from management.

    ```azurecli
    az vm show -g MyResourceGroup -n MyVm -d
    ```

3. In your Log Analytics workspace under **General**, access the saved searches for the scope configuration `MicrosoftDefaultScopeConfig-ChangeTracking`.

4. For the saved search `MicrosoftDefaultComputerGroup`, click the ellipsis to the right and select **Edit**. 

5. Remove the UUID for the VM.

6. Repeat the steps for any other VMs to remove.

7. Save the saved search when you're finished editing it. 

## Next steps

* To continue working with Change Tracking and Inventory, see [Manage Change Tracking and Inventory](change-tracking-file-contents.md).
* To resolve general feature problems, see [Troubleshoot Change Tracking and Inventory issues](troubleshoot/change-tracking.md).