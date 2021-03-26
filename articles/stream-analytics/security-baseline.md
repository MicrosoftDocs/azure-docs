---
title: Azure security baseline for Stream Analytics
description: The Stream Analytics security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 03/26/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Stream Analytics

This security baseline applies guidance from the [Azure Security Benchmark version1.0](https://docs.microsoft.com/azure/security/benchmarks/overview-v1) to Stream Analytics. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure.The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Stream Analytics. **Controls** not applicable to Stream Analytics, or for which the responsibility is Microsoft's, have been excluded.

To see how Stream Analytics completely maps to the Azure Security Benchmark, see the [full Stream Analytics security baseline mappingfile](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Azure Stream Analytics does not support the use of network security groups (NSG) and Azure Firewall.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Azure Stream Analytics does not support the use of virtual networks and subnets.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications 

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Use Azure Security Center threat protection to detect and alert on communications with known malicious or unused Internet IP addresses.

- [Threat protectionfor the Azure service layer in Azure Security Center](https://docs.microsoft.com/azure/security-center/azure-defender)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: Azure Stream Analytics does not use network security groups, and flow logs for Azure Key Vault are not captured.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Use Azure Security Center threat protection to detect unusual or potentially harmful operations in your Azure subscription environment.

- [Threat protection for the Azure service layer in Azure Security Center](https://docs.microsoft.com/azure/security-center/azure-defender)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Azure Stream Analytics does not support the use of virtual networks and network rules.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices 

**Guidance**: Azure Stream Analytics does not support use of virtual networks and network devices.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules 

**Guidance**: Azure Stream Analytics does not support the use of virtual networks and traffic configuration rules.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes 

**Guidance**: Use Azure Activity Log to monitor resource configurations and detect changes for your Stream Analytics resources. Create alerts within Azure Monitor that will trigger when changes to critical resources take place.

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log#view-the-activity-log)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.2: Configure central security log management 

**Guidance**: Ingest logs via Azure Monitor to aggregate security data such as audit events and requests. Within Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accountyfor long-term/archival storage, optionally with security features such as immutable storage and enforced retention holds. 

- [How to collect platform logs and metrics with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Diagnostic Settings on your Azure Stream Analytics for access to administrative, security, and diagnostic logs. You may also enable Azure Activity Log Diagnostic Settings and send the logs to the same Log Analytics workspace or storage account.

- [Azure Stream Analytics provides diagnostic logs and activity data for review](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-job-diagnostic-logs)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.StreamAnalytics**:

[!INCLUDE [Resource Policy for Microsoft.StreamAnalytics 2.3](../../includes/policy/standards/asb/rp-controls/microsoft.streamanalytics-2-3.md)]

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention 

**Guidance**: When storing security event logs in the Azure Storage account or Log Analytics workspace, you may set the retention policy according to your organization's requirements. 

- [Azure Stream Analytics provides diagnostic logs and activity data for review](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-job-diagnostic-logs)

- [How to configure retention policy for Azure Storage account logs](https://docs.microsoft.com/azure/storage/common/storage-monitor-storage-account#configure-logging) 

- [Change the data retention period in Log Analytics](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review the results for your Stream Analytics resources. Use Azure Monitor's Log Analytics Workspace to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard) 

- [For more information about the Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/log-query/log-analytics-tutorial)

- [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Enable Diagnostic Settings for Stream Analytics and send logs to a Log Analytics Workspace. Onboard your Log Analytics Workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for playbooks (automated solutions) to be created and used to remediate security issues. 

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard) 

- [How to alert on log analytics log data](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response)  

- [Azure Stream Analytics provides diagnostic logs and activity data for review](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-job-diagnostic-logs)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging 

**Guidance**: Not applicable; Stream Analytics does not process or produce anti-malware related logs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging 

**Guidance**: Azure DNS Analytics (Preview) solution in Azure Monitor gathers insights into DNS infrastructure on security, performance, and operations. Currently this does not support Azure Stream Analytics however you can use third-party dns logging solution. 

- [Gather insights about your DNS infrastructure with the DNS Analytics Preview solution](https://docs.microsoft.com/azure/azure-monitor/insights/dns-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging 

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts 

**Guidance**: Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned. Roles can be queried to discover membership. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable 

**Guidance**: Stream Analytics does not have the concept of default passwords as authentication is provided with Azure Active Directory (Azure AD) and secured by Azure role-based access control (Azure RBAC) to manage the service. Depending on the injection stream services and output services, you need to rotate credentials configured in the jobs.

- [Rotate login credentials for inputs and outputs of a Stream Analytics job](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-login-credentials-inputs-outputs)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts 

**Guidance**: Create an identity management and role security plan, following best practices including the principle of least privileged access for administrator roles. Use Azure Privileged Identity Management (PIM) to provide just-in-time privileged access to Azure Active Directory (Azure AD) and Azure resources. Use Azure PIM alerts and audit history to monitor the activity of administrative accounts. Use Azure AD security reports to help identify administrative accounts that might have been compromised.

- [Learn more](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Wherever possible, use Azure Active Directory (Azure AD) SSO instead of configuring stand-alone credentials per-service. Implement the Azure Security Center identity &amp; access recommendations.

- [Understand SSO with Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and access management recommendations to help protect your Stream Analytics resources.

- [How to enable multifactor authentication in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

- [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with multifactor authentication configured to log into and configure Stream Analytics resources.

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection)

- [How to monitor users' identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access named locations to allow access from only specific logical groupings of IP address ranges or countries/regions. 

- [How to configure named locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD provides role-based access control (Azure RBAC) for fine-grained control over a client's access to Stream Analytics resources.

- [How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Review the Azure Active Directory (Azure AD) logs to help discover stale accounts which can include those with Storage account administrative roles. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access should be reviewed on a regular basis to make sure only the right Users have continued access.

- [Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Enable diagnostic settings for Azure Stream Analytics and Azure Active Directory (Azure AD), sending all logs to a Log Analytics workspace. Configure desired alerts (such as attempts to access disabled secrets) within Log Analytics.

- [Integrate Azure AD logs with Azure Monitor logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD)'s Risk and Identity Protection features to configure automated responses to detected suspicious actions related to your Stream Analytics resources. You should enable automated responses through Azure Sentinel to implement your organization's security responses.

- [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection)

- [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not applicable; Customer Lockbox not supported for Azure Stream Analytics.

- [Supported services and scenarios in general availability](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Stream Analytics resources that store or process sensitive information. 

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Isolate Stream Analytics jobs by putting inputs, outputs, and Storage accounts in the same subscription. You can restrict your Stream Analytics to control the level of access to your Stream Analytics resources that your applications and enterprise environments demand. You can control access to Azure Stream Analytics via Azure Active Directory (Azure AD) RBAC.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/cost-management-billing/manage/create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create-management-group-portal)

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

- [Understand inputs for Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-add-inputs)

- [Understand outputs from Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-define-outputs)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information 

**Guidance**: Data loss prevention features are not yet available for Azure Stream Analytics resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and guards against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

- [How to secure Azure Storage Accounts](https://docs.microsoft.com/azure/storage/blobs/security-recommendations)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification features are not yet available for Azure Stream Analytics resources. Implement third-party solution if required for compliance purposes. 

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use Azure role-based access control (Azure RBAC) to control how users interact with the service.

- [How to configure Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Stream Analytics doesn't store the incoming data since all processing is done in-memory.  Any private data including queries and functions that is required to be persisted by Stream Analytics is stored in the configured storage account.  Use customer-managed keys (CMK) to encrypt your output data at rest in your storage accounts. Even without CMK, Stream Analytics automatically employs best-in-class encryption standards across its infrastructure to encrypt and secure your data.

- [Data protection in Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/data-protection)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production instances of Azure Stream Analytics resources.

- [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Follow recommendations from Azure Security Center on securing your Azure Stream Analytics resources.

Microsoft performs vulnerability management on the underlying systems that support Azure Stream Analytics.

- [Understand Azure Security Center recommendations](https://docs.microsoft.com/azure/security-center/recommendations-reference)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center. 

- [Understand Azure Security Center Secure Score](https://docs.microsoft.com/azure/security-center/secure-score-security-controls)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Stream Analytics resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

In addition, use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/cost-management-billing/manage/create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create-management-group-portal)

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Not applicable; this recommendation is intended for compute resources and Azure as a whole.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

In addition, use Azure Resource Graph to query/discover resources within the subscription(s).

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Not applicable; this recommendation is intended for compute resources and Azure as a whole.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.StreamAnalytics" namespace to create custom policies to audit or enforce the configuration of your Azure Stream Analytics. You may also make use of built-in policy definitions related to your Azure Stream Analytics, such as:

-Diagnostic logs in Azure Stream Analytics should be enabled

- [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias)

- [Azure Policy built-in policy definitions](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: Use Azure Repos to securely store and manage your code including custom Azure policies, Azure Resource Manager templates, Desired State Configuration scripts, user defined functions, queries. To access the resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Azure AD if integrated with TFS.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow)

- [About permissions and groups in Azure DevOps](https://docs.microsoft.com/azure/devops/organizations/security/about-permissions)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.StreamAnalytics" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.StreamAnalytics" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure Stream Analytics resources.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Connection details of input or output resources, which are used by your Stream Analytics job, are stored in the configured storage account. Encrypt your storage account to secure all of your data.  Also, regularly rotate credentials for an input or output of a Stream Analytics job.

- [Data protection in Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/data-protection)

- [Rotate login credentials for inputs and outputs of a Stream Analytics Job](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-login-credentials-inputs-outputs)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Managed Identity authentication for output gives Stream Analytics jobs direct access to service including Power BI, Storage Account, instead of using a connection string.

- [Authenticate Stream Analytics to Azure Data Lake Storage Gen1 using managed identities](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-managed-identities-adls)

- [Use Managed Identity to authenticate your Azure Stream Analytics job to Azure Blob Storage output](https://docs.microsoft.com/azure/stream-analytics/blob-output-managed-identity)

- [Use Managed Identity to authenticate your Azure Stream Analytics job to Power BI](https://docs.microsoft.com/azure/stream-analytics/powerbi-output-managed-identity)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally-managed anti-malware software

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Stream Analytics), however it does not run on customer content.

Pre-scan any content being uploaded to Azure resources, such as App Service, Stream Analytics, Blob Storage etc. Microsoft cannot access your data in these instances.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Based on the type of output service selected. you can perform automated backups of the output data as per recommended guidelines for your output service.  The internal data including User-defined functions, queries, data snapshots is stored in the configured storage account which you can backup on a regular basis.

The data in your Microsoft Azure storage account is always automatically replicated to ensure durability and high availability. Azure Storage copies your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. You can choose to replicate your data within the same data center, across zonal data centers within the same region, or across geographically separated regions. 

You can also use lifecycle management feature to backup data to the Archive tier.  Additionally, enable soft delete for your backups stored in Storage account.

- [Data protection in Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/data-protection#private-data-assets-that-are-stored)

- [Understanding Azure Storage redundancy and Service-Level Agreements](https://docs.microsoft.com/azure/storage/common/storage-redundancy)

- [Manage the Azure Blob storage lifecycle](https://docs.microsoft.com/azure/storage/blobs/storage-lifecycle-management-concepts)

- [Soft delete for Azure Storage blobs](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: The internal data including User-defined functions, queries, data snapshots is stored in the configured storage account which you can backup on a regular basis.

In order to backup data from Storage account supported services, there are multiple methods available including using azcopy or third-party tools. Immutable storage for Azure Blob storage enables users to store business-critical data objects in a WORM (Write Once, Read Many) state. This state makes the data non-erasable and non-modifiable for a user-specified interval.

- [Data protection in Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/data-protection#private-data-assets-that-are-stored)

- [Get started with AzCopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10)

- [Set and manage immutability policies for Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-immutability-policies-manage)

Customer-managed / provided keys can be backed within Azure Key Vault using Azure CLI or PowerShell.

- [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Periodically perform data restoration of your backup data to test the integrity of the data.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Stream Analytics backups stored within your Azure Storage supports encryption by default and cannot be turned off.  You should treat your backups as sensitive data and apply the relevant access and data protection controls as part of this baseline.  

- [Data protection in Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/data-protection#private-data-assets-that-are-stored)

- [Authorizing access to data in Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-auth)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. 

Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-overview)

- [Use tags to organize your Azure resources](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

- [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.

- [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies: https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1 

- [You can find more information on Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
