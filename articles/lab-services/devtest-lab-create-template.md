---
title: Create an Azure DevTest Labs custom image from a VHD file | Microsoft Docs
description: Learn how to create a custom image in Azure DevTest Labs from a VHD file using the Azure portal
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: b795bc61-7c28-40e6-82fc-96d629ee0568
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/17/2018
ms.author: spelluru

---

# Create a custom image from a VHD file

[!INCLUDE [devtest-lab-create-custom-image-from-vhd-selector](../../includes/devtest-lab-create-custom-image-from-vhd-selector.md)]

[!INCLUDE [devtest-lab-custom-image-definition](../../includes/devtest-lab-custom-image-definition.md)]

[!INCLUDE [devtest-lab-upload-vhd-options](../../includes/devtest-lab-upload-vhd-options.md)]

## Step-by-step instructions

The following steps walk you through creating a custom image from a VHD file using the Azure portal:

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **All services**, and then select **DevTest Labs** from the list.

1. From the list of labs, select the desired lab.  

1. On the lab's main pane, select **Configuration and policies**. 

1. On the **Configuration and policies** pane, select **Custom images**.

1. On the **Custom images** pane, select **+Add**.

    ![Add Custom image](./media/devtest-lab-create-template/add-custom-image.png)

1. Enter the name of the custom image. This name is displayed in the list of base images when creating a VM.

1. Enter the description of the custom image. This description is displayed in the list of base images when creating a VM.

1. For **OS type**, select either **Windows** or **Linux**.

    - If you select **Windows**, specify via the checkbox whether *sysprep* has been run on the machine. 
    - If you select **Linux**, specify via the checkbox whether *deprovision* has been run on the machine. 

1. Select a **VHD** from the drop-down menu. This is the VHD that will be used to create the new custom image. If necessary, select to **Upload a VHD using PowerShell**.

1. You can also enter a plan name, plan offer, and plan publisher if the image used to create the custom image is not a licensed image (published by Microsoft).

   - **Plan name:** Enter the name of the Marketplace image (SKU) from which this custom image is created 
   - **Plan offer:** Enter the product (offer) of the Marketplace image from which this custom image is created 
   - **Plan publisher:** Enter the publisher of the Marketplace image from which this custom image is created

   > [!NOTE]
   > If the image you are using to create a custom image is **not** a licensed image, then these fields are empty and can be filled in if you choose. If the image **is** a licensed image, then the fields are auto populated with the plan information. If you try to change them in this case, a warning message is displayed.
   >
   >

1. Select **OK** to create the custom image.

After a few minutes, the custom image is created and is stored inside the lab’s storage account. When a lab user wants to create a new VM, the image is available in the list of base images.

![Custom image available in list of base images](./media/devtest-lab-create-template/custom-image-available-as-base.png)


[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Related blog posts

- [Custom images or formulas?](https://blogs.msdn.microsoft.com/devtestlab/2016/04/06/custom-images-or-formulas/)
- [Copying Custom Images between Azure DevTest Labs](https://www.visualstudiogeeks.com/blog/DevOps/How-To-Move-CustomImages-VHD-Between-AzureDevTestLabs#copying-custom-images-between-azure-devtest-labs)

## Next steps

- [Add a VM to your lab](./devtest-lab-add-vm.md)
