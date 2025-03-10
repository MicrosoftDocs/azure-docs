---
 title: include file
 description: include file
 services: load-balancer
 author: mbender-ms
 ms.service: azure-load-balancer
 ms.topic: include
 ms.date: 10/31/2023
 ms.author: mbender
 ms.custom: include file
---

## Create a virtual network and bastion host

The following procedure creates a virtual network with a resource subnet, an Azure Bastion subnet, and an Azure Bastion host.

> [!IMPORTANT]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **load-balancer-rg** in Name. </br> Select **OK**. |
    | **Instance details** |  |
    | Name | Enter **lb-vnet**. |
    | Region | Select **East US**. |

    :::image type="content" source="./media/load-balancer-internal-create-bastion-include/create-virtual-network-basics.png" alt-text="Screenshot of Basics tab of Create virtual network in the Azure portal.":::

1. Select the **Security** tab or **Next** button at the bottom of the page.
1. Under **Azure Bastion**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Azure Bastion** |  |
    | Enable Azure Bastion | Select checkbox. |
    | Azure Bastion host name | Enter **lb-bastion**. |
    | Azure Bastion public IP address | Select **Create new**. </br> Enter **lb-bastion-ip** in Name. </br> Select **OK**. |

1. Select the **IP addresses** tab, or **Next** at the bottom of the page.
1. On **Create virtual network** page, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Add IPv4 address space** |  |
    | IPv4 address space | Enter **10.0.0.0/16 (65,356 addresses)**. |
    | **Subnets** | Select the **default** subnet link to edit.  |
    | Subnet template | Leave the default **Default**. |
    | Name | Enter **backend-subnet**. |
    | Starting address | Enter **10.0.0.0**. |
    | Subnet size | Enter **/24(256 addresses)**. |
    | **Security** |   |
    | NAT Gateway | Select **None**. |

    :::image type="content" source="./media/load-balancer-create-no-gateway/edit-subnet-window.png" alt-text="Screenshot of default subnet rename and configuration.":::

1. Select **Save**.

1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.