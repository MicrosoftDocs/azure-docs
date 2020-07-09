---
title: Security Center security baseline for Azure Security Benchmark
description: The Security Center security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: security-center
ms.topic: conceptual
ms.date: 07/09/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Security Center security baseline for Azure Security Benchmark

This security baseline applies guidance from the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview) to Azure Security Center. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Security Center. **Controls** not applicable to Azure Security Center have been excluded. To see how Azure Security Center completely maps to the Azure Security Benchmark, see the [full Azure Security Center security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see [Security control: Network security](/azure/security/benchmarks/security-control-network-security).*

### 1.1: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](None.).

**Guidance**: The Azure Security Center offering does not directly integrate with a virtual network but it can collect data from servers configured with the Log Analytics agent which are deployed on your networks. Your servers that are configured to send data to Security Center require certain ports and protocols to be allowed to communicate properly. Define and enforce standard security configurations for these network resources with Azure Policy.

Use resource tags for network security groups and other resources like servers on your networks that are configured to send security logs to Azure Security Center. For individual network security group rules, use the "Description" field to document the rules that allow traffic to/from a network. 
Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.
You can use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags. 

Data collection in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection

Firewall requirements for using the Log Analytics agent: https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#firewall-requirements

How to create and use tags: 
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags How to create an Azure Virtual Network: 
https://docs.microsoft.com/azure/virtual-network/quick-create-portal How to filter network traffic with network security group rules: 
https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.1: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](None.).

**Guidance**: The Azure Security Center offering does not directly integrate with a virtual network but it can collect data from servers configured with the Log Analytics agent which are deployed on your networks. Your servers that are configured to send data to Security Center require certain ports and protocols to be allowed to communicate properly. Define and enforce standard security configurations for these network resources with Azure Policy.

Use resource tags for network security groups and other resources like servers on your networks that are configured to send security logs to Azure Security Center. For individual network security group rules, use the "Description" field to document the rules that allow traffic to/from a network. 
Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.
You can use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags. 

Data collection in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection

Firewall requirements for using the Log Analytics agent: https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#firewall-requirements

How to create and use tags: 
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags How to create an Azure Virtual Network: 
https://docs.microsoft.com/azure/virtual-network/quick-create-portal How to filter network traffic with network security group rules: 
https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13659).

**Guidance**: The Azure Security Center offering does not directly integrate with a virtual network but it can collect data from servers configured with the Log Analytics agent which are deployed on your networks. Your servers that are configured to send data to Security Center require certain ports and protocols to be allowed to communicate properly. Define and enforce standard security configurations for these network resources with Azure Policy.

You can also use Azure Blueprints to simplify large scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, role assignments, and Azure Policy assignments, in a single blueprint definition. You can apply the blueprint to new subscriptions to deploy Security Center configurations and related networking resources consistently and securely.

Data collection in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection

Firewall requirements for using the Log Analytics agent: https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#firewall-requirements

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage Azure Policy samples for networking: https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#networkHow to create an Azure Blueprint: https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13661).

**Guidance**: Use Azure Activity log to monitor resource configurations and detect changes for network resource related to your Azure Security Center resources. Create alerts in Azure Monitor to notify you when changes to critical resources take place.
How to view and retrieve Azure Activity log events: https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view 
How to create alerts in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13663).

**Guidance**: 
Aggregate security data generated by Azure Security Center and its connected sources using a central Log Analytics workspace. 

Configure Security Center's data collection to send security data and events from your connected Azure compute resources to a central Log Analytics workspace. In addition to data collection, use the continuous export feature to stream security alerts and recommendations generated by Security Center to your central Log Analytics workspace. In Azure Monitor, you can query and perform analytics on the security data generated from Security Center and your connected Azure resources. 
Alternatively, you can send data produced by Security Center to Azure Sentinel or a third-party SIEM.

Export security alerts and recommendations: https://docs.microsoft.com/azure/security-center/continuous-export

Data collection in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard How to collect platform logs and metrics with Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings How to collect Azure Virtual Machine internal host logs with Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/learn/quick-collect-azurevm
How to get started with Azure Monitor and third-party SIEM integration: https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13664).

**Guidance**: Enable the continuous export feature to stream security alerts and recommendations generated by Azure Security Center to a central Log Analytics workspace. Azure Monitor Activity logs are automatically available, these logs contain all write operations for your resource like Azure Security Center including what operations were made, who started the operation, and when they occurred. Send your Azure Activity logs to a Log Analytics workspace for log consolidation and increased retention.
How to collect platform logs and metrics with Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings Understand logging and different log types in Azure: https://docs.microsoft.com/azure/azure-monitor/platform/platform-logs-overview

