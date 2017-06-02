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

The connectivity feature of Network Watcher provides the ability to test the connectivity of a direct TCP connection from a virtual machine to a remote endpoint. Networking resources are complex and have many parts, this includes Network Security Groups, firewalls, User defined routes, and more. With these resources traffic can be blocked at many different components in your network.

## Heuristics

The connectivity test returns heuristics about the connection. The following table provides a list of the current heuristics ran and possible actions to take to resolve the issues found.

|Heuristic Name  |Description  | User Action|
|---------|---------|---|
|CPU     | Total CPU Usage on VM goes above 90%        | Investigate VM with high CPU usage|
|Memory     | Total memory usage on VM above 90%        |Investigate VM with high memory usage|
|Firewall Rules     | Ports are blocked by Windows firewall        |Investigate Firewall rules on source VM|
|NIC DNS Resolution     | Source VM failed to resolve destination address        |Investigate DNS configuration on source VM|
|VFP Port Counter     | Returns if packets get dropped due to throttling in past 30 mins. (Any Packets, not restricted to Source/Destination)        | Increase VM size to higher network or reduce network load|
|IP Flow Verify Heuristic     | Check NSG applied on all VMs in the path from source to destination (Nic & Subnet)        |Check/Change the NSG Rules or Configuration|
|Next Hop Heuristic|Check UDR applied on all VMs in the path from source to destination to check if packets are getting blackholed|Check/Change the applied User Defined Routes|


## Results

The following table shows the properties returned when connectivity test is complete.

|Property  |Description  |
|---------|---------|
|ConnectionStatus     | The status of the connectivity check. Possible results are **Reachable** and **Unreachable**.        |
|AvgLatencyInMs     | Average latency during the connectivity test in milliseconds.        |
|MinLatencyInMs     | Minimum latency during the connectivity test in milliseconds.        |
|MaxLatencyInMs     | Maximum latency during the connectivity test in milliseconds.        |
|ProbesSent     | Number of probes sent during the check. Max value is 100.        |
|ProbesFailed     | Number of probes that failed during the check. Max value is 100.        |
|Hops     | A collection of hops taken to attempt to connect to the resource.        |
|Hops[].Type     | Type of resource. Possible values are **Source**, **VirtualAppliance**, **VnetLocal**, and **Internet**.        |
|Hops[].Id | Unique identifier of the hop.|
|Hops[].Address | IP address of the hop.|
|Hops[].ResourceId | ResourceID of the hop if the hop is an Azure resource. If it is an internet resource ResourceID is **Internet** |
|Hops[].NextHopIds | The unique identifier of the next hop taken.|
|Hops[].Issues | A collection of issues that were encountered during the test at that hop. If there were no issues the value is blank.|
|Hops[].Issues[].Origin | At the current hop, where issue occurred. Possible values are **Inbound** or **Outbound**.|
|Hops[].Issues[].Severity | The severity of the issue detected. The current value available is **Error**. |
|Hops[].Issues[].Type |The type of issue found. Possible values are **NetworkSecurityRule** and **UserDefinedRoute**. |
|Hops[].Issues[].Context |Details in regards to the issue found.|
|Hops[].Issues[].Context[].key |Key of the key value pair returned.|
|Hops[].Issues[].Context[].value |Value of the key value pair returned.|

### Next steps

Learn how to verify connectivity to a resource by visiting: [Test connectivity with Azure Network Watcher](network-watcher-connectivity-powershell.md).

<!--Image references-->
[1]: ./media/network-watcher-next-hop-overview/figure1.png













