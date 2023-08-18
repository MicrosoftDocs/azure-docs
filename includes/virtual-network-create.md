---
 title: include file
 description: include file
 services: virtual-network
 author: asudbring
 ms.service: virtual-network
 ms.topic: include
 ms.date: 07/24/2023
 ms.author: allensu
 ms.custom: include file
---

## Create a virtual network

The following procedure creates a virtual network with a resource subnet.

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **Create**.

1. On the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **test-rg** in Name. </br> Select **OK**. |
    | **Instance details** |  |
    | Name | Enter **vnet-1**. |
    | Region | Select **East US 2**. |

    :::image type="content" source="./media/virtual-network-create/create-virtual-network-basics.png" alt-text="Screenshot of Basics tab of Create virtual network in the Azure portal.":::

1. Select **Next: IP Addresses** at the bottom of the page.

1. In the **IP Addresses** tab, in **IPv4 address space**, select the garbage deletion icon to remove any address space that already appears, and then enter **10.0.0.0/16**.

1. Select **+ Add subnet**.

1. Enter or select the following information in **Add subnet**:

    | Setting | Value |
    |---|---|
    | Subnet name | Enter **subnet-1**. |
    | Subnet address range | Enter **10.0.0.0/24**. |

    :::image type="content" source="./media/virtual-network-create/address-subnet-space.png" alt-text="Screenshot of IP address space and subnet creation in Create virtual network in the Azure portal.":::

1. Select **Add**.

1. Select **Next: Security** at the bottom of the page.

1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.
