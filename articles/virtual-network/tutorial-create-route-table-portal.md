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
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
# Customer intent: I want to route traffic from one subnet, to a different subnet, through a network virtual appliance.
---

# Tutorial: Route network traffic with a route table using the Azure portal

Azure routes traffic between all subnets within a virtual network, by default. You can create your own routes to override Azure's default routing. Custom routes are helpful when, for example, you want to route traffic between subnets through a network virtual appliance (NVA).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and subnets
> * Create an NVA that routes traffic
> * Create a route table
> * Create a route
> * Associate a route table to a subnet
> * Deploy virtual machines (VMs) into different subnets
> * Route traffic from one subnet to another through an NVA

This tutorial uses the Azure portal. You can also complete it using the [Azure CLI](tutorial-create-route-table-cli.md) or [PowerShell](tutorial-create-route-table-powershell.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Overview

This diagram shows the resources created in this tutorial along with the expected network routes.

:::image type="content" source="./media/tutorial-create-route-table-portal/overview.png" alt-text="Diagram showing an overview of interaction of the Public, Private and N V A Virtual Machines used in this tutorial." border="true":::

## Prerequisites

* An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network

In this section, you'll create a virtual network, three subnets, and a bastion host. You'll use the bastion host to securely connect to the virtual machines.

1. From the Azure portal menu, select **+ Create a resource** > **Networking** > **Virtual network**, or search for *Virtual Network* in the portal search box.

2. Select **Create**.

2. On the **Basics** tab of **Create virtual network**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription.|
    | Resource group | Select **Create new**, enter *myResourceGroup*. </br> Select **OK**. |
    | Name | Enter *myVirtualNetwork*. |
    | Region | Select **East US**.|

3. Select the **IP Addresses** tab, or select the **Next: IP Addresses** button at the bottom of the page.

4. In **IPv4 address space**, select the existing address space and change it to *10.0.0.0/16*.

4. Select **+ Add subnet**, then enter *Public* for **Subnet name** and *10.0.0.0/24* for **Subnet address range**.

5. Select **Add**.

6. Select **+ Add subnet**, then enter *Private* for **Subnet name** and *10.0.1.0/24* for **Subnet address range**.

7. Select **Add**.

8. Select **+ Add subnet**, then enter *DMZ* for **Subnet name** and *10.0.2.0/24* for **Subnet address range**.

9. Select **Add**.

10. Select the **Security** tab, or select the **Next: Security** button at the bottom of the page.

11. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter *myBastionHost*. |
    | AzureBastionSubnet address space | Enter *10.0.3.0/24*. |
    | Public IP Address | Select **Create new**. </br> Enter *myBastionIP* for **Name**. </br> Select **OK**. |

12. Select the **Review + create** tab or select the **Review + create** button.

13. Select **Create**.

## Create an NVA virtual machine

Network virtual appliances (NVAs) are virtual machines that help with network functions, such as routing and firewall optimization. In this section, you'll create an NVA using a **Windows Server 2019 Datacenter** virtual machine. You can select a different operating system if you want.

1. From the Azure portal menu, select **+ Create a resource** > **Compute** > **Virtual machine**, or search for *Virtual machine* in the portal search box.

1. Select **Create**.  
   
2. On the **Basics** tab of **Create a virtual machine**, enter or select this information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Virtual machine name | Enter *myVMNVA*. |
    | Region | Select **(US) East US**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Azure Spot instance | Select **No**. |
    | Size | Choose VM size or take default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.yml?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm-).|
    | Confirm password | Reenter password. |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVirtualNetwork**. |
    | Subnet | Select **DMZ** |
    | Public IP | Select **None** |
    | NIC network security group | Select **Basic**|
    | Public inbound ports network | Select **None**. |
   
5. Select the **Review + create** tab, or select **Review + create** button at the bottom of the page.
  
6. Review the settings, and then select **Create**.

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

## Create public and private virtual machines

You'll create two virtual machines in **myVirtualNetwork** virtual network, then you'll allow Internet Control Message Protocol (ICMP) on them so you can use *tracert* tool to trace traffic.

> [!NOTE]
> For production environments, we don't recommend allowing ICMP through the Windows Firewall.

### Create public virtual machine

1. From the Azure portal menu, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, enter or select this information in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Virtual machine name | Enter *myVMPublic*. |
    | Region | Select **(US) East US**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Azure Spot instance | Select **No**. |
    | Size | Choose VM size or take default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.yml?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm-).|
    | Confirm password | Reenter password. |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVirtualNetwork**. |
    | Subnet | Select **Public**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports network | Select **None**. |
   
5. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
  
6. Review the settings, and then select **Create**.

### Create private virtual machine

1. From the Azure portal menu, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, enter or select this information in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Virtual machine name | Enter *myVMPrivate*. |
    | Region | Select **(US) East US**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Azure Spot instance | Select **No**. |
    | Size | Choose VM size or take default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.yml?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm-).|
    | Confirm password | Reenter password. |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVirtualNetwork**. |
    | Subnet | Select **Private**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports network | Select **None**. |
   
5. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
  
6. Review the settings, and then select **Create**.

### Allow ICMP in Windows firewall

1. Select **Go to resource** or Search for *myVMPrivate* in the portal search box.

1. In the **Overview** page of **myVMPrivate**, select **Connect** then **Bastion**.

1. Enter the username and password you created for **myVMPrivate** virtual machine previously.

1. Select **Connect** button.

1. Open Windows PowerShell after you connect.

1. Enter this command:

    ```powershell
    New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
    ```

1. From PowerShell, open a remote desktop connection to the **myVMPublic** virtual machine:

    ```powershell
    mstsc /v:myvmpublic
    ```

1. After you connect to **myVMPublic** VM, open Windows PowerShell and enter the same command from step 6.

1. Close the remote desktop connection to **myVMPublic** VM.

## Turn on IP forwarding

To route traffic through the NVA, turn on IP forwarding in Azure and in the operating system of **myVMNVA** virtual machine. Once IP forwarding is enabled, any traffic received by **myVMNVA** VM that's destined for a different IP address, won't be dropped and will be forwarded to the correct destination.

### Turn on IP forwarding in Azure

In this section, you'll turn on IP forwarding for the network interface of **myVMNVA** virtual machine in Azure.

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
