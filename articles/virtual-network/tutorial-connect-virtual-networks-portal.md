---
title: 'Tutorial: Connect virtual networks with VNet peering - Azure portal'
description: In this tutorial, you learn how to connect virtual networks with virtual network peering using the Azure portal.
author: asudbring
ms.service: virtual-network
ms.topic: tutorial
ms.date: 08/22/2023
ms.author: allensu
ms.custom: template-tutorial
# Customer intent: I want to connect two virtual networks so that virtual machines in one virtual network can communicate with virtual machines in the other virtual network.
---

# Tutorial: Connect virtual networks with virtual network peering using the Azure portal

You can connect virtual networks to each other with virtual network peering. These virtual networks can be in the same region or different regions (also known as global virtual network peering). Once virtual networks are peered, resources in both virtual networks can communicate with each other over a low-latency, high-bandwidth connection using Microsoft backbone network.

:::image type="content" source="./media/tutorial-connect-virtual-networks-portal/resources-diagram.png" alt-text="Diagram of Azure resources created in tutorial." lightbox="./media/tutorial-connect-virtual-networks-portal/resources-diagram.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create virtual networks
> * Connect two virtual networks with a virtual network peering
> * Deploy a virtual machine (VM) into each virtual network
> * Communicate between VMs

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]
   
Repeat the previous steps to create a second virtual network with the following values:

>[!NOTE]
>The second virtual network can be in the same region as the first virtual network or in a different region. You can skip the **Security** tab and the Bastion deployment for the second virtual network. After the network peer, you can connect to both virtual machines with the same Bastion deployment.

| Setting | Value |
| --- | --- |
| Name | **vnet-2** |
| Address space | **10.1.0.0/16** |
| Resource group | **test-rg** |
| Subnet name | **subnet-1** |
| Subnet address range | **10.1.0.0/24** |

<a name="peer-virtual-networks"></a>

[!INCLUDE [virtual-network-create-network-peer.md](../../includes/virtual-network-create-network-peer.md)]

## Create virtual machines

Create a virtual machine in each virtual network to test the communication between them.

[!INCLUDE [create-test-virtual-machine-linux.md](../../includes/create-test-virtual-machine-linux.md)]

Repeat the previous steps to create a second virtual machine in the second virtual network with the following values:

| Setting | Value |
| --- | --- |
| Virtual machine name | **vm-2** |
| Region | **East US 2** or same region as **vnet-2**. |
| Virtual network | Select **vnet-2**. |
| Subnet | Select **subnet-1 (10.1.0.0/24)**. |
| Public IP | **None** |
| Network security group name | **nsg-2** |

Wait for the virtual machines to be created before continuing with the next steps.

## Connect to a virtual machine

Use `ping` to test the communication between the virtual machines.

1. In the portal, search for and select **Virtual machines**.

1. On the **Virtual machines** page, select **vm-1**.

1. In the **Overview** of **vm-1**, select **Connect**.

1. In the **Connect to virtual machine** page, select the **Bastion** tab.

1. Select **Use Bastion**.

1. Enter the username and password you created when you created the VM, and then select **Connect**.

## Communicate between VMs

1. At the bash prompt for **vm-1**, enter `ping -c 4 vm-2`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-1:~$ ping -c 4 vm-2
    PING vm-2.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.1.0.4) 56(84) bytes of data.
    64 bytes from vm-2.internal.cloudapp.net (10.1.0.4): icmp_seq=1 ttl=64 time=1.83 ms
    64 bytes from vm-2.internal.cloudapp.net (10.1.0.4): icmp_seq=2 ttl=64 time=0.987 ms
    64 bytes from vm-2.internal.cloudapp.net (10.1.0.4): icmp_seq=3 ttl=64 time=0.864 ms
    64 bytes from vm-2.internal.cloudapp.net (10.1.0.4): icmp_seq=4 ttl=64 time=0.890 ms
    ```

1. Close the Bastion connection to **vm-1**.

1. Repeat the steps in [Connect to a virtual machine](#connect-to-a-virtual-machine) to connect to **vm-2**.

1. At the bash prompt for **vm-2**, enter `ping -c 4 vm-1`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-2:~$ ping -c 4 vm-1
    PING vm-1.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.4) 56(84) bytes of data.
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=1 ttl=64 time=0.695 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=2 ttl=64 time=0.896 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=3 ttl=64 time=3.43 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=4 ttl=64 time=0.780 ms
    ```

1. Close the Bastion connection to **vm-2**.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this tutorial, you:

* Created virtual network peering between two virtual networks.

* Tested the communication between two virtual machines over the virtual network peering with `ping`.

To learn more about a virtual network peering:

> [!div class="nextstepaction"]
> [Virtual network peering](virtual-network-peering-overview.md)