Send Activity logs to a Log Analytics workspace: https://docs.microsoft.com/azure/azure-monitor/platform/activity-log#send-to-log-analytics-workspace

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13666).

**Guidance**: In Azure Monitor, set your Log Analytics workspace retention period according to your organization's compliance regulations. Use Azure Storage accounts for long-term and archival storage. 
Change the data retention period in Log Analytics: https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period How to configure retention policy for Azure Storage account logs: https://docs.microsoft.com/azure/storage/common/storage-monitor-storage-account#configure-logging

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13667).

**Guidance**: Analyze and monitor logs produced by Azure Security Center and its connected sources for anomalous behavior and regularly review the results. Use Azure Monitor and a Log Analytics workspace to review logs and perform queries on log data.
Alternatively, you can enable and on-board data to Azure Sentinel or a third party SIEM. 
How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard Getting started with Log Analytics queries:
https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal How to perform custom queries in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13668).

**Guidance**: Configure Azure Monitor log alerts to query for unwanted or anomalous activities that are recorded by your activity log or the data produced by Azure Security Center. Set up Action Groups so that your organization is notified and can take action if a log alert is initiated for anomalous activity. Use Security Center workflow automation feature to trigger logic apps on security alerts and recommendations. Security Center workflows can be used to notify users for incident response, or take actions to remediate resources based on the alert information.

Alternatively, you can enable and on-board data related to and produced by Azure Security Center to Azure Sentinel. Azure Sentinel supports playbooks that allow for automated threat responses to security-related issues.

Azure Security Center workflow automation: https://docs.microsoft.com/azure/security-center/workflow-automation

How to manage alerts in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts 

How to alert on log analytics log data: https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response

Set up automated threat responses in Azure Sentinel: https://docs.microsoft.com/azure/sentinel/tutorial-respond-threats-playbook

Log alerts in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-unified-log



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Identity and access control

*For more information, see [Security control: Identity and access control](/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](None.).

**Guidance**: Azure Active Directory provides logs to help discover stale accounts. In addition, use Azure AD identity and access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access related to Azure Security Center can be reviewed on a regular basis to make sure only the right users have continued access. 
Understand Azure AD reporting: https://docs.microsoft.com/azure/active-directory/reports-monitoring/ How to use Azure AD identity and access reviews: 
https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.1: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](None.).

**Guidance**: Azure Active Directory provides logs to help discover stale accounts. In addition, use Azure AD identity and access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access related to Azure Security Center can be reviewed on a regular basis to make sure only the right users have continued access. 
Understand Azure AD reporting: https://docs.microsoft.com/azure/active-directory/reports-monitoring/ How to use Azure AD identity and access reviews: 
https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13674).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts for the Azure Platform or specific to the Azure Security Center offering. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts in Azure Active Directory. Security Center also has a built-in role for 'Security Admin' which allows users to update security policies and dismiss alerts and recommendations, ensure you review and reconcile any users who have this role assignment on a regular basis.Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:- There should be more than one owner assigned to your subscription- Deprecated accounts with owner permissions should be removed from your subscription- External accounts with owner permissions should be removed from your subscription
Permissions in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-permissions

How to use Azure Security Center to monitor identity and access (Preview): https://docs.microsoft.com/azure/security-center/security-center-identity-accessHow to use Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.4: Use Azure Active Directory single sign-on (SSO)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13675).

**Guidance**: Wherever possible, use Azure Active Directory SSO instead of configuring individual stand-alone credentials per-service. Use Azure Security Center identity and access recommendations.
Understand SSO with Azure AD: https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13676).

**Guidance**: Enable Azure Active Directory MFA for accessing Azure Security Center and the Azure portal, follow any Security Center identity and access recommendations. 
How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted How to monitor identity and access within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.6: Use secure, Azure-managed workstations for administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13677).

**Guidance**: Use a secure, Azure-managed workstation (also known as a Privileged Access Workstation, or PAW) for administrative tasks that require elevated privileges.​
Understand secure, Azure-managed workstations: https://docs.microsoft.com/azure/active-directory/devices/concept-azure-managed-workstation​

How to enable Azure AD MFA: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted​


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13678).

**Guidance**: Use Azure Active Directory security reports and monitoring to detect when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

How to identify Azure AD users flagged for risky activity: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk 

How to monitor users' identity and access activity in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13679).

**Guidance**: Use Azure AD named locations to allow access only from specific logical groupings of IP address ranges or countries/regions. 
How to configure Azure AD named locations: 
https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13680).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system when using Azure Security Center. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials. Azure Security Center has a built-in roles that are assignable like 'Security Admin' which allows users to update security policies and dismiss alerts and recommendations.
Permissions in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-permissions

How to create and configure an Azure AD instance: 
https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13682).

