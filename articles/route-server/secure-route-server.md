---
title: Secure your Azure Route Server deployment
description: Learn how to secure Azure Route Server, with best practices for protecting your deployment.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-route-server
ms.topic: best-practice
ms.custom: horz-security
ms.date: 05/12/2026
ai-usage: ai-assisted
---

# Secure your Azure Route Server deployment

Azure Route Server is a fully managed service that simplifies dynamic routing between your network virtual appliances (NVAs) and your virtual network. It enables automatic route exchange between NVAs and Azure virtual network gateways through Border Gateway Protocol (BGP), eliminating the need to manually configure and maintain route tables. Route Server supports hub-and-spoke topologies, integration with ExpressRoute and VPN gateways, and centralized traffic inspection through security appliances.

This article provides security recommendations for Azure Route Server based on the [Azure Well-Architected Framework security pillar](/azure/well-architected/security/). For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md).

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Service-specific security

Route Server is a control-plane service for BGP route exchange. It doesn't route customer data traffic between NVAs and VMs, so secure the routing decisions it distributes and protect customer data in the workloads, gateways, and NVAs that use those routes. For more information, see [Azure Route Server FAQ](route-server-faq.md).

## Network security

Network security for Route Server involves protecting BGP peering sessions, controlling route propagation, and securing the routing infrastructure that underpins your virtual network traffic flows.

- **Route traffic through security NVAs for centralized inspection**: Use Route Server to inject routes that steer traffic through firewalls or intrusion detection systems for spoke-to-spoke and spoke-to-on-premises communication. When VPN or ExpressRoute gateways are involved, explicitly enable branch-to-branch route exchange because Route Server doesn't propagate routes between NVAs and virtual network gateways by default. For more information, see [Route injection in spoke virtual networks](route-injection-in-spokes.md).

- **Use BGP communities to control route propagation**: Configure NVAs to advertise routes with the `no-advertise` BGP community (65535:65282) to prevent unwanted route propagation to specific peers. Controlling which routes are shared across your network reduces the risk of unintended traffic paths that bypass security controls. For more information, see [Route injection in spoke virtual networks](route-injection-in-spokes.md).

- **Validate NVA ASN configuration to prevent peering failures**: Configure each NVA with a different ASN than Route Server's reserved ASN (65515). Route Server drops routes with an ASN of 0 in the AS-Path and requires eBGP multi-hop when the NVA is in a different subnet. Incorrect ASN configuration can cause BGP session failures or route blackholing. For more information, see [Troubleshoot Azure Route Server issues](troubleshoot-route-server.md).

- **Enable DDoS Protection for the Route Server virtual network**: Activate Azure DDoS Protection on the virtual network that contains your Route Server to defend its public IP endpoints against distributed denial-of-service attacks. Route Server requires public IP addresses for Azure management plane communication, making DDoS protection important for service continuity. For more information, see [Tutorial: Protect your Azure Route Server with Azure DDoS protection](tutorial-protect-route-server-ddos.md).

- **Keep the RouteServerSubnet dedicated and isolated**: Deploy Route Server in its dedicated `RouteServerSubnet` with a minimum size of /26, and don't associate user-defined routes (UDRs) or network security groups (NSGs), as these are not supported and can cause service instability. Do not associate service endpoint policies to the RouteServerSubnet, as this breaks communication with the Azure management platform and can put the Route Server into an unhealthy state. For more information, see [Azure Route Server FAQ](route-server-faq.md).

- **Exclude Route Server control plane traffic from firewall inspection**: Avoid routing BGP control plane traffic between Route Server and gateways through a firewall NVA. Forcing control plane traffic through a firewall breaks BGP peering and can cause full connectivity loss. Add UDRs to NVA subnets with the RouteServerSubnet address range using the `VirtualNetwork` next hop. For more information, see [Troubleshoot Azure Route Server issues](troubleshoot-route-server.md).

- **Configure AS path prepending for deterministic failover**: Use AS path prepending on less-preferred paths (such as VPN or NVA routes) so traffic follows your intended primary path and fails over predictably. Without prepending, asymmetric routing or unpredictable path selection can bypass intended security inspection points. For more information, see [Routing preference with Azure Route Server](hub-routing-preference.md).

For guidance on securing the virtual networks and gateways that Route Server integrates with, see:
- [Secure your Virtual Network deployment](../virtual-network/secure-virtual-network.md)
- [Secure your ExpressRoute deployment](../expressroute/secure-expressroute.md)
- [Secure your VPN Gateway deployment](../vpn-gateway/secure-vpn-gateway.md)

## Identity and access management

Identity and access management for Route Server controls who can create, configure, and modify routing infrastructure. Unauthorized changes to route peering or route exchange settings could redirect traffic through unintended paths.

