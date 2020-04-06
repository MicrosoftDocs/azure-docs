---
title: Azure Security Baseline for Azure Databricks
description: Azure Security Baseline for Azure Databricks
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/06/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure Security Baseline for Azure Databricks

The Azure Security Baseline for Azure Databricks contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see [Security Control: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2809).

**Guidance**: Deploy Azure Databricks in your own Azure virtual network (VNet). The default deployment of Azure Databricks is a fully managed service on Azure: all data plane resources, including a VNet that all clusters will be associated with, are deployed to a locked resource group. If you require network customization, however, you can deploy Azure Databricks data plane resources in your own virtual network (sometimes called VNet injection), enabling you to implement custom network configurations, such as applying your own Network Security Group with custom rules to specify egress traffic restrictions.

Additionally, you may configure network security group (NSG) rules to specify egress traffic restrictions on the subnet that your Azure Databricks instance is deployed to.

How to deploy Azure Databricks into your own Virtual Network: https://docs.microsoft.com/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject

How to manage NSGs: https://docs.microsoft.com/azure/virtual-network/manage-network-security-group

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICS

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2810).

**Guidance**: Deploy Azure Databricks in your own Azure virtual network (VNet); this will automatically create a network security group (NSG) with rules configured that are required for the functionality of your Azure Data Bricks implementation. Enable NSG flow logs and send logs into a storage account for traffic audit. You may also send flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

How to deploy Azure Databricks into your own Virtual Network: https://docs.microsoft.com/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject

How to Enable NSG Flow Logs: https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to Enable and use Traffic Analytics: https://docs.microsoft.com/azure/network-watcher/traffic-analytics

How to enable Network Watcher: https://docs.microsoft.com/azure/network-watcher/network-watcher-create

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2811).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.4: Deny communications with known malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2812).

**Guidance**: Enable Azure DDoS Protection Standard on the Azure Virtual Networks associated with your Azure Databricks instances for protection against distributed denial-of-service attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused public IP addresses.

Manage Azure DDoS Protection Standard using the Azure portal: https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection

Understand threat protection for Azure network layer in Azure Security Center: https://docs.microsoft.com/azure/security-center/threat-protection#threat-protection-for-azure-network-layer-

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2813).

**Guidance**: Deploy Azure Databricks in your own Azure virtual network (VNet); this will automatically create a network security group (NSG) with rules configured that are required for the functionality of your Azure Data Bricks implementation. Enable NSG flow logs and send logs into a storage account for traffic audit. You may also send flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

How to deploy Azure Databricks into your own Virtual Network: https://docs.microsoft.com/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject

How to Enable NSG Flow Logs: https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to Enable and use Traffic Analytics: https://docs.microsoft.com/azure/network-watcher/traffic-analytics

How to enable Network Watcher: https://docs.microsoft.com/azure/network-watcher/network-watcher-create

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2814).

**Guidance**: Implement an IDP/IPS capable network virtual appliance (NVA) from the Azure Marketplace to create a virtual network integrated workspace in which all Azure Databricks clusters have a single IP outbound address. The single IP address can be used as an additional security layer with other Azure services and applications that allow access based on specific IP addresses.

If intrusion detection and/or prevention based on payload inspection is not a requirement, Azure Firewall with Threat Intelligence can be used. Azure Firewall Threat intelligence-based filtering can alert and deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

How to Assign a Single Public IP for VNet-Injected Workspaces Using Azure Firewall: https://docs.microsoft.com/azure/databricks/kb/cloud/azure-vnet-single-ip

How to create an NVA: https://docs.microsoft.com/azure/virtual-network/tutorial-create-route-table-portal

Azure Marketplace: https://azuremarketplace.microsoft.com/marketplace/?term=Firewall

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2815).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2816).

**Guidance**: Use Service Tags to define network access controls on Network Security Groups that are attached to the Subnets your Azure Databricks instance is associated with. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Understand Service Tags: https://docs.microsoft.com/azure/virtual-network/service-tags-overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2817).

**Guidance**: Define and implement network security configurations for your Azure Databricks instances with Azure Policy. You may use Azure Policy aliases in the "Microsoft.Databricks" namespace to define custom policy definitions.

