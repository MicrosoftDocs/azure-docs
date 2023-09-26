---
title: Use an Azure compute gallery in Azure Lab Services
description: Learn how to use an Azure compute gallery in a lab plan. A compute gallery lets you share a VM image, which can be reused to create new labs.
ms.topic: how-to
ms.date: 12/15/2022
author: ntrogh
ms.author: nicktrog
---

# Use an Azure compute gallery in Azure Lab Services

An image contains the operating system, software applications, files, and settings that are installed on a VM. This article shows how educators or lab admins can create and save a custom image from a template virtual machine to a [compute gallery](../virtual-machines/shared-image-galleries.md) for others to create new labs.

You can use two types of images to set up a new lab:

- Azure Marketplace images are prebuilt by Microsoft for use within Azure. These images have either Windows or Linux installed and may also include software applications. For example, the [Data Science Virtual Machine image](../machine-learning/data-science-virtual-machine/overview.md#whats-included-on-the-dsvm) includes deep learning frameworks and tools.
- Custom images are created by your institution’s IT department and\or other educators. You can create both Windows and Linux custom images. You have the flexibility to install Microsoft and third-party applications based on your unique needs. You also can add files, change application settings, and more.

> [!IMPORTANT]
> While using a Azure compute galleries, Azure Lab Services supports only images with less than 128 GB of OS Disk Space. Images with more than 128 GB of disk space or multiple disks will not be shown in the list of virtual machine images during lab creation.

## Scenarios

Here are the couple of scenarios supported by this feature:

- A lab plan admin attaches a compute gallery to the lab plan, and uploads an image to the compute gallery outside the context of a lab. Then, lab creators can use that image from the compute gallery to create labs.
- A lab plan admin attaches a compute gallery to the lab plan. A lab creator (educator) saves the customized image of their lab to the compute gallery. Then, other lab creators can select this image from the compute gallery to create a template for their labs.

## Prerequisites

- Create a [compute gallery](../virtual-machines/create-gallery.md).
- You've attached the compute gallery to the lab plan. For step-by-step instructions, see [How to attach or detach compute gallery](how-to-attach-detach-shared-image-gallery.md).
- Image must be replicated to the same region as the lab plan.

## Save an image to a compute gallery
> [!IMPORTANT]
> Images can only be saved from labs that were created in the same region as their lab plan.

1. On the **Template** page for the lab, select **Export to Azure Compute Gallery** on the toolbar.

    ![Save image button](./media/how-to-use-shared-image-gallery/export-to-shared-image-gallery-button.png)
2. On the **Export to Azure Compute Gallery** dialog, enter a **name for the image**, and then select **Export**.

    :::image type="content" source="./media/how-to-use-shared-image-gallery/export-to-shared-image-gallery-dialog.png" alt-text="Export to Azure Compute Gallery dialog":::

3. You'll see a note telling you to go to the Azure portal to see the progress of this operation. This operation can take sometime.

    ![Export in progress](./media/how-to-use-shared-image-gallery/exporting-image-in-progress.png)

After you save the image to the compute gallery, you can use that image from the gallery when creating another lab. You can also upload an image to the compute gallery outside the context of a lab. For more information, see:

- [Azure Compute Gallery overview](../virtual-machines/shared-image-galleries.md)
- [Recommended approaches for creating custom images](approaches-for-custom-image-creation.md)

> [!IMPORTANT]
> When you save a template image of a lab in Azure Lab Services to a compute gallery, the image is uploaded to the gallery as a **specialized image**. [Specialized images](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images) keep machine-specific information and user profiles. You can still directly upload a generalized image to the gallery outside of Azure Lab Services.

## Use a custom image from the compute gallery

An educator can pick a custom image available in the compute gallery for the template VM when creating a new lab.  Educators can create a template VM based on both **generalized** and **specialized** images in Azure Lab Services.

:::image type="content" source="./media/how-to-use-shared-image-gallery/use-shared-image.png" alt-text="Screenshot that shows the list of virtual machine images in the Create a new lab page.":::

>[!NOTE]
>Azure Compute Gallery images will not show if they have been disabled or if the region of the lab plan is different than the gallery images.

> [!IMPORTANT]
> When you create a new lab from an exported lab VM image, you need to use the same credentials as the original template VM when creating the lab. After the lab creation finishes, you can [reset the username and password](./how-to-set-virtual-machine-passwords.md).

For more information about replicating images, see  [replication in Azure Compute Gallery](../virtual-machines/shared-image-galleries.md). For more information about disabling gallery images for a lab plan, see [enable and disable images](how-to-attach-detach-shared-image-gallery.md#enable-and-disable-images).

### Resave a custom image to compute gallery

After you've created a lab from a custom image in a compute gallery, you can make changes to the image using the template VM and reexport the image to compute gallery.  When you reexport, you can either create a new image or update the original image.

If you choose **Create new image**, a new [image definition](../virtual-machines/shared-image-galleries.md#image-definitions) is created.  Creating a new image allows you to save an entirely new custom image without changing the original custom image that already exists in compute gallery.

If instead you choose **Update existing image**, the original custom image's definition is updated with a new [version](../virtual-machines/shared-image-galleries.md#image-versions).  Lab Services automatically will use the most recent version the next time a lab is created using the custom image.

## Troubleshooting

### Unable to login with the credentials you used for creating the lab

When you create a new lab from an exported lab VM image, perform the following steps:

1. Reuse the same credentials as the original template VM when creating the new lab.

1. After the lab creation finishes, you can [reset the username and password](./how-to-set-virtual-machine-passwords.md).

## Next steps

To learn about how to set up a compute gallery by attaching and detaching it to a lab plan, see [How to attach and detach a compute gallery](how-to-attach-detach-shared-image-gallery.md).

To explore other options for bringing custom images to compute gallery outside of the context of a lab, see [Recommended approaches for creating custom images](approaches-for-custom-image-creation.md).

For more information about compute galleries in general, see [Azure Compute Gallery overview](../virtual-machines/shared-image-galleries.md).
