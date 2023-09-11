---
title: 'Upgrade or view a SKU: portal'
titleSuffix: Azure Bastion
description: Learn how to view a SKU and change tiers from the Basic to the Standard SKU.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 09/12/2023
ms.author: cherylmc

---

# View or upgrade a SKU

This article helps you view and upgrade your Bastion SKU. Once you upgrade, you can't revert back to a lower SKU without deleting and reconfiguring Bastion. For more information about features and SKUs, see [Configuration settings](configuration-settings.md).

[!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

## View a SKU

To view the SKU for your bastion host, use the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, go to your bastion host.
1. In the left pane, select **Configuration** to open the Configuration page. In the following example, Bastion is configured to use the **Developer** SKU tier. Notice that the SKU affects the features that you can configure for Bastion. You can upgrade to a higher SKU using the steps in the next sections.

   :::image type="content" source="./media/upgrade-sku/developer-sku.png" alt-text="Screenshot of the configuration page with the Developer SKU." lightbox="./media/upgrade-sku/developer-sku.png":::

## Upgrade from the Developer SKU

When you upgrade from a Developer SKU to a dedicated deployment SKU, you need to create a public IP address and an Azure Bastion subnet.

Use the following steps to upgrade to a higher SKU.

1. In the Azure portal, go to your Bastion host.
1. On the **Configuration** page, for **Tier**, select a SKU.  Notice that the available features change, depending on the SKU you select. The following screenshot shows the required values.

   :::image type="content" source="./media/upgrade-sku/sku-values.png" alt-text="Screenshot of tier select dropdown with Standard selected." lightbox="./media/upgrade-sku/sku-values.png":::
1. Create a new public IP address value unless you have already created one for your bastion host, in which case, select the value.
1. Click **Manage Subnets** to add a subnet for your bastion host. The subnet name must be "AzureBastionSubnet". The subnet prefix must be at least /26 (/25, /24 etc.). Save your subnet. Using the breadcrumbs at the top of the page, go back to the Configuration page.
1. You can add features at the same time you upgrade the SKU. You don't need to upgrade the SKU and then go back to add the features as a separate step.
1. Select **Apply** to apply changes. The bastion host updates. This takes about 10 minutes to complete.

## Upgrade from a Basic SKU

Use the following steps to upgrade to a higher SKU.

1. In the Azure portal, go to your Bastion host.

1. On the **Configuration** page, for **Tier**, select a higher SKU.

1. You can add features at the same time you upgrade the SKU. You don't need to upgrade the SKU and then go back to add the features as a separate step.

1. Select **Apply** to apply changes. The bastion host updates. This takes about 10 minutes to complete.

## Next steps

* See [Configuration settings](configuration-settings.md).
* Read the [Bastion FAQ](bastion-faq.md).
