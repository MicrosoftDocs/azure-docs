---
title: Secure your Azure Front Door deployment
description: Learn how to secure Azure Front Door, with best practices for network security, identity management, data protection, threat detection, and origin security for your CDN and application delivery service.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.custom: horz-security
ms.date: 07/08/2025
ai-usage: ai-assisted
---

# Secure your Azure Front Door deployment

Azure Front Door is a modern cloud content delivery network (CDN) service that delivers high performance, scalability, and secure user experiences for your content and applications. As a global entry point for your applications, Azure Front Door handles massive amounts of traffic and serves as a critical security boundary, making it essential to implement robust security measures to protect against threats and ensure reliable service delivery.

This article provides guidance on how to best secure your Azure Front Door deployment.

## Network security

Network security for Azure Front Door focuses on establishing secure connections between your CDN service and backend origins while protecting against external threats. Since Front Door operates at the network edge and handles global traffic distribution, implementing proper network controls ensures that your applications remain protected and accessible only through authorized channels.

* **Secure backend connections with Private Link**: Use Azure Private Link to establish secure, private connections between Azure Front Door and your backend services. This prevents traffic from traversing the public internet and reduces exposure to network-based attacks. For more information, see [Secure your Origin with Private Link in Azure Front Door](/azure/frontdoor/private-link).

* **Protect against DDoS attacks with built-in protection**: Azure Front Door includes infrastructure DDoS protection that monitors and mitigates network layer attacks in real-time using the global scale of Azure's network. The service blocks unsupported protocols and requires valid Host headers to prevent common DDoS attack vectors. For more information, see [DDoS Protection on Azure Front Door](./front-door-ddos.md).

* **Configure Web Application Firewall for application-layer protection**: Deploy Azure Web Application Firewall (WAF) to protect your applications from common web vulnerabilities and exploits. WAF provides managed rule sets for OWASP Top 10 protection, bot management, and custom rules for specific threat patterns. For more information, see [Web Application Firewall (WAF) on Azure Front Door](./web-application-firewall.md).

* **Implement origin security controls**: Configure your origins to accept traffic only from Azure Front Door by using managed identities or IP filtering with the `AzureFrontDoor.Backend` service tag and validating the X-Azure-FDID header value. This prevents attackers from bypassing Front Door's security features. For more information, see [Secure traffic to Azure Front Door origins](./origin-security.md).

* **Use rate limiting to prevent abuse**: Configure WAF rate limiting rules to protect against high-volume attacks and prevent individual IP addresses from overwhelming your service. Rate limiting helps mitigate application-layer DDoS attacks and abusive traffic patterns. For more information, see [Rate limiting](/azure/web-application-firewall/afds/waf-front-door-rate-limit).

## Identity management

Identity management for Azure Front Door centers on using managed identities to securely access Azure resources without managing credentials. Proper identity management ensures that Front Door can authenticate to services like Azure Key Vault for certificate management while maintaining security boundaries.

* **Enable managed identities for secure authentication**: Use system-assigned or user-assigned managed identities to allow Azure Front Door to securely access Azure Key Vault and other Azure services without storing credentials. Managed identities provide automatic credential rotation and eliminate the risk of credential exposure. For more information, see [Use managed identities to access Azure Key Vault certificates](./managed-identity.md).

* **Configure origin authentication with managed identities**: Use managed identities to authenticate Azure Front Door to your origin services that support Microsoft Entra ID authentication. This provides a secure, credential-free way to establish trust between Front Door and your backend applications. For more information, see [Use managed identities to authenticate to origins (preview)](./origin-authentication-with-managed-identities.md).

## Data protection

Data protection in Azure Front Door ensures that sensitive information remains secure both in transit and when stored, while providing you with control over encryption keys and certificates. Protecting data as it flows through your CDN infrastructure is critical for maintaining customer trust and meeting compliance requirements.

* **Leverage automatic encryption in transit**: Azure Front Door automatically encrypts all data in transit using TLS, protecting communications between clients and your service without requiring additional configuration. This ensures that sensitive data remains protected as it travels across the network. For more information, see [End-to-end TLS with Azure Front Door](./end-to-end-tls.md).

* **Configure strong TLS policies**: Set minimum TLS versions and cipher suites to meet your security requirements. Use predefined security policies or create custom TLS policies to control which encryption standards are acceptable for your applications. For more information, see [Configure TLS policy on a Front Door custom domain](./standard-premium/tls-policy-configure.md).

* **Manage encryption keys with Azure Key Vault**: Store and manage your encryption keys in Azure Key Vault to maintain control over the key lifecycle, including generation, rotation, and revocation. Use key hierarchies with separate data encryption keys (DEK) and key encryption keys (KEK) for enhanced security. For more information, see [Secure your Origin with Private Link in Azure Front Door](/azure/frontdoor/private-link).

* **Manage SSL/TLS certificates with Azure Key Vault**: Use Azure Key Vault to securely store, manage, and automatically rotate SSL/TLS certificates for your Azure Front Door endpoints. Configure automatic certificate renewal to prevent service disruptions and ensure continuous protection. For more information, see [Create a Front Door for your application with certificates in Azure Key Vault](/azure/frontdoor/create-front-door-portal).

## Logging and threat detection

Logging and threat detection for Azure Front Door provides visibility into traffic patterns, security events, and potential threats targeting your applications. Comprehensive logging enables you to detect suspicious activities, investigate security incidents, and maintain compliance with audit requirements.

* **Enable comprehensive resource logging**: Configure Azure Front Door resource logs to capture detailed information about Web Application Firewall events, access patterns, and security incidents. Send these logs to Azure Monitor Log Analytics or your preferred security information and event management (SIEM) solution for analysis and alerting. For more information, see [Resource logs](/azure/frontdoor/standard-premium/how-to-logs).

* **Monitor Web Application Firewall activity**: Enable and review WAF logs to track blocked requests, attack patterns, and potential security threats. Use these logs to fine-tune WAF rules and improve protection against emerging threats targeting your applications.

* **Configure security alerts and monitoring**: Set up Azure Monitor alerts to notify you of security events such as high numbers of blocked requests, unusual traffic patterns, or policy violations. Create custom queries to detect suspicious behavior and automate response actions.

## Asset management

Asset management for Azure Front Door involves implementing configuration monitoring and policy enforcement to ensure your CDN deployment remains compliant with security standards. Proper asset management helps maintain consistent security configurations across your infrastructure and provides visibility into potential security drift.

* **Monitor configurations with Azure Policy**: Use Azure Policy to continuously monitor and enforce security configurations across your Azure Front Door resources. Configure policies to audit compliance with your organization's security standards and automatically remediate configuration drift. For more information, see [Azure Front Door Policies](/azure/governance/policy/tutorials/create-and-manage).

* **Implement configuration alerts**: Set up Azure Monitor alerts to notify you when Azure Front Door configurations deviate from approved security baselines. Use policy effects like "deny" and "deploy if not exists" to automatically enforce secure configurations across your resources.

## Related content

- [Security baseline](/security/benchmark/azure/baselines/azure-front-door-security-baseline?toc=/azure/frontdoor/toc.json)
- [Azure Well-Architected Framework: Security pillar](/azure/well-architected/security/)
- [Cloud Adoption Framework: Secure overview](/azure/cloud-adoption-framework/secure/overview)
