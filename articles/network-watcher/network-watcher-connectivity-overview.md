---
title: Introduction to connectivity in Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher connectivity capability
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 06/02/2017
ms.author: gwallace
---

# Introduction to connectivity in Azure Network Watcher

The connectivity feature of Network Watcher provides the capability to test a direct TCP connection from a virtual machine to a VM, FQDN, or URI. Network scenarios are complex, they are implemented using Network Security Groups, firewalls, User-defined routes, and more. This complexity makes troubleshooting connection issues tough. Network Watcher helps reduce the amount of time to find and detect mis-configurations and connectivity issues.

[!INCLUDE [network-watcher-preview](../../includes/network-watcher-public-preview-notice.md)]

## Heuristics

The connectivity test returns heuristics about the connection. The following table provides a list of the current heuristics ran and possible actions to take to resolve the issues found.

|Heuristic Name  |Description  |
|---------|---------|
|CPU     | Total CPU Usage on VM goes above 90%        |
|Memory     | Total memory usage on VM above 90%        |
|Firewall Rules     | Ports are blocked by Windows firewall        |
|NIC DNS Resolution     | Source VM failed to resolve destination address        |
|VFP Port Counter     | Returns if packets get dropped due to throttling in past 30 mins. (Any Packets, not restricted to Source/Destination)        |
|IP Flow Verify Heuristic     | Check NSG applied on all VMs in the path from source to destination (Nic & Subnet)        |
|Next Hop Heuristic|Check UDR applied on all VMs in the path from source to destination to check if packets are getting blackholed|

## Results

The following table shows the properties returned when a connectivity test has finished running.

|Property  |Description  |
|---------|---------|
|ConnectionStatus     | The status of the connectivity check. Possible results are **Reachable** and **Unreachable**.        |
|AvgLatencyInMs     | Average latency during the connectivity test in milliseconds. (Only shown if test is successful)        |
|MinLatencyInMs     | Minimum latency during the connectivity test in milliseconds. (Only shown if test is successful)        |
|MaxLatencyInMs     | Maximum latency during the connectivity test in milliseconds. (Only shown if test is successful)        |
|ProbesSent     | Number of probes sent during the check. Max value is 100.        |
|ProbesFailed     | Number of probes that failed during the check. Max value is 100.        |
|Hops     | A collection of hops taken to attempt to connect to the resource.        |
|Hops[].Type     | Type of resource. Possible values are **Source**, **VirtualAppliance**, **VnetLocal**, and **Internet**.        |
|Hops[].Id | Unique identifier of the hop.|
|Hops[].Address | IP address of the hop.|
|Hops[].ResourceId | ResourceID of the hop if the hop is an Azure resource. If it is an internet resource, ResourceID is **Internet** |
|Hops[].NextHopIds | The unique identifier of the next hop taken.|
|Hops[].Issues | A collection of issues that were encountered during the test at that hop. If there were no issues, the value is blank.|
|Hops[].Issues[].Origin | At the current hop, where issue occurred. Possible values are **Inbound** or **Outbound**.|
|Hops[].Issues[].Severity | The severity of the issue detected. Possible values are **Error** and **Warning**. |
|Hops[].Issues[].Type |The type of issue found. Possible values are: <br/>**Unknown**<br/>**AgentStopped**<br/>**GuestFirewall**<br/>**DnsResolution**<br/>**SocketBind**<br/>**NetworkSecurityRule**<br/>**UserDefinedRoute**<br/>**PortThrottled**<br/> **Platform** |
|Hops[].Issues[].Context |Details regarding the issue found.|
|Hops[].Issues[].Context[].key |Key of the key value pair returned.|
|Hops[].Issues[].Context[].value |Value of the key value pair returned.|

### Next steps

Learn how to verify connectivity to a resource by visiting: [Test connectivity with Azure Network Watcher](network-watcher-connectivity-powershell.md).

<!--Image references-->
[1]: ./media/network-watcher-next-hop-overview/figure1.png













