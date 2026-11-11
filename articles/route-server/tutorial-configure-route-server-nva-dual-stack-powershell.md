---
title: 'Tutorial: Configure dual-stack Azure Route Server with PowerShell'
description: Deploy dual-stack Azure Route Server with PowerShell, peer with a Linux NVA, and verify IPv4 and IPv6 routes in a preview-enabled subscription.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: tutorial
ms.date: 11/05/2026
ms.custom: references_regions
ai-usage: ai-assisted
#CustomerIntent: As an Azure network administrator, I want a PowerShell path for deploying Route Server and an NVA so I can verify IPv4 and IPv6 route exchange.
---

# Tutorial: Configure dual-stack Azure Route Server with PowerShell

In this tutorial, you use Azure PowerShell to deploy dual-stack Azure Route Server, establish BGP peering with a Linux network virtual appliance (NVA), and verify IPv4 and IPv6 routes. You use the Azure portal for the NVA virtual machine and FRRouting (FRR) setup. The result demonstrates route exchange, not end-to-end packet delivery.

> [!IMPORTANT]
> Azure Route Server IPv4/IPv6 dual-stack mode is in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features in preview.

In this tutorial, you:

> [!div class="checklist"]
> * Create a dual-stack virtual network with separate subnets for Route Server and an NVA, and a NAT gateway for the NVA's outbound access.
> * Deploy Route Server and configure BGP peering with the NVA.
> * Verify the expected IPv4 and IPv6 routes.

## Regional availability

Azure Route Server IPv4/IPv6 dual-stack mode is available in preview only in the following Azure regions:

| Region | Programmatic name |
| --- | --- |
| East US 2 EUAP | `eastus2euap` |
| Central US EUAP | `centraluseuap` |
| West Central US | `westcentralus` |
| East Asia | `eastasia` |
| UK South | `uksouth` |
| Central US | `centralus` |
| Australia Central | `australiacentral` |
| Korea Central | `koreacentral` |
| Central India | `centralindia` |
| Brazil South | `brazilsouth` |
| Malaysia West | `malaysiawest` |

## Prerequisites

- An Azure account with an active subscription where Route Server dual-stack preview access is enabled. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Azure PowerShell installed locally](/powershell/azure/install-azure-powershell), with Az.Network module version 8.0.0 or later. Sign in with [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) and select the intended subscription.
- Permissions to create the tutorial resources. For Route Server permissions, see [Roles and permissions](roles-permissions.md).
- Familiarity with virtual networks and basic BGP concepts.
- Access to the Azure portal for the Linux NVA setup.

Use a new, dedicated resource group. The resources incur charges while deployed, and the cleanup procedure deletes the entire group.

## Create a dual-stack virtual network

