---
title: Attach or detach a compute gallery to a lab plan
titleSuffix: Azure Lab Services
description: This article describes how to attach an Azure Compute Gallery to a lab in Azure Lab Services. 
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 07/04/2022
---

# Attach or detach an Azure compute gallery to a lab plan in Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

> [!NOTE]
> If using a version of Azure Lab Services prior to the [August 2022 Update](lab-services-whats-new.md), see [Attach or detach a shared image gallery to a lab account in Azure Lab Services](how-to-attach-detach-shared-image-gallery-1.md).

This article shows you how to attach or detach an Azure Compute Gallery to a lab plan.

> [!IMPORTANT]
> Lab plan administrators must manually [replicate images](../virtual-machines/shared-image-galleries.md) to other regions in the compute gallery. Replicate an Azure Compute Gallery image to the same region as the lab plan to be shown in the list of virtual machine images during lab creation.

Saving images to a compute gallery and replicating those images incurs additional cost. This cost is separate from the Azure Lab Services usage cost. For more information about Azure Compute Gallery pricing, see [Azure Compute Gallery – Billing](../virtual-machines/azure-compute-gallery.md#billing).

## Prerequisites

- To change settings for the lab plan, your Azure account needs the [Owner](/azure/role-based-access-control/built-in-roles#owner) or [Contributor](/azure/role-based-access-control/built-in-roles#contributor) Azure Active Directory role on the lab plan. Learn more about the [Azure Lab Services built-in roles](./administrator-guide.md#rbac-roles).

- To attach an Azure compute gallery to a lab plan, your Azure account needs the following Azure Active Directory (Azure AD) permissions:

    - [Owner](/azure/role-based-access-control/built-in-roles#owner) role on the Azure compute gallery resource, if you're using an existing compute gallery
    - [Owner](/azure/role-based-access-control/built-in-roles#owner) role on the resource group, if you're creating a new compute gallery

## Scenarios

Here are a couple of scenarios supported by attaching a compute gallery.

- A lab plan admin attaches a compute gallery to the lab plan. An image is uploaded to the compute gallery outside the context of a lab. The image is enabled on the lab plan by the lab plan admin. Then, lab creators can use that image from the compute gallery to create labs.
- A lab plan admin attaches a compute gallery to the lab plan. A lab creator (educator) saves the customized image of their lab to the compute gallery. Then, other lab creators can select this image from the compute gallery to create a template for their labs.

When you [save a template image of a lab](how-to-use-shared-image-gallery.md#save-an-image-to-a-compute-gallery) in Azure Lab Services, the image is uploaded to the compute gallery as a specialized image. [Specialized images](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images) keep machine-specific information and user profiles. You can still directly upload a generalized image to the gallery outside of Azure Lab Services.

A lab creator can create a template VM based on both generalized and specialized images in Azure Lab Services.

> [!IMPORTANT]
> While using an Azure Compute Gallery, Azure Lab Services supports only images that use less than 128 GB of disk space on their OS drive. Images with more than 128 GB of disk space or multiple disks won't be shown in the list of virtual machine images during lab creation.

## Create and attach a compute gallery

1. Open your lab plan in the [Azure portal](https://portal.azure.com).

1. Select **Azure compute gallery** on the menu.

1. Select the **Create Azure compute gallery** button.  

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/no-gallery-create-new.png" alt-text="Screenshot of the Create Azure compute gallery button.":::

1. In the **Create Azure compute gallery** window, enter a **name** for the gallery, and then select **Create**.

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/create-azure-compute-gallery-window.png" alt-text="Screenshot of the Create compute gallery window.":::

Azure Lab Services creates the compute gallery and attaches it to the lab plan. All labs created using this lab plan can now use images from the attached compute gallery.

In the bottom pane, you see images in the compute gallery. There are no images in this new gallery. When you upload images to the gallery, you see them on this page.

:::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/attached-gallery-empty-list.png" alt-text="Screenshot of the attached image gallery list of images.":::

## Attach an existing compute gallery

The following procedure shows you how to attach an existing compute gallery to a lab plan.

1. Open your lab plan in the [Azure portal](https://portal.azure.com).

1. Select **Azure compute gallery** on the menu.

1. Select the **Attach existing gallery** button.  

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/no-gallery-attach-existing.png" alt-text="Screenshot of the Attach existing gallery button.":::

1. On the **Attach an existing compute gallery** page, select your compute gallery, and then select the **Select** button.

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/attach-existing-compute-gallery.png" alt-text="Screenshot of the Azure compute gallery page for a lab plan when the gallery is attached.":::

All labs created using this lab plan can now use images from the attached compute gallery.

## Enable and disable images

All images in the attached compute gallery are disabled by default.

To enable or disable images from a compute gallery:

1. Check the VM images in the list.

1. Select **Enable image** or **Disable image**, to enable or disable the images.

1. Select **Apply** to confirm the action.

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/enable-attached-gallery-image.png" alt-text="Screenshot that shows how to enable an image for an attached compute gallery.":::

## Detach a compute gallery

To detach a compute gallery from your lab, select **Detach** on the toolbar. Confirm the detach operation.  

:::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/attached-gallery-detach.png" alt-text="Screenshot of how to detach the compute gallery from the lab plan.":::

Only one Azure compute gallery can be attached to a lab. To attach another compute gallery, follow the steps to [attach an existing compute gallery](#attach-an-existing-compute-gallery).

## Next steps

To learn how to save a template image to the compute gallery or use an image from the compute gallery, see [How to use a compute gallery](how-to-use-shared-image-gallery.md).

To explore other options for bringing custom images to compute gallery outside of the context of a lab, see [Recommended approaches for creating custom images](approaches-for-custom-image-creation.md).

For more information about compute galleries in general, see [compute gallery](../virtual-machines/shared-image-galleries.md).