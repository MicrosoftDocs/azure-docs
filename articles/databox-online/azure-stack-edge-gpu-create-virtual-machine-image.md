---
title: Create VM images for your Azure Stack Edge Pro GPU device
description: Describes how to create linux or Windows VM images to use with your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 05/20/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and upload Azure VM images that I can use with my Azure Stack Edge Pro device so that I can deploy VMs on the device.
---

# Create custom VM images for your Azure Stack Edge Pro device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

To deploy VMs on your Azure Stack Edge Pro device, you need to be able to create custom VM images that you can use to create VMs. This article describes the steps that are required to create Linux or Windows VM custom images that you can use to deploy VMs on your Azure Stack Edge Pro GPU device.

> [!NOTE] 
> The VM image for an Azure virtual machine deployed on an Azure Stack Edge Pro GPU device must be a Fixed virtual hard disk in VHD format from a Generation 1 virtual machine.

## VM image workflow

The workflow requires you to create a virtual machine in Azure, customize the VM, generalize, and then download the OS VHD for that VM. This generalized VHD is uploaded to Azure Stack Edge Pro. A managed disk is created from that VHD. An image is created from the managed disk. And, finally, VMs are created from that image.

For more information, go to [Deploy a VM on your Azure Stack Edge Pro device using Azure PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md).


## Create a Windows custom VM image

Do the following steps to create a Windows VM image.

1. Create a Windows Virtual Machine. The virtual machine must be a Generation 1 VM. The OS disk that you use to create your VM image must be a fixed-size VHD. For more information, go to [Tutorial: Create and manage Windows VMs with Azure PowerShell](../virtual-machines/windows/tutorial-manage-vm.md).

2. Generalize the virtual machine by running the following `sysprep` command:<!--Link to the appropriate sysprep command reference topic.-->
    
    `c:\windows\system32\sysprep\sysprep.exe /oobe /generalize /shutdown /mode:vm`

   > [!IMPORTANT]
   > After the command is complete, the VM will shut down. **Do not restart the VM.** Restarting the VM will corrupt the disk you just prepared.

3. Stop the VM from the Azure portal, and export the OS disk.<!--1) They export instead of downloading the disk, or do they export and then download? When they export a disk, where is it stored? They specify on export? 2) Where are the instructions for stopping a VM and exporting a disk? 3) Preceding step says sysprep shut down the VM. Why do they need to stop the VM now? Not needed in this context? 4) NOTE: In the generalized image from Windows VHD and using ISO, export of the OS disk is skipped.-->

   ADD: Do not use the **Download** command, which is slow...Instead use `azcopy`...  THIS STEP, or the next (Download) step?

Use this VHD to now create and deploy a VM on your Azure Stack Edge Pro device.


<!--OLD STEPS - 
1. Create a Windows Virtual Machine. For more information, go to [Tutorial: Create and manage Windows VMs with Azure PowerShell](../virtual-machines/windows/tutorial-manage-vm.md).

2. Download an existing OS disk.

    - Follow the steps in [Download a VHD](../virtual-machines/windows/download-vhd.md).

    - Use the following `sysprep` command instead of what is described in the preceding procedure.
    
        `c:\windows\system32\sysprep\sysprep.exe /oobe /generalize /shutdown /mode:vm`
   
       You can also refer to [Sysprep (system preparation) overview](/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview).-->

Use this VHD to now create and deploy a VM on your Azure Stack Edge Pro device.

## Create a Linux custom VM image

Do the following steps to create a Linux VM image.

1. Create a Linux Virtual Machine. For more information, go to [Tutorial: Create and manage Linux VMs with the Azure CLI](../virtual-machines/linux/tutorial-manage-vm.md).<!--Note Generation 1 with fixed VHD requirement here also.-->

1. Deprovision the VM. Use the Azure VM agent to delete machine-specific files and data. Use the `waagent` command with the `-deprovision+user` parameter on your source Linux VM. For more information, see [Understanding and using Azure Linux Agent](../virtual-machines/extensions/agent-linux.md).

    1. Connect to your Linux VM with an SSH client.
    2. In the SSH window, enter the following command:
       
        ```bash
        sudo waagent -deprovision+user
        ```
       > [!NOTE]
       > Only run this command on a VM that you'll capture as an image. This command does not guarantee that the image is cleared of all sensitive information or is suitable for redistribution. The `+user` parameter also removes the last provisioned user account. To keep user account credentials in the VM, use only `-deprovision`.
     
    3. Enter **y** to continue. You can add the `-force` parameter to avoid this confirmation step.
    4. After the command completes, enter **exit** to close the SSH client.  The VM will still be running at this point.


1. [Download existing OS disk](../virtual-machines/linux/download-vhd.md).

Use this VHD to now create and deploy a VM on your Azure Stack Edge Pro device. You can use the following two Azure Marketplace images to create Linux custom images:

|Item name  |Description  |Publisher  |
|---------|---------|---------|
|[Ubuntu Server](https://azuremarketplace.microsoft.com/marketplace/apps/canonical.ubuntuserver) |Ubuntu Server is the world's most popular Linux for cloud environments.|Canonical|
|[Debian 8 "Jessie"](https://azuremarketplace.microsoft.com/marketplace/apps/credativ.debian) |Debian GNU/Linux is one of the most popular Linux distributions.     |credativ|

For a full list of Azure Marketplace images that could work (presently not tested), go to [Azure Marketplace items available for Azure Stack Hub](/azure-stack/operator/azure-stack-marketplace-azure-items?view=azs-1910&preserve-view=true).


## Next steps

[Deploy VMs on your Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md).