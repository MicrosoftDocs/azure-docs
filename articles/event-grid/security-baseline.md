---
title: Azure security baseline for Event Grid
description: The Event Grid security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: event-grid
ms.topic: conceptual
ms.date: 07/27/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Event Grid

The Azure Security Baseline for Event Grid contains recommendations that will help you improve the security posture of your deployment. The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance. For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see [Security control: Network security](/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32613).

**Guidance**: You can use private endpoints to allow ingress of events directly from your virtual network to your Event Grid topics and domains securely over a private link without going through the public internet. When you create a private endpoint for your Event Grid topic or domain, it provides secure connectivity between clients on your VNet and your Event Grid resource. The private endpoint is assigned an IP address from the IP address range of your VNet. The connection between the private endpoint and the Event Grid service uses a secure private link.

Azure Event Grid supports IP-based access controls for publishing to topics and domains. With IP-based controls, you can limit the publishers to a topic or domain to only a set of approved set of machines and cloud services. This feature complements the authentication mechanisms supported by Event Grid.

- [More details on Event Grid Private Endpoints](https://docs.microsoft.com/azure/event-grid/network-security#private-endpoints)
- [More details on Event Grid IP Firewall](https://docs.microsoft.com/azure/event-grid/network-security#ip-firewall)
- [Azure Event Grid Network Security](https://docs.microsoft.com/azure/event-grid/network-security) 
- [Azure Private Link Overview](https://docs.microsoft.com/azure/private-link/private-link-overview)
- [Azure Network Security Group](https://docs.microsoft.com/azure/virtual-network/security-overview)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32614).

**Guidance**: Use Azure Security Center and follow the network protection recommendations to help secure your Azure network resources. Enable network security group flow logs and send the logs to an Azure Storage account for auditing. You can also send the flow logs to a Log Analytics workspace and then use Traffic Analytics to provide insights into traffic patterns in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity, identify hot spots and security threats, understand traffic flow patterns, and pinpoint network misconfigurations.
 
 
 
- [ How to enable network security group flow logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)
 
 
 
- [ How to enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)
 
 
 
- [ Understand network security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32615).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 1.4: Deny communications with known malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32616).

**Guidance**: Enable DDoS Protection Standard on the virtual networks associated with your Event Grid to guard against distributed denial-of-service (DDoS) attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to configure DDoS protection](https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection)

- [For more information about the Azure Security Center Integrated Threat Intelligence](https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 1.5: Record network packets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32617).

**Guidance**: Enable network security group (NSG) flow logs and send logs into a storage account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

If required for investigating anomalous activity, enable Network Watcher packet capture.

- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

- [How to enable Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32618).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32619).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32620).

**Guidance**: For resources that need access to your Azure Event Grig, use Virtual Network service tags to define network access controls on network security Groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., AzureEventGrid) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [How to use service tag for Azure Event Grid](https://docs.microsoft.com/azure/event-grid/network-security#service-tags)
- [For more information about using service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32621).

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Event Grid namespaces with Azure Policy. Use Azure Policy aliases in the "Microsoft.EventGrid" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Machine Learning namespaces. 

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32622).

**Guidance**: Use tags for network resources associated with your Azure Event Grid deployment in order to logically organize them into a taxonomy.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32623).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to Azure Event Grid. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32624).

**Guidance**: Microsoft maintains the time source used for Azure resources such as Azure Event Grid for timestamps in the logs.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32625).

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by Azure Event Grid. Within the Azure Monitor, use Log Analytics workspace(s) to query and perform analytics, and use storage accounts for long-term/archival storage. Alternatively, you may enable, and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM).

- [How to enable diagnostic logs for Azure Event Grid](https://docs.microsoft.com/azure/event-grid/diagnostic-logs)
- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32626).

**Guidance**: How this is different from config enable?

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 2.4: Collect security logs from operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32627).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32628).

**Guidance**: In Azure Monitor, set the log retention period for Log Analytics workspaces associated with your Azure Event Grid instances according to your organization's compliance regulations.

