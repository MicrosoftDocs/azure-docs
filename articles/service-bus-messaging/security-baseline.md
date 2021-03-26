---
title: Azure security baseline for Service Bus
description: The Service Bus security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: service-bus-messaging
ms.topic: conceptual
ms.date: 03/26/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Service Bus

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview-v1) to Service Bus. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Service Bus. **Controls** not applicable to Service Bus, or for which the responsibility is Microsoft's, have been excluded.

To see how Service Bus completely maps to the Azure Security Benchmark, see the [full Service Bus security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: The integration of Service Bus with the Azure Private Link service enables secure private access to messaging capabilities from workloads such as virtual machines that are bound to virtual networks. Create a private endpoint connection to your Service Bus namespace. The private endpoint uses a private IP address from your virtual network, effectively bringing the service into your virtual network. All traffic to the service can be routed through that private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed.

You can also secure your Azure Service Bus namespace by using firewalls. Azure Service Bus supports IP-based access controls for inbound firewall support. You can set firewall rules by using the Azure portal, Azure Resource Manager templates, or through the Azure CLI or Azure PowerShell.

- [Allow access to Azure Service Bus namespaces via private endpoints](https://docs.microsoft.com/azure/service-bus-messaging/private-link-service)

- [Allow access to Azure Service Bus namespace from specific IP addresses or ranges](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-ip-filtering)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ServiceBus**:

[!INCLUDE [Resource Policy for Microsoft.ServiceBus 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.servicebus-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: If using Azure virtual machines to access your Service Bus entities, enable network security group (NSG) flow logs and send logs into a storage account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations. 

Use Azure Security Center and follow network protection recommendations to help secure your Service Bus resources in Azure.

- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

- [How to enable Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create)

- [Understanding Network Security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Enable DDoS Protection Standard on the virtual networks associated with your Service Bus namespaces to guard against distributed denial-of-service (DDoS) attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to configure DDoS protection](https://docs.microsoft.com/azure/ddos-protection/manage-ddos-protection)

- [Azure Security Center Integrated Threat Intelligence](https://docs.microsoft.com/azure/security-center/azure-defender)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: If using Azure virtual machines to access your Service Bus entities, you can use Network Watcher packet capture to investigate anomalous activities.

- [How to enable Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: If using Azure virtual machines to access your Service Bus entities, select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities. If intrusion detection and/or prevention based on payload inspection is not required for your organization, you may use Azure Service Bus's built-in firewall feature. You can limit access to your Service Bus namespace for a limited range of IP addresses, or a specific IP address by using Firewall rules.

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

- [How to add a firewall rule in Service Bus namespaces for a specified IP address](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-ip-filtering)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network Service Tags to define network access controls on Network Security Groups or Azure Firewalls which filter traffic to and from Service Bus resources. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ServiceBus) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. 

- [Understand and use Service Tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Service Bus namespaces with Azure Policy. Use Azure Policy aliases in the "Microsoft.ServiceBus" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Service Bus namespaces. You may also make use of built-in policy definitions related to Azure Service Bus, such as:

- Service Bus should use a virtual network service endpoint
- Diagnostic logs in Service Bus should be enabled

You may also construct custom policy definitions if the built-in definitions do not fit your organization's needs.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Built-in Policy for Service Bus namespace](https://docs.microsoft.com/azure/service-bus-messaging/policy-reference#azure-service-bus-messaging)

- [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#network)

- [How to create an Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for virtual networks and other resources related to network security and traffic flow that are associated with your Service Bus namespaces. For individual network security group rules, use the "Description" field to specify business need, duration, and other descriptive information for any rules that allow traffic to or from a network associated with your Service Bus namespaces. 

Use any of the built-in Azure policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources. 

You may use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their Tags. 

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

- [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal) 

- [How to create an NSG with a Security Config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to Azure Service Bus. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/essentials/activity-log#view-the-activity-log)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/alerts/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.2: Configure central security log management

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by Service Bus resources. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, configure Azure Storage accounts for long term or archival storage. You can also configure logs related to Service Bus to be sent to Azure Sentinel or a third-party SIEM.

- [How to configure Diagnostic Settings for Azure Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-diagnostic-logs)

- [Understanding Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/essentials/platform-logs-overview)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard) 

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Diagnostic settings for your Azure Service Bus namespace. Azure Service Bus currently supports activity and operational or diagnostic logs. Activity logs have information about operations done on a job. Diagnostic logs provide richer information about operations and actions that are done against your namespace by using API, or through management clients using the language SDK. Specifically, these logs capture the operation type, including queue creation, resources used, and the status of the operation.

- [How to enable Diagnostic Settings for Azure Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-diagnostic-logs)

- [How to enable Diagnostic Settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/essentials/activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ServiceBus**:

[!INCLUDE [Resource Policy for Microsoft.ServiceBus 2.3](../../includes/policy/standards/asb/rp-controls/microsoft.servicebus-2-3.md)]

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, set your Log Analytics workspace retention period according to your organization's compliance regulations to capture and review Service Bus-related incidents.

- [How to set log retention parameters for Log Analytics workspaces](https://docs.microsoft.com/azure/azure-monitor/logs/manage-cost-storage#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results related to your Service Bus entities. Use Azure Monitor to review logs and perform queries on log data related to Service Bus.

- [For more information about the Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/logs/log-analytics-tutorial)

- [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/logs/get-started-queries)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Azure Security Center with Log Analytics workspace for monitoring and alerting on anomalous activity found in security logs and events. Alternatively, you can also enable and on-board data to Azure Sentinel.

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

- [How to manage alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts)

- [How to alert on log analytics log data](https://docs.microsoft.com/azure/azure-monitor/alerts/tutorial-response)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure role-based access control (Azure RBAC) allows you to manage access to Azure resources through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for Service Bus, these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal.

- [Built-in roles for Azure Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/authenticate-application#azure-built-in-roles-for-azure-service-bus)

- [How to get a directory role in Azure Active Directory (Azure AD) with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Control plane access to Service Bus is controlled through Azure Active Directory (Azure AD). Azure AD does not have the concept of default passwords.

Data plane access to Service Bus is controlled through Azure AD by using Managed Identities, App registrations, or shared access signatures. Shared access signatures are used by the clients connecting to your Service Bus namespace and can be regenerated at any time.

- [Understand shared access signatures for Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-sas)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:

- There should be more than one owner assigned to your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription

You may also construct custom policy definitions if the built-in definitions do not fit your organization's needs.

- [How to use Azure Security Center to monitor identity and access](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

- [How to use Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Microsoft Azure provides integrated access control management for resources and applications based on Azure Active Directory (Azure AD). A key advantage of using Azure AD with Azure Service Bus is that you don't need to store your credentials in the code anymore. Instead, you can request an OAuth 2.0 access token from the Microsoft Identity platform. The resource name to request a token is https://azure.microsoft.com/services/service-bus/. Azure AD authenticates the security principal (a user, group, or service principal) running the application. If the authentication succeeds, Azure AD returns an access token to the application, and the application can then use the access token to authorize request to Azure Service Bus resources.

- [How to authenticate an application with Azure AD to access Service Bus resources](https://docs.microsoft.com/azure/service-bus-messaging/authenticate-application)

- [Understanding SSO with Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and access management recommendations to help protect your Service Bus-enabled resources.

- [How to enable multifactor authentication in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

- [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use privileged access workstations (PAW) with multifactor authentication configured to log into and configure Service Bus-enabled resources.

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports and monitoring to detect when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection)

- [How to monitor users' identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Azure Active Directory (Azure AD) named locations to allow access only from specific logical groupings of IP address ranges or countries/regions.

- [How to configure Azure AD named locations](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for Azure resources such as Service Bus. This allows for Azure role-based access control (Azure RBAC) to administrative sensitive resources.

- [How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

- [Authorize access to Service Bus resources using Azure AD](https://docs.microsoft.com/azure/service-bus-messaging/authenticate-application)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

In additional, regularly rotate your Service Bus namespace's shared access signature.

- [Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

- [Understanding shared access signatures for Service Bus namespace](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-sas)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: You have access to Azure Active Directory (Azure AD) sign-in activity, audit and risk event log sources, which allow you to integrate with Azure Sentinel or a third-party SIEM tool.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. Then in Azure Monitor you can configure desired log alerts for certain actions that occur in the logs.

- [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

- [Authorize access to Service Bus resources using Azure AD](https://docs.microsoft.com/azure/service-bus-messaging/authenticate-application)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD)'s Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to your Service Bus-enabled resources. You should enable automated responses through Azure Sentinel to implement your organization's security responses.

- [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection)

- [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Currently not available; Customer Lockbox is not yet supported for Service Bus.

- [List of Customer Lockbox-supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags on resources related to your Service Bus to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and management groups for development, test, and production. Service Bus namespaces should be separated by virtual networks with private endpoints configured and tagged appropriately.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/cost-management-billing/manage/create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create-management-group-portal)

- [How to create and utilize tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

- [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: When using virtual machines to access your Service Bus entities, make use of virtual networks, private endpoints, Service Bus firewall, network security groups, and service tags to mitigate the possibility of data exfiltration.

Microsoft manages the underlying infrastructure for Azure Service Bus and has implemented strict controls to prevent the loss or exposure of customer data.

- [Configure IP firewall rules for Azure Service Bus namespaces](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-ip-filtering)

- [Allow access to Azure Service Bus namespace from specific virtual networks](https://docs.microsoft.com/azure/service-bus-messaging/private-link-service)

- [Allow access to Azure Service Bus namespaces via private endpoints](https://docs.microsoft.com/azure/service-bus-messaging/private-link-service)

- [Understand Network Security Groups and Service Tags](https://docs.microsoft.com/azure/virtual-network/network-security-groups-overview)

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Azure Service Bus enforces TLS-encrypted communications by default. TLS versions 1.0, 1.1 and 1.2 are currently supported. However, TLS 1.0 and 1.1 are on a path to deprecation industry-wide, so use TLS 1.2 or newer where possible.

- [To understand security features of Service Bus, see Network security](https://docs.microsoft.com/azure/service-bus-messaging/network-security)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Service Bus. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Azure Service Bus supports using Azure Active Directory (Azure AD) to authorize requests to Service Bus entities. With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, or an application service principal.

- [Understand Azure RBAC and available roles for Azure Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/authenticate-application)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Azure Service Bus supports the option of encrypting data at rest with either Microsoft-managed keys or customer-managed keys. This feature enables you to create, rotate, disable, and revoke access to the customer-managed keys that are used for encrypting Azure Service Bus data at rest.

- [How to configure customer-managed keys for encrypting Azure Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/configure-customer-managed-key)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production instances of Azure Service Bus and other critical or related resources.

- [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/alerts/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Azure Service Bus namespaces) within your subscriptions. Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Service Bus namespaces and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/cost-management-billing/manage/create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create-management-group-portal)

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

In addition, use Azure Resource Graph to query and discover resources within the subscriptions.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types
- Allowed resource types

You may also construct custom policy definitions if the built-in definitions do not fit your organization's needs.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/index)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Azure Service Bus deployments. You may also make use of built-in policy definitions for Azure Service Bus such as:
- Diagnostic logs in Service Bus should be enabled
- Service Bus should use a virtual network service endpoint to limit network traffic to your private networks.

Use Azure Policy aliases in the "Microsoft.ServiceBus" namespace to create custom policies to audit or enforce configurations.

- [Azure Built-in policies for Service Bus ](https://docs.microsoft.com/azure/service-bus-messaging/policy-reference)

- [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Service Bus-enabled resources or applications.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [For more information about the Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.ServiceBus" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.ServiceBus" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure Service Bus deployments and related resources.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your Service Bus entities, use a Managed Service Identity in conjunction with Azure Key Vault to simplify and secure shared access signature management for your Azure Service Bus deployments. Ensure Key Vault soft-delete is enabled.

- [Authenticate a managed identity with Azure Active Directory (Azure AD) to access Service Bus resources](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-managed-service-identity)

- [Configure customer-managed keys for Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/configure-customer-managed-key)

- [How to create a Key Vault](https://docs.microsoft.com/azure/key-vault/general/quick-create-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your Service Bus entities, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure Azure Service Bus. Ensure Key Vault soft-delete is enabled.

Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Azure Key Vault, without any credentials in your code.

- [Authenticate a managed identity with Azure AD to access Service Bus Resources](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-managed-service-identity)

- [Configure customer-managed keys for Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/configure-customer-managed-key)

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

**Guidance**: Pre-scan any content being uploaded to non-compute Azure resources, such as Azure Service Bus, App Service, Data Lake Storage, Blob Storage, Azure Database for PostgreSQL, etc. Microsoft cannot access your data in these instances.

Microsoft anti-malware is enabled on the underlying host that supports Azure services, however it does not run on customer content.

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Configure geo-disaster recovery for Azure Service Bus. When entire Azure regions or datacenters (if no availability zones are used) experience downtime, it is critical for data processing to continue to operate in a different region or datacenter. As such, Geo-disaster recovery and Geo-replication are important features for any enterprise. Azure Service Bus supports both geo-disaster recovery and geo-replication, at the namespace level.

- [Understand geo-disaster recovery for Azure Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-geo-dr)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Azure Service Bus provides encryption of data at rest with Azure Storage Service Encryption (Azure SSE). Service Bus relies on Azure Storage to store the data and by default, all the data that is stored with Azure Storage is encrypted using Microsoft-managed keys. If you use Azure Key Vault for storing customer-managed keys, ensure regular automated backups of your Keys.

Ensure regular automated backups of your Key Vault Secrets with the following PowerShell command: Backup-AzKeyVaultSecret

- [How to configure customer-managed keys for encrypting Azure Service Bus data at rest](https://docs.microsoft.com/azure/service-bus-messaging/configure-customer-managed-key)

- [How to backup Key Vault Secrets](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultsecret)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Test restoration of backed up customer-managed keys use to encrypt Service Bus data.

- [How to configure customer-managed keys for encrypting Azure Service Bus data at rest](https://docs.microsoft.com/azure/service-bus-messaging/configure-customer-managed-key)

- [How to restore key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/restore-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Enable soft-delete in Key Vault to protect keys against accidental or malicious deletion. Azure Service Bus requires customer-managed keys to have Soft Delete and Do Not Purge configured.

- [How to enable soft-delete in Key Vault](https://docs.microsoft.com/azure/storage/blobs/soft-delete-blob-overview)

- [Set up a key vault with keys](https://docs.microsoft.com/azure/event-hubs/configure-customer-managed-key)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Develop an incident response guide for your organization. Ensure there are written incident response plans that define all the roles of personnel as well as the phases of incident handling and management from detection to post-incident review. 

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/) 

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/) 

- [Use NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data. It's your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred. 

- [Security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-overview) 

- [Use tags to organize your Azure resources](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved. 

- [How to set the Azure Security Center security contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the continuous export feature to help identify risks to Azure resources. Continuous export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You can use the Azure Security Center data connector to stream the alerts to Azure Sentinel. 

- [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export) 

- [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use workflow automation feature Azure Security Center to automatically trigger responses to security alerts and recommendations to protect your Azure resources. 

- [How to configure workflow automation in Security Center](https://docs.microsoft.com/azure/security-center/workflow-automation)

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
