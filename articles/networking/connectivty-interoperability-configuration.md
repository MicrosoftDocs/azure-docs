---
title: 'Interoperability in Azure back-end connectivity features: Configuration details | Microsoft Docs'
description: This article describes configuration details for the test setup you can use to analyze interoperability between ExpressRoute, a site-to-site VPN, and virtual network peering in Azure.
documentationcenter: na
services: networking
author: rambk
manager: tracsman

ms.service: virtual-network
ms.topic: article
ms.workload: infrastructure-services
ms.date: 10/18/2018
ms.author: rambala

---

# Interoperability in Azure back-end connectivity features: Test configuration details

This article describes the configuration details of the [test setup][Setup]. The test setup helps you analyze how Azure networking services interoperate at the control plane level and data plane level.

## Spoke VNet connectivity by using VNet peering

The following figure shows the Azure Virtual Network peering details of a spoke virtual network (VNet). To learn how to set up peering between two VNets, see [Manage VNet peering][VNet-Config]. If you want the spoke VNet to use the gateways that are connected to the hub VNet, select **Use remote gateways**.

[![1]][1]

The following figure shows the VNet peering details of the hub VNet. If you want the spoke VNet to use the hub VNet gateways, select **Use remote gateways**.

[![2]][2]

## Branch VNet connectivity by using a site-to-site VPN

Set up site-to-site VPN connectivity between the hub and branch VNets by using VPN gateways in Azure VPN Gateway. By default, VPN gateways and Azure ExpressRoute gateways use a private autonomous system number (ASN) value of **65515**. You can change the ASN value in VPN Gateway. In the test setup, the ASN value of the branch VNet VPN gateway is changed to **65516** to support eBGP routing between the hub and branch VNets.


[![3]][3]


## On-premises Location 1 connectivity by using ExpressRoute and a site-to-site VPN

### ExpressRoute 1 configuration details

The following figure shows the Azure Region 1 ExpressRoute circuit configuration toward on-premises Location 1 customer edge (CE) routers:

[![4]][4]

The following figure shows the connection configuration between the ExpressRoute 1 circuit and the hub VNet:

[![5]][5]

The following list shows the primary CE router configuration for ExpressRoute private peering connectivity. (Cisco ASR1000 routers are used as CE routers in the test setup.) When site-to-site VPN and ExpressRoute circuits are configured in parallel to connect an on-premises network to Azure, Azure prioritizes the ExpressRoute circuit by default. To avoid asymmetrical routing, the on-premises network also should prioritize ExpressRoute connectivity over site-to-site VPN connectivity. The following configuration establishes prioritization by using the BGP **local-preference** attribute:

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

### Site-to-site VPN configuration details

The following list shows the primary CE router configuration for site-to-site VPN connectivity:

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

## On-premises Location 2 connectivity by using ExpressRoute

A second ExpressRoute circuit, in closer proximity to on-premises Location 2, connects on-premises Location 2 to the hub VNet. The following figure shows the second ExpressRoute configuration:

[![6]][6]

The following figure shows the connection configuration between the second ExpressRoute circuit and the hub VNet:

[![7]][7]

ExpressRoute 1 connects both the hub VNet and on-premises Location 1 to a remote VNet in a different Azure region:

[![8]][8]

## ExpressRoute and site-to-site VPN connectivity in tandem

###  Site-to-site VPN over ExpressRoute

You can configure a site-to-site VPN by using ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure VNets. With this configuration, you can exchange data with confidentiality, authenticity, and integrity. The data exchange also is anti-replay. For more information about how to configure a site-to-site IPsec VPN in tunnel mode by using ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft peering][S2S-Over-ExR]. 

The primary limitation of configuring a site-to-site VPN that uses Microsoft peering is throughput. Throughput over the IPsec tunnel is limited by the VPN gateway capacity. The VPN gateway throughput is lower than ExpressRoute throughput. In this scenario, using the IPsec tunnel for highly secure traffic and using private peering for all other traffic helps optimize the ExpressRoute bandwidth utilization.

### Site-to-site VPN as a secure failover path for ExpressRoute

ExpressRoute serves as a redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also, as demonstrated in our test setup, within an Azure region, you can use a site-to-site VPN to create a failover path for your ExpressRoute connectivity. When the same prefixes are advertised over both ExpressRoute and a site-to-site VPN, Azure prioritizes ExpressRoute. To avoid asymmetrical routing between ExpressRoute and the site-to-site VPN, on-premises network configuration should also reciprocate by using ExpressRoute connectivity before it uses site-to-site VPN connectivity.

For more information about how to configure coexisting connections for ExpressRoute and a site-to-site VPN, see [ExpressRoute and site-to-site coexistence][ExR-S2S-CoEx].

## Extend back-end connectivity to spoke VNets and branch locations

### Spoke VNet connectivity by using VNet peering

Hub and spoke VNet architecture is widely used. The hub is a VNet in Azure that acts as a central point of connectivity between your spoke VNets and to your on-premises network. The spokes are VNets that peer with the hub, and which you can use to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For more information about the architecture, see [Implement a hub-spoke network topology in Azure][Hub-n-Spoke].

In VNet peering within a region, spoke VNets can use hub VNet gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

### Branch VNet connectivity by using site-to-site VPN

You might want branch VNets, which are in different regions, and on-premises networks to communicate with each other via a hub VNet. The native Azure solution for this configuration is site-to-site VPN connectivity by using a VPN. An alternative is to use a network virtual appliance (NVA) for routing in the hub.

For more information, see [What is VPN Gateway?][VPN] and [Deploy a highly available NVA][Deploy-NVA].

## Next steps

Learn about [control plane analysis][Control-Analysis] of the test setup and the views of different VNets or VLANs in the topology.

Learn about [data plane analysis][Data-Analysis] of the test setup and Azure network monitoring feature views.

See the [ExpressRoute FAQ][ExR-FAQ] to:
-   Learn how many ExpressRoute circuits you can connect to an ExpressRoute gateway.
-   Learn how many ExpressRoute gateways you can connect to an ExpressRoute circuit.
-   Learn about other scale limits of ExpressRoute.


<!--Image References-->
[1]: ./media/backend-interoperability/SpokeVNet_peering.png "Spoke VNet's VNet peering"
[2]: ./media/backend-interoperability/HubVNet-peering.png "Hub VNet's VNet peering"
[3]: ./media/backend-interoperability/BranchVNet-VPNGW.png "VPN Gateway configuration of a branch VNet"
[4]: ./media/backend-interoperability/ExR1.png "ExpressRoute 1 configuration"
[5]: ./media/backend-interoperability/ExR1-Hub-Connection.png "Connection configuration of ExpressRoute 1 to a hub VNet ExR gateway"
[6]: ./media/backend-interoperability/ExR2.png "ExpressRoute 2 configuration"
[7]: ./media/backend-interoperability/ExR2-Hub-Connection.png "Connection configuration of ExpressRoute 2 to a hub VNet ExR gateway"
[8]: ./media/backend-interoperability/ExR2-Remote-Connection.png "Connection configuration of ExpressRoute 2 to a remote VNet ExR gateway"

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


