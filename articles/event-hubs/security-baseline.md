---
title: Azure Security Baseline for Event Hubs
description: Azure Security Baseline for Event Hubs
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 03/25/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure Security Baseline for Event Hubs

The Azure Security Baseline for Event Hubs contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network Security

*For more information, see [Security Control: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

**Guidance**: The integration of event hubs with virtual network service endpoints enables secure access to messaging capabilities from workloads such as virtual machines that are bound to virtual networks, with the network traffic path being secured on both ends.

Once bound to at least one virtual network subnet service endpoint, the respective Event Hubs namespace no longer accepts traffic from anywhere but authorized subnets in virtual networks. From the virtual network perspective, binding your Event Hubs namespace to a service endpoint configures an isolated networking tunnel from the virtual network subnet to the messaging service. 

You can also create a private endpoint, which is a network interface that connects you privately and securely to Azure Event Hubs service by using the Azure Private Link service. The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed. 

You can also secure your Azure Event Hubs namespace by using firewalls. Azure Event Hubs supports IP-based access controls for inbound firewall support. You can set firewall rules by using the Azure portal, Azure Resource Manager templates, or through the Azure CLI or Azure PowerShell.

How to use virtual network service endpoints with Azure Event Hubs: https://docs.microsoft.com/azure/event-hubs/event-hubs-service-endpoints

For more information, see Integrate Azure Event Hubs with Azure Private Link: https://docs.microsoft.com/azure/event-hubs/private-link-service.

Enable Virtual Networks Integration and Firewalls on Event Hubs namespace: https://docs.microsoft.com/azure/event-hubs/event-hubs-tutorial-virtual-networks-firewalls

How to configure IP firewall rules for Azure Event Hubs namespaces: https://docs.microsoft.com/azure/event-hubs/event-hubs-ip-filtering

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure your Event Hubs resources in Azure. If using Azure virtual machines to access your event hubs, enable network security group (NSG) flow logs and send logs into a storage account for traffic audit.

How to Enable NSG Flow Logs: https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

Understanding Network Security provided by Azure Security Center:
 https://docs.microsoft.com/azure/security-center/security-center-network-recommendations

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Enable DDoS Protection Standard on the virtual networks associated with your event hubs to guard against distributed denial-of-service (DDoS) attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.​

How to configure DDoS protection:​ [https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection](/azure/virtual-network/manage-ddos-protection)

For more information about the Azure Security Center Integrated Threat Intelligence: https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

**Guidance**: If using Azure virtual machines to access your event hubs, enable network security group (NSG) flow logs and send logs into a storage account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

If required for investigating anomalous activity, enable Network Watcher packet capture.

How to Enable NSG Flow Logs: https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to Enable and use Traffic Analytics: https://docs.microsoft.com/azure/network-watcher/traffic-analytics

How to enable Network Watcher: https://docs.microsoft.com/azure/network-watcher/network-watcher-create

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: If using Azure virtual machines to access your event hubs, select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities. If intrusion detection and/or prevention based on payload inspection is not required for your organization, you may use Azure Event Hubs' built-in firewall feature. You can limit access to your Event Hubs namespace for a limited range of IP addresses, or a specific IP address by using Firewall rules.

Azure Marketplace:

https://azuremarketplace.microsoft.com/marketplace/?term=Firewall

How to add a firewall rule in Event Hubs for a specified IP address:

 https://docs.microsoft.com/azure/event-hubs/event-hubs-ip-filtering

**Azure Security Center monitoring**: Not yet available

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Not applicable, this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Event Hubs namespaces with Azure Policy. Use Azure Policy aliases in the "Microsoft.EventHub" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Event Hubs namespaces. You may also make use of built-in policy definitions related to Azure Event Hubs, such as:

​- Event Hub should use a virtual network service endpoint.​

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Azure Built-in Policy for Event Hubs namespace:  https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#event-hub

​

Azure Policy samples for networking:​ https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#network

​

How to create an Azure Blueprint:​ https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for virtual networks and other resources related to network security and traffic flow that are associated with your event hubs.

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to Azure Event Hubs. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

How to view and retrieve Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view

How to create alerts in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Not applicable; Microsoft maintains the time source used for Azure resources, such as Azure Event Hubs, for timestamps in the logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: Within Azure Monitor, configure logs related to event hubs within the Activity Log and Event Hub diagnostic settings to send logs into a Log Analytics workspace to be queried or into a storage account for long-term archival storage.

How to configure Diagnostic Settings for Azure Event Hubs: https://docs.microsoft.com/azure/event-hubs/event-hubs-diagnostic-logs

Understanding Azure Activity Log: https://docs.microsoft.com/azure/azure-monitor/platform/platform-logs-overview

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Diagnostic settings for your Azure Event Hubs namespace. There are three categories of Diagnostic settings for Azure Event Hubs: Archive Logs, Operational Logs, and AutoScale Logs. Enable Operational Logs to capture information about what is happening during Event Hubs operations, specifically, the operation type, including event hub creation, resources used, and the status of the operation.

Additionally, you may enable Azure Activity log diagnostic settings and send them to an Azure Storage Account, event hub, or a Log Analytics workspace. Activity logs provide insight into the operations that were performed on your Azure Event Hubs and other resources. Using activity logs, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) taken on your Azure Event Hubs namespaces.