**Guidance**: You have access to Azure AD sign-in activity, audit, and risk event log sources, which allow you to integrate with any SIEM/monitoring tool. 
You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired alerts within Log Analytics workspace.  
How to integrate Azure activity logs with Azure Monitor: 
https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account sign-in behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13683).

**Guidance**: Use Azure AD Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation. How to view Azure AD risky sign-ins: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins How to configure and enable Identity Protection risk policies: https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13685).

**Guidance**: Use tags to assist in tracking Azure resources like the Log Analytics workspace which stores sensitive security information from Azure Security Center.
How to create and use tags: 
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13686).

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level. You can restrict the level of access to your Azure resources that your applications and enterprise environments demand. You can control access to Azure resources via Azure Active Directory RBAC.

Azure Security Center uses Log Analytics workspaces to store the data, alerts, and recommendations it generates. To ensure proper separation of information you can configure Security Center data collection and continuous export for different workspaces according to which environment the data originated in.

Export security alerts and recommendations: https://docs.microsoft.com/azure/security-center/continuous-export

Data collection in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection

How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription How to create management groups: https://docs.microsoft.com/azure/governance/management-groups/create 
How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13688).

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater. Any virtual machines that are configured with the Log Analytics agent and to send data to Azure Security center should be configured to use TLS 1.2.Follow Azure Security Center recommendations for encryption at rest and encryption in transit, where applicable. 
Sending data securely to Log Analytics: https://docs.microsoft.com/azure/azure-monitor/platform/data-security#sending-data-securely-using-tls-12

Understand encryption in transit with Azure: https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.6: Use Role-based access controls to control access to resources


>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13690).

**Guidance**: Use Azure role-based access controls to manage access to Azure Security Center related data and resources. Security Center has a built-in roles that are assignable like 'Security Admin' which allows users to update security policies and dismiss alerts and recommendations. The Log Analytics workspace that stores the data collected by Security Center also has built-in roles you can assign like 'Log Analytics Reader', 'Log Analytics Contributor', and others.
Permissions for Azure Log Analytics workspace: https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#log-analytics-reader

Permissions in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-permissions

How to configure RBAC in Azure: https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13692).

**Guidance**: Azure Security Center uses a configured Log Analytics workspace to store the data, alerts, and recommendations it generates. Configure a customer-managed key (CMK) for the workspace that you have configured for Security Center data collection. CMK enables all data saved or sent to the workspace to be encrypted with an Azure Key Vault key created and owned by you. 

Azure Monitor customer-managed key: https://docs.microsoft.com/azure/azure-monitor/platform/customer-managed-keys


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13693).

**Guidance**: Use Azure Monitor to create alerts when changes take place to critical Azure resources related to Azure Security Center. These changes may include any actions that modify configurations related to security center like the disabling of alerts or recommendations, or the update or deletion of data stores.
How to create alerts for Azure Activity log events: 
https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13698).

**Guidance**: Use a common risk scoring program (for example, Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

NIST Publication--Common Vulnerability Scoring System: https://www.nist.gov/publications/common-vulnerability-scoring-system


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13700).

**Guidance**: Use tags to assist in tracking Azure resources like the Log Analytics workspace which stores sensitive security information from Azure Security Center.
How to create and use tags: 
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13701).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Security Center resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.In addition, use Azure policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:- Not allowed resource types- Allowed resource typesHow to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscriptionHow to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/createHow to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and maintain inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13702).

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13703).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions. 
Use Azure Resource Graph to query for and discover resources within their subscriptions.  Ensure that all Azure resources present in the environment are approved. 
How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage How to create queries with Azure Resource Graph Explorer: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13705).

**Guidance**: Remove Azure resources related to Azure Security Center when they are no longer needed as part of your organization's inventory and review process.

Azure resource group and resource deletion: https://docs.microsoft.com/azure/azure-resource-manager/management/delete-resource-group


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13707).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions using the following built-in policy definitions:- Not allowed resource types- Allowed resource typesHow to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manageHow to deny a specific resource type with Azure Policy: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13709).

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.How to configure Conditional Access to block access to Azure Resource Manager: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see [Security control: Secure configuration](/azure/security/benchmarks/security-control-secure-configuration).*

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13714).

**Guidance**: Use Azure Policy effects for 'deny' and 'deploy if not exist' to enforce secure settings across your Azure resources. In addition, you can use Azure Resource Manager templates to maintain the security configuration of your Azure resources required by your organization. 
Understand Azure Policy effects: https://docs.microsoft.com/azure/governance/policy/concepts/effects Create and manage policies to enforce compliance:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage Azure Resource Manager templates overview:  https://docs.microsoft.com/azure/azure-resource-manager/templates/overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13716).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure Policy definitions, Azure Resource Manager templates and desired state configuration scripts. To access the resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS. 
How to store code in Azure DevOps:  https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops About permissions and groups in Azure DevOps:  https://docs.microsoft.com/azure/devops/organizations/security/about-permissions

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13718).

