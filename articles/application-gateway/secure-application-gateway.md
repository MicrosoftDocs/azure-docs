---
title: Secure Your Azure Application Gateway
description: Learn how to secure your Azure Application Gateway deployment with network controls, proper configuration, and monitoring best practices.
author: mbender-ms
ms.author: mbender
ms.service: azure-application-gateway
ms.topic: concept-article
ms.custom: security, horz-security
ms.date: 08/15/2025
ai-usage: ai-assisted
---

# Secure your Azure Application Gateway

Azure Application Gateway is a web traffic load balancer that enables you to manage traffic to your web applications. As a critical component in your network infrastructure, Application Gateway handles incoming requests and routes them to backend services, making it essential to implement proper security measures to protect against threats and ensure compliance with organizational security requirements.

This article provides guidance on how to best secure your Azure Application Gateway deployment.

## Network security

Network security for Application Gateway involves controlling traffic flow, implementing proper segmentation, and securing communications between clients and backend services.

* **Deploy into a dedicated subnet**: Place your Application Gateway in a dedicated subnet within your virtual network to provide network isolation and enable granular traffic control. This separation helps contain potential security incidents and allows for targeted security policies.

* **Apply Network Security Groups**: Use Network Security Groups (NSGs) to restrict traffic by port, protocol, source IP address, or destination IP address. Create NSG rules to limit access to only required ports and prevent management ports from being accessed from untrusted networks. For more information, see [Network security groups](./configuration-infrastructure.md#network-security-groups).

* **Configure private endpoints**: Deploy private endpoints for your Application Gateway when supported to establish private access points that eliminate exposure to the public internet. This reduces your attack surface by keeping traffic within your virtual network. For more information, see [Configure Azure Application Gateway Private Link (preview)](./private-link-configure.md?tabs=portal).

* **Enable DDoS protection**: Deploy Azure DDoS Network Protection on the virtual network hosting your Application Gateway to protect against large-scale DDoS attacks. This provides enhanced DDoS mitigation capabilities including adaptive tuning and attack notifications. For more information, see [Protect your application gateway with Azure DDoS Network Protection](./tutorial-protect-application-gateway-ddos.md).

* **Implement proper infrastructure configuration**: Follow Azure's recommended infrastructure setup to ensure your Application Gateway is deployed with security best practices. This includes proper subnet sizing, route table configuration, and network dependencies. For more information, see [Application Gateway infrastructure configuration](./configuration-infrastructure.md).

## Web application protection

Web Application Firewall provides essential protection against common web vulnerabilities and attacks targeting your applications.

* **Deploy Web Application Firewall**: Enable WAF on your Application Gateway to protect against OWASP Top 10 threats including SQL injection, cross-site scripting, and other common web attacks. Start in Detection mode to understand traffic patterns, then switch to Prevention mode to actively block threats. For more information, see [What is Azure Web Application Firewall on Azure Application Gateway?](/azure/web-application-firewall/ag/ag-overview).

* **Configure custom WAF rules**: Create custom rules to address specific threats targeting your applications, including rate limiting, IP blocking, and geo-filtering. Custom rules provide targeted protection beyond managed rule sets. For more information, see [Create and use v2 custom rules](/azure/web-application-firewall/ag/create-custom-waf-rules).

* **Enable bot protection**: Use the bot protection managed rule set to identify and block malicious bots while allowing legitimate traffic from search engines and monitoring tools. For more information, see [Configure bot protection](/azure/web-application-firewall/ag/bot-protection).

* **Implement rate limiting**: Configure rate limiting rules to prevent abuse and DDoS attacks by controlling the number of requests allowed from individual IP addresses within specified time windows. For more information, see [Rate limiting overview](/azure/web-application-firewall/ag/rate-limiting-overview).

## Identity and access management

Proper authentication and authorization controls ensure only authorized users and systems can access your Application Gateway and its configuration.

* **Configure mutual authentication**: Implement mutual TLS authentication to verify client certificates, providing an extra layer of security for sensitive applications. This ensures both the client and server authenticate each other. For more information, see [Configure mutual authentication with Application Gateway through portal](./mutual-authentication-portal.md).

* **Use Azure RBAC for management access**: Apply role-based access control to limit who can modify Application Gateway configurations. Assign the minimum necessary permissions to users and service accounts. For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## Data protection

Data protection for Application Gateway focuses on securing data in transit and managing certificates and secrets properly.

* **Enable TLS encryption**: Configure TLS termination to encrypt data in transit between clients and your Application Gateway. Ensure you are using the latest version to protect against known vulnerabilities. For more information, see [Overview of TLS termination and end to end TLS with Application Gateway](./ssl-overview.md).

* **Store certificates in Azure Key Vault**: Use Azure Key Vault to securely store and manage your TLS certificates instead of embedding them in configuration files. This enables automatic certificate rotation and centralized management of secrets. For more information, see [TLS termination with Key Vault certificates](./key-vault-certs.md).

* **Configure secure certificate management**: Set up automatic rotation of certificates in Azure Key Vault based on a defined schedule or when approaching expiration. Ensure certificate generation follows security standards with sufficient key sizes and appropriate validity periods. For more information, see [Configure an Application Gateway with TLS termination using the Azure portal](./create-ssl-portal.md#configuration-tab).

* **Implement HTTP to HTTPS redirection**: Configure automatic redirection from HTTP to HTTPS to ensure all traffic is encrypted. This prevents sensitive data from being transmitted in plaintext. For more information, see [Create an application gateway with HTTP to HTTPS redirection using the Azure portal](./redirect-http-to-https-portal.md).

* **Configure end-to-end TLS**: Enable TLS encryption between Application Gateway and backend servers for maximum data protection throughout the entire communication path. For more information, see [Overview of TLS termination and end to end TLS with Application Gateway](./ssl-overview.md).

## Monitoring and threat detection

Logging and monitoring provide visibility into Application Gateway operations and help detect potential security threats.

* **Enable diagnostic logging**: Configure Azure resource logs to capture detailed information about Application Gateway operations, including access patterns, performance metrics, and security events. Send these logs to a Log Analytics workspace or storage account for analysis. For more information, see [Backend health and diagnostic logs for Application Gateway](./application-gateway-diagnostics.md).

* **Configure custom health probes**: Set up custom health probes to monitor backend server health more effectively than default probes. Custom probes can detect application-level issues and ensure traffic only reaches healthy servers. For more information, see [Application Gateway health probes overview](./application-gateway-probe-overview.md).

* **Set up monitoring and alerting**: Create alerts based on Application Gateway metrics and logs to detect unusual traffic patterns, failed authentication attempts, or performance anomalies that might indicate security issues. Use Azure Monitor to establish baseline performance and identify deviations.

* **Implement centralized log management**: Integrate Application Gateway logs with your security information and event management (SIEM) system to correlate events across your infrastructure and enable automated threat detection and response.

* **Monitor backend health**: Use the Backend Health feature to continuously monitor the status of your backend servers and quickly identify potential security or availability issues. For more information, see [View backend health through portal](./application-gateway-backend-health.md).

## Asset management

Asset management ensures your Application Gateway configurations are properly monitored and comply with organizational policies.

* **Implement Azure Policy governance**: Use Azure Policy to audit and enforce configurations across your Application Gateway deployments. Create policies that prevent insecure configurations and ensure compliance with security standards. For more information, see [Azure Policy built-in definitions for Azure networking services](/azure/networking/policy-reference).

* **Monitor configuration compliance**: Use Microsoft Defender for Cloud to continuously monitor your Application Gateway configurations and receive alerts when deviations from security baselines are detected. Set up automated remediation where possible to maintain consistent security posture.

## Next steps

- Learn more about [Azure security architecture and design](/azure/well-architected/security/)
- Review [Security in the Microsoft Cloud Adoption Framework](/azure/cloud-adoption-framework/secure/overview)
- Explore [Web Application Firewall on Azure Application Gateway](/azure/web-application-firewall/ag/ag-overview)
