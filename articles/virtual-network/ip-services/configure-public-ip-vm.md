---
title: Manage a public IP address with an Azure Virtual Machine
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with Azure Virtual Machines and how to change the configuration.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 08/25/2023
ms.custom: template-how-to 
---

# Manage a public IP address with an Azure Virtual Machine

Public IP addresses are available in two SKUs; standard, and basic. The selection of SKU determines the features of the IP address. The SKU determines the resources that the IP address can be associated with.  

Azure Virtual Machines is the main compute service in Azure. Customers can create Linux or Windows virtual machines. A public IP address can be assigned to a virtual machine for inbound connections to the virtual machine. 

A virtual machine doesn't require a public IP address for its configuration.

In this article, you'll learn how to create an Azure Virtual Machine using an existing public IP in your subscription. You'll learn how to add a public IP address to a virtual machine. You'll change the IP address. Finally, you'll learn how to remove the public IP.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- Two standard SKU public IP addresses in your subscription. The IP address can't be associated with any resources. For more information on creating a standard SKU public IP address, see [Create a public IP - Azure portal](./create-public-ip-portal.md).
    - For the examples in this article, name the new public IP addresses **myStandardPublicIP-1** and **myStandardPublicIP-2**.
- One standard SKU public IP address with the routing preference of **Internet** in your subscription. For more information on creating a public IP with the **Internet** routing preference, see [Configure routing preference for a public IP address using the Azure portal](./routing-preference-portal.md).
    - For the example in this article, name the new public IP address **myStandardPublicIP-3**.
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
> This is a simple deployment of Azure Virtual Machine. For advanced configuration and setup, see [Quickstart: Create a Windows virtual machine in the Azure portal](../../virtual-machines/windows/quick-create-portal.md)
>
> For more information on Azure Virtual Machines, see [Windows virtual machines in Azure](../../virtual-machines/windows/overview.md)

## Change public IP address

In this section, you'll change the public IP address associated with the default public IP configuration of the virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**.

2. In the search results, select **Virtual machines**.

3. Select **myVM** in **Virtual machines**.

4. Select **Networking** in **Settings** in **myVM**.

5. In **Networking**, select the **Network interface** of the VM. The name of the NIC will be prefixed with the name of the VM and end with a random number.  In this example, it's **myvm793**.

    :::image type="content" source="./media/configure-public-ip-vm/network-interface.png" alt-text="Select network interface." border="true":::

6. In **Settings** of the network interface, select **IP configurations**.

7. Select **ipconfig1** in **IP configurations**.  

    :::image type="content" source="./media/configure-public-ip-vm/change-ipconfig.png" alt-text="Select the ipconfig to change the IP address." border="true":::

1. Select **myStandardPublicIP-2** in **Public IP address** of **ipconfig1**.

7. Select **Save**.

## Add public IP configuration

In this section, you'll add a public IP configuration to the virtual machine. 

For more information on adding multiple IP addresses, see [Assign multiple IP addresses to virtual machines using the Azure portal](./virtual-network-multiple-ip-addresses-portal.md). 

For more information for using both types of routing preference, see [Configure both routing preference options for a virtual machine](./routing-preference-mixed-network-adapter-portal.md).

1. In the search box at the top of the portal, enter **Virtual machine**.

2. In the search results, select **Virtual machines**.

3. Select **myVM** in **Virtual machines**.

4. Select **Networking** in **Settings** in **myVM**.

5. In **Networking**, select the **Network interface** of the VM. The name of the NIC will be prefixed with the name of the VM and end with a random number.  In this example, it's **myvm793**.

    :::image type="content" source="./media/configure-public-ip-vm/network-interface.png" alt-text="Select network interface." border="true":::

6. In **Settings** of the network interface, select **IP configurations**.

7. In **IP configurations**, select **+ Add**.

8. Enter **ipconfig2** in **Name**.

9. In **Public IP address**, select **Associate**.

10. Select **myStandardPublicIP-3** in **Public IP address**.

11. Select **OK**.

## Remove public IP address association

In this section, you'll remove the public IP address from the network interface. The virtual machine after this process will be unavailable to external connections.

1. In the search box at the top of the portal, enter **Virtual machine**.

2. In the search results, select **Virtual machines**.

3. Select **myVM** in **Virtual machines**.

4. Select **Networking** in **Settings** in **myVM**.

5. In **Networking**, select the **Network interface** of the VM. The name of the NIC will be prefixed with the name of the VM and end with a random number.  In this example, it's **myvm793**.

    :::image type="content" source="./media/configure-public-ip-vm/network-interface.png" alt-text="Select network interface." border="true":::

6. In **Settings** of the network interface, select **IP configurations**.

7. Select **ipconfig1** in **IP configurations**.  

    :::image type="content" source="./media/configure-public-ip-vm/change-ipconfig.png" alt-text="Select the ipconfig to change the IP address." border="true":::

8. Select **Disassociate** in **Public IP address settings**.

9. Select **Save**.

## Next steps

In this article, you learned how to create a virtual machine and use an existing public IP. You changed the public IP of the default IP configuration. Finally, you added a public IP configuration to the firewall with the Internet routing preference.

- To learn more about public IP addresses in Azure, see [Public IP addresses](./public-ip-addresses.md).