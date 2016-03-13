<properties
	pageTitle="Create a Custom Image from a VHD | Microsoft Azure"
	description="Learn how to create custom images from VHD images"
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
	ms.date="03/13/2016"
	ms.author="tarcher"/>

# Create custom images

## Overview

After you have [created a DevTest Lab](devtest-lab-create-lab.md), you can [add virtual machines (VMs) to that lab](devtest-lab-add-vm-with-artifacts.md).
VMs are based on *custom images*, which are created from virtual hard disk (VHD) images.
Once you've created or obtained access to a VHD image, this article will walk you through uploading it, and creating a custom image from it.

## Create a Custom Image

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Tap **Browse**, and then tap **DevTest Labs** from the list.

1. From the list of labs, tap the desired lab. 

1. The selected lab's **Settings** blade will be displayed. 

1. On the lab **Settings** blade, tap **Custom Images**.

    ![Custom Images option](./media/devtest-lab-create-template/lab-settings-custom-images.png)

1. On the **Custom images** blade, tap **+ Custom Image**.

    ![Add Custom image](./media/devtest-lab-create-template/add-custom-image.png)

1. Enter the name of the custom image. This name is displayed in the list of base images when creating a new VM.

1. Enter the description of the custom image. This description is displayed in the list of base images when creating a new VM.

1. Tap **Image**.

1. If you have access to an image that is not listed, add it by following the instructions in the [Upload a VHD image](#upload-a-vhd-image) section, and return here when finished.

1. Select the desired image.

1. Tap **OK** to close the **Image** blade.

1. Tap **OS Configuration**.

1. On the **OS Configuration** tab, select either **Windows** or **Linux**.

1. If **Windows** is selected, specify via the checkbox whether or not *Sysprep* has been run on the machine.

1. Enter a **User name** for the machine.

1. Enter a **Password** for the machine. **Note:** The password will display in clear text.

1. Tap **OK** to close the **OS Configuration** blade.

1. Specify the **Location**.

1. Tap **OK** to create the custom image.

1. Go to the [Next Steps](#next-steps) section.

##Upload a VHD image

In order to add a new custom image, you'll need to have access to a VHD image file.

1. On the **Image** blade, tap **Upload an image using PowerShell**.

    ![Upload image](./media/devtest-lab-create-template/upload-image-using-psh.png)

1. The next blade will display instructions for modifying and running a PowerShell script that uploads to your Azure subscription a VHD image file. 
**Note:** This process can be lengthy depending on the size of the VHD image file and your connection speed.

##Next steps

Once you have added a custom image for use when creating a VM, the next step is to [add a VM to your DevTest Lab](./devtest-lab-add-vm-with-artifacts.md).
