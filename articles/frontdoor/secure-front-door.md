---
title: Secure your Azure Front Door deployment
description: Learn how to secure Azure Front Door by using edge protection, origin controls, identity, encryption, monitoring, and recovery best practices.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: best-practice
ms.custom: horz-security
ms.date: 07/16/2026
ai-usage: ai-assisted
---

# Secure your Azure Front Door deployment

Azure Front Door is a cloud content delivery network (CDN) and global application delivery service that provides edge routing, acceleration, web application firewall (WAF), and origin protection capabilities for internet-facing applications. Because Azure Front Door is commonly the public entry point for applications, secure configuration helps protect traffic, origins, certificates, and operational telemetry.

This article provides security recommendations to help protect your Azure Front Door deployment.

Azure Front Door (classic) retires on March 31, 2027. To avoid service disruption, migrate your Azure Front Door (classic) profiles to Azure Front Door Standard or Premium tier by that date. The Standard and Premium tiers use the current Azure Front Door platform. Premium adds full WAF capabilities, managed rule sets, and Private Link origin support, and both tiers support managed identities. For more information, see [Migrate from Azure Front Door (classic) to Standard or Premium tier](tier-migration.md).

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security for Azure Front Door focuses on protecting applications at the edge, reducing direct origin exposure, and controlling the requests that can reach your backend services.

- **Migrate to Azure Front Door Standard or Premium**: Move from Azure Front Door (classic) before retirement and use the Standard or Premium tier for the current Azure Front Door platform. Use Premium when you need full WAF capabilities, managed rule sets, or Private Link origin support. For more information, see [Migrate from Azure Front Door (classic) to Standard or Premium tier](tier-migration.md).

- **Secure origins with Private Link**: Use Azure Front Door Premium with Azure Private Link for supported Azure origins to keep origin traffic off the public internet and reduce exposure to direct attacks against backend services. For more information, see [Secure your origin with Private Link in Azure Front Door](private-link.md).

- **Restrict direct origin access**: Configure origins to accept traffic only from Azure Front Door by using supported controls for each origin type, such as Private Link, managed identity origin authentication for non-Private Link origins, IP filtering with the `AzureFrontDoor.Backend` service tag, and validation of the `X-Azure-FDID` header. For more information, see [Secure traffic to Azure Front Door origins](origin-security.md).

- **Enable Web Application Firewall**: Associate a WAF policy with Azure Front Door to inspect requests at the edge before traffic reaches your origin. Use Azure Front Door Premium when you need managed rule sets and full WAF capabilities. For more information, see [Web Application Firewall on Azure Front Door](web-application-firewall.md).

- **Use the latest managed Default Rule Set**: Keep Premium WAF policies on the latest available Default Rule Set (DRS) 2.x version and validate rule changes before production rollout. DRS 2.2 is based on OWASP Core Rule Set (CRS) 3.3.4 and includes Microsoft Threat Intelligence protections. For more information, see [Azure Web Application Firewall DRS rule groups and rules](../web-application-firewall/afds/waf-front-door-drs.md).

- **Tune WAF before enforcing blocks**: Start with detection mode, review WAF logs, add exclusions only where required, and then switch production policies to prevention mode so malicious requests are blocked. For more information, see [Best practices for Azure Web Application Firewall in Azure Front Door](../web-application-firewall/afds/waf-front-door-best-practices.md).

- **Enable bot protection**: Add the Bot Manager rule set to Premium WAF policies to identify good, bad, and unknown bots and apply appropriate actions for automated traffic. For more information, see [Configure bot protection for Web Application Firewall with Azure Front Door](../web-application-firewall/afds/waf-front-door-policy-configure-bot-protection.md).

- **Use rate limiting to reduce abuse**: Configure WAF rate limiting custom rules to block abnormal request volumes by socket IP address and to reduce retry storms or application-layer denial-of-service attempts. For more information, see [WAF rate limiting for Azure Front Door](../web-application-firewall/afds/waf-front-door-rate-limit.md).

- **Apply geo-filtering where access is region-bound**: Use WAF geo-filtering custom rules when your application should only be available from specific countries or regions. Include the unknown (`ZZ`) location in rule design to avoid false positives. For more information, see [Geo-filtering on a domain for Azure Front Door](../web-application-firewall/afds/waf-front-door-geo-filtering.md).

- **Use built-in DDoS protections at the edge**: Rely on Azure Front Door's global edge network and WAF integration to absorb and filter many network and application-layer attacks before they reach your origins. For more information, see [DDoS protection on Azure Front Door](front-door-ddos.md).

## Identity and access management

Identity and access management for Azure Front Door focuses on using Microsoft Entra identities instead of secrets and limiting who can change edge routing, WAF, certificate, and origin settings.

