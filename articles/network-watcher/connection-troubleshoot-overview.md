---
title: Connection troubleshoot overview
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher connection troubleshoot tool, the issues it can detect, and the responses it gives.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: concept-article
ms.date: 09/13/2023
#CustomerIntent: As an Azure administrator, I want to learn what connectivity problems I can use Connection Troubleshoot to diagnose so I can resolve those problems.
---

# Connection troubleshoot overview

With the increase of sophisticated and high-performance workloads in Azure, there's a critical need for increased visibility and control over the operational state of complex networks running these workloads. Such complex networks are implemented using network security groups, firewalls, user-defined routes, and resources provided by Azure. Complex configurations make troubleshooting connectivity issues challenging.

The connection troubleshoot feature of Azure Network Watcher helps reduce the amount of time to diagnose and troubleshoot network connectivity issues. The results returned can provide insights about the root cause of the connectivity problem and whether it's due to a platform or user configuration issue.

Connection troubleshoot reduces the Mean Time To Resolution (MTTR) by providing a comprehensive method of performing all connection major checks to detect issues pertaining to network security groups, user-defined routes, and blocked ports. It provides the following results with actionable insights where a step-by-step guide or corresponding documentation is provided for faster resolution:

- Connectivity test with different destination types (VM, URI, FQDN, or IP Address)
- Configuration issues that impact reachability
- All possible hop by hop paths from the source to destination
- Hop by hop latency
- Latency (minimum, maximum, and average between source and destination)
- Graphical topology view from source to destination
- Number of probes failed during the connection troubleshoot check

## Supported source and destination types

Connection troubleshoot provides the capability to check TCP or ICMP connections from any of these Azure resources:

- Virtual machines
- Virtual machine scale sets
- Azure Bastion instances
- Application gateways (except v1)

