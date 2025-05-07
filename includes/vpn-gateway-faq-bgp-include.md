---
 title: Include file
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.date: 10/18/2023
 ms.author: cherylmc
---
### Is BGP supported on all Azure VPN Gateway SKUs?

BGP is supported on all Azure VPN Gateway SKUs except the Basic SKU.

### Can I use BGP with Azure Policy VPN gateways?

No, BGP is supported on route-based VPN gateways only.

### What ASNs can I use?

You can use your own public Autonomous System Numbers (ASNs) or private ASNs for both your on-premises networks and Azure virtual networks.

You can't use the following reserved ASNs:

* Reserved by Azure:

  * Public ASNs: 8074, 8075, 12076
  * Private ASNs: 65515, 65517, 65518, 65519, 65520
* [Reserved by IANA](http://www.iana.org/assignments/iana-as-numbers-special-registry/iana-as-numbers-special-registry.xhtml):

  * 23456, 64496-64511, 65535-65551, 429496729

You can't specify these ASNs for your on-premises VPN devices when you're connecting to VPN gateways.

### Can I use 32-bit (4-byte) ASNs?

Yes, Azure VPN Gateway now supports 32-bit (4-byte) ASNs. To configure by using ASN in decimal format, use Azure PowerShell, the Azure CLI, or the Azure SDK.

### What private ASNs can I use?

The useable ranges of private ASNs are:

* 64512-65514 and 65521-65534

Neither IANA nor Azure reserves these ASNs, so you can assign them to your VPN gateway.

### What address does Azure VPN Gateway use for BGP peer IP?

By default, Azure VPN Gateway allocates a single IP address from the `GatewaySubnet` range for active-standby VPN gateways, or two IP addresses for active-active VPN gateways. These addresses are allocated automatically when you create the VPN gateway.

You can find the allocated BGP IP address by using Azure PowerShell or the Azure portal. In PowerShell, use `Get-AzVirtualNetworkGateway`, and look for the `bgpPeeringAddress` property. In the Azure portal, on the **Gateway Configuration** page, look under the **Configure BGP ASN** property.

If your on-premises VPN routers use Automatic Private IP Addressing (APIPA) IP addresses (169.254.x.x) as the BGP IP addresses, you must specify one or more Azure APIPA BGP IP addresses on your VPN gateway. Azure VPN Gateway selects the APIPA addresses to use with the on-premises APIPA BGP peer specified in the local network gateway, or the private IP address for a non-APIPA, on-premises BGP peer. For more information, see [Configure BGP for Azure VPN Gateway](../articles/vpn-gateway/bgp-howto.md).

### What are the requirements for the BGP peer IP addresses on my VPN device?

Your on-premises BGP peer address must not be the same as the public IP address of your VPN device or from the VNet address space of the VPN gateway. Use a different IP address on the VPN device for your BGP peer IP. It can be an address assigned to the loopback interface on the device (either a regular IP address or an APIPA address).

If your device uses an APIPA address for BGP, you must specify one or more APIPA BGP IP addresses on your VPN gateway, as described in [Configure BGP for Azure VPN Gateway](../articles/vpn-gateway/bgp-howto.md). Specify these addresses in the corresponding local network gateway that represents the location.

### What should I specify as my address prefixes for the local network gateway when I use BGP?

> [!IMPORTANT]
> This is a change from the previously documented requirement.

Azure VPN Gateway adds a host route internally to the on-premises BGP peer IP over the IPsec tunnel. Don't add the /32 route in the **Address space** field, because it's redundant. If you use an APIPA address as the on-premises VPN device BGP IP, you can't add it to this field.

If you add any other prefixes in the **Address space** field, they're added as static routes on the Azure VPN gateway, in addition to the routes learned via BGP.

### Can I use the same ASN for both on-premises VPN networks and Azure virtual networks?

No. You must assign different ASNs between your on-premises networks and your Azure virtual networks if you're connecting them together with BGP.

Azure VPN gateways have a default ASN of 65515 assigned, whether BGP is enabled or not for your cross-premises connectivity. You can override this default by assigning a different ASN when you're creating the VPN gateway, or you can change the ASN after the gateway is created. You need to assign your on-premises ASNs to the corresponding Azure local network gateways.

### What address prefixes do Azure VPN gateways advertise to me?

The gateways advertise the following routes to your on-premises BGP devices:

* Your VNet address prefixes
* Address prefixes for each local network gateway connected to the VPN gateway
* Routes learned from other BGP peering sessions connected to the VPN gateway, except for the default route or routes that overlap with any virtual network prefix

### How many prefixes can I advertise to Azure VPN Gateway?

Azure VPN Gateway supports up to 4,000 prefixes. The BGP session is dropped if the number of prefixes exceeds the limit.

### Can I advertise the default route (0.0.0.0/0) to VPN gateways?

Yes. Keep in mind that advertising the default route forces all VNet egress traffic toward your on-premises site. It also prevents the virtual network VMs from accepting public communication from the internet directly, such as Remote Desktop Protocol (RDP) or Secure Shell (SSH) from the internet to the VMs.

### <a name="advertise-exact-prefixes"></a>In site-to-site tunnel setups, can I advertise the exact prefixes as my virtual network prefixes?

The ability to advertise exact prefixes depends on whether gateway transit is enabled or not enabled.

*	**When gateway transit is enabled:** You cannot advertise the exact prefixes as your virtual network (including peered virtual networks) prefixes. Azure blocks or filters the advertisement of any prefixes that match your virtual network address prefixes. However, you can advertise a prefix that is a superset of your virtual network's address space. For example, if your virtual network uses the address space 10.0.0.0/16, you can advertise 10.0.0.0/8, but not 10.0.0.0/16 or 10.0.0.0/24.
*	**When gateway transit is not enabled:** The gateway does not learn peered virtual network prefixes, allowing you to advertise the exact prefixes as your peered virtual network.

### Can I use BGP with my connections between virtual networks?

Yes. You can use BGP for both cross-premises connections and connections between virtual networks.

### Can I mix BGP with non-BGP connections for my Azure VPN gateways?

Yes, you can mix both BGP and non-BGP connections for the same Azure VPN gateway.

### Does Azure VPN Gateway support BGP transit routing?

Yes. BGP transit routing is supported, with the exception that VPN gateways don't advertise default routes to other BGP peers. To enable transit routing across multiple VPN gateways, you must enable BGP on all intermediate connections between virtual networks. For more information, see [About BGP and VPN Gateway](../articles/vpn-gateway/vpn-gateway-bgp-overview.md).

### Can I have more than one tunnel between a VPN gateway and my on-premises network?

Yes, you can establish more than one site-to-site VPN tunnel between a VPN gateway and your on-premises network. All these tunnels are counted against the total number of tunnels for your Azure VPN gateways, and you must enable BGP on both tunnels.

For example, if you have two redundant tunnels between your VPN gateway and one of your on-premises networks, they consume two tunnels out of the total quota for your VPN gateway.

### Can I have multiple tunnels between two Azure virtual networks with BGP?

Yes, but at least one of the virtual network gateways must be in an active-active configuration.

### Can I use BGP for an S2S VPN in an Azure ExpressRoute and S2S VPN coexistence configuration?

Yes.

### What should I add to my on-premises VPN device for the BGP peering session?

Add a host route of the Azure BGP peer IP address on your VPN device. This route points to the IPsec S2S VPN tunnel.

For example, if the Azure VPN peer IP is 10.12.255.30, you add a host route for 10.12.255.30 with a next-hop interface of the matching IPsec tunnel interface on your VPN device.

### Does the virtual network gateway support BFD for S2S connections with BGP?

No. Bidirectional Forwarding Detection (BFD) is a protocol that you can use with BGP to detect neighbor downtime more quickly than you can by using standard BGP keepalive intervals. BFD uses subsecond timers designed to work in LAN environments, but not across the public internet or WAN connections.

For connections over the public internet, having certain packets delayed or even dropped isn't unusual, so introducing these aggressive timers can add instability. This instability might cause BGP to dampen routes.

As an alternative, you can configure your on-premises device with timers lower than the default 60-second keepalive interval or lower than the 180-second hold timer. This configuration results in a quicker convergence time. However, timers below the default 60-second keepalive interval or below the default 180-second hold timer aren't reliable. We recommend that you keep timers at or above the default values.

### Do VPN gateways initiate BGP peering sessions or connections?

VPN gateways initiate BGP peering sessions to the on-premises BGP peer IP addresses specified in the local network gateway resources by using the private IP addresses on the VPN gateways. This process is irrespective of whether the on-premises BGP IP addresses are in the APIPA range or are regular private IP addresses. If your on-premises VPN devices use APIPA addresses as the BGP IP, you need to configure your BGP speaker to initiate the connections.
