---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 10/13/2021
 ms.author: cynthn
 ms.custom: include file
---

| Resource | Description|
|----------|------------|
| **Image source** | This is a resource that can be used to create an **image version** in a gallery. An image source can be an existing Azure VM that is either [generalized or specialized](../shared-image-galleries.md#generalized-and-specialized-images), a managed image, a snapshot, or an image version in another gallery. |
| **Gallery** | Like the Azure Marketplace, a **gallery** is a repository for managing and sharing images and [VM applications](../vm-applications.md), but you control who has access. |
| **Image definition** | Image definitions are created within a gallery and carry information about the image and requirements for using it internally. This includes whether the image is Windows or Linux, release notes, and minimum and maximum memory requirements. It is a definition of a type of image. |
| **Image version** | An **image version** is what you use to create a VM when using a gallery. You can have multiple versions of an image as needed for your environment. Like a managed image, when you use an **image version** to create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times. |