---
title: Upgrade or view a SKU - portal
titleSuffix: Azure Bastion
description: Learn how to view a SKU and upgrade SKU tiers.
author: cherylmc
ms.service: azure-bastion
ms.topic: how-to
ms.date: 12/09/2024
ms.author: cherylmc

---

# View or upgrade a SKU

This article helps you view and upgrade your Bastion SKU. Once you upgrade, you can't revert back to a lower SKU without deleting and reconfiguring Bastion. For more information about features and SKUs, see [Configuration settings](configuration-settings.md).

[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

## View a SKU

To view the SKU for your bastion host, use the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, go to your bastion host.
1. In the left pane, select **Configuration** to open the Configuration page. Click through the different Tier options. Notice that the SKU affects the available features you can select for your bastion host.

## Upgrade from the Developer SKU

When you upgrade from a Developer SKU to a dedicated deployment SKU, you need to create a public IP address and an Azure Bastion subnet.

Use the following steps to upgrade to a higher SKU.

1. In the Azure portal, go to your virtual network and add a new subnet. The subnet must be named **AzureBastionSubnet** and must be /26 or larger (/25, /24 etc.). This subnet will be used exclusively by Azure Bastion.
1. Next, go to the portal page for your **Bastion** host.
1. On the **Configuration** page, for **Tier**, select the SKU that you want to upgrade to. Notice that the available features change, depending on the SKU you select.
1. Create a new public IP address value unless you have already created one for your bastion host, in which case, select the value.
1. Because you already created the AzureBastionSubnet, the **Subnet** field will automatically populate.
1. You can add features at the same time you upgrade the SKU. You don't need to upgrade the SKU and then go back to add the features as a separate step.
1. Select **Apply** to apply changes. The bastion host updates. This procedure takes about 10 minutes to complete.

## Upgrade from the Basic or Standard SKU

Use the following steps to upgrade to a higher SKU.

1. In the Azure portal, go to your Bastion host.

1. On the **Configuration** page, for **Tier**, select a higher SKU.

1. You can add features at the same time you upgrade the SKU. You don't need to upgrade the SKU and then go back to add the features as a separate step.

1. Select **Apply** to apply changes. The bastion host updates. This procedure takes about 10 minutes to complete.

## Next steps

* See [Configuration settings](configuration-settings.md).
* Read the [Bastion FAQ](bastion-faq.md).
