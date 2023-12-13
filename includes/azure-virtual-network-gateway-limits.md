---
 title: include file
 description: include file
 services: networking
 author: anzaman
 ms.service: VPN Gateway
 ms.topic: include
 ms.date: 08/25/2020
 ms.author: alzam
 ms.custom: include file

---

| Resource                                | Limit        |
|-----------------------------------------|------------------------------|
| VNet Address Prefixes                   | 600 per VPN gateway          |
| Aggregate BGP routes                    | 4,000 per VPN gateway        |
| Local Network Gateway address prefixes  | 1000 per local network gateway               |
| S2S connections                         | [Depends on the gateway SKU](../articles/vpn-gateway/vpn-gateway-about-vpngateways.md#gwsku)|
| P2S connections                         | [Depends on the gateway SKU](../articles/vpn-gateway/vpn-gateway-about-vpngateways.md#gwsku) |
| P2S route limit - IKEv2                 | 256 for non-Windows **/** 25 for Windows           |
| P2S route limit - OpenVPN               | 1000                         |
| Max. flows                              | 100K for VpnGw1/AZ  **/**  512K for VpnGw2-4/AZ|
| Traffic Selector Policies               | 100  |