- **Assign the Network Contributor role for routine management**: Use the built-in [Network Contributor](../role-based-access-control/built-in-roles/networking.md#network-contributor) role for users who need to manage Route Server, BGP peering, and route exchange settings. This role provides the necessary permissions without granting broader subscription access. For more information, see [Roles and permissions for Azure Route Server](roles-permissions.md).

- **Create custom roles for least-privilege access**: Define custom RBAC roles that grant only the specific permissions required for each operational task. For example, a monitoring role might only need `Microsoft.Network/virtualHubs/*/read` permissions, while a peering administrator needs `Microsoft.Network/virtualHubs/bgpConnections/*`. Apply these roles at the narrowest scope possible—individual resource group or resource. For more information, see [Roles and permissions for Azure Route Server](roles-permissions.md).

- **Audit role assignments regularly**: Review RBAC assignments for Route Server resources to detect excessive permissions or stale accounts. Changes to route peering or branch-to-branch connectivity settings affect traffic flows across your entire network, making access control audits critical. For more information, see [Azure RBAC overview](../role-based-access-control/overview.md).

## Data protection

Route Server processes BGP control-plane traffic only and doesn't handle customer data traffic. Protect the integrity of routing information and prevent unintended route disclosure while applying data protection controls to the workloads, NVAs, and gateways that carry data-plane traffic.

- **Protect BGP route integrity at the NVA boundary**: Configure Route Server peerings only to trusted NVA private IP addresses, validate ASN settings, and peer each NVA with both Route Server instances. Route Server documentation doesn't describe a customer-configurable BGP MD5 authentication option for Route Server peerings; use route filtering, trusted peers, and NVA-side protections for adjacent external BGP sessions where your NVA supports them. For more information, see [Configure and manage Azure Route Server](configure-route-server.md).

- **Keep Route Server control-plane paths direct**: Don't force BGP control-plane traffic between Route Server, NVAs, and gateways through a firewall or inspection NVA. Route Server exchanges routes over BGP with private NVA IP addresses in the virtual network and doesn't route data traffic between NVAs and VMs. For more information, see [Troubleshoot Azure Route Server issues](troubleshoot-route-server.md).

- **Prevent sensitive route propagation to external peers**: Use the `no-advertise` BGP community (65535:65282) for routes that shouldn't be propagated to other Route Server peers, including ExpressRoute gateways. Avoid advertising prefixes to on-premises or external peers unless the route exchange is required and approved. For more information, see [Azure Route Server FAQ](route-server-faq.md).

## Logging and monitoring

Monitoring Route Server enables you to detect BGP peering failures, unexpected route changes, and potential route hijacking. Timely detection of routing anomalies is critical because Route Server controls traffic paths across your virtual network.

- **Monitor BGP peer status and configure disconnect alerts**: Track the BGP Peer Status metric, which reports 1 for established sessions and 0 for down sessions. Configure Azure Monitor alerts that trigger when peer status drops to 0, so your team is immediately notified of BGP session failures that could indicate configuration issues, NVA failures, or potential attacks. For more information, see [Monitor Azure Route Server with Azure Monitor](monitor-route-server.md).

- **Baseline and alert on route count deviations**: Establish a baseline for the number of routes advertised and learned per BGP peer, then configure alerts for significant deviations. Unexpected increases in route counts can indicate route injection attacks or NVA misconfiguration, while sudden decreases may signal route withdrawal or peering failures. For more information, see [Monitor Azure Route Server with Azure Monitor](monitor-route-server.md).

- **Validate learned and advertised routes periodically**: Use the Azure CLI or PowerShell to retrieve the routes Route Server learns from and advertises to each peer. Compare these routes against your expected routing topology to detect unauthorized route advertisements or missing routes. For more information, see [Configure and manage Azure Route Server](configure-route-server.md).

- **Peer each NVA instance with both Route Server instances**: Establish BGP sessions between every NVA instance and both Route Server peer IPs. This ensures that Route Server receives consistent route information and that a single instance failure doesn't create monitoring blind spots or route gaps. For more information, see [Azure Route Server FAQ](route-server-faq.md).

## Compliance and governance

Governance for Route Server focuses on enforcing consistent routing configurations and preventing misconfigurations that could compromise network security.

- **Govern Route Server deployments with Azure Policy**: Use Azure Policy to audit and enforce deployment requirements for Route Server resources, such as allowed locations, required tags, and routing preference. Route Server is implemented on the `Microsoft.Network/virtualHubs` resource type, so the `Microsoft.Network/virtualHubs/hubRoutingPreference` policy alias is available for governing routing preference values across deployments. For more information, see [Azure Policy definition structure basics](../governance/policy/concepts/definition-structure-basics.md).

- **Test failover scenarios regularly**: Validate that traffic fails over correctly to backup paths and returns to primary paths when they recover. Route Server doesn't guarantee automatic traffic switchback after ExpressRoute recovery, so test and document failover behavior to ensure traffic always passes through intended security inspection points. For more information, see [Routing preference with Azure Route Server](hub-routing-preference.md).

- **Document and standardize BGP peering configurations**: Maintain a record of all NVA peer ASNs, advertised prefixes, and BGP community values. Standardized configurations make it easier to detect unauthorized changes and simplify compliance auditing. For more information, see [Configure and manage Azure Route Server](configure-route-server.md).

## Backup and recovery

Route Server provides built-in high availability. Your recovery planning should focus on maintaining routing continuity during regional failures and ensuring rapid NVA recovery.

- **Deploy in regions that support availability zones**: Route Server automatically provides zone-level redundancy when deployed in regions that support availability zones. Choose availability zone–enabled regions for production deployments to protect against datacenter-level failures without additional configuration. For more information, see [Azure Route Server FAQ](route-server-faq.md).

- **Design multi-region routing architectures for disaster recovery**: Deploy Route Server instances in multiple regions with hub-and-spoke topologies connected through global virtual network peering and NVA overlay tunnels. This design ensures that routing continues to function even during a full regional outage. For more information, see [Multi-region networking with Azure Route Server](multiregion.md).

- **Peer at least two NVA instances with Route Server per region**: Deploy redundant NVA instances in each region, each peered with both Route Server instances. This ensures that a single NVA failure doesn't disrupt route exchange or traffic inspection. For more information, see [Azure Route Server FAQ](route-server-faq.md).

## Next steps

- [What is Azure Route Server?](overview.md)
- [Roles and permissions for Azure Route Server](roles-permissions.md)
- [Monitor Azure Route Server with Azure Monitor](monitor-route-server.md)
- [Overview of Microsoft cloud security benchmark v2](/security/benchmark/azure/overview)
- [Multi-region networking with Azure Route Server](multiregion.md)
- [Azure network security best practices](../security/fundamentals/network-best-practices.md)
