---
title: 'Tutorial: Configure BGP peering between Azure Route Server and NVA'
description: Learn how to deploy Azure Route Server and configure BGP peering with a network virtual appliance to establish dynamic routing in your virtual network.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: tutorial
ms.date: 03/03/2026
ms.custom: sfi-image-nochange

---

# Tutorial: Configure BGP peering between Azure Route Server and network virtual appliance (NVA)

This tutorial shows you how to deploy Azure Route Server and configure BGP peering with a Linux-based network virtual appliance (NVA). You learn the complete process from deployment through route verification, providing hands-on experience with dynamic routing in Azure virtual networks.

By the end of this tutorial, you have a working Azure Route Server environment that demonstrates automatic route exchange between Azure's software-defined network and a network virtual appliance.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy an Azure Route Server in a virtual network
> * Create and configure a Linux virtual machine as an NVA
> * Configure BGP routing on the network virtual appliance
> * Establish BGP peering between Route Server and the NVA
> * Verify route learning and propagation

## Prerequisites

Before you begin this tutorial, ensure you have:

- An active Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- Basic understanding of BGP routing concepts
- Familiarity with Azure virtual networks and virtual machines

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a Route Server

In this section, you create an Azure Route Server that establishes BGP peering with your network virtual appliance.

1. In the search box at the top of the portal, enter **route server**, and select **Route Server** from the search results. 

    :::image type="content" source="./media/route-server-portal-search.png" alt-text="Screenshot of searching for Route Server in the Azure portal." lightbox="./media/route-server-portal-search.png":::

1. On the **Route Servers** page, select **+ Create**.

1. On the **Basics** tab of **Create a Route Server**, enter, or select the following information:

    | Settings | Value |
    |----------|-------|
    | **Project details** |  |
    | Subscription | Select the Azure subscription that you want to use to deploy the Route Server. |
    | Resource group | Select **Create new**. <br>In **Name**, enter **myResourceGroup**. <br>Select **OK**. |
    | **Instance details** |  |
    | Name | Enter **myRouteServer**. |
    | Region | Select **East US** or any region you prefer to create the Route Server in. |
    | Routing Preference | Select **ExpressRoute**. Other available options: **VPN** and **ASPath**. |
    | **Configure virtual networks** |  |
    | Virtual network | Select **Create new**. <br>In **Name**, enter **myVirtualNetwork**. <br>In **Address range**, enter **10.0.0.0/16**. <br>In **Subnet name** and **Address range**, enter **RouteServerSubnet** and **10.0.1.0/26** respectively. <br>Select **OK**. |
    | Subnet | Once you created the virtual network and subnet, the **RouteServerSubnet** populates. <br>- The subnet must be named *RouteServerSubnet*.<br>- The subnet must be a minimum of /26 or larger. |
    | **Public IP address** |  |
    | Public IP address | Select **Create new** or select an existing Standard public IP resource to assign to the Route Server. To ensure connectivity to the backend service that manages the Route Server configuration, a public IP address is required. |
    | Public IP address name | Enter **myVirtualNetwork-ip**. A Standard public IP address is required to ensure connectivity to the backend service that manages the Route Server. |

    :::image type="content" source="./media/create-route-server.png" alt-text="Screenshot showing the Basics tab for creating a Route Server." lightbox="./media/create-route-server.png":::

1. Select **Review + create** and then select **Create** after the validation passes.

    [!INCLUDE [Deployment note](../../includes/route-server-note-creation-time.md)]

1. Once the deployment is complete, select **Go to resource** to go to the **Overview** page of **myRouteServer**.

1. Take note of the **ASN** and **Route Server IP addresses** in the **Overview** page. You need this information to configure the NVA in the next section.

    :::image type="content" source="./media/route-server-overview.png" alt-text="Screenshot showing the Route Server ASN and Peer IP addresses in the Overview page." lightbox="./media/route-server-overview.png":::

    > [!NOTE]
    > The ASN of Azure Route Server is always 65515.

## Create a network virtual appliance (NVA)

In this section, you create a Linux virtual machine that functions as a network virtual appliance and establish BGP communication with the Route Server.

### Create a virtual machine

Create a Linux VM in the virtual network you created earlier to act as a network virtual appliance.

1. In the search box at the top of the portal, enter **virtual machine**, and select **Virtual machines** from the search results.

1. Select **Create**, then select **Azure virtual machine**.

1. On the **Basics** tab of **Create a virtual machine**, enter, or select the following information:

    | Settings | Value |
    | -------- | ----- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription that you used for the virtual network. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **myNVA**. |
    | Region | Select **(US) East US**. |
    | Availability options | Select **No infrastructure required**. |
    | Security type | Select a security type. This tutorial uses **Standard**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | Size | Choose a size or leave the default setting. |
    | **Administrator account** |  |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter a username. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter **myNVA-key**. |

1. Select the **Networking** tab or **Next: Disks >** then **Next: Networking >**.

