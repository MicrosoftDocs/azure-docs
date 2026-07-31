---
title: Connection Troubleshoot Overview
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher connection troubleshoot tool, the issues it can detect, and the responses it gives.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: concept-article
ms.date: 04/08/2026

# Customer intent: As an Azure administrator, I want to understand the capabilities of the Connection troubleshoot tool so that I can effectively diagnose and resolve network connectivity issues in my cloud infrastructure.
---

# Connection troubleshoot overview

With the increase of sophisticated and high-performance workloads in Azure, there's a critical need for increased visibility and control over the operational state of complex networks running these workloads. Such complex networks are implemented using network security groups, firewalls, user-defined routes, and resources provided by Azure. Complex configurations make troubleshooting connectivity issues challenging.

The connection troubleshoot feature of Azure Network Watcher helps reduce the amount of time to diagnose and troubleshoot network connectivity issues. The results returned can provide insights about the root cause of the connectivity problem and whether it's due to a platform or user configuration issue.

Connection troubleshoot reduces the Mean Time To Resolution (MTTR) by providing a comprehensive method of performing all connection major checks to detect issues pertaining to network security groups, user-defined routes, and blocked ports. It provides the following results with actionable insights where a step-by-step guide or corresponding documentation is provided for faster resolution:

- Connectivity test with different destination types (VM, URI, FQDN, or IP Address)
- Configuration issues that impact reachability
- Latency (minimum, maximum, and average between source and destination)
- Graphical topology view from source to destination
- Number of probes failed during the connection troubleshoot check

## Agentless experience (preview)

Connection troubleshoot now supports an agentless experience (currently in preview). You no longer need to install the Network Watcher agent virtual machine extension on your virtual machines to run connectivity tests. Features and functionality may change before general availability.

Previously, connectivity tests with Connection troubleshoot required that the source virtual machine had the Network Watcher agent VM extension installed. This extension was necessary to run tests from the VM.

### What's new

With the agentless experience, you can now run connectivity tests between Azure resources without installing any diagnostic agent or VM extension. This simplifies setup, reduces operational overhead, and enables faster troubleshooting directly from the Azure portal.

- **No agent installation required**: Connectivity tests can be initiated without deploying or updating the Network Watcher agent VM extension on your Windows or Linux virtual machines.
- **Streamlined experience**: All diagnostics are performed using Azure platform APIs, making the process seamless and efficient.

## Supported source and destination types

Connection troubleshoot provides the capability to check TCP or ICMP connections from any of these Azure resources:

- Virtual machines
- Virtual machine scale sets
- Azure Bastion instances
- Application gateways v2 except for gateways enrolled in the [Private Application Gateway deployment](../application-gateway/application-gateway-private-deployment.md)


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

