---
title: Secure your Azure ExpressRoute
description: Learn how to secure Azure ExpressRoute with best practices for network connectivity, access control, and monitoring.
author: duongau
ms.author: duau
ms.service: azure-expressroute
ms.topic: conceptual
ms.custom: horz-security
ms.date: 06/17/2025
ai-usage: ai-assisted
#Customer-intent: As a network administrator, I want to secure Azure ExpressRoute connections so that I can protect sensitive data and ensure compliance.
---

# Secure your Azure ExpressRoute

Azure ExpressRoute enables private, high-performance connections between your on-premises infrastructure and Microsoft cloud services, bypassing the public internet. While this dedicated connectivity enhances security and reliability, it’s essential to implement best practices to safeguard your deployment against potential threats.

This guide provides actionable recommendations for securing your Azure ExpressRoute deployment, covering key areas such as network security, identity management, data protection, logging and threat detection, asset management, and backup and recovery. By following these guidelines, you can strengthen your security posture, ensure compliance, and maintain operational continuity.

## Network security

Network security for ExpressRoute involves proper segmentation, traffic flow control, and monitoring to protect hybrid connectivity. Because ExpressRoute integrates with virtual networks, securing the network layer is critical to maintain isolation and prevent unauthorized access to cloud resources.

- **Configure MACsec encryption for ExpressRoute Direct**: Turn on MACsec (Media Access Control Security) encryption on ExpressRoute Direct connections to add Layer 2 encryption between your network equipment and Microsoft's edge routers. Store MACsec keys securely in Azure Key Vault. Learn more in [Configure MACsec encryption for ExpressRoute Direct](expressroute-howto-macsec.md).

- **Deploy ExpressRoute gateways in dedicated subnets**: ExpressRoute gateways are deployed into virtual networks and provide secure connectivity by default. The gateway subnet (GatewaySubnet) is configured with appropriate security controls. For more information, see [ExpressRoute gateway](expressroute-about-virtual-network-gateways.md).

- **Control traffic with Network Security Groups**: Apply Network Security Groups (NSGs) to subnets with resources connected through ExpressRoute to restrict traffic by port, protocol, and source IP address. Create NSG rules to deny all inbound traffic by default and allow only necessary communication. For more information, see [Network Security Groups overview](../virtual-network/network-security-groups-overview.md).

- **Use Azure Firewall or Network Virtual Appliances (NVAs)**: Deploy Azure Firewall or third-party network virtual appliances (NVA) to add security controls like application-level filtering, threat intelligence, and logging. These appliances inspect traffic through ExpressRoute and apply advanced security policies. For more information, see [Azure Firewall overview](../firewall/overview.md).

  > [!NOTE]
  > You can't configure NSGs directly on the GatewaySubnet.

- **Implement network segmentation**: Use virtual network peering and route tables to control traffic flow between network segments connected through ExpressRoute. This isolates sensitive workloads and limits the effect of security incidents. For more information, see [Virtual network peering](/azure/virtual-network/virtual-network-peering-overview) and [Route tables](../virtual-network/virtual-networks-udr-overview.md).

- **Configure zone-redundant virtual network gateways**: Deploy ExpressRoute virtual network gateways across availability zones to ensure fault tolerance and high availability. Zone-redundant gateways keep connectivity operational even if one availability zone has an outage. For more information, see [Zone-redundant virtual network gateways](../vpn-gateway/about-zone-redundant-vnet-gateways.md?toc=%2Fazure%2Fexpressroute%2Ftoc.json).

- **Use different ExpressRoute service providers**: Choose different service providers for each circuit to ensure diverse paths and reduce the risk of network downtime from a single provider's outage. For more information, see [ExpressRoute locations and service providers](expressroute-locations-providers.md).

- **Monitor ExpressRoute connections**: Enable diagnostic logging and monitoring to track connection health, performance, and security events. For more information, see [Monitoring Azure ExpressRoute](monitor-expressroute.md).

## Identity management

ExpressRoute doesn't support traditional identity-based authentication for data plane access because it operates at the network layer. However, proper identity management is essential for controlling access to ExpressRoute resources and related services like Azure Key Vault for MACsec configuration.

- **Use Azure RBAC for management operations**: Apply role-based access control to limit who can create, modify, or delete ExpressRoute circuits, and gateways. Assign the minimum necessary permissions to users and service accounts. For more information, see [Azure role-based access control (RBAC)](../role-based-access-control/overview.md).

- **Secure MACsec secrets with Azure Key Vault**: Store MACsec encryption keys securely in Azure Key Vault instead of embedding them in configuration files. ExpressRoute uses managed identities to authenticate with Key Vault for retrieving these secrets. For more information, see [Configure MACsec encryption for ExpressRoute Direct](/azure/expressroute/expressroute-howto-macsec).

- **Implement conditional access for management**: Use Microsoft Entra conditional access policies to control administrative access to ExpressRoute resources based on user location, device compliance, and risk level. This helps ensure that only authorized users can manage ExpressRoute circuits and gateways. For more information, see [Conditional Access](/azure/active-directory/conditional-access/overview).

## Data protection

