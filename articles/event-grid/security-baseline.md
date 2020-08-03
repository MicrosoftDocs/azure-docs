---
title: Azure security baseline for Event Grid
description: The Event Grid security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: event-grid
ms.topic: conceptual
ms.date: 08/03/2020
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
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32701.).

**Guidance**: You can use private endpoints to allow ingress of events directly from your virtual network to your Event Grid topics and domains securely over a private link without going through the public internet. When you create a private endpoint for your Event Grid topic or domain, it provides secure connectivity between clients on your VNet and your Event Grid resource. The private endpoint is assigned an IP address from the IP address range of your virtual network. The connection between the private endpoint and the Event Grid service uses a secure private link.

Azure Event Grid supports IP-based access controls for publishing to topics and domains. With IP-based controls, you can limit the publishers to a topic or domain to only a set of approved set of machines and cloud services. This feature complements the authentication mechanisms supported by Event Grid. &lt;--- Note to service owner, IP based access control GA or Preview? https://docs.microsoft.com/azure/event-grid/configure-firewall ---&gt;

- [More details on Event Grid Private Endpoints](https://docs.microsoft.com/azure/event-grid/network-security#private-endpoints)

- [More details on Event Grid IP Firewall](https://docs.microsoft.com/azure/event-grid/network-security#ip-firewall)

- [Azure Event Grid Network Security](https://docs.microsoft.com/azure/event-grid/network-security) 

- [Azure Private Link Overview](https://docs.microsoft.com/azure/private-link/private-link-overview)

- [Azure Network Security Group](https://docs.microsoft.com/azure/virtual-network/security-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32702.).

**Guidance**: Use Azure Security Center and follow the network protection recommendations to help secure your Azure network resources. Enable network security group flow logs and send the logs to an Azure Storage account for auditing. You can also send the flow logs to a Log Analytics workspace and then use Traffic Analytics to provide insights into traffic patterns in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity, identify hot spots and security threats, understand traffic flow patterns, and pinpoint network misconfigurations.
 
Note network policies are disabled by default when private endpoints are created for Event Grid so above workflow may not work.
 
- [How to enable network security group flow logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [How to enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)
 
- [Understand network security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32703.).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 1.4: Deny communications with known malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32704.).

**Guidance**: Enable DDoS Protection Standard on the virtual networks associated with your Event Grid to guard against distributed denial-of-service (DDoS) attacks.

Note, Azure Security Center Integrated Threat Intelligence can detect logons from malicious IP and generate alerts but it is not designed to deny logon access.

- [How to configure DDoS protection](https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection)

- [For more information about the Azure Security Center Integrated Threat Intelligence](https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32705.).

**Guidance**: Enable network security group (NSG) flow logs and send logs into a storage account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

Note network policies are disabled by default when private endpoints are created for Event Grid so above workflow may not work.

If required for investigating anomalous activity, enable Network Watcher packet capture.

- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

- [How to enable Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32706.).

**Guidance**: Select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities.  When payload inspection is not a requirement, Azure Firewall threat intelligence can be used. Azure Firewall threat intelligence-based filtering is used to alert on and/or block traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or block malicious traffic.

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

- [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

- [How to configure alerts with Azure Firewall](https://docs.microsoft.com/azure/firewall/threat-intel)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32707.).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32708.).

**Guidance**: For resources that need access to your Azure Event Grid, use Virtual Network service tags to define network access controls on network security Groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., AzureEventGrid) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [How to use service tag for Azure Event Grid](https://docs.microsoft.com/azure/event-grid/network-security#service-tags)

- [For more information about using service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32709.).

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Event Grid namespaces with Azure Policy. Use Azure Policy aliases in the "Microsoft.EventGrid" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Machine Learning namespaces. 

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32710.).

**Guidance**: Use tags for network resources associated with your Azure Event Grid deployment in order to logically organize them into a taxonomy.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32711.).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to Azure Event Grid. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32713.).

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by Azure Event Grid. Within the Azure Monitor, use Log Analytics workspace(s) to query and perform analytics, and use storage accounts for long-term/archival storage. Alternatively, you may enable, and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM).

- [How to enable diagnostic logs for Azure Event Grid](https://docs.microsoft.com/azure/event-grid/diagnostic-logs)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Yes?

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32714.).

**Guidance**: Diagnostic settings allow Event Grid users to capture and view publish and delivery failure Logs in either a Storage account, an event hub, or a Log Analytics Workspace.

- [Enable Diagnostic logs for Azure event grid topics or domains](https://docs.microsoft.com/azure/event-grid/enable-diagnostic-logs-topic)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32715.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32716.).

**Guidance**: In Azure Monitor, set the log retention period for Log Analytics workspaces associated with your Azure Event Grid instances according to your organization's compliance regulations.

- [How to set log retention parameters](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32717.).

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review the results from your Azure Event Grid. Use Azure Monitor and a Log Analytics workspace to review logs and perform queries on log data.

Alternatively, you can enable and on-board data to Azure Sentinel or a third party SIEM. 

- [How to perform queries for Azure Event Grid in Log Analytics Workspaces](https://docs.microsoft.com/azure/event-grid/diagnostic-logs)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

- [Getting started with Log Analytics queries](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal)

- [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32718.).

**Guidance**: Enable diagnostic settings on your event grid for access to publish and delivery failure logs. Activity logs, which are automatically available, include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. You may send the logs to a Log Analytics workspace.Use Azure Security Center with Log Analytics for monitoring and alerting on anomalous activity found in security logs and events. 

Additionally, you can oboard your Log Analytics workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for playbooks (automated solutions) to be created and used to remediate security issues.

- [How to enable diagnostic logs for Azure Event Grid topics or domains](https://docs.microsoft.com/azure/event-grid/enable-diagnostic-logs-topic)
- [Deatils of Event Grid diagnostic log schema](https://docs.microsoft.com/azure/event-grid/diagnostic-logs)

- [Create, view, and manage log alerts using Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-log)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard")

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32719.).

**Guidance**: Not applicable; Azure Event Grid does not process or produce anti-malware related logs.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 2.9: Enable DNS query logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32720.).

**Guidance**: Not applicable; Azure Event Grid does not process or produce DNS-related logs.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32721.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

## Identity and access control

*For more information, see [Security control: Identity and access control](/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32722.).

**Guidance**: Azure Event Grid allows you to control the level of access given to different users to do various management operations such as list event subscriptions, create new ones, and generate keys. Event Grid uses Azure's role-based access control (RBAC). Event Grid supports built-in roles as well as custom roles.

Azure role-based access control (RBAC) allows you to manage access to Azure resources through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal.

- [Authorizing access to Event Grid resources](https://docs.microsoft.com/azure/event-grid/security-authorization)

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

**Azure Security Center monitoring**: N/A

**Responsibility**: N/A

### 3.2: Change default passwords where applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32723.).

**Guidance**: Access management to Event Grid resources is controlled through Azure Active Directory (AD). Azure AD does not have the concept of default passwords.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32724.).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts.

You can also enable a Just-In-Time access by using Azure AD Privileged Identity Management and Azure Resource Manager.

Event Grid can enable a managed service identity for Azure event grid topics or domains and use it to forward events to supported destinations such as Service Bus queues and topics, event hubs, and storage accounts. Shared Access Signature (SAS) token is used for publishing events to Azure Event Grid. Create standard operating procedure around event access, forwarding, and publishing with those accounts.

- [Authenticate event delivery to event handlers (Azure Event Grid)](https://docs.microsoft.com/azure/event-grid/security-authentication)

- [Authenticate publishing clients (Azure Event Grid)](https://docs.microsoft.com/azure/event-grid/security-authenticate-publishing-clients)

- [Learn more about Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32725.).

**Guidance**: &lt;--- Event Grid is integrated with Azure Active Directory, but no information available on SSO support because SSO needs to be implemented, also not clear how SSO is appllied in Event Grid scenarios, needs service team to confirm ---&gt;

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: <--- ? --->

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32726.).

**Guidance**: Enable Azure Active Directory Multi-Factor Authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

- [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32727.).

**Guidance**: Use Privileged Access Workstations (PAW) with Multi-Factor Authentication configured to log into and configure Azure resources.

- [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)

- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32728.).

**Guidance**: Use Azure Active Directory security reports and monitoring to detect when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk)

- [How to monitor users' identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources only from approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32729.).

**Guidance**: Use Azure AD named locations to allow access only from specific logical groupings of IP address ranges or countries/regions.
 
 
 
- [How to configure Azure AD named locations](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32730.).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

Event Grid can enable a managed service identity for Azure event grid topics or domains and use it to forward events to supported destinations such as Service Bus queues and topics, event hubs, and storage accounts. Shared Access Signature (SAS) token is used for publishing events to Azure Event Grid. 

- [Authenticate event delivery to event handlers (Azure Event Grid)](https://docs.microsoft.com/azure/event-grid/security-authentication)

- [Authenticate publishing clients (Azure Event Grid)](https://docs.microsoft.com/azure/event-grid/security-authenticate-publishing-clients)

- [How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32731.).

**Guidance**: Azure AD provides logs to help discover stale accounts. In addition, use Azure AD identity and access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right users have continued access. 
 
Use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

- [Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring)

- [How to use Azure AD identity and access reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

- [Deploy Azure AD Privileged Identity Management (PIM)](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32732.).

**Guidance**: You have access to Azure AD sign-in activity, audit, and risk event log sources, which allow you to integrate with any SIEM/monitoring tool.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired alerts within Log Analytics workspace.

- [How to integrate Azure activity logs with Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32733.).

**Guidance**: Use Azure AD Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.
 
 
 
- [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32734.).

**Guidance**: &lt;--- Currently not available; Customer Lockbox not yet supported for Azure Database for Event Grid, need confirmation from service owner ---&gt;

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: <--- ? --->

## Data protection

*For more information, see [Security control: Data protection](/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32735.).

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.
 
 
 
- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32736.).

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level. You can restrict the level of access to your Azure resources that your applications and enterprise environments demand. You can control access to Azure resources via Azure Active Directory RBAC.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create management groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32737.).

**Guidance**: &lt;--- no information available on how sensitive info is classified in Event Grid, needs service owner input ---&gt;

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: <--- ? --->

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32738.).

**Guidance**: Azure Event Grid supports HTTPS webhook endpoints. &lt;--- need more details on TLS version for webhook as well as how event data is encrypted in publishing ---&gt;

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32739.).

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Event Grid. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 4.6: Use Azure RBAC to manage access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32740.).

**Guidance**: Azure Event Grid supports using Azure Active Directory (AD) to authorize requests to Event Grid resources. With Azure AD, you can use role-based access control (RBAC) to grant permissions to a security principal, which may be a user, or an application service principal.

- [Authorizing access to Event Grid resources](https://docs.microsoft.com/azure/event-grid/security-authorization)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32743.).

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production instances of Azure Machine Learning and other critical or related resources.

- [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.3: Deploy an automated patch management solution for third-party software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32746.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32747.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32748.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32749.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32750.).

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32751.).

**Guidance**: Use tagging, management groups, and separate subscriptions where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.
 
 
 
- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create management groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.4: Define and maintain an inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32752.).

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32753.).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

* Not allowed resource types
* Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s).

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)
- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32754.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32755.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32756.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32757.).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

