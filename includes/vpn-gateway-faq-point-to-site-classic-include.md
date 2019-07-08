---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 12/06/2018
 ms.author: cherylmc
 ms.custom: include file
---
This FAQ applies to P2S connections that use the classic deployment model.

### What client operating systems can I use with Point-to-Site?

The following client operating systems are supported:

* Windows 7 (32-bit and 64-bit)
* Windows Server 2008 R2 (64-bit only)
* Windows 8 (32-bit and 64-bit)
* Windows 8.1 (32-bit and 64-bit)
* Windows Server 2012 (64-bit only)
* Windows Server 2012 R2 (64-bit only)
* Windows 10

### Can I use any software VPN client that supports SSTP for Point-to-Site?

No. Support is limited only to the listed Windows operating system versions.

### How many VPN client endpoints can exist in my Point-to-Site configuration?

Up to 128 VPN clients can connect to a virtual network at the same time.

### Can I use my own internal PKI root CA for Point-to-Site connectivity?

Yes. Previously, only self-signed root certificates could be used. You can still upload up to 20 root certificates.

### Can I traverse proxies and firewalls by using Point-to-Site?

Yes. We use Secure Socket Tunneling Protocol (SSTP) to tunnel through firewalls. This tunnel appears as an HTTPS connection.

### If I restart a client computer configured for Point-to-Site, will the VPN automatically reconnect?

By default, the client computer won't reestablish the VPN connection automatically.

### Does Point-to-Site support auto reconnect and DDNS on the VPN clients?

No. Auto reconnect and DDNS are currently not supported in Point-to-Site VPNs.

### Can I have Site-to-Site and Point-to-Site configurations for the same virtual network?

Yes. Both solutions will work if you have a RouteBased VPN type for your gateway. For the classic deployment model, you need a dynamic gateway. We don't support Point-to-Site for static routing VPN gateways or gateways that use the **-VpnType PolicyBased** cmdlet.

### Can I configure a Point-to-Site client to connect to multiple virtual networks at the same time?

Yes. However, the virtual networks can't have overlapping IP prefixes and the Point-to-Site address spaces must not overlap between the virtual networks.

### How much throughput can I expect through Site-to-Site or Point-to-Site connections?

It's difficult to maintain the exact throughput of the VPN tunnels. IPsec and SSTP are crypto-heavy VPN protocols. Throughput is also limited by the latency and bandwidth between your premises and the internet.
