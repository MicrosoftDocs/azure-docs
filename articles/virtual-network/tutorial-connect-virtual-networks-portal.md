---
title: Connect virtual networks with VNet peering - tutorial - Azure portal
description: In this tutorial, you learn how to connect virtual networks with virtual network peering, using the Azure portal.
services: virtual-network
documentationcenter: virtual-network
author: KumudD
# Customer intent: I want to connect two virtual networks so that virtual machines in one virtual network can communicate with virtual machines in the other virtual network.
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: tutorial
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 07/06/2021
ms.author: kumud
ms.custom: 
---

# Tutorial: Connect virtual networks with virtual network peering using the Azure portal

You can connect virtual networks to each other with virtual network peering. These virtual networks can be in the same region or different regions (also known as Global VNet peering). Once virtual networks are peered, resources in both virtual networks can communicate with each other, with the same latency and bandwidth as if the resources were in the same virtual network. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create two virtual networks
> * Connect two virtual networks with a virtual network peering
> * Deploy a virtual machine (VM) into each virtual network
> * Communicate between VMs

If you prefer, you can complete this tutorial using the [Azure CLI](tutorial-connect-virtual-networks-cli.md) or [Azure PowerShell](tutorial-connect-virtual-networks-powershell.md).

## Prerequisites

Before you begin, you need an Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create virtual networks

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the Azure portal, select **+ Create a resource**.

1. Search for **Virtual Network**, and then select **Create**.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-vnet.png" alt-text="Screenshot of create a resource for virtual network.":::

1. On the **Basics** tab, enter or select the following information and accept the defaults for the remaining settings:

    |Setting|Value|
    |---|---|
    |Subscription| Select your subscription.|
    |Resource group| Select **Create new** and enter *myResourceGroup*.|
    |Region| Select **East US**.|
    |Name|myVirtualNetwork1|

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-basic-tab.png" alt-text="Screenshot of create virtual network basics tab.":::

1. On the **IP Addresses** tab, enter *10.0.0.0/16* for the **Address Space** field. Click the **Add subnet** button below and enter *Subnet1* for **Subnet Name** and *10.0.0.0/24* for the **Subnet Address range**.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/ip-addresses-tab.png" alt-text="Screenshot of create a virtual network IP addresses tab.":::

1. Select **Review + create** and then select **Create**.
   
1. Repeat steps 1-5 again to create a second virtual network with the following settings:

    | Setting | Value |
    | --- | --- |
    | Name | myVirtualNetwork2 |
    | Address space | 10.1.0.0/16 |
    | Resource group | Select **Use existing** and then select **myResourceGroup**.|
    | Subnet name | Subnet2 |
    | Subnet address range | 10.1.0.0/24 |

## Peer virtual networks

1. In the search box at the top of the Azure portal, look for *myVirtualNetwork1*. When **myVirtualNetwork1** appears in the search results, select it.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/search-vnet.png" alt-text="Screenshot of searching for myVirtualNetwork1.":::

1. Select **Peerings**, under **Settings**, and then select **+ Add**, as shown in the following picture:

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-peering.png" alt-text="Screenshot of creating peerings for myVirtualNetwork1.":::
    
1. Enter, or select, the following information, accept the defaults for the remaining settings, and then select **Add**.

    | Setting | Value |
    | --- | --- |
    | This virtual network - Peering link name | Name of the peering from myVirtualNetwork1 to the remote virtual network.  *myVirtualNetwork1-myVirtualNetwork2* is used for this connection.|
    | Remote virtual network - Peering link name |  Name of the peering from remote virtual network to myVirtualNetwork1. *myVirtualNetwork2-myVirtualNetwork1* is used for this connection. |
    | Subscription | Select your subscription.|
    | Virtual network  | You can select a virtual network in the same region or in a different region. From the drop-down select *myVirtualNetwork2* |

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/peering-settings-bidirectional.png" alt-text="Screenshot of virtual network peering configuration." lightbox="./media/tutorial-connect-virtual-networks-portal/peering-settings-bidirectional-expanded.png":::

    The **PEERING STATUS** is *Connected*, as shown in the following picture:

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/peering-status-connected.png" alt-text="Screenshot of virtual network peering connection status.":::

    If you don't see a *Connected* status, select the **Refresh** button.

## Create virtual machines

Create a VM in each virtual network so that you can test the communication between them.

### Create the first VM

1. On the Azure portal, select **+ Create a resource**.

