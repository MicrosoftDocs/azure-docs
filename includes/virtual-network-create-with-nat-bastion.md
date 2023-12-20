---
 title: include file
 description: include file
 services: virtual-network
 author: asudbring
 ms.service: virtual-network
 ms.topic: include
 ms.date: 06/20/2023
 ms.author: allensu
 ms.custom: include file
---

## Create a NAT gateway

Before you deploy the NAT gateway resource and the other resources, a resource group is required to contain the resources deployed. In the following steps, you create a resource group, NAT gateway resource, and a public IP address. You can use one or more public IP address resources, public IP prefixes, or both. 

For information about public IP prefixes and a NAT gateway, see [Manage NAT gateway](../articles/nat-gateway/manage-nat-gateway.md?tabs=manage-nat-portal#add-or-remove-a-public-ip-prefix).

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**. 

1. In **Create network address translation (NAT) gateway**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription.                                  |
    | Resource Group   | Select **Create new**. </br> Enter **test-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | NAT gateway name             | Enter **nat-gateway**                                    |
    | Region           | Select **East US 2**  |
    | Availability Zone | Select **No Zone**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

    For information about availability zones and NAT gateway, see [NAT gateway and availability zones](../articles/nat-gateway/nat-availability-zones.md).

1. Select the **Outbound IP** tab, or select the **Next: Outbound IP** button at the bottom of the page.

1. In the **Outbound IP** tab, enter or select the following information:

    | **Setting** | **Value** |
    | ----------- | --------- |
    | Public IP addresses | Select **Create a new public IP address**. </br> In **Name**, enter **public-ip-nat**. </br> Select **OK**. |

1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

## Create a virtual network and bastion host

The following procedure creates a virtual network with a resource subnet, an Azure Bastion subnet, and an Azure Bastion host.

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **vnet-1**. |
    | Region | Select **East US 2**. |

    :::image type="content" source="./media/virtual-network-create-with-nat-bastion/create-virtual-network-basics.png" alt-text="Screenshot of Basics tab of Create virtual network in the Azure portal.":::

1. Select **Next** to proceed to the **Security** tab.

1. Select **Enable Bastion** in the **Azure Bastion** section of the **Security** tab.

    Azure Bastion uses your browser to connect to VMs in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](../articles/bastion/bastion-overview.md)

    >[!NOTE]
    >[!INCLUDE [Pricing](bastion-pricing.md)]

1. Enter or select the following information in **Azure Bastion**:

    | Setting | Value |
    |---|---|
    | Azure Bastion host name | Enter **bastion**. |
    | Azure Bastion public IP address | Select **Create a public IP address**. </br> Enter **public-ip** in Name. </br> Select **OK**. |

    :::image type="content" source="./media/virtual-network-create-with-nat-bastion/enable-bastion.png" alt-text="Screenshot of enable bastion host in Create virtual network in the Azure portal.":::

1. Select **Next** to proceed to the **IP Addresses** tab.
    
1. In the address space box in **Subnets**, select the **default** subnet.

1. In **Edit subnet**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Subnet details** |  |
    | Subnet template | Leave the default **Default**. |
    | Name | Enter **subnet-1**. |
    | Starting address | Leave the default of **10.0.0.0**. |
    | Subnet size | Leave the default of **/24(256 addresses)**. |
    | **Security** |  |
    | NAT gateway | Select **nat-gateway**. |

    :::image type="content" source="./media/virtual-network-create-with-nat-bastion/address-subnet-space.png" alt-text="Screenshot of default subnet rename and configuration.":::

1. Select **Save**.

1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.
