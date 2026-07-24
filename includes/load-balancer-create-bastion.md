---
 title: include file
 description: include file
 services: load-balancer
 author: mbender-ms
 ms.service: azure-load-balancer
 ms.topic: include
 ms.date: 07/07/2026
 ms.author: mbender
 ms.custom:
   - include file
   - sfi-image-nochange
---

## Create a virtual network and bastion host

In this section, you create a virtual network with a resource subnet, an Azure Bastion subnet, an Azure Bastion host, and a NAT gateway for outbound internet access for resources in the virtual network. For other options for outbound rules, see [Network Address Translation (SNAT) for outbound connections](/azure/load-balancer/load-balancer-outbound-connections).

[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. In the portal, search for and select **Virtual networks**.

1. On **Virtual networks**, select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **load-balancer-rg** from the dropdown or **Create new** if it doesn't exist.</br> Enter **load-balancer-rg** in Name.</br> Select **OK**. |
    | **Instance details** |  |
    | Name | Enter **lb-vnet**. |
    | Region | Select **(US) East US**. |

1. Select the **Security** tab or **Next** button at the bottom of the page.
1. Under **Azure Bastion**, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Azure Bastion** |  |
    | Enable Azure Bastion | Select the checkbox. |
    | Azure Bastion host name | Enter **lb-vnet-bastion**. |
    | Azure Bastion public IP address | Select **Create new**.</br> Enter **lb-vnet-bastion-ip** in Name.</br> Select **OK**. |

1. Select the **Address space** tab, or **Next** at the bottom of the page.
1. On **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | IPv4 address space | Enter **10.0.0.0/16 (65,356 addresses)**. |
    | **Subnets** | Select the **default** subnet link to edit. |
    | **Edit subnet** | |
    | Subnet purpose | Leave the default **Default**. |
    | Name | Enter **backend-subnet**. |
    | Starting address | Enter **10.0.0.0**. |
    | Subnet size | Enter **/24(256 addresses)**. |
    | **Security** |   |
    | NAT Gateway | Select **Create new**.</br> Enter **lb-nat-gateway** in name.</br> Select **Create a public IP address**. </br> Enter **nat-gw-public-ip**.</br> Enter **Ok** and **OK**. |

1. Select **Save**.
1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.
