---
title: Common Azure networking workload patterns
description: See five common Azure workload patterns and the networking design guide articles that apply to each, from web apps to global multiregion enterprises.
#customer intent: As a network architect, I want to see which networking articles apply to common workload types so that I can scope my design reading efficiently.
author: duongau
ms.author: duau
ms.reviewer: mbender
ms.date: 06/17/2026
ms.topic: concept-article
ms.service: azure-virtual-network
---

# Common Azure networking workload patterns

Most Azure deployments don't use every networking service. This article shows five common workload patterns and the Azure networking design guide articles that apply to each one. These combinations aren't prescriptive. They're starting points to help you scope your reading.

Use these patterns to identify the articles most relevant to your situation. If your workload doesn't match any of them exactly, combine elements from multiple patterns as needed. For a structured way to map your own requirements to articles, use the [requirements assessment](overview.md#gather-your-requirements-first). For a quick phase-based summary, see [Design phases at a glance](overview.md#design-phases-at-a-glance). For guided, sequenced reading paths, use the [scenario guides](overview.md#choose-your-scenario).

## Web application with public users and a database backend

A typical web application serves internet traffic with a backend database. This pattern requires internet ingress, application delivery for global performance, private connectivity to PaaS data services, and web-layer security.

| Area | Articles |
|---|---|
| **Foundation** | [Virtual networks and subnets](vnets-subnets.md), [IP address planning](ip-planning.md), [Network security groups](network-application-security-groups.md) |
| **Connectivity** | [Internet ingress](internet-ingress.md), [Application delivery](app-delivery.md), [PaaS private access](private-platform-as-a-service.md) |
| **Security** | [Web Application Firewall](web-application-firewall.md), [DDoS protection](ddos.md), [DNS security](dns-security.md) |

## Internal line-of-business application connected to on-premises

An internal application that doesn't serve public internet traffic but needs connectivity back to an on-premises datacenter. Users access the application from the corporate network or through a secure remote access solution.

| Area | Articles |
|---|---|
| **Foundation** | [Virtual networks and subnets](vnets-subnets.md), [IP address planning](ip-planning.md), [Network security groups](network-application-security-groups.md) |
| **Connectivity** | [Hybrid connectivity](hybrid-connectivity.md), [Developer and admin access](developer-admin-access.md) |
| **Topology** | [Hub-and-spoke topology](hub-spoke.md) |
| **Security** | [DNS security](dns-security.md) |

## Multi-workload Azure estate with shared services

A larger environment that hosts multiple workloads and shares centralized services like a firewall, monitoring, and network management across subscriptions.

| Area | Articles |
|---|---|
| **Foundation** | [Virtual networks and subnets](vnets-subnets.md), [IP address planning](ip-planning.md), [Network security groups](network-application-security-groups.md) |
| **Topology** | [Hub-and-spoke topology](hub-spoke.md) |
| **Security** | [Azure Firewall](azure-firewall.md) |
| **Operations** | [Network monitoring](monitor.md), [Centralized network management](azure-virtual-network-manager.md) |

## Microservices on Azure Kubernetes Service (AKS), internet-facing

A containerized application running on AKS that serves internet traffic and needs outbound control, private access to backing PaaS services, and layered security.

| Area | Articles |
|---|---|
| **Foundation** | [Virtual networks and subnets](vnets-subnets.md), [IP address planning](ip-planning.md), [Network security groups](network-application-security-groups.md) |
| **Connectivity** | [Internet ingress](internet-ingress.md), [Application delivery](app-delivery.md), [Outbound internet access](outbound-egress.md), [PaaS private access](private-platform-as-a-service.md) |
| **Security** | [Azure Firewall](azure-firewall.md), [Web Application Firewall](web-application-firewall.md) |

## Global enterprise with branch offices and multiple regions

A large organization with branch offices, multiple Azure regions, ExpressRoute circuits, and centralized security and management requirements.

| Area | Articles |
|---|---|
| **Foundation** | [Virtual networks and subnets](vnets-subnets.md), [IP address planning](ip-planning.md), [Network security groups](network-application-security-groups.md) |
| **Connectivity** | [Hybrid connectivity](hybrid-connectivity.md), [Application delivery](app-delivery.md), [Cross-region and multicloud](cross-region.md) |
| **Topology** | [Azure Virtual WAN](virtual-wan.md), [Multi-region networking](multi-region.md) |
| **Security** | [Azure Firewall](azure-firewall.md) |
| **Operations** | [Centralized network management](azure-virtual-network-manager.md) |

## Next steps

- [Azure networking plan and design overview](overview.md): Return to the hub to navigate by capability or requirement.
- [Gather your requirements first](overview.md#gather-your-requirements-first): Map your specific workload inputs to design decisions.
- Choose a guided reading path: [lift and shift](lift-and-shift.md), [migrate and modernize](migrate-modernize.md), or [cross-cloud](cross-cloud.md).
