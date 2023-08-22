---
title: 'Tutorial: Route network traffic with a route table - Azure portal'
titlesuffix: Azure Virtual Network
description: In this tutorial, learn how to route network traffic with a route table using the Azure portal.
services: virtual-network
documentationcenter: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: tutorial
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 06/27/2022
ms.author: allensu
ms.custom: template-tutorial
# Customer intent: I want to route traffic from one subnet, to a different subnet, through a network virtual appliance.
---

# Tutorial: Route network traffic with a route table using the Azure portal

Azure routes traffic between all subnets within a virtual network, by default. You can create your own routes to override Azure's default routing. Custom routes are helpful when, for example, you want to route traffic between subnets through a network virtual appliance (NVA).

:::image type="content" source="./media/tutorial-create-route-table-portal/overview.png" alt-text="Diagram showing an overview of interaction of the public, private and NVA virtual machines used in this tutorial." border="true":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and subnets
> * Create an NVA that routes traffic
> * Deploy virtual machines (VMs) into different subnets
> * Create a route table
> * Create a route
> * Associate a route table to a subnet
> * Route traffic from one subnet to another through an NVA

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

## Create subnets

A **DMZ** and **Private** subnet are needed for this tutorial. The **DMZ** subnet is where you deploy the NVA, and the **Private** subnet is where you deploy the virtual machines that you want to route traffic to. The **subnet-1** is the subnet created in the previous steps. Use **subnet-1** for the public virtual machine.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. In **Virtual networks**, select **vnet-1**.

1. In **vnet-1**, select **Subnets** from the **Settings** section.

1. In the virtual network's subnet list, select **+ Subnet**.

1. In **Add subnet**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **subnet-private**. |
    | Subnet address range | Enter **10.0.2.0/24**. |

1. Select **Save**.

1. Select **+ Subnet**.

1. In **Add subnet**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **subnet-dmz**. |
    | Subnet address range | Enter **10.0.3.0/24**. |

1. Select **Save**.

## Create an NVA virtual machine

