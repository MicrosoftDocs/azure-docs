---
title: 'Interoperability of ExpressRoute, Site-to-site VPN, and VNet Peering - Configuration Details: Azure Backend Connectivity Features Interoperability | Microsoft Docs'
description: This page provides the configuration details of the test setup that is used to analyze interoperability of ExpressRoute, Site-to-site VPN, and VNet Peering features.
documentationcenter: na
services: networking
author: rambk
manager: tracsman

ms.service: expressroute,vpn-gateway,virtual-network
ms.topic: article
ms.workload: infrastructure-services
ms.date: 10/18/2018
ms.author: rambala

---

# Interoperability of ExpressRoute, Site-to-site VPN, and VNet-Peering - Test configuration details

In this article, let's go through the configuration details of the test setup. To review the Test Setup, see the [Test Setup][Setup]. 

##Spoke VNet connectivity using VNet peering

The following Azure portal screenshot shows the VNet peering details of the spoke VNet. For step-by-step guidance to configure VNet peering between two virtual networks, see [Manage VNet Peering][VNet-Config]. If you want the Spoke VNet to use the gateways connected to the Hub VNet, you need to check *Use remote gateways*.

[![1]][1]

The following Azure portal screenshot shows the VNet peering details of the hub VNet. If you want the Hub VNet to let the Spoke VNet use its gateways, you need to check *Use remote gateways*.

[![2]][2]

##Branch VNet connectivity using Site-to-Site VPN

Site-to-Site VPN connectivity between the Hub and Branch VNets is configured using VPN gateways. By default, VPN and ExpressRoute gateways are configured with the private ASN value of 65515. VPN gateway allows you to change the ASN value. In the test setup, as shown in the following Azure portal screenshot, the ASN value of the branch VNet VPN gateway is changed to 65516 to enable eBGP routing between the Hub and Branch VNets.


[![3]][3]


##Location-1 on-premises connectivity using ExpressRoute and Site-to-Site VPN

###ExpressRoute1 configuration details

The following portal screenshot shows the Azure Region 1 ExpressRoute circuit configuration towards Location-1 on-premises CE Routers.

[![4]][4]

The following portal screenshot shows the connection configuration between ExpressRoute1 circuit and the Hub VNet.

[![5]][5]

The following configuration is the listing of the primary CE router (Cisco ASR1000 routers are used as CE routers in the test setup) configuration related to ExpressRoute private peering connectivity. When both Site-to-Site VPN and ExpressRoute circuit are configured in parallel to connect an on-premises network to Azure; Azure prefers ExpressRoute circuit by default. To avoid asymmetrical routing, on-premises network should also prefer ExpressRoute over Site-to-Site VPN for the routes received both via the ExpressRoute and Site-to-Site VPN. This is achieved in the following configuration using BGP local-preference attribute. 

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

###Site-to-Site VPN configuration details

The following is the listing of the primary CE router configuration related to Site-to-Site VPN connectivity:

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

##Location 2 on-premises connectivity using ExpressRoute

A second ExpressRoute circuit, in closer proximity to Location 2 on-premises, connects the Location 2 on-premises to the hub VNet. The following portal screenshot shows the second ExpressRoute configuration.

[![6]][6]

The following portal screenshot shows the connection configuration between the second ExpressRoute circuit and the Hub VNet.

[![7]][7]

The ExpressRoute1 connects both the Hub Vnet and Location-1 on-premises to a remote Vnet in a different Azure region.

[![8]][8]

## Further reading

### Using ExpressRoute and Site-to-Site VPN connectivity in tandem

#### Site-to-Site VPN over ExpressRoute

Site-to-Site VPN can be configured over ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure VNets with confidentiality, anti-replay, authenticity, and integrity. For more information regarding how to configure Site-to-Site IPSec VPN in tunnel mode over ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft-peering][S2S-Over-ExR]. 

The major limitation of configuring S2S VPN over Microsoft peering is the throughput. Throughput over the IPSec tunnel is limited by the VPN GW capacity. The VPN GW throughput is less compared to ExpressRoute throughput. In such scenarios, using the IPSec tunnel for high secure traffic and private peering for all other traffic would help optimize the ExpressRoute bandwidth utilization.

