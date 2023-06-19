---
title: 'Tutorial: Diagnose a VM network routing problem - Azure portal'
titleSuffix: Azure Network Watcher
description: In this tutorial, you learn how to diagnose a virtual machine network routing problem using the next hop capability of Azure Network Watcher.
services: network-watcher
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: tutorial
ms.date: 02/28/2023
ms.custom: template-tutorial, mvc, engagement-fy23
# Customer intent: I want to diagnose virtual machine (VM) network routing problem that prevents communication to different destinations.
---

# Tutorial: Diagnose a virtual machine network routing problem using the Azure portal

When you deploy a virtual machine (VM), Azure creates several [system default routes](/azure/virtual-network/virtual-networks-udr-overview#system-routes?toc=%2Fazure%2Fnetwork-watcher%2Ftoc.json&tabs=json) for it. You can create [custom routes](/azure/virtual-network/virtual-networks-udr-overview#custom-routes?toc=%2Fazure%2Fnetwork-watcher%2Ftoc.json&tabs=json) to override some of Azure's system routes. Sometimes, a custom route can result in a VM not being able to communicate with the intended destination. You can use Azure Network Watcher [next hop](network-watcher-next-hop-overview.md) capability to troubleshoot and diagnose the VM routing problem that's preventing it from correctly communicating with other resources.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and a Bastion host
> * Create two virtual machines
> * Test communication to different IPs using the next hop capability of Azure Network Watcher
> * View the effective routes
> * Create a custom route
> * Diagnose a routing problem

If you prefer, you can diagnose a virtual machine network routing problem using the [Azure CLI](diagnose-vm-network-routing-problem-cli.md) or [Azure PowerShell](diagnose-vm-network-routing-problem-powershell.md) tutorials.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network

In this section, you create a virtual network.

1. In the search box at the top of the portal, enter *virtual networks*. Select **Virtual networks** in the search results.

    :::image type="content" source="./media/diagnose-vm-network-routing-problem/virtual-network-azure-portal.png" alt-text="Screenshot shows searching for virtual networks in the Azure portal.":::

1. Select **+ Create**. In **Create virtual network**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | Name | Enter *myVNet*. |
    | Region | Select **East US**. |

1. Select the **IP Addresses** tab, or select **Next: IP Addresses** button at the bottom of the page.

1. Enter the following values in the **IP Addresses** tab:

    | Setting | Value |
    | --- | --- |
    | IPv4 address space | Enter *10.0.0.0/16*. |
    | Subnet name | Enter *mySubnet*. |
    | Subnet address range | Enter *10.0.0.0/24*. |

1. Select the **Security** tab, or select the **Next: Security** button at the bottom of the page. 

1. Under **BastionHost**, select **Enable** and enter the following values:

    | Setting | Value |
    | --- | --- |
    | Bastion name | Enter *myBastionHost*. |
    | AzureBastionSubnet address space | Enter *10.0.3.0/24*. |
    | Public IP Address | Select **Create new**. </br> Enter *myBastionIP* for **Name**. </br> Select **OK**. |

1. Select the **Review + create** tab or select the **Review + create** button.

1. Review the settings, and then select **Create**. 

## Create virtual machines

In this section, you create two virtual machines: **myVM** and **myNVA**. You use **myVM** virtual machine to test the communication from. **myNVA** virtual machine is used as a network virtual appliance in the scenario.

### Create first virtual machine

1. In the search box at the top of the portal, enter *virtual machines*. Select **Virtual machines** in the search results.

2. Select **+ Create** and then select **Azure virtual machine**.

3. In **Create a virtual machine**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Virtual machine name | Enter *myVM*. |
    | Region | Select **(US) East US**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - x64 Gen2**. |
    | Size | Choose a size or leave the default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |

4. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

5. In the Networking tab, enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **None**. |

6. Select **Review + create**.

7. Review the settings, and then select **Create**. 

8. Once the deployment is complete, select **Go to resource** to go to the **Overview** page of **myVM**.  

9. Select **Connect**, then select **Bastion**.

10. Enter the username and password that you created in the previous steps.

11. Select **Connect** button.

12. Once logged in, open a web browser and go to `www.bing.com` to verify it's reachable.

    :::image type="content" source="./media/diagnose-vm-network-routing-problem/bing-allowed.png" alt-text="Screenshot showing Bing page in a web browser.":::

### Create second virtual machine

Follow the previous steps that you used to create **myVM** virtual machine and enter *myNVA* for the virtual machine name.

## Test network communication using Network Watcher next hop

Use the next hop capability of Network Watcher to determine which route Azure is using to route traffic from **myVM**, which has one network interface with one IP configuration

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Network diagnostic tools**, select **Next hop**. Enter or select the following values:

    | Setting | Value  |
    | ------- | ------ |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **myResourceGroup**. |
    | Virtual machine | Select **myVM**. |
    | Network interface | Leave the default. |
    | Source IP address | Enter *10.0.0.4* or the IP of your VM if it's different. |
    | Destination IP address | Enter *13.107.21.200* to test the communication to `www.bing.com`. |

1. Select **Next hop** button to start the test. The test result shows information about the next hop like the next hop type, its IP address, and the route table ID used to route traffic. The result of testing **13.107.21.200** shows that the next hop type is **Internet** and the route table ID is **System Route** which means traffic destined to `www.bing.com` from **myVM** is routed to the internet using Azure default system route.

    :::image type="content" source="./media/diagnose-vm-network-routing-problem/next-hop-internet.png" alt-text="Screenshot showing how to test communication to www.bing.com using Azure Network Watcher next hop capability.":::

1. Change the **Destination IP address** to **10.0.0.5** which is the IP address of **myNVA** virtual machine, and then select **Next hop** button. The result shows that the next hop type is **VirtualNetwork** and the route table ID is **System Route** which means traffic destined to **10.0.0.5** from **myVM** is routed within **myVNet** virtual network using Azure default system route.

    :::image type="content" source="./media/diagnose-vm-network-routing-problem/next-hop-virtual-network.png" alt-text="Screenshot showing Network Watcher next hop result when testing with an IP within the same virtual network.":::

1. Next, change the **Destination IP address** to **10.1.0.5** which is a private IP address that isn't in the address space of **myVNet** virtual network, and then select **Next hop** button. The result shows that the next hop type is **None** which means traffic destined to **10.1.0.5** from **myVM** is dropped.

    :::image type="content" source="./media/diagnose-vm-network-routing-problem/next-hop-none-system-route.png" alt-text="Screenshot showing Network Watcher next hop result when testing with a private IP outside the address space of the virtual network.":::

## View details of a route

To further analyze routing, review the effective routes for **myVM** network interface.

1. In the search box at the top of the portal, enter *virtual machines*. Select **Virtual machines** in the search results.

1. Under **Settings**, select **Networking**, then select the network interface.

    :::image type="content" source="./media/diagnose-vm-network-routing-problem/select-network-interface.png" alt-text="Screenshot showing how to select the network interface page from the virtual machine settings in the Azure portal.":::

1. Under **Help**, select **Effective routes** to see the all routes associated with the network interface of **myVM**. 

    :::image type="content" source="./media/diagnose-vm-network-routing-problem/effective-routes-default.png" alt-text="Screenshot showing Azure default system routes associated with the virtual machine network interface." lightbox="./media/diagnose-vm-network-routing-problem/effective-routes-default-expanded.png":::

    In the previous section, when you ran the test using **13.107.21.200**, the route with 0.0.0.0/0 address prefix was used to route traffic to the address since no other route has the address. By default, all addresses not specified within the address prefix of another route are routed to the internet.

    When you ran the test using **10.0.0.5**, the route with 10.0.0.0/16 address prefix was used to route traffic to it.

    However, when you ran the test using **10.1.0.5**, the result was **None** for the next hop type because this IP address is in the 10.0.0.0/8 address space. Azure default route for 10.0.0.0/8 address prefix has next hope type as **None**. If you add an address prefix that contains 10.1.0.5 to the virtual network address space, then the next hop type for 10.1.0.5 will change from **None** to **VirtualNetwork**. 

## Test a routing problem due to custom routes

Next, you create a static custom route to override Azure default system routes and cause a routing problem to **myVM** virtual machine that prevents it from directly communicating with `www.bing.com`. Then, you'll use Network Watcher next hop to troubleshoot and diagnose the problem.

### Create a custom route

In this section, you create a static custom route (user-defined route) in a route table that forces all traffic destined outside the virtual network to a specific IP address. Forcing traffic to a virtual network appliance is a common scenario.

1. In the search box at the top of the portal, enter *route tables*. Select **Route tables** in the search results.

1. Select **+ Create** to create a new route table. In the **Create Route table** page, enter or select the following values:

    | Setting | Value  |
    | ------- | ------ |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance Details** |  |
    | Region | Select **East US**. |
    | Name | Enter *myRouteTable*. |
    | Propagate gateway routes | Leave the default. |

1. Select **Review + create**. 

1. Review the settings, and then select **Create**.

1. Once the deployment is complete, select **Go to resource** to go to the **Overview** page of **myRouteTable**.

1. Under **Settings**, select **Routes**, and then select **+ Add** to add a custom route. 

1. In the **Add route** page, enter or select the following values:

    | Setting | Value  |
    | ------- | ------ |
    | Route name | Enter *myRoute*. |
    | Address prefix destination | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter *0.0.0.0/0*. |
    | Next hop type | Select **Virtual appliance**. |
    | next hop address | Enter *10.0.0.5*. |

1. Select **Add**.

### Associate the route table with the subnet

In this section, you associate the route table that you created in the previous section with **mySubnet** subnet.

1. Under **Settings**, select **Subnets**, and then select **+ Associate** to associate **myRouteTable** with **mySubnet** subnet. 

1. In the **Associate subnet** page, select the following values:

    | Setting | Value  |
    | ------- | ------ |
    | Virtual network | Select **myVNet (myResourcegroup)**. |
    | Subnet | Select **MySubnet**. |

1. Select **OK**.

### Go to `www.bing.com`

In **myVM**, open the web browser and go to `www.bing.com` to verify if it's still reachable. The custom route that you created and associated with subnet of **myVM** forces the traffic to go to **myNVA**. The traffic is dropped as **myNVA** isn't set up to forward the traffic for the purposes of this tutorial to demonstrate a routing problem.

:::image type="content" source="./media/diagnose-vm-network-routing-problem/bing-blocked.png" alt-text="Screenshot showing Bing page isn't reachable in a web browser.":::

###  Test network communication using next hop

Repeat the steps you used in [Test network communication using Network Watcher next hop](#test-network-communication-using-network-watcher-next-hop) section using **13.107.21.200** to test the communication to `www.bing.com`.

:::image type="content" source="./media/diagnose-vm-network-routing-problem/next-hop-virtual-appliance.png" alt-text="Screenshot showing virtual appliance as the next hop after applying a custom route.":::

## View effective routes

Repeat the steps you used in [View details of a route](#view-details-of-a-route) to check the effective routes after using the custom route that caused an issue in reaching `www.bing.com`.

The custom route with prefix 0.0.0.0/0 overrode Azure default route and caused all traffic destined outside **myVNet** virtual machine to go to 10.0.0.5. 

:::image type="content" source="./media/diagnose-vm-network-routing-problem/effective-routes-custom.png" alt-text="Screenshot the effective routes after overriding Azure default system routes using a custom route.":::
 
> [!NOTE]
> In this tutorial, traffic to `www.bing.com` was dropped because **myNVA** was not set up to forward traffic. To learn how to set up a virtual machine to forward traffic, see [Turn on IP forwarding](/azure/virtual-network/tutorial-create-route-table-portal#turn-on-ip-forwarding).

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains:

1. Enter *myResourceGroup* in the search box at the top of the portal. When you see **myResourceGroup** in the search results, select it.
2. Select **Delete resource group**.
3. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this tutorial, you created a virtual machine and used Network Watcher next hop to diagnose routing to different destinations. To learn more about routing in Azure, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

For outbound VM connections, you can use Network Watcher [connection troubleshoot](network-watcher-connectivity-portal.md) capability to determine the latency, allowed and denied network traffic between the VM and an endpoint, and the route to an endpoint.

To learn how to monitor communication between two virtual machines, advance to the next tutorial.
> [!div class="nextstepaction"]
> [Monitor a network connection](connection-monitor.md)
