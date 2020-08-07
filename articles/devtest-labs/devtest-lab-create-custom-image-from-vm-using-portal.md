---
title: Create an Azure DevTest Labs custom image from a VM | Microsoft Docs
description: Learn how to create a custom image in Azure DevTest Labs from a provisioned VM using the Azure portal
ms.topic: article
ms.date: 06/26/2020
---

# Create a custom image from a VM

[!INCLUDE [devtest-lab-custom-image-definition](../../includes/devtest-lab-custom-image-definition.md)]

## Step-by-step instructions

You can create a custom image from a provisioned VM, and afterwards use that custom image to create identical VMs. The following steps illustrate how to create a custom image from a VM:

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **All services**, and then select **DevTest Labs** from the list.

1. From the list of labs, select the desired lab.  

1. On the lab's main pane, select **My virtual machines**.
 
1. On the **My virtual machines** pane, select the VM from which you want to create the custom image.

1. On the VM's management pane, select **Create custom image** under **OPERATIONS**.

    :::image type="content" source="./media/devtest-lab-create-template/create-custom-image.png" alt-text="Create custom image menu item":::
1. On the **Custom image** pane, enter a name and description for your custom image. This information is displayed in the list of bases when you create a VM. The custom image will include the OS disk and all the data disks attached to the virtual machine.

    :::image type="content" source="./media/devtest-lab-create-template/create-custom-image-blade.png" alt-text="Create custom image page":::
1. Select whether sysprep was run on the VM. If the sysprep was not run on the VM, specify whether you want sysprep to be run on the VM when the custom image is created.
1. Select **OK** when finished to create the custom image.

    After a few minutes, the custom image is created and is stored inside the lab’s storage account. When a lab user wants to create a new VM, the image is available in the list of base images.

    :::image type="content" source="./media/devtest-lab-create-template/custom-image-available-as-base.png" alt-text="custom image available in list of base images":::

## Related blog posts

- [Custom images or formulas?](https://blogs.msdn.microsoft.com/devtestlab/2016/04/06/custom-images-or-formulas/)
- [Copying Custom Images between Azure DevTest Labs](https://www.visualstudiogeeks.com/blog/DevOps/How-To-Move-CustomImages-VHD-Between-AzureDevTestLabs#copying-custom-images-between-azure-devtest-labs)

## Next steps

- [Add a VM to your lab](devtest-lab-add-vm.md)
