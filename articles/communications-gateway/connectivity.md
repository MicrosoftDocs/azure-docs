---
title: Connecting to Azure Communications Gateway
description: Learn about connecting Azure Communications Gateway to your networks and the IP addresses and domain names you need to know.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: concept-article
ms.date: 04/26/2024

#CustomerIntent: As someone planning a deployment, I want to learn about my options for connectivity, so that I can start deploying
---

# Connectivity for Azure Communications Gateway

Each Azure region in your deployment connects to your core network. You must choose the type of connection (for example, Microsoft Azure Peering Service Voice). You must use specific IP addresses and domain names to route traffic between your network and Azure Communications Gateway.

This article describes:

- The types of connection you can use.
- The IP addresses and domain names you need to know about.
- Your options for choosing domain names for Azure Communications Gateway.

## Connecting to your network

Azure Communications Gateway supports multiple types of connection to your network.
- We strongly recommend using Microsoft Azure Peering Service Voice (also called MAPS Voice or MAPSV).
- If you can't use MAPS Voice, we recommend ExpressRoute Microsoft Peering.

Azure Communications Gateway is normally deployed with public IP addresses on all interfaces. This means that you can use connectivity methods supporting public IP addresses to connect your network to Azure Communications Gateway such as MAPS Voice, ExpressRoute Microsoft Peering, and the public internet. If you want to control and manage the traffic between your network and Azure Communications Gateway, you can use VNet injection for Azure Communications Gateway (preview) to deploy the interfaces that connect to your network into your own subnet.

The following table lists all the available connection types and whether they're supported for each communications service. The connection types are in the order that we recommend (with recommended types first).

|Connection type  | Operator Connect / Teams Phone Mobile  | Microsoft Teams Direct Routing  | Zoom Phone Cloud Peering | Notes |
|---------|---------|---------|---------|---------|
| MAPS Voice |✅ |✅|✅|- Best media quality because of prioritization with Microsoft network<br>- No extra costs<br>- See [Internet peering for Peering Service Voice walkthrough](../internet-peering/walkthrough-communications-services-partner.md)|
|ExpressRoute Microsoft Peering |✅|✅|✅|- Easy to deploy<br>- Extra cost<br>- Consult with your onboarding team and ensure that it's available in your region<br>- See [Using ExpressRoute for Microsoft PSTN services](/azure/expressroute/using-expressroute-for-microsoft-pstn)|
|VNet Injection (preview) | ⚠️ ExpressRoute Private Peering must be used for production deployments |✅|✅|- Control connectivity to your network from your own VNet<br>- Enables use of ExpressRoute Private Peering and Azure VPN Gateways<br>- Additional deployment steps<br>-Extra cost |
|Public internet |⚠️ Lab deployments only|✅|✅|- No extra setup<br>- Where available, not recommended for production |

> [!NOTE]
> The Operator Connect and Teams Phone Mobile programs do not allow production deployments to use the public internet, including VPNs over the public internet.

Set up your network as in the following diagram and configure it in accordance with any network connectivity specifications for your chosen communications services. For production deployments, your network must have two sites with cross-connect functionality. For more information on the reliability design for Azure Communications Gateway, see [Reliability in Azure Communications Gateway](reliability-communications-gateway.md).

:::image type="content" source="media/azure-communications-gateway-network.svg" alt-text="Network diagram showing Azure Communications Gateway deployed into two Azure regions within one Azure Geography. The Azure Communications Gateway resource in each region connects to a communications service and both operator sites. Azure Communications Gateway uses MAPS or Express Route as its peering service between Azure and an operators network." lightbox="media/azure-communications-gateway-network.svg":::

Lab deployments have one Azure service region and must connect to one site in your network.

## IP addresses and domain names

Azure Communications Gateway deployments require multiple IP addresses and fully qualified domain names (FQDNs). The following diagram and table describe the IP addresses and FQDNs that you might need to know about.

:::image type="content" source="media/azure-communications-gateway-ip-addresses.svg" alt-text="Diagram of the IP addresses in an Azure Communications Gateway deployment, including IP addresses for operator networks and communications services. The details of each IP address follow the diagram." lightbox="media/azure-communications-gateway-ip-addresses.svg":::

