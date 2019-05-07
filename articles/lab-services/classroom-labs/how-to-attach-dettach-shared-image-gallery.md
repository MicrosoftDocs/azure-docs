---
title: Attach or detach a shared image gallery in Azure Lab Services | Microsoft Docs
description: Learn how to attach a shared image gallery to a lab in Azure Lab Services. 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/07/2019
ms.author: spelluru

---
# Attach or detach a shared image gallery in Azure Lab Services
Teachers/lab admin can save a template VM image in an Azure [shared image gallery](../../virtual-machines/windows/shared-image-galleries.md) for it to be reused by others. As a first step, the lab admin attaches an existing shared image gallery to the lab account. Once the shared image gallery is attached, labs created in the lab account can save images to the shared image gallery. Other teachers can select this image from the shared image gallery to create a template for their classes. 

This article shows you how to attach or detach a shared image gallery to a lab account. 

## Prerequisites
Create a shared image gallery by using either [Azure PowerShell](../../virtual-machines/windows/shared-images.md) or [Azure CLI](../../virtual-machines/linux/shared-images.md).

## Attach a shared image gallery
The following procedure shows you how to attach a shared image gallery to a lab account. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** on the left menu. Select **Lab Services** in the **DEVOPS** section. If you select star (`*`) next to **Lab Services**, it's added to the **FAVORITES** section on the left menu. From the next time onwards, you select **Lab Services** under **FAVORITES**.

    ![All Services -> Lab Services](../media/tutorial-setup-lab-account/select-lab-accounts-service.png)
3. Select your lab account to see the **Lab Account** page. 
4. Select **Shared image gallery** on the left menu, and select **Attach** on the toolbar. 

    ![Shared image gallery - Add button](../media/how-to-use-shared-image-gallery/sig-attach-button.png)
5. On the **Attach an existing Shared Image Gallery** page, select your shared image gallery, and select **OK**.

    ![Select an existing gallery](../media/how-to-use-shared-image-gallery/select-image-gallery.png)
6. You see the following screen: 

    ![My gallery in the list](../media/how-to-use-shared-image-gallery/my-gallery-in-list.png)
    
    In this example, there are no images in the shared image gallery yet.

Azure Lab Services identity is added as a contributor to the shared image gallery that is attached to the lab. It allows teachers/IT admin to save virtual machine images to the shared image gallery. All labs created in this lab account have access to the attached shared image gallery. 

All images in the attached shared image gallery are enabled by default. You can enable or disable selected images by selecting them in the list and using the **Enable selected images** or **Disable selected images** button. 

## Detach a shared image gallery
Only one shared image gallery can be attached to a lab. If you would like to attach another shared image gallery, detach the current one before attaching the new one. To detach a shared image gallery from your lab, select **Detach** on the toolbar, and confirm the detach operation. 

## Next steps
To learn about how to save a lab image to the shared image gallery or use an image from the shared image gallery to create a VM, see [How to use shared image gallery](how-to-use-shared-image-gallery.md).

For more information about shared image galleries in general, see [shared image gallery](../../virtual-machines/windows/shared-image-galleries.md).
