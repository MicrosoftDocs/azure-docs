---
 ms.topic: include
 author: cherylmc
 ms.service: vpn-gateway
 ms.date: 05/23/2022
 ms.author: cherylmc
---
Starting July 1, 2018, support is being removed for TLS 1.0 and 1.1 from Azure VPN Gateway. VPN Gateway will support only TLS 1.2. Only point-to-site connections are impacted; site-to-site connections won't be affected. If you’re using TLS for point-to-site VPNs on Windows 10 or later clients, you don’t need to take any action. If you're using TLS for point-to-site connections on Windows 7 and Windows 8 clients, see the [VPN Gateway FAQ](../articles/vpn-gateway/vpn-gateway-vpn-faq.md#P2S) for update instructions.