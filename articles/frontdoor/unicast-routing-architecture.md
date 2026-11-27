---
title: Unicast Routing Architecture
titleSuffix: Azure Front Door
description: Azure Front Door Unicast Routing Architecture, request flow, remote resolver scenario, and handling request blackholing.
author: ravisha22
ms.author: ranandag
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/26/2026
---

# Unicast routing architecture

Azure Front Door uses unicast routing to select a point of presence (PoP) based on location, capacity, and health. This article explains the request flow, how remote DNS resolvers affect PoP selection, and how routing protection handles request blackholing.

## Why unicast routing?

In May 2026, Azure Front Door transitioned from Anycast to Unicast routing. Unicast routing provides several advantages, such as:

- **Granular location-based routing controls** – Unicast routing implements granular PoP site-level location maps, which allow user requests to be routed to the nearest site based on geolocation data.

- **Load-aware routing** – The new routing architecture uses hundreds of health signals from each Azure Front Door environment worldwide and routes requests to the site with optimal availability and loading conditions to ensure successful request servicing.

- **Better load management** – New routing architecture allows better loading and density management across Azure Front Door PoPs to ensure the best user experience.

- **Better handling of failure modes** – Azure Front Door has built-in routing layers and redundancies that handle common failure modes such as traffic blackholing.

## Request flow

The following diagram shows a typical unicast request flow. The steps are:

1. The user in City A requests name resolution for an endpoint www.contoso.com.

1. A DNS resolver in the same geography resolves the requested endpoint.

1. The request resolves to the CNAME record of Azure Front Door’s PoP endpoint.

1. If the request contains the user’s IP, Azure Front Door uses it to identify the approximate location of the user and map it to City A. If the request contains no IP (stripped) or instead contains the DNS server’s IP, Front Door uses the DNS server’s IP as an indication of the user’s location to map the request to a nearby PoP.

1. There are multiple Azure Front Door PoPs in City A.

1. Front Door service uses the capacity and health metrics of the Azure Front Door PoP environments in City A and returns the VIP of the appropriate environment.

1. The user establishes a direct connection to the VIP returned.

:::image type="content" source="media/unicast-routing-architecture/local-resolver.png" alt-text="Diagram of a user in City A using a local DNS resolver and connecting to the selected Azure Front Door environment." lightbox="media/unicast-routing-architecture/local-resolver.png":::

Figure 1. User location mapping influences the PoP selected to route the user’s request.

## Remote resolver scenario

In Anycast routing, a DNS resolver returns an Anycast IP address, which all the Azure Front Door PoPs worldwide advertise. The request always routes to the nearest PoP as calculated by BGP.

In Unicast routing, as shown earlier, Front Door uses geolocation information to pick the optimal PoP to route the request. If no geo information is available, Azure Front Door uses the DNS resolver’s location and returns the VIP of the PoP that’s optimal to receive the traffic relative to the DNS resolver’s location. For example, the user might be in City A, while the DNS resolver is in City B. Front Door returns the VIP of the PoP in City B based on the resolver’s geo location as shown in the following image.

:::image type="content" source="media/unicast-routing-architecture/remote-resolver.png" alt-text="Diagram of a user in City A using a DNS resolver in City B to select an Azure Front Door PoP in City B." lightbox="media/unicast-routing-architecture/remote-resolver.png":::

Figure 2. DNS resolver placement influences the PoP selected for a user in a different city.

This scenario might not be ideal for all Azure Front Door customers. Ensure the request preserves the user’s IP or choose to place resolvers closer to your user base.

This scenario might also apply to situations where the user is connected to a remote VPN, secure web gateway server, or remote proxy service with its own DNS resolver.

### Supply client-subnet information with ECS

