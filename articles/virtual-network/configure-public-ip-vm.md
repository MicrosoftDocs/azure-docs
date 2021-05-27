---
title: Manage public IP address with a Azure Virtual Machine
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with Azure Virtual Machines and how to change the configuration.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 05/13/2021
ms.custom: template-how-to 
---

# Manage a public IP address with a Azure Virtual Machine

A public IP address in Azure is available in standard and basic SKUs. The selection of SKU determines the features of the IP address. The SKU determines the resources that the IP address can be associated with. 

Azure Virtual Machines are the main compute service in Azure. Customers can create Linux or Windows virtual machines. A public IP address can be assigned to a virtual machine for inbound connections to the virtual machine. 

A virtual machine doesn't require a public IP address for it's configuration.

In this article, you'll learn how to create a Azure Virtual Machine using an existing public IP in your subscription. You'll learn how to add a public IP address to a virtual machine, change the IP address, and how to remove the public IP.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- Three standard SKU public IP address in your subscription. The IP address can't be associated with any resources. For more information on creating a standard SKU public IP address, see [Create a public IP - Azure portal](create-public-ip-portal.md).
    - For the purposes of the examples in this article, name the new public IP addresses **myStandardPublicIP-1**, **myStandardPublicIP-2**, and **myStandardPublicIP-3**.

## Create virtual machine existing public IP

In this section, you'll create a virtual machine. You'll select the IP address you created in the prerequisites as the public IP for the virtual machine.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual machine**.

3. In the search results, select **Virtual machines**.

4. Select **+ Add** then **+ Virtual machine**.

5. In **Create a virtual machine**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroupVM**. </br> Select **OK**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **(US) West US 2**. | 
    | Availability options | Select **No infrastructure redundancy required**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen1**. |
    | Azure Spot instance  | Leave the default of unchecked. |
    | Size | Select a size for the virtual machine |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Confirm the password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Leave the default of **Allow selected ports**. |
    | Select inbound ports | Leave the default of **RDP (3389)**. |

6. Select the **Networking** tab, or select **Next: Disks** then **Next: Networking**.

7. In the **Networking** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Leave the default of **(new) myResourceGroupVM-vnet**. |
    | Subnet | Leave the default of **(new) default (10.1.0.0/24)**. |
    | Public IP | Select **myStandardPublicIP-1**. |
    | NIC network security group | Leave the default of **Basic**. |
    | Public inbound ports | Leave the default of **Allow selected ports**. |
    | Select inbound ports | Leave the default of **RDP (3389)**. |

6. Select the **Review + create** tab, or select the blue **Review + create** button.

7. Select **Create**.

> [!NOTE]
> This is a simple deployment of Azure Virtual Machine. For advanced configuration and setup, see [Quickstart: Create a Windows virtual machine in the Azure portal](../virtual-machines/windows/quick-create-portal.md)
>
> For more information on Azure Virtual Machines, see [Windows virtual machines in Azure](../virtual-machines/windows/overview.md)

## Change public IP address

In this section, you'll change the public IP address associated with the default public IP configuration of the virtual machine.

1. In the search box at the top of the portal, enter **Firewall**.

2. In the search results, select **Firewalls**.

3. Select **myFirewall** in **Firewalls**.

4. Select **Public IP configuration** in **Settings** in **myFirewall**.

5. In **Public IP configuration**, select **myStandardPublicIP-1** or your IP address.

6. Select **myStandardPublicIP-2** in **Public IP address** of **Edit public IP configuration**.

7. Select **Save**.

## Add public IP configuration

In this section, you'll add a public IP configuration to the Azure Firewall.

1. In the search box at the top of the portal, enter **Firewall**.

2. In the search results, select **Firewalls**.

3. Select **myFirewall** in **Firewalls**.

4. Select **Public IP configuration** in **Settings** in **myFirewall**.

5. Select **+ Add public IP configuration**.

6. Enter **myNewPublicIPconfig** in **Name**.

7. Select **myStandardPublicIP-3** in **Public IP address**.

8. Select **Add**.
## Next steps

In this article, you learned how to create a Azure Firewall and use an existing public IP. You changed the public IP of the default IP configuration. Finally, you added a public IP configuration to the firewall.

- To learn more about public IP addresses in Azure, see [Public IP addresses](public-ip-addresses.md).
