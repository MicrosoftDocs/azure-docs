---
title: Azure security baseline for Event Hubs
description: The Event Hubs security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: event-hubs
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Event Hubs

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to Event Hubs. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Event Hubs. **Controls** not applicable to Event Hubs have been excluded.

 
To see how Event Hubs completely maps to the Azure
Security Benchmark, see the [full Event Hubs security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: The integration of Azure Event Hubs with virtual network service endpoints enables secure access to messaging capabilities from workloads such as virtual machines that are bound to virtual networks, with the network traffic path being secured on both ends.

Once bound to at least one virtual network subnet service endpoint, the respective Event Hubs namespace no longer accepts traffic from anywhere but authorized subnets in virtual networks. From the virtual network perspective, binding your Event Hubs namespace to a service endpoint configures an isolated networking tunnel from the virtual network subnet to the messaging service. 

You can also create a private endpoint, which is a network interface that connects you privately and securely to Event Hubs service by using the Azure Private Link service. The private endpoint uses a private IP address from your virtual network, effectively bringing the service into your virtual network. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed. 

You can also secure your Azure Event Hubs namespace by using firewalls. Event Hubs supports IP-based access controls for inbound firewall support. You can set firewall rules by using the Azure portal, Azure Resource Manager templates, or through the Azure CLI or Azure PowerShell.

- [How to use virtual network service endpoints with Azure Event Hubs](event-hubs-service-endpoints.md)

- [Integrate Azure Event Hubs with Azure Private Link](private-link-service.md)

- [How to configure IP firewall rules for Azure Event Hubs namespaces](event-hubs-ip-filtering.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.EventHub**:

[!INCLUDE [Resource Policy for Microsoft.EventHub 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.eventhub-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure your Event Hubs resources in Azure. If using Azure virtual machines to access your event hubs, enable network security group flow logs and send logs into a storage account for traffic audit.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [Understanding Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Enable DDoS Protection Standard on the virtual networks associated with your event hubs to guard against distributed denial-of-service (DDoS) attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

- [For more information about the Azure Security Center Integrated Threat Intelligence](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: If using Azure virtual machines to access your event hubs, enable network security group flow logs and send logs into a storage account for traffic audit. You may also send network security group flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

If required for investigating anomalous activity, enable Network Watcher packet capture.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

- [How to enable Network Watcher](../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: If using Azure virtual machines to access your event hubs, select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities. If intrusion detection and/or prevention based on payload inspection is not required for your organization, you may use Azure Event Hubs' built-in firewall feature. You can limit access to your Event Hubs namespace for a limited range of IP addresses, or a specific IP address by using Firewall rules.

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

- [How to add a firewall rule in Event Hubs for a specified IP address](event-hubs-ip-filtering.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Event Hubs namespaces with Azure Policy. Use Azure Policy aliases in the **Microsoft.EventHub** and **Microsoft.Network** namespaces to create custom policy definitions to audit or enforce the network configuration of your Event Hubs namespaces. You can also make use of built-in policy definitions related to Azure Event Hubs, such as:

- Event Hub should use a virtual network service endpoint.

Additional information is available at the referenced links.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Built-in Policy for Event Hubs namespace](../governance/policy/samples/built-in-policies.md#event-hub)

- [Azure Policy samples for networking](../governance/policy/samples/built-in-policies.md#network)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for virtual networks and other resources related to network security and traffic flow that are associated with your event hubs.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to Azure Event Hubs. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Within Azure Monitor, configure logs related to event hubs within the Activity Log and Event Hub diagnostic settings to send logs into a Log Analytics workspace to be queried or into a storage account for long-term archival storage.

- [How to configure Diagnostic Settings for Azure Event Hubs](event-hubs-diagnostic-logs.md)

- [Understanding Azure Activity Log](../azure-monitor/essentials/platform-logs-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Diagnostic settings for your Azure Event Hubs namespace. There are three categories of Diagnostic settings for Azure Event Hubs: Archive Logs, Operational Logs, and AutoScale Logs. Enable Operational Logs to capture information about what is happening during Event Hubs operations, specifically, the operation type, including event hub creation, resources used, and the status of the operation.

Additionally, you may enable Azure Activity log diagnostic settings and send them to an Azure Storage Account, event hub, or a Log Analytics workspace. Activity logs provide insight into the operations that were performed on your Azure Event Hubs and other resources. Using activity logs, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) taken on your Azure Event Hubs namespaces.

- [How to enable Diagnostic Settings for Azure Event Hubs](event-hubs-diagnostic-logs.md)

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.EventHub**:

[!INCLUDE [Resource Policy for Microsoft.EventHub 2.3](../../includes/policy/standards/asb/rp-controls/microsoft.eventhub-2-3.md)]

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, set your Log Analytics workspace retention period according to your organization's compliance regulations to capture and review event hub-related incidents.

- [How to set log retention parameters for Log Analytics workspaces](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results related to your event hubs. Use Azure Monitor's Log Analytics to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third-party system information and event management solution.

- [For more information about the Log Analytics workspace](../azure-monitor/logs/log-analytics-tutorial.md)

- [How to perform custom queries in Azure Monitor](../azure-monitor/logs/get-started-queries.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Within Azure Monitor, configure logs related to Azure Event Hubs within the Activity Log, and Event Hubs diagnostic settings to send logs into a Log Analytics workspace to be queried or into a storage account for long-term archival storage. Use Log Analytics workspace to create alerts for anomalous activity found in security logs and events.

Alternatively, you may enable and on-board data to Azure Sentinel. 

- [Understand the Azure Activity Log](../azure-monitor/essentials/platform-logs-overview.md)

- [How to configure Diagnostic Settings for Azure Event Hubs](event-hubs-diagnostic-logs.md)

- [How to alert on Log Analytics workspace log data](../azure-monitor/alerts/tutorial-response.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Control plane access to Event Hubs is controlled through Azure Active Directory (Azure AD). Azure AD does not have the concept of default passwords.

Data plane access to Event Hubs is controlled through Azure AD with Managed Identities or App registrations as well as shared access signatures. Shared access signatures are used by the clients connecting to your event hubs and can be regenerated at any time.

- [Understand shared access signatures for Event Hubs](authenticate-shared-access-signature.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:

- There should be more than one owner assigned to your subscription

- Deprecated accounts with owner permissions should be removed from your subscription

- External accounts with owner permissions should be removed from your subscription

Additional information is available at the referenced links.

- [How to use Azure Security Center to monitor identity and access (Preview)](../security-center/security-center-identity-access.md)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Microsoft Azure provides integrated access control management for resources and applications based on Azure Active Directory (Azure AD). A key advantage of using Azure AD with Azure Event Hubs is that you don't need to store your credentials in the code anymore. Instead, you can request an OAuth 2.0 access token from the Microsoft Identity platform. The resource name to request a token is https:\//eventhubs.azure.net/. Azure AD authenticates the security principal (a user, group, or service principal) running the application. If the authentication succeeds, Azure AD returns an access token to the application, and the application can then use the access token to authorize request to Azure Event Hubs resources.

- [How to authenticate an application with Azure AD to access Event Hubs resources](authenticate-application.md)

- [Understanding SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and access management recommendations to help protect your Event Hub-enabled resources.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use privileged access workstations (PAW) with multifactor authentication configured to log into and configure Event Hub-enabled resources.

- [Learn about Privileged Access Workstations](/security/compass/privileged-access-devices)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) Privileged Identity Management for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure AD risk detections to view alerts and reports on risky user behavior. For additional logging, send Azure Security Center risk detection alerts into Azure Monitor and configure custom alerting/notifications using action groups.

- [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure action groups for custom alerting and notification](../azure-monitor/alerts/action-groups.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for Azure resources such as Event Hubs. This allows for Azure role-based access control (Azure RBAC) to administrative sensitive resources.

- [ How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

- [Authorize access to Event Hubs resources using Azure AD](authorize-access-azure-active-directory.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

In addition, regularly rotate your Event Hubs' shared access signatures.

- [Understand Azure AD reporting](../active-directory/reports-monitoring/index.yml)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

- [Understanding shared access signatures for Event Hubs](authenticate-shared-access-signature.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: You have access to Azure Active Directory (Azure AD) sign-in activity, audit and risk event log sources, which allow you to integrate with any third-party system information and event management solution or a Monitoring tool.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired log alerts within Log Analytics.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [Authorize access to Event Hubs resources using Azure AD](authorize-access-azure-active-directory.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Identity Protection and risk detection features within Azure Active Directory (Azure AD) to configure automated responses to detected suspicious actions related to your Event Hubs-enabled resources. You should enable automated responses through Azure Sentinel to implement your organization's security responses.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Currently not available; Customer Lockbox is not yet supported for Event Hubs.

- [List of Customer Lockbox-supported services](../security/fundamentals/customer-lockbox-overview.md#supported-services-and-scenarios-in-general-availability)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags on resources related to your Event Hubs to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions, optionally with management groups for development, test, and production. Event Hubs namespaces should be separated by virtual network with service endpoints enabled and tagged appropriately.

You may also secure your Azure Event Hubs namespace by using firewalls. Azure Event Hubs supports IP-based access controls for inbound firewall support. You can set firewall rules by using the Azure portal, Azure Resource Manager templates, or through the Azure CLI or Azure PowerShell.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [Configure IP firewall rules for Azure Event Hubs namespaces](event-hubs-ip-filtering.md)

- [How to create and utilize tags](../azure-resource-manager/management/tag-resources.md)

- [How to create a Virtual Network](../virtual-network/quick-create-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: When using virtual machines to access your event hubs, make use of virtual networks, service endpoints, Event Hubs firewall, network security groups, and service tags to mitigate the possibility of data exfiltration.

Microsoft manages the underlying infrastructure for Azure Event Hubs and has implemented strict controls to prevent the loss or exposure of customer data.

- [Configure IP firewall rules for Azure Event Hubs namespaces](event-hubs-ip-filtering.md)

- [Understand Virtual Network Service Endpoints with Azure Event Hubs](event-hubs-service-endpoints.md)

- [Integrate Azure Event Hubs with Azure Private Link](private-link-service.md)

- [Understand Network Security Groups and Service Tags](../virtual-network/network-security-groups-overview.md)

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Event Hubs. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Azure Event Hubs supports using Azure Active Directory (Azure AD) to authorize requests to Event Hubs resources. With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, or an application service principal.

- [Understand Azure RBAC and available roles for Azure Event Hubs](authorize-access-azure-active-directory.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Azure Event Hubs supports the option of encrypting data at rest with either Microsoft-managed keys or customer-managed keys. This feature enables you to create, rotate, disable, and revoke access to the customer-managed keys that are used for encrypting Azure Event Hubs data at rest.

- [How to configure customer-managed keys for encrypting Azure Event Hubs](configure-customer-managed-key.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production instances of Azure Event Hubs and other critical or related resources.

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Azure Event Hubs namespaces) within your subscriptions. Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Event Hubs namespaces and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

In addition, use Azure Resource Graph to query/discover resources within the subscriptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Additional information is available at the referenced links.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Azure Event Hubs deployments. Use Azure Policy aliases in the **Microsoft.EventHub** namespace to create custom policies to audit or enforce configurations. You may also make use of built-in policy definitions for Azure Event Hubs such as:

- Diagnostic logs in Event Hub should be enabled

- Event Hub should use a virtual network service endpoint

Additional information is available at the referenced links.

- [Azure Built-in Policy for Event Hubs namespace](../governance/policy/samples/built-in-policies.md#event-hub)

- [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] effects to enforce secure settings across your Event Hubs-enabled resources. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

 
- [For more information about the Azure Policy Effects](../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.EventHub" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.EventHub" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] effects to automatically enforce configurations for your Azure Event Hubs deployments and related resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your event hubs, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure shared access signature management for your Azure Event Hubs deployments. Ensure Key Vault is configured with soft-delete enabled.

- [Authenticate a managed identity with Azure Active Directory (Azure AD) to access Event Hubs resources](./authenticate-managed-identity.md?tabs=latest)

- [Configure customer-managed keys for Event Hubs](configure-customer-managed-key.md)

- [How to integrate with Azure Managed Identities](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md)

- [How to create a Key Vault](../key-vault/secrets/quick-create-portal.md)

- [How to provide Key Vault authentication with a managed identity](../key-vault/general/assign-access-policy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your event hubs, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure Azure Event Hubs. Ensure Key Vault is configured with soft-delete enabled.

Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Azure Key Vault, without any credentials in your code.

- [Authenticate a managed identity with Azure AD to access Event Hubs Resources](./authenticate-managed-identity.md?tabs=latest)

- [Configure customer-managed keys for Event Hubs](configure-customer-managed-key.md)

- [How to configure Managed Identities](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)

- [How to integrate with Azure Managed Identities](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Pre-scan any content being uploaded to non-compute Azure resources, such as Azure Event Hubs, App Service, Data Lake Storage, Blob Storage, Azure Database for PostgreSQL, etc. Microsoft cannot access your data in these instances.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Cache for Redis), however it does not run on customer content.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Configure geo-disaster recovery for Azure Event Hubs. When entire Azure regions or datacenters (if no availability zones are used) experience downtime, it is critical for data processing to continue to operate in a different region or datacenter. As such, Geo-disaster recovery and Geo-replication are important features for any enterprise. Azure Event Hubs supports both geo-disaster recovery and geo-replication, at the namespace level. 

- [Understand geo-disaster recovery for Azure Event Hubs](./event-hubs-geo-dr.md#availability-zones)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Azure Event Hubs provides encryption of data at rest with Azure Storage Service Encryption (Azure SSE). Event Hubs relies on Azure Storage to store the data and by default, all the data that is stored with Azure Storage is encrypted using Microsoft-managed keys. If you use Azure Key Vault for storing customer-managed keys,  ensure regular automated backups of your Keys.

Ensure regular automated backups of your Key Vault Secrets with the following PowerShell command: Backup-AzKeyVaultSecret

- [How to configure customer-managed keys for encrypting Azure Event Hubs data at rest](configure-customer-managed-key.md)

- [How to backup Key Vault Secrets](/powershell/module/azurerm.keyvault/backup-azurekeyvaultsecret)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Test restoration of backed up customer-managed keys.

- [How to restore key vault keys in Azure](/powershell/module/az.keyvault/restore-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Enable soft delete in Key Vault to protect keys against accidental or malicious deletion. Azure Event Hubs requires customer-managed keys to have Soft Delete and Do Not Purge configured.

Configure soft delete for the Azure storage account that's used for capturing Event Hubs data. Note that this feature isn’t supported for Azure Data Lake Storage Gen 2 yet.

- [How to enable soft delete in Key Vault](../storage/blobs/soft-delete-blob-overview.md?tabs=azure-portal)

- [Set up a key vault with keys](configure-customer-managed-key.md)

- [Soft delete for Azure Storage blobs](/azure/storage/blobs/soft-delete-blob-overview)

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

**Guidance**: Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

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

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)
