---
title: 'Upgrade a SKU'
titleSuffix: Azure Bastion
description: Learn how to change Tiers from the Basic to the Standard SKU.
services: bastion
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 08/30/2021
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to upgrade to the Standard SKU.
ms.custom: ignite-fall-2021
---

# Upgrade a SKU

This article helps you upgrade from the Basic Tier (SKU) to Standard. Once you upgrade, you can't revert back to the Basic SKU without deleting and reconfiguring Bastion. Currently, this setting can be configured in the Azure portal only. For more information about host scaling, see [Configuration settings- SKUs](configuration-settings.md#skus). 

## Configuration steps

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, go to your Bastion host.
1. On the **Configuration** page, for **Tier**, select **Standard** from the dropdown.

   :::image type="content" source="./media/upgrade-sku/select-sku.png" alt-text="Screenshot of tier select dropdown with Standard selected." lightbox="./media/upgrade-sku/select-sku-expand.png":::

1. Click **Apply** to apply changes.

## Next steps

* See [Configuration settings](configuration-settings.md) for additional configuration information.
* Read the [Bastion FAQ](bastion-faq.md).
