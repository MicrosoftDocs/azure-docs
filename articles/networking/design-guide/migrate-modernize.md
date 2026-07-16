---
title: Azure Networking Design Guide - Migrate and modernize
description: A guided reading path through the Azure Networking Design Guide for customers adopting PaaS services, containers, and managed databases in Azure.
author: duongau
ms.author: duau
ms.reviewer: mbender
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 06/17/2026
#customer intent: As a network engineer, I want a sequenced reading path for migrate-and-modernize projects so that I can design Azure networking for PaaS and container workloads.
---

# Migrate and modernize networking design path

This guide provides a sequenced reading path through the Azure Networking Design Guide for customers adopting Platform as a Service (PaaS) services, containers, and managed databases. Follow the numbered steps to build a multiregion, security-layered network that supports modern application architectures.

## Overview

Migrate and modernize projects move beyond virtual machines into Azure-native services: Azure Kubernetes Service (AKS) for containers, Azure App Service for web applications, Azure SQL Database and Azure Cosmos DB for managed data, and Azure Front Door for global traffic distribution. Your network must support private connectivity to these PaaS services, multiregion active-active deployments, and strict security segmentation between application tiers.

Your target architecture uses a dual-hub topology spanning two Azure regions. IT-managed hub VNets host shared services like Azure Firewall and VPN Gateway. Application teams own their spoke VNets and control their own Private Link subnets for PaaS connectivity. Traffic enters through Azure Front Door or Azure Traffic Manager, passes through hub firewall inspection, and reaches application services running in isolated spokes.

This reading path takes you through 14 essential articles in five phases. The path is longer than lift and shift because modern architectures require decisions about ingress patterns, private PaaS connectivity, web application firewalls, and DDoS protection that IaaS-only designs can defer. Two milestone checkpoints help you identify when you can skip ahead if your workload doesn't need all components.

## Prerequisites

- Read the [Azure networking plan and design overview](overview.md) for orientation on available services.
- Know which PaaS services your applications target (AKS, App Service, Azure SQL, Azure Cosmos DB, or others).
- Determine whether your deployment spans multiple Azure regions (active-active or active-passive).
- Identify your ingress pattern: does your application serve public web traffic, mobile API traffic, or internal-only traffic?

## Your reading path

### Phase 1: Foundations

> **1. [Virtual networks and subnets](vnets-subnets.md)**
>
> Size your subnets for AKS node pools, App Service Environment (ASE) delegated subnets, and Private Link subnets. When you use AKS Container Networking Interface (CNI) Overlay, pod IP addresses come from a separate overlay CIDR and don't consume VNet subnet space. Only node IPs require subnet addresses. Plan your overlay CIDR range to accommodate pod scale, and allocate dedicated subnets for each service type.

> **2. [IP address planning](ip-planning.md)**
>
> Plan IP allocation across two regions for an active-active deployment. Your primary and backup regions need non-overlapping address spaces that support VNet peering and cross-region replication. Allocate large enough ranges to accommodate future spoke additions.

> **3. [Network security groups and application security groups](network-application-security-groups.md)**
>
> Design strict segmentation so that only load balancer traffic reaches application subnets. Block direct internet access to application tiers. Use Application Security Groups (ASGs) to apply rules based on workload role instead of individual IP addresses.

### Phase 2: Topology

> **4. [Hub-and-spoke topology](hub-spoke.md)**
>
> Deploy a dual-hub topology for multiregion. The IT subscription owns both hub VNets and manages shared services such as Azure Firewall, VPN Gateway, and DNS forwarders. Application teams own their spoke VNets and manage Private Link subnets, AKS clusters, and application resources within their allocated address space.

> **5. [Multi-region networking](multi-region.md)**
>
> Design an active-active deployment across primary and backup regions. Configure cross-region VNet peering between hubs, set up failover routing, and plan for single-region failure. Both regions serve traffic simultaneously, with Azure Front Door distributing requests based on latency and health probes.

> [!NOTE]
> **Milestone: Topology complete.** Your dual-hub, multiregion topology is in place. If your application is internal-only with no internet-facing endpoints, you can skip ahead to step 9 ([Outbound internet access](outbound-egress.md)) and continue from there.
>
> **What you skip:** Steps 6–8 cover internet ingress, application delivery and performance, and PaaS private access. Skipping is safe if your workload has no public-facing endpoints and no Private Link requirements.
>
> **Important:** Even internal-only applications often need Private Link (step 8) if they connect to Azure SQL, Azure Storage, Azure Key Vault, or other PaaS services over private endpoints. If your application uses any of these services, complete step 8 before skipping to step 9.
>
> **Articles remaining:** Six articles after skipping (steps 9–14), compared to nine articles without skipping (steps 6–14).

### Phase 3: Connectivity

> **6. [Internet ingress](internet-ingress.md)**
>
> Customer-facing traffic patterns determine the external shape of your architecture. Use Azure Front Door for web applications that need global load balancing, caching, and Web Application Firewall (WAF). Use Azure Traffic Manager for mobile or API applications where DNS-based routing with health probes is sufficient.

> **7. [Application delivery and performance](app-delivery.md)**
>
> Choose between Azure Front Door and Azure Traffic Manager based on your application type. Web applications benefit from Front Door's Layer 7 capabilities: TLS offload, caching, URL-based routing, and integrated WAF. Mobile and API backends use Traffic Manager for DNS-level failover with lower overhead.

> **8. [PaaS private access](private-platform-as-a-service.md)**
>
> Create Private Link subnets in each spoke VNet for PaaS service connectivity. Application teams manage their own private endpoints: AKS pulls container images over Private Link, web apps connect to Azure SQL over private endpoints, and no PaaS traffic traverses the public internet. Dedicate a subnet per spoke for Private Link resources.

