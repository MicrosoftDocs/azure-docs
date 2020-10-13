---
title: Azure security baseline for Azure Web Application Firewall
description: The Azure Web Application Firewall security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: web-application-firewall
ms.topic: conceptual
ms.date: 10/13/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Web Application Firewall

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview-v1.md) to Azure Web Application Firewall. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Web Application Firewall. **Controls** not applicable to Azure Web Application Firewall have been excluded. 

To see how Azure Web Application Firewall completely maps to the Azure Security Benchmark, see the [full Azure Web Application Firewall security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network security

*For more information, see the [Azure Security Benchmark: Network security](../security/benchmarks/security-control-network-security.md).*

### 1.3: Protect critical web applications

**Guidance**: Use Microsoft Azure Web Application Firewall (WAF) for centralized protection of web applications from common exploits and vulnerabilities such as SQL injection and cross-site scripting. 

- Detection mode: Use this mode for learning the network traffic, understand and review false positives. It monitors and logs all threat alerts. Make sure that Diagnostics and WAF log are selected and turned on. Note that the WAF does not block incoming requests when it's operating in Detection mode.
- Prevention mode: Blocks intrusions and attacks detected by the rules. An attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

Baseline your network traffic with the WAF's Detection mode. After determining your traffic needs, configure the WAF in Prevention mode to bock unwanted traffic.

Follow up on high severity recommendations from Security Center for any web-enabled resources which are not protected by WAF.  

- [Web Application Firewall CRS rule groups and rules](ag/application-gateway-crs-rulegroups-rules.md) 

- [WAF modes on Application Gateway](ag/ag-overview.md#waf-modes)

- [WAF modes on Front Door](afds/afds-overview.md#waf-modes)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Use custom rules with the Azure Web Application Firewall (WAF) to allow and block traffic. For example, all traffic coming from a range of IP addresses can be blocked. 
Configure Azure WAF to run in Prevention mode which blocks intrusions and attacks detected by the rules. An attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

- [WAF modes on Application Gateway](ag/ag-overview.md#waf-modes)

- [WAF modes on Front Door](afds/afds-overview.md#waf-modes)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Azure Web Application Firewall (WAF) is core component of Azure's web application protections. Use Azure WAF to provide centralized protection for web applications from common exploits and vulnerabilities with pre-configured managed ruleset against known attack signatures from OWASP TOP 10 categories.

Customize Azure WAF with rules and rule groups to suit web application requirements and eliminate false positives. Associate an Azure WAF Policy for each site behind a WAF to allow for site-specific configuration. Azure WAF supports Geo-filtering, Rate-limiting, Azure-managed Default Rule Set rules. and custom rules can be created to suit the needs of an application. 

Configure the Azure WAF to run in Prevention mode after baselining the network traffic in Detection mode for a determined period of time. The Azure WAF blocks intrusions and attacks detected by the rules in Prevention mode. An attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

- [WAF modes on Application Gateway](ag/ag-overview.md#waf-modes)

- [WAF modes on Front Door](afds/afds-overview.md#waf-modes)

- [Web Application firewall CRS rule groups and rules](ag/application-gateway-crs-rulegroups-rules.md?tabs=owasp31)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Create, associate and logically organize resources across an Azure subscription with tags for detection of common application misconfigurations (for example, Apache and IIS). 

Apply rules and rule groups to Azure Web Application Firewall (WAF) policies based on the applied tag metadata.

- [WAF policy on Application Gateway](https://docs.microsoft.com/cli/azure/network/application-gateway/waf-policy?view=azure-cli-latest) 

- [WAF policy on Front Door](https://docs.microsoft.com/cli/azure/ext/front-door/network/front-door/waf-policy?view=azure-cli-latest)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network security groups associated with the Azure Web Application Firewall (WAF) in your Azure Application Gateway subnet as well as any other resources related to network security and traffic flow. For individual network security group rules, use the "Description" field to specify business need, duration, and so on, for any rules that allow traffic to or from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

Choose Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

- [How to create a Virtual Network](../virtual-network/quick-create-portal.md)

- [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network settings and resources related to your Azure Web Application Firewall (WAF) deployments. Create alerts within Azure Monitor that will trigger when changes to critical network settings or resources take place.

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](../azure-monitor/platform/alerts-activity-log.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see the [Azure Security Benchmark: Logging and monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

**Guidance**: Create a network rule for Azure Web Application Firewall (WAF) to allow access to an NTP server with the appropriate port and protocol, such as port 123 over UDP.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 2.2: Configure central security log management

**Guidance**: Configure Azure Web Application Firewall (WAF) logs to be sent to a central security log management solution such as Azure Sentinel, or a third-party SIEM. These logs include Azure Activity, Diagnostic, and real-time WAF logs, these logs can then be viewed in different tools, such as Azure Monitor, Excel, and Power BI. Azure Web Application Firewall logs give insight to what data the Azure WAF is evaluating, matching, and blocking.

Azure Sentinel has a built-in Azure WAF workbook, which provides an overview of the security events on the Azure WAF. This workbook includes events, matched and blocked rules, and everything else that gets logged in the firewall logs. This telemetry can be used to kick off playbook automation to notify or take remediation actions based on WAF events collected by Sentinel.

- [View Activity Logs](../azure-resource-manager/management/view-activity-logs.md)

- [Diagnostic logs for Application Gateway](../application-gateway/application-gateway-diagnostics.md)

- [Connect data from Microsoft web application firewall to Azure Sentinel](/azure/sentinel/connect-microsoft-waf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable logging on your Azure Web Application Firewall (WAF) resources for access to audit, security, and diagnostic logs. Azure Web Application Firewall provides detailed reporting on each of its detected threats which are made available in the configured diagnostic logs. Activity logs, which are automatically available, include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements.

- [Logging overview](ag/ag-overview.md#logging)

- [Azure Monitor log query overview](../azure-monitor/log-query/log-query-overview.md)

- [Overview of Azure Platform logs](../azure-monitor/platform/platform-logs-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.5: Configure security log storage retention

**Guidance**: Send the Azure Web Application Firewall (WAF) logs to a custom storage account and define the retention policy. Use Azure Monitor to set your Log Analytics workspace retention period based on your organization's compliance requirements.
- [Configure monitoring for a storage account](../storage/common/storage-monitor-storage-account.md#configure-logging)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review logs

**Guidance**: Azure Web Application Firewall (WAF) provides detailed reporting on each detected threat. Logging is integrated with Azure Diagnostics logs which provide rich information about operations and errors that are important for auditing and troubleshooting. 

Azure WAF instances are integrated with Security Center to send alerts and health information for reporting. Use Security Center's recommendations to detect unprotected web applications and protect these vulnerable resources. 

Azure Sentinel has a built-in WAF - firewall events workbook, which provides an overview of the security events on the WAF. These include events, matched and blocked rules, and everything else that gets logged in the firewall logs.

- [How to enable diagnostic settings for Azure Activity Log](/azure/azure-monitor) 

- [How to enable diagnostic settings for Azure Application Gateway](../application-gateway/application-gateway-diagnostics.md)

- [Monitoring metrics and logs in Azure Front Door](../frontdoor/front-door-diagnostics.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: Enable Azure Activity Log diagnostic settings, as well as the diagnostic settings for your Azure WAF, and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data. Create alerts for anomalous activity based on WAF metrics. For example, if blocked number of requests exceeding 'X,' do 'Y'.

- [How to enable diagnostic settings for Azure Activity Log](/azure/azure-monitor/platform/diagnostic-settings-legacy)

- [How to create alerts within Azure](/azure/azure-monitor/learn/tutorial-response)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Deploy Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. 

Azure WAF provides centralized protection of your web applications from common exploits and vulnerabilities and secures your apps by inspecting inbound web traffic to block attacks such as SQL injections, Cross-Site Scripting, malware uploads, and DDoS attacks.

- [How to deploy Azure WAF](ag/create-waf-policy-ag.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Identity and access control

*For more information, see the [Azure Security Benchmark: Identity and access control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (Azure AD) has built-in roles are query-able and must be explicitly assigned. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: There are no local administrator assignments available within the WAF. However, there could be Azure Active Directory (Azure AD) administrator roles in the environment which could allow for management control over the Azure WAF resources.
It is a good practice to create standard operating procedures around the use of dedicated administrative accounts that have access to Azure Web Application Firewall (WAF) instances. Use Security Center's Identity and Access Management features to monitor the number of administrative accounts.

- [Understand Azure Security Center Identity and Access](../security-center/security-center-identity-access.md)

- [Understand how to create admin users in Azure Database for PostgreSQL](../postgresql/howto-create-users.md#the-server-admin-account)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) Multi-Factor Authentication (MFA) and follow Security Center's Identity and Access Management recommendations.

- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use Privileged Access Workstation (PAW) with Multi-Factor Authentication (MFA) configured to log into and configure Azure Web Application Firewall (WAF) and related resources. 

- [Learn about Privileged Access Workstations](/windows-server/identity/securing-privileged-access/privileged-access-workstations) 

- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](/azure/active-directory/reports-monitoring/concept-user-at-risk)

- [How to monitor users' identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Configure the location condition of a Conditional Access policy and manage your named locations. 

Create logical groupings of IP address ranges or countries and regions with named locations. Restrict access to your sensitive resources, such as Azure Key Vault secrets, to your configured named locations.

- [What is the location condition in Azure Active Directory Conditional Access](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit and also salts, hashes, and securely stores user credentials.
- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)	

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. Use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. Review user access on a regular basis to ensure only active users have continued access.

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Integrate Azure Active Directory (Azure AD) Sign-in Activity, Audit and Risk Event log sources, with any SIEM or monitoring tool such as Azure Sentinel.

Streamline this process by creating Diagnostic Settings for Azure Active Directory (Azure AD) user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. Configure desired Alerts within the Log Analytics workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory's (Azure AD) Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. Ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data protection

*For more information, see the [Azure Security Benchmark: Data protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure Web Application Firewall (WAF) and related resources that store or process sensitive information.
- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level, for example, development, test and production environments. 

Control access to Azure resources with Azure Active Directory (Azure AD) role-based access control (Azure RBAC).

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create Management Groups](/azure/governance/management-groups/create)

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure Web Application Firewall (WAF) instances and related resources are able to negotiate TLS 1.2 or greater.

Follow Security Center recommendations for encryption at rest and encryption in transit where applicable.

- [Understand encryption in transit with Azure](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Control access to Azure resources with Azure Active Directory (Azure AD) role-based access control (Azure RBAC).
- [How to configure RBAC in Azure](../role-based-access-control/role-assignments-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.8: Encrypt sensitive information at rest

**Guidance**: Use encryption at rest for all Azure resources including Azure Web Application Firewall (WAF) and related resources. Microsoft recommends allowing Azure to manage your encryption keys, however there is the option for you to manage your own keys in some instances.

- [Understand encryption at rest in Azure](../security/fundamentals/encryption-atrest.md)

- [How to configure customer managed encryption keys](/azure/storage/common/storage-encryption-keys-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: 
Configure Azure Web Application Firewall (WAF) to run in Prevention mode after baselining the network traffic in Detection mode for a pre-determined amount of time. 

The Azure WAF, in Prevention mode, blocks intrusions and attacks that are detected by the rules. The attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

- [Overview of integration between Application Gateway and Azure Security Center](../application-gateway/application-gateway-integration-security-center.md#overview)

- [WAF modes on Application Gateway](ag/ag-overview.md#waf-modes)

- [WAF modes on Front Door](afds/afds-overview.md#waf-modes)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Inventory and asset management

*For more information, see the [Azure Security Benchmark: Inventory and asset management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query or discover all resources, such as, compute, storage, network, ports, and protocols and so on within your subscriptions. 

Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as the resources within your subscriptions. Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Use tags on Azure Web Application Firewall (WAF) policies. Tags can be associated with resources and applied logically to organize access to these resources in a customer subscription. 

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure WAF and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create Management Groups](/azure/governance/management-groups/create)

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Create an inventory of approved resources including configuration based on organizational needs.

Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions. Use Azure Resource Graph to query for and discover resources within their subscriptions. Ensure all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions.
Use Azure Resource Graph to query or discover Azure Web Application Firewall (WAF)  resources within their subscriptions. Ensure that all Azure WAF and related resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Monitor and remove unapproved Azure WAF resources with Azure Policy to deny the deployment of Azure WAF, or a certain type of WAF, for example, Azure WAF v1 vs V2.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to restrict which services you can provision in your environment.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit a user's ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resources Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Azure Web Application Firewall (WAF) can be associated with different environments via networks, resource groups or subscriptions to segregate high risk applications.

- [Azure Virtual Network Overview](../virtual-network/virtual-networks-overview.md)

- [Organize your resources with Azure management groups](../governance/management-groups/overview.md)

- [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see the [Azure Security Benchmark: Secure configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for network settings related to your Azure Web Application Firewall (WAF) deployments.
Use Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to audit or enforce the network configuration of your Azure Application Gateways, Virtual Networks, network security groups and use built-in policy definitions.

- [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] effects to enforce secure settings across your Azure Web Application Firewall (WAF) and related resources. 

Use Azure Resource Manager templates to maintain the security configuration of your Azure WAF and related resources required by your organization.

- [Understand Azure Policy effects](../governance/policy/concepts/effects.md)

- [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Azure Resource Manager templates overview](../azure-resource-manager/templates/overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.5: Securely store configuration of Azure resources

**Guidance**: Use Azure DevOps to securely store and manage your code, such as custom Azure policies and Azure Resource Manager templates. 

Grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD), if integrated with Azure DevOps, or Active Directory, if integrated with Team Foundation Server (TFS).

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to alert, audit, and enforce system configurations. Develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy documentation](/azure/governance/policy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to alert, audit, and enforce system configurations. 

Use Azure Policy [audit], [deny], and [deploy if not exist] effects to automatically enforce configurations for your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy documentation](/azure/governance/policy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

**Guidance**: Use Azure Key Vault to securely store certificates. Azure Key Vault is a platform-managed secret store that you can use to safeguard secrets, keys, and SSL certificates. 

Azure Application Gateway supports integration with Key Vault for server certificates that are attached to HTTPS-enabled listeners. 

- [How to configure SSL termination with Key Vault certificates by using Azure PowerShell](../application-gateway/configure-keyvault-ps.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code which will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.
- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data recovery

*For more information, see the [Azure Security Benchmark: Data recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Ensure that soft delete is enabled for Azure Key Vault. Soft delete allows recovery of deleted key vaults and vault objects such as keys, secrets, and certificates.

- [How to use Azure Key Vault's Soft Delete](/azure/key-vault/key-vault-soft-delete-powershell)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident response

*For more information, see the [Azure Security Benchmark: Incident response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Develop an incident response guide for your organization. Ensure there are written incident response plans that define all the roles of personnel as well as the phases of incident handling and management from detection to post-incident review. 

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/) 

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/) 

- [Use NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.
Clearly mark subscriptions (for example, production, non-production) and create a naming system to clearly identify and categorize Azure resources.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.
- [Refer to NIST's publication Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.
- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. Use the Azure Security Center data connector to stream the alerts to Azure Sentinel as per your organization's requirements.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.
- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see the [Azure Security Benchmark: Penetration tests and red team exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: 
Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