* Not allowed resource types
* Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s).

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32758.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32759.).

**Guidance**: Use Azure AD Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.
 
 
 
- [ How to configure Conditional Access to block access to Azure Resources Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts in compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32760.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32761.).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

## Secure configuration

*For more information, see [Security control: Secure configuration](/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32762.).

**Guidance**: Define and implement standard security configurations for your Azure Event Grid service with Azure Policy. Use Azure Policy aliases in the "Microsoft.EventGrid" namespace to create custom policies to audit or enforce the configuration of your Azure Event Grid services.

Azure Resource Manager has the ability to export the template in Java Script Object Notation (JSON), which should be reviewed to ensure that the configurations meet the security requirements for your organization before deployments.

- [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32763.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32764.).

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources. In addition, you can use Azure Resource Manager templates to maintain the security configuration of your Azure resources required by your organization. 

- [Understand Azure Policy effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

- [Create and manage policies to enforce compliance](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Resource Manager templates overview](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32765.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32766.).

**Guidance**: If using custom Azure Policy definitions for your Event Grid or related resources, use Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32767.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32768.).

**Guidance**: Use Azure Policy aliases in the "Microsoft.EventGrid" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to use aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32769.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32770.).

**Guidance**: Use Azure Security Center to perform baseline scans for your Azure Resources. Additionally, use Azure Policy to alert and audit Azure resource configurations.

