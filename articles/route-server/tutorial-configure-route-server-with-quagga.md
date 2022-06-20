---
title: "Tutorial: Configure peering between Azure Route Server and Quagga network virtual appliance"
description: This tutorial shows you how to configure an Azure Route Server and peer it with a Quagga network virtual appliance.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: tutorial
ms.date: 08/23/2021
ms.custom: template-tutorial
---

# Tutorial: Configure peering between Azure Route Server and Quagga network virtual appliance

This tutorial shows you how to deploy an Azure Route Server into a virtual network and establish a BGP peering connection with a Quagga network virtual appliance. You'll deploy a virtual network with five subnets. One subnet will be dedicated to the Azure Route Server and another subnet dedicated to the Quagga NVA. The Quagga NVA will be configured to exchange routes with the Route Server. Lastly, you'll test to make sure routes are properly exchanged on the Azure Route Server and Quagga NVA.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create virtual network with five subnets
> * Deploy an Azure Route Server
> * Deploy virtual machine running Quagga
> * Configure Route Server peering
> * Check learned routes

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)

## Create a virtual network

You'll need a virtual network to deploy both the Azure Route Server and the Quagga NVA into. Each deployment will have its own dedicated subnet.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the top left-hand side of the screen, select **Create a resource** and search for **Virtual Network**. Then select **Create**.

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/create-new-virtual-network.png" alt-text="Screenshot of create a new virtual network resource.":::

1. On the *Basics* tab of *Create a virtual network* enter or select the following information then select **Next : IP Addresses >**:

    | Settings | Value |
    | -------- | ----- | 
    | Subscription | Select the subscription for this deployment. |
    | Resource group | Select an existing or create a new resource group for this deployment. | 
    | Name | Enter a name for the virtual network. This tutorial will use *myVirtualNetwork*.
    | Region | Select the region for which this virtual network will be deployed in. This tutorial will use *West US*.

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/virtual-network-basics-tab.png" alt-text="Screenshot of basics tab settings for the virtual network.":::

1. On the **IP Addresses** tab, configure the *virtual network address space* to **10.1.0.0/16**. Then configure the following five subnets:

    | Subnet name | Subnet address range |
    | ----------- | -------------------- |
    | RouteServerSubnet | 10.1.1.0/25 |
    | subnet1 | 10.1.2.0/24 |
    | subnet2 | 10.1.3.0/24 |
    | subnet3 | 10.1.4.0/24 |
    | GatewaySubnet | 10.1.5.0/24 |

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/virtual-network-ip-addresses.png" alt-text="Screenshot of IP address settings for the virtual network.":::

1. Select **Review + create** and then select **Create** after the validation passes.

## Create the Azure Route Server

The Route Server is used to communicate with your NVA and exchange virtual network routes using a BGP peering connection.

1. Go to https://aka.ms/routeserver.

1. Select **+ Create new route server**.

   :::image type="content" source="./media/quickstart-configure-route-server-portal/route-server-landing-page.png" alt-text="Screenshot of Route Server landing page.":::

1. On the **Create a Route Server** page, enter, or select the following information:

    | Settings | Value |
    | -------- | ----- |
    | Subscription | Select the same subscription the virtual was created in the previous section. | 
    | Resource group | Select the existing resource group *myRouteServerRG*. |
    | Name | Enter the Route Server name *myRouteServer*. |
    | Region | Select the **West US** region. |
    | Virtual Network | Select the *myVirtualNetwork* virtual network. |
    | Subnet | Select the *RouteServerSubnet (10.1.0.0/25)* created previously. |
    | Public IP address | Create a new or selecting an existing Standard public IP address to use with the Route Server. This IP address ensures connectivity to the backend service that manages the Route Server configuration. |

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/route-server-basics-tab.png" alt-text="Screenshot of basics tab for Route Server creation.":::

1. Select **Review + create** and then select **Create** after validation passes. The Route Server takes about 15 minutes to deploy.

## Create Quagga network virtual appliance

To configure the Quagga network virtual appliance, you will need to deploy a Linux virtual machine.

1. From the Azure portal, select **+ Create a resource > Compute > Virtual machine**. Then select **Create**.

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/create-virtual-machine.png" alt-text="Screenshot of creating new virtual machine page.":::

1. On the *Basics* tab, enter or select the following information:

    | Settings | Value |
    | -------- | ----- |
    | Subscription | Select the same subscription as the virtual network deployed previously. |
    | Resource group | Select the existing resource group *myRouteServerRG*. |
    | Virtual machine name | Enter the name **Quagga**. |
    | Region | Select the **West US** region. |
    | Image | Select **Ubuntu 18.04 LTS - Gen 1**. |
    | Size | Select **Standard_B2s - 2vcpus, 4GiB memory**. |
    | Authentication type | Select **Password** |
    | Username | Enter *azureuser*. Don't use *quagga* as the user name or else the setup script will fail in a later step. |
    | Password | Enter and confirm the password of your choosing. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **SSH (22)**. |

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/create-quagga-basics-tab.png" alt-text="Screenshot of basics tab for creating a new virtual machine." lightbox="./media/tutorial-configure-route-server-with-quagga/create-quagga-basics-tab-expanded.png":::
    
