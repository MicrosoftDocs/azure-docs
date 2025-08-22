---
title: DNS Record Types and IPv6 Support in Azure Traffic Manager
description: Configure DNS record types in Azure Traffic Manager. Learn how AAAA, A, and CNAME records enable IPv6 and IPv4 support for dual-stack environments. Start routing traffic today.
author: asudbring
ms.topic: concept-article
ms.date: 06/19/2025
ms.author: allensu
#customer intent: As a network administrator, I want to understand which DNS record types Azure Traffic Manager supports, so that I can choose the right configuration for my environment.
---

# DNS record types and IPv6 support in Azure Traffic Manager

Azure Traffic Manager is a DNS-based traffic load balancer that distributes traffic across global Azure regions. To effectively route traffic to your applications, Traffic Manager supports multiple DNS record types that work with both IPv4 and IPv6 protocols.

This article explains the DNS record types that Traffic Manager supports and how they enable dual-stack networking environments. You learn about AAAA records for IPv6 addresses, A records for IPv4 addresses, and CNAME records for domain aliasing. Understanding these record types helps you choose the right configuration for your network infrastructure and ensures optimal traffic routing for your applications.

## AAAA records for IPv6 support

AAAA records map domain names to IPv6 addresses. Azure Traffic Manager supports IPv6 records, enabling traffic routing to services accessible over IPv6 addresses. As the internet transitions towards IPv6, Azure Traffic Manager is equipped to handle this newer protocol, ensuring seamless reachability for services.

Azure Traffic Manager now includes these IPv6 capabilities:

- **IPv6 Maps in DNS Nameservers**: Enables efficient IPv6 address management and resolution by including IPv6 address space in internal DNS maps, providing low-latency resolution for global IPv6 clients.

- **IPv6 Client Subnet (ECS) Support**: Enables geographically accurate traffic routing by using part of the client's IPv6 address through EDNS Client Subnet extension, reducing latency for end users. ECS is used in Performance, Subnet, and Geographic Routing methods.

- **IPv6 Subnet Overrides**: Lets you control traffic routing based on the source IP address of DNS queries, supporting both IPv4 and IPv6 addresses.

These enhancements give full support for IPv6 AAAA record types and provide robust traffic management in IPv6 environments.

## A records for IPv4 addresses

A records map domain names to IPv4 addresses. IPv4 is the backbone of the internet and is still widely used, even as IPv6 adoption grows. Azure Traffic Manager supports IPv4 records, so your existing services and infrastructure stay compatible.

## CNAME records for domain aliasing

CNAME (canonical name) records map an alias name to a `trafficmanager.net` domain name. Azure Traffic Manager supports CNAME records as endpoints, so you can route traffic to a domain name instead of a specific IP address.

CNAME records simplify DNS configuration management. You can handle changes to IP addresses at the authoritative DNS level without changing settings in Azure Traffic Manager, so DNS management is more efficient and scalable.

For example, a domain like `www.contoso.com` can point to `contoso.trafficmanager.net`. You can manage changes to backend service IP addresses centrally without updating the user-facing domain.

## Dual-stack support in Traffic Manager

Azure Traffic Manager is dual stack at the DNS level, so it responds to both A (IPv4) and AAAA (IPv6) DNS queries. This dual stack capability is available only when you use CNAME-based endpoints, because A and AAAA records respond only to their respective query types. Clients connect over the protocol their network or device prefers, based on standard DNS resolution behavior.

For most production scenarios, use DNS-based (CNAME) endpoints. This approach gives you flexibility, simplifies management, and ensures compatibility with both IPv4 and IPv6 clients.

> [!NOTE]
> Traffic Manager doesn't support setting up separate endpoints within the same profile that use different DNS record types (like one A and one AAAA). This setup ensures that DNS responses from Traffic Manager match the record type the client requests.