- [How to set log retention parameters](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 2.6: Monitor and review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32629).

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review the results from your Azure Event Grid. Use Azure Monitor and a Log Analytics workspace to review logs and perform queries on log data.

Alternatively, you can enable and on-board data to Azure Sentinel or a third party SIEM. 

- [How to perform queries for Azure Event Grid in Log Analytics Workspaces](https://docs.microsoft.com/azure/event-grid/diagnostic-logs)
- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)
 
 
 
- [ Getting started with Log Analytics queries](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal)
 
 
 
- [ How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32630).

**Guidance**: Within Azure Monitor, configure logs related to Azure Event Grid within the Activity Log, and Event grid diagnostic settings to send logs into a Log Analytics workspace to be queried or into a storage account for long-term archival storage. Use Log Analytics workspace to create alerts for anomalous activity found in security logs and events.

Alternatively, you may enable and on-board data to Azure Sentinel.

- [How to alert on Log Analytics workspace log data](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response)
- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32631).

**Guidance**: Not applicable; Azure Event Grid does not process or produce anti-malware related logs.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 2.9: Enable DNS query logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32632).

**Guidance**: Not applicable; Azure Event Grid does not process or produce DNS-related logs.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32633).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

## Identity and access control

*For more information, see [Security control: Identity and access control](/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32634).

**Guidance**: You can use the Identity and Access control (IAM) pane in the Azure portal to configure role-based access control (RBAC) and maintain inventory on Azure Machine Learning resources. The roles are applied to users, groups, service principals, and managed identities in Active Directory. You can use built-in roles or custom roles for individuals and groups.

Azure Machine Learning provides built-in RBAC for common management scenarios in Azure Machine Learning. An individual who has a profile in Azure Active Directory (AD) can assign these RBAC roles to users, groups, service principals, or managed identities to grant or deny access to resources and operations on Azure Machine Learning resources.

You can also use the Azure AD PowerShell module to perform adhoc queries to discover accounts that are members of administrative groups.

- [Understand role-based access control in Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/how-to-assign-roles)
- [How to get a directory role in Azure Active Directory with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)
- [How to get members of a directory role in Azure Active Directory with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.2: Change default passwords where applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32635).

**Guidance**: Access management to Machine Learning resources is controlled through Azure Active Directory (AD). Azure AD does not have the concept of default passwords.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32636).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:
* There should be more than one owner assigned to your subscription
* Deprecated accounts with owner permissions should be removed from your subscription
* External accounts with owner permissions should be removed from your subscription

- [How to use Azure Security Center to monitor identity and access (Preview)](https://docs.microsoft.com/azure/security-center/security-center-identity-access)
- [How to use Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32637).

**Guidance**: No information about Event Grid is integrated with Azure Active Directory or not or SSO, needs service team to confirm

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32638).

**Guidance**: Enable Azure Active Directory Multi-Factor Authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)
- [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32639).

**Guidance**: Use Privileged Access Workstations (PAW) with Multi-Factor Authentication configured to log into and configure Azure resources.

- [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)
- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32640).

**Guidance**: Use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure AD risk detections to view alerts and reports on risky user behavior. For additional logging, send Azure Security Center risk detection alerts into Azure Monitor and configure custom alerting/notifications using action groups.

