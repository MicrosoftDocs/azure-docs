---
title: Azure security baseline for Azure SQL Database
description: The Azure SQL Database security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: sql-database
ms.topic: conceptual
ms.date: 03/30/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure SQL Database

This security baseline applies guidance from the [Azure Security Benchmark version1.0](../../security/benchmarks/overview-v1.md) to Azure SQL Database. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure SQL Database. **Controls** not applicable to Azure SQL Database, or for which the responsibility is Microsoft's, have been excluded. To see how Azure SQL Database completely maps to the Azure Security Benchmark, see the [full Azure Monitor security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: You can enable Azure Private Link to allow access Azure PaaS Services (for example, SQL Database) and Azure hosted customer/partner services over a Private Endpoint in your virtual network. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. 

To allow traffic to reach Azure SQL Database, use the SQL service tags to allow outbound traffic through Network Security Groups.

Virtual network rules enable Azure SQL Database to only accept communications that are sent from selected subnets inside a virtual network.

- [How to set up Private Link for Azure SQL Database](/azure/sql-database/sql-database-private-endpoint-overview#how-to-set-up-private-link-for-azure-sql-database)

- [How to use virtual network service endpoints and rules for database servers](/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 1.1](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Use Azure Security Center and remediate network protection recommendations for the subnet your Azure SQL Database Server is deployed to. 

For Azure Virtual Machines (VM) that will be connecting to your Azure SQL Database Server instance, enable network security group (NSG) flow logs for the NSGs protecting those VMs and send logs into an Azure Storage Account for traffic auditing. 

You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](../../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [Understand Network Security provided by Azure Security Center](../../security-center/security-center-network-recommendations.md)

- [How to Enable and use Traffic Analytics](../../network-watcher/traffic-analytics.md)

- [Understand Network Security provided by Azure Security Center](../../security-center/security-center-network-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Enable DDoS Protection Standard on the Virtual Networks associated with your SQL Server instances for protections from distributed denial-of-service attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to configure DDoS protection](/azure/virtual-network/manage-ddos-protection)

- [Understand Azure Security Center Integrated Threat Intelligence](/azure/security-center/security-center-alerts-data-services)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: For Azure Virtual Machines (VMs) that will be connecting to your Azure SQL Database instance, enable network security group (NSG) flow logs for the NSGs protecting those VMs and send logs into an Azure Storage Account for traffic audit. If required for investigating anomalous activity, enable Network Watcher packet capture.

- [How to Enable NSG Flow Logs](../../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to enable Network Watcher](../../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Enable Advanced Threat Protection (ATP) for Azure SQL Database.  Users receive an alert upon suspicious database activities, potential vulnerabilities, and SQL injection attacks, as well as anomalous database access and queries patterns. Advanced Threat Protection also integrates alerts with Azure Security Center. 

- [Understand and using Advanced Threat Protection for Azure SQL Database](/azure/sql-database/sql-database-threat-detection-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use virtual network service tags  to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

When using service endpoints for Azure SQL Database, outbound to Azure SQL Database Public IP addresses is required: Network Security Groups (NSGs) must be opened to Azure SQL Database IPs to allow connectivity. You can do this by using NSG service tags for Azure SQL Database.

- [Understand Service Tags with Service Endpoints for Azure SQL Database](/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview#limitations)

- [Understand and using Service Tags](../../virtual-network/service-tags-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement network security configurations for your Azure SQL Database server instances with Azure Policy. You may use the "Microsoft.Sql" namespace to define custom policy definitions, or use any of the built-in policy definitions designed for Azure SQL Database server network protection. An example of an applicable built-in network security policy for Azure SQL Database server would be: "SQL Server should use a virtual network service endpoint".

 

Use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Management templates, Azure role-based access control (Azure RBAC), and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

- [How to create an Azure Blueprint](../../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network security groups (NSG) and other resources related to network security and traffic flow. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure SQL Database server instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Enable auditing for Azure SQL Database to track database events and write them to an audit log in your Azure Storage Account, Log Analytics workspace, or Event Hubs.

In addition, you can stream Azure SQL diagnostics telemetry into Azure SQL Analytics, a cloud solution that monitors the performance of Azure SQL Databases and Azure SQL Managed Instances at scale and across multiple subscriptions. It can help you collect and visualize Azure SQL Database performance metrics, and it has built-in intelligence for performance troubleshooting.

- [How to setup auditing for your Azure SQL Database](/azure/sql-database/sql-database-auditing)

- [How to collect platform logs and metrics with Azure Monitor](/azure/sql-database/sql-database-metrics-diag-logging)

- [How to stream diagnostics into Azure SQL Analytics](/azure/sql-database/sql-database-metrics-diag-logging#stream-into-azure-sql-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable auditing on your Azure SQL Database server instance and choose a storage location for the audit logs (Azure Storage, Log Analytics, or Event Hub).

- [How to enable auditing for Azure SQL Server](/azure/sql-database/sql-database-auditing)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 2.3](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-2-3.md)]

### 2.5: Configure security log storage retention

**Guidance**: When storing your Azure SQL Database logs in a Log Analytics workspace, set log retention period according to your organization's compliance regulations.

- [How to set log retention parameters](/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 2.5](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-2-5.md)]

### 2.6: Monitor and review logs

**Guidance**: Analyze and monitor logs for anomalous behaviors and regularly review results. Use Azure Security Center's Advanced Threat Protection to alert on unusual activity related to your Azure SQL Database instance. Alternatively, configure alerts based on Metric Values or Azure Activity Log entries related to your Azure SQL Database instances.

- [Understand Advanced Threat Protection and alerting for Azure SQL Server](/azure/sql-database/sql-database-threat-detection-overview)

- [How to configure custom alerts for Azure SQL Database](alerts-insights-configure-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Azure Security Center Advanced Threat Protection for Azure SQL Databases for monitoring and alerting on anomalous activity. Enable Azure Defender for SQL for your SQL Databases. Azure Defender for SQL includes functionality for discovering and classifying sensitive data, surfacing and mitigating potential database vulnerabilities, and detecting anomalous activities that could indicate a threat to your database.

- [Understand Advanced Threat Protection and alerting for Azure SQL Database](/azure/sql-database/sql-database-threat-detection-overview)

- [How to enable Azure Defender for SQL  for Azure SQL Database](azure-defender-for-sql.md)

- [How to manage alerts in Azure Security Center](../../security-center/security-center-managing-and-responding-alerts.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 2.7](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-2-7.md)]

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad-hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Azure Active Directory (Azure AD) does not have the concept of default passwords. When provisioning an Azure SQL Database instance, it is recommended that you choose to integrate authentication with Azure AD.

- [How to configure and manage Azure AD authentication with Azure SQL](/azure/azure-sql/database/authentication-aad-configure)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create policies and procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

- [Understand Azure Security Center Identity and Access](../../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use a Privileged Access Workstation (PAW) with multifactor authentication configured to log into and configure Azure resources.

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

Use Advanced Threat Protection for Azure SQL Database to detect anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

- [How to identify Azure AD users flagged for risky activity](/azure/active-directory/reports-monitoring/concept-user-at-risk)

- [How to monitor users identity and access activity in Azure Security Center](../../security-center/security-center-identity-access.md)

- [Review Advanced Threat Protection and potential alerts](https://docs.microsoft.com/azure/azure-sql/database/threat-detection-overview#alerts)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow Portal and Azure Resource Management access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Create an Azure Active Directory (Azure AD) administrator for your Azure SQL Database server instances.

- [How to configure and manage Azure AD authentication with Azure SQL](authentication-aad-configure.md)

- [How to create and configure an Azure AD instance](../../active-directory-domain-services/tutorial-create-instance.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 3.9](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-3-9.md)]

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. In addition, use Azure Identity access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. Users' access can be reviewed on a regular basis to make sure only the right users have continued access.

- [How to use Azure Identity Access Reviews](../../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Configure Azure Active Directory (Azure AD) authentication with Azure SQL and create Diagnostic Settings for Azure AD user accounts, sending the audit logs and sign-in logs to a Log Analytics workspace. Configure desired Alerts within Log Analytics workspace.

- [How to configure and manage Azure AD authentication with Azure SQL](authentication-aad-configure.md)

- [How to integrate Azure Activity Logs into Azure Monitor](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) Identity Protection and risk detections to configure automated responses to detected suspicious actions related to user identities. Additionally, you can ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risk sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](../../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: In support scenarios where Microsoft needs to access customer data, Azure Customer Lockbox provides an interface for customers to review and approve or reject customer data access requests.

- [Understand Customer Lockbox](../../security/fundamentals/customer-lockbox-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 4.1](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-4-1.md)]

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by Vnet/Subnet, tagged appropriately, and secured within an NSG or Azure Firewall. Resources storing or processing sensitive data should be isolated. Use Private Link; deploy Azure SQL Server inside your Vnet and connect privately using Private Endpoints.

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create Management Groups](/azure/governance/management-groups/create)

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

- [How to set up Private Link for Azure SQL Database](/azure/sql-database/sql-database-private-endpoint-overview#how-to-set-up-private-link-for-azure-sql-database)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: For databases in Azure SQL Database storing or processing sensitive information, mark the database and related resources as sensitive using Tags. Configure Private Link in conjunction with Network Security Group Service Tags on your Azure SQL Database instances to prevent the exfiltration of sensitive information.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [How to configure Private Link and NSGs to prevent data exfiltration on your Azure SQL Database instances](/azure/sql-database/sql-database-private-endpoint-overview)

- [Understand customer data protection in Azure](../../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Use the Azure SQL Database data discovery and classification feature. Data discovery and classification provides advanced capabilities built into Azure SQL Database for discovering, classifying, labeling &amp; protecting the sensitive data in your databases.

- [How to use data discovery and classification for Azure SQL Server](/azure/sql-database/sql-database-data-discovery-and-classification)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 4.5](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-4-5.md)]

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use Azure Active Directory (Azure AD) for authenticating and controlling access to Azure SQL Database instances.

- [How to integrate Azure SQL Server with Azure AD for authentication](/azure/sql-database/sql-database-aad-authentication)

- [How to control access in Azure SQL Server](/azure/sql-database/sql-database-control-access)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Transparent data encryption (TDE) helps protect Azure SQL Database, Azure SQL managed instance, and Azure Data Warehouse against the threat of malicious offline activity by encrypting data at rest. It performs real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application. By default, TDE is enabled for all newly deployed databases in SQL Database and SQL Managed Instance. The TDE encryption key can be managed by either Microsoft or the customer.

- [How to manage transparent data encryption and use your own encryption keys](https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-azure-sql?tabs=azure-portal#manage-transparent-data-encryption)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 4.8](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-4-8.md)]

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to production instances of Azure SQL Database and other critical or related resources.

- [How to create alerts for Azure Activity Log events](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Enable Azure Defender for SQL for Azure SQL Database and follow recommendations from Azure Security Center on performing vulnerability assessments on your Azure SQL Servers.

- [How to run vulnerability assessments on Azure SQL Database](/azure/sql-database/sql-vulnerability-assessment)

- [How to enable Azure Defender for SQL](azure-defender-for-sql.md)

- [How to implement Azure Security Center vulnerability assessment recommendations](/azure/security-center/security-center-vulnerability-assessment-recommendations)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 5.1](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-5-1.md)]

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Enable periodic recurring scans for your Azure SQL Database instances; this will configure a vulnerability assessment to automatically run a scan on your database once per week. A scan result summary will be sent to the email address(es) you provide. Compare the results to verify that vulnerabilities have been remediated.

- [How to export a vulnerability assessment report in Azure Security Center](/azure/sql-database/sql-vulnerability-assessment#implementing-vulnerability-assessment)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center.

- [Understand Azure Security Center Secure Score](/azure/security-center/security-center-secure-score)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 5.5](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-5-5.md)]

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Azure SQL Server instances) within your subscription(s). Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create Management Groups](/azure/governance/management-groups/create)

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Resource Graph](../../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to place restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy or Azure Security Center recommendations for Azure SQL Servers/Databases to maintain security configurations for all Azure Resources.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [Azure Repos Documentation](/azure/devops/repos/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.SQL" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Leverage Azure Security Center to perform baseline scans for your Azure SQL Servers and Databases.

- [How to remediate recommendations in Azure Security Center](/azure/security-center/security-center-sql-service-recommendations)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Use Azure Key Vault to store encryption keys for Azure SQL Database Transparent Data Encryption (TDE).

- [How to protect sensitive data being stored in Azure SQL Server and store the encryption keys in Azure Key Vault](/azure/sql-database/sql-database-always-encrypted-azure-key-vault)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Azure Key Vault, without any credentials in your code.

- [Tutorial: Use a Windows VM system-assigned managed identity to access Azure SQL](../../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-sql.md)

- [How to configure Managed Identities](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within your code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../../security/benchmarks/security-control-malware-defense.md).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

Pre-scan any content being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, Azure SQL Server, etc. Microsoft cannot access your data in these instances.

- [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../../security/fundamentals/antimalware.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: To protect your business from data loss, Azure SQL Database automatically creates full database backups weekly, differential database backups every 12 hours, and transaction log backups every 5 - 10 minutes. The backups are stored in RA-GRS storage for at least 7 days for all service tiers. All service tiers except Basic support configurable backup retention period for point-in-time restore, up to 35 days.

To meet different compliance requirements, you can select different retention periods for weekly, monthly and/or yearly backups. The storage consumption depends on the selected frequency of backups and the retention period(s).

- [Understand backups and business continuity with Azure SQL Server](/azure/sql-database/sql-database-business-continuity)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 9.1](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-9-1.md)]

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Azure SQL Database automatically creates the database backups that are kept between 7 and 35 days, and uses Azure read-access geo-redundant storage (RA-GRS) to ensure that they are preserved even if the data center is unavailable. These backups are created automatically. If required, enable long-term geo-redundant backups for your Azure SQL Database.

If using customer-managed keys for Transparent Data Encryption, ensure your keys are being backed up.

- [Understand backups in Azure SQL Server](https://docs.microsoft.com/azure/sql-database/sql-database-automated-backups?tabs=single-database)

- [How to backup key vault keys in Azure](/powershell/module/az.keyvault/backup-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Sql**:

[!INCLUDE [Resource Policy for Microsoft.Sql 9.2](../../../includes/policy/standards/asb/rp-controls/microsoft.sql-9-2.md)]

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Ensure ability to periodically perform data restoration of content within Azure Backup. If necessary, test restore content to an isolated VLAN. Test restoration of backed up customer-managed keys.

- [How to restore key vault keys in Azure](/powershell/module/az.keyvault/restore-azkeyvaultkey)

- [How to recover Azure SQL Database backups using point-in-time restore](/azure/sql-database/sql-database-recovery-using-backups#point-in-time-restore)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Enable soft delete in Azure Key Vault to protect keys against accidental or malicious deletion.

- [How to enable soft delete in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Ensure that there are written incident response plans that defines roles of personnel as well as phases of incident handling/management.

- [How to configure Workflow Automations within Azure Security Center](../../security-center/security-center-planning-and-operations-guide.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

- [Security alerts in Azure Security Center](../../security-center/security-center-alerts-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [You can refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that  your data has been accessed by an unlawful or unauthorized party.

- [How to set the Azure Security Center Security Contact](../../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
