---
title: Connecting to Azure Communications Gateway
description: Learn about connecting Azure Communications Gateway to your networks and the IP addresses and domain names you need to know.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: concept-article
ms.date: 11/20/2023

#CustomerIntent: As someone planning a deployment, I want to learn about my options for connectivity, so that I can start deploying
---

# Connectivity for Azure Communications Gateway

Each Azure region in your deployment connects to your core network. You need to choose the type of connection (for example, MAPS Voice or Express Route) and route traffic between your network and Azure Communications Gateway with specific IP addresses and domain names.

This article describes:

- The types of connection you can use.
- The IP addresses and domain names you need to know about.
- Your options for choosing domain names for Azure Communications Gateway.

## Connecting to your network

Azure Communications Gateway supports multiple types of connection to your network.
- We strongly recommend using Microsoft Azure Peering Service Voice (also called MAPS Voice or MAPSV).
- If you can't use MAPS Voice, we recommend ExpressRoute Microsoft Peering.

The following table lists all the available connection types and whether they're supported for each communications service. The connection types are in the order that we recommend (with recommended services first).

|Connection type  | Operator Connect / Teams Phone Mobile  | Microsoft Teams Direct Routing  | Zoom Phone Cloud Peering | Notes |
|---------|---------|---------|---------|---------|
| MAPS Voice |✅ |✅|✅|- Best media quality because of prioritization with Microsoft network<br>- No extra costs<br>- See [Azure Internet peering for Communications Services walkthrough](../internet-peering/walkthrough-communications-services-partner.md)|
|ExpressRoute Microsoft Peering |✅|✅|✅|- Easy to deploy<br>- Extra cost<br>- Consult with your onboarding team and ensure that it's available in your region<br>- See [Using ExpressRoute for Microsoft PSTN services](/azure/expressroute/using-expressroute-for-microsoft-pstn)|
|Public internet |❌|✅|✅|- No extra setup<br>- Not recommended for production|

Set up your network as in the following diagram and configure it in accordance with any network connectivity specifications for your chosen communications services. Your network must have two sites with cross-connect functionality. For more information on the reliability design for Azure Communications Gateway, see [Reliability in Azure Communications Gateway](reliability-communications-gateway.md).

:::image type="content" source="media/azure-communications-gateway-network.svg" alt-text="Network diagram showing Azure Communications Gateway deployed into two Azure regions within one Azure Geography. The Azure Communications Gateway resource in each region connects to a communications service and both operator sites. Azure Communications Gateway uses MAPS or Express Route as its peering service between Azure and an operators network." lightbox="media/azure-communications-gateway-network.svg":::

## IP addresses and domain names

Azure Communications Gateway (ACG) deployments require multiple IP addresses and fully qualified domain names (FQDNs). The following diagram and table describe the IP addresses and FQDNs that you might need to know about.

:::image type="content" source="media/azure-communications-gateway-ip-addresses.svg" alt-text="Diagram of the IP addresses in an Azure Communications Gateway deployment, including IP addresses for operator networks and communications services. The details of each IP address follow the diagram." lightbox="media/azure-communications-gateway-ip-addresses.svg":::

|IP address or range on diagram | Description  | Notes |
|---------|---------|---------|
| 1 | IP address range in operator site A for sending signaling traffic to ACG | Specify this information when you deploy ACG. |
| 2 | IP address range or FQDN in site A for receiving signaling traffic from ACG | Specify this information when you deploy ACG. |
| 3 | IP addresses or address ranges in operator site A for sending and receiving media traffic | Specify this information when you deploy ACG. |
| 4 | IP address range in operator site B for sending signaling traffic to Azure Communications Gateway | Specify this information when you deploy ACG. |
| 5 | IP address range or FQDN in operator site A for receiving signaling traffic from ACG | Specify this information when you deploy ACG. |
| 6 | IP addresses or address ranges in operator site B for sending and receiving media traffic | Specify this information when you deploy ACG. |
| 7 | ACG region 1 FQDN for receiving signaling traffic from operator network | Get the FQDN from the **Hostname** field for region 1 in the Azure portal. Configure your network to route calls to this FQDN. |
| 8 | ACG region 1 IP addresses or address ranges for sending signaling traffic to your network | Ask your onboarding team for the values. Configure them in your network's access control lists (ACLs). |
| 9 | ACG region 1 IP addresses or address ranges for media traffic between operator network and ACG | Ask your onboarding team for the values. Configure them in your network's access control lists (ACLs). |
| 10 | ACG region 2 FQDN for receiving signaling traffic from operator network | Get the FQDN from the **Hostname** field for region 2 in the Azure portal. Configure your network to route calls to this FQDN. |
| 11 | ACG region 2 IP addresses or address ranges for sending signaling traffic to your network | Ask your onboarding team for the values. Configure them in your network's access control lists (ACLs). |
| 12 | ACG region 2 IP addresses or address ranges for media traffic between operator network and ACG | Ask your onboarding team for the values. Configure them in your network's access control lists (ACLs). |
| 13 | ACG base domain providing the Provisioning API | Get the FQDN from the **Overview** field in the Azure portal. |
| 14 | ACG region 1 IP addresses or address ranges for sending signaling traffic to communications services | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 15 | ACG region 1 FQDN or IP addresses for receiving signaling traffic from communications services | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 16 | ACG region 1 IP addresses or address ranges for media traffic between communications service and ACG | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 17 | ACG region 2 IP addresses or address ranges for sending signaling traffic to communications services | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 18 | ACG region 2 FQDN or IP addresses for receiving signaling traffic from communications services | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 19 | ACG region 2 IP addresses or address ranges for media traffic between communications service and ACG | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 20 | IP addresses or FQDNs used by communications services to receive signaling traffic | You don't need to manage this information. |
| 21 | IP addresses or FQDNs used by communications services to send signaling traffic | You don't need to manage this information. |
| 22 | IP addresses used by communications services to send and receive media traffic | You don't need to manage this information. |

> [!TIP]
> This diagram shows three sets of IP addresses for the communications service for simplicity. The details might vary for each communications service, but you won't need to manage the details because we manage the connection from Azure Communications Gateway to communications services.

Each site in your network must send traffic to its local Azure Communications Gateway service region by default, and fail over to the other region if the local region is unavailable. For example, site A must route traffic to region 1, and, if it detects that region 1 is unavailable, reroute traffic to region 2. For more information on the call routing requirements, see [Call routing requirements](reliability-communications-gateway.md#call-routing-requirements).

## Autogenerated domain names and domain delegation

Azure Communications Gateway provides multiple FQDNs:

* A _base domain_ for your deployment. This domain provides the Provisioning API. It's item 13 in [IP addresses and domain names](#ip-addresses-and-domain-names).
* _Per-region domain names_ that resolve to the signaling IP addresses to which your network should route signaling traffic. These domain names are subdomains of the base domain. They're items 7 and 10 in [IP addresses and domain names](#ip-addresses-and-domain-names).

You must decide whether you want these FQDNs to be `*.commsgw.azure.com` domain names or subdomains of a domain you already own, using [domain delegation with Azure DNS](../dns/dns-domain-delegation.md).

Domain delegation provides topology hiding and might increase customer trust, but requires giving us full control over the subdomain that you delegate. For Microsoft Teams Direct Routing, choose domain delegation if you don't want customers to see an `*.commsgw.azure.com` in their Microsoft 365 admin centers.

## Related content

- Learn how to [route calls to Azure Communications Gateway](reliability-communications-gateway.md#call-routing-requirements).
- Learn more about [planning an Azure Communications Gateway deployment](get-started.md)