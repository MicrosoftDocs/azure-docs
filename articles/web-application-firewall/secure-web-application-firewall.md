---
title: Secure your Azure Web Application Firewall deployment
description: Learn how to secure Azure Web Application Firewall, with best practices for network security, identity management, logging, data protection, asset management, and policy compliance.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.custom: horz-security
ms.date: 07/08/2025
ai-usage: ai-assisted
---

# Secure your Azure Web Application Firewall deployment

Azure Web Application Firewall (WAF) provides centralized protection for your web applications from common exploits and vulnerabilities such as SQL injection, cross-site scripting, and other OWASP Top 10 attacks. As a critical security component that sits between your applications and potential threats, it's essential to properly secure your WAF deployment to maximize its effectiveness and maintain your overall security posture.

This article provides guidance on how to best secure your Azure Web Application Firewall deployment.

## Network security

Network security for Azure Web Application Firewall focuses on protecting your applications through proper traffic management, blocking malicious IP addresses, and configuring WAF modes appropriately. These controls help ensure that only legitimate traffic reaches your applications while maintaining comprehensive protection against web-based attacks.

* **Configure WAF in Prevention mode after baseline period**: Start with Detection mode to understand your traffic patterns and identify false positives, then switch to Prevention mode to actively block attacks. Prevention mode blocks intrusions and attacks detected by the rules, sending attackers a "403 unauthorized access" exception. See [WAF modes on Application Gateway](/azure/web-application-firewall/ag/ag-overview#waf-modes) and [WAF modes on Front Door](/azure/web-application-firewall/afds/afds-overview#waf-modes).

* **Use custom rules to block malicious IP addresses**: Create custom rules to allow and block traffic based on IP addresses, ranges, or geographic locations. This provides granular control over who can access your applications and helps prevent attacks from known bad actors. See [Web Application Firewall CRS rule groups and rules](/azure/web-application-firewall/ag/application-gateway-crs-rulegroups-rules).

* **Customize WAF rules to reduce false positives**: Apply site-specific WAF policies and customize rules and rule groups to suit your web application requirements. This helps eliminate false positives while maintaining protection against genuine threats. Associate a unique Azure WAF Policy for each site to allow for site-specific configuration.

* **Enable comprehensive logging and monitoring**: Turn on Diagnostics and WAF logs when operating in Detection mode to monitor and log all threat alerts. This provides visibility into what your WAF is evaluating, matching, and blocking. See [Logging overview](/azure/web-application-firewall/ag/ag-overview#logging).

* **Use tags for organized network security management**: Apply tags to network security groups associated with your WAF in your Azure Application Gateway subnet and related network security resources. Use the "Description" field for individual NSG rules to specify business needs and duration. See [How to create and use tags](/azure/azure-resource-manager/management/tag-resources).

* **Monitor network resource configurations**: Use Azure Activity Log to monitor network resource configurations and detect changes for network settings and resources related to your WAF deployments. Create alerts within Azure Monitor that trigger when changes to critical network settings occur. See [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/essentials/activity-log#view-the-activity-log).

* **Implement rate limiting to prevent DDoS attacks**: Configure rate limiting rules to control the number of requests allowed from each client IP address over a specified time period. Set rate limit thresholds high enough to avoid blocking legitimate traffic while protecting against retry storms and DDoS attacks. See [What is rate limiting for Azure Front Door?](./afds/waf-front-door-rate-limit.md).

* **Enable bot protection to block malicious bots**: Use the bot protection managed rule set to identify and block bad bots while allowing legitimate bots like search engine crawlers. Bot protection rules categorize bots as good, bad, or unknown and can automatically block malicious bot traffic. See [Configure bot protection for Web Application Firewall](./afds/waf-front-door-policy-configure-bot-protection.md).

* **Implement geo-filtering for regional applications**: If your application serves users from specific geographic regions, configure geo-filtering to block requests from outside expected countries or regions. Include the unknown (ZZ) location to avoid blocking valid requests from unmapped IP addresses. See [What is geo-filtering on a domain for Azure Front Door?](./afds/waf-front-door-tutorial-geo-filtering.md).

* **Use the latest managed rule set versions**: Regularly update to the latest Azure-managed rule set versions to protect against current threats. Microsoft regularly updates managed rules based on the threat landscape and OWASP Top 10 attack types. See [Azure Web Application Firewall DRS rule groups and rules](./afds/waf-front-door-drs.md).

## Identity management

Identity management for Azure Web Application Firewall ensures that administrative access to your WAF resources is properly controlled and monitored. This includes maintaining inventories of administrative accounts, using centralized identity systems, and implementing strong authentication mechanisms for anyone managing your WAF deployment.

* **Use Azure Active Directory for centralized authentication**: Use Azure AD as your central authentication and authorization system for managing WAF resources. Azure AD protects data with strong encryption and provides consistent identity management across your Azure environment. See [How to create and configure an Azure AD instance](/azure/active-directory/fundamentals/active-directory-access-create-new-tenant).

* **Maintain inventory of administrative accounts**: Use Azure AD built-in roles that are queryable and must be explicitly assigned. Use the Azure AD PowerShell module to perform queries and discover accounts that are members of administrative groups with access to WAF resources. See [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole).

* **Enable multifactor authentication for administrative access**: Require MFA for all users with administrative access to WAF resources. This adds a crucial additional layer of security even if passwords are compromised. Follow Microsoft Defender for Cloud's Identity and Access Management recommendations. See [How to enable multifactor authentication in Azure](/azure/active-directory/authentication/howto-mfa-getstarted).

* **Use dedicated administrative accounts with standard procedures**: Create standard operating procedures around the use of dedicated administrative accounts that have access to Azure WAF instances. Use Microsoft Defender for Cloud's Identity and Access Management features to monitor the number of administrative accounts. See [Understand Microsoft Defender for Cloud Identity and Access](/azure/security-center/security-center-identity-access).

* **Manage access from approved locations only**: Configure Conditional Access policies with named locations to restrict access to your WAF resources. Create logical groupings of IP address ranges or countries and regions, and restrict access to sensitive resources to your configured named locations. See [What is the location condition in Azure Active Directory Conditional Access](/azure/active-directory/reports-monitoring/quickstart-configure-named-locations).

* **Monitor and alert on suspicious account activities**: Use Azure AD security reports and Microsoft Defender for Cloud to monitor identity and access activity. Set up alerts for suspicious or unsafe activity and integrate with Microsoft Sentinel for advanced threat detection. See [How to identify Azure AD users flagged for risky activity](/azure/active-directory/identity-protection/overview-identity-protection).

## Privileged access  

Privileged access controls for Azure Web Application Firewall focus on limiting and monitoring administrative access to your WAF resources. These measures help prevent unauthorized changes to your security configurations and ensure that privileged operations are properly tracked and audited.

* **Use Azure RBAC to control resource access**: Control access to your Azure WAF resources using Azure role-based access control. Apply the principle of least privilege by assigning only the minimum necessary permissions to users and services. See [How to configure Azure RBAC in Azure](/azure/role-based-access-control/role-assignments-portal).

* **Use Privileged Access Workstations for administrative tasks**: Use dedicated, hardened workstations with multifactor authentication configured for logging into and configuring Azure WAF and related resources. This reduces the risk of administrative compromise through standard user workstations. See [Learn about Privileged Access Workstations](/security/compass/overview).

* **Regularly review and reconcile user access**: Use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments for WAF resources. Review user access regularly to ensure only active users have continued access. See [How to use Azure Identity Access Reviews](/azure/active-directory/governance/access-reviews-overview).

* **Monitor access to deactivated credentials**: Integrate Azure AD Sign-in Activity, Audit, and Risk Event log sources with Microsoft Sentinel or other SIEM tools. Create Diagnostic Settings for Azure AD user accounts and send audit and sign-in logs to a Log Analytics workspace for monitoring. See [How to integrate Azure Activity Logs into Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics).

* **Configure automated responses to suspicious activities**: Use Azure AD's Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. Ingest data into Microsoft Sentinel for further investigation and response. See [How to configure and enable Identity Protection risk policies](/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies).

## Logging and threat detection

Comprehensive logging and threat detection are essential for maintaining visibility into your Web Application Firewall's security posture. These capabilities help you detect threats, investigate incidents, and maintain compliance by collecting and analyzing security events across your WAF deployment.

* **Enable centralized log management with Microsoft Sentinel**: Configure Azure WAF logs to be sent to Microsoft Sentinel or a third-party SIEM. This includes Azure Activity, Diagnostic, and real-time WAF logs that provide insight into what data your WAF is evaluating, matching, and blocking. See [Connect data from Microsoft web application firewall to Microsoft Sentinel](/azure/sentinel/connect-azure-waf).

* **Enable comprehensive audit logging**: Turn on logging for your Azure WAF resources to capture audit, security, and diagnostic logs. Azure WAF provides detailed reporting on each detected threat through configured diagnostic logs, including event source, date, user, timestamp, and addresses. See [Logging overview](/azure/web-application-firewall/ag/ag-overview#logging).

* **Configure log storage retention policies**: Send Azure WAF logs to a custom storage account and define retention policies based on your organization's compliance requirements. Use Azure Monitor to set your Log Analytics workspace retention period appropriately. See [Configure monitoring for a storage account](/azure/storage/common/manage-storage-analytics-logs#configure-logging).

* **Monitor and review logs regularly**: Review WAF logs that provide detailed reporting on each detected threat. Use Microsoft Defender for Cloud's recommendations to detect unprotected web applications and protect vulnerable resources. Leverage Microsoft Sentinel's built-in WAF workbook for security event overview. See [How to enable diagnostic settings for Azure Application Gateway](/azure/application-gateway/application-gateway-diagnostics).

* **Create alerts for anomalous activities**: Enable Azure Activity Log diagnostic settings and WAF diagnostic settings, sending logs to a Log Analytics workspace. Create alerts for anomalous activity based on WAF metrics, such as when blocked requests exceed defined thresholds. See [How to create alerts within Azure](/azure/azure-monitor/alerts/tutorial-response).

* **Use approved time synchronization sources**: Create network rules for Azure WAF to allow access to NTP servers with appropriate ports and protocols, such as port 123 over UDP, ensuring accurate timestamps in your logs and events.

* **Enable sensitive data protection with log scrubbing**: Configure log scrubbing rules to remove sensitive information like passwords, IP addresses, and personal data from your WAF logs. This protects customer data while maintaining security visibility. See [What is Azure Web Application Firewall Sensitive Data Protection?](./afds/waf-sensitive-data-protection-frontdoor.md) and [Azure Web Application Firewall Sensitive Data Protection](./ag/waf-sensitive-data-protection.md).

* **Configure diagnostic settings for comprehensive logging**: Enable diagnostic settings on your WAF resources to save logs to Log Analytics, Storage Account, or Event Hub. Regular log review helps tune your WAF policies and understand attack patterns against your applications. See [Azure Web Application Firewall monitoring and logging](./afds/waf-front-door-monitor.md).

## Data protection

Data protection for Azure Web Application Firewall involves securing sensitive information processed by your WAF, implementing proper encryption, and maintaining appropriate access controls. These measures help protect your applications and the data they handle from unauthorized access and disclosure.

* **Tag resources handling sensitive information**: Use tags to identify and track Azure WAF and related resources that store or process sensitive information. This helps with compliance reporting and ensures appropriate security controls are applied. See [How to create and use tags](/azure/azure-resource-manager/management/tag-resources).

* **Implement environment isolation**: Use separate subscriptions and management groups for different security domains such as development, test, and production environments. This prevents cross-environment data exposure and allows for environment-specific security controls. See [How to create additional Azure subscriptions](/azure/cost-management-billing/manage/create-subscription).

* **Ensure encryption in transit**: Verify that clients connecting to your Azure WAF instances and related resources can negotiate TLS 1.2 or greater. Follow Microsoft Defender for Cloud recommendations for encryption at rest and in transit. See [Understand encryption in transit with Azure](/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit).

* **Use encryption at rest for WAF resources**: Apply encryption at rest for all Azure resources including Azure WAF and related resources. Microsoft recommends allowing Azure to manage encryption keys, but you can manage your own keys when specific requirements exist. See [Understand encryption at rest in Azure](/azure/security/fundamentals/encryption-atrest).

* **Monitor changes to critical resources**: Configure your Azure WAF to run in Prevention mode after establishing baselines, and use Azure Monitor to create alerts when changes occur to critical WAF resources or configurations. See [WAF modes on Application Gateway](/azure/web-application-firewall/ag/ag-overview#waf-modes).

* **Enable request body inspection**: Configure WAF policies to inspect HTTP request bodies, not just headers, cookies, and URIs. This allows the WAF to detect threats hidden in POST data and JSON payloads. See [Azure Web Application Firewall and Azure Policy](./shared/waf-azure-policy.md).

* **Use customer-managed keys for enhanced encryption**: Consider using customer-managed keys stored in Azure Key Vault for encryption requirements that exceed platform-managed keys. This provides additional control over encryption key lifecycle and access. See [How to configure customer-managed encryption keys](/azure/storage/common/customer-managed-keys-configure-key-vault).

## Asset management

Effective asset management helps you maintain visibility and control over your Web Application Firewall resources. This includes automated discovery, proper tagging, regular inventory reconciliation, and policy enforcement to ensure your WAF deployment remains secure and compliant.

* **Use automated asset discovery**: Use Azure Resource Graph to query and discover all WAF-related resources including compute, storage, network, ports, and protocols within your subscriptions. Ensure you have appropriate read permissions and can enumerate all Azure subscriptions and resources. See [How to create queries with Azure Resource Graph](/azure/governance/resource-graph/first-query-portal).

* **Maintain asset metadata with tags**: Apply tags to Azure WAF policies and related resources to logically organize access and management. Tags can be associated with resources and applied to organize access to these resources within your subscription. See [How to create and use Tags](/azure/azure-resource-manager/management/tag-resources).

* **Organize and track resources systematically**: Use tagging, management groups, and separate subscriptions to organize and track Azure WAF and related resources. Reconcile inventory regularly and ensure unauthorized resources are deleted from subscriptions in a timely manner. See [How to create Management Groups](/azure/governance/management-groups/create-management-group-portal).

* **Define and maintain approved resource inventory**: Create an inventory of approved resources including their configurations based on organizational needs. Use Azure Policy to restrict the types of resources that can be created in your subscriptions and ensure all present resources are approved. See [How to configure and manage Azure Policy](/azure/governance/policy/tutorials/create-and-manage).

* **Monitor for unapproved resources**: Use Azure Policy to put restrictions on resource types and monitor for unapproved Azure WAF resources within your subscriptions. Use Azure Resource Graph to query and discover resources, ensuring that all Azure WAF and related resources in your environment are approved. See [How to create queries with Azure Graph](/azure/governance/resource-graph/first-query-portal).

* **Limit Azure Resource Manager access**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" app. This helps prevent unauthorized changes to your WAF resources. See [How to configure Conditional Access to block access to Azure Resources Manager](/azure/role-based-access-control/conditional-access-azure-management).

## Policy compliance and governance

Policy compliance and governance ensure that your Web Application Firewall deployments meet organizational standards and regulatory requirements. These controls help maintain consistent security configurations across your environment and provide automated compliance monitoring and enforcement.

* **Use Azure Policy to enforce WAF deployment**: Implement Azure Policy definitions to require WAF deployment on Azure Front Door and Application Gateway resources. Configure policies to audit, deny, or automatically remediate non-compliant resources. See [Azure Web Application Firewall and Azure Policy](./shared/waf-azure-policy.md).

* **Mandate WAF mode compliance**: Use Azure Policy to enforce that all WAF policies operate in Prevention mode after initial tuning. This ensures consistent protection across your environment and prevents accidental deployment of WAFs in Detection-only mode. See [Azure Web Application Firewall and Azure Policy](./shared/waf-azure-policy.md).

* **Require resource logging compliance**: Implement policies that mandate enabling of resource logs and metrics on all WAF-enabled services. This ensures consistent logging for security monitoring and compliance requirements across your organization. See [Azure Web Application Firewall and Azure Policy](./shared/waf-azure-policy.md).

* **Enforce Premium tier usage for enhanced security**: Use Azure Policy to require Azure Front Door Premium tier for all profiles, ensuring access to advanced WAF features like managed rule sets, bot protection, and private link capabilities. See [Azure Web Application Firewall and Azure Policy](./shared/waf-azure-policy.md).

* **Define WAF configuration as code**: Implement infrastructure as code practices using ARM templates, Bicep, or Terraform to maintain consistent WAF configurations across environments. This approach simplifies rule exclusion management and reduces configuration drift. See [Best practices for Azure Web Application Firewall in Azure Front Door](./afds/waf-front-door-best-practices.md).

* **Implement automated compliance monitoring**: Use Microsoft Defender for Cloud and Azure Policy to continuously monitor WAF compliance and receive recommendations for unprotected web applications. Configure automated alerts for policy violations and compliance drift. See [Azure Web Application Firewall and Azure Policy](./shared/waf-azure-policy.md).

## Related content

- [Security baseline](/security/benchmark/azure/baselines/web-application-firewall-security-baseline?toc=/azure/web-application-firewall/toc.json)
- [Azure Well-Architected Framework: Security pillar](/azure/well-architected/security/)
- [Cloud Adoption Framework: Secure overview](/azure/cloud-adoption-framework/secure/overview)