ECS is an EDNS option that lets a DNS resolver include information about the client's network in a DNS query. It conveys a client subnet, not necessarily the client's complete IP address. For the protocol definition, see [RFC 7871: Client Subnet in DNS Queries](https://www.rfc-editor.org/rfc/rfc7871.html).

If your DNS deployment supports ECS and its use is appropriate for your users, work with your DNS administrator or resolver provider to:

- Verify that the recursive resolver supports sending ECS to the authoritative DNS service during resolution of the Front Door endpoint.

- Configure the resolver to supply an appropriate client subnet according to the resolver's documentation and your organization's privacy policy. Don't assume that the resolver sends ECS by default.

- If your deployment uses DNS forwarders, verify how each forwarder handles ECS. Ensure that usable client-subnet information reaches the resolver making the authoritative query, rather than being omitted or replaced with information that represents a remote resolver.

- Verify the outgoing DNS queries using resolver logs or a DNS packet capture. Check for the ECS option and confirm that it represents the intended client network. A browser request or an HTTP header such as X-Forwarded-For doesn't establish that ECS was included in DNS resolution.

- Confirm that the resolver handles ECS-aware caching and respects user opt-out behavior as described in RFC 7871.

> [!NOTE]
> ECS support and configuration depend on the DNS resolver or provider; this isn't a Front Door profile setting. ECS exposes information about the client's network and has privacy implications. Use the minimum network information appropriate for your deployment, respect opt-out preferences, and don't require users to disclose their full IP address.

If ECS isn't supported, isn't enabled, or doesn't provide usable location information, consider DNS resolvers close to your user base. Front Door uses the resolver's location when client-location information isn't available.

## Handling request blackholing

In cases where an Azure Front Door environment in a PoP location goes offline unexpectedly, the Unicast routing architecture prevents request blackholing. Blackholing occurs when requests continue to route to the offline environment and fail.

In Unicast routing architecture, each Azure Front Door environment in a PoP location advertises both an IP prefix from which it receives its VIP and the /32 VIP. When a specific Azure Front Door environment fails, the request routes to the prefix instead and one of the healthy Azure Front Door environments handles it.

:::image type="content" source="media/unicast-routing-architecture/routing-failover.png" alt-text="Diagram of requests to an unavailable Azure Front Door PoP in City B falling back to a healthy PoP in City A." lightbox="media/unicast-routing-architecture/routing-failover.png":::

Figure 3. Azure Front Door routing protection prevents request blackholing and other failure modes.

The user in City A resolves an endpoint through a DNS resolver in City B. Capacity and health signals feed Azure Front Door DNS, which returns the City B PoP VIP. When PoP 3 in City B becomes unavailable, requests fall back to healthy PoP 1 in City A, which connects to the origin. Healthy PoP 2 in City A is also shown.

## Terminology

- **PoP (Point of Presence)** – A physical location where Azure Front Door is located for servicing user requests. Learn more in [Azure Front Door POP Locations by Region | Microsoft Learn](edge-locations-by-region.md).

- **Azure Front Door environment** – A virtual instance of Azure Front Door service that's in a PoP location. Each PoP location can have one or more Azure Front Door environments.

- **VIP** – Virtual IP address assigned to each Azure Front Door environment as part of the Unicast routing architecture, so the requests can reach it directly.

- **Geo location** – Identifying the approximate location or geography where the request originates for the purpose of routing it to optimal Azure Front Door PoP. Learn more in [Geo-filtering on a domain for Azure Front Door | Microsoft Learn](../web-application-firewall/afds/waf-front-door-geo-filtering.md).

- **Azure Front Door Capacity & Health Metrics**  - Azure Front Door platform receives usage and availability information from all the Azure Front Door environments worldwide. These signals enable routing traffic to the appropriate Azure Front Door environment to provide the optimal user experience.

- **DNS Resolver** – Refers to the DNS name resolution server or service used by the end user. This name server or service can be located close to or remote from the user.

## References

- [Azure Front Door routing architecture](front-door-routing-architecture.md)

- [Azure Front Door traffic acceleration](front-door-traffic-acceleration.md)
