---
title: Azure security baseline for Azure Web Application Firewall
description: The Azure Web Application Firewall security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: web-application-firewall
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Web Application Firewall

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview) to Azure Web Application Firewall. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Web Application Firewall. **Controls** not applicable to Azure Web Application Firewall have been excluded. To see how Azure Web Application Firewall completely maps to the Azure Security Benchmark, see the [full Azure Web Application Firewall security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see the [Azure Security Benchmark: Network security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22639).

**Guidance**: Use Microsoft Azure Web Application Firewall (WAF) for centralized protection of web applications from common exploits and vulnerabilities such as SQL injection and cross-site scripting. 

- Detection mode: Use this mode for learning the network traffic, understand and review false positives. It monitors and logs all threat alerts. Make sure that Diagnostics and WAF log are selected and turned on. Note that the WAF does not block incoming requests when it's operating in Detection mode.
- Prevention mode: Blocks intrusions and attacks detected by the rules. An attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

Baseline your network traffic with the WAF's Detection mode. After determining your traffic needs, configure the WAF in Prevention mode to bock unwanted traffic.

Follow up on high severity recommendations from Security Center for any web-enabled resources which are not protected by WAF.  

- [Web Application Firewall CRS rule groups and rules](https://docs.microsoft.com/azure/web-application-firewall/ag/application-gateway-crs-rulegroups-rules) 

- [WAF modes on Application Gateway](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview#waf-modes)

- [WAF modes on Front Door](https://docs.microsoft.com/azure/web-application-firewall/afds/afds-overview#waf-modes)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny communications with known-malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22640).

**Guidance**: Use custom rules with the Azure Web Application Firewall (WAF) to allow and block traffic. For example, all traffic coming from a range of IP addresses can be blocked. 
Configure Azure WAF to run in Prevention mode which blocks intrusions and attacks detected by the rules. An attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

- [WAF modes on Application Gateway](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview#waf-modes)

- [WAF modes on Front Door](https://docs.microsoft.com/azure/web-application-firewall/afds/afds-overview#waf-modes)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.5: Record network packets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22641).

**Guidance**: Use Azure Sentinel for intelligent security analytics and threat intelligence across the enterprise, with alert detection, threat visibility, proactive hunting, and threat response.
Implement the built-in Web Application Firewall's (WAF) - firewall events workbook, to get an overview of the security events on your WAF. This includes events, matched and blocked rules, and everything else that gets logged in the firewall logs.

- [Azure Sentinel](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview#azure-sentinel)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22643).

**Guidance**: Azure Web Application Firewall (WAF) is core component of Azure's web application protections. Use Azure WAF to provide centralized protection for web applications from common exploits and vulnerabilities with pre-configured managed ruleset against known attack signatures from OWASP TOP 10 categories.

Customize Azure WAF with rules and rule groups to suit web application requirements and eliminate false positives. Associate an Azure WAF Policy for each site behind a WAF to allow for site-specific configuration. Azure WAF supports Geo-filtering, Rate-limiting, Azure-managed Default Rule Set rules. and custom rules can be created to suit the needs of an application. 

Configure the Azure WAF to run in Prevention mode after baselining the network traffic in Detection mode for a determined period of time. The Azure WAF blocks intrusions and attacks detected by the rules in Prevention mode. An attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

- [WAF modes on Application Gateway](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview#waf-modes)

- [WAF modes on Front Door](https://docs.microsoft.com/azure/web-application-firewall/afds/afds-overview#waf-modes)

- [Web Application firewall CRS rule groups and rules](https://docs.microsoft.com/azure/web-application-firewall/ag/application-gateway-crs-rulegroups-rules?tabs=owasp31)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22644).

**Guidance**: Create, associate and logically organize resources across an Azure subscription with tags for detection of common application misconfigurations (for example, Apache and IIS). 

Apply rules and rule groups to Azure Web Application Firewall (WAF) policies based on the applied tag metadata.

- [WAF policy on Application Gateway](https://docs.microsoft.com/cli/azure/network/application-gateway/waf-policy?view=azure-cli-latest) 

- [WAF policy on Front Door](https://docs.microsoft.com/cli/azure/ext/front-door/network/front-door/waf-policy?view=azure-cli-latest)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22646).

**Guidance**: Use tags for network security groups associated with the Azure Web Application Firewall (WAF) in your Azure Application Gateway subnet as well as any other resources related to network security and traffic flow. For individual network security group rules, use the "Description" field to specify business need, duration, and so on, for any rules that allow traffic to or from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

Choose Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

- [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

- [How to create an NSG with a Security Config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22647).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network settings and resources related to your Azure Web Application Firewall (WAF) deployments. Create alerts within Azure Monitor that will trigger when changes to critical network settings or resources take place.

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see the [Azure Security Benchmark: Logging and monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22648).

**Guidance**: Create a network rule for Azure Web Application Firewall (WAF) to allow access to an NTP server with the appropriate port and protocol, such as port 123 over UDP.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22649).

**Guidance**: Send Azure Web Application Firewall (WAF) logs to a central security log management solution such as Azure Sentinel, or a third-party SIEM such as Barracuda. The logs include Activity, Diagnostic, and real-time WAF logs and can be extracted from Azure Blob storage and viewed in different tools, such as Azure Monitor logs, Excel, and Power BI.
Configure logging diagnostics by choosing the Diagnostic section on Azure portal for Azure WAF offerings. Logs are additionally captured for WAF operating modes,  Diagnostic and Prevention. Firewall logs give insight to what data the Azure WAF is evaluating, matching, and blocking. 

Azure Sentinel has a built-in Azure WAF - firewall events workbook, which provides an overview of the security events on the Azure WAF. This includes events, matched and blocked rules, and everything else that gets logged in the firewall logs.

- [View Activity Logs](https://docs.microsoft.com/azure/azure-resource-manager/management/view-activity-logs)

- [Diagnostic logs for Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)

- [Connect data from Microsoft web application firewall to Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-microsoft-waf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22650).

**Guidance**: Azure Web Application Firewall (WAF) provides detailed reporting on each detected threat. Logging is integrated with Azure Diagnostics logs which provide rich information about operations and errors that are important for auditing and troubleshooting. Alerts are recorded in the JSON (JavaScript Object Notation) format. These logs can be integrated with Azure Monitor logs.

Examine the data inside the firewall logs with Azure Monitor Log Analytics to for more insights. Audit logs are available for Azure WAF in the form of Activity logs which provide insights into the operations done on Azure resources. 

- [Logging overview](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview#logging)

- [Azure Monitor log query overview](https://docs.microsoft.com/azure/azure-monitor/log-query/log-query-overview)

- [Overview of Azure Platform logs](https://docs.microsoft.com/azure/azure-monitor/platform/platform-logs-overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22652).

**Guidance**: Send the Azure Web Application Firewall (WAF) logs to a custom storage account and define the retention policy. Use Azure Monitor to set your Log Analytics workspace retention period based on your organization's compliance requirements.
- [Configure monitoring for a storage account](https://docs.microsoft.com/azure/storage/common/storage-monitor-storage-account#configure-logging)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22653).

**Guidance**: Azure Web Application Firewall (WAF) provides detailed reporting on each detected threat. Logging is integrated with Azure Diagnostics logs which provide rich information about operations and errors that are important for auditing and troubleshooting. 

Azure WAF instances are integrated with Security Center to send alerts and health information for reporting. Use Security Center's recommendations to detect unprotected web applications and protect these vulnerable resources. 

Azure Sentinel has a built-in WAF - firewall events workbook, which provides an overview of the security events on the WAF. These include events, matched and blocked rules, and everything else that gets logged in the firewall logs.

- [How to enable diagnostic settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor) 

- [How to enable diagnostic settings for Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)

- [Monitoring metrics and logs in Azure Front Door](https://docs.microsoft.com/azure/frontdoor/front-door-diagnostics)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22654).

**Guidance**: Enable Azure Activity Log diagnostic settings, as well as the diagnostic settings for your Azure WAF, and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data. Create alerts for anomalous activity based on WAF metrics. For example, if blocked number of requests exceeding 'X,' do 'Y'.

- [How to enable diagnostic settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

- [How to create alerts within Azure](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22655).

**Guidance**: Deploy Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. 

Azure WAF provides centralized protection of your web applications from common exploits and vulnerabilities and secures your apps by inspecting inbound web traffic to block attacks such as SQL injections, Cross-Site Scripting, malware uploads, and DDoS attacks.

- [How to deploy Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Identity and access control

*For more information, see the [Azure Security Benchmark: Identity and access control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22658).

**Guidance**: Azure Active Directory (Azure AD) has built-in roles are query-able and must be explicitly assigned. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22660).

**Guidance**: There are no local administrator assignments available within the WAF. However, there could be Azure Active Directory (Azure AD) administrator roles in the environment which could allow for management control over the Azure WAF resources.
It is a good practice to create standard operating procedures around the use of dedicated administrative accounts that have access to Azure Web Application Firewall (WAF) instances. Use Security Center's Identity and Access Management features to monitor the number of administrative accounts.

- [Understand Azure Security Center Identity and Access](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

- [Understand how to create admin users in Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/howto-create-users#the-server-admin-account)

- [How to use Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22662).

**Guidance**: Enable Azure Active Directory (Azure AD) Multi-Factor Authentication (MFA) and follow Security Center's Identity and Access Management recommendations.

- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

- [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22663).

**Guidance**: Use Privileged Access Workstation (PAW) with Multi-Factor Authentication (MFA) configured to log into and configure Azure Web Application Firewall (WAF) and related resources. 

- [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations) 

- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22664).

**Guidance**: Use Azure Active Directory (Azure AD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk)

- [How to monitor users' identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22665).

**Guidance**: Configure the location condition of a Conditional Access policy and manage your named locations. 

Create logical groupings of IP address ranges or countries and regions with named locations. Restrict access to your sensitive resources, such as Azure Key Vault secrets, to your configured named locations.

- [What is the location condition in Azure Active Directory Conditional Access](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22666).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit and also salts, hashes, and securely stores user credentials.
- [How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)	

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22667).

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. Use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. Review user access on a regular basis to ensure only active users have continued access.

- [Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring)

- [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22668).

**Guidance**: Integrate Azure Active Directory (Azure AD) Sign-in Activity, Audit and Risk Event log sources, with any SIEM or monitoring tool such as Azure Sentinel.

Streamline this process by creating Diagnostic Settings for Azure Active Directory (Azure AD) user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. Configure desired Alerts within the Log Analytics workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account sign-in behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22669).

**Guidance**: Use Azure Active Directory's (Azure AD) Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. Ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data protection

*For more information, see the [Azure Security Benchmark: Data protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22671).

**Guidance**: Use tags to assist in tracking Azure Web Application Firewall (WAF) and related resources that store or process sensitive information.
- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22672).

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level, for example, development, test and production environments. 

Control access to Azure resources with Azure Active Directory (Azure AD) role-based access control (Azure RBAC).

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22674).

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure Web Application Firewall (WAF) instances and related resources are able to negotiate TLS 1.2 or greater.

Follow Security Center recommendations for encryption at rest and encryption in transit where applicable.

- [Understand encryption in transit with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.6: Use Role-based access control to control access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22676).

**Guidance**: Control access to Azure resources with Azure Active Directory (Azure AD) role-based access control (Azure RBAC).
- [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22678).

**Guidance**: Use encryption at rest for all Azure resources including Azure Web Application Firewall (WAF) and related resources. Microsoft recommends allowing Azure to manage your encryption keys, however there is the option for you to manage your own keys in some instances.

- [Understand encryption at rest in Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest)

- [How to configure customer managed encryption keys](https://docs.microsoft.com/azure/storage/common/storage-encryption-keys-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22679).

**Guidance**: 
Configure Azure Web Application Firewall (WAF) to run in Prevention mode after baselining the network traffic in Detection mode for a pre-determined amount of time. 

The Azure WAF, in Prevention mode, blocks intrusions and attacks that are detected by the rules. The attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

- [Overview of integration between Application Gateway and Azure Security Center](https://docs.microsoft.com/azure/application-gateway/application-gateway-integration-security-center#overview)

- [WAF modes on Application Gateway](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview#waf-modes)

- [WAF modes on Front Door](https://docs.microsoft.com/azure/web-application-firewall/afds/afds-overview#waf-modes)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Inventory and asset management

*For more information, see the [Azure Security Benchmark: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22685).

**Guidance**: Use Azure Resource Graph to query or discover all resources, such as, compute, storage, network, ports, and protocols and so on within your subscriptions. 

Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as the resources within your subscriptions. Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22686).

**Guidance**: Use tags on Azure Web Application Firewall (WAF) policies. Tags can be associated with resources and applied logically to organize access to these resources in a customer subscription. 

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22687).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure WAF and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and maintain inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22688).

**Guidance**: It is recommended to create an inventory of approved Azure WAF resources including configuration based on organizational needs.

Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions. Use Azure Resource Graph to query for and discover resources within their subscriptions. Ensure all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22689).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions.
Use Azure Resource Graph to query or discover Azure Web Application Firewall (WAF)  resources within their subscriptions. Ensure that all Azure WAF and related resources present in the environment are approved.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22691).

**Guidance**: Monitor and remove unapproved Azure WAF resources with Azure Policy to deny the deployment of Azure WAF, or a certain type of WAF, for example, Azure WAF v1 vs V2.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22693).

**Guidance**: Use Azure Policy to restrict which services you can provision in your environment.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22695).

**Guidance**: Use Azure Conditional Access to limit a user's ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resources Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22697).

**Guidance**: Azure Web Application Firewall (WAF) can be associated with different environments via networks, Resource Groups or subscriptions to segregate high risk applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see the [Azure Security Benchmark: Secure configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22698).

**Guidance**: Define and implement standard security configurations for network settings related to your Azure Web Application Firewall (WAF) deployments.
Use Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to audit or enforce the network configuration of your Azure Application Gateways, Virtual Networks, network security groups and use built-in policy definitions.

- [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22700).

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] effects to enforce secure settings across your Azure Web Application Firewall (WAF) and related resources. 

Use Azure Resource Manager templates to maintain the security configuration of your Azure WAF and related resources required by your organization.

- [Understand Azure Policy effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

- [Create and manage policies to enforce compliance](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Resource Manager templates overview](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22702).

**Guidance**: Use Azure DevOps to securely store and manage your code, such as custom Azure policies and Azure Resource Manager templates. 

Grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD), if integrated with Azure DevOps, or Active Directory, if integrated with Team Foundation Server (TFS).

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [About permissions and groups in Azure DevOps](https://docs.microsoft.com/azure/devops/organizations/security/about-permissions)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22704).

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to alert, audit, and enforce system configurations. Develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Policy documentation](https://docs.microsoft.com/azure/governance/policy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22706).

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to alert, audit, and enforce system configurations. 

Use Azure Policy [audit], [deny], and [deploy if not exist] effects to automatically enforce configurations for your Azure resources.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Policy documentation](https://docs.microsoft.com/azure/governance/policy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22708).

**Guidance**: Use Azure Key Vault to securely store certificates. Azure Key Vault is a platform-managed secret store that you can use to safeguard secrets, keys, and SSL certificates. 

Azure Application Gateway supports integration with Key Vault for server certificates that are attached to HTTPS-enabled listeners. 

- [How to configure SSL termination with Key Vault certificates by using Azure PowerShell](https://docs.microsoft.com/azure/application-gateway/configure-keyvault-ps)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22710).

**Guidance**: Implement Credential Scanner to identify credentials within code which will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.
- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data recovery

*For more information, see the [Azure Security Benchmark: Data recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.4: Ensure protection of backups and customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22717).

**Guidance**: Ensure that soft delete is enabled for Azure Key Vault. Soft delete allows recovery of deleted key vaults and vault objects such as keys, secrets, and certificates.

- [How to use Azure Key Vault's Soft Delete](https://docs.microsoft.com/azure/key-vault/key-vault-soft-delete-powershell)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident response

*For more information, see the [Azure Security Benchmark: Incident response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22718).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling or management from detection till post-incident review.

- [How to configure Workflow Automations within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process)

- [Customer may also use NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22719).

**Guidance**: Security Center assigns a severity to each alert to help prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.
Clearly mark subscriptions (for example, production, non-production) and create a naming system to clearly identify and categorize Azure resources.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22724).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.
- [Refer to NIST's publication Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22720).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.
- [How to set the Azure Security Center Security Contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22721).

**Guidance**: Export your Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. Use the Azure Security Center data connector to stream the alerts to Azure Sentinel as per your organization's requirements.

- [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

- [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22722).

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.
- [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see the [Azure Security Benchmark: Penetration tests and red team exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22723).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies: https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1
- [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
