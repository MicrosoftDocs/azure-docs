---
title: Azure security baseline for Azure Storage
description: The Azure Storage security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: storage
ms.topic: conceptual
ms.date: 03/16/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Storage

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../../security/benchmarks/overview-v1.md) to Azure Storage. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Azure Storage. **Controls** not applicable to Azure Storage have been excluded.

 
To see how Azure Storage completely maps to the Azure
Security Benchmark, see the [full Azure Storage security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Configure your storage account's firewall by restricting access to clients from specific public IP address ranges, select virtual networks, or specific Azure resources.  You can also configure Private Endpoints so traffic to the storage service from your enterprise travels exclusively over private networks.

Note: Classic storage accounts do not support firewalls and virtual networks.

- [How to configure the Azure Storage Firewall](https://docs.microsoft.com/azure/storage/common/storage-network-security#change-the-default-network-access-rule)

- [How to configure Private Endpoints for Azure Storage](storage-private-endpoints.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Storage**:

[!INCLUDE [Resource Policy for Microsoft.Storage 1.1](../../../includes/policy/standards/asb/rp-controls/microsoft.storage-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Azure Storage provides a layered security model. You can limit access to your storage account to requests originating from specified IP addresses, IP ranges or from a list of subnets in an Azure Virtual Network. You can use Azure Security Center and follow network protection recommendations to help secure your network resources in Azure. Also, enable network security group flow logs for virtual networks or subnet configured for the Storage accounts via Storage account firewall and send logs into a Storage Account for traffic audit. 

 
Note that if you have Private Endpoints attached to your storage account, you cannot configure network security group rules for subnets. 
 

 
- [Configure Azure Storage firewalls and virtual networks](storage-network-security.md) 
 

 
- [How to Enable NSG Flow Logs](../../network-watcher/network-watcher-nsg-flow-logging-portal.md) 
 

 
- [Understanding Network Security provided by Azure Security Center](../../security-center/security-center-network-recommendations.md) 
 

 
- [Understanding Private Endpoints for Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-private-endpoints#known-issues)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

**Guidance**: Not applicable; recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Enable Azure Defender for Storage for your Azure Storage account. Azure Defender for Storage provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit storage accounts.  Azure Security Center integrated alerts are based on activities for which network communication was associated with an IP address that was successfully resolved, whether or not the IP address is a known risky IP address (for example, a known cryptominer) or an IP address that is not recognized previously as risky. Security alerts are triggered when anomalies in activity occur. 

- [Configure Azure Defender for Storage](azure-defender-storage-configure.md) 

- [Understand Azure Security Center Integrated Threat Intelligence](../../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: Network Watcher packet capture allows you to create capture sessions to track traffic between Storage account and a virtual machine. Filters are provided for the capture session to ensure you capture only the traffic you want. Packet capture helps to diagnose network anomalies, both reactively, and proactively. Other uses include gathering network statistics, gaining information on network intrusions, to debug client-server communication, and much more. Being able to remotely trigger packet captures, eases the burden of running a packet capture manually on a desired virtual machine, which saves valuable time. 

- [ Manage packet captures with Azure Network Watcher using the portal](../../network-watcher/network-watcher-packet-capture-manage-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Azure Defender for Storage provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit storage accounts. Security alerts are triggered when anomalies in activity occur. These security alerts are integrated with Azure Security Center, and are also sent via email to subscription administrators, with details of suspicious activity and recommendations on how to investigate and remediate threats. 

- [Configure Azure Defender for Storage](https://docs.microsoft.com/azure/storage/common/azure-defender-storage-configure?tabs=azure-security-center)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable; recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: For resource in Virtual Networks that need access to your Storage account, use Virtual Network Service tags for the configured Virtual Network to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (such as Storage) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. 

When network access needs to be scoped to specific Storage Accounts, use Virtual Network service endpoint policies.

- [For more information about using Service Tags](../../virtual-network/service-tags-overview.md)

- [For more information about Virtual network service endpoint policies for Azure Storage](../../virtual-network/virtual-network-service-endpoint-policies-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Storage Account with Azure Policy. Use Azure Policy aliases in the "Microsoft.Storage" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Storage account resources. 

You may also make use of built-in policy definitions related to Storage account, such as: Storage Accounts should use a virtual network service endpoint 

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md) 

- [Azure Policy samples for Storage](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#storage) 

- [Azure Policy samples for Network](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#network) 

- [How to create an Azure Blueprint](../../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network security groups and other resources related to network security and traffic flow. Tagging lets you associate built-in and custom name-value pairs with a given network resource, helping  you to organize network resources and to relate Azure resources back to your network design.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources. 

Network security groups support tags, but individual security rules do not. Security rules do have a **Description** field that you can use to store some of the information you would normally put in a tag.

- [How to create and use resource tags](../../azure-resource-manager/management/tag-resources.md)

- [How to filter network traffic with a network security group](../../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Policy to log configuration changes for network resources.  Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.  

 
- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)
 
 
- [How to create alerts in Azure Monitor](../../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by endpoints devices, network resources, and other security systems. Within Azure Monitor, use Log Analytics Workspace(s) to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage, optionally with security features such as immutable storage and enforced retention holds.

 
- [How to collect platform logs and metrics with Azure Monitor](../../azure-monitor/essentials/diagnostic-settings.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Azure Storage Analytics provides logs for blobs, queues, and tables. You can use the Azure portal to configure which logs are recorded for your account.   

 
- [How to configure monitoring for your Azure Storage account](manage-storage-analytics-logs.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: When storing Security event logs in the Azure Storage account or Log Analytics workspace, you may set the retention policy according to your organization's requirements.  

 
- [How to configure retention policy for Azure Storage account logs](https://docs.microsoft.com/azure/storage/common/manage-storage-analytics-logs#configure-logging) 

 
- [Change the data retention period in Log Analytics](https://docs.microsoft.com/azure/azure-monitor/logs/manage-cost-storage#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: To review the Azure Storage logs, there are the usual options such as queries through the Log Analytics offering as well as a unique option of viewing the log files directly. In Azure Storage, the logs are stored in blobs that must be accessed directly at `http://accountname.blob.core.windows.net/$logs` (The logging folder is hidden by default, so you will need to navigate directly. It will not display in List commands) 

 
Also, Enable Azure Defender for Storage for your storage account. Azure Defender for Storage provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit storage accounts. Security alerts are triggered when anomalies in activity occur. These security alerts are integrated with Azure Security Center, and are also sent via email to subscription administrators, with details of suspicious activity and recommendations on how to investigate and remediate threats. 
 

 
- [Log and review data](https://docs.microsoft.com/azure/storage/common/storage-analytics-logging#how-logs-are-stored) 
 

 
- [Configure Azure Defender for Storage](https://docs.microsoft.com/azure/storage/common/azure-defender-storage-configure?tabs=azure-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: In Azure Security Center, enable Azure Defender for Storage account. Enable Diagnostic Settings for the Storage account and send logs to a Log Analytics Workspace. Onboard your Log Analytics Workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for playbooks (automated solutions) to be created and used to remediate security issues.  

 
- [How to onboard Azure Sentinel](../../sentinel/quickstart-onboard.md)  

 
- [How to manage alerts in Azure Security Center](../../security-center/security-center-managing-and-responding-alerts.md)  

 
- [How to alert on log analytics log data](../../azure-monitor/alerts/tutorial-response.md)  

 
- [Azure Storage analytics logging](storage-analytics-logging.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

**Guidance**: Use Azure Security center and enable Azure Defender for Storage for detecting malware uploads to Azure Storage using hash reputation analysis and suspicious access from an active Tor exit node (an anonymizing proxy). 

- [Configure Azure Defender for Storage](azure-defender-storage-configure.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

**Guidance**: Azure DNS Analytics (Preview) solution in Azure Monitor gathers insights into DNS infrastructure on security, performance, and operations.  Currently this does not support Azure Storage accounts however you can use third-party dns logging solution.  

 
- [Gather insights about your DNS infrastructure with the DNS Analytics Preview solution](../../azure-monitor/insights/dns-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Azure Storage accounts nor Azure Active Directory (Azure AD) have the concept of default or blank passwords. Azure Storage implements an access control model that supports Azure role-based access control (Azure RBAC) as well as Shared Key and Shared Access Signatures (SAS). A characteristic of Shared Key and SAS authentication is that no identity is associated with the caller and therefore security principal permission-based authorization cannot be performed.

- [Authorizing access to data in Azure Storage](storage-auth.md)

- [Understanding security principals and access control for Azure Storage account](storage-introduction.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts that have access to your Storage account. Use Azure Security Center Identity and access management to monitor the number of administrative accounts.

You can also enable a Just-In-Time / Just-Enough-Access by using Azure Active Directory (Azure AD) Privileged Identity Management Privileged Roles for Microsoft Services, and Azure Resource Manager.

- [Understand Azure Security Center Identity and Access](../../security-center/security-center-identity-access.md)

- [Privileged Identity Management Overview](/azure/active-directory/privileged-identity-management/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Wherever possible, use Azure Active Directory (Azure AD) SSO instead of configuring individual stand-alone credentials per-service. Use Azure Security Center Identity and Access Management recommendations.
 

 
- [Understanding SSO with Azure AD](../../active-directory/manage-apps/what-is-single-sign-on.md)
 

 
- [Authorizing access to data in Azure Storage](storage-auth.md)
 

 
- [Authorize access to blobs and queues using Azure AD](storage-auth-aad.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and access management recommendations to help protect your Storage account resources.

- [How to enable multifactor authentication in Azure](../../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with multifactor authentication configured to log into and configure Storage account resources.  

 
- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/) 

 
- [How to enable multifactor authentication in Azure](../../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Send Azure Security Center Risk Detection alerts into Azure Monitor and configure custom alerting/notifications using Action Groups. Enable Azure Defender for Storage account to generate alerts for suspicious activity. Additionally, use Azure Active Directory (Azure AD) Risk Detections to view alerts and reports on risky user behavior.

- [Configure Azure Defender for Storage](azure-defender-storage-configure.md)
 

- [Understand Azure AD risk detections](../../active-directory/identity-protection/overview-identity-protection.md)
 

- [How to configure action groups for custom alerting and notification](../../azure-monitor/alerts/action-groups.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access named locations to allow access from only specific logical groupings of IP address ranges or countries/regions. 

- [How to configure named locations in Azure](../../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure provides Azure role-based access control (Azure RBAC) for fine-grained control over a client's access to resources in a storage account.   Use Azure AD credentials when possible as a security best practice, rather than using the account key, which can be more easily compromised. When your application design requires shared access signatures for access to Blob storage, use Azure AD credentials to create a user delegation shared access signatures (SAS) when possible for superior security.

- [How to create and configure an Azure AD instance](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md) 

- [Use the Azure Storage resource provider to access management resources](authorization-resource-provider.md)

- [How to configure access to  Azure Blob and Queue data with Azure RBAC in Azure portal](storage-auth-aad-rbac-portal.md)

- [Authorizing access to data in Azure Storage](storage-auth.md)

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Review the Azure Active Directory (Azure AD) logs to help discover stale accounts which can include those with Storage account administrative roles. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications that may be used to access Storage account resources, and role assignments. User access should be reviewed on a regular basis to make sure only the right Users have continued access. 
 

 
You can also use shared access signature (SAS) to provide secure delegated access to resources in your storage account without compromising the security of your data. You can control what resources the client may access, what permissions they have on those resources, and how long the SAS is valid, among other parameters.
 

 
Also, review anonymous read access to containers and blobs. By default, a container and any blobs within it may be accessed only by a user that has been given appropriate permissions. You can use Azure Monitor to alert on anonymous access for Storage accounts using anonymous authentication condition.
 

 
One effective way to reduce the risk of unsuspected user account access is to limit the duration of access that you grant to users. Time-limited SAS URIs are one effective way to automatically expire user access to a Storage account. Additionally, rotating Storage Account Keys on a frequent basis is a way to ensure that unexpected access via Storage Account keys is of limited duration.
 

 
- [Understand Azure AD Reporting](/azure/active-directory/reports-monitoring/) 
 

 
- [How to view and change access at the Azure Storage account level](storage-auth-aad-rbac-portal.md)
 

 
- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
 

 
- [Manage anonymous read access to containers and blobs](../blobs/anonymous-read-access-configure.md)
 

 
- [Monitor a storage account in the Azure portal](manage-storage-analytics-logs.md)
 

 
- [Manage storage account access keys](storage-account-keys-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Use Storage Analytics to logs detailed information about successful and failed requests to a storage service. All logs are stored in block blobs in a container named $logs, which are automatically created when Storage Analytics is enabled for a storage account.
 

Create Diagnostic Settings for Azure Active Directory (Azure AD) user accounts, sending the audit logs and sign-in logs to a Log Analytics Workspace. You can configure desired Alerts within Log Analytics Workspace.

To monitor authentication failures against Azure Storage Accounts, you can create alerts to notify you when certain thresholds have been reached for storage resource metrics. Additionally, use Azure Monitor to alert on anonymous access for Storage accounts using anonymous authentication condition.

- [Azure Storage analytics logging](storage-analytics-logging.md)
 

- [How to integrate Azure Activity Logs into Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)
 

- [How to configure metrics alerts for Azure Storage Accounts](manage-storage-analytics-logs.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD)'s Risk and Identity Protection features to configure automated responses to detected suspicious actions related to your Storage account resources. You should enable automated responses through Azure Sentinel to implement your organization's security responses.

- [How to view Azure AD risky sign-ins](../../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: In support scenarios where Microsoft needs to access customer data, Customer Lockbox (Preview for Storage account) provides an interface for customers to review and approve or reject customer data access requests. Microsoft will not require, nor request access to your organization's secrets stored within Storage account.

- [Understand Customer Lockbox](../../security/fundamentals/customer-lockbox-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Storage account resources that store or process sensitive information. 

- [How to create and use Tags](../../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement isolation using separate subscriptions, management groups, and storage accounts for individual security domains such as environment, and data sensitivity.  You can restrict your Storage Account to control the level of access to your storage accounts that your applications and enterprise environments demand, based on the type and subset of networks used. When network rules are configured, only applications requesting data over the specified set of networks can access a storage account. You can control access to Azure Storage via Azure RBAC (Azure RBAC).

You can also configure Private Endpoints to improve security as traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet.

- [How to create additional Azure subscriptions](../../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../../azure-resource-manager/management/tag-resources.md)

- [Configure Azure Storage firewalls and virtual networks](storage-network-security.md)

- [Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: For Storage account resources storing or processing sensitive information, mark the resources as sensitive using Tags. To reduce the risk of data loss via exfiltration, restrict outbound network traffic for Azure Storage accounts using Azure Firewall.  

Additionally, use Virtual network service endpoint policies to filter egress virtual network traffic to Azure Storage accounts over service endpoint, and allow data exfiltration to only specific Azure Storage accounts.

- [Configure Azure Storage firewalls and virtual networks](../../virtual-network/virtual-network-service-endpoint-policies-overview.md)

- [Virtual network service endpoint policies for Azure Storage](../../private-link/tutorial-private-endpoint-storage-portal.md)

- [Understand customer data protection in Azure](../../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: You can enforce the use of HTTPS by enabling Secure transfer required for the storage account. Connections using HTTP will be refused once this is enabled.  Additionally, use Azure Security Center and Azure Policy to enforce Secure transfer for your storage account.

- [How to require secure transfer in Azure Storage](storage-require-secure-transfer.md)

- [Azure security policies monitored by Security Center](../../security-center/policy-reference.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Storage**:

[!INCLUDE [Resource Policy for Microsoft.Storage 4.4](../../../includes/policy/standards/asb/rp-controls/microsoft.storage-4-4.md)]

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification features are not yet available for Azure Storage account and related resources. Implement third-party solution if required for compliance purposes. 

- [Understand customer data protection in Azure](../../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Azure Active Directory (Azure AD) authorizes access rights to secured resources through Azure role-based access control (Azure RBAC). Azure Storage defines a set of Azure built-in RBAC roles that encompass common sets of permissions used to access blob or queue data.

- [How to assign Azure RBAC roles for Azure Storage account](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac-portal#assign-azure-roles-using-the-azure-portal)

- [Use the Azure Storage resource provider to access management resources](authorization-resource-provider.md)

- [How to configure access to Azure Blob and Queue data with Azure RBAC in Azure portal](storage-auth-aad-rbac-portal.md)

- [How to create and configure an Azure AD instance](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

- [Authorizing access to data in Azure Storage](storage-auth.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Azure Storage encryption is enabled for all storage accounts and cannot be disabled. Azure Storage automatically encrypts your data when it is persisted to the cloud. When you read data from Azure Storage, it is decrypted by Azure Storage before being returned. Azure Storage encryption enables you to secure your data at rest without having to modify code or add code to any applications. 

- [Understanding Azure Storage encryption at rest](storage-service-encryption.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to Storage account resources.  You can also enable Azure Storage logging to track how each request made against Azure Storage was authorized. The logs indicate whether a request was made anonymously, by using an OAuth 2.0 token, by using Shared Key, or by using a shared access signature (SAS).  Additionally, use Azure Monitor to alert on anonymous access for Storage accounts using anonymous authentication condition. 

 
- [How to create alerts for Azure Activity Log events](../../azure-monitor/alerts/alerts-activity-log.md) 

 
- [Azure Storage analytics logging](storage-analytics-logging.md) 

 
- [How to configure metrics alerts for Azure Storage Accounts](manage-storage-analytics-logs.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Follow recommendations from Azure Security Center to continuously audit and monitor the configuration of your storage accounts.  

- [Security recommendations - a reference guide](../../security-center/recommendations-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Storage accounts.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center. 

- [Understand Azure Security Center Secure Score](/azure/security-center/security-center-secure-score)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Storage accounts) within your subscription(s). Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [How to create queries with Azure Graph](../../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Storage account resources giving metadata to logically organize them into a taxonomy. 

- [How to create and use Tags](../../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Storage accounts and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner. 

Also, use Azure Defender for Storage to detect unauthorized Azure Resources. 

- [How to create additional Azure subscriptions](../../cost-management-billing/manage/create-subscription.md) 

- [How to create Management Groups](../../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../../azure-resource-manager/management/tag-resources.md)

- [Configure Azure Defender for Storage](azure-defender-storage-configure.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: You will need to create an inventory of approved Azure resources as per your organizational needs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions: 

 
 - Not allowed resource types 
 
 - Allowed resource types 
 

 
In addition, use the Azure Resource Graph to query for and discover resources within the subscriptions. This can help in high security-based environments, such as those with Storage accounts. 
 

 
- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md) 
 

 
- [How to create queries with Azure Graph](../../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Customer may prevent resource creation or usage with Azure Policy as required by the customer's company policies. 

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types
- Allowed resource types

Additional information is available at the referenced links.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicStorage**:

[!INCLUDE [Resource Policy for Microsoft.ClassicStorage 6.9](../../../includes/policy/standards/asb/rp-controls/microsoft.classicstorage-6-9.md)]

**Azure Policy built-in definitions - Microsoft.Storage**:

[!INCLUDE [Resource Policy for Microsoft.Storage 6.9](../../../includes/policy/standards/asb/rp-controls/microsoft.storage-6-9.md)]

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use the Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App. This can prevent the creation and changes to resources within a high security environment, such as those with Storage accounts. 

- [How to configure Conditional Access to block access to Azure Resource Manager](../../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the **Microsoft.Storage** namespace to create custom policies to audit or enforce the configuration of your Storage account instances. You may also use built-in Azure Policy definitions for Azure Storage account such as:

- Audit unrestricted network access to storage accounts
- Deploy Azure Defender for Storage
- Storage accounts should be migrated to new Azure Resource Manager resources
- Secure transfer to storage accounts should be enabled

Use recommendations from Azure Security Center as a secure configuration baseline for your Storage accounts.

- [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias)

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your storage account resources. 

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md) 

- [Understanding Azure Policy Effects](../../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: Use Azure Repos to securely store and manage your code like custom Azure policies, Azure Resource Manager templates, Desired State Configuration scripts etc. To access the resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Azure AD if integrated with TFS.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Leverage Azure Policy to alert, audit, and enforce system configurations for Storage account. Additionally, develop a process and pipeline for managing policy exceptions. 

- [ How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Leverage Azure Security Center to perform baseline scans for your Azure Storage account resources. 

- [How to remediate recommendations in Azure Security Center](../../security-center/security-center-remediate-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Azure Storage automatically encrypts your data when it is persisted it to the cloud. You can use Microsoft-managed keys for the encryption of the storage account, or can manage encryption with their own keys. If you are using customer-provided keys, you can leverage Azure Key Vault to securely store the keys. 

Additionally, rotate Storage Account Keys on a frequent basis to limit the impact of  loss or disclosure of Storage Account keys.

- [Azure Storage encryption for data at rest](storage-service-encryption.md)

- [Manage storage account access keys](storage-account-keys-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Authorize access to blobs and queues within Azure Storage Accounts with Azure Active Directory (Azure AD) and Managed Identities. Azure Blob and Queue storage support Azure AD authentication with managed identities for Azure resources. 

Managed identities for Azure resources can authorize access to blob and queue data using Azure AD credentials from applications running in Azure Virtual Machines r, function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.

- [How to grant access to Azure blob and queue data using a managed identity](storage-auth-aad-rbac-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [ How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../../security/benchmarks/security-control-malware-defense.md).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Use Azure Defender for Storage for detecting malware uploads to Azure Storage using hash reputation analysis and suspicious access from an active Tor exit node (an anonymizing proxy). 
 

 
You can also pre-scan any content for malware before uploading to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, and others to meet your organizations requirements.
 

 
- [Configure Azure Defender for Storage](azure-defender-storage-configure.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: The data in your Microsoft Azure storage account is always automatically replicated to ensure durability and high availability. Azure Storage copies your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. You can choose to replicate your data within the same data center, across zonal data centers within the same region, or across geographically separated regions. 

You can also enable Azure automation to take regular snapshots of the blobs.

- [Understanding Azure Storage redundancy and Service-Level Agreements](storage-redundancy.md)

- [Create a snapshot of a blob](/rest/api/storageservices/creating-a-snapshot-of-a-blob)

- [Azure Automation overview](../../automation/automation-intro.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: In order to back up data from Storage account supported services, there are multiple methods available including using azcopy or third-party tools. Immutable storage for Azure Blob storage enables users to store business-critical data objects in a WORM (Write Once, Read Many) state. This state makes the data non-erasable and non-modifiable for a user-specified interval.
 

Customer-managed/provided keys can be backed within Azure Key Vault using Azure CLI or PowerShell. 

 
- [Get started with AzCopy](storage-use-azcopy-v10.md)  

- [Set and manage immutability policies for Blob storage](../blobs/storage-blob-immutability-policies-manage.md)
 

 
- [How to backup key vault keys in Azure](/powershell/module/az.keyvault/backup-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Periodically perform data restoration of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands:

Restore-AzKeyVaultCertificate

Restore-AzKeyVaultKey

Restore-AzKeyVaultManagedStorageAccount

Restore-AzKeyVaultSecret

- [How to restore Key Vault Certificates](/powershell/module/az.keyvault/restore-azkeyvaultcertificate)

- [How to restore Key Vault Keys](/powershell/module/az.keyvault/restore-azkeyvaultkey)

- [How to restore Key Vault Managed Storage Accounts](/powershell/module/az.keyvault/backup-azkeyvaultmanagedstorageaccount)

- [How to restore Key Vault Secrets](/powershell/module/az.keyvault/restore-azkeyvaultsecret)

- [AzCopy is a command-line utility that you can use to copy blobs, files and table data to or from a storage account](storage-use-azcopy-v10.md)

Note: If you want to copy data to and from your Azure Table storage service, then install AzCopy version 7.3.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: To enable customer-managed keys on a storage account, you must use an Azure Key Vault to store your keys. You must enable both the Soft Delete and Do Not Purge properties on the key vault.  Key Vault's Soft Delete feature allows recovery of deleted vaults and vault objects such as keys, secrets, and certificates.  If backing Storage account data to Azure Storage blobs, enable soft delete to save and recover your data when blobs or blob snapshots are deleted.  You should treat your backups as sensitive data and apply the relevant access and data protection controls as part of this baseline.  Additionally, for improved protection, you may store business-critical data objects in a WORM (Write Once, Read Many) state.

- [How to use Azure Key Vault's Soft Delete](../../key-vault/general/key-vault-recovery.md)

- [Soft delete for Azure Storage blobs](../blobs/soft-delete-blob-overview.md)

- [Store business-critical blob data with immutable storage](../blobs/storage-blob-immutable-storage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

- [NIST's Computer Security Incident Handling Guide](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. 

 
Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.
 

 
- [Security alerts in Azure Security Center](../../security-center/security-center-alerts-overview.md)
 

 
- [Use tags to organize your Azure resources](../../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

- [NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.
	

- [	How to configure Workflow Automation and Logic Apps](../../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
