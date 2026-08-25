---
title: Secure your Azure Virtual WAN deployment
description: Learn how to secure Azure Virtual WAN by using best practices for network security, identity, data protection, and logging.
author: duongau
ms.author: duau
ms.service: azure-virtual-wan
ms.topic: best-practice
ms.custom: horz-security
ms.date: 08/11/2026
ai-usage: ai-assisted
---

# Secure your Azure Virtual WAN deployment

Azure Virtual WAN is a networking service that brings many networking, security, and routing functionalities together to provide a single operational interface. Virtual WAN helps organizations connect and secure branch offices, remote users, and Azure resources through a global transit network architecture. When deploying Virtual WAN for mission-critical connectivity, implement comprehensive security controls to protect your network infrastructure and data in transit.

This article provides security recommendations for Azure Virtual WAN.

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security for Virtual WAN focuses on protecting data in transit, securing connectivity between on-premises and cloud resources, and implementing proper traffic inspection and segmentation for all network communications.

- **Choose Standard Virtual WAN for secure transit scenarios**: Use Standard Virtual WAN when your deployment requires User VPN, ExpressRoute, inter-hub transit, virtual network-to-virtual network transit, Azure Firewall, or Network Virtual Appliances. Basic Virtual WAN supports site-to-site VPN only. You can upgrade from Basic to Standard but can't revert from Standard to Basic. For more information, see [What is Azure Virtual WAN?](virtual-wan-about.md#basicstandard)

- **Configure IPsec over ExpressRoute with Virtual WAN**: Use an IPsec/IKE VPN connection over ExpressRoute private peering to secure data between on-premises networks and Azure virtual networks. This configuration provides encrypted transit without requiring traffic to traverse the public internet or use public IP addresses. For more information, see [ExpressRoute encryption: IPsec over ExpressRoute for Virtual WAN](vpn-over-expressroute.md).

- **Configure secure site-to-site VPN connections**: Implement IPsec VPN connections with strong encryption protocols for site-to-site connectivity. Virtual WAN supports custom IPsec policies that let you configure IKE/IPsec encryption, integrity, DH group, PFS group, and SA lifetime settings. For more information, see [Default policies for IPsec connectivity](virtual-wan-ipsec.md).

- **Secure point-to-site VPN for remote users**: Deploy User VPN (point-to-site) connections with certificate-based, RADIUS, or Microsoft Entra ID authentication to provide secure remote access. Use IKEv2 or OpenVPN based on the authentication method and client requirements. Configure appropriate encryption settings and access policies to protect remote user connections. For more information, see [Create a User VPN (point-to-site) connection](virtual-wan-point-to-site-portal.md).

- **Use secured virtual hubs with Azure Firewall Manager**: Deploy Azure Firewall in Virtual WAN hubs to create secured virtual hubs that inspect and filter network traffic. Use Azure Firewall Manager and firewall policy to centralize security policy management across hubs. For more information, see [Secure your virtual hub using Azure Firewall Manager](../firewall-manager/secure-cloud-network.md).

- **Configure routing intent for centralized inspection**: Use routing intent and routing policies to automatically route internet-bound traffic and private traffic through Azure Firewall, eligible Network Virtual Appliances, or software as a service (SaaS) security solutions deployed in the virtual hub. Each hub can have one internet traffic routing policy and one private traffic routing policy, each with a single next hop resource. Private traffic routing policies can inspect branch-to-branch, branch-to-virtual network, virtual network-to-branch, and inter-hub traffic. For more information, see [Configure Virtual WAN Hub routing intent and routing policies](how-to-routing-policies.md).

- **Implement network segmentation with routing policies**: Use Virtual WAN's custom routing capabilities to implement network segmentation and control traffic flow between different network segments. Configure route tables, routing policies, and propagation labels to ensure that traffic flows only to authorized destinations. For more information, see [About virtual hub routing](about-virtual-hub-routing.md).

- **Use customer-managed routing for spoke segmentation**: Configure custom virtual hub route tables, static routes, and route propagation to isolate spoke virtual networks and branches according to your connectivity matrix. This segmentation helps prevent unintended lateral movement while allowing required branch and shared-services access. For more information, see [Custom isolation for virtual networks and branches](scenario-isolate-vnets-custom.md).

- **Enable forced tunneling for point-to-site VPN**: Configure forced tunneling to route all internet-bound traffic from remote users through Azure for inspection and policy enforcement. This configuration subjects remote user traffic to the same security controls as on-premises traffic. For more information, see [Configure forced tunneling for Virtual WAN point-to-site VPN](how-to-forced-tunnel.md).

