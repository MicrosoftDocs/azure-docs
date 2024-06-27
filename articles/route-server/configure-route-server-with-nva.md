---
title: 'Tutorial: Configure BGP peering between Azure Route Server and NVA'
description: This tutorial shows you how to configure an Azure Route Server and peer it with a Network Virtual Appliance (NVA) using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: tutorial
ms.date: 06/27/2024
---

# Tutorial: Configure BGP peering between Azure Route Server and Network Virtual Appliance

This tutorial shows you how to deploy an Azure Route Server into a virtual network and establish a BGP peering connection with a Windows Server network virtual appliance (NVA). You'll configure the NVA to exchange routes with the Route Server. Lastly, you'll test to make sure routes are properly exchanged between the Route Server and NVA.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a virtual network
> - Deploy an Azure Route Server
> - Deploy a virtual machine
> - Configure BGP on the virtual machine
> - Configure BGP peering between the Route Server and the NVA
> - Check learned routes

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An active Azure subscription 

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network

You need a virtual network to deploy both the Route Server and the NVA. Azure Route Server must be deployed in a dedicated subnet called *RouteServerSubnet*.

1. On the Azure portal home page, search for *virtual network*, and select **Virtual networks** from the search results. 

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/create-new-virtual-network.png" alt-text="Screenshot of create a new virtual network resource.":::

1. On the **Virtual networks** page, select **+ Create**. 

1. On the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Settings | Value |
    | -------- | ----- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new**. </br> In **Name** enter **myResourceGroup**. </br> Select **OK**. | 
    | **Instance details** |  |
    | Name | Enter *myVirtualNetwork*. |
    | Region | Select **East US**. |


1. Select **IP Addresses** tab or **Next : IP Addresses >** button.

1. On the **IP Addresses** tab, configure **IPv4 address space** to **10.1.0.0/16**, then configure the following subnets:

    | Subnet name | Subnet address range |
    | ----------- | -------------------- |
    | RouteServerSubnet | 10.1.1.0/25 |
    | subnet1 | 10.1.2.0/24 |
    | subnet2 | 10.1.3.0/24 |
    | subnet3 | 10.1.4.0/24 |


1. Select **Review + create** and then select **Create** after the validation passes.

## Create the Azure Route Server

The Route Server is used to communicate with your NVA and exchange virtual network routes using a BGP peering connection.

1. On the Azure portal, search for *route server*, and select **Route Servers** from the search results. 

1. On the **Route Servers** page, select **+ Create**.

1. On the **Basics** tab of **Create a Route Server** page, enter or select the following information:

    | Settings | Value |
    | -------- | ----- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription that you used for the virtual network. | 
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Name | Enter *myRouteServer*. |
    | Region | Select **East US** region. |
    | **Configure virtual networks** |  |
    | Virtual Network | Select **myVirtualNetwork**. |
    | Subnet | Select **RouteServerSubnet (10.1.0.0/25)**. This subnet is a dedicated Route Server subnet. |
    | **Public IP address** |  |
    | Public IP address | Select **Create new**, and then enter *myRouteServer-ip*. This Standard IP address ensures connectivity to the backend service that manages the Route Server configuration. |


1. Select **Review + create** and then select **Create** after validation passes. The Route Server takes about 15 minutes to deploy.

## Create the network virtual appliance (NVA)

To create an NVA for this tutorial, deploy a Windows Server virtual machine, and then configure its BGP settings.

### Create a virtual machine

1. On the Azure portal, search for *virtual machine*, and select **Virtual machines** from the search results.

1. Select **Create**, then select **Azure virtual machine**.

1. On the **Basics** tab of **Create a virtual machine**, enter or select the following information:

    | Settings | Value |
    | -------- | ----- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription that you used for the virtual network. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Virtual machine name | Enter *myNVA*. |
    | Region | Select **(US) East US**. |
    | Availability options | Select **No infrastructure required**. |
    | Security type | Select **Standard**. |
    | Image | Select a **Windows Server** image. This tutorial uses **Windows Server 2022 Datacenter: Azure Edition - x64 Gen2** image. |
    | Size | Choose a size or leave the default setting. |
    | **Administrator account** |  |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter the password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **RDP (3389)**. |


 
1. On the **Networking** tab, select the following network settings:

    | Settings | Value |
    | -------- | ----- |
    | Virtual network | Select **myVirtualNetwork**. |
    | Subnet | Select **subnet3 (10.1.4.0/24)**. |
    | Public IP | Leave as default. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **SSH (22)**. |

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/create-quagga-networking-tab.png" alt-text="Screenshot of networking tab for creating a new virtual machine." lightbox="./media/tutorial-configure-route-server-with-quagga/create-quagga-networking-tab-expanded.png":::

1. Select **Review + create** and then **Create** after validation passes.

1. Once the virtual machine has deployed, go to the **Networking** page of the virtual machine and select the network interface.

     :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/quagga-network-settings.png" alt-text="Screenshot of networking page of the Quagga VM.":::

1. Select **IP configuration** under **Settings** and then select **ipconfig1**.

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/quagga-ip-configuration.png" alt-text="Screenshot of IP configurations page of the Quagga VM.":::

1. Under **Private IP address Settings**, change the **Assignment**  from **Dynamic** to **Static**, and then change the **IP address** from **10.1.4.4** to **10.1.4.10**.

1. Take note of the public IP, and select **Save** to update the IP configurations of the virtual machine. 

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/change-ip-configuration.png" alt-text="Screenshot of changing IP configurations the VM.":::

### Configure BGP on the virtual machine



## Configure Route Server peering

1. Go to the Route Server you created in the previous step.

1. Select **Peers** under **Settings**. Then, select **+ Add** to add a new peer.

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/peers.png" alt-text="Screenshot of peers page for Route Server.":::

1. On the **Add Peer** page, enter the following information, and then select **Add** to save the configuration:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *myNVA*. This name is used to identify the peer. |
    | ASN | Enter *65001*. This ASN is defined in NVA. |
    | IPv4 Address | Enter *10.1.4.10*. This IPv4 is the private IP of the NVA. |


1. Once you add the NVA as a peer, the **Peers** page should look like this:

    
## Check learned routes

1. To check the routes learned by the Route Server, use this command in Azure portal Cloud Shell:

    ```azurepowershell-interactive
    $routes = @{
        RouteServerName = 'myRouteServer'
        ResourceGroupName = 'myResourceGroup'
        PeerName = 'myNVA'
    }
    Get-AzRouteServerPeerLearnedRoute @routes | ft
    ```

    The output should look like the following output: 

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/routes-learned.png" alt-text="Screenshot of routes learned by Route Server.":::


## Clean up resources

When no longer needed, you can delete all resources created in this tutorial by following these steps:

1. On the Azure portal menu, select **Resource groups**.

1. Select the **myResourceGroup** resource group.

1. Select **Delete a resource group**.

1. Select **Apply force delete for selected Virtual machines and Virtual machine scale sets**.

1. Enter *myResourceGroup* and select **Delete**.

## Related content

In this tutorial, you learned how to create and configure an Azure Route Server with a network virtual appliance (NVA). To learn more about Route Servers, see [Azure Route Server frequently asked questions (FAQs)](route-server-faq.md).
