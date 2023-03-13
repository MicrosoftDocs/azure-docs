---
title: 'Create a VM with a static private IP address - Azure portal'
description: Learn how to create a virtual machine with a static private IP address using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 03/10/2023
ms.custom: template-how-to, engagement-fy23
---

# Create a virtual machine with a static private IP address using the Azure portal

When you create a virtual machine (VM), it's automatically assigned a private IP address from a range that you specify. This IP address is based on the subnet in which the VM is deployed, and the VM keeps this address until the VM is deleted. Azure dynamically assigns the next available private IP address from the subnet you create a VM in. If you want to use a specific IP address in the subnet for your VM, assign a static IP address to it.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a VM

Use the following steps to create a VM, virtual network, and subnet.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *virtual machine*. Select **Virtual machines** in the search results.

1. Select **Create** > **Azure virtual machine**.

1. From the **Create a virtual machine** window, in the **Basics** tab, enter or select this information in the following sections:

    **Project details**
    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **Create new**, enter *myResourceGroup* for the **Name**, and then select **OK**. |

    **Instance details**
    | Setting | Value |
    | ------- | ----- |
    | **Virtual machine name** | Enter *myVM*. |
    | **Region** | Select **(US) East US 2**. |
    | **Availability options** | Select **No infrastructure redundancy required**. |
    | **Security type** | Select **Standard**. |
    | **Image** | Select **Windows Server 2019 Datacenter - x64 Gen2**. |
    | **Run with Azure Spot discount** | Leave unchecked. |
    | **Size** | Select a size. |

    **Administrator account**
    | Setting | Value |
    | ------- | ----- |
    | **Authentication type** | Select **Password**. |
    | **Username** | Enter a username. |
    | **Password** | Enter a password. |
    | **Confirm password** | Reenter password. |

    **Inbound port rules**
    | Setting | Value |
    | ------- | ----- |
    | **Public inbound ports** | Select **Allow selected ports**. |
    | **Select inbound ports** | Select **RDP (3389)**. |

    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/create-vm.png" alt-text="Screenshot that shows the Basic tab of the Create a virtual machine window.":::

    > [!WARNING]
    > Port 3389 is selected to enable remote access to the Windows Server VM from the internet. Opening port 3389 to the internet is not recommended to manage production workloads. </br> For secure access to Azure VMs, see [What is Azure Bastion?](../../bastion/bastion-overview.md).

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
1. In the **Networking** tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | **Virtual network** | Accept the default network name. |
    | **Subnet** | Accept the default subnet configuration. |
    | **Public IP** | Accept the default public IP configuration. |
    | **NIC network security group** | Select **Basic**. |
    | **Public inbound ports** | Select **Allow selected ports**. |
    | **Select inbound ports** | Select **RDP (3389)**. |

1. Select **Review + create**.
  
1. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Change private IP address to static

In this section, you change the private IP address from **dynamic** to **static** for the VM you created previously.

1. In the search box at the top of the portal, enter *virtual machine*. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **myVM** from the list.

3. On the **myVM** page, under **Settings**, select **Networking**.

4. In **Networking**, select the name of the network interface next to **Network interface**. In this example, the name of the NIC is **myvm472**.

    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/select-nic.png" alt-text="Screenshot of select network interface.":::

5. On the **Network interface** page, under **Settings**, select **IP configurations**.

6. In **IP configurations**, select **ipconfig1** in the list.

    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/select-ip-configuration.png" alt-text="Screenshot of select ip configuration.":::

7. Under **Assignment**, select **Static**. Change the private **IP address** if you want a different one, and then select **Save**.

    > [!WARNING]
    > If you change the private IP address, the VM associated with the network interface will be restarted to utilize the new IP address.

    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/select-static-assignment.png" alt-text="Screenshot of select static assignment.":::

> [!WARNING]
> From within the operating system of a VM, avoid associating a static *private* IP address on an Azure VM. Only assign a static private IP when it's necessary, such as when [assigning many IP addresses to VMs](virtual-network-multiple-ip-addresses-portal.md).
>
>If you manually set the private IP address within the operating system, make sure it matches the private IP address assigned to the Azure [network interface](virtual-network-network-interface-addresses.md#change-ip-address-settings). Otherwise, you can lose connectivity to the VM. For more information, see [private IP address settings](virtual-network-network-interface-addresses.md#private).

## Clean up resources

When you're finished, delete the resource group and all of the resources it contains:

1. Enter *myResourceGroup* in the **Search** box at the top of the portal, and then select **myResourceGroup** in the search results.

2. Select **Delete resource group**.

3. Enter *myResourceGroup* for **Enter resource group name to confirm deletion**, and then select **Delete**.

## Next steps

- Learn more about [static public IP addresses](public-ip-addresses.md#ip-address-assignment) in Azure.

- Learn more about [public IP addresses](public-ip-addresses.md#public-ip-addresses) in Azure.

- Learn more about Azure [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).

- Learn more about [private IP addresses](private-ip-addresses.md) and assigning a [static private IP address](virtual-network-network-interface-addresses.md#add-ip-addresses) to an Azure VM.