- [How to deploy Privileged Identity Management (PIM)](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan)
- [Understand Azure AD risk detections](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events)
- [How to configure action groups for custom alerting and notification](https://docs.microsoft.com/azure/azure-monitor/platform/action-groups)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.8: Manage Azure resources only from approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32641).

**Guidance**: Use Azure AD named locations to allow access only from specific logical groupings of IP address ranges or countries/regions.
 
 
 
- [ How to configure Azure AD named locations](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32642).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.
 
 
 
- [ How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32643).

**Guidance**: Azure AD provides logs to help discover stale accounts. In addition, use Azure AD identity and access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right users have continued access. 
 
 
 
- [ Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/)
 
 
 
- [ How to use Azure AD identity and access reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32644).

**Guidance**: You have access to Azure AD sign-in activity, audit, and risk event log sources, which allow you to integrate with any SIEM/monitoring tool.
 
 
 
 You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired alerts within Log Analytics workspace.
 
 
 
- [ How to integrate Azure activity logs with Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.12: Alert on account login behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32645).

**Guidance**: Use Azure AD Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.
 
 
 
- [ How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)
 
 
 
- [ How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)
 
 
 
- [ How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32646).

**Guidance**: ???Currently not available; Customer Lockbox not yet supported for Azure Database for Event Grid.

- [Understand Customer Lockbox](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

## Data protection

*For more information, see [Security control: Data protection](/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32647).

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.
 
 
 
- [ How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32648).

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level. You can restrict the level of access to your Azure resources that your applications and enterprise environments demand. You can control access to Azure resources via Azure Active Directory RBAC.
 
 
 
- [ How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)
 
 
 
- [ How to create management groups](https://docs.microsoft.com/azure/governance/management-groups/create)
 
 
 
- [ How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32649).

**Guidance**: sensitive info needs data classification, is it supported in EG???

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32650).

**Guidance**: No information available about Event Grid on TLS support,

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32651).

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Machine Learning. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 4.6: Use Azure RBAC to manage access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32652).

**Guidance**: Azure Event Grid supports using Azure Active Directory (AD) to authorize requests to Event Grid resources. With Azure AD, you can use role-based access control (RBAC) to grant permissions to a security principal, which may be a user, or an application service principal.

- [Authorizing access to Event Grid resources](https://docs.microsoft.com/azure/event-grid/security-authorization)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 4.7: Use host-based data loss prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32653).

**Guidance**: Not applicable; this guideline is intended for compute resources.

Microsoft manages the underlying infrastructure for Event Grid and has implemented strict controls to prevent the loss or exposure of customer data.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32654).

**Guidance**: All events or data written to disk by the Event Grid service is encrypted by a Microsoft-managed key ensuring that it's encrypted at rest. Additionally, the maximum period of time that events or data retained is 24 hours in adherence with the Event Grid retry policy. Event Grid will automatically delete all events or data after 24 hours, or the event time-to-live, whichever is less.

- [For more details on Azure Event Grid data access and encryption](https://docs.microsoft.com/azure/event-grid/security-authorization#encryption-at-rest)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32655).

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production instances of Azure Machine Learning and other critical or related resources.

- [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

## Vulnerability management

*For more information, see [Security control: Vulnerability management](/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32656).

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Azure Event Grid.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 5.2: Deploy automated operating system patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32657).

**Guidance**: Microsoft performs patch management on the underlying systems that support Azure Event Grid.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 5.3: Deploy an automated patch management solution for third-party software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32658).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32659).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32660).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32661).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32662).

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32663).

**Guidance**: Use tagging, management groups, and separate subscriptions where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.
 
 
 
- [ How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)
 
 
 
- [ How to create management groups](https://docs.microsoft.com/azure/governance/management-groups/create)
 
 
 
- [ How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.4: Define and maintain an inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32664).

**Guidance**: Not applicable; this guideline is intended for compute resources and Azure as a whole.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32665).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

* Not allowed resource types
* Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s).

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)
- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32666).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32667).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32668).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32669).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

* Not allowed resource types
* Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s).

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)
- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.10: Maintain an inventory of approved software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32670).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32671).

**Guidance**: Use Azure AD Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.
 
 
 
- [ How to configure Conditional Access to block access to Azure Resources Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.12: Limit users' ability to execute scripts in compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32672).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32673).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

## Secure configuration

*For more information, see [Security control: Secure configuration](/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32674).

**Guidance**: Define and implement standard security configurations for your Azure Event Grid service with Azure Policy. Use Azure Policy aliases in the "Microsoft.EventGrid" namespace to create custom policies to audit or enforce the configuration of your Azure Event Grid services.

- [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)
- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32675).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32676).

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources. In addition, you can use Azure Resource Manager templates to maintain the security configuration of your Azure resources required by your organization. 
 
 
 
