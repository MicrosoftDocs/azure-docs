---
title: Route network traffic - tutorial - Azure portal
titlesuffix: Azure Virtual Network
description: In this tutorial, learn how to route network traffic with a route table using the Azure portal.
services: virtual-network
documentationcenter: virtual-network
author: KumudD
# Customer intent: I want to route traffic from one subnet, to a different subnet, through a network virtual appliance.
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: tutorial
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 03/16/2021
ms.author: kumud
---

# Tutorial: Route network traffic with a route table using the Azure portal

Azure routes traffic between all subnets within a virtual network, by default. You can create your own routes to override Azure's default routing. Custom routes are helpful when, for example, you want to route traffic between subnets through a network virtual appliance (NVA). In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an NVA that routes traffic
> * Create a route table
> * Create a route
> * Associate a route table to a subnet
> * Deploy virtual machines (VM) into different subnets
> * Route traffic from one subnet to another through an NVA

This tutorial uses the [Azure portal](https://portal.azure.com). You can also use [Azure CLI](tutorial-create-route-table-cli.md) or [Azure PowerShell](tutorial-create-route-table-powershell.md).

## Prerequisites

Before you begin, you require an Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a virtual network

1. From the Azure portal menu, select **Create a resource**. From the Azure Marketplace, select **Networking** > **Virtual network**, or search for **Virtual Network** in the search box.

2. Select **Create**.

2. In **Create virtual network**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription.|
    | Resource group | Select **Create new**, enter **myResourceGroup**. </br> Select **OK**. |
    | Name | Enter **myVirtualNetwork**. |
    | Location | Select **(US) East US**.|

3. Select the **IP Addresses** tab, or select the **Next: IP Addresses** button at the bottom of the page.

4. In **IPv4 address space**, select the existing address space and change it to **10.0.0.0/16**.

4. Select **+ Add subnet**, then enter **Public** for **Subnet name** and **10.0.0.0/24** for **Subnet address range**.

5. Select **Add**.

6. Select **+ Add subnet**, then enter **Private** for **Subnet name** and **10.0.1.0/24** for **Subnet address range**.

7. Select **Add**.

8. Select **+ Add subnet**, then enter **DMZ** for **Subnet name** and **10.0.2.0/24** for **Subnet address range**.

9. Select **Add**.

10. Select the **Security** tab, or select the **Next: Security** button at the bottom of the page.

11. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.0.3.0/24** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |

12. Select the **Review + create** tab or select the **Review + create** button.

13. Select **Create**.

## Create an NVA

Network virtual appliances (NVAs) are virtual machines that help with network functions, such as routing and firewall optimization. This tutorial assumes you're using **Windows Server 2019 Datacenter**. You can select a different operating system if you want.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVMNVA** |
    | Region | Select **(US) East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |
    |

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
   
5. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
  
6. Review the settings, and then select **Create**.

## Create a route table

1. On the [Azure portal](https://portal.azure.com) menu or from the **Home** page, select **Create a resource**.

2. In the search box, enter **Route table**. When **Route table** appears in the search results, select it.

3. In the **Route table** page, select **Create**.

4. In **Create route table** in the **Basics** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription.|
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |    |
    | Region | Select **East US**. |
    | Name | Enter **myRouteTablePublic**. |
    | Propagate gateway routes | Select **Yes**. |

    :::image type="content" source="./media/tutorial-create-route-table-portal/create-route-table.png" alt-text="Create route table, Azure portal." border="true":::

5. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

## Create a route

1. Go to the [Azure portal](https://portal.azure.com) to manage your route table. Search for and select **Route tables**.

2. Select the name of your route table **myRouteTablePublic**.

3. In the **myRouteTablePublic** page, in the **Settings** section, select **Routes**.

4. In the routes page, select the **+ Add** button.

5. In **Add route**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **ToPrivateSubnet** |
    | Address prefix | Enter **10.0.1.0/24** (The address range of the **Private** subnet created earlier) |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.0.2.4** (An address within the address range of the **DMZ** subnet) |

6. Select **OK**.

## Associate a route table to a subnet

1. Go to the [Azure portal](https://portal.azure.com) to manage your virtual network. Search for and select **Virtual networks**.

2. Select the name of your virtual network **myVirtualNetwork**.

3. In the **myVirtualNetwork** page, in the **Settings** section, select **Subnets**.

4. In the virtual network's subnet list, select **Public**.

5. In **Route table**, choose the route table you created **myRouteTablePublic**. 

6. Select **Save** to associate your route table to the **Public** subnet.

    :::image type="content" source="./media/tutorial-create-route-table-portal/associate-route-table.png" alt-text="Associate route table, subnet list, virtual network, Azure portal." border="true":::

## Turn on IP forwarding

Next, turn on IP forwarding for your new NVA virtual machine, **myVMNVA**. When Azure sends network traffic to **myVMNVA**, if the traffic is destined for a different IP address, IP forwarding sends the traffic to the correct location.

1. Go to the [Azure portal](https://portal.azure.com) to manage your VM. Search for and select **Virtual machines**.

2. Select the name of your virtual machine **myVMNVA**.

3. In the **myVMNVA** overview page, in **Settings**, select **Networking**.

4. In the **Networking** page of **myVMNVA**, select the network interface next to **Network Interface**.  The name of the interface will begin with **myvmnva**.

    :::image type="content" source="./media/tutorial-create-route-table-portal/virtual-machine-networking.png" alt-text="Networking, network virtual appliance (NVA) virtual machine (VM), Azure portal" border="true":::

5. In the network interface overview page, in **Settings**, select **IP configurations**.

6. In the **IP configurations** page, set **IP forwarding** to **Enabled**, then select **Save**.

    :::image type="content" source="./media/tutorial-create-route-table-portal/enable-ip-forwarding.png" alt-text="Enable IP forwarding" border="true":::

## Create public and private virtual machines

Create a public VM and a private VM in the virtual network. Later, you'll use them to see that Azure routes the **Public** subnet traffic to the **Private** subnet through the NVA.


### Public VM

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVMPublic** |
    | Region | Select **(US) East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |
    |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVirtualNetwork**. |
    | Subnet | Select **Public** |
    | Public IP | Select **None** |
    | NIC network security group | Select **Basic**|
    | Public inbound ports network | Select **None**. |
   
5. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
  
6. Review the settings, and then select **Create**.

### Private VM

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVMPrivate** |
    | Region | Select **(US) East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |
    |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVirtualNetwork**. |
    | Subnet | Select **Private** |
    | Public IP | Select **None** |
    | NIC network security group | Select **Basic**|
    | Public inbound ports network | Select **None**. |
   
5. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
  
6. Review the settings, and then select **Create**.

## Route traffic through an NVA

### Sign in to private vm

1. Go to the [Azure portal](https://portal.azure.com) to manage your private VM. Search for and select **Virtual machines**.

2. Pick the name of your private virtual machine **myVmPrivate**.

3. In the VM menu bar, select **Connect**, then select **Bastion**.

4. In the **Connect** page, select the blue **Use Bastion** button.

5. In the **Bastion** page, enter the username and password you created for the virtual machine previously.

6. Select **Connect**.

### Configure firewall

In a later step, you'll use the trace route tool to test routing. Trace route uses the Internet Control Message Protocol (ICMP), which the Windows Firewall denies by default. 

Enable ICMP through the Windows firewall.

1. In the bastion connection of **myVMPrivate**, open PowerShell with administrative privileges.

2. Enter this command:

    ```powershell
    New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
    ```

    You'll be using trace route to test routing in this tutorial. For production environments, we don't recommend allowing ICMP through the Windows Firewall.

### Turn on IP forwarding within myVMNVA

You [turned on IP forwarding](#turn-on-ip-forwarding) for the VM's network interface using Azure. The virtual machine's operating system also has to forward network traffic. 

Turn on IP forwarding for **myVMNVA** with these commands.

1. From PowerShell on the **myVMPrivate** VM, open a remote desktop to the **myVMNVA** VM:

    ```powershell
    mstsc /v:myvmnva
    ```

2. From PowerShell on the **myVMNVA** VM, enter this command to turn on IP forwarding:

    ```powershell
    Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters -Name IpEnableRouter -Value 1
    ```

3. Restart **myVMNVA**.

    ```powershell
    Restart-Computer
    ```

4. After **myVMNVA** restarts, create a remote desktop session to **myVMPublic**. 
    
    While still connected to **myVMPrivate**, open PowerShell and run this command:

    ```powershell
    mstsc /v:myvmpublic
    ```
5. In the remote desktop of **myVMPublic**, open PowerShell.

6. Enable ICMP through the Windows firewall by entering this command:

    ```powershell
    New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
    ```

## Test the routing of network traffic

First, let's test routing of network traffic from **myVMPublic** to **myVMPrivate**.

1. From PowerShell on **myVMPublic**, enter this command:

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

    * You can see the first hop is to 10.0.2.4, which is **myVMNVA's** private IP address. 

    * The second hop is to the private IP address of **myVMPrivate**: 10.0.1.4. 

    Earlier, you added the route to the **myRouteTablePublic** route table and associated it to the *Public* subnet. Azure sent the traffic through the NVA and not directly to the *Private* subnet.

2. Close the remote desktop session to **myVMPublic**, which leaves you still connected to **myVMPrivate**.

3. Open PowerShell on **myVMPrivate**, enter this command:

    ```powershell
    tracert myvmpublic
    ```

    This command tests the routing of network traffic from the *myVmPrivate* VM to the *myVmPublic* VM. The response is similar to this example:

    ```cmd
    Tracing route to myvmpublic.q04q2hv50taerlrtdyjz5nza1f.bx.internal.cloudapp.net [10.0.0.4]
    over a maximum of 30 hops:

      1     1 ms     1 ms     1 ms  myvmpublic.internal.cloudapp.net [10.0.0.4]

    Trace complete.
    ```

    You can see that Azure routes traffic directly from *myVMPrivate* to *myVMPublic*. By default, Azure routes traffic directly between subnets.

4. Close the bastion session to **myVMPrivate**.

## Clean up resources

When the resource group is no longer needed, delete **myResourceGroup** and all the resources it contains:

1. Go to the [Azure portal](https://portal.azure.com) to manage your resource group. Search for and select **Resource groups**.

2. Select the name of your resource group **myResourceGroup**.

3. Select **Delete resource group**.

4. In the confirmation dialog box, enter **myResourceGroup** for **TYPE THE RESOURCE GROUP NAME**, and then select **Delete**. 


## Next steps

In this tutorial, you:

* Created a route table and associated it to a subnet.
* Created a simple NVA that routed traffic from a public subnet to a private subnet. 

You can deploy different pre-configured NVAs from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking), which provide many useful network functions. 

To learn more about routing, see [Routing overview](virtual-networks-udr-overview.md) and [Manage a route table](manage-route-table.md).

To filter network traffic in a virtual network, see:
> [!div class="nextstepaction"]
> [Tutorial: Filter network traffic with a network security group using the Azure portal](tutorial-filter-network-traffic.md)
