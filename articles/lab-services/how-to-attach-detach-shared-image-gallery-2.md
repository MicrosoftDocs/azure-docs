---
title: Attach or detach a shared image gallery in Azure Lab Services | Microsoft Docs
description: This article describes how to attach a shared image gallery to a classroom lab in Azure Lab Services. 
ms.topic: how-to
ms.date: 11/13/2021
---

# Attach or detach a shared image gallery in Azure Lab Services

This article shows you how to attach or detach a shared image gallery to a lab plan.

> [!NOTE]
> When you [save a template image of a lab](how-to-use-shared-image-gallery.md#save-an-image-to-the-shared-image-gallery) in Azure Lab Services to a shared image gallery, the image is uploaded to the gallery as a specialized image. [Specialized images](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images) keep machine-specific information and user profiles. You can still directly upload a generalized image to the gallery outside of Azure Lab Services. 
>
> A lab creator can create a template VM based on both generalized and specialized images in Azure Lab Services. 

## Scenarios

Here are the couple of scenarios supported by this feature: 

- A lab plan admin attaches a shared image gallery to the lab plan, and uploads an image to the shared image gallery outside the context of a lab. Then, lab creators can use that image from the shared image gallery to create labs. 
- A lab plan admin attaches a shared image gallery to the lab plan. A lab creator (instructor) saves the customized image of his/her lab to the shared image gallery. Then, other lab creators can select this image from the shared image gallery to create a template for their labs. 

    When an image is saved to a shared image gallery, Azure Lab Services replicates the saved image to other regions available in the same [geography](https://azure.microsoft.com/global-infrastructure/geographies/). It ensures that the image is available for labs created in other regions in the same geography. Saving images to a shared image gallery incurs an additional cost, which includes cost for all replicated images. This cost is separate from the Azure Lab Services usage cost. For more information about Shared Image Gallery pricing, see [Shared Image Gallery – Billing](../virtual-machines/shared-image-galleries.md#billing).

    >[!NOTE]
    > Users must manually choose what regions the shared images are replicated to.

> [!IMPORTANT]
> While using a Shared Image Gallery, Azure Lab Services supports only images with less than 128 GB of OS Disk Space. Images with more than 128 GB of disk space or multiple disks will not be shown in the list of virtual machine images during lab creation.

## Create and attach a shared image gallery

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** on the left menu. Type **lab** in the search filter. Then, select **Azure Lab Services**. If you select star (`*`) next to **Azure Lab Services**, it's added to the **FAVORITES** section on the left menu. From the next time onwards, you select **Azure Lab Services** under **FAVORITES**.

    :::image type="content" source="./media/tutorial-setup-lab-plan/select-lab-plans-service.png" alt-text="All Services -> Lab Services":::
3. Select your lab plan to see the **Lab Plan** page.
4. Select **Shared image gallery** on the left menu, and select the **Create shared image gallery** button.  

    :::image type="content" source="./media/how-to-use-shared-image-gallery/new-shared-image-gallery-button.png" alt-text="Create shared image gallery button":::
5. In the **Create shared image gallery** window, enter a **name** for the gallery, and enter **OK**.

    :::image type="content" source="./media/how-to-use-shared-image-gallery/create-shared-image-gallery-window.png" alt-text="Create shared image gallery window":::

    Azure Lab Services creates the shared image gallery and attached it to the lab plan. All labs created in this lab plan have access to the attached shared image gallery.

    :::image type="content" source="./media/how-to-use-shared-image-gallery/image-gallery-in-list.png" alt-text="Attached image gallery":::

    In the bottom pane, you see images in the shared image gallery. In this new gallery, there are no images. When you upload images to the gallery, you see them on this page.

    All images in the attached shared image gallery are enabled by default. You can enable or disable selected images by selecting them in the list and using the **Enable selected images** or **Disable selected images** button.

## Attach an existing shared image gallery

The following procedure shows you how to attach an existing shared image gallery to a lab plan. 

1. On the **Lab Plan** page, select **Shared image gallery** on the left menu, and select **Attach existing gallery** button.

    :::image type="content" source="./media/how-to-use-shared-image-gallery/sig-attach-button.png" alt-text="Shared image gallery - Add button":::
2. On the **Attach an existing Shared Image Gallery** page, select your shared image gallery, and select **OK**.

    :::image type="content" source="./media/how-to-use-shared-image-gallery/select-image-gallery.png" alt-text="Select an existing gallery":::
3. You see the following screen:

    :::image type="content" source="./media/how-to-use-shared-image-gallery/my-gallery-in-list.png" alt-text="My gallery in the list":::

    In this example, there are no images in the shared image gallery yet.

    Azure Lab Services identity is added as a contributor to the shared image gallery that is attached to the lab. It allows educators/IT admins to save virtual machine images to the shared image gallery. All labs created in this lab plan have access to the attached shared image gallery.

    All images in the attached shared image gallery are enabled by default. You can enable or disable selected images by selecting them in the list and using the **Enable selected images** or **Disable selected images** button.

## Detach a shared image gallery

Only one shared image gallery can be attached to a lab. If you would like to attach another shared image gallery, detach the current one before attaching the new one. To detach a shared image gallery from your lab, select **Detach** on the toolbar, and confirm the detach operation.

:::image type="content" source="./media/how-to-use-shared-image-gallery/detach.png" alt-text="Detach the shared image gallery from the lab plan":::

## Next steps

To learn about how to save a lab image to the shared image gallery or use an image from the shared image gallery to create a VM, see [How to use shared image gallery](how-to-use-shared-image-gallery.md).

To explore other options for bringing custom images to shared image gallery outside of the context of a lab, see [Recommended approaches for creating custom images](approaches-for-custom-image-creation.md).

For more information about shared image galleries in general, see [shared image gallery](../virtual-machines/shared-image-galleries.md).