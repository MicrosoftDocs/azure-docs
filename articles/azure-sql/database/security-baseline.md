---
title: Azure Security Baseline
description: Azure Security Baseline for Azure SQL Database and Azure SQL Managed Instance
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/09/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure Security Baseline for Azure SQL Database & SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

The Azure Security Baseline for Azure SQL Database contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network Security

*For more information, see [Security Control: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

**Guidance**: You can enable Azure Private Link to allow access Azure PaaS Services (for example, SQL Database) and Azure hosted customer/partner services over a Private Endpoint in your virtual network. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet.

To allow traffic to reach Azure SQL Database, use the SQL service tags to allow outbound traffic through Network Security Groups.

Virtual network rules enable Azure SQL Database to only accept communications that are sent from selected subnets inside a virtual network.

How to set up Private Link for Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-private-endpoint-overview#how-to-set-up-private-link-for-azure-sql-database

How to use virtual network service endpoints and rules for servers:

https://docs.microsoft.com/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

**Guidance**: Use Azure Security Center and remediate network protection recommendations for the subnet your Azure SQL Database is deployed to.

For Azure Virtual Machines (VM) that will be connecting to your Azure SQL Database, enable network security group (NSG) flow logs for the NSGs protecting those VMs and send logs into a Azure Storage Account for traffic auditing.

You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

How to Enable NSG Flow Logs:

https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

Understand Network Security provided by Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-network-recommendations

How to Enable and use Traffic Analytics:

https://docs.microsoft.com/azure/network-watcher/traffic-analytics

Understand Network Security provided by Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-network-recommendations

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Not applicable; this recommendation is intended for Azure Apps Service or compute resources hosting web applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Enable DDoS Protection Standard on the Virtual Networks associated with your Azure SQL Database for protections from distributed denial-of-service attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

How to configure DDoS protection:

https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection

Understand Azure Security Center Integrated Threat Intelligence:

https://docs.microsoft.com/azure/security-center/security-center-alerts-data-services

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

**Guidance**: For Azure Virtual Machines (VMs) that will be connecting to your Azure SQL Database instance, enable network security group (NSG) flow logs for the NSGs protecting those VMs and send logs into an Azure Storage Account for traffic audit. If required for investigating anomalous activity, enable Network Watcher packet capture.

How to Enable NSG Flow Logs:

https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to enable Network Watcher:

https://docs.microsoft.com/azure/network-watcher/network-watcher-create

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Enable Advanced Threat Protection (ATP) for Azure SQL Database.  Users receive an alert upon suspicious database activities, potential vulnerabilities, and SQL injection attacks, as well as anomalous database access and queries patterns. Advanced Threat Protection also integrates alerts with Azure Security Center.

Understand and using Advanced Threat Protection for Azure SQL Database:
https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable; this recommendation is intended for Azure Apps Service or compute resources hosting web applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use virtual network service tags  to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

When using service endpoints for Azure SQL Database, outbound to Azure SQL Database Public IP addresses is required: Network Security Groups (NSGs) must be opened to Azure SQL Database IPs to allow connectivity. You can do this by using NSG service tags for Azure SQL Database.

Understand Service Tags with Service Endpoints for Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview#limitations

Understand and using Service Tags:

https://docs.microsoft.com/azure/virtual-network/service-tags-overview

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement network security configurations for your Azure SQL Database with Azure Policy. You may use the "Microsoft.Sql" namespace to define custom policy definitions, or use any of the built-in policy definitions designed for server network protection. An example of an applicable built-in network security policy for a server would be: "SQL Database should use a virtual network service endpoint".

Use Azure Blueprints to simplify large scale Azure deployments by packaging key environment artifacts, such as Azure Resource Management templates, Role-based access control (RBAC), and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create an Azure Blueprint: https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network security groups (NSG) and other resources related to network security and traffic flow. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

How to create and use tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your server. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

How to view and retrieve Azure Activity Log events:

https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view

How to create alerts in Azure Monitor:

https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains time sources for Azure resources. You may update time synchronization for your compute deployments.

How to configure time synchronization for Azure compute resources:

https://docs.microsoft.com/azure/virtual-machines/windows/time-sync

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: Enable auditing for Azure SQL Database to track database events and write them to an audit log in your Azure Storage Account, Log Analytics workspace, or Event Hubs.

In addition, you can stream Azure SQL diagnostics telemetry into Azure SQL Analytics, a cloud solution that monitors the performance of Azure SQL Database and Azure SQL Managed Instance at scale and across multiple subscriptions. It can help you collect and visualize Azure SQL Database performance metrics, and it has built-in intelligence for performance troubleshooting.

How to setup auditing for your Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-auditing

How to collect platform logs and metrics with Azure Monitor:

https://docs.microsoft.com/azure/sql-database/sql-database-metrics-diag-logging

How to stream diagnostics into Azure SQL Analytics:

https://docs.microsoft.com/azure/sql-database/sql-database-metrics-diag-logging#stream-into-azure-sql-analytics

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable auditing on your server and choose a storage location for the audit logs (Azure Storage, Log Analytics, or Event Hub).

How to enable auditing for Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-auditing

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this benchmark is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

**Guidance**: When storing your Azure SQL Database logs in an Log Analytics Workspace, set log retention period according to your organization's compliance regulations.

How to set log retention parameters:

https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Analyze and monitor logs for anomalous behaviors and regularly review results. Use Azure Security Center's Advanced Threat Protection to alert on unusual activity related to your Azure SQL Database instance. Alternatively, configure alerts based on Metric Values or Azure Activity Log entries related to your Azure SQL Database instances.

Understand Advanced Threat Protection and alerting for Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview

How to configure custom alerts for Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-insights-alerts-portal?view=azps-1.4.0

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

**Guidance**: Use Azure Security Center Advanced Threat Protection for Azure SQL Database for monitoring and alerting on anomalous activity. Enable Advanced Data Security for your SQL Databases. Advanced Data Security includes functionality for discovering and classifying sensitive data, surfacing and mitigating potential database vulnerabilities, and detecting anomalous activities that could indicate a threat to your database.

Understand Advanced Threat Protection and alerting for Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview

How to enable Advanced Data Security for Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security

How to manage alerts in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Not applicable; for Azure SQL Database, the anti-malware solution is managed by Microsoft on the underlying platform.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; DNS logging is not applicable to Azure SQL Database.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

**Guidance**: Not applicable; command-line auditing is not applicable to Azure SQL Database.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and Access Control

*For more information, see [Security Control: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (AAD) has built-in roles that must be explicitly assigned and are queryable. Use the AAD PowerShell module to perform ad-hoc queries to discover accounts that are members of administrative groups.

How to get a directory role in Azure AD with PowerShell:

https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0

How to get members of a directory role in Azure AD with PowerShell:

https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: Azure Active Directory does not have the concept of default passwords. When provisioning an Azure SQL Database instance, it is recommended that you choose to integrate authentication with Azure Active Directory.

How to configure and manage Azure Active Directory authentication with Azure SQL:

https://docs.microsoft.com/azure/azure-sql/database/authentication-aad-configure

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Create policies and procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Understand Azure Security Center Identity and Access:

https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Not applicable; while you can configure Azure Active Directory Authentication to integrate with Azure SQL Database, single sign-on is not supported.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory (AAD) Multi-Factor Authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

How to enable MFA in Azure:

https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

How to monitor identity and access within Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use a Privileged Access Workstation (PAW) with Multi-Factor Authentication MFA configured to log into and configure Azure resources.

Learn about Privileged Access Workstations:

https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations

How to enable MFA in Azure:

https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

**Guidance**: Use Azure Active Directory security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

Use  Advanced Threat Protection for Azure SQL Database to detect anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

How to identify Azure AD users flagged for risky activity:

https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk

How to monitor users identity and access activity in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-identity-access

Review Advanced Threat Protection and potential alerts:

https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview#advanced-threat-protection-alerts

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow Portal and Azure Resource Management access from only specific logical groupings of IP address ranges or countries/regions.

How to configure Named Locations in Azure: https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Create an Azure Active Directory (AAD) administrator for your server.

How to configure and manage Azure Active Directory authentication with Azure SQL:

https://docs.microsoft.com/azure/azure-sql/database/authentication-aad-configure

How to create and configure an AAD instance:

https://docs.microsoft.com/azure/active-directory-domain-services/tutorial-create-instance

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (AAD) provides logs to help discover stale accounts. In addition, use Azure Identity access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. Users' access can be reviewed on a regular basis to make sure only the right users have continued access.

How to use Azure Identity Access Reviews:

https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

**Guidance**: Configure Azure Active Directory (AAD) authentication with Azure SQL and create Diagnostic Settings for Azure Active Directory user accounts, sending the audit logs and sign-in logs to a Log Analytics workspace. Configure desired Alerts within Log Analytics workspace.

How to configure and manage Azure Active Directory authentication with Azure SQL:

https://docs.microsoft.com/azure/azure-sql/database/authentication-aad-configure

How to integrate Azure Activity Logs into Azure Monitor:

https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure Active Directory (AAD) Identity Protection and risk detections to configure automated responses to detected suspicious actions related to user identities. Additionally, you can ingest data into Azure Sentinel for further investigation.

How to view Azure AD risk sign-ins:

https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins

How to configure and enable Identity Protection risk policies:

https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: In support scenarios where Microsoft needs to access customer data, Azure Customer Lockbox provides an interface for customers to review and approve or reject customer data access requests.

Understand Customer Lockbox:

https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data Protection

*For more information, see [Security Control: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

How to create and use tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by Vnet/Subnet, tagged appropriately, and secured within an NSG or Azure Firewall. Resources storing or processing sensitive data should be isolated. Use Private Link; deploy Azure SQL Database inside your Vnet and connect privately using Private Endpoints.

How to create additional Azure subscriptions:

https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:

https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to set up Private Link for Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-private-endpoint-overview#how-to-set-up-private-link-for-azure-sql-database

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: For databases in Azure SQL Database storing or processing sensitive information, mark the database and related resources as sensitive using Tags. Configure Private Link in conjunction with Network Security Group Service Tags on your Azure SQL Database instances to prevent the exfiltration of sensitive information.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

How to configure Private Link and NSGs to prevent data exfiltration on your Azure SQL Database instances:

https://docs.microsoft.com/azure/sql-database/sql-database-private-endpoint-overview

Understand customer data protection in Azure:

https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Azure SQL Database secures your data by encrypting data in motion with Transport Layer Security. SQL Database enforces encryption (SSL/TLS) at all times for all connections. This ensures all data is encrypted "in transit" between the client and server irrespective of the setting of Encrypt or TrustServerCertificate in the connection string.

Understand Azure SQL Encryption in Transit:

https://docs.microsoft.com/azure/sql-database/sql-database-security-overview#information-protection-and-encryption

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Use the Azure SQL Database data discovery and classification feature. Data discovery and classification provides advanced capabilities built into Azure SQL Database for discovering, classifying, labeling &amp; protecting the sensitive data in your databases.

How to use data discovery and classification for Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-data-discovery-and-classification

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Use Azure Active Directory (AAD) for authenticating and controlling access to Azure SQL Database instances.

How to integrate Azure SQL Database with Azure Active Directory for authentication:

https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication

How to control access in Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-control-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Microsoft manages the underlying infrastructure for Azure SQL Database and has implemented strict controls to prevent the loss or exposure of customer data.

Understand customer data protection in Azure:

https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

**Guidance**: Transparent data encryption (TDE) helps protect Azure SQL Database, Azure SQL Managed Instance, and Azure Data Warehouse against the threat of malicious offline activity by encrypting data at rest. It performs real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application. By default, TDE is enabled for all newly deployed databases in SQL Database and SQL Managed Instance. The TDE encryption key can be managed by either Microsoft or the customer.

How to manage transparent data encryption and use your own encryption keys:

https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-azure-sql?tabs=azure-portal#manage-transparent-data-encryption

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to production instances of Azure SQL Databases and other critical or related resources.

How to create alerts for Azure Activity Log events:

https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Vulnerability Management

*For more information, see [Security Control: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Enable Advanced Data Security for Azure SQL Database and follow recommendations from Azure Security Center on performing vulnerability assessments on your servers.

How to run vulnerability assessments on your Azure SQL Databases:

https://docs.microsoft.com/azure/sql-database/sql-vulnerability-assessment

How to enable Advanced Data Security:

https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security

How to implement Azure Security Center vulnerability assessment recommendations:

https://docs.microsoft.com/azure/security-center/security-center-vulnerability-assessment-recommendations

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.3: Deploy automated third-party software patch management solution

**Guidance**: Not applicable; this benchmark is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Enable periodic recurring scans for your Azure SQL Database instances; this will configure a vulnerability assessment to automatically run a scan on your database once per week. A scan result summary will be sent to the email address(es) you provide. Compare the results to verify that vulnerabilities have been remediated.

How to export a vulnerability assessment report in Azure Security Center:

https://docs.microsoft.com/azure/sql-database/sql-vulnerability-assessment#implementing-vulnerability-assessment

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center.

Understand Azure Security Center Secure Score:

https://docs.microsoft.com/azure/security-center/security-center-secure-score

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Inventory and Asset Management

*For more information, see [Security Control: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Azure SQL Database) within your subscription(s).  Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

How to create queries with Azure Resource Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

How to view your Azure Subscriptions: https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

Understand Azure RBAC: https://docs.microsoft.com/azure/role-based-access-control/overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

How to create and use Tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

How to create additional Azure subscriptions:

https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:

https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.4: Maintain an inventory of approved Azure resources and software titles

**Guidance**: Define list of approved Azure resources and approved software for your compute resources

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

**Azure Security Center monitoring**: Not applicable

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

**Guidance**:
Use Azure Policy to place restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to deny a specific resource type with Azure Policy: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Implement approved application list

**Guidance**: Not applicable; this recommendation is intended for applications running on compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with Azure Resources Manager via scripts

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

How to configure Conditional Access to block access to Azure Resource Manager: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Not applicable; this recommendation is intended for App Service or compute resources hosting desktop or web applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure Configuration

*For more information, see [Security Control: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy or Azure Security Center recommendations for Azure SQL Database to maintain security configurations for all Azure Resources.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this recommendation intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understand Azure Policy Effects:

https://docs.microsoft.com/azure/governance/policy/concepts/effects

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

How to store code in Azure DevOps:

https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

Azure Repos Documentation:

https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy system configuration management tools

**Guidance**: Use Azure Policy aliases in the "Microsoft.SQL" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure services

**Guidance**: Leverage Azure Security Center to perform baseline scans for Azure SQL Database.

How to remediate recommendations in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-sql-service-recommendations

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

**Guidance**: Use Azure Key Vault to store encryption keys for Azure SQL Database Transparent Data Encryption (TDE).

How to protect sensitive data being stored in Azure SQL Database and store the encryption keys in Azure Key Vault:

https://docs.microsoft.com/azure/sql-database/sql-database-always-encrypted-azure-key-vault

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (AAD). Managed Identities allows you to authenticate to any service that supports AAD authentication, including Azure Key Vault, without any credentials in your code.

Tutorial: Use a Windows VM system-assigned managed identity to access Azure SQL:

https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-sql

How to configure Managed Identities:

https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within your code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

How to setup Credential Scanner:
https://secdevtools.azurewebsites.net/helpcredscan.html

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware Defense

*For more information, see [Security Control: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Not applicable; this recommendation is intended for compute resources. Microsoft handles anti-malware for underlying platform.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

Pre-scan any content being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, Azure SQL Database, etc. Microsoft cannot access your data in these instances.

Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines: https://docs.microsoft.com/azure/security/fundamentals/antimalware

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for compute resources. Microsoft handles anti-malware for underlying platform.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data Recovery

*For more information, see [Security Control: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

**Guidance**: To protect your business from data loss, Azure SQL Database automatically creates full database backups weekly, differential database backups every 12 hours, and transaction log backups every 5 - 10 minutes. The backups are stored in RA-GRS storage for at least 7 days for all service tiers. All service tiers except Basic support configurable backup retention period for point-in-time restore, up to 35 days.

To meet different compliance requirements, you can select different retention periods for weekly, monthly and/or yearly backups. The storage consumption depends on the selected frequency of backups and the retention period(s).

Understand backups and business continuity with Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-business-continuity

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 9.2: Perform complete system backups and backup any customer managed keys

**Guidance**: Azure SQL Database automatically creates the database backups that are kept between 7 and 35 days, and uses Azure read-access geo-redundant storage (RA-GRS) to ensure that they are preserved even if the data center is unavailable. These backups are created automatically. If required, enable long-term geo-redundant backups for your Azure SQL Databases.

If using customer-managed keys for Transparent Data Encryption, ensure your keys are being backed up.

Understand backups in Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-automated-backups?tabs=single-database

How to backup key vault keys in Azure:

https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

**Guidance**: Ensure ability to periodically perform data restoration of content within Azure Backup. If necessary, test restore content to an isolated VLAN. Test restoration of backed up customer-managed keys.

How to restore key vault keys in Azure:

https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0

How to recover Azure SQL Database backups using point-in-time restore:

https://docs.microsoft.com/azure/sql-database/sql-database-recovery-using-backups#point-in-time-restore

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

**Guidance**: Enable soft delete in Azure Key Vault to protect keys against accidental or malicious deletion.

How to enable soft delete in Key Vault:

https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident Response

*For more information, see [Security Control: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Ensure that there are written incident response plans that defines roles of personnel as well as phases of incident handling/management.

How to configure Workflow Automations within Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Security alerts in Azure Security Center:
https://docs.microsoft.com/azure/security-center/security-center-alerts-overview

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

You can refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities:

https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that  your data has been accessed by an unlawful or unauthorized party.

How to set the Azure Security Center Security Contact:

https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Sentinel.

How to configure continuous export:

https://docs.microsoft.com/azure/security-center/continuous-export

How to stream alerts into Azure Sentinel:

https://docs.microsoft.com/azure/sentinel/connect-azure-security-center

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

How to configure Workflow Automation and Logic Apps:

https://docs.microsoft.com/azure/security-center/workflow-automation

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see [Security Control: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings within 60 days

**Guidance**: Please follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies:

https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1.

You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft managed cloud infrastructure, services and applications, here:
https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure Security Baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
