---
title: Boot diagnostics for Linux virtual machines in Azure | Microsoft Doc
description: Overview of the two debugging features for Linux virtual machines in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines-linux
author: Deland-Han
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.workload: infrastructure
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 03/19/2018
ms.author: delhan
---
# How to use boot diagnostics to troubleshoot Linux virtual machines in Azure

Support for two debugging features is now available in Azure: Console Output and Screenshot support for Azure Virtual Machines Resource Manager deployment model. 

When bringing your own image to Azure or even booting one of the platform images, there can be many reasons why a Virtual Machine gets into a non-bootable state. These features enable you to easily diagnose and recover your Virtual Machines from boot failures.

For Linux Virtual Machines, you can easily view the output of your console log from the Portal:

![Azure portal](./media/boot-diagnostics/screenshot1.png)
 
However, for both Windows and Linux Virtual Machines, Azure also enables you to see a screenshot of the VM from the hypervisor:

![Error](./media/boot-diagnostics/screenshot2.png)

Both of these features are supported for Azure Virtual Machines in all regions. Note, screenshots, and output can take up to 10 minutes to appear in your storage account.

## Common boot errors

- [File system issues](https://support.microsoft.com/help/3213321/linux-recovery-cannot-ssh-to-linux-vm-due-to-file-system-errors-fsck) 
- [Kernel Issues](https://support.microsoft.com/help/4091524/how-recovery-azure-linux-vm-from-kernel-related-boot-related-issues/) 
- [FSTAB errors](https://support.microsoft.com/help/3206699/azure-linux-vm-cannot-start-because-of-fstab-errors)

## Enable diagnostics on a new virtual machine
1. When creating a new virtual machine from the Azure portal, select the **Azure Resource Manager** from the deployment model dropdown:
 
    ![Resource Manager](./media/boot-diagnostics/screenshot3.jpg)

2. In **Settings**, enable the **Boot diagnostics**, and then select a storage account that you would like to place these diagnostic files.
 
    ![Create VM](./media/boot-diagnostics/create-storage-account.png)

    > [!NOTE]
    > The Boot diagnostics feature does not support premium storage account. If you use the premium storage account for Boot diagnostics, you might receive the StorageAccountTypeNotSupported error when you start the VM. 
    >
    > 

3. If you are deploying from an Azure Resource Manager template, navigate to your virtual machine resource and append the diagnostics profile section. Remember to use the “2015-06-15” API version header.

    ```json
    {
          "apiVersion": "2015-06-15",
          "type": "Microsoft.Compute/virtualMachines",
          … 
    ```

4. The diagnostics profile enables you to select the storage account where you want to put these logs.

    ```json
            "diagnosticsProfile": {
                "bootDiagnostics": {
                "enabled": true,
                "storageUri": "[concat('http://', parameters('newStorageAccountName'), '.blob.core.windows.net')]"
                }
            }
            }
        }
    ```

To deploy a sample virtual machine with boot diagnostics enabled, check out our repo here.

## Enable Boot diagnostics on existing virtual machine 

To enable Boot diagnostics on an existing virtual machine, follow these steps:

1. Log in to the [Azure portal](https://portal.azure.com), and then select the virtual machine.
2. In **Support + troubleshooting**, select **Boot diagnostics** > **Settings**, change the status to **On**, and then select a storage account. 
4. Make sure that the Boot diagnostics option is selected and then save the change.

    ![Update Existing VM](./media/boot-diagnostics/enable-for-existing-vm.png)

3. Restart the VM to take effect.

## Next steps

If you see a "Failed to get contents of the log" error when you use VM Boot Diagnostics, see [Failed to get contents of the log error in VM Boot Diagnostics](https://support.microsoft.com/help/4094480/failed-to-get-contents-of-the-log-error-in-vm-boot-diagnostics-in-azur).