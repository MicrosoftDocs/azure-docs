---
title: Scale Azure DNS Private Resolver QPS in a hub-and-spoke network
description: Learn how to distribute DNS queries across Azure DNS Private Resolver endpoints in a hub-and-spoke network and plan capacity for peak demand and failover.
author: sfigue
ms.service: azure-dns
ms.topic: concept-article
ms.date: 11/04/2026
ms.author: sfigue
# Customer intent: As a network administrator, I want to distribute DNS traffic across private resolver endpoints so that I can support higher query volumes in a hub-and-spoke network.
---

# Scale Azure DNS Private Resolver QPS in a hub-and-spoke network

In a hub-and-spoke network, sending all DNS queries to a single Azure DNS Private Resolver inbound endpoint concentrates the query load at that endpoint. To scale queries per second (QPS), distribute traffic across endpoints and assign spoke networks to separate resolution paths. Adding endpoints without changing the query paths doesn't distribute the load.

This article describes a design for partitioning DNS traffic by spoke group. It covers inbound and outbound query paths, capacity planning, and validation before production rollout. For the underlying resolution models, see [Private resolver architecture](private-resolver-architecture.md).

## Understand the capacity boundaries

Azure DNS Private Resolver has a documented limit of **10,000 QPS per endpoint**. A resolver supports up to five inbound endpoints and five outbound endpoints. Each endpoint requires its own dedicated subnet. Only one resolver can reference a given virtual network.

