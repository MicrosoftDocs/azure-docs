---
title: Azure security baseline for Azure Database for MariaDB
description: The Azure Database for MariaDB security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: mariadb
ms.topic: conceptual
ms.date: 03/26/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Database for MariaDB

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview-v1) to Azure Database for MariaDB. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Database for MariaDB. **Controls** not applicable to Azure Database for MariaDB, or for which the responsibility is Microsoft's, have been excluded.

To see how Azure Database for MariaDB completely maps to the Azure Security Benchmark, see the [full Azure Database for MariaDB security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Configure Private Link for Azure Database for MariaDB with Private Endpoints. Private Link allows you to connect to various PaaS services in Azure via a private endpoint. Azure Private Link essentially brings Azure services inside your private Virtual Network (VNet). Traffic between your virtual network and MariaDB instance travels the Microsoft backbone network.

Alternatively, you may use Virtual Network Service Endpoints to protect and limit network access to your Azure Database for MariaDB implementations. Virtual network rules are one firewall security feature that controls whether your Azure Database for MariaDB accepts communications that are sent from particular subnets in virtual networks.

You may also secure your Azure Database for MariaDB with firewall rules. The server firewall prevents all access to your database server until you specify which computers have permission. To configure your firewall, you create firewall rules that specify ranges of acceptable IP addresses. You can create firewall rules at the server level.

- [How to configure Private Link for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-configure-privatelink-portal)

- [How to create and manage VNet service endpoints and VNet rules in Azure Database for MariaDB server](https://docs.microsoft.com/azure/mariadb/howto-manage-vnet-portal)

- [How to configure Azure Database for MariaDB firewall rules](https://docs.microsoft.com/azure/mariadb/concepts-firewall-rules)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.DBforMariaDB**:

[!INCLUDE [Resource Policy for Microsoft.DBforMariaDB 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.dbformariadb-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: When your Azure Database for MariaDB server is secured to a private endpoint, you can deploy virtual machines in the same virtual network. You can use a network security group (NSG) to reduce the risk of data exfiltration. Enable NSG flow logs and send logs into a Storage Account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to configure Private Link for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-configure-privatelink-portal)

- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Use Advanced Threat Protection for Azure Database for MariaDB. Advanced Threat Protection detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

Enable DDoS Protection Standard on the virtual networks associated with your Azure Database for MariaDB instances to guard against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to configure Advanced Threat Protection for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-database-threat-protection-portal)

- [How to configure DDoS protection](https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: When your Azure Database for MariaDB server is secured to a private endpoint, you can deploy virtual machines in the same virtual network. You can then configure a network security group (NSG) to reduce the risk of data exfiltration. Enable NSG flow logs and send logs into a Storage Account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Use Advanced Threat Protection for Azure Database for MariaDB. Advanced Threat Protection detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

- [How to configure Advanced Threat Protection for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-database-threat-protection-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: For resources that need access to your Azure Database for MariaDB instances, use virtual network service tags to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., SQL.WestUs) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Note: Azure Database for MariaDB uses the "Microsoft.Sql" service tag.

- [For more information about using service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

- [Understand service tag usage for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-data-access-security-vnet#terminology-and-description)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network settings and network resources associated with your Azure Database for MariaDB instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.DBforMariaDB" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Database for MariaDB instances. You may also make use of built-in policy definitions related to networking or your Azure Database for MariaDB instances, such as:

- DDoS Protection Standard should be enabled

- Private endpoint should be enabled for MariaDB servers

- MariaDB server should use a virtual network service endpoint

Reference documentation:

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies)

- [How to create an Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use Tags for resources related to network security and traffic flow for your MariaDB instances to provide metadata and logical organization.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their Tags.

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Database for MariaDB instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.2: Configure central security log management

**Guidance**: Enable Diagnostic Settings and Server Logs and ingest logs to aggregate security data generated by your Azure Database for MariaDB instances. Within Azure Monitor, use Log Analytics Workspace(s) to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage. Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

- [How to configure and access Server Logs for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-server-logs)

- [How to configure and access audit logs for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-configure-audit-logs-portal)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Diagnostic Settings on your Azure Database for MariaDB instances for access to audit, security, and diagnostic logs. Ensure that you specifically enable the MariaDB Audit log. Activity logs, which are automatically available, include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. You may also enable Azure Activity Log Diagnostic Settings and send the logs to the same Log Analytics workspace or Storage Account.

- [How to configure and access Server Logs for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-server-logs)

- [How to configure and access audit logs for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-configure-audit-logs-portal)

- [How to configure Diagnostic Settings for the Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, for the Log Analytics Workspace being used to hold your Azure Database for MariaDB logs, set the retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

- [How to set log retention parameters for Log Analytics Workspaces](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

- [Storing resource logs in an Azure Storage Account](https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs#send-to-azure-storage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Analyze and monitor logs from your MariaDB instances for anomalous behavior. Use Azure Monitor's Log Analytics Workspace to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM.

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

- [For more information about the Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal)

- [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Enable Advanced Threat Protection for MariaDB. Advanced Threat Protection for Azure Database for MariaDB detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

In addition, you may enable Server Logs and Diagnostic Settings for MariaDB and send logs to a Log Analytics Workspace. Onboard your Log Analytics Workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for playbooks (automated solutions) to be created and used to remediate security issues.

- [How to enable Advanced Threat Protection for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-database-threat-protection-portal)

- [How to configure and access Server Logs for MariDB](https://docs.microsoft.com/azure/mariadb/concepts-server-logs)

- [How to configure and access audit logs for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-configure-audit-logs-portal)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Maintain an inventory of the user accounts that have administrative access to the management plane (Azure portal/Azure Resource Manager) of your MariaDB instances. In addition, maintain an inventory of the administrative accounts that have access to the data plane of your MariaDB instances. (When creating the MariaDB server, you provide credentials for an administrator user. This administrator can be used to create additional MariaDB users.)

- [Understand access management for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-security#access-management)

- [Understand Azure built-in roles for Azure Subscriptions](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Azure Active Directory (Azure AD) does not have the concept of default passwords.

Upon creation of the MariaDB resource itself, Azure forces the creation of an administrative user with a strong password. However, once the MariaDB instance has been created, you may use the first server admin account you created account to create additional users and grant administrative access to them. When creating these accounts, ensure you configure a different, strong password for each account.

- [How to create additional accounts for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-create-users)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts that have access to your MariaDB instances. Use Azure Security Center Identity and access management to monitor the number of administrative accounts.

- [Understand Azure Security Center Identity and Access](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Data plane access to MariaDB is controlled by identities stored within the database and does not support SSO. Control plane access for MariaDB is available via REST API and supports SSO. To authenticate, set the Authorization header for your requests to a JSON Web Token that you obtain from Azure Active Directory (Azure AD).

- [Understand Azure Database for MariaDB REST API](https://docs.microsoft.com/rest/api/mariadb/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

- [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with multifactor authentication configured to log into and configure Azure resources. 

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Enable Advanced Threat Protection for MariaDB to generate alerts for suspicious activity.

In addition, you may use Azure Active Directory (Azure AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure AD Risk Detections to view alerts and reports on risky user behavior.

- [How to setup Advanced Threat Protection for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-database-threat-protection-portal)

- [How to deploy Privileged Identity Management (PIM)](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan)

- [Understand Azure AD risk detections](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions to limit access to Azure resources such as MariaDB.

- [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

Azure AD authentication cannot be used for direct access to the MariaDB data plane, however, Azure AD credentials may be used for administration at the management plane level (e.g. the Azure portal) to control MariaDB admin accounts.

- [How to update admin password for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-create-manage-server-portal#update-admin-password)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Review the Azure Active Directory (Azure AD) logs to help discover stale accounts which can include those with MariaDB administrative roles. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications that may be used to access MariaDB, and role assignments. User access should be reviewed on a regular basis such as every 90 days to make sure only the right Users have continued access.

- [Understand Azure AD Reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Enable Diagnostic Settings for MariaDB and Azure Active Directory (Azure AD), sending all logs to a Log Analytics Workspace. Configure desired Alerts (such as failed authentication attempts) within Log Analytics Workspace.

- [How to configure and access Server Logs for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-server-logs)

- [How to configure and access audit logs for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-configure-audit-logs-portal)

- [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Enable Advanced Threat Protection for MariaDB. Advanced Threat Protection for Azure Database for MariaDB detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

Use Azure Active Directory (Azure AD)'s Identity Protection and risk detection features to configure automated responses to detected suspicious actions. You may enable automated responses through Azure Sentinel to implement your organization's security responses.

- [How to enable Advanced Threat Protection for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-database-threat-protection-portal)

- [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

- [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use Tags to assist in tracking Azure Database for MariaDB instances or related resources that store or process sensitive information.

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Use a combination of Private Link, Service Endpoints, and/or MariaDB firewall rules to isolate and limit network access to your MariaDB instances.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to configure Private Link for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-data-access-security-private-link)

- [How to configure Service Endpoints for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-manage-vnet-portal)

- [How to configure firewall rules for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-firewall-rules)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: When using Azure VMs to access MariaDB instances, make use of Private Link, MariaDB network configurations, Network Security Groups, and Service Tags to mitigate the possibility of data exfiltration.

Microsoft manages the underlying infrastructure for MariaDB and has implemented strict controls to prevent the loss or exposure of customer data.

- [How to mitigate data exfiltration for Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-data-access-security-private-link)

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Azure Database for MariaDB supports connecting your Azure Database for MariaDB server to client applications using Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL). Enforcing TLS connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application. In the Azure portal, ensure **Enforce SSL connection** is enabled for all of your MariaDB instances.

- [How to configure encryption in transit for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-configure-ssl)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Database for MariaDB. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use Azure role-based access control (Azure RBAC) to manage access to the Azure Database for the MariaDB management plane (Azure portal/Azure Resource Manager). For data plane access (within the database itself), use SQL queries to create users and configure user permissions.

- [How to configure Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)

- [How to configure user access with SQL for MariaDB](https://docs.microsoft.com/azure/mariadb/howto-create-users)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to production instances of Azure Database for MariaDB and other critical or related resources.

- [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Currently not available; Azure Security Center does not yet support vulnerability assessment for Azure Database for MariaDB server.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Azure Database for MariaDB server) within your subscriptions. Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure Database for MariaDB server and other related resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Database for MariaDB server and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Not applicable; this recommendation is intended for compute resources and Azure as a whole.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscriptions.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

For more information, see the following references:

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use the Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App. This can prevent the creation and changes to resources within a high security environment, such Azure Database for MariaDB server containing sensitive information.

- [How to configure Conditional Access to block access to Azure Resource Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Azure Database for MariaDB instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.DBforMariaDB" namespace to create custom policies to audit or enforce the network configuration of your Azure Database for MariaDB servers. You may also make use of built-in policy definitions related to your Azure Database for MariaDB servers, such as:

- Geo-redundant backup should be enabled for Azure Database for MariaDB

For more information, see the following references:

- [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions for your Azure Database for MariaDB servers and related resources, use Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow)

- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.DBforMariaDB" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.DBforMariaDB" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure Database for MariaDB instances and related resources.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: For Azure Virtual Machines or web applications running on Azure App Service being used to access your Azure Database for MariaDB servers, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure Azure Database for MariaDB server secret management. Ensure Key Vault Soft Delete is enabled.

- [How to integrate with Azure Managed Identities](https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity)

- [How to create a Key Vault](https://docs.microsoft.com/azure/key-vault/general/quick-create-portal)

- [How to authenticate to Key Vault](https://docs.microsoft.com/azure/key-vault/general/authentication)

- [How to assign a Key Vault access policy](https://docs.microsoft.com/azure/key-vault/general/assign-access-policy-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Azure Database for MariaDB server currently does not support Azure Active Directory (Azure AD) authentication to access databases. While creating the Azure Database for MariaDB server, you provide credentials for an administrator user. This administrator can be used to create additional MariaDB users.

For Azure Virtual Machines or web applications running on Azure App Service being used to access your Azure Database for MariaDB server, use Managed Identities in conjunction with Azure Key Vault to store and retrieve credentials for Azure Database for MariaDB server. Ensure Key Vault Soft Delete is enabled.

Use Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to configure Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm)

- [How to integrate with Azure Managed Identities](https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Database for MariaDB server), however it does not run on customer content.

Pre-scan any content being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, Azure Database for MariaDB server, etc. Microsoft cannot access your data in these instances.

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Azure Database for MariaDB takes full, differential, and transaction log backups.  Azure Database for MariaDB automatically creates server backups and stores them in user configured locally redundant or geo-redundant storage. Backups can be used to restore your server to a point-in-time. Backup and restore are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.  The default backup retention period is seven days. You can optionally configure it up to 35 days. All backups are encrypted using AES 256-bit encryption.

- [Understand backups for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-backup)

- [Understand MariaDB initial configuration](https://docs.microsoft.com/azure/mariadb/tutorial-design-database-using-portal)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.DBforMariaDB**:

[!INCLUDE [Resource Policy for Microsoft.DBforMariaDB 9.1](../../includes/policy/standards/asb/rp-controls/microsoft.dbformariadb-9-1.md)]

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Azure Database for MariaDB automatically creates server backups and stores them in user configured locally redundant or geo-redundant storage. Backups can be used to restore your server to a point-in-time.  Backup and restore are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.

If using Key Vault for client-side data encryption for data stored in your MariaDB server, ensure regular automated backups of your keys.

- [Understand backups for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-backup)

- [How to backup Key Vault Keys](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.DBforMariaDB**:

[!INCLUDE [Resource Policy for Microsoft.DBforMariaDB 9.2](../../includes/policy/standards/asb/rp-controls/microsoft.dbformariadb-9-2.md)]

### 9.3: Validate all backups including customer-managed keys

**Guidance**: In Azure Database for MariaDB, perform a restore from the original server's backups for periodic testing of backups. There are two types of restore available: Point-in-time restore and Geo-restore. Point-in-time restore is available with either backup redundancy option and creates a new server in the same region as your original server. Geo-restore is available only if you configured your server for geo-redundant storage and it allows you to restore your server to a different region.

The estimated time of recovery depends on several factors including the database sizes, the transaction log size, the network bandwidth, and the total number of databases recovering in the same region at the same time. The recovery time is usually less than 12 hours.

- [Understand backup and restore in Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-backup#restore)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Azure Database for MariaDB takes full, differential, and transaction log backups. These backups allow you to restore a server to any point-in-time within your configured backup retention period. The default backup retention period is seven days. You can optionally configure it up to 35 days. All backups are encrypted using AES 256-bit encryption.

- [Understand backup and restore in Azure Database for MariaDB](https://docs.microsoft.com/azure/mariadb/concepts-backup)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the metric used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions using tags, and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data. It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-overview)

- [Use tags to organize your Azure resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

- [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.
	

- [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
