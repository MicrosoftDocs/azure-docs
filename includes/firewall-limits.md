---
 title: include file
 description: include file
 services: firewall
 author: vhorne
 ms.service: firewall
 ms.topic: include
 ms.date: 3/25/2019
 ms.author: victorh
 ms.custom: include file
---

| Resource | Default limit |
| --- | --- |
| Data throughput |30 Gbps<sup>1</sup> |
|Rules|10,000, all rule types combined.|
|Minimum AzureFirewallSubnet size |/26|
|Port range in network and application rules|0-64,000. Work is in progress to relax this limitation.|
|Route table|By default, AzureFirewallSubnet should only have a 0.0.0.0/0 user defined route with the NextHopType value set to **Internet**. If your organization requires forced tunneling for Azure Firewall traffic, contact Support so that we can whitelist your subscription to ensure the required firewall Internet connectivity is maintained.

<sup>1</sup>If you need to increase these limits, contact Azure Support.
