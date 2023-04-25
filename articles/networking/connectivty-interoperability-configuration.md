---
title: Interoperability in Azure back-end connectivity features - Configuration details
description: This article describes configuration details for the test setup you can use to analyze interoperability between ExpressRoute, a site-to-site VPN, and virtual network peering in Azure.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 03/27/2023
ms.author: allensu
---

# Interoperability in Azure back-end connectivity features - Test configuration details

This article describes the configuration details of the [test setup](./connectivty-interoperability-preface.md). The test setup helps you analyze how Azure networking services interoperate at the control plane level and data plane level.

## Spoke virtual network connectivity by using virtual network peering

The following figure shows the Azure Virtual Network peering details of a spoke virtual network. For more information about peering between two virtual networks, see [Manage virtual network peering](../virtual-network/virtual-network-manage-peering.md). If you want the spoke virtual network to use the gateways that are connected to the hub virtual network, select **Use remote gateways**.

:::image type="content" source="./media/backend-interoperability/SpokeVNet_peering.png" alt-text="Screenshot of spoke virtual network's peering.":::

The following figure shows the virtual network peering details of the hub virtual network. If you want the hub virtual network to permit the spoke virtual network to use the hub's gateways, select **Allow gateway transit**.

:::image type="content" source="./media/backend-interoperability/HubVNet-peering.png" alt-text="Screenshot of Hub virtual network's peering.":::

## Branch virtual network connectivity by using a site-to-site VPN

Set up site-to-site VPN connectivity between the hub and branch virtual networks by using VPN gateways in Azure VPN Gateway. By default, VPN gateways and Azure ExpressRoute gateways use a private autonomous system number (ASN) value of **65515**. You can change the ASN value in VPN Gateway. In the test setup, the ASN value of the branch virtual network VPN gateway is changed to **65516** to support eBGP routing between the hub and branch virtual networks.

:::image type="content" source="./media/backend-interoperability/BranchVNet-VPNGW.png" alt-text="Screenshot of VPN Gateway configuration of a branch virtual network.":::

## On-premises Location 1 connectivity by using ExpressRoute and a site-to-site VPN

### ExpressRoute 1 configuration details

The following figure shows the Azure Region 1 ExpressRoute circuit configuration toward on-premises Location 1 customer edge (CE) routers:

:::image type="content" source="./media/backend-interoperability/ExR1.png" alt-text="Screenshot of ExpressRoute 1 configuration.":::

The following figure shows the connection configuration between the ExpressRoute 1 circuit and the hub virtual network:

:::image type="content" source="./media/backend-interoperability/ExR1-Hub-Connection.png" alt-text="Screenshot of connection configuration of ExpressRoute 1 to a hub virtual network Express Route gateway.":::

The following list shows the primary CE router configuration for ExpressRoute private peering connectivity. (Cisco ASR1000 routers are used as CE routers in the test setup.) When site-to-site VPN and ExpressRoute circuits are configured in parallel to connect an on-premises network to Azure, Azure prioritizes the ExpressRoute circuit by default. To avoid asymmetrical routing, the on-premises network also should prioritize ExpressRoute connectivity over site-to-site VPN connectivity. The following configuration establishes prioritization by using the BGP **local-preference** attribute:

```config
interface TenGigabitEthernet0/0/0.300
 description Customer 30 private peering to Azure
 encapsulation dot1Q 30 second-dot1q 300
 ip vrf forwarding 30
 ip address 192.168.30.17 255.255.255.252
!
interface TenGigabitEthernet1/0/0.30
 description Customer 30 to south bound LAN switch
 encapsulation dot1Q 30
 ip vrf forwarding 30
 ip address 192.168.30.0 255.255.255.254
 ip ospf network point-to-point
!
router ospf 30 vrf 30
 router-id 10.2.30.253
 redistribute bgp 65021 subnets route-map BGP2OSPF
 network 192.168.30.0 0.0.0.1 area 0.0.0.0
default-information originate always
 default-metric 10
!
router bgp 65021
 !
 address-family ipv4 vrf 30
  network 10.2.30.0 mask 255.255.255.128
  neighbor 192.168.30.18 remote-as 12076
  neighbor 192.168.30.18 activate
  neighbor 192.168.30.18 next-hop-self
  neighbor 192.168.30.18 soft-reconfiguration inbound
  neighbor 192.168.30.18 route-map prefer-ER-over-VPN in
  neighbor 192.168.30.18 prefix-list Cust30_to_Private out
 exit-address-family
!
route-map prefer-ER-over-VPN permit 10
 set local-preference 200
!
ip prefix-list Cust30_to_Private seq 10 permit 10.2.30.0/25
!
```

### Site-to-site VPN configuration details

The following list shows the primary CE router configuration for site-to-site VPN connectivity:

