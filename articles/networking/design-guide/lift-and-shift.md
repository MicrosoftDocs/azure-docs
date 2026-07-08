---
#customer intent: As a network engineer, I want a sequenced reading path for lift-and-shift migrations so that I can design my Azure network correctly from the start.
title: Azure Networking Design Guide - Lift and shift
description: A guided reading path through the Azure Networking Design Guide for customers migrating on-premises workloads to Azure IaaS without re-architecting.
author: duongau
ms.author: duau
ms.reviewer: mbender
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 06/17/2026
---

# Lift-and-shift networking design path

This guide provides a sequenced reading path through the Azure Networking Design Guide for customers migrating on-premises workloads to Azure Infrastructure as a Service (IaaS) without re-architecting applications. Follow the numbered steps to build your network from the ground up, making the right decisions at each stage.

## Overview

A lift-and-shift migration moves existing on-premises workloads to Azure virtual machines (VMs) with minimal changes to application architecture. Your applications keep their existing communication patterns, dependencies, and configurations. The network you build in Azure must support these existing patterns while taking advantage of Azure-native security and connectivity services.

Your target architecture is a hub-and-spoke topology with centralized shared services. A single hub virtual network (VNet) hosts your VPN Gateway or ExpressRoute connection back to on-premises, Azure Bastion for secure VM access, Azure Firewall for centralized traffic inspection, and DNS forwarding. Spoke VNets host your migrated workload VMs, isolated from each other by default and connected through the hub for cross-workload communication.

This reading path takes you through 10 essential articles in five phases. Each article builds on the decisions you made in the previous step. By the end, you have a production-ready network design that supports your migrated workloads with defense-in-depth security and connectivity.

## Prerequisites

