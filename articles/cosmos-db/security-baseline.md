---
title: Azure Security Baseline for Cosmos DB
description: Azure Security Baseline for Cosmos DB
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 03/16/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure Security Baseline for Cosmos DB

The Azure Security Baseline for Cosmos DB contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network Security

*For more information, see [Security Control: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

**Guidance**: By using Azure Private Link, you can connect to an Azure Cosmos account via a Private Endpoint. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can also reduce the risk of data exfiltration by configuring a strict set of outbound rules on a network security group (NSG) and associating that NSG with your subnet.

You can also use Service Endpoints to secure your Azure Cosmos account. By enabling a Service Endpoint, you can configure Azure Cosmos accounts to allow access from only a specific subnet of an Azure virtual network. Once the Azure Cosmos DB Service Endpoint is enabled, you can limit access to an Azure Cosmos account with connections from a subnet in a  virtual network.

You can also secure the data stored in your Azure Cosmos account by using IP firewalls. Azure Cosmos DB supports IP-based access controls for inbound firewall support. You can set an IP firewall on the Azure Cosmos account by using the Azure portal, Azure Resource Manager templates, or through the Azure CLI or Azure PowerShell.

Azure Private Link Overview: https://docs.microsoft.com/azure/private-link/private-link-overview

How to configure a Private Endpoint for Azure Cosmos DB:  https://docs.microsoft.com/azure/cosmos-db/how-to-configure-private-endpoints 

How to create a Network Security Group with a Security Config:  https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

How to configure IP firewall in Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/how-to-configure-firewall

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure network resources related to your Azure Cosmos account.

When virtual machines are deployed in the same virtual network as your Azure Cosmos account, you can use a network security group (NSG) to reduce the risk of data exfiltration. Enable NSG flow logs and send logs into an Azure Storage Account for traffic audits. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

Understand Network Security provided by Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-network-recommendations

How to Enable NSG Flow Logs: https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to Enable and use Traffic Analytics: https://docs.microsoft.com/azure/network-watcher/traffic-analytics

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Use the Cross-Origin Resource Sharing (CORS) feature to enable a web application running under one domain to access resources in another domain. Web browsers implement a security restriction known as same-origin policy that prevents a web page from calling APIs in a different domain. However, CORS provides a secure way to allow the origin domain to call APIs in another domain. After you enable the CORS support for your Azure Cosmos account, only authenticated requests are evaluated to determine whether they are allowed according to the rules you have specified.

Configure Cross-Origin Resource Sharing: https://docs.microsoft.com/azure/cosmos-db/how-to-configure-cross-origin-resource-sharing

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Cosmos DB . ATP for Azure Cosmos DB provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit Azure Cosmos accounts. This layer of protection allows you to address threats and integrate them with central security monitoring systems.

Enable DDoS Protection Standard on the Virtual Networks associated with your Azure Cosmos DB instances to guard against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

How to configureAzure Cosmos DB Advanced Threat Protection: https://docs.microsoft.com/azure/cosmos-db/cosmos-db-advanced-threat-protection

How to configure DDoS protection: https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection

Understand Azure Security Center Integrated Threat Intelligence: https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

**Guidance**: Enable network security group (NSG) flow logs and send logs into a storage account for traffic audit. You can send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

How to Enable NSG Flow Logs: https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to Enable and use Traffic Analytics: https://docs.microsoft.com/azure/network-watcher/traffic-analytics

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Cosmos DB. ATP for Azure Cosmos DB provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit Azure Cosmos accounts. This layer of protection allows you to address threats and integrate them with central security monitoring systems. 

How to configure Cosmos DB Advanced Threat Protection: https://docs.microsoft.com/azure/cosmos-db/cosmos-db-advanced-threat-protection

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable; recommendation is intended for web applications running on Azure App Service or compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: For resources that need access to your Azure Cosmos account, use Virtual Network service tags to define network access controls on network securitygGroups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., AzureCosmosDB) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

For more information about using service tags: https://docs.microsoft.com/azure/virtual-network/service-tags-overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources with Azure Policy. Use Azure Policy aliases in the "Microsoft.DocumentDB" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Cosmos DB instances. You may also make use of built-in policy definitions for Azure Cosmos DB, such as:

- Deploy Advanced Threat Protection for Cosmos DB Accounts

- Cosmos DB should use a virtual network service endpoint

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, role-based access control (RBAC), and policies in a single blueprint definition. You can easily apply the blueprint to new subscriptions, environments, and fine-tune control and management through versioning.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create an Azure Blueprint: https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network resources associated with your Azure Cosmos DB deployment in order to logically organize them into a taxonomy.

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Cosmos DB instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place. 

