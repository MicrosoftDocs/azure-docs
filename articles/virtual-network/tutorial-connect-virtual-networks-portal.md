---
title: 'Tutorial: Connect virtual networks with VNet peering - Azure portal'
description: In this tutorial, you learn how to connect virtual networks with virtual network peering using the Azure portal.
services: virtual-network
documentationcenter: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: tutorial
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 06/24/2022
ms.author: allensu
ms.custom: template-tutorial
# Customer intent: I want to connect two virtual networks so that virtual machines in one virtual network can communicate with virtual machines in the other virtual network.
---

# Tutorial: Connect virtual networks with virtual network peering using the Azure portal

You can connect virtual networks to each other with virtual network peering. These virtual networks can be in the same region or different regions (also known as global virtual network peering). Once virtual networks are peered, resources in both virtual networks can communicate with each other over a low-latency, high-bandwidth connection using Microsoft backbone network.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create virtual networks
> * Connect two virtual networks with a virtual network peering
> * Deploy a virtual machine (VM) into each virtual network
> * Communicate between VMs

This tutorial uses the Azure portal. You can also complete it using [Azure CLI](tutorial-connect-virtual-networks-cli.md) or [PowerShell](tutorial-connect-virtual-networks-powershell.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create virtual networks

1. On the Azure portal, select **+ Create a resource**.

1. Search for **Virtual Network**, and then select **Create**.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-vnet.png" alt-text="Screenshot of create a resource for virtual network.":::

1. On the **Basics** tab, enter or select the following information and accept the defaults for the remaining settings:

    |Setting|Value|
    |---|---|
    |Subscription| Select your subscription.|
    |Resource group| Select **Create new** and enter *myResourceGroup*.|
    |Name| Enter *myVirtualNetwork1*.|
    |Region| Select **East US**.|


    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-basic-tab.png" alt-text="Screenshot of create virtual network basics tab.":::

1. On the **IP Addresses** tab, enter *10.0.0.0/16* for the **IPv4 address Space** field. Select the **+ Add subnet** button below and enter *Subnet1* for **Subnet Name** and *10.0.0.0/24* for the **Subnet Address range**.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/ip-addresses-tab.png" alt-text="Screenshot of create a virtual network IP addresses tab.":::

1. Select **Review + create** and then select **Create**.
   
1. Repeat steps 1-5 again to create a second virtual network with the following settings:

    | Setting | Value |
    | --- | --- |
    | Name | myVirtualNetwork2 |
    | Address space | 10.1.0.0/16 |
    | Resource group | myResourceGroup |
    | Subnet name | Subnet2 |
    | Subnet address range | 10.1.0.0/24 |

## Peer virtual networks

1. In the search box at the top of the Azure portal, look for *myVirtualNetwork1*. When **myVirtualNetwork1** appears in the search results, select it.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/search-vnet.png" alt-text="Screenshot of searching for myVirtualNetwork1.":::

1. Under **Settings**, select **Peerings**, and then select **+ Add**, as shown in the following picture:

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-peering.png" alt-text="Screenshot of creating peerings for myVirtualNetwork1.":::
    
1. Enter or select the following information, accept the defaults for the remaining settings, and then select **Add**.

    | Setting | Value |
    | --- | --- |
    | **This virtual network** | |
    | Peering link name | Enter *myVirtualNetwork1-myVirtualNetwork2* for the name of the peering from **myVirtualNetwork1** to the remote virtual network. |
    | **Remote virtual network** | |
    | Peering link name | Enter *myVirtualNetwork2-myVirtualNetwork1* for the name of the peering from the remote virtual network to **myVirtualNetwork1**. |
    | Subscription | Select your subscription of the remote virtual network. |
    | Virtual network  | Select **myVirtualNetwork2** for the name of the remote virtual network. The remote virtual network can be in the same region of **myVirtualNetwork1** or in a different region. |

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/peering-settings-bidirectional-inline.png" alt-text="Screenshot of virtual network peering configuration." lightbox="./media/tutorial-connect-virtual-networks-portal/peering-settings-bidirectional-expanded.png":::

    In the **Peerings** page, the **Peering status** is **Connected**, as shown in the following picture:

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/peering-status-connected.png" alt-text="Screenshot of virtual network peering connection status.":::

    If you don't see a **Connected** status, select the **Refresh** button.

## Create virtual machines

Create a VM in each virtual network so that you can test the communication between them.

### Create the first VM

1. On the Azure portal, select **+ Create a resource**.

1. Select **Compute**, and then **Create** under **Virtual machine**.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-vm.png" alt-text="Screenshot of create a resource for virtual machines.":::

1. Enter or select the following information on the **Basics** tab. Accept the defaults for the remaining settings, and then select **Create**:

    | Setting | Value |
    | --- | --- |
    | Resource group| Select **myResourceGroup**. |
    | Name | Enter *myVm1*. |
    | Location | Select **(US) East US**. |
    | Image | Select an OS image. For this tutorial, *Windows Server 2019 Datacenter - Gen2* is selected. |
    | Size | Select a VM size. For this tutorial, *Standard_D2s_v3* is selected. |
    | Username | Enter a username. For this tutorial, the username *azure* is used. |
    | Password | Enter a password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.yml?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm-). |
   
    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-vm-basic-tab-inline.png" alt-text="Screenshot of virtual machine basic tab configuration." lightbox="./media/tutorial-connect-virtual-networks-portal/create-vm-basic-tab-expanded.png":::