1. On the **Networking** tab, select the following network settings:

    | Settings | Value |
    | -------- | ----- |
    | Virtual Network | Select **myVirtualNetwork**. |
    | Subnet | Select **subnet3 (10.1.4.0/24)**. |
    | Public IP | Leave as default. |
    | NIC network security group | Leave as default. **Basic**. |
    | Public inbound ports | Leave as default. **Allow selected ports**. |
    | Select inbound ports | Leaves as default. **SSH (22)**. |

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/create-quagga-networking-tab.png" alt-text="Screenshot of networking tab for creating a new virtual machine." lightbox="./media/tutorial-configure-route-server-with-quagga/create-quagga-networking-tab-expanded.png":::

1. Select **Review + create** and then **Create** after validation passes. The deployment of the VM will take about 10 minutes.

1. Once the VM has deployed, go to the networking settings of the Quagga VM and select the network interface.

     :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/quagga-network-settings.png" alt-text="Screenshot of networking page of the Quagga VM.":::

1. Select **IP configuration** under *Settings* and then select **ipconfig1**.

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/quagga-ip-configuration.png" alt-text="Screenshot of IP configuration page of the Quagga VM.":::

1. Change the assignment from *Dynamic* to **Static** and then change the IP address from *10.1.4.4* to **10.1.4.10**. This IP is used in this [script](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/route-server-quagga/scripts/quaggadeploy.sh) which will be run in a later step. If you want to use a different IP address ensure to update the IP in the script. Select **Save** to update the IP configuration of the VM.

1. Using [Putty](https://www.putty.org/) connect to the Quagga VM using the public IP address and credential used to create the VM.

1. Once logged in, enter `sudo su` to switch to super user to avoid errors running the script. Copy this [script](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/route-server-quagga/scripts/quaggadeploy.sh) and paste it into the Putty session. The script will configure the virtual machine with Quagga along with other network settings. Update the script to suit your network environment before running it on the virtual machine. It will take a few minutes for the script to complete the setup.

## Configure Route Server peering

1. Go to the Route Server you created in the previous step.

1. Select **Peers** under *Settings*. Then select **+ Add** to add a new peer.

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/peers.png" alt-text="Screenshot of peers page for Route Server.":::

1. On the *Add Peer* page, enter the following information, and then select **Add** to save the configuration:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this peer. **Quagga**. |
    | ASN | Enter the ASN number for the Quagga NVA. **65001** is the ASN defined in the script. |
    | IPv4 Address | Enter the private IP of the Quagga NVA virtual machine. |

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/add-peer.png" alt-text="Screenshot of add peer page.":::

1. The Peers page should look like this once you add a peer:

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/peer-configured.png" alt-text="Screenshot of a configured peer.":::
    
## Check learned routes
1. To check the routes learned by the Route Server use this command:

    ```azurepowershell-interactive
    $routes = @{
        RouteServerName = 'myRouteServer'
        ResourceGroupName = 'myRouteServerRG'
        PeerName = 'Quagga'
    }
    Get-AzRouteServerPeerLearnedRoute @routes | ft
    ```

    The output should look like the following: 

    :::image type="content" source="./media/tutorial-configure-route-server-with-quagga/routes-learned.png" alt-text="Screenshot of routes learned by Route Server.":::

1. To check the routes learned by the Quagga NVA enter `vtysh` and then enter `show ip bgp`. Output should look like the following:

    ```
    root@Quagga:/home/azureuser# vtysh

    Hello, this is Quagga (version 1.2.4).
    Copyright 1996-2005 Kunihiro Ishiguro, et al.

    Quagga# show ip bgp
    BGP table version is 0, local router ID is 10.1.4.10
    Status codes: s suppressed, d damped, h history, * valid, > best, = multipath,
                  i internal, r RIB-failure, S Stale, R Removed
    Origin codes: i - IGP, e - EGP, ? - incomplete

        Network          Next Hop            Metric LocPrf Weight Path
        10.1.0.0/16      10.1.1.4                               0 65515 i
                         10.1.1.5                               0 65515 i
    *> 10.100.1.0/24    0.0.0.0                  0         32768 i
    *> 10.100.2.0/24    0.0.0.0                  0         32768 i
    *> 10.100.3.0/24    0.0.0.0                  0         32768 i
    ```

## Clean up resources

If you no longer need the Route Server and all associating resources, you can delete the **myRouteServerRG** resource group.

:::image type="content" source="./media/tutorial-configure-route-server-with-quagga/delete-resource-group.png" alt-text="Screenshot of delete resource group button.":::

## Next steps

Advance to the next article to learn how to troubleshoot Route Server.
> [!div class="nextstepaction"]
> [Troubleshoot Route Server](troubleshoot-route-server.md)
