---
 title: include file
 author: cherylmc
 ms.service: vpn-gateway
 ms.date: 10/18/2023
 ms.author: cherylmc
---
### Is BGP supported on all Azure VPN Gateway SKUs?

BGP is supported on all Azure VPN Gateway SKUs except Basic SKU.

### Can I use BGP with Azure Policy VPN gateways?

No, BGP is supported on route-based VPN gateways only.

### What ASNs (Autonomous System Numbers) can I use?

You can use your own public ASNs or private ASNs for both your on-premises networks and Azure virtual networks. You can't use the ranges reserved by Azure or IANA.

The following ASNs are reserved by Azure or IANA:

* ASNs reserved by Azure:

  * Public ASNs: 8074, 8075, 12076
  * Private ASNs: 65515, 65517, 65518, 65519, 65520
* ASNs [reserved by IANA](http://www.iana.org/assignments/iana-as-numbers-special-registry/iana-as-numbers-special-registry.xhtml):

  * 23456, 64496-64511, 65535-65551 and 429496729

You can't specify these ASNs for your on-premises VPN devices when you're connecting to Azure VPN gateways.

### Can I use 32-bit (4-byte) ASNs?

Yes, VPN Gateway now supports 32-bit (4-byte) ASNs. To configure by using ASN in decimal format, use PowerShell, the Azure CLI, or the Azure SDK.

### What private ASNs can I use?

The useable ranges of private ASNs are:

* 64512-65514 and 65521-65534

These ASNs aren't reserved by IANA or Azure for use, and therefore can be used to assign to your Azure VPN gateway.

### What address does VPN Gateway use for BGP peer IP?

By default, VPN Gateway allocates a single IP address from the *GatewaySubnet* range for active-standby VPN gateways, or two IP addresses for active-active VPN gateways. These addresses are allocated automatically when you create the VPN gateway. You can get the actual BGP IP address allocated by using PowerShell or by locating it in the Azure portal. In PowerShell, use **Get-AzVirtualNetworkGateway**, and look for the **bgpPeeringAddress** property. In the Azure portal, on the **Gateway Configuration** page, look under the **Configure BGP ASN** property.

If your on-premises VPN routers use **APIPA** IP addresses (169.254.x.x) as the BGP IP addresses, you must specify one or more **Azure APIPA BGP IP addresses** on your Azure VPN gateway. Azure VPN Gateway selects the APIPA addresses to use with the on-premises APIPA BGP peer specified in the local network gateway, or the private IP address for a non-APIPA, on-premises BGP peer. For more information, see [Configure BGP](../articles/vpn-gateway/bgp-howto.md).

### What are the requirements for the BGP peer IP addresses on my VPN device?

Your on-premises BGP peer address must not be the same as the public IP address of your VPN device or from the virtual network address space of the VPN gateway. Use a different IP address on the VPN device for your BGP peer IP. It can be an address assigned to the loopback interface on the device (either a regular IP address or an APIPA address). If your device uses an APIPA address for BGP, you must specify one or more APIPA BGP IP addresses on your Azure VPN gateway, as described in [Configure BGP](../articles/vpn-gateway/bgp-howto.md). Specify these addresses in the corresponding local network gateway representing the location.

### What should I specify as my address prefixes for the local network gateway when I use BGP?

> [!IMPORTANT]
>
>This is a change from the previously documented requirement. If you use BGP for a connection, leave the **Address space** field empty for the corresponding local network gateway resource. Azure VPN Gateway adds a host route internally to the on-premises BGP peer IP over the IPsec tunnel. Don't add the /32 route in the **Address space** field. It's redundant and if you use an APIPA address as the on-premises VPN device BGP IP, it can't be added to this field. If you add any other prefixes in the **Address space** field, they are added as static routes on the Azure VPN gateway, in addition to the routes learned via BGP.
>

### Can I use the same ASN for both on-premises VPN networks and Azure virtual networks?

No, you must assign different ASNs between your on-premises networks and your Azure virtual networks if you're connecting them together with BGP. Azure VPN gateways have a default ASN of 65515 assigned, whether BGP is enabled or not for your cross-premises connectivity. You can override this default by assigning a different ASN when you're creating the VPN gateway, or you can change the ASN after the gateway is created. You'll need to assign your on-premises ASNs to the corresponding Azure local network gateways.

### What address prefixes will Azure VPN gateways advertise to me?

The gateways advertise the following routes to your on-premises BGP devices:

* Your virtual network address prefixes.
* Address prefixes for each local network gateway connected to the Azure VPN gateway.
* Routes learned from other BGP peering sessions connected to the Azure VPN gateway, except for the default route or routes that overlap with any virtual network prefix.

### How many prefixes can I advertise to Azure VPN Gateway?

Azure VPN Gateway supports up to 4000 prefixes. The BGP session is dropped if the number of prefixes exceeds the limit.

### Can I advertise default route (0.0.0.0/0) to Azure VPN gateways?

Yes. Note that this forces all virtual network egress traffic towards your on-premises site. It also prevents the virtual network VMs from accepting public communication from the internet directly, such RDP or SSH from the internet to the VMs.

### Can I advertise the exact prefixes as my virtual network prefixes?

No, advertising the same prefixes as any one of your virtual network address prefixes will be blocked or filtered by Azure. You can, however, advertise a prefix that is a superset of what you have inside your virtual network. 

For example, if your virtual network used the address space 10.0.0.0/16, you can advertise 10.0.0.0/8. But you can't advertise 10.0.0.0/16 or 10.0.0.0/24.

### Can I use BGP with my connections between virtual networks?

Yes, you can use BGP for both cross-premises connections and connections between virtual networks.

### Can I mix BGP with non-BGP connections for my Azure VPN gateways?

Yes, you can mix both BGP and non-BGP connections for the same Azure VPN gateway.

### Does Azure VPN Gateway support BGP transit routing?

Yes, BGP transit routing is supported, with the exception that Azure VPN gateways don't advertise default routes to other BGP peers. To enable transit routing across multiple Azure VPN gateways, you must enable BGP on all intermediate connections between virtual networks. For more information, see [About BGP](../articles/vpn-gateway/vpn-gateway-bgp-overview.md).

### Can I have more than one tunnel between an Azure VPN gateway and my on-premises network?

Yes, you can establish more than one site-to-site (S2S) VPN tunnel between an Azure VPN gateway and your on-premises network. Note that all these tunnels are counted against the total number of tunnels for your Azure VPN gateways, and you must enable BGP on both tunnels.

For example, if you have two redundant tunnels between your Azure VPN gateway and one of your on-premises networks, they consume 2 tunnels out of the total quota for your Azure VPN gateway.

### Can I have multiple tunnels between two Azure virtual networks with BGP?

Yes, but at least one of the virtual network gateways must be in active-active configuration.

### Can I use BGP for S2S VPN in an Azure ExpressRoute and S2S VPN coexistence configuration?

Yes.

### What should I add to my on-premises VPN device for the BGP peering session?

Add a host route of the Azure BGP peer IP address on your VPN device. This route points to the IPsec S2S VPN tunnel. For example, if the Azure VPN peer IP is 10.12.255.30, you add a host route for 10.12.255.30 with a next-hop interface of the matching IPsec tunnel interface on your VPN device.

### Does the virtual network gateway support BFD for S2S connections with BGP?

No. Bidirectional Forwarding Detection (BFD) is a protocol that you can use with BGP to detect neighbor downtime quicker than you can by using standard BGP "keepalives." BFD uses subsecond timers designed to work in LAN environments, but not across the public internet or Wide Area Network connections.

For connections over the public internet, having certain packets delayed or even dropped isn't unusual, so introducing these aggressive timers can add instability. This instability might cause routes to be dampened by BGP. As an alternative, you can configure your on-premises device with timers lower than the default, 60-second "keepalive" interval, and the 180-second hold timer. This results in a quicker convergence time. However, timers below the default 60-second "keepalive" interval or below the default 180-second hold timer aren't reliable. It's recommended to keep timers at or above the default values.

### Do Azure VPN gateways initiate BGP peering sessions or connections?

The gateway initiates BGP peering sessions to the on-premises BGP peer IP addresses specified in the local network gateway resources using the private IP addresses on the VPN gateways. This is irrespective of whether the on-premises BGP IP addresses are in the APIPA range or regular private IP addresses. If your on-premises VPN devices use APIPA addresses as BGP IP, you need to configure your BGP speaker to initiate the connections.
