---
 title: include file
 description: include file
 services: firewall
 author: vhorne
 ms.service: firewall
 ms.topic: include
 ms.date: 01/22/2020
 ms.author: victorh
 ms.custom: include file
---

| Resource | Default limit |
| --- | --- |
| Data throughput |30 Gbps<sup>1</sup> |
|Rules|10,000. All rule types combined.|
|Maximum DNAT rules|299|
|Minimum AzureFirewallSubnet size |/26|
|Port range in network and application rules|0-64,000. Work is in progress to relax this limitation.|
|Public IP addresses|100 maximum (Currently, SNAT ports are added only for the first five public IP addresses.)|
|Route table|By default, AzureFirewallSubnet has a 0.0.0.0/0 route with the NextHopType value set to **Internet**.<br><br>Azure Firewall must have direct Internet connectivity. If your AzureFirewallSubnet learns a default route to your on-premises network via BGP, you must override that with a 0.0.0.0/0 UDR with the **NextHopType** value set as **Internet** to maintain direct Internet connectivity. By default, Azure Firewall doesn't support forced tunneling to an on-premises network.<br><br>However, if your configuration requires forced tunneling to an on-premises network, Microsoft will support it on a case by case basis. Contact Support so that we can review your case. If accepted, we'll allow your subscription and ensure the required firewall Internet connectivity is maintained.|

<sup>1</sup>If you need to increase these limits, contact Azure Support.
