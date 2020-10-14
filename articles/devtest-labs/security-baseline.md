---
title: Azure Security Baseline for Azure DevTest Labs
description: Azure Security Baseline for Azure DevTest Labs
ms.topic: conceptual
ms.date: 07/23/2020
---

# Azure Security Baseline for Azure DevTest Labs

The Azure Security Baseline for Azure DevTest Labs contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview.md), which provides recommendations on how you can secure your cloud solutions on Azure.

For more information, see [Azure Security Baselines overview](../security/benchmarks/security-baselines-overview.md).

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources
**Guidance:** Microsoft maintains time sources for Azure resources. However, you can manage time synchronization settings for your compute resources.

See the following article to learn about configuring time synchronization for Azure compute resources: [Time sync for Windows VMs in Azure](../virtual-machines/windows/time-sync.md). 

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Microsoft

### 2.2: Configure central security log management
**Guidance:** Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Activity logs provide insight into the operations that were done on your Azure DevTest Labs instances at the management plane-level. Using Azure activity log data, you can determine "what, who, and when" for any write operations (PUT, POST, DELETE) done at the management plane-level for your DevTest Labs instances.

For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/platform/diagnostic-settings.md).

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 2.3: Enable audit logging for Azure resources
**Guidance:** Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Activity logs provide insight into the operations that were done on your Azure DevTest Labs instances at the management plane-level. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) done at the management plane-level for your DevTest Labs instances.

For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/platform/diagnostic-settings.md).

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 2.4: Collect security logs from operating systems
**Guidance:** Azure DevTest Labs virtual machines (VMs) are created and owned by the customer. So, it’s the organization’s responsibility to monitor it. You can use Azure Security Center to monitor the compute OS. Data collected by Security Center from the operating system includes OS type and version, OS (Windows Event Logs), running processes, machine name, IP addresses, and logged in user. The Log Analytics Agent also collects crash dump files.

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
**Guidance:** Azure DevTest Labs creates Azure Compute machines that are owned and managed by the customer. Use Microsoft Monitoring Agent on all supported Azure Windows VMs to log the process creation event and the `CommandLine` field. For supported Azure Linux VMs, you can manually configure console logging on a per-node basis and use Syslog to store the data. Also, use Azure Monitor's Log Analytics workspace to review logs and run queries on logged data from Azure VMs.

- [Data collection in Azure Security Center](../security-center/security-center-enable-data-collection.md#data-collection-tier)
- [How to run custom queries in Azure Monitor](../azure-monitor/log-query/get-started-queries.md)
- [Syslog data sources in Azure Monitor](../azure-monitor/platform/data-sources-syslog.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

## Identity and Access Control
*For more information, see [Security Control: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts
**Guidance:** Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to run ad-hoc queries to discover accounts that are members of administrative groups.

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

- **Resource management:** It provides access to the Azure portal to manage resources (create VMs, create environments, start, stop, restart, delete, and apply artifacts, and so on). Resource management is done in Azure by using Azure role-based access control (Azure RBAC). You assign roles to users and set resource and access-level permissions.
- **Virtual machines (network-level)**: In the default configuration, VMs use a local admin account. If there's a domain available (Azure AD Domain Services, an on-premises domain, or a cloud-based domain), machines can be joined to the domain. Users can then use their domain-based identities using the domain join artifact to connect to the machines. 

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

- [How to identify Azure AD users flagged for risky activity](../active-directory/identity-protection/overview-identity-protection.md)  
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

- [Understand Azure AD reporting](../active-directory/reports-monitoring/overview-reports.md)  
- [How to use Azure identity access reviews](../active-directory/governance/access-reviews-overview.md)  

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 3.11: Monitor attempts to access deactivated accounts
**Guidance:** You have access to Azure Active Directory (Azure AD) sign in Activity, Audit, and Risk Event log sources, which allow you to integrate with any Security Information and Event Management (SIEM) /Monitoring tool.

You can streamline this process by creating Diagnostic Settings for Azure Active Directory user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. You can configure alerts within Log Analytics Workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)  

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 3.12: Alert on account login behavior deviation
**Guidance:** Use Azure Active Directory (Azure AD) Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)  
- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)  

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios
**Guidance:** Customer Lockbox not currently supported for Azure DevTest Labs.

