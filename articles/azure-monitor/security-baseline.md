---
title: Azure security baseline for Azure Monitor
description: The Azure Monitor security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 08/03/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Monitor

This security baseline applies guidance from the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview) to Azure Monitor. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Monitor. **Controls** not applicable to Azure Monitor have been excluded. To see how Azure Monitor completely maps to the Azure Security Benchmark, see the [full Azure Monitor security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see [Security control: Network security](/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12394).

**Guidance**: Azure Monitor is part of the Azure core services and cannot be deployed as a service separately.

You can enable Azure Private Link to allow access Azure SaaS Services (for example, Azure Monitor) and Azure hosted customer/partner services over a Private Endpoint in your virtual network. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet.

To allow traffic to reach Azure Monitor, use the "AzureMonitor" service tags to allow inbound and outbound traffic through Network Security Groups. To allow Availability Monitoring test traffic to reach Azure Monitor, use the "ApplicationInsightsAvailability" service tag to all inbound traffic through Network Security Groups.

Virtual network rules enable Azure Monitor to only accept communications that are sent from selected subnets inside a virtual network.

Use Log Analytics gateway to send data to a Log Analytics workspace in Azure Monitor on behalf of the computers that cannot directly connect to the internet preventing need of computers to be connected to internet. 

- [How to set up Private Link for Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/private-link-security)

- [Connect computers without internet access by using the Log Analytics gateway in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/gateway)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12395).

**Guidance**: 
Microsoft manages the underlying infrastructure for Azure Monitor. You should  follow network protection recommendations to help secure your network resources hosting these services in Azure. Enable NSG flow logs and send logs into a Storage Account for traffic audit. You may also send NSG flow logs to a Log Analytics Workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations. 
- [Network requirements for Azure Monitor agents](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#network-requirements)

- [Connect computers without internet access by using the Log Analytics gateway in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/gateway)
- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal) How to Enable and use Traffic Analytics: https://docs.microsoft.com/azure/network-watcher/traffic-analytics Understand Network Security provided by Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-network-recommendations


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12396).

**Guidance**: Not applicable; Azure Monitor is part of the Azure core services and cannot be deployed as a service separately. Azure Monitor components, including the Application Insights SDK may be deployed with your resources, and this may impact the security posture of those resources.

Instructions for Application Insights monitoring of web applications are available in the following links.

