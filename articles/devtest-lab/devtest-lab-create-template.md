<properties
	pageTitle="Manage Azure DevTest Labs custom images to create VMs | Microsoft Azure"
	description="Learn how to create a custom image from a VHD file, or from an existing VM in Azure DevTest Labs"
	services="devtest-lab,virtual-machines"
	documentationCenter="na"
	authors="tomarcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/07/2016"
	ms.author="tarcher"/>

# Manage Azure DevTest Labs custom images to create VMs

In Azure DevTest Labs, custom images enable you to create VMs quickly without waiting for all the required software to be installed on the target machine. Custom images allow you to pre-install all the software that you need in a VHD file, and then use the VHD file to create a VM. Because the software is already installed, the VM creation time is much quicker. In addition, custom images are used to clone VMs by creating a custom image from a VM, and then creating VMs from that custom image.

In this article, you learn how to:

- [Create a custom image from a VHD file](#create-a-custom-image-from-a-vhd-file) so that you can then create a VM from that custom image. 
- [Create a custom image from a VM](#create-a-custom-image-from-a-vm) for rapid VM cloning.

## Create a custom image from a VHD file

In this section, you see how to create a custom image from a VHD file.
You need access to a valid VHD file to perform all the steps in this section.   


1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **More services**, and then select **DevTest Labs** from the list.

1. From the list of labs, select the desired lab.  

1. On the lab's blade, select **Configuration**. 

1. On the lab **Configuration** blade, select **Custom images**.

1. On the **Custom images** blade, select **+ Custom image**.

    ![Add Custom image](./media/devtest-lab-create-template/add-custom-image.png)

1. Enter the name of the custom image. This name is displayed in the list of base images when creating a VM.

1. Enter the description of the custom image. This description is displayed in the list of base images when creating a VM.

1. Select **VHD File**.

1. If you have access to a VHD file that is not listed, add it by following the instructions in the [Upload a VHD file](#upload-a-vhd-file) section, and return here when finished.

1. Select the desired VHD file.

1. Select **OK** to close the **VHD File** blade.

1. Select **OS Configuration**.

1. On the **OS Configuration** tab, select either **Windows** or **Linux**.

1. If **Windows** is selected, specify via the checkbox whether *Sysprep* has been run on the machine.

1. Select **OK** to close the **OS Configuration** blade.

1. Select **OK** to create the custom image.

1. Go to the [Next Steps](#next-steps) section.

###Upload a VHD file

To add a custom image, you need to have access to a VHD file.

1. On the **VHD File** blade, select **Upload a VHD file using PowerShell**.

    ![Upload image](./media/devtest-lab-create-template/upload-image-using-psh.png)

1. The next blade will display instructions for modifying and running a PowerShell script that uploads to your Azure subscription a VHD file. 
**Note:** This process can be lengthy depending on the size of the VHD file and your connection speed.

## Create a custom image from a VM
If you have a VM that is already configured, you can create a custom image from that VM, and afterwards use that custom image to create other identical VMs. The following steps illustrate how to create a custom image from a VM:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **More services**, and then select **DevTest Labs** from the list.

1. From the list of labs, select the desired lab.  

1. On the lab's blade, select **My virtual machines**.
 
1. On the **My virtual machines** blade, select the VM from which you want to create the custom image.

1. On the VM's blade, select **Create custom image (VHD)**.

	![Create custom image menu item](./media/devtest-lab-create-template/create-custom-image.png)

1. On the **Create image** blade, enter a name and description for your custom image. This information is displayed in the list of bases when you create a VM.

	![Create custom image blade](./media/devtest-lab-create-template/create-custom-image-blade.png)

1. Select whether sysprep was run on the VM. If the sysprep was not run on the VM, specify whether you want sysprep run when a VM is created from this custom image.

1. Select **OK** when finished to create the custom image.

[AZURE.INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Related blog posts

- [Custom images or formulas?](https://blogs.msdn.microsoft.com/devtestlab/2016/04/06/custom-images-or-formulas/)
- [Copying Custom Images between Azure DevTest Labs](http://www.visualstudiogeeks.com/blog/DevOps/How-To-Move-CustomImages-VHD-Between-AzureDevTestLabs#copying-custom-images-between-azure-devtest-labs)

##Next steps

Once you have added a custom image for use when creating a VM, the next step is to [add a VM to your lab](./devtest-lab-add-vm-with-artifacts.md).