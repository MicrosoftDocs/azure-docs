---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/03/2023
 ms.author: cherylmc
---

> [!IMPORTANT]
> There are a few constraints for the NAT feature.

* NAT is supported on the following SKUs: `VpnGw2~5, VpnGw2AZ~5AZ`.
* NAT is supported for IPsec/IKE cross-premises connections only. VNet-to-VNet connections or P2S connections aren't supported.
* NAT rules can't be associated with connection resources during create connection process. Create the connection resource first, then associate the NAT rules in the Connection Configuration page.
* Address spaces for different local network gateways (on-premises networks or branches) can be same as Ingress SNAT rules can be mapped to different prefixes.
* NAT rules aren't supported on connections that have Use Policy Based Traffic Selectors enabled.
* The maximum supported external mapping subnet size for Dynamic NAT is /26.
* Port mappings can be configured with Static NAT types only. Dynamic NAT scenarios are not applicable for port mappings.
* Port mappings cannot take ranges at this time. Individual port needs to be entered.
* Port mappings can be used for both TCP and UDP protocols.
