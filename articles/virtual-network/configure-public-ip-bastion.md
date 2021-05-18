---
title: Use a public IP address with Azure Bastion
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with Azure Bastion and how to change the configuration.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 05/17/2021
ms.custom: template-how-to 
---

# Use a public IP address with Azure Bastion

A public IP address in Azure is available in standard and basic SKUs. The selection of SKU determines the features of the IP address. The SKU determines the resources that the IP address can be associated with. 

Azure Bastion is deployed to provide secure management connectivity to virtual machines in a virtual network. Azure Bastion Service enables you to securely and seamlessly RDP & SSH to your VMs in your Azure virtual network, without exposing a public IP on the VM, directly from the Azure portal, without the need of any additional client/agent or any piece of software. Azure Bastion supports standard SKU public IP addresses.

Examples of resources that support standard SKU public IPs exclusively:

* Cross-region load balancer
* NAT gateway

A Azure Bastion host requires a public IP address for it's configuration.

In this article, you'll learn how to create a Azure Bastion host using an existing public IP in your subscription. Azure Bastion doesn't support the change of the public IP address after creation.  Azure Bastion doesn't support public IP prefixes.
## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- One standard SKU public IP address in your subscription. The IP address can't be associated with any resources. For more information on creating a standard SKU public IP address, see [Create a public IP - Azure portal](create-public-ip-portal.md).
    - For the purposes of the examples in this article, name the new public IP address **myStandardPublicIP**.

## Create Azure Bastion using existing IP

In this section, you'll create a Azure Bastion host. You'll select the IP address you created in the prerequisites as the public IP for bastion host.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Bastion**.

3. In the search results, select **Bastions**.

4. Select **+ Create**.

5. In **Create a bastion**, enter or select the following information.

    | Setting | Value | 
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroup** in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | Name | Enter **myBastionHost**. |
    | Region | Select **(US) West US 2**. |
    | **Configure virtual network** |   |
    | Virtual network | Select **Create new**. </br> Enter **myVNet** in **Name**. </br> Leave the default address space of **10.4.0.0/16**. </br> Leave the default subnet of **10.4.0.0/24**. </br> In the text box under the **default** subnet, enter **AzureBastionSubnet**. </br> In address range, enter **10.4.1.0/27**. </br> Select **OK**. |
    | Subnet | Select **AzureBastionSubnet**. |
    | **Public IP address** |   |
    | Public IP address | Select **Use existing**. |
    | Choose public IP address | Select **myStandardPublicIP**. |

6. Select the **Review + create** tab, or select the blue **Review + create** button.

7. Select **Create**.

> [!NOTE]
> For more information on Azure Bastion, see [What is Azure Bastion?](../bastion/bastion-overview.md)

## Change or remove public IP address

Azure Bastion doesn't support the changing of the public IP address after creation.

## Next steps

In this article, you learned how to create a Azure Bastion and use an existing public IP. 

- For more information about Azure Bastion, see [What is Azure Bastion?](../bastion/bastion-overview.md)
- To learn more about public IP addresses in Azure, see [Public IP addresses](public-ip-addresses.md).