- [How to add exceptions for CDN endpoints for corporations](https://docs.microsoft.com/azure/azure-monitor/app/javascript-sdk-load-failure#add-exceptions-for-cdn-endpoints-for-corporations)

- [How to host the SDK on your own CDN](https://docs.microsoft.com/azure/azure-monitor/app/javascript-sdk-load-failure#host-the-sdk-on-your-own-cdn)

- [How to use NPM packages to embed the Application Insight SDK](https://docs.microsoft.com/azure/azure-monitor/app/javascript-sdk-load-failure#use-npm-packages-to-embed-the-application-insight-sdk)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12401).

**Guidance**: You can enable Azure Private Link to allow access Azure SaaS Services (for example, Azure Monitor) and Azure hosted customer/partner services over a Private Endpoint in your virtual network. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet.

To allow traffic to reach Azure Monitor, use the "AzureMonitor" service tags to allow inbound and outbound traffic through Network Security Groups. To allow Availability Monitoring test traffic to reach Azure Monitor, use the "ApplicationInsightsAvailability" service tag to all inbound traffic through Network Security Groups.

Virtual network rules enable Azure Monitor to only accept communications that are sent from selected subnets inside a virtual network.

- [How to set up Private Link for Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/private-link-security)

- [Understand and use Service Tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview) 



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12403).

**Guidance**: Azure Monitor is part of the Azure core services and cannot be deployed as a service separately. Azure Monitor components, including the Azure Monitor Agent, and Application Insights SDK may be deployed with your resources, and this may impact the security posture of those resources.

- [Network requirements for Azure Monitor agents](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#network-requirements)

- [Connect computers without internet access by using the Log Analytics gateway in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/gateway) 

- [See getting started with Application Insights](https://docs.microsoft.com//azure/azure-monitor/app/app-insights-overview#get-started)

- [How to set up availability web tests](https://docs.microsoft.com/azure/azure-monitor/app/monitor-web-app-availability)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12404).

**Guidance**: Azure Monitor is part of the Azure core services and cannot be deployed as a service separately.  If you are using Azure Monitor gateway or agents, use Azure Activity Log to monitor network resource configurations and detect changes to your Azure network resources. Create alerts within Azure Monitor that will trigger when changes to critical resources take place. 

- [Network requirements for Azure Monitor agents](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#network-requirementsConnect) computers without internet access by using the Log Analytics gateway in Azure Monitor:  https://docs.microsoft.com/azure/azure-monitor/platform/gateway
- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view) How to create alerts in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12406).

**Guidance**: Azure Monitor uses Activity logs to log changes to the services. You can export logs to Azure Storage, Event Hub, or Azure Monitor. Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. Within Azure Monitor, use Log Analytics Workspace(s) to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage. Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [How to collect platform logs and metrics with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings) How to collect Azure Virtual Machine internal host logs with Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/learn/quick-collect-azurevm 
- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)
- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12407).

**Guidance**: Azure Monitor uses Activity logs which are automatically enabled, include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. 

- [How to collect platform logs and metrics with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings) 
- [Understand logging and different log types in Azure](https://docs.microsoft.com/azure/azure-monitor/platform/platform-logs-overview)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12409).

**Guidance**: Within Azure Monitor, set your Log Analytics Workspace retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

- [Change the data retention period in Log Analytics](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)
- [How to configure retention policy for Azure Storage account logs](https://docs.microsoft.com/azure/storage/common/storage-monitor-storage-account#configure-logging)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 2.6: Monitor and review logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12410).

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results. Use Azure Monitor's Log Analytics Workspace to review logs and perform queries on log data.Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM. 

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)
- [Understand Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal)
- [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12411).

**Guidance**: Use Azure Security Center with Log Analytics Workspace for monitoring and alerting on anomalous activity found in Activity logs.Alternatively, you may enable and on-board data to Azure Sentinel.

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)
- [How to manage alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts)
- [How to alert on log analytics log data](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12412).

**Guidance**: Not applicable; Azure Monitor does not produce anti-malware related logs.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12414).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Identity and access control

*For more information, see [Security control: Identity and access control](/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12415).

**Guidance**: 
Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.
You can also enable a Just-In-Time / Just-Enough-Access by using Azure AD Privileged Identity Management Privileged Roles for Microsoft Services, and Azure Resource Manager.

- [Roles, permissions, and security in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/roles-permissions-security)

- [What is Azure AD Privileged Identity Management?](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-configure)



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12416).

**Guidance**: Not applicable; Azure Policy does not have the concept of default passwords. Other Azure resources requiring a password forces a password to be created with complexity requirements and a minimum password length, which differs depending on the service. You are responsible for third party applications and marketplace services that may use default passwords.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12417).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

You can also enable a Just-In-Time / Just-Enough-Access by using Azure AD Privileged Identity Management Privileged Roles for Microsoft Services, and Azure Resource Manager. 

- [What is Azure AD Privileged Identity Management?](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-configure)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.4: Use Azure Active Directory single sign-on (SSO)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12418).

**Guidance**: Wherever possible, use Azure Active Directory SSO instead than configuring individual stand-alone credentials per-service. Use Azure Security Center Identity and Access Management recommendations.

- [Understand SSO with Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12419).

**Guidance**: Enable Azure Active Directory multi-factor authentication(MFA) and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)
- [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.6: Use secure, Azure-managed workstations for administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12420).

**Guidance**: Use PAWs (privileged access workstations) with MFA configured to log into and configure Azure resources.

- [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)
- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12421).

**Guidance**: Use Azure Active Directory security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk)
- [How to monitor users' identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12422).

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12423).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

- [How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12424).

**Guidance**: Azure AD provides logs to help discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access. 

- [Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/)
- [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12425).

**Guidance**: You have access to Azure AD Sign-in Activity, Audit and Risk Event log sources, which allow you to integrate with any SIEM/Monitoring tool.You can streamline this process by creating Diagnostic Settings for Azure Active Directory user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. You can configure desired Alerts within Log Analytics Workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.12: Alert on account sign-in behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12426).

**Guidance**: Use Azure AD Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)
- [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)
- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12427).

**Guidance**: Not applicable; Customer Lockbox not supported for Azure Monitor. 

- [Supported services and scenarios in general availability](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12428).

**Guidance**: Use Tags when possible to assist in tracking Azure Monitor resources that store or process sensitive information. How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

