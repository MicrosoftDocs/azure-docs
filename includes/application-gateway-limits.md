---
author: vhorne
ms.service: application-gateway
ms.topic: include
ms.date: 6/5/2019
ms.author: victorh
---
| Resource | Default/maximum limit | Note |
| --- | --- | --- |
| Azure Application Gateway |1,000 per subscription | |
| Front-end IP configurations |2 |1 public and 1 private |
| Front-end ports |100<sup>1</sup> | |
| Back-end address pools |100<sup>1</sup> | |
| Back-end servers per pool |1,200 | |
| HTTP listeners |100<sup>1</sup> | |
| HTTP load-balancing rules |100<sup>1</sup> | |
| Back-end HTTP settings |100<sup>1</sup> | |
| Instances per gateway |32 | |
| SSL certificates |100<sup>1</sup> |1 per HTTP listeners |
| Maximum SSL certificate size |V1 SKU - 10 KB<br>V2 SKU - 16 KB| |
| Authentication certificates |100 | |
| Trusted root certificates |100 | |
| Request timeout minimum |1 second | |
| Request timeout maximum |24 hours | |
| Number of sites |100<sup>1</sup> |1 per HTTP listeners |
| URL maps per listener |1 | |
| Maximum path-based rules per URL map|100||
| Redirect configurations |100<sup>1</sup>| |
| Concurrent WebSocket connections |Medium gateways 20k<br> Large gateways 50k| |
| Maximum URL length|8,000||
| Maximum file upload size, Standard |2 GB | |
| Maximum file upload size WAF |Medium WAF gateways, 100 MB<br>Large WAF gateways, 500 MB| |
| WAF body size limit, without files|128 KB||
|Maximum WAF custom rules|100||

<sup>1</sup> In case of WAF-enabled SKUs, we recommend that you limit the number of resources to 40 for optimal performance.
