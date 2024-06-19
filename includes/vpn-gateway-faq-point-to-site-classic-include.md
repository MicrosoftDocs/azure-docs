---
 title: include file
 author: cherylmc
 ms.service: vpn-gateway
 ms.date: 09/26/2023
 ms.author: cherylmc
---
This FAQ applies to P2S connections that use the classic deployment model.

### What client operating systems can I use with point-to-site?

The following client operating systems are supported:

* Windows 7 (32-bit and 64-bit)
* Windows Server 2008 R2 (64-bit only)
* Windows 8 (32-bit and 64-bit)
* Windows 8.1 (32-bit and 64-bit)
* Windows Server 2012 (64-bit only)
* Windows Server 2012 R2 (64-bit only)
* Windows 10
* Windows 11

### Can I use any software VPN client that supports SSTP for point-to-site?

No. Support is limited only to the listed Windows operating system versions.

### How many VPN client endpoints can exist in my point-to-site configuration?

The number of VPN client endpoints depends on your gateway sku and protocol.
[!INCLUDE [Aggregated throughput by SKU](./vpn-gateway-table-gwtype-aggtput-include.md)]

### Can I use my own internal PKI root CA for point-to-site connectivity?

Yes. Previously, only self-signed root certificates could be used. You can still upload up to 20 root certificates.

### Can I traverse proxies and firewalls by using point-to-site?

Yes. We use Secure Socket Tunneling Protocol (SSTP) to tunnel through firewalls. This tunnel appears as an HTTPS connection.

### If I restart a client computer configured for point-to-site, will the VPN automatically reconnect?

By default, the client computer won't reestablish the VPN connection automatically.

### Does point-to-site support auto reconnect and DDNS on the VPN clients?

No. Auto reconnect and DDNS are currently not supported in point-to-site VPNs.

### Can I have Site-to-Site and point-to-site configurations for the same virtual network?

Yes. Both solutions will work if you have a RouteBased VPN type for your gateway. For the classic deployment model, you need a dynamic gateway. We don't support point-to-site for static routing VPN gateways or gateways that use the **-VpnType PolicyBased** cmdlet.

### Can I configure a point-to-site client to connect to multiple virtual networks at the same time?

Yes. However, the virtual networks can't have overlapping IP prefixes and the point-to-site address spaces must not overlap between the virtual networks.

### How much throughput can I expect through Site-to-Site or point-to-site connections?

It's difficult to maintain the exact throughput of the VPN tunnels. IPsec and SSTP are crypto-heavy VPN protocols. Throughput is also limited by the latency and bandwidth between your premises and the internet.
