### <a name="supportedclientos"></a>What client operating systems can I use with Point-to-Site?

The following client operating systems are supported:

* Windows 7 (32-bit and 64-bit)
* Windows Server 2008 R2 (64-bit only)
* Windows 8 (32-bit and 64-bit)
* Windows 8.1 (32-bit and 64-bit)
* Windows Server 2012 (64-bit only)
* Windows Server 2012 R2 (64-bit only)
* Windows Server 2016 (64-bit only)
* Windows 10
* OSX version 10.11 for Mac (El Capitan)
* macOS version 10.12 for Mac (Sierra)

### How many VPN client endpoints can I have in my Point-to-Site configuration?

We support up to 128 VPN clients to be able to connect to a virtual network at the same time.

### Can I traverse proxies and firewalls using Point-to-Site capability?

Azure supports two types of Point-to-site VPN options:

* Secure Socket Tunneling Protocol (SSTP). SSTP is a Microsoft proprietary SSL-based solution that can penetrate firewalls since most firewalls open the TCP port that 443 SSL uses.

* IKEv2 VPN. IKEv2 VPN is a standards-based IPsec VPN solution that uses UDP port 500 and 4500 and IP protocol no. 50. Firewalls do not always open these ports, so there is a possibility of IKEv2 VPN not being able to traverse proxies and firewalls.

### If I restart a client computer configured for Point-to-Site, will the VPN automatically reconnect?

By default, the client computer will not reestablish the VPN connection automatically.

### Does Point-to-Site support auto-reconnect and DDNS on the VPN clients?

Auto-reconnect and DDNS are currently not supported in Point-to-Site VPNs.

### Can I have Site-to-Site and Point-to-Site configurations coexist for the same virtual network?

Yes. For the Resource Manager deployment model, you must have a RouteBased VPN type for your gateway. For the classic deployment model, you need a dynamic gateway. We do not support Point-to-Site for static routing VPN gateways or PolicyBased VPN gateways.

### Can I configure a Point-to-Site client to connect to multiple virtual networks at the same time?

No. A Point-to-Site client can only connect to resources in the VNet in which the virtual network gateway resides.

### How much throughput can I expect through Site-to-Site or Point-to-Site connections?

It's difficult to maintain the exact throughput of the VPN tunnels. IPsec and SSTP are crypto-heavy VPN protocols. Throughput is also limited by the latency and bandwidth between your premises and the Internet. For a VPN Gateway with only IKEv2 Point-to-Site VPN connections, the total throughput that you can expect depends on the Gateway SKU. For more information on throughput, see [Gateway SKUs](../articles/vpn-gateway/vpn-gateway-about-vpngateways.md#gwsku).

### Can I use any software VPN client for Point-to-Site that supports SSTP and/or IKEv2?

No. You can only use the native VPN client on Windows for SSTP, and the native VPN client on Mac for IKEv2. Refer to the list of supported client operating systems.

### Does Azure support IKEv2 VPN with Windows?

Users can connect to Azure using the built-in Windows VPN client, which does support IKEv2. But, IKEv2 connections from a Windows device won't work in the following scenario:

  When the user's device contains a large number of trusted root certificates, the message payload size during IKE exchange is large and causes IP layer fragmentation. The fragments are rejected at the Azure end, which results in the connection failing. The exact certificate count at which this problem occurs is difficult to estimate. As a result, IKEv2 connections from Windows devices are not guaranteed to work. When you configure both SSTP and IKEv2 in a mixed environment (consisting of Windows and Mac devices), the Windows VPN profile always tries IKEv2 tunnel first. If it fails due to the issue described here, it falls back to SSTP.

### Other than Windows and Mac, which other platforms does Azure support for P2S VPN?

Azure supports only Windows and Mac for P2S VPN.

### I already have an Azure VPN Gateway deployed. Can I enabled RADIUS and/or IKEv2 VPN on it?

Yes, you can enable these new features on already deployed gateways, both through Powershell and the Azure portal.