> [!NOTE]
> **Milestone: Connectivity complete.** Your ingress and private PaaS connectivity are configured.
>
> **Remaining steps:** Outbound egress (step 9), Azure Firewall (step 10), Web Application Firewall (step 11), DDoS protection (step 12), DNS security (step 13), and network monitoring (step 14), for 6 articles total.
>
> **Essential for all deployments:** Steps 9–10 (outbound egress and Azure Firewall) apply to every modernize deployment. Your hub firewall controls all outbound traffic and provides centralized inspection regardless of whether your workload is public-facing or internal-only.
>
> **Public endpoints only:** Steps 11–12 (WAF and DDoS protection) apply only if your application exposes public-facing endpoints through Azure Front Door, Application Gateway, or a public Load Balancer. Internal-only workloads can skip these two articles and proceed to step 13 (DNS security).

> **9. [Outbound internet access](outbound-egress.md)**
>
> Route all spoke outbound traffic to the hub firewall by using User-Defined Routes (UDRs). The hub firewall acts as the Source Network Address Translation (SNAT) point for all egress. IT manages the firewall rules centrally, so application teams can't bypass outbound controls.

### Phase 4: Security

> **10. [Azure Firewall](azure-firewall.md)**
>
> Configure Azure Firewall in both hub VNets as the SNAT and Destination Network Address Translation (DNAT) point. All ingress traffic passes through the firewall before reaching the application tier. Use firewall policies to control east-west traffic between spokes and north-south traffic to the internet.

> **11. [Web Application Firewall](web-application-firewall.md)**
>
> Deploy WAF on Azure Front Door or Azure Application Gateway for your web applications. WAF protects against Open Web Application Security Project (OWASP) Top 10 threats, SQL injection, cross-site scripting, and other HTTP-layer attacks. Use managed rule sets and add custom rules for your application's specific patterns.

> **12. [DDoS protection](ddos.md)**
>
> Enable Azure DDoS Protection for all public IP resources. DDoS Protection provides always-on traffic monitoring, automatic attack mitigation, and cost protection guarantees. Combine DDoS Protection with WAF for layered defense against volumetric and application-layer attacks.

> **13. [DNS security and private name resolution](dns-security.md)**
>
> Configure public DNS zones for your customer-facing domains with CNAME records pointing to Azure Front Door or Traffic Manager endpoints. Apply Role-Based Access Control (RBAC) to DNS zones so that only authorized teams can modify records. Enable DNS Security Extensions (DNSSEC) for zones that require cryptographic validation.

### Phase 5: Operations

> **14. [Network monitoring and observability](monitor.md)**
>
> Production readiness requires monitoring from day one. Enable Azure Network Watcher for connectivity diagnostics, Network Performance Monitor for latency tracking, and flow logs for traffic analysis. Application teams monitor their own AKS and ASE workloads. The platform team monitors hub infrastructure and cross-region connectivity.

## Conditional articles

Include these articles based on your specific requirements:

| Condition | Article | When to include |
|---|---|---|
| Hybrid coexistence | [Hybrid connectivity](hybrid-connectivity.md) | Your modernized applications must coexist with on-premises systems during the transition period |
| VM admin access needed | [Developer and admin access](developer-admin-access.md) | Your estate includes VMs that need secure RDP/SSH access alongside PaaS workloads |
| Large governed estate | [Centralized network management](azure-virtual-network-manager.md) | You manage a multi-subscription, multi-team VNet estate that needs centralized policy enforcement |
| Cross-cloud | [Cross-region and multicloud connectivity](cross-region.md) | Your architecture requires explicit cross-region private connectivity beyond what multi-region networking provides |
| Very small workload | [Flat network topology](flat-network.md) | You have a single workload that doesn't justify the complexity of hub-and-spoke topology |

## Summary

By following this reading path, you designed a multiregion, security-layered network architecture for PaaS workloads. Your design includes dual-hub topology with IT-managed shared services, active-active multiregion with Azure Front Door or Azure Traffic Manager, Private Link connectivity for PaaS services, centralized firewall inspection for all traffic flows, WAF and DDoS protection for public endpoints, and DNS with RBAC and DNSSEC. This architecture supports modern application patterns while maintaining centralized security governance.

### Validation checklist

Use this checklist to confirm your modernization networking design is complete:

- Dual-hub topology deployed across primary and backup regions.
- Non-overlapping address spaces allocated for both regions and future spokes.
- Azure Front Door or Azure Traffic Manager configured for global ingress, if your workload is public-facing.
- Private Link subnets provisioned in each spoke VNet that hosts PaaS dependencies.
- User-defined routes send spoke egress traffic through the hub firewall.
- Azure Firewall deployed in both hub VNets for ingress, east-west, and outbound inspection.
- WAF policies applied to public web endpoints, if applicable.
- DDoS Protection enabled on public IP resources, if applicable.
- DNS zones and private DNS resolution configured for private endpoints.
- Network Watcher, flow logs, and cross-region connectivity monitoring enabled.

## Next steps

- [Lift-and-shift networking path](lift-and-shift.md): If you also have IaaS workloads that need a simpler migration path
- [Cross-cloud networking path](cross-cloud.md): If your environment connects to Amazon Web Services (AWS) or Google Cloud
- [Design phases at a glance](overview.md#design-phases-at-a-glance): For the generic phase-based summary of Azure network design
- [Azure networking plan and design overview](overview.md): For capability-based exploration of all available services
