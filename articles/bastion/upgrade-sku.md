---
title: 'Upgrade a SKU'
titleSuffix: Azure Bastion
description: Learn how to change Tiers from the Basic to the Standard SKU.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: how-to
ms.date: 07/13/2021
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to upgrade to the Standard SKU.

---

# Upgrade a SKU (Preview)

This article helps you upgrade from the Basic Tier (SKU) to Standard. Once you upgrade, you can't revert back to the Basic SKU without deleting and reconfiguring Bastion. During Preview, this setting can be configured in the Azure portal only. For more information about host scaling, see [Configuration settings- SKUs](configuration-settings.md#skus). 

## Configuration steps

[!INCLUDE [Azure Bastion preview portal](../../includes/bastion-preview-portal-note.md)]

1. In the Azure portal, navigate to your Bastion host.
1. On the **Configuration** page, for **Tier**, select **Standard** from the dropdown.

   :::image type="content" source="./media/upgrade-sku/select-sku.png" alt-text="Screenshot of tier select dropdown with Standard selected." lightbox="./media/upgrade-sku/select-sku-expand.png":::

1. Click **Apply** to apply changes.

## Next steps

* See [Configuration settings](configuration-settings.md) for additional configuration information.
* Read the [Bastion FAQ](bastion-faq.md).
