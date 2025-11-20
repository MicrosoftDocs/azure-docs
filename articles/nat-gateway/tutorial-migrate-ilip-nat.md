---
title: 'Tutorial: Migrate a virtual machine public IP address to a NAT gateway'
titleSuffix: Azure NAT Gateway
description: Use this tutorial to learn how to migrate your virtual machine public IP address to an Azure NAT Gateway.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: tutorial
ms.date: 09/12/2025
ms.custom: template-tutorial 
# Customer intent: As a network engineer, I want to migrate my virtual machine public IP address to a NAT gateway to improve outbound connectivity.
---

# Tutorial: Migrate a virtual machine public IP address to Azure NAT Gateway

In this tutorial, you learn how to migrate your virtual machine's public IP address to a NAT gateway. You learn how to remove the IP address from the virtual machine. You reuse the IP address from the virtual machine for the NAT gateway.

Azure NAT Gateway is the recommended method for outbound connectivity. Azure NAT Gateway is a fully managed and highly resilient Network Address Translation (NAT) service. A NAT gateway doesn't have the same limitations of Source Network Address Translation (SNAT) port exhaustion as default outbound access. A NAT gateway replaces the need for a virtual machine to have a public IP address to have outbound connectivity.

For more information about Azure NAT Gateway, see [What is Azure NAT Gateway?](nat-overview.md)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Remove the public IP address from the virtual machine.
> * Associate the public IP address from the virtual machine with a NAT gateway.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

* An Azure Virtual Machine with a public IP address assigned to its network interface. For more information on creating a virtual machine with a public IP, see [Quickstart: Create a Windows virtual machine in the Azure portal](/azure/virtual-machines/windows/quick-create-portal).
    
    * For the purposes of this article, the example virtual machine is named **vm-1**. The example public IP address is named **public-ip**.

> [!NOTE]
> Removal of the public IP address prevents direct connections to the virtual machine from the internet. RDP or SSH access won't function to the virtual machine after you complete this migration. To securely manage virtual machines in your subscription, use Azure Bastion. For more information on Azure Bastion, see [What is Azure Bastion?](../bastion/bastion-overview.md).

## Remove public IP from virtual machine

In this section, you learn how to remove the public IP address from the virtual machine.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines**.

1. In **Virtual machines**, select **vm-1** or your virtual machine.

1. In the **Overview** of **vm-1**, select **Public IP address**.
    
1. In **public-ip**, select the **Overview** page in the left-hand column.

1. In **Overview**, select **Dissociate**.

1. Select **Yes** in **Dissociate public IP address**.

### (Optional) Upgrade IP address

The NAT gateway resource requires a standard public IP address. In this section, you upgrade the IP you removed from the virtual machine in the previous section. If the IP address you removed is already a standard public IP, you can proceed to the next section.

1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses**.

1. In **Public IP addresses**, select **public-ip** or your basic IP address.

1. In the **Overview** of **public-ip**, select the IP address upgrade banner.

1. In **Upgrade to Standard SKU**, select the box next to **I acknowledge**. Select the **Upgrade** button.

1. When the upgrade is complete, proceed to the next section.

## Create NAT gateway

In this section, you create a NAT gateway with the IP address you previously removed from the virtual machine. You assign the NAT gateway to your precreated subnet within your virtual network. The subnet name for this example is **default**.

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **Create**.

1. Enter or select the following information in the **Basics** tab of **Create network address translation (NAT) gateway**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** or your resource group. |
    | **Instance details** |  |
    | NAT gateway name | Enter **nat-gateway**. |
    | Region | Select your region. This example uses **East US 2**. |
    | SKU | Select **Standard**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select **Next**.

1. In the **Outbound IP** tab, select **+ Add public IP addresses or prefixes**.

1. In **Add public IP addresses or prefixes**, select **Public IP addresses**. Select the public IP address you removed from the virtual machine in the previous steps. In this example, it's **public-ip**.

1. Select **Next**.

1. In the **Networking** tab, in **Virtual network**, select your virtual network. In this example, it's **vnet-1**.

1. Leave the checkbox for **Default to all subnets** unchecked.

1. In **Select specific subnets**, select your subnet. In this example, it's **subnet-1**.

1. Select **Review + create**, then select **Create**.

## Next step

In this article, you learned how to:

* Remove a public IP address from a virtual machine.

* Create a NAT gateway and use the public IP address from the virtual machine for the NAT gateway resource.

NAT gateway provides connectivity benefits and allows any virtual machine created within this subnet to have outbound connectivity without requiring a public IP address. For more information about NAT gateway and its connectivity benefits, see the [Design virtual networks with NAT gateway](nat-gateway-resource.md) documentation.

Advance to the next article to learn how to migrate default outbound access to Azure NAT Gateway:
> [!div class="nextstepaction"]
> [Migrate outbound access to NAT gateway](tutorial-migrate-outbound-nat.md)
