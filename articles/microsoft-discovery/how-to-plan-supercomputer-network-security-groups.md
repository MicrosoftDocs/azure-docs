---
title: Plan network security groups for a Microsoft Discovery Supercomputer
description: Learn how to plan network security group rules for a Microsoft Discovery Supercomputer that uses user-defined routing, without breaking cluster connectivity.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: how-to
ms.date: 09/09/2026
ms.custom: networking

#CustomerIntent: As a Discovery administrator, I want to plan network security group rules for a hardened supercomputer so that I control egress without breaking cluster connectivity.
---

# Plan network security groups for a Microsoft Discovery Supercomputer

Route tables control where traffic goes. Network security groups control whether traffic can go there at all. A supercomputer that uses `UserDefinedRouting` needs both planned deliberately.

The two controls fail in different ways. A missing route silently blackholes traffic. A missing allow rule produces a visible deny. This article shows you how to plan the network security group rules for a hardened supercomputer.

The rules here are a starting point, not a complete egress policy. Many supercomputer dependencies are fully qualified domain name (FQDN) based, and you can't express them in a network security group. Use these rules together with the FQDN allow list in [Configure secure networking for a Microsoft Discovery Supercomputer](how-to-configure-supercomputer-network-security.md) and the authoritative [AKS outbound network and FQDN rules](/azure/aks/outbound-rules-control-egress) for your exact cluster configuration.

## Prerequisites

- A Microsoft Discovery Supercomputer that uses `UserDefinedRouting`. To set up this configuration, see [Configure secure networking for a Microsoft Discovery Supercomputer](how-to-configure-supercomputer-network-security.md).
- An egress point that can allow list IP addresses and FQDNs, such as [Azure Firewall](/azure/firewall/overview).
- Permissions to create and modify network security groups and their rules.

## Plan rule order and priority

An unmodified network security group isn't a default-deny starting state. It permits all traffic inside the virtual network (`AllowVnetInBound` and `AllowVnetOutBound`, priority 65000). It also permits all outbound traffic to the internet (`AllowInternetOutBound`, priority 65001).

Restricting traffic is an explicit act. You add the allow rules your supercomputer depends on. Then you add a rule that denies the remainder at a priority below 65000, so it takes precedence over the defaults.

Order the work so a partial configuration never breaks connectivity:

1. Add every allow rule, and confirm the cluster is healthy.
1. Add the catch-all deny rules last.
1. Re-verify health, and keep flow logging enabled through the transition.

If you add a deny rule first, or in the same deployment as an incomplete allow list, the node pools go offline.

Azure processes rules in ascending priority order, and evaluation stops at the first match. Keep two consequences in mind:

- A broad allow rule at a low priority number supersedes every narrower rule after it. An outbound rule that allows the `Internet` service tag on port 443 matches almost everything a supercomputer sends. The service-tag rules that follow never evaluate, and the allow list becomes decorative rather than enforcing.
- A narrower rule placed after a broader deny never takes effect.

Inbound and outbound rules occupy separate priority spaces. An inbound rule at priority 100 doesn't conflict with an outbound rule at priority 100. Reserve a contiguous band for your rules, and leave gaps so you can insert a dependency later without renumbering. If your organization applies rules through Azure Policy, find out which priority ranges those rules occupy first.

For evaluation semantics, see [How network security groups filter network traffic](/azure/virtual-network/network-security-group-how-it-works).

## Attach rules to the correct network security group

A supercomputer that uses `UserDefinedRouting` has at least two subnets with different roles. Each subnet needs its own network security group. A correct rule attached to the wrong network security group doesn't take effect. This mistake is one of the most common causes of a configuration that looks right and still fails.

The following examples use this addressing. Substitute your own ranges, and use the specific subnet prefixes rather than a summary range, so the node and management tiers stay separated.

| Subnet | Example range | Role |
|---|---|---|
| System nodes | `10.60.0.0/26` | Supercomputer system node pool |
| Workload node pools | `10.60.0.64/26` | Workload node pools |
| Management | `10.60.1.64/27` | API server internal load balancer. Delegated to `Microsoft.ContainerService/managedClusters` |
| Pod CIDR | `10.244.0.0/16` | Azure CNI Overlay default. Not a subnet |

