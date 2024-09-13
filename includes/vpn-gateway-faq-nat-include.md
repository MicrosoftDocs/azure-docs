---
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 01/23/2024
 ms.author: cherylmc
---
### Is NAT supported on all Azure VPN Gateway SKUs?

NAT is supported on VpnGw2 to VpnGw25 and on VpnGw2AZ to VpnGw5AZ.

### Can I use NAT on VNet-to-VNet or P2S connections?

No.

### How many NAT rules can I use on a VPN gateway?

You can create up to 100 NAT rules (ingress and egress rules combined) on a VPN gateway.

### Can I use a slash (/) in a NAT rule name?

No. You'll receive an error.

### Is NAT applied to all connections on a VPN gateway?

NAT is applied to the connections that have NAT rules. If a connection doesn't have a NAT rule, NAT won't take effect on that connection. On the same VPN gateway, you can have some connections with NAT and other connections without NAT working together.

### What types of NAT do VPN gateways support?

VPN gateways support only static 1:1 NAT and dynamic NAT. They don't support NAT64.

### Does NAT work on active-active VPN gateways?

Yes. NAT works on both active-active and active-standby VPN gateways.
Each NAT rule is applied to a single instance of the VPN gateway. In active-active gateways, create a separate NAT rule for each gateway instance through the **IP configuration ID** field.

### Does NAT work with BGP connections?

Yes, you can use BGP with NAT. Here are some important considerations:

* To ensure that the learned routes and advertised routes are translated to post-NAT address prefixes (external mappings) based on the NAT rules associated with the connections, select **Enable BGP Route Translation** on the configuration page for NAT rules. The on-premises BGP routers must advertise the exact prefixes as defined in the **IngressSNAT** rules.

* If the on-premises VPN router uses a regular, non-APIPA address and it collides with the VNet address space or other on-premises network spaces, ensure that the **IngressSNAT** rule will translate the BGP peer IP to a unique, non-overlapped address. Put the post-NAT address in the **BGP peer IP address** field of the local network gateway.
* NAT isn't supported with BGP APIPA addresses.

### Do I need to create the matching DNAT rules for the SNAT rule?

No. A single source network address translation (SNAT) rule defines the translation for *both* directions of a particular network:

* An **IngressSNAT** rule defines the translation of the source IP addresses coming into the  VPN gateway from the on-premises network. It also handles the translation of the destination IP addresses leaving from the virtual network to the same on-premises network.

* An **EgressSNAT** rule defines the translation of the VNet source IP addresses leaving the VPN gateway to on-premises networks. It also handles the translation of the destination IP addresses for packets coming into the virtual network via the connections that have the **EgressSNAT** rule.

In either case, you don't need destination network address translation (DNAT) rules.

### What do I do if my VNet or local network gateway address space has two or more prefixes? Can I apply NAT to all of them or just a subset?

You need to create one NAT rule for each prefix, because each NAT rule can include only one address prefix for NAT. For example, if the address space for the local network gateway consists of 10.0.1.0/24 and 10.0.2.0/25, you can create two rules:

* **IngressSNAT** rule 1: Map 10.0.1.0/24 to 100.0.1.0/24.
* **IngressSNAT** rule 2: Map 10.0.2.0/25 to 100.0.2.0/25.

The two rules must match the prefix lengths of the corresponding address prefixes. The same guideline applies to **EgressSNAT** rules for the VNet address space.

> [!IMPORTANT]
> If you link only one rule to the preceding connection, the other address space won't be translated.

### What IP ranges can I use for external mapping?

You can use any suitable IP range that you want for external mapping, including public and private IPs.

### Can I use different EgressSNAT rules to translate my VNet address space to different prefixes for on-premises networks?

Yes. You can create multiple **EgressSNAT** rules for the same VNet address space, and then apply the **EgressSNAT** rules to different connections.

### Can I use the same IngressSNAT rule on different connections?

Yes. You typically use the same **IngressSNAT** rule when the connections are for the same on-premises network, to provide redundancy. You can't use the same ingress rule if the connections are for different on-premises networks.

### Do I need both ingress and egress rules on a NAT connection?

You need both ingress and egress rules on the same connection when the on-premises network address space overlaps with the VNet address space. If the VNet address space is unique among all connected networks, you don't need the **EgressSNAT** rule on those connections. You can use the ingress rules to avoid address overlap among the on-premises networks.

### What do I choose as the IP configuration ID?

**IP configuration ID** is simply the name of the IP configuration object that you want the NAT rule to use. With this setting, you're simply choosing which gateway public IP address applies to the NAT rule. If you haven't specified any custom name at gateway creation time, the gateway's primary IP address is assigned to the **default** IP configuration, and the secondary IP is assigned to the **activeActive** IP configuration.
