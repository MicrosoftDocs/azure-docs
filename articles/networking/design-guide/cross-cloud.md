---
#customer intent: As a network architect, I want a sequenced reading path for cross-cloud connectivity so that I can design secure Azure networking to AWS or Google Cloud.
title: Azure Networking Design Guide - Cross-cloud
description: A guided reading path through the Azure Networking Design Guide for customers connecting Azure to AWS, Google Cloud, or migrating from another cloud.
author: duongau
ms.author: duau
ms.reviewer: mbender
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 06/17/2026
---

# Cross-cloud networking design path

This guide provides a sequenced reading path through the Azure Networking Design Guide for customers connecting Azure to Amazon Web Services (AWS), Google Cloud, or migrating workloads from another cloud provider. Follow the numbered steps to design secure, monitored connectivity between Azure and your existing cloud infrastructure.

## Why discovery comes first

Cross-cloud networking connects Azure to one or more external cloud environments. You might run workloads in AWS or Google Cloud that need private connectivity to Azure services, or you might migrate applications from another cloud into Azure while keeping connectivity to applications that remain behind. Either way, your Azure network must integrate with infrastructure you don't fully control on the other side.

This reading path starts with discovery instead of Azure infrastructure design. You map your existing multicloud topology first (understanding what runs where, how it connects, and what traffic flows between clouds) before you design the Azure side. This discovery-first approach prevents rework: if you design Azure networking without understanding your AWS or Google Cloud topology, you risk IP address conflicts, connectivity gaps, and security blind spots.

Your target architecture uses Azure Virtual Wide Area Network (WAN) as the transit hub (the Azure equivalent of AWS Transit Gateway) with IPSec VPN tunnels to AWS Virtual Private Gateway and Google Cloud VPN. Azure Firewall in a secure virtual hub inspects all cross-cloud and branch traffic. DNS requires careful cutover planning to keep name resolution working across cloud boundaries during migration.

## Prerequisites

- Read the [Azure networking plan and design overview](overview.md) for orientation on available Azure networking services.
- Complete topology discovery of your AWS and Google Cloud environments:
  - AWS: Run AWS Migration Hub or Workload Discovery on AWS to inventory Virtual Private Clouds (VPCs), Transit Gateways, and inter-VPC connectivity.
  - Google Cloud: Use Network Intelligence Center to map VPC networks, Cloud Interconnect attachments, and firewall rules.
- Document cross-cloud traffic flows: which applications communicate between clouds, required bandwidth, latency sensitivity, and encryption requirements.
- Create an inventory of IP address ranges across all three clouds to identify overlaps.

## Your reading path

The following phases guide you through cross-cloud network design in sequence.

### Phase 1: Discovery

Start with discovery. Understand your multicloud landscape before designing Azure infrastructure.

> **1. [Cross-region and multicloud connectivity](cross-region.md)**
>
> This article is your central design decision point. Map your multicloud topology: which AWS VPCs and Google Cloud VPCs need connectivity to Azure, what traffic flows between clouds, and what architecture pattern fits your scale. Use the service mapping between cloud providers (Transit Gateway to Virtual WAN, Security Groups to Network Security Groups, VPC Peering to VNet peering) to translate your existing design into Azure terms.

> **2. [Azure Virtual WAN](virtual-wan.md)**
>
> Virtual WAN is the recommended transit model when you have multiple VPCs, branches, regions, or cloud edges. Virtual WAN provides the Azure equivalent of AWS Transit Gateway: automated routing, centralized security, and multibranch/multiregion scale. Evaluate whether your cross-cloud estate justifies Virtual WAN or whether a simpler hub-and-spoke with VPN Gateway is sufficient.

### Phase 2: Foundations

> **3. [Virtual networks and subnets](vnets-subnets.md)**
>
> Design your Azure VNet as the landing zone for migrated or connected workloads. Map from AWS VPC and Google Cloud VPC concepts: VPC subnets become Azure subnets, availability zones map to Azure availability zones, and route tables follow similar patterns. Focus on subnet sizing for the workloads that land in Azure.

> **4. [IP address planning](ip-planning.md)**
>
> Plan non-overlapping address space across all three clouds. This step is critical for cross-cloud connectivity: if your Azure VNet ranges overlap with AWS VPC ranges or Google Cloud VPC ranges, you can't establish VPN tunnels between them. Document every CIDR block in use across all environments before allocating Azure address space.

