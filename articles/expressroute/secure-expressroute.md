---
title: Secure your Azure ExpressRoute deployment
description: Learn how to secure Azure ExpressRoute with best practices for network connectivity, access control, data protection, monitoring, governance, and recovery.
author: duongau
ms.author: duau
ms.service: azure-expressroute
ms.topic: best-practice
ms.custom: horz-security
ms.date: 08/11/2026
ai-usage: ai-assisted
# Customer intent: As a network administrator, I want to secure Azure ExpressRoute connections so that I can protect sensitive data and ensure compliance.
---

# Secure your Azure ExpressRoute deployment

Azure ExpressRoute provides private, high-performance connectivity between your on-premises infrastructure and Microsoft cloud services through a connectivity provider or ExpressRoute Direct. Although ExpressRoute traffic doesn't traverse the public internet, you still need to secure routing, management access, connected virtual networks, monitoring data, and recovery paths.

This article provides security recommendations for Azure ExpressRoute. These recommendations help you fulfill your security obligations and improve the overall security posture of your deployment. For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md)

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security for ExpressRoute focuses on protecting hybrid connectivity, limiting traffic paths, and reducing the effect of failures or misconfigurations in the end-to-end network.

- **Configure MACsec encryption for ExpressRoute Direct**: Enable MACsec (Media Access Control Security) on ExpressRoute Direct connections to add Layer 2 encryption between your network equipment and Microsoft edge routers. Store MACsec secrets in Azure Key Vault. For more information, see [Configure MACsec encryption for ExpressRoute Direct](expressroute-howto-macsec.md).

- **Deploy ExpressRoute gateways in dedicated subnets**: Place ExpressRoute virtual network gateways only in the required `GatewaySubnet`, and don't deploy workloads or network security groups directly to that subnet. Secure workload subnets separately. For more information, see [About ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

- **Use auto-assigned public IP addresses for ExpressRoute gateways where supported**: Let Azure automatically assign and manage the Standard public IP address for new ExpressRoute virtual network gateways when your scenario supports the feature. This approach reduces public IP management exposure because the gateway public IP is managed internally by Microsoft and isn't exposed to you. For more information, see [About ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md#auto-assigned-public-ip).

- **Control workload traffic with network security groups**: Apply network security groups to workload subnets that receive traffic through ExpressRoute. Allow only required ports, protocols, and source prefixes, and deny unnecessary inbound traffic. For more information, see [Network security groups](../virtual-network/network-security-groups-overview.md).

- **Inspect traffic with Azure Firewall or network virtual appliances**: Use Azure Firewall or approved network virtual appliances to inspect traffic between on-premises networks and Azure workloads, enforce application rules, and collect traffic logs. For more information, see [Azure Firewall overview](../firewall/overview.md).

- **Segment connected networks**: Use virtual network peering, route tables, and hub-spoke designs to control how traffic moves between ExpressRoute-connected workloads. Segmentation limits lateral movement and helps isolate sensitive applications. For more information, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md) and [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md).

- **Separate peering routing domains**: Connect private peering to your core network and keep Microsoft peering traffic in a DMZ or other controlled perimeter because Microsoft peering uses public IP addressing for Microsoft cloud services. For more information, see [ExpressRoute circuits and peering](expressroute-circuit-peerings.md).

- **Review FastPath routing and inspection paths**: Enable FastPath only after you verify supported circuit types, gateway SKUs, virtual network peering behavior, user-defined route support, and Private Link limitations for your architecture. For more information, see [Azure ExpressRoute FastPath](about-fastpath.md).

- **Use Azure Route Server for supported route exchange**: When you need dynamic route exchange between ExpressRoute gateways, VPN gateways, and network virtual appliances, deploy Azure Route Server in the same virtual network as the ExpressRoute or VPN gateway. Plan downtime when you create or delete Route Server in a virtual network that already contains a virtual network gateway. For more information, see [Azure Route Server support for ExpressRoute and Azure VPN](../route-server/expressroute-vpn-support.md).

- **Use diverse providers and paths where appropriate**: Reduce single-provider or single-path dependencies by using different providers, different peering locations, or other physically diverse paths for redundant circuits. For more information, see [ExpressRoute locations and connectivity providers](expressroute-locations-providers.md).