1. Select **Compute**, and then **Create** under *Virtual machine*.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-vm.png" alt-text="Screenshot of create a resource for virtual machines.":::

1. Enter, or select, the following information on the **Basics** tab, accept the defaults for the remaining settings, and then select **Create**:

    | Setting | Value |
    | --- | --- |
    | Resource group| Select **Use existing** and then select **myResourceGroup**. |
    | Name | myVm1 |
    | Location | Select **East US**. |
    | Image | Select an OS image. For this VM *Windows Server 2019 Datacenter - Gen1* is selected. |
    | Size | Select a VM size. For this VM *Standard_D2s_v3* is selected. |
    | Username | Enter a username. The username *azure* was chosen for this example. |
    | Password | Enter a password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.yml?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm-). |
   
    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-vm-basic-tab.png" alt-text="Screenshot of virtual machine basic tab configuration." lightbox="./media/tutorial-connect-virtual-networks-portal/create-vm-basic-tab-expanded.png":::

1. On the **Networking** tab, select the following values:

    | Setting | Value |
    | --- | --- |
    | Virtual network | myVirtualNetwork1 - If it's not already selected, select **Virtual network** and then select **myVirtualNetwork1**. |
    | Subnet | Subnet1 - If it's not already selected, select **Subnet** and then select **Subnet1**. |
    | Public inbound ports | *Allow selected ports* |
    | Select inbound ports | *RDP (3389)* |

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/create-vm-networking-tab.png" alt-text="Screenshot of virtual machine networking tab configuration." lightbox="./media/tutorial-connect-virtual-networks-portal/create-vm-networking-tab-expanded.png":::

1. Select the **Review + Create** and then **Create** to start the VM deployment.

### Create the second VM

Repeat steps 1-6 again to create a second virtual machine with the following changes:

| Setting | Value |
| --- | --- |
| Name | myVm2 |
| Virtual network | myVirtualNetwork2 |

The VMs take a few minutes to create. Do not continue with the remaining steps until both VMs are created.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Communicate between VMs

1. In the search box at the top of the portal, look for *myVm1*. When **myVm1** appears in the search results, select it.
    
    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/search-vm.png" alt-text="Screenshot of searching for myVm1.":::

1. To connect to the virtual machine, select **Connect** and then select **RDP** from the drop-down. Select **Download RDP file** to download the remote desktop file.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/connect-to-virtual-machine.png" alt-text="Screenshot of connect to virtual machine button."::: 

1. To connect to the VM, open the downloaded RDP file. If prompted, select **Connect**.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/rdp-connect.png" alt-text="Screenshot of connection screen for remote desktop.":::

1. Enter the user name and password you specified when creating the VM (you may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the VM), then select **OK**.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/rdp-credentials.png" alt-text="Screenshot of RDP credential screen.":::

1. You may receive a certificate warning during the sign-in process. Select **Yes** to continue with the connection.

1. In a later step, ping is used to communicate with *myVm1* VM from the *myVm2* VM. Ping uses the Internet Control Message Protocol (ICMP), which is denied through the Windows Firewall, by default. On the *myVm1* VM, enable ICMP through the Windows firewall, so that you can ping this VM from *myVm2* in a later step, using PowerShell:

    ```powershell
    New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
    ```

    Though ping is used to communicate between VMs in this tutorial, allowing ICMP through the Windows Firewall for production deployments isn't recommended.

1. To connect to the *myVm2* VM, enter the following command from a command prompt on the *myVm1* VM:

    ```
    mstsc /v:10.1.0.4
    ```
    
1. Since you enabled ping on *myVm1*, you can now ping it by IP address:

    ```
    ping 10.0.0.4
    ```
    
    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/myvm2-ping-myvm1.png" alt-text="Screenshot of myVM2 pinging myVM1.":::

1. Disconnect your RDP sessions to both *myVm1* and *myVm2*.

## Clean up resources

When no longer needed, delete the resource group and all resources it contains: 

1. Enter *myResourceGroup* in the **Search** box at the top of the portal. When you see **myResourceGroup** in the search results, select it.

1. Select **Delete resource group**.

1. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

    :::image type="content" source="./media/tutorial-connect-virtual-networks-portal/delete-resource-group.png" alt-text="Screenshot of delete resource group page.":::

## Next steps

> [!div class="nextstepaction"]
> [Learn more about virtual network peering](virtual-network-peering-overview.md)