- **Enable managed identities for service access**: Use system-assigned or user-assigned managed identities so Azure Front Door can access Azure resources such as Key Vault without stored credentials. For more information, see [Use managed identities in Azure Front Door](managed-identity.md).

- **Use managed identities for origin authentication (preview)**: For supported non-Private Link origins, configure Azure Front Door origin authentication with managed identities so Front Door can obtain Microsoft Entra tokens and authenticate to protected backend resources. This capability is in preview; validate that preview features meet your production requirements before adopting. For more information, see [Use managed identities to authenticate to origins](origin-authentication-with-managed-identities.md).

- **Grant least privilege to Front Door identities**: Assign only the roles required for the origin or certificate scenario, such as read-only data access to a storage origin or certificate access to Key Vault. Don't assign broad Contributor permissions to managed identities. For more information, see [Use managed identities to authenticate to origins](origin-authentication-with-managed-identities.md#provide-access-at-the-origin-resource).

- **Limit administrative access to Front Door resources**: Assign Azure role-based access control (Azure RBAC) roles only to administrators who need to manage profiles, endpoints, domains, routes, origins, and WAF policies. Review role assignments regularly and remove stale access. For more information, see [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md).

- **Use eligible access for privileged operations**: Require just-in-time activation for users who can change production Front Door profiles, WAF policies, custom domains, and origin settings. For more information, see [Activate Azure resource roles in Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-resource-roles-activate-your-roles).

## Data protection

Data protection for Azure Front Door focuses on encrypting traffic, protecting certificates and keys, and avoiding unintended exposure of sensitive content through edge features.

- **Use end-to-end TLS**: Configure HTTPS from clients to Azure Front Door and from Azure Front Door to origins so traffic remains encrypted across the full request path. For more information, see [End-to-end TLS with Azure Front Door](end-to-end-tls.md).

- **Configure current TLS policies**: Use the newest predefined TLS policy or a custom TLS policy that meets your security requirements for minimum protocol versions and cipher suites. For more information, see [Azure Front Door TLS policy](standard-premium/tls-policy.md).

- **Don't rely on Front Door for client certificate authentication**: Front Door Standard and Premium don't currently support client or mutual authentication (mTLS). If your workload requires mTLS, implement that control at an origin or alternate ingress layer and validate the complete request path. For more information, see [Azure Front Door TLS policy](standard-premium/tls-policy.md).

- **Manage certificates in Azure Key Vault**: Store customer-managed TLS certificates in Key Vault, use a managed identity for access, enable automatic certificate renewal where applicable, and protect the vault with soft-delete and purge protection. For more information, see [Configure HTTPS on an Azure Front Door custom domain](standard-premium/how-to-configure-https-custom-domain.md) and [Azure Key Vault soft-delete overview](/azure/key-vault/general/soft-delete-overview).

- **Don't cache sensitive content**: Configure caching rules carefully so private, authenticated, or regulated content isn't stored at the edge unintentionally. Use cache-control headers and route-level caching settings appropriate for your data classification. For more information, see [Caching with Azure Front Door](front-door-caching.md).

- **Protect sensitive data in WAF logs**: Use WAF sensitive data protection to reduce exposure of sensitive values in WAF logs when your policy inspects requests that might contain secrets or personal data. For more information, see [Sensitive data protection for Azure Web Application Firewall on Azure Front Door](../web-application-firewall/afds/waf-sensitive-data-protection-frontdoor.md).

## Logging and monitoring

Logging and monitoring for Azure Front Door provide visibility into access patterns, WAF actions, origin health, certificate problems, and configuration changes.

- **Enable resource logs**: Configure diagnostic settings for access logs, WAF logs, and health probe logs. Send these logs to Log Analytics, storage, Event Hubs, or a security information and event management (SIEM) tool. For more information, see [Configure Azure Front Door logs](standard-premium/how-to-logs.md).

- **Monitor WAF activity**: Review WAF logs for blocked requests, false positives, bot activity, rate-limited clients, and attack patterns. Use this information to tune policies and confirm that prevention mode is effective. For more information, see [Azure Web Application Firewall monitoring and logging](../web-application-firewall/afds/waf-front-door-monitor.md).

- **Monitor origin health and failover signals**: Use health probe logs and origin metrics to identify unhealthy origins, regional failures, DNS resolution problems, TLS handshake failures, and failover events. For more information, see [Monitor Azure Front Door](monitor-front-door.md).

