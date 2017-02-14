###Does Azure charge for traffic between VNets?
VNet-to-VNet traffic within the same region is free for both directions. Cross region VNet-to-VNet egress traffic is charged with the outbound inter-VNet data transfer rates based on the source regions. Please refer to the [pricing page](https://azure.microsoft.com/pricing/details/vpn-gateway/) for details.

###Does VNet-to-VNet traffic travel across the Internet?
No. VNet-to-VNet traffic travels across the Microsoft Azure backbone, not the Internet.

### Is VNet-to-VNet traffic secure?
Yes, it is protected by IPsec/IKE encryption.

###Do my VNets need to be in the same region?
No. The virtual networks can be in the same or different Azure regions (locations).

###Can a cloud service or a load balancing endpoint span VNets?
No. A cloud service or a load balancing endpoint CANNOT span across virtual networks, even if they are connected together.

###Do I need a VPN device to connect VNets together?
No. Connecting multiple Azure virtual networks together doesn't require a VPN device unless cross-premises connectivity is required.

###Can I use VNet-to-VNet to connect VMs or cloud services outside of a VNet?
No. VNet-to-VNet supports connecting virtual networks. It does not support connecting virtual machines or cloud services that are not in a virtual network.

###Can I used a PolicyBased VPN type for VNet-to-VNet or Multi-Site connections?
No. VNet-to-VNet and Multi-Site connections require Azure VPN gateways with RouteBased (previously called Dynamic Routing) VPN types.

### Can I connect a VNet with a RouteBased VPN Type to another VNet with a PolicyBased VPN type?
No, both virtual networks MUST be using route-based (dynamic routing) VPNs.

###Can my VNet address spaces overlap for VNet-to-VNet connections?
No.

###Are redundant tunnels supported?
Redundant tunnels between a pair of virtual networks are supported when one virtual network gateway is configured as active-active.

###Do VPN tunnels share bandwidth?
Yes. All VPN tunnels of the virtual network share the available bandwidth on the Azure VPN gateway and the same VPN gateway uptime SLA in Azure.

###Can I use VNet-to-VNet along with multi-site connections?
Yes. Virtual network connectivity can be used simultaneously with multi-site VPNs. There is a maximum of 10 (Default/Standard Gateways) or 30 (HighPerformance Gateways) VPN tunnels for a virtual network VPN gateway connecting to either other virtual networks, or on-premises sites.