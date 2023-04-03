---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/30/2023
 ms.author: cherylmc
---

> [!IMPORTANT]
> There are a few constraints for the NAT feature.
* NAT is supported on the following SKUs: VpnGw2~5, VpnGw2AZ~5AZ.
* NAT is supported for IPsec/IKE cross-premises connections only. VNet-to-VNet connections or P2S connections aren't supported.
* NAT rules can't be associated with connection resources during the create connection process. Create the connection resource first, then associate the NAT rules in the Connection Configuration page.
* Address spaces for different local network gateways (on-premises networks or branches) can be the same with *IngressSNAT* rules to map to nonoverlapping prefixes as shown in the configuration for [Diagram 1](../articles/vpn-gateway/nat-howto.md#diagram) in the NAT configuration article.
* NAT rules aren't supported on connections that have *Use Policy Based Traffic Selectors* enabled.
* The maximum supported external mapping subnet size for Dynamic NAT is /26.
* NAT configuration isn't available for Dynamic NAT.
* Port ranges can't be entered at this time. Individual ports need to be entered. Port ranges can be configured with Static NAT types only. This can be configured for Static NAT type only.
* Port mappings can be used for both TCP and UDP protocols.