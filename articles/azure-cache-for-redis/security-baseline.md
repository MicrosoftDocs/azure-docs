---
title: Azure security baseline for Azure Cache for Redis
description: The Azure Cache for Redis security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: cache
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark, devx-track-azurepowershell

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Cache for Redis

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to Azure Cache for Redis. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Azure Cache for Redis. **Controls** not applicable to Azure Cache for Redis have been excluded.

 
To see how Azure Cache for Redis completely maps to the Azure
Security Benchmark, see the [full Azure Cache for Redis
security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Deploy your Azure Cache for Redis instance within a virtual network (VNet). A VNet is a private network in the cloud. When an Azure Cache for Redis instance is configured with a VNet, it is not publicly addressable and can only be accessed from virtual machines and applications within the VNet.

You may also specify firewall rules with a start and end IP address range. When firewall rules are configured, only client connections from the specified IP address ranges can connect to the cache.

- [How to configure Virtual Network Support for a Premium Azure Cache for Redis](cache-how-to-premium-vnet.md)

- [How to configure Azure Cache for Redis firewall rules](./cache-configure.md#firewall)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: When Virtual Machines are deployed in the same virtual network as your Azure Cache for Redis instance, you can use network security groups (NSG) to reduce the risk of data exfiltration. Enable NSG flow logs and send logs into an Azure Storage Account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Azure Virtual Network (VNet) deployment provides enhanced security and isolation for your Azure Cache for Redis, as well as subnets, access control policies, and other features to further restrict access. When deployed in a VNet, Azure Cache for Redis is not publicly addressable and can only be accessed from virtual machines and applications within the VNet.

Enable DDoS Protection Standard on the VNets associated with your Azure Cache for Redis instances to guard against distributed denial-of-service (DDoS) attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to configure Virtual Network Support for a Premium Azure Cache for Redis](cache-how-to-premium-vnet.md)

- [Manage Azure DDoS Protection Standard using the Azure portal](../ddos-protection/manage-ddos-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: When virtual machines are deployed in the same virtual network as your Azure Cache for Redis instance, you can use network security groups (NSG) to reduce the risk of data exfiltration. Enable NSG flow logs and send logs into an Azure Storage Account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: When using Azure Cache for Redis with your web applications running on Azure App Service or compute instances, deploy all resources within an Azure Virtual Network (VNet) and secure with an Azure Web Application Firewall (WAF) on Web Application Gateway. Configure the WAF to run in "Prevention Mode". Prevention Mode blocks intrusions and attacks that the rules detect. The attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

Alternatively, you may select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection and/or anomaly detection capabilities.

- [Understand Azure WAF capabilities](../web-application-firewall/ag/ag-overview.md)

- [How to deploy Azure WAF](../web-application-firewall/ag/create-waf-policy-ag.md)

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use virtual network service tags to define network access controls on network security groups (NSG) or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

You may also use application security groups (ASG) to help simplify complex security configuration. ASGs enable you to configure network security as a natural extension of an application's structure, allowing you to group virtual machines and define network security policies based on those groups.

- [Virtual network service tags](../virtual-network/service-tags-overview.md)

- [Application Security Groups](../virtual-network/network-security-groups-overview.md#application-security-groups)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources related to your Azure Cache for Redis instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.Cache" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Cache for Redis instances. You may also make use of built-in policy definitions such as:
- Only secure connections to your Redis Cache should be enabled

- DDoS Protection Standard should be enabled

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, Azure role-based access control (Azure RBAC), and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network resources associated with your Azure Cache for Redis deployment in order to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use the Azure Activity log to monitor network resource configurations and detect changes for network resources related to your Azure Cache for Redis instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Activity logs provide insight into the operations that were performed on your Azure Cache for Redis instances at the control plane level. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure Cache for Redis instances.

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Activity logs provide insight into the operations that were performed on your Azure Cache for Redis instances at the control plane level. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure Cache for Redis instances.

While metrics are available by enabling Diagnostic Settings, audit logging at the data plane is not yet available for Azure Cache for Redis.

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: In Azure Monitor, set log retention period for Log Analytics workspaces associated with your Azure Cache for Redis instances according to your organization's compliance regulations.

Note that audit logging at the data plane is not yet available for Azure Cache for Redis.

- [How to set log retention parameters](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the Activity Log Data that may have been collected for Azure Cache for Redis.

Note that audit logging at the data plane is not yet available for Azure Cache for Redis.

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [How to collect and analyze Azure activity logs in Log Analytics workspace in Azure Monitor](../azure-monitor/essentials/activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: You can configure to receive alerts based on metrics and activity logs related to your Azure Cache for Redis instances. Azure Monitor allows you to configure an alert to send an email notification, call a webhook, or invoke an Azure Logic App.

While metrics are available by enabling Diagnostic Settings, audit logging at the data plane is not yet available for Azure Cache for Redis.

- [How to configure alerts for Azure Cache for Redis](./cache-how-to-monitor.md#alerts)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole?preserve-view=true&view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember?preserve-view=true&view=azureadps-2.0)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Control plane access to Azure Cache for Redis is controlled through Azure Active Directory (Azure AD). Azure AD does not have the concept of default passwords.

Data plane access to Azure Cache for Redis is controlled through access keys. These keys are used by the clients connecting to your cache and can be regenerated at any time.

It is not recommended that you build default passwords into your application. Instead, you can store your passwords in Azure Key Vault and then use Azure AD to retrieve them.

- [How to regenerate Azure Cache for Redis access keys](./cache-configure.md#settings)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:

- There should be more than one owner assigned to your subscription

- Deprecated accounts with owner permissions should be removed from your subscription

- External accounts with owner permissions should be removed from your subscription

For more information, see the following references:

- [How to use Azure Security Center to monitor identity and access (Preview)](../security-center/security-center-identity-access.md)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Azure Cache for Redis uses access keys to authenticate users and does not support single sign-on (SSO) at the data plane level. Access to the control plane for Azure Cache for Redis is available via REST API and supports SSO. To authenticate, set the Authorization header for your requests to a JSON Web Token that you obtain from Azure Active Directory (Azure AD).

- [Understand Azure Cache for Redis REST API](/rest/api/redis/)

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

**Guidance**: Use privileged access workstations (PAW) with multifactor authentication configured to log into and configure Azure resources. 

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

- [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Configure named locations in Azure Active Directory (Azure AD) Conditional Access to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

Azure AD authentication cannot be used for direct access to Azure Cache for Redis' data plane, however, Azure AD credentials may be used for administration at the control plane level (i.e. the Azure portal) to control Azure Cache for Redis access keys.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

- [Understand Azure AD reporting](../active-directory/reports-monitoring/index.yml)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: You have access to Azure Active Directory (Azure AD) sign-in activity, audit and risk event log sources, which allow you to integrate with Azure Sentinel or a third-party SIEM.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired log alerts within Log Analytics.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: For account login behavior deviation on the control plane, use Azure Active Directory (Azure AD) Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Azure Cache for Redis instances should be separated by virtual network/subnet and tagged appropriately. Optionally, use the Azure Cache for Redis firewall to define rules so that only client connections from specified IP address ranges can connect to the cache.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to deploy Azure Cache for Redis into a Vnet](cache-how-to-premium-vnet.md)

- [How to configure Azure Cache for Redis firewall rules](./cache-configure.md#firewall)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Not yet available; data identification, classification, and loss prevention features are not yet available for Azure Cache for Redis.

Microsoft manages the underlying infrastructure for Azure Cache for Redis and has implemented strict controls to prevent the loss or exposure of customer data.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Azure Cache for Redis requires TLS-encrypted communications by default. TLS versions 1.0, 1.1 and 1.2 are currently supported. However, TLS 1.0 and 1.1 are on a path to deprecation industry-wide, so use TLS 1.2 if at all possible. If your client library or tool doesn't support TLS, then enabling unencrypted connections can be done through the Azure portal or management APIs. In such cases where encrypted connections aren't possible, placing your cache and client application into a virtual network would be recommended.

- [Understand encryption in transit for Azure Cache for Redis](cache-best-practices.md)

- [Understand required ports used in Vnet cache scenarios](./cache-how-to-premium-vnet.md#outbound-port-requirements)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Cache**:

[!INCLUDE [Resource Policy for Microsoft.Cache 4.4](../../includes/policy/standards/asb/rp-controls/microsoft.cache-4-4.md)]

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Cache for Redis. Tag instances containing sensitive information as such and implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use Azure role-based access control (Azure RBAC) to control access to the Azure Cache for Redis control plane (i.e. Azure portal).

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Azure Cache for Redis stores customer data in memory, and while strongly protected by many controls implemented by Microsoft, memory is not encrypted by default. If required by your organization, encrypt content before storing in Azure Cache for Redis.

If using the Azure Cache for Redis feature "Redis Data Persistence", data is sent to an Azure Storage account that you own and manage. You can configure persistence from the "New Azure Cache for Redis" blade during cache creation and on the Resource menu for existing premium caches.

Data in Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption cannot be disabled. You can rely on Microsoft-managed keys for the encryption of your storage account, or you can manage encryption with your own keys.

- [How to configure persistence in Azure Cache for Redis](cache-how-to-premium-persistence.md)

- [Understand encryption for Azure Storage accounts](../storage/common/storage-service-encryption.md)

- [Understand Azure customer data protection](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production instances of Azure Cache for Redis and other critical or related resources.

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Follow recommendations from Azure Security Center on securing your Azure Cache for Redis instances and related resources.

Microsoft performs vulnerability management on the underlying systems that support Azure Cache for Redis.

- [Understand Azure Security Center recommendations](../security-center/recommendations-reference.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription?preserve-view=true&view=azps-4.8.0)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Cache for Redis instances and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

In addition, use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

For more information, see the following references:

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create management groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use resource tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types
- Allowed resource types

In addition, use Azure Resource Graph to query for and discover resources within the subscriptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

For more information, see the following references:

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

**Guidance**: Define and implement standard security configurations for your Azure Cache for Redis instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.Cache" namespace to create custom policies to audit or enforce the configuration of your Azure Cache for Redis instances. You may also make use of built-in policy definitions related to your Azure Cache for Redis instances, such as:

- Only secure connections to your Redis Cache should be enabled

For more information, see the following references:

- [How to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias?preserve-view=true&view=azps-4.8.0)

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

**Guidance**: If using custom Azure Policy definitions or Azure Resource Manager templates for your Azure Cache for Redis instances and related resources, use Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow?preserve-view=true&view=azure-devops)

- [Azure Repos Documentation](/azure/devops/repos/?preserve-view=true&view=azure-devops)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.Cache" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.Cache" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure Cache for Redis instances and related resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your Azure Cache for Redis instances, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure Azure Cache for Redis secret management. Ensure Key Vault soft delete is enabled.

- [How to integrate with Azure Managed Identities](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md)

- [How to create a Key Vault](../key-vault/general/quick-create-portal.md)

- [How to authenticate to Key Vault](../key-vault/general/assign-access-policy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your Azure Cache for Redis instances, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure Azure Cache for Redis secret management. Ensure Key Vault Soft Delete is enabled.

Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Azure Key Vault, without any credentials in your code.

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

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Cache for Redis), however it does not run on customer content.

Pre-scan any content being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, Azure Database for PostgreSQL, etc. Microsoft cannot access your data in these instances.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Enable Redis persistence. Redis persistence allows you to persist data stored in Redis. You can also take snapshots and back up the data, which you can load in case of a hardware failure. This is a huge advantage over Basic or Standard tier where all the data is stored in memory and there can be potential data loss in case of a failure where Cache nodes are down.

You may also use Azure Cache for Redis Export. Export allows you to export the data stored in Azure Cache for Redis to Redis compatible RDB file(s). You can use this feature to move data from one Azure Cache for Redis instance to another or to another Redis server. During the export process, a temporary file is created on the virtual machine that hosts the Azure Cache for Redis server instance, and the file is uploaded to the designated storage account. When the export operation completes with either a status of success or failure, the temporary file is deleted.

- [How to enable Redis persistence](cache-how-to-premium-persistence.md)

- [How to use Azure Cache for Redis Export](cache-how-to-import-export-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Enable Redis persistence. Redis persistence allows you to persist data stored in Redis. You can also take snapshots and back up the data, which you can load in case of a hardware failure. This is a huge advantage over Basic or Standard tier where all the data is stored in memory and there can be potential data loss in case of a failure where Cache nodes are down.

You may also use Azure Cache for Redis Export. Export allows you to export the data stored in Azure Cache for Redis to Redis compatible RDB file(s). You can use this feature to move data from one Azure Cache for Redis instance to another or to another Redis server. During the export process, a temporary file is created on the virtual machine that hosts the Azure Cache for Redis server instance, and the file is uploaded to the designated storage account. When the export operation completes with either a status of success or failure, the temporary file is deleted.

If using Azure Key Vault to store credentials for your Azure Cache for Redis instances, ensure regular automated backups of your keys.

- [How to enable Redis persistence](cache-how-to-premium-persistence.md)

- [How to use Azure Cache for Redis Export](cache-how-to-import-export-data.md)

- [How to backup Key Vault Keys](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Use Azure Cache for Redis Import. Import can be used to bring Redis-compatible RDB files from any Redis server running in any cloud or environment, including Redis running on Linux, Windows, or any cloud provider such as Amazon Web Services and others. Importing data is an easy way to create a cache with pre-populated data. During the import process, Azure Cache for Redis loads the RDB files from Azure storage into memory and then inserts the keys into the cache.

Periodically test data restoration of your Azure Key Vault secrets.

- [How to use Azure Cache for Redis Import](cache-how-to-import-export-data.md)

- [How to restore Key Vault Secrets](/powershell/module/az.keyvault/restore-azkeyvaultsecret?preserve-view=true&view=azps-4.8.0)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

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
