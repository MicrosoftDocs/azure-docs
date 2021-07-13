---
title: 'Add scale units for host scaling'
titleSuffix: Azure Bastion
description: Learn how to add additional instances (scale units) to Azure Bastion.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: how-to
ms.date: 07/13/2021
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to configure host scaling.

---

# Configure host scaling (Preview)

This article helps you add additional scale units (instances) to Azure Bastion in order to accommodate additional concurrent client connections. During Preview, this setting can be configured in the Azure portal only. For more information about host scaling, see [Configuration settings](configuration-settings.md#instance). 

## Configuration steps

[!INCLUDE [Azure Bastion preview portal](../../includes/bastion-preview-portal-note.md)]

1. In the Azure portal, navigate to your Bastion host.
1. Host scaling instance count requires Standard tier. On the **Configuration** page, for **Tier**, verify the tier is **Standard**. If the tier is Basic, select **Standard** from the dropdown. 

   :::image type="content" source="./media/configure-host-scaling/select-sku.png" alt-text="Screenshot of Select Tier." lightbox="./media/configure-host-scaling/select-sku.png":::
1. To configure scaling, adjust the instance count. Each instance is a scale unit.

   :::image type="content" source="./media/configure-host-scaling/instance-count.png" alt-text="Screenshot of Instance count slider." lightbox="./media/configure-host-scaling/instance-count.png":::
1. Click **Apply** to apply changes.

## Next steps

* Read the [Bastion FAQ](bastion-faq.md) for additional information.