1. Set the variables. Enter a region listed in [Regional availability](#regional-availability) that's available to your preview-enabled subscription. If **test-rg** already exists, choose a new resource group name rather than reusing a group with other resources.

    ```azurepowershell
    $location = Read-Host 'Enter a region available to your preview-enabled subscription'
    $resourceGroupName = 'test-rg'
    $virtualNetworkName = 'vnet-1'
    $routeServerName = 'route-server'
    $peerName = 'vm-nva'

    New-AzResourceGroup -Name $resourceGroupName -Location $location
    ```

1. Create a NAT gateway so that the NVA can download packages. The NVA doesn't have a public IP address, and new virtual networks can default to private subnets, which don't provide default outbound access. For more information, see [Default outbound access in Azure](../virtual-network/ip-services/default-outbound-access.md).

    ```azurepowershell
    $natPublicIp = New-AzPublicIpAddress `
        -Name 'public-ip-nat' `
        -ResourceGroupName $resourceGroupName `
        -Location $location `
        -Sku Standard `
        -AllocationMethod Static `
        -IpAddressVersion IPv4

    $natGateway = New-AzNatGateway `
        -Name 'nat-gateway' `
        -ResourceGroupName $resourceGroupName `
        -Location $location `
        -Sku Standard `
        -IdleTimeoutInMinutes 4 `
        -PublicIpAddress $natPublicIp
    ```

1. Create the virtual network and both dual-stack subnets. Associate the NAT gateway with **subnet-1** only:

    ```azurepowershell
    $routeServerSubnet = New-AzVirtualNetworkSubnetConfig `
        -Name 'RouteServerSubnet' `
        -AddressPrefix @('10.0.1.0/26', 'fd00:0:100:1::/64')

    $nvaSubnet = New-AzVirtualNetworkSubnetConfig `
        -Name 'subnet-1' `
        -AddressPrefix @('10.0.0.0/24', 'fd00:0:100:2::/64') `
        -InputObject $natGateway

    $virtualNetwork = New-AzVirtualNetwork `
        -Name $virtualNetworkName `
        -ResourceGroupName $resourceGroupName `
        -Location $location `
        -AddressPrefix @('10.0.0.0/16', 'fd00:0:100::/48') `
        -Subnet @($routeServerSubnet, $nvaSubnet)

    $virtualNetwork.Subnets | Format-Table Name, AddressPrefix
    ```

Confirm that **RouteServerSubnet** and **subnet-1** each have the listed IPv4 and IPv6 prefixes. Don't deploy Route Server until both address families are present on RouteServerSubnet.

## Deploy Azure Route Server

1. Create a Standard IPv4 public IP address for Route Server:

    ```azurepowershell
    $publicIp = New-AzPublicIpAddress `
        -Name 'public-ip' `
        -ResourceGroupName $resourceGroupName `
        -Location $location `
        -Sku Standard `
        -AllocationMethod Static `
        -IpAddressVersion IPv4
    ```

1. Create Route Server in the dual-stack subnet:

    ```azurepowershell
    $subnetId = ($virtualNetwork.Subnets | Where-Object Name -eq 'RouteServerSubnet').Id
    $autoscale = New-AzVirtualRouterAutoScaleConfiguration -MinCapacity 2

    New-AzRouteServer `
        -RouteServerName $routeServerName `
        -ResourceGroupName $resourceGroupName `
        -Location $location `
        -HostedSubnet $subnetId `
        -PublicIpAddress $publicIp `
        -VirtualRouterAutoScaleConfiguration $autoscale

    $routeServer = Get-AzRouteServer `
        -ResourceGroupName $resourceGroupName `
        -RouteServerName $routeServerName
    $routeServer | Format-List
    ```

1. Wait for deployment to complete. In the Azure portal, open the Route Server. Under **Settings**, select **Configuration**, and check **Dual Stack Mode**. Because RouteServerSubnet already has an IPv6 prefix, the route server is created in dual-stack mode, and the setting shows **Enabled**. If it shows **Disabled**, set it to **Enabled**, and then select **Save**. This change is irreversible and can take up to 40 minutes. For details, see [Enable dual-stack mode](enable-route-server-dual-stack.md#enable-dual-stack-mode). Don't continue if deployment failed or **Dual Stack Mode** doesn't show **Enabled**.

1. Record the Route Server's two IPv4 addresses (**Route Server IP addresses**) and ASN from **Overview**. The NVA peers with these IPv4 addresses for both IPv4 and IPv6 routes.

This procedure creates a new deployment. To update an existing IPv4-only Route Server, use [Enable dual-stack mode](enable-route-server-dual-stack.md) instead.

## Deploy and configure the NVA

Use the Azure portal to create the NVA in the virtual network that you created earlier. Don't repeat the virtual network, NAT gateway, or Route Server creation steps.

### Create a virtual machine

1. In the search box at the top of the portal, enter **virtual machine**, and select **Virtual machines** from the search results.
1. Select **Create**, and then select **Azure virtual machine**.
1. On the **Basics** tab of **Create a virtual machine**, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | Subscription | Select the subscription that you used for the virtual network. |
    | Resource group | Select the resource group identified by `$resourceGroupName`. |
    | Virtual machine name | Enter **vm-nva**. |
    | Region | Select the same region as the virtual network. |
    | Availability options | Select **No infrastructure required**. |
    | Security type | Leave the default of **Trusted launch virtual machines**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | Size | Choose a size or leave the default setting. |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter a username. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter **vm-nva-key**. |

1. Select the **Networking** tab.
1. On the **Networking** tab, select the following settings:

    | Setting | Value |
    | --- | --- |
    | Virtual network | Select the virtual network identified by `$virtualNetworkName`. |
    | Subnet | Select **subnet-1**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. Enter **nsg-nva** for the name, and then select **OK**. |

1. Select **Review + create**, and then select **Create** after validation passes.
1. When deployment finishes, select **Go to resource**. Under **Networking**, select **Network settings**, and then select the network interface name.
1. Under **Settings**, select **IP configurations**. If the list doesn't include an IPv6 configuration with a private IPv6 address from **fd00:0:100:2::/64**, select **+ Add**, enter the following information, and then select **Add**:

    | Setting | Value |
    | --- | --- |
    | Name | Enter **ipconfig-ipv6**. |
    | IP version | Select **IPv6**. |
    | Allocation | Leave the default of **Dynamic**. |
    | Public IP address | Leave unselected. The NVA doesn't need a public IPv6 address. |

1. If you added an IPv6 configuration, return to **vm-nva**, and select **Restart** so that the guest operating system gets the new IPv6 address.
1. On **IP configurations**, record the NVA's private IPv4 and IPv6 addresses.
1. On **vm-nva**, under **Operations**, select **Run command** > **RunShellScript**, and run the following command to confirm that the guest operating system has the IPv6 address:

    ```bash
    ip -6 addr show dev eth0 scope global
    ```

    The output must include the private IPv6 address that you recorded. FRR uses this global IPv6 address as the next hop for the IPv6 routes that it advertises. If the address is missing, configure DHCPv6 in the guest by following [Configure DHCPv6 for Linux VMs](../load-balancer/load-balancer-ipv6-for-linux.md), and then run the command again.

The network security group rules block inbound SSH access from the internet. Use **Run command** for the following configuration steps, or deploy [Azure Bastion](../bastion/quickstart-host-portal.md).

### Configure BGP on the virtual machine

1. On **vm-nva**, under **Operations**, select **Run command** > **RunShellScript**.
1. Replace the example NVA IPv4 address and both Route Server IPv4 addresses in the following script with your deployment's values. The script replaces `/etc/frr/frr.conf`; use it only on the new tutorial VM, not on an NVA with an existing routing configuration. Enter the script in **Run Command Script**, and select **Run**:

    ```bash
    #!/bin/bash
    set -e
    nva_ip='10.0.0.4'
    route_server_ip_1='10.0.1.4'
    route_server_ip_2='10.0.1.5'

    sudo apt-get update && sudo apt-get install -y frr
    sudo sed -i 's/bgpd=no/bgpd=yes/' /etc/frr/daemons
    sudo tee /etc/frr/frr.conf > /dev/null << EOF
    frr defaults traditional
    hostname vm-nva
    ip route 198.51.100.0/24 Null0
    ipv6 route 2001:db8:220::/48 Null0
    router bgp 65001
     bgp router-id $nva_ip
     no bgp ebgp-requires-policy
     no bgp default ipv4-unicast
     neighbor $route_server_ip_1 remote-as 65515
     neighbor $route_server_ip_1 ebgp-multihop 2
     neighbor $route_server_ip_2 remote-as 65515
     neighbor $route_server_ip_2 ebgp-multihop 2
     address-family ipv4 unicast
      network 198.51.100.0/24
      neighbor $route_server_ip_1 activate
      neighbor $route_server_ip_1 next-hop-self
      neighbor $route_server_ip_2 activate
      neighbor $route_server_ip_2 next-hop-self
     exit-address-family
     address-family ipv6 unicast
      network 2001:db8:220::/48
      neighbor $route_server_ip_1 activate
      neighbor $route_server_ip_1 next-hop-self
      neighbor $route_server_ip_2 activate
      neighbor $route_server_ip_2 next-hop-self
     exit-address-family
    EOF
    sudo systemctl restart frr
    ```

1. Wait for the script to complete. Resolve any package-installation or FRR error before creating the BGP peer.

The FRR configuration uses ASN **65001** and advertises **198.51.100.0/24** and **2001:db8:220::/48**. The static routes to `Null0` allow FRR to advertise these documentation prefixes but discard traffic to them. This configuration isn't a packet-forwarding test. The `address-family ipv6 unicast` block activates IPv6 on the same IPv4 neighbors, so IPv6 routes use multiprotocol BGP (MP-BGP) over the IPv4 sessions. FRR sets the next hop of the IPv6 routes to the global IPv6 address of **eth0** that you verified earlier.

Confirm that package installation and FRR configuration completed without errors before creating the BGP peer. For production deployments, use a supported NVA from Azure Marketplace rather than this FRR simulation.

## Configure BGP peering with an NVA

1. Enter the NVA's private IPv4 address, and create the peer:

    ```azurepowershell
    $nvaIPv4Address = Read-Host 'Enter the NVA private IPv4 address'

    Add-AzRouteServerPeer `
        -ResourceGroupName $resourceGroupName `
        -RouteServerName $routeServerName `
        -PeerName $peerName `
        -PeerAsn '65001' `
        -PeerIp $nvaIPv4Address

    Get-AzRouteServerPeer `
        -ResourceGroupName $resourceGroupName `
        -RouteServerName $routeServerName `
        -PeerName $peerName
    ```

1. On **vm-nva**, use the portal's **Run command** > **RunShellScript** to run the following commands:

    ```bash
    sudo vtysh -c 'show bgp ipv4 unicast summary' -c 'show bgp ipv6 unicast summary'
    ```

    In both tables, confirm that both Route Server IPv4 addresses show a numeric value in the **State/PfxRcd** column. A state such as **Active**, **Idle**, or **Connect** means that the session isn't established for that address family. If a session isn't established, check the Route Server IP addresses, ASN, and FRR configuration before continuing.

Both route families use IPv4 BGP sessions. Don't create a separate IPv6 BGP peer for this scenario.

## Verify IPv4 and IPv6 routes

1. View the routes advertised by the NVA before an inbound route map changes them:

    ```azurepowershell
    Get-AzRouteServerPeerLearnedRoute `
        -ResourceGroupName $resourceGroupName `
        -RouteServerName $routeServerName `
        -PeerName $peerName | Format-Table -AutoSize
    ```

1. Verify effective routes by using the Route Server's virtual hub resource ID:

    ```azurepowershell
    (Get-AzVHubEffectiveRoute -VirtualHubResourceId $routeServer.Id).Value |
        Format-Table AddressPrefixes, NextHops, NextHopType, AsPath -AutoSize
    ```

Confirm that both **198.51.100.0/24** and **2001:db8:220::/48** appear with the NVA as the next hop. If either prefix is missing, check its FRR `network` statement and matching static route, and confirm that the address family is active on both neighbors. These route checks don't prove packet delivery.

For portal and CLI alternatives, see [View effective routes](view-route-server-effective-routes.md). To apply a routing policy, follow [Configure route maps](route-maps-how-to.md), then compare the effective routes before and after you apply the route map.

## Clean up resources

If you want to continue with the route map example, keep the tutorial resources until you finish it. Otherwise, review the group's resources before deleting them:

```azurepowershell
Get-AzResource -ResourceGroupName $resourceGroupName |
    Format-Table Name, ResourceType
```

The following command deletes the entire resource group and prompts for confirmation. Run it only if the group contains no resources you need to keep:

```azurepowershell
Remove-AzResourceGroup -Name $resourceGroupName
```

## Related content

- [Configure route maps](route-maps-how-to.md) to apply a routing policy to the NVA peering.
- [Drop inbound routes](route-maps-scenario-drop-inbound-routes.md) for an inbound route filtering example.
- [View effective routes](view-route-server-effective-routes.md) to compare routing information after you apply a route map.
