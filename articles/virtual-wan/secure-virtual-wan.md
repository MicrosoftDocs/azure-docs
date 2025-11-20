---
title: Secure your Azure Virtual WAN deployment
description: Learn how to secure Azure Virtual WAN, with best practices for network security, identity management, data protection, and logging.
author: cherylmc
ms.author: cherylmc
ms.service: azure-virtual-wan
ms.topic: conceptual
ms.custom: horz-security
ms.date: 09/08/2025
ai-usage: ai-assisted
---

# Secure your Azure Virtual WAN deployment

Azure Virtual WAN is a networking service that brings many networking, security, and routing functionalities together to provide a single operational interface. It enables organizations to connect and secure branch offices, remote users, and Azure resources through a global transit network architecture. When deploying Virtual WAN for mission-critical connectivity, you must implement comprehensive security controls to protect your network infrastructure and data in transit.

This article provides guidance on how to best secure your Azure Virtual WAN deployment.

## Network security

Network security for Virtual WAN focuses on protecting data in transit, securing connectivity between on-premises and cloud resources, and implementing proper encryption for all network communications. Virtual WAN's hub-and-spoke architecture requires careful consideration of traffic flow, encryption protocols, and secure connectivity options to ensure comprehensive network protection.

- **Enable ExpressRoute encryption with Virtual WAN**: Use Virtual WAN's native encryption capabilities for ExpressRoute traffic to secure data between on-premises networks and Azure virtual networks. This provides encrypted transit without requiring traffic to traverse the public internet or use public IP addresses. For more information, see [Encryption in transit](/azure/virtual-wan/vpn-over-expressroute).

- **Configure secure site-to-site VPN connections**: Implement IPsec VPN connections with strong encryption protocols for site-to-site connectivity. Virtual WAN supports custom IPsec policies that allow you to configure preferred encryption algorithms and authentication methods. For more information, see [Default policies for IPsec connectivity](virtual-wan-ipsec.md).

- **Secure point-to-site VPN for remote users**: Deploy User VPN (point-to-site) connections with certificate-based or Azure Active Directory authentication to provide secure remote access. Configure appropriate encryption settings and access policies to protect remote user connections. For more information, see [Create a User VPN (point-to-site) connection](virtual-wan-point-to-site-portal.md).

- **Implement network segmentation with routing policies**: Use Virtual WAN's custom routing capabilities to implement network segmentation and control traffic flow between different network segments. Configure route tables and routing policies to ensure that traffic flows only to authorized destinations. For more information, see [About virtual hub routing](about-virtual-hub-routing.md).

- **Deploy Azure Firewall for traffic inspection**: Configure Azure Firewall in Virtual WAN hubs to inspect and filter all network traffic including inter-hub, branch-to-VNet, and internet-bound traffic. Use routing intent and routing policies to automatically route traffic through Azure Firewall for comprehensive security inspection. For more information, see [Secure traffic between Application Gateway and backend pools](scenario-secured-hub-app-gateway.md).

- **Enable forced tunneling for point-to-site VPN**: Configure forced tunneling to route all internet-bound traffic from remote users through Azure for inspection and policy enforcement. This ensures that remote user traffic is subject to the same security controls as on-premises traffic. For more information, see [Configure forced tunneling for Virtual WAN Point-to-site VPN](how-to-forced-tunnel.md).

- **Use Network Virtual Appliances (NVAs) for advanced security**: Deploy third-party NVAs in Virtual WAN hubs to provide SD-WAN connectivity combined with next-generation firewall capabilities. Configure routing policies to send traffic through NVAs for deep packet inspection and advanced threat protection. For more information, see [About Network Virtual Appliances in a Virtual WAN hub](about-nva-hub.md).

## Identity management

Identity management for Virtual WAN ensures that only authorized users and services can access network resources and manage Virtual WAN configurations. Proper identity controls help prevent unauthorized access to sensitive network infrastructure and maintain the integrity of your global network architecture.

- **Use Azure Key Vault for credential management**: Store and manage VPN pre-shared keys (PSK), certificates, and other credentials securely in Azure Key Vault instead of embedding them in configuration files or code. Site-to-site VPN connections in Virtual WAN can integrate with Azure Key Vault for secure credential lifecycle management. For more information, see [Azure Key Vault integration](/azure/key-vault/general/overview).

- **Implement Azure Active Directory authentication for User VPN**: Configure Azure Active Directory authentication for point-to-site VPN connections to leverage centralized identity management, conditional access policies, and multifactor authentication. This provides stronger security than traditional certificate-based authentication alone. For more information, see [Create a User VPN (point-to-site) connection](virtual-wan-point-to-site-portal.md).

- **Apply role-based access control (RBAC) for Virtual WAN management**: Use Azure RBAC to control who can manage Virtual WAN resources and what actions they can perform. Assign appropriate roles to users and service principals to follow the principle of least privilege for network infrastructure management.

- **Enable managed identities for automation**: Use managed identities when automating Virtual WAN operations through Azure services or custom applications. This eliminates the need to store credentials in code or configuration files while providing secure access to Azure resources.

- **Configure certificate-based authentication with proper lifecycle management**: Implement certificate-based authentication for VPN connections with proper certificate lifecycle management including rotation and revocation. Store certificates securely and ensure they're properly distributed to authorized devices only. For more information, see [Generate and export certificates for point-to-site](certificates-point-to-site.md).

