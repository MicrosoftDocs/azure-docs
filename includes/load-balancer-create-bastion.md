---
 title: include file
 description: include file
 services: load-balancer
 author: mbender-ms
 ms.service: azure-load-balancer
 ms.topic: include
 ms.date: 01/28/2026
 ms.author: mbender
 ms.custom:
   - include file
   - sfi-image-nochange
---

## Create a virtual network and bastion host

In this section, you create a virtual network with a resource subnet, an Azure Bastion subnet, and an Azure Bastion host.

> [!IMPORTANT]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **load-balancer-rg** from the dropdown or **Create new** if it doesn't exist.</br> Enter **load-balancer-rg** in Name.</br> Select **OK**. |
    | **Instance details** |  |
    | Name | Enter **lb-vnet**. |
    | Region | Select **(US) East US**. |

1. Select the **Security** tab or **Next** button at the bottom of the page.
1. Under **Azure Bastion**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Azure Bastion** |  |
    | Enable Azure Bastion | Select checkbox. |
    | Azure Bastion host name | Enter **lb-vnet-bastion**. |
    | Azure Bastion public IP address | Select **Create new**.</br> Enter **lb-vnet-bastion-ip** in Name.</br> Select **OK**. |

1. Select the **IP addresses** tab, or **Next** at the bottom of the page.
1. On **Create virtual network** page, enter or select the following information:

    | Setting | Value |
    |---|---|
    | IPv4 address space | Enter **10.0.0.0/16 (65,356 addresses)**. |
    | **Subnets** | Select the **default** subnet link to edit.  |
    | **Edit subnet** | |
    | Subnet purpose | Leave the default **Default**. |
    | Name | Enter **backend-subnet**. |
    | Starting address | Enter **10.0.0.0**. |
    | Subnet size | Enter **/24(256 addresses)**. |
    | **Security** |   |
    | NAT Gateway | Select **lb-nat-gateway**. |

1. Select **Save**.
1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.