- **Enable active-active routing on redundant connections**: Operate the primary and secondary connections of each ExpressRoute circuit in active-active mode so Microsoft can load balance each traffic flow and reroute traffic faster during connection failures. For more information, see [Designing for high availability with Azure ExpressRoute](designing-for-high-availability-with-expressroute.md).

## Identity and access management

Identity and access management for ExpressRoute controls who can create, modify, monitor, and delete circuits, peerings, gateways, and related resources. ExpressRoute doesn't provide identity-based authentication for data-plane traffic because it operates at the network layer.

- **Use Microsoft Entra ID for management-plane access**: Apply a Conditional Access policy that requires multifactor authentication and compliant-device conditions for identities that can create, modify, or delete ExpressRoute circuits, peerings, virtual network gateways, route tables, and MACsec key material in Azure Key Vault. For more information, see [Require MFA for Azure management](/entra/identity/conditional-access/policy-old-require-mfa-azure-mgmt).

- **Assign least-privilege roles**: Grant only the permissions required to manage ExpressRoute circuits, peerings, gateways, route tables, diagnostic settings, and connected network resources. Avoid broad Owner or Contributor assignments when narrower roles or custom roles are sufficient. For more information, see [About roles and permissions for ExpressRoute circuits and gateways](roles-permissions.md).

- **Use Microsoft Entra Privileged Identity Management**: Make privileged access to ExpressRoute resources eligible and time-bound instead of permanently active. Require approval and justification for high-impact roles that can change routing or delete connectivity resources. For more information, see [Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-configure).

- **Separate duties for network and security operations**: Assign different role groups for circuit provisioning, peering configuration, gateway management, monitoring, and security review. Separation of duties reduces the risk that one compromised account can change connectivity and hide evidence. For more information, see [About roles and permissions for ExpressRoute circuits and gateways](roles-permissions.md).

- **Secure MACsec secrets with Azure Key Vault access controls**: Store MACsec connectivity association keys and connectivity association key names in Key Vault, and limit Key Vault access to authorized identities that configure ExpressRoute Direct. For more information, see [Configure MACsec encryption for ExpressRoute Direct](expressroute-howto-macsec.md).

## Data protection

Data protection for ExpressRoute focuses on protecting routing sessions, encrypting sensitive traffic where required, and securing secrets and telemetry associated with the deployment.

- **Use MACsec for ExpressRoute Direct link encryption**: When you require Layer 2 encryption on dedicated ExpressRoute Direct ports, configure MACsec and manage key material securely. For more information, see [Configure MACsec encryption for ExpressRoute Direct](expressroute-howto-macsec.md).

- **Configure MD5 authentication for Border Gateway Protocol sessions when needed**: If your routing policy requires authenticated BGP sessions, use an MD5 hash for private peering or Microsoft peering to help validate Border Gateway Protocol (BGP) messages exchanged between your routers and Microsoft Enterprise Edge (MSEE) routers. For more information, see [ExpressRoute routing requirements](expressroute-routing.md).

- **Encrypt sensitive application traffic end to end**: ExpressRoute provides private connectivity but doesn't encrypt all traffic by default. Use TLS, IPsec, or application-level encryption for sensitive data that traverses ExpressRoute. For more information, see [About encryption for Azure ExpressRoute](expressroute-about-encryption.md).

- **Protect diagnostic data destinations**: ExpressRoute logs and metrics can reveal topology, performance, and routing details. Restrict access to Log Analytics workspaces, storage accounts, or event hubs that receive diagnostic data. For more information, see [Manage access to Log Analytics workspaces](/azure/azure-monitor/logs/manage-access).

- **Avoid private endpoints on Key Vaults used for MACsec secrets**: Store MACsec connectivity association keys and connectivity association key names in Key Vault, but don't place that vault behind a private endpoint because the ExpressRoute management plane must retrieve the secrets. For more information, see [Configure MACsec encryption for ExpressRoute Direct](expressroute-howto-macsec.md).

## Logging and monitoring

Logging and monitoring for ExpressRoute provide visibility into circuit health, routing availability, traffic patterns, maintenance events, and configuration changes.

- **Enable diagnostic settings for ExpressRoute resources**: Send ExpressRoute resource logs and metrics to Azure Monitor Logs, storage, or event hubs for retention and analysis. For more information, see [Monitor ExpressRoute](monitor-expressroute.md).

- **Use Network Insights for topology and health**: Use Network Insights to view ExpressRoute circuits, ExpressRoute Direct, Global Reach, peerings, connections, gateways, availability, throughput, and packet drops in Azure Monitor without extra setup. For more information, see [ExpressRoute Network Insights](expressroute-network-insights.md).

- **Create alerts for circuit and gateway health**: Configure Azure Monitor alerts for ARP availability, BGP availability, line protocol, gateway performance, throughput, packet drops, and other critical ExpressRoute metrics. For more information, see [ExpressRoute monitoring reference](monitor-expressroute-reference.md).

- **Configure Service Health alerts for maintenance**: Subscribe to Azure Service Health notifications for ExpressRoute planned maintenance and service problems so network teams can prepare for maintenance windows and validate failover paths. For more information, see [View and configure ExpressRoute maintenance alerts](maintenance-alerts.md).

- **Monitor end-to-end connectivity**: Use Connection Monitor or Network Watcher capabilities to test connectivity between on-premises locations and Azure workloads over ExpressRoute, and to detect degradation before it becomes an outage. For more information, see [Configure Connection Monitor for ExpressRoute](how-to-configure-connection-monitor.md).

- **Collect sampled flow logs with ExpressRoute Traffic Collector**: Use ExpressRoute Traffic Collector to sample flows for private and Microsoft peering and export the records to Log Analytics, Event Hubs, storage, or a SIEM for traffic analysis. For more information, see [Azure ExpressRoute Traffic Collector](traffic-collector.md).

- **Enable virtual network flow logs for connected workloads**: Use virtual network flow logs on virtual networks that host ExpressRoute-connected workloads to capture allowed and denied IP flows, encryption status, and traffic patterns that add context to sampled ExpressRoute circuit flow data. For more information, see [Virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md).

- **Correlate ExpressRoute events in Microsoft Sentinel**: Send ExpressRoute logs and related network telemetry to a Log Analytics workspace enabled for Microsoft Sentinel so you can correlate routing, firewall, identity, and workload events across the hybrid environment. For more information, see [Microsoft Sentinel data connectors](/azure/sentinel/connect-data-sources).

## Compliance and governance

Compliance and governance for ExpressRoute help keep connectivity resources inventoried, consistently configured, and auditable across subscriptions and environments.

- **Tag ExpressRoute resources consistently**: Apply tags to circuits, gateways, ExpressRoute Direct ports, route tables, and related resources to identify owners, environments, data classifications, and cost centers. For more information, see [Use tags to organize Azure resources](../azure-resource-manager/management/tag-resources.md).

- **Use Azure Policy for governance**: Use Azure Policy to audit or enforce ExpressRoute circuit diagnostic settings (use the built-in *Enable logging by category group for ExpressRoute circuits* policies for Log Analytics, Event Hub, and Storage targets), allowed deployment locations for circuits and gateways, and tagging requirements for ExpressRoute resources. For more information, see [Azure Policy built-in definitions for Azure networking services](../networking/policy-reference.md).

- **Maintain role assignment and resource inventories**: Regularly review role assignments, eligible privileged roles, circuits, peerings, gateways, connections, route tables, and diagnostic settings. Remove stale access and unused resources. For more information, see [List Azure role assignments](../role-based-access-control/role-assignments-list-portal.md).

- **Track circuit utilization and route changes**: Review bandwidth usage, route advertisements, connection health, and peering configuration changes to identify capacity risks, unusual activity, or configuration drift. For more information, see [Monitor ExpressRoute](monitor-expressroute.md).

- **Document approved routing and security baselines**: Maintain current records of circuit settings, peering configurations, BGP policies, route filters, MACsec settings, firewall paths, and failover procedures for audit and incident response. For more information, see [Create and modify routing for an ExpressRoute circuit](expressroute-howto-routing-portal-resource-manager.md).

## Backup and recovery

Backup and recovery for ExpressRoute focus on resilient architecture, tested failover paths, recoverable configuration, and planned maintenance readiness. You can't back up ExpressRoute circuits like data resources, so recovery depends on redundant connectivity and documented configuration.

- **Configure dual circuits across geographically separated peering locations**: For maximum resilience, deploy two ExpressRoute circuits in distinct peering locations and advertise the same on-premises routes over both circuits. This design reduces dependency on a single peering site. For more information, see [Design and architect Azure ExpressRoute for resilience](design-architecture-for-resiliency.md).

- **Use ExpressRoute Direct redundancy for dedicated ports**: Design ExpressRoute Direct with its redundant port pair and active-active connectivity, and preserve physical diversity in your on-premises network and cross-connects. For more information, see [About ExpressRoute Direct](expressroute-erdirect-about.md).

- **Deploy zone-redundant ExpressRoute gateways**: Use availability zone-enabled gateway SKUs such as ErGw1AZ, ErGw2AZ, or ErGw3AZ. Deploy the gateway as zone-redundant where supported. Zone-redundant gateways improve resilience for virtual network connectivity to ExpressRoute. For more information, see [Create a zone-redundant virtual network gateway](../vpn-gateway/create-zone-redundant-vnet-gateway.md).

- **Migrate existing gateways to availability zone-enabled SKUs**: For existing non-zone-redundant gateways, plan a migration to an availability zone-enabled ExpressRoute gateway SKU to improve regional resilience. For more information, see [About migrating to an availability zone-enabled ExpressRoute virtual network gateway](gateway-migration.md).

- **Configure customer-controlled maintenance windows for gateways**: Assign customer-controlled maintenance configurations to ExpressRoute virtual network gateways when you need platform maintenance to occur during approved operational windows. For more information, see [Configure customer-controlled gateway maintenance for ExpressRoute](customer-controlled-gateway-maintenance.md).

- **Configure site-to-site VPN backup when appropriate**: Use site-to-site VPN over the internet as a backup for ExpressRoute private peering when business requirements allow the added latency and bandwidth limits. For latency-sensitive, mission-critical, or bandwidth-intensive workloads, prefer multisite ExpressRoute resilience. For more information, see [Use site-to-site VPN as a backup for ExpressRoute private peering](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).

- **Configure Bidirectional Forwarding Detection on edge routers**: Configure Bidirectional Forwarding Detection on your customer or provider edge routers for private and Microsoft peering to speed up link failure detection. BFD is configured by default on the Microsoft side for newly created private and Microsoft peerings. For more information, see [Configure BFD over ExpressRoute](expressroute-bfd.md).

- **Validate failover during scheduled maintenance windows**: Test primary and secondary paths, route advertisements, AS path prepending behavior, VPN backup, and redundant circuits during approved maintenance windows or off-peak periods. For more information, see [Evaluate the resilience of multisite redundant ExpressRoute circuits](evaluate-circuit-resiliency.md) and [Planned maintenance guidance for ExpressRoute](planned-maintenance.md).

- **Export Azure Resource Manager or Bicep templates for recovery**: Export Azure Resource Manager templates or Bicep files for circuits, peerings, gateways, route filters, diagnostic settings, and related resources so you can rebuild configuration after accidental deletion or environment recovery. For more information, see [Export ARM templates in the Azure portal](../azure-resource-manager/templates/export-template-portal.md) and [Export Bicep files in the Azure portal](../azure-resource-manager/bicep/export-bicep-portal.md).

- **Use Resiliency Insights and validation**: Use ExpressRoute Resiliency Insights to assess route resilience, gateway zone redundancy, recommendations, and validation readiness. Run resilience validation tests regularly to confirm that recovery objectives remain achievable. For more information, see [ExpressRoute Resiliency Insights](resiliency-insights.md) and [ExpressRoute Resiliency Validation](resiliency-validation.md).

## Next steps

- [What is Azure ExpressRoute?](expressroute-introduction.md)
- [Design and architect Azure ExpressRoute for resilience](design-architecture-for-resiliency.md)
- [Monitor ExpressRoute](monitor-expressroute.md)
- [Secure your Azure Virtual Network deployment](../virtual-network/secure-virtual-network.md)
- [Well-Architected Framework: Security](/azure/well-architected/security/)
- [Cloud Adoption Framework: Security](/azure/cloud-adoption-framework/secure/overview)
- [Azure network security best practices](../security/fundamentals/network-best-practices.md)
