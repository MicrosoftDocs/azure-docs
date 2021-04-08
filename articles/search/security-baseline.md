---
title: Azure security baseline for Azure Cognitive Search
description: The Azure Cognitive Search security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: search
ms.topic: conceptual
ms.date: 03/16/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Cognitive Search

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview-v1.md) to Azure Cognitive Search. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Cognitive Search. **Controls** not applicable to Azure Cognitive Search, or the customer have been excluded.

To see how Azure Cognitive Search completely maps to the Azure Security Benchmark, see the [full Azure Cognitive Search security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Ensure that all Microsoft Azure Virtual Network subnet deployments have a network security group applied with rules to implement a "least privileged" access scheme. Allow access only to your application's trusted ports and IP address ranges. Deploy Azure Cognitive Search with an Azure private endpoint, where feasible, to enable private access to your services from your virtual network.

Cognitive Search also supports additional network security functionality for managing network access control lists. Configure your search service to only allow communication with trusted sources by restricting access from specific public IP address ranges using its firewall capability.

- [How to configure Private Endpoints for Azure Cognitive Search](service-create-private-endpoint.md)

- [How to configure the Azure Cognitive Search firewall](service-configure-firewall.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

**Guidance**: Cognitive Search cannot be deployed directly into a virtual network. However, if your client application or data sources are in a virtual network, you can monitor and log traffic for those in-network components, including requests sent to a search service in the cloud. Standard recommendations include enabling a network security group flow log and sending logs to either Azure Storage or a Log Analytics workspace. You could optionally use Traffic Analytics for insights into traffic patterns.

- [How to enable network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

- [Understand network security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Cognitive Search does not provide a specific feature to combat a distributed denial-of-service attack, but you can enable DDoS Protection Standard on the virtual networks associated with your Cognitive Search service for general protection.

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: Enable network security group flow logs for the network security groups protecting Azure Virtual Machines (VM) that will be connecting to your Cognitive Search service. Send logs into an Azure Storage account for traffic audit. 

Enable Network Watcher packet capture if required for investigating anomalous activity.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to enable Network Watcher](../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Cognitive Search does not support network intrusion detection, but as an intrusion mitigation, you can configure firewall rules to specify the IP addresses accepted by the Cognitive Search service. Configure a private endpoint to keep search traffic away from the public internet.

- [How to configure customer-managed keys for data encryption](search-security-manage-encryption-keys.md)

- [How to get customer-managed key information from indexes and synonym maps](search-security-get-encryption-keys.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use service tags, if you are leveraging indexers and skillsets in Cognitive Search, to represent a range of IP addresses that have permission to connect to external resources. 

Allow or deny traffic to resources by specifying the service tag name (for example, AzureCognitiveSearch) in the appropriate source or destination field of a rule. 

- [Virtual network service tags](../virtual-network/service-tags-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: You can configure Cognitive Search with an Azure private endpoint to integrate your search service with a virtual network.  Use resource tags for network security groups and other resources related to network security and traffic flow. For individual network security group rules, use the "Description" field to document the rules that allow traffic to/from a network. 
 

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" effects, to ensure that all resources are created with tags and to notify you of existing untagged resources. 

You can use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags.  

 
- [How to create a private endpoint for Cognitive Search](service-create-private-endpoint.md) 

 
 
- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [How to create an Azure Virtual Network](../virtual-network/quick-create-portal.md) 

 
- [How to filter network traffic with network security group rules](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Ingest logs related to Cognitive Search via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage. 
Alternatively, you can enable and on-board this data to Azure Sentinel or a third-party SIEM.
 

 
- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)
 

 
- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md) 
 

 
- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Diagnostic and operational logs provide insight into the detailed operations of Cognitive Search and are useful for monitoring the service and for workloads that access your service.  To capture diagnostic data, enable logging by specifying where logging information is stored.
 

 
- [How to collect and analyze log data for Azure Cognitive Search](search-monitor-logs.md) 

 
- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Search**:

[!INCLUDE [Resource Policy for Microsoft.Search 2.3](../../includes/policy/standards/asb/rp-controls/microsoft.search-2-3.md)]

### 2.5: Configure security log storage retention

**Guidance**: Historical data that feeds into diagnostic metrics is preserved by Cognitive Search for 30 days by default. For longer retention, be sure to enable the setting that specifies a storage option for persisting logged events and metrics.
 

 
In Azure Monitor, set your Log Analytics workspace retention period according to your organization's compliance regulations. Use Azure Storage accounts for long-term and archival storage. 
 

 
- [Change the data retention period in Log Analytics](https://docs.microsoft.com/azure/azure-monitor/logs/manage-cost-storage#change-the-data-retention-period) 

 
- [How to configure retention policy for Azure Storage account logs](https://docs.microsoft.com/azure/storage/common/manage-storage-analytics-logs#enable-logs)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review Logs

**Guidance**: Analyze and monitor logs from your Cognitive Search service for anomalous behavior. Use Azure Monitor's Log Analytics to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

 
 
- [How to collect and analyze log data for Cognitive Search](search-monitor-logs.md)
 
- [How to visualize search log data in Power BI](search-monitor-logs-powerbi.md)
 

 
- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)
 

 
- [Learn about Log Analytics](../azure-monitor/logs/log-analytics-tutorial.md)
 

 
- [How to perform custom queries in Azure Monitor](../azure-monitor/logs/get-started-queries.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Security Center with Log Analytics workspace for monitoring and alerting on anomalous activity found in security logs and events. Alternatively, you can enable and on-board data to Azure Sentinel.
 

 
- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)
 

 
- [How to manage alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md)
 

 
- [How to alert on log analytics log data](../azure-monitor/alerts/tutorial-response.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure role-based access control (Azure RBAC) allows you to manage access to Azure resources through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal.

Cognitive Search roles are associated with permissions that support service level management tasks. These roles do not grant access to the service endpoint. Access to operations against the endpoint, (such as index management, index population, and queries on search data), use API keys to authenticate the request.

- [Set roles for administrative access to Azure Cognitive Search](search-security-rbac.md)

- [Create and manage api-keys for an Azure Cognitive Search service](search-security-api-keys.md)

- [How to get a directory role in Azure Active Directory (Azure AD) with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0&amp;preserve-view=true)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Cognitive Search does not have the concept of any local-level or Azure Active Directory (Azure AD) administrator accounts that can be used to manage indexes and operations. 

Use the Azure AD built-in roles which must be explicitly assigned for management operations. Invoke the Azure AD PowerShell module to perform ad-hoc queries to discover accounts that are members of administrative groups.

- [How to use roles for administrative access in Cognitive Search](search-security-rbac.md)

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Use SSO authentication with Azure Active Directory (Azure AD) to access search service information for management operations supported through Azure Resource Manager. 

Establish a process to reduce the number of identities and credentials by enabling SSO for the service with your organization's pre-existing identities.

- [Understand SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory (Azure AD)'s multifactor authentication feature and follow Security Center's Identity and Access recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md) 

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use a Privileged Access Workstation (PAW) with multifactor authentication configured to log into and access Azure resources.
 

 
- [Understand secure, Azure-managed workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)
 

 
- [How to enable Azure Active Directory (Azure AD) multifactor authentication](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports and monitoring to detect when suspicious or unsafe activity occurs in the environment. Use Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](../active-directory/identity-protection/overview-identity-protection.md)

- [How to monitor users' identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for service level management tasks in Azure Cognitive Search. Azure AD identities do not grant access to the search service endpoint.  Access to operations such as index management, index population, and queries on search data are available via API keys.

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

- [Create and manage api-keys for an Azure Cognitive Search service](search-security-api-keys.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. Use Azure AD's Identity and access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right users have continued access. 

Review diagnostic logs from Cognitive Search for activity in the search service endpoint such as index management, index population, and queries.

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

- [Monitor operations and activity of Azure Cognitive Search](search-monitor-usage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Access to Azure Active Directory (Azure AD) sign-in activity, audit, and risk event log sources, allow you to integrate with any SIEM or monitoring tool.

Streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. Configure desired alerts within Log Analytics workspace.

- [How to integrate Azure activity logs with Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) Identity Protection features to configure automated responses to detected suspicious actions related to user identities. Ingest data into Azure Sentinel for further investigation, as required.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md) 

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by virtual network/subnet, tagged appropriately, and secured within a network security group or Azure Firewall. Resources storing or processing sensitive data should be isolated. Use Private Link to configure a private endpoint to Cognitive Search.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [How to create a private endpoint for Cognitive Search](service-create-private-endpoint.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Use a third-party solution from Azure Marketplace in network perimeters to monitor for unauthorized transfer of sensitive information and block such transfers while alerting information security professionals.

Microsoft manages the underlying platform and treats all customer content as sensitive and guards against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Cognitive Search. Implement a third-party solution if necessary for compliance purposes. 

Microsoft manages the underlying platform and treats all customer content as sensitive and guards against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to manage access to resources

**Guidance**: For service administration, use Azure role-based access control (Azure RBAC) to manage access to keys and configuration. For content operations, such as indexing and queries, Cognitive Search uses keys instead of an identity-based access control model. Use Azure RBAC to control access to keys. 

 
- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)  
 
 
- [How to use roles for administrative access to Cognitive Search](search-security-rbac.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Cognitive Search automatically encrypts indexed content at rest with Microsoft-managed keys. If more protection is needed, you can supplement default encryption with a second encryption layer using keys that you create and manage in Azure Key Vault.

- [Configure customer-managed keys for data encryption in Azure Cognitive Search](search-security-manage-encryption-keys.md)

- [Understand encryption at rest in Azure](../security/fundamentals/encryption-atrest.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to production instances of Cognitive Search and other critical or related resources. 

 
- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md) 

 
- [How to create alerts for Cognitive Search activities](search-monitor-logs.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query for and discover all resources (such as compute, storage, network, ports, protocols, and so on) in your subscriptions.

Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources in your subscriptions.

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-4.8.0&amp;preserve-view=true)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources with metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create management groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain an inventory of approved Azure resources

**Guidance**: Define a list of approved Azure resources related to indexing and skillset processing in Cognitive Search.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: It is recommended that you define an inventory of Azure resources which have been approved for usage as per your organizational policies and standards prior, then monitor for unapproved Azure resources with Azure Policy, or Azure Resource Graph.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to place restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

Use Azure Resource Graph to query or discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](/azure/governance/policy/samples/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.  

 
Control access to the keys used to authenticate requests for all other operations, particularly those related to content with Cognitive Search.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.Search" namespace to create custom policies to audit or enforce the configuration of your Azure Cognitive Search resources. You may also use built-in Azure Policy definitions for Cognitive Search services such as:

Enable audit logging for Azure resources

Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet the security requirements for your organization.

You can also use the recommendations from Azure Security Center as a secure configuration baseline for your Azure resources.

- [Azure Policy Regulatory Compliance controls for Azure Cognitive Search](security-controls-policy.md)

- [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] effects, to enforce secure settings across your Cognitive Search service resources. 

Azure Resource Manager templates can be used to maintain the security configuration of your Azure resources required by your organization. 

- [Understand Azure Policy effects](../governance/policy/concepts/effects.md)

- [Azure Policy Regulatory Compliance controls for Azure Cognitive Search](security-controls-policy.md)

- [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Azure Resource Manager templates overview](../azure-resource-manager/templates/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [Azure Repos documentation](/azure/devops/repos/index)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Define and implement standard security configurations for your Cognitive Search service resources using Azure Policy. 

Use aliases to create custom policies to audit or enforce the network configurations. You can also make use of built-in policy definitions related to your specific resources. 

Additionally, you can use Azure Automation to deploy configuration changes and manage policy exceptions. 

- [Azure Policy Regulatory Compliance controls for Azure Cognitive Search](security-controls-policy.md)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Security Center to perform baseline scans of your Cognitive Search service resources.  Additionally, use Azure Policy to alert and audit your resource configurations. 

- [How to remediate recommendations in Azure Security Center](../security-center/security-center-remediate-recommendations.md)

- [Azure Policy Regulatory Compliance controls for Azure Cognitive Search](security-controls-policy.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Use Azure Managed Identities in conjunction with Azure Key Vault to simplify secret management for your cloud applications.

- [How to use managed identities for Azure resources](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md) 

- [How to create a Key Vault](../key-vault/general/quick-create-portal.md)

- [How to provide Key Vault authentication with a managed identity](../key-vault/general/assign-access-policy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Use an Azure Managed Identity to give Cognitive Search access to other Azure services such as Key Vault and indexer data sources using an automatically-managed identity in Azure Active Directory (Azure AD). Managed identities allow you to authenticate to any service that supports Azure AD authentication, including Azure Key Vault, without any credentials in your code. 

- [Set up an indexer connection to a data source using a managed identity](search-howto-managed-identities-data-sources.md)

- [Configure customer-managed keys for data encryption using a managed identity](search-security-manage-encryption-keys.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Pre-scan any content being uploaded to non-compute Azure resources, such as Cognitive Search, Blob Storage, Azure SQL Database, and so on. 

It is your responsibility to pre-scan any content being uploaded to non-compute Azure resources. Microsoft cannot access customer data, and therefore cannot conduct anti-malware scans of customer content on your behalf.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.3: Ensure antimalware software and signatures are updated

**Guidance**: Not applicable to Cognitive Search. It does not allow for anti-malware solutions to be installed on its resources. For the underlying platform Microsoft handles updating any anti-malware software and signatures.  

 
For any compute resources that are owned by your organization and used in your search solution, follow recommendations in Security Center, Compute &amp; Apps to ensure all endpoints are up to date with the latest signatures. For Linux, use a third-party anti-malware solution.

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back ups

**Guidance**: Content stored in a search service cannot be backed up through Azure Backup or any other built-in mechanism, but you can rebuild an index from application source code and primary data sources, or build a custom tool to retrieve and store indexed content. 

 
- [GitHub Index-backup-restore sample](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/index-backup-restore)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Cognitive Search currently doesn't support automated backup for data in a search service and must be backed up via a manual process. You can also back up customer-managed keys in Azure Key Vault.
 

- [Back up and restore an Azure Cognitive Search index](/samples/azure-samples/azure-search-dotnet-samples/azure-search-backup-restore-index/)

- [How to backup Key Vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Cognitive Search currently doesn't support automated backup for data in a search service and must be backed up and restored via a manual process. Periodically perform data restoration of content you have manually backed up to ensure the end-to-end integrity of your backup process.

- [Back up and restore an Azure Cognitive Search index](/samples/azure-samples/azure-search-dotnet-samples/azure-search-backup-restore-index/)

- [How to restore Key Vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/restore-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Cognitive Search currently does not support automated backup for data in a search service and must be backed up via a manual process.  You can also back up customer-managed keys in Azure Key Vault.  

 
Enable soft delete and purge protection in Key Vault to protect keys against accidental or malicious deletion. If Azure Storage is used to store manual backups, enable soft delete to save and recover your data when blobs or blob snapshots are deleted. 
 

 
- [Back up and restore an Azure Cognitive Search index](/samples/azure-samples/azure-search-dotnet-samples/azure-search-backup-restore-index/)
 

 
- [How to enable soft delete and purge protection in Key Vault](../storage/blobs/soft-delete-blob-overview.md) 

- [Soft delete for Azure Blob storage](../storage/blobs/soft-delete-blob-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Develop an incident response guide for your organization. Ensure there are written incident response plans that define all the roles of personnel as well as the phases of incident handling and management from detection to post-incident review.

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytically used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data. It's your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication, "Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities"](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or on a continuous basis. You can use the Security Center data connector to stream the alerts to Azure Sentinel.

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

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