Network virtual appliances (NVAs) are virtual machines that help with network functions, such as routing and firewall optimization. In this section, create an NVA using a **Ubuntu 22.04** virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-nva**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 22.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-dmz (10.0.3.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> In **Name** enter **nsg-nva**. </br> Select **OK**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

## Create public and private virtual machines

Create two virtual machines in the **vnet-1** virtual network. One virtual machine is in the **subnet-1** subnet, and the other virtual machine is in the **subnet-private** subnet. Use the same virtual machine image for both virtual machines.

### Create public virtual machine

The public virtual machine is used to simulate a machine in the public internet. The public and private virtual machine are used to test the routing of network traffic through the NVA virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-public**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 22.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1 (10.0.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

### Create private virtual machine

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-private**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 22.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1 (10.0.2.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

## Enable IP forwarding

To route traffic through the NVA, turn on IP forwarding in Azure and in the operating system of the **vm-nva** virtual machine. When IP forwarding is enabled, any traffic received by **vm-nva** VM that's destined for a different IP address, won't be dropped and will be forwarded to the correct destination.

### Enable IP forwarding in Azure

In this section, you'll turn on IP forwarding for the network interface of the **vm-nva** virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **vm-nva**.

1. In **vm-nva**, select **Networking** from the **Settings** section.

1. 







1. Search for *myVMNVA* in the portal search box.

3. In the **myVMNVA** overview page, select **Networking** from the **Settings** section.

4. In the **Networking** page of **myVMNVA**, select the network interface next to **Network Interface:**.  The name of the interface will begin with **myvmnva**.

    :::image type="content" source="./media/tutorial-create-route-table-portal/virtual-machine-networking.png" alt-text="Screenshot showing Networking page of network virtual appliance virtual machine in Azure portal." border="true":::

5. In the network interface overview page, select **IP configurations** from the **Settings** section.

6. In the **IP configurations** page, set **IP forwarding** to **Enabled**, then select **Save**.

    :::image type="content" source="./media/tutorial-create-route-table-portal/enable-ip-forwarding.png" alt-text="Screenshot showing Enabled I P forwarding in Azure portal." border="true":::

### Turn on IP forwarding in the operating system

In this section, you'll turn on IP forwarding for the operating system of **myVMNVA** virtual machine to forward network traffic. You'll use the same bastion connection to **myVMPrivate** VM, that you started in the previous steps, to open a remote desktop connection to **myVMNVA** VM.

1. From PowerShell on **myVMPrivate** VM, open a remote desktop connection to the **myVMNVA** VM:

    ```powershell
    mstsc /v:myvmnva
    ```

2. After you connect to **myVMNVA** VM, open Windows PowerShell and enter this command to turn on IP forwarding:

    ```powershell
    Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters -Name IpEnableRouter -Value 1
    ```

3. Restart **myVMNVA** VM.

    ```powershell
    Restart-Computer
    ```

## Create a route table

In this section, you'll create a route table.

1. From the Azure portal menu, select **+ Create a resource** > **Networking** > **Route table**, or search for *Route table* in the portal search box.

3. Select **Create**.

4. On the **Basics** tab of **Create route table**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription.|
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |    |
    | Region | Select **East US**. |
    | Name | Enter *myRouteTablePublic*. |
    | Propagate gateway routes | Select **Yes**. |

    :::image type="content" source="./media/tutorial-create-route-table-portal/create-route-table.png" alt-text="Screenshot showing Basics tab of Create route table in Azure portal." border="true":::

5. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

## Create a route

In this section, you'll create a route in the route table that you created in the previous steps.

1. Select **Go to resource** or Search for *myRouteTablePublic* in the portal search box.

3. In the **myRouteTablePublic** page, select **Routes** from the **Settings** section.

4. In the **Routes** page, select the **+ Add** button.

5. In **Add route**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter *ToPrivateSubnet*. |
    | Address prefix destination | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges| Enter *10.0.1.0/24* (The address range of the **Private** subnet created earlier). |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter *10.0.2.4* (The address of **myVMNVA** VM created earlier in the **DMZ** subnet). |

    :::image type="content" source="./media/tutorial-create-route-table-portal/add-route-inline.png" alt-text="Screenshot showing Add route configuration in Azure portal." lightbox="./media/tutorial-create-route-table-portal/add-route-expanded.png":::

6. Select **Add**.

## Associate a route table to a subnet

In this section, you'll associate the route table that you created in the previous steps to a subnet.

1. Search for *myVirtualNetwork* in the portal search box.

3. In the **myVirtualNetwork** page, select **Subnets** from the **Settings** section.

4. In the virtual network's subnet list, select **Public**.

5. In **Route table**, select **myRouteTablePublic** that you created in the previous steps. 

6. Select **Save** to associate your route table to the **Public** subnet.

    :::image type="content" source="./media/tutorial-create-route-table-portal/associate-route-table-inline.png" alt-text="Screenshot showing Associate route table to the Public subnet in the virtual network in Azure portal." lightbox="./media/tutorial-create-route-table-portal/associate-route-table-expanded.png":::

## Test the routing of network traffic

You'll test routing of network traffic using [tracert](/windows-server/administration/windows-commands/tracert) tool from **myVMPublic** VM to **myVMPrivate** VM, and then you'll test the routing in the opposite direction.

### Test network traffic from myVMPublic VM to myVMPrivate VM

1. From PowerShell on **myVMPrivate** VM, open a remote desktop connection to the **myVMPublic** VM:

    ```powershell
    mstsc /v:myvmpublic
    ```

2. After you connect to **myVMPublic** VM, open Windows PowerShell and enter this *tracert* command to trace the routing of network traffic from **myVMPublic** VM to **myVMPrivate** VM:


    ```powershell
    tracert myvmprivate
    ```

    The response is similar to this example:

    ```powershell
    Tracing route to myvmprivate.q04q2hv50taerlrtdyjz5nza1f.bx.internal.cloudapp.net [10.0.1.4]
    over a maximum of 30 hops:

      1     1 ms     *        2 ms  myvmnva.internal.cloudapp.net [10.0.2.4]
      2     2 ms     1 ms     1 ms  myvmprivate.internal.cloudapp.net [10.0.1.4]

    Trace complete.
    ```
    
    You can see that there are two hops in the above response for *tracert* ICMP traffic from **myVMPublic** VM to **myVMPrivate** VM. The first hop is **myVMNVA** VM, and the second hop is the destination **myVMPrivate** VM.

    Azure sent the traffic from **Public** subnet through the NVA and not directly to **Private** subnet because you previously added **ToPrivateSubnet** route to **myRouteTablePublic** route table and associated it to **Public** subnet.

1. Close the remote desktop connection to **myVMPublic** VM.

### Test network traffic from myVMPrivate VM to myVMPublic VM

1. From PowerShell on **myVMPrivate** VM, and enter this *tracert* command to trace the routing of network traffic from **myVmPrivate** VM to **myVmPublic** VM.

    ```powershell
    tracert myvmpublic
    ```

    The response is similar to this example:

    ```powershell
    Tracing route to myvmpublic.q04q2hv50taerlrtdyjz5nza1f.bx.internal.cloudapp.net [10.0.0.4]
    over a maximum of 30 hops:

      1     1 ms     1 ms     1 ms  myvmpublic.internal.cloudapp.net [10.0.0.4]

    Trace complete.
    ```

    You can see that there's one hop in the above response, which is the destination **myVMPublic** virtual machine.

    Azure sent the traffic directly from **Private** subnet to **Public** subnet. By default, Azure routes traffic directly between subnets.

1. Close the bastion session.

## Clean up resources

When the resource group is no longer needed, delete **myResourceGroup** and all the resources it contains:

1. Enter *myResourceGroup* in the **Search** box at the top of the Azure portal. When you see **myResourceGroup** in the search results, select it.

1. Select **Delete resource group**.

1. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**. 

## Next steps

In this tutorial, you:

* Created a route table and associated it to a subnet.
* Created a simple NVA that routed traffic from a public subnet to a private subnet. 

You can deploy different pre-configured NVAs from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking), which provide many useful network functions. 

To learn more about routing, see [Routing overview](virtual-networks-udr-overview.md) and [Manage a route table](manage-route-table.md).

To learn how to restrict network access to PaaS resources with virtual network service endpoints, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Restrict network access using service endpoints](tutorial-restrict-network-access-to-resources.md)