In the following tables, *node subnets* means both `10.60.0.0/26` and `10.60.0.64/26`.

## Configure node subnet rules

Attach these rules to the network security group on the system and workload node pool subnets.

Add the following inbound rules:

| Priority | Name | Protocol | Source | Destination | Ports |
|---|---|---|---|---|---|
| 100 | `Allow-LB-Probe-In` | TCP | `AzureLoadBalancer` | Node subnets | Your configured health probe ports |
| 110 | `Allow-Apiserver-To-Kubelet-In` | TCP | `10.60.1.64/27` | Node subnets | 10250 |
| 120 | `Allow-Node-To-Node-In` | Any | Node subnets | Node subnets | Any |
| 4000 | `Deny-All-In` | Any | Any | Any | Any |

The `AzureLoadBalancer` service tag represents health probe infrastructure only. Azure Load Balancer preserves the original client source address, so this tag doesn't match client traffic that arrives through a load balancer. Don't use it to authorize application ingress, and don't open the entire `30000-32767` NodePort range to it. Allow only the probe ports your load balancer actually uses.

To admit client traffic to a service exposed through a load balancer, add a separate rule. Set its source to the intended client prefix or service tag, and set its destination ports to the specific listener or NodePorts for that service.

Don't add an inbound rule that allows the Microsoft Discovery service prefixes to reach the node subnets. Discovery traffic is outbound-initiated and returns on the existing stateful flow. A rule of that shape permits unsolicited traffic from public sources to your entire node range without a corresponding requirement.

Add the following outbound rules, and set the source on every rule to the node subnets:

| Priority | Name | Protocol | Destination | Ports | Purpose |
|---|---|---|---|---|---|
| 200 | `Allow-Node-To-Apiserver-Out` | TCP | `10.60.1.64/27` | 443, 4443 | API server internal load balancer |
| 210 | `Allow-Node-To-Node-Out` | TCP | Node subnets | 80, 10091, 10092, 10249, 10250 | kubelet and kube-proxy between nodes |
| 220 | `Allow-HostAgent-Out` | TCP | `168.63.129.16/32` | 80, 32526 | Azure guest agent goal state and extension handler |
| 225 | `Allow-NTP-Out` | UDP | Your NTP servers | 123 | Time synchronization |
| 230 | `Allow-Storage-Out` | TCP | `Storage.<region>` | 443 | Node artifacts and workload storage |
| 231 | `Allow-KeyVault-Out` | TCP | `AzureKeyVault.<region>` | 443 | Secrets retrieval |
| 232 | `Allow-Cosmos-Out` | TCP | `AzureCosmosDB.<region>` | 443 | Service state |
| 233 | `Allow-Search-Out` | TCP | `AzureCognitiveSearch` | 443 | Search integration |
| 234 | `Allow-EntraID-Out` | TCP | `AzureActiveDirectory` | 443 | Token acquisition |
| 235 | `Allow-Monitor-Out` | TCP | `AzureMonitor` | 443 | Logs and metrics |
| 236 | `Allow-ACR-Out` | TCP | `AzureContainerRegistry.<region>` | 443 | Regional registry |
| 237 | `Allow-ARM-Out` | TCP | `AzureResourceManager` | 443 | Control plane calls |
| 238 | `Allow-MCR-Out` | TCP | `MicrosoftContainerRegistry.<region>` | 443 | Regional registry endpoints |
| 239 | `Allow-FrontDoor-FirstParty-Out` | TCP | `AzureFrontDoor.FirstParty` | 443 | Container image endpoints |
| 240 | `Allow-FrontDoor-Frontend-Out` | TCP | `AzureFrontDoor.Frontend` | 443 | OS package endpoints |
| 4000 | `Deny-All-Out` | Any | Any | Any | Default-deny egress |

Time synchronization matters more than it appears. If node clocks drift, Microsoft Entra token validation fails. The cluster then develops authentication errors that look unrelated to networking. Point rule 225 at your organization's NTP servers. Don't use `168.63.129.16` as an NTP destination, because current AKS Linux node images don't use it for time.

## Configure management subnet rules

