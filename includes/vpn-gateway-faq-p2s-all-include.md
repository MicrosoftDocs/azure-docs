---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 07/30/2018
 ms.author: cherylmc
 ms.custom: include file
---
### How many VPN client endpoints can I have in my Point-to-Site configuration?

We support up to 128 VPN clients to be able to connect to a virtual network at the same time.

### <a name="supportedclientos"></a>What client operating systems can I use with Point-to-Site?

The following client operating systems are supported:

* Windows 7 (32-bit and 64-bit)
* Windows Server 2008 R2 (64-bit only)
* Windows 8.1 (32-bit and 64-bit)
* Windows Server 2012 (64-bit only)
* Windows Server 2012 R2 (64-bit only)
* Windows Server 2016 (64-bit only)
* Windows 10
* Mac OS X version 10.11 or above
* Linux (StrongSwan)
* iOS

[!INCLUDE [TLS](vpn-gateway-tls-updates.md)]

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

IKEv2 is supported on Windows 10 and Server 2016. However, in order to use IKEv2, you must install updates and set a registry key value locally. OS versions prior to Windows 10 are not supported and can only use SSTP.

To prepare Windows 10 or Server 2016 for IKEv2:

1. Install the update.

  | OS version | Date | Number/Link |
  |---|---|---|---|
  | Windows Server 2016<br>Windows 10 Version 1607 | January 17, 2018 | [KB4057142](https://support.microsoft.com/help/4057142/windows-10-update-kb4057142) |
  | Windows 10 Version 1703 | January 17, 2018 | [KB4057144](https://support.microsoft.com/help/4057144/windows-10-update-kb4057144) |
  |  |  |  |  |

2. Set the registry key value. Create or set “HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\RasMan\ IKEv2\DisableCertReqPayload” REG_DWORD key in the registry to 1.

### What happens when I configure both SSTP and IKEv2 for P2S VPN connections?

When you configure both SSTP and IKEv2 in a mixed environment (consisting of Windows and Mac devices), the Windows VPN client will always try IKEv2 tunnel first, but will fall back to SSTP if the IKEv2 connection is not successful. MacOSX will only connect via IKEv2.

### Other than Windows and Mac, which other platforms does Azure support for P2S VPN?

Azure supports Windows, Mac and Linux for P2S VPN.

### I already have an Azure VPN Gateway deployed. Can I enable RADIUS and/or IKEv2 VPN on it?

Yes, you can enable these new features on already deployed gateways using Powershell or the Azure portal, provided that the gateway SKU that you are using supports RADIUS and/or IKEv2. For example, the VPN gateway Basic SKU does not support RADIUS or IKEv2.
