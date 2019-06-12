---
title: Use a shared image gallery in Azure Lab Services | Microsoft Docs
description: Learn how to configure a lab account to use a shared image gallery so that a user can share an image with other and another user can use the image to create a template VM in the lab. 
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
# Use a shared image gallery in Azure Lab Services
This article shows how teachers/lab admin can save a template virtual machine image for it to be reused by others. These images are saved in an Azure [shared image gallery](../../virtual-machines/windows/shared-image-galleries.md). As a first step, the lab admin attaches an existing shared image gallery to the lab account. Once the shared image gallery is attached, labs created in the lab account can save images to the shared image gallery. Other teachers can select this image from the shared image gallery to create a template for their classes. 

## Prerequisites
- Create a shared image gallery by using either [Azure PowerShell](../../virtual-machines/windows/shared-images.md) or [Azure CLI](../../virtual-machines/linux/shared-images.md).
- You have attached the shared image gallery to the lab account. For step-by-step instructions, see [How to attach or detach shared image gallery](how-to-attach-detach-shared-image-gallery.md).


## Save an image to the shared image gallery
After a shared image gallery is attached, a teacher can save or upload an  image to the shared image gallery so that it can be reused by other teachers. For instructions for uploading an image to the shared image gallery, see [Shared Image Gallery overview](../../virtual-machines/windows/shared-images.md). 

> [!NOTE]
> Curently, the Classroom Labs user interface (UI) doesn't support saving a lab image to the shared image gallery. 

## Use an image from the shared image gallery
A teacher/professor can pick a custom image available in the shared image gallery for the template during new lab creation.

![Use virtual machine image from the gallery](../media/how-to-use-shared-image-gallery/use-shared-image.png)

## Next steps
For more information about shared image galleries, see [shared image gallery](../../virtual-machines/windows/shared-image-galleries.md).