- **Use Network Virtual Appliances for advanced security**: Deploy supported third-party Network Virtual Appliances in Virtual WAN hubs when you need integrated SD-WAN and next-generation firewall capabilities. Not all Azure Marketplace appliances can be deployed into a Virtual WAN hub, and routing intent supports only eligible security or dual-role appliances as next hops. For more information, see [About Network Virtual Appliances in a Virtual WAN hub](about-nva-hub.md).

## Identity and access management

Identity and access management for Virtual WAN ensures that only authorized users, services, and automation can access network resources and manage Virtual WAN configurations.

- **Implement Microsoft Entra ID authentication for User VPN**: Configure Microsoft Entra ID authentication for point-to-site VPN connections that use the OpenVPN protocol to use centralized identity management, Conditional Access policies, and multifactor authentication. Use the Microsoft-registered Azure VPN Client app configuration for new deployments and migrations from manually registered clients. For more information, see [Configure a point-to-site User VPN connection with Microsoft Entra ID authentication](point-to-site-entra-gateway.md).

- **Apply role-based access control for Virtual WAN management**: Use Azure role-based access control (RBAC) to control who can manage Virtual WAN resources and what actions they can perform. Assign appropriate roles to users and service principals to follow the principle of least privilege for network infrastructure management. For more information, see [About roles and permissions for Azure Virtual WAN](roles-permissions.md).