- [Manage access to log data and workspaces in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/manage-access)



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12429).

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level. You can restrict the level of access to your Azure Monitor and related resources that your applications and enterprise environments demand. You can control access to Azure Monitor via Azure Active Directory role-based access control. How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12431).

**Guidance**: 
Azure Monitor negotiates TLS 1.2 by default. Ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater. 

Application Insights and Log Analytics both continue to allow TLS 1.1 and TLS 1.0 data to be ingested. Data may be restricted to TLS 1.2 by configuring on the client side.

- [How to send data securely using TLS 1.2](https://docs.microsoft.com/azure/azure-monitor/platform/data-security#sending-data-securely-using-tls-12) 



**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12432).

**Guidance**: 
Data identification, classification, and loss prevention features are not yet available for Azure Monitor Azure Data Explorer. Implement third-party solution if required for compliance purposes.
For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.6: Use Role-based access control to control access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12433).

**Guidance**: Use Azure Active Directory role-based acess control (RBAC) to control access to Azure Monitor.

- [Roles, permissions, and security in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/roles-permissions-security)
- [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12434).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12435).

**Guidance**: The Azure Monitor data-store ensures that all data encrypted at rest using Azure-managed keys while stored in Azure Storage.

- [Log Analytics data security](https://docs.microsoft.com/azure/azure-monitor/platform/data-security)

- [Data collection, retention, and storage in Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/data-retention-privacy)

- [Understand encryption at rest in Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest) 


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12436).

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place in Azure Monitor and related resources.

- [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12437).

**Guidance**: Not applicable; Azure Monitor is part of the Azure core services and cannot be deployed as a service separately.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12438).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.3: Deploy automated patch management solution for third-party software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12439).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12440).

**Guidance**: Not applicable; Azure Monitor is part of the Azure core services and cannot be deployed as a service separately.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12441).

**Guidance**: Use a common risk scoring program (for example, Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12442).

**Guidance**: Use Azure CLI to query/discover Azure Monitor resources within your subscription(s).  Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

- [az monitor](https://docs.microsoft.com/cli/azure/monitor?view=azure-cli-latest)
- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)
- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)
- [Roles, permissions, and security in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/roles-permissions-security)



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12443).

**Guidance**: Apply tags to Azure Monitor resources giving metadata to logically organize them into a taxonomy. How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12444).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Monitor related resources.   Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner. 

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription) How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.4: Define and maintain inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12445).

**Guidance**: Create an inventory of approved Azure policies and assignments as per your organizational needs.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12446).

**Guidance**: Use Azure Monitor's Log Analytics workspace to monitor for unappproved policy creation and assignment in Activity logs.  You may use Azure Policy to put restrictions on the type of Azure Monitor related resources that can be created in your subscription(s). 

Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM. 

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage) 

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)
- [Understand Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal)
- [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12447).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12448).

**Guidance**: Reconcile inventory on a regular basis and ensure unauthorized Azure Monitor related resources are deleted from the subscription in a timely manner.  

- [Delete Azure Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/platform/delete-workspace)



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12449).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12450).

**Guidance**: Use Azure Policy to restrict which Azure Monitor related resources you can provision in your environment. 

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage) 

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12451).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12452).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resources Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12453).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12454).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see [Security control: Secure configuration](/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12455).

**Guidance**: Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure Monitor related resources. You may also use built-in Azure Policy definitions. Also, Azure Resource Manager has the ability to export the template in Java Script Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your organization. You may also use recommendations from Azure Security Center as a secure configuration baseline for your Azure resources. How to view available Azure Policy Aliases: https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0 Tutorial: Create and manage policies to enforce compliance: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage Single and multi-resource export to a template in Azure portal: https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal Security recommendations - a reference guide: https://docs.microsoft.com/azure/security-center/recommendations-reference

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12456).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12457).

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure Monitor related resources.  In addition, you may use Azure Resource Manager templates to maintain the security configuration of your Azure Monitor related resources required by your organization. Understand Azure Policy effects: https://docs.microsoft.com/azure/governance/policy/concepts/effects Create and manage policies to enforce compliance:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage Azure Resource Manager templates overview:  https://docs.microsoft.com/azure/azure-resource-manager/templates/overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12458).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12459).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure policies, Azure Resource Manager templates. To access the resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)
- [About permissions and groups in Azure DevOps](https://docs.microsoft.com/azure/devops/organizations/security/about-permissions)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12460).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12461).

**Guidance**: Define and implement standard security configurations for Azure Monitor related resources using Azure Policy. Use Azure Policy aliases to create custom policies to audit or enforce the security configuration of your Azure Monitor related resources. You may also make use of built-in policy definitions related to your specific resources.  How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage How to use Aliases: https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12462).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12463).