```config
crypto ikev2 proposal Cust30-azure-proposal
 encryption aes-cbc-256 aes-cbc-128 3des
 integrity sha1
 group 2
!
crypto ikev2 policy Cust30-azure-policy
 match address local 66.198.12.106
 proposal Cust30-azure-proposal
!
crypto ikev2 keyring Cust30-azure-keyring
 peer azure
  address 52.168.162.84
  pre-shared-key local IamSecure123
  pre-shared-key remote IamSecure123
!
crypto ikev2 profile Cust30-azure-profile
 match identity remote address 52.168.162.84 255.255.255.255
 identity local address 66.198.12.106
 authentication local pre-share
 authentication remote pre-share
 keyring local Cust30-azure-keyring
!
crypto ipsec transform-set Cust30-azure-ipsec-proposal-set esp-aes 256 esp-sha-hmac
 mode tunnel
!
crypto ipsec profile Cust30-azure-ipsec-profile
 set transform-set Cust30-azure-ipsec-proposal-set
 set ikev2-profile Cust30-azure-profile
!
interface Loopback30
 ip address 66.198.12.106 255.255.255.255
!
interface Tunnel30
 ip vrf forwarding 30
 ip address 10.2.30.125 255.255.255.255
 tunnel source Loopback30
 tunnel mode ipsec ipv4
 tunnel destination 52.168.162.84
 tunnel protection ipsec profile Cust30-azure-ipsec-profile
!
router bgp 65021
 !
 address-family ipv4 vrf 30
  network 10.2.30.0 mask 255.255.255.128
  neighbor 10.10.30.254 remote-as 65515
  neighbor 10.10.30.254 ebgp-multihop 5
  neighbor 10.10.30.254 update-source Tunnel30
  neighbor 10.10.30.254 activate
  neighbor 10.10.30.254 soft-reconfiguration inbound
 exit-address-family
!
ip route vrf 30 10.10.30.254 255.255.255.255 Tunnel30
```

## On-premises Location 2 connectivity by using ExpressRoute

A second ExpressRoute circuit, in closer proximity to on-premises Location 2, connects on-premises Location 2 to the hub virtual network. The following figure shows the second ExpressRoute configuration:

:::image type="content" source="./media/backend-interoperability/ExR2.png" alt-text="Screenshot of ExpressRoute 2 configuration.":::

The following figure shows the connection configuration between the second ExpressRoute circuit and the hub virtual network:

:::image type="content" source="./media/backend-interoperability/ExR2-Hub-Connection.png" alt-text="Screenshot of connection configuration of ExpressRoute 2 to a hub virtual network ExR gateway.":::

ExpressRoute 1 connects both the hub virtual network and on-premises Location 1 to a remote virtual network in a different Azure region:

:::image type="content" source="./media/backend-interoperability/ExR2-Remote-Connection.png" alt-text="Screenshot of connection configuration of ExpressRoute 2 to a remote virtual network ExR gateway.":::

## ExpressRoute and site-to-site VPN connectivity in tandem

###  Site-to-site VPN over ExpressRoute

You can configure a site-to-site VPN by using ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure virtual networks. With this configuration, you can exchange data with confidentiality, authenticity, and integrity. The data exchange also is anti-replay. For more information about how to configure a site-to-site IPsec VPN in tunnel mode by using ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft peering](../expressroute/site-to-site-vpn-over-microsoft-peering.md). 

The primary limitation of configuring a site-to-site VPN that uses Microsoft peering is throughput. Throughput over the IPsec tunnel is limited by the VPN gateway capacity. The VPN gateway throughput is lower than ExpressRoute throughput. In this scenario, using the IPsec tunnel for highly secure traffic and using private peering for all other traffic helps optimize the ExpressRoute bandwidth utilization.

### Site-to-site VPN as a secure failover path for ExpressRoute

ExpressRoute serves as a redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also, as demonstrated in our test setup, within an Azure region, you can use a site-to-site VPN to create a failover path for your ExpressRoute connectivity. When the same prefixes are advertised over both ExpressRoute and a site-to-site VPN, Azure prioritizes ExpressRoute. To avoid asymmetrical routing between ExpressRoute and the site-to-site VPN, on-premises network configuration should also reciprocate by using ExpressRoute connectivity before it uses site-to-site VPN connectivity.

For more information about how to configure coexisting connections for ExpressRoute and a site-to-site VPN, see [ExpressRoute and site-to-site coexistence](../expressroute/expressroute-howto-coexist-resource-manager.md).

## Extend back-end connectivity to spoke virtual networks and branch locations

### Spoke virtual network connectivity by using virtual network peering

Hub and spoke virtual network architecture is widely used. The hub is a virtual network in Azure that acts as a central point of connectivity between your spoke virtual networks and to your on-premises network. The spokes are virtual networks that peer with the hub, and which you can use to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For more information about the architecture, see [Implement a hub-spoke network topology in Azure](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke).

In virtual network peering within a region, spoke virtual networks can use hub virtual network gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

### Branch virtual network connectivity by using site-to-site VPN

You might want branch virtual networks, which are in different regions, and on-premises networks to communicate with each other via a hub virtual network. The native Azure solution for this configuration is site-to-site VPN connectivity by using a VPN. An alternative is to use a network virtual appliance (NVA) for routing in the hub.

For more information, see [What is VPN Gateway?](../vpn-gateway/vpn-gateway-about-vpngateways.md) and [Deploy a highly available NVA](/azure/architecture/reference-architectures/dmz/nva-ha).

## Next steps

Learn about [control plane analysis](./connectivty-interoperability-control-plane.md) of the test setup and the views of different virtual networks or VLANs in the topology.

Learn about [data plane analysis](./connectivty-interoperability-data-plane.md) of the test setup and Azure network monitoring feature views.

See the [ExpressRoute FAQ](../expressroute/expressroute-faqs.md) to:

- Learn how many ExpressRoute circuits you can connect to an ExpressRoute gateway.

- Learn how many ExpressRoute gateways you can connect to an ExpressRoute circuit.

- Learn about other scale limits of ExpressRoute.