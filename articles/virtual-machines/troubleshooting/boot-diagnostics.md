---
title: Boot diagnostics for VMs in Azure | Microsoft Doc
description: Overview of the two debugging features for virtual machines in Azure
services: virtual-machines
author: Deland-Han
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.topic: troubleshooting
ms.date: 06/15/2018
ms.author: delhan
---

# How to use boot diagnostics to troubleshoot virtual machines in Azure

Support for two debugging features is now available in Azure: Console Output and Screenshot support for Azure virtual machines Resource Manager deployment model. 

When bringing your own image to Azure or even booting one of the platform images, there can be many reasons why a virtual machine gets into a non-bootable state. These features enable you to easily diagnose and recover your virtual machines from boot failures.

For Linux virtual machines, you can easily view the output of your console log from the Portal. For both Windows and Linux virtual machines, Azure also enables you to see a screenshot of the VM from the hypervisor. Both of these features are supported for Azure virtual machines in all regions. Note, screenshots, and output can take up to 10 minutes to appear in your storage account.

## Common boot errors

- [0xC000000E](https://support.microsoft.com/help/4010129)
- [0xC000000F](https://support.microsoft.com/help/4010130)
- [0xC0000011](https://support.microsoft.com/help/4010134)
- [0xC0000034](https://support.microsoft.com/help/4010140)
- [0xC0000098](https://support.microsoft.com/help/4010137)
- [0xC00000BA](https://support.microsoft.com/help/4010136)
- [0xC000014C](https://support.microsoft.com/help/4010141)
- [0xC0000221](https://support.microsoft.com/help/4010132)
- [0xC0000225](https://support.microsoft.com/help/4010138)
- [0xC0000359](https://support.microsoft.com/help/4010135)
- [0xC0000605](https://support.microsoft.com/help/4010131)
- [An operating system wasn't found](https://support.microsoft.com/help/4010142)
- [Boot failure or INACCESSIBLE_BOOT_DEVICE](https://support.microsoft.com/help/4010143)

## Enable diagnostics on a new virtual machine
1. When creating a new virtual machine from the Azure Portal, select the **Azure Resource Manager** from the deployment model dropdown:
 
    ![Resource Manager](./media/virtual-machines-common-boot-diagnostics/screenshot3.jpg)

2. In **Settings**, enable the **Boot diagnostics**, and then select a storage account that you would like to place these diagnostic files.
 
    ![Create VM](./media/virtual-machines-common-boot-diagnostics/create-storage-account.png)

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

1. Sign in to the [Azure portal](https://portal.azure.com), and then select the virtual machine.
2. In **Support + troubleshooting**, select **Boot diagnostics** > **Settings**, change the status to **On**, and then select a storage account. 
4. Make sure that the Boot diagnostics option is selected and then save the change.

    ![Update Existing VM](./media/virtual-machines-common-boot-diagnostics/enable-for-existing-vm.png)

3. Restart the VM to take effect.


