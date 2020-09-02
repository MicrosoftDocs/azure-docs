---
title: Azure security baseline for Azure Cognitive Search
description: The Azure Cognitive Search security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: search
ms.topic: conceptual
ms.date: 09/02/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Cognitive Search

This security baseline applies guidance from the [Azure Security Benchmark](../security/benchmarks/overview.md) to Azure Cognitive Search. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Cognitive Search. **Controls** not applicable to Azure Cognitive Search have been excluded. To see how Azure Cognitive Search completely maps to the Azure Security Benchmark, see the [full Azure Cognitive Search security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see the [Azure Security Benchmark: Network security](/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33328.).

**Guidance**: Configure your search service's firewall by restricting access to clients from specific public IP address ranges, select virtual networks, or specific Azure resources. You can also configure Private Endpoints so traffic to the search service from your enterprise travels exclusively over private networks.

- [How to configure the Azure Cognitive Search firewall](service-configure-firewall.md)

- [How to configure Private Endpoints for Azure Cognitive Search](service-create-private-endpoint.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33329.).

**Guidance**: Cognitive Search cannot be deployed directly into a virtual network, but if your client application or data sources are in a virtual network, you can monitor and log traffic for those in-network components, including requests sent to a search service in the cloud. Standard recommendations include enabling a network security group flow log and sending logs to either Azure Storage or a Log Analytics workspace. You could optionally use Traffic Analytics for insights into traffic patterns.

- [How to enable network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

- [Understand network security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33331.).

**Guidance**: Cognitive Search does not provide a specific feature to combat a distributed denial-of-service attack, but you can enable DDoS Protection Standard on the virtual networks associated with your search service for general protection.

- [How to configure DDoS protection](../virtual-network/manage-ddos-protection.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.5: Record network packets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33332.).

**Guidance**: For Azure Virtual Machines (VMs) that will be connecting to your Cognitive Search service, enable network security group (NSG) flow logs for the NSGs protecting those VMs and send logs into an Azure Storage account for traffic audit. If required for investigating anomalous activity, enable Network Watcher packet capture.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to enable Network Watcher](../network-watcher/network-watcher-create.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33333.).

**Guidance**: Cognitive Search does not support network intrusion detection, but as an intrusion mitigation, you can configure firewall rules to specify which IP addresses the search service accepts requests from. You can also configure a private endpoint to keep search traffic off the public internet.

- [How to configure customer-managed keys for data encryption](search-security-manage-encryption-keys.md)

- [How to get customer-managed key information from indexes and synonym maps](search-security-get-encryption-keys.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33334.).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33335.).

**Guidance**: If you are leveraging indexers and skillsets in Cognitive Search, you can use service tags to represent a range of IP addresses that have permission to connect to external resources. By specifying the service tag name (for example, AzureCognitiveSearch) in the appropriate source or destination field of a rule, you can allow or deny traffic to that resource. 

- [Virtual network service tags](../virtual-network/service-tags-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33337.).

**Guidance**: Cognitive Search does not support deploying directly into a virtual network, because of this you can not leverage traditional networking features with it such as network security groups, route tables, or other network dependent appliances such as an Azure Firewall. However, you can set up firewall rules to restrict access to a search service, and you can leverage Private Link to require all inbound request go through a private endpoint. 

- [How to configure IP firewall rules for Cognitive Search](service-configure-firewall.md)

- [How to create a private endpoint for Cognitive Search](service-create-private-endpoint.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see the [Azure Security Benchmark: Logging and monitoring](/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33340.).

**Guidance**: Ingest logs related to Cognitive Search via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

Alternatively, you can enable and on-board this data to Azure Sentinel or a third-party SIEM.

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/platform/diagnostic-settings.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33341.).

**Guidance**: Diagnostic and operational logs provide insight into the detailed operations of Azure Cognitive Search and are useful for monitoring service and workloads accessing your service.  If you want to explore diagnostic data, you can configure a diagnostic setting to specify where logging information is collected.

- [How to collect and analyze log data for Azure Cognitive Search](search-monitor-logs.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33343.).

**Guidance**: Historical data that feeds into diagnostic metrics is preserved by Azure Cognitive Search for 30 days by default. For longer retention, be sure to enable the setting that specifies a storage option for persisting logged events and metrics.

In Azure Monitor, set your Log Analytics workspace retention period according to your organization's compliance regulations. Use Azure Storage accounts for long-term and archival storage. 

