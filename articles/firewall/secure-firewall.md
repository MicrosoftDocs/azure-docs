---
title: Secure your Azure Firewall deployment
description: Learn how to secure Azure Firewall with best practices for network security, data protection, logging, threat detection, and advanced security features to protect your cloud infrastructure.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: conceptual
ms.custom: horz-security
ms.date: 07/07/2025
ai-usage: ai-assisted
---

# Secure your Azure Firewall deployment

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. As a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability, it's critical to properly configure and secure Azure Firewall to maximize protection for your cloud infrastructure and applications.

This article provides guidance on how to best secure your Azure Firewall deployment.

## Network security

Network security for Azure Firewall focuses on proper deployment within your virtual network infrastructure and ensuring secure traffic inspection capabilities. Azure Firewall serves as a central point for network security enforcement, making its proper configuration essential for protecting your entire network perimeter.

- **Deploy Azure Firewall in a dedicated subnet**: Always deploy Azure Firewall in its own dedicated subnet called "AzureFirewallSubnet" within your virtual network. This subnet requires a minimum size of /26 and shouldn't have Network Security Groups applied, as Azure Firewall has built-in platform protection. For more information, see [Tutorial: Secure your hub virtual network using Azure Firewall Manager](/azure/firewall-manager/secure-hybrid-network).

- **Enable threat intelligence-based filtering**: Configure threat intelligence-based filtering to alert and deny traffic from known malicious IP addresses, FQDNs, and URLs. This feature processes rules before any NAT, network, or application rules and provides protection based on Microsoft's threat intelligence feed. Start in alert mode and progress to alert and deny mode after testing. For more information, see [Azure Firewall threat intelligence-based filtering](threat-intel.md).

- **Implement IDPS for advanced threat detection**: Use Azure Firewall Premium's Intrusion Detection and Prevention System (IDPS) to monitor network activities for malicious patterns and signatures. IDPS provides signature-based detection with over 67,000 rules across 50+ categories and can operate in alert or alert-and-deny mode. For more information, see [Azure Firewall Premium features](premium-features.md#idps).

- **Configure DNS proxy functionality**: Enable Azure Firewall's DNS proxy feature to ensure consistent name resolution between clients and the firewall. This prevents issues where clients and firewall resolve FQDNs to different IP addresses, which could cause connection failures. For more information, see [Azure Firewall DNS Proxy details](dns-details.md).

- **Use forced tunneling for hybrid environments**: Configure forced tunneling when you need to route internet-bound traffic through on-premises security appliances. Enable the Management NIC to support this configuration while maintaining firewall management connectivity. For more information, see [Azure Firewall forced tunneling](forced-tunneling.md).

- **Enable TLS inspection for encrypted traffic**: Configure Azure Firewall Premium to inspect TLS traffic by enabling TLS inspection features. This creates dedicated TLS connections to examine encrypted traffic while maintaining security. You'll need to provide certificates through Azure Key Vault for this functionality. For more information, see [Azure Firewall Premium features](premium-features.md#tls-inspection).

- **Implement web categories filtering**: Use web categories to allow or deny access to specific website categories such as gambling, social media, or adult content. Azure Firewall Premium provides more granular control by examining the complete URL rather than just the domain name. For more information, see [Azure Firewall web categories](web-categories.md).

- **Configure multiple public IP addresses**: Add multiple public IP addresses to prevent SNAT port exhaustion, which provides 2,496 SNAT ports per additional public IP. Consider using Azure NAT Gateway for advanced SNAT capabilities in high-traffic scenarios. For more information, see [Best practices for Azure Firewall performance](firewall-best-practices.md).

## Data protection

Data protection in Azure Firewall centers on securing traffic in transit and managing certificates properly. Since Azure Firewall processes network traffic, ensuring proper encryption and certificate management is crucial for maintaining data security.

- **Use platform-managed encryption for data at rest**: Azure Firewall automatically encrypts any customer content at rest using Microsoft-managed platform keys. This includes derived certificates generated from customer certificates in Key Vault, ensuring your configuration data remains protected without additional configuration.

- **Implement TLS inspection with proper certificate management**: When using TLS inspection features, configure Azure Firewall to use certificates stored in Azure Key Vault. The firewall generates derived certificates from your customer certificate, maintaining the security chain while enabling traffic inspection capabilities. For more information, see [Azure Firewall Premium certificates](premium-certificates.md).

- **Enforce secure transfer protocols**: Configure your firewall policies to enforce HTTPS for web applications and services, ensuring TLS v1.2 or later is used. Disable legacy protocols like SSL 3.0 and TLS v1.0 to maintain strong encryption standards.

