---
title: Introduction to Azure Network Watcher Connection Troubleshoot | Microsoft Docs
description: This page provides an overview of the Network Watcher connection troubleshooting capability
services: network-watcher
author: shijaiswal
ms.service: network-watcher
ms.topic: article
ms.tgt_pltfrm: na
ms.custom: ignite-2022
ms.workload:  infrastructure-services
ms.date: 10/12/2022
ms.author: shijaiswal
---

# Introduction to connection troubleshoot in Azure Network Watcher

With the increase in sophisticated and high-performance workloads into Azure, there's a critical need for increased visibility and control over the operational state of complex networks running these workloads. With limited visibility, diagnosis of issues such as connectivity issues becomes difficult as there is minimum control.  

The Connection troubleshoot feature of Network Watcher provides the capability to check a direct TCP connection from a virtual machine to a virtual machine (VM), fully qualified domain name (FQDN), URI, or IPv4 address. Network scenarios are complex, they're implemented using network security groups, firewalls, user-defined routes, and resources provided by Azure. Complex configurations make troubleshooting connectivity issues challenging. Network Watcher helps reduce the amount of time to find and detect connectivity issues. The results returned can provide insights into whether a connectivity issue is due to a platform or a user configuration issue. Connectivity can be checked with the [Azure portal](network-watcher-connectivity-portal.md), [PowerShell](network-watcher-connectivity-powershell.md), [Azure CLI](network-watcher-connectivity-cli.md), and [REST API](network-watcher-connectivity-rest.md).

The current capabilities of Connection troubleshoot entail the following:
- Check connectivity between source (VM) and destination (VM, URI, FQDN, IP Address).
- Identify configuration issues that impact reachability.
- Provide all possible hop by hop paths from the source to destination.
- Hop by hop latency.
- Latency - minimum, maximum, and average between source and destination.
- A topology (graphical) view from your source to destination.
- Number of packets dropped during the connection troubleshoot check.

:::image type="content" source="./media/network-watcher-connectivity-portal/network-watcher-graph-view.png" alt-text="Screenshot of graph view of Connection troubleshoot capabilities.":::

Connection troubleshoot can detect the following types of issues that can impact connectivity:

- High VM CPU utilization
- High VM memory utilization
- Virtual machine (guest) firewall rules blocking traffic
- DNS resolution failures
- Misconfigured or missing routes
- NSG rules that are blocking traffic
- Inability to open a socket at the specified source port
- Missing address resolution protocol entries for Azure Express Route circuits
- No servers listening on designated destination ports

Microsoft Azure Network Watcher provides numerous specialized standalone tools to diagnose and troubleshoot connectivity cases such as 
- *[IP Flow Verify](network-watcher-ip-flow-verify-overview.md)* to detect blocked traffic due to NSG rules restriction.
- *[Next Hop](network-watcher-next-hop-overview.md)* to determine intended traffic as per the rules of the effective route.
- *Port Scanner* to determine any port that is blocking traffic.
However, there was no mechanism to perform all the connectivity checks in a single location.

The enhanced Connection troubleshoot feature brings all the above functionality in one place as a comprehensive method of performing all major checks, specifically issues pertaining to NSG, UDR, and blocked ports and reduces the Mean Time To Resolution (MTTR). It also provides actionable insights where a step-by-step guide or corresponding documentation is provided for faster resolution. 

> [!IMPORTANT]
> 
> Ensure that the `AzureNetworkWatcherExtension` VM extension is installed on the VM that you troubleshoot from.
> - To install the extension on a Windows VM, see [Azure Network Watcher Agent virtual machine extension for Windows](../virtual-machines/extensions/network-watcher-windows.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json)
> - To install the extension on a Linux VM, see [Azure Network Watcher Agent virtual machine extension for Linux](../virtual-machines/extensions/network-watcher-linux.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json). 
> 
> The extension isn't required on the destination endpoint.

## Response

The following table shows the properties returned when connection troubleshoot has finished running.

|Property  |Description  |
|---------|---------|
|ConnectionStatus     | The status of the connectivity check. Possible results are **Reachable** and **Unreachable**.        |
|AvgLatencyInMs     | Average latency during the connectivity check, in milliseconds. (Only shown if check status is reachable)        |
|MinLatencyInMs     | Minimum latency during the connectivity check, in milliseconds. (Only shown if check status is reachable)        |
|MaxLatencyInMs     | Maximum latency during the connectivity check, in milliseconds. (Only shown if check status is reachable)        |
|ProbesSent     | Number of probes sent during the check. Max value is 100.        |
|ProbesFailed     | Number of probes that failed during the check. Max value is 100.        |
|Hops     | Hop by hop path from source to destination.        |
|Hops[].Type     | Type of resource. Possible values are **Source**, **VirtualAppliance**, **VnetLocal**, and **Internet**.        |
|Hops[].Id | Unique identifier of the hop.|
|Hops[].Address | IP address of the hop.|
|Hops[].ResourceId | ResourceID of the hop if the hop is an Azure resource. If it's an internet resource, ResourceID is **Internet**. |
|Hops[].NextHopIds | The unique identifier of the next hop taken.|
|Hops[].Issues | A collection of issues that were encountered during the check at that hop. If there were no issues, the value is blank.|
|Hops[].Issues[].Origin | At the current hop, where issue occurred. Possible values are:<br/> **Inbound** - Issue is on the link from the previous hop to the current hop<br/>**Outbound** - Issue is on the link from the current hop to the next hop<br/>**Local** - Issue is on the current hop.|
|Hops[].Issues[].Severity | The severity of the issue detected. Possible values are **Error** and **Warning**. |
|Hops[].Issues[].Type |The type of issue found. Possible values are: <br/>**CPU**<br/>**Memory**<br/>**GuestFirewall**<br/>**DnsResolution**<br/>**NetworkSecurityRule**<br/>**UserDefinedRoute** |
|Hops[].Issues[].Context |Details regarding the issue found.|
|Hops[].Issues[].Context[].key |Key of the key value pair returned.|
|Hops[].Issues[].Context[].value |Value of the key value pair returned.|

The following is an example of an issue found on a Hop.

```json
"Issues": [
    {
        "Origin": "Outbound",
        "Severity": "Error",
        "Type": "NetworkSecurityRule",
        "Context": [
            {
                "key": "RuleName",
                "value": "UserRule_Port80"
            }
        ]
    }
]
```
## Fault types

The Connection troubleshoot feature returns fault types about the connection. The following table lists the current fault types returned.

|Type  |Description  |
|---------|---------|
|CPU     | High CPU utilization.       |
|Memory     | High Memory utilization.       |
|GuestFirewall     | Traffic is blocked due to a virtual machine firewall configuration.        |
|DNSResolution     | DNS resolution failed for the destination address.        |
|NetworkSecurityRule    | Traffic is blocked by an NSG Rule (Rule is returned)        |
|UserDefinedRoute|Traffic is dropped due to a user defined or system route. |

### Next steps

Learn how to troubleshoot connections using the [Azure portal](network-watcher-connectivity-portal.md), [PowerShell](network-watcher-connectivity-powershell.md), the [Azure CLI](network-watcher-connectivity-cli.md), or [REST API](network-watcher-connectivity-rest.md).
