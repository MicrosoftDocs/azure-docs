---
title: 'Upgrade or view a SKU: portal'
titleSuffix: Azure Bastion
description: Learn how to view a SKU and change tiers from the Basic to the Standard SKU.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 06/08/2023
ms.author: cherylmc

---

# View or upgrade a SKU

This article helps you view and upgrade Azure Bastion from the Basic SKU tier to the Standard SKU tier. Once you upgrade, you can't revert back to the Basic SKU without deleting and reconfiguring Bastion. For more information about features and SKUs, see [Configuration settings](configuration-settings.md).

[!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

## View a SKU

To view the SKU for your bastion host, use the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, go to your bastion host.
1. In the left pane, select **Configuration** to open the Configuration page. In the following example, Bastion is configured to use the **Basic** SKU tier. 

   Notice that when you use the Basic SKU, the features you can configure are limited. You can upgrade to a higher SKU using the steps in the next section.

   :::image type="content" source="./media/upgrade-sku/view-sku.png" alt-text="Screenshot of the configuration page with the Basic SKU." lightbox="./media/upgrade-sku/view-sku.png":::

## Upgrade a SKU

Use the following steps to upgrade to the Standard SKU.

1. In the Azure portal, go to your Bastion host.
1. On the **Configuration** page, for **Tier**, select **Standard**.

   :::image type="content" source="./media/upgrade-sku/upgrade-sku.png" alt-text="Screenshot of tier select dropdown with Standard selected." lightbox="./media/upgrade-sku/upgrade-sku.png":::
1. You can add features at the same time you upgrade the SKU. You don't need to upgrade the SKU and then go back to add the features as a separate step.

1. Select **Apply** to apply changes. The bastion host updates. This takes about 10 minutes to complete.

## Next steps

* See [Configuration settings](configuration-settings.md).
* Read the [Bastion FAQ](bastion-faq.md).
