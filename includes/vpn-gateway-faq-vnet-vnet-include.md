---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/22/2022
 ms.author: cherylmc

---
The VNet-to-VNet FAQ applies to VPN gateway connections. For information about VNet peering, see [Virtual network peering](../articles/virtual-network/virtual-network-peering-overview.md).

### Does Azure charge for traffic between VNets?

VNet-to-VNet traffic within the same region is free for both directions when you use a VPN gateway connection. Cross-region VNet-to-VNet egress traffic is charged with the outbound inter-VNet data transfer rates based on the source regions. For more information, see [VPN Gateway pricing page](https://azure.microsoft.com/pricing/details/vpn-gateway/). If you're connecting your VNets by using VNet peering instead of a VPN gateway, see [Virtual network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).

### Does VNet-to-VNet traffic travel across the internet?

No. VNet-to-VNet traffic travels across the Microsoft Azure backbone, not the internet.

<a name='can-i-establish-a-vnet-to-vnet-connection-across-azure-active-directory-tenants'></a>

### Can I establish a VNet-to-VNet connection across Microsoft Entra tenants?

Yes, VNet-to-VNet connections that use Azure VPN gateways work across Microsoft Entra tenants.

### Is VNet-to-VNet traffic secure?

Yes, it's protected by IPsec/IKE encryption.

### Do I need a VPN device to connect VNets together?

No. Connecting multiple Azure virtual networks together doesn't require a VPN device unless cross-premises connectivity is required.

### Do my VNets need to be in the same region?

No. The virtual networks can be in the same or different Azure regions (locations).

### If the VNets aren't in the same subscription, do the subscriptions need to be associated with the same Active Directory tenant?

No.

### Can I use VNet-to-VNet to connect virtual networks in separate Azure instances?

No. VNet-to-VNet supports connecting virtual networks within the same Azure instance. For example, you can’t create  a connection between global Azure and Chinese/German/US government Azure instances. Consider using a Site-to-Site VPN connection for these scenarios.

### Can I use VNet-to-VNet along with multi-site connections?

Yes. Virtual network connectivity can be used simultaneously with multi-site VPNs.

### How many on-premises sites and virtual networks can one virtual network connect to?

See the [Gateway requirements](../articles/vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#benchmark) table.

### Can I use VNet-to-VNet to connect VMs or cloud services outside of a VNet?

No. VNet-to-VNet supports connecting virtual networks. It doesn't support connecting virtual machines or cloud services that aren't in a virtual network.

### Can a cloud service or a load-balancing endpoint span VNets?

No. A cloud service or a load-balancing endpoint can't span across virtual networks, even if they're connected together.

### Can I use a PolicyBased VPN type for VNet-to-VNet or Multi-Site connections?

No. VNet-to-VNet and Multi-Site connections require Azure VPN gateways with RouteBased (previously called dynamic routing) VPN types.

### Can I connect a VNet with a RouteBased VPN Type to another VNet with a PolicyBased VPN type?

No, both virtual networks MUST use route-based (previously called dynamic routing) VPNs.

### Do VPN tunnels share bandwidth?

Yes. All VPN tunnels of the virtual network share the available bandwidth on the Azure VPN gateway and the same VPN gateway uptime SLA in Azure.

### Are redundant tunnels supported?

Redundant tunnels between a pair of virtual networks are supported when one virtual network gateway is configured as active-active.

### Can I have overlapping address spaces for VNet-to-VNet configurations?

No. You can't have overlapping IP address ranges.

### Can there be overlapping address spaces among connected virtual networks and on-premises local sites?

No. You can't have overlapping IP address ranges.