> **5. [Network security groups and application security groups](network-application-security-groups.md)**
>
> Mirror your AWS Security Groups and Google Cloud firewall rules as Azure Network Security Groups (NSGs). Translate your existing allow and deny rules into NSG format. Use Application Security Groups (ASGs) to replicate the tag-based grouping that AWS Security Group references provide.

### Phase 3: Connectivity

> **6. [Hybrid connectivity](hybrid-connectivity.md)**
>
> Set up IPSec VPN tunnels between Azure and AWS or Google Cloud for encrypted cross-cloud transit. Connect Azure VPN Gateway (or Virtual WAN VPN connections) to AWS Virtual Private Gateway and Google Cloud VPN. Choose tunnel bandwidth based on your cross-cloud traffic needs. Plan for redundant tunnels to avoid single points of failure.

### Phase 4: Security

> **7. [DNS security and private name resolution](dns-security.md)**
>
> Plan your DNS cutover strategy before migrating workloads. Applications in AWS or Google Cloud resolve hostnames that might need to point to Azure after migration. Configure Azure DNS Private Resolver with outbound endpoints for cross-cloud name resolution. See the [DNS cutover checklist](#dns-cutover-checklist) later in this article for step-by-step migration guidance.

> **8. [Azure Firewall](azure-firewall.md)**
>
> Deploy Azure Firewall in a secure virtual hub to inspect all cross-cloud and branch traffic. Every packet traversing between Azure and AWS or Google Cloud passes through the firewall for logging and policy enforcement. Use network rules for cross-cloud traffic patterns and threat intelligence filtering to block known malicious destinations.

### Phase 5: Operations

> **9. [Network monitoring and observability](monitor.md)**
>
> Cross-cloud estates are harder to troubleshoot because you don't control both ends of every connection. Enable Azure Network Watcher for connectivity testing, VPN tunnel diagnostics, and packet capture. Monitor tunnel uptime, latency between clouds, and throughput against your capacity requirements. Set alerts for tunnel disconnections that affect cross-cloud application availability.

## Conditional articles

Include these articles based on your specific requirements:

| Condition | Article | When to include |
|---|---|---|
| Public-facing application | [Internet ingress](internet-ingress.md) | Your migrated application is internet-facing (direct public access required) |
| HTTP/HTTPS application | [Web Application Firewall](web-application-firewall.md) | Layer 7 WAF is needed for public-facing web applications |
| Layer 7 distribution needed | [Application delivery and performance](app-delivery.md) | You need global or regional traffic distribution after migration |
| Public endpoints | [DDoS protection](ddos.md) | You have uptime requirements for public-facing services |
| Hub-and-spoke preferred | [Hub-and-spoke topology](hub-spoke.md) | Your cross-cloud estate is small enough that Virtual WAN isn't justified |
| Multi-region Azure | [Multi-region networking](multi-region.md) | Your Azure target spans multiple regions beyond the cross-cloud connectivity |
| VM admin access | [Developer and admin access](developer-admin-access.md) | You need secure RDP/SSH access to Azure-hosted VMs |
| Centralized egress | [Outbound internet access](outbound-egress.md) | Centralized internet egress policy is part of your target design |
| Large VNet estate | [Centralized network management](azure-virtual-network-manager.md) | The Azure side grows into a governed multisubscription estate |
| PaaS private endpoints | [PaaS private access](private-platform-as-a-service.md) | Your target architecture includes Azure PaaS services with private endpoints |

## Cross-cloud discovery checklist

Before you design Azure networking, map your existing cloud services to Azure equivalents. This mapping accelerates design decisions and prevents mismatched expectations.

### AWS to Azure service mapping

| AWS service | Azure equivalent | Notes |
|---|---|---|
| Transit Gateway | Azure Virtual WAN | Centralized routing hub for multi-VPC, multiregion, multicloud |
| VPC | Azure Virtual Network | Isolated network boundary with subnets and route tables |
| VPC Peering | VNet peering | Direct connectivity between two virtual networks |
| Security Groups | Network Security Groups (NSGs) | Stateful traffic filtering at the subnet or network interface level |
| Network ACLs | NSGs (subnet-level) | Azure NSGs combine both Security Group and NACL functions |
| Virtual Private Gateway | VPN Gateway | IPSec VPN termination point |
| Direct Connect | Azure ExpressRoute | Dedicated private connectivity (not over public internet) |
| Route 53 Private Hosted Zones | Azure Private DNS zones | Private DNS name resolution within virtual networks |
| Route Tables | User-Defined Routes (UDRs) | Custom routing to override Azure system routes or AWS implied routes |
| Elastic Load Balancer (ALB/NLB) | Azure Load Balancer / Application Gateway | L4 and L7 load balancing; Application Gateway provides WAF capabilities similar to AWS ALB with AWS WAF |
| AWS WAF | Azure Web Application Firewall | Layer 7 HTTP/HTTPS protection |
| Network Firewall | Azure Firewall | Stateful network firewall with threat intelligence |

### Google Cloud to Azure service mapping

| Google Cloud service | Azure equivalent | Notes |
|---|---|---|
| VPC Network | Azure Virtual Network | Global resource in Google Cloud; regional in Azure (use VNet peering for cross-region) |
| Cloud Interconnect | Azure ExpressRoute | Dedicated private connectivity |
| Cloud VPN | VPN Gateway | IPSec VPN tunnels |
| Cloud NAT | Azure NAT Gateway | Outbound internet access for private resources |
| Cloud Router | Azure Route Server | Dynamic BGP route exchange with network virtual appliances |
| Cloud Armor | Azure Web Application Firewall | Layer 7 DDoS and application protection |
| Firewall Rules | Network Security Groups | Traffic filtering (Google Cloud rules are global; Azure NSGs are per-subnet or per-NIC) |
| Cloud DNS Private Zones | Azure Private DNS zones | Private name resolution within networks |
| Network Intelligence Center | Azure Network Watcher | Network monitoring, diagnostics, and topology visualization |

## DNS cutover checklist

DNS cutover is the highest-risk step in cross-cloud migration. Follow this checklist to minimize resolution failures during transition.

### Before migration

1. **Lower Time to Live (TTL) values** on all DNS records that change. Set TTL to 60–300 seconds at least 48 hours before cutover. This step ensures caches expire quickly when you update records.
1. **Document every DNS record** that points to infrastructure you're migrating: A records for servers, CNAME records for services, MX records for mail, and SRV records for service discovery.
1. **Configure Azure DNS Private Resolver** with outbound endpoints in your Azure VNet. This resolver forwards queries for AWS/Google Cloud-hosted zones to the appropriate upstream DNS servers during the coexistence period.
1. **Test forward and reverse resolution** from Azure VNets to AWS/Google Cloud-hosted names before migrating any workloads.

### During migration

5. **Update CNAME records** for services that move to Azure. Point CNAMEs to Azure Front Door, Azure Traffic Manager, or Azure Application Gateway endpoints as each service migrates.
6. **Update host A records** for individual servers that migrate. Replace the AWS or Google Cloud IP addresses with Azure private IP addresses in your DNS zones.
7. **Keep conditional forwarding active** so that names in zones you didn't migrate yet continue resolving through the original cloud's DNS servers.

### After migration

8. **Verify resolution from all locations:** on-premises clients, Azure VNets, and any remaining AWS or Google Cloud workloads must all resolve the migrated names correctly.
9. **Raise TTL values** back to production levels (3,600 seconds or higher) after you confirm stable resolution.
10. **Remove conditional forwarders** for zones that are fully migrated to Azure DNS. Keep forwarders only for zones that remain in AWS or Google Cloud.

## What you built

By following this reading path, you connected Azure to your existing AWS or Google Cloud environment with encrypted transit, centralized firewall inspection, and monitored connectivity. Your design includes:

- Multicloud topology discovery and service mapping
- Virtual WAN or hub-and-spoke transit architecture
- IPSec VPN tunnels to AWS and Google Cloud
- Azure Firewall for cross-cloud traffic inspection
- DNS cutover with Private Resolver for cross-cloud name resolution
- Network Watcher monitoring for tunnel health and performance

## Next steps

- [Lift-and-shift networking path](lift-and-shift.md): If you also have on-premises workloads migrating directly to Azure IaaS
- [Migrate-and-modernize networking path](migrate-modernize.md): If your Azure deployment adopts PaaS services and containers
- [Design phases at a glance](overview.md#design-phases-at-a-glance): For the generic phase-based summary of Azure network design
- [Azure networking plan and design overview](overview.md): For capability-based exploration of all available services
