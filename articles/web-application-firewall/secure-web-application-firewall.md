---
title: Secure your Azure Web Application Firewall deployment
description: Learn how to secure Azure Web Application Firewall, with best practices for network security, identity and access management, data protection, logging, compliance, and recovery.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: best-practice
ms.custom: horz-security
ms.date: 07/16/2026
ai-usage: ai-assisted
---

# Secure your Azure Web Application Firewall deployment

Azure Web Application Firewall (WAF) provides centralized protection for your web applications from common exploits and vulnerabilities, such as SQL injection, cross-site scripting, and other Open Worldwide Application Security Project (OWASP) Top 10 attacks. WAF is available with Azure Front Door, Azure Application Gateway, and Azure Application Gateway for Containers to help protect internet-facing applications at the edge or in your virtual network.

This article provides security recommendations for Azure Web Application Firewall. These recommendations help you fulfill your security obligations and improve the overall security posture of your deployment. For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md)

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security for Azure Web Application Firewall focuses on inspecting application traffic, reducing exposure to common web attacks, and applying WAF policy settings that match each protected application.

- **Deploy WAF at every public application entry point**: Protect internet-facing web applications with WAF on Azure Front Door, Application Gateway, or Application Gateway for Containers. Use Front Door WAF for global edge protection, Application Gateway WAF for regional layer 7 protection in a virtual network, and Application Gateway for Containers WAF for Kubernetes Gateway API workloads. For more information, see [Azure Web Application Firewall overview](overview.md).

- **Use one WAF policy per site or application**: Assign a dedicated WAF policy to each origin, site, or application so custom rules, exclusions, managed rule overrides, and rate limits are isolated to that workload. This pattern reduces the impact when a policy change causes false positives or requires rollback. For more information, see [Best practices for Azure Web Application Firewall in Azure Front Door](./afds/waf-front-door-best-practices.md) and [WAF Policy Overview](./ag/policy-overview.md).

- **Apply the latest managed rule sets supported by your platform**: Regularly review and upgrade managed rule set versions. Front Door Premium and Application Gateway WAF support DRS 2.2, which is based on OWASP CRS 3.3.4. DRS 2.1 is based on OWASP CRS 3.3.2 and remains available for supported scenarios. Application Gateway for Containers WAF supports only DRS 2.1 and doesn't support legacy CRS managed rule sets. For more information, see [Front Door WAF DRS rule groups and rules](./afds/waf-front-door-drs.md), [Application Gateway WAF DRS and CRS rule groups and rules](./ag/application-gateway-crs-rulegroups-rules.md), and [Azure Web Application Firewall on Application Gateway for Containers](/azure/application-gateway/for-containers/web-application-firewall).

