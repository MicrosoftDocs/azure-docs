---
title: Attach or detach a shared image gallery in Azure Lab Services | Microsoft Docs
description: This article describes how to attach a shared image gallery to a lab in Azure Lab Services. 
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

- A lab plan admin attaches a shared image gallery to the lab plan. An image is uploaded to the shared image gallery outside the context of a lab. The image is enabled on the lab plan by the lab plan admin. Then, lab creators can use that image from the shared image gallery to create labs.
- A lab plan admin attaches a shared image gallery to the lab plan. A lab creator (instructor) saves the customized image of their lab to the shared image gallery. Then, other lab creators can select this image from the shared image gallery to create a template for their labs.

> [!NOTE]
> Lab plan administrators must manually [replicate images](/azure/virtual-machines/shared-image-galleries) to other regions in the shared images gallery.

Saving images to a shared image gallery and replicating those images incurs additional cost. This cost is separate from the Azure Lab Services usage cost. For more information about Azure Compute Gallery pricing, see [Shared Image Gallery – Billing](../virtual-machines/shared-image-galleries.md#billing).

> [!IMPORTANT]
> While using a Azure Compute Gallery, Azure Lab Services supports only images with less than 128 GB of OS Disk Space. Images with more than 128 GB of disk space or multiple disks will not be shown in the list of virtual machine images during lab creation.

> [!IMPORTANT]
> Azure Compute Gallery image must be replicated to the same region as the lab plan to be shown in the list of virtual machine images during lab creation.

## Create and attach a shared image gallery

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** on the left menu. Select **Lab Services** in the **DEVOPS** section. If you select star (`*`) next to **Lab Services**, it's added to the **FAVORITES** section on the left menu. From the next time onwards, you select **Lab Services** under **FAVORITES**.

    :::image type="content" source="./media/tutorial-setup-lab-plan/select-lab-plans-service.png" alt-text="All Services -> Lab Services":::
3. Select your lab plan to see the **Lab Plan (preview)** page.
4. Select **Shared image gallery** on the left menu, and select the **Create shared image gallery** button.  

    :::image type="content" source="./media/how-to-use-shared-image-gallery/new-shared-image-gallery-button.png" alt-text="Create shared image gallery button":::
5. In the **Create shared image gallery** window, enter a **name** for the gallery, and select **OK**.

    :::image type="content" source="./media/how-to-use-shared-image-gallery/create-shared-image-gallery-window.png" alt-text="Create shared image gallery window":::

    Azure Lab Services creates the shared image gallery and attached it to the lab plan. All labs created in this lab plan have access to the attached shared image gallery.

    :::image type="content" source="./media/how-to-use-shared-image-gallery/image-gallery-in-list.png" alt-text="Attached image gallery":::

    In the bottom pane, you see images in the shared image gallery. There are no images in this new gallery. When you upload images to the gallery, you see them on this page.

## Attach an existing shared image gallery

The following procedure shows you how to attach an existing shared image gallery to a lab plan.

1. On the **Lab Plan** page, select **Shared image gallery** on the left menu, and select **Attach existing gallery** button.

    :::image type="content" source="./media/how-to-use-shared-image-gallery/sig-attach-button.png" alt-text="Shared image gallery - Add button":::
2. On the **Attach an existing Shared Image Gallery** page, select your shared image gallery, and select **OK**.

    :::image type="content" source="./media/how-to-use-shared-image-gallery/select-image-gallery.png" alt-text="Select an existing gallery":::

    > [!NOTE]
    > The **Azure Lab Services** app must be assigned the **contributor** role on the shared image gallery to show in the list.

3. You see the following screen:

    :::image type="content" source="./media/how-to-use-shared-image-gallery/my-gallery-in-list.png" alt-text="My gallery in the list":::

    In this example, there are no images in the shared image gallery yet.

## Enable and disable images

All images in the attached shared image gallery are enabled by default. You can enable or disable selected images by selecting them in the list and using the **Enable selected images** or **Disable selected images** button.

## Detach a shared image gallery

Only one shared image gallery can be attached to a lab. If you would like to attach another shared image gallery, detach the current one before attaching the new one. To detach a shared image gallery from your lab, select **Detach** on the toolbar, and confirm the detach operation.

:::image type="content" source="./media/how-to-use-shared-image-gallery/detach.png" alt-text="Detach the shared image gallery from the lab plan":::

## Next steps

To learn how to save a template image to the shared image gallery or use an image from the shared image gallery to create a VM, see [How to use shared image gallery](how-to-use-shared-image-gallery.md).

To explore other options for bringing custom images to shared image gallery outside of the context of a lab, see [Recommended approaches for creating custom images](approaches-for-custom-image-creation.md).

For more information about shared image galleries in general, see [shared image gallery](../virtual-machines/shared-image-galleries.md).
