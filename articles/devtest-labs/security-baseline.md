---
title: Azure Security Baseline for Azure DevTest Labs
description: Azure Security Baseline for Azure DevTest Labs
ms.topic: conceptual
ms.date: 07/23/2020
---

# Azure Security Baseline for Azure DevTest Labs

The Azure Security Baseline for Azure DevTest Labs contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources
**Guidance:** Microsoft maintains time sources for Azure resources. However, you can manage time synchronization settings for your compute resources.

See the following article to learn about configuring time synchronization for Azure compute resources: [Time sync for Windows VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/time-sync). 

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Microsoft

### 2.2: Configure central security log management
**Guidance:** Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Activity logs provide insight into the operations that were done on your Azure DevTest Labs instances at the management plane level. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) done at the management plane level for your DevTest Labs instances.

For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/platform/diagnostic-settings.md).

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 2.3: Enable audit logging for Azure resources
**Guidance:** Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Activity logs provide insight into the operations that were done on your Azure DevTest Labs instances at the management plane level. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) done at the management plane level for your DevTest Labs instances.

For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/platform/diagnostic-settings.md).

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 2.4: Collect security logs from operating systems
**Guidance:** Azure DevTest Labs virtual machines are created and owned by the customer. So, it’s the organization’s responsibility to monitor it. You can use Azure Security Center to monitor the compute OS. Data collected by Security Center from the operating system includes OS type and version, OS (Windows Event Logs), running processes, machine name, IP addresses, and logged in user. The Log Analytics Agent also collects crash dump files.

For more information, see the following articles: 

- [How to collect Azure Virtual Machine internal host logs with Azure Monitor](../azure-monitor/learn/quick-collect-azurevm.md)
- [Understand Azure Security Center data collection](../security-center/security-center-enable-data-collection.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 2.5: Configure security log storage retention
***Guidance:** In Azure Monitor, set log retention period for Log Analytics workspaces associated with your Azure DevTest Labs instances according to your organization's compliance regulations.

For more information, see the following article: [How to set log retention parameters](../azure-monitor/platform/manage-cost-storage.md#change-the-data-retention-period)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 2.6: Monitor and review Logs
**Guidance:** Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace. Run queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the activity log data that may have been collected for Azure DevTest Labs.

For more information, see the following articles:

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/platform/diagnostic-settings.md)
- [How to collect and analyze Azure activity logs in Log Analytics workspace in Azure Monitor](../azure-monitor/platform/activity-log.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 2.7: Enable alerts for anomalous activity
**Guidance:** Use Azure Log Analytics workspace for monitoring and alerting on anomalous activities in security logs and events related to your Azure DevTest Labs.

For more information, see the following article: [How to alert on log analytics log data](../azure-monitor/learn/tutorial-response.md)

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 2.8: Centralize anti-malware logging
**Guidance:** Not applicable. Azure DevTest Labs doesn't process or produce anti-malware related logs.

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 2.9: Enable DNS query logging
**Guidance:** Not applicable. Azure DevTest Labs doesn't process or produce DNS-related logs.

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 2.10: Enable command-line audit logging
**Guidance:** Azure DevTest Labs creates Azure Compute machines that are owned and managed by the customer. Use Microsoft Monitoring Agent on all supported Azure Windows virtual machines to log the process creation event and the `CommandLine` field. For supported Azure Linux Virtual machines, you can manually configure console logging on a per-node basis and use Syslog to store the data. Also, use Azure Monitor's Log Analytics workspace to review logs and run queries on logged data from Azure Virtual machines.

- [Data collection in Azure Security Center](../security-center/security-center-enable-data-collection.md#data-collection-tier)
- [How to run custom queries in Azure Monitor](../azure-monitor/log-query/get-started-queries.md)
- [Syslog data sources in Azure Monitor](../azure-monitor/platform/data-sources-syslog.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

## Identity and Access Control
*For more information, see [Security Control: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts
**Guidance:** Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)
- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)
- [Azure DevTest Labs roles](devtest-lab-add-devtest-user.md)  

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 3.2: Change default passwords where applicable
**Guidance:** Azure Active Directory (Azure AD) doesn't have the concept of default passwords. Other Azure resources requiring a password force a password to be created with complexity requirements and a minimum password length, which differ depending on the service. You're responsible for third-party applications and Marketplace services that may use default passwords.

DevTest Labs doesn't have the concept of default passwords. 

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 3.3: Use dedicated administrative accounts
**Guidance:** Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:

- There should be more than one owner assigned to your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription

- [How to use Azure Security Center to monitor identity and access (Preview)](../security-center/security-center-identity-access.md)  
- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)
- [Azure DevTest Labs roles](devtest-lab-add-devtest-user.md)  

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory
**Guidance:** DevTest Labs uses the Azure AD service for identity management. Consider these two key aspects when you give users access to an environment based on DevTest Labs:

- **Resource management:** It provides access to the Azure portal to manage resources (create virtual machines, create environments, start, stop, restart, delete, and apply artifacts, and so on). Resource management is done in Azure by using role-based access control (RBAC). You assign roles to users and set resource and access-level permissions.
- **Virtual machines (network-level)**: In the default configuration, virtual machines use a local admin account. If there's a domain available (Azure AD Domain Services, an on-premises domain, or a cloud-based domain), machines can be joined to the domain. Users can then use their domain-based identities using the domain join artifact to connect to the machines. 

- [Reference architecture for DevTest Labs](devtest-lab-reference-architecture.md#architecture)
- [Understand SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access
**Guidance:** Enable Azure Active Directory (AD) Multi-Factor Authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)  
- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Azure Security Center monitoring:*** Yes

**Responsibility:** Customer


### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks
**Guidance:** Use privileged access workstations (PAWs) with MFA configured to log into and configure Azure resources.

- [Learn about Privileged Access Workstations](/windows-server/identity/securing-privileged-access/privileged-access-workstations)  
- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)  

**Azure Security Center monitoring:** N/A

**Responsibility:** Customer

### 3.7: Log and alert on suspicious activity from administrative accounts
**Guidance:** Use Azure Active Directory (Azure AD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](../active-directory/reports-monitoring/concept-user-at-risk.md)  
- [How to monitor users' identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)  

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 3.8: Manage Azure resources from only approved locations
**Guidance:** Use conditional access named locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure named locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)  

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 3.9: Use Azure Active Directory
**Guidance:** Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)  

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 3.10: Regularly review and reconcile user access
**Guidance:** Azure Active Directory (Azure AD) provides logs to help discover stale accounts. Also, use Azure identity access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

- [Understand Azure AD reporting](../active-directory/reports-monitoring/)  
- [How to use Azure identity access reviews](../active-directory/governance/access-reviews-overview.md)  

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 3.11: Monitor attempts to access deactivated accounts
**Guidance:** You have access to Azure Active Directory (Azure AD) sign-in Activity, Audit, and Risk Event log sources, which allow you to integrate with any Security Information and Event Management (SIEM) /Monitoring tool.

You can streamline this process by creating Diagnostic Settings for Azure Active Directory user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. You can configure alerts within Log Analytics Workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)  

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 3.12: Alert on account login behavior deviation
**Guidance:** Use Azure Active Directory (Azure AD) Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities.

- [How to view Azure AD risky sign-ins](../active-directory/reports-monitoring/concept-risky-sign-ins.md)  
- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)  

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios
**Guidance:** Customer Lockbox not currently supported for Azure DevTest Labs.

- [List of Customer Lockbox supported services](../security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability.md) 

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer


## Next steps
See the following article:

- [Security alerts for environments in Azure DevTest Labs](environment-security-alerts.md)