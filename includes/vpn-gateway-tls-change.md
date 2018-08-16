---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 06/05/2018
 ms.author: cherylmc
 ms.custom: include file
---
Starting July 1, 2018, support is being removed for TLS 1.0 and 1.1 from Azure VPN Gateway. VPN Gateway will support only TLS 1.2. Only point-to-site connections are impacted; site-to-site connections will not be affected. If you’re using TLS for point-to-site VPNs on Windows 10 clients, you don’t need to take any action. If you are using TLS for point-to-site connections on Windows 7 and Windows 8 clients, see the [VPN Gateway FAQ](../articles/vpn-gateway/vpn-gateway-vpn-faq.md#P2S) for update instructions.