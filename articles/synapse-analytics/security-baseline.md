---
title: Azure security baseline for Synapse Analytics
description: The Synapse Analytics security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: synapse-analytics
ms.subservice: security
ms.topic: conceptual
ms.date: 03/16/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Synapse Analytics

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to Synapse Analytics. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Synapse Analytics. **Controls** not applicable to Synapse Analytics have been excluded.

 
To see how Synapse Analytics completely maps to the Azure
Security Benchmark, see the [full Synapse Analytics security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Secure your Azure SQL Server to a virtual network via Private Link. Azure Private Link enables you to access Azure PaaS services over a private endpoint in your virtual network. Traffic between your virtual network and the service travels the Microsoft backbone network.

Alternatively, when connecting to your Synapse SQL pool, narrow down the scope of the outgoing connection to the SQL database by using a network security group. Disable all Azure service traffic to the SQL database via the public endpoint by setting Allow Azure Services to OFF. Ensure no public IP addresses are allowed in the firewall rules.

- [Understand Azure Private Link](../private-link/private-link-overview.md)

- [Understand Private Link for Azure Synapse SQL](../azure-sql/database/private-endpoint-overview.md)

- [How to create a Virtual Network](../virtual-network/quick-create-portal.md)

- [How to create an NSG with a security configuration](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.sql-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: When connecting to your dedicated SQL pool, and you have enabled network security group (NSG) flow logs, logs are sent into an Azure Storage Account for traffic auditing.

You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Synapse SQL. ATP detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases and it can trigger various alerts, such as, "Potential SQL injection," and, "Access from unusual location." ATP is part of the Advanced data security (ADS) offering and can be accessed and managed via the central SQL ADS portal.

Enable DDoS Protection Standard on the Virtual Networks associated with Azure Synapse SQL for protection from distributed denial-of-service attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

- [Understand ATP for Azure Synapse SQL](../azure-sql/database/threat-detection-overview.md)

- [How to enable Advanced Data Security for Azure SQL Database](../azure-sql/database/azure-defender-for-sql.md)

- [ADS overview](../azure-sql/database/azure-defender-for-sql.md)

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

- [Understand Azure Security Center Integrated Threat Intelligence](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: When connecting to your dedicated SQL pool, and you have enabled network security group (NSG) flow logs, send logs into an Azure Storage Account for traffic auditing. You can also send flow logs to a Log Analytics workspace or stream them to Event Hubs.  If required for investigating anomalous activity, enable Network Watcher packet capture.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to enable Network Watcher](../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Synapse SQL. ATP detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases and it can trigger various alerts, such as, "Potential SQL injection," and, "Access from unusual location." ATP is part of the Advanced data security (ADS) offering and can be accessed and managed via the central SQL ADS portal. ATP also integrates alerts with Azure Security Center.

- [Understand ATP for Azure Synapse SQL](../azure-sql/database/threat-detection-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use virtual network service tags to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

When using a service endpoint for your dedicated SQL pool, outbound to Azure SQL database Public IP addresses is required: Network Security Groups (NSGs) must be opened to Azure SQL Database IPs to allow connectivity. You can do this by using NSG service tags for Azure SQL Database.

- [Understand service tags with service endpoints for Azure SQL Database](https://docs.microsoft.com/azure/azure-sql/database/vnet-service-endpoint-rule-overview#limitations)

- [Understand and using service tags](../virtual-network/service-tags-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement network security configurations for resources related to your dedicated SQL pool with Azure Policy. You may use the "Microsoft.Sql" namespace to define custom policy definitions or use any of the built-in policy definitions designed for Azure SQL database/server network protection. An example of an applicable built-in network security policy for Azure SQL Database server would be: "SQL Server should use a virtual network service endpoint".

Use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Management templates, Azure role-based access control (Azure RBAC), and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network security groups (NSG) and other resources related to network security and traffic flow. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your dedicated SQL pool. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/essentials/activity-log#view-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: An auditing policy can be defined for a specific database or as a default server policy in Azure (which hosts Azure Synapse). A server policy applies to all existing and newly created databases on the server.

If server auditing is enabled, it always applies to the database. The database will be audited, regardless of the database auditing settings.

When you enable auditing, you can write them to an audit log in your Azure Storage Account, Log Analytics workspace, or Event Hubs.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

- [How to setup auditing for your Azure SQL resources](https://docs.microsoft.com/azure/azure-sql/database/auditing-overview#server-vs-database-level)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable auditing on the Azure SQL server-level for your dedicated SQL pool and choose a storage location for the audit logs (Azure Storage, Log Analytics, or Event Hubs).

Auditing can be enabled both on the database or server level, and is suggested to be only enabled on the server-level, unless you require configuring a separate data sink or retention for a specific database.

- [How to enable auditing for Azure SQL Database](../azure-sql/database/auditing-overview.md)

- [How to enable auditing for your server](https://docs.microsoft.com/azure/azure-sql/database/auditing-overview#setup-auditing)

- [Differences in server-level vs. database-level auditing policies](https://docs.microsoft.com/azure/azure-sql/database/auditing-overview#server-vs-database-level)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 2.3](../../includes/policy/standards/asb/rp-controls/microsoft.sql-2-3.md)]

### 2.5: Configure security log storage retention

**Guidance**: When storing logs related to your dedicated SQL pool in a Storage Account, Log Analytics workspace, or event hubs, set log retention period according to your organization's compliance regulations.

- [Manage the Azure Blob storage lifecycle](../storage/blobs/storage-lifecycle-management-concepts.md)

- [How to set log retention parameters in a Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/logs/manage-cost-storage#change-the-data-retention-period)

- [Capture streaming events in Event Hubs](../event-hubs/event-hubs-capture-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 2.5](../../includes/policy/standards/asb/rp-controls/microsoft.sql-2-5.md)]

### 2.6: Monitor and review logs

**Guidance**: Analyze and monitor logs for anomalous behaviors and regularly review results. Use Advanced Threat Protection for Azure SQL Database in conjunction with Azure Security Center to alert on unusual activity related to your SQL database. Alternatively, configure alerts based on metric values or Azure Activity Log entries related to your SQL database.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

- [Understand Advanced Threat Protection and alerting for Azure SQL Database](../azure-sql/database/threat-detection-overview.md)

- [How to enable Advanced Data Security for Azure SQL Database](../azure-sql/database/azure-defender-for-sql.md)

- [How to configure custom alerts for Azure SQL Database](../azure-sql/database/alerts-insights-configure-portal.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Advanced Threat Protection (ATP) for Azure SQL Database in conjunction with Azure Security Center to monitor and alert on anomalous activity. ATP is part of the Advanced data security (ADS) offering and can be accessed and managed via central SQL ADS in the portal. ADS includes functionality for discovering and classifying sensitive data, surfacing and mitigating potential database vulnerabilities, and detecting anomalous activities that could indicate a threat to your database.

Alternatively, you may enable and on-board data to Azure Sentinel.

- [Understand Advanced Threat Protection and alerting for Azure SQL Database](../azure-sql/database/threat-detection-overview.md)

- [How to enable Advanced Data Security for Azure SQL Database](../azure-sql/database/azure-defender-for-sql.md)

- [How to manage alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 2.7](../../includes/policy/standards/asb/rp-controls/microsoft.sql-2-7.md)]

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Users are authenticated with either Azure Active Directory (Azure AD) or SQL Authentication.

When you first deploy Azure SQL, you specify an admin login and an associated password for that login. This administrative account is called Server admin. You can identify the administrator accounts for a database by opening the Azure portal and navigating to the properties tab of your server or managed instance. You can also configure an Azure AD admin account with full administrative permissions, this is required if you want to enable Azure AD authentication.

For management operations, use the Azure built-in roles which must be explicitly assigned. Use the Azure AD PowerShell module to perform ad-hoc queries to discover accounts that are members of administrative groups.

- [Authentication for SQL Database](https://docs.microsoft.com/azure/azure-sql/database/security-overview#authentication)

- [Create accounts for non-administrative users](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage#create-accounts-for-non-administrator-users)

- [Use an Azure AD account for authentication](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage#create-additional-logins-and-users-having-administrative-permissions)

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

- [How to manage existing logins and admin accounts in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage#existing-logins-and-user-accounts-after-creating-a-new-database)

- [Azure built-in roles](../role-based-access-control/built-in-roles.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Azure Active Directory (Azure AD) does not have the concept of default passwords. When provisioning a dedicated SQL pool, it is recommended that you choose to integrate authentication with Azure AD. With this authentication method, the user submits a user account name and requests that the service use the credential information stored in Azure AD.

- [How to configure and manage Azure AD authentication with Azure SQL](../azure-sql/database/authentication-aad-configure.md)

- [Understand authentication in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage#existing-logins-and-user-accounts-after-creating-a-new-database)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create policies and procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts that sign in via Azure Active Directory (Azure AD).

To identify the administrator accounts for a database, open the Azure portal, and navigate to the Properties tab of your server or managed instance.

- [Understand Azure Security Center Identity and Access](../security-center/security-center-identity-access.md)

- [How to manage existing logins and admin accounts in Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/logins-create-manage#existing-logins-and-user-accounts-after-creating-a-new-database)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Use an Azure app registration (service principal) to retrieve a token that can be used to interact with your data warehouse at the control plane (Azure portal) via API calls.

- [How to call Azure REST APIs](/rest/api/azure/#how-to-call-azure-rest-apis-with-postman)

- [How to register your client application (service principal) with Azure Active Directory (Azure AD)](/rest/api/azure/#register-your-client-application-with-azure-ad)

- [Azure Synapse SQL REST API information](sql-data-warehouse/sql-data-warehouse-manage-compute-rest-api.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

- [Understand multifactor authentication in Azure SQL](../azure-sql/database/authentication-mfa-ssms-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use a Privileged Access Workstation (PAW) with multifactor authentication configured to log into and configure Azure resources.

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

Use Advanced Threat Protection for Azure SQL Database in conjunction with Azure Security Center to detect and alert on anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

SQL Server audit lets you create server audits, which can contain server audit specifications for server level events, and database audit specifications for database level events. Audited events can be written to the event logs or to audit files.

- [How to identify Azure AD users flagged for risky activity](../active-directory/identity-protection/overview-identity-protection.md)

- [How to monitor users identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)

- [Review Advanced Threat Protection and potential alerts](https://docs.microsoft.com/azure/azure-sql/database/threat-detection-overview#alerts)

- [Understand logins and user accounts in Azure SQL](../azure-sql/database/logins-create-manage.md)

- [Understand SQL Server Auditing](/sql/relational-databases/security/auditing/sql-server-audit-database-engine)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow Portal and Azure Resource Management access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Create an Azure Active Directory (Azure AD) administrator for the Azure SQL Database server in your dedicated SQL pool.

- [How to configure and manage Azure AD authentication with Azure SQL](../azure-sql/database/authentication-aad-configure.md)

- [How to create and configure an Azure AD instance](../active-directory-domain-services/tutorial-create-instance.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 3.9](../../includes/policy/standards/asb/rp-controls/microsoft.sql-3-9.md)]

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help you discover stale accounts. In addition, use Azure AD access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. Users' access can be reviewed on a regular basis to make sure only the right users have continued access.

When using SQL authentication, create contained database users in the database. Ensure that you place one or more database users into a custom database role with specific permissions appropriate to that group of users.

- [How to use access reviews](../active-directory/governance/access-reviews-overview.md)

- [Understand logins and user accounts in Azure SQL](../azure-sql/database/logins-create-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Configure Azure Active Directory (Azure AD) authentication with Azure SQL and enable diagnostic settings for Azure AD user accounts, sending the audit logs and sign-in logs to a Log Analytics workspace. Configure desired alerts within Log Analytics.

When using SQL authentication, create contained database users in the database. Ensure that you place one or more database users into a custom database role with specific permissions appropriate to that group of users.

- [How to use access reviews](../active-directory/governance/access-reviews-overview.md)

- [How to configure and manage Azure AD authentication with Azure SQL Database](../azure-sql/database/authentication-aad-configure.md)

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [Understand logins and user accounts in Azure SQL](../azure-sql/database/logins-create-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities. Additionally, on-board and ingest data into Azure Sentinel for further investigation.

When using SQL authentication, create contained database users in the database. Ensure that you place one or more database users into a custom database role with specific permissions appropriate to that group of users.

- [How to view Azure AD risk sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to on-board Azure Sentinel](../sentinel/connect-data-sources.md)

- [Understand logins and user accounts in Azure SQL](../azure-sql/database/logins-create-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: In support scenarios where Microsoft needs to access data related to the Azure SQL Database in your dedicated SQL pool, Azure Customer Lockbox provides an interface for you to review and approve or reject data access requests.

- [Understand Customer Lockbox](../security/fundamentals/customer-lockbox-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

Data Discovery &amp; Classification is built into Azure Synapse SQL. It provides advanced capabilities for discovering, classifying, labeling, and reporting the sensitive data in your databases.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [Understand Data Discovery &amp; Classification](../azure-sql/database/data-discovery-and-classification-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 4.1](../../includes/policy/standards/asb/rp-controls/microsoft.sql-4-1.md)]

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by virtual network/subnet, tagged appropriately, and secured within a network security group or Azure Firewall. Resources storing or processing sensitive data should be isolated. Use Private Link; deploy your Azure SQL Server inside a virtual network and connect securely using Private Link.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

- [How to set up Private Link for Azure SQL Database](../azure-sql/database/private-endpoint-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: For any Azure SQL Database in your dedicated SQL pool storing or processing sensitive information, mark the database and related resources as sensitive using tags. Configure Private Link in conjunction with network security group (NSG) service tags on your Azure SQL Database instances to prevent the exfiltration of sensitive information.

Additionally, Advanced Threat Protection for Azure SQL Database, Azure SQL Managed Instance and Azure Synapse detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [How to configure Private Link and NSGs to prevent data exfiltration on your Azure SQL Database instances](../azure-sql/database/private-endpoint-overview.md)

- [Understand Advanced Threat Protection for Azure SQL Database](../azure-sql/database/threat-detection-overview.md)

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Use the Azure Synapse SQL Data Discovery &amp; Classification feature. Data Discovery &amp; Classification provides advanced capabilities built into Azure SQL Database for discovering, classifying, labeling &amp; protecting the sensitive data in your databases.

Data Discovery &amp; Classification is part of the Advanced Data Security offering, which is a unified package for advanced SQL security capabilities. Data discovery &amp; classification can be accessed and managed via the central SQL ADS portal.

Additionally, you can set up a dynamic data masking (DDM) policy in the Azure portal. The DDM recommendations engine flags certain fields from your database as potentially sensitive fields which may be good candidates for masking.

- [How to use data discovery and classification for Azure SQL Server](../azure-sql/database/data-discovery-and-classification-overview.md)

- [Understand dynamic data masking for Azure Synapse SQL](../azure-sql/database/dynamic-data-masking-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 4.5](../../includes/policy/standards/asb/rp-controls/microsoft.sql-4-5.md)]

### 4.6: Use Azure RBAC access control to control access to resources 

**Guidance**: Use Azure role-based access control (Azure RBAC) to manage access to Azure SQL databases in your dedicated SQL pool.

Authorization is controlled by your user account's database role memberships and object-level permissions. As a best practice, you should grant users the least privileges necessary.

- [How to integrate Azure SQL Server with Azure Active Directory (Azure AD) for authentication](../azure-sql/database/authentication-aad-overview.md)

- [How to control access in Azure SQL Server](../azure-sql/database/logins-create-manage.md)

- [Understand authorization and authentication in Azure SQL](../azure-sql/database/logins-create-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Transparent data encryption (TDE) helps protect Azure Synapse SQL against the threat of malicious offline activity by encrypting data at rest. It performs real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application. In Azure, the default setting for TDE is that the DEK is protected by a built-in server certificate. Alternatively, you can use customer-managed TDE, also referred to as Bring Your Own Key (BYOK) support for TDE. In this scenario, the TDE Protector that encrypts the DEK is a customer-managed asymmetric key, which is stored in a customer-owned and managed Azure Key Vault (Azure's cloud-based external key management system) and never leaves the key vault.

- [Understand service-managed transparent data encryption](../azure-sql/database/transparent-data-encryption-tde-overview.md)

- [Understand customer-managed transparent data encryption](https://docs.microsoft.com/azure/azure-sql/database/transparent-data-encryption-tde-overview#customer-managed-transparent-data-encryption---bring-your-own-key)

- [How to turn on TDE by using your own key](../azure-sql/database/transparent-data-encryption-byok-configure.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 4.8](../../includes/policy/standards/asb/rp-controls/microsoft.sql-4-8.md)]

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to production instances of Synapse SQL pools and other critical or related resources.

Additionally, you can set up alerts for databases in your SQL Synapse pool using the Azure portal. Alerts can send you an email or call a web hook when some metric (for example database size or CPU usage) reaches the threshold.

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

- [How to create alerts for Azure SQL Synapse](../azure-sql/database/alerts-insights-configure-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Enable Advanced Data Security and follow recommendations from Azure Security Center on performing vulnerability assessments on Azure SQL Databases.

- [How to run vulnerability assessments on Azure SQL databases](../azure-sql/database/sql-vulnerability-assessment.md)

- [How to enable Advanced Data Security](../azure-sql/database/azure-defender-for-sql.md)

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 5.1](../../includes/policy/standards/asb/rp-controls/microsoft.sql-5-1.md)]

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Vulnerability Assessment is a scanning service built into Azure Synapse SQL. The service employs a knowledge base of rules that flag security vulnerabilities. It highlights deviations from best practices, such as misconfigurations, excessive permissions, and unprotected sensitive data.  Vulnerability Assessment can be accessed and managed via the central SQL Advanced Data Security (ADS) portal.

- [Manage and Export vulnerability assessment scans in the SQL ADS portal](../azure-sql/database/sql-vulnerability-assessment.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center.

Data Discovery &amp; Classification is built into Azure Synapse SQL. It provides advanced capabilities for discovering, classifying, labeling, and reporting the sensitive data in your databases.

- [Understand Azure Security Center Secure Score](../security-center/secure-score-security-controls.md)

- [Understand Data Discovery &amp; Classification](../azure-sql/database/data-discovery-and-classification-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 5.5](../../includes/policy/standards/asb/rp-controls/microsoft.sql-5-5.md)]

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all resources related to your dedicated SQL pool within your subscription(s). Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Azure Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Define a list of approved Azure resources related to your dedicated SQL pool.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscriptions. Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to place restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.Sql" namespace to create custom policies to audit or enforce the configuration of resources related to your dedicated SQL pool. You may also make use of built-in policy definitions for Azure Databases/Server, such as:

- Deploy Threat Detection on SQL servers
- SQL Server should use a virtual network service endpoint

- [How to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [Azure Repos documentation](/azure/devops/repos/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Not applicable; Azure Synapse SQL does not have configurable security settings.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Leverage Azure Security Center to perform baseline scans for any resources related to your dedicated SQL pool.

- [How to remediate recommendations in Azure Security Center](../security-center/security-center-remediate-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Transparent Data Encryption (TDE) with customer-managed keys in Azure Key Vault allows encryption of the automatically-generated Database Encryption Key (DEK) with a customer-managed asymmetric key called TDE Protector. This is also generally referred to as Bring Your Own Key (BYOK) support for Transparent Data Encryption. In the BYOK scenario, the TDE Protector is stored in a customer-owned and managed Azure Key Vault. In addition, ensure soft delete is enabled in Azure Key Vault.

- [How to enable TDE with customer-managed key from Azure Key Vault](../azure-sql/database/transparent-data-encryption-byok-configure.md)

- [How to enable soft delete in Azure Key Vault](../key-vault/general/key-vault-recovery.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Azure Key Vault, without any credentials in your code.

- [Tutorial: Use a Windows VM system-assigned managed identity to access Azure SQL](../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-sql.md)

- [How to configure Managed Identities](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within your code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Synapse SQL); however, it does not run on customer content.

Pre-scan any content being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, Azure SQL Server, etc. Microsoft cannot access your data in these instances.

- [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Snapshots of your dedicated SQL pool are automatically taken throughout the day creating restore points that are available for seven days. This retention period cannot be changed. Dedicated SQL pool supports an eight-hour recovery point objective (RPO). You can restore your data warehouse in the primary region from any one of the snapshots taken in the past seven days. Note that you can also manually trigger snapshots if necessary.

- [Backup and restore in dedicated SQL pool](sql-data-warehouse/backup-and-restore.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 9.1](../../includes/policy/standards/asb/rp-controls/microsoft.sql-9-1.md)]

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Snapshots of your data warehouse are automatically taken throughout the day creating restore points that are available for seven days. This retention period cannot be changed. Dedicated SQL pool supports an eight-hour recovery point objective (RPO). You can restore your data warehouse in the primary region from any one of the snapshots taken in the past seven days. Note that you can also manually trigger snapshots if necessary.

If you are using a customer-managed key to encrypt your Database Encryption Key, ensure your key is being backed up.

- [Backup and restore in dedicated SQL pool](sql-data-warehouse/backup-and-restore.md)

- [How to backup Azure Key Vault keys](/powershell/module/az.keyvault/backup-azkeyvaultkey)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 9.2](../../includes/policy/standards/asb/rp-controls/microsoft.sql-9-2.md)]

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Periodically test your restore points to ensure your snapshots are valid. To restore an existing dedicated SQL pool from a restore point, you can use either the Azure portal or PowerShell. Test restoration of backed up customer-managed keys.

- [How to restore Azure Key Vault keys](/powershell/module/az.keyvault/restore-azkeyvaultkey)

- [Backup and restore in dedicated SQL pool](sql-data-warehouse/backup-and-restore.md)

- [How to restore an existing dedicated SQL pool](sql-data-warehouse/sql-data-warehouse-restore-active-paused-dw.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: In Azure SQL Database, you can configure a single or a pooled database with a long-term backup retention policy (LTR) to automatically retain the database backups in separate Azure Blob storage containers for up to 10 years. Data in Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant.

By default, data in a storage account is encrypted with Microsoft-managed keys. You can rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. If you are managing your own keys with Key Vault, ensure soft-delete is enabled.

- [Manage Azure SQL Database long-term backup retention](../azure-sql/database/long-term-backup-retention-configure.md)

- [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)

- [How to enable soft delete in Key Vault](../storage/blobs/soft-delete-blob-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Ensure that there are written incident response plans that define roles of personnel as well as phases of incident handling/management.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. The severity is based on how confident Security Center is in the finding or the metric used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [You can refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that  your data has been accessed by an unlawful or unauthorized party.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Please follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies:
https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1.

- [You can find more information on Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft managed cloud infrastructure, services and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
