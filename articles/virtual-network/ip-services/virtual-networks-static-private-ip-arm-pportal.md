---
title: 'Create a VM with a static private IP address - Azure portal'
description: Learn how to create a virtual machine with a static private IP address using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 10/27/2022
ms.custom: template-how-to 
---

# Create a virtual machine with a static private IP address using the Azure portal

A virtual machine (VM) is automatically assigned a private IP address from a range that you specify. This range is based on the subnet in which the VM is deployed. The VM keeps the address until the VM is deleted. Azure dynamically assigns the next available private IP address from the subnet you create a VM in. Assign a static IP address to the VM if you want a specific IP address in the subnet.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create virtual machine

Use the following steps to create a virtual machine, virtual network, and subnet.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter *Virtual machine*. Select **Virtual machines** in the search results.

3. Select **+ Create** then **Azure Virtual machine**.

4. In **Create a virtual machine**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. |
    | **Instance details** |   |
    | Virtual machine name | Enter *myVM*. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Azure Spot instance | Leave unchecked. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **RDP (3389)** |

    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/create-vm.png" alt-text="Screenshot of create virtual machine.":::

    > [!WARNING]
    > Port 3389 is selected to enable remote access to the Windows Server virtual machine from the internet. Opening port 3389 to the internet is not recommended to manage production workloads. </br> For secure access to Azure virtual machines, see **[What is Azure Bastion?](../../bastion/bastion-overview.md)**

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Accept the default network name. |
    | Subnet | Accept the default subnet configuration. |
    | Public IP | Accept the default public IP configuration. |
    | NIC network security group | Select **Basic** |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **RDP (3389)** |

5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Change private IP address to static

In this section, you'll change the private IP address from **dynamic** to **static** for the virtual machine you created previously.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **myVM**.

3. Select **Networking** in **Settings** in **myVM**.

4. In **Networking**, select the name of the network interface next to **Network interface**. In this example, the name of the NIC is **myvm472**.

    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/select-nic.png" alt-text="Screenshot of select network interface.":::

5. In the network interface properties, select **IP configurations** in **Settings**.

6. Select **ipconfig1** in the **IP configurations** page.

    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/select-ip-configuration.png" alt-text="Screenshot of select ip configuration.":::

7. Select **Static** in **Assignment**. Change the private IP address if you want a different one, and then select **Save**.

    > [!WARNING]
    > If you change the private IP address, the VM associated with the network interface will be restarted to utilize the new IP address. 
    
    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/select-static-assignment.png" alt-text="Screenshot of select static assignment.":::

To change the IP address back to dynamic set the assignment for your private IP address to **Dynamic**, and then select **Save**.

> [!WARNING]
> From within the operating system of a VM, you shouldn't statically assign the *private* IP that's assigned to the Azure VM. Only do static assignment of a private IP when it's necessary, such as when [assigning many IP addresses to VMs](virtual-network-multiple-ip-addresses-portal.md). 
>
>If you manually set the private IP address within the operating system, make sure it matches the private IP address assigned to the Azure [network interface](virtual-network-network-interface-addresses.md#change-ip-address-settings). Otherwise, you can lose connectivity to the VM. Learn more about [private IP address](virtual-network-network-interface-addresses.md#private) settings.

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains:

1. Enter *myResourceGroup* in the **Search** box at the top of the portal. When you see **myResourceGroup** in the search results, select it.

2. Select **Delete resource group**.

3. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

- Learn more about [static public IP addresses](public-ip-addresses.md#ip-address-assignment).

- Learn more about [public IP addresses](public-ip-addresses.md#public-ip-addresses) in Azure.

- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).

- Learn more about [private IP addresses](private-ip-addresses.md) and assigning a [static private IP address](virtual-network-network-interface-addresses.md#add-ip-addresses) to an Azure virtual machine.