- **Use URL filtering for granular control**: Enable URL filtering to extend FQDN filtering capabilities to consider entire URLs rather than just domain names. This provides more precise control over web traffic and reduces the risk of accessing malicious content through legitimate domains. For more information, see [Azure Firewall Premium features](premium-features.md#url-filtering).

## Privileged access

Privileged access security for Azure Firewall focuses on controlling administrative access and implementing proper governance for firewall management operations.

- **Use Azure Policy for governance and compliance**: Implement Azure Policy definitions to enforce security requirements such as enabling threat intelligence, deploying across availability zones, and ensuring only encrypted traffic is allowed. Use built-in policies like "Azure Firewall Policy should enable Threat Intelligence" to maintain compliance. For more information, see [Use Azure Policy to help secure your Azure Firewall deployments](firewall-azure-policy.md).

- **Implement least privilege access with RBAC**: Apply role-based access control to limit who can modify firewall configurations and policies. Use specific Azure Firewall roles and custom roles to ensure users have only the minimum permissions necessary for their responsibilities.

- **Enable policy analytics for rule optimization**: Use Azure Firewall Policy Analytics to identify unused rules, optimize rule performance, and maintain clean security policies. This helps reduce attack surface and improves firewall performance. For more information, see [Use Azure Policy to help secure your Azure Firewall deployments](firewall-azure-policy.md).

## Logging and threat detection

Comprehensive logging and monitoring are essential for Azure Firewall security, enabling threat detection, security investigation, and compliance reporting. Proper log configuration provides visibility into network traffic patterns and security events.

- **Enable Azure Firewall diagnostic logging**: Configure diagnostic settings to capture Azure Firewall logs and metrics, sending them to your preferred data sink such as a Log Analytics workspace, storage account, or event hub. This provides detailed information about allowed and denied traffic, threat intelligence hits, and firewall performance. For more information, see [Monitor Azure Firewall logs and metrics](firewall-diagnostics.md).

- **Integrate with Microsoft Sentinel for advanced threat detection**: Connect Azure Firewall logs to Microsoft Sentinel to enable advanced security analytics, correlation with other security events, and automated response capabilities. Use the Azure Firewall connector to detect malware and analyze threat patterns. For more information, see [Detect malware with Azure Firewall and Microsoft Sentinel](detect-malware-with-sentinel.md).

- **Monitor threat intelligence alerts**: Configure monitoring for threat intelligence alerts to quickly identify and respond to traffic from known malicious sources. Set up automated responses for high-priority threat intelligence matches to block attackers before they can establish persistence.

- **Configure performance monitoring and alerting**: Use Azure Monitor to track firewall performance metrics including throughput, latency, SNAT port utilization, and rule hit counts. Set up alerts for critical thresholds to ensure optimal firewall performance and prevent service disruption. For more information, see [Best practices for Azure Firewall performance](firewall-best-practices.md).

- **Implement IDPS signature rule customization**: Customize IDPS signature rules by changing their mode from alert to alert-and-deny for high-priority threats, or disable signatures that generate false positives. Use smart search capabilities to find specific signatures by CVE-ID or other attributes.

- **Configure log retention policies**: Set appropriate log retention policies based on your compliance requirements and investigation needs. Ensure logs are retained long enough to support security investigations and meet regulatory obligations.

## Asset management

Asset management for Azure Firewall involves using Azure Policy for configuration monitoring and enforcement, ensuring consistent security posture across your firewall deployments.

- **Implement Azure Policy for configuration enforcement**: Use Azure Policy to monitor and enforce Azure Firewall configurations across your environment. Deploy policies that require threat intelligence enablement, availability zone deployment, and Premium SKU usage for enhanced security features. For more information, see [Use Azure Policy to help secure your Azure Firewall deployments](firewall-azure-policy.md).

- **Use Microsoft Defender for Cloud integration**: Enable Microsoft Defender for Cloud monitoring for your Azure Firewall resources to receive security recommendations and compliance assessments. This provides centralized security management and helps identify configuration drift or security gaps.

- **Upgrade to Azure Firewall Premium**: Consider upgrading from Standard to Premium SKU to access advanced security features including IDPS, TLS inspection, URL filtering, and web categories. Premium provides enhanced threat protection suitable for highly regulated environments. For more information, see [Choose the right Azure Firewall SKU to meet your needs](choose-firewall-sku.md).

- **Optimize rule configuration for performance**: Organize firewall rules using Rule Collection Groups and Rule Collections, prioritizing them based on frequency of use. Use IP Groups to reduce the number of individual IP rules and ensure you stay within Azure Firewall limits. For more information, see [Best practices for Azure Firewall performance](firewall-best-practices.md).

- **Configure policy-based deployment standards**: Establish and enforce deployment standards through Azure Policy's "deny" and "deploy if not exists" effects. This ensures all new Azure Firewall deployments meet your organization's security requirements automatically.

- **Monitor compliance with security baselines**: Regularly review your Azure Firewall configurations against the Microsoft cloud security benchmark using Microsoft Defender for Cloud's regulatory compliance dashboard. This helps maintain consistent security posture and identifies areas for improvement.

## Next steps

- [Well-Architected Framework: Security](/azure/architecture/framework/security)
- [Cloud Adoption Framework: Security](/azure/cloud-adoption-framework/secure/overview)