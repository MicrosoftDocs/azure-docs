---
title: include file
description: include file
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: include
ms.date: 03/26/2026
ms.author: allensu
ms.custom: include file
---

## Create virtual machines

The following procedure creates two VMs named **\<virtual-machine-1\>** and **\<virtual-machine-2\>** in the virtual network:

1. In the portal, search for and select **Virtual machines**.

1. In **Virtual machines**, select **+ Create**, and then select **Azure virtual machine**.

1. On the **Basics** tab of **Create a virtual machine**, enter, or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **\<resource-group\>**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **\<virtual-machine-1\>**. |
    | Region | Select **\<region\>**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Leave the default of **Standard**. |
    | Image | Select **Ubuntu Server 22.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |  |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter **azureuser**. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter **\<virtual-machine-1\>-key**. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select the **Networking** tab. Enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Network interface** |  |
    | Virtual network | Select **\<virtual-network\>**. |
    | Subnet | Select **\<subnet\> (10.0.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**.</br> Enter **\<network-security-group\>** for the name.</br> Leave the rest at the defaults and select **OK**. |

1. Leave the rest of the settings at the defaults and select **Review + create**.

1. Review the settings and select **Create**.

1. Wait for the first virtual machine to deploy then repeat the previous steps to create a second virtual machine with the following settings:

    | Setting | Value |
    |---|---|
    | Virtual machine name | Enter **\<virtual-machine-2\>**. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter **\<virtual-machine-2\>-key**. |
    | Virtual network | Select **\<virtual-network\>**. |
    | Subnet | Select **\<subnet\> (10.0.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **\<network-security-group\>**. |

> [!NOTE]
> Virtual machines in a virtual network with an Azure Bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](~/articles/virtual-network/ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]
