---
title: Create a VM with a static public IP address - Azure portal
description: Learn how to create a VM with a static public IP address using the Azure portal.
services: virtual-network
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom: template-how-to, engagement-fy23
---
# Create a virtual machine with a static public IP address using the Azure portal

In this article, you'll create a virtual machine (VM) with a static public IP address. A public IP address enables you to communicate to a VM from the internet. Assign a static public IP address, rather than a dynamic address, to ensure the address never changes. 

Public IP addresses have a [nominal charge](https://azure.microsoft.com/pricing/details/ip-addresses). There's a [limit](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) to the number of public IP addresses that you can use per subscription. 

You can download the list of ranges (prefixes) for the Azure [Public](https://www.microsoft.com/download/details.aspx?id=56519), [US government](https://www.microsoft.com/download/details.aspx?id=57063), [China](https://www.microsoft.com/download/details.aspx?id=57062), and [Germany](https://www.microsoft.com/download/details.aspx?id=57064) clouds.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual machine

1. In the search box at the top of the portal, enter *Virtual machine*.

2. In the search results, select **Virtual machines**. 

3. Select **+ Create**, then select **Azure virtual machine**.

4. In **Basics** tab of **Create a virtual machine**, enter or select the following:

    | Setting | Value  |
    | ------- | ------ |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **Create new**. </br> In **Name**, enter *myResourceGroup*. </br> Select **OK**. |
    | **Instance details** |  |
    | Virtual machine name | Enter *myVM*. |
    | Region | Select **East US**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - x64 Gen2**. |
    | Size | Choose VM size or take default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **RDP (3389)**. |

    > [!WARNING]
    > Port 3389 is selected to enable remote access to the Windows Server virtual machine from the internet. Opening port 3389 to the internet is not recommended to manage production workloads. </br> For secure access to Azure virtual machines, see **[What is Azure Bastion?](../../bastion/bastion-overview.md)**

5. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
6. In the **Networking** tab, enter or select the following:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Accept the default network name. |
    | Subnet | Accept the default subnet configuration. |
    | Public IP | Select **Create new**. </br> In **Create public IP address**, enter *myPublicIP* in **Name** . </br> **SKU**: select **Standard**. </br> **Assignment**: select **Static**. </br> Select **OK**.  |
    | NIC network security group | Select **Basic** |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **RDP (3389)** |
    
    > [!NOTE]
    > The SKU of the virtual machine's public IP address must match the public IP SKU of Azure public load balancer when added to the backend pool of the load balancer. For details, see [Azure Load Balancer](../../load-balancer/skus.md).
   
7. Select **Review + create**. 
  
8. Review the settings, and then select **Create**.

> [!WARNING]
> Do not modify the IP address settings within the virtual machine's operating system. The operating system is unaware of Azure public IP addresses. Though you can add private IP address settings to the operating system, we recommend not doing so unless necessary. For more information, see [Add a private IP address to an operating system](./virtual-network-network-interface-addresses.md#private).

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains:

1. Enter *myResourceGroup* in the search box at the top of the portal. When you see **myResourceGroup** in the search results, select it.

2. Select **Delete resource group**.

3. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this article, you learned how to create a VM with a static public IP.

- Learn how to [Configure IP addresses for an Azure network interface](./virtual-network-network-interface-addresses.md).

- Learn how to [Assign multiple IP addresses to virtual machines](./virtual-network-multiple-ip-addresses-portal.md) using the Azure portal.

- Learn more about [public IP addresses](./public-ip-addresses.md#public-ip-addresses) in Azure.


