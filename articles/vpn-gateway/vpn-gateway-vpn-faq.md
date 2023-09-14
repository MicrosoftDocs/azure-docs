---
title: Azure VPN Gateway FAQ
description: Learn about frequently asked questions for VPN Gateway cross-premises connections, hybrid configuration connections, and virtual network gateways. This FAQ contains comprehensive information about point-to-site, site-to-site, and VNet-to-VNet configuration settings.
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 07/28/2023
ms.author: cherylmc
---

# VPN Gateway FAQ

## <a name="connecting"></a>Connecting to virtual networks

### Can I connect virtual networks in different Azure regions?

Yes. There's no region constraint. One virtual network can connect to another virtual network in the same region, or in a different Azure region.

### Can I connect virtual networks in different subscriptions?

Yes.

### Can I specify private DNS servers in my VNet when configuring a VPN gateway?

If you specified a DNS server or servers when you created your VNet, VPN Gateway will use the DNS servers that you specified. If you specify a DNS server, verify that your DNS server can resolve the domain names needed for Azure.

### Can I connect to multiple sites from a single virtual network?

You can connect to multiple sites by using Windows PowerShell and the Azure REST APIs. See the [Multi-Site and VNet-to-VNet Connectivity](#V2VMulti) FAQ section.

### Is there an additional cost for setting up a VPN gateway as active-active?

No. However, costs for any additional public IPs will be charged accordingly. See [IP Address Pricing](https://azure.microsoft.com/pricing/details/ip-addresses/).

### What are my cross-premises connection options?

The following cross-premises virtual network gateway connections are supported:

* **Site-to-site:** VPN connection over IPsec (IKE v1 and IKE v2). This type of connection requires a VPN device or RRAS. For more information, see [Site-to-site](./tutorial-site-to-site-portal.md).
* **Point-to-site:** VPN connection over SSTP (Secure Socket Tunneling Protocol) or IKE v2. This connection doesn't require a VPN device. For more information, see [Point-to-site](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
* **VNet-to-VNet:** This type of connection is the same as a site-to-site configuration. VNet to VNet is a VPN connection over IPsec (IKE v1 and IKE v2). It doesn't require a VPN device. For more information, see [VNet-to-VNet](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md).
* **Multi-Site:** This is a variation of a site-to-site configuration that allows you to connect multiple on-premises sites to a virtual network. For more information, see [Multi-Site](vpn-gateway-howto-multi-site-to-site-resource-manager-portal.md).
* **ExpressRoute:** ExpressRoute is a private connection to Azure from your WAN, not a VPN connection over the public Internet. For more information, see the [ExpressRoute Technical Overview](../expressroute/expressroute-introduction.md) and the [ExpressRoute FAQ](../expressroute/expressroute-faqs.md).

For more information about VPN Gateway connections, see [About VPN Gateway](vpn-gateway-about-vpngateways.md).

### What is the difference between a site-to-site connection and point-to-site?

**Site-to-site** (IPsec/IKE VPN tunnel) configurations are between your on-premises location and Azure. This means that you can connect from any of your computers located on your premises to any virtual machine or role instance within your virtual network, depending on how you choose to configure routing and permissions. It's a great option for an always-available cross-premises connection and is well suited for hybrid configurations. This type of connection relies on an IPsec VPN appliance (hardware device or soft appliance), which must be deployed at the edge of your network. To create this type of connection, you must have an externally facing IPv4 address.

**Point-to-site** (VPN over SSTP) configurations let you connect from a single computer from anywhere to anything located in your virtual network. It uses the Windows in-box VPN client. As part of the point-to-site configuration, you install a certificate and a VPN client configuration package, which contains the settings that allow your computer to connect to any virtual machine or role instance within the virtual network. It's great when you want to connect to a virtual network, but aren't located on-premises. It's also a good option when you don't have access to VPN hardware or an externally facing IPv4 address, both of which are required for a site-to-site connection.

You can configure your virtual network to use both site-to-site and point-to-site concurrently, as long as you create your site-to-site connection using a route-based VPN type for your gateway. Route-based VPN types are called dynamic gateways in the classic deployment model.

## <a name="privacy"></a>Privacy

### Does the VPN service store or process customer data?

No.

## <a name="gateways"></a>Virtual network gateways

### Is a VPN gateway a virtual network gateway?

A VPN gateway is a type of virtual network gateway. A VPN gateway sends encrypted traffic between your virtual network and your on-premises location across a public connection. You can also use a VPN gateway to send traffic between virtual networks. When you create a VPN gateway, you use the -GatewayType value 'Vpn'. For more information, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).

### What is a policy-based (static-routing) gateway?

Policy-based gateways implement policy-based VPNs. Policy-based VPNs encrypt and direct packets through IPsec tunnels based on the combinations of address prefixes between your on-premises network and the Azure VNet. The policy (or Traffic Selector) is usually defined as an access list in the VPN configuration.

### What is a route-based (dynamic-routing) gateway?

Route-based gateways implement the route-based VPNs. Route-based VPNs use "routes" in the IP forwarding or routing table to direct packets into their corresponding tunnel interfaces. The tunnel interfaces then encrypt or decrypt the packets in and out of the tunnels. The policy or traffic selectors for route-based VPNs are configured as any-to-any (or wild cards).

### Can I specify my own policy-based traffic selectors?

Yes, traffic selectors can be defined via the *trafficSelectorPolicies* attribute on a connection via the [New-AzIpsecTrafficSelectorPolicy](/powershell/module/az.network/new-azipsectrafficselectorpolicy) PowerShell command. For the specified traffic selector to take effect, ensure the [Use Policy Based Traffic Selectors](vpn-gateway-connect-multiple-policybased-rm-ps.md#enablepolicybased) option is enabled.

The custom configured traffic selectors will be proposed only when an Azure VPN gateway initiates the connection. A VPN gateway will accept any traffic selectors proposed by a remote gateway (on-premises VPN device). This behavior is consistent between all connection modes (Default, InitiatorOnly, and ResponderOnly).

### Can I update my policy-based VPN gateway to route-based?

No. A gateway type can't be changed from policy-based to route-based, or from route-based to policy-based. To change a gateway type, the gateway must be deleted and recreated. This process takes about 60 minutes. When you create the new gateway, you can't retain the IP address of the original gateway.

1. Delete any connections associated with the gateway.

1. Delete the gateway using one of the following articles:

   * [Azure portal](vpn-gateway-delete-vnet-gateway-portal.md)
   * [Azure PowerShell](vpn-gateway-delete-vnet-gateway-powershell.md)
   * [Azure PowerShell - classic](vpn-gateway-delete-vnet-gateway-classic-powershell.md)
1. Create a new gateway using the gateway type that you want, and then complete the VPN setup. For steps, see the [Site-to-site tutorial](./tutorial-site-to-site-portal.md#VNetGateway).

### Do I need a 'GatewaySubnet'?

Yes. The gateway subnet contains the IP addresses that the virtual network gateway services use. You need to create a gateway subnet for your VNet in order to configure a virtual network gateway. All gateway subnets must be named 'GatewaySubnet' to work properly. Don't name your gateway subnet something else. And don't deploy VMs or anything else to the gateway subnet.

When you create the gateway subnet, you specify the number of IP addresses that the subnet contains. The IP addresses in the gateway subnet are allocated to the gateway service. Some configurations require more IP addresses to be allocated to the gateway services than do others. You want to make sure your gateway subnet contains enough IP addresses to accommodate future growth and possible additional new connection configurations. So, while you can create a gateway subnet as small as /29, we recommend that you create a gateway subnet of /27 or larger (/27, /26, /25 etc.). Look at the requirements for the configuration that you want to create and verify that the gateway subnet you have will meet those requirements.

### Can I deploy Virtual Machines or role instances to my gateway subnet?

No.

### Can I get my VPN gateway IP address before I create it?

Azure Standard SKU public IP resources must use a static allocation method. Therefore, you'll have the public IP address for your VPN gateway as soon as you create the Standard SKU public IP resource you intend to use for it.

### Can I request a static public IP address for my VPN gateway?

We recommend that you use a Standard SKU public IP address for your VPN gateway. Standard SKU public IP address resources use a static allocation method. While we do support dynamic IP address assignment for certain gateway SKUs (gateway SKUS that do not have an *AZ* in the name), we recommend that you use a Standard SKU public IP address going forward for all virtual network gateways. 

For non-zone-redundant and non-zonal gateways (gateway SKUs that do *not* have *AZ* in the name), dynamic IP address assignment is supported, but is being phased out. When you use a dynamic IP address, the IP address doesn't change after it has been assigned to your VPN gateway. The only time the VPN gateway IP address changes is when the gateway is deleted and then re-created. The VPN gateway public IP address doesn't change when you resize, reset, or complete other internal maintenance and upgrades of your VPN gateway.

### How does the retirement of Basic SKU public IP addresses affect my VPN gateways?

We are taking action to ensure the continued operation of deployed VPN gateways that utilize Basic SKU public IP addresses. If you already have VPN gateways with Basic SKU public IP addresses, there is no need for you to take any action.

However, it's important to note that Basic SKU public IP addresses are being phased out. We highly recommend using **Standard SKU** public IP addresses when creating new VPN gateways. Further details on the retirement of Basic SKU public IP addresses can be found [here](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired).

### How does my VPN tunnel get authenticated?

Azure VPN uses PSK (Pre-Shared Key) authentication. We generate a pre-shared key (PSK) when we create the VPN tunnel. You can change the autogenerated PSK to your own with the Set Pre-Shared Key PowerShell cmdlet or REST API.

### Can I use the Set Pre-Shared Key API to configure my policy-based (static routing) gateway VPN?

Yes, the Set Pre-Shared Key API and PowerShell cmdlet can be used to configure both Azure policy-based (static) VPNs and route-based (dynamic) routing VPNs.

### Can I use other authentication options?

We're limited to using pre-shared keys (PSK) for authentication.

### How do I specify which traffic goes through the VPN gateway?

#### Resource Manager deployment model

* PowerShell: use "AddressPrefix" to specify traffic for the local network gateway.
* Azure portal: navigate to the Local network gateway > Configuration > Address space.

#### Classic deployment model

* Azure portal: navigate to the classic virtual network > VPN connections > Site-to-site VPN connections > Local site name > Local site > Client address space.

### Can I use NAT-T on my VPN connections?

Yes, NAT traversal (NAT-T) is supported. Azure VPN Gateway will NOT perform any NAT-like functionality on the inner packets to/from the IPsec tunnels. In this configuration, ensure the on-premises device initiates the IPSec tunnel.

### Can I set up my own VPN server in Azure and use it to connect to my on-premises network?

Yes, you can deploy your own VPN gateways or servers in Azure either from the Azure Marketplace or creating your own VPN routers. You must configure user-defined routes in your virtual network to ensure traffic is routed properly between your on-premises networks and your virtual network subnets.

### <a name="gatewayports"></a>Why are certain ports opened on my virtual network gateway?

They're required for Azure infrastructure communication. They're protected (locked down) by Azure certificates. Without proper certificates, external entities, including the customers of those gateways, won't be able to cause any effect on those endpoints.

A virtual network gateway is fundamentally a multi-homed device with one NIC tapping into the customer private network, and one NIC facing the public network. Azure infrastructure entities can't tap into customer private networks for compliance reasons, so they need to utilize public endpoints for infrastructure communication. The public endpoints are periodically scanned by Azure security audit.

### More information about gateway types, requirements, and throughput

For more information, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).

## <a name="s2s"></a>Site-to-site connections and VPN devices

### What should I consider when selecting a VPN device?

We've validated a set of standard site-to-site VPN devices in partnership with device vendors. A list of known compatible VPN devices, their corresponding configuration instructions or samples, and device specs can be found in the [About VPN devices](vpn-gateway-about-vpn-devices.md) article. All devices in the device families listed as known compatible should work with Virtual Network. To help configure your VPN device, refer to the device configuration sample or link that corresponds to appropriate device family.

### Where can I find VPN device configuration settings?

[!INCLUDE [vpn devices](../../includes/vpn-gateway-configure-vpn-device-rm-include.md)]

### How do I edit VPN device configuration samples?

For information about editing device configuration samples, see [Editing samples](vpn-gateway-about-vpn-devices.md#editing).

### Where do I find IPsec and IKE parameters?

For IPsec/IKE parameters, see [Parameters](vpn-gateway-about-vpn-devices.md#ipsec).

### Why does my policy-based VPN tunnel go down when traffic is idle?

This is expected behavior for policy-based (also known as static routing) VPN gateways. When the traffic over the tunnel is idle for more than 5 minutes, the tunnel will be torn down. When traffic starts flowing in either direction, the tunnel will be reestablished immediately.

### Can I use software VPNs to connect to Azure?

We support Windows Server 2012 Routing and Remote Access (RRAS) servers for site-to-site cross-premises configuration.

Other software VPN solutions should work with our gateway as long as they conform to industry standard IPsec implementations. Contact the vendor of the software for configuration and support instructions.

### Can I connect to a VPN gateway via point-to-site when located at a Site that has an active site-to-site connection?

Yes, but the Public IP address(es) of the point-to-site client need to be different than the Public IP address(es) used by the site-to-site VPN device, or else the point-to-site connection won't work. point-to-site connections with IKEv2 can't be initiated from the same Public IP address(es) where a site-to-site VPN connection is configured on the same Azure VPN gateway.

## <a name="P2S"></a>Point-to-site - Certificate authentication

This section applies to the Resource Manager deployment model.

[!INCLUDE [P2S Azure cert](../../includes/vpn-gateway-faq-p2s-azurecert-include.md)]

## <a name="P2SRADIUS"></a>Point-to-site - RADIUS authentication

This section applies to the Resource Manager deployment model.

[!INCLUDE [vpn-gateway-point-to-site-faq-include](../../includes/vpn-gateway-faq-p2s-radius-include.md)]

## <a name="V2VMulti"></a>VNet-to-VNet and Multi-Site connections

[!INCLUDE [vpn-gateway-vnet-vnet-faq-include](../../includes/vpn-gateway-faq-vnet-vnet-include.md)]

### How do I enable routing between my site-to-site VPN connection and my ExpressRoute?

If you want to enable routing between your branch connected to ExpressRoute and your branch connected to a site-to-site VPN connection, you'll need to set up [Azure Route Server](../route-server/expressroute-vpn-support.md).

### Can I use Azure VPN gateway to transit traffic between my on-premises sites or to another virtual network?

**Resource Manager deployment model**<br>
Yes. See the [BGP](#bgp) section for more information.

**Classic deployment model**<br>
Transit traffic via Azure VPN gateway is possible using the classic deployment model, but relies on statically defined address spaces in the network configuration file. BGP isn't yet supported with Azure Virtual Networks and VPN gateways using the classic deployment model. Without BGP, manually defining transit address spaces is very error prone, and not recommended.

### Does Azure generate the same IPsec/IKE pre-shared key for all my VPN connections for the same virtual network?

No, Azure by default generates different pre-shared keys for different VPN connections. However, you can use the `Set VPN Gateway Key` REST API or PowerShell cmdlet to set the key value you prefer. The key MUST only contain printable ASCII characters except space, hyphen (-) or tilde (~).

### Do I get more bandwidth with more site-to-site VPNs than for a single virtual network?

No, all VPN tunnels, including point-to-site VPNs, share the same Azure VPN gateway and the available bandwidth.

### Can I configure multiple tunnels between my virtual network and my on-premises site using multi-site VPN?

Yes, but you must configure BGP on both tunnels to the same location.

### Does Azure VPN Gateway honor AS Path prepending to influence routing decisions between multiple connections to my on-premises sites?

Yes, Azure VPN gateway will honor AS Path prepending to help make routing decisions when BGP is enabled. A shorter AS Path will be preferred in BGP path selection.

### Can I use the RoutingWeight property when creating a new VPN VirtualNetworkGateway connection?

No, such setting is reserved for ExpressRoute gateway connections. If you want to influence routing decisions between multiple connections, you need to use AS Path prepending.

### Can I use point-to-site VPNs with my virtual network with multiple VPN tunnels?

Yes, point-to-site (P2S) VPNs can be used with the VPN gateways connecting to multiple on-premises sites and other virtual networks.

### Can I connect a virtual network with IPsec VPNs to my ExpressRoute circuit?

Yes, this is supported. For more information, see [Configure ExpressRoute and site-to-site VPN connections that coexist](../expressroute/expressroute-howto-coexist-classic.md).

## <a name="ipsecike"></a>IPsec/IKE policy

[!INCLUDE [vpn-gateway-ipsecikepolicy-faq-include](../../includes/vpn-gateway-faq-ipsecikepolicy-include.md)]

## <a name="bgp"></a>BGP and routing

[!INCLUDE [vpn-gateway-faq-bgp-include](../../includes/vpn-gateway-faq-bgp-include.md)]

### Can I configure forced tunneling?

Yes. See [Configure forced tunneling](vpn-gateway-about-forced-tunneling.md).

## <a name="nat"></a>NAT

[!INCLUDE [vpn-gateway-faq-nat-include](../../includes/vpn-gateway-faq-nat-include.md)]

## <a name="vms"></a>Cross-premises connectivity and VMs

### If my virtual machine is in a virtual network and I have a cross-premises connection, how should I connect to the VM?

You have a few options. If you have RDP enabled for your VM, you can connect to your virtual machine by using the private IP address. In that case, you would specify the private IP address and the port that you want to connect to (typically 3389). You'll need to configure the port on your virtual machine for the traffic.

You can also connect to your virtual machine by private IP address from another virtual machine that's located on the same virtual network. You can't RDP to your virtual machine by using the private IP address if you're connecting from a location outside of your virtual network. For example, if you have a point-to-site virtual network configured and you don't establish a connection from your computer, you can't connect to the virtual machine by private IP address.

### If my virtual machine is in a virtual network with cross-premises connectivity, does all the traffic from my VM go through that connection?

No. Only the traffic that has a destination IP that is contained in the virtual network Local Network IP address ranges that you specified will go through the virtual network gateway. Traffic has a destination IP located within the virtual network stays within the virtual network. Other traffic is sent through the load balancer to the public networks, or if forced tunneling is used, sent through the Azure VPN gateway.

### How do I troubleshoot an RDP connection to a VM

[!INCLUDE [Troubleshoot VM connection](../../includes/vpn-gateway-connect-vm-troubleshoot-include.md)]

## <a name="faq"></a>Virtual Network FAQ

You can view additional virtual network information in the [Virtual Network FAQ](../virtual-network/virtual-networks-faq.md).

## Next steps

* For more information about VPN Gateway, see [About VPN Gateway](vpn-gateway-about-vpngateways.md).
* For more information about VPN Gateway configuration settings, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).

**"OpenVPN" is a trademark of OpenVPN Inc.**