- **Use RADIUS authentication for centralized user management**: Implement RADIUS server authentication to centralize user management and leverage existing identity infrastructure. Configure RADIUS authentication with strong protocols like EAP-TLS for certificate-based authentication or EAP-MSCHAPv2 for username/password authentication. For more information, see [Configure P2S User VPN gateway for Microsoft Entra ID authentication](virtual-wan-point-to-site-azure-ad.md).

## Data protection

Data protection in Virtual WAN focuses on ensuring that all network traffic is properly encrypted and that encryption keys are managed securely. Virtual WAN handles sensitive networking data and connection information that must be protected both in transit and at rest.

- **Enable data-in-transit encryption for all connections**: Configure encryption for all Virtual WAN connections including site-to-site VPN, point-to-site VPN, and ExpressRoute. Virtual WAN supports various encryption protocols and cipher suites to protect data as it flows through the network infrastructure. For more information, see [Data in transit encryption](/azure/security/fundamentals/double-encryption#data-in-transit).

- **Use Azure Key Vault for encryption key management**: Integrate Virtual WAN with Azure Key Vault to centrally manage encryption keys, certificates, and secrets used for VPN connections. This ensures proper key lifecycle management, rotation, and access control for all cryptographic materials. For more information, see [Key Management in Azure Key Vault](/azure/key-vault/general/overview).

- **Implement credential scanning and secure storage**: Use Credential Scanner to identify any credentials that might be inadvertently stored in code or configuration files. Move all discovered credentials to secure locations such as Azure Key Vault to prevent unauthorized access to network resources.

- **Configure strong encryption algorithms**: Select strong encryption algorithms and key sizes for all VPN connections. Avoid deprecated or weak cryptographic protocols and regularly review encryption settings to ensure they meet current security standards and compliance requirements.

## Logging and threat detection

Logging and monitoring for Virtual WAN provides visibility into network activities, connection health, and potential security threats. Comprehensive logging enables you to detect anomalous behavior, troubleshoot connectivity issues, and maintain compliance with security requirements.

- **Enable Azure resource logs for Virtual WAN**: Configure resource logs for Virtual WAN and related resources to capture detailed information about network activities, connection attempts, and traffic flows. Resource logs are available for both ExpressRoute and VPN connections and can be sent to Log Analytics, Event Hubs, or storage accounts. For more information, see [Resource logs](/azure/virtual-wan/monitor-virtual-wan-reference#diagnostic).

- **Configure centralized log collection with Azure Monitor**: Use Azure Monitor to collect and analyze logs from Virtual WAN resources, including connection logs, traffic analytics, and performance metrics. Configure Log Analytics workspaces to centralize log storage and enable correlation across multiple Virtual WAN components. For more information, see [Monitoring Virtual WAN with Azure Monitor](monitor-virtual-wan.md).

- **Set up Azure Monitor Insights for Virtual WAN**: Implement Azure Monitor Insights to gain enhanced visibility into Virtual WAN performance, connectivity status, and network topology. This provides pre-built dashboards and analytics specifically designed for Virtual WAN monitoring. For more information, see [Monitor using Azure Monitor Insights](azure-monitor-insights.md).

- **Configure alerting for connection failures and anomalies**: Set up Azure Monitor alerts to notify administrators of connection failures, performance degradation, or unusual traffic patterns. Configure appropriate thresholds and notification channels to ensure timely response to potential issues.

## Asset management

Asset management for Virtual WAN ensures that your network infrastructure configurations comply with organizational policies and security standards. Proper asset management helps maintain consistency across deployments and enables automated compliance monitoring.

- **Use Azure Policy for configuration compliance**: Implement Azure Policy to monitor and enforce Virtual WAN configurations according to your organization's security standards. Create custom policies to ensure that encryption settings, authentication methods, and network configurations meet compliance requirements. For more information, see [Azure Policy support](/azure/governance/policy/tutorials/create-and-manage).

- **Implement configuration drift detection**: Use Azure Monitor to create alerts when configuration changes occur on Virtual WAN resources. This helps detect unauthorized modifications and ensures that security configurations remain consistent over time.

- **Automate compliance monitoring with Microsoft Defender for Cloud**: Configure Microsoft Defender for Cloud to continuously assess Virtual WAN configurations against security best practices and compliance frameworks. Use the recommendations provided to maintain optimal security posture across your Virtual WAN deployment.

- **Use Azure Policy effects for enforcement**: Implement Azure Policy [deny] and [deploy if not exists] effects to automatically enforce secure configurations across Virtual WAN resources. This prevents the deployment of non-compliant configurations and ensures consistent security standards.

- **Implement disaster recovery planning**: Design multi-region and multi-hub topologies to ensure business continuity during disasters. Consider implementing redundant virtual hubs within regions and across regions to protect against both localized and catastrophic failures. Plan for automated failover mechanisms and test recovery procedures regularly. For more information, see [Disaster recovery design for Azure Virtual WAN](disaster-recovery-design.md).

## Next steps

- [Azure Well-Architected Framework - Security pillar](/azure/well-architected/security/)
- [Cloud Adoption Framework - Secure methodology](/azure/cloud-adoption-framework/secure/overview)
