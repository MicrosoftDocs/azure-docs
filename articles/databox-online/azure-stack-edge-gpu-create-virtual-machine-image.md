---
title: Create VM images for your Azure Stack Edge Pro GPU device
description: Describes how to create linux or Windows VM images to use with your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 05/21/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and upload Azure VM images that I can use with my Azure Stack Edge Pro device so that I can deploy VMs on the device.
---

# Create custom VM images for your Azure Stack Edge Pro device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

To deploy VMs on your Azure Stack Edge Pro device, you need to be able to create custom VM images that you can use to create VMs. This article describes the steps that are required to create Linux or Windows VM custom images that you can use to deploy VMs on your Azure Stack Edge Pro GPU device.

> [!NOTE] 
> The VM image for an Azure virtual machine deployed on an Azure Stack Edge Pro GPU device must be a Fixed virtual hard disk in VHD format from a Generation 1 virtual machine.

## VM image workflow

The workflow requires you to create a virtual machine in Azure, customize the VM, generalize, and then download the OS VHD for that VM.

For more information, go to [Deploy a VM on your Azure Stack Edge Pro device using Azure PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md).


## Create a Windows custom VM image

Do the following steps to create a Windows VM image.

1. Create a Windows virtual machine in Azure. For portal instructions, see [Create a Windows virtual machine in the Azure portal](/azure/virtual-machines/windows/quick-create-portal). For PowerShell instructions, see [Tutorial: Create and manage Windows VMs with Azure PowerShell](../virtual-machines/windows/tutorial-manage-vm.md).<!--Make htis an optional step that they won't perform if they're planning to create a specialized image for migration or redeployment of a VM?-->

   The virtual machine must be a Generation 1 VM. The OS disk that you use to create your VM image must be a fixed-size VHD. 

2. Generalize the virtual machine. Connect to the virtual machine, open a command prompt, and run the following `sysprep` command:<!--This step is in the "Download a Windows VHD from Azure topic.-->
    
    `c:\windows\system32\sysprep\sysprep.exe /oobe /generalize /shutdown /mode:vm`

   > [!IMPORTANT]
   > After the command is complete, the VM will shut down. **Do not restart the VM.** Restarting the VM will corrupt the disk you just prepared.

3. Download the OS disk from Azure:

   1. [Stop the VM](/azure/virtual-machines/windows/download-vhd#stop-the-vm).<!--When they generalized the VM, it not be already stopped. So, generalizing the disk is optional, this step just doesn't fit.-->
   1. [Generate a download URL](/azure/virtual-machines/windows/download-vhd#generate-download-url).<!--Blocking issue: Can't generate the URL while the disk is attached. VM has been generalized and is stopped.-->
   1. Download the disk to the Azure Storage account for your Azure Stack Edge device. You can save time by using `azcopy`instead of the **Download** command in the portal. 
   
      Run the following command:

      `azcopy copy <source URI> <target URI>`

      For example, XX downloads an OS VHD to the XX storage account.

      ```azcopy
      XXX
      ```
      For more copy options, see [azcopy copy](/azure/storage/common/storage-ref-azcopy-copy).

<!--Assuming the "source uri" is the download URL they generated in step 3b, how do they get a "target URI"? 
In az copy examples, I'm seeing a full path within Blob storage instead of a uri. 
Sample format line: azcopy copy "SUB Download URI" "https://[account].blob.core.windows.net/[container]/[path/to/blob]"-->

You can now use this VHD to create and deploy a VM on your Azure Stack Edge Pro device.

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