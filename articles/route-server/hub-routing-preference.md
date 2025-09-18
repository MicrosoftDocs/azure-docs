---
title: Routing preference with Azure Route Server
titleSuffix: Azure Route Server
description: Learn how to configure routing preference in Azure Route Server to control route selection when multiple paths are available to the same destination.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: concept-article
ai-usage: ai-assisted
ms.date: 09/17/2025

#CustomerIntent: As an Azure administrator, I want to understand routing preference in Azure Route Server so that I can control how routes are selected when multiple paths exist to the same destination.
---

# Routing preference with Azure Route Server

When Azure Route Server receives multiple routes to the same destination from different sources, it uses routing preference settings to determine which path to prefer. This feature gives you control over traffic flow in hybrid network scenarios where you have multiple connectivity options such as ExpressRoute, VPN gateways, and network virtual appliances (NVAs).

This article explains how routing preference works, the available configuration options, and best practices for implementing route selection policies.

## What is routing preference?

Routing preference is a feature that allows you to influence how Azure Route Server selects the best path when multiple routes exist for the same destination prefix. This is important in hybrid network architectures where you might have:

- ExpressRoute circuits providing dedicated connectivity to on-premises networks
- Site-to-site VPN connections offering backup or extra connectivity
- Network virtual appliances (such as SD-WAN devices) providing specialized routing capabilities

By configuring routing preference, you can ensure that traffic flows through your preferred connectivity method based on your specific requirements for performance, cost, or redundancy.

## How routing preference works

Azure Route Server uses a hierarchical route selection process to determine the best path for each destination:

### Route selection hierarchy

When Azure Route Server receives multiple routes to the same destination, it evaluates them in the following order:

1. **Longest prefix match (LPM)**: Routes with more specific prefixes (longer subnet masks) are always preferred
2. **Routing preference setting**: Applied when prefix lengths are equal
3. **BGP path attributes**: Used as tiebreakers when other criteria are equal

### Routing preference options

You can configure one of three routing preference settings:

| Preference type | Description | Use case | Behavior |
|---|---|---|---|
| **ExpressRoute preference** (default) | Prioritizes routes learned through ExpressRoute gateways | When you want dedicated ExpressRoute circuits to be the primary path | Routes from ExpressRoute take precedence over VPN and NVA routes |
| **VPN preference** | Prioritizes routes learned through VPN gateways and NVAs | When you want VPN or NVA connections to be the primary path | Routes from VPN gateways and NVAs take precedence over ExpressRoute routes |
| **AS Path preference** | Prioritizes routes based on Border Gateway Protocol (BGP) AS path length, regardless of source | When you want to use standard BGP best path selection | Routes with shorter AS paths are preferred, following standard BGP principles |

> [!IMPORTANT]
> The VPN preference setting doesn't distinguish between VPN gateway routes and NVA routes. If the same route is learned from both sources, Azure Route Server selects the route with the shortest BGP AS path.

## Configuration considerations

### Failover behavior

Understanding how routing preference affects failover scenarios is crucial for network design.

In an ExpressRoute preference scenario, the primary path uses an ExpressRoute circuit while the backup path relies on VPN or NVA connections. When ExpressRoute fails, traffic automatically switches to backup paths. However, when ExpressRoute recovers, traffic might not automatically switch back to the preferred path.

An important failover consideration is that when ExpressRoute connectivity is restored after a failure, traffic might continue using VPN or NVA paths instead of switching back to ExpressRoute. To ensure proper failover behavior, you should:

- Configure AS path prepending to make VPN and NVA routes less attractive by artificially lengthening their AS paths
- Monitor route advertisements to ensure AS path lengths for VPN/NVA routes are longer than ExpressRoute routes  
- Test failover scenarios regularly to validate that traffic flows through the expected paths during failures and recovery

### Route selection examples

The following table illustrates how different routing preference settings affect route selection:

| Scenario | Route 1 | Route 2 | Preference setting | Selected route | Reason |
|---|---|---|---|---|---|
| **Multiple routes with ExpressRoute preference** | `10.0.0.0/16` through ExpressRoute (AS path: 65001) | `10.0.0.0/16` through VPN (AS path: 65002) | ExpressRoute preference | ExpressRoute route | ExpressRoute preference takes precedence |
| **Different prefix lengths** | `10.0.0.0/16` through ExpressRoute | `10.0.1.0/24` through VPN | Any preference | VPN route for `10.0.1.0/24` traffic | Longest prefix match overrides preference |
| **AS Path preference** | `10.0.0.0/16` through ExpressRoute (AS path: 65001 65002) | `10.0.0.0/16` through VPN (AS path: 65003) | AS Path preference | VPN route | Shorter AS path length preferred |

## Best practices

### Design recommendations

When planning your routing preference strategy, choose the preference setting that aligns with your network design goals and business requirements. Implement AS path prepending through AS path manipulation to ensure proper failover behavior and maintain traffic flow during network transitions. Regularly monitor route advertisements to check which routes are being learned and selected by Azure Route Server. Test failover scenarios consistently to validate that traffic flows through expected paths during various failure conditions and recovery situations.

### Configuration guidelines

Maintain clear documentation of your routing preference decisions to ensure consistent network operations and troubleshooting. Coordinate with on-premises teams to ensure that on-premises BGP configurations support your routing preference strategy and align with Azure Route Server settings. Consider the performance implications of each connectivity option when making routing decisions, as different paths can have varying latency and throughput characteristics. Plan for scalability by ensuring your routing preference strategy can accommodate network growth and other connectivity requirements.

### Troubleshooting tips

Use Azure Route Server monitoring capabilities to verify route learning and confirm which routes are being received from different sources. Check BGP attributes including AS path lengths and other parameters that affect route selection decisions. Test connectivity regularly to verify that traffic flows through the expected paths for different destination prefixes. Monitor performance metrics to track latency and throughput across different connectivity options, helping you identify potential issues before they affect users.

## Next steps

- [Configure routing preference in Azure Route Server](configure-route-server.md#configure-routing-preference)
- [Learn about Azure Route Server support for ExpressRoute and VPN](expressroute-vpn-support.md)
- [Monitor Azure Route Server](monitor-route-server.md)