- [ Understand Azure Policy effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)
 
 
 
- [ Create and manage policies to enforce compliance](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)
 
 
 
- [ Azure Resource Manager templates overview](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32677).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32678).

**Guidance**: If using custom Azure Policy definitions for your Event Grid or related resources, use Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)
- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32679).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32680).

**Guidance**: Use Azure Policy aliases in the "Microsoft.EventGrid" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)
- [How to use aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.8: Deploy configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32681).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32682).

**Guidance**: Use Azure Security Center to perform baseline scans for your Azure Resources. Additionally, use Azure Policy to alert and audit Azure resource configurations.
 
 
 
- [ How to remediate recommendations in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32683).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32684).

**Guidance**: Use managed identities in conjunction with Azure Key Vault to simplify secret management for your cloud applications.
 
 
 
- [ How to use managed identities for Azure resources](https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity)
 
 
 
- [ How to create a Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-portal)
 
 
 
- [ How to provide Key Vault authentication with a managed identity](https://docs.microsoft.com/azure/key-vault/managed-identity)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32685).

**Guidance**: Use managed identities to provide Azure services with an automatically-managed identity in Azure AD. Managed identities allow you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.
 
 
 
- [ How to configure managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32686).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 
 
 
 
- [ How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

## Malware defense

*For more information, see [Security control: Malware defense](/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed antimalware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32687).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32688).

**Guidance**: Microsoft Anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Customer Lockbox), however it does not run on customer content.

It is your responsibility to pre-scan any content being uploaded to non-compute Azure resources. Microsoft cannot access customer data, and therefore cannot conduct anti-malware scans of customer content on your behalf.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 8.3: Ensure antimalware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32689).

**Guidance**: Not applicable; benchmark is intended for compute resources. Microsoft Antimalware is enabled on the underlying host that supports Azure services, however it does not run on customer content.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

## Data recovery

*For more information, see [Security control: Data recovery](/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32690).

**Guidance**: Data recovery management in Event Grid is through data managements on connected data stores. Ensure to follow up data recovery guidelines for connected stores to back up data per customer organization policies.

- [How to recover files from Azure Virtual Machine backup](https://docs.microsoft.com/azure/backup/backup-azure-restore-files-from-vm)

??? Are there data stores managed by Machine Learning platform service that needs to be mentioned here? No searchable info is available about this topic.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32691).

**Guidance**: Data backup in Event Grid is through data managements on connected data stores. Enable Azure Backup for VMs, and configure the desired frequency and retention periods. Backup customer-managed keys in Azure Key Vault.

- [How to recover files from Azure Virtual Machine backup](https://docs.microsoft.com/azure/backup/backup-azure-restore-files-from-vm)
- [How to restore Key Vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

??? Are there data stores managed by Event Grid platform service that needs to be mentioned here? No searchable info is available about this topic.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 9.3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32692).

**Guidance**: Data backup validation in Event Grid is through data managements on connected data stores. Periodically perform data restoration of content in Azure Backup. Ensure that you can restore backed-up customer-managed keys.

- [How to recover files from Azure Virtual Machine backup](https://docs.microsoft.com/azure/backup/backup-azure-restore-files-from-vm)
- [How to restore Key Vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 9.4: Ensure protection of backups and customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32693).

**Guidance**: For on-premises backup, encryption at rest is provided using the passphrase you provide when backing up to Azure. Use role-based access control to protect backups and customer managed keys. 

Enable soft delete and purge protection in Key Vault to protect keys against accidental or malicious deletion. If Azure Storage is used to store backups, enable soft delete to save and recover your data when blobs or blob snapshots are deleted.
 
 
- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)
- [How to enable soft delete and purge protection in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)
- [Soft delete for Azure Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

## Incident response

*For more information, see [Security control: Incident response](/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32694).

**Guidance**: None.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32695).

**Guidance**: None.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32700).

**Guidance**: None.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32696).

**Guidance**: None.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32697).

**Guidance**: None.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32698).

**Guidance**: None.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32699).

**Guidance**: None.

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
