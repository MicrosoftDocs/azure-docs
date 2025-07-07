---
title: 'About encryption for Azure ExpressRoute'
description: Learn about the use of encryption with Azure ExpressRoute.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.custom:
  - ignite-2023
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: duau
---

# About encryption for Azure ExpressRoute
 
ExpressRoute supports encryption technologies to ensure the confidentiality and integrity of data between your network and Microsoft's network. By default, traffic over an ExpressRoute connection isn't encrypted.

## Point-to-point encryption by MACsec FAQ

MACsec is an [IEEE standard](https://1.ieee802.org/security/802-1ae/) that encrypts data at the Media Access Control (MAC) level (Network Layer 2). You can use MACsec to encrypt the physical links between your network devices and Microsoft's network devices when connecting via [ExpressRoute Direct](expressroute-erdirect-about.md). MACsec is disabled on ExpressRoute Direct ports by default. You must bring your own MACsec key for encryption and store it in [Azure Key Vault](/azure/key-vault/general/overview). You decide when to rotate the key.

### Can I enable Azure Key Vault firewall policies when storing MACsec keys?

Yes, ExpressRoute is a trusted Microsoft service. You can configure Azure Key Vault firewall policies to allow trusted services to bypass the firewall. For more information, see [Configure Azure Key Vault firewalls and virtual networks](/azure/key-vault/general/network-security).

### Can I enable MACsec on my ExpressRoute circuit provisioned by an ExpressRoute provider?

No. MACsec encrypts all traffic on a physical link with a key owned by one entity (for example, the customer). Therefore, it's available only on ExpressRoute Direct.

### Can I encrypt some ExpressRoute circuits on my ExpressRoute Direct ports and leave others unencrypted?

No. Once MACsec is enabled, all network control traffic (for example, BGP data traffic) and customer data traffic are encrypted.

### Will my on-premises network lose connectivity to Microsoft over ExpressRoute when I enable/disable MACsec or update the MACsec key?

Yes. We support the preshared key mode only for MACsec configuration, meaning you need to update the key on both your devices and Microsoft's (via our API). This change isn't atomic, so you lose connectivity when there's a key mismatch. We strongly recommend scheduling a maintenance window for the configuration change. To minimize downtime, update the configuration on one link of ExpressRoute Direct at a time after switching your network traffic to the other link.

### Does traffic continue to flow if there's a MACsec key mismatch between my devices and Microsoft's?

No. If MACsec is configured and a key mismatch occurs, you lose connectivity to Microsoft. Traffic doesn't fall back to an unencrypted connection, ensuring your data remains protected.

### Does enabling MACsec on ExpressRoute Direct degrade network performance?

MACsec encryption and decryption occur in hardware on the routers we use, so there's no performance degradation on our side. However, check with your network vendor to see if MACsec has any performance implications for your devices.

### Which cipher suites are supported for encryption?

We support the following [standard ciphers](https://1.ieee802.org/security/802-1ae/):
* GCM-AES-128
* GCM-AES-256
* GCM-AES-XPN-128
* GCM-AES-XPN-256

### Does ExpressRoute Direct MACsec support Secure Channel Identifier (SCI)?

Yes, you can set [Secure Channel Identifier (SCI)](https://en.wikipedia.org/wiki/IEEE_802.1AE) on the ExpressRoute Direct ports. For more information, see [Configure MACsec](expressroute-howto-macsec.md).

## End-to-end encryption by IPsec FAQ

IPsec is an [IETF standard](https://tools.ietf.org/html/rfc6071) that encrypts data at the Internet Protocol (IP) level (Network Layer 3). You can use IPsec to encrypt an end-to-end connection between your on-premises network and your virtual network on Azure.

### Can I enable IPsec in addition to MACsec on my ExpressRoute Direct ports?

Yes. MACsec secures the physical connections between you and Microsoft, while IPsec secures the end-to-end connection between you and your virtual networks on Azure. You can enable them independently.

### Can I use Azure VPN gateway to set up the IPsec tunnel over Azure Private Peering?

Yes. If you use Azure Virtual WAN, follow the steps in [VPN over ExpressRoute for Virtual WAN](../virtual-wan/vpn-over-expressroute.md) to encrypt your end-to-end connection. If you have a regular Azure virtual network, follow [site-to-site VPN connection over Private peering](../vpn-gateway/site-to-site-vpn-private-peering.md) to establish an IPsec tunnel between Azure VPN gateway and your on-premises VPN gateway.

### What is the throughput after enabling IPsec on my ExpressRoute connection?

If you use Azure VPN gateway, review these [performance numbers](../vpn-gateway/vpn-gateway-about-vpngateways.md) to see if they match your expected throughput. If you use a third-party VPN gateway, check with the vendor for their performance numbers.

## Next steps

* For more information about the IPsec configuration, see [Configure IPsec](site-to-site-vpn-over-microsoft-peering.md) 

* For more information about the MACsec configuration, see [Configure MACsec](expressroute-howto-macsec.md).