- [List of Customer Lockbox supported services](../security/fundamentals/customer-lockbox-overview.md#supported-services-and-scenarios-in-general-availability) 

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

## Data Protection
*For more information, see [Security Control: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive information
**Guidance:** Use tags to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use tags](../azure-resource-manager/resource-group-using-tags.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 4.2: Isolate systems storing or processing sensitive information
**Guidance:** Implement separate subscriptions or management groups for development, test, and production. Azure DevTest Labs instances should be separated by virtual network/subnet and tagged appropriately. 

- [How to create additional Azure subscriptions](../billing/billing-create-subscription.md)
- [How to create management groups](../governance/management-groups/create.md)
- [How to configure a virtual network for DevTest Labs](devtest-lab-configure-vnet.md)
- [How to create and use tags](../azure-resource-manager/resource-group-using-tags.md)
- [How to create and use tags for DevTest Labs](devtest-lab-add-tag.md)

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information
**Guidance:** Not yet available; data identification, classification, and loss prevention features aren't yet available for Azure DevTest Labs.

Microsoft manages the underlying infrastructure for Azure DevTest Labs and has implemented strict controls to prevent the loss or exposure of customer data.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Shared

### 4.4: Encrypt all sensitive information in transit
**Guidance:** Azure DevTest Labs requires TLS-encrypted communications by default. TLS versions 1.2 is currently supported. If your client library or tool doesn't support TLS, then enabling unencrypted connections can be done through the Azure portal or management APIs. In such cases where encrypted connections aren't possible, placing lab and client application into a virtual network would be recommended.

[Understand encryption in transit scenario for DevTest Labs](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/azure-devtest-labs-enforcing-tls-1-2-starting-may-01-2020/ba-p/1236279)

**Azure Security Center monitoring:** Yes

**Responsibility:** Shared

### 4.5: Use an active discovery tool to identify sensitive data
**Guidance:** Data identification, classification, and loss prevention features aren't yet available for Azure DevTest Labs. Tag instances containing sensitive information as such and implement third-party solution if necessary for compliance purposes.

For the underlying platform, which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 4.6: Use Azure RBAC to control access to resources
**Guidance:** Use Azure role-based access control (Azure RBAC) to control access to labs in Azure DevTest Labs.

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)
- [Understand roles in DevTest Labs](devtest-lab-add-devtest-user.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 4.7: Use host-based data loss prevention to enforce access control
**Guidance:** If necessary for compliance on compute resources created as part of DevTest Labs, implement a third-party tool, such as an automated host-based data loss prevention solution, to enforce access controls to data even when data is copied off a system.

For the underlying platform, which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Not applicable

### 4.8: Encrypt sensitive information at rest
**Guidance:** Azure DevTest Labs stores the following customer data:

- [Artifact results](add-artifact-vm.md) that include deployment and extension logs generated from applying artifacts
- [Formula documents](devtest-lab-manage-formulas.md) that are used to create virtual machines from formulas
- OS and data disks for lab virtual machines 

Artifact results and formula documents are sent to an Azure Storage account that's created as part of every lab deployment. Data in Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption can't be disabled. You can rely on Microsoft-managed keys for the encryption of your storage account, or you can manage encryption with your own keys. For more information, see [Encryption for lab storage account](encrypt-storage.md).

By default, all lab OS and data disks are encrypted with a platform managed key. All managed disks, snapshots, images, and data written to existing managed disks are automatically encrypted-at-rest with platform-managed keys. As a lab owner, you can configure lab OS disks to be encrypted with a customer managed key. Encryption using a customer managed key for lab data disks is currently not configurable through the lab itself. However a subscription admin can configure this setting for lab disks within a subscription for now. For more information, see [Encrypt lab DevTest Labs OS disks using customer managed keys](encrypt-disks-customer-managed-keys.md).

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Shared

### 4.9: Log and alert on changes to critical Azure resources
**Guidance:** Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to DevTest Labs instances and other critical or related resources.

- [How to create alerts for Azure activity Log events](../azure-monitor/platform/alerts-activity-log.md)
- [How to create alerts for DevTest Labs activity log events](create-alerts.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer



## Vulnerability Management
*For more information, see [Security Control: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools
**Guidance:** Follow recommendations from Azure Security Center on securing your Azure DevTest Labs instances and related resources.

Microsoft performs vulnerability management on the underlying resources that support Azure DevTest Labs.

- [Understand Azure Security Center recommendations](../security-center/recommendations-reference.md) 

**Azure Security Center monitoring:** Yes

**Responsibility:** Shared

### 5.2: Deploy automated operating system patch management solution
**Guidance:** Use Azure Update Management to ensure the most recent security updates are installed on your Windows and Linux VMs hosted within DevTest Labs. For Windows VMs, ensure Windows Update has been enabled and set to update automatically. This setting isn't currently available to configure through DevTest Labs, however lab admin/subscription admin can configure this setting on the underlying compute VMs in their subscription. 

- [How to configure Update Management for VMs in Azure](../automation/update-management/update-mgmt-overview.md)
- [Understand Azure security policies monitored by Security Center](../security-center/security-center-policy-definitions.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 5.3: Deploy automated third-party software patch management solution
***Guidance:*** As a lab admin, you can use [DevTest Labs artifacts](add-artifact-vm.md) to automate updates to lab custom images including security patches and other updates. 

Learn more about [DevTest Labs Image Factory](image-factory-create.md), which is a configuration-as-code solution that builds and distributes images automatically on a regular basis with all the wanted configurations. 

As a subscription admin, you can also use the Azure Update Management solution to manage updates and patches for DevTest Labs VMs. Update Management relies on the locally configured update repository to patch supported Windows systems. Tools like System Center Updates Publisher (Updates Publisher) allow you to publish custom updates into Windows Server Update Services (WSUS). This scenario allows Update Management to patch machines that use Configuration Manager as their update repository with third-party software.

- [Update Management solution in Azure](../automation/update-management/update-mgmt-overview.md)
- [Manage updates and patches for your VMs](../automation/update-management/update-mgmt-overview.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 5.4: Compare back-to-back vulnerability scans
**Guidance:** Export scan results at consistent intervals and compare the results to verify that vulnerabilities have been remediated. When using vulnerability management recommendation suggested by Azure Security Center, customer may pivot into the selected solution's portal to view historical scan data.

**Azure Security Center monitoring:** Not Applicable

**Responsibility:** Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities
**Guidance:** Use the default risk ratings (secure score) provided by Azure Security Center.

- [Understand Azure Security Center secure score](../security-center/secure-score-security-controls.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

## Inventory and asset management
*For more information, see [Security control: Inventory and asset management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution
**Guidance:** Use Azure Resource Graph to query and discover all resources (including DevTest Labs resources) within your subscriptions. Ensure you have appropriate (read) permissions in your tenant and can enumerate all Azure subscriptions and resources within your subscriptions.

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)
- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)
- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Azure Security Center monitoring:** Not Applicable

**Responsibility:** Customer

### 6.2: Maintain asset metadata
**Guidance:** Apply tags to Azure resources giving metadata to logically organize them according to a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)
- [Configure tags for DevTest Labs](devtest-lab-add-tag.md)

**Azure Security Center monitoring:** Not Available

**Responsibility:** Customer

### 6.3: Delete unauthorized Azure resources
**Guidance:** Use tagging, management groups, and separate subscriptions, and separate labs where appropriate, to organize and track labs and lab-related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription quickly.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)
- [How to create Management Groups](../governance/management-groups/create.md)
- [How to create a lab using DevTest Labs](devtest-lab-create-lab.md)
- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)
- [How to configure tags for a lab](devtest-lab-add-tag.md)

**Azure Security Center monitoring:** Not Applicable

**Responsibility:** Customer

### 6.4: Define and maintain inventory of approved Azure resources
**Guidance:** Create an inventory of approved Azure resources and approved software for compute resources as per organizational needs. As a subscription admin, you can also use adaptive application controls, a feature of Azure Security Center to help you define a set of applications that are allowed to run on configured groups of lab machines. This feature is available for both Azure and non-Azure Windows (all versions, classic, or Azure Resource Manager) and Linux machines.

- [How to enable Adaptive Application Control](../security-center/security-center-adaptive-application.md)
 
**Azure Security Center monitoring:** Not Applicable
**Responsibility:** Customer

### 6.5: Monitor for unapproved Azure resources
**Guidance:** Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types
- Allowed resource types

Also, use the Azure Resource Graph to query/discover resources within the subscription(s). It can help in high security-based environments, such as those with Storage accounts.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)
- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring:** Not Applicable

**Responsibility:** Customer

### 6.6: Monitor for unapproved software applications within compute resources
**Guidance:** Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources. As a subscription admin, you can use Azure Virtual Machine inventory to automate the collection of information about all software on DevTest Labs VMs in your subscription. The software name, version, publisher, and refresh time properties are available from the Azure portal. To get access to install date and other information, customer required to enable guest-level diagnostic and bring the Windows Event logs into a Log Analytics Workspace.

In addition to using Change Tracking for monitoring of software applications, adaptive application controls in Azure Security Center use machine learning to analyze the applications running on your machines and create an allow list from this intelligence. This capability greatly simplifies the process of configuring and maintaining application allow list policies, enabling you to avoid unwanted software to be used in your environment. You can configure audit mode or enforce mode. Audit mode only audits the activity on the protected VMs. Enforce mode does enforce the rules and makes sure that applications that aren't allowed to run are blocked. 

- [An introduction to Azure Automation](../automation/automation-intro.md)
- [How to enable Azure VM inventory](../automation/automation-tutorial-installed-software.md)
- [Understand adaptive application controls](../security-center/security-center-adaptive-application.md)

**Azure Security Center monitoring:** Not Applicable

**Responsibility:** Customer


### 6.7: Remove unapproved Azure resources and software applications
**Guidance:** Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources. As a subscription admin, you may use Change Tracking to identify all software installed on VMs hosted in DevTest Labs. You can implement your own process or use Azure Automation State Configuration for removing unauthorized software.

- [An introduction to Azure Automation](../automation/automation-intro.md)
- [Track changes in your environment with the Change Tracking solution](../automation/change-tracking/overview.md)
- [Azure Automation state configuration overview](../automation/automation-dsc-overview.md)

**Azure Security Center monitoring:** Not Available

**Responsibility:** Customer

### 6.8: Use only approved applications
**Guidance:** As a subscription admin, you can use Azure Security Center Adaptive Application Controls to ensure that only authorized software executes, and all unauthorized software is blocked from executing on Azure VMs hosted in DevTest Labs.

- [How to use Azure Security Center Adaptive Application Controls](../security-center/security-center-adaptive-application.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 6.9: Use only approved Azure services
**Guidance:** Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions: 

- Not allowed resource types
- Allowed resource types

See the following articles: 
- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)
- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/not-allowed-resource-types.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer


### 6.10: Maintain an inventory of approved software titles
**Guidance:** Adaptive application control is an intelligent, automated, end-to-end solution from Azure Security Center, which helps you control which applications can run on your Azure and non-Azure machines (Windows and Linux), hosted in DevTest Labs. Note you need to be a subscription admin to configure this setting for the underlying compute resources hosted in DevTest Labs. Implement third-party solution if this setting doesn't meet your organization's requirement.

- [How to use Azure Security Center Adaptive Application Controls](../security-center/security-center-adaptive-application.md)

**Azure Security Center monitoring:** Not Applicable

**Responsibility:** Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager
**Guidance:** Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring **Block access**"** for the **Microsoft Azure Management** App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 6.12: Limit users' ability to execute scripts within compute resources
**Guidance:** Depending on the type of scripts, you may use operating system-specific configurations or third-party resources to limit users' ability to execute scripts within the VMs hosted in DevTest Labs. You can also use Azure Security Center Adaptive Application Controls to ensure that only authorized software executes, and all unauthorized software is blocked from executing on the underlying Azure VMs.

- [How to control PowerShell script execution in Windows Environments](/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6)
- [How to use Azure Security Center Adaptive Application Controls](../security-center/security-center-adaptive-application.md)

**Azure Security Center monitoring:** Not Available

**Responsibility:** Customer


### 6.13: Physically or logically segregate high-risk applications
**Guidance:** High risk applications deployed in your Azure environment may be isolated using virtual network, subnet, subscriptions, management groups, and so on. and sufficiently secured with either an Azure Firewall, Web Application Firewall (WAF), or network security group (NSG).

- [Configure virtual network for DevTest Labs](devtest-lab-configure-vnet.md)
- [Azure Firewall overview](../firewall/overview.md)
- [Web Application Firewall overview](../web-application-firewall/overview.md)
- [Network security overview](../virtual-network/security-overview.md)
- [Azure Virtual Network overview]()
- [Organize your resources with Azure management groups](../governance/management-groups/overview.md)
- [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/)

**Azure Security Center monitoring:** Not Available

**Responsibility:** Customer

## Secure configuration
**For more information, see Security Control: Secure Configuration.**

### 7.1: Establish secure configurations for all Azure resources
**Guidance:** Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure resources created as part of DevTest Labs. You may also use built-in Azure Policy definitions.

Also, Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your organization.

You may also use recommendations from Azure Security Center as a secure configuration baseline for your Azure resources.

- [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)
- [Tutorial: Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)
- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)
- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 7.2: Establish secure operating system configurations
**Guidance:** Use Azure Security Center recommendations to maintain security configurations on all underlying compute resources created as part of DevTest Labs. Additionally, you may use custom operating system images or Azure Automation State configuration or DevTest Labs artifacts to establish the security configuration of the operating system required by your organization.

- [How to monitor Azure Security Center recommendations](../security-center/security-center-recommendations.md)
- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)
- [Azure Automation State Configuration overview](../automation/automation-dsc-overview.md)
- [Upload a VHD and use it to create new Windows VMs in Azure](../virtual-machines/windows/upload-generalized-managed.md)
- [Create a Linux VM from a custom disk with the Azure CLI](../virtual-machines/linux/upload-vhd.md)
- [Create and distribute custom images to multiple DevTest Labs](image-factory-save-distribute-custom-images.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Not applicable

### 7.3: Maintain secure Azure resource configurations
**Guidance:** Use Azure Policy **deny** and **deploy if not exist** rules to enforce secure settings across your Azure resources created as a part of DevTest Labs. Also, you may use Azure Resource Manager templates to maintain the security configuration of your Azure resources required by your organization.

- [Understand Azure Policy effects](../governance/policy/concepts/effects.md)
- [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)
- [Azure Resource Manager templates overview](../azure-resource-manager/templates/overview.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 7.4: Maintain secure operating system configurations
**Guidance:** Follow recommendations from Azure Security Center on performing vulnerability assessments on your underlying Azure compute resources created as part of a lab. Also, you may use Azure Resource Manager templates, custom operating system images, or Azure Automation State configuration to maintain the security configuration of the operating system required by your organization. You can also use the image factory solution, which is a configuration-as-code solution that builds and distributes images automatically on a regular basis with all the desired configurations.

Also, Azure Marketplace Virtual Machine Images published by Microsoft are managed and maintained by Microsoft.

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/security-center-vulnerability-assessment-recommendations.md)
- [Azure Automation State Configuration overview](../automation/automation-dsc-overview.md)
- [Sample script to upload a VHD to Azure and create a new VM](../virtual-machines/scripts/virtual-machines-windows-powershell-upload-generalized-script.md)
- [How to create an image factory in DevTest Labs](image-factory-create.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Shared

### 7.5: Securely store configuration of Azure resources
**Guidance:** Use Azure DevOps to securely store and manage your code like custom Azure policies, Azure Resource Manager templates and Desired State Configuration scripts. To access the resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps.

- [Azure Repos Git tutorial](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow)
- [About permissions and groups](https://docs.microsoft.com/azure/devops/organizations/security/about-permissions?view=azure-devops&tabs=preview-page)
- [Integration between Azure DevTest Labs and Azure DevOps workflow](devtest-lab-dev-ops.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 7.6: Securely store custom operating system images
**Guidance:** If using custom images, use Azure role-based access control (Azure RBAC) to ensure only authorized users may access the images. Using a Shared Image Gallery, you can share your images to specific labs that need it. For container images, store them in Azure Container Registry and use Azure RBAC to ensure only authorized users may access the images.

- [Understand Azure RBAC](../role-based-access-control/rbac-and-directory-admin-roles.md)
- [How to configure Azure RBAC](../role-based-access-control/quickstart-assign-role-user-portal.md)
- [Configure a Shared Image Gallery for a DevTest Labs](configure-shared-image-gallery.md)
- [Understand Azure RBAC for Container Registry](../container-registry/container-registry-roles.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 7.7: Deploy system configuration management tools
**Guidance:** Define and implement standard security configurations for Azure resources using Azure Policy. Use Azure Policy aliases to create custom policies to audit or enforce the network configuration of your Azure resources created under DevTest Labs. You may also make use of built-in policy definitions related to your specific resources. Additionally, you may use Azure Automation to deploy configuration changes.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)
- [How to use aliases](../governance/policy/concepts/definition-structure.md#aliases)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 7.8: Deploy system configuration management tools for operating systems
**Guidance:** Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance to the desired state you specified. You can also write a custom artifact that can installed on every lab machine to ensure they are follow organizational policies. 

- [Onboarding machines for management by Azure Automation State Configuration](../automation/automation-dsc-onboarding.md)
- [Creating custom artifacts for DevTest Labs virtual machines](devtest-lab-artifact-author.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 7.9: Implement automated configuration monitoring for Azure services
**Guidance:** Use Azure Security Center to perform baseline scans for your Azure Resources created under DevTest Labs. Additionally, use Azure Policy to alert and audit Azure resource configurations.

- [How to remediate recommendations in Azure Security Center](../security-center/security-center-remediate-recommendations.md)
 
**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 7.10: Implement automated configuration monitoring for operating systems
**Guidance:** Use Azure Security Center to perform baseline scans for OS and Docker Settings for containers.

- [Understand Azure Security Center container recommendations](../security-center/security-center-container-recommendations.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 7.11: Manage Azure secrets securely
**Guidance:** Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.

- [Configure managed identity to deploy Azure Resource Manager environments in DevTest Labs](use-managed-identities-environments.md)
- [Configure managed identity to deploy virtual machines in DevTest Labs](enable-managed-identities-lab-vms.md)
- [How to create a key vault](../key-vault/quick-create-portal.md)
- [How to authenticate to Key Vault](../key-vault/general/authentication.md)
- [How to assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 7.12: Manage identities securely and automatically
**Guidance:** Use Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [Configure managed identity to deploy Azure Resource Manager environments in DevTest Labs](use-managed-identities-environments.md)
- [Configure managed identity to deploy virtual machines in DevTest Labs](enable-managed-identities-lab-vms.md)
 
**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 7.13: Eliminate unintended credential exposure
**Guidance:** Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- How to set up Credential Scanner

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer


## Malware defense
*For more information, see Security control: Malware defense.*

### 8.1: Use centrally managed anti-malware software
**Guidance:** Use Microsoft Antimalware for Azure Cloud Services and Virtual Machines to continuously monitor and defend your resources. For Linux, use third-party antimalware solution. Also, use Azure Security Center's Threat detection for data services to detect malware uploaded to storage accounts.

- How to configure Microsoft Antimalware for Cloud Services and Virtual Machines
- Threat protection in Azure Security Center

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources
**Guidance:** Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure App Service hosted in a lab), however it doesn't run on your content.
Pre-scan any files being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, and so on.

Use Azure Security Center's Threat detection for data services to detect malware uploaded to storage accounts.

- Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines
- Understand Azure Security Center's Threat detection for data services

**Azure Security Center monitoring:** Yes

**Responsibility:** Not applicable


### 8.3: Ensure anti-malware software and signatures are updated
**Guidance:** When deployed, Microsoft Antimalware for Azure will automatically install the latest signature, platform, and engine updates by default. Follow recommendations in Azure Security Center: "Compute & Apps" to ensure all endpoints for DevTest Labs underlying compute resources are up to date with the latest signatures. The Windows OS can be further protected with additional security to limit the risk of virus or malware-based attacks with the Microsoft Defender Advanced Threat Protection service that integrates with Azure Security Center.

- How to deploy Microsoft Antimalware for Azure Cloud Services and Virtual Machines
- Microsoft Defender Advanced Threat Protection

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

## Data recovery
*For more information, see [Security control: Data recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups
**Guidance:** Currently, Azure DevTest Labs doesn't support VM backups and snapshots. However, you can enable and configure Azure Backup on the underlying Azure VMs hosted in DevTest Labs. And, you can also configure the wanted frequency and retention period for automatic backups as long as you have appropriate access to the underlying compute resources. 

- [An overview of Azure VM backup](../backup/backup-azure-vms-introduction.md)
- [Back up an Azure VM from the VM settings](../backup/backup-azure-vms-first-look-arm.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 9.2: Perform complete system backups and backup any customer-managed keys
**Guidance:** Currently, Azure DevTest Labs doesn't support VM backups and snapshots. However, you can create snapshots of your underlying Azure VMs hosted in the DevTest Labs or the managed disks attached to those instances using PowerShell or REST APIs as long as you have appropriate access to the underlying compute resources. You can also back up any customer-managed keys within Azure Key Vault.

Enable Azure Backup on target Azure VMs, and the wanted frequency and retention periods. It includes complete system state backup. If you're using Azure disk encryption, Azure VM backup automatically handles the backup of customer-managed keys.

- [Back up on Azure VMs that use encryption](../backup/backup-azure-vms-encryption.md)
- [Overview of Azure VM backup](../backup/backup-azure-vms-introduction.md)
- [An overview of Azure VM backup](../backup/backup-azure-vms-introduction.md)
- [How to back up Key Vault keys in Azure](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 9.3: Validate all backups including customer-managed keys
**Guidance:** Ensure ability to periodically perform data restoration of content within Azure Backup. If necessary, test restoration of content to an isolated virtual network or subscription. Also, test restoration of backed up customer-managed keys.

If you're using Azure disk encryption, you can restore the Azure VM with the disk encryption keys. When using disk encryption, you can restore the Azure VM with the disk encryption keys.

- [Back up on Azure VMs that use encryption](../backup/backup-azure-vms-encryption.md)
- [How to recover files from Azure VM backup](../backup/backup-azure-restore-files-from-vm.md)
- [How to restore key vault keys in Azure](/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)
- [How to back up and restore an encrypted VM](../backup/backup-azure-vms-encryption.md)

**Azure Security Center monitoring:** Not Applicable

**Responsibility:** Customer

### 9.4: Ensure protection of backups and customer-managed keys
**Guidance:** When you back up managed disks with Azure Backup, VMs are encrypted at rest with Storage Service Encryption (SSE). Azure Backup can also back up Azure VMs that are encrypted by using Azure Disk Encryption. Azure Disk Encryption integrates with BitLocker encryption keys (BEKs), which are safeguarded in a key vault as secrets. Azure Disk Encryption also integrates with Azure Key Vault key encryption keys (KEKs). Enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.

- [Soft delete for VMs](../backup/soft-delete-virtual-machines.md)
- [Azure Key Vault - soft-delete overview](../key-vault/general/soft-delete-overview.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

## Incident response
*For more information, see [Security Control: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide
**Guidance:** Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel and phases of incident handling/management from detection to post-incident review.

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)
- [Microsoft Security Response Center's anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)
- [Use NIST's computer security incident handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 10.2: Create an incident scoring and prioritization procedure
**Guidance:** Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data. It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)
- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 10.3: Test security response procedures
**Guidance:** Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

- [NIST's publication - guide to test, training, and exercise programs for IT plans and capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents
**Guidance:** Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 10.5: Incorporate security alerts into your incident response system
**Guidance:** Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)
- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

#### 10.6: Automate the response to security alerts
**Guidance:** Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)
 
****Azure Security Center monitoring:**** Not applicable

**Responsibility:** Customer


## Penetration tests and red team exercises
*For more information, see Security Control: [Penetration tests and red team exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*


### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings within 60 days
**Guidance:** Follow the Microsoft Rules of Engagement to ensure your Penetration Tests aren't in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing rules of engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)
- [Microsoft cloud red teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Shared

## Next steps
See the following article:

- [Security alerts for environments in Azure DevTest Labs](environment-security-alerts.md)
