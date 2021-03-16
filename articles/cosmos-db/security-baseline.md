---
title: Azure security baseline for Azure Cosmos DB
description: The Azure Cosmos DB security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Cosmos DB

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to Azure Cosmos DB. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Azure Cosmos DB. **Controls** not applicable to Azure Cosmos DB have been excluded.

 
To see how Azure Cosmos DB completely maps to the Azure
Security Benchmark, see the [full Azure Cosmos DB security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: By using Azure Private Link, you can connect to an Azure Cosmos account via a Private Endpoint. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can also reduce the risk of data exfiltration by configuring a strict set of outbound rules on a network security group (NSG) and associating that NSG with your subnet.

You can also use Service Endpoints to secure your Azure Cosmos account. By enabling a Service Endpoint, you can configure Azure Cosmos accounts to allow access from only a specific subnet of an Azure virtual network. Once the Azure Cosmos DB Service Endpoint is enabled, you can limit access to an Azure Cosmos account with connections from a subnet in a  virtual network.

You can also secure the data stored in your Azure Cosmos account by using IP firewalls. Azure Cosmos DB supports IP-based access controls for inbound firewall support. You can set an IP firewall on the Azure Cosmos account by using the Azure portal, Azure Resource Manager templates, or through the Azure CLI or Azure PowerShell.

- [Azure Private Link Overview](../private-link/private-link-overview.md)

- [How to configure a Private Endpoint for Azure Cosmos DB](how-to-configure-private-endpoints.md) 

- [How to create a Network Security Group with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

- [How to configure IP firewall in Cosmos DB](how-to-configure-firewall.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.DocumentDB**:

[!INCLUDE [Resource Policy for Microsoft.DocumentDB 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.documentdb-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure network resources related to your Azure Cosmos account.

When virtual machines are deployed in the same virtual network as your Azure Cosmos account, you can use a network security group (NSG) to reduce the risk of data exfiltration. Enable NSG flow logs and send logs into an Azure Storage Account for traffic audits. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

**Guidance**: Use the Cross-Origin Resource Sharing (CORS) feature to enable a web application running under one domain to access resources in another domain. Web browsers implement a security restriction known as same-origin policy that prevents a web page from calling APIs in a different domain. However, CORS provides a secure way to allow the origin domain to call APIs in another domain. After you enable the CORS support for your Azure Cosmos account, only authenticated requests are evaluated to determine whether they are allowed according to the rules you have specified.

- [Configure Cross-Origin Resource Sharing](how-to-configure-cross-origin-resource-sharing.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Cosmos DB. ATP for Azure Cosmos DB provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit Azure Cosmos accounts. This layer of protection allows you to address threats and integrate them with central security monitoring systems.

Enable DDoS Protection Standard on the Virtual Networks associated with your Azure Cosmos DB instances to guard against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to configure Azure Cosmos DB Advanced Threat Protection](cosmos-db-advanced-threat-protection.md)

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

- [Understand Azure Security Center Integrated Threat Intelligence](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: Enable network security group (NSG) flow logs and send logs into a storage account for traffic audit. You can send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Cosmos DB. ATP for Azure Cosmos DB provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit Azure Cosmos accounts. This layer of protection allows you to address threats and integrate them with central security monitoring systems. 

- [How to configure Cosmos DB Advanced Threat Protection](cosmos-db-advanced-threat-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: For resources that need access to your Azure Cosmos account, use Virtual Network service tags to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., AzureCosmosDB) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [For more information about using service tags](../virtual-network/service-tags-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources with Azure Policy. Use Azure Policy aliases in the "Microsoft.DocumentDB" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Cosmos DB instances. You may also make use of built-in policy definitions for Azure Cosmos DB, such as:

- Deploy Advanced Threat Protection for Cosmos DB Accounts

- Cosmos DB should use a virtual network service endpoint

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, Azure role-based access control (Azure RBAC), and policies in a single blueprint definition. You can easily apply the blueprint to new subscriptions, environments, and fine-tune control and management through versioning.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network resources associated with your Azure Cosmos DB deployment in order to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Cosmos DB instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place. 

- [How to view and retrieve Azure Activity Log events](../azure-monitor/essentials/activity-log.md#view-the-activity-logview-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by Azure Cosmos DB. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use storage accounts for long-term/archival storage. Alternatively, you may on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM). 

- [How to enable diagnostic logs for Azure Cosmos DB](./monitor-cosmos-db.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable diagnostic settings for Azure Cosmos DB and send the logs to a Log Analytics workspace or Azure storage account. Diagnostic settings in Azure Cosmos DB are used to collect resource logs. These logs are captured per request and they are also referred to as **data plane logs**. Some examples of the data plane operations include delete, insert, and read. 

You can also enable Azure Activity Log diagnostic settings and send those logs to the same Log Analytics Workspace you use for Azure Cosmos DB logs.

- [How to enable diagnostic settings for Azure Cosmos DB](./monitor-cosmos-db.md)

- [How to enable diagnostic settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: In Azure Monitor, set the log retention period for Log Analytics workspaces associated with your Azure Cosmos DB instances according to your organization's compliance regulations.

- [How to set log retention parameters](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: You can perform queries in Log Analytics a workspace to search terms, identify trends, analyze patterns, and provide many other insights based on the Azure Cosmos DB logs that you gathered.

- [How to perform queries for Azure Cosmos DB in Log Analytics Workspaces](monitor-cosmos-db.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: In Azure Security Center, enable Advanced Threat Protection for Azure Cosmos DB to monitor anomalous activities in security logs and events. Enable diagnostic settings in Azure Cosmos DB and send logs to a Log Analytics workspace.

 

You can also onboard your Log Analytics workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for playbooks (automated solutions) to be created and used to remediate security issues. Additionally, you can create custom log alerts in your Log Analytics workspace using Azure Monitor.

- [List of threat protection alerts for Azure Cosmos DB](../security-center/alerts-reference.md#alerts-azurecosmos)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [Create, view, and manage log alerts using Azure Monitor](../azure-monitor/alerts/alerts-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: You can use the Identity and Access control (IAM) pane in the Azure portal to configure role-based access control (RBAC) and maintain inventory on Azure Cosmos DB resources. The roles are applied to users, groups, service principals, and managed identities in Azure Active Directory (Azure AD). You can use built-in roles or custom roles for individuals and groups.

Azure Cosmos DB provides built-in Azure RBAC for common management scenarios in Azure Cosmos DB. An individual who has a profile in Azure AD can assign these Azure roles to users, groups, service principals, or managed identities to grant or deny access to resources and operations on Azure Cosmos DB resources.

You can also use the Azure AD PowerShell module to perform adhoc queries to discover accounts that are members of administrative groups.

Additionally, some actions in Azure Cosmos DB can be controlled with Azure AD and account-specific master keys. Use the 'disableKeyBasedMetadataWriteAccess' account setting to control key access.

- [Understand role-based access control in Azure Cosmos DB](role-based-access-control.md)

- [Build your own custom roles using Azure Cosmos DB Actions (Microsoft.DocumentDB namespace)](../role-based-access-control/resource-provider-operations.md#microsoftdocumentdb)

- [Create a new role in Azure AD](../role-based-access-control/custom-roles.md)

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole?amp;preserve-view=true&view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember?amp;preserve-view=true&view=azureadps-2.0)

- [Restrict user access to data operations only](how-to-restrict-user-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: The concept of default or blank passwords does not exist in relation to Azure Active Directory (Azure AD) or Azure Cosmos DB. Instead, Azure Cosmos DB uses two types of keys to authenticate users and provide access to its data and resources; master keys and resource tokens. The keys can be regenerated at any time.

- [Understanding secure access to data in Azure Cosmos DB](secure-access-to-data.md)

- [How to regenerate Azure Cosmos DB Keys](./manage-with-powershell.md#regenerate-keys)

- [How to programmatically access keys using Azure AD](certificate-based-authentication.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Not applicable; Azure Cosmos DB does not support administrator accounts. All access is integrated with Azure Active Directory (Azure AD) and Azure role-based access control (Azure RBAC).

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Azure Cosmos DB uses two types of keys to authorize users and does not support Single Sign-On (SSO) at the data plane level. Access to the control plane for Cosmos DB is available via REST API and supports SSO. To authenticate, set the Authorization header for your requests to a JSON Web Token that you obtain from Azure Active Directory (Azure AD).

- [Understand Azure Database for Cosmos DB REST API](/rest/api/cosmos-db/)

- [Understand SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use Privileged Access Workstations (PAW) with multifactor authentication configured to log into and configure Azure resources. 

- [Learn about Privileged Access Workstations](/security/compass/privileged-access-devices)
 
- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Cosmos DB. ATP for Azure Cosmos DB provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit Azure Cosmos accounts. This layer of protection allows you to address threats and integrate them with central security monitoring systems.

In addition, you may use Azure Active Directory (Azure AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

Use Azure AD Risk Detections to view alerts and reports on risky user behavior.

- [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Configure the location condition of a Conditional Access policy and manage your named locations. With named locations, you can create logical groupings of IP address ranges or countries and regions. You can restrict access to sensitive resources, such as your Azure Cosmos DB instances, to your configured named locations.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

- [How to create and configure an Azure AD instance](../active-directory-domain-services/tutorial-create-instance.md)

- [How to configure and manage Azure AD authentication with Azure SQL](../azure-sql/database/authentication-aad-configure.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. In addition, you can use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right Users have continued access.

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: You can create diagnostic settings for Azure Active Directory (Azure AD) user accounts, sending the audit logs and sign-in logs to a Log Analytics workspace where you can configure desired alerts.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Advanced Threat Protection (ATP) for Azure Cosmos DB. ATP for Azure Cosmos DB provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit Azure Cosmos accounts. This layer of protection allows you to address threats and integrate them with central security monitoring systems.

You can also use Azure Active Directory (Azure AD) Identity Protection and risk detections feature to configure automated responses to detected suspicious actions related to user identities. Additionally, you can ingest logs into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure Cosmos DB instances that store or process sensitive information.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Azure Cosmos DB instances are separated by virtual network/subnet, tagged appropriately, and secured within a network security group (NSG) or Azure Firewall. Azure Cosmos DB instances storing sensitive data should be isolated. By using Azure Private Link, you can connect to an Azure Cosmos DB instance account via a private endpoint. The private endpoint is a set of private IP addresses in a subnet within your virtual network. You can then limit access to the selected private IP addresses. 

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create management groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [How to configure a Private Endpoint for Azure Cosmos DB](how-to-configure-private-endpoints.md)

- [How to create a Network Security Group with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: You can deploy Advanced Threat Protection for Azure Cosmos DB, which will detect anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. It can currently trigger the following alerts:

- Access from unusual locations

- Unusual data extraction

Additionally, when using virtual machines to access your Azure Cosmos DB instances, make use of Private Link, Firewall, network security groups, and service tags to mitigate the possibility of data exfiltration. Microsoft manages the underlying infrastructure for Azure Cosmos DB and has implemented strict controls to prevent the loss or exposure of customer data.

- [How to configure Cosmos DB Advanced Threat Protection](cosmos-db-advanced-threat-protection.md)

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Automatic data identification, classification, and loss prevention features are not yet available for Azure Cosmos DB. However, you can use the Azure Cognitive Search integration for classification and data analysis. You can also implement a third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Index Azure Cosmos DB data with Azure Cognitive Search](../search/search-howto-index-cosmosdb.md?amp;bc=%2fazure%2fcosmos-db%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fcosmos-db%2ftoc.json)

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Azure Cosmos DB provides built-in Azure role-based access control (Azure RBAC) for common management scenarios in Azure Cosmos DB. An individual who has a profile in Azure Active Directory (Azure AD) can assign these Azure roles to users, groups, service principals, or managed identities to grant or deny access to resources and operations on Azure Cosmos DB resources. Role assignments are scoped to control-plane access only, which includes access to Azure Cosmos accounts, databases, containers, and offers (throughput).

- [How to implement Azure RBAC in Azure Cosmos DB](role-based-access-control.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: All user data stored in Cosmos DB is encrypted at rest by default. There are no controls to turn it off. Azure Cosmos DB uses AES-256 encryption on all regions where the account is running.

By default, Microsoft manages the keys that are used to encrypt the data in your Azure Cosmos account. You can optionally choose to add a second layer of encryption with your own keys.

- [Understanding encryption at rest with Azure Cosmos DB](database-encryption-at-rest.md)

- [Understanding key management for encryption at rest with Azure Cosmos DB]()

- [How to configure customer-managed keys for your Azure Cosmos DB account](how-to-setup-cmk.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to production instances of Azure Cosmos DB.

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Follow recommendations from Azure Security Center for your Azure Cosmos DB instances. 

Microsoft performs system patching and vulnerability management on the underlying hosts that support your Azure Cosmos DB instances. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Supported features available in Azure Security Center](../security-center/security-center-services.md?tabs=features-windows)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use the Azure portal or Azure Resource Graph to discover all resources (not limited to Azure Cosmos DB, but also including resources such as compute, other storage, network, ports, and protocols etc.) within your subscription(s). Ensure you have appropriate permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription?amp;preserve-view=true&view=azps-4.8.0)

- [Understanding Azure role-based access control](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to your Azure Cosmos DB instances and related resources with metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [Which Azure Cosmos DB resources support tags](../azure-resource-manager/management/tag-support.md#microsoftdocumentdb)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets, including but not limited to Azure Cosmos DB resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

In addition, use the Azure Resource Graph to query for and discover resources within the subscriptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use the Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App. This can prevent the creation and changes to resources within a high security environment.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Cosmos DB instances with Azure Policy. Use Azure Policy aliases in the **Microsoft.DocumentDB** namespace to create custom policies to audit or enforce the configuration of your Cosmos DB instances. You may also make use of built-in policy definitions for Azure Cosmos DB, such as:
- Deploy Advanced Threat Protection for Cosmos DB Accounts
- Cosmos DB should use a virtual network service endpoint

- [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias?amp;preserve-view=true&view=azps-4.8.0)

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

**Guidance**: If you're using custom Azure Policy definitions for your Cosmos DB or related resources, use Azure Repos to store and manage your custom policy definitions as code.

- [Design Policy as Code workflows](../governance/policy/concepts/policy-as-code.md)

- [Azure Repos Documentation](/azure/devops/repos/git/gitworkflow)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.DocumentDB" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.DocumentDB" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure Cosmos DB instances and related resources. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your Azure Cosmos DB instances, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure Azure Cosmos DB secret management. Ensure Key Vault Soft Delete is enabled.

- [How to integrate with Azure Managed Identities](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md)

- [How to create a Key Vault](../key-vault/secrets/quick-create-portal.md)

- [How to authenticate to Key Vault](../key-vault/general/authentication.md)

- [How to assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your Azure Cosmos DB instances, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure Azure Cosmos DB secret management.

Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to configure Managed Identities](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)

- [How to integrate with Azure Managed Identities](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to set up Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure CosmosDB), however it does not run on customer content.

It is your responsibility to pre-scan any files being uploaded to non-compute Azure resources, including Azure Cosmos DB. Microsoft cannot access customer data, and therefore cannot conduct anti-malware scans of customer content on your behalf.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Azure Cosmos DB automatically takes backups of your data at regular intervals. If database or container is deleted, you can file a support ticket or call Azure support to restore the data from automatic online backups. Azure support is available for selected plans only such as Standard, Developer, and plans higher than them. To restore a specific snapshot of the backup, Azure Cosmos DB requires that the data is available for the duration of the backup cycle for that snapshot. 

If using Key Vault to store credentials for your Cosmos DB instances, ensure regular automated backups of your keys.

- [Understand Azure Cosmos DB Automated Backups](online-backup-and-restore.md)

- [How to restore data in Azure Cosmos DB](./online-backup-and-restore.md)

- [How to backup Key Vault Keys](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: If database or container is deleted, you can file a support ticket or call Azure support to restore the data from automatic online backups. Azure support is available for selected plans only such as Standard, Developer, and plans higher than them. To restore a specific snapshot of the backup, Azure Cosmos DB requires that the data is available for the duration of the backup cycle for that snapshot.

Test restoration of your secrets stored in Azure Key Vault using PowerShell. The Restore-AzureKeyVaultKey cmdlet creates a key in the specified key vault. This key is a replica of the backed-up key in the input file and has the same name as the original key.

- [Understand Azure Cosmos DB Automated Backups](online-backup-and-restore.md)

- [How to restore data in Azure Cosmos DB](./online-backup-and-restore.md)

- [How to restore Azure Key Vault Secrets](/powershell/module/az.keyvault/restore-azkeyvaultkey?amp;preserve-view=true&view=azps-4.8.0)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Because all user data stored in Cosmos DB is encrypted at rest and in transport, you don't have to take any action. Another way to put this is that encryption at rest is "on" by default. There are no controls to turn it off or on. Azure Cosmos DB uses AES-256 encryption on all regions where the account is running.

Enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.

- [Understand data encryption in Azure Cosmos DB](database-encryption-at-rest.md)

- [How to enable Soft-Delete in Key Vault](../storage/blobs/soft-delete-blob-overview.md?tabs=azure-portal)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [You may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident the Security Center is in finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

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

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)