---
 title: include file
 description: include file
 services: firewall
 author: vhorne
 ms.service: firewall
 ms.topic: include
 ms.date: 11/26/2018
 ms.author: victorh
 ms.custom: include file
---

| Resource | Default limit |
| --- | --- |
| Data processed |1000 TB/firewall/month <sup>1</sup> |
|Rules|10k - all rule types combined|
|Global peering|Not supported. You should have at least one firewall deployment per region.|
|Maximum ports in a single network rule|15<br>A range of ports (for example: 2 - 10) is counted as two.


<sup>1</sup> Contact Azure Support in case you need to increase these limits.
