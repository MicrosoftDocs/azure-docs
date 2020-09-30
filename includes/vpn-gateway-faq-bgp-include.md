---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 09/17/2020
 ms.author: cherylmc
 ms.custom: include file
---
### Is BGP supported on all Azure VPN Gateway SKUs?
BGP is supported on all Azure VPN Gateway SKUs except Basic SKU.

### Can I use BGP with Azure Policy-Based VPN gateways?
No, BGP is supported on Route-Based VPN gateways only.

### What ASN (Autonomous System Numbers) can I use?
You can use your own public ASNs or private ASNs for both your on-premises networks and Azure virtual networks **except** the ranges reserved by Azure or IANA:

> [!IMPORTANT]
>
> The following ASNs are reserved by Azure or IANA:
> * ASNs reserved by Azure:
>    * Public ASNs: 8074, 8075, 12076
>    * Private ASNs: 65515, 65517, 65518, 65519, 65520
> * ASNs [reserved by IANA](http://www.iana.org/assignments/iana-as-numbers-special-registry/iana-as-numbers-special-registry.xhtml)
>    * 23456, 64496-64511, 65535-65551 and 429496729
>
> You cannot specify these ASNs for your on-premises VPN devices when connecting to Azure VPN gateways.
>

### Can I use 32-bit (4-byte) ASNs (Autonomous System Numbers)?
Yes, Azure VPN Gateways now support 32-bit (4-byte) ASNs. Use PowerShell/CLI/SDK to configure using ASN in decimal format.

### What Private ASNs can I use?
The useable range of Private ASNs that can be used are:

* 64512-65514, 65521-65534

These ASNs are not reserved by IANA or Azure for use and therefore can be used to assign to your Azure VPN Gateway.

### What address does Azure VPN gateway use for BGP Peer IP?

* By default the Azure VPN gateway will allocate a single IP address from the GatewaySubnet range for active-standby VPN gateways, or two IP addresses for active-active VPN gateways. These addresses are allocated automatically when you create the VPN gateway. You can get the actual BGP IP address(es) allocated by using PowerShell (Get-AzVirtualNetworkGateway, look for the “bgpPeeringAddress” property), or in the Azure portal (under the “Configure BGP ASN” property on the Gateway Configuration page).

* If your on-premises VPN routers use **APIPA** IP addresses (169.254.x.x) as the BGP IP addresses, you must specify an additional **Azure APIPA BGP IP address** on your Azure VPN gateway. Azure VPN gateway will select the APIPA address to use with the on-premises APIPA BGP peer specified in the local network gateway, or private IP address for non-APIPA on-premises BGP peer. For more information, see [Configure BGP](../articles/vpn-gateway/bgp-howto.md).

### What are the requirements for the BGP Peer IP addresses on my VPN device?
Your on-premises BGP peer address **MUST NOT** be the same as the public IP address of your VPN device or from the VNet address space of the VPN Gateway. Use a different IP address on the VPN device for your BGP Peer IP. It can be an address assigned to the loopback interface on the device, either a regular IP address or an APIPA address. If your device uses APIPA address for BGP, you must specify an APIPA BGP IP address on your Azure VPN gateway as described in [Configure BGP](../articles/vpn-gateway/bgp-howto.md). Specify this address in the corresponding Local Network Gateway representing the location.

### What should I specify as my address prefixes for the Local Network Gateway when I use BGP?

> [!IMPORTANT]
>
>This is a change from the previously documented requirement. If you use BGP for a connection, you should leave the **Address space** field ***empty*** for the corresponding local network gateway resource. Azure VPN gateway will internally add a host route to the on-premises BGP peer IP over the IPsec tunnel. **DO NOT** add the /32 route in the Address space field. It is redundant and if you use an APIPA address as the on-premises VPN device BGP IP, it cannot be added to this field. If you add any other prefixes in the Address space field, they will be added as **static routes** on the Azure VPN gateway, in addition to the routes learned via BGP.
>

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

Note that this will force all VNet egress traffic towards your on-premises site, and will prevent the VNet VMs from accepting public communication from the Internet directly, such RDP or SSH from the Internet to the VMs.

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
Yes, you can establish more than one S2S VPN tunnel between an Azure VPN gateway and your on-premises network. Note that all these tunnels will be counted against the total number of tunnels for your Azure VPN gateways and you must enable BGP on both tunnels.

For example, if you have two redundant tunnels between your Azure VPN gateway and one of your on-premises networks, they will consume 2 tunnels out of the total quota for your Azure VPN gateway.

### Can I have multiple tunnels between two Azure VNets with BGP?
Yes, but at least one of the virtual network gateways must be in active-active configuration.

### Can I use BGP for S2S VPN in an ExpressRoute/S2S VPN coexistence configuration?
Yes. 

### What should I add to my on-premises VPN device for the BGP peering session?
You should add a host route of the Azure BGP Peer IP address on your VPN device pointing to the IPsec S2S VPN tunnel. For example, if the Azure VPN Peer IP is "10.12.255.30", you should add a host route for "10.12.255.30" with a nexthop interface of the matching IPsec tunnel interface on your VPN device.
