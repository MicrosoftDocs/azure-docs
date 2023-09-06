---
 title: include file
 description: include file
 services: virtual-network
 author: asudbring
 ms.service: virtual-network
 ms.topic: include
 ms.date: 06/06/2023
 ms.author: allensu
 ms.custom: include file
---

## Create virtual machines

The following procedure creates two virtual machines (VMs) named **vm-1** and **vm-2** in the virtual network.

1. In the portal, search for and select **Virtual machines**.

1. In **Virtual machines**, select **+ Create**, then **Azure virtual machine**.

1. On the **Basics** tab of **Create a virtual machine**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **vm-1**. |
    | Region | Select **East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Leave the default of **Standard**. |
    | Image | Select **Ubuntu Server 22.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |  |
    | Authentication type | Select **Password**. |
    | Username | Enter **azureuser**. |
    | Password | Enter a password. |
    | Confirm password | Reenter the password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select the **Networking** tab at the top of the page.

1. Enter or select the following information in the **Networking** tab:

    | Setting | Value |
    |---|---|
    | **Network interface** |  |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1 (10.0.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> Enter **nsg-1** for the name. </br> Leave the rest at the defaults and select **OK**. |

1. Leave the rest of the settings at the defaults and select **Review + create**.

1. Review the settings and select **Create**.

1. Repeat the previous steps to create a second virtual machine with the following settings:

    | Setting | Value |
    |---|---|
    | Virtual machine name | Enter **vm-2**. |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1 (10.0.0.0/24)** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **nsg-1** |

>[!NOTE]
>Virtual machines in a virtual network with a bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in bastion hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](../articles/virtual-network/ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](./ephemeral-ip-note.md)]