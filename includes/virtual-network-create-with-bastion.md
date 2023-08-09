---
 title: include file
 description: include file
 services: virtual-network
 author: asudbring
 ms.service: virtual-network
 ms.topic: include
 ms.date: 06/06/2023
 ms.author: allensu
 ms.custom: include file
---

## Create a virtual network and bastion host

The following procedure creates a virtual network with a resource subnet, an Azure Bastion subnet, and an Azure Bastion host.

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

    :::image type="content" source="./media/virtual-network-create-with-bastion/create-virtual-network-basics.png" alt-text="Screenshot of Basics tab of Create virtual network in the Azure portal":::

1. Select **Next: IP Addresses** at the bottom of the page.

1. In the **IP Addresses** tab, under **IPv4 address space**, select the garbage deletion icon to remove any address space that already appears, and then enter **10.0.0.0/16**.

1. Select **+ Add subnet**.

1. Enter or select the following information in **Add subnet**:

    | Setting | Value |
    |---|---|
    | Subnet name | Enter **subnet-1**. |
    | Subnet address range | Enter **10.0.0.0/24**. |

    :::image type="content" source="./media/virtual-network-create-with-bastion/address-subnet-space.png" alt-text="Screenshot of IP address space and subnet creation in Create virtual network in the Azure portal":::

1. Select **Add**.

1. Select **Next: Security** at the bottom of the page.

1. On the Security tab, next to **BastionHost**, select **Enable**.

    Azure Bastion uses your browser to connect to VMs in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](../articles/bastion/bastion-overview.md)

    >[!NOTE]
    >[!INCLUDE [Pricing](bastion-pricing.md)]

1. Enter or select the following information:

    | Setting | Value |
    |---|---|
    | Bastion name | Enter **bastion**. |
    | AzureBastionSubnet address space | Enter **10.0.1.0/26**. |
    | Public IP address | Select **Create new**. </br> Enter **public-ip** in Name. </br> Select **OK**. |

    :::image type="content" source="./media/virtual-network-create-with-bastion/enable-bastion.png" alt-text="Screenshot of enable bastion host in Create virtual network in the Azure portal":::

1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.