- **Use custom roles for privileged access**: Create custom roles when built-in roles such as Network Contributor are broader than required. Include only the Virtual WAN, virtual hub, gateway, routing, and connection permissions that administrators or automation need. For more information, see [Custom roles](roles-permissions.md#custom-roles).

- **Enable managed identities for automation**: Use managed identities for pipelines and custom applications that provision or manage Virtual WAN resources such as virtual hubs, gateways, route tables, and connections, so automation authenticates without storing credentials in code or configuration files. For more information, see [Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).

- **Configure certificate-based authentication with proper lifecycle management**: Implement certificate-based authentication for VPN connections with proper certificate lifecycle management including rotation and revocation. Store certificates securely and ensure they're properly distributed to authorized devices only. For more information, see [About point-to-site VPN](point-to-site-concepts.md#azure-certificate-authentication-concepts) and [Generate and export certificates for point-to-site](certificates-point-to-site.md).

- **Use RADIUS authentication for centralized user management**: Implement Remote Authentication Dial-In User Service (RADIUS) server authentication to centralize user management in existing identity infrastructure. Configure RADIUS authentication with strong protocols such as EAP-TLS for certificate-based authentication or EAP-MSCHAPv2 for username/password authentication. For more information, see [Create a P2S User VPN connection using certificate or RADIUS authentication](virtual-wan-point-to-site-portal.md).

## Data protection

Data protection in Virtual WAN focuses on ensuring that all network traffic is properly encrypted and that encryption keys, certificates, and secrets are managed securely.

- **Enable data-in-transit encryption for all connections**: Configure encryption for Virtual WAN site-to-site VPN, point-to-site VPN, and ExpressRoute connections. Use IPsec policies for VPN connections and IPsec over ExpressRoute when ExpressRoute traffic requires encryption. For more information, see [Data in transit encryption](/azure/security/fundamentals/double-encryption#data-in-transit).

- **Use Azure Key Vault for credential management**: Store and manage VPN pre-shared keys, certificates, and other credentials securely in Azure Key Vault instead of embedding them in configuration files or code. Use Key Vault access controls and auditing to protect cryptographic materials used by VPN configurations. For more information, see [Azure Key Vault overview](/azure/key-vault/general/overview).

- **Configure strong encryption algorithms**: Select strong encryption algorithms and key sizes for all VPN connections. Avoid deprecated or weak cryptographic protocols and regularly review encryption settings to ensure they meet current security standards and compliance requirements. For more information, see [Configure custom IPsec policies](virtual-wan-custom-ipsec-portal.md).

- **Secure exported VPN profiles and certificates**: Protect downloaded point-to-site VPN profiles, root certificates, and client certificates as sensitive data. Store them securely, distribute them only to authorized users and devices, and rotate certificates when users or devices no longer require access. For more information, see [Download a User VPN profile](about-vpn-profile-download.md).

- **Protect monitoring and diagnostic data**: Treat Virtual WAN diagnostic logs, metrics, and packet captures as sensitive operational data because they can contain IP addresses, topology details, and traffic patterns. Restrict access to Log Analytics workspaces, storage accounts, and packet capture output. For more information, see [Monitor Azure Virtual WAN](monitor-virtual-wan.md) and [Manage packet captures for Virtual WAN site-to-site VPN](packet-capture-site-to-site-portal.md).

## Logging and monitoring

Logging and monitoring for Virtual WAN provide visibility into network activities, connection health, routing behavior, and potential security threats.

- **Enable Azure resource logs for Virtual WAN**: Configure resource logs for Virtual WAN and related resources to capture detailed information about network activities, connection attempts, and traffic flows. Diagnostic logs are available for site-to-site and point-to-site VPN gateways, and ExpressRoute gateway metrics can be exported as logs by using diagnostic settings. Send diagnostics to Log Analytics, Event Hubs, or storage accounts. For more information, see [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md).

- **Configure centralized log collection with Azure Monitor**: Use Azure Monitor to collect and analyze logs from Virtual WAN resources, including connection logs, traffic analytics, and performance metrics. Configure Log Analytics workspaces to centralize log storage and enable correlation across multiple Virtual WAN components. For more information, see [Monitoring Virtual WAN with Azure Monitor](monitor-virtual-wan.md).

- **Set up Azure Monitor Insights for Virtual WAN**: Implement Azure Monitor Insights to gain enhanced visibility into Virtual WAN performance, connectivity status, and network topology. This solution provides prebuilt dashboards and analytics specifically designed for Virtual WAN monitoring. For more information, see [Azure Monitor Insights for Virtual WAN](azure-monitor-insights.md).

- **Monitor hub router and gateway metrics**: Track virtual hub routing infrastructure units, routes advertised to peers, Border Gateway Protocol (BGP) peer status, tunnel packet drops, gateway bandwidth, and point-to-site connection counts. These metrics help detect routing anomalies, capacity pressure, and connection instability. For more information, see [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md).

- **Configure alerting for connection failures and anomalies**: Set up Azure Monitor alerts to notify administrators of connection failures, performance degradation, BGP changes, packet drops, or unusual traffic patterns. Configure appropriate thresholds and notification channels to ensure timely response to potential problems. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

- **Enable virtual network flow logs where applicable**: Use virtual network (VNet) flow logs on connected virtual networks and subnets to capture IP traffic metadata for investigation and threat detection. Send flow logs to Log Analytics and use Traffic Analytics to identify unexpected flows. If you still rely on NSG flow logs, migrate them to VNet flow logs. NSG flow logs can't be newly created after June 30, 2025, and retire on September 30, 2027. For more information, see [Virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md) and [Migrate from NSG flow logs to virtual network flow logs](../network-watcher/nsg-flow-logs-migrate.md).

- **Review secured hub diagnostics**: For secured hubs with Azure Firewall, enable Azure Firewall diagnostics from the firewall resource and correlate firewall logs with Virtual WAN metrics and routing data. This correlation helps verify that routing intent sends traffic through the intended inspection point. For more information, see [Monitor Azure Virtual WAN](monitor-virtual-wan.md#create-diagnostic).

## Compliance and governance

Compliance and governance for Virtual WAN help ensure that your network infrastructure configurations comply with organizational policies, security standards, and operational requirements.

- **Use Azure Policy for configuration compliance**: Implement Azure Policy to monitor and enforce Virtual WAN configurations according to your organization's security standards. Create custom policies to ensure that encryption settings, authentication methods, diagnostic settings, and network configurations meet compliance requirements. For more information, see [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md).

- **Apply RBAC at appropriate scopes**: Assign Virtual WAN management roles at management group, subscription, resource group, or resource scopes according to least privilege. Review role assignments regularly to remove stale access and reduce the number of users with privileged network permissions. For more information, see [Assign Azure roles](../role-based-access-control/role-assignments-steps.md).

- **Maintain an inventory of Virtual WAN resources**: Keep an inventory of virtual WANs, virtual hubs, secured hubs, VPN sites, user VPN configurations, ExpressRoute associations, route tables, and connected virtual networks. Use Azure Resource Graph to query resource types and identify unmanaged or unexpected resources. For more information, see [Explore your Azure resources with Resource Graph](../governance/resource-graph/first-query-portal.md).

- **Use resource tags for ownership and compliance**: Apply consistent tags to Virtual WAN resources for workload ownership, environment, data classification, cost management, and compliance tracking. Use tag policies to enforce required metadata. For more information, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

- **Implement configuration drift detection**: Use Azure Monitor activity logs, alerts, and infrastructure-as-code comparisons to detect configuration changes on Virtual WAN resources. This detection helps identify unauthorized modifications and keeps security configurations consistent over time. For more information, see [Azure Activity log](/azure/azure-monitor/essentials/activity-log).

- **Automate compliance monitoring with Microsoft Defender for Cloud**: Configure Microsoft Defender for Cloud to continuously assess the resources that a Virtual WAN deployment depends on, such as secured hubs with Azure Firewall, VPN and ExpressRoute gateways, public IP addresses, and connected virtual networks. Use the networking recommendations provided to maintain optimal security posture across your Virtual WAN deployment. For more information, see [Networking security recommendations](/azure/defender-for-cloud/recommendations-reference-networking#azure-networking-recommendations).

- **Use Azure Policy effects for enforcement**: Implement Azure Policy deny and deployIfNotExists effects to automatically enforce secure configurations across Virtual WAN resources. This enforcement prevents noncompliant configuration deployment and keeps security standards consistent. For more information, see [Understand Azure Policy effects](../governance/policy/concepts/effect-basics.md).

## Backup and recovery

Backup and recovery for Virtual WAN focus on preserving recoverable configuration, designing resilient hub topologies, and validating that secure connectivity can be restored during regional or configuration failures.

- **Export Virtual WAN configurations as templates**: Export Azure Resource Manager templates for virtual WANs, virtual hubs, VPN sites, gateways, route tables, and connections after significant configuration changes. Store the templates securely in version control so you can rebuild configuration if a resource is deleted or corrupted. For more information, see [Export templates from the Azure portal](../azure-resource-manager/templates/export-template-portal.md).

- **Manage recoverable configuration as code**: Prefer Bicep or Azure Resource Manager templates for repeatable Virtual WAN deployments and change control. Keep parameters, routing settings, firewall policy associations, and VPN site configuration under review so recovery doesn't depend on manual portal steps. For more information, see [Quickstart: Create an any-to-any configuration using an ARM template](quickstart-any-to-any-template.md).

- **Document hub configuration and dependencies**: Maintain recovery documentation for hub address spaces, gateway scale units, routing intent, route tables, propagation labels, firewall policies, VPN site links, point-to-site profiles, ExpressRoute associations, and required RBAC assignments. For more information, see [About Virtual WAN virtual hub settings](hub-settings.md).

- **Design redundant hubs in paired or selected regions**: Deploy multiple virtual hubs within a Virtual WAN and use designs that span multiple hubs or regions for business continuity. Use redundant hubs for point-to-site, site-to-site, and ExpressRoute connectivity so traffic can use alternate paths during a hub, carrier, or regional failure. For more information, see [Disaster recovery design for Azure Virtual WAN](disaster-recovery-design.md).

- **Use Availability Zone-aware hub services where supported**: Virtual WAN gateway services in a hub are deployed across Availability Zones when the region supports Availability Zones. For secured hubs, deploy Azure Firewall with Availability Zones where possible and plan redeployment when an existing firewall isn't zone redundant. For more information, see [Virtual WAN availability zones and resiliency](virtual-wan-faq.md#how-are-availability-zones-and-resiliency-handled-in-virtual-wan).

- **Protect VPN recovery material**: Back up VPN site definitions, pre-shared keys, certificates, and point-to-site VPN profiles in secure locations such as Key Vault and controlled repositories. Limit access to recovery material and rotate credentials after recovery events or personnel changes. For more information, see [Download a User VPN profile](about-vpn-profile-download.md).

- **Test secure failover and recovery procedures**: Regularly test recovery by redeploying templates into nonproduction environments, validating VPN and ExpressRoute connectivity, and confirming that routing intent still sends internet and private traffic through the intended security solution. For more information, see [Configure Virtual WAN Hub routing intent and routing policies](how-to-routing-policies.md).

## Next steps

- [Azure Virtual WAN overview](virtual-wan-about.md)
- [Virtual WAN FAQ](virtual-wan-faq.md)
- [About virtual hub routing](about-virtual-hub-routing.md)
- [Monitor Azure Virtual WAN](monitor-virtual-wan.md)
- [Disaster recovery design for Azure Virtual WAN](disaster-recovery-design.md)
- [Azure Well-Architected Framework - Security pillar](/azure/well-architected/security/)
- [Azure network security best practices](../security/fundamentals/network-best-practices.md)
