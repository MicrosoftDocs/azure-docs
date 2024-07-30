---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/18/2023
 ms.author: cherylmc

---
The VNet-to-VNet information in this section applies to VPN gateway connections. For information about VNet peering, see [Virtual network peering](../articles/virtual-network/virtual-network-peering-overview.md).

### Does Azure charge for traffic between VNets?

VNet-to-VNet traffic within the same region is free for both directions when you use a VPN gateway connection. Cross-region VNet-to-VNet egress traffic is charged with the outbound inter-VNet data transfer rates based on the source regions. For more information, see [Azure VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/). If you're connecting your VNets by using VNet peering instead of a VPN gateway, see [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).

### Does VNet-to-VNet traffic travel across the internet?

No. VNet-to-VNet traffic travels across the Microsoft Azure backbone, not the internet.

<a name='can-i-establish-a-vnet-to-vnet-connection-across-azure-active-directory-tenants'></a>

### Can I establish a VNet-to-VNet connection across Microsoft Entra tenants?

Yes. VNet-to-VNet connections that use VPN gateways work across Microsoft Entra tenants.

### Is VNet-to-VNet traffic secure?

IPsec and IKE encryption help protect VNet-to-VNet traffic.

### Do I need a VPN device to connect VNets together?

No. Connecting multiple Azure virtual networks together doesn't require a VPN device unless you need cross-premises connectivity.

### Do my VNets need to be in the same region?

No. The virtual networks can be in the same or different Azure regions (locations).

### If VNets aren't in the same subscription, do the subscriptions need to be associated with the same Microsoft Entra tenant?

No.

### Can I use VNet-to-VNet to connect virtual networks in separate Azure instances?

No. VNet-to-VNet supports connecting virtual networks within the same Azure instance. For example, you can't create a connection between global Azure and Chinese, German, or US government Azure instances. Consider using a site-to-site VPN connection for these scenarios.

### Can I use VNet-to-VNet along with multi-site connections?

Yes. You can use virtual network connectivity simultaneously with multi-site VPNs.

### How many on-premises sites and virtual networks can one virtual network connect to?

See the [gateway requirements](../articles/vpn-gateway/about-gateway-skus.md#benchmark) table.

### Can I use VNet-to-VNet to connect VMs or cloud services outside a VNet?

No. VNet-to-VNet supports connecting virtual networks. It doesn't support connecting virtual machines or cloud services that aren't in a virtual network.

### Can a cloud service or a load-balancing endpoint span VNets?

No. A cloud service or a load-balancing endpoint can't span virtual networks, even if they're connected together.

### Can I use a policy-based VPN type for VNet-to-VNet or multi-site connections?

No. VNet-to-VNet and multi-site connections require VPN gateways with route-based (previously called *dynamic routing*) VPN types.

### Can I connect a VNet with a route-based VPN type to another VNet with a policy-based VPN type?

No. Both virtual networks must use route-based (previously called *dynamic routing*) VPNs.

### Do VPN tunnels share bandwidth?

Yes. All VPN tunnels of the virtual network share the available bandwidth on the VPN gateway and the same service-level agreement for VPN gateway uptime in Azure.

### Are redundant tunnels supported?

Redundant tunnels between a pair of virtual networks are supported when one virtual network gateway is configured as active-active.

### Can I have overlapping address spaces for VNet-to-VNet configurations?

No. You can't have overlapping IP address ranges.

### Can there be overlapping address spaces among connected virtual networks and on-premises local sites?

No. You can't have overlapping IP address ranges.
