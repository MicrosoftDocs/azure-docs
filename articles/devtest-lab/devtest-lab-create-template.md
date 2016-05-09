<properties
	pageTitle="Create a DevTest Labs custom image from a VHD file | Microsoft Azure"
	description="Learn how to create a custom image from a VHD file, which can then be used to create VMs in DevTest Labs"
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
	ms.date="05/08/2016"
	ms.author="tarcher"/>

# Create a DevTest Labs custom image from a VHD file

## Overview

After you have [created a lab](devtest-lab-create-lab.md), you can [add virtual machines (VMs) to that lab](devtest-lab-add-vm-with-artifacts.md).
When you create a VM, you specify a *base*, which can be either a *custom image* or a *Marketplace image*. 
In this article, you'll see how to create a custom image from a VHD file.
Note that you'll need access to a valid VHD file to perform all the steps in this article.   

## Create a Custom Image

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Tap **Browse**, and then tap **DevTest Labs** from the list.

1. From the list of labs, tap the desired lab.  

1. The selected lab's **Settings** blade will be displayed. 

1. On the lab **Settings** blade, tap **Custom Images**.

    ![Custom Images option](./media/devtest-lab-create-template/lab-settings-custom-images.png)

1. On the **Custom images** blade, tap **+ Custom Image**.

    ![Add Custom image](./media/devtest-lab-create-template/add-custom-image.png)

1. Enter the name of the custom image. This name is displayed in the list of base images when creating a new VM.

1. Enter the description of the custom image. This description is displayed in the list of base images when creating a new VM.

1. Tap **VHD File**.

1. If you have access to a VHD file that is not listed, add it by following the instructions in the [Upload a VHD file](#upload-a-vhd-file) section, and return here when finished.

1. Select the desired VHD file.

1. Tap **OK** to close the **VHD File** blade.

1. Tap **OS Configuration**.

1. On the **OS Configuration** tab, select either **Windows** or **Linux**.

1. If **Windows** is selected, specify via the checkbox whether or not *Sysprep* has been run on the machine.

1. Tap **OK** to close the **OS Configuration** blade.

1. Tap **OK** to create the custom image.

1. Go to the [Next Steps](#next-steps) section.

##Upload a VHD file

In order to add a new custom image, you'll need to have access to a VHD file.

1. On the **VHD File** blade, tap **Upload a VHD file using PowerShell**.

    ![Upload image](./media/devtest-lab-create-template/upload-image-using-psh.png)

1. The next blade will display instructions for modifying and running a PowerShell script that uploads to your Azure subscription a VHD file. 
**Note:** This process can be lengthy depending on the size of the VHD file and your connection speed.

##Next steps

Once you have added a custom image for use when creating a VM, the next step is to [add a VM to your lab](./devtest-lab-add-vm-with-artifacts.md).