- **Create alerts for security and availability events**: Configure Azure Monitor alerts for elevated 4xx or 5xx rates, WAF blocks, origin health percentage drops, latency changes, and certificate-related errors. For more information, see [Azure Front Door monitoring data reference](monitor-front-door-reference.md) and [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

- **Forward WAF telemetry to Microsoft Sentinel**: Connect WAF logs to Microsoft Sentinel or another SIEM to correlate edge security events with application, identity, and infrastructure signals. For more information, see [Use Microsoft Sentinel with Azure Web Application Firewall](../web-application-firewall/waf-sentinel.md).

## Compliance and governance

Compliance and governance for Azure Front Door help ensure consistent configuration, controlled change management, and auditable security posture across profiles and subscriptions.

- **Define Front Door configuration as code**: Manage profiles, endpoints, routes, origins, WAF associations, and security settings by using Bicep, Azure Resource Manager templates, Terraform, or another infrastructure as code process. This approach reduces configuration drift. For more information, see [Create an Azure Front Door using Bicep](create-front-door-bicep.md).

- **Version WAF policy changes**: Store WAF custom rules, exclusions, managed rule set versions, and policy settings in source control. This practice ensures that rule tuning and rule set upgrades can be reviewed, tested, and rolled back. For more information, see [Best practices for Azure Web Application Firewall in Azure Front Door](../web-application-firewall/afds/waf-front-door-best-practices.md#define-your-waf-configuration-as-code).

- **Review configuration changes**: Use activity logs and diagnostic data to track changes to Front Door profiles, routes, origins, custom domains, and WAF policies. Investigate unexpected changes as potential security events. For more information, see [Monitor Azure Front Door](monitor-front-door.md).

- **Standardize origin security requirements**: Apply consistent requirements for Private Link, managed identity origin authentication, `X-Azure-FDID` validation, and allowed host names across all application origins. For more information, see [Secure traffic to Azure Front Door origins](origin-security.md).

- **Document high-availability exceptions**: If a disaster recovery design requires alternate ingress paths that can't use Azure Front Door Private Link or `X-Azure-FDID` validation, document compensating controls such as token-based origin authentication, custom headers, mTLS at the alternate ingress, or IP filtering. For more information, see [High-availability implementation guide for using Azure Front Door and alternate ingress solutions](high-availability.md).

## Backup and recovery

Backup and recovery for Azure Front Door focus on preserving configuration, keeping alternate origins available, and validating failover paths before an outage occurs.

- **Manage Front Door configuration as infrastructure as code**: Define and version Azure Front Door profiles, endpoints, routes, origin groups, custom domains, and WAF associations in Bicep or ARM templates stored in a source-controlled repository. Treat that repository as the source of truth for recovery. Use policy or template export as a bootstrap or point-in-time snapshot, not as the ongoing source of truth. For more information, see [Create an Azure Front Door using Bicep](create-front-door-bicep.md) and [Export template from the Azure portal](../azure-resource-manager/templates/export-template-portal.md).

- **Keep configuration in version control**: Store Front Door, WAF, certificate, and origin configuration as infrastructure as code and require review for production changes. Version control provides rollback points and supports recovery into another subscription or resource group. For more information, see [Bicep best practices](../azure-resource-manager/bicep/best-practices.md).

- **Configure multiple origins for failover**: Use origin groups with multiple backends and set priority, weight, and latency settings to support active-active or active-passive failover patterns. For more information, see [Traffic routing methods to origin](routing-methods.md).

- **Configure health probes correctly**: Use HTTP or HTTPS health probes that validate a meaningful application health endpoint, and tune sample size and successful samples required so Front Door can detect unhealthy origins without excessive failover sensitivity. For more information, see [Health probes](health-probes.md).

- **Deploy globally redundant origins**: Run origin services in multiple Azure regions or hosting locations and use Azure Front Door load balancing, or Traffic Manager where appropriate, to route users to healthy regions during origin or regional failures. For more information, see [Traffic routing methods to origin](routing-methods.md) and [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md).

- **Plan alternate ingress for catastrophic recovery**: For mission-critical applications, maintain a tested alternate ingress path, such as Application Gateway WAF or an alternate CDN with Traffic Manager, so you can route around rare Azure Front Door availability or control-plane incidents. For more information, see [High-availability implementation guide for using Azure Front Door and alternate ingress solutions](high-availability.md).

- **Test failover regularly**: Simulate origin failures, regional outages, certificate renewal failures, and alternate ingress activation in non-production and production-safe drills. Validate failover, failback, logging, WAF behavior, and runbooks. For more information, see [High-availability implementation guide for using Azure Front Door and alternate ingress solutions](high-availability.md).

## Next steps

- [Azure Front Door overview](front-door-overview.md)
- [Best practices for Azure Front Door](best-practices.md)
- [Azure Front Door security headers](front-door-security-headers.md)
- [Web Application Firewall on Azure Front Door](web-application-firewall.md)
- [Monitor Azure Front Door](monitor-front-door.md)
- [High-availability implementation guide for using Azure Front Door and alternate ingress solutions](high-availability.md)
