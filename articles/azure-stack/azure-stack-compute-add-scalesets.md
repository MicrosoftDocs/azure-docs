---
title: 'Make Virtual Machine Scale Sets available in Azure Stack | Microsoft Docs'
description: Learn how a cloud operator can add Virtual Machine Scale Sets to the Azure Stack Marketplace
services: azure-stack
author: brenduns
manager: femila
editor: ''

ms.service: azure-stack
ms.topic: article
ms.date: 06/05/2018
ms.author: brenduns
ms.reviewer: kivenkat

---

# Make Virtual Machine Scale Sets available in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Virtual machine scale sets are an Azure Stack compute resource. You can use them to deploy and manage a set of identical virtual machines. With all virtual machines configured the same, scale sets don’t require pre-provisioning of virtual machines. It's easier to build large-scale services that target big compute, big data, and containerized workloads.

This article guides you through the process to make scale sets available in the Azure Stack Marketplace. After you complete this procedure, your users can add virtual machine scale sets to their subscriptions.

Virtual machine scale sets on Azure Stack are like virtual machine scale sets on Azure. For more information, see the following videos:
* [Mark Russinovich talks Azure scale sets](https://channel9.msdn.com/Blogs/Regular-IT-Guy/Mark-Russinovich-Talks-Azure-Scale-Sets/)
* [Virtual Machine Scale Sets with Guy Bowerman](https://channel9.msdn.com/Shows/Cloud+Cover/Episode-191-Virtual-Machine-Scale-Sets-with-Guy-Bowerman)

On Azure Stack, virtual machine scale sets don't support auto-scale. You can add more instances to a scale set using Resource Manager templates, CLI, or PowerShell.

## Prerequisites

- **The Marketplace**  
    Register Azure Stack with global Azure to enable the availability of items in the Marketplace. Follow the instructions in [Register Azure Stack with Azure](azure-stack-registration.md).
- **Operating system image**  
    If you haven’t added an operating system image to the Azure Stack Marketplace, see [Add an Azure Stack marketplace item from Azure](asdk/asdk-marketplace-item.md).

## Add the Virtual Machine Scale Set

1. Open the Azure Stack Marketplace and connect to Azure. Select **Marketplace management**> **+ Add from Azure**.

    ![Marketplace management](media/azure-stack-compute-add-scalesets/image01.png)

2. Add and download the Virtual Machine Scale Set marketplace item.

    ![Virtual Machine Scale Set](media/azure-stack-compute-add-scalesets/image02.png)

## Update images in a Virtual Machine Scale Set

After you create a virtual machine scale set, users can update images in the scale set without the scale set having to be recreated. The process to update an image depends on the following scenarios:

1. Virtual machine scale set deployment template **specifies latest** for *version*:  

   When the *version* is set as **latest** in the *imageReference* section of the template for a scale set, scale up operations on the scale set use the newest available version of the image for the scale set instances. After a scale up is complete, you can delete older virtual machine scale sets instances.  (The values for *publisher*, *offer*, and *sku* remain unchanged). 

   The following is an example of specifying *latest*:  

    ```Json  
    "imageReference": {
        "publisher": "[parameters('osImagePublisher')]",
        "offer": "[parameters('osImageOffer')]",
        "sku": "[parameters('osImageSku')]",
        "version": "latest"
        }
    ```

   Before scale up can use a new image, you must download that new image:  

   - When the image on the Marketplace is a newer version than the image in the scale set: Download the new image that replaces the older image. After the image is replaced, a user can proceed to scale up. 

   - When the image version on the Marketplace is the same as the image in the scale set: Delete the image that is in use in the scale set, and then download the new image. During the time between the removal of the original image and the download of the new image, you cannot scale up. 
      
     This process is required  to resyndicate images that make use of the sparse file format, introduced with version 1803. 
 

2. Virtual machine scale set deployment template **does not specify latest** for *version* and specifies a version number instead:  

    If you download an image with a newer version (which changes the available version), the scale set can't scale up. This is by design as the image version specified in the scale set template must be available.  

For more information, see [operating system disks and images](.\user\azure-stack-compute-overview.md#operating-system-disks-and-images).  


## Remove a Virtual Machine Scale Set

To remove a virtual machine scale set gallery item, run the following PowerShell command:

```PowerShell  
    Remove-AzsGalleryItem
````

> [!NOTE]
> The gallery item may not be removed immediately. You night need to refresh the portal several times before the item shows as removed from the Marketplace.

## Next steps
[Frequently asked questions for Azure Stack](azure-stack-faq.md)