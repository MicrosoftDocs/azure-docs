---
title: Create an Azure virtual machine offer (VM) from an approved base, Azure Marketplace
description: Learn how to create a virtual machine (VM) offer from an approved base.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: mingshen-ms 
ms.author: mingshen
ms.date: 10/19/2020
---

# Create a virtual machine from an approved base

This article describes how to use Azure to create a VM containing a pre-configured, endorsed operating system. If this isn't compatible with your solution, it's possible to [create and configure an on-premises VM](azure-vm-create-using-own-image.md) using an approved operating system, then configure and prepare it for upload as described in [Prepare a Windows VHD or VHDX to upload to Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md).

## Select an approved base Image

Select one of the following Windows or Linux Images as your base.

### Windows

- Windows Server [2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview), [2016](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview), [2012 R2 Datacenter](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview), [2012 Datacenter](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview), [2008 R2 SP1](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview)

- SQL Server 2019 [Enterprise](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2019-ws2019?tab=Overview), [Standard](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2019-ws2019?tab=Overview), [Web](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2019-ws2019?tab=Overview)

- SQL Server 2014 [Enterprise](../virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance.md), [Standard](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance.md), [Web](../virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance.md)

- SQL Server 2012 SP2 [Enterprise](../virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance.md), [Standard](../virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance.md), [Web](../virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance.md)

### Linux

Azure offers a range of approved Linux distributions. For a current list, see [Linux on distributions endorsed by Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).

### Create VM on the Azure portal

Follow these steps to create the base VM image on the [Azure portal](https://ms.portal.azure.com/).

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
1. Select **Virtual machines**.
1. Select **+ Add** to open the **Create a virtual machine** screen.
1. Select the image from the dropdown list or select **Browse all public and private images**  to search or browse all available virtual machine images.
1. To create a **Gen 2** VM, go to the **Advanced** tab and select the **Gen 2** option.

    :::image type="content" source="media/create-vm/vm-gen-option.png" alt-text="Select Gen 1 or Gen 2.":::

1. Select the size of the VM to deploy:
    1. If you plan to develop the VHD on-premises, the size doesn't matter. Consider using one of the smaller VMs.
    2. If you plan to develop the image in Azure, consider using one of the recommended VM sizes for the selected image.

    :::image type="content" source="media/create-vm/create-virtual-machine-sizes.png" alt-text="Select a recommended VM size for the selected image.":::

1. Gen 1 only: On the **Disks** tab, expand the **Advanced** section and set the **Use managed disks** option to **No**.

    :::image type="content" source="media/create-vm/use-managed-disks-option-gen-2.png" alt-text="Set Use managed disks to No for Gen 2.":::

1. Provide the other required details to create the VM. [ WHICH ARE REQUIRED? ALL TABS? DO WE NEED TO REVIEW ALL FIELDS OR NOTE WHICH ARE REQUIRED? ]
1. Select **Review + create** to review your choices. When the **Validation passed** message appears, select  **Create**.

Azure begins provisioning the virtual machine you specified. Track its progress by selecting the **Virtual Machines** tab in the left menu. After it's created, the status [ WHERE? ] changes to **Running**.

## Connect to your VM

Connect to your [Windows](../virtual-machines/windows/connect-logon.md) or [Linux](../virtual-machines/linux/ssh-from-windows.md#connect-to-your-vm) VM.

## Configure the VM

This section describes how to size, update, and generalize an Azure VM. These steps are necessary to prepare your VM to be deployed on Azure Marketplace.

## Install the most current updates

[!INCLUDE [Discussion of most current updates](includes/most-current-updates.md)]

## Perform additional security checks

[!INCLUDE [Discussion of addition security checks](includes/additional-security-checks.md)]

## Perform custom configuration and scheduled tasks

[!INCLUDE [Discussion of custom configuration and scheduled tasks](includes/custom-config.md)]

## Generalize the image

All images in the Azure Marketplace must be reusable in a generic fashion. To achieve this, the operating system VHD must be generalized, an operation that removes all instance-specific identifiers and software drivers from a VM.

### For Windows

Windows OS disks are generalized with the [sysprep](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview) tool. If you later update or reconfigure the OS, you must run sysprep again.

> [!WARNING]
> After you run sysprep, turn the VM off until it's deployed because updates may run automatically. This shutdown will avoid subsequent updates from making instance-specific changes to the operating system or installed services. For more information about running sysprep, see [Steps to generalize a VHD](../virtual-machines/windows/capture-image-resource.md#generalize-the-windows-vm-using-sysprep).

### For Linux

The following process generalizes a Linux VM and redeploys it as a separate VM. For details, see [How to create an image of a virtual machine or VHD](../virtual-machines/linux/capture-image.md). You can stop when you reach the section called "Create a VM from the captured image".

1. Remove the Azure Linux agent

    1. Connect to your Linux VM using an SSH client
    2. In the SSH window, enter the following command: `sudo waagent –deprovision+user`.
    3. Type Y to continue (you can add the -force parameter to the previous command to avoid the confirmation step).
    4. After the command completes, type Exit to close the SSH client.

2. Stop virtual machine

    1. In the Azure portal, select your resource group (RG) and de-allocate the VM.
    2. Your VHD is now generalized and you can create a new VM using this VHD.

## Next steps

- [Configure VM offer properties](azure-vm-create-properties.md)
