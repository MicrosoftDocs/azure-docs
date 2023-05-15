---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 05/02/2023
 ms.author: cherylmc
---

> [!IMPORTANT]
> There are a few constraints for the NAT feature.

* NAT is supported on the following SKUs: VpnGw2~5, VpnGw2AZ~5AZ.
* NAT is supported for IPsec/IKE cross-premises connections only. VNet-to-VNet connections or P2S connections aren't supported.
* NAT rules aren't supported on connections that have Use Policy Based Traffic Selectors enabled.
* The maximum supported external mapping subnet size for Dynamic NAT is /26.
* Port mappings can be configured with Static NAT types only. Dynamic NAT scenarios aren't applicable for port mappings.
* Port mappings can't take ranges at this time. Individual port needs to be entered.
* Port mappings can be used for both TCP and UDP protocols.