#### Site-to-Site VPN as a secure failover path for ExpressRoute
ExpressRoute is offered as redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also as done in our test setup, within a given Azure region, if you want a failover path for your ExpressRoute connectivity, you can do so using Site-to-Site VPN. When the same prefixes are advertised over both ExpressRoute and S2S VPN, Azure prefers ExpressRoute over S2S VPN. To avoid asymmetrical routing between ExpressRoute and S2S VPN, on-premises network configuration should also reciprocate preferring ExpressRoute over S2S VPN connectivity.

For more information regarding how to configure ExpressRoute and Site-to-Site VPN coexisting connections, see [ExpressRoute and Site-to-Site Coexistence][ExR-S2S-CoEx].

### Extending backend connectivity to spoke VNets and branch locations

#### Spoke VNet connectivity using VNet peering

Hub-and-spoke Vnet architecture is widely used. The hub is a virtual network (VNet) in Azure that acts as a central point of connectivity between your spoke VNets and to your on-premises network. The spokes are VNets that peer with the hub and can be used to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For more information about the architecture, see [Hub-and-Spoke Architecture][Hub-n-Spoke]

VNet peering within a region allows spoke VNets to use hub VNet gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

#### Branch VNet connectivity using Site-to-Site VPN

If you want branch Vnets (in different regions) and on-premises networks communicate with each other via a hub vnet, the native Azure solution is site-to-site VPN connectivity using VPN. An alternative option is to use an NVA for routing in the hub.

For configuring VPN gateways, see [Configuring VPN Gateway][VPN]. For deploying highly available NVA, see [Deploy highly available NVA][Deploy-NVA].

## Next steps

For control plane analysis of the test setup and to understand the views of different VNet/VLAN of the topology, see [Control-Plane Analysis][Control-Analysis].

For data plane analysis of the test setup and for Azure network monitoring features views, see [Data-Plane Analysis][Data-Analysis].

To learn how many ExpressRoute circuits you can connect to an ExpressRoute Gateway, or how many ExpressRoute Gateways you can connect to an ExpressRoute circuit, or to learn other scale limits of ExpressRoute, see [ExpressRoute FAQ][ExR-FAQ]


<!--Image References-->
[1]: ./media/backend-interoperability/SpokeVNet_peering.png "Spoke VNet's VNet peering"
[2]: ./media/backend-interoperability/HubVNet-peering.png "Hub VNet's VNet peering"
[3]: ./media/backend-interoperability/BranchVNet-VPNGW.png "VPN GW Configuration of Branch VNet"
[4]: ./media/backend-interoperability/ExR1.png "ExpressRoute1 Configuration"
[5]: ./media/backend-interoperability/ExR1-Hub-Connection.png "Connection configuration of ExpressRoute1 to Hub VNet ExR GW"
[6]: ./media/backend-interoperability/ExR2.png "ExpressRoute2 Configuration"
[7]: ./media/backend-interoperability/ExR2-Hub-Connection.png "Connection configuration of ExpressRoute2 to Hub VNet ExR GW"
[8]: ./media/backend-interoperability/ExR2-Remote-Connection.png "Connection configuration of ExpressRoute2 to Remote VNet ExR GW"

<!--Link References-->
[Setup]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-preface
[ExpressRoute]: https://docs.microsoft.com/azure/expressroute/expressroute-introduction
[VPN]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways
[VNet]: https://docs.microsoft.com/azure/virtual-network/tutorial-connect-virtual-networks-portal
[Configuration]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-configuration
[Control-Analysis]:https://docs.microsoft.com/azure/networking/connectivty-interoperability-control-plane
[Data-Analysis]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-data-plane
[ExR-FAQ]: https://docs.microsoft.com/azure/expressroute/expressroute-faqs
[S2S-Over-ExR]: https://docs.microsoft.com/azure/expressroute/site-to-site-vpn-over-microsoft-peering
[ExR-S2S-CoEx]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager
[Hub-n-Spoke]: https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke
[Deploy-NVA]: https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/nva-ha
[VNet-Config]: https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering




