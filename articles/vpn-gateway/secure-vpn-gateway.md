---
title: Secure your VPN Gateway deployment
description: Learn how to secure VPN Gateway, with best practices for network security, identity management, data protection, and threat detection.
author: duongau
ms.author: duau
ms.service: azure-vpn-gateway
ms.topic: best-practice
ms.custom: horz-security
ms.date: 08/11/2026
ai-usage: ai-assisted
---

# Secure your VPN Gateway deployment

Azure VPN Gateway provides secure, encrypted connections between your on-premises networks and Azure virtual networks, or between Azure virtual networks. It supports site-to-site and point-to-site VPN connections using industry-standard IPsec/IKE protocols. Because VPN Gateway is a critical entry point for network traffic, securing it properly helps protect your Azure infrastructure and maintain the confidentiality and integrity of data in transit.

This article provides security recommendations to help protect your VPN Gateway deployment.

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security for VPN Gateway focuses on designing resilient virtual network connectivity, reducing exposure, and controlling traffic that enters or leaves your Azure environment.

- **Implement network segmentation with virtual networks**: Deploy VPN Gateway in a well-designed virtual network architecture that aligns with your enterprise segmentation strategy. Isolate high-risk systems in separate virtual networks and use clear network boundaries based on business risk. For more information, see [Azure Virtual Network overview](../virtual-network/virtual-networks-overview.md).

- **Restrict traffic with network security groups**: Apply network security groups (NSGs) to restrict traffic between internal resources based on application requirements. Use a deny-by-default approach for highly secure environments and allow only required ports, protocols, and sources. For more information, see [Network security groups](../virtual-network/network-security-groups-overview.md).

- **Inspect traffic with Azure Firewall**: Deploy Azure Firewall alongside VPN Gateway to provide centralized network-layer protection for traffic moving between subnets, virtual networks, and on-premises networks. Azure Firewall helps enforce filtering, threat intelligence, and logging policies across hub-and-spoke designs. For more information, see [Azure Firewall overview](../firewall/overview.md).

- **Use forced tunneling when internet-bound traffic must be inspected**: Configure forced tunneling for site-to-site scenarios that require internet-bound traffic from Azure workloads to pass through on-premises security inspection and auditing. For more information, see [About forced tunneling for site-to-site configurations](about-site-to-site-tunneling.md).

- **Configure NAT rules for overlapping address spaces**: Use VPN Gateway NAT only for IPsec cross-premises connections when on-premises and Azure address spaces overlap. Use supported SKUs. Enable BGP route translation when translated prefixes must be learned or advertised through BGP. For more information, see [About NAT and Azure VPN Gateway](nat-overview.md).

- **Enable Azure DDoS Network Protection**: Activate Azure DDoS Network Protection on virtual networks that host VPN Gateway and other public IP resources. DDoS Network Protection provides always-on traffic monitoring and automatic mitigation against volumetric attacks. For more information, see [Azure DDoS Protection overview](../ddos-protection/ddos-protection-overview.md).

- **Use ExpressRoute with VPN Gateway for private connectivity scenarios**: Use ExpressRoute with VPN Gateway when you need private connectivity plus encrypted VPN failover or coexistence. ExpressRoute traffic doesn't traverse the public internet, and VPN Gateway can provide a backup path for resilience. For more information, see [Configure ExpressRoute and site-to-site VPN coexistence](../expressroute/expressroute-howto-coexist-resource-manager.md).

- **Use route-based VPN gateways for advanced security controls**: Use route-based VPN gateways instead of policy-based gateways for production deployments that require custom IPsec/IKE policies, Border Gateway Protocol (BGP) routing, or multiple tunnel connections. Route-based gateways provide more flexibility for complex and secure topologies. For more information, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).

- **Deploy active-active VPN gateways for high availability**: Configure VPN Gateway in active-active mode so both gateway instances establish tunnels and traffic can fail over with less interruption during maintenance or unexpected events. Verify that your on-premises VPN device can connect to both gateway public IP addresses. For more information, see [About active-active mode VPN gateways](about-active-active-gateways.md).

## Identity and access management

Identity and access management for VPN Gateway controls who can administer gateway resources and how users authenticate to point-to-site VPN connections.

- **Use Microsoft Entra ID for point-to-site authentication**: Configure Microsoft Entra ID authentication for point-to-site VPN connections to centralize user identity, support single sign-on, and enable Conditional Access policies for remote access. Microsoft Entra ID authentication requires OpenVPN and the Azure VPN Client. For more information, see [Configure Microsoft Entra ID authentication for point-to-site VPN](point-to-site-entra-gateway.md).

- **Configure certificate-based authentication when required**: Use certificate-based authentication for point-to-site VPN scenarios that require device or user certificate trust. Protect root and client certificates, monitor expiration, and rotate certificates before they disrupt connectivity. For more information, see [Configure certificate authentication for point-to-site VPN](point-to-site-certificate-gateway.md).

- **Support multiple point-to-site authentication types deliberately**: Configure multiple authentication types only when different user populations or device scenarios require them. Combining Microsoft Entra ID and certificate authentication can improve flexibility, but document which users can use each method. For more information, see [Configure multiple authentication types for point-to-site VPN](point-to-site-about.md#authentication).

- **Require supported VPN client profiles and versions**: Generate and redistribute VPN client profiles after point-to-site configuration changes, and require client software that supports the selected tunnel and authentication type. Track Azure VPN Client version support and retirement notices for Linux and manually registered Microsoft Entra clients. For more information, see [About Point-to-Site VPN](point-to-site-about.md).

- **Apply least privilege with Azure RBAC**: Use Azure role-based access control (Azure RBAC) to grant administrators only the permissions required to manage VPN Gateway resources. Prefer built-in roles such as Network Contributor when appropriate. Use custom roles only when built-in roles are too broad. For more information, see [Network Contributor](../role-based-access-control/built-in-roles/networking.md#network-contributor).

- **Use secure administrative workstations**: Perform VPN Gateway management from hardened administrative workstations to reduce the risk of credential theft and management-plane compromise. For more information, see [Privileged access workstations deployment](/security/privileged-access-workstations/privileged-access-deployment).

- **Review privileged access regularly**: Conduct recurring access reviews for users and groups with permissions to manage VPN Gateway, virtual networks, public IP addresses, and connections. Remove stale access and require justification for continued privileged access. For more information, see [Create an access review of Azure resource and Microsoft Entra roles in PIM](/entra/id-governance/privileged-identity-management/pim-create-roles-and-resource-roles-review).

- **Monitor privileged activities**: Monitor Microsoft Entra audit logs and Azure Activity logs for VPN Gateway management operations such as gateway updates, connection changes, route changes, and diagnostic setting changes. For more information, see [Audit activity reports in Microsoft Entra ID](/entra/identity/monitoring-health/concept-audit-logs).

## Data protection

Data protection for VPN Gateway focuses on encrypting data in transit, selecting supported cryptographic settings, and protecting certificates and diagnostic data.

- **Enforce strong IPsec/IKE encryption settings**: Configure VPN Gateway connections to use strong IPsec/IKE encryption and integrity algorithms, such as AES-256 and SHA-256 or stronger, when your VPN devices support them. Avoid weak cryptographic settings that don't meet organizational or regulatory requirements. For more information, see [About cryptographic requirements and Azure VPN gateways](vpn-gateway-about-compliance-crypto.md).

- **Configure custom IPsec/IKE policies**: Define custom IPsec/IKE policies for site-to-site or VNet-to-VNet connections that must meet specific cryptographic requirements. Keep Azure and on-premises VPN device policies aligned to avoid tunnel failures. For more information, see [Configure IPsec/IKE policy for site-to-site and VNet-to-VNet connections](ipsec-ike-policy-howto.md).

- **Use supported Transport Layer Security settings for point-to-site connections**: Use VPN client and tunnel types that meet your organization's Transport Layer Security (TLS) requirements for point-to-site access. Review protocol and authentication options before enabling remote user connectivity. For more information, see [TLS policies for point-to-site VPN](point-to-site-about.md#TLS%20policies).

- **Manage certificates securely**: Store certificate material securely, track certificate expiration, and rotate point-to-site certificates before they expire. Use documented certificate generation and export procedures to avoid exposing private keys. For more information, see [Generate and export certificates for point-to-site connections](vpn-gateway-certificates-point-to-site.md).

- **Prefer certificate authentication for site-to-site VPN where supported**: Use X.509 certificate authentication instead of preshared keys for site-to-site VPN connections when the cloud, SKU, and device support it. Store outbound certificates in Azure Key Vault and grant gateway access through a user-assigned managed identity. For more information, see [About site-to-site VPN connections with certificate authentication](site-to-site-certificate-authentication-gateway-about.md).

- **Choose production-ready gateway SKUs**: Avoid the Basic SKU for production deployments because it has limited support and doesn't support important capabilities such as RADIUS authentication, IPv6, or custom IPsec/IKE policies. Use AZ gateway SKUs for new deployments. New non-AZ VpnGw1-5 SKU creation is blocked effective November 1, 2025, and existing non-AZ VpnGw1-5 gateways retire on September 30, 2026. For more information, see [About VPN Gateway SKUs](about-gateway-skus.md).

- **Protect diagnostic data destinations**: Restrict access to Log Analytics workspaces, storage accounts, or event hubs that receive VPN Gateway diagnostic logs because logs can include network identifiers, tunnel status, routing details, and authentication events. For more information, see [Set up diagnostic logs for VPN Gateway](monitor-vpn-gateway.md).

## Logging and monitoring

Logging and monitoring for VPN Gateway provide visibility into tunnel health, route changes, authentication events, and configuration changes needed for security operations and incident response.

- **Enable VPN Gateway diagnostic logging**: Configure diagnostic settings for VPN Gateway to capture `GatewayDiagnosticLog`, `TunnelDiagnosticLog`, `RouteDiagnosticLog`, `IKEDiagnosticLog`, and `P2SDiagnosticLog` categories where applicable. Send logs to an approved destination such as Azure Monitor Logs for analysis and retention. For more information, see [Set up diagnostic logs for VPN Gateway](monitor-vpn-gateway.md).

- **Monitor VPN Gateway metrics and alerts**: Use Azure Monitor to track gateway metrics, connection status, tunnel state changes, BGP peer status, and throughput. Configure alerts for connection failures, tunnel state changes, and unexpected performance degradation. For more information, see [Monitor VPN Gateway](monitor-vpn-gateway.md).

- **Monitor Microsoft Entra authentication events**: Track Microsoft Entra sign-in and audit events for point-to-site VPN users when you use Microsoft Entra authentication. Investigate failed authentication attempts, risky sign-ins, and unusual access patterns. For more information, see [Microsoft Entra audit activity reports](/entra/identity/monitoring-health/concept-audit-logs).

- **Forward VPN Gateway logs to Microsoft Sentinel**: Send VPN Gateway logs to Microsoft Sentinel or another approved security information and event management (SIEM) solution to correlate VPN activity with identity, endpoint, and network security events. For more information, see [Connect data sources to Microsoft Sentinel](/azure/sentinel/connect-data-sources).

- **Configure packet capture for investigations**: Use VPN Gateway packet capture during security investigations or complex connectivity incidents. Apply five-tuple filters to limit capture scope and reduce exposure of unrelated traffic. For more information, see [Configure packet capture for VPN gateways](packet-capture.md).

- **Monitor BGP routing behavior**: Track BGP peer status and advertised routes to detect routing anomalies, unexpected route withdrawals, or unauthorized route changes that could affect secure connectivity. For more information, see [View BGP metrics and status](monitor-vpn-gateway.md#view-bgp-metrics-and-status).

## Compliance and governance

Compliance and governance for VPN Gateway help you maintain consistent configurations, resource inventory, policy enforcement, and security team visibility across subscriptions.

- **Maintain asset inventory with tags**: Apply consistent tags to VPN Gateway resources, public IP addresses, virtual networks, resource groups, and subscriptions. Use tags such as environment, owner, data classification, and criticality to support inventory, operations, and compliance reporting. For more information, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

- **Grant security team visibility**: Assign security teams read-only visibility to VPN Gateway resources, diagnostics, and related network resources so they can monitor risk without unnecessary write permissions. Use groups and built-in roles such as Security Reader where appropriate. For more information, see [Security Reader](../role-based-access-control/built-in-roles/security.md#security-reader).

- **Enforce configuration standards with Azure Policy**: Use Azure Policy to audit or enforce approved VPN Gateway configurations, diagnostic settings, tagging, and deployment locations. Create custom policies where built-in policies don't cover your gateway requirements. For more information, see [What is Azure Policy?](../governance/policy/overview.md)

- **Assess recommendations with Microsoft Defender for Cloud**: Use Microsoft Defender for Cloud to review security recommendations and regulatory compliance results that affect VPN Gateway dependencies, such as virtual networks, public IP addresses, and logging destinations. For more information, see [Networking security recommendations](/azure/defender-for-cloud/recommendations-reference-networking#azure-networking-recommendations).

- **Query resources with Azure Resource Graph**: Use Azure Resource Graph to discover VPN Gateway resources, public IP addresses, connections, diagnostic settings, and tag coverage across subscriptions. Resource queries help identify configuration drift and unmanaged resources. For more information, see [What is Azure Resource Graph?](../governance/resource-graph/overview.md)

- **Document approved VPN topologies**: Maintain architecture standards for site-to-site, point-to-site, VNet-to-VNet, ExpressRoute coexistence, and Virtual WAN scenarios so deployments follow approved connectivity and security patterns. For more information, see [VPN Gateway topology and design](design.md).

## Backup and recovery

Backup and recovery for VPN Gateway focus on preserving configuration, designing redundant connectivity paths, and validating restoration procedures before a disruption occurs.

- **Deploy active-active VPN gateways for gateway instance redundancy**: Use active-active mode for site-to-site and VNet-to-VNet deployments that require higher availability. Active-active mode creates tunnels from both gateway instances, which helps traffic continue through the remaining instance during maintenance or an instance-level event. For more information, see [About active-active mode VPN gateways](about-active-active-gateways.md).

- **Use zone-redundant gateway SKUs for availability zone resilience**: Deploy VPN gateways with AZ SKUs, such as VpnGw1AZ, VpnGw2AZ, or higher, in regions that support availability zones. In regions that don't currently support availability zones, AZ SKUs deploy regionally until zone redundancy becomes available. For more information, see [Create a zone-redundant virtual network gateway](create-zone-redundant-vnet-gateway.md).

- **Design redundant site-to-site connections**: Use multiple on-premises VPN devices, multiple local network gateways, BGP, and equal-cost multipath (ECMP) where supported to avoid a single customer-premises equipment or carrier path becoming a recovery blocker. For more information, see [Design highly available gateway connectivity](vpn-gateway-highlyavailable.md).

- **Back up gateway configuration as infrastructure as code**: Export Azure Resource Manager templates or maintain Bicep files for VPN Gateway, public IP addresses, local network gateways, connections, and diagnostic settings so you can redeploy configurations consistently after deletion, migration, or regional recovery. For more information, see [Use Azure portal to export a template](../azure-resource-manager/templates/export-template-portal.md).

- **Plan cross-region disaster recovery**: For deployments that require regional resilience, design paired gateways or use Azure Virtual WAN deployments with multiple hubs and multiregion topologies to provide alternate VPN termination points. Document routing behavior so failover paths don't introduce asymmetric routing or unexpected latency. For more information, see [Disaster recovery design for Azure Virtual WAN](../virtual-wan/disaster-recovery-design.md).

- **Test failover and restoration procedures**: Validate tunnel failover, route convergence, DNS or client profile behavior, and operational runbooks during planned exercises. Use gateway or connection reset procedures only after verifying IPsec/IKE settings, shared keys, and VPN device configuration. For more information, see [Reset a VPN gateway or a connection](reset-gateway.md).

- **Upgrade or resize gateways without unnecessary recreation**: Use supported SKU upgrade paths to increase capacity or move to AZ SKUs while preserving the gateway public IP address when the starting and target SKUs allow upgrade. Migrate existing non-AZ VpnGw1-5 gateways to AZ SKUs before their September 30, 2026 retirement; new non-AZ VpnGw1-5 creation is already blocked as of November 1, 2025. For more information, see [Upgrade a VPN Gateway SKU](gateway-sku-upgrade.md).

- **Schedule customer-controlled maintenance windows**: Configure customer-controlled maintenance for VPN Gateway so planned platform maintenance occurs during approved change windows. Scheduling maintenance helps reduce operational impact for critical connectivity. For more information, see [Configure maintenance windows for your virtual network gateways](customer-controlled-gateway-maintenance.md).

## Next steps

- [Azure VPN Gateway documentation](index.yml)
- [VPN Gateway topology and design](design.md)
- [Monitor VPN Gateway](monitor-vpn-gateway.md)
- [What is Azure network security?](../networking/security/network-security.md)
- [Zero Trust guidance center](/security/zero-trust/zero-trust-overview)
- [Azure network security best practices](../security/fundamentals/network-best-practices.md)
