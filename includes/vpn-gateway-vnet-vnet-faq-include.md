The VNet-to-VNet FAQ applies to VPN Gateway connections. If you are looking for VNet Peering, see [Virtual Network Peering](../articles/virtual-network/virtual-network-peering-overview.md)

### Does Azure charge for traffic between VNets?

VNet-to-VNet traffic within the same region is free for both directions when using a VPN gateway connection. Cross region VNet-to-VNet egress traffic is charged with the outbound inter-VNet data transfer rates based on the source regions. Refer to the [VPN Gateway pricing page](https://azure.microsoft.com/pricing/details/vpn-gateway/) for details. If you are connecting your VNets using VNet Peering, rather than VPN Gateway, see the [Virtual Network pricing page](https://azure.microsoft.com/pricing/details/virtual-network/).

### Does VNet-to-VNet traffic travel across the Internet?

No. VNet-to-VNet traffic travels across the Microsoft Azure backbone, not the Internet.

### Is VNet-to-VNet traffic secure?

Yes, it is protected by IPsec/IKE encryption.

### Do I need a VPN device to connect VNets together?

No. Connecting multiple Azure virtual networks together doesn't require a VPN device unless cross-premises connectivity is required.

### Do my VNets need to be in the same region?

No. The virtual networks can be in the same or different Azure regions (locations).

### If the VNets are not in the same subscription, do the subscriptions need to be associated with the same AD tenant?

No.

### Can I use VNet-to-VNet along with multi-site connections?

Yes. Virtual network connectivity can be used simultaneously with multi-site VPNs.

### How many on-premises sites and virtual networks can one virtual network connect to?

See [Gateway requirements](../articles/vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#requirements) table.

### Can I use VNet-to-VNet to connect VMs or cloud services outside of a VNet?

No. VNet-to-VNet supports connecting virtual networks. It does not support connecting virtual machines or cloud services that are not in a virtual network.

### Can a cloud service or a load balancing endpoint span VNets?

No. A cloud service or a load balancing endpoint can't span across virtual networks, even if they are connected together.

### Can I used a PolicyBased VPN type for VNet-to-VNet or Multi-Site connections?

No. VNet-to-VNet and Multi-Site connections require Azure VPN gateways with RouteBased (previously called Dynamic Routing) VPN types.

### Can I connect a VNet with a RouteBased VPN Type to another VNet with a PolicyBased VPN type?

No, both virtual networks MUST be using route-based (previously called Dynamic Routing) VPNs.

### Do VPN tunnels share bandwidth?

Yes. All VPN tunnels of the virtual network share the available bandwidth on the Azure VPN gateway and the same VPN gateway uptime SLA in Azure.

### Are redundant tunnels supported?

Redundant tunnels between a pair of virtual networks are supported when one virtual network gateway is configured as active-active.

### Can I have overlapping address spaces for VNet-to-VNet configurations?

No. You can't have overlapping IP address ranges.

### Can there be overlapping address spaces among connected virtual networks and on-premises local sites?

No. You can't have overlapping IP address ranges.