- **Start managed rule sets in Detection mode before Prevention mode**: Deploy new or upgraded rule sets in Detection mode, review WAF logs, tune exclusions and overrides, and then switch to Prevention mode to block attacks. This phased approach reduces false positives while enabling enforcement after tuning. For more information, see [WAF modes on Application Gateway](./ag/ag-overview.md#waf-modes) and [WAF modes on Front Door](./afds/afds-overview.md#waf-modes).

- **Use custom rules to block malicious traffic**: Create custom rules for IP addresses, IP ranges, geographic locations, request headers, request methods, and rate limits. Custom rules run before managed rules and can block known bad sources or allow known trusted traffic. For more information, see [Custom rules for Web Application Firewall on Azure Front Door](./afds/waf-front-door-custom-rules.md) and [Custom rules for Web Application Firewall v2 on Azure Application Gateway](./ag/custom-waf-rules-overview.md).

- **Implement rate limiting for application-layer resilience**: Configure rate limit rules to control the number of requests allowed from each client IP address over a specified time period. Set thresholds high enough to avoid blocking legitimate traffic while protecting against retry storms, scraping, and application-layer denial-of-service patterns. For more information, see [What is rate limiting for Azure Front Door?](./afds/waf-front-door-rate-limit.md) and [What is rate limiting for Web Application Firewall on Application Gateway?](./ag/rate-limiting-overview.md)

- **Enable bot protection where supported**: Use the Bot Manager managed rule set to identify and block bad bots while allowing legitimate bots, such as search engine crawlers. Bot protection helps reduce credential stuffing, scraping, and automated attack traffic. For more information, see [Configure bot protection for Web Application Firewall with Azure Front Door](./afds/waf-front-door-policy-configure-bot-protection.md) and [Configure bot protection for Web Application Firewall on Azure Application Gateway](./ag/bot-protection.md).

- **Use geo-filtering for regional applications**: If your application serves users from specific geographic regions, configure geo-filtering to block requests from outside expected countries or regions. Include the unknown (`ZZ`) country code whenever you use geo-filtering to avoid blocking valid requests from unmapped IP addresses. For more information, see [What is geo-filtering on a domain for Azure Front Door?](./afds/waf-front-door-geo-filtering.md) and [Use Azure WAF geomatch custom rules to enhance network security](./ag/geomatch-custom-rules.md).

- **Tune exclusions carefully**: Use exclusions only for specific false positives and scope them to the narrowest match variable, selector, rule, rule group, or rule set possible. Broad exclusions can create gaps in inspection for sensitive request data. For more information, see [Azure Web Application Firewall on Azure Front Door exclusion lists](./afds/waf-front-door-exclusion.md) and [Web Application Firewall exclusion lists with Application Gateway](./ag/application-gateway-waf-configuration.md#exclusion-scopes).

## Identity and access management

Identity and access management for Azure Web Application Firewall controls who can create, modify, approve, and monitor WAF policies and related networking resources.

- **Use Microsoft Entra ID for centralized authentication**: Use Microsoft Entra ID as your central authentication and authorization system for managing WAF resources. Microsoft Entra ID provides consistent identity management across your Azure environment. For more information, see [What is Microsoft Entra ID?](/entra/fundamentals/what-is-entra)

- **Assign least-privilege Azure RBAC roles**: Use Azure role-based access control to grant only the permissions required to manage WAF policies, Front Door profiles, Application Gateways, diagnostic settings, and monitoring destinations. Avoid assigning broad roles like Owner when a scoped custom role is sufficient. For more information, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

- **Use managed identities for WAF policy management where applicable**: Use managed identities for automation that deploys, exports, or updates WAF policies through Azure Resource Manager, Bicep, or CI/CD workflows. Grant the managed identity only the required permissions on the target resource group, Front Door profile, Application Gateway, and diagnostic destinations. For more information, see [Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).

- **Maintain an inventory of administrative access**: Review Azure RBAC role assignments at the management group, subscription, resource group, and resource scopes that contain WAF policies, Front Door profiles, Application Gateways, and monitoring destinations. Remove stale assignments and investigate privileged assignments that aren't required for WAF administration. For more information, see [List Azure role assignments using the Azure portal](../role-based-access-control/role-assignments-list-portal.md).

- **Require multifactor authentication for administrators**: Require multifactor authentication for all users with administrative access to WAF resources and related networking resources. MFA adds a critical layer of protection if credentials are compromised. For more information, see [How to enable multifactor authentication in Microsoft Entra](/entra/identity/authentication/howto-mfa-getstarted).

- **Restrict management access with Conditional Access**: Configure Conditional Access policies with named locations, compliant devices, and strong authentication for administrators who manage Azure Resource Manager resources. For more information, see [What is the location condition in Microsoft Entra Conditional Access?](/entra/identity/conditional-access/concept-assignment-network)

- **Use privileged access controls for WAF administration**: Use dedicated administrative accounts, privileged access workstations, and just-in-time access for WAF policy changes. These controls reduce the risk of unauthorized changes to security rules and exclusions. For more information, see [Securing privileged access overview](/security/privileged-access-workstations/privileged-access-access-model).

- **Review and reconcile access regularly**: Use Microsoft Entra ID access reviews to manage group memberships and role assignments for users who can modify WAF resources. Remove access that's no longer required. For more information, see [What are access reviews?](/entra/id-governance/access-reviews-overview)

- **Monitor identity risk and suspicious administrative activity**: Send Microsoft Entra sign-in, audit, and risk logs to Azure Monitor or Microsoft Sentinel. Alert on risky sign-ins, changes to privileged role assignments, and unexpected WAF policy updates. For more information, see [Integrate Microsoft Entra logs with Azure Monitor logs](/entra/identity/monitoring-health/howto-integrate-activity-logs-with-azure-monitor-logs).

## Data protection

Data protection for Azure Web Application Firewall focuses on protecting sensitive request data, logs, policy exports, and related telemetry from unauthorized access or disclosure.

- **Ensure encryption in transit**: Require TLS 1.2 or later for client connections and backend connections that pass through Azure Front Door or Application Gateway. Validate certificates and protocol settings as part of every deployment. For more information, see [End-to-end TLS with Azure Front Door](../frontdoor/end-to-end-tls.md) and [Overview of TLS termination and end to end TLS with Application Gateway](../application-gateway/ssl-overview.md).

- **Enable sensitive data protection with log scrubbing where supported**: For Front Door and Application Gateway WAF policies, configure log scrubbing rules to remove sensitive values, such as passwords, secrets, and personal data, from WAF logs before they're written. This approach helps preserve security visibility while reducing exposure in monitoring systems. For more information, see [Azure Web Application Firewall Sensitive Data Protection for Azure Front Door](./afds/waf-sensitive-data-protection-frontdoor.md) and [Azure Web Application Firewall Sensitive Data Protection for Application Gateway](./ag/waf-sensitive-data-protection.md).

- **Protect WAF logs and policy exports**: Treat WAF diagnostic logs, Azure Resource Manager templates, Bicep files, and exported policy definitions as sensitive data because they can reveal application paths, custom rules, exclusions, and origin details. Store them in repositories, storage accounts, or Log Analytics workspaces with least-privilege access. For more information, see [Manage access to Log Analytics workspaces](/azure/azure-monitor/logs/manage-access).

- **Use customer-managed keys for related storage**: When your organization requires direct control over key lifecycle, use customer-managed keys for the Azure Storage accounts that receive WAF logs, and apply equivalent key-management controls to other log destinations you use (such as Event Hubs or Log Analytics workspaces). For more information, see [Customer-managed keys for Azure Storage encryption](../storage/common/customer-managed-keys-overview.md).

- **Inspect request bodies where appropriate**: Enable request body inspection for applications that receive form data, JSON, XML, or file uploads. Review request size limits and configure exclusion lists to balance security coverage with application compatibility. For more information, see [Application Gateway WAF request size limits](./ag/application-gateway-waf-request-size-limits.md) and [Web Application Firewall exclusion lists](./ag/application-gateway-waf-configuration.md).

- **Tag resources that handle sensitive information**: Use tags to identify WAF policies, gateways, Front Door profiles, log destinations, and related resources that process or store sensitive information. Tags help with compliance reporting and operational ownership. For more information, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

## Logging and monitoring

Logging and monitoring for Azure Web Application Firewall provide visibility into inspected traffic, rule matches, blocked requests, configuration changes, and operational health.

- **Enable diagnostic settings on all WAF resources**: Send WAF logs and metrics for Azure Front Door and Application Gateway to a Log Analytics workspace, storage account, or Event Hubs. Diagnostic logs show what WAF evaluated, matched, and blocked. For more information, see [Azure Web Application Firewall monitoring and logging for Azure Front Door](./afds/waf-front-door-monitor.md) and [Application Gateway diagnostics](../application-gateway/application-gateway-diagnostics.md).

- **Centralize WAF events in Microsoft Sentinel**: Connect Azure WAF logs to Microsoft Sentinel or another security information and event management (SIEM) platform to correlate WAF detections with identity, endpoint, network, and application telemetry. For more information, see [Connect data from Microsoft Web Application Firewall to Microsoft Sentinel](/azure/sentinel/connect-azure-waf).

- **Review WAF logs during Detection mode and after rule changes**: Review managed rule matches, custom rule matches, exclusions, and anomaly scores after new deployments or rule set upgrades. Use these findings to tune policies before enabling Prevention mode. For more information, see [Tune Azure Web Application Firewall for Azure Front Door](./afds/waf-front-door-tuning.md).

- **Create alerts for anomalous activity**: Configure Azure Monitor alerts for blocked request spikes, high rule match counts, unhealthy backends, and configuration changes. Alerting helps detect active attacks and unintended policy changes quickly. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

- **Monitor resource configuration changes**: Use Azure Activity Log to detect changes to WAF policies, custom rules, managed rule overrides, exclusions, Front Door profiles, Application Gateways, and diagnostic settings. For more information, see [View the activity log](/azure/azure-monitor/essentials/activity-log#view-the-activity-log).

- **Use WAF workbooks for investigation**: Use Azure Monitor workbooks or Microsoft Sentinel workbooks to review top rule matches, blocked clients, URI paths, and trends. Workbooks help security teams distinguish attacks from false positives. For more information, see [Using Microsoft Sentinel with Azure Web Application Firewall](waf-sentinel.md).

- **Preserve logs for incident response and compliance**: Configure retention in Log Analytics or archive logs to a storage account according to your organization's compliance and investigation requirements. For more information, see [Set data retention in a Log Analytics workspace](/azure/azure-monitor/logs/data-retention-configure).

## Compliance and governance

Compliance and governance for Azure Web Application Firewall help ensure consistent policy configuration, inventory, tagging, and enforcement across subscriptions and applications.

- **Use Azure Policy to enforce WAF deployment and configuration**: Assign Azure Policy definitions to audit, deny, or remediate applications without WAF protection, WAF policies without logging, and noncompliant WAF modes. For more information, see [Azure Web Application Firewall and Azure Policy](./shared/waf-azure-policy.md).

- **Define WAF configuration as code**: Manage WAF policies with ARM templates, Bicep, Terraform, or other infrastructure-as-code workflows. Configuration as code simplifies review, repeatable deployment, rule exclusion management, and drift detection. For more information, see [Best practices for Azure Web Application Firewall in Azure Front Door](./afds/waf-front-door-best-practices.md).

- **Maintain an approved WAF resource inventory**: Use Azure Resource Graph to discover WAF policies, Application Gateways, Front Door profiles, endpoints, diagnostic settings, and related public entry points across subscriptions. Reconcile the inventory regularly and remove unauthorized resources. For more information, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md).

- **Apply consistent tags and ownership metadata**: Tag WAF policies and related resources with application, environment, data classification, owner, and cost center information. Tags support operational accountability and compliance reporting. For more information, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

- **Organize environments with management groups and subscriptions**: Separate production, test, and development environments using management groups and subscriptions that reflect your security and compliance boundaries. Apply policy initiatives at the appropriate scope. For more information, see [Create management groups](../governance/management-groups/create-management-group-portal.md).

- **Require Premium capabilities when needed**: Use governance controls to require Azure Front Door Premium for workloads that need managed WAF rule sets, bot protection, and Private Link to origins. For more information, see [Feature comparison between Azure Front Door tiers](../frontdoor/front-door-cdn-comparison.md#service-comparison).

- **Limit Azure Resource Manager access**: Use Conditional Access for the Microsoft Azure Management cloud app to restrict who can manage Azure resources and from where. For more information, see [Configure Conditional Access for Azure management](/azure/role-based-access-control/conditional-access-azure-management).

## Backup and recovery

Backup and recovery for Azure Web Application Firewall focus on preserving policy definitions, limiting the impact of policy errors, and restoring known-good protection during outages or failed changes.

- **Export WAF policies regularly**: Export WAF policies as Azure Resource Manager templates or Bicep and store them in source control. Treat the WAF policy as the source of truth because it contains custom rules, exclusions, managed rule overrides, policy mode, and request body inspection settings. For more information, see [Export template from the Azure portal](../azure-resource-manager/templates/export-template-portal.md).

- **Use one WAF policy per site for recovery isolation**: Assign a separate WAF policy to each origin, site, or application. Per-site policy isolation helps you roll back or replace one application's policy without weakening protection for other applications. For more information, see [Best practices for Azure Web Application Firewall in Azure Front Door](./afds/waf-front-door-best-practices.md).

- **Stage rule set upgrades before enforcement**: Apply new or upgraded managed rule sets in Detection mode first, tune false positives, and then move to Prevention mode after validation. Keep the previously known-good policy definition available for rapid rollback. For more information, see [Tune Azure Web Application Firewall for Azure Front Door](./afds/waf-front-door-tuning.md).

- **Design multiregion WAF deployments**: Azure Front Door WAF is global, but Application Gateway WAF is regional and must be deployed in each region that hosts your application. For multiregion architectures, replicate WAF policies and gateway configuration so regional failover doesn't bypass inspection. For more information, see [How to choose your WAF platform](../networking/design-guide/web-application-firewall.md#how-to-choose-your-waf-platform).

- **Test policy rollback procedures**: Document and test how to restore a known-good policy. For Application Gateway WAF, replace the Application Gateway or listener policy reference with the known-good WAF policy. For Front Door WAF, switch the security policy association to a known-good WAF policy version or redeploy the known-good policy definition from source control. For more information, see [WAF policy and rules for Azure Front Door](./afds/waf-front-door-create-portal.md) and [Create Web Application Firewall policies for Application Gateway](./ag/create-waf-policy-ag.md).

- **Validate recovery with monitoring**: After rollback or failover, confirm that WAF logs, diagnostic settings, alerts, and SIEM connections are still active. Recovery is incomplete if policy enforcement is restored but monitoring is missing. For more information, see [Azure Web Application Firewall monitoring and logging for Azure Front Door](./afds/waf-front-door-monitor.md).

## Next steps

- [Azure Web Application Firewall overview](overview.md)
- [Azure Web Application Firewall on Azure Front Door overview](./afds/afds-overview.md)
- [Azure Web Application Firewall on Azure Application Gateway overview](./ag/ag-overview.md)
- [Azure Web Application Firewall and Azure Policy](./shared/waf-azure-policy.md)
- [Microsoft cloud security benchmark overview](/security/benchmark/azure/overview)
- [Azure Well-Architected Framework: Security pillar](/azure/well-architected/security/)
- [Cloud Adoption Framework: Secure overview](/azure/cloud-adoption-framework/secure/overview)