You may also use Azure Blueprints to simplify large scale Azure deployments by packaging key environment artifacts, such as Azure Resource Management templates, Role-based access control (RBAC), and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understand Azure Policy aliases and definition structure: https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure

How to create an Azure Blueprint: https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2818).

**Guidance**: Use Tags for NSGs and other resources related to network security and traffic flow that are associated with your Azure Databricks instance. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

How to create and use Tags:
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2819).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Databricks instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

How to view and retrieve Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view

How to create alerts in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2820).

**Guidance**: Microsoft maintains time sources for Azure resources, however, you have the option to manage the time synchronization settings for your compute resources.

How to configure time synchronization for Azure compute resources: https://docs.microsoft.com/azure/virtual-machines/windows/time-sync

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2821).

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by Azure Databricks. Within Azure Monitor, you are able to query the Log Analytics workspace which is configured to receive your Databricks and activity logs. Use Azure Storage Accounts for long-term/archival log storage or event hubs for exporting data to other systems. Alternatively, you may enable, and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM).

Note: Azure Databricks diagnostic logs require the Azure Databricks Premium Plan

How to configure diagnostic settings: https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings#create-diagnostic-settings-in-azure-portal

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

How to get started with Azure Monitor and third-party SIEM integration: https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2822).

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure resources.

For data plane audit logging, Azure Databricks provides comprehensive end-to-end diagnostic logs of activities performed by Azure Databricks users, allowing your enterprise to monitor detailed Azure Databricks usage patterns.

Note: Azure Databricks diagnostic logs require the Azure Databricks Premium Plan

How to enable Diagnostic Settings for Azure Activity Log: https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

How to enable Diagnostic Settings for Azure Databricks: https://docs.microsoft.com/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2823).

**Guidance**: Azure Databricks provides comprehensive end-to-end diagnostic logs of activities performed by Azure Databricks users, allowing your enterprise to monitor detailed Azure Databricks usage patterns.

Note: Azure Databricks diagnostic logs require the Azure Databricks Premium Plan

How to enable Diagnostic Settings for Azure Activity Log: https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy

How to enable Diagnostic Settings for Azure Databricks: https://docs.microsoft.com/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2824).

**Guidance**: Enable diagnostic settings for Azure Databricks. If choosing to store logs in a Log Analytics Workspace, set your Log Analytics Workspace retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

Note: Azure Databricks diagnostic logs require the Azure Databricks Premium Plan

How to enable diagnostic settings in Azure Databricks: https://docs.microsoft.com/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs

How to set log retention parameters for Log Analytics Workspaces: https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2825).

**Guidance**: Enable diagnostic settings for Azure Databricks and send logs to a Log Analytics workspace. Use the Log Analytics workspace to analyze and monitor your Azure Databricks logs for anomalous behavior and regularly review results.

Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM. 

Note: Azure Databricks diagnostic logs require the Azure Databricks Premium Plan

How to enable diagnostic settings in Azure Databricks: https://docs.microsoft.com/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs

How to query Azure Databricks logs sent to Log Analytics Workspace: https://docs.microsoft.com/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs#analyze-diagnostic-logs

How to onboard Azure Sentinel https://docs.microsoft.com/azure/sentinel/quickstart-onboard


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2826).

**Guidance**: Configure diagnostic settings for your Azure Databricks instance and send logs to Log Analytics workspace. Within your Log Analytics workspace, configure alerts to take place for when a pre-defined set of conditions takes place.

Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM.

 

Note: Azure Databricks diagnostic logs require the Azure Databricks Premium Plan

How to send Azure Databricks logs to Log Analytics Workspace: https://docs.microsoft.com/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs#configure-diagnostic-log-delivery)

How to configure alerts in Log Analytics Workspace: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-log

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2827).

**Guidance**: Not applicable; Azure Databricks does not process or produce anti-malware related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS Query Logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2828).

**Guidance**: Not applicable; Azure Databricks does not process or produce user accessible DNS-related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2829).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and Access Control

*For more information, see [Security Control: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2830).

**Guidance**: Azure AD has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups that have administrative access to the control plane of your Azure Databricks instances.

