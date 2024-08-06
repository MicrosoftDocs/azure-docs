---
 title: include file
 description: include file
 services: virtual-network
 author: asudbring
 ms.service: virtual-network
 ms.topic: include
 ms.date: 07/01/2024
 ms.author: allensu
 ms.custom: include file
---

The following procedure creates a virtual network with a resource subnet.

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **test-rg** in Name. </br> Select **OK**. |
    | **Instance details** |  |
    | Name | Enter **vnet-1**. |
    | Region | Select **East US 2**. |

    :::image type="content" source="~/reusable-content/ce-skilling/azure/includes/media/virtual-network-create/create-virtual-network-basics.png" alt-text="Screenshot of Basics tab of Create virtual network in the Azure portal." lightbox="~/reusable-content/ce-skilling/azure/includes/media/virtual-network-create/create-virtual-network-basics.png":::

1. Select **Next** to proceed to the **Security** tab.

1. Select **Next** to proceed to the **IP Addresses** tab.
    
1. In the address space box in **Subnets**, select the **default** subnet.

1. In **Edit subnet**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | Subnet purpose | Leave the default **Default**. |
    | Name | Enter **subnet-1**. |

1. Leave the rest of the settings as their defaults. Select **Save**.

    :::image type="content" source="~/reusable-content/ce-skilling/azure/includes/media/virtual-network-create/address-subnet-space.png" alt-text="Screenshot of default subnet rename and configuration." lightbox="~/reusable-content/ce-skilling/azure/includes/media/virtual-network-create/address-subnet-space.png":::

1. Select **Save**.

1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.
