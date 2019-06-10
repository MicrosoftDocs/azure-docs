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
|Route table|By default, AzureFirewallSubnet has a 0.0.0.0/0 route with the NextHopType value set to **Internet**.<br><br>If you enable forced tunneling to on-premises via ExpressRoute or VPN Gateway, you may need to explicitly configure a 0.0.0.0/0 user defined route (UDR) with the NextHopType value set as Internet and associate it with your AzureFirewallSubnet. This overrides a potential default gateway BGP advertisement back to your on-premises network. If your organization requires forced tunneling for Azure Firewall to direct default gateway traffic back through your on-premises network, contact Support. We can whitelist your subscription to ensure the required firewall Internet connectivity is maintained.|

<sup>1</sup>If you need to increase these limits, contact Azure Support.