For accounts within Azure Databricks, ensure that you track and reconcile user access on a regular basis.

How to get a directory role in Azure AD with PowerShell: https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0

How to get members of a directory role in Azure AD with PowerShell: https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0

How to add and removes users in Azure Databricks: https://docs.microsoft.com/azure/databricks/administration-guide/users-groups/users

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2831).

**Guidance**: Azure Databricks uses Azure Active Directory (AD) to provide access to the Azure portal as well as the Azure Databricks admin console. Azure AD does not have the concept of default passwords, however, you are responsible to change or not permit default passwords for any custom or third-party applications.



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2832).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts for access to the Azure control plane (Azure portal) as well as the Azure Databricks admin console. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts within Azure AD.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:

- There should be more than one owner assigned to your subscription

- Deprecated accounts with owner permissions should be removed from your subscription

- External accounts with owner permissions should be removed from your subscription

How to use Azure Security Center to monitor identity and access (Preview):  https://docs.microsoft.com/azure/security-center/security-center-identity-access

How to use Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to manage users in the Azure Databricks admin console: https://docs.microsoft.com/azure/databricks/administration-guide/users-groups/users

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2833).

**Guidance**: Azure Databricks is automatically setup to use Azure Active Directory single sign-on to authenticate users. Users outside of your organization must complete the invitation process and be added to your Active Directory tenant before they are able to login to Azure Databricks via single sign-on.

Understand single sign-on for Azure Databricks: https://docs.microsoft.com/azure/databricks/administration-guide/users-groups/single-sign-on/

How to invite users to your Azure AD tenant: https://docs.microsoft.com/azure/role-based-access-control/role-assignments-external-users


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 3.5: Use multi-factor authentication for all Azure Active Directory based access.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2834).

**Guidance**: Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations.

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

How to monitor identity and access within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2835).

**Guidance**: Use PAWs (privileged access workstations) with MFA configured to log into and configure Azure resources.

Learn about Privileged Access Workstations: https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2836).

**Guidance**: Use Azure Active Directory security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

How to identify Azure AD users flagged for risky activity: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk

How to monitor users' identity and access activity in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2837).

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

How to configure Named Locations in Azure: https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2838).

**Guidance**: Azure Databricks is automatically setup to use Azure Active Directory 
single sign-on to authenticate users. Users outside of your organization
 must complete the invitation process and be added to your Active 
Directory tenant before they are able to login to Azure Databricks via 
single sign-on.

Understand single sign-on for Azure 
Databricks: 
https://docs.microsoft.com/azure/databricks/administration-guide/users-groups/single-sign-on/

How
 to invite users to your Azure AD tenant: 
https://docs.microsoft.com/azure/role-based-access-control/role-assignments-external-users


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2839).

**Guidance**: Azure AD provides logs to help discover stale accounts. In addition, use Azure identity access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access. 

In addition, regularly review and manage user access within the Azure Databricks admin console.

Azure AD Reporting: https://docs.microsoft.com/azure/active-directory/reports-monitoring/

How to use Azure identity access reviews: https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview

How to manage user access within the Azure Databricks admin console: https://docs.microsoft.com/azure/databricks/administration-guide/users-groups/users



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2840).

**Guidance**: You have access to Azure AD Sign-in Activity, Audit and Risk Event log sources, which allow you to integrate with any SIEM/Monitoring tool.

You can streamline this process by creating Diagnostic Settings for Azure Active Directory user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. You can configure desired Alerts within Log Analytics Workspace.

How to integrate Azure Activity Logs into Azure Monitor: https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2841).

**Guidance**: Use Azure AD Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

How to view Azure AD risky sign-ins: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins

How to configure and enable Identity Protection risk policies: https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2842).

**Guidance**: Currently not available; Customer Lockbox is not yet supported for Azure Databricks.
List of Customer Lockbox supported services: https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Currently not available

## Data Protection

*For more information, see [Security Control: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2843).

**Guidance**: Use Tags to assist in tracking Azure resources that store or process sensitive information.

How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2844).

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. The default deployment of Azure Databricks is a fully managed service that is deployed within its own virtual network. If you require network customization, you can deploy Azure Databricks in your own virtual network.

