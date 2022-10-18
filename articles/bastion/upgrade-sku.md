---
title: 'Upgrade a SKU'
titleSuffix: Azure Bastion
description: Learn how to change Tiers from the Basic to the Standard SKU.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 08/02/2022
ms.author: cherylmc

---

# Upgrade a SKU

This article helps you upgrade from the Basic Tier (SKU) to Standard. Once you upgrade, you can't revert back to the Basic SKU without deleting and reconfiguring Bastion. Currently, this setting can be configured in the Azure portal only. For more information about features and SKUs, see [Configuration settings](configuration-settings.md).

## Configuration steps

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, go to your Bastion host.
1. On the **Configuration** page, for **Tier**, select **Standard**.

   :::image type="content" source="./media/upgrade-sku/select-sku.png" alt-text="Screenshot of tier select dropdown with Standard selected." lightbox="./media/upgrade-sku/select-sku.png":::

1. You can add features at the same time you upgrade the SKU. You don't need to upgrade the SKU and then go back to add the features as a separate step.

1. Click **Apply** to apply changes. The bastion host will update. This takes about 10 minutes to complete.

## Next steps

* See [Configuration settings](configuration-settings.md) for more configuration information.
* Read the [Bastion FAQ](bastion-faq.md).
