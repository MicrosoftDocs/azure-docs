---
title: Capture an image of a VM using the portal
description: Create an image of a VM using the Azure portal. 
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 04/12/2022
ms.author: cynthn
ms.custom: portal

---
# Create an image of a VM in the portal

An image can be created from a VM and then used to create multiple VMs.

For images stored in an Azure Compute Gallery (formerly known as Shared Image Gallery), you can use VMs that already have accounts created on them (specialized) or you can generalize the VM before creating the image to remove machine accounts and other machines specific information. To generalize a VM, see [Generalized a VM](generalize.md). For more information, see [Generalized and specialized images](shared-image-galleries.md#generalized-and-specialized-images).

> [!IMPORTANT]
> Once you mark a VM as `generalized` in Azure, you cannot restart the VM. Legacy **managed images** are automatically marked as generalized.
> > When capturing an image of a virtual machine in Azure, the virtual machine will be temporarily stopped to ensure data consistency and prevent any potential issues during the image creation. This is because capturing an image requires a point-in-time snapshot of the virtual machine's disk.
> To avoid disruptions in a production environment, it's recommended you schedule the image capture process during a maintenance window or a time when the temporary downtime won't impacting critical services.


## Capture a VM in the portal 

1. Go to the [Azure portal](https://portal.azure.com), then search for and select **Virtual machines**.

2. Select your VM from the list.

3. On the page for the VM, on the upper menu, select **Capture**.

   The **Create an image** page appears.

5. For **Resource group**, either select **Create new** and enter a name, or select a resource group to use from the drop-down list. If you want to use an existing gallery, select the resource group for the gallery you want to use.

1. To create the image in a gallery, select **Yes, share it to a gallery as an image version**.
    
   To only create a managed image, select **No, capture only a managed image**. The VM must have been generalized to create a managed image. The only other required information is a name for the image.

6. If you want to delete the source VM after the image has been created, select **Automatically delete this virtual machine after creating the image**. This is not recommended.

1. For **Gallery details**, select the gallery or create a new gallery by selecting **Create new**.

1. In **Operating system state** select generalized or specialized. For more information, see [Generalized and specialized images](shared-image-galleries.md#generalized-and-specialized-images). 
 
1. Select an image definition or select **create new** and provide a name and information for a new [Image definition](shared-image-galleries.md#image-definitions).

1. Enter an [image version](shared-image-galleries.md#image-versions) number. If this is the first version of this image, type *1.0.0*.

1. If you want this version to be included when you specify *latest* for the image version, then leave **Exclude from latest** unchecked.

1. Select an **End of life** date. This date can be used to track when older images need to be retired.

1. Under [Replication](azure-compute-gallery.md#replication), select a default replica count and then select any additional regions where you would like your image replicated.

8. When you are done, select **Review + create**.

1. After validation passes, select **Create** to create the image.



## Next steps

- [Azure Compute Galleries overview](shared-image-galleries.md)
