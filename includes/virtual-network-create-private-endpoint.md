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

## Create a virtual network for a private endpoint

The following procedure creates a virtual network with a subnet.

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** |
    | **Instance details** |  |
    | Name | Enter **vnet-private-endpoint**. |
    | Region | Select **East US 2**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Next** to proceed to the **IP Addresses** tab.

1. Select **Delete address space** with the trash can icon to remove the default address space.

1. Select **Add IPv4 address space**.

1. Enter **10.1.0.0** and leave the pull-down box at the default of **/16 (65,536 addresses)**.

1. Select **+ Add a subnet**.

1. In **Add a subnet**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Subnet details** |  |
    | Subnet template | Leave the default **Default**. |
    | Name | Enter **subnet-private**. |
    | Starting address | Leave the default of **10.1.0.0**. |
    | Subnet size | Leave the default of **/24(256 addresses)**. |

1. Select **Add**.

1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.
