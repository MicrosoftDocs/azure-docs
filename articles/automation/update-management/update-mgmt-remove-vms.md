---
title: Remove VMs from Azure Automation Update Management
description: This article tells how to remove machines managed with Update Management.
services: automation
ms.topic: conceptual
ms.date: 07/28/2020
ms.custom: mvc
---
# Remove VMs from Update Management

When you're finished managing updates on your VMs in your environment, you can stop managing VMs with the [Update Management](update-mgmt-overview.md) feature.

## Sign into the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## To remove your VMs

1. From your Automation account, select **Update management** under **Update management**.

2. Use the following command to identify the UUID of a machine that you want to remove from management.

    ```azurecli
    az vm show -g MyResourceGroup -n MyVm -d
    ```

3. In your Log Analytics workspace under **General**, access the saved searches for the scope configuration `MicrosoftDefaultScopeConfig-Updates`.

4. For the saved search `MicrosoftDefaultComputerGroup`, click the ellipsis to the right and select **Edit**.

5. Remove the UUID for the VM.

6. Repeat the steps for any other VMs to remove.

7. Save the saved search when you're finished editing it.

>[!NOTE]
>Machines are still shown after you have unenrolled them because we report on all machines assessed in the last 24 hours. After disconnecting the machine, you need to wait 24 hours before they are no longer listed.

## Next steps

To re-enable managing your virtual machine, see [Enable Update Management by browsing the Azure portal](update-mgmt-enable-portal.md) or [Enable Update Management from an Azure VM](update-mgmt-enable-vm.md).