Attach these rules to the network security group on the delegated management subnet. This subnet hosts the API server internal load balancer. Add rules that authorize node-to-API-server traffic as inbound rules. An outbound rule on the node subnet alone doesn't authorize the traffic that arrives at the management subnet.

| Direction | Priority | Name | Protocol | Source | Destination | Ports |
|---|---|---|---|---|---|---|
| Inbound | 100 | `Allow-Node-To-Apiserver-In` | TCP | Node subnets | `10.60.1.64/27` | 443, 4443 |
| Inbound | 110 | `Allow-LB-Probe-In` | TCP | `AzureLoadBalancer` | `10.60.1.64/27` | Your configured probe ports |

Port 443 is the load balancer frontend, and 4443 is the backend listener. Allow both. The port visible at each evaluation point differs, and allowing only one port produces intermittent failures that are hard to attribute.

Add these rules before you introduce any inbound deny that overrides `AllowVnetInBound`. If the deny takes effect first, nodes lose contact with the API server and the cluster degrades.

## Account for Azure platform endpoints

A catch-all deny rule doesn't block some platform traffic, because Azure handles it inside the host:

- Platform DNS (`168.63.129.16` on port 53).
- Instance Metadata Service (`169.254.169.254` on port 80), which is how managed identities obtain tokens.

Don't add allow rules for these endpoints, and don't expect a `Deny-All-Out` rule to affect them. Azure provides the `AzurePlatformDNS` and `AzurePlatformIMDS` service tags so you can disable these defaults if you intend to. Use them only deliberately. Denying IMDS breaks managed identity, and denying platform DNS breaks name resolution.

Rule 220 in the node outbound table covers the guest agent's goal-state and extension-handler ports. That function is separate from platform DNS on the same address.

You also can't create user-defined routes for `168.63.129.16/32` or `169.254.169.254/32`. Azure reserves both address spaces, and route creation fails with `AddressPrefixInRestrictedAddressSpace`. No bypass route is needed, because this traffic never traverses your route table.

## Verify service tag membership

Container image and OS package endpoints resolve into Azure Front Door service tags rather than the registry and package tags their names suggest. This behavior is why rules 239 and 240 exist alongside 236 and 238. It's also the most common reason a carefully built allow list still fails to pull images.

Treat this as a reason to verify tag membership for your own region and configuration, not as a permanent mapping. Service tag contents change. A hostname that resolves into a tag today isn't contractually bound to stay there. `AzureFrontDoor.Frontend` in particular covers shared address space that's far broader than the endpoint you need.

The durable approach is to enforce FQDN dependencies on an FQDN-aware firewall or proxy using the documented FQDN list. Use network security group service tags only as a coarse complement. Don't convert a point-in-time DNS lookup into a static IP allow list.

## Configure pod CIDR rules for delegated subnets

With Azure CNI Overlay, pod-to-pod traffic on supercomputer node subnets doesn't traverse the subnet network security group. Pod CIDR rules there have no effect. Don't rely on them for pod segmentation. Use [Kubernetes network policy](/azure/aks/use-network-policies) instead.

Delegated subnets that host other Discovery components can behave differently. Some delegated managed environments run their own overlay without source network address translation for intra-virtual-network flows. In that case, the subnet's network security group can see pod overlay addresses. The overlay CIDR sits outside the virtual network's declared prefix, so `AllowVnetInBound` and `AllowVnetOutBound` don't cover it, and provisioning stalls until you add explicit pod CIDR rules. If a delegated subnet's resources fail to provision, add allow rules that cover the pod CIDR in both directions on that subnet's network security group.

## Verify the egress path

Network security group rules and route tables can both be correct while traffic still fails. Before you deploy, confirm the following conditions:

- A default route exists from every node subnet toward your egress appliance.
- IP forwarding is enabled on the appliance's network interface, if it's a network virtual appliance.
- The appliance performs source network address translation to a routable public address for internet-bound traffic, and has enough port capacity.
- Request and response traverse the same stateful device. If different destination prefixes route to different appliances, asymmetric paths drop traffic that either appliance would individually permit.
- The appliance's FQDN rules allow the documented dependencies, in addition to your network security group rules.

