---
title: Manage a public IP address with Azure Bastion
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with Azure Bastion and how to change the configuration.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 09/19/2023
ms.custom: template-how-to 
---

# Manage a public IP address with Azure Bastion

Public IP addresses are available in two SKUs; standard, and basic. The selection of SKU determines the features of the IP address. The SKU determines the resources that the IP address can be associated with.

Azure Bastion is deployed to provide secure management connectivity to virtual machines in a virtual network. Azure Bastion Service enables you to securely and seamlessly RDP & SSH to the VMs in your virtual network. Azure Bastion enables connections without exposing a public IP on the VM. Connections are made directly from the Azure portal, without the need of an extra client/agent or piece of software. Azure Bastion supports standard SKU public IP addresses.

An Azure Bastion host requires a public IP address for its configuration.

In this article, you learn how to create an Azure Bastion host using an existing public IP in your subscription. Azure Bastion doesn't support the change of the public IP address after creation.  Azure Bastion supports assigning an IP address within an IP prefix range but not assigning the IP prefix range itself. 

>[!NOTE]
>[!INCLUDE [Pricing](../../../includes/bastion-pricing.md)]

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- One standard SKU public IP address in your subscription. The IP address can't be associated with any resources. For more information on creating a standard SKU public IP address, see [Create a public IP - Azure portal](./create-public-ip-portal.md).
    - For the purposes of the examples in this article, name the new public IP address **myStandardPublicIP**.

## Create Azure Bastion using existing IP

In this section, you create an Azure Bastion host. You select the IP address you created in the prerequisites as the public IP for bastion host.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Bastion**.

3. In the search results, select **Bastion**.

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
    | Tier | Select **Basic**. |
    | **Configure virtual network** |   |
    | Virtual network | Select **Create new**. </br> Enter **myVNet** in **Name**. </br> Leave the default address space of **10.4.0.0/16**. </br> Leave the default subnet of **10.4.0.0/24**. </br> In the text box under the **default** subnet, enter **AzureBastionSubnet**. </br> In address range, enter **10.4.1.0/26**. </br> Select **OK**. |
    | Subnet | Select **AzureBastionSubnet**. |
    | **Public IP address** |   |
    | Public IP address | Select **Use existing**. |
    | Choose public IP address | Select **myStandardPublicIP**. |

6. Select the **Review + create** tab, or select the blue **Review + create** button.

7. Select **Create**.

> [!NOTE]
> For more information on Azure Bastion, see [What is Azure Bastion?](../../bastion/bastion-overview.md)

## Change or remove public IP address

Azure Bastion doesn't support the changing of the public IP address after creation.

## More information

* There isn't a requirement for a separate public IP on the virtual machine when connecting via Azure Bastion. Traffic is first routed to the public IP of Bastion. Bastion then routes RDP or SSH connections to the private IP address associated with the virtual machine. 

## Caveats

* Public IPv6 addresses aren't supported for Azure Bastion at this time.  

## Next steps

In this article, you learned how to create an Azure Bastion and use an existing public IP. 

- For more information about Azure Bastion, see [What is Azure Bastion?](../../bastion/bastion-overview.md)
- To learn more about public IP addresses in Azure, see [Public IP addresses](./public-ip-addresses.md).