> [!IMPORTANT]
> Connection troubleshoot requires that the virtual machine you troubleshoot from has the `AzureNetworkWatcherExtension` extension installed. The extension is not required on the destination virtual machine.
> - To install the extension on a Windows VM, see [Azure Network Watcher Agent virtual machine extension for Windows](../virtual-machines/extensions/network-watcher-windows.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).
> - To install the extension on a Linux VM, see [Azure Network Watcher Agent virtual machine extension for Linux](../virtual-machines/extensions/network-watcher-linux.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

Connection troubleshoot can test connections to any of these destinations:

- Virtual machines
- Fully qualified domain names (FQDNs)
- Uniform resource identifiers (URIs)
- IP addresses

## Issues detected by connection troubleshoot

Connection troubleshoot can detect the following types of issues that can impact connectivity:

- High VM CPU utilization
- High VM memory utilization
- Virtual machine (guest) firewall rules blocking traffic
- DNS resolution failures
- Misconfigured or missing routes
- Network security group (NSG) rules that are blocking traffic
- Inability to open a socket at the specified source port
- Missing address resolution protocol entries for Azure ExpressRoute circuits
- Servers not listening on designated destination ports

## Response

The following table shows the properties returned after running connection troubleshoot.

| Property | Description |
| -------- | ----------- |
| ConnectionStatus | The status of the connectivity check. Possible results are **Reachable** and **Unreachable**. |
| AvgLatencyInMs | Average latency during the connectivity check, in milliseconds. (Only shown if check status is reachable). |
| MinLatencyInMs | Minimum latency during the connectivity check, in milliseconds. (Only shown if check status is reachable). |
| MaxLatencyInMs | Maximum latency during the connectivity check, in milliseconds. (Only shown if check status is reachable). |
| ProbesSent | Number of probes sent during the check. Maximum value is 100. |
| ProbesFailed | Number of probes that failed during the check. Maximum value is 100. |
| Hops | Hop by hop path from source to destination. |
| Hops[].Type | Type of resource. Possible values are: **Source**, **VirtualAppliance**, **VnetLocal**, and **Internet**. |
| Hops[].Id | Unique identifier of the hop. |
| Hops[].Address | IP address of the hop. |
| Hops[].ResourceId | Resource ID of the hop if the hop is an Azure resource. If it's an internet resource, ResourceID is **Internet**. |
| Hops[].NextHopIds | The unique identifier of the next hop taken. |
| Hops[].Issues | A collection of issues that were encountered during the check of the hop. If there were no issues, the value is blank. |
| Hops[].Issues[].Origin | At the current hop, where issue occurred. Possible values are: <br>**Inbound** - Issue is on the link from the previous hop to the current hop. <br>**Outbound** - Issue is on the link from the current hop to the next hop. <br>**Local** - Issue is on the current hop. |
| Hops[].Issues[].Severity | The severity of the detected issue. Possible values are: **Error** and **Warning**. |
| Hops[].Issues[].Type | The type of the detected issue. Possible values are: <br>**CPU** <br>**Memory** <br>**GuestFirewall** <br>**DnsResolution** <br>**NetworkSecurityRule** <br>**UserDefinedRoute** |
| Hops[].Issues[].Context | Details regarding the detected issue. |
| Hops[].Issues[].Context[].key | Key of the key value pair returned. |
| Hops[].Issues[].Context[].value | Value of the key value pair returned. |
| NextHopAnalysis.NextHopType | The type of next hop. Possible values are: <br>**HyperNetGateway** <br>**Internet** <br>**None** <br>**VirtualAppliance** <br>**VirtualNetworkGateway** <br>**VnetLocal** |
| NextHopAnalysis.NextHopIpAddress | IP address of next hop. |
|  | The resource identifier of the route table associated with the route being returned. If the returned route doesn't correspond to any user created routes, then this field will be the string **System Route**. |
| SourceSecurityRuleAnalysis.Results[].Profile | Network configuration diagnostic profile. |
| SourceSecurityRuleAnalysis.Results[].Profile.Source | Traffic source. Possible values are: *, **IP Address/CIDR**, and **Service Tag**. |
| SourceSecurityRuleAnalysis.Results[].Profile.Destination | Traffic destination. Possible values are: *, **IP Address/CIDR**, and **Service Tag**. |
| SourceSecurityRuleAnalysis.Results[].Profile.DestinationPort | Traffic destination port. Possible values are: * and a single port in the (0 - 65535) range. |
| SourceSecurityRuleAnalysis.Results[].Profile.Protocol | Protocol to be verified. Possible values are: *, **TCP** and **UDP**. |
| SourceSecurityRuleAnalysis.Results[].Profile.Direction | The direction of the traffic. Possible values are: **Outbound** and **Inbound**. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult | Network security group result. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[] | List of results network security groups diagnostic. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.SecurityRuleAccessResult | The network traffic is allowed or denied. Possible values are: **Allow** and **Deny**. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[].AppliedTo | Resource ID of the NIC or subnet to which network security group is applied. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[].MatchedRule | Matched network security rule. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[].MatchedRule.Action | The network traffic is allowed or denied. Possible values are: **Allow** and **Deny**. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[].MatchedRule.RuleName | Name of the matched network security rule. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[].NetworkSecurityGroupId | Network security group ID. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[] | List of network security rules evaluation results. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].DestinationMatched | Value indicates if destination is matched. Boolean values. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].DestinationPortMatched | Value indicates if destination port is matched. Boolean values. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].Name | Name of the network security rule. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].ProtocolMatched | Value indicates if protocol is matched. Boolean values. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].SourceMatched | Value indicates if source is matched. Boolean values. |
| SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].SourcePortMatched | Value indicates if source port is matched. Boolean values. |
| DestinationSecurityRuleAnalysis | Same as SourceSecurityRuleAnalysis format. |
| SourcePortStatus | Determines whether the port at source is reachable or not. Possible Values are: <br>**Unknown** <br>**Reachable** <br>**Unstable** <br>**NoConnection** <br>**Timeout** |
| DestinationPortStatus | Determines whether the port at destination is reachable or not. Possible Values are: <br>**Unknown** <br>**Reachable** <br>**Unstable** <br>**NoConnection** <br>**Timeout** |

The following example shows an issue found on a hop.

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

Connection troubleshoot returns fault types about the connection. The following table provides a list of the possible returned fault types.

| Type | Description |
| ---- | ----------- |
| CPU | High CPU utilization. |
| Memory | High Memory utilization. |
| GuestFirewall | Traffic is blocked due to a virtual machine firewall configuration. <br><br> A TCP ping is a unique use case in which, if there's no allowed rule, the firewall itself responds to the client's TCP ping request even though the TCP ping doesn't reach the target IP address/FQDN. This event isn't logged. If there's a network rule that allows access to the target IP address/FQDN, the ping request reaches the target server and its response is relayed back to the client. This event is logged in the network rules log. |
| DNSResolution | DNS resolution failed for the destination address. |
| NetworkSecurityRule | Traffic is blocked by a network security group rule (security rule is returned). |
| UserDefinedRoute | Traffic is dropped due to a user defined or system route. |

### Next step

To learn how to use connection troubleshoot to test and troubleshoot connections, continue to:
> [!div class="nextstepaction"]
> [Troubleshoot connections using the Azure portal](network-watcher-connectivity-portal.md)