ExpressRoute provides private connectivity but doesn't encrypt data in transit by default. Add encryption and security measures to protect sensitive data as it flows between your on-premises environment and Azure services.

- **Configure MD5 hash authentication**: Use MD5 hash authentication when setting up private peering or Microsoft peering to secure messages between your on-premises router and the Microsoft Enterprise Edge (MSEE) routers. This ensures data integrity and prevents tampering during transit. Learn more in [ExpressRoute routing requirements](expressroute-routing.md).

- **Implement IPsec VPN over ExpressRoute**: To add encryption over ExpressRoute private peering, set up a VPN connection that uses the ExpressRoute circuit as transport. This adds end-to-end encryption for your traffic. Learn more in [Using S2S VPN as a backup for ExpressRoute private peering](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).

- **Encrypt sensitive data at the application layer**: Because ExpressRoute doesn't provide application-layer encryption, make sure applications encrypt sensitive data before transmission using TLS/SSL or application-specific encryption methods.

## Logging and threat detection

Monitoring ExpressRoute connections and related network activity is essential for detecting potential security threats and maintaining compliance. Proper logging helps identify unusual traffic patterns and connection issues that might indicate security incidents.

- **Enable ExpressRoute resource logs**: Set up diagnostic settings to send ExpressRoute resource logs to Azure Monitor, Log Analytics, or Azure Storage for analysis and retention. These logs show connection events and performance metrics. For more information, see [Monitoring Azure ExpressRoute](monitor-expressroute.md).

- **Set up alerts for service health and connection issues**: Use Azure Monitor to configure alerts for ExpressRoute circuit outages, performance degradation, configuration changes, and both planned and unplanned maintenance events. These alerts help you proactively manage connectivity and security posture. For more information, see [Monitor ExpressRoute circuits](monitor-expressroute.md).

- **Monitor network traffic patterns**: Use Azure Network Watcher and Traffic Analytics to analyze traffic through your ExpressRoute connection. This helps find unusual patterns that might indicate security threats or misconfigurations. For more information, see [Azure Network Watcher](../network-watcher/overview.md) and [Monitor network traffic with Traffic Analytics](../network-watcher/traffic-analytics-overview.md).

- **Integrate with Microsoft Sentinel**: Send ExpressRoute logs to Microsoft Sentinel to detect advanced threats and correlate them with other security events across your hybrid environment.

## Asset management

Managing ExpressRoute resources effectively involves implementing proper governance, monitoring configurations, and ensuring compliance with organizational policies. Proper asset management helps maintain security posture and operational visibility.

- **Implement resource tagging**: Use Azure resource tags to organize and track ExpressRoute circuits, gateways, and related resources. Tags help with cost management, security classification, and operational accountability. For more information, see [Azure resource tags](../azure-resource-manager/management/tag-resources.md).

- **Track circuit utilization**: Monitor bandwidth usage and connection patterns to identify unusual activity that can indicate security threats or operational issues.

- **Maintain documentation**: Keep detailed records of ExpressRoute configurations, including circuit settings, routing policies, and security configurations, to support incident response and compliance auditing.

## Backup and recovery

Ensure business continuity for your ExpressRoute connectivity by implementing backup solutions and recovery procedures. Although ExpressRoute circuits can't be backed up, create redundant connectivity options and document configuration settings.

- **Deploy redundant ExpressRoute circuits**: Set up multiple ExpressRoute circuits in separate peering locations to achieve high availability and automatic failover. This approach ensures your connectivity remains operational if one circuit encounters an issue. For more information, see [Design a resilient ExpressRoute connection](design-architecture-for-resiliency.md).

- **Implement VPN backup connectivity**: Set up site-to-site VPN connections as a backup for ExpressRoute private peering. This setup provides alternative connectivity if the primary ExpressRoute circuit fails. For more information, see [Using S2S VPN as a backup for ExpressRoute private peering](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).

- **Test failover procedures**: Regularly test backup connectivity options and failover procedures to ensure they work correctly when needed. Use tools like Azure Connectivity Toolkit to validate performance and connectivity. For more information, see [Azure Connectivity Toolkit](expressroute-troubleshooting-network-performance.md).

- **Document configuration settings**: Maintain detailed documentation of ExpressRoute configurations, including circuit settings, routing configurations, and security policies. This documentation enables faster recovery if there is configuration issues or circuit replacement. For more information, see [ExpressRoute circuit configuration](expressroute-circuit-peerings.md).

- **Leverage Resiliency Insights and validation for recovery**: Use ExpressRoute Resiliency Insights to assess the resiliency of your connectivity and validate your recovery time objectives. Resiliency Insights help you identify configuration gaps, test failure scenarios, and validate that your backup and failover solutions meet business recovery requirements. Regularly perform resiliency validation to ensure your environment is prepared for outages and that recovery procedures are effective. For more information, see [ExpressRoute Resiliency Insights](resiliency-insights.md) and [ExpressRoute Resiliency Validation](resiliency-validation.md).

## Next steps

- [Well-Architected Framework: Security](/azure/architecture/framework/security)
- [Cloud Adoption Framework: Security](/azure/cloud-adoption-framework/secure/overview)