**Guidance**: Use Azure Security Center to perform baseline scans for your Azure Monitor related resources.  Additionally, use Azure Policy to alert and audit Azure resource configurations. How to remediate recommendations in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12464).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12465).

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for supported Azure monitor related resources. 
- [How to integrate with Azure Managed Identities](https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity) 
- [Services that support managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities)

- [How to create a Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-portal) How to provide Key Vault authentication with a managed identity: https://docs.microsoft.com/azure/key-vault/managed-identity

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12466).

**Guidance**: &lt;--------NEED TO  VERIFY--------&gt;

- [Use Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Azure Policy, without any credentials in your code.How to configure Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12467).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. How to setup Credential Scanner: https://secdevtools.azurewebsites.net/helpcredscan.html

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally-managed anti-malware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12468).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12469).

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure Monitor related resources), however it does not run on your content. 
Pre-scan any files being uploaded to applicable Azure Monitor related resources, such as Log Analytics workspace. 

Use Azure Security Center's Threat detection for data services to detect malware uploaded to storage accounts. 

- [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](https://docs.microsoft.com/azure/security/fundamentals/antimalware) 

- [Understand Azure Security Center's Threat detection for data services](https://docs.microsoft.com/azure/security-center/security-center-alerts-data-services)



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12470).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data recovery

*For more information, see [Security control: Data recovery](/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back-ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12471).

**Guidance**: Use Azure Resource Manager to export the Azure Monitor and related resources in a Java Script Object Notation (JSON) template which can be used as backup for Azure Monitor and related configurations.  Use Azure Automation to run the backup scripts automatically. 
- [Manage Log Analytics workspace using Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-monitor/platform/template-workspace-configuration)

- [Single and multi-resource export to a template in Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal)

- [About Azure Automation](https://docs.microsoft.com/azure/automation/automation-intro)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12472).

**Guidance**: Use Azure Resource Manager to export the Azure Monitor and related resources in a Java Script Object Notation (JSON) template which can be used as backup for Azure Monitor and related configurations.  Backup customer managed keys within Azure Key Vault if Azure Monitor related resources are using customer managed keys, 
- [Manage Log Analytics workspace using Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-monitor/platform/template-workspace-configuration)

- [Single and multi-resource export to a template in Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal)

- [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0)



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12473).

**Guidance**: Ensure ability to periodically perform restoration using Azure Resource Manager backed template files.  Test restoration of backed up customer managed keys.

- [Manage Log Analytics workspace using Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-monitor/platform/template-workspace-configuration)

- [How to restore key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12474).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure policies, Azure Resource Manager templates. To protect resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS.   Use role-based access control to protect customer managed keys. 

Additionally, Enable Soft-Delete and purge protection in Key Vault to protect keys against accidental or malicious deletion.  If Azure Storage is used to store Azure Resource Manager template backups, enable soft delete to save and recover your data when blobs or blob snapshots are deleted. 

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [About permissions and groups in Azure DevOps](https://docs.microsoft.com/azure/devops/organizations/security/about-permissions)

- [How to enable Soft-Delete and Purge protection in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal) 

- [Soft delete for Azure Storage blobs](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12475).

**Guidance**: 
- [Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review. Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/) Microsoft Security Response Center's Anatomy of an Incident: https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/ Leverage NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan: https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12476).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred. Security alerts in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-alerts-overview Use tags to organize your Azure resources: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12477).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed. NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities: https://csrc.nist.gov/publications/detail/sp/800-84/final

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12478).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved. How to set the Azure Security Center Security Contact: https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12479).

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel. How to configure continuous export: https://docs.microsoft.com/azure/security-center/continuous-export How to stream alerts into Azure Sentinel: https://docs.microsoft.com/azure/sentinel/connect-azure-security-center

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12480).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources. How to configure Workflow Automation and Logic Apps: https://docs.microsoft.com/azure/security-center/workflow-automation

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/12481).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. Penetration Testing Rules of Engagement:  https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1 Microsoft Cloud Red Teaming:  https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
