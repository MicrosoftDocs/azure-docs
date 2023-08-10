---
author: greg-lindsay
ms.service: application-gateway
ms.topic: include
ms.date: 07/29/2023
ms.author: greglin
---
| Resource | Limit | Note |
| --- | --- | --- |
| Azure Application Gateway |1,000 per region per subscription | |
| Frontend IP configurations |2 |1 public and 1 private |
| Frontend ports |100<sup>1</sup> | |
| Backend address pools |100 | |
| Backend targets per pool |1,200 | |
| HTTP listeners |200<sup>1</sup> |Limited to 100 active listeners that are routing traffic. Active listeners = total number of listeners - listeners not active.<br>If a default configuration inside a routing rule is set to route traffic (for example, it has a listener, a backend pool, and HTTP settings) then that also counts as a listener. For more information, see [Frequently asked questions about Application Gateway](../articles/application-gateway/application-gateway-faq.yml#what-is-considered-an-active-listener-versus-inactive-listener).|
| HTTP load-balancing rules |400<sup>1</sup> | |
| Backend HTTP settings |100<sup>1</sup> | |
| Instances per gateway |V1 SKU - 32<br>V2 SKU - 125 | |
| SSL certificates |100<sup>1</sup> |1 per HTTP listener |
| Maximum SSL certificate size |V1 SKU - 10 KB<br>V2 SKU - 16 KB| |
| Maximum trusted client CA certificate size | 25 KB| 25 KB is the maximum aggregated size of root and intermediate certificates contained in an uploaded pem or cer file. |
| Maximum trusted client CA certificates |200 | 100 per SSL Profile |
| Authentication certificates |100 | |
| Trusted root certificates |100 | |
| Request timeout minimum |1 second | |
| Request timeout maximum to private backend |24 hours | |
| Request timeout maximum to external backend |4 minutes | |
| Number of sites |100<sup>1</sup> |1 per HTTP listener |
| URL maps per listener |1 | |
| Host names per listener |5 | |
| Maximum path-based rules per URL map|100||
| Redirect configurations |100<sup>1</sup>| |
| Number of rewrite rule sets |400| |
| Number of Header or URL configuration per rewrite rule set|40| |
| Number of conditions per rewrite rule set|40| |
| Concurrent WebSocket connections |Medium gateways 20k<sup>2</sup><br> Large gateways 50k<sup>2</sup>| |
| Maximum URL length|32 KB| |
| Maximum header size|32 KB| |
| Maximum header field size for HTTP/2|8 KB| |
| Maximum header size for HTTP/2|16 KB| |
| Maximum file upload size (Standard SKU) |V2 - 4 GB<br>V1 - 2 GB | |
| Maximum file upload size (WAF SKU) |V1 Medium - 100 MB<br>V1 Large - 500 MB<br>V2 - 750 MB<br>V2 (with CRS 3.2 or newer) - 4 GB<sup>3</sup>| |
| WAF body size limit (without files)|V1 or V2 (with CRS 3.1 and older) - 128 KB<br>V2 (with CRS 3.2 or newer) - 2 MB<sup>3</sup>| |
| Maximum Private Link Configurations| 2 | 1 for public IP, 1 for private IP |
| Maximum Private Link IP Configurations| 8 | |
| Maximum WAF custom rules|100||
| WAF IP address ranges per match condition|540<br>600 - with CRS 3.2 or newer|
| Maximum WAF exclusions per Application Gateway|40<br>200 - with CRS 3.2 or newer|
| WAF string match values per match condition|10||

<sup>1</sup> The number of resources listed in the table applies to standard Application Gateway SKUs and WAF-enabled SKUs running CRS 3.2 or higher. For WAF-enabled SKUs running CRS 3.1 or lower, the supported number is 40. For more information, see [WAF engine](../articles/web-application-firewall/ag/waf-engine.md).

<sup>2</sup> Limit is per Application Gateway instance not per Application Gateway resource.

<sup>3</sup> Must define the value via WAF Policy for Application Gateway.