How to enable Diagnostic Settings for Azure Event Hubs: https://docs.microsoft.com/azure/event-hubs/event-hubs-diagnostic-logs

How to enable Diagnostic Settings for Azure Activity Log: https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, set your Log Analytics workspace retention period according to your organization's compliance regulations to capture and review event hub-related incidents.

How to set log retention parameters for Log Analytics workspaces: https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results related to your event hubs. Use Azure Monitor's Log Analytics to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM.
 

For more information about the Log Analytics workspace: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal

How to perform custom queries in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

**Guidance**: Within Azure Monitor, configure logs related to Azure Event Hubs within the Activity Log, and Event Hubs diagnostic settings to send logs into a Log Analytics workspace to be queried or into a storage account for long-term archival storage. Use Log Analytics workspace to create alerts for anomalous activity found in security logs and events.

Alternatively, you may enable and on-board data to Azure Sentinel. 

Understand the Azure Activity Log: https://docs.microsoft.com/azure/azure-monitor/platform/platform-logs-overview

How to configure Diagnostic Settings for Azure Event Hubs: https://docs.microsoft.com/azure/event-hubs/event-hubs-diagnostic-logs

How to alert on Log Analytics workspace log data: https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Not yet available

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Not applicable; Event Hub does not process anti-malware logging.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; Event Hubs does not process or produce DNS related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and Access Control

