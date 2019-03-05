---
 title: include file
 description: include file
 services: firewall
 author: vhorne
 ms.service: firewall
 ms.topic: include
 ms.date: 2/4/2019
 ms.author: victorh
 ms.custom: include file
---

| Resource | Default limit |
| --- | --- |
| Data processed |1000 TB/firewall/month <sup>1</sup> |
|Rules|10k - all rule types combined|
|Global peering|Not supported. You should have at least one firewall deployment per region.|
|Minimum AzureFirewallSubnet size |/26|
|Port range in network and application rules|0-64,000. Work is in progress to relax this limitation.|
|


<sup>1</sup> Contact Azure Support in case you need to increase these limits.
