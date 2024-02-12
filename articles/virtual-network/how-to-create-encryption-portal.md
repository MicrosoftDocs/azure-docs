---
title: Create a virtual network with encryption - Azure portal
titleSuffix: Azure Virtual Network
description: Learn how to create an encrypted virtual network using the Azure portal. A virtual network lets Azure resources communicate with each other and with the internet. 
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 07/07/2023
ms.author: allensu

---

# Create a virtual network with encryption using the Azure portal

Azure Virtual Network encryption is a feature of Azure Virtual Network. Virtual network encryption allows you to seamlessly encrypt and decrypt internal network traffic over the wire, with minimal effect to performance and scale. Azure Virtual Network encryption protects data traversing your virtual network virtual machine to virtual machine and virtual machine to on-premises.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

[!INCLUDE [virtual-network-create.md](../../includes/virtual-network-create.md)]

> [!IMPORTANT]
> Azure Virtual Network encryption requires supported virtual machine SKUs in the virtual network for traffic to be encrypted. The setting **dropUnencrypted** will drop traffic between unsupported virtual machine SKUs if they are deployed in the virtual network. For more information, see [Azure Virtual Network encryption requirements](virtual-network-encryption-overview.md#requirements).

## Enable encryption

1. In the search box at the top of the portal, begin typing **Virtual networks**. When **Virtual networks** appears in the search results, select it.

1. Select **vnet-1**.

1. In the **Overview** of **vnet-1**, select the **Properties** tab.

1. Select **Disabled** next to **Encryption**:

    :::image type="content" source="./media/how-to-create-encryption-portal/virtual-network-properties.png" alt-text="Screenshot of properties of the virtual network.":::

1. Select the box next to **Virtual network encryption**.

1. Select **Save**.

## Verify encryption enabled

1. In the search box at the top of the portal, begin typing **Virtual networks**. When **Virtual networks** appears in the search results, select it.

1. Select **vnet-1**.

1. In the **Overview** of **vnet-1**, select the **Properties** tab.

1. Verify that **Encryption** is set to **Enabled**.

    :::image type="content" source="./media/how-to-create-encryption-portal/virtual-network-properties-encryption-enabled.png" alt-text="Screenshot of properties of the virtual network with encryption enabled.":::

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

- For more information about Azure Virtual Networks, see [What is Azure Virtual Network?](/azure/virtual-network/virtual-networks-overview)

- For more information about Azure Virtual Network encryption, see [What is Azure Virtual Network encryption?](virtual-network-encryption-overview.md)