|IP address or range on diagram | Description  | Notes |
|---------|---------|---------|
| 1 | IP address range in operator site A for sending signaling traffic to Azure Communications Gateway | Specify this information when you deploy your resource. |
| 2 | IP address range or FQDN in site A for receiving signaling traffic from Azure Communications Gateway | Specify this information when you deploy your resource. |
| 3 | IP addresses or address ranges in operator site A for sending and receiving media traffic | Specify this information when you deploy your resource. |
| 4 | IP address range in operator site B for sending signaling traffic to Azure Communications Gateway | Specify this information when you deploy your resource. |
| 5 | IP address range or FQDN in operator site A for receiving signaling traffic from Azure Communications Gateway | Specify this information when you deploy your resource. |
| 6 | IP addresses or address ranges in operator site B for sending and receiving media traffic | Specify this information when you deploy your resource. |
| 7 | Azure Communications Gateway region 1 FQDN for receiving signaling traffic from operator network | Get the FQDN from the **Hostname** field for region 1 in the Azure portal. Configure your network to route calls to this FQDN. |
| 8 | Azure Communications Gateway region 1 IP addresses or address ranges for sending signaling traffic to your network | Ask your onboarding team for the values. Configure them in your network's access control lists (ACLs). |
| 9 | Azure Communications Gateway region 1 IP addresses or address ranges for media traffic between operator network and Azure Communications Gateway | Ask your onboarding team for the values. Configure them in your network's access control lists (ACLs). |
| 10 | Azure Communications Gateway region 2 FQDN for receiving signaling traffic from operator network | Get the FQDN from the **Hostname** field for region 2 in the Azure portal. Configure your network to route calls to this FQDN. |
| 11 | Azure Communications Gateway region 2 IP addresses or address ranges for sending signaling traffic to your network | Ask your onboarding team for the values. Configure them in your network's access control lists (ACLs). |
| 12 | Azure Communications Gateway region 2 IP addresses or address ranges for media traffic between operator network and Azure Communications Gateway | Ask your onboarding team for the values. Configure them in your network's access control lists (ACLs). |
| 13 | Azure Communications Gateway base domain providing the Provisioning API | Get the FQDN from the **Overview** field in the Azure portal. |
| 14 | Azure Communications Gateway region 1 IP addresses or address ranges for sending signaling traffic to communications services | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 15 | Azure Communications Gateway region 1 FQDN or IP addresses for receiving signaling traffic from communications services | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 16 | Azure Communications Gateway region 1 IP addresses or address ranges for media traffic between communications service and Azure Communications Gateway | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 17 | Azure Communications Gateway region 2 IP addresses or address ranges for sending signaling traffic to communications services | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 18 | Azure Communications Gateway region 2 FQDN or IP addresses for receiving signaling traffic from communications services | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 19 | Azure Communications Gateway region 2 IP addresses or address ranges for media traffic between communications service and Azure Communications Gateway | - For Zoom Phone Cloud Peering, ask your onboarding team for this information and provide it to Zoom.<br>- Microsoft manages this information for other communications services. |
| 20 | IP addresses or FQDNs used by communications services to receive signaling traffic | You don't need to manage this information. |
| 21 | IP addresses or FQDNs used by communications services to send signaling traffic | You don't need to manage this information. |
| 22 | IP addresses used by communications services to send and receive media traffic | You don't need to manage this information. |

> [!TIP]
> This diagram shows three sets of IP addresses for the communications service for simplicity. The details might vary for each communications service, but you won't need to manage the details because we manage the connection from Azure Communications Gateway to communications services.

Each site in your network must send traffic to its local Azure Communications Gateway service region by default, and fail over to the other region if the local region is unavailable. For example, site A must route traffic to region 1, and, if it detects that region 1 is unavailable, reroute traffic to region 2. For more information on the call routing requirements, see [Call routing requirements](reliability-communications-gateway.md#call-routing-requirements).

## Autogenerated domain names

Azure Communications Gateway provides multiple FQDNs:

* A `<deployment-id>.commsgw.azure.com`  _base domain_ for your deployment, where `<deployment-id>` is autogenerated and unique to the deployment. This domain provides the Provisioning API. It's item 13 in [IP addresses and domain names](#ip-addresses-and-domain-names).
* _Per-region domain names_ that resolve to the signaling IP addresses to which your network should route signaling traffic. These domain names are subdomains of the base domain. They're items 7 and 10 in [IP addresses and domain names](#ip-addresses-and-domain-names).

## Port ranges used by Azure Communications Gateway

Azure Communications Gateway uses the following local port ranges. These ranges must be accessible from your network, depending on the connectivity type chosen.

| Port Range | Protocol | Transport |
|---------|---------|---------|
| 16384-23983| RTP/RTCP <br> SRTP/SRTCP | UDP |
| 5060 | SIP | UDP/TCP |
| 5061 | SIP over TLS | TCP |

All Azure Communications Gateway IP addresses can be used for both signaling (SIP) and media (RTP/RTCP). When connecting to multiple networks, additional SIP local ports are used. For details, see your Azure Communications Gateway resource in the Azure portal.

## VNet injection for Azure Communications Gateway (preview)

VNet injection for Azure Communications Gateway (preview) allows the network interfaces on your Azure Communications Gateway that connect to your network to be deployed into virtual networks in your subscription. This allows you to control the traffic flowing between your network and your Azure Communications Gateway instance using private subnets, and lets you use private connectivity to your premises such as ExpressRoute Private Peering and VPNs.

If you use VNet injection (preview) with Operator Connect or Teams Phone Mobile, your network must still meet the redundancy and resiliency requirements described in the _Network Connectivity Specification_ provided to you by your onboarding team. This mandates that your network is connected to Azure by at least 2 ExpressRoute circuits, each deployed with local redundancy and configured so that each region can use both circuits in the case of failure as described in the following diagram.

:::image type="content" source="../expressroute/media/designing-for-disaster-recovery-with-expressroute-pvt/multi-region.png" alt-text="Diagram of two regions with connectivity compliant with Operator Connect and Teams Phone Mobile.":::

> [!WARNING]
> Any traffic in your own virtual network is subject to standard Azure Virtual Network and bandwidth charges.

## Related content

- Learn how to [route calls to Azure Communications Gateway](reliability-communications-gateway.md#call-routing-requirements).
- Learn more about [planning an Azure Communications Gateway deployment](get-started.md)