1. On the **Networking** tab, select the following values:

    | Setting | Value |
    | --- | --- |
    | Virtual network | Select **myVirtualNetwork1**. |
    | Subnet | Select **Subnet1**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **RDP (3389)**. |

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-vm-networking-tab-inline.png" alt-text="Screenshot of virtual machine networking tab configuration." lightbox="./media/tutorial-connect-virtual-networks-portal/create-vm-networking-tab-expanded.png":::

1. Select the **Review + Create** and then **Create** to start the VM deployment.

### Create the second VM

Repeat steps 1-5 again to create a second virtual machine with the following changes:

| Setting | Value |
| --- | --- |
| Name | myVm2 |
| Virtual network | myVirtualNetwork2 |

The VMs take a few minutes to create. Don't continue with the remaining steps until both VMs are created.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Communicate between VMs

Test the communication between the two virtual machines over the virtual network peering by pinging from **myVm2** to **myVm1**. 

1. In the search box at the top of the portal, look for *myVm1*. When **myVm1** appears in the search results, select it.
    
    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/search-vm.png" alt-text="Screenshot of searching for myVm1.":::

1. To connect to the virtual machine, select **Connect** and then select **RDP** from the drop-down. Select **Download RDP file** to download the remote desktop file.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/connect-to-virtual-machine.png" alt-text="Screenshot of connect to virtual machine button."::: 

1. To connect to the VM, open the downloaded RDP file. If prompted, select **Connect**.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/rdp-connect.png" alt-text="Screenshot of connection screen for remote desktop.":::

1. Enter the username and password you specified when creating **myVm1** (you may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the VM), then select **OK**.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/rdp-credentials.png" alt-text="Screenshot of R D P credential screen.":::

1. You may receive a certificate warning during the sign-in process. Select **Yes** to continue with the connection.

1. In a later step, ping is used to communicate with **myVm1** from **myVm2**. Ping uses the Internet Control Message Protocol (ICMP), which is denied through the Windows Firewall, by default. On **myVm1**, enable ICMP through the Windows firewall, so that you can ping this VM from **myVm2** in a later step, using PowerShell:

    ```powershell
    New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
    ```

    Though ping is used to communicate between VMs in this tutorial, allowing ICMP through the Windows Firewall for production deployments isn't recommended.

1. To connect to **myVm2** from **myVm1**, enter the following command from a command prompt on **myVm1**:

    ```
    mstsc /v:10.1.0.4
    ```
1. Enter the username and password you specified when creating **myVm2** and select **Yes** if you receive a certificate warning during the sign-in process.
    
    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/rdp-credentials-to-second-vm.png" alt-text="Screenshot of R D P credential screen for R D P session from first virtual machine to second virtual machine.":::        
    
1. Since you enabled ping on **myVm1**, you can now ping it from **myVm2**:

    ```powershell
    ping 10.0.0.4
    ```
    
    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/myvm2-ping-myvm1.png" alt-text="Screenshot of second virtual machine pinging first virtual machine.":::

1. Disconnect your RDP sessions to both *myVm1* and *myVm2*.

## Clean up resources

When no longer needed, delete the resource group and all resources it contains: 

1. Enter *myResourceGroup* in the **Search** box at the top of the Azure portal. When you see **myResourceGroup** in the search results, select it.

1. Select **Delete resource group**.

1. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this tutorial, you:

* Created virtual network peering between two virtual networks.
* Tested the communication between two virtual machines over the virtual network peering using ping command.

To learn more about a virtual network peering:

> [!div class="nextstepaction"]
> [Virtual network peering](virtual-network-peering-overview.md)