## Inventory an existing virtual network

Deploying into a virtual network that already carries other workloads is a common source of avoidable failures. Confirm the following conditions:

- Address space is genuinely free. Verify your planned ranges aren't already assigned to another subnet, a peered network, or an on-premises range advertised into the network. An overlap that's invisible in the Azure portal can still exist in a partner firewall's address objects.
- Subnet delegation is correct and exclusive. The management subnet must be delegated to `Microsoft.ContainerService/managedClusters` and not shared with another service.
- Inherited rules are understood. Note rules already present, including policy-applied rules, and confirm none deny traffic your supercomputer needs.

Enabling [API Server VNet Integration](/azure/aks/api-server-vnet-integration) keeps node-to-API-server traffic on the virtual network path. It doesn't by itself remove every externally resolvable endpoint or eliminate other outbound dependencies. Treat the [AKS outbound rules](/azure/aks/outbound-rules-control-egress) as the authoritative baseline, and layer your restrictions on top.

## Enable flow logs for diagnosis

Enable [virtual network flow logs](/azure/network-watcher/vnet-flow-logs-overview) before you tighten rules, not after something breaks. Flow logs record the rule that matched each flow, which turns an ambiguous timeout into a specific answer.

Virtual network flow logs replace network security group flow logs, which you can no longer create. If you have existing network security group flow logs, see [Migrate to virtual network flow logs](/azure/network-watcher/nsg-flow-logs-migrate).

When you read the logs, keep three limitations in mind:

- Absence of a denied flow isn't proof of an allow. Traffic dropped by a route table, an egress appliance, or a DNS failure never reaches network security group evaluation, so it produces no deny record. A symptom with no matching deny entry points toward routing, the firewall, or name resolution instead.
- Absence of traffic isn't proof that a rule is unnecessary. A capture only observes the lifecycle events it covers. Rules that carry traffic only during node bootstrap, upgrade, or failover show nothing in a steady-state capture. Don't remove a rule solely because it matched nothing.
- Flow logs are aggregated, not real time. Allow several collection intervals to elapse before you conclude a flow didn't occur.

## Troubleshoot nodes that never reach the Ready state

Nodes provision at the infrastructure layer but never join the cluster, and the supercomputer stays in a provisioning or failed state. Bootstrap failures happen before any of your containers run, so application logs contain nothing useful.

A blocked outbound dependency is the most common cause, but not the only one. Work through these checks:

- Check name resolution. Confirm nodes can resolve `mcr.microsoft.com` and `management.azure.com`, and that responses return along the same path the query took.
- Check outbound dependencies. Compare your rules against the outbound table and the [AKS outbound rules](/azure/aks/outbound-rules-control-egress). Container image and OS package endpoints are the most commonly missed, because they resolve into Azure Front Door service tags rather than the registry and package tags.
- Check API server connectivity. Verify the node subnet can reach the management subnet on both 443 and 4443, and that the rules exist on the management subnet's network security group, not only on the node subnet's.
- Check flow logs. Look for denied outbound flows from the node subnets during the provisioning window. A deny record names the responsible rule.
- Look past the network security group if there are no deny records. Check effective routes on the node subnet, and check the egress appliance for drops and for source network address translation port exhaustion.
- Check the management subnet configuration. Confirm the subnet exists, is delegated to `Microsoft.ContainerService/managedClusters`, and isn't shared with another service.
- Check capacity and identity. Look for subnet IP exhaustion, compute quota limits, denied Azure Policy assignments, and managed identity or role assignment failures.
- Check extension status. Inspect the virtual machine scale set instance and extension provisioning state for the specific failure reported.

After you restore connectivity, try the supported recovery path before you recreate anything. Reconcile the cluster, then repair or reimage the affected instances. Recreate the node pool only if the instances remain in a terminal failed state. Account for workload evacuation and system node pool constraints before you do.

## Related content

- [Configure secure networking for a Microsoft Discovery Supercomputer](how-to-configure-supercomputer-network-security.md)
- [AKS outbound network and FQDN rules](/azure/aks/outbound-rules-control-egress)
- [How network security groups filter network traffic](/azure/virtual-network/network-security-group-how-it-works)