- Read the [Azure networking plan and design overview](overview.md) for orientation on available services and guide structure.
- Complete an inventory of your existing on-premises network: IP ranges, subnets, firewall rules, DNS zones, and inter-application traffic flows (you'll reference this inventory in the foundational articles: VNets and subnets, IP address planning, and NSG configuration).
- Identify which workloads you plan to migrate first. Start with a pilot group before migrating your full estate.
- Document your on-premises connectivity requirements: bandwidth to Azure, latency sensitivity, and failover expectations.

## Your reading path

Work through these phases in order. Each phase builds on the decisions from the previous one.

### Phase 1: Foundations

Start with the three foundational articles. These decisions shape everything that follows.

> **1. [Virtual networks and subnets](vnets-subnets.md)**
>
> Create the VNet that hosts your migrated VMs. Map your existing network segments into Azure subnets. Focus on subnet isolation boundaries: which workloads share a subnet, which need their own, and how many IP addresses each subnet needs based on your VM count.

> **2. [IP address planning](ip-planning.md)**
>
> Avoid IP overlap with your on-premises environment. Use a /16 Classless Inter-Domain Routing (CIDR) pool per VNet to leave room for growth. If your on-premises ranges overlap with Azure reserved addresses or with other Azure subscriptions, plan a re-addressing strategy before you migrate.

> **3. [Network security groups and application security groups](network-application-security-groups.md)**
>
> Mirror your existing firewall rules as Network Security Groups (NSGs). Translate your on-premises access control lists (ACLs) into NSG rules with a default-deny posture. Use Application Security Groups (ASGs) to group VMs by role instead of managing individual IP addresses.

### Phase 2: Topology

> **4. [Hub-and-spoke topology](hub-spoke.md)**
>
> Hub-and-spoke is the default topology for multi-workload lift-and-shift migrations. Place shared services in the hub VNet: VPN Gateway, Azure Bastion, Azure Firewall, and DNS forwarders. Each workload gets its own spoke VNet peered to the hub. Spokes communicate through the hub firewall, giving you centralized traffic control.

### Phase 3: Connectivity

> **5. [Hybrid connectivity](hybrid-connectivity.md)**
>
> VPN Gateway or Azure ExpressRoute to on-premises is your most critical migration dependency. Without this connection, migrated VMs can't reach on-premises services they depend on, and your users can't reach migrated applications. Size your gateway bandwidth based on the traffic patterns you documented in your inventory.

> **6. [Developer and admin access](developer-admin-access.md)**
>
> Azure Bastion provides secure Remote Desktop Protocol (RDP) and Secure Shell (SSH) access to your migrated VMs without exposing them to the public internet. Deploy Bastion in the hub VNet so that all spokes share a single access point. Replace your existing jump-box infrastructure with this managed service.

### Phase 4: Security

> **7. [DNS security and private name resolution](dns-security.md)**
>
> Preserve your legacy DNS naming behavior during migration. Your migrated VMs need to resolve on-premises hostnames, and on-premises systems need to resolve Azure-hosted names. Configure Azure DNS Private Resolver for bidirectional forwarding. Keep your existing DNS naming conventions to avoid application reconfiguration.

> **8. [Outbound internet access](outbound-egress.md)**
>
> Centralize all outbound internet traffic through the hub firewall. Turn off default outbound access on your spoke VNets and route outbound traffic through Azure Firewall using User-Defined Routes (UDRs). This approach mirrors your existing on-premises model where a perimeter firewall controls all internet-bound traffic.

> **9. [Azure Firewall](azure-firewall.md)**
>
> Deploy Azure Firewall in the hub VNet for centralized east-west (between spokes) and north-south (outbound) traffic control. Translate your on-premises firewall policies into Azure Firewall rules. Use network rules for non-HTTP traffic and application rules for HTTP/HTTPS filtering with Fully Qualified Domain Name (FQDN) targets.

### Phase 5: Operations

> **10. [Network monitoring and observability](monitor.md)**
>
> Set up Azure Network Watcher and Connection Monitor to validate your migration baseline. Verify that connectivity paths work as expected. Measure latency between Azure VMs and on-premises systems, and establish performance benchmarks before you migrate production workloads.

## Conditional articles

Not every lift-and-shift migration needs the same set of articles. Include these articles based on your specific requirements:

| Condition | Article | When to include |
|---|---|---|
| Internet-facing application | [Internet ingress](internet-ingress.md) | Your migrated application must be reachable from the internet |
| Layer 7 (L7) load balancing needed | [Application delivery and performance](app-delivery.md) | Your workload needs Azure Application Gateway or Azure Front Door |
| Public web application | [Web Application Firewall](web-application-firewall.md) | Your migrated application serves public HTTP/HTTPS traffic |
| Public IP exposure | [DDoS protection](ddos.md) | You have uptime requirements for resources with public endpoints |
| Multi-region needed | [Multi-region networking](multi-region.md) | Disaster recovery or active-active deployment is required |
| Cross-region connectivity | [Cross-region and multicloud connectivity](cross-region.md) | Other regions or other clouds are in scope |
| Branch-scale transit | [Azure Virtual WAN](virtual-wan.md) | You have many branch offices or connectivity edges |
| PaaS components | [PaaS private access](private-platform-as-a-service.md) | Some workload components move to Azure PaaS services |
| Large VNet estate | [Centralized network management](azure-virtual-network-manager.md) | Your migration creates a multi-VNet estate requiring centralized governance |

## Summary

By following this reading path, you designed a hub-and-spoke network with centralized shared services, established VPN or ExpressRoute connectivity back to on-premises, deployed Azure Firewall for centralized traffic inspection, configured DNS forwarding for name resolution, secured VM access through Azure Bastion, and set up monitoring to validate your migration. This architecture supports your migrated workloads while giving you centralized security and operational visibility.

## Next steps

- [Migrate-and-modernize networking path](migrate-modernize.md): If your next phase involves adopting PaaS services or containers
- [Design phases at a glance](overview.md#design-phases-at-a-glance): For the generic phase-based summary of Azure network design
- [Azure networking plan and design overview](overview.md): For capability-based exploration of all available services