How to deploy Azure Databricks into your own Virtual Network: https://docs.microsoft.com/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject

How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create

How to create a Virtual Network: https://docs.microsoft.com/azure/virtual-network/quick-create-portal


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2845).

**Guidance**: Currently not available; data identification, classification, and 
loss prevention features are not yet available for Azure Databricks.

Microsoft
 manages the underlying infrastructure for Azure Databricks and has 
implemented strict controls to prevent the loss or exposure of customer 
data.

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Currently not available

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2846).

**Guidance**: Microsoft will negotiate TLS 1.2 by default when administering your Azure Databricks instance through the Azure portal or Azure Databricks console.



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2847).

**Guidance**: Currently not available; data identification, classification, and loss prevention features are not yet available for Azure Databricks. Tag Azure Databricks instances and related resources that may be processing sensitive information as such and implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Currently not available

### 4.6: Use Azure RBAC to control access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2848).

**Guidance**: In Azure Databricks, you can use access control lists (ACLs) to configure permission to access data tables, clusters, pools, jobs, and workspace objects like notebooks, experiments, and folders. All admin users can manage access control lists, as can users who have been given delegated permissions to manage access control lists.

Note: Table, cluster, pool, job, and workspace access control are available only in the Azure Databricks Premium Plan

How to manage access control in Azure Databricks: https://docs.microsoft.com/azure/databricks/administration-guide/access-control/



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.7: Use host-based Data Loss Prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2849).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft
 manages the underlying infrastructure for Azure Databricks and has 
implemented strict controls to prevent the loss or exposure of customer 
data.

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2850).

**Guidance**: An Azure Databricks workspace comprises a management plane that is hosted in an Azure Databricks managed virtual network and a data plane that is deployed in a customer-managed virtual network. The control plane stores all users’ notebooks and associated notebook results in a database. By default, all notebooks and results are encrypted at rest with a different encryption key.

If your security and compliance requirements mean that you must own and manage the key used for encrypting your notebooks and results yourself, you can use the instructions in this article to provide your own key for encrypting all data in the Azure Databricks hosted control plane.

Databricks File System (DBFS) is a distributed file system mounted into an Azure Databricks workspace and available on Azure Databricks clusters. DBFS is implemented as a Storage Account in your Azure Databricks workspace’s managed resource group. By default, the storage account is encrypted with Microsoft-managed keys.

With customer-managed keys (CMK) for default (root) DBFS, you can use your own encryption key to encrypt the DBFS storage account.

Note: These features are not available for all Azure Databricks subscriptions. Contact your Microsoft or Databricks account representative to request access.

How to enable customer-managed keys for Azure Databricks notebooks: https://docs.microsoft.com/azure/databricks/security/customer-managed-key-notebook

How to enable customer-managed keys for Azure Databricks File System: https://docs.microsoft.com/azure/databricks/security/customer-managed-keys-dbfs

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2851).

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to critical Azure Databricks workspaces.

How to create alerts for Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Vulnerability Management

*For more information, see [Security Control: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2852).

**Guidance**: Implement a third-party vulnerability management solution.

If you have a Rapid7, Qualys, or any other vulnerability 
management platform subscription, you may use Azure Databricks initialization scripts to install 
vulnerability assessment agents on your Azure Databricks cluster nodes 
and manage the nodes through the respective portal.

How to Install Rapid7 Agent Manually: https://insightagent.help.rapid7.com/docs/install

How to install Qualys Agent Manually: https://www.qualys.com/docs/qualys-cloud-agent-linux-install-guide.pdf

Azure Databricks initialization scripts: https://docs.microsoft.com/azure/databricks/clusters/init-scripts



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2853).

**Guidance**: Microsoft maintains the Azure Databricks cluster node base images, however you are responsible for ensuring than your cluster nodes remain patched. To add a maintenance update to an existing cluster, you must restart the cluster.

Understand Runtime maintenance updates for Azure Databricks: https://docs.microsoft.com/azure/databricks/release-notes/runtime/maintenance-updates



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.3: Deploy automated third party software patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2854).

**Guidance**: Microsoft maintains the Azure Databricks cluster node base images, 
however you are responsible for ensuring that any third-party applications you install remain patched.



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2855).