How to view and retrieve Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view

How to create alerts in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains the time source used for Azure resources such as Azure Cosmos DB for timestamps in the logs.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by Azure Cosmos DB. Within the Azure Monitor, use Log Analytics workspace(s) to query and perform analytics, and use storage accounts for long-term/archival storage. Alternatively, you may enable, and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM). 

How to enable diagnostic logs for Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/logging

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable diagnostic settings for Azure Cosmos DB and send the logs to a Log Analytics workspace or storage account. Diagnostic settings in Azure Cosmos DB are used to collect resource logs. These logs are captured per request and they are also referred to as "data plane logs". Some examples of the data plane operations include delete, insert, and read. You may also enable Azure Activity Log Diagnostic Settings and send them to the same Log Analytics Workspace.

How to enable Diagnostic Settings for Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/logging

How to enable Diagnostic Settings for Azure Activity Log: https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

**Guidance**: In Azure Monitor, set the log retention period for Log Analytics workspaces associated with your Azure Cosmos DB instances according to your organization's compliance regulations.

How to set log retention parameters: https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: You can perform queries in Log Analytics a workspace to search terms, identify trends, analyze patterns, and provide many other insights based on the Azure Cosmos DB logs that you gathered.

How to perform queries for Azure Cosmos DB in Log Analytics Workspaces: https://docs.microsoft.com/azure/cosmos-db/monitor-cosmos-db

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

**Guidance**: In Azure Security Center, enable Advanced Threat Protection for Azure Cosmos DB to monitor anomalous activities in security logs and events. Enable diagnostic settings in Azure Cosmos DB and send logs to a Log Analytics workspace.

 

You can also onboard your Log Analytics workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for playbooks (automated solutions) to be created and used to remediate security issues. Additionally, you can create custom log alerts in your Log Analytics workspace using Azure Monitor.

List of threat protection alerts for Azure Cosmos DB: https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-azurecosmos

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

Create, view, and manage log alerts using Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-log

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Not applicable; Azure Cosmos DB does not process or produce anti-malware related logs.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; Azure Cosmos DB does not process or produce DNS-related logs.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and Access Control

