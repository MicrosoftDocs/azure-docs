---
title: Add a dual-stack network to an existing virtual machine - Azure portal
titleSuffix: Azure Virtual Network
description: Learn how to add a dual stack network to an existing virtual machine using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 08/24/2023
ms.custom: template-how-to
---

# Add a dual-stack network to an existing virtual machine using the Azure portal

In this article, you add IPv6 support to an existing virtual network. You configure an existing virtual machine with both IPv4 and IPv6 addresses. When completed, the existing virtual network supports private IPv6 addresses. The existing virtual machine network configuration contains a public and private IPv4 and IPv6 address.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing virtual network, public IP address and virtual machine in your subscription that is configured for IPv4 support only. For more information about creating a virtual network, public IP address and a virtual machine, see [Quickstart: Create a Linux virtual machine in the Azure portal](../../virtual-machines/linux/quick-create-portal.md).

    - The example virtual network used in this article is named **myVNet**. Replace this value with the name of your virtual network.
    
    - The example virtual machine used in this article is named **myVM**. Replace this value with the name of your virtual machine.
    
    - The example public IP address used in this article is named **myPublicIP**. Replace this value with the name of your public IP address.

## Add IPv6 to virtual network

In this section, you add an IPv6 address space and subnet to your existing virtual network.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **myVNet** in **Virtual networks**.

4. Select **Address space** in **Settings**.

5. Select the box **Add additional address range**. Enter **2404:f800:8000:122::/63**.

6. Select **Save**.

7. Select **Subnets** in **Settings**.

8. In **Subnets**, select your subnet name from the list. In this example, the subnet name is **default**. 

9. In the subnet configuration, select the box **Add IPv6 address space**.

10. In **IPv6 address space**, enter **2404:f800:8000:122::/64**.

11. Select **Save**.

## Create IPv6 public IP address

In this section, you create a IPv6 public IP address for the virtual machine.

1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

2. Select **+ Create**.

3. Enter or select the following information in **Create public IP address**.

    | Setting | Value |
    | ------- | ----- |
    | IP version | Select IPv6. |
    | SKU | Select **Standard**. |
    | **IPv6 IP Address Configuration** |  |
    | Name | Enter **myPublicIP-IPv6**. |
    | Idle timeout (minutes) | Leave the default of **4**. |
    | Subscription | Select your subscription. |
    | Resource group | Select your resource group. In this example, the resource group is named **myResourceGroup**. |
    | Location | Select your location. In this example, the location is **East US 2**. |
    | Availability zone | Select **Zone-redundant**. |

4. Select **Create**.

## Add IPv6 configuration to virtual machine

The virtual machine must be stopped to add the IPv6 configuration to the existing virtual machine. You stop the virtual machine and add the IPv6 configuration to the existing virtual machine's network interface.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM** or your existing virtual machine name.

3. Stop **myVM**.

4. Select **Networking** in **Settings**.

5. Select your network interface name next to **Network Interface:**. In this example, the network interface is named **myvm404**.

6. Select **IP configurations** in **Settings** of the network interface.

7. In **IP configurations**, select **+ Add**.

8. Enter or select the following information in **Add IP configuration**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **Ipv6config**. |
    | IP version | Select **IPv6**. |
    | **Private IP address settings** |  |
    | Allocation | Leave the default of **Dynamic**. |
    | Public IP address | Select **Associate**. |
    | Public IP address | Select **myPublic-IPv6**. |

9. Select **OK**.

10. Start **myVM**.

## Next steps

In this article, you learned how to add a dual stack IP configuration to an existing virtual network and virtual machine.

For more information about IPv6 and IP addresses in Azure, see:

- [Overview of IPv6 for Azure Virtual Network.](ipv6-overview.md)

- [What is Azure Virtual Network IP Services?](ip-services-overview.md)