**Guidance**: Implement a third-party vulnerability management solution which has the 
ability to compare vulnerability scans over time. If you have a Rapid7, Qualys, or other third-party vulnerability management subscription, you may use that vendor's portal to view and 
compare back-to-back vulnerability scans.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2856).

**Guidance**: Use a common risk scoring program (e.g. Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Inventory and Asset Management

*For more information, see [Security Control: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2857).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s).  Ensure appropriate (read) permissions exist in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use ARM resources going forward.

How to create queries with Azure Resource Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

How to view your Azure Subscriptions: https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

Understanding Azure RBAC: https://docs.microsoft.com/azure/role-based-access-control/overview


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2858).

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2859).

**Guidance**: Use tagging, management groups, and separate subscriptions, where 
appropriate, to organize and track Azure resources. Reconcile inventory 
on a regular basis and ensure unauthorized resources are deleted from 
the subscription in a timely manner.

In addition, use Azure 
policy to put restrictions on the type of resources that can be created 
in customer subscription(s) using the following built-in policy 
definitions:

- Not allowed resource types
- Allowed resource types

How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Maintain inventory of approved Azure resources and software titles.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2860).

**Guidance**: Define approved Azure resources and approved software for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2861).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Use Azure Resource Graph to query/discover resources within their subscription(s). Ensure that all Azure resources present in the environment are approved.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2862).

**Guidance**: Implement a third-party solution to monitor Azure Databricks cluster nodes for unapproved software applications.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2863).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as 
compute, storage, network, ports, and protocols etc.), including Azure 
Databricks instances, within your subscription(s).  Remove any unapproved 
Azure resources that you discover. For Azure Databricks cluster nodes, 
implement a third-party solution to remove or alert on unapproved 
software.

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2864).

**Guidance**: For Azure Databricks cluster nodes, implement a third-party solution to prevent unauthorized software from executing.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2865).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can 
be created in customer subscription(s) using the following built-in 
policy definitions:

- Not allowed resource types
- Allowed resource types

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How
 to deny a specific resource type with Azure Policy: 
https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Implement approved application list

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2866).

**Guidance**: For Azure Databricks cluster nodes, implement a third-party solution to prevent unauthorized file types from executing.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with ARM via scripts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2867).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact 
with Azure Resource Manager by configuring "Block access" for the 
"Microsoft Azure Management" App.

How to configure Conditional Access to block access to Azure Resource Manager: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' Ability to execute scripts within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2868).

**Guidance**: Not applicable; this is not applicable to Azure Databricks as users 
(non-administrators) of the cluster do not need access to the individual
 nodes to run jobs. The cluster administrator has root access to all 
cluster nodes by default.



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2869).

**Guidance**: Not applicable; benchmark is intended for Azure Apps Service or compute resources hosting web applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure Configuration

*For more information, see [Security Control: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2870).

**Guidance**: Define and implement standard security configurations for your Azure 
Databricks instances with Azure Policy. Use Azure Policy aliases in the 
"Microsoft.Databricks" namespace to create custom policies to audit or enforce 
the configuration of your Azure Databricks instances.

How
 to view available Azure Policy Aliases: 
https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2871).

**Guidance**: Azure Databricks operating system images are managed and maintained by Microsoft. You are responsible for implementing secure configurations for your cluster nodes' operating systems. 


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2872).

**Guidance**: Define and implement standard security configurations for your Azure 
Databricks instances with Azure Policy. Use Azure Policy aliases in the 
"Microsoft.Databricks" namespace to create custom policies to audit or enforce 
the configuration of your Azure Databricks instances. Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understand Azure Policy Effects: https://docs.microsoft.com/azure/governance/policy/concepts/effects

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2873).

**Guidance**: Azure Databricks operating system Images managed and maintained by Microsoft. You are responsible for implementing OS-level state configuration.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2874).

**Guidance**: If using custom Azure policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

How to store code in Azure DevOps: https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

Azure Repos Documentation: https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2875).

**Guidance**: If using custom images for your Azure Databricks cluster nodes, push your custom base image to a Docker registry such as Azure Container Registry (ACR).

How to customize containers with Databricks Container Services: https://docs.microsoft.com/azure/databricks/clusters/custom-containers

Understand Azure Container Registry: https://docs.microsoft.com/azure/container-registry/container-registry-intro



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy system configuration management tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2876).

**Guidance**: Define and implement standard security configurations for your Azure Databricks instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.Databricks" namespace to create custom policies to audit or enforce the configuration of your Azure Databricks instances.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to view available Azure Policy Aliases: https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2877).

**Guidance**: Implement a third-party solution to maintain desired state for your Azure Databricks cluster node operating systems.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement automated configuration Monitoring for Azure Services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2878).

**Guidance**: Define and implement standard security configurations for your Azure 
Databricks instances with Azure Policy. Use Azure Policy aliases in the 
"Microsoft.Databricks" namespace to create custom policies to audit or enforce 
the configuration of your Azure Databricks instances.

How
 to view available Azure Policy Aliases: 
https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2879).

**Guidance**: Implement a third-party solution to monitor the state of your Azure Databricks cluster node operating systems.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2880).

**Guidance**: Use Azure Key Vault with an Azure Databricks secret scope to securely manage and use secrets.

How to use Azure Key Vault with Azure Databricks: https://docs.microsoft.com/azure/azure-databricks/store-secrets-azure-key-vault


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2881).

**Guidance**: Currently not available; Managed Identities are currently not available for Azure Databricks

Services that support managed identities for Azure resources: https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Currently not available

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2882).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

How to setup Credential Scanner: https://secdevtools.azurewebsites.net/helpcredscan.html

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware Defense

*For more information, see [Security Control: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2883).

**Guidance**: Implement a third-party antimalware solution. You may use Azure Databricks initialization scripts to install your own antimalware solution on your Azure Databricks cluster nodes.

Azure Databricks initialization scripts: https://docs.microsoft.com/azure/databricks/clusters/init-scripts



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2884).

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on your content.

Pre-scan any files being uploaded to your Azure Databricks cluster nodes or related resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2885).

**Guidance**: Implement a third-party antimalware solution. You may use Azure 
Databricks initialization scripts to install your own antimalware 
solution on your Azure Databricks cluster nodes. Ensure your antimalware software and signatures are up to date.

Azure Databricks initialization scripts: https://docs.microsoft.com/azure/databricks/clusters/init-scripts



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data Recovery

*For more information, see [Security Control: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2886).

**Guidance**: For your Azure Databricks data sources, ensure you have configured an appropriate level of data redundancy for your use case. For example, if using an Azure Storage account for your Azure Databricks data 
store, choose the appropriate redundancy option (LRS, ZRS, GRS, RA-GRS). 

How to configure storage redundancy for Azure Storage Accounts: https://docs.microsoft.com/azure/storage/common/storage-redundancy

How to use Azure blob storage with Azure Databricks: https://docs.microsoft.com/azure/databricks/data/data-sources/azure/azure-storage



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2887).

**Guidance**: Backup any customer managed keys related to your Azure Databricks implementations within Azure Key Vault.

How to backup key vault keys in Azure: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2888).

**Guidance**: Test restoration of backed up customer managed keys related to your Azure Databricks implementations.

How to restore key vault keys in Azure: https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2889).

**Guidance**: Ensure Soft-Delete is enabled in Key Vault to protect keys against accidental or malicious deletion.

How to enable Soft-Delete in Key Vault: https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident Response

*For more information, see [Security Control: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2890).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

How to configure Workflow Automations within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide

Guidance on building your own security incident response process: https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/

Microsoft Security Response Center's Anatomy of an Incident: https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/

You may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2891).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2896).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications &nbsp;for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2892).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

How to set the Azure Security Center Security Contact: https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2893).

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

How to configure continuous export: https://docs.microsoft.com/azure/security-center/continuous-export

How to stream alerts into Azure Sentinel: https://docs.microsoft.com/azure/sentinel/connect-azure-security-center


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2894).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

How to configure Workflow Automation and Logic Apps: https://docs.microsoft.com/azure/security-center/workflow-automation

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see [Security Control: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings within 60 days.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2895).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies: https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1

You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here: https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure Security Baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
