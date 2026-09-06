---
title: Azure landing zones for on-premises experts
description: Learn about the platform landing zone decisions and build tasks that prepare Azure to receive workloads migrating from on-premises.
ms.author: rhackenberg
author: reginahack
ms.date: 08/21/2026
ms.topic: concept-article
ms.custom: migration-hub
ms.service: azure
ms.collection:
  - migration
  - on-prem-to-azure
---
# Azure landing zones for on-premises experts

This article helps platform teams and central IT engineers prepare Azure to receive workloads migrating from on-premises to Azure. Each workload runs in a *landing zone* environment that you preconfigure with needed subscriptions, networking, identity, and governance. This article covers the platform level decisions and build tasks for the shared infrastructure every workload needs before it can exist in Azure. For more information about landing zones, see [What is an Azure landing zone](/azure/cloud-adoption-framework/ready/landing-zone/).

The article notes relevant conceptual shifts as they arise. For a full explanation of Azure networking differences from on-premises networking, the meaning of shared responsibility in practice, and identity changes when you move to Microsoft Entra ID, see [Fundamentals of Azure for on-premises experts](migrate-from-on-premises-fundamentals.md).

This article covers the platform preparation process. If the platform foundation is ready, your migration teams can focus on workload landing zone preparation. If the platform foundation isn't in place yet, your first work item is a platform landing zone assessment that settles connectivity, management, and team operating model decisions before migration starts.

This prerequisite applies across all migration workstreams, including data, AI, and application migrations. Each stream needs an existing landing zone before the workload can move, and no workload can migrate until the platform is ready.

## Platform landing zone versus application landing zone

The following table describes landing zone scopes. This article covers the **Platform landing zone** column. The execution phase of each workload migration handles the **Workload landing zone** column.

|           | Platform landing zone | Workload landing zone |
| --------- | ------------------------------------ | --------------------------------------------------------- |
| **Scope** | Organization-wide and shared         | Per workload                                              |
| **Owner** | Platform team or central IT          | Workload team                                             |
| **When**  | Once, before any workload migrates   | Per workload during the execution phase                    |

## New deployment versus existing environment

The amount of foundation work required before migration can begin depends on whether you're building a new platform, remediating a partial one, or validating a mature one.

- **New platform:** The organization is new to Azure and might be new to cloud operations. There's no meaningful Azure footprint, management group structure, hub network, or identity baseline. The platform team must build the foundation from scratch.

- **Partial platform:** Azure infrastructure exists, but wasn't assembled as a coherent migration platform. This situation often results from *shadow IT*, where teams created their own Azure environments outside centralized IT control. Common issues include fragmented subscriptions, overlapping address spaces, partial policy coverage, misdirected connectivity, and mixed identity patterns. The task here is remediation, rather than a clean rebuild or simple validation.

- **Mature platform:** Existing Azure infrastructure is already operating and has clear subscription boundaries, working connectivity, policy assignments, and an access model that can receive workloads. Some environments that have resources in place can create risk by not being migration-ready. The migration task is to validate that controls match the workloads that are about to arrive.

