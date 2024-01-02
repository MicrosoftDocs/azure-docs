---
title: Specify marketplace images in a lab account 
description: This article shows you how to specify the Marketplace images that a lab creator can use to create labs.
ms.topic: how-to
ms.date: 02/15/2022
---

# Specify Marketplace images available to lab creators in a lab account

[!INCLUDE [lab account focused article](./includes/lab-services-labaccount-focused-article.md)]

As a lab account owner, you can specify the Marketplace images that lab creators can use to create labs in the lab account.

## Select images available for labs

Select **Marketplace images** on the menu to the left. By default, you see the full list of images (both enabled and disabled). You can filter  for **Status** to be equal to **Enabled** or **Disabled**.

:::image type="content" source="./media/specify-marketplace-images-1/marketplace-images-page.png" alt-text="Screenshot that shows the Marketplace images page for a lab account.  The Marketplace images menu and status filter are highlighted.":::

The Marketplace images that are displayed in the list are only the ones that satisfy the following conditions:

- Creates a single VM.
- Uses Azure Resource Manager to provision VMs
- Doesn't require purchasing an extra licensing plan

## Enable and disable images

To enable one or more images:

1. Check images you want to enable.
2. Select **Enable image** button.
3. Select **Apply**.

:::image type="content" source="./media/specify-marketplace-images-1/marketplace-images-enable-selected.png" alt-text="Screenshot of Marketplace images page for lab account.  A disabled image is selected from the list of images.":::

To disable one or images:

1. Check images you want to disable.
2. Select **Disable image** button.
3. Select **Apply**.

## Next steps

- As an educator, [create and manage labs](how-to-manage-classroom-labs.md).
- As an educator, [configure and publish templates](how-to-create-manage-template.md).
- As an educator, [configure and control usage of a lab](how-to-manage-lab-users.md).
- As a student, [access labs](how-to-use-lab.md).
