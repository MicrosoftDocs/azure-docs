---
title: 'Tutorial: Configure BGP peering between Azure Route Server and NVA'
description: Learn how to deploy Azure Route Server and configure BGP peering with a network virtual appliance to establish dynamic routing in your virtual network.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: tutorial
ms.date: 09/17/2025
ms.custom: sfi-image-nochange

---

# Tutorial: Configure BGP peering between Azure Route Server and network virtual appliance (NVA)

This tutorial shows you how to deploy Azure Route Server and configure BGP peering with a Windows Server network virtual appliance (NVA). You learn the complete process from deployment through route verification, providing hands-on experience with dynamic routing in Azure virtual networks.

By the end of this tutorial, you have a working Azure Route Server environment that demonstrates automatic route exchange between Azure's software-defined network and a network virtual appliance.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy an Azure Route Server in a virtual network
> * Create and configure a Windows Server virtual machine as an NVA
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

In this section, you create a Windows Server virtual machine that functions as a network virtual appliance and establish BGP communication with the Route Server.

### Create a virtual machine

Create a Windows Server VM in the virtual network you created earlier to act as a network virtual appliance.

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
    | Image | Select a **Windows Server** image. This tutorial uses **Windows Server 2022 Datacenter: Azure Edition - x64 Gen2** image. |
    | Size | Choose a size or leave the default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter the password. |

1. Select the **Networking** tab or **Next: Disks >** then **Next: Networking >**.

1. On the **Networking** tab, select the following network settings:

    | Settings | Value |
    | -------- | ----- |
    | Virtual network | Select **myVirtualNetwork**. |
    | Subnet | Select **mySubnet (10.0.0.0/24)**. |
    | Public IP | Leave as default. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **RDP (3389)**. |

    > [!CAUTION]
    > Leaving the RDP port open to the internet isn't recommended. Restrict access to the RDP port to a specific IP address or range of IP addresses. For production environments, it's recommended to block internet access to the RDP port and use [Azure Bastion](../bastion/bastion-overview.md?toc=/azure/route-server/toc.json) to securely connect to your virtual machine from the Azure portal.

1. Select **Review + create** and then **Create** after validation passes.

### Configure BGP on the virtual machine

In this section, you configure BGP settings on the VM so it can function as an NVA and exchange routes with the Route Server.

> [!IMPORTANT]
> The Routing and Remote Access Service (RRAS) isn't supported in Azure for production use. However, in this tutorial, it's used to simulate an NVA and demonstrate how to establish BGP peering with Route Server. For production environments, use supported network virtual appliances from Azure Marketplace. For more information, see [Remote access overview](/windows-server/remote/remote-access/remote-access).
1. Go to **myNVA** virtual machine and select **Connect**.

1. On the **Connect** page, select **Download RDP file** under **Native RDP**.

1. Open the downloaded file.

1. Select **Connect** and then enter the username and password that you created in the previous steps. Accept the certificate if prompted.

1. Run PowerShell as an administrator.

1. In PowerShell, execute the following cmdlets:

    ```powershell
    # Install required Windows features.
    Install-WindowsFeature RemoteAccess
    Install-WindowsFeature RSAT-RemoteAccess-PowerShell
    Install-WindowsFeature Routing
    Install-RemoteAccess -VpnType RoutingOnly
    
    # Configure BGP & Router ID on the Windows Server
    Add-BgpRouter -BgpIdentifier 10.0.0.4 -LocalASN 65001
     
    # Configure Azure Route Server as a BGP Peer.
    Add-BgpPeer -LocalIPAddress 10.0.0.4 -PeerIPAddress 10.0.1.4 -PeerASN 65515 -Name RS_IP1
    Add-BgpPeer -LocalIPAddress 10.0.0.4 -PeerIPAddress 10.0.1.5 -PeerASN 65515 -Name RS_IP2
    
    # Originate and announce BGP routes.
    Add-BgpCustomRoute -network 172.16.1.0/24
    Add-BgpCustomRoute -network 172.16.2.0/24
    ```

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