To build a new platform, work through this article from [Minimum viable platform landing zone](#minimum-viable-platform-landing-zone) through [Shared services and operational tooling](#shared-services-and-operational-tooling) in sequence. For an existing partial or mature platform, start with the checklist in [Validate platform readiness](#validate-platform-readiness) and then fill any gaps.

In all cases, make replaceable infrastructure the default by using templates, standard images, and repeatable deployment patterns rather than hand-building individual virtual machines (VMs). For more information, see [Rethink your approach to servers](migrate-from-on-premises-fundamentals.md#rethink-your-approach-to-servers).

## Minimum viable platform landing zone

A possible failure mode is spending months or years designing, engineering, and refining the landing zone without meaningfully migrating any workloads. It's better to start by using modular pieces to assemble a minimal secure, accessible, and correctly governed landing zone, and add more pieces only when workloads require them.

The minimum viable platform landing zone for a first migration is the foundation needed to land and operate the first workload, and consists of the following capabilities: 

- A management group hierarchy
- Baseline policy
- A working hub network with hybrid connectivity to your on-premises network
- A Domain Name System (DNS) that reaches on-premises name servers
- Identities that match the workload mix
- Central logging
- A firewall or equivalent network security control

For a full description of platform landing zone capabilities and deployment building blocks, see [Azure landing zone design areas and conceptual architecture](/azure/cloud-adoption-framework/ready/landing-zone/design-areas) in the Cloud Adoption Framework.

The minimal foundation landing zone works best as a set of composable building blocks. Start with the core pieces and add more as workloads surface new requirements. Specific workload migration procedures cover spoke virtual networks, workload-specific network security groups, and per-workload role assignments.

Start by designing the landing zone so workload teams can pick the right service model without bypassing the shared guardrails of identity, network access, policy, logging, and cost controls. For more information, see [Select a service model](migrate-from-on-premises-fundamentals.md#select-a-service-model).

Build the foundation from repeatable definitions in Bicep, Terraform, or another approved deployment method rather than making manual changes in the Azure portal. This approach ensures that landing zone changes are reviewable. For more information, see [Prioritize automation by using IaC](migrate-from-on-premises-fundamentals.md#prioritize-automation-by-using-iac).

## Management group and baseline policy

The [management group](/azure/governance/management-groups/overview) and subscription hierarchy control Azure Policy, role-based access control (RBAC), and cost reporting. The decision that matters for migration is to determine the subscription boundaries before your workloads migrate. For more information about how Azure works with resources instead of physical servers, see [Rethink resources versus roles](migrate-from-on-premises-fundamentals.md#rethink-resources-vs-roles).

Confirm that the chosen management group hierarchy can separate shared platform services such as connectivity, identity, and management from the workloads. For the detailed hierarchy and policy inheritance model, see the [Management groups](/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups) design area. 

The platform team's responsibility is increasingly focused on owning the operating model and less about managing infrastructure. Make the shared responsibility boundary explicit before workloads deploy. For more information, see [Understand shared responsibility in the cloud](migrate-from-on-premises-fundamentals.md#understand-shared-responsibility-in-the-cloud).

### Policy

Apply only the baseline assignments that prevent risk when migrating and deploying workloads. These assignments include:

- Denying unmanaged public internet exposure.
- Requiring the [diagnostic settings](/azure/azure-monitor/platform/diagnostic-settings-policy) that feed central logging.
- Steering deployments toward the Azure regions where the platform network and operational model are ready.

If any workloads carry data residency, sovereignty, or regulatory requirements, region restriction becomes a compliance control, not just a readiness control. Build those requirements into the baseline policy set, for example by using *allowed locations* policies, rather than adding them later.

Organizations that have conflicting regional requirements might also need these requirements reflected in the management group structure. For more information about multi-jurisdiction scenarios, see [Modify an Azure landing zone architecture to meet requirements across multiple locations](/azure/cloud-adoption-framework/ready/landing-zone/landing-zone-multinational).

### Cost governance

To keep the baseline practical, set budgets and alerts at the management group or subscription level before migration, and assign an owner to review them. Cost allocation is easier when each workload has its own subscription, but not every organization uses a subscription-per-workload model. Don't let designing a perfect tagging or chargeback system delay building the management group.

### Subscription vending

A related platform decision is subscription vending, or how workload subscriptions are requested, created with appropriate initial configuration, and attached to the right management group before the first migration. For more information about subscription vending, operating model, and automation patterns, see [Subscription vending](/azure/cloud-adoption-framework/ready/landing-zone/design-area/subscription-vending) in the Cloud Adoption Framework.

## Hub network and hybrid connectivity

Hybrid connectivity is one of the few platform prerequisites that can block all workloads at once. You can adjust management group structure and policy after workloads start migrating, but if you migrate a workload before connectivity is stable, you might not be able to reach it.

The migration prerequisite here is narrow. You need a working hub network in the connectivity subscription. Ensure that the hub has an approved and consistent connectivity pattern for workload virtual networks. For the full hub-and-spoke versus [Azure Virtual WAN](/azure/virtual-wan/virtual-wan-about) topology choice, shared network service placement, and DNS resolver design, see the [Network topology and connectivity](/azure/cloud-adoption-framework/ready/landing-zone/design-area/network-topology-and-connectivity) design area.

### VPN Gateway or ExpressRoute

Choose between [Azure VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways) and [Azure ExpressRoute](/azure/expressroute/expressroute-introduction) based on throughput needs, latency sensitivity, compliance requirements, lead time tolerance, and routing complexity. Don't choose based on whether your organization is new to Azure. 

#### VPN Gateway

VPN Gateway is often the fastest path to working connectivity and can remain the right long-term answer for lower-bandwidth or less latency-sensitive workloads. For these workloads or for smaller organizations, VPN Gateway might be sufficient for the full migration. The decision depends on traffic profile, operational tolerance, and what destinations the workload must reach during and after cutover.

Select the gateway stock-keeping unit (SKU) based on expected migration throughput before you deploy. The Basic SKU caps at around 100 Mbps aggregate and doesn't support active-active mode or Border Gateway Protocol (BGP), which rules it out for most production migration workloads. For a full comparison, see [VPN Gateway SKUs](/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings#gwsku).

#### ExpressRoute

ExpressRoute can be the day-one path when dedicated private connectivity, predictable routing, or regulatory requirements matter more than speed of setup. Treat delivery to an ExpressRoute target as provider-dependent and procurement-dependent planning work, rather than as a fixed promise. The [ExpressRoute circuit workflow](/azure/expressroute/expressroute-workflows) clarifies that partner provisioning is part of the path. Plan on weeks or months rather than days, and run VPN Gateway in parallel if migration dates can't wait.

After ExpressRoute is live, many teams keep a route-based VPN Gateway in place as a failover path. [Configure ExpressRoute and Site-to-Site coexisting connections using the Azure portal](/azure/expressroute/how-to-configure-coexisting-gateway-portal) describes this secure failover pattern, with the ExpressRoute circuit acting as the primary path and the VPN carrying traffic only if the circuit fails.

### Hub routing, DNS, and inspection path

Before workloads arrive, resolve the items that often cause later outages.

- Confirm that no on-premises or existing Azure virtual networks' IP address spaces overlap the address space you plan to use. 
- Assign an owner for BGP advertisements and route summarization. 
- If you inspect traffic at the hub or run more than one connectivity path, define how to detect and avoid asymmetric routing. 
- Confirm where DNS forwarders or Azure DNS Private Resolver exist, and assign an owner for private DNS zones and forwarding rules. 
- Evaluate which north-south and east-west paths require inspection before traffic reaches the workload.
- Decide whether internet-bound traffic breaks out locally through Azure, or through forced tunneling back on-premises.

  Forced tunneling is generally an antipattern for migrated workloads. It adds latency and a hard dependency on the on-premises path for every outbound connection, which undercuts the resiliency that migration is meant to deliver. Reserve forced tunneling for workloads with an explicit compliance or inspection requirement that you can't meet any other way.

Explicitly make the preceding decisions before workloads arrive, because virtual networks, subnets, network security groups, route tables, and private endpoints are software-defined controls rather than physical networks you can rebuild. For more information about this conceptual shift, see [Shift networking to SDN](migrate-from-on-premises-fundamentals.md#shift-networking-to-sdn). For implementation guidance, see the [Network topology and connectivity](/azure/cloud-adoption-framework/ready/landing-zone/design-area/network-topology-and-connectivity) design area.

## Platform-level network security design

Network security decisions at the platform level help you plan consistent and scalable security for both inbound and outbound connectivity across workloads. Understand how your workloads interact with other systems so you can design a more secure networking environment.

Early discovery defines the expected security posture for each tier, including whether database tiers must be isolated from application tiers, whether application tiers must be isolated from web tiers, and how strict east-west controls need to be. Avoid the common pattern of creating one virtual network, adding one subnet, and dropping everything into that subnet, because contention and weak segmentation appear quickly when all resources share the same boundary.

A platform landing zone replaces the legacy perimeter model with a zero-trust approach that has explicit controls at every layer, because network location alone doesn't make a request trusted. For more information, see [Shift security to zero trust](migrate-from-on-premises-fundamentals.md#shift-security-to-zero-trust). The migration decision is narrow: Decide how to prevent unmanaged public exposure, how to request approved ingress, and how to keep exceptions visible.

Approved ingress patterns include:

- [Azure Firewall destination network address translation (DNAT)](/azure/firewall/tutorial-firewall-dnat).
- [Azure Application Gateway](/azure/application-gateway/overview).
- [Azure Front Door](/azure/frontdoor/front-door-overview).
- [Azure Load Balancer](/azure/load-balancer/load-balancer-overview).
- [Azure Bastion](/azure/bastion/bastion-overview).

Approved egress patterns include:

- [Azure Firewall](/azure/firewall/features) with application and network rules for outbound filtering.
- [Azure NAT Gateway](/azure/nat-gateway/nat-overview) for predictable, scalable outbound source network address translation (SNAT).
- User-defined routes (UDRs) that force outbound traffic through the hub for inspection before it reaches the internet.
- [Azure Firewall Premium](/azure/firewall/premium-features) transport layer security (TLS) inspection for outbound traffic that must be decrypted and inspected.

For cross-service communication, use [Azure Private Link](/azure/private-link/private-link-overview) and private endpoints if you don't want public exposure. These technologies provide a private-access pattern and avoid traffic traversing public networks.

Document exceptions or emergency workflows so that every public endpoint has an owner, an inspection path, and a review point. Any public IP address also needs an explicit distributed denial of service (DDoS) protection decision. For more information, see [Azure DDoS Protection](/azure/ddos-protection/ddos-protection-overview).

For the full security baseline, see the [Security](/azure/cloud-adoption-framework/ready/landing-zone/design-area/security) and [Network topology and connectivity](/azure/cloud-adoption-framework/ready/landing-zone/design-area/network-topology-and-connectivity) design areas.

## Hybrid identity

Hybrid identity is relevant only when a workload depends on it. Consider these four decisions before the first workload arrives:

- **Human administrative access:** Platform administrators need Microsoft Entra ID groups, the right tenant access baseline, and an emergency access path before they can operate the environment.
- **Workload or machine identity:** You can often plan managed identities, service principals, and other workload identity patterns independently of user synchronization, but they still need an ownership model and least-privilege access design.
- **Legacy Active Directory-dependent workloads:** If a workload still needs legacy Active Directory authentication such as Lightweight Directory Access Protocol (LDAP), Kerberos, or Group Policy, decide early whether domain controllers, Azure sites and services definitions, or other supporting components must exist in Azure before cutover.
- **Cloud-native or non-Active Directory workloads:** These workloads might not need identity synchronization as a universal migration gate, but they still need a clear workload identity and administrative access model.

If the first workload depends on synchronized users or legacy Active Directory authentication, prove that dependency path before migration. If the workload doesn't have that dependency path, the platform still needs a working administrative identity baseline and a defined workload identity pattern before the first move.

For more information about identity, see [Shift identity to Microsoft Entra ID](migrate-from-on-premises-fundamentals.md#shift-identity-to-microsoft-entra-id). For the detailed patterns, see the [Identity and access management design area](/azure/cloud-adoption-framework/ready/landing-zone/design-area/identity-access) in the Cloud Adoption Framework.

## Shared services and operational tooling

Before the first workload migrates, decide which operational tools and services belong at the platform level and which belong at the workload level. These choices define what workload teams inherit.

Centrally provide or own the following services before the first migration:

- Central logging
- Baseline monitoring and alert routing
- The ownership model for patching and vulnerability scanning
- Platform DNS design 
- Use of the same operational add-ons by every workload on day one

For the full platform management and security baselines, see the [Management](/azure/cloud-adoption-framework/ready/landing-zone/design-area/management) and [Security](/azure/cloud-adoption-framework/ready/landing-zone/design-area/security) design areas in the Cloud Adoption Framework.

The following choices can follow after the first workload arrives, provided ownership is clear:

- Deeper backup tooling standardization
- Advanced dashboards
- Longer-term retirement sequencing for legacy tools

The following platform decisions are worth naming early, because they often surface late:

- **DNS forwarding and private DNS ownership:** Decide who owns forwarding rules, private DNS zones, and resolver placement, and then validate that design from a representative spoke. For more information, see the [Network topology and connectivity](/azure/cloud-adoption-framework/ready/landing-zone/design-area/network-topology-and-connectivity) design area.
- **RBAC model:** Decide which Microsoft Entra ID groups receive access to workload subscriptions and how privileged access is elevated and reviewed. For more information, see the [Identity and access management](/azure/cloud-adoption-framework/ready/landing-zone/design-area/identity-access) design area.
- **Secrets and key management:** Decide where certificates, connection strings, and secrets reside, who can retrieve them, and how to handle rotation before workloads depend on them. Choose managed identities over secrets wherever the workload supports them. For more information, see the [Security](/azure/cloud-adoption-framework/ready/landing-zone/design-area/security) design area.

Every on-premises tool that continues running alongside its Azure equivalent adds operational overhead. Build a short list of what stays during the migration, what gets replaced by Azure-native services, and when each tool retires. For example, carrying [System Center Operations Manager](/system-center/scom/welcome) alongside [Azure Monitor](/azure/azure-monitor/fundamentals/overview) can be a valid choice for a defined period.

Validation is outcome-based. Confirm that platform logs are flowing and visible before cutover. Logs include the required policy-based resource [diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings), not just subscription-level activity logs. For guidance on where to place platform monitoring resources, see the [Management](/azure/cloud-adoption-framework/ready/landing-zone/design-area/management) design area.

The important outcome is a documented operational landscape for the target platform, including which parts stay, which parts Azure-native services replace, and who owns each tool during the overlap period. For more information about observability, see [Shift monitoring to telemetry-driven observability](migrate-from-on-premises-fundamentals.md#shift-monitoring-to-telemetry-driven-observability).

## Validate platform readiness

Before workload migration teams begin planning the migration, the platform team must validate that the foundation works. The foundation doesn't need to be complete or polished, but it must meet minimum requirements.

A readiness pass before migration gives teams a clear view of whether the platform is ready. Use the following checks as a minimum, not as proof that every later risk is eliminated. Run through these checks before the first workload migration begins.

| Area  | Validation  |
| ------------ | ------------ |
| Connectivity                  | VPN Gateway or ExpressRoute is live, the routing design matches the documented target state, and a representative on-premises VM can reach an Azure private IP over the approved path.                                              |
| DNS and routing               | On-premises names, Azure private DNS zones, and any required private endpoints resolve correctly from a representative spoke virtual network. The inspection path, forced-tunneling choice, and internet breakout path are confirmed. |
| Ingress and segmentation      | At least one approved ingress pattern is tested end to end, required segmentation controls are in place, and any public-exposure exception has an owner and review path.                                                    |
| Policy and governance         | Required Azure Policy assignments are attached, compliance state is reviewed, region restrictions and exceptions are documented, and budgets or cost alerts are active at the intended scope.                               |
| Administrative access         | RBAC through Microsoft Entra ID groups is verified on the relevant scopes, and the privileged-access workflow for platform administrators is documented and tested.                                                         |
| Monitoring and operations     | The policy that flows diagnostic settings into the central workspace is working, at least one expected alert fires to the right destination, and ownership for patching and vulnerability scanning is assigned.                     |
| Capacity and scale            | The platform is sized for measured demand and Azure scaling rather than on-premises peak hardware. Gateway SKU choice, region placement, subscription limits, and budget alerts reflect that demand. See [Use a scale-on-demand approach to capacity](migrate-from-on-premises-fundamentals.md#use-a-scale-on-demand-approach-to-capacity). |
| Resiliency and SLA            | Regions, availability zone support, gateway redundancy, backup standards, and monitoring alerts are chosen from the SLA and recovery needs of the workloads landing on the platform, not duplicated physical hardware. See [Shift reliability to an SLA-based design](migrate-from-on-premises-fundamentals.md#shift-reliability-to-an-sla-based-design). |
| Subscription handoff          | The subscription vending path can create or baseline the first workload subscription, and the expected logging, policy, and access baseline is present when the workload team receives it.                                  |
| Workload-like dependency test | A representative test proves the first workload's real dependency path, including authentication method, DNS, network reachability, required secret retrieval, and monitoring visibility.                                   |

The preceding checks are the minimum, not a full landing zone design review or a promise that later issues are minor. DNS edge cases, policy exceptions, segmentation gaps, and identity dependencies can still surface after this checklist passes, especially during early real workload migrations.

For platform design validation across management groups, hub networking, and security baselines, use the [Azure Landing Zone Review](/assessments/21765fea-dfe6-4bc4-8bb7-db9df5a6f6c0/) assessment.

## Next steps

After the preceding checks pass, the workload teams can start migrating the workloads. During the first workload migration, the platform team should stay engaged for DNS, firewall, policy exemptions, RBAC, quota, and monitoring issues.

For more information, see the following articles:

- [Fundamentals of migrating from on-premises to Azure](migrate-from-on-premises-fundamentals.md). Conceptual reference for the reasoning behind migration decisions.
- [Ready methodology for Azure landing zones](/azure/cloud-adoption-framework/ready/landing-zone/). Cloud Adoption Framework Ready phase for landing zones, including detailed deployment guidance and reference implementations for platform landing zones.
- [Platform landing zone implementation options](/azure/cloud-adoption-framework/ready/landing-zone/implementation-options). Bicep and Terraform modules for accelerated platform deployment.