- [How to remediate recommendations in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32771.).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not Applicable

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32772.).

**Guidance**: Event Grid uses Shared Access Signature (SAS) token for publishing events to Event Grid topics or domains. Generating SAS tokens with only access to the resources that are needed in a limited time window.

Use managed identities in conjunction with Azure Key Vault to simplify secret management for your cloud applications.

- [Authenticate publishing clients (Azure Event Grid)](https://docs.microsoft.com/azure/event-grid/security-authenticate-publishing-clients)

- [How to use managed identities for Azure resources](https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity)

- [How to create a Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-portal)

- [How t+G70o provide Key Vault authentication with a managed identity](https://docs.microsoft.com/azure/key-vault/managed-identity)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32773.).

**Guidance**: Event Grid can enable a managed service identity for Azure event grid topics or domains. Use it to forward events to supported destinations such as Service Bus queues and topics, event hubs, and storage accounts.

- [Event delivery with a managed identity](https://docs.microsoft.com/azure/event-grid/managed-service-identity)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32774.).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](/azure/security/benchmarks/security-control-malware-defense).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32776.).

**Guidance**: Microsoft Anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Event Grid), however it does not run on customer content.

It is your responsibility to pre-scan any content being uploaded to non-compute Azure resources. Microsoft cannot access customer data, and therefore cannot conduct anti-malware scans of customer content on your behalf.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

## Data recovery

*For more information, see [Security control: Data recovery](/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32778.).

**Guidance**: Event Grid has an automatic geo disaster recovery (GeoDR) of meta-data not only for new, but all existing domains, topics, and event subscriptions. If an entire Azure region goes down, Event Grid will already have all of your event-related infrastructure metadata synced to a paired region.

- [Server-side geo disaster recovery in Azure Event Grid](https://docs.microsoft.com/azure/event-grid/geo-disaster-recovery)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32779.).

**Guidance**: Event Grid has an automatic geo disaster recovery (GeoDR) of meta-data not only for new, but all existing domains, topics, and event subscriptions. If an entire Azure region goes down, Event Grid will already have all of your event-related infrastructure metadata synced to a paired region.

- [Server-side geo disaster recovery in Azure Event Grid](https://docs.microsoft.com/azure/event-grid/geo-disaster-recovery)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32780.).

**Guidance**: Event Grid has an automatic geo disaster recovery (GeoDR) of meta-data not only for new, but all existing domains, topics, and event subscriptions. If an entire Azure region goes down, Event Grid will already have all of your event-related infrastructure metadata synced to a paired region.

- [Server-side geo disaster recovery in Azure Event Grid](https://docs.microsoft.com/azure/event-grid/geo-disaster-recovery)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32781.).

**Guidance**: Enable soft delete and purge protection in Key Vault to protect keys against accidental or malicious deletion. If Azure Storage is used to store backups, enable soft delete to save and recover your data when blobs or blob snapshots are deleted.
 
 
- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

- [Soft delete for Azure Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32782.).

**Guidance**: Develop an incident response guide for your organization. Ensure there are written incident response plans that define all the roles of personnel as well as the phases of incident handling and management from detection to post-incident review. 

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

- [Use NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32783.).

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.
 
 
 
 Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data. It's your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-overview)

- [Use tags to organize your Azure resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32788.).

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and then revise your response plan as needed.
 
 
 
- [ NIST's publication--Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32784.).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.
 
 
 
- [ How to set the Azure Security Center security contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32785.).

**Guidance**: Export your Azure Security Center alerts and recommendations using the continuous export feature to help identify risks to Azure resources. Continuous export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You can use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

- [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32786.).

**Guidance**: Use workflow automation feature Azure Security Center to automatically trigger responses to security alerts and recommendations to protect your Azure resources.

- [How to configure workflow automation in Security Center](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32787.).

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