Before you deploy, review the current [Private Resolver limits and restrictions](dns-private-resolver-overview.md#restrictions). Endpoint limits aren't a throughput guarantee for an application or a complete DNS resolution path. Client behavior, caching, network connectivity, and target DNS server capacity also affect observed performance.

| Component | Scaling consideration |
| --- | --- |
| Inbound endpoint | Assign different spoke groups or upstream forwarders to different inbound endpoint IP addresses. |
| Outbound endpoint | Partition forwarding traffic across rulesets and outbound endpoints. Adding inbound capacity doesn't remove a shared outbound bottleneck. |
| DNS forwarding rule | Multiple target DNS servers provide retry and failover behavior, not round-robin load balancing. |
| Resolver virtual network | Add endpoints within the resolver's limits. To add another resolver, use another virtual network. |
| Target DNS server | Size on-premises or other target DNS servers for the forwarded load, including failure scenarios. |

> [!IMPORTANT]
> Don't calculate usable capacity by multiplying the endpoint count by 10,000 unless you also account for traffic distribution and failure headroom. Multiple DNS server addresses in a VNet configuration don't guarantee equal distribution; DNS client selection and retry behavior vary. A forwarding rule uses its first target unless that target doesn't respond. For details, see [Rule processing](private-resolver-endpoints-rulesets.md#rule-processing).

## Choose which queries need the hub

Identify the query path before adding capacity:

- **Custom DNS in spoke VNets:** When the spoke uses a hub inbound endpoint as its DNS server, DNS queries from that spoke flow through the inbound endpoint, including queries for public names.
- **Azure-provided DNS with forwarding ruleset links:** Only queries that match forwarding rules use the outbound forwarding path. A rule targeting a hub inbound endpoint consumes capacity on both that outbound path and the inbound endpoint.
- **Private DNS zone links to spokes:** When spokes use Azure-provided DNS and have links to the required private DNS zones, those private zone queries don't need to traverse a hub inbound endpoint. This option changes zone-link management requirements but can reduce centralized resolver traffic.

Choose the resolution model that meets your governance and namespace requirements. Avoid forwarding all namespaces to the hub solely to resolve a small number of private zones. For details, see [Azure Private DNS virtual network links](private-dns-virtual-network-links.md).

## Partition spokes across inbound endpoints

For a centralized DNS design, divide the spokes into groups and configure each group to use a different primary inbound endpoint. Balance groups by measured query volume, not just by the number of VNets.

The following example uses two inbound endpoints in one hub resolver. The addresses are examples; allocate addresses from your own network plan.

| Resource | Example configuration |
| --- | --- |
| Hub VNet | `10.10.0.0/16`, with one private resolver |
| Inbound endpoint A | `10.10.0.4`, in dedicated subnet `10.10.0.0/28` |
| Inbound endpoint B | `10.10.0.20`, in dedicated subnet `10.10.0.16/28` |
| Spoke group A | Custom DNS points to endpoint A for its normal resolution path. |
| Spoke group B | Custom DNS points to endpoint B for its normal resolution path. |
| Private DNS zones | Linked to the hub VNet so that both inbound endpoints can resolve the same private namespaces. |

Both groups share the hub's private zone visibility. If queries also need forwarding to on-premises namespaces, configure the required outbound endpoints, rulesets, and hub ruleset link. Check that the shared outbound path can handle the combined forwarded traffic.

For each spoke group:

1. Measure peak DNS query volume and identify required private, on-premises, and public namespaces.
2. Select an inbound endpoint and verify connectivity from the spokes to that endpoint over UDP and TCP port 53.
3. Configure the spoke's custom DNS settings with the selected endpoint address. Follow the [custom DNS guidance for virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) to apply the change to existing workloads.
4. Verify resolution for each namespace before moving the next group.

> [!NOTE]
> The two endpoints in this example illustrate traffic partitioning, not a complete disaster recovery design. Additional endpoints in the same hub don't provide regional isolation. For a separate failover design, see [Set up DNS failover using private resolvers](tutorial-dns-private-resolver-failover.md).

## Partition forwarding traffic with rulesets

If spokes use Azure-provided DNS and ruleset links, partition the forwarding paths as well as the inbound destinations. For example:

| Spoke group | Linked ruleset | Outbound endpoint | Private namespace rule target |
| --- | --- | --- | --- |
| Group A | Ruleset A | Outbound endpoint A | Inbound endpoint A, port 53 |
| Group B | Ruleset B | Outbound endpoint B | Inbound endpoint B, port 53 |

In this example, both rulesets contain a rule for `azure.contoso.com.`. Ruleset A forwards that namespace to `10.10.0.4`, and ruleset B forwards it to `10.10.0.20`. The private zone `azure.contoso.com` is linked to the hub VNet. Other namespaces follow their own matching rules or use Azure-provided DNS when no rule matches.

Use separate rulesets to assign each spoke group a distinct forwarding path. Don't put both inbound IP addresses into one rule and expect queries to be balanced between them. Also, don't assume that associating two outbound endpoints with a ruleset guarantees an even traffic split.

Ruleset links must meet the service's regional and virtual network link restrictions. For details, see [DNS forwarding rulesets](private-resolver-endpoints-rulesets.md#dns-forwarding-rulesets).

> [!WARNING]
> Don't link a ruleset that forwards to a hub inbound endpoint to the VNet containing that endpoint. This configuration can create a DNS forwarding loop. If the hub needs to forward on-premises namespaces, use a separate hub-linked ruleset without rules that send queries back to the hub's inbound endpoints.

## Plan peak capacity and failure headroom

Use the peak query rate reaching an endpoint, rather than application request volume or daily average DNS volume. Include bursts, retries, and cache-miss behavior. Track inbound traffic separately from traffic that requires outbound forwarding.

As an illustrative planning target, suppose you choose to keep each endpoint at or below 6,000 QPS during normal operation. This target is an example, not a service limit or a Microsoft performance recommendation.

- Two spoke groups generating 6,000 QPS each require separate query paths to keep normal load at 6,000 QPS per inbound endpoint.
- If both groups fail over to one endpoint, the combined 12,000 QPS exceeds the documented 10,000 QPS limit.
- The design therefore needs more spare capacity, smaller groups, or a different tested failover assignment. Configuring a secondary DNS address alone doesn't solve the capacity problem.

For every endpoint, add its normal peak load to the traffic it would receive from failed paths. Check the result against the endpoint limit and your chosen operating headroom. Repeat the calculation for outbound endpoints and target DNS servers.

When endpoint limits in a single resolver aren't sufficient, deploy additional resolvers in separate VNets and assign spoke groups to them. Link the required private DNS zones to every resolver VNet that must answer those namespaces. Re-create the necessary forwarding configuration and verify connectivity for each resolution path. Keep namespace behavior consistent across primary and failover paths.

## Validate and monitor the design

Start with a small spoke group, then expand after you verify both correctness and capacity.

1. **Check name resolution.** Query known records in linked private zones, forwarded on-premises zones, and public zones. Confirm expected answers, including expected negative responses. Test both UDP and TCP.
2. **Confirm the query path.** Test an inbound endpoint directly, then test through the workload's configured DNS path. A successful direct query doesn't prove that the workload uses that endpoint.
3. **Measure endpoint load.** Use the supported Azure Monitor metrics for the resolver and forwarding rulesets, alongside workload DNS latency and error measurements. See the [Azure DNS monitoring reference](monitor-dns-reference.md).
4. **Exercise peak demand.** Use representative query names, TTLs, and cache-miss rates in an isolated test. Repeatedly querying a cached name doesn't represent uncached workload demand.
5. **Test failure behavior.** In a nonproduction environment, exercise the planned failover path and verify where clients send queries. Confirm that surviving endpoints and target servers stay within capacity and that namespace answers remain consistent.
6. **Roll out gradually.** Move one spoke group at a time. Keep the previous DNS settings available for rollback and account for client configuration refresh and DNS caching during the transition.

When interpreting query-count metrics, use the metric's documented aggregation and time interval to calculate an average QPS. An interval average can hide short bursts, so don't use it as the only evidence that an endpoint has sufficient headroom.

## Next steps

- Review [Private Resolver endpoints and rulesets](private-resolver-endpoints-rulesets.md).
- Compare [centralized and distributed resolver architectures](private-resolver-architecture.md).
- Plan [DNS failover using private resolvers](tutorial-dns-private-resolver-failover.md).
