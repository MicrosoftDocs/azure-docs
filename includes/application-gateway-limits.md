---
author: vhorne
ms.service: application-gateway
ms.topic: include
ms.date: 11/09/2018
ms.author: victorh
---
| Resource | Default limit | Note |
| --- | --- | --- |
| Application Gateway |1000 per subscription | |
| Front-end IP Configurations |2 |1 public and 1 private |
| Front-end ports |100<sup>1</sup> | |
| Back-end address pools |100<sup>1</sup> | |
| Back-end servers per pool |1200 | |
| HTTP Listeners |100<sup>1</sup> | |
| HTTP load balancing rules |100<sup>1</sup> | |
| Back-end HTTP settings |100<sup>1</sup> | |
| Instances per gateway |32 | |
| SSL certificates |100<sup>1</sup> |1 per HTTP Listeners |
| Authentication certificates |100 | |
| Trusted root certificates |100 | |
| Request time out min |1 second | |
| Request time out max |24 hrs | |
| Number of sites |100<sup>1</sup> |1 per HTTP Listeners |
| URL maps per listener |1 | |
| Maximum path-based rules per URL map|100||
| Redirect configurations |100<sup>1</sup>| |
| Concurrent WebSocket connections |5000| |
| Maximum URL length|8000||
| Maximum file upload size Standard |2 GB | |
| Maximum file upload size WAF |Medium WAF Gateways - 100 MB<br>Large WAF Gateways - 500 MB| |
| WAF body size limit (without files)|128 KB||

<sup>1</sup> In case of WAF-enabled SKUs it is recommended that you limit the number of resources to 40 for optimal performance.
