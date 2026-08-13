---
title: Secure your Azure Application Gateway deployment
description: Learn how to secure Azure Application Gateway with network controls, firewall protection, identity, data protection, monitoring, governance, and recovery.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-application-gateway
ms.topic: best-practice
ms.custom: horz-security
ms.date: 07/23/2026
ai-usage: ai-assisted
---

# Secure your Azure Application Gateway

Azure Application Gateway is a web traffic load balancer that enables you to manage traffic to your web applications. As a critical component in your network infrastructure, Application Gateway handles incoming requests and routes them to backend services, making it essential to implement proper security measures to protect against threats and ensure compliance with organizational security requirements.

This article provides guidance on how to best secure your Azure Application Gateway deployment.

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security for Application Gateway involves controlling traffic flow, implementing proper segmentation, and securing communications between clients and backend services.

- **Deploy a dedicated subnet**: Place your Application Gateway in a dedicated subnet within your virtual network to provide network isolation and support the required infrastructure configuration. For more information, see [Application Gateway infrastructure configuration](./configuration-infrastructure.md).

- **Apply network security groups**: Use network security groups (NSGs) to restrict traffic by port, protocol, source IP address, or destination IP address. Create NSG rules that allow required client, backend, and infrastructure traffic while limiting access from untrusted networks. For more information, see [Network security groups](./configuration-infrastructure.md#network-security-groups).

- **Configure Application Gateway Private Link**: Use Application Gateway Private Link to establish private connectivity to your gateway from clients across virtual networks, subscriptions, regions, and Microsoft Entra tenants without exposing traffic to the public internet. For more information, see [Configure Azure Application Gateway Private Link](./private-link-configure.md).

- **Deploy Application Gateway without a public IP**: Use a private-only Application Gateway deployment to remove the gateway's public IP address requirement, define a deny-all outbound NSG rule to prevent data exfiltration, and eliminate the inbound `GatewayManager` service tag dependency. For more information, see [Private Application Gateway deployment](./application-gateway-private-deployment.md).

- **Enable Azure DDoS Network Protection**: Deploy Azure DDoS Network Protection on the virtual network that hosts your Application Gateway to help protect internet-facing applications from large-scale DDoS attacks with adaptive tuning and attack notifications. For more information, see [Protect your application gateway with Azure DDoS Network Protection](./tutorial-protect-application-gateway-ddos.md).

- **Configure private DNS for private endpoints**: Link the required private DNS zones to the Application Gateway virtual network when backends or Key Vault certificates use private endpoints so the gateway resolves private IP addresses correctly. For more information, see [DNS resolution in Azure Application Gateway](./application-gateway-dns-resolution.md).

## Web application protection

Web Application Firewall (WAF) provides essential protection against common web vulnerabilities and attacks that target your applications.

- **Deploy Application Gateway WAF v2**: Enable Azure Web Application Firewall on Application Gateway for internet-facing applications to protect against common attacks such as SQL injection and cross-site scripting. For more information, see [What is Azure Web Application Firewall on Azure Application Gateway?](/azure/web-application-firewall/ag/ag-overview)

- **Manage WAF settings with WAF policies**: Use WAF policies for Application Gateway WAF v2 instead of legacy WAF configuration so you can manage managed rules, exclusions, custom rules, and policy associations globally, per listener, or per URI. For more information, see [Azure Web Application Firewall policy overview](/azure/web-application-firewall/ag/policy-overview).

- **Use Default Rule Set (DRS) 2.2**: Run DRS 2.2, the current highest available Default Rule Set version, preserve existing customizations when upgrading, and validate newly added enabled rules in log mode before allowing them to block traffic. For more information, see [Upgrade CRS or DRS ruleset version](../web-application-firewall/ag/upgrade-ruleset-version.md).

- **Tune WAF before prevention mode**: Start with detection mode to understand traffic patterns and tune false positives, then switch to prevention mode so WAF blocks malicious requests. For more information, see [Best practices for Azure Web Application Firewall on Application Gateway](/azure/web-application-firewall/ag/best-practices).

- **Configure custom WAF rules**: Create custom rules to address application-specific threats, including IP restrictions, geo-filtering, and request attribute matching that aren't fully covered by managed rule sets. For more information, see [Create and use custom web application firewall rules](../web-application-firewall/ag/create-custom-waf-rules.md).

- **Scope WAF exceptions narrowly**: Use preview WAF exceptions only when false positives require bypassing inspection for specific requests, and scope exceptions to the narrowest practical rule, rule group, or managed ruleset. For more information, see [Azure Application Gateway WAF exceptions list (preview)](../web-application-firewall/ag/application-gateway-exceptions.md).

- **Enable bot protection**: Use the bot protection managed rule set with Application Gateway WAF v2 to classify and block malicious bots while allowing known good bots. For more information, see [Azure Web Application Firewall on Azure Application Gateway bot protection overview](../web-application-firewall/ag/bot-protection-overview.md).

- **Implement WAF rate limiting**: Configure rate limiting custom rules to detect and block abnormally high request volumes from clients, geographies, or other session groupings. For more information, see [Rate limiting overview](../web-application-firewall/ag/rate-limiting-overview.md).

## Identity and access management

Proper authentication and authorization controls ensure only authorized users and systems can access Application Gateway and its configuration.

- **Configure mutual TLS authentication**: Use mutual TLS authentication when applications require client certificate authentication at the gateway or certificate passthrough to the backend. For more information, see [Mutual authentication overview](./mutual-authentication-overview.md).

- **Assign least-privilege Azure RBAC roles**: Scope management access to the resource group or Application Gateway resource. Use the built-in **Network Contributor** role only for operators who need to manage network resources because there isn't an Application Gateway-specific built-in management role. For more information, see [Azure built-in roles for networking](/azure/role-based-access-control/built-in-roles/networking#network-contributor).

- **Enforce Conditional Access for Application Gateway administrators**: Apply Conditional Access policies that require multifactor authentication and compliant devices for identities that can create, modify, or delete Application Gateway, WAF policies, listener certificates in Key Vault, and the virtual network and public IP resources the gateway depends on. For more information, see [Require MFA for Azure management](/entra/identity/conditional-access/policy-old-require-mfa-azure-mgmt).

- **Use managed identities for Key Vault certificates**: Assign a user-assigned managed identity to Application Gateway and grant it access to retrieve Key Vault certificates or secrets, such as the **Key Vault Secrets User** role when Key Vault uses Azure RBAC. For more information, see [TLS termination with Azure Key Vault certificates](./key-vault-certs.md).

- **Apply resource locks to production gateways**: Use resource locks to help prevent accidental deletion or modification of production Application Gateway and WAF policy resources. For more information, see [Lock your resources to protect your infrastructure](/azure/azure-resource-manager/management/lock-resources).

- **Review privileged access regularly**: Run access reviews for groups and privileged identities that can administer Application Gateway, WAF policies, virtual networks, public IP addresses, and Key Vault certificates. For more information, see [Create an access review of Azure resource roles in PIM](/entra/id-governance/privileged-identity-management/pim-create-roles-and-resource-roles-review).

## Data protection

Data protection for Application Gateway focuses on securing data in transit and managing certificates and secrets properly.

- **Require current TLS versions**: Configure frontend TLS policies so client connections use TLS 1.2 or later, use HTTPS backend settings for end-to-end TLS, and verify backend servers support TLS 1.2 or later because support for TLS 1.0 and 1.1 ended for Application Gateway. For more information, see [Overview of TLS termination and end-to-end TLS with Application Gateway](./ssl-overview.md).

- **Configure TLS termination securely**: Use trusted certificates and appropriate TLS policies on HTTPS listeners so Application Gateway decrypts client traffic securely before applying Layer 7 routing decisions. For more information, see [Configure TLS termination with Application Gateway](./create-ssl-portal.md).

- **Enable end-to-end TLS**: Use HTTPS backend settings so Application Gateway terminates the client TLS session and creates a new TLS connection to the backend servers, protecting traffic across the full request path. For more information, see [Overview of TLS termination and end-to-end TLS with Application Gateway](./ssl-overview.md).

- **Store certificates in Azure Key Vault**: Reference Key Vault certificates or secrets for HTTPS listeners instead of embedding certificates in deployment artifacts. Use versionless secret identifiers so Application Gateway can pick up renewed certificate versions. For more information, see [TLS termination with Azure Key Vault certificates](./key-vault-certs.md).

- **Automate certificate rotation**: Use Key Vault certificate renewal with Application Gateway so gateway instances poll Key Vault and automatically rotate to newer certificate versions. For more information, see [TLS termination with Azure Key Vault certificates](./key-vault-certs.md#certificate-settings-in-key-vault).

- **Redirect HTTP traffic to HTTPS**: Configure HTTP-to-HTTPS redirection to reduce the risk of sensitive data being transmitted in plaintext. For more information, see [Create an application gateway with HTTP to HTTPS redirection using the Azure portal](./redirect-http-to-https-portal.md).

## Logging and monitoring

Logging and monitoring provide visibility into Application Gateway operations and help detect potential security threats.

- **Enable diagnostic settings**: Configure diagnostic settings to collect Application Gateway access logs and WAF firewall logs in a destination such as Log Analytics, storage, or Event Hubs. Review the automatically collected activity log for control-plane changes. For more information, see [Diagnostic logs for Application Gateway](./application-gateway-diagnostics.md).

- **Use resource-specific log tables**: Send logs to resource-specific tables such as `AGWAccessLogs` and `AGWFirewallLogs` to simplify queries and improve log discoverability. For more information, see [Monitor Azure Application Gateway](./monitor-application-gateway.md).

- **Configure security alerts**: Create Azure Monitor alerts for failed requests, unhealthy hosts, capacity utilization, response status anomalies, and other signals that can indicate availability or security problems. For more information, see [Monitor Azure Application Gateway](./monitor-application-gateway.md#application-gateway-alert-rules).

- **Review WAF logs regularly**: Analyze Application Gateway WAF logs to identify attacks, tune false positives, and confirm that prevention mode is blocking malicious requests as expected. For more information, see [Azure Web Application Firewall monitoring and logging](../web-application-firewall/ag/application-gateway-waf-metrics.md).

- **Send WAF logs to Microsoft Sentinel**: Integrate WAF logs with Microsoft Sentinel or another SIEM so web application threats are correlated with signals from the rest of your environment. For more information, see [Using Microsoft Sentinel with Azure Web Application Firewall](../web-application-firewall/waf-sentinel.md).

- **Monitor backend health**: Use backend health views and custom health probes to detect unhealthy backend servers and prevent traffic from being routed to failed or compromised instances. For more information, see [View backend health through the portal](./application-gateway-backend-health.md).

## Compliance and governance

Compliance and governance ensure your Application Gateway configurations are inventoried, monitored, and aligned with organizational policies.

- **Enforce configuration with Azure Policy**: Use built-in Azure Policy definitions to audit and enforce Application Gateway and WAF configurations. Key policies include **Azure Application Gateway should be deployed with Azure WAF**, **Web Application Firewall (WAF) should be enabled for Application Gateway**, **Web Application Firewall (WAF) should use the specified mode for Application Gateway**, and **Bot Protection should be enabled for Azure Application Gateway WAF**. For more information, see [Azure Policy built-in definitions for Azure networking services](/azure/networking/policy-reference).

- **Tag gateway resources consistently**: Apply tags to Application Gateway, WAF policies, public IP addresses, and related networking resources so ownership, environment, and compliance scope are clear. For more information, see [Tag resources, resource groups, and subscriptions for logical organization](/azure/azure-resource-manager/management/tag-resources).

- **Inventory gateway resources with Azure Resource Graph**: Query Application Gateway, WAF policy, public IP address, and virtual network resources to identify configuration drift and unsupported patterns at scale. For more information, see [What is Azure Resource Graph?](/azure/governance/resource-graph/overview).

## Backup and recovery

Application Gateway doesn't provide a data-plane backup feature for the gateway itself. Recovery planning focuses on preserving configuration, protecting certificates and WAF policy definitions, and designing resilient traffic paths.

- **Define gateway configuration as code**: Store Application Gateway, listener, rule, backend, public IP address, and related network configuration in Bicep, ARM templates, Terraform, or another infrastructure-as-code system so you can redeploy consistently after accidental deletion or regional failure. For more information, see [Quickstart: Direct web traffic with Azure Application Gateway - Bicep](./quick-create-bicep.md).

- **Export existing configurations for recovery**: Export production Application Gateway configurations to ARM templates when you create resources manually, then review and parameterize the templates before using them for recovery. For more information, see [Export templates from the Azure portal](/azure/azure-resource-manager/templates/export-template-portal).

- **Deploy zone-redundant Application Gateway v2**: Use Application Gateway v2 with availability zone support in regions that support zones to improve resilience to zonal failures. For more information, see [Scaling Application Gateway v2 and WAF v2](./application-gateway-autoscaling-zone-redundant.md).

- **Design cross-region traffic recovery**: Use global routing services such as Azure Front Door or Azure Traffic Manager in front of regional Application Gateway deployments when applications require cross-region failover. For more information, see [Use Azure Application Gateway with Azure Traffic Manager](../traffic-manager/traffic-manager-use-with-application-gateway.md).

- **Version WAF policy configuration**: Keep WAF policy definitions, custom rules, exclusions, and managed ruleset choices in source control so you can restore known-good policy versions and reapply tuning after rule set updates. For more information, see [Best practices for Azure Web Application Firewall on Application Gateway](../web-application-firewall/ag/best-practices.md#define-your-waf-configuration-as-code).

- **Protect certificate recovery dependencies**: Include Key Vault certificates, secret references, managed identity assignments, and Key Vault access permissions in recovery plans so restored gateways can retrieve TLS certificates. For more information, see [TLS termination with Azure Key Vault certificates](./key-vault-certs.md).

## Next steps

- Learn more about [Azure security architecture and design](/azure/well-architected/security/).
- Review [Security in the Microsoft Cloud Adoption Framework](/azure/cloud-adoption-framework/secure/overview).
- Explore [Web Application Firewall on Azure Application Gateway](/azure/web-application-firewall/ag/ag-overview).
