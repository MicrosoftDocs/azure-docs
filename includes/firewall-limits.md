---
 title: include file
 description: include file
 services: firewall
 author: vhorne
 ms.service: firewall
 ms.topic: include
 ms.date: 10/10/2023
 ms.author: victorh
 ms.custom: include file
---

| Resource | Limit |
| --- | --- |
| Max Data throughput | 100 Gbps for Premium, 30 Gbps for Standard, 250 Mbps for Basic (preview) SKU<br><br> For more information, see [Azure Firewall performance](../articles/firewall/firewall-performance.md#performance-data). |
|Rule limits|20,000 unique source/destinations in network rules <br><br> **Unique source/destinations in network** = sum of (unique source addresses * unique destination addresses for each rule)<br><br>An IP group counts as one address, regardless of how many IP addresses it contains.<br><br>You can track the Firewall Policy network rule count in the [policy analytics](../articles/firewall/policy-analytics.md) under the **Insights** tab. As a proxy, you can also monitor your Firewall Latency Probe metrics to ensure it stays within 20 ms even during peak hours.|
|Total size of rules within a single Rule Collection Group| 1 MB for Firewall policies created before July 2022<br>2 MB for Firewall policies created after July 2022|
|Number of Rule Collection Groups in a firewall policy|50 for Firewall policies created before July 2022<br>60 for Firewall policies created after July 2022|
|Maximum DNAT rules (Maximum external destinations)|250 maximum [number of firewall public IP addresses + unique destinations (destination address, port, and protocol)]<br><br> The DNAT limitation is due to the underlying platform.<br><br>For example, you can configure 500 UDP rules to the same destination IP address and port (one unique destination), while 500 rules to the same IP address but to 500 different ports exceeds the limit (500 unique destinations).|
|Minimum AzureFirewallSubnet size |/26|
|Port range in network and application rules|1 - 65535|
|Public IP addresses|250 maximum. All public IP addresses can be used in DNAT rules and they all contribute to available SNAT ports.|
|IP addresses in IP Groups|Maximum of 200 IP Groups per firewall.<br>Maximum 5000 individual IP addresses or IP prefixes per each IP Group.
|Route table|By default, AzureFirewallSubnet has a 0.0.0.0/0 route with the NextHopType value set to **Internet**.<br><br>Azure Firewall must have direct Internet connectivity. If your AzureFirewallSubnet learns a default route to your on-premises network via BGP, you must override that with a 0.0.0.0/0 UDR with the **NextHopType** value set as **Internet** to maintain direct Internet connectivity. By default, Azure Firewall doesn't support forced tunneling to an on-premises network.<br><br>However, if your configuration requires forced tunneling to an on-premises network, Microsoft will support it on a case by case basis. Contact Support so that we can review your case. If accepted, we'll allow your subscription and ensure the required firewall Internet connectivity is maintained.|
|FQDNs in network rules|For good performance, do not exceed more than 1000 FQDNs across all network rules per firewall.|
|TLS inspection timeout|120 seconds|