- [Change the data retention period in Log Analytics](../azure-monitor/platform/manage-cost-storage.md#change-the-data-retention-period) 

- [How to configure retention policy for Azure Storage account logs](../storage/common/storage-monitor-storage-account.md#configure-logging)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.6: Monitor and review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33344.).

**Guidance**: Analyze and monitor logs from your Cognitive Search service for anomalous behavior. Use Azure Monitor's Log Analytics to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM.

- [How to collect and analyze log data for Cognitive Search](search-monitor-logs.md)

- [How to visualize search log data in Power BI](search-monitor-logs.md-powerbi)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [Learn about Log Analytics](../azure-monitor/log-query/get-started-portal.md)

- [How to perform custom queries in Azure Monitor](../azure-monitor/log-query/get-started-queries.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33345.).

**Guidance**: Use Azure Security Center with Log Analytics workspace for monitoring and alerting on anomalous activity found in security logs and events. Alternatively, you can enable and on-board data to Azure Sentinel.

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to manage alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md)

- [How to alert on log analytics log data](../azure-monitor/learn/tutorial-response.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity and access control

*For more information, see the [Azure Security Benchmark: Identity and access control](/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33349.).

**Guidance**: Azure role-based access control (RBAC) allows you to manage access to Azure resources through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal.

Azure Cognitive Search roles are associated with permissions that support service level management tasks.  These roles do not grant access to the service endpoint.  Access to operations such as index management, index population, and queries on search data are available via api-keys.

- [Set roles for administrative access to Azure Cognitive Search](search-security-rbac.md)

- [Create and manage api-keys for an Azure Cognitive Search service](search-security-api-keys.md)

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0) 

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33351.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33352.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33353.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33354.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33355.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.8: Manage Azure resources only from approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33356.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33357.).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for service level management tasks in Azure Cognitive Search.  Azure AD identities do not grant access to the search service endpoint.  Access to operations such as index management, index population, and queries on search data are available via api-keys.

- [Set roles for administrative access to Azure Cognitive Search](search-security-rbac.md)

- [Create and manage api-keys for an Azure Cognitive Search service](search-security-api-keys.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33358.).

**Guidance**: Azure AD provides logs to help discover stale accounts. In addition, use Azure AD identity and access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right users have continued access.

You can review diagnostic logs from Azure Cognitive Search for activity in the search service endpoint such as index management, index population, and queries.  Prevent unauthorized access by controlling access to the API keys and rotating regularly.

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring/) 

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

- [Create and manage api-keys for an Azure Cognitive Search service](search-security-api-keys.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33359.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.12: Alert on account login behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33360.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33361.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Data protection

*For more information, see the [Azure Security Benchmark: Data protection](/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33362.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33363.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33364.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33365.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33366.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.6: Use Azure RBAC to manage access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33367.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.7: Use host-based data loss prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33368.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33369.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33370.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Vulnerability management

*For more information, see the [Azure Security Benchmark: Vulnerability management](/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33371.).

**Guidance**: Currently not available; Azure Security Center does not yet support vulnerability assessment for Cognitive Search. Should support become available, you would be responsible for conducting the assessment. For clusters that store search service content, Microsoft is responsible for vulnerability management of those clusters.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

## Inventory and asset management

*For more information, see the [Azure Security Benchmark: Inventory and asset management](/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33376.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33377.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33378.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.4: Define and maintain an inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33379.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33380.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33381.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33382.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33383.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33384.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.10: Maintain an inventory of approved software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33385.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33386.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.12: Limit users' ability to execute scripts in compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33387.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33388.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Secure configuration

*For more information, see the [Azure Security Benchmark: Secure configuration](/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33389.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33391.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33393.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33395.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33397.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33399.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33400.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33401.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Malware defense

*For more information, see the [Azure Security Benchmark: Malware defense](/azure/security/benchmarks/security-control-malware-defense).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33403.).

**Guidance**: Pre-scan any content being uploaded to non-compute Azure resources, such as Cognitive Search, Blob Storage, Azure SQL Database, and so on. 

It is your responsibility to pre-scan any content being uploaded to non-compute Azure resources. Microsoft cannot access customer data, and therefore cannot conduct anti-malware scans of customer content on your behalf.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure antimalware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33404.).

**Guidance**: Not applicable; Cognitive Search does not allow for anti-malware solutions to be installed on it's resources. For the underlying platform Microsoft handles updating any anti-malware software and signatures. 

For any compute resources that are owned by your organization and used in your search solution, follow recommendations in Azure Security Center, Compute &amp; Apps to ensure all endpoints are up to date with the latest signatures. For Linux, use third-party anti-malware solution.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Data recovery

*For more information, see the [Azure Security Benchmark: Data recovery](/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33405.).

**Guidance**: Content stored in a search service cannot be be backed up through Azure Backup or any other built-in mechanism, but you can rebuild an index from application source code and primary data sources, or build a custom tool to retrieve and store indexed content.

- [GitHub: Index-backup-restore sample](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/index-backup-restore)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33406.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 9.3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33407.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 9.4: Ensure protection of backups and customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33408.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Incident response

*For more information, see the [Azure Security Benchmark: Incident response](/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33409.).

**Guidance**: Develop an incident response guide for your organization. Ensure there are written incident response plans that define all the roles of personnel as well as the phases of incident handling and management from detection to post-incident review.

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33410.).

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytically used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data. It's your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33415.).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication, "Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities"](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33411.).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33412.).

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or on a continuous basis. You can use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33413.).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see the [Azure Security Benchmark: Penetration tests and red team exercises](/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33414.).

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.Penetration Testing Rules of Engagement: https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1Microsoft Cloud Red Teaming: https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
