---
title: Create VM images from generalized image of Windows VHD for your Azure Stack Edge Pro GPU device
description: Describes how to VM images from generalized images starting from a Windows VHD or a VHDX. Use this generalized image to create VM images to use with VMs deployed on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/18/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and upload Azure VM images that I can use with my Azure Stack Edge Pro device so that I can deploy VMs on the device.
---

# Use generalized image from Windows VHD to create a VM image for your Azure Stack Edge Pro device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

To deploy VMs on your Azure Stack Edge Pro device, you need to be able to create custom VM images that you can use to create VMs. This article describes the steps required to prepare a Windows VHD or VHDX to create a generalized image. This generalized image is then used to create a VM image for your Azure Stack Edge Pro device. 

## About preparing Windows VHD

A Windows VHD or VHDX can be used to create a *generalized* image or a *specialized* image. The following table summarizes key differences between the *generalized* and the *specialized* images.


|Image type  |Generalized  |Specialized  |
|---------|---------|---------|
|Target     |Deployed on any system         | Targeted to a specific system        |
|Setup after boot     | Setup required at first boot of the VM.          | Setup not needed. <br> Platform turns the VM on.        |
|Configuration     |Hostname, admin-user, and other VM-specific settings required.         |Completely pre-configured.         |
|Used when     |Creating multiple new VMs from the same image.         |Migrating a specific machine or restoring a VM from previous backup.         |


This article covers steps required to deploy from a generalized image. To deploy from a specialized image, see [Use specialized Windows VHD](azure-stack-edge-placeholder.md) for your device.

> [!IMPORTANT]
> This procedure does not cover cases where the source VHD is configured with custom configurations and settings. For example, additional actions may be required to generalize a VHD containing custom firewall rules or proxy settings. For more information on these additional actions, see [Prepare a Windows VHD to upload to Azure - Azure Virtual Machines](../virtual-machines/windows/prepare-for-upload-vhd-image.md).


## VM image workflow

The high-level workflow to prepare a Windows VHD for use as a generalized image has the following steps:

1. Convert the source VHD or VHDX to a fixed size VHD.
1. Create a VM in Hyper-V using the fixed VHD.
1. Connect to the Hyper-V VM.
1. Generalize the VHD using the *sysprep* utility. 
1. Copy the generalized image to Blob storage.
1. Use generalized image to deploy VMs on your device. For more information, see how to [deploy a VM via Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md) or [deploy a VM via PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md).


## Prerequisites

Before you prepare a Windows VHD for use as a generalized image on Azure Stack Edge, make sure that:

- You have a VHD or a VHDX containing a supported version of Windows. See [Supported guest operating Systems]() for your Azure Stack Edge Pro. 
- You have access to a Windows client with Hyper-V Manager installed. 
- You have access to an Azure Blob storage account to store your VHD after it is prepared.

## Prepare a generalized Windows image from VHD

## Convert to a fixed VHD 

For your device, you'll need fixed-size VHDs to create VM images. You'll need to convert your source Windows VHD or VHDX to a fixed VHD. Follow these steps:

1. Open Hyper-V Manager on your client system. Go to **Edit Disk**.

    ![Open Hyper-V manager](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/convert-fixed-vhd-1.png)

1. On the **Before you begin** page, select **Next>**.

1. On the **Locate virtual hard disk** page, browse to the location of the source Windows VHD or VHDX that you wish to convert. Select **Next>**.

    ![Locate virtual hard disk page](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/convert-fixed-vhd-2.png)

1. On the **Choose action** page, select **Convert** and select **Next>**.

    ![Choose action page](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/convert-fixed-vhd-3.png)

1. On the **Choose disk format** page, select **VHD** format and then select **Next>**.

   ![Choose disk format page](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/convert-fixed-vhd-4.png)


1. On the **Choose disk type** page, choose **Fixed size** and select **Next>**.

   ![Choose disk type page](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/convert-fixed-vhd-5.png)


1. On the **Configure disk** page, browse to the location and specify a name for the fixed size VHD disk. Select **Next>**.

   ![Configure disk page](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/convert-fixed-vhd-6.png)


1. Review the summary and select **Finish**. The VHD or VHDX conversion takes a few minutes. The time for conversion depends on the size of the source disk. 

<!--
1. Run PowerShell on your Windows client.
1. Run the following command:

    ```powershell
    Convert-VHD -Path <source VHD path> -DestinationPath <destination-path.vhd> -VHDType Fixed 
    ```
-->
You'll use this fixed VHD for all the subsequent steps in this article.


## Create a Hyper-V VM from fixed VHD

1. In **Hyper-V Manager**, in the scope pane, right-click your system node to open the context menu, and then select **New** > **Virtual Machine**.

    ![Select new virtual machine in scope pane](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/create-virtual-machine-1.png)

1. On the **Before you begin** page of the New Virtual Machine Wizard, select **Next**.

1. On the **Specify name and location** page, provide a **Name** and **location** for your virtual machine. Select **Next**.

    ![Specify name and location for your VM](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/create-virtual-machine-2.png)

1. On the **Specify generation** page, choose **Generation 1** for the .vhd device image type, and then select **Next**.    

    ![Specify generation](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/create-virtual-machine-3.png)

1. Assign your desired memory and networking configurations.

1. On the **Connect virtual hard disk** page, choose **Use an existing virtual hard disk**, specify the location of the Windows fixed VHD that we created earlier, and then select **Next**.

    ![Connect virtual hard disk page](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/create-virtual-machine-4.png)

1. Review the **Summary** and then select **Finish** to create the virtual machine.

The virtual machine takes several minutes to create.
	 

## Connect to the Hyper-V VM

The VM shows in the list of the virtual machines on your client system. 


1. Select the VM and then right-click and select **Start**. 

    ![Select VM and start it](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/connect-virtual-machine-2.png)

2. The VM shows show as **Running**. Select the VM and then right-click and select **Connect**.

    ![Connect to VM](./media/azure-stack-edge-gpu-prepare-windows-vhd-generalized-image/connect-virtual-machine-4.png)

After you are connected to the VM, complete the Machine setup wizard and then sign into the VM.


## Generalize the VHD  

Use the *sysprep* utility to generalize the VHD. 

1. Inside the VM, open a command prompt.
1. Run the following command to generalize the VHD. 

    ```
    c:\windows\system32\sysprep\sysprep.exe /oobe /generalize /shutdown /mode:vm
    ```
    For details, see  [Sysprep (system preparation) overview](/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview).
1.  After the command is complete, the VM will shut down. **Do not restart the VM**.

## Upload the VHD to Azure Blob storage

Your VHD can now be used to create a generalized image on Azure Stack Edge. 

1. Upload the VHD to Azure blob storage. See the detailed instructions in [Upload a VHD using Azure Storage Explorer](../devtest-labs/devtest-lab-upload-vhd-using-storage-explorer.md).
1. After the upload is complete, you can use the uploaded image to create VM images and VMs. 

<!-- this should be added to deploy VM articles - If you experience any issues creating VMs from your new image, you can use VM console access to help troubleshoot. For information on console access, see [link].-->



## Next steps

Depending on the nature of deployment, you can choose one of the following procedures.

- [Deploy a VM from a generalized image via Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md)
- [Deploy a VM from a generalized image via Azure PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md)  
