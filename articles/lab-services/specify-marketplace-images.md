---
title: Specify marketplace images for a lab in Azure Lab Services
description: This article shows you how to specify which Marketplace images can be used during lab creation.
ms.topic: how-to
ms.date: 07/04/2022
ms.custom: devdivchpfy22
---

# Specify Marketplace images available to lab creators

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

> [!NOTE]
> If you're using [lab accounts](concept-lab-accounts-versus-lab-plans.md), see [Specify Marketplace images with lab accounts](specify-marketplace-images-1.md).

As an admin, you can specify the Marketplace images that educators can use when creating labs.

## Select images available for labs

Select **Marketplace images** on the menu to the left. By default, you can see the full list of images (both enabled and disabled). You can filter for **Status** to be equal to **Enabled** or **Disabled**.

:::image type="content" source="./media/specify-marketplace-images/marketplace-images-page.png" alt-text="Screenshot that shows the Marketplace images page for a lab plan. The Marketplace images menu and status filter are highlighted.":::

The Marketplace images that are displayed in the list are only the ones that satisfy the following conditions:

- Creates a single VM.
- Uses Azure Resource Manager to provision VMs.
- Doesn't require purchasing an extra licensing plan.

## Enable and disable images

To enable one or more images:

1. Check images you want to enable.
1. Select **Enable image** button.
1. Select **Apply**.

:::image type="content" source="./media/specify-marketplace-images/marketplace-images-page-enable-selected.png" alt-text="Screenshot of Marketplace images page for lab account. A disabled image is selected from the list of images.":::

To disable one or images:

1. Check images you want to disable.
1. Select **Disable image** button.
1. Select **Apply**.

## Next steps

- As an educator, [create and manage labs](how-to-manage-classroom-labs.md).
- As an educator, [configure and publish templates](how-to-create-manage-template.md).
- As an educator, [configure and control usage of a lab](how-to-manage-lab-users.md).
- As a student, [access labs](how-to-use-lab.md).
