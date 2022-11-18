---
title: 'Upgrade a public IP address - Azure portal'
description: In this article, you learn how to upgrade a basic SKU public IP address using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 10/28/2022
ms.custom: template-how-to, engagement-fy23
---

# Upgrade a public IP address using the Azure portal

Azure public IP addresses are created with a SKU, either Basic or Standard. The SKU determines their functionality including allocation method, feature support, and resources they can be associated with. 

In this article, you'll learn how to upgrade a static Basic SKU public IP address to Standard SKU in the Azure portal.

## Prerequisites

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A static basic SKU public IP address in your subscription. For more information, see [Create a basic SKU public IP address using the Azure portal](./create-public-ip-portal.md?tabs=option-1-create-public-ip-basic#create-a-basic-sku-public-ip-address).

## Upgrade public IP address

In this section, you'll sign in to the Azure portal and upgrade your static Basic SKU public IP to the Standard sku.

In order to upgrade a public IP, it must not be associated with any resource. For more information, see [View, modify settings for, or delete a public IP address](./virtual-network-public-ip-address.md#view-modify-settings-for-or-delete-a-public-ip-address) to learn how to disassociate a public IP.

>[!IMPORTANT]
>Public IPs upgraded from Basic to Standard SKU continue to have no [availability zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).  This means they cannot be associated with an Azure resource that is either zone-redundant or tied to a pre-specified zone in regions where this is offered.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Public IP**.

3. In the search results, select **Public IP addresses**.

4. In **Public IP addresses**, select **myBasicPublicIP** or the IP address you want to upgrade.

5. Select the upgrade banner at the top of the overview section in **myBasicPublicIP**.

    :::image type="content" source="./media/public-ip-upgrade-portal/upgrade-ip-portal.png" alt-text="Screenshot showing the upgrade banner in Azure portal used to upgrade basic IP address." border="true":::

    > [!NOTE]
    > The basic public IP you are upgrading must have static assignment. You'll receive a warning that the IP can't be upgraded if you try to upgrade a dynamically allocated IP address. Change the IP address assignment to static before upgrading.

6.  Select the **I acknowledge** check box, and then select **Upgrade**.

    > [!WARNING]
    > Upgrading a basic public IP to standard SKU can't be reversed. Public IPs upgraded from basic to standard SKU continue to have no guaranteed [availability zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

## Verify upgrade

In this section, you'll verify the public IP address is now the standard sku.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Public IP**.

3. In the search results, select **Public IP addresses**.

4. In **Public IP addresses**, select **myBasicPublicIP** or the IP address you upgraded.

5. Verify that the SKU is listed as **Standard** in the **Overview** section.

    :::image type="content" source="./media/public-ip-upgrade-portal/verify-upgrade-ip.png" alt-text="Screenshot showing public IP address is standard SKU." border="true":::

## Next steps

In this article, you upgraded a basic SKU public IP address to standard SKU.

For more information on public IP addresses in Azure, see:

- [Public IP addresses in Azure](public-ip-addresses.md)
- [Create a public IP - Azure portal](./create-public-ip-portal.md)