1. On the **Networking** tab, select the following network settings:

    | Settings | Value |
    | -------- | ----- |
    | Virtual network | Select **myVirtualNetwork**. |
    | Subnet | Select **mySubnet (10.0.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**.</br> In **Name** enter **nsg-nva**.</br> Select **OK**. |

1. Select **Review + create** and then **Create** after validation passes.

    > [!NOTE]
    > The network security group rules block inbound SSH access from the internet. To run commands on the virtual machine, use the **Run command** feature in the Azure portal or deploy Azure Bastion. For more information about Azure Bastion, see [Quickstart: Deploy Azure Bastion with default settings](../bastion/quickstart-host-portal.md).

### Configure BGP on the virtual machine

In this section, you install FRRouting (FRR) on the VM and configure BGP so it can function as an NVA and exchange routes with the Route Server.

> [!IMPORTANT]
> FRRouting is used in this tutorial to simulate an NVA and demonstrate how to establish BGP peering with Route Server. For production environments, use supported network virtual appliances from Azure Marketplace.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **myNVA**.

1. In **Operations**, select **Run command** then **RunShellScript**.

1. Enter the following script in the **Run Command Script** window, then select **Run**:

    ```bash
    #!/bin/bash
    # Install FRRouting
    sudo apt-get update && sudo apt-get install -y frr

    # Enable BGP daemon
    sudo sed -i 's/bgpd=no/bgpd=yes/' /etc/frr/daemons

    # Write BGP configuration
    sudo tee /etc/frr/frr.conf > /dev/null << 'EOF'
    frr version 8.1
    frr defaults traditional
    hostname myNVA
    router bgp 65001
     bgp router-id 10.0.0.4
     neighbor 10.0.1.4 remote-as 65515
     neighbor 10.0.1.5 remote-as 65515
     address-family ipv4 unicast
      network 172.16.1.0/24
      network 172.16.2.0/24
     exit-address-family
    EOF

    # Restart FRR to apply configuration
    sudo systemctl restart frr
    ```

1. Wait for the script to complete. The output confirms the FRR installation and BGP configuration.

## Configure Route Server peering

Now that you have configured BGP on the virtual machine, you need to add the NVA as a BGP peer in the Route Server configuration.

1. Go to the Route Server you created in the previous steps.

1. Select **Peers** under **Settings**. Then, select **+ Add** to add a new peer.

1. On the **Add Peer** page, enter the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myNVA**. Use this name to identify the peer. It doesn't have to be the same name of the VM that you configured as an NVA. |
    | ASN | Enter **65001**. This is the ASN of the NVA. You configured it in the previous section. |
    | IPv4 Address | Enter **10.0.0.4**. This is the private IP address of the NVA. |

1. Select **Add** to save the configuration.

    :::image type="content" source="./media/add-peer.png" alt-text="Screenshot showing how to add the NVA to the Route Server as a peer." lightbox="./media/add-peer.png":::

1. Once you add the NVA as a peer, the **Peers** page shows **myNVA** as a peer:

    :::image type="content" source="./media/peer-list.png" alt-text="Screenshot showing the peers of a Route Server." lightbox="./media/peer-list.png":::

    > [!NOTE]
    > Azure Route Server supports BGP peering with NVAs that are deployed in the same virtual network or a directly peered virtual network. Configuring BGP peering between an on-premises NVA and Azure Route Server isn't supported.

## Verify learned routes

Use the Azure PowerShell cmdlet to verify that the Route Server has successfully learned routes from the NVA.

Use [Get-AzRouteServerPeerLearnedRoute](/powershell/module/az.network/get-azrouteserverpeerlearnedroute) cmdlet to check the routes learned by the Route Server.

```azurepowershell-interactive
Get-AzRouteServerPeerLearnedRoute -ResourceGroupName 'myResourceGroup' -RouteServerName 'myRouteServer' -PeerName 'myNVA'
```

The output should look like the following example. The output shows the two learned routes from the NVA: 

```output
LocalAddress Network       NextHop  SourcePeer Origin AsPath Weight
------------ -------       -------  ---------- ------ ------ ------
10.0.1.5     172.16.1.0/24 10.0.0.4 10.0.0.4   EBgp   65001  32768
10.0.1.5     172.16.2.0/24 10.0.0.4 10.0.0.4   EBgp   65001  32768
10.0.1.4     172.16.1.0/24 10.0.0.4 10.0.0.4   EBgp   65001  32768
10.0.1.4     172.16.2.0/24 10.0.0.4 10.0.0.4   EBgp   65001  32768
```

## Clean up resources

When no longer needed, you can delete all resources created in this tutorial by deleting the **myResourceGroup** resource group:

1. In the search box at the top of the portal, enter **myResourceGroup**. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. In **Delete a resource group**, select **Apply force delete for selected Virtual machines and Virtual machine scale sets**.

1. Enter **myResourceGroup**, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Next step

Now that you've successfully configured BGP peering between Azure Route Server and a network virtual appliance, explore this next article to expand your Azure networking knowledge:

> [!div class="nextstepaction"]
> [About Azure Route Server support for ExpressRoute and VPN](expressroute-vpn-support.md)