> [!div class="mx-tableFixed"]
> | Property | Description |
> | -------- | ----------- |
> | ConnectionStatus | The status of the connectivity check. Possible results are **Reachable** and **Unreachable**. |
> | AvgLatencyInMs | Average latency during the connectivity check, in milliseconds. (Only shown if check status is reachable). |
> | MinLatencyInMs | Minimum latency during the connectivity check, in milliseconds. (Only shown if check status is reachable). |
> | MaxLatencyInMs | Maximum latency during the connectivity check, in milliseconds. (Only shown if check status is reachable). |
> | ProbesSent | Number of probes sent during the check. Maximum value is 100. |
> | ProbesFailed | Number of probes that failed during the check. Maximum value is 100. |
> | Hops | Hop by hop path from source to destination. |
> | Hops[].Type | Type of resource. Possible values are: **Source**, **VirtualAppliance**, **VnetLocal**, and **Internet**. |
> | Hops[].Id | Unique identifier of the hop. |
> | Hops[].Address | IP address of the hop. |
> | Hops[].ResourceId | Resource ID of the hop if the hop is an Azure resource. If it's an internet resource, ResourceID is **Internet**. |
> | Hops[].NextHopIds | The unique identifier of the next hop taken. |
> | Hops[].Issues | A collection of issues that were encountered during the check of the hop. If there were no issues, the value is blank. |
> | Hops[].Issues[].Origin | At the current hop, where issue occurred. Possible values are: <br>**Inbound:** Issue is on the link from the previous hop to the current hop. <br>**Outbound:** Issue is on the link from the current hop to the next hop. <br>**Local:** Issue is on the current hop. |
> | Hops[].Issues[].Severity | The severity of the detected issue. Possible values are: **Error** and **Warning**. |
> | Hops[].Issues[].Type | The type of the detected issue. Possible values are: <br>**CPU** <br>**Memory** <br>**GuestFirewall** <br>**DnsResolution** <br>**NetworkSecurityRule** <br>**UserDefinedRoute** |
> | Hops[].Issues[].Context | Details regarding the detected issue. |
> | Hops[].Issues[].Context[].key | Key of the key value pair returned. |
> | Hops[].Issues[].Context[].value | Value of the key value pair returned. |
> | NextHopAnalysis.NextHopType | The type of next hop. Possible values are: <br>**HyperNetGateway** <br>**Internet** <br>**None** <br>**VirtualAppliance** <br>**VirtualNetworkGateway** <br>**VnetLocal** |
> | NextHopAnalysis.NextHopIpAddress | IP address of next hop. |
> |  | The resource identifier of the route table associated with the route being returned. If the returned route doesn't correspond to any user created routes, then this field will be the string **System Route**. |
> | SourceSecurityRuleAnalysis.Results[].Profile | Network configuration diagnostic profile. |
> | SourceSecurityRuleAnalysis.Results[].Profile.Source | Traffic source. Possible values are: *****, **IP Address/CIDR**, and **Service Tag**. |
> | SourceSecurityRuleAnalysis.Results[].Profile.Destination | Traffic destination. Possible values are: *****, **IP Address/CIDR**, and **Service Tag**. |
> | SourceSecurityRuleAnalysis.Results[].Profile.DestinationPort | Traffic destination port. Possible values are: * and a single port in the (0 - 65535) range. |
> | SourceSecurityRuleAnalysis.Results[].Profile.Protocol | Protocol to be verified. Possible values are: *****, **TCP** and **UDP**. |
> | SourceSecurityRuleAnalysis.Results[].Profile.Direction | The direction of the traffic. Possible values are: **Outbound** and **Inbound**. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult | Network security group result. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[] | List of results network security groups diagnostic. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.SecurityRuleAccessResult | The network traffic is allowed or denied. Possible values are: **Allow** and **Deny**. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[].AppliedTo | Resource ID of the NIC or subnet to which network security group is applied. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[].MatchedRule | Matched network security rule. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[].MatchedRule.Action | The network traffic is allowed or denied. Possible values are: **Allow** and **Deny**. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[].MatchedRule.RuleName | Name of the matched network security rule. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.EvaluatedSecurityGroups[].NetworkSecurityGroupId | Network security group ID. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[] | List of network security rules evaluation results. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].DestinationMatched | Value indicates if destination is matched. Boolean values. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].DestinationPortMatched | Value indicates if destination port is matched. Boolean values. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].Name | Name of the network security rule. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].ProtocolMatched | Value indicates if protocol is matched. Boolean values. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].SourceMatched | Value indicates if source is matched. Boolean values. |
> | SourceSecurityRuleAnalysis.Results[].NetworkSecurityGroupResult.RulesEvaluationResult[].SourcePortMatched | Value indicates if source port is matched. Boolean values. |
> | DestinationSecurityRuleAnalysis | Same as SourceSecurityRuleAnalysis format. |
> | SourcePortStatus | Determines whether the port at source is reachable or not. Possible Values are: <br>**Unknown** <br>**Reachable** <br>**Unstable** <br>**NoConnection** <br>**Timeout** |
> | DestinationPortStatus | Determines whether the port at destination is reachable or not. Possible Values are: <br>**Unknown** <br>**Reachable** <br>**Unstable** <br>**NoConnection** <br>**Timeout** |

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

## Errors

Connection troubleshoot returns the following error messages.

