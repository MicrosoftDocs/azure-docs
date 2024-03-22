---
title: 'Azure ExpressRoute: About Encryption'
description: Learn about ExpressRoute encryption.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: duau
---
# ExpressRoute encryption
 
ExpressRoute supports a couple of encryption technologies to ensure confidentiality and integrity of the data traversing between your network and Microsoft's network. By default traffic over an ExpressRoute connection isn't encrypted.

## Point-to-point encryption by MACsec FAQ

MACsec is an [IEEE standard](https://1.ieee802.org/security/802-1ae/). It encrypts data at the Media Access control (MAC) level or Network Layer 2. You can use MACsec to encrypt the physical links between your network devices and Microsoft's network devices when you connect to Microsoft via [ExpressRoute Direct](expressroute-erdirect-about.md). MACsec is disabled on ExpressRoute Direct ports by default. You bring your own MACsec key for encryption and store it in [Azure Key Vault](../key-vault/general/overview.md). You decide when to rotate the key.

### Can I enable Azure Key Vault firewall policies when storing MACsec keys?
 
Yes, ExpressRoute is a trusted Microsoft service. You can configure Azure Key Vault firewall policies and allow trusted services to bypass the firewall. For more information, see [Configure Azure Key Vault firewalls and virtual networks](../key-vault/general/network-security.md).

### Can I enable MACsec on my ExpressRoute circuit provisioned by an ExpressRoute provider?

No. MACsec encrypts all traffic on a physical link with a key owned by one entity (for example, customer). Therefore, it's available on ExpressRoute Direct only.

### Can I encrypt some of the ExpressRoute circuits on my ExpressRoute Direct ports and leave other circuits on the same ports unencrypted?

No. Once MACsec is enabled all network control traffic, for example, the BGP data traffic, and customer data traffic are encrypted. 

### When I enable/disable MACsec or update MACsec key will my on-premises network lose connectivity to Microsoft over ExpressRoute?

Yes. For the MACsec configuration, we support the preshared key mode only. It means you need to update the key on both your devices and on Microsoft's (via our API). This change isn't atomic, so you lose connectivity when there's a key mismatch between the two sides. We strongly recommend that you schedule a maintenance window for the configuration change. To minimize the downtime, we suggest you update the configuration on one link of ExpressRoute Direct at a time after you switch your network traffic to the other link.

### Does traffic continue to flow if there's a mismatch in MACsec key between my devices and Microsoft's?

No. If MACsec is configured and a key mismatch occurs, you lose connectivity to Microsoft. In other traffic doesn't fall back to an unencrypted connection, exposing your data. 

### Does enabling MACsec on ExpressRoute Direct degrade network performance?

MACsec encryption and decryption occur in hardware on the routers we use. There's no performance degradation on our side. However, you should check with the network vendor for the devices you use and see if MACsec has any performance implication.

### Which cipher suites are supported for encryption?

We support the following [standard ciphers](https://1.ieee802.org/security/802-1ae/):
* GCM-AES-128
* GCM-AES-256
* GCM-AES-XPN-128
* GCM-AES-XPN-256

### Does ExpressRoute Direct MACsec support Secure Channel Identifier (SCI)?

Yes, you can set [Secure Channel Identifier (SCI)](https://en.wikipedia.org/wiki/IEEE_802.1AE) on the ExpressRoute Direct ports. For more information, see [Configure MACsec](expressroute-howto-macsec.md).

## End-to-end encryption by IPsec FAQ

IPsec is an [IETF standard](https://tools.ietf.org/html/rfc6071). It encrypts data at the Internet Protocol (IP) level or Network Layer 3. You can use IPsec to encrypt an end-to-end connection between your on-premises network and your virtual network on Azure.

### Can I enable IPsec in addition to MACsec on my ExpressRoute Direct ports?

Yes. MACsec secures the physical connections between you and Microsoft. IPsec secures the end-to-end connection between you and your virtual networks on Azure. You can enable them independently.

### Can I use Azure VPN gateway to set up the IPsec tunnel over Azure Private Peering?

Yes. If you adopt Azure Virtual WAN, you can follow steps in [VPN over ExpressRoute for Virtual WAN](../virtual-wan/vpn-over-expressroute.md) to encrypt your end-to-end connection. If you have regular Azure virtual network, you can follow [site-to-site VPN connection over Private peering](../vpn-gateway/site-to-site-vpn-private-peering.md) to establish an IPsec tunnel between Azure VPN gateway and your on-premises VPN gateway.

### What is the throughput I'll get after enabling IPsec on my ExpressRoute connection?

If Azure VPN gateway is used, review these [performance numbers](../vpn-gateway/vpn-gateway-about-vpngateways.md) to see if they match your expected throughput. If a third-party VPN gateway is used, check with the vendor for their performance numbers.

## Next steps

* For more information about the IPsec configuration, see [Configure IPsec](site-to-site-vpn-over-microsoft-peering.md) 

* For more information about the MACsec configuration, see [Configure MACsec](expressroute-howto-macsec.md).
