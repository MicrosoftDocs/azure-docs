---
title: Azure security baseline for API Management
description: The API Management security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: api-management
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark, devx-track-azurepowershell

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for API Management

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to API Management. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to API Management. **Controls** not applicable to API Management have been excluded.

 
To see how API Management completely maps to the Azure
Security Benchmark, see the [full API Management security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Azure API Management can be deployed inside an Azure Virtual Network (Vnet), so it can access backend services within the network. The developer portal and API Management gateway, can be configured to be accessible either from the Internet (External) or only within the Vnet (Internal).

- External: the API Management gateway and developer portal are accessible from the public internet via an external load balancer. The gateway can access resources within the virtual network.

- Internal: the API Management gateway and developer portal are accessible only from within the virtual network via an internal load balancer. The gateway can access resources within the virtual network.

Inbound and outbound traffic into the subnet in which API Management is deployed can be controlled using Network Security Group.

- [How to use Azure API Management with virtual networks](api-management-using-with-vnet.md)

- [Using Azure API Management service with an internal virtual network](api-management-using-with-internal-vnet.md)

- [Integrate API Management in an internal VNET with Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Inbound and outbound traffic into the subnet in which API Management is deployed can be controlled using Network Security groups (NSGs). Deploy an NSG to your API Management subnet and enable NSG flow logs and send logs into an Azure Storage account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

Caution: When configuring an NSG on the API Management subnet, there are a set of ports that are required to be open. If any of these ports are unavailable, API Management may not operate properly and may become inaccessible.

- [Understand NSG configurations for Azure API Management](./api-management-using-with-vnet.md#-common-network-configuration-issues)

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

**Guidance**: To protect critical Web/HTTP APIs configure API Management within a Virtual Network (Vnet) in internal mode and configure an Azure Application Gateway. Application Gateway is a PaaS service. It acts as a reverse-proxy and provides L7 load balancing, routing, web application firewall (WAF), and other services.

Combining API Management provisioned in an internal Vnet with the Application Gateway frontend enables the following scenarios:
- Use a single API Management resource for exposing all APIs to both internal consumers and external consumers.
- Use a single API Management resource for exposing a subset of APIs to external consumers.
- Provide a way of switching access to API Management from the public Internet on and off.

Note: This feature is available in the Premium and Developer tiers of API Management.

- [How to integrate API Management in an internal VNET with Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md)

- [Understand Azure Application Gateway](../application-gateway/index.yml)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Configure API Management within a Virtual Network (Vnet) in internal mode and configure an Azure Application Gateway. Application Gateway is a PaaS service. It acts as a reverse-proxy and provides L7 load balancing, routing, web application firewall (WAF), and other services.

Combining API Management provisioned in an internal Vnet with the Application Gateway frontend enables the following scenarios:
- Use a single API Management resource for exposing all APIs to both internal consumers and external consumers.
- Use a single API Management resource for exposing a subset of APIs to external consumers.
- Provide a way of switching access to API Management from the public Internet on and off.

Note: This feature is available in the Premium and Developer tiers of API Management.

Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to integrate API Management in an internal VNET with Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md)

- [Understand Azure Application Gateway](../application-gateway/index.yml)

- [Understand Azure Security Center Integrated Threat Intelligence](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: Inbound and outbound traffic into the subnet in which API Management is deployed can be controlled using Network Security Groups (NSG). Deploy an NSG to your API Management subnet and enable NSG flow logs and send logs into an Azure Storage account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

Caution: When configuring an NSG on the API Management subnet, there are a set of ports that are required to be open. If any of these ports are unavailable, API Management may not operate properly and may become inaccessible.

- [Understand NSG configurations for Azure API Management](./api-management-using-with-vnet.md#-common-network-configuration-issues)

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Configure API Management within a Virtual Network (Vnet) in internal mode and configure an Azure Application Gateway. Application Gateway is a PaaS service. It acts as a reverse-proxy and provides L7 load balancing, routing, web application firewall (WAF), and other services. Application Gateway WAF provides protection from common security exploits and vulnerabilities and can run in the following two modes:
- Detection mode: Monitors and logs all threat alerts. You can turn on logging diagnostics for Application Gateway in the Diagnostics section. You must make sure that the WAF log is selected and turned on. Web application firewall doesn't block incoming requests when it's operating in Detection mode.
- Prevention mode: Blocks intrusions and attacks that the rules detect. The attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

Combining API Management provisioned in an internal Vnet with the Application Gateway frontend enables the following scenarios:
- Use a single API Management resource for exposing all APIs to both internal consumers and external consumers.
- Use a single API Management resource for exposing a subset of APIs to external consumers.
- Provide a way of switching access to API Management from the public Internet on and off.

Note: This feature is available in the Premium and Developer tiers of API Management.

- [How to integrate API Management in an internal VNET with Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md)

- [Understand Azure Application Gateway WAF](../web-application-firewall/ag/ag-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

**Guidance**: To manage traffic flowing to Web/HTTP APIs deploy API Management to a Virtual Network (Vnet) associated with App Service Environment in external or internal mode.

In internal mode, configure an Azure Application Gateway in front of API Management. Application Gateway is a PaaS service. It acts as a reverse-proxy and provides L7 load balancing, routing, web application firewall (WAF), and other services. Application Gateway WAF provides protection from common security exploits and vulnerabilities.

Combining API Management provisioned in an internal Vnet with the Application Gateway frontend enables the following scenarios:
- Use a single API Management resource for exposing all APIs to both internal consumers and external consumers.
- Use a single API Management resource for exposing a subset of APIs to external consumers.
- Provide a way of switching access to API Management from the public Internet on and off.

Note: This feature is available in the Premium and Developer tiers of API Management.

- [How to expose private APIs to external consumers](/azure/architecture/example-scenario/apps/publish-internal-apis-externally)

- [How to use API Management within a Vnet](api-management-using-with-vnet.md)

- [Azure Web Application Firewall on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md)

- [Understand Azure Application Gateway](../application-gateway/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network (Vnet) Service Tags to define network access controls on Network Security Groups (NSGs) used on your API Management subnets. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Caution: When configuring an NSG on the API Management subnet, there are a set of ports that are required to be open. If any of these ports are unavailable, API Management may not operate properly and may become inaccessible.

- [Understanding and using Service Tags](../virtual-network/service-tags-overview.md)

- [Ports required for API Management](./api-management-using-with-vnet.md#-common-network-configuration-issues)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network settings related to your Azure API Management deployments. Use Azure Policy aliases in the "Microsoft.ApiManagement" and "Microsoft.Network" namespaces to create custom policies to audit or enforce network configuration of your Azure API Management deployments and related resources.

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, Azure role-based access control (Azure RBAC), and policies in a single blueprint definition. You can easily apply the blueprint to new subscriptions, environments, and fine-tune control and management through versioning.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use Tags for Network Security groups (NSGs) and other resources related to network security and traffic flow. For individual NSG rules, you may use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

- [How to create a Virtual Network](../virtual-network/quick-create-portal.md)

- [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes to network resources associated with your Azure API Management deployments. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Within the Azure Monitor, use Log Analytics workspace(s) to query and perform analytics, send logs to Azure Storage for long-term/archival storage or offline analysis, or export logs to other analytics solution on Azure and elsewhere using Azure Event Hubs. Azure API Management outputs logs and metrics to Azure Monitor by default. Verbosity of the logging can be configured on a service-wide and per-API basis.

In addition to Azure Monitor, Azure API Management can be integrated with one or several Azure Application Insights services. Logging settings for Application Insights can be configured on either per-service or per-API basis.

Optionally, enable, and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM).

- [How to configure diagnostic settings](../azure-monitor/essentials/diagnostic-settings.md#create-in-azure-portal)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

- [How to create custom logging and analytics pipeline](api-management-howto-log-event-hubs.md)

- [How to integrate with Azure Application Insights](api-management-howto-app-insights.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send activity logs to a Log Analytics workspace for reporting and analysis, to Azure Storage for long-term safekeeping, to Azure Event Hubs for export in other analytics solutions on Azure and elsewhere. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure API Management service.

For data plane audit logging, diagnostic logs provide rich information about operations and errors that are important for auditing as well as troubleshooting purposes. Diagnostics logs differ from activity logs. Activity logs provide insights into the operations that were performed on your Azure resources. Diagnostics logs provide insight into operations that your resource performed.

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [How to enable Diagnostic Settings for Azure API Management](./api-management-howto-use-azure-monitor.md#resource-logs)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, set your Log Analytics Workspace retention period according to your organization's compliance regulations. Use Azure Storage accounts for long-term/archival storage.

- [How to set log retention parameters for Log Analytics Workspaces](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

- [How to archive logs to an Azure Storage account](../azure-monitor/essentials/resource-logs.md#send-to-azure-storage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Azure API Management continuously emits logs and metrics to Azure Monitor, giving you a near real-time visibility into the state and health of your APIs. With Azure Monitor and Log Analytics workspace(s), you can review, query, visualize, route, archive, configure alerts, and take actions on metrics and logs coming from API Management and related resources. Analyze and monitor logs for anomalous behaviors and regularly review results.

Optionally, integrate API Management with Azure Application Insights and use it as primary or secondary monitoring, tracing, reporting, and alerting tool.

- [How to monitor and review logs for Azure API Management](./api-management-howto-use-azure-monitor.md)

- [How to perform custom queries in Azure Monitor](../azure-monitor/logs/get-started-queries.md)

- [Understand Log Analytics Workspace](../azure-monitor/logs/log-analytics-tutorial.md)

- [How to integrate with Azure Application Insights](api-management-howto-app-insights.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Enable Azure Activity Log diagnostic settings as well as the diagnostic settings for your Azure API Management instances and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data. You can create alerts based on your Log Analytics workspace queries.

Create metric alerts to let you know when something unexpected is happening. For example, get notifications when your Azure API Management instance has been exceeding its expected peak capacity over a certain period of time or if there has been a certain number of unauthorized gateway requests or errors over a predefined period of time.

Optionally, integrate API Management with Azure Application Insights and use it as primary or secondary monitoring, tracing, reporting, and alerting tool.

Optionally, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

- [How to enable diagnostic settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [How to enable diagnostic settings for Azure API Management](./api-management-howto-use-azure-monitor.md#resource-logs)

- [How to configure an alert rule for Azure API Management](./api-management-howto-use-azure-monitor.md#set-up-an-alert-rule)

- [How to view capacity metrics of an Azure API management instance](api-management-capacity.md)

- [How to integrate with Azure Application Insights](api-management-howto-app-insights.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Maintain an inventory of accounts that have administrative access to the Azure API Management control plane (Azure portal).

Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and are queryable. API Management relies on these roles and Role-Based Access Control to enable fine-grained access management for API Management services and entities.

Additionally, API Management contains a built-in Administrators group in the API Management's user system. Groups in API Management control visibility of APIs in the developer portal and the members of the Administrators group can see all APIs.

Follow recommendations from Azure Security Center for the management and maintenance of administrative accounts.

- [How to use Role-Based Access Control in Azure API Management](api-management-role-based-access-control.md)

- [How to get list of users under an Azure API Management Instance](/powershell/module/az.apimanagement/get-azapimanagementuser)

- [How to get a list of users assigned to a directory role in Azure AD with PowerShell](/powershell/module/az.resources/get-azroleassignment)

- [How to get a directory role definition in Azure AD with PowerShell](/powershell/module/az.resources/get-azroledefinition)

- [Understand identity and access recommendations from Azure Security Center](../security-center/recommendations-reference.md#identityandaccess-recommendations)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Azure API Management does not have the concept of default passwords/key.

Azure API Management subscriptions, which are one means of securing access to APIs, do however come with a pair of generated subscription keys. Customers may regenerate these subscription keys at any time.

- [Understanding Azure API Management Subscriptions](api-management-subscriptions.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:
- There should be more than one owner assigned to your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription

- [How to use Azure Security Center to monitor identity and access (Preview)](../security-center/security-center-identity-access.md)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Azure API Management can be configured to leverage Azure Active Directory (Azure AD) as an identity provider for authenticating users on the Developer Portal in order to benefit from the SSO capabilities offered by Azure AD. Once configured, new Developer Portal users can choose to follow the out-of-the-box sign-up process by first authenticating through Azure AD and then completing the sign-up process on the portal once authenticated.

- [Authorize developer accounts by using Azure AD in Azure API Management](api-management-howto-aad.md)

Alternatively, the sign-in/sign-up process can be further customized through delegation. Delegation allows you to use your existing website for handling developer sign in/sign up and subscription to products, as opposed to using the built-in functionality in the developer portal. It enables your website to own the user data and perform the validation of these steps in a custom way.

- [How to delegate user registration and product subscription](api-management-howto-setup-delegation.md)

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

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Whenever possible, use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

Configure your Azure API Management Developer Portal to authenticate developer accounts by using Azure AD.

Configure your Azure API Management instance to protect your APIs by using the OAuth 2.0 protocol with Azure AD.

- [How to authorize developer accounts by using Azure AD in Azure API Management](api-management-howto-aad.md)

- [How to protect an API by using OAuth 2.0 with Azure AD and API Management](api-management-howto-protect-backend-with-aad.md)

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. Customers may utilize Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to ensure that only the right users continue to have appropriate access.

Customers can maintain inventory of API Management user accounts and reconcile access as needed. In API Management, developers are the consumers of the APIs that exposed with API Management. By default, newly created developer accounts are Active, and associated with the Developers group. Developer accounts that are in an active state can be used to access all of the APIs for which they have subscriptions.

Administrators can create custom groups or leverage external groups in associated Azure AD tenants. Custom and external groups can be used alongside system groups in giving developers visibility and access to API products.

- [How to manage user accounts in Azure API Management](api-management-howto-create-or-invite-developers.md)

- [How to get list of API Management users](/powershell/module/az.apimanagement/get-azapimanagementuser)

- [How to create and use groups to manage developer accounts in Azure API Management](api-management-howto-create-groups.md)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Configure your Azure API Management instance to authenticate developer accounts by using Azure Active Directory (Azure AD) as an identity provider in Azure API Management.

Configure your Azure API Management instance to protect your APIs by using the OAuth 2.0 protocol with Azure AD.

Configure JWT validation policy to incoming API requests to help enforce the existence and validity of a valid token.

Create diagnostic settings for Azure AD user accounts and send the audit logs and sign-in logs to a Log Analytics workspace. Configure desired alerts within Log Analytics. In addition, you may onboard the Log Analytics workspace to Azure Sentinel or a third-party SIEM.

Configure advanced monitoring with API Management by using the `log-to-eventhub` policy, capture any additional context information required for security analysis, and send to Azure Sentinel or third-party SIEM.

- [How to authorize developer accounts by using Azure AD in Azure API Management](api-management-howto-aad.md)

- [How to protect an API by using OAuth 2.0 with Azure AD and API Management](api-management-howto-protect-backend-with-aad.md)

- [API Management access restriction policies](api-management-access-restriction-policies.md)

- [How to integrate Azure AD Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

- [Advanced monitoring of APIs](api-management-log-to-eventhub-sample.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: For account login behavior deviation on the control plane (the Azure portal), use Azure Active Directory (Azure AD) Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not currently available; Customer Lockbox is not currently supported for Azure API Management.

- [List of Customer Lockbox-supported services](../security/fundamentals/customer-lockbox-overview.md#supported-services-and-scenarios-in-general-availability)

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

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Azure API Management instances should be separated by virtual network (VNet)/subnet and tagged appropriately.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [How to use Azure API Management with virtual networks](api-management-using-with-vnet.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Not currently available; data identification, classification, and loss prevention features are not currently available for Azure API Management.

Microsoft manages the underlying infrastructure for Azure API Management and has implemented strict controls to prevent the loss or exposure of customer data.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Management plane calls are made through Azure Resource Manager over TLS. A valid JSON web token (JWT) is required. Data plane calls can be secured with TLS and one of supported authentication mechanisms (for example, client certificate or JWT).

- [Understand data protection in Azure API Management](#data-protection)

- [Manage TLS settings in Azure API Management](api-management-howto-manage-protocols-ciphers.md)

- [Protect APIs in Azure API Management with Azure Active Directory (Azure AD)](api-management-howto-protect-backend-with-aad.md)

- [Protect APIs in Azure API Management with Azure AD B2C](howto-protect-backend-frontend-azure-ad-b2c.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Not yet available; data identification, classification, and loss prevention features are not yet available for Azure API Management. Tag Azure API Management services that may be processing sensitive information as such and implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to control access to resources 

**Guidance**: Use Azure role-based access control (Azure RBAC) for controlling access to Azure API Management. Azure API Management relies on Azure role-based access control to enable fine-grained access management for API Management services and entities (for example, APIs and policies).

- [How to use Azure role-based access control in Azure API Management](api-management-role-based-access-control.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft manages the underlying infrastructure for Azure API Management and has implemented strict controls to prevent the loss or exposure of customer data.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production Azure Functions apps as well as other critical or related resources.

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

- [How to use Azure Monitor and Azure Activity Log in Azure API Management](api-management-howto-use-azure-monitor.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Not currently available; vulnerability assessment in Azure Security Center is not currently available for Azure API Management.

Underlying platform scanned and patched by Microsoft. Review security controls available to reduce service configuration related vulnerabilities.

- [Understanding security controls available to Azure API Management]()

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Not currently available; vulnerability assessment in Azure Security Center is not currently available for Azure API Management.

Underlying platform scanned and patched by Microsoft. Customer to review security controls available to them to reduce service configuration related vulnerabilities.


**Responsibility**: Customer

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

- [How to create and utilize Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

In addition, use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

Use Azure Resource Graph to query/discover resources within their subscription(s). Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

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

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

- [Role-based access control in Azure API Management](api-management-role-based-access-control.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Azure API Management service with Azure Policy. Use Azure Policy aliases in the "Microsoft.ApiManagement" namespace to create custom policies to audit or enforce the configuration of your Azure API Management services.

- [How to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias?preserve-view=true&view=azps-4.8.0)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Define and implement standard security configurations for your Azure API Management services with Azure Policy. Use Azure Policy aliases in the "Microsoft.ApiManagement" namespace to create custom policies to audit or enforce the configuration of Azure API Management instances. Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure policy definitions, use Azure DevOps or Azure Repos to securely store and manage your Azure API Management service configuration.

- [How to store files in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [Azure Repos Documentation](/azure/devops/repos/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Define and implement standard security configurations for your Azure API Management services with Azure Policy. Use Azure Policy aliases in the "Microsoft.ApiManagement" namespace to create custom policies to audit or enforce the configuration of Azure API Management instances. Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use the Azure API Management DevOps Resource Kit to perform configuration management for Azure API Management.

In addition, define and implement standard security configurations for your Azure API Management services with Azure Policy. Use Azure Policy aliases in the "Microsoft.ApiManagement" namespace to create custom policies to audit or enforce the configuration of Azure API Management instances. Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Service Identity generated by Azure Active Directory (Azure AD) to allow your API Management instance to easily and securely access other Azure AD-protected resources, such as Azure Key Vault.

- [How to create a managed identity for an API Management instance](api-management-howto-use-managed-service-identity.md)

- [Policy to authenticate with managed identity](./api-management-authentication-policies.md#ManagedIdentity)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally-managed anti-malware software

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure API Management), however it does not run on customer content.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure API Management), however it does not run on customer content.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure API Management), however it does not run on customer content.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: By publishing and managing your APIs via Azure API Management, you're taking advantage of fault tolerance and infrastructure capabilities that you'd otherwise design, implement, and manage manually. API Management supports multi-region deployment which makes the data plane impervious to regional failures without adding any operational overhead.

The service backup and restore features of API Management provide the necessary building blocks for implementing a disaster recovery strategy. Backup and restore operations can be performed manually or automated.

- [How to deploy API Management data plane to multiple regions](api-management-howto-deploy-multi-region.md)

- [How to implement disaster recovery using service backup and restore in Azure API Management](./api-management-howto-disaster-recovery-backup-restore.md#calling-the-backup-and-restore-operations)

- [How to call the API Management backup operation](/rest/api/apimanagement/2019-12-01/apimanagementservice/backup)

- [How to call the API Management restore operation](/rest/api/apimanagement/2019-12-01/apimanagementservice/restore)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Backup and restore operations provided by Azure API Management perform full system backup and restore.

Managed identities can be used to obtain certificates from Azure Key Vault for API Management custom domain names. Backup any certificates being stored within Azure Key Vault.

- [How to implement disaster recovery using service backup and restore in Azure API Management](./api-management-howto-disaster-recovery-backup-restore.md#calling-the-backup-and-restore-operations)

- [How to backup Azure Key Vault certificates](/powershell/module/az.keyvault/backup-azkeyvaultcertificate?preserve-view=true&view=azps-4.8.0)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Validate backups by performing a test restore of the service and certificates from backups.

- [How to call the API Management restore operation](/rest/api/apimanagement/2019-12-01/apimanagementservice/restore)

- [How to restore Azure Key Vault certificates](/powershell/module/az.keyvault/restore-azkeyvaultcertificate)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Azure API Management writes backups to customer-owned Azure Storage accounts. Follow Azure Storage security recommendations to protect your backup.

- [How to implement disaster recovery using service backup and restore in Azure API Management](./api-management-howto-disaster-recovery-backup-restore.md#calling-the-backup-and-restore-operations)

- [Security recommendation for blob storage](../storage/blobs/security-recommendations.md)

Enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.

- [How to enable Soft-Delete in Key Vault](../storage/blobs/soft-delete-blob-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

- [Leverage NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data. It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

- [NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Utilize the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Please follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies:
https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1.

- [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft managed cloud infrastructure, services and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)
