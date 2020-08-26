---
title: 'Azure ExpressRoute: About Encryption'
description: Learn about ExpressRoute encryption. 
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 05/05/2020
ms.author: cherylmc

---
# ExpressRoute encryption
 
ExpressRoute supports a couple of encryption technologies to ensure confidentiality and integrity of the data traversing between your network and Microsoft's network.

## Point-to-point encryption by MACsec FAQ
MACsec is an [IEEE standard](https://1.ieee802.org/security/802-1ae/). It encrypts data at the Media Access control (MAC) level or Network Layer 2. You can use MACsec to encrypt the physical links between your network devices and Microsoft's network devices when you connect to Microsoft via [ExpressRoute Direct](expressroute-erdirect-about.md). MACsec is disabled on ExpressRoute Direct ports by default. You bring your own MACsec key for encryption and store it in [Azure Key Vault](../key-vault/general/overview.md). You decide when to rotate the key. See other FAQs below.
### Can I enable MACsec on my ExpressRoute circuit provisioned by an ExpressRoute provider?
No. MACsec encrypts all traffic on a physical link with a key owned by one entity (i.e. customer). Therefore, it's available on ExpressRoute Direct only.
### Can I encrypt some of the ExpressRoute circuits on my ExpressRoute Direct ports and leave other circuits on the same ports unencrypted? 
No. Once MACsec is enabled all network control traffic, for example, the BGP data traffic, and customer data traffic are encrypted. 
### When I enable/disable MACsec or update MACsec key will my on-premises network lose connectivity to Microsoft over ExpressRoute?
Yes. For the MACsec configuration, we support the pre-shared key mode only. It means you need to update the key on both your devices and on Microsoft's (via our API). This change is not atomic, so you'll lose connectivity when there's a key mismatch between the two sides. We strongly recommend that you schedule a maintenance window for the configuration change. To minimize the downtime, we suggest you update the configuration on one link of ExpressRoute Direct at a time after you switch your network traffic to the other link.  
### Will traffic continue to flow if there's a mismatch in MACsec key between my devices and Microsoft's?
No. If MACsec is configured and a key mismatch occurs, you lose connectivity to Microsoft. In other words, we won't fall back to an unencrypted connection, exposing your data. 
### Will enabling MACsec on ExpressRoute Direct degrade network performance?
MACsec encryption and decryption occurs in hardware on the routers we use. There's no performance impact on our side. However, you should check with the network vendor for the devices you use and see if MACsec has any performance implication.
### Which cipher suites are supported for encryption?
We support the [Extended Packet Numbering](https://1.ieee802.org/security/802-1aebw/) version of AES128 and AES256 only. In addition, please disable [Secure Channel Identifier(SCI)](https://en.wikipedia.org/wiki/IEEE_802.1AE) in MACsec configuration on your device. 

## End-to-end encryption by IPsec FAQ
IPsec is an [IETF standard](https://tools.ietf.org/html/rfc6071). It encrypts data at the Internet Protocol (IP) level or Network Layer 3. You can use IPsec to encrypt an end-to-end connection between your on-premises network and your virtual network (VNET) on Azure. See other FAQs below.
### Can I enable IPsec in addition to MACsec on my ExpressRoute Direct ports?
Yes. MACsec secures the physical connections between you and Microsoft. IPsec secures the end-to-end connection between you and your virtual networks on Azure. You can enable them independently. 
### Can I use Azure VPN gateway to set up the IPsec tunnel between my on-premises network and my Azure virtual network?
Yes. You can set up this IPsec tunnel over Microsoft Peering of your ExpressRoute circuit. Follow our [configuration guide](site-to-site-vpn-over-microsoft-peering.md).
### Can I use Azure VPN gateway to set up the IPsec tunnel over Azure Private Peering?
If you adopt Azure Virtual WAN you can follow [these steps](../virtual-wan/vpn-over-expressroute.md) to encrypt the end-to-end connection. If you have regular Azure VNET you can deploy a third-party VPN gateway in your VNET and establish an IPsec tunnel between it and your on-premises VPN gateway.
### What is the throughput I will get after enabling IPsec on my ExpressRoute connection?
If Azure VPN gateway is used, check the [performance numbers here](../vpn-gateway/vpn-gateway-about-vpngateways.md). If a third-party VPN gateway is used, check with the vendor for the performance numbers.

## Next steps
See [Configure MACsec](expressroute-howto-macsec.md) for more information about the MACsec configuration.

See [Configure IPsec](site-to-site-vpn-over-microsoft-peering.md) for more information about the IPsec configuration.