*For more information, see [Security Control: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups. 

How to get a directory role in Azure AD with PowerShell: https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0

How to get members of a directory role in Azure AD with PowerShell: https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: Control plane access to Event Hubs is controlled through Azure Active Directory (AD). Azure AD does not have the concept of default passwords.

Data plane access to Event Hubs is controlled through Azure AD with Managed Identities or App registrations as well as shared access signatures. Shared access signatures are used by the clients connecting to your event hubs and can be regenerated at any time.

Understand shared access signatures for Event Hubs: https://docs.microsoft.com/azure/event-hubs/authenticate-shared-access-signature

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:

- There should be more than one owner assigned to your subscription

- Deprecated accounts with owner permissions should be removed from your subscription

- External accounts with owner permissions should be removed from your subscription

How to use Azure Security Center to monitor identity and access (Preview): https://docs.microsoft.com/azure/security-center/security-center-identity-access

How to use Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Microsoft Azure provides integrated access control management for resources and applications based on Azure Active Directory (AD). A key advantage of using Azure AD with Azure Event Hubs is that you don't need to store your credentials in the code anymore. Instead, you can request an OAuth 2.0 access token from the Microsoft Identity platform. The resource name to request a token is https:\//eventhubs.azure.net/. Azure AD authenticates the security principal (a user, group, or service principal) running the application. If the authentication succeeds, Azure AD returns an access token to the application, and the application can then use the access token to authorize request to Azure Event Hubs resources.

How to authenticate an application with Azure AD to access Event Hubs resources: https://docs.microsoft.com/azure/event-hubs/authenticate-application

Understanding SSO with Azure AD: https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory Multi-Factor Authentication (MFA) and follow Azure Security Center Identity and access management recommendations to help protect your Event Hub-enabled resources.

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

How to monitor identity and access within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use privileged access workstations (PAW) with Multi-Factor Authentication (MFA) configured to log into and configure Event Hub-enabled resources.

Learn about Privileged Access Workstations: https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

**Guidance**: Use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure AD risk detections to view alerts and reports on risky user behavior. For additional logging, send Azure Security Center risk detection alerts into Azure Monitor and configure custom alerting/notifications using action groups.​

​How to deploy Privileged Identity Management (PIM):​ https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan

​Understand Azure AD risk detections:​ https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events

How to configure action groups for custom alerting and notification:​ https://docs.microsoft.com/azure/azure-monitor/platform/action-groups

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.​

​

How to configure Named Locations in Azure: https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system for Azure resources such as Event Hubs. This allows for role-based access control (RBAC) to administrative sensitive resources.

 How to create and configure an Azure AD instance: https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant

To learn about how Azure Event Hubs integrates with Azure Active Directory (AAD), see Authorize access to Event Hubs resources using Azure Active Directory: https://docs.microsoft.com/azure/event-hubs/authorize-access-azure-active-directory

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

In additional, regularly rotate your Event Hubs' shared access signatures.

Understand Azure AD reporting: https://docs.microsoft.com/azure/active-directory/reports-monitoring/

How to use Azure Identity Access Reviews: https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview

Understanding shared access signatures for Event Hubs: https://docs.microsoft.com/azure/event-hubs/authenticate-shared-access-signature

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

**Guidance**: You have access to Azure Active Directory (AD) sign-in activity, audit and risk event log sources, which allow you to integrate with any SIEM/Monitoring tool.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired log alerts within Log Analytics.

How to integrate Azure Activity Logs into Azure Monitor: https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

Authorize access to Event Hubs resources using Azure Active Directory: https://docs.microsoft.com/azure/event-hubs/authorize-access-azure-active-directory

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure Active Directory's Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to your Event Hubs-enabled resources. You should enable automated responses through Azure Sentinel to implement your organization's security responses.

How to view Azure AD risky sign-ins: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins

How to configure and enable Identity Protection risk policies: https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Currently not available; Customer Lockbox is not yet supported for Event Hubs.

List of Customer Lockbox-supported services: https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Currently not available

## Data Protection

*For more information, see [Security Control: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags on resources related to your Event Hubs to assist in tracking Azure resources that store or process sensitive information.

How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Event Hubs namespaces should be separated by virtual network with service endpoints enabled and tagged appropriately.

You may also secure your Azure Event Hubs namespace by using firewalls. Azure Event Hubs supports IP-based access controls for inbound firewall support. You can set firewall rules by using the Azure portal, Azure Resource Manager templates, or through the Azure CLI or Azure PowerShell.

How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create

Configure IP firewall rules for Azure Event Hubs namespaces: https://docs.microsoft.com/azure/event-hubs/event-hubs-ip-filtering

How to create and utilize tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to create a Virtual Network: https://docs.microsoft.com/azure/virtual-network/quick-create-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: When using virtual machines to access your event hubs, make use of virtual networks, service endpoints, Event Hubs firewall, network security groups, and service tags to mitigate the possibility of data exfiltration.

Microsoft manages the underlying infrastructure for Azure Event Hubs and has implemented strict controls to prevent the loss or exposure of customer data.

Configure IP firewall rules for Azure Event Hubs namespaces: https://docs.microsoft.com/azure/event-hubs/event-hubs-ip-filtering

Understand Virtual Network Service Endpoints with Azure Event Hubs: https://docs.microsoft.com/azure/event-hubs/event-hubs-service-endpoints

Integrate Azure Event Hubs with Azure Private Link: https://docs.microsoft.com/azure/event-hubs/private-link-service

Understand Network Security Groups and Service Tags: https://docs.microsoft.com/azure/virtual-network/security-overview

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Azure Event Hubs enforces TLS-encrypted communications by default. TLS versions 1.0, 1.1 and 1.2 are currently supported. However, TLS 1.0 and 1.1 are on a path to deprecation industry-wide, so use TLS 1.2 if at all possible.

To understand security features of Event Hubs, see Network security:  https://docs.microsoft.com/azure/event-hubs/network-security

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Event Hubs. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Azure Event Hubs supports using Azure Active Directory (AD) to authorize requests to Event Hubs resources. With Azure AD, you can use role-based access control (RBAC) to grant permissions to a security principal, which may be a user, or an application service principal.

Understand Azure AD RBAC and available roles for Azure Event Hubs: https://docs.microsoft.com/azure/event-hubs/authorize-access-azure-active-directory

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this guideline is intended for compute resources.

Microsoft manages the underlying infrastructure for Event Hubs and has implemented strict controls to prevent the loss or exposure of customer data.

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

**Guidance**: Azure Event Hubs supports the option of encrypting data at rest with either Microsoft-managed keys or customer-managed keys. This feature enables you to create, rotate, disable, and revoke access to the customer-managed keys that are used for encrypting Azure Event Hubs data at rest.

How to configure customer-managed keys for encrypting Azure Event Hubs: https://docs.microsoft.com/azure/event-hubs/configure-customer-managed-key

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production instances of Azure Event Hubs and other critical or related resources.

How to create alerts for Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Vulnerability Management

*For more information, see [Security Control: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Event Hubs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Not applicable; Microsoft performs patch management on the underlying systems that support Event Hubs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.3: Deploy automated third-party software patch management solution

**Guidance**: Not applicable; benchmark is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Event Hubs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Event Hubs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

## Inventory and Asset Management

*For more information, see [Security Control: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Azure Event Hubs namespaces) within your subscription(s). Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

How to create queries with Azure Resource Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

How to view your Azure Subscriptions: https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

Understand Azure RBAC: https://docs.microsoft.com/azure/role-based-access-control/overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Event Hubs namespaces and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Maintain an inventory of approved Azure resources and software titles

**Guidance**: Not applicable; this recommendation is intended for compute resources and Azure as a whole.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

In addition, use Azure Resource Graph to query/discover resources within the subscription(s).

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Not applicable; this recommendation is intended for compute resources and Azure as a whole.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.8: Use only approved applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to deny a specific resource type with Azure Policy: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Implement approved application list

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: <div>Limit users' ability to interact with Azure Resource Manager via scripts</div>

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

How to configure Conditional Access to block access to Azure Resource Manager: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure Configuration

*For more information, see [Security Control: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Azure Event Hubs deployments. Use Azure Policy aliases in the "Microsoft.EventHub" namespace to create custom policies to audit or enforce  configurations. You may also make use of built-in policy definitions for Azure Event Hubs such as:

- Diagnostic logs in Event Hub should be enabled

- Event Hub should use a virtual network service endpoint

Azure Built-in Policy for Event Hubs namespace:​ https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#event-hub

How to view available Azure Policy aliases: https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Event Hubs-enabled resources. 

How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

 
For more information about the Azure Policy Effects:  https://docs.microsoft.com/azure/governance/policy/concepts/effects

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions for your Event Hubs or related resources, use Azure Repos to securely store and manage your code.

How to store code in Azure DevOps: https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

Azure Repos Documentation: https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy system configuration management tools

**Guidance**: Use Azure Policy aliases in the "Microsoft.EventHub" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure services

**Guidance**: Use Azure Policy aliases in the "Microsoft.EventHub" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure Event Hubs deployments and related resources.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your event hubs, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure shared access signature management for your Azure Event Hubs deployments. Ensure Key Vault soft-delete is enabled.

Authenticate a managed identity with Azure Active Directory to access Event Hubs resources: https://docs.microsoft.com/azure/event-hubs/authenticate-managed-identity?tabs=latest

Configure customer-managed keys for Event Hubs: https://docs.microsoft.com/azure/event-hubs/configure-customer-managed-key 

How to integrate with Azure Managed Identities: https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity

How to create a Key Vault: https://docs.microsoft.com/azure/key-vault/quick-create-portal

How to provide Key Vault authentication with a managed identity: https://docs.microsoft.com/azure/key-vault/managed-identity

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: For Azure virtual machines or web applications running on Azure App Service being used to access your  event hubs, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure Azure Event Hubs. Ensure Key Vault soft-delete is enabled.

Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Azure Key Vault, without any credentials in your code.

Authenticate a managed identity with Azure Active Directory to access Event Hubs Resources: https://docs.microsoft.com/azure/event-hubs/authenticate-managed-identity?tabs=latest 

Configure customer-managed keys for Event Hubs: https://docs.microsoft.com/azure/event-hubs/configure-customer-managed-key 

How to configure Managed Identities: https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm

How to integrate with Azure Managed Identities: https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

How to setup Credential Scanner: https://secdevtools.azurewebsites.net/helpcredscan.html

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware Defense

*For more information, see [Security Control: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Pre-scan any content being uploaded to non-compute Azure resources, such as Azure Event Hubs, App Service, Data Lake Storage, Blob Storage, Azure Database for PostgreSQL, etc. Microsoft cannot access your data in these instances.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Cache for Redis), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data Recovery

*For more information, see [Security Control: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

**Guidance**: Configure geo-disaster recovery for Azure Event Hubs. When entire Azure regions or datacenters (if no availability zones are used) experience downtime, it is critical for data processing to continue to operate in a different region or datacenter. As such, Geo-disaster recovery and Geo-replication are important features for any enterprise. Azure Event Hubs supports both geo-disaster recovery and geo-replication, at the namespace level. 

Understand geo-disaster recovery for Azure Event Hubs: https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr#availability-zones

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

**Guidance**: Azure Event Hubs provides encryption of data at rest with Azure Storage Service Encryption (Azure SSE). Event Hubs relies on Azure Storage to store the data and by default, all the data that is stored with Azure Storage is encrypted using Microsoft-managed keys. If you use Azure Key Vault for storing customer-managed keys,  ensure regular automated backups of your Keys.

Ensure regular automated backups of your Key Vault Secrets with the following PowerShell command: Backup-AzKeyVaultSecret

How to configure customer-managed keys for encrypting Azure Event Hubs data at rest: https://docs.microsoft.com/azure/event-hubs/configure-customer-managed-key

How to backup Key Vault Secrets: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultsecret

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

**Guidance**: Test restoration of backed up customer managed keys.

 

How to restore key vault keys in Azure: https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

**Guidance**: Enable soft-delete in Key Vault to protect keys against accidental or malicious deletion. Azure Event Hubs requires customer-managed keys to have Soft Delete and Do Not Purge configured.

Configure soft delete for Azure Storage account that's used for capturing Event Hubs data. Note that this feature isn't supported for Azure Data Lake Storage Gen 2 yet.

How to enable soft-delete in Key Vault: https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal

Set up a key vault with keys: https://docs.microsoft.com/azure/event-hubs/configure-customer-managed-key

Soft delete for Azure Storage blobs: https://docs.microsoft.com//azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident Response

*For more information, see [Security Control: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Ensure that there are written incident response plans that defines roles of personnel as well as phases of incident handling/management.

How to configure Workflow Automations within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test Security Response Procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved. 

How to set the Azure Security Center Security Contact: https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

How to configure continuous export: https://docs.microsoft.com/azure/security-center/continuous-export

How to stream alerts into Azure Sentinel: https://docs.microsoft.com/azure/sentinel/connect-azure-security-center

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

How to configure Workflow Automation and Logic Apps: https://docs.microsoft.com/azure/security-center/workflow-automation

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see [Security Control: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings within 60 days

**Guidance**: Please follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies:
https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1.
You can find more information on Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft managed cloud infrastructure, services and applications, here: https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure Security Baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