*For more information, see [Security Control: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: You can use the Identity and Access control (IAM) pane in the Azure portal to configure role-based access control (RBAC) and maintain inventory on Azure Cosmos DB resources. The roles are applied to users, groups, service principals, and managed identities in Active Directory. You can use built-in roles or custom roles for individuals and groups.

Azure Cosmos DB provides built-in RBAC for common management scenarios in Azure Cosmos DB. An individual who has a profile in Azure Active Directory (AD) can assign these RBAC roles to users, groups, service principals, or managed identities to grant or deny access to resources and operations on Azure Cosmos DB resources.

You can also use the Azure AD PowerShell module to perform adhoc queries to discover accounts that are members of administrative groups. 

Additionally, some actions in Azure Cosmos DB can be controlled with Azure Active Directory and account-specific master keys.  Use the 'disableKeyBasedMetadataWriteAccess' account setting to control key access.

Understand role-based access control in Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/role-based-access-control

Build your own custom roles using Azure Cosmos DB Actions (Microsoft.DocumentDB namespace): https://docs.microsoft.com/azure/role-based-access-control/resource-provider-operations#microsoftdocumentdb

Create a new role in Azure Active Directory: https://docs.microsoft.com/azure/role-based-access-control/custom-roles

How to get a directory role in Azure Active Directory with PowerShell: https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0

How to get members of a directory role in Azure Active Directory with PowerShell: https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0

Restrict user access to data operations only: https://docs.microsoft.com/azure/cosmos-db/how-to-restrict-user-data

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: The concept of default or blank passwords does not exist in relation to Azure AD or Azure Cosmos DB. Instead, Azure Cosmos DB uses two types of keys to authenticate users and provide access to its data and resources; master keys and resource tokens. The keys can be regenerated at any time.

Understanding secure access to data in Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/secure-access-to-data

How to regenerate Azure Cosmos DB Keys: https://docs.microsoft.com/azure/cosmos-db/manage-with-powershell#regenerate-keys

How to programmatically access keys using Azure Active Directory: https://docs.microsoft.com/azure/cosmos-db/certificate-based-authentication

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 3.3: Use dedicated administrative accounts

**Guidance**: Not applicable; Azure Cosmos DB does not support administrator accounts.  All access is integrated with Azure Active Directory and Azure role-based access control (RBAC).



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Azure Cosmos DB uses two types of keys to authorize users and does not support Single Sign-On (SSO) at the data plane level. Access to the control plane for Cosmos DB is available via REST API and supports SSO. To authenticate, set the Authorization header for your requests to a JSON Web Token that you obtain from Azure Active Directory.

Understand Azure Database for Cosmos DB REST API: https://docs.microsoft.com/rest/api/cosmos-db/

Understand SSO with Azure Active Directory: https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory Multi-Factor Authentication and follow Azure Security Center Identity and Access Management recommendations.

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

How to monitor identity and access within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use Privileged Access Workstations (PAW) with Multi-Factor Authentication configured to log into and configure Azure resources.

Learn about Privileged Access Workstations: https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Cosmos DB. ATP for Azure Cosmos DB provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit Azure Cosmos accounts. This layer of protection allows you to address threats and integrate them with central security monitoring systems. 

In addition, you may use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

Use Azure AD Risk Detections to view alerts and reports on risky user behavior.

How to deploy Privileged Identity Management (PIM): https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan

Understand Azure AD risk detections: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Configure the location condition of a Conditional Access policy and manage your named locations. With named locations, you can create logical groupings of IP address ranges or countries and regions. You can restrict access to sensitive resources, such as your Azure Cosmos DB instances, to your configured named locations.

How to configure Named Locations in Azure: https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

How to create and configure an Azure Active Directory instance: https://docs.microsoft.com/azure/active-directory-domain-services/tutorial-create-instance

How to configure and manage Azure Active Directory authentication with Azure SQL: https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication-configure

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory provides logs to help discover stale accounts. In addition, you can use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right Users have continued access.

How to use Azure Identity Access Reviews: https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

**Guidance**: You can create diagnostic settings for Azure Active Directory user accounts, sending the audit logs and sign-in logs to a Log Analytics workspace where you can configure desired alerts.

How to integrate Azure Activity Logs into Azure Monitor: https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Cosmos DB. ATP for Azure Cosmos DB provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit Azure Cosmos accounts. This layer of protection allows you to address threats and integrate them with central security monitoring systems. 

You can also use Azure AD Identity Protection and risk detections feature to configure automated responses to detected suspicious actions related to user identities. Additionally, you can ingest logs into Azure Sentinel for further investigation.

How to view Azure Active Directory risky sign-ins: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins

How to configure and enable Identity Protection risk policies: https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Currently not available; Customer Lockbox not yet supported for Azure Database for Cosmos DB.

List of Customer Lockbox supported services: https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Not applicable

## Data Protection

*For more information, see [Security Control: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure Cosmos DB instances that store or process sensitive information.

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Azure Cosmos DB instances are separated by virtual network/subnet, tagged appropriately, and secured within a network security group (NSG) or Azure Firewall. Azure Cosmos DB instances storing sensitive data should be isolated. By using Azure Private Link, you can connect to an Azure Cosmos DB instance account via a private endpoint. The private endpoint is a set of private IP addresses in a subnet within your virtual network. You can then limit access to the selected private IP addresses. 

How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create management groups: https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to configure a Private Endpoint for Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/how-to-configure-private-endpoints

How to create a Network Security Group with a Security Config: https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: You can deploy Advanced Threat Protection for Azure Cosmos DB, which will detect anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. It can currently trigger the following alerts:

- Access from unusual locations

- Unusual data extraction

Additionally, when using virtual machines to access your Azure Cosmos DB instances, make use of Private Link, Firewall, network security groups, and service tags to mitigate the possibility of data exfiltration. Microsoft manages the underlying infrastructure for Azure Cosmos DB and has implemented strict controls to prevent the loss or exposure of customer data.

How to configure Cosmos DB Advanced Threat Protection: https://docs.microsoft.com/azure/cosmos-db/cosmos-db-advanced-threat-protection

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: All connections to Azure Cosmos DB support HTTPS. Azure Cosmos DB also supports TLS1.2. It is possible to enforce a minimum TLS version server-side. To do so, please contact [azurecosmosdbtls@service.microsoft.com](mailto:azurecosmosdbtls@service.microsoft.com).

Overview of Cosmos DB Security: https://docs.microsoft.com/azure/cosmos-db/database-security

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Automatic data identification, classification, and loss prevention features are not yet available for Azure Cosmos DB. However, you can use the Azure Cognitive Search integration for classification and data analysis. You can also implement a third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Index Azure Cosmos DB data with Azure Cognitive Search: https://docs.microsoft.com/azure/search/search-howto-index-cosmosdb?toc=/azure/cosmos-db/toc.json&amp;bc=/azure/cosmos-db/breadcrumb/toc.json

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Azure Cosmos DB provides built-in role-based access control (RBAC) for common management scenarios in Azure Cosmos DB. An individual who has a profile in Azure Active Directory can assign these RBAC roles to users, groups, service principals, or managed identities to grant or deny access to resources and operations on Azure Cosmos DB resources. Role assignments are scoped to control-plane access only, which includes access to Azure Cosmos accounts, databases, containers, and offers (throughput).

How to implement RBAC in Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/role-based-access-control

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this guideline is intended for compute resources.

Microsoft manages the underlying infrastructure for Cosmos DB and has implemented strict controls to prevent the loss or exposure of customer data.

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

**Guidance**: All user data stored in Cosmos DB is encrypted at rest by default. There are no controls to turn it off. Azure Cosmos DB uses AES-256 encryption on all regions where the account is running.

By default, Microsoft manages the keys that are used to encrypt the data in your Azure Cosmos account. You can optionally choose to add a second layer of encryption with your own keys.

Understanding encryption at rest with Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/database-encryption-at-rest

Understanding key management for encryption at rest with Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/cosmos-db-security-controls

How to configure customer-managed keys for your Azure Cosmos DB account: https://docs.microsoft.com/azure/cosmos-db/how-to-setup-cmk

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to production instances of Azure Cosmos DB.

How to create alerts for Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

How to create alerts for Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Vulnerability Management

*For more information, see [Security Control: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Follow recommendations from Azure Security Center for your Azure Cosmos DB instances. 

Microsoft performs system patching and vulnerability management on the underlying hosts that support your Azure Cosmos DB instances. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Supported features available in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-services?tabs=features-windows

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Not applicable; this guideline is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.3: Deploy automated third-party software patch management solution

**Guidance**: Not applicable; this guideline is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Not applicable; this guideline is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Not applicable; this guideline is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Inventory and Asset Management

*For more information, see [Security Control: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

**Guidance**: Use the Azure portal or Azure Resource Graph to discover all resources (not limited to Azure Cosmos DB, but also including resources such as compute, other storage, network, ports, and protocols etc.) within your subscription(s).  Ensure you have appropriate permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

How to create queries with Azure Resource Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

How to view your Azure Subscriptions: https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

Understanding Azure role-based access control: https://docs.microsoft.com/azure/role-based-access-control/overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to your Azure Cosmos DB instances and related resources with metadata to logically organize them into a taxonomy.

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

Which Azure Cosmos DB resources support tags: https://docs.microsoft.com/azure/azure-resource-manager/management/tag-support#microsoftdocumentdb

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets, including but not limited to Azure Cosmos DB resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Maintain an inventory of approved Azure resources and software titles

**Guidance**: Not applicable; this guideline is intended for compute resources and Azure as a whole.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s).

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Not applicable; this baseline is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Not applicable; this guideline is intended for compute resources and Azure as a whole.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.8: Use only approved applications

**Guidance**: Not applicable; this guideline is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types 

- Allowed resource types

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to deny a specific resource type with Azure Policy: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Implement approved application list

**Guidance**: Not applicable; this guideline is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with AzureResources Manager via scripts

**Guidance**: Use the Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App. This can prevent the creation and changes to resources within a high security environment.

How to configure Conditional Access to block access to Azure Resource Manager: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this guideline is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Not applicable; this guideline is intended for web applications running on Azure App Service or compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure Configuration

*For more information, see [Security Control: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Cosmos DB instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.DocumentDB" namespace to create custom policies to audit or enforce the configuration of your Cosmos DB instances. You may also make use of built-in policy definitions for Azure Cosmos DB, such as:

- Deploy Advanced Threat Protection for Cosmos DB Accounts

- Cosmos DB should use a virtual network service endpoint

How to view available Azure Policy aliases: https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this guideline is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understand Azure Policy Effects: https://docs.microsoft.com/azure/governance/policy/concepts/effects

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; this guideline is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions for your Cosmos DB or related resources, use Azure Repos to securely store and manage your code.

Azure Repos Documentation: https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops
https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy system configuration management tools

**Guidance**: Use Azure Policy aliases in the "Microsoft.DocumentDB" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure services

**Guidance**: Use Azure Policy aliases in the "Microsoft.DocumentDB" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure Cosmos DB instances and related resources. 

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your Azure Cosmos DB instances, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure Azure Cosmos DB secret management. Ensure Key Vault Soft Delete is enabled.

How to integrate with Azure Managed Identities: https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity

How to create a Key Vault: https://docs.microsoft.com/azure/key-vault/quick-create-portal

How to provide Key Vault authentication with a managed identity: https://docs.microsoft.com/azure/key-vault/managed-identity

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your Azure Cosmos DB instances, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure Azure Cosmos DB secret management.

Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

How to configure Managed Identities: https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm

How to integrate with Azure Managed Identities: https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

How to set up Credential Scanner: https://secdevtools.azurewebsites.net/helpcredscan.html

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware Defense

*For more information, see [Security Control: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Not applicable; this guideline is intended for compute resources. Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

It is your responsibility to pre-scan any files being uploaded to non-compute Azure resources, including Azure Cosmos DB. Microsoft cannot access customer data, and therefore cannot conduct anti-malware scans of customer content on your behalf.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; benchmark is intended for compute resources. Microsoft Antimalware is enabled on the underlying host that supports Azure services, however it does not run on customer content.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data Recovery

*For more information, see [Security Control: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

**Guidance**: Azure Cosmos DB takes snapshots of your data every four hours. All the backups are stored separately in a storage service, and those backups are globally replicated for resiliency against regional disasters. At any given time, only the last two snapshots are retained. However, if the container or database is deleted, Azure Cosmos DB retains the existing snapshots of a given container or database for 30 days. Contact Azure Support to restore from a backup.

Understanding Azure Cosmos DB Automated Backups: https://docs.microsoft.com/azure/cosmos-db/online-backup-and-restore

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 9.2: Perform complete system backups and backup any customer managed keys

**Guidance**: Azure Cosmos DB automatically takes backups of your data at regular intervals. If database or container is deleted, you can file a support ticket or call Azure support to restore the data from automatic online backups. Azure support is available for selected plans only such as Standard, Developer, and plans higher than them. To restore a specific snapshot of the backup, Azure Cosmos DB requires that the data is available for the duration of the backup cycle for that snapshot. 

If using Key Vault to store credentials for your Cosmos DB instances, ensure regular automated backups of your keys.

Understand Azure Cosmos DB Automated Backups: https://docs.microsoft.com/azure/cosmos-db/online-backup-and-restore

How to restore data in Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/how-to-backup-and-restore

How to backup Key Vault Keys: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 9.3: Validate all backups including customer managed keys

**Guidance**: If database or container is deleted, you can file a support ticket or call Azure support to restore the data from automatic online backups. Azure support is available for selected plans only such as Standard, Developer, and plans higher than them. To restore a specific snapshot of the backup, Azure Cosmos DB requires that the data is available for the duration of the backup cycle for that snapshot.

Test restoration of your secrets stored in Azure Key Vault using PowerShell. The Restore-AzureKeyVaultKey cmdlet creates a key in the specified key vault. This key is a replica of the backed-up key in the input file and has the same name as the original key.

Understand Azure Cosmos DB Automated Backups:

https://docs.microsoft.com/azure/cosmos-db/online-backup-and-restore

How to restore data in Azure Cosmos DB:

https://docs.microsoft.com/azure/cosmos-db/how-to-backup-and-restore

How to restore Azure Key Vault Secrets:

https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 9.4: Ensure protection of backups and customer managed keys

**Guidance**: Because all user data stored in Cosmos DB is encrypted at rest and in transport, you don't have to take any action. Another way to put this is that encryption at rest is "on" by default. There are no controls to turn it off or on. Azure Cosmos DB uses AES-256 encryption on all regions where the account is running.

Enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.

Understand data encryption in Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/database-encryption-at-rest

How to enable Soft-Delete in Key Vault: https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

## Incident Response

*For more information, see [Security Control: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

You may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf

How to configure Workflow Automations within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide

Guidance on building your own security incident response process: https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/

Microsoft Security Response Center's Anatomy of an Incident: https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident the Security Center is in finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

How to set the Azure Security Center Security Contact: https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

How to configure continuous export: https://docs.microsoft.com/azure/security-center/continuous-export

How to stream alerts into Azure Sentinel: https://docs.microsoft.com/azure/sentinel/connect-azure-security-center

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

How to configure Workflow Automation and Logic Apps: https://docs.microsoft.com/azure/security-center/workflow-automation

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see [Security Control: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings within 60 days

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies: 
https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1

You can find more information on Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here:  https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure Security Baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
