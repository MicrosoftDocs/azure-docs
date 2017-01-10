---
title: Create an Azure DevTest Labs custom image from a VHD file | Microsoft Docs
description: Learn how to create a custom image in Azure DevTest Labs from a VHD file using the Azure portal
services: devtest-lab,virtual-machines
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: b795bc61-7c28-40e6-82fc-96d629ee0568
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/10/2017
ms.author: tarcher

---

# Create a custom image from a VHD file

[!INCLUDE [devtest-lab-create-custom-image-from-vhd-selector](../../includes/devtest-lab-create-custom-image-from-vhd-selector.md)]

[!INCLUDE [devtest-lab-custom-image-definition](../../includes/devtest-lab-custom-image-definition.md)]

[!INCLUDE [devtest-lab-upload-vhd-options](../../includes/devtest-lab-upload-vhd-options.md)]

## Step-by-step instructions

The following steps walk you through creating a custom image from a VHD file using the Azure portal:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **More services**, and then select **DevTest Labs** from the list.

1. From the list of labs, select the desired lab.  

1. On the lab's blade, select **Configuration**. 

1. On the lab **Configuration** blade, select **Custom images (VHDs)**.

1. On the **Custom images** blade, select **+Add**.

    ![Add Custom image](./media/devtest-lab-create-template/add-custom-image.png)

1. Enter the name of the custom image. This name is displayed in the list of base images when creating a VM.

1. Enter the description of the custom image. This description is displayed in the list of base images when creating a VM.

1. Select **VHD**.

1. From the **VHD** blade, select the desired VHD file.

1. Select **OK** to close the **VHD** blade.

1. Select **OS configuration**.

1. On the **OS configuration** tab, select either **Windows** or **Linux**.

1. If **Windows** is selected, specify via the checkbox whether *Sysprep* has been run on the machine. 

1. Select **OK** to close the **OS configuration** blade.

1. Select **OK** to create the custom image.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Related blog posts

- [Custom images or formulas?](https://blogs.msdn.microsoft.com/devtestlab/2016/04/06/custom-images-or-formulas/)
- [Copying Custom Images between Azure DevTest Labs](http://www.visualstudiogeeks.com/blog/DevOps/How-To-Move-CustomImages-VHD-Between-AzureDevTestLabs#copying-custom-images-between-azure-devtest-labs)

##Next steps

- [Add a VM to your lab](./devtest-lab-add-vm-with-artifacts.md)