| IssueType | Description |
|----|----|
| **AgentStopped** | The Network Watcher agent on the source VM has stopped or is unresponsive. |
| **GuestFirewall** | Traffic is being blocked by the guest OS firewall on the source or destination VM. |
| **DNSResolution** | The DNS lookup for the destination hostname failed on the source agent. |
| **SocketError** | The source agent failed to bind or listen on the required local socket (for example, **SocketBindFailed** or **ListenFailed**). |
| **NetworkSecurityRule** | An NSG rule is denying inbound or outbound traffic between the source and destination. |
| **UserDefinedRoute** | A UserDefinedRoute was found that routes traffic to a *None* next hop, creating a blackhole routing. |
| **Platform** | An Azure platform-level issue is affecting connectivity. |
| **NetworkError** | A generic network failure occurred (for example, connection timed out, connect failed, no response, or send/receive failure). |
| **CPU** | CPU usage on the source or destination VM exceeded threshold. |
| **Memory** | Memory usage on the source or destination VM exceeded threshold. |
| **ARPMissing** | The ARP table on the Microsoft Edge (ExpressRoute) hop is missing or has an incomplete entry for the customer/Microsoft edge IP. |
| **RouteMissing** | Raised when no valid route to the destination can be found at a hop. |
| **VMRebooting** | The source or destination VM is currently in a rebooting state. |
| **VMNotAllocated** | VM isn't allocated (deallocated/stopped). |
| **NoListenerOnDestination** | The destination connectivity check confirmed that no process is listening on the specified port. |
| **DIPProbeDown** | The SLB health probe reports the backend DIP (destination IP) as *Down*. |
| **NoRouteLearned** | The SLB or Virtual Hub found no effective route to the destination. |
| **PeeringInfoNotFound** | The peering information between two VNets couldn't be retrieved. |
| **VMStarting** | The destination VM is in a starting state and isn't yet ready to accept traffic. |
| **VMStopped** | The destination VM is stopped (but still allocated), so it can't accept network traffic. |
| **VMStopping** | The destination VM is in the process of stopping and isn't reliably accepting traffic. |
| **VMDeallocating** | The destination VM is being deallocated and is in the process of releasing its resources, making it temporarily unreachable. |
| **VMDeallocated** | The destination VM has been fully deallocated. |
| **SystemError** | An internal system or infrastructure error occurred. |
| **UDRLoop** | User Defined Route found. This results in a routing loop, as the next hop IP matches the current hop IP. |
| **IPForwardingNotEnabled** | The NVA (virtual appliance) VM that traffic is routed through doesn't have IP forwarding enabled on its NIC. |
| **VnetAccessNotAllowed** | The virtual network peering link has <u>AllowVNetAccess</u> set to **false**, blocking traffic from crossing the peering boundary. |
| **AllowGatewayTransitNotEnabled** | The peering on the hub/gateway side doesn't have <u>AllowGatewayTransit</u> enabled. |
| **MultiNICsInSameSubnet** | Multiple NICs on the VM are in the same subnet, which can cause asymmetric routing and unpredictable traffic behavior. |
| **StandardILBOutboundInternetNotAllowed** | Raised when a VM in the backend pool of a Standard Internal Load Balancer attempts to reach the internet — Standard ILB backends have no default outbound internet access, unlike Basic ILB. |
| **MultiNICsInSameSubnetWithWeakHostSendEnabled** | Multiple NICs are in the same subnet and weak host send is enabled, which can cause traffic to egress from an unexpected interface. |
| **MultiNICsInSameSubnetWithWeakHostEnabled** | Multiple NICs are in the same subnet and weak host (send/receive) is enabled on the VM, which may route packets through unintended interfaces. |
| **SourcePortInUse** | The source port selected by the agent is already in **TIME_WAIT** state (a lingering TCP socket), preventing a new connection from being established from that port. |
| **InvalidResponseFromServer** | A DNS probe queried the server but received no matching records. |
| **DNSResponseValidationFailed** | The DNS probe response failed a configured validation rule (for example, wrong record count, wrong recursion support, wrong RCode, or wrong authority flag). |
| **UnsupportedSystem** | The agent is running on an OS or system configuration that doesn't support the requested probe type. |
| **IncompleteTopology** | Service couldn't build a complete hop path to the destination. |
| **DestinationUnreachable** | Agent on the source machine was unable to reach the destination. |
| **TraceRouteUnavailable** | The agent didn't return a traceroute result (no paths), so can't determine the connectivity status between source and destination. |
| **DestinationPartiallyReachable** | Some but not all traceroute paths from the agent successfully reached the destination. |
| **GatewayNotProvisioned** | The VPN/ExpressRoute gateway returned a **GatewayNotProvisioned** error. |
| **ResourceHealthUnavailable** | Azure Resource Health reports the hop resource (VM, gateway, firewall, etc.) as **Unavailable**. |
| **ResourceHealthDegraded** | Azure Resource Health reports the hop resource as **Degraded**. |
| **VirtualHubNotProvisioned** | The Virtual WAN Hub associated with the path isn't in a <u>Succeeded</u> provisioning state. |
| **StatusCodeValidationFailed** | The HTTP probe received a response but the returned HTTP status code didn't match the expected value. |
| **HeaderValidationFailed** | The HTTP probe received a response but one or more expected HTTP response headers were missing or didn't match. |
| **ContentValidationFailed** | The HTTP probe received a response but the response body content didn't match the expected value. |
| **NoConnectionConfigured** | No connection is configured between the source and destination endpoints in the connection monitor settings. |
| **ConnectionStateDisconnected** | The monitored connection is in a disconnected state, indicating a break in the logical connection path. |
| **BasicILBNotSupportedWithGlobalPeering** | A Basic Internal Load Balancer doesn't support Global virtual network Peering. |
| **BGPRoutePropogationDisabled** | BGP route propagation is disabled on the route table associated with the source subnet. |
| **UseRemoteGatewaysNotEnabled** | The peering on the spoke side doesn't have UseRemoteGateways enabled. |
| **UnexpectedVirtualNetworkGatewayConnection** | A virtual network gateway connection was found on the path that wasn't expected. |

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
> [Troubleshoot connections using the Azure portal](connection-troubleshoot-portal.md)