**Guidance**: Define and implement standard security configurations for Azure resources using Azure Policy. Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure Security Center related resources. Additionally, you can use Azure Automation to deploy configuration changes. 
How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage How to use aliases: https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13720).

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.OperationalInsights" and "Microsoft. Security" namespaces to create custom policies to alert, audit, and enforce Azure resource configurations. Use Azure policy effects "audit", "deny", and "deploy if not exist" to automatically enforce configurations for your Azure resources.How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13722).

**Guidance**: Azure Security Center uses a configured Log Analytics workspace to store the data, alerts, and recommendations it generates. Configure a customer-managed key (CMK) for the workspace that you have configured for Security Center data collection. CMK enables all data saved or sent to the workspace to be encrypted with an Azure Key Vault key created and owned by you. 

Azure Monitor customer-managed key: https://docs.microsoft.com/azure/azure-monitor/platform/customer-managed-keys



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13724).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.How to setup Credential Scanner: https://secdevtools.azurewebsites.net/helpcredscan.html

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](/azure/security/benchmarks/security-control-malware-defense).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13726).

**Guidance**: Azure Security Center is not intended to store or process files. It is your responsibility to pre-scan any content being uploaded to non-compute Azure resources, including Log Analytics workspace.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data recovery

*For more information, see [Security control: Data recovery](/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back-ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13728).

**Guidance**: Follow an infrastructure as code (IAC) approach and use Azure Resource Manager to deploy your Azure Security Center related resources in a Java Script Object Notation (JSON) template which can be used as backup for resource related configurations.
Single and multi-resource export to a template in Azure portal: https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal

Azure resource manager templates for security resource: https://docs.microsoft.com/azure/templates/microsoft.security/allversions

About Azure Automation: https://docs.microsoft.com/azure/automation/automation-intro


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13729).

**Guidance**: Azure Security Center uses a Log Analytics workspace to store the data, alerts, and recommendations that it generates. You can configure Azure Monitor and the workspace that Security Center uses to enable a customer-managed key. If you are using a Key Vault to store your customer-managed keys, ensure regular automated backups of your keys.How to backup Key Vault Keys: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13730).

**Guidance**: Ensure ability to periodically perform restoration using Azure Resource Manager backed template files. Test restoration of backed up customer managed keys.

Manage Log Analytics workspace using Azure Resource Manager templates:  https://docs.microsoft.com/azure/azure-monitor/platform/template-workspace-configuration

How to restore key vault keys in Azure:  https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13731).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure Policy definitions and Azure Resource Manager templates. To protect resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS. Use role-based access control to protect customer managed keys.

Additionally, Enable Soft-Delete and purge protection in Key Vault to protect keys against accidental or malicious deletion.  If Azure Storage is used to store Azure Resource Manager template backups, enable soft delete to save and recover your data when blobs or blob snapshots are deleted. 

How to store code in Azure DevOps:  https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

About permissions and groups in Azure DevOps:  https://docs.microsoft.com/azure/devops/organizations/security/about-permissions

How to enable Soft-Delete and Purge protection in Key Vault:  https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal 

Soft delete for Azure Storage blobs:  https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13732).

**Guidance**: Develop an incident response guide for your organization. Ensure there are written incident response plans that define all the roles of personnel as well as the phases of incident handling and management from detection to post-incident review. 
Guidance on building your own security incident response process: https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/ Microsoft Security Response Center's Anatomy of an Incident: https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/ Use NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan: https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13733).

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.
Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It's your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred. 
Security alerts in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-alerts-overview Use tags to organize your Azure resources: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13738).

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and then revise your response plan as needed. 
NIST's publication--Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities: https://csrc.nist.gov/publications/detail/sp/800-84/final


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13734).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved. How to set the Azure Security Center security contact: https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13735).

**Guidance**: Export your Azure Security Center alerts and recommendations using the continuous export feature to help identify risks to Azure resources. Continuous export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You can use the Azure Security Center data connector to stream the alerts to Azure Sentinel. 
How to configure continuous export: https://docs.microsoft.com/azure/security-center/continuous-export How to stream alerts into Azure Sentinel: https://docs.microsoft.com/azure/sentinel/connect-azure-security-center

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13736).

**Guidance**: Use workflow automation feature Azure Security Center to automatically trigger responses to security alerts and recommendations to protect your Azure resources. 
How to configure workflow automation in Security Center: https://docs.microsoft.com/azure/security-center/workflow-automation


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13737).

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 
Penetration Testing Rules of Engagement:  https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1 Microsoft Cloud Red Teaming:  https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
