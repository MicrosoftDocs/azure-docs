---
title: Azure security baseline for Synapse Analytics
description: The Synapse Analytics security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: synapse-analytics
ms.subservice: security
ms.topic: conceptual
ms.date: 07/22/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Synapse Analytics

The Azure Security Baseline for Synapse Analytics contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network security

*For more information, see [Security control: Network security](/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Secure your Azure SQL Server to a virtual network via Private Link. Azure Private Link enables you to access Azure PaaS services over a private endpoint in your virtual network. Traffic between your virtual network and the service travels the Microsoft backbone network.

Alternatively, when connecting to your Synapse SQL pool, narrow down the scope of the outgoing connection to the SQL database by using a network security group. Disable all Azure service traffic to the SQL database via the public endpoint by setting Allow Azure Services to OFF. Ensure no public IP addresses are allowed in the firewall rules.

* [Understand Azure Private Link](https://docs.microsoft.com/azure/private-link/private-link-overview)

* [Understand Private Link for Azure Synapse SQL](https://docs.microsoft.com/azure/sql-database/sql-database-private-endpoint-overview)

* [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

* [How to create an NSG with a security configuration](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: When connecting to your dedicated SQL pool, and you have enabled network security group (NSG) flow logs, logs are sent into an Azure Storage Account for traffic auditing.

You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

* [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [Understand Network Security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

* [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

* [Understand Network Security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Not applicable; this recommendation is intended for Azure Apps Service or compute resources hosting web applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Synapse SQL. ATP detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases and it can trigger various alerts, such as, "Potential SQL injection," and, "Access from unusual location." ATP is part of the Advanced data security (ADS) offering and can be accessed and managed via the central SQL ADS portal.

Enable DDoS Protection Standard on the Virtual Networks associated with Azure Synapse SQL for protection from distributed denial-of-service attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

* [Understand ATP for Azure Synapse SQL](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview)

* [How to enable Advanced Data Security for Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security)

* [ADS overview](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security)

* [How to configure DDoS protection](https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection)

* [Understand Azure Security Center Integrated Threat Intelligence](https://docs.microsoft.com/azure/security-center/security-center-alerts-data-services)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets

**Guidance**: When connecting to your dedicated SQL pool, and you have enabled network security group (NSG) flow logs, send logs into an Azure Storage Account for traffic auditing. You can also send flow logs to a Log Analytics workspace or stream them to Event Hubs. If required for investigating anomalous activity, enable Network Watcher packet capture.

* [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [How to enable Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Synapse SQL. ATP detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases and it can trigger various alerts, such as, "Potential SQL injection," and, "Access from unusual location." ATP is part of the Advanced data security (ADS) offering and can be accessed and managed via the central SQL ADS portal. ATP also integrates alerts with Azure Security Center.

* [Understand ATP for Azure Synapse SQL](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable; this recommendation is intended for Azure Apps Service or compute resources hosting web applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use virtual network service tags to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

When using a service endpoint for your dedicated SQL pool, outbound to Azure SQL database Public IP addresses is required: Network Security Groups (NSGs) must be opened to Azure SQL Database IPs to allow connectivity. You can do this by using NSG service tags for Azure SQL Database.

* [Understand service tags with service endpoints for Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview#limitations)

* [Understand and using service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement network security configurations for resources related to your dedicated SQL pool with Azure Policy. You may use the "Microsoft.Sql" namespace to define custom policy definitions or use any of the built-in policy definitions designed for Azure SQL database/server network protection. An example of an applicable built-in network security policy for Azure SQL Database server would be: "SQL Server should use a virtual network service endpoint".

Use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Management templates, Azure role-based access control (Azure RBAC), and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to create an Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network security groups (NSG) and other resources related to network security and traffic flow. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your dedicated SQL pool. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

* [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

* [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains time sources for Azure resources. You may update time synchronization for your compute deployments.

* [How to configure time synchronization for Azure compute resources](https://docs.microsoft.com/azure/virtual-machines/windows/time-sync)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: An auditing policy can be defined for a specific database or as a default server policy in Azure (which hosts Azure Synapse). A server policy applies to all existing and newly created databases on the server.

If server auditing is enabled, it always applies to the database. The database will be audited, regardless of the database auditing settings.

When you enable auditing, you can write them to an audit log in your Azure Storage Account, Log Analytics workspace, or Event Hubs.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

* [How to setup auditing for your Azure SQL resources](https://docs.microsoft.com/azure/azure-sql/database/auditing-overview#server-vs-database-level)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable auditing on the Azure SQL server-level for your dedicated SQL pool and choose a storage location for the audit logs (Azure Storage, Log Analytics, or Event Hubs).

Auditing can be enabled both on the database or server level, and is suggested to be only enabled on the server-level, unless you require configuring a separate data sink or retention for a specific database.

* [How to enable auditing for Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-auditing)

* [How to enable auditing for your server](https://docs.microsoft.com/azure/azure-sql/database/auditing-overview#setup-auditing)

* [Differences in server-level vs. database-level auditing policies](https://docs.microsoft.com/azure/sql-database/sql-database-auditing#server-vs-database-level)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this benchmark is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

**Guidance**: When storing logs related to your dedicated SQL pool in a Storage Account, Log Analytics workspace, or event hubs, set log retention period according to your organization's compliance regulations.

* [Manage the Azure Blob storage lifecycle](https://docs.microsoft.com/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal)

* [How to set log retention parameters in a Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

* [Capture streaming events in Event Hubs](https://docs.microsoft.com/azure/event-hubs/event-hubs-capture-overview)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.6: Monitor and review logs

**Guidance**: Analyze and monitor logs for anomalous behaviors and regularly review results. Use Advanced Threat Protection for Azure SQL Database in conjunction with Azure Security Center to alert on unusual activity related to your SQL database. Alternatively, configure alerts based on metric values or Azure Activity Log entries related to your SQL database.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

* [Understand Advanced Threat Protection and alerting for Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview)

* [How to enable Advanced Data Security for Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security)

* [How to configure custom alerts for Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-insights-alerts-portal?view=azps-1.4.0&preserve-view=true)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Advanced Threat Protection (ATP) for Azure SQL Database in conjunction with Azure Security Center to monitor and alert on anomalous activity. ATP is part of the Advanced data security (ADS) offering and can be accessed and managed via central SQL ADS in the portal. ADS includes functionality for discovering and classifying sensitive data, surfacing and mitigating potential database vulnerabilities, and detecting anomalous activities that could indicate a threat to your database.

Alternatively, you may enable and on-board data to Azure Sentinel.

* [Understand Advanced Threat Protection and alerting for Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview)

* [How to enable Advanced Data Security for Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security)

* [How to manage alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Not applicable; for resources related to your dedicated SQL pool, the anti-malware solution is managed by Microsoft on the underlying platform.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; no DNS logs are produced by resources related to your dedicated SQL pool.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

**Guidance**: Not applicable; command-line auditing is not applicable to Azure Synapse SQL.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and access control

*For more information, see [Security control: Identity and access control](/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Users are authenticated with either Azure Active Directory or SQL Authentication.

When you first deploy Azure SQL, you specify an admin login and an associated password for that login. This administrative account is called Server admin. You can identify the administrator accounts for a database by opening the Azure portal and navigating to the properties tab of your server or managed instance. You can also configure an Azure AD admin account with full administrative permissions, this is required if you want to enable Azure Active Directory authentication.

For management operations, use the Azure built-in roles which must be explicitly assigned. Use the Azure AD PowerShell module to perform ad-hoc queries to discover accounts that are members of administrative groups.

* [Authentication for SQL Database](https://docs.microsoft.com/azure/azure-sql/database/security-overview#authentication)

* [Create accounts for non-administrative users](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage#create-accounts-for-non-administrator-users)

* [Use an Azure Active Directory account for authentication](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage#create-additional-logins-and-users-having-administrative-permissions)

* [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0&preserve-view=true)

* [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0&preserve-view=true)

* [How to manage existing logins and admin accounts in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage#existing-logins-and-user-accounts-after-creating-a-new-database)

* [Azure built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: Azure Active Directory does not have the concept of default passwords. When provisioning an dedicated SQL pool, it is recommended that you choose to integrate authentication with Azure Active Directory. With this authentication method, the user submits a user account name and requests that the service use the credential information stored in Azure Active Directory (Azure AD).

* [How to configure and manage Azure Active Directory authentication with Azure SQL](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication-configure?tabs=azure-powershell#active-directory-password-authentication)

* [Understand authentication in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage#existing-logins-and-user-accounts-after-creating-a-new-database)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Create policies and procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts that sign in via Azure Active Directory.

To identify the administrator accounts for a database, open the Azure portal, and navigate to the Properties tab of your server or managed instance.

* [Understand Azure Security Center Identity and Access](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

* [How to manage existing logins and admin accounts in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage#existing-logins-and-user-accounts-after-creating-a-new-database)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Use an Azure app registration (service principal) to retrieve a token that can be used to interact with your data warehouse at the control plane (Azure portal) via API calls.

* [How to call Azure REST APIs](https://docs.microsoft.com/rest/api/azure/#how-to-call-azure-rest-apis-with-postman)

* [How to register your client application (service principal) with Azure AD](https://docs.microsoft.com/rest/api/azure/#register-your-client-application-with-azure-ad)

* [Azure Synapse SQL REST API information](https://docs.microsoft.com/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-manage-compute-rest-api)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (AD) Multi-Factor Authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

* [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

* [Understand MFA in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/authentication-mfa-ssms-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use a Privileged Access Workstation (PAW) with Multi-Factor Authentication (MFA) configured to log into and configure Azure resources.

* [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

Use Advanced Threat Protection for Azure SQL Database in conjunction with Azure Security Center to detect and alert on anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

SQL Server audit lets you create server audits, which can contain server audit specifications for server level events, and database audit specifications for database level events. Audited events can be written to the event logs or to audit files.

* [How to identify Azure AD users flagged for risky activity](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk)

* [How to monitor users identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

* [Review Advanced Threat Protection and potential alerts](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview#advanced-threat-protection-alerts)

* [Understand logins and user accounts in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage)

* [Understand SQL Server Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine?view=sql-server-ver15&preserve-view=true)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow Portal and Azure Resource Management access from only specific logical groupings of IP address ranges or countries/regions.

* [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Create an Azure Active Directory (AD) administrator for the Azure SQL Database server in your dedicated SQL pool.

* [How to configure and manage Azure AD authentication with Azure SQL](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication-configure)

* [How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory-domain-services/tutorial-create-instance)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory provides logs to help you discover stale accounts. In addition, use Azure Active Directory access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. Users' access can be reviewed on a regular basis to make sure only the right users have continued access.

When using SQL authentication, create contained database users in the database. Ensure that you place one or more database users into a custom database role with specific permissions appropriate to that group of users.

* [How to use access reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

* [Understand logins and user accounts in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Configure Azure Active Directory (AD) authentication with Azure SQL and enable diagnostic settings for Azure Active Directory user accounts, sending the audit logs and sign-in logs to a Log Analytics workspace. Configure desired alerts within Log Analytics.

When using SQL authentication, create contained database users in the database. Ensure that you place one or more database users into a custom database role with specific permissions appropriate to that group of users.

* [How to use access reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

* [How to configure and manage Azure AD authentication with Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication-configure)

* [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

* [Understand logins and user accounts in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities. Additionally, you can on-board and ingest data into Azure Sentinel for further investigation.

When using SQL authentication, create contained database users in the database. Ensure that you place one or more database users into a custom database role with specific permissions appropriate to that group of users.

* [How to view Azure AD risk sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

* [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

* [How to on-board Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-data-sources)

* [Understand logins and user accounts in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: In support scenarios where Microsoft needs to access data related to the Azure SQL Database in your dedicated SQL pool, Azure Customer Lockbox provides an interface for you to review and approve or reject data access requests.

* [Understand Customer Lockbox](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

Data Discovery &amp; Classification is built into Azure Synapse SQL. It provides advanced capabilities for discovering, classifying, labeling, and reporting the sensitive data in your databases.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [Understand Data Discovery &amp; Classification](https://docs.microsoft.com/azure/azure-sql/database/data-discovery-and-classification-overview)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by virtual network/subnet, tagged appropriately, and secured within a network security group or Azure Firewall. Resources storing or processing sensitive data should be isolated. Use Private Link; deploy your Azure SQL Server inside a virtual network and connect securely using Private Link.

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [How to set up Private Link for Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-private-endpoint-overview#how-to-set-up-private-link-for-azure-sql-database)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: For any Azure SQL Database in your dedicated SQL pool storing or processing sensitive information, mark the database and related resources as sensitive using tags. Configure Private Link in conjunction with network security group (NSG) service tags on your Azure SQL Database instances to prevent the exfiltration of sensitive information.

Additionally, Advanced Threat Protection for Azure SQL Database, Azure SQL Managed Instance and Azure Synapse detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

* [How to configure Private Link and NSGs to prevent data exfiltration on your Azure SQL Database instances](https://docs.microsoft.com/azure/sql-database/sql-database-private-endpoint-overview)

* [Understand Advanced Threat Protection for Azure SQL Database](https://docs.microsoft.com/azure/azure-sql/database/threat-detection-overview)

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Azure SQL Database secures your data by encrypting data in motion with Transport Layer Security. SQL Server enforces encryption (SSL/TLS) at all times for all connections. This ensures all data is encrypted "in transit" between the client and server irrespective of the setting of Encrypt or TrustServerCertificate in the connection string.

* [Understand Azure SQL Encryption in Transit](https://docs.microsoft.com/azure/sql-database/sql-database-security-overview#information-protection-and-encryption)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Use the Azure Synapse SQL Data Discovery &amp; Classification feature. Data Discovery &amp; Classification provides advanced capabilities built into Azure SQL Database for discovering, classifying, labeling &amp; protecting the sensitive data in your databases.

Data Discovery &amp; Classification is part of the Advanced Data Security offering, which is a unified package for advanced SQL security capabilities. Data discovery &amp; classification can be accessed and managed via the central SQL ADS portal.

Additionally, you can set up a dynamic data masking (DDM) policy in the Azure portal. The DDM recommendations engine flags certain fields from your database as potentially sensitive fields which may be good candidates for masking.

* [How to use data discovery and classification for Azure SQL Server](https://docs.microsoft.com/azure/sql-database/sql-database-data-discovery-and-classification)

* [Understand dynamic data masking for Azure Synapse SQL](https://docs.microsoft.com/azure/sql-database/sql-database-dynamic-data-masking-get-started)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Use Azure role-based access control (Azure RBAC) to manage access to Azure SQL databases in your dedicated SQL pool.

Authorization is controlled by your user account's database role memberships and object-level permissions. As a best practice, you should grant users the least privileges necessary.

* [How to integrate Azure SQL Server with Azure Active Directory for authentication](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication)

* [How to control access in Azure SQL Server](https://docs.microsoft.com/azure/sql-database/sql-database-control-access)

* [Understand authorization and authentication in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; Microsoft manages the underlying infrastructure for Azure Synapse SQL and has implemented strict controls to prevent the loss or exposure of customer data.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

**Guidance**: Transparent data encryption (TDE) helps protect Azure Synapse SQL against the threat of malicious offline activity by encrypting data at rest. It performs real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application. In Azure, the default setting for TDE is that the DEK is protected by a built-in server certificate. Alternatively, you can use customer-managed TDE, also referred to as Bring Your Own Key (BYOK) support for TDE. In this scenario, the TDE Protector that encrypts the DEK is a customer-managed asymmetric key, which is stored in a customer-owned and managed Azure Key Vault (Azure's cloud-based external key management system) and never leaves the key vault.

* [Understand service-managed transparent data encryption](https://docs.microsoft.com/azure/azure-sql/database/transparent-data-encryption-tde-overview?tabs=azure-portal)

* [Understand customer-managed transparent data encryption](https://docs.microsoft.com/azure/azure-sql/database/transparent-data-encryption-tde-overview?tabs=azure-portal#customer-managed-transparent-data-encryption---bring-your-own-key)

* [How to turn on TDE by using your own key](https://docs.microsoft.com/azure/azure-sql/database/transparent-data-encryption-byok-configure)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to production instances of Synapse SQL pools and other critical or related resources.

Additionally, you can set up alerts for databases in your SQL Synapse pool using the Azure portal. Alerts can send you an email or call a web hook when some metric (for example database size or CPU usage) reaches the threshold.

* [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

* [How to create alerts for Azure SQL Synapse](https://docs.microsoft.com/azure/azure-sql/database/alerts-insights-configure-portal)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Enable Advanced Data Security and follow recommendations from Azure Security Center on performing vulnerability assessments on your Azure SQL databases.

* [How to run vulnerability assessments on your Azure SQL databases](https://docs.microsoft.com/azure/sql-database/sql-vulnerability-assessment)

* [How to enable Advanced Data Security](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security)

* [How to implement Azure Security Center vulnerability assessment recommendations](https://docs.microsoft.com/azure/security-center/security-center-vulnerability-assessment-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Vulnerability Assessment is a scanning service built into Azure Synapse SQL. The service employs a knowledge base of rules that flag security vulnerabilities. It highlights deviations from best practices, such as misconfigurations, excessive permissions, and unprotected sensitive data. Vulnerability Assessment can be accessed and managed via the central SQL Advanced Data Security (ADS) portal.

* [Manage and Export vulnerability assessment scans in the SQL ADS portal](https://docs.microsoft.com/azure/sql-database/sql-vulnerability-assessment)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center.

Data Discovery &amp; Classification is built into Azure Synapse SQL. It provides advanced capabilities for discovering, classifying, labeling, and reporting the sensitive data in your databases.

* [Understand Azure Security Center Secure Score](https://docs.microsoft.com/azure/security-center/security-center-secure-score)

* [Understand Data Discovery &amp; Classification](https://docs.microsoft.com/azure/azure-sql/database/data-discovery-and-classification-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all resources related to your dedicated SQL pool within your subscription(s). Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Azure Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

* [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

* [How to view your Azure subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0&preserve-view=true)

* [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Define a list of approved Azure resources related to your dedicated SQL pool.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscriptions. Ensure that all Azure resources present in the environment are approved.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.8: Use only approved applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to place restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Not applicable; this recommendation is intended for applications running on compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

* [How to configure Conditional Access to block access to Azure Resource Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Any resource related to your dedicated SQL pool that is required for business operations, but may incur higher risk for the organization, should be isolated within its own virtual machine and/or virtual network and sufficiently secured with either an Azure Firewall or Network Security Group.

* [How to create a virtual network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

* [How to create an NSG with a security config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure configuration

*For more information, see [Security control: Secure configuration](/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.Sql" namespace to create custom policies to audit or enforce the configuration of resources related to your dedicated SQL pool. You may also make use of built-in policy definitions for Azure Database/Server, such as:
- Deploy Threat Detection on SQL servers
- SQL Server should use a virtual network service endpoint

* [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0&preserve-view=true)

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

* [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops&preserve-view=true)

* [Azure Repos documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops&preserve-view=true)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Not applicable; Azure Synapse SQL does not have configurable security settings.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Leverage Azure Security Center to perform baseline scans for any resources related to your dedicated SQL pool.

* [How to remediate recommendations in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-sql-service-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

**Guidance**: Transparent Data Encryption (TDE) with customer-managed keys in Azure Key Vault allows to encrypt the automatically-generated Database Encryption Key (DEK) with a customer-managed asymmetric key called TDE Protector. This is also generally referred to as Bring Your Own Key (BYOK) support for Transparent Data Encryption. In the BYOK scenario, the TDE Protector is stored in a customer-owned and managed Azure Key Vault. In addition, ensure soft delete is enabled in Azure Key Vault.

* [How to enable TDE with customer-managed key from Azure Key Vault](https://docs.microsoft.com/azure/azure-sql/database/transparent-data-encryption-byok-configure?tabs=azure-powershell)

* [How to enable soft delete in Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-soft-delete-powershell)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Azure Key Vault, without any credentials in your code.

* [Tutorial: Use a Windows VM system-assigned managed identity to access Azure SQL](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-sql)

* [How to configure Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within your code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

* [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally-managed anti-malware software

**Guidance**: Not applicable; this recommendation is intended for compute resources. Microsoft handles anti-malware for underlying platform.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Synapse SQL); however, it does not run on customer content.

Pre-scan any content being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, Azure SQL Server, etc. Microsoft cannot access your data in these instances.

* [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](https://docs.microsoft.com/azure/security/fundamentals/antimalware)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for compute resources. Microsoft handles anti-malware for underlying platform.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data recovery

*For more information, see [Security control: Data recovery](/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Snapshots of your dedicated SQL pool are automatically taken throughout the day creating restore points that are available for seven days. This retention period cannot be changed. Dedicated SQL pool supports an eight-hour recovery point objective (RPO). You can restore your data warehouse in the primary region from any one of the snapshots taken in the past seven days. Note that you can also manually trigger snapshots if necessary.

* [Backup and restore in dedicated SQL pool](/azure/synapse-analytics/sql-data-warehouse/backup-and-restore)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Snapshots of your data warehouse are automatically taken throughout the day creating restore points that are available for seven days. This retention period cannot be changed. Dedicated SQL pool supports an eight-hour recovery point objective (RPO). You can restore your data warehouse in the primary region from any one of the snapshots taken in the past seven days. Note that you can also manually trigger snapshots if necessary.

If you are using a customer-managed key to encrypt your Database Encryption Key, ensure your key is being backed up.

* [Backup and restore in dedicated SQL pool](https://docs.microsoft.com/azure/synapse-analytics/sql-data-warehouse/backup-and-restore)

* [How to backup Azure Key Vault keys](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0&preserve-view=true)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Periodically test your restore points to ensure your snapshots are valid. To restore an existing dedicated SQL pool from a restore point, you can use either the Azure portal or PowerShell. Test restoration of backed up customer-managed keys.

* [How to restore Azure Key Vault keys](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0&preserve-view=true)

* [Backup and restore in dedicated SQL pool](https://docs.microsoft.com/azure/synapse-analytics/sql-data-warehouse/backup-and-restore)

* [How to restore an existing dedicated SQL pool](https://docs.microsoft.com/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-restore-active-paused-dw)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: In Azure SQL Database, you can configure a single or a pooled database with a long-term backup retention policy (LTR) to automatically retain the database backups in separate Azure Blob storage containers for up to 10 years. Data in Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant.

By default, data in a storage account is encrypted with Microsoft-managed keys. You can rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. If you are managing your own keys with Key Vault, ensure soft-delete is enabled.

* [Manage Azure SQL Database long-term backup retention](https://docs.microsoft.com/azure/sql-database/sql-database-long-term-backup-retention-configure)

* [Azure Storage encryption for data at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)

* [How to enable soft delete in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Ensure that there are written incident response plans that defines roles of personnel as well as phases of incident handling/management.

* [How to configure Workflow Automations within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

* [Security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

* [You can refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party.

* [How to set the Azure Security Center Security Contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Sentinel.

* [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

* [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

* [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: * [Please follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1.)

* [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft managed cloud infrastructure, services and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
