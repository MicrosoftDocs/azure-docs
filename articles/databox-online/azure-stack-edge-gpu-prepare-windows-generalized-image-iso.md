---
title: Create a new virtual switch in Azure Stack Edge via PowerShell
description: Describes how to create a virtual switch on an Azure Stack Edge device by using PowerShell.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/30/2021
ms.author: alkohli
#Customer intent: As an IT admin, XXXX.
---

# Create a generalized Windows VHD from an ISO 

This article describes how to create a Windows virtual hard disk from ISO installation media that you can use to create a generalized image on Azure Stack Edge. When you use a *generalized image*, you complete the setup on first boot of the VM. For example, you need to set the hostname, admin user, and other VM-specific configurations. Use a generalized image when you want to create multiple new VMs from the same image.

By contrast, a *specialized image* is completely pre-configured and does not require special provisioning or parameters. The platform will just turn on the VM. Specialized images are useful for migrating a specific virtual machine or restoring a VM from a previous backup. To deploy from a specialized image, see [Use specialized Windows VHD](azure-stack-edge-placeholder.md) for your device.<!--Get target!-->

## Workflow 

The high-level workflow to create a generalized Windows VHD from an ISO is: 

1. Create a new fixed-size VHD in Hyper-V Manager 
1. Create a new VM in Hyper-V using the VHD 
1. Mount the ISO as a DVD drive on the new VM 
1. Start the VM, and install the Windows operating system 
1. Generalize the VHD using the `sysprep` utility  
1. Copy the generalized image to blob storage 
1. Proceed to the steps to deploy a VM from a generalized image via the Azure portal or PowerShell<!--This should be the "Next step," and it shouldn't be included in the work flow.-->
 

## Prerequisites 

Before you can create a generalized Windows VHD from an ISO image, make sure that: 

- You have an ISO image for the supported Windows version that you want to turn into a generalized VHD. Windows ISO images can be downloaded from the Microsoft Evaluation Center. 

- You have access to a Windows client with Hyper-V Manager installed.

- You have access to an Azure blob storage account to store your VHD after it is prepared.

## Create new VHD in Hyper-V Manager 

1. Open Hyper-V Manager on your client system. On the **Action** menu, select **New** and then **Hard Disk**.<!--To get to View, they have to first select the server (?) under the Hyper-V Manager?-->

   ![Select New and then Hard Disk](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-01.png)

1. Under **Choose Disk Format**, select **VHD**. Then select **Next >**. 

   ![Choose VHD as the disk format](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-02.png)

1. Under **Choose Disk Type**, select **Fixed size**. Then select **Next >**.

   ![Choose Fixed size as the disk type](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-03.png)

1. Under **Specify Name and Location**, enter a name and location for your new VHD. Then select **Next >**.

   ![Enter the name and location for the VHD](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-04.png)

1. Under **Configure Disk**, select **Create a new blank virtual hard disk**, and enter the size of disk you would like to create (generally 20 GB and above for Windows Server). THen select **Next >**.

   ![Settings for creating a new blank virtual hard disk and specifying the size](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-05.png)

1. Under **Summary**, review your selections, and click **Finish** to create the new VHD. The process will take five or more minutes depending on the size of the VHD created.

   ![Summary of VHD settings](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-06.png)


## Create Hyper-V VM from VHD 

1. Open Hyper-V Manager on your Windows client.

1. On the **Actions** pane, click **New** and then **Virtual Machine**.

   ![Select New and then Virtual Machine from the menu on the right.](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-07.png)

1. In the New Virtual Machine Wizard, specify the name and location of your VM.

   ![New Virtual Machine wizard, Specify Name and Location](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-08.png)

1. Under **Specify Generation**, select **Generation 1**. 

   ![New Virtual Machine wizard, Choose the generation of virtual machine to create](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-09.png)

1. Under **Assign Memory**, assign the desired memory to the virtual machine. 

   ![New Virtual Machine wizard, Assign Memory](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-10.png)

1. Under **Configure Networking**, enter your network configuration. 

   ![New Virtual Machine wizard, Configure Networking](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-11.png)

1. Under **Connect Virtual Hard Disk**, select **Use an existing virtual hard disk** and browse to the fixed VHD you created in the previous procedure.

   ![New Virtual Machine wizard, Select an existing virtual hard disk as the source](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-12.png)

1. Review the summary, and select **Finish** to create the virtual machine. 
 
## Mount ISO image as DVD drive on VM

1. In Hyper-V Manager, select the VM you just created, and then select **Settings**.
 
   ![In Hyper-V Manager, open Settings for your virtual machine](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-13.png)

1. Under **BIOS**, ensure that **CD** is at the top of the **Startup order** list.

   ![In BIOS settings, the first item under Startup order should be CD](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-14.png)

1. Under **DVD Drive**, select **Image file**, and browse to your ISO image.  

   ![In DVD drive settings, select the image file for your VHD](./media/azure-stack-edge-gpu-prepare-windows-generalized-image-iso/vhd-from-iso-15.png)

1. Click **OK** to save your VM settings.

## Connect to the Hyper-V VM 

Using Hyper-V manager, connect to the new VM you created.

[!INCLUDE [Connect to Hyper-V VM](../../includes/azure-stack-edge-connect-to-hyperv-vm.md)]

After you're connected to the VM, complete the Machine setup wizard, and then sign into the VM.<!--What does this mean? Doesn't correspond to the procedures/steps that follow.-->

## Generalize the VHD  

[!INCLUDE [Generalize the VHD](../../includes/azure-stack-edge-generalize-vhd.md)]

Your VHD can now be used to create a generalized image on Azure Stack Edge.

## Upload the VHD to Azure Blob storage

[!INCLUDE [Upload VHD to Blob storage](../../includes/azure-stack-edge-upload-vhd-to-blob-storage.md)]

<!--If you experience any issues creating VMs from your new image, you can use VM console access to help troubleshoot. For information on console access, see [link].-->

## Next steps

Deploy a virtual machine from an ISO image via the Azure portal,<!--Is this article available?-->
