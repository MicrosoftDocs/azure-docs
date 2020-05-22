---
 title: include file
 description: include file
 services: firewall
 author: vhorne
 ms.service: firewall
 ms.topic: include
 ms.date: 05/14/2020
 ms.author: victorh
 ms.custom: include file
---

| Resource | Limit |
| --- | --- |
| Data throughput |30 Gbps<sup>1</sup> |
|Rules|10,000. All rule types combined.|
|Maximum DNAT rules|298<br>If a rule's protocol is configured for both TCP and UDP, it counts as two rules.|
|Minimum AzureFirewallSubnet size |/26|
|Port range in network and application rules|1 - 65535|
|Public IP addresses|250 maximum. All public IP addresses can be used in DNAT rules and they all contribute to available SNAT ports.|
|IP addresses in IP Groups|50 IP Groups or less: maximum 5000 individual IP addresses each per firewall instance.<br>51 - 100 IP Groups: 500 individual IP address each per firewall instance.<br><br>For more information see [IP Groups (preview) in Azure Firewall](../articles/firewall/ip-groups.md#ip-address-limits)
|Route table|By default, AzureFirewallSubnet has a 0.0.0.0/0 route with the NextHopType value set to **Internet**.<br><br>Azure Firewall must have direct Internet connectivity. If your AzureFirewallSubnet learns a default route to your on-premises network via BGP, you must override that with a 0.0.0.0/0 UDR with the **NextHopType** value set as **Internet** to maintain direct Internet connectivity. By default, Azure Firewall doesn't support forced tunneling to an on-premises network.<br><br>However, if your configuration requires forced tunneling to an on-premises network, Microsoft will support it on a case by case basis. Contact Support so that we can review your case. If accepted, we'll allow your subscription and ensure the required firewall Internet connectivity is maintained.|

<sup>1</sup>If you need to increase these limits, contact Azure Support.
