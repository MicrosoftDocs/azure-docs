---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 02/12/2019
 ms.author: cherylmc
 ms.custom: include file
---
### Is BGP supported on all Azure VPN Gateway SKUs?
No, BGP is supported on Azure **VpnGw1**, **VpnGw2**, **VpnGw3**, **Standard** and **HighPerformance** VPN gateways. **Basic** SKU is NOT supported.

### Can I use BGP with Azure Policy-Based VPN gateways?
No, BGP is supported on Route-Based VPN gateways only.

### Can I use private ASNs (Autonomous System Numbers)?
Yes, you can use your own public ASNs or private ASNs for both your on-premises networks and Azure virtual networks.

### Can I use 32-bit ASNs (Autonomous System Numbers)?
No, the Azure VPN Gateways support 16-Bit ASNs today.

### Are there ASNs reserved by Azure?
Yes, the following ASNs are reserved by Azure for both internal and external peerings:

* Public ASNs: 8074, 8075, 12076
* Private ASNs: 65515, 65517, 65518, 65519, 65520

You cannot specify these ASNs for your on premises VPN devices when connecting to Azure VPN gateways.

### Are there any other ASNs that I can't use?
Yes, the following ASNs are [reserved by IANA](http://www.iana.org/assignments/iana-as-numbers-special-registry/iana-as-numbers-special-registry.xhtml) and can't be configured on your Azure VPN Gateway:

23456, 64496-64511, 65535-65551 and 429496729

### Can I use the same ASN for both on-premises VPN networks and Azure VNets?
No, you must assign different ASNs between your on-premises networks and your Azure VNets if you are connecting them together with BGP. Azure VPN Gateways have a default ASN of 65515 assigned, whether BGP is enabled or not for your cross-premises connectivity. You can override this default by assigning a different ASN when creating the VPN gateway, or change the ASN after the gateway is created. You will need to assign your on-premises ASNs to the corresponding Azure Local Network Gateways.

### What address prefixes will Azure VPN gateways advertise to me?
Azure VPN gateway will advertise the following routes to your on-premises BGP devices:

* Your VNet address prefixes
* Address prefixes for each Local Network Gateways connected to the Azure VPN gateway
* Routes learned from other BGP peering sessions connected to the Azure VPN gateway, **except default route or routes overlapped with any VNet prefix**.

### How many prefixes can I advertise to Azure VPN gateway?
We support up to 4000 prefixes. The BGP session is dropped if the number of prefixes exceeds the limit.

### Can I advertise default route (0.0.0.0/0) to Azure VPN gateways?
Yes.

Please note this will force all VNet egress traffic towards your on-premises site, and will prevent the VNet VMs from accepting public communication from the Internet directly, such RDP or SSH from the Internet to the VMs.

### Can I advertise the exact prefixes as my Virtual Network prefixes?

No, advertising the same prefixes as any one of your Virtual Network address prefixes will be blocked or filtered by the Azure platform. However you can advertise a prefix that is a superset of what you have inside your Virtual Network. 

For example, if your virtual network used the address space 10.0.0.0/16, you could advertise 10.0.0.0/8. But you cannot advertise 10.0.0.0/16 or 10.0.0.0/24.

### Can I use BGP with my VNet-to-VNet connections?
Yes, you can use BGP for both cross-premises connections and VNet-to-VNet connections.

### Can I mix BGP with non-BGP connections for my Azure VPN gateways?
Yes, you can mix both BGP and non-BGP connections for the same Azure VPN gateway.

### Does Azure VPN gateway support BGP transit routing?
Yes, BGP transit routing is supported, with the exception that Azure VPN gateways will **NOT** advertise default routes to other BGP peers. To enable transit routing across multiple Azure VPN gateways, you must enable BGP on all intermediate VNet-to-VNet connections. For more information, see [About BGP](../articles/vpn-gateway/vpn-gateway-bgp-overview.md).

### Can I have more than one tunnel between Azure VPN gateway and my on-premises network?
Yes, you can establish more than one S2S VPN tunnel between an Azure VPN gateway and your on-premises network. Please note that all these tunnels will be counted against the total number of tunnels for your Azure VPN gateways and you must enable BGP on both tunnels.

For example, if you have two redundant tunnels between your Azure VPN gateway and one of your on-premises networks, they will consume 2 tunnels out of the total quota for your Azure VPN gateway (10 for Standard and 30 for HighPerformance).

### Can I have multiple tunnels between two Azure VNets with BGP?
Yes, but at least one of the virtual network gateways must be in active-active configuration.

### Can I use BGP for S2S VPN in an ExpressRoute/S2S VPN co-existence configuration?
Yes. 

### What address does Azure VPN gateway use for BGP Peer IP?
The Azure VPN gateway will allocate a single IP address from the GatewaySubnet range for active-standby VPN gateways, or two IP addresses for active-active VPN gateways. You can get the actual BGP IP address(es) allocated by using PowerShell (Get-AzVirtualNetworkGateway, look for the “bgpPeeringAddress” property), or in the Azure portal (under the “Configure BGP ASN” property on the Gateway Configuration page).

### What are the requirements for the BGP Peer IP addresses on my VPN device?
Your on-premises BGP peer address **MUST NOT** be the same as the public IP address of your VPN device. Use a different IP address on the VPN device for your BGP Peer IP. It can be an address assigned to the loopback interface on the device, but please note that it cannot be an APIPA (169.254.x.x) address. Specify this address in the corresponding Local Network Gateway representing the location.

### What should I specify as my address prefixes for the Local Network Gateway when I use BGP?
Azure Local Network Gateway specifies the initial address prefixes for the on-premises network. With BGP, you must allocate the host prefix (/32 prefix) of your BGP Peer IP address as the address space for that on-premises network. If your BGP Peer IP is 10.52.255.254, you should specify "10.52.255.254/32" as the localNetworkAddressSpace of the Local Network Gateway representing this on-premises network. This is to ensure that the Azure VPN gateway establishes the BGP session through the S2S VPN tunnel.

### What should I add to my on-premises VPN device for the BGP peering session?
You should add a host route of the Azure BGP Peer IP address on your VPN device pointing to the IPsec S2S VPN tunnel. For example, if the Azure VPN Peer IP is "10.12.255.30", you should add a host route for "10.12.255.30" with a nexthop interface of the matching IPsec tunnel interface on